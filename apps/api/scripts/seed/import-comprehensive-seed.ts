/**
 * Comprehensive Seed Data Importer
 *
 * Imports all course content from JSON files in seed-data/ directory
 * Handles courses, lessons, and quizzes with proper relationships
 */

import fs from 'fs';
import path from 'path';

interface Quiz {
  quiz_id: string;
  title: string;
  description: string;
  passing_score: number;
  time_limit_minutes: number;
  max_attempts: number;
  questions: Array<{
    question_id: string;
    question_text: string;
    question_type: 'multiple_choice' | 'true_false';
    options: string[];
    correct_answer: string | number;
    explanation: string;
    points: number;
  }>;
}

interface Lesson {
  lesson_id?: string;
  title: string;
  slug?: string;
  description?: string;
  content: string;
  // Schema 1 (Fiqh/Hadith/Seerah)
  lesson_type?: string;  // Will be mapped to content_type
  lesson_order?: number;  // Will be mapped to order_index
  // Schema 2 (Quran courses)
  content_type?: string;
  order_index?: number;
  // Common fields
  duration_minutes: number;
  is_preview?: boolean;
  learning_objectives?: string[];
  video_url?: string | null;
  quiz?: Quiz;
}

interface Course {
  course_id?: string;
  title: string;
  slug?: string;
  description: string;
  // Schema 1 (Fiqh/Hadith/Seerah)
  subject?: string;
  age_tier?: string;
  difficulty?: string;
  duration_weeks?: number;
  schedule?: string;
  // Schema 2 (Quran courses)
  target_audience?: string;
  difficulty_level?: string;
  estimated_duration_weeks?: number;
  category?: string;
  // Common fields
  instructor?: string;
  thumbnail?: any;
  prerequisites?: string | null;
  learning_outcomes?: string[];
  is_featured?: boolean;
  publishedAt?: string;
  // Quran schema has lessons array
  lessons?: Lesson[];
}

interface SeedData {
  courses: Course[];
  lessons?: {
    [courseSlug: string]: Lesson[];
  };
  quizzes?: {
    [lessonSlug: string]: Quiz;
  };
}

/**
 * Read all JSON seed files from seed-data directory
 */
function loadSeedFiles(): SeedData[] {
  // Look in src/seed-data (not dist) since JSON files are in source
  const seedDataDir = path.join(__dirname, '../../src/seed-data');
  const seedFiles: SeedData[] = [];

  console.log(`📂 Loading seed files from: ${seedDataDir}`);

  try {
    const files = fs.readdirSync(seedDataDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    console.log(`✅ Found ${jsonFiles.length} JSON seed files`);

    for (const file of jsonFiles) {
      const filePath = path.join(seedDataDir, file);
      console.log(`   📄 Reading: ${file}`);

      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(content) as SeedData;
        seedFiles.push(data);
        console.log(`   ✅ Loaded ${data.courses.length} courses from ${file}`);
      } catch (error) {
        console.error(`   ❌ Error reading ${file}:`, error);
      }
    }

    return seedFiles;
  } catch (error) {
    console.error('❌ Error reading seed-data directory:', error);
    return [];
  }
}

/**
 * Import courses, lessons, and quizzes into Strapi
 */
