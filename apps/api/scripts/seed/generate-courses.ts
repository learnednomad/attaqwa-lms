/**
 * Course Generator
 * Generates course structures for different age tiers and difficulty levels
 */

import { generateSlug } from '../utils/content-processor';

export interface CourseData {
  title: string;
  slug: string;
  description: string;
  age_tier: 'children' | 'youth' | 'adults' | 'seniors';
  subject: 'quran' | 'arabic' | 'fiqh' | 'hadith' | 'seerah' | 'aqeedah' | 'akhlaq' | 'tajweed';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_weeks: number;
  schedule: string;
  instructor: string;
  is_featured: boolean;
  prerequisites: string | null;
  learning_outcomes: string[];
  publishedAt: Date;
}

/**
 * Generate all courses for the LMS
 */
export function generateAllCourses(): CourseData[] {
  const courses: CourseData[] = [];

  // Children Courses
  courses.push(...generateChildrenCourses());

  // Youth Courses
  courses.push(...generateYouthCourses());

  // Adults Courses
  courses.push(...generateAdultsCourses());

  // Seniors Courses
  courses.push(...generateSeniorsCourses());

  return courses;
}

/**
 * Generate courses for children
 */
function generateChildrenCourses(): CourseData[] {
  return [
    {
      title: 'My First Quran - Short Surahs for Kids',
      slug: generateSlug('My First Quran - Short Surahs for Kids'),
      description: 'An engaging introduction to the Holy Quran designed specifically for children. Learn the beautiful short Surahs from Juz 30 with simple explanations, colorful illustrations, and audio recitations. Perfect for young Muslims starting their journey with the Quran.',
      age_tier: 'children',
      subject: 'quran',
      difficulty: 'beginner',
      duration_weeks: 12,
      schedule: '2 lessons per week, 10-15 minutes each',
      instructor: 'Attaqwa Masjid Education Team',
      is_featured: true,
      prerequisites: null,
      learning_outcomes: [
        'Memorize and recite 30+ short Surahs',
        'Understand simple meanings of the Surahs',
        'Develop love for the Quran',
        'Learn basic Quranic etiquette',
        'Build a strong foundation for Quranic studies'
      ],
      publishedAt: new Date()
    }
  ];
}

/**
 * Generate courses for youth
 */
function generateYouthCourses(): CourseData[] {
  return [
    {
      title: 'Complete Quran Study - Beginner Level',
      slug: generateSlug('Complete Quran Study - Beginner Level'),
      description: 'Embark on a comprehensive journey through the entire Quran with clear English translations and contextual understanding. Study all 114 Surahs systematically, learning the meanings, themes, and guidance for daily life. Perfect for youth beginning their Quranic education.',
      age_tier: 'youth',
      subject: 'quran',
      difficulty: 'beginner',
      duration_weeks: 52,
      schedule: '3 Surahs per week, 15-20 minutes each',
      instructor: 'Attaqwa Masjid Quran Department',
      is_featured: true,
      prerequisites: null,
      learning_outcomes: [
        'Complete reading of the entire Quran with translation',
        'Understanding of key themes in each Surah',
        'Connection between Quranic guidance and modern life',
        'Basic knowledge of revelation history',
        'Foundation for deeper Quranic studies'
      ],
      publishedAt: new Date()
    },
    {
      title: 'Quran with Tafseer - Intermediate Level',
      slug: generateSlug('Quran with Tafseer - Intermediate Level'),
      description: 'Deepen your understanding of the Quran through classical Tafseer Ibn Kathir. Study the Quran organized by Juz (30 parts) with detailed explanations, historical context, and scholarly insights. Build upon your basic knowledge to gain profound understanding.',
      age_tier: 'youth',
      subject: 'quran',
      difficulty: 'intermediate',
      duration_weeks: 40,
      schedule: '1 Juz per week, 25-30 minutes per lesson',
      instructor: 'Sheikh Muhammad Al-Tafseer',
      is_featured: true,
      prerequisites: 'Completion of Beginner Quran course or equivalent knowledge',
      learning_outcomes: [
        'Deep understanding of Quranic verses through classical Tafseer',
        'Knowledge of Asbab al-Nuzul (reasons for revelation)',
        'Ability to derive lessons and rulings from verses',
        'Understanding of connections between different parts of Quran',
        'Application of Quranic wisdom to contemporary issues'
      ],
      publishedAt: new Date()
    },
    {
      title: 'The Sealed Nectar - Life of Prophet Muhammad ﷺ',
      slug: generateSlug('The Sealed Nectar - Life of Prophet Muhammad'),
      description: 'Study the comprehensive biography of Prophet Muhammad ﷺ through the award-winning book "Ar-Raheeq Al-Makhtum" (The Sealed Nectar). Explore the life, character, and teachings of the final Prophet, and learn how to follow his example in modern times.',
      age_tier: 'youth',
      subject: 'seerah',
      difficulty: 'beginner',
      duration_weeks: 30,
      schedule: '2 lessons per week, 20 minutes each',
      instructor: 'Dr. Safiur Rahman Al-Mubarakpuri',
      is_featured: true,
      prerequisites: null,
      learning_outcomes: [
        'Comprehensive knowledge of the Prophet\'s life from birth to passing',
        'Understanding of the challenges faced by early Muslims',
        'Lessons from the Prophet\'s character and conduct',
        'Historical context of Islamic teachings',
        'Practical application of Prophetic guidance'
      ],
      publishedAt: new Date()
    }
  ];
}

