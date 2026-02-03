/**
 * Strapi Bootstrap
 * Auto-configure API permissions for development
 */

/**
 * Seed courses if database is empty
 */
async function seedCoursesIfEmpty(strapi: any) {
  try {
    const existingCourses = await strapi.entityService.findMany('api::course.course', {
      limit: 1,
    });

    if (existingCourses && existingCourses.length > 0) {
      console.log(`📚 ${existingCourses.length > 0 ? 'Courses already exist' : 'No courses found'}, skipping seed`);
      return;
    }

    console.log('📚 Seeding 15 Islamic education courses...');

    const courses = [
      {
        title: "My First Quran - Short Surahs for Kids",
        slug: "my-first-quran-short-surahs-for-kids",
        description: "An engaging introduction to the Holy Quran designed specifically for children. Learn beautiful short Surahs from Juz 30 with simple explanations and audio recitations.",
        age_tier: "children",
        subject: "quran",
        difficulty: "beginner",
        duration_weeks: 12,
        schedule: "2 lessons per week, 10-15 minutes each",
        instructor: "Attaqwa Masjid Education Team",
        is_featured: true,
        learning_outcomes: ["Memorize 30+ short Surahs", "Understand simple meanings", "Develop love for Quran"]
      },
      {
        title: "Arabic Alphabet Adventure",
        slug: "arabic-alphabet-adventure",
        description: "Fun and interactive course teaching children the Arabic alphabet through games, songs, and colorful activities.",
        age_tier: "children",
        subject: "arabic",
        difficulty: "beginner",
        duration_weeks: 8,
        schedule: "3 lessons per week, 20 minutes each",
        instructor: "Ustadh Omar Hassan",
        is_featured: false,
        learning_outcomes: ["Master Arabic letters", "Read simple words", "Write basic Arabic"]
      },
      {
        title: "Stories of the Prophets for Kids",
        slug: "stories-of-the-prophets-for-kids",
        description: "Captivating stories from the lives of prophets, teaching moral values and Islamic lessons through engaging narratives.",
        age_tier: "children",
        subject: "seerah",
        difficulty: "beginner",
        duration_weeks: 16,
        schedule: "1 lesson per week, 25 minutes each",
        instructor: "Sister Fatima Rahman",
        is_featured: true,
        learning_outcomes: ["Learn prophets' stories", "Understand moral lessons", "Build Islamic character"]
      },
      {
        title: "Complete Quran Study - Beginner Level",
        slug: "complete-quran-study-beginner-level",
        description: "Comprehensive journey through the entire Quran with clear English translations and contextual understanding. Study all 114 Surahs systematically.",
        age_tier: "youth",
        subject: "quran",
        difficulty: "beginner",
        duration_weeks: 52,
        schedule: "3 Surahs per week, 15-20 minutes each",
        instructor: "Imam Abdul-Rahman",
        is_featured: true,
        learning_outcomes: ["Complete Quran reading", "Understand key themes", "Connect guidance to modern life"]
      },
      {
        title: "Tajweed Fundamentals",
        slug: "tajweed-fundamentals",
        description: "Master the rules of Quranic recitation with proper pronunciation, makharij, and beautification techniques.",
        age_tier: "youth",
        subject: "tajweed",
        difficulty: "intermediate",
        duration_weeks: 20,
        schedule: "2 lessons per week, 30 minutes each",
        instructor: "Qari Abdullah Khan",
        is_featured: true,
        learning_outcomes: ["Master Tajweed rules", "Perfect pronunciation", "Beautiful recitation"]
      },
      {
        title: "Arabic Grammar Essentials",
        slug: "arabic-grammar-essentials",
        description: "Learn Classical Arabic grammar (Nahw and Sarf) to understand Quranic Arabic and read Islamic texts with confidence.",
        age_tier: "youth",
        subject: "arabic",
        difficulty: "intermediate",
        duration_weeks: 24,
        schedule: "2 lessons per week, 40 minutes each",
        instructor: "Dr. Ahmad Khalil",
        is_featured: false,
        learning_outcomes: ["Understand Arabic grammar", "Read Quranic Arabic", "Analyze Islamic texts"]
      },
      {
        title: "Fiqh of Worship",
        slug: "fiqh-of-worship",
        description: "Detailed study of Islamic jurisprudence covering prayer, fasting, zakat, and hajj according to authentic sources.",
        age_tier: "adults",
        subject: "fiqh",
        difficulty: "intermediate",
        duration_weeks: 30,
        schedule: "2 lessons per week, 45 minutes each",
        instructor: "Sheikh Muhammad Ali",
        is_featured: true,
        learning_outcomes: ["Master worship rulings", "Understand evidence", "Apply fiqh correctly"]
      },
      {
        title: "Hadith Studies - 40 Nawawi",
        slug: "hadith-studies-40-nawawi",
        description: "In-depth study of Imam Nawawi's 40 Hadith collection, covering fundamental Islamic principles and prophetic wisdom.",
        age_tier: "adults",
        subject: "hadith",
        difficulty: "intermediate",
        duration_weeks: 20,
        schedule: "2 hadiths per week, 30 minutes each",
        instructor: "Dr. Aisha Mahmoud",
        is_featured: true,
        learning_outcomes: ["Memorize 40 hadith", "Understand prophetic wisdom", "Apply teachings daily"]
      },
      {
        title: "Islamic Creed (Aqeedah)",
        slug: "islamic-creed-aqeedah",
        description: "Comprehensive study of Islamic belief system, pillars of faith, and protection from innovations in religion.",
        age_tier: "adults",
        subject: "aqeedah",
        difficulty: "advanced",
        duration_weeks: 26,
        schedule: "1 lesson per week, 60 minutes each",
        instructor: "Sheikh Abdullah Yousef",
        is_featured: false,
        learning_outcomes: ["Master Islamic belief", "Understand pillars of faith", "Protect from innovations"]
      },
      {
        title: "Prophetic Biography (Seerah)",
        slug: "prophetic-biography-seerah",
        description: "Detailed chronological study of Prophet Muhammad's (ﷺ) life, battles, treaties, and lessons for modern Muslims.",
        age_tier: "adults",
        subject: "seerah",
        difficulty: "intermediate",
        duration_weeks: 36,
        schedule: "1 lesson per week, 50 minutes each",
        instructor: "Dr. Ibrahim Hassan",
        is_featured: true,
        learning_outcomes: ["Know Prophet's life", "Learn from battles", "Apply lessons today"]
      },
      {
        title: "Islamic Ethics and Character",
        slug: "islamic-ethics-and-character",
        description: "Study of Islamic morality, character development, and practical application of prophetic manners in daily life.",
        age_tier: "adults",
        subject: "akhlaq",
        difficulty: "beginner",
        duration_weeks: 16,
        schedule: "1 lesson per week, 35 minutes each",
        instructor: "Sister Zainab Ahmad",
        is_featured: false,
        learning_outcomes: ["Develop good character", "Practice prophetic manners", "Build ethical life"]
      },
      {
        title: "Tafseer of Juz Amma",
        slug: "tafseer-of-juz-amma",
        description: "Detailed explanation of the 30th Juz of the Quran with historical context, linguistic analysis, and practical application.",
        age_tier: "adults",
        subject: "quran",
        difficulty: "advanced",
        duration_weeks: 28,
        schedule: "2 lessons per week, 45 minutes each",
        instructor: "Sheikh Hassan Malik",
        is_featured: true,
        learning_outcomes: ["Deep Quran understanding", "Historical context", "Practical application"]
      },
      {
        title: "Senior's Quran Circle",
        slug: "seniors-quran-circle",
        description: "Gentle-paced Quran study designed for seniors, focusing on reflection, memorization, and spiritual connection.",
        age_tier: "seniors",
        subject: "quran",
        difficulty: "beginner",
        duration_weeks: 40,
        schedule: "2 lessons per week, 20 minutes each",
        instructor: "Imam Ali Rahman",
        is_featured: true,
        learning_outcomes: ["Reflect on Quran", "Gentle memorization", "Spiritual connection"]
      },
      {
        title: "Islamic History Highlights",
        slug: "islamic-history-highlights",
        description: "Journey through Islamic history from the early Caliphate to modern times, understanding key events and personalities.",
        age_tier: "seniors",
        subject: "seerah",
        difficulty: "beginner",
        duration_weeks: 32,
        schedule: "1 lesson per week, 40 minutes each",
        instructor: "Dr. Omar Abdullah",
        is_featured: false,
        learning_outcomes: ["Know Islamic history", "Understand key events", "Learn from past"]
      },
      {
        title: "Practical Fiqh for Daily Life",
        slug: "practical-fiqh-for-daily-life",
        description: "Essential Islamic rulings for everyday situations, covering family, business, and social interactions.",
        age_tier: "adults",
        subject: "fiqh",
        difficulty: "beginner",
        duration_weeks: 18,
        schedule: "2 lessons per week, 30 minutes each",
        instructor: "Sheikh Yusuf Ibrahim",
        is_featured: true,
        learning_outcomes: ["Apply fiqh daily", "Understand family rulings", "Navigate business Islamically"]
      }
    ];

    let created = 0;
    for (const course of courses) {
      try {
        await strapi.entityService.create('api::course.course', {
          data: {
            ...course,
            publishedAt: new Date(),
          },
        });
        created++;
      } catch (error: any) {
        console.error(`   ✗ Failed to create ${course.title}:`, error.message);
      }
    }

    console.log(`✅ Created ${created} courses\n`);
  } catch (error: any) {
    console.error('❌ Course seeding error:', error.message);
  }
}