async function importSeedData(strapi: any) {
  console.log('\n🚀 Starting comprehensive seed data import...\n');

  const seedFiles = loadSeedFiles();

  if (seedFiles.length === 0) {
    console.log('⚠️  No seed files found. Skipping import.');
    return;
  }

  // Combine all courses from all seed files
  const allCourses: Course[] = seedFiles.flatMap(seed => seed.courses);
  console.log(`\n📚 Total courses to import: ${allCourses.length}\n`);

  // Combine all lessons from all seed files into a map
  const allLessons: { [courseSlug: string]: Lesson[] } = {};
  const allQuizzes: { [lessonSlug: string]: Quiz } = {};

  for (const seed of seedFiles) {
    if (seed.lessons) {
      Object.assign(allLessons, seed.lessons);
    }
    if (seed.quizzes) {
      Object.assign(allQuizzes, seed.quizzes);
    }
  }

  console.log(`📝 Found lessons for ${Object.keys(allLessons).length} courses`);
  console.log(`🎯 Found quizzes for ${Object.keys(allQuizzes).length} lessons\n`);

  let importedCourses = 0;
  let importedLessons = 0;
  let importedQuizzes = 0;
  let errors: string[] = [];

  for (const courseData of allCourses) {
    try {
      // Map schema fields to Strapi schema
      const ageTierMap: { [key: string]: string } = {
        'ELEMENTARY': 'children',
        'MIDDLE_SCHOOL': 'youth',
        'HIGH_SCHOOL': 'youth',
        'ADULTS': 'adults',
        'COLLEGE': 'adults',
        'SENIORS': 'seniors',
      };

      const difficultyMap: { [key: string]: string } = {
        'BEGINNER': 'beginner',
        'INTERMEDIATE': 'intermediate',
        'ADVANCED': 'advanced',
      };

      const subjectMap: { [key: string]: string } = {
        'QURAN_STUDIES': 'quran',
        'ARABIC_LANGUAGE': 'arabic',
        'FIQH': 'fiqh',
        'HADITH': 'hadith',
        'SEERAH': 'seerah',
        'AQEEDAH': 'aqeedah',
        'AKHLAQ': 'akhlaq',
        'TAJWEED': 'tajweed',
      };

      // Normalize fields from either schema
      const ageTier = courseData.age_tier || (courseData.target_audience ? ageTierMap[courseData.target_audience] : 'adults');
      const difficulty = courseData.difficulty || (courseData.difficulty_level ? difficultyMap[courseData.difficulty_level] : 'beginner');
      const subject = courseData.subject || (courseData.category ? subjectMap[courseData.category] : 'quran');
      const durationWeeks = courseData.duration_weeks || courseData.estimated_duration_weeks || 12;
      const slug = courseData.slug || courseData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      console.log(`\n📖 Importing course: ${courseData.title}`);
      console.log(`   Subject: ${subject} | Age: ${ageTier} | Difficulty: ${difficulty}`);

      // Check if course already exists
      const existingCourse = await strapi.documents('api::course.course').findMany({
        filters: { slug: slug },
        limit: 1,
      });

      // Prepare course data with proper type conversions
      const courseCreateData = {
        title: courseData.title,
        slug: slug,
        description: courseData.description,
        subject: subject,
        age_tier: ageTier,
        difficulty: difficulty,
        duration_weeks: durationWeeks,
        schedule: courseData.schedule || '2 lessons per week, 20-30 minutes each',
        instructor: courseData.instructor || 'Masjid At-Taqwa Education Team',
        prerequisites: courseData.prerequisites || '',  // Convert null to empty string
        learning_outcomes: courseData.learning_outcomes || [],
        is_featured: courseData.is_featured || false,
        publishedAt: new Date(),
      };

      let course;
      if (existingCourse.length > 0) {
        console.log(`   ⚠️  Course already exists, updating: ${courseData.slug}`);
        course = await strapi.documents('api::course.course').update({
          documentId: existingCourse[0].documentId,
          data: courseCreateData,
        });
        // Publish the updated course
        await strapi.documents('api::course.course').publish({
          documentId: course.documentId,
        });
      } else {
        course = await strapi.documents('api::course.course').create({
          data: courseCreateData,
        });
        // Publish the newly created course
        await strapi.documents('api::course.course').publish({
          documentId: course.documentId,
        });
      }

      importedCourses++;
      console.log(`   ✅ Course imported: ${course.documentId}`);

      // Import lessons for this course (handle both inline and separate map)
      const courseLessons = courseData.lessons || allLessons[slug] || [];
      console.log(`   📝 Importing ${courseLessons.length} lessons...`);

      for (const lessonData of courseLessons) {
        try {
          // Normalize lesson fields from either schema first
          const lessonSlug = lessonData.slug || lessonData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          const orderIndex = lessonData.lesson_order || lessonData.order_index || 1;
          const contentType = lessonData.lesson_type || lessonData.content_type || 'reading';

          // Check if lesson already exists
          const existingLesson = await strapi.documents('api::lesson.lesson').findMany({
            filters: {
              slug: lessonSlug,
              course: { documentId: course.documentId }
            },
            limit: 1,
          });

          // Prepare lesson data with correct schema field names
          const lessonCreateData = {
            title: lessonData.title,
            slug: lessonSlug,
            description: lessonData.description || '',
            content: lessonData.content,
            lesson_type: contentType,  // Schema uses lesson_type
            duration_minutes: lessonData.duration_minutes,
            lesson_order: orderIndex,  // Schema uses lesson_order
            is_preview: lessonData.is_preview || false,
            learning_objectives: lessonData.learning_objectives || [],
            course: course.documentId,
            publishedAt: new Date(),
          };

          let lesson;
          if (existingLesson.length > 0) {
            lesson = await strapi.documents('api::lesson.lesson').update({
              documentId: existingLesson[0].documentId,
              data: lessonCreateData,
            });
          } else {
            lesson = await strapi.documents('api::lesson.lesson').create({
              data: lessonCreateData,
            });
          }

          // Publish the lesson
          await strapi.documents('api::lesson.lesson').publish({
            documentId: lesson.documentId,
          });

          importedLessons++;
          console.log(`      ✅ Lesson ${orderIndex}: ${lessonData.title}`);

          // Import quiz if exists for this lesson (check inline quiz first, then map)
          const lessonQuiz = lessonData.quiz || allQuizzes[lessonSlug];
          if (lessonQuiz && lessonQuiz.questions && lessonQuiz.questions.length > 0) {
            try {
              // Check if quiz already exists
              const existingQuiz = await strapi.documents('api::quiz.quiz').findMany({
                filters: {
                  lesson: { documentId: lesson.documentId }
                },
                limit: 1,
              });

              // Generate quiz metadata from lesson if not provided
              const quizTitle = lessonQuiz.title || `${lessonData.title} - Quiz`;
              const quizDescription = lessonQuiz.description || `Test your knowledge of ${lessonData.title}`;
              const passingScore = lessonQuiz.passing_score || 70;
              const timeLimitMinutes = lessonQuiz.time_limit_minutes || 15;
              const maxAttempts = lessonQuiz.max_attempts || 3;

              // Calculate total points from questions (default 10 points per question)
              const totalPoints = lessonQuiz.questions.reduce((sum, q) => sum + (q.points || 10), 0);

              // Generate slug from title
              const quizSlug = quizTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

              const quizData = {
                title: quizTitle,
                slug: quizSlug,
                description: quizDescription,
                quiz_type: 'practice',  // Default to practice quiz
                questions: lessonQuiz.questions,
                passing_score: passingScore,
                time_limit_minutes: timeLimitMinutes,
                max_attempts: maxAttempts,
                total_points: totalPoints,
                lesson: lesson.documentId,
                publishedAt: new Date(),
              };

              let quiz;
              if (existingQuiz.length > 0) {
                quiz = await strapi.documents('api::quiz.quiz').update({
                  documentId: existingQuiz[0].documentId,
                  data: quizData,
                });
              } else {
                quiz = await strapi.documents('api::quiz.quiz').create({
                  data: quizData,
                });
              }

              // Publish the quiz
              await strapi.documents('api::quiz.quiz').publish({
                documentId: quiz.documentId,
              });

              importedQuizzes++;
              console.log(`         🎯 Quiz: ${lessonQuiz.questions.length} questions`);
            } catch (error) {
              const errorMsg = `Failed to import quiz for lesson ${lessonData.title}`;
              console.error(`         ❌ ${errorMsg}:`, error);
              errors.push(errorMsg);
            }
          }
        } catch (error) {
          const errorMsg = `Failed to import lesson ${lessonData.title}`;
          console.error(`      ❌ ${errorMsg}:`, error);
          errors.push(errorMsg);
        }
      }

      console.log(`   ✅ Completed course: ${courseData.title}`);

    } catch (error) {
      const errorMsg = `Failed to import course ${courseData.title}`;
      console.error(`   ❌ ${errorMsg}:`, error);
      errors.push(errorMsg);
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 IMPORT SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Courses imported: ${importedCourses}/${allCourses.length}`);
  console.log(`✅ Lessons imported: ${importedLessons}`);
  console.log(`✅ Quizzes imported: ${importedQuizzes}`);

  if (errors.length > 0) {
    console.log(`\n⚠️  Errors encountered: ${errors.length}`);
    errors.forEach((error, idx) => {
      console.log(`   ${idx + 1}. ${error}`);
    });
  } else {
    console.log('\n🎉 All data imported successfully!');
  }
  console.log('='.repeat(60) + '\n');
}

/**
 * Main execution
 */
export async function runComprehensiveSeed(strapi: any) {
  try {
    console.log('\n' + '='.repeat(60));
    console.log('🌟 COMPREHENSIVE SEED DATA IMPORTER');
    console.log('='.repeat(60) + '\n');

    // Check if database already has courses
    const existingCourses = await strapi.documents('api::course.course').findMany({
      limit: 1,
    });

    if (existingCourses.length > 0) {
      console.log('⚠️  Database already contains courses.');
      console.log('   This will UPDATE existing courses with matching slugs.');
      console.log('   New courses will be added.\n');
    }

    await importSeedData(strapi);

  } catch (error) {
    console.error('\n❌ CRITICAL ERROR during seed import:', error);
    throw error;
  }
}

// Allow running standalone
if (require.main === module) {
  console.log('⚠️  This script should be run through Strapi bootstrap or via npm script.');
  console.log('   Use: npm run seed:comprehensive');
}
