/**
 * Course & Lesson Seeder for Masjid At-Taqwa
 * Seeds courses matching the mosque's real educational programs
 *
 * USAGE:
 * 1. Start Strapi: npm run dev
 * 2. Run: npx tsx scripts/seed/seed-courses.ts
 */

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN || '';

const headers: Record<string, string> = {
  'Content-Type': 'application/json',
};
if (API_TOKEN) headers['Authorization'] = `Bearer ${API_TOKEN}`;

async function createCourse(data: Record<string, unknown>): Promise<number | null> {
  const res = await fetch(`${STRAPI_URL}/api/v1/courses`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`  Failed to create course "${data.title}": ${err}`);
    return null;
  }
  const json = await res.json();
  return json.data?.id || json.data?.documentId || null;
}

async function createLesson(data: Record<string, unknown>): Promise<number | null> {
  const res = await fetch(`${STRAPI_URL}/api/v1/lessons`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`  Failed to create lesson "${data.title}": ${err}`);
    return null;
  }
  const json = await res.json();
  return json.data?.id || json.data?.documentId || null;
}

async function createQuiz(data: Record<string, unknown>): Promise<number | null> {
  const res = await fetch(`${STRAPI_URL}/api/v1/quizzes`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ data }),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error(`  Failed to create quiz "${data.title}": ${err}`);
    return null;
  }
  const json = await res.json();
  return json.data?.id || json.data?.documentId || null;
}

// ============================================================================
// COURSE DATA - Based on Masjid At-Taqwa's actual programs
// ============================================================================