/**
 * Get lesson templates based on course subject and age tier
 */
function getLessonTemplatesForCourse(course: any) {
  const isChildrenCourse = course.age_tier === 'children';
  const duration = isChildrenCourse ? 10 : 20;

  // Base lessons common to all courses
  const lessons = [
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

  // Add subject-specific lessons
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
      }
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
      }
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
      }
    );
  } else {
    // Generic lessons for other subjects
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
      }
    );
  }

  // Add final assessment lesson
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

/**
 * Seed lessons for courses
 */
async function seedLessonsIfEmpty(strapi: any) {
  try {
    const existingLessons = await strapi.entityService.findMany('api::lesson.lesson', {
      limit: 1,
    });

    if (existingLessons && existingLessons.length > 0) {
      console.log(`📖 Lessons already exist, skipping seed`);
      return;
    }

    console.log('📖 Seeding lessons for courses...');

    // Get all courses
    const courses = await strapi.entityService.findMany('api::course.course', {
      limit: 100,
    });

    if (!courses || courses.length === 0) {
      console.log('   ⚠️  No courses found, skipping lesson seeding');
      return;
    }

    let created = 0;

    // Create 3-5 lessons per course
    for (const course of courses) {
      const lessonTemplates = getLessonTemplatesForCourse(course);

      for (const [index, template] of lessonTemplates.entries()) {
        try {
          await strapi.entityService.create('api::lesson.lesson', {
            data: {
              ...template,
              lesson_order: index + 1,
              course: course.documentId,
              publishedAt: new Date(),
            },
          });
          created++;
        } catch (error: any) {
          console.error(`   ✗ Failed to create lesson for ${course.title}:`, error.message);
        }
      }
    }

    console.log(`✅ Created ${created} lessons\n`);
  } catch (error: any) {
    console.error('❌ Lesson seeding error:', error.message);
  }
}

