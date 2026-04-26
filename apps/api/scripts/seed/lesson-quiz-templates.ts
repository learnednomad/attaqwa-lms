/**
 * Lesson + quiz template generators — pure functions, no Strapi / HTTP coupling.
 * Extracted from apps/api/src/bootstrap.ts.
 */

import type { CourseTemplate } from './templates';

export interface LessonTemplate {
  title: string;
  slug: string;
  description: string;
  lesson_type: string;
  duration_minutes: number;
  content: string;
  learning_objectives: string[];
  is_free: boolean;
  is_preview: boolean;
}

export function getLessonTemplatesForCourse(course: CourseTemplate): LessonTemplate[] {
  const isChildrenCourse = course.age_tier === 'children';
  const duration = isChildrenCourse ? 10 : 20;

  const lessons: LessonTemplate[] = [
    {
      title: `${course.title} - Introduction`,
      slug: `${course.slug}-introduction`,
      description: `Welcome to ${course.title}! Learn about course objectives, structure, and what you'll achieve.`,
      lesson_type: 'video',
      duration_minutes: duration,
      content: `<h2>Welcome to ${course.title}</h2>\n<p>In this introductory lesson, we will cover:</p>\n<ul>\n<li>Course overview and objectives</li>\n<li>Learning methodology</li>\n<li>Resources and materials</li>\n<li>How to get the most from this course</li>\n</ul>`,
      learning_objectives: ['Understand course structure', 'Set learning goals', 'Prepare for success'],
      is_free: true,
      is_preview: true,
    },
  ];

  if (course.subject === 'quran') {
    lessons.push(
      {
        title: `${course.title} - Proper Recitation Basics`,
        slug: `${course.slug}-recitation-basics`,
        description: 'Learn the fundamentals of proper Quranic recitation with correct pronunciation.',
        lesson_type: 'video',
        duration_minutes: duration + 5,
        content: `<h2>Quranic Recitation Fundamentals</h2>\n<p>Master the basics of recitation including:</p>\n<ul>\n<li>Proper pronunciation (Makharij)</li>\n<li>Basic Tajweed rules</li>\n<li>Listening practice</li>\n<li>Recitation exercises</li>\n</ul>`,
        learning_objectives: ['Pronounce Arabic letters correctly', 'Apply basic Tajweed', 'Recite with confidence'],
        is_free: false,
        is_preview: false,
      },
      {
        title: `${course.title} - Understanding the Meanings`,
        slug: `${course.slug}-understanding-meanings`,
        description: 'Explore the beautiful meanings and lessons from the verses.',
        lesson_type: 'reading',
        duration_minutes: duration,
        content: `<h2>Understanding Quranic Meanings</h2>\n<p>Dive deep into the meanings:</p>\n<ul>\n<li>Word-by-word translation</li>\n<li>Context and historical background</li>\n<li>Practical application</li>\n<li>Reflection questions</li>\n</ul>`,
        learning_objectives: ['Understand verse meanings', 'Connect to daily life', 'Reflect on guidance'],
        is_free: false,
        is_preview: false,
      },
    );
  } else if (course.subject === 'arabic') {
    lessons.push(
      {
        title: `${course.title} - Letter Recognition`,
        slug: `${course.slug}-letter-recognition`,
        description: 'Learn to identify and write Arabic letters in different positions.',
        lesson_type: 'interactive',
        duration_minutes: duration,
        content: `<h2>Arabic Letters Practice</h2>\n<p>Interactive activities for:</p>\n<ul>\n<li>Letter shapes and forms</li>\n<li>Writing practice</li>\n<li>Sound recognition</li>\n<li>Fun exercises</li>\n</ul>`,
        learning_objectives: ['Recognize all letters', 'Write Arabic correctly', 'Master letter sounds'],
        is_free: false,
        is_preview: true,
      },
      {
        title: `${course.title} - Building Words`,
        slug: `${course.slug}-building-words`,
        description: 'Combine letters to form and read simple Arabic words.',
        lesson_type: 'practice',
        duration_minutes: duration,
        content: `<h2>Word Formation</h2>\n<p>Practice building words:</p>\n<ul>\n<li>Connecting letters</li>\n<li>Reading simple words</li>\n<li>Vocabulary building</li>\n<li>Pronunciation practice</li>\n</ul>`,
        learning_objectives: ['Form Arabic words', 'Read simple text', 'Build vocabulary'],
        is_free: false,
        is_preview: false,
      },
    );
  } else if (course.subject === 'fiqh') {
    lessons.push(
      {
        title: `${course.title} - Evidence from Quran and Sunnah`,
        slug: `${course.slug}-evidence-sources`,
        description: 'Learn the authentic sources and evidences for Islamic rulings.',
        lesson_type: 'reading',
        duration_minutes: duration + 10,
        content: `<h2>Sources of Islamic Law</h2>\n<p>Understanding the evidence:</p>\n<ul>\n<li>Quranic verses</li>\n<li>Authentic Hadith</li>\n<li>Scholarly consensus</li>\n<li>Juristic principles</li>\n</ul>`,
        learning_objectives: ['Know primary sources', 'Understand evidences', 'Apply rulings correctly'],
        is_free: false,
        is_preview: false,
      },
      {
        title: `${course.title} - Practical Application`,
        slug: `${course.slug}-practical-application`,
        description: 'Apply Islamic rulings to real-life situations and scenarios.',
        lesson_type: 'interactive',
        duration_minutes: duration,
        content: `<h2>Applying Fiqh Knowledge</h2>\n<p>Real-world scenarios:</p>\n<ul>\n<li>Case studies</li>\n<li>Common questions</li>\n<li>Step-by-step guidance</li>\n<li>Q&A sessions</li>\n</ul>`,
        learning_objectives: ['Apply fiqh to daily life', 'Answer common questions', 'Make informed decisions'],
        is_free: false,
        is_preview: false,
      },
    );
  } else {
    lessons.push(
      {
        title: `${course.title} - Core Concepts`,
        slug: `${course.slug}-core-concepts`,
        description: `Master the foundational concepts of ${course.subject}.`,
        lesson_type: 'video',
        duration_minutes: duration + 5,
        content: `<h2>Core Concepts</h2>\n<p>Essential knowledge:</p>\n<ul>\n<li>Key principles</li>\n<li>Important terminology</li>\n<li>Historical context</li>\n<li>Modern relevance</li>\n</ul>`,
        learning_objectives: ['Understand core principles', 'Learn key terms', 'See modern application'],
        is_free: false,
        is_preview: false,
      },
      {
        title: `${course.title} - Practical Exercises`,
        slug: `${course.slug}-practical-exercises`,
        description: 'Hands-on practice to reinforce your learning.',
        lesson_type: 'practice',
        duration_minutes: duration,
        content: `<h2>Practice Activities</h2>\n<p>Reinforce your learning:</p>\n<ul>\n<li>Interactive exercises</li>\n<li>Self-assessment</li>\n<li>Reflection prompts</li>\n<li>Application tasks</li>\n</ul>`,
        learning_objectives: ['Practice key skills', 'Self-assess progress', 'Apply knowledge'],
        is_free: false,
        is_preview: false,
      },
    );
  }

  lessons.push({
    title: `${course.title} - Review and Assessment`,
    slug: `${course.slug}-review-assessment`,
    description: 'Test your knowledge and review key concepts from the course.',
    lesson_type: 'quiz',
    duration_minutes: duration + 10,
    content: `<h2>Course Review</h2>\n<p>Final assessment including:</p>\n<ul>\n<li>Comprehensive review</li>\n<li>Knowledge assessment</li>\n<li>Progress evaluation</li>\n<li>Next steps</li>\n</ul>`,
    learning_objectives: ['Review all concepts', 'Assess understanding', 'Plan next steps'],
    is_free: false,
    is_preview: false,
  });

  return lessons;
}

