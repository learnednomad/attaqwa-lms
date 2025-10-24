/**
 * Seed Data Script
 * Populates Strapi with sample courses, lessons, and achievements
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Configuration
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@attaqwa.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Test1234!';

// Colors
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function success(msg) {
  console.log(`${colors.green}✅ ${msg}${colors.reset}`);
}

function error(msg) {
  console.log(`${colors.red}❌ ${msg}${colors.reset}`);
}

function info(msg) {
  console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`);
}

let JWT_TOKEN = '';

/**
 * Authenticate with Strapi
 */
async function authenticate() {
  try {
    info('Authenticating...');
    const response = await axios.post(`${STRAPI_URL}/auth/local`, {
      identifier: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });

    JWT_TOKEN = response.data.jwt;
    success(`Authenticated as ${response.data.user.email}`);
    return true;
  } catch (err) {
    error('Authentication failed');
    error(err.response?.data?.error?.message || err.message);
    return false;
  }
}

/**
 * Sample Courses Data
 */
const courses = [
  {
    title: 'Quran Recitation Basics',
    description: '**Learn the fundamentals of Quran recitation with proper Tajweed rules.**\n\nThis comprehensive course covers:\n- Arabic pronunciation\n- Tajweed rules\n- Common mistakes\n- Practice sessions',
    category: 'quran',
    difficulty: 'beginner',
    ageTier: 'all',
    duration: 480, // 8 hours
    isPublished: true,
  },
  {
    title: 'Hadith Studies - Introduction',
    description: '**Comprehensive introduction to Hadith sciences and authentication.**\n\nTopics include:\n- Science of Hadith\n- Hadith authentication\n- Famous narrators\n- Hadith compilation',
    category: 'hadith',
    difficulty: 'intermediate',
    ageTier: 'youth',
    duration: 600, // 10 hours
    isPublished: true,
  },
  {
    title: 'Islamic History & Seerah',
    description: '**Journey through the life of Prophet Muhammad (PBUH) and early Islamic history.**\n\nCoverage:\n- Early life of the Prophet\n- Makkan period\n- Hijrah and Madinan period\n- Major battles\n- Conquest of Makkah',
    category: 'seerah',
    difficulty: 'beginner',
    ageTier: 'all',
    duration: 720, // 12 hours
    isPublished: true,
  },
  {
    title: 'Fiqh - Prayer Rulings',
    description: '**Comprehensive guide to Islamic prayer rulings and practices.**\n\nLearn about:\n- Conditions of prayer\n- Pillars of prayer\n- Wudu and Tayammum\n- Prayer times\n- Common mistakes',
    category: 'fiqh',
    difficulty: 'beginner',
    ageTier: 'all',
    duration: 540, // 9 hours
    isPublished: true,
  },
  {
    title: 'Arabic Grammar Fundamentals',
    description: '**Master the basics of Arabic grammar for Quranic understanding.**\n\nTopics:\n- Nouns and verbs\n- Sentence structure\n- Common patterns\n- Quranic examples',
    category: 'general',
    difficulty: 'intermediate',
    ageTier: 'youth',
    duration: 600, // 10 hours
    isPublished: true,
  },
  {
    title: 'Islamic Beliefs - Aqeedah',
    description: '**Understanding the fundamental beliefs of Islam.**\n\nCore topics:\n- Tawheed (Oneness of Allah)\n- Belief in Angels\n- Belief in Prophets\n- Belief in the Last Day\n- Belief in Qadar',
    category: 'aqeedah',
    difficulty: 'beginner',
    ageTier: 'all',
    duration: 480, // 8 hours
    isPublished: true,
  },
];

/**
 * Sample Lessons Data
 */
const lessonsByCategory = {
  quran: [
    {
      title: 'Introduction to Tajweed',
      description: 'Understanding the importance of proper Quran recitation',
      type: 'video',
      content: {
        url: 'https://www.youtube.com/watch?v=example1',
        transcript: 'Welcome to the course on Quran recitation...',
      },
      duration: 30,
      order: 1,
      isRequired: true,
    },
    {
      title: 'Arabic Letters and Sounds',
      description: 'Learning the 28 Arabic letters and their pronunciation',
      type: 'article',
      content: {
        markdown: '# Arabic Letters\n\nThe Arabic alphabet consists of 28 letters...',
      },
      duration: 45,
      order: 2,
      isRequired: true,
    },
    {
      title: 'Tajweed Rules Quiz',
      description: 'Test your knowledge of basic Tajweed rules',
      type: 'quiz',
      content: {
        passingScore: 70,
        questions: [
          {
            question: 'What is the meaning of Tajweed?',
            type: 'multiple_choice',
            options: [
              'To beautify',
              'To improve',
              'To make better',
              'All of the above',
            ],
            correctAnswer: 3,
            explanation: 'Tajweed means to improve, beautify and make better.',
          },
        ],
      },
      duration: 20,
      order: 3,
      isRequired: true,
    },
  ],
  hadith: [
    {
      title: 'What is Hadith?',
      description: 'Introduction to the science of Hadith',
      type: 'video',
      content: {
        url: 'https://www.youtube.com/watch?v=example2',
        transcript: 'Hadith refers to the sayings and actions of the Prophet...',
      },
      duration: 25,
      order: 1,
      isRequired: true,
    },
    {
      title: 'Types of Hadith',
      description: 'Understanding Sahih, Hasan, and Daif classifications',
      type: 'article',
      content: {
        markdown: '# Hadith Classifications\n\nHadith are classified into three main categories...',
      },
      duration: 40,
      order: 2,
      isRequired: true,
    },
  ],
  seerah: [
    {
      title: 'The Birth of Prophet Muhammad (PBUH)',
      description: 'Early life in Makkah',
      type: 'video',
      content: {
        url: 'https://www.youtube.com/watch?v=example3',
        transcript: 'The Prophet was born in the Year of the Elephant...',
      },
      duration: 35,
      order: 1,
      isRequired: true,
    },
    {
      title: 'The First Revelation',
      description: 'The beginning of prophethood',
      type: 'article',
      content: {
        markdown: '# The First Revelation\n\nThe Prophet received his first revelation in Cave Hira...',
      },
      duration: 30,
      order: 2,
      isRequired: true,
    },
  ],
};