/**
 * Generate questions based on subject
 */
function generateQuestionsForSubject(subject: string, count: number, isChildren: boolean) {
  const questions: any[] = [];

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
      }
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
      }
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
      }
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
      }
    );
  } else {
    // Generic Islamic knowledge questions
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
      }
    );
  }

  // Fill remaining questions with subject-appropriate content
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

/**
 * Generate quiz content based on lesson
 */
function generateQuizForLesson(lesson: any) {
  const course = lesson.course;
  const isChildrenLesson = course?.age_tier === 'children';
  const questionCount = isChildrenLesson ? 5 : 10;

  // Determine quiz type based on lesson title
  let quizType = 'practice';
  if (lesson.title.toLowerCase().includes('final') || lesson.title.toLowerCase().includes('assessment')) {
    quizType = 'assessment';
  }

  // Generate questions based on subject
  const questions = generateQuestionsForSubject(course?.subject || 'general', questionCount, isChildrenLesson);

  return {
    title: `${lesson.title} - Quiz`,
    slug: `${lesson.slug}-quiz`,
    description: `Test your understanding of the concepts covered in ${lesson.title}.`,
    quiz_type: quizType,
    time_limit_minutes: isChildrenLesson ? 10 : 20,
    passing_score: 70,
    max_attempts: 3,
    randomize_questions: true,
    show_correct_answers: true,
    questions: questions,
    total_points: questions.length * 10,
    instructions: `This quiz covers the material from ${lesson.title}. You have ${isChildrenLesson ? 10 : 20} minutes to complete ${questions.length} questions. You need ${70}% to pass. Good luck!`,
  };
}

/**
 * Seed quizzes for lessons
 */