export interface QuizQuestion {
  question: string;
  type: 'multiple_choice';
  options: string[];
  correct_answer: number;
  points: number;
  explanation: string;
}

export function generateQuestionsForSubject(subject: string, count: number, _isChildren: boolean): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  if (subject === 'quran') {
    questions.push(
      {
        question: 'How many Surahs are in the Holy Quran?',
        type: 'multiple_choice',
        options: ['110', '114', '120', '99'],
        correct_answer: 1,
        points: 10,
        explanation: 'The Quran contains 114 Surahs (chapters).',
      },
      {
        question: 'Which Surah is known as the "Heart of the Quran"?',
        type: 'multiple_choice',
        options: ['Surah Al-Fatiha', 'Surah Yasin', 'Surah Al-Baqarah', 'Surah Al-Mulk'],
        correct_answer: 1,
        points: 10,
        explanation: 'Surah Yasin is known as the "Heart of the Quran".',
      },
      {
        question: 'What is Tajweed?',
        type: 'multiple_choice',
        options: [
          'Translation of Quran',
          'Rules of proper Quranic recitation',
          'Understanding Quran meanings',
          'Writing Arabic calligraphy',
        ],
        correct_answer: 1,
        points: 10,
        explanation: 'Tajweed refers to the rules governing the proper pronunciation and recitation of the Quran.',
      },
    );
  } else if (subject === 'arabic') {
    questions.push(
      {
        question: 'How many letters are in the Arabic alphabet?',
        type: 'multiple_choice',
        options: ['26', '28', '30', '32'],
        correct_answer: 1,
        points: 10,
        explanation: 'The Arabic alphabet consists of 28 letters.',
      },
      {
        question: 'Which direction is Arabic written?',
        type: 'multiple_choice',
        options: ['Left to right', 'Right to left', 'Top to bottom', 'Bottom to top'],
        correct_answer: 1,
        points: 10,
        explanation: 'Arabic is written from right to left.',
      },
      {
        question: 'What are the short vowels in Arabic called?',
        type: 'multiple_choice',
        options: ['Harakat', 'Sukun', 'Shadda', 'Tanween'],
        correct_answer: 0,
        points: 10,
        explanation: 'Harakat are the short vowel marks in Arabic (Fatha, Kasra, Damma).',
      },
    );
  } else if (subject === 'fiqh') {
    questions.push(
      {
        question: 'How many obligatory (Fard) prayers are there daily?',
        type: 'multiple_choice',
        options: ['3', '5', '7', '9'],
        correct_answer: 1,
        points: 10,
        explanation: 'Muslims are required to pray five times daily: Fajr, Dhuhr, Asr, Maghrib, and Isha.',
      },
      {
        question: 'What is the minimum amount of wealth (Nisab) upon which Zakat becomes obligatory?',
        type: 'multiple_choice',
        options: [
          'Any amount of savings',
          'Equivalent to 85 grams of gold',
          'Equivalent to 50 grams of gold',
          'No minimum requirement',
        ],
        correct_answer: 1,
        points: 10,
        explanation: 'The Nisab is approximately equivalent to 85 grams of gold or 595 grams of silver.',
      },
      {
        question: 'What percentage of wealth is paid as Zakat?',
        type: 'multiple_choice',
        options: ['1.5%', '2%', '2.5%', '5%'],
        correct_answer: 2,
        points: 10,
        explanation: 'Zakat is 2.5% of qualifying wealth that has been held for one lunar year.',
      },
    );
  } else if (subject === 'hadith') {
    questions.push(
      {
        question: 'Who compiled the famous collection "40 Hadith"?',
        type: 'multiple_choice',
        options: ['Imam Bukhari', 'Imam Muslim', 'Imam Nawawi', 'Imam Tirmidhi'],
        correct_answer: 2,
        points: 10,
        explanation: 'Imam Nawawi compiled the famous "40 Hadith" collection.',
      },
      {
        question: 'What does the term "Sahih" mean when referring to Hadith?',
        type: 'multiple_choice',
        options: ['Weak', 'Authentic', 'Fabricated', 'Uncertain'],
        correct_answer: 1,
        points: 10,
        explanation: '"Sahih" means authentic or sound Hadith with the highest level of authenticity.',
      },
      {
        question: 'Who are the narrators at the beginning of a Hadith chain called?',
        type: 'multiple_choice',
        options: ['Companions', 'Sanad', 'Matn', 'Rawi'],
        correct_answer: 1,
        points: 10,
        explanation: 'The chain of narrators is called "Sanad" or "Isnad".',
      },
    );
  } else {
    questions.push(
      {
        question: 'How many pillars are there in Islam?',
        type: 'multiple_choice',
        options: ['3', '5', '6', '7'],
        correct_answer: 1,
        points: 10,
        explanation: 'There are five pillars of Islam: Shahada, Salah, Zakat, Sawm, and Hajj.',
      },
      {
        question: 'In which month do Muslims fast?',
        type: 'multiple_choice',
        options: ['Rajab', 'Shaban', 'Ramadan', 'Dhul Hijjah'],
        correct_answer: 2,
        points: 10,
        explanation: 'Muslims fast during the holy month of Ramadan.',
      },
      {
        question: 'What is the name of the annual pilgrimage to Mecca?',
        type: 'multiple_choice',
        options: ['Umrah', 'Hajj', 'Tawaf', 'Ziyarah'],
        correct_answer: 1,
        points: 10,
        explanation: 'Hajj is the annual Islamic pilgrimage to Mecca, mandatory for those who are able.',
      },
    );
  }

  while (questions.length < count) {
    questions.push({
      question: `Additional question ${questions.length + 1} for ${subject}`,
      type: 'multiple_choice',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correct_answer: 0,
      points: 10,
      explanation: 'This is a placeholder question. Replace with actual content.',
    });
  }

  return questions.slice(0, count);
}

