/**
 * Main Database Seeding Orchestrator
 * Fetches all content and populates Strapi database
 */

import { compileStrapi } from '@strapi/strapi';
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

let strapi: any;

/**
 * Main seeding function
 */
async function seedDatabase() {
  console.log('🚀 Starting database seeding...\n');

  try {
    // Initialize Strapi
    console.log('📦 Initializing Strapi...');
    const appContext: any = await compileStrapi();
    strapi = await appContext.start();
    console.log('✅ Strapi initialized\n');

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

    // Phase 3: Generate and seed courses
    console.log('🎓 Phase 3: Creating courses...');
    const courseData = generateAllCourses();
    const createdCourses = await seedCourses(courseData);
    console.log(`✅ Created ${createdCourses.length} courses\n`);

    // Phase 4: Generate and seed lessons for each course
    console.log('📝 Phase 4: Creating lessons...');
    await seedAllLessons(createdCourses, surahs, shortSurahs, juzArray, themes, ibnKathirMap);
    console.log('✅ All lessons created\n');

    // Phase 5: Summary
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Courses: ${createdCourses.length}`);
    console.log(`   Surahs processed: ${surahs.length}`);
    console.log(`   Tafseer entries: ${ibnKathirData.length}`);
    console.log('\n✨ Your LMS is now populated with Islamic content!');
    console.log('🔗 Visit http://localhost:1337/admin to manage content');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    if (strapi) {
      await strapi.destroy();
    }
  }
}

/**
 * Seed all courses
 */
async function seedCourses(courseData: CourseData[]): Promise<any[]> {
  const createdCourses: any[] = [];

  for (const course of courseData) {
    try {
      const created = await strapi.entityService.create('api::course.course', {
        data: {
          ...course,
          publishedAt: new Date()
        }
      });
      createdCourses.push(created);
      console.log(`✓ Created: ${course.title}`);
    } catch (error) {
      console.error(`✗ Failed to create course: ${course.title}`, error);
    }
  }

  return createdCourses;
}

/**
 * Seed all lessons for all courses
 */
async function seedAllLessons(
  courses: any[],
  surahs: QuranSurah[],
  shortSurahs: QuranSurah[],
  juzArray: any[],
  themes: any,
  ibnKathirMap: Map<number, TafseerEntry>
) {
  for (const course of courses) {
    console.log(`\n📚 Creating lessons for: ${course.title}`);
    let lessons: LessonData[] = [];

    // Determine which lessons to generate based on course title/slug
    if (course.slug.includes('first-quran') || course.slug.includes('kids')) {
      // Children's course
      lessons = generateChildrenLessons(shortSurahs);
    } else if (course.slug.includes('beginner') && !course.slug.includes('tafseer')) {
      // Beginner courses
      const ageGroup = determineAgeGroup(course.age_tier);
      lessons = generateBeginnerLessons(surahs, ageGroup);
    } else if (course.slug.includes('intermediate') || course.slug.includes('tafseer')) {
      // Intermediate courses
      const ageGroup = determineAgeGroup(course.age_tier);
      lessons = generateIntermediateLessons(juzArray, surahs, ibnKathirMap, ageGroup);
    } else if (course.slug.includes('advanced') || course.slug.includes('comparative')) {
      // Advanced courses
      lessons = generateAdvancedLessons(themes, surahs, ibnKathirMap, new Map());
    } else if (course.slug.includes('sealed-nectar') || course.slug.includes('seerah')) {
      // Seerah courses - for now, create placeholder
      lessons = generateSeerahLessons(course);
    }

    // Seed lessons for this course
    await seedLessonsForCourse(course, lessons);
  }
}

/**
 * Seed lessons for a specific course
 */
async function seedLessonsForCourse(course: any, lessons: LessonData[]) {
  let createdCount = 0;

  for (const lessonData of lessons) {
    try {
      // Create the lesson
      const createdLesson = await strapi.entityService.create('api::lesson.lesson', {
        data: {
          ...lessonData,
          course: course.id,
          publishedAt: new Date()
        }
      });

      // Generate and create quiz for this lesson
      if (lessonData.lesson_type === 'reading' && !lessonData.slug.includes('seerah')) {
        await createQuizForLesson(createdLesson, lessonData);
      }

      createdCount++;

      // Log progress every 10 lessons
      if (createdCount % 10 === 0) {
        console.log(`   Progress: ${createdCount}/${lessons.length} lessons`);
      }
    } catch (error) {
      console.error(`✗ Failed to create lesson: ${lessonData.title}`, error);
    }
  }

  console.log(`✓ Created ${createdCount} lessons`);
}

/**
 * Create quiz for a lesson
 */
async function createQuizForLesson(lesson: any, lessonData: LessonData) {
  try {
    // Determine quiz complexity based on lesson type
    const difficultyMultiplier = lessonData.lesson_order <= 10 ? 0.8 :
                                  lessonData.lesson_order <= 50 ? 1.0 : 1.2;

    // Generate quiz (simplified for now)
    const quizData: QuizData = {
      title: `Quiz: ${lessonData.title}`,
      slug: `quiz-${lessonData.slug}`,
      description: `Test your knowledge of ${lessonData.title}`,
      quiz_type: 'practice',
      time_limit_minutes: 20,
      passing_score: 70,
      max_attempts: 3,
      randomize_questions: true,
      show_correct_answers: true,
      questions: generateSampleQuestions(lessonData, difficultyMultiplier),
      total_points: 100,
      instructions: 'Answer all questions to test your understanding.',
      publishedAt: new Date()
    };

    const createdQuiz = await strapi.entityService.create('api::quiz.quiz', {
      data: {
        ...quizData,
        lesson: lesson.id,
        publishedAt: new Date()
      }
    });

    // Update lesson with quiz reference
    await strapi.entityService.update('api::lesson.lesson', lesson.id, {
      data: {
        quiz: createdQuiz.id
      }
    });

  } catch (error) {
    console.error(`✗ Failed to create quiz for lesson: ${lesson.title}`);
  }
}

/**
 * Generate sample quiz questions
 */
function generateSampleQuestions(lessonData: LessonData, multiplier: number): any[] {
  const questionCount = Math.floor(15 * multiplier);
  const questions = [];

  for (let i = 0; i < questionCount; i++) {
    const types = ['multiple_choice', 'true_false', 'short_answer'];
    const type = types[i % types.length];

    questions.push({
      type,
      question: `Question ${i + 1} about ${lessonData.title}`,
      options: type === 'multiple_choice' ? ['Option A', 'Option B', 'Option C', 'Option D'] : undefined,
      correct_answer: type === 'multiple_choice' ? 'Option A' : type === 'true_false' ? 'true' : 'Sample answer',
      explanation: 'This is explained in the lesson content.',
      points: type === 'short_answer' ? 10 : 5
    });
  }

  return questions;
}

/**
 * Generate placeholder Seerah lessons
 */
function generateSeerahLessons(course: any): LessonData[] {
  const lessons: LessonData[] = [];
  const lessonCount = course.age_tier === 'youth' ? 30 : 48;

  const chapters = [
    'The Birth of Prophet Muhammad ﷺ',
    'Early Life in Mecca',
    'The First Revelation',
    'Early Muslims and Persecution',
    'Migration to Abyssinia',
    'The Year of Sorrow',
    'The Night Journey (Isra and Miraj)',
    'Migration to Medina (Hijrah)',
    'The Battle of Badr',
    'The Battle of Uhud',
    'The Battle of the Trench',
    'Treaty of Hudaybiyyah',
    'Conquest of Mecca',
    'The Farewell Pilgrimage',
    'The Prophet\'s Final Days'
  ];

  for (let i = 0; i < Math.min(lessonCount, chapters.length); i++) {
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
seedDatabase()
  .then(() => {
    console.log('\n✅ Seeding complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  });