/**
 * Generate courses for adults
 */
function generateAdultsCourses(): CourseData[] {
  return [
    {
      title: 'Complete Quran Study - Adult Beginner',
      slug: generateSlug('Complete Quran Study - Adult Beginner'),
      description: 'A comprehensive adult-level introduction to the Holy Quran. Study all 114 Surahs with professional translations, thematic analysis, and practical applications. Designed for adults beginning their Quranic education or returning to deepen their understanding.',
      age_tier: 'adults',
      subject: 'quran',
      difficulty: 'beginner',
      duration_weeks: 52,
      schedule: '3 Surahs per week, 20-25 minutes each',
      instructor: 'Attaqwa Masjid Quran Department',
      is_featured: true,
      prerequisites: null,
      learning_outcomes: [
        'Complete understanding of Quranic message and structure',
        'Ability to read and comprehend Quranic translations',
        'Knowledge of major themes and narratives',
        'Connection to Islamic jurisprudence and theology',
        'Foundation for advanced Islamic studies'
      ],
      publishedAt: new Date()
    },
    {
      title: 'Quran with Ibn Kathir Tafseer - Intermediate',
      slug: generateSlug('Quran with Ibn Kathir Tafseer - Intermediate'),
      description: 'Comprehensive Quranic study with the renowned Tafseer Ibn Kathir. Organized by Juz for systematic learning, covering linguistic analysis, historical context, legal rulings, and spiritual lessons. Perfect for those seeking deeper understanding beyond basic translation.',
      age_tier: 'adults',
      subject: 'quran',
      difficulty: 'intermediate',
      duration_weeks: 45,
      schedule: '1 Juz per week, 30-35 minutes per lesson',
      instructor: 'Sheikh Abdullah Al-Tafseer',
      is_featured: true,
      prerequisites: 'Completion of Beginner Quran course or ability to read Quran with translation',
      learning_outcomes: [
        'Mastery of classical Quranic exegesis methodology',
        'Understanding of Arabic linguistic nuances in Quran',
        'Knowledge of scholarly opinions on verses',
        'Ability to derive Islamic rulings from Quranic text',
        'Deep spiritual connection with Allah\'s words'
      ],
      publishedAt: new Date()
    },
    {
      title: 'Advanced Quranic Studies - Comparative Tafseer',
      slug: generateSlug('Advanced Quranic Studies - Comparative Tafseer'),
      description: 'Advanced thematic study of the Quran with comparative analysis using both Tafseer Ibn Kathir and Tafseer al-Baghawi. Explore complex theological concepts, legal principles, and spiritual wisdom through multiple scholarly perspectives. Designed for serious students of Islamic knowledge.',
      age_tier: 'adults',
      subject: 'quran',
      difficulty: 'advanced',
      duration_weeks: 52,
      schedule: '1 theme per week, 40-45 minutes per lesson',
      instructor: 'Sheikh Dr. Ahmad Al-Qurashi',
      is_featured: true,
      prerequisites: 'Completion of Intermediate Quran course and basic Arabic knowledge recommended',
      learning_outcomes: [
        'Advanced understanding of Quranic themes and interconnections',
        'Ability to compare and analyze different Tafseer methodologies',
        'Deep knowledge of Islamic theology and jurisprudence',
        'Skills in Quranic research and analysis',
        'Preparation for Islamic teaching and da\'wah'
      ],
      publishedAt: new Date()
    },
    {
      title: 'The Sealed Nectar - Comprehensive Seerah Study',
      slug: generateSlug('The Sealed Nectar - Comprehensive Seerah Study'),
      description: 'In-depth academic study of the Prophet Muhammad\'s ﷺ life through Ar-Raheeq Al-Makhtum. Detailed analysis of historical events, military campaigns, diplomatic relations, and the establishment of the Islamic state. Includes critical examination of authentic sources and scholarly discussions.',
      age_tier: 'adults',
      subject: 'seerah',
      difficulty: 'intermediate',
      duration_weeks: 48,
      schedule: '2 lessons per week, 30-35 minutes each',
      instructor: 'Dr. Safiur Rahman Al-Mubarakpuri',
      is_featured: true,
      prerequisites: 'Basic knowledge of Islamic history recommended',
      learning_outcomes: [
        'Comprehensive knowledge of the Prophet\'s life and mission',
        'Understanding of early Islamic history and society',
        'Analysis of the Prophet\'s leadership and governance',
        'Knowledge of hadith sciences and Seerah methodology',
        'Ability to apply Prophetic wisdom to modern challenges'
      ],
      publishedAt: new Date()
    }
  ];
}