export interface QuizTemplate {
  title: string;
  slug: string;
  description: string;
  quiz_type: string;
  time_limit_minutes: number;
  passing_score: number;
  max_attempts: number;
  randomize_questions: boolean;
  show_correct_answers: boolean;
  questions: QuizQuestion[];
  total_points: number;
  instructions: string;
}

export interface LessonForQuiz {
  title: string;
  slug: string;
  course?: { age_tier?: string; subject?: string } | null;
}

export function generateQuizForLesson(lesson: LessonForQuiz): QuizTemplate {
  const ageTier = lesson.course?.age_tier;
  const subject = lesson.course?.subject || 'general';
  const isChildrenLesson = ageTier === 'children';
  const questionCount = isChildrenLesson ? 5 : 10;

  const titleLower = lesson.title.toLowerCase();
  const quizType = titleLower.includes('final') || titleLower.includes('assessment') ? 'assessment' : 'practice';

  const questions = generateQuestionsForSubject(subject, questionCount, isChildrenLesson);
  const timeLimit = isChildrenLesson ? 10 : 20;

  return {
    title: `${lesson.title} - Quiz`,
    slug: `${lesson.slug}-quiz`,
    description: `Test your understanding of the concepts covered in ${lesson.title}.`,
    quiz_type: quizType,
    time_limit_minutes: timeLimit,
    passing_score: 70,
    max_attempts: 3,
    randomize_questions: true,
    show_correct_answers: true,
    questions,
    total_points: questions.length * 10,
    instructions: `This quiz covers the material from ${lesson.title}. You have ${timeLimit} minutes to complete ${questions.length} questions. You need 70% to pass. Good luck!`,
  };
}
