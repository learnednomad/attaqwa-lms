/**
 * API-Based Database Seeder
 * Seeds content via Strapi REST API while server is running
 *
 * USAGE:
 * 1. Start Strapi: npm run dev
 * 2. Create admin account at http://localhost:1337/admin
 * 3. Run this script: pnpm run seed:api
 */

import {
  fetchAllSurahs,
  groupByJuz,
  groupByTheme,
  getShortSurahs,
  QuranSurah
} from './fetch-quran';
import { fetchAllIbnKathir, TafseerEntry } from './fetch-tafseer';
import { generateAllCourses, CourseData } from './generate-courses';
import {
  generateChildrenLessons,
  generateBeginnerLessons,
  generateIntermediateLessons,
  generateAdvancedLessons,
  LessonData
} from './generate-lessons';
import { generateSurahQuiz, QuizData } from './generate-quizzes';

const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN || '';

/**
 * Main seeding function using REST API
 */
async function seedViaAPI() {
  console.log('🚀 Starting API-based database seeding...\n');
  console.log('⚠️  Make sure Strapi is running on http://localhost:1337\n');

  try {
    // Test connection
    console.log('🔗 Testing Strapi connection...');
    const healthCheck = await fetch(`${STRAPI_URL}/_health`);
    if (!healthCheck.ok) {
      throw new Error('Strapi is not running. Please start it with: npm run dev');
    }
    console.log('✅ Strapi is running\n');

    // Phase 1: Fetch all content
    console.log('📚 Phase 1: Fetching Islamic content...');
    const surahs = await fetchAllSurahs();
    console.log(`✅ Fetched ${surahs.length} Surahs\n`);

    console.log('📖 Fetching Tafseer data...');
    const ibnKathirData = await fetchAllIbnKathir();
    console.log(`✅ Fetched ${ibnKathirData.length} Ibn Kathir entries\n`);

    // Create lookup maps
    const ibnKathirMap = new Map(ibnKathirData.map(t => [t.surahNumber, t]));

    // Phase 2: Organize content
    console.log('📋 Phase 2: Organizing content...');
    const shortSurahs = getShortSurahs(surahs);
    const juzArray = groupByJuz(surahs);
    const themes = groupByTheme(surahs);
    console.log('✅ Content organized\n');

    // Phase 3: Create courses
    console.log('🎓 Phase 3: Creating courses...');
    const courseData = generateAllCourses();
    const createdCourses = await createCourses(courseData);
    console.log(`✅ Created ${createdCourses.length} courses\n`);

    // Phase 4: Create lessons for each course
    console.log('📝 Phase 4: Creating lessons (this will take a while)...\n');
    await createAllLessons(createdCourses, surahs, shortSurahs, juzArray, themes, ibnKathirMap);
    console.log('✅ All lessons created\n');

    // Phase 5: Summary
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Courses: ${createdCourses.length}`);
    console.log(`   Surahs processed: ${surahs.length}`);
    console.log(`   Tafseer entries: ${ibnKathirData.length}`);
    console.log('\n✨ Your LMS is now populated with Islamic content!');
    console.log('🔗 Visit http://localhost:1337/admin to manage content');

  } catch (error: any) {
    console.error('\n❌ Seeding failed:', error.message);
    console.error('\nMake sure:');
    console.error('  1. Strapi is running: npm run dev');
    console.error('  2. You have created an admin account');
    console.error('  3. Database is accessible');
    throw error;
  }
}

/**
 * Create courses via API
 */
async function createCourses(coursesData: CourseData[]): Promise<any[]> {
  const createdCourses: any[] = [];

  for (const course of coursesData) {
    try {
      const response = await fetch(`${STRAPI_URL}/api/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: course })
      });

      if (response.ok) {
        const result: any = await response.json();
        createdCourses.push(result.data);
        console.log(`✓ Created: ${course.title}`);
      } else {
        const error = await response.text();
        console.error(`✗ Failed: ${course.title} - ${error}`);
      }
    } catch (error) {
      console.error(`✗ Error creating ${course.title}:`, error);
    }
  }

  return createdCourses;
}

/**
 * Create all lessons for all courses
 */