const COURSES = [
  {
    title: 'Foundations of Quran Recitation with Tajweed',
    slug: 'foundations-quran-recitation-tajweed',
    description: 'Learn proper Quran recitation from the basics. This course covers Arabic letter pronunciation (Makharij al-Huroof), basic Tajweed rules, and guided practice with Juz Amma surahs. Taught by qualified instructors at Masjid At-Taqwa.',
    age_tier: 'children',
    subject: 'tajweed',
    difficulty: 'beginner',
    duration_weeks: 16,
    schedule: 'Monday-Friday, 4:00-6:00 PM',
    instructor: 'Imam Mohammad Zahirul Islam',
    is_featured: true,
    learning_outcomes: JSON.stringify([
      'Correctly pronounce all Arabic letters from their articulation points',
      'Apply basic Tajweed rules: Noon Sakinah, Meem Sakinah, Madd',
      'Recite Juz Amma surahs with proper Tajweed',
      'Identify and correct common recitation mistakes',
    ]),
    max_students: 25,
    lessons: [
      { title: 'Introduction to Arabic Letters & Makharij', type: 'reading', duration: 45, content: 'Welcome to the Foundations of Quran Recitation. In this lesson, we begin with the Arabic alphabet and the concept of Makharij (articulation points). Each Arabic letter has a specific place in the mouth, throat, or lips where it originates. Mastering these points is the foundation of beautiful Quran recitation.\n\n## The Five Main Articulation Areas\n1. **Al-Jawf (The Oral Cavity)** - Letters of Madd\n2. **Al-Halq (The Throat)** - ه ح خ ع غ\n3. **Al-Lisan (The Tongue)** - Most letters\n4. **Ash-Shafatan (The Lips)** - ب م و\n5. **Al-Khayshoom (The Nasal Passage)** - Ghunnah sounds' },
      { title: 'Throat Letters (Huroof Al-Halq)', type: 'video', duration: 30, content: 'Practice the six throat letters with audio examples and exercises.' },
      { title: 'Tongue Letters - Heavy & Light', type: 'interactive', duration: 40, content: 'Interactive exercise identifying heavy (Tafkheem) and light (Tarqeeq) letters.' },
      { title: 'Noon Sakinah & Tanween Rules', type: 'reading', duration: 50, content: 'Learn the four rules that apply when Noon Sakinah or Tanween is followed by different letters: Ith-haar, Idghaam, Iqlaab, and Ikhfaa.' },
      { title: 'Practice: Surah Al-Fatiha with Tajweed', type: 'practice', duration: 35, content: 'Apply Tajweed rules while reciting Surah Al-Fatiha word by word.' },
      { title: 'Madd Rules (Elongation)', type: 'reading', duration: 45, content: 'Understanding the different types of Madd and when to extend vowel sounds for 2, 4, or 6 counts.' },
      { title: 'Tajweed Assessment - Juz Amma Surahs', type: 'quiz', duration: 20, content: 'Test your knowledge of Tajweed rules covered so far.' },
    ],
  },
  {
    title: 'Tahfeedhul Quran - Memorization Program',
    slug: 'tahfeedhul-quran-memorization',
    description: 'Structured Quran memorization program with proven methodology. Students memorize with proper Tajweed, receive individual attention, and progress through levels. Includes review sessions and regular assessments.',
    age_tier: 'youth',
    subject: 'quran',
    difficulty: 'intermediate',
    duration_weeks: 52,
    schedule: 'Monday-Friday, 4:00-6:00 PM',
    instructor: 'Imam Mohammad Zahirul Islam & Hafez Abdullah Khan',
    is_featured: true,
    learning_outcomes: JSON.stringify([
      'Memorize assigned portions with accurate Tajweed',
      'Develop a consistent daily review schedule',
      'Understand meanings of memorized passages',
      'Recite from memory with confidence and fluency',
    ]),
    max_students: 25,
    lessons: [
      { title: 'Memorization Techniques & Study Plan', type: 'reading', duration: 30, content: 'Learn proven techniques for Quran memorization: repetition method, connection technique, and review cycles.' },
      { title: 'Surah An-Nas - Memorization', type: 'practice', duration: 40, content: 'Begin memorization with Surah An-Nas. Listen, repeat, and memorize verse by verse.' },
      { title: 'Surah Al-Falaq - Memorization', type: 'practice', duration: 40, content: 'Memorize Surah Al-Falaq and review Surah An-Nas.' },
      { title: 'Surah Al-Ikhlas - Memorization & Tafseer', type: 'reading', duration: 45, content: 'Memorize Surah Al-Ikhlas and understand its profound meaning about Tawheed.' },
      { title: 'Review Session - Last 3 Surahs', type: 'practice', duration: 30, content: 'Comprehensive review of An-Nas, Al-Falaq, and Al-Ikhlas.' },
      { title: 'Surah Al-Masad & Al-Kawthar', type: 'practice', duration: 45, content: 'Continue memorization with two more surahs from Juz Amma.' },
    ],
  },
  {
    title: 'Arabic Language for Beginners',
    slug: 'arabic-language-beginners',
    description: 'Learn to read and write Arabic from scratch. This course covers the Arabic alphabet, basic grammar, vocabulary, and reading comprehension with a focus on Quranic Arabic.',
    age_tier: 'adults',
    subject: 'arabic',
    difficulty: 'beginner',
    duration_weeks: 24,
    schedule: 'Wednesday, 6:00-7:30 PM',
    instructor: 'Imam Abdullah Khan',
    is_featured: false,
    learning_outcomes: JSON.stringify([
      'Read and write all Arabic letters in their different forms',
      'Understand basic Arabic grammar (Nahw) concepts',
      'Build a vocabulary of 200+ common Quranic words',
      'Read simple Arabic sentences and short Quran verses',
    ]),
    max_students: 20,
    lessons: [
      { title: 'Arabic Alphabet - Letters Alif to Yaa', type: 'reading', duration: 60, content: 'Introduction to all 28 Arabic letters, their names, shapes, and sounds.' },
      { title: 'Connected Letter Forms', type: 'interactive', duration: 45, content: 'Learn how Arabic letters change shape based on their position in a word.' },
      { title: 'Short Vowels (Harakat)', type: 'reading', duration: 40, content: 'Fathah, Kasrah, Dammah - the three short vowels that give Arabic words their pronunciation.' },
      { title: 'Reading Practice - Simple Words', type: 'practice', duration: 35, content: 'Practice reading common Arabic and Quranic words.' },
      { title: 'Basic Grammar - Nouns & Pronouns', type: 'reading', duration: 50, content: 'Introduction to Arabic nouns (Ism), gender, and personal pronouns.' },
    ],
  },
  {
    title: 'Daily Tafseer - Understanding the Quran',
    slug: 'daily-tafseer-understanding-quran',
    description: 'Deep dive into Quranic interpretation (Tafseer) covering the meaning, context, and application of Quran verses. Taught in English and Bengali, making the Quran accessible to all community members.',
    age_tier: 'adults',
    subject: 'quran',
    difficulty: 'intermediate',
    duration_weeks: 48,
    schedule: 'Daily before Maghrib prayer',
    instructor: 'Imam Mohammad Zahirul Islam',
    is_featured: true,
    learning_outcomes: JSON.stringify([
      'Understand the context of revelation (Asbab an-Nuzul) for key surahs',
      'Connect Quranic teachings to daily life',
      'Identify major themes across different surahs',
      'Apply Quranic guidance to contemporary situations',
    ]),
    max_students: 40,
    lessons: [
      { title: 'Introduction to Tafseer Sciences', type: 'reading', duration: 45, content: 'What is Tafseer? Understanding the methodology of Quran interpretation, the role of Hadith in Tafseer, and the qualifications of a Mufassir.' },
      { title: 'Surah Al-Fatiha - The Opening', type: 'reading', duration: 60, content: 'Deep analysis of the most recited surah: its names, virtues, and comprehensive meaning. Why it is called "Umm al-Quran" (Mother of the Quran).' },
      { title: 'Surah Al-Baqarah - Guidance for Humanity', type: 'reading', duration: 60, content: 'Overview of the longest surah: its themes of faith, law, history, and the story of the cow.' },
      { title: 'Stories of the Prophets in the Quran', type: 'video', duration: 55, content: 'How the Quran tells the stories of previous prophets and what lessons we can derive.' },
    ],
  },
  {
    title: 'Shari\'ah & Aqeedah Foundations',
    slug: 'shariah-aqeedah-foundations',
    description: 'Comprehensive study of Islamic creed (Aqeedah) and jurisprudence (Fiqh). Covers the six pillars of faith, five pillars of Islam, and practical rulings for daily worship.',
    age_tier: 'adults',
    subject: 'aqeedah',
    difficulty: 'beginner',
    duration_weeks: 20,
    schedule: 'Contact for details',
    instructor: 'Imam Abdullah Khan',
    is_featured: false,
    learning_outcomes: JSON.stringify([
      'Articulate the six pillars of Iman with evidence',
      'Understand the conditions and pillars of Salah',
      'Know the basic Fiqh of Zakah, Sawm, and Hajj',
      'Identify and avoid common mistakes in worship',
    ]),
    max_students: 40,
    lessons: [
      { title: 'Pillars of Iman - Belief in Allah', type: 'reading', duration: 50, content: 'The first and most important pillar: Belief in Allah - His existence, oneness, names, and attributes.' },
      { title: 'Pillars of Iman - Angels, Books, Prophets', type: 'reading', duration: 50, content: 'Understanding our belief in angels, divine books, and the prophets of Allah.' },
      { title: 'Fiqh of Salah - Conditions & Pillars', type: 'reading', duration: 60, content: 'The conditions that must be met before prayer, and the essential pillars (Arkan) of Salah.' },
      { title: 'Fiqh of Zakah & Sawm', type: 'reading', duration: 55, content: 'Who must pay Zakah, how to calculate it, and the rules and virtues of fasting.' },
    ],
  },
  {
    title: 'Seerah - Life of Prophet Muhammad (PBUH)',
    slug: 'seerah-life-prophet-muhammad',
    description: 'Study the biography of Prophet Muhammad (peace be upon him) from birth to the establishment of the first Muslim community. Learn leadership lessons, character traits, and how to follow the Prophetic example.',
    age_tier: 'youth',
    subject: 'seerah',
    difficulty: 'beginner',
    duration_weeks: 16,
    schedule: 'Friday, 7:00-8:30 PM (after Maghrib)',
    instructor: 'Youth coordinators',
    is_featured: false,
    learning_outcomes: JSON.stringify([
      'Know the major events of the Prophet\'s life in chronological order',
      'Extract leadership and character lessons from the Seerah',
      'Understand the social and political context of early Islam',
      'Apply Prophetic character traits in daily life',
    ]),
    max_students: 30,
    lessons: [
      { title: 'Arabia Before Islam', type: 'reading', duration: 40, content: 'The state of the Arabian Peninsula before the Prophet\'s mission: tribal society, religious practices, and the need for guidance.' },
      { title: 'Birth & Early Life', type: 'reading', duration: 45, content: 'The year of the Elephant, the Prophet\'s lineage, and his upbringing as an orphan.' },
      { title: 'The First Revelation', type: 'video', duration: 40, content: 'The night in Cave Hira, the descent of Jibreel, and the first verses of Surah Al-Alaq.' },
      { title: 'The Early Muslims & Persecution', type: 'reading', duration: 50, content: 'The first believers, the persecution they faced, and the migration to Abyssinia.' },
      { title: 'The Hijrah to Madinah', type: 'reading', duration: 50, content: 'The journey that changed history: planning, dangers, and the establishment of the first Muslim state.' },
    ],
  },
  {
    title: 'Islamic Manners & Character (Akhlaq)',
    slug: 'islamic-manners-character-akhlaq',
    description: 'Building beautiful Islamic character for young Muslims. Learn about honesty, kindness, respect for parents, and the manners taught by Prophet Muhammad (peace be upon him).',
    age_tier: 'children',
    subject: 'akhlaq',
    difficulty: 'beginner',
    duration_weeks: 12,
    schedule: 'Saturday, 10:00 AM-1:00 PM',
    instructor: 'Weekend School teachers',
    is_featured: false,
    learning_outcomes: JSON.stringify([
      'Practice the Sunnah greetings and daily duas',
      'Understand the importance of truthfulness and trustworthiness',
      'Show respect to parents, teachers, and elders',
      'Demonstrate kindness to classmates and neighbors',
    ]),
    max_students: 30,
    lessons: [
      { title: 'The Prophet\'s Beautiful Character', type: 'reading', duration: 30, content: 'Allah says: "And indeed, you are of a great moral character" (Quran 68:4). Learn why the Prophet is our best role model.' },
      { title: 'Honesty & Truthfulness (Sidq)', type: 'interactive', duration: 25, content: 'Stories and activities about telling the truth, even when it\'s hard.' },
      { title: 'Respecting Parents & Elders', type: 'reading', duration: 25, content: 'What the Quran and Hadith teach us about honoring our parents.' },
      { title: 'Kindness to Others', type: 'interactive', duration: 30, content: 'The Prophet said: "The best among you are those who have the best manners and character." Activities on showing kindness.' },
    ],
  },
  {
    title: 'Hadith Studies - Nawawi\'s 40 Hadith',
    slug: 'hadith-studies-nawawi-40',
    description: 'Study the foundational collection of 40 Hadith compiled by Imam An-Nawawi. Each hadith covers a fundamental principle of Islam with detailed explanation and practical application.',
    age_tier: 'adults',
    subject: 'hadith',
    difficulty: 'intermediate',
    duration_weeks: 20,
    schedule: 'Tuesday & Thursday, 7:30-9:00 PM',
    instructor: 'Imam Mohammad Zahirul Islam',
    is_featured: false,
    learning_outcomes: JSON.stringify([
      'Memorize key hadith from Nawawi\'s 40 collection',
      'Understand the chain of narration (Isnad) for each hadith',
      'Extract practical rulings and lessons',
      'Apply hadith teachings to contemporary Muslim life',
    ]),
    max_students: 40,
    lessons: [
      { title: 'Hadith 1: Actions are by Intentions', type: 'reading', duration: 50, content: 'The hadith of Umar ibn al-Khattab: "Actions are judged by intentions." This foundational hadith affects every aspect of worship and daily life.' },
      { title: 'Hadith 2: Islam, Iman, Ihsan', type: 'reading', duration: 55, content: 'The Hadith of Jibreel: the three levels of the religion - Islam (submission), Iman (faith), and Ihsan (excellence).' },
      { title: 'Hadith 3: The Five Pillars of Islam', type: 'reading', duration: 45, content: 'Islam is built upon five: the testimony of faith, prayer, zakah, fasting Ramadan, and Hajj.' },
      { title: 'Hadith 5: Rejection of Innovations', type: 'reading', duration: 50, content: '"Whoever introduces something into this matter of ours that is not from it will have it rejected."' },
    ],
  },
];