/**
 * Generate courses for seniors
 */
function generateSeniorsCourses(): CourseData[] {
  return [
    {
      title: 'Quran Study for Seniors - Beginner Friendly',
      slug: generateSlug('Quran Study for Seniors - Beginner Friendly'),
      description: 'A gentle, accessible introduction to the Holy Quran designed specifically for senior learners. Study all 114 Surahs at a comfortable pace with clear translations, large text, and reflective discussions. Focus on spiritual growth and practical wisdom for this stage of life.',
      age_tier: 'seniors',
      subject: 'quran',
      difficulty: 'beginner',
      duration_weeks: 60,
      schedule: '2 Surahs per week, 15-20 minutes each',
      instructor: 'Attaqwa Masjid Senior Education Team',
      is_featured: true,
      prerequisites: null,
      learning_outcomes: [
        'Complete reading of Quran with understanding',
        'Spiritual reflection and personal connection',
        'Preparation for the Hereafter',
        'Comfort and peace through Quranic wisdom',
        'Foundation for continued learning'
      ],
      publishedAt: new Date()
    },
    {
      title: 'Quran with Tafseer for Mature Learners',
      slug: generateSlug('Quran with Tafseer for Mature Learners'),
      description: 'Intermediate Quranic study with Tafseer Ibn Kathir, adapted for mature learners. Organized by Juz with emphasis on spiritual wisdom, life lessons, and preparation for the Hereafter. Study at a comfortable pace with opportunities for reflection and discussion.',
      age_tier: 'seniors',
      subject: 'quran',
      difficulty: 'intermediate',
      duration_weeks: 48,
      schedule: '1 Juz every 10 days, 25-30 minutes per lesson',
      instructor: 'Sheikh Mahmoud Al-Rahman',
      is_featured: false,
      prerequisites: 'Completion of Beginner Quran course',
      learning_outcomes: [
        'Deep understanding of Quranic guidance',
        'Spiritual preparation for the Hereafter',
        'Wisdom for life\'s later stages',
        'Knowledge to share with family and community',
        'Continued intellectual and spiritual growth'
      ],
      publishedAt: new Date()
    }
  ];
}