async function seedQuizzesIfEmpty(strapi: any) {
  try {
    const existingQuizzes = await strapi.entityService.findMany('api::quiz.quiz', {
      limit: 1,
    });

    if (existingQuizzes && existingQuizzes.length > 0) {
      console.log(`📝 Quizzes already exist, skipping seed`);
      return;
    }

    console.log('📝 Seeding quizzes for lessons...');

    // Get all lessons with quiz type
    const allLessons = await strapi.entityService.findMany('api::lesson.lesson', {
      limit: 200,
      populate: ['course'],
    });

    if (!allLessons || allLessons.length === 0) {
      console.log('   ⚠️  No lessons found, skipping quiz seeding');
      return;
    }

    // Filter lessons that should have quizzes (quiz type or assessment lessons)
    const quizLessons = allLessons.filter(
      (lesson: any) =>
        lesson.lesson_type === 'quiz' ||
        lesson.title.toLowerCase().includes('assessment') ||
        lesson.title.toLowerCase().includes('review')
    );

    let created = 0;

    for (const lesson of quizLessons) {
      try {
        const quiz = generateQuizForLesson(lesson);

        await strapi.entityService.create('api::quiz.quiz', {
          data: {
            ...quiz,
            lesson: lesson.documentId,
            publishedAt: new Date(),
          },
        });
        created++;
      } catch (error: any) {
        console.error(`   ✗ Failed to create quiz for ${lesson.title}:`, error.message);
      }
    }

    console.log(`✅ Created ${created} quizzes\n`);
  } catch (error: any) {
    console.error('❌ Quiz seeding error:', error.message);
  }
}

/**
 * Main bootstrap function
 */
export default async ({ strapi }: { strapi: any }) => {
  console.log('\n🔧 Running bootstrap configuration...');

  try {
    // Configure public permissions for development
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (publicRole) {
      console.log('📝 Configuring public API permissions...');

      // Define permissions to enable
      const permissionsToEnable = [
        { controller: 'course', actions: ['find', 'findOne', 'create'] },
        { controller: 'lesson', actions: ['find', 'findOne', 'create'] },
        { controller: 'quiz', actions: ['find', 'findOne', 'create'] },
        { controller: 'achievement', actions: ['find', 'findOne'] },
        { controller: 'course-enrollment', actions: ['find', 'findOne', 'create'] },
        { controller: 'user-progress', actions: ['find', 'findOne', 'create', 'update'] },
      ];

      for (const { controller, actions } of permissionsToEnable) {
        for (const action of actions) {
          try {
            const actionName = `api::${controller}.${controller}.${action}`;

            // Find the permission
            const permission = await strapi.query('plugin::users-permissions.permission').findOne({
              where: {
                role: publicRole.id,
                action: actionName,
              },
            });

            if (permission) {
              // Update it if it exists
              await strapi.query('plugin::users-permissions.permission').update({
                where: { id: permission.id },
                data: { enabled: true },
              });
            } else {
              // Create it if it doesn't exist
              await strapi.query('plugin::users-permissions.permission').create({
                data: {
                  action: actionName,
                  role: publicRole.id,
                  enabled: true,
                },
              });
            }
          } catch (error) {
            console.error(`   ✗ Failed to configure ${controller}.${action}:`, error.message);
          }
        }
      }

      console.log('✅ Public permissions configured');
      console.log('   Enabled: find, findOne, create for Course, Lesson, Quiz');
      console.log('   ⚠️  Remember to disable create permissions in production!\n');
    }

    // Log available content types
    const contentTypes = Object.keys(strapi.contentTypes).filter(key =>
      key.startsWith('api::')
    );
    console.log(`📚 Available content types: ${contentTypes.length}`);
    contentTypes.forEach(ct => console.log(`   - ${ct}`));

    // Check for comprehensive seed data JSON files
    const fs = await import('fs');
    const path = await import('path');
    // From dist/src/bootstrap.js → ../../src/seed-data
    const seedDataDir = path.join(__dirname, '../../src/seed-data');
    const useComprehensiveSeed = fs.existsSync(seedDataDir) &&
                                 fs.readdirSync(seedDataDir).some((file: string) => file.endsWith('.json'));

    if (useComprehensiveSeed) {
      console.log('📚 Comprehensive seed data detected, using JSON files...');

      // Check if database is empty
      const existingCourses = await strapi.entityService.findMany('api::course.course', {
        limit: 1,
      });

      if (existingCourses && existingCourses.length > 0) {
        console.log(`📚 Courses already exist (${existingCourses.length}), skipping comprehensive seed`);
      } else {
        try {
          const module = await import('../scripts/seed/import-comprehensive-seed.js');
          await module.runComprehensiveSeed(strapi);
        } catch (error: any) {
          console.warn('⚠️  Could not load comprehensive seed, falling back to template seeding:', error.message);
          await seedCoursesIfEmpty(strapi);
          await seedLessonsIfEmpty(strapi);
          await seedQuizzesIfEmpty(strapi);
        }
      }
    } else {
      console.log('📝 Using template-based seeding...');
      // Seed courses if none exist
      await seedCoursesIfEmpty(strapi);

      // Seed lessons for existing courses
      await seedLessonsIfEmpty(strapi);

      // Seed quizzes for some lessons
      await seedQuizzesIfEmpty(strapi);
    }

    console.log('\n✅ Bootstrap complete\n');
  } catch (error) {
    console.error('❌ Bootstrap error:', error);
  }
};