async function createAllLessons(
  courses: any[],
  surahs: QuranSurah[],
  shortSurahs: QuranSurah[],
  juzArray: any[],
  themes: any,
  ibnKathirMap: Map<number, TafseerEntry>
) {
  for (const course of courses) {
    console.log(`\n📚 Creating lessons for: ${course.attributes.title}`);
    let lessons: LessonData[] = [];

    // Determine which lessons to generate based on course slug
    const slug = course.attributes.slug;

    if (slug.includes('first-quran') || slug.includes('kids')) {
      lessons = generateChildrenLessons(shortSurahs);
    } else if (slug.includes('beginner') && !slug.includes('tafseer')) {
      const ageGroup = determineAgeGroup(course.attributes.age_tier);
      lessons = generateBeginnerLessons(surahs, ageGroup);
    } else if (slug.includes('intermediate') || slug.includes('tafseer')) {
      const ageGroup = determineAgeGroup(course.attributes.age_tier);
      lessons = generateIntermediateLessons(juzArray, surahs, ibnKathirMap, ageGroup);
    } else if (slug.includes('advanced') || slug.includes('comparative')) {
      lessons = generateAdvancedLessons(themes, surahs, ibnKathirMap, new Map());
    } else if (slug.includes('sealed-nectar') || slug.includes('seerah')) {
      lessons = generateSeerahLessons(course);
    }

    // Create lessons for this course (limit to first 10 for testing)
    const lessonsToCreate = lessons.slice(0, 10); // TODO: Remove this limit for full seed
    await createLessonsForCourse(course, lessonsToCreate);
  }
}

/**
 * Create lessons for a specific course
 */
async function createLessonsForCourse(course: any, lessons: LessonData[]) {
  let created = 0;

  for (const lessonData of lessons) {
    try {
      const response = await fetch(`${STRAPI_URL}/api/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            ...lessonData,
            course: course.id
          }
        })
      });

      if (response.ok) {
        const result: any = await response.json();
        created++;

        // Create quiz for this lesson
        await createQuizForLesson(result.data, lessonData);

        if (created % 5 === 0) {
          console.log(`   Progress: ${created}/${lessons.length} lessons`);
        }
      }
    } catch (error) {
      console.error(`✗ Failed to create lesson: ${lessonData.title}`);
    }
  }

  console.log(`✓ Created ${created} lessons`);
}

/**
 * Create quiz for a lesson
 */
async function createQuizForLesson(lesson: any, lessonData: LessonData) {
  try {
    const quizData: any = {
      title: `Quiz: ${lessonData.title}`,
      slug: `quiz-${lessonData.slug}`,
      description: `Test your knowledge of ${lessonData.title}`,
      quiz_type: 'practice',
      time_limit_minutes: 20,
      passing_score: 70,
      max_attempts: 3,
      randomize_questions: true,
      show_correct_answers: true,
      questions: generateSampleQuestions(lessonData),
      total_points: 100,
      instructions: 'Answer all questions to test your understanding.',
      lesson: lesson.id
    };

    await fetch(`${STRAPI_URL}/api/quizzes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: quizData })
    });

  } catch (error) {
    // Silent fail for quizzes
  }
}

/**
 * Generate sample quiz questions
 */
function generateSampleQuestions(lessonData: LessonData): any[] {
  const questions = [];

  for (let i = 0; i < 10; i++) {
    questions.push({
      type: 'multiple_choice',
      question: `Question ${i + 1} about ${lessonData.title}`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correct_answer: 'Option A',
      explanation: 'This is explained in the lesson content.',
      points: 10
    });
  }

  return questions;
}

/**
 * Generate placeholder Seerah lessons
 */
function generateSeerahLessons(course: any): LessonData[] {
  const lessons: LessonData[] = [];
  const chapters = [
    'The Birth of Prophet Muhammad ﷺ',
    'Early Life in Mecca',
    'The First Revelation',
    'Early Muslims and Persecution',
    'Migration to Medina (Hijrah)',
    'The Battle of Badr',
    'The Battle of Uhud',
    'Conquest of Mecca',
    'The Farewell Pilgrimage',
    'The Prophet\'s Final Days'
  ];

  for (let i = 0; i < chapters.length; i++) {
    lessons.push({
      title: `Lesson ${i + 1}: ${chapters[i]}`,
      slug: `seerah-lesson-${i + 1}`,
      description: `Study the life of Prophet Muhammad ﷺ: ${chapters[i]}`,
      lesson_order: i + 1,
      lesson_type: 'reading',
      duration_minutes: 25,
      content: `<h1>${chapters[i]}</h1><p><em>Content from "The Sealed Nectar" will be added here.</em></p>`,
      video_url: null,
      interactive_content: null,
      learning_objectives: [
        `Understand the events of ${chapters[i]}`,
        'Learn lessons from the Prophet\'s life',
        'Apply Seerah wisdom to modern life'
      ],
      prerequisites: i === 0 ? null : 'Previous Seerah lessons',
      is_free: i < 5,
      is_preview: i < 2,
      publishedAt: new Date()
    });
  }

  return lessons;
}

/**
 * Determine age group from tier
 */
function determineAgeGroup(tier: string): 'youth' | 'adults' | 'seniors' {
  if (tier === 'youth') return 'youth';
  if (tier === 'seniors') return 'seniors';
  return 'adults';
}

// Run the seeding
seedViaAPI()
  .then(() => {
    console.log('\n✅ Seeding complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  });