// ============================================================================
// QUIZ DATA for Tajweed course
// ============================================================================

const TAJWEED_QUIZ = {
  title: 'Tajweed Rules Assessment - Module 1',
  slug: 'tajweed-rules-assessment-1',
  description: 'Test your understanding of Makharij, Noon Sakinah rules, and Madd.',
  quiz_type: 'assessment',
  time_limit_minutes: 15,
  passing_score: 70,
  max_attempts: 3,
  randomize_questions: true,
  show_correct_answers: true,
  total_points: 50,
  instructions: 'Answer all questions. You need 70% to pass. You have 3 attempts.',
  questions: JSON.stringify([
    {
      id: 'q1',
      question: 'How many main articulation areas (Makharij) are there for Arabic letters?',
      question_type: 'multiple_choice',
      options: ['3', '4', '5', '7'],
      correct_answer: 2,
      points: 10,
      explanation: 'There are 5 main articulation areas: Al-Jawf, Al-Halq, Al-Lisan, Ash-Shafatan, Al-Khayshoom.',
    },
    {
      id: 'q2',
      question: 'What is the rule when Noon Sakinah is followed by the letter Ba (ب)?',
      question_type: 'multiple_choice',
      options: ['Ith-haar', 'Idghaam', 'Iqlaab', 'Ikhfaa'],
      correct_answer: 2,
      points: 10,
      explanation: 'Iqlaab means the Noon changes to a Meem sound before the letter Ba.',
    },
    {
      id: 'q3',
      question: 'Madd Al-Asli (Natural Madd) is extended for how many counts?',
      question_type: 'multiple_choice',
      options: ['1 count', '2 counts', '4 counts', '6 counts'],
      correct_answer: 1,
      points: 10,
      explanation: 'Natural Madd is always extended for 2 counts (harakaat).',
    },
    {
      id: 'q4',
      question: 'The letter Qaf (ق) is pronounced from the throat.',
      question_type: 'true_false',
      options: ['True', 'False'],
      correct_answer: 1,
      points: 10,
      explanation: 'False. Qaf is pronounced from the back of the tongue touching the soft palate, not the throat.',
    },
    {
      id: 'q5',
      question: 'How many letters cause Ith-haar (clear pronunciation) when following Noon Sakinah?',
      question_type: 'multiple_choice',
      options: ['4', '6', '8', '15'],
      correct_answer: 1,
      points: 10,
      explanation: 'There are 6 throat letters that cause Ith-haar: ء ه ع ح غ خ',
    },
  ]),
};

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log('🕌 Seeding Courses for Masjid At-Taqwa LMS...\n');

  try {
    const health = await fetch(`${STRAPI_URL}/_health`);
    if (!health.ok) throw new Error();
  } catch {
    console.error('Strapi is not running. Start it with: npm run dev');
    process.exit(1);
  }

  let coursesCreated = 0;
  let lessonsCreated = 0;
  let quizzesCreated = 0;

  for (const courseData of COURSES) {
    const { lessons, ...course } = courseData;
    console.log(`\n📚 Creating course: ${course.title}`);

    const courseId = await createCourse(course);
    if (!courseId) continue;
    coursesCreated++;
    console.log(`  ✅ Course created (id: ${courseId})`);

    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i];
      const lessonData: Record<string, unknown> = {
        title: lesson.title,
        slug: lesson.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        description: lesson.content.substring(0, 200),
        lesson_order: i + 1,
        lesson_type: lesson.type,
        duration_minutes: lesson.duration,
        content: lesson.content,
        is_free: i === 0, // First lesson is free preview
        is_preview: i === 0,
        course: courseId,
      };

      const lessonId = await createLesson(lessonData);
      if (lessonId) {
        lessonsCreated++;
        console.log(`    📖 Lesson ${i + 1}: ${lesson.title}`);

        // Add quiz to the Tajweed assessment lesson
        if (lesson.type === 'quiz' && course.slug === 'foundations-quran-recitation-tajweed') {
          const quizId = await createQuiz({
            ...TAJWEED_QUIZ,
            lesson: lessonId,
          });
          if (quizId) {
            quizzesCreated++;
            console.log(`    🧪 Quiz attached: ${TAJWEED_QUIZ.title}`);
          }
        }
      }
    }
  }

  console.log(`\n🏁 Done!`);
  console.log(`   Courses: ${coursesCreated}`);
  console.log(`   Lessons: ${lessonsCreated}`);
  console.log(`   Quizzes: ${quizzesCreated}`);
}

main().catch(console.error);