/**
 * Sample Achievements Data
 */
const achievements = [
  {
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🎯',
    type: 'bronze',
    criteria: { lessonsCompleted: 1 },
    rarity: 'common',
    points: 10,
  },
  {
    name: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: '🔥',
    type: 'silver',
    criteria: { streakDays: 7 },
    rarity: 'uncommon',
    points: 50,
  },
  {
    name: 'Course Master',
    description: 'Complete a course with 95%+ score',
    icon: '🏆',
    type: 'gold',
    criteria: { courseScore: 95 },
    rarity: 'rare',
    points: 100,
  },
  {
    name: 'Quran Scholar',
    description: 'Complete all Quran courses',
    icon: '📖',
    type: 'platinum',
    criteria: { categoryCompleted: 'quran' },
    rarity: 'legendary',
    points: 500,
  },
  {
    name: 'Hadith Expert',
    description: 'Complete all Hadith courses',
    icon: '📚',
    type: 'platinum',
    criteria: { categoryCompleted: 'hadith' },
    rarity: 'legendary',
    points: 500,
  },
  {
    name: 'Knowledge Seeker',
    description: 'Complete 10 courses',
    icon: '🎓',
    type: 'gold',
    criteria: { coursesCompleted: 10 },
    rarity: 'rare',
    points: 200,
  },
  {
    name: 'Consistent Learner',
    description: 'Maintain a 30-day streak',
    icon: '⚡',
    type: 'platinum',
    criteria: { streakDays: 30 },
    rarity: 'epic',
    points: 300,
  },
];

/**
 * Seed Courses
 */
async function seedCourses() {
  info('Seeding courses...');
  const createdCourses = [];

  for (const course of courses) {
    try {
      const response = await axios.post(
        `${STRAPI_URL}/courses`,
        { data: course },
        {
          headers: {
            Authorization: `Bearer ${JWT_TOKEN}`,
          },
        }
      );
      success(`Created course: ${course.title}`);
      createdCourses.push(response.data.data);
    } catch (err) {
      error(`Failed to create course: ${course.title}`);
      if (err.response?.data) {
        console.log(JSON.stringify(err.response.data, null, 2));
      }
    }
  }

  return createdCourses;
}

/**
 * Seed Lessons for Courses
 */
async function seedLessons(courses) {
  info('Seeding lessons...');

  for (const course of courses) {
    const lessons = lessonsByCategory[course.category] || [];

    for (const lesson of lessons) {
      try {
        const lessonData = {
          ...lesson,
          course: course.id,
        };

        await axios.post(
          `${STRAPI_URL}/lessons`,
          { data: lessonData },
          {
            headers: {
              Authorization: `Bearer ${JWT_TOKEN}`,
            },
          }
        );
        success(`Created lesson: ${lesson.title} (${course.title})`);
      } catch (err) {
        error(`Failed to create lesson: ${lesson.title}`);
        if (err.response?.data) {
          console.log(JSON.stringify(err.response.data, null, 2));
        }
      }
    }
  }
}

/**
 * Seed Achievements
 */
async function seedAchievements() {
  info('Seeding achievements...');

  for (const achievement of achievements) {
    try {
      await axios.post(
        `${STRAPI_URL}/achievements`,
        { data: achievement },
        {
          headers: {
            Authorization: `Bearer ${JWT_TOKEN}`,
          },
        }
      );
      success(`Created achievement: ${achievement.name}`);
    } catch (err) {
      error(`Failed to create achievement: ${achievement.name}`);
      if (err.response?.data) {
        console.log(JSON.stringify(err.response.data, null, 2));
      }
    }
  }
}

/**
 * Main Function
 */
async function main() {
  console.log('\n================================');
  console.log('🌱 Seeding Strapi Database');
  console.log('================================\n');

  info(`Target: ${STRAPI_URL}`);
  info(`User: ${ADMIN_EMAIL}\n`);

  // Step 1: Authenticate
  const authenticated = await authenticate();
  if (!authenticated) {
    error('Cannot proceed without authentication');
    process.exit(1);
  }
  console.log('');

  // Step 2: Seed Courses
  const createdCourses = await seedCourses();
  console.log('');

  // Step 3: Seed Lessons
  if (createdCourses.length > 0) {
    await seedLessons(createdCourses);
    console.log('');
  } else {
    error('No courses created, skipping lessons');
  }

  // Step 4: Seed Achievements
  await seedAchievements();
  console.log('');

  // Summary
  console.log('================================');
  console.log('✅ Seeding Complete');
  console.log('================================\n');

  success(`Created ${createdCourses.length} courses`);
  success(`Created ${achievements.length} achievements`);
  info('\nYou can now view the data at:');
  console.log('  http://localhost:1337/admin\n');
}

// Run
main().catch((err) => {
  error(`Unexpected error: ${err.message}`);
  process.exit(1);
});
