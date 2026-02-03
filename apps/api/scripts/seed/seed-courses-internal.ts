/**
 * Internal Course Seeder using Strapi Entity Service
 * Creates 15 Islamic education courses using Strapi's internal API
 */

import { compileStrapi } from '@strapi/strapi';

let strapi: any;

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

async function seedCourses() {
  console.log('🚀 Starting internal course seeding...\n');

  try {
    // Initialize Strapi
    console.log('📦 Initializing Strapi...');
    const appContext: any = await compileStrapi();
    strapi = await appContext.start();
    console.log('✅ Strapi initialized\n');

    let created = 0;
    let skipped = 0;

    console.log('📚 Creating courses using internal API...\n');

    for (const course of courses) {
      try {
        const existing = await strapi.db.query('api::course.course').findOne({
          where: { slug: course.slug }
        });

        if (existing) {
          console.log(`ℹ️  Skipped: ${course.title} (already exists)`);
          skipped++;
          continue;
        }

        await strapi.entityService.create('api::course.course', {
          data: {
            ...course,
            publishedAt: new Date()
          }
        });

        created++;
        console.log(`✓ Created: ${course.title}`);
      } catch (error: any) {
        console.error(`✗ Error creating ${course.title}:`, error.message);
      }
    }

    console.log('\n📊 Course Creation Summary:');
    console.log(`   Created: ${created} courses`);
    console.log(`   Skipped: ${skipped} courses`);
    console.log(`   Total: ${courses.length} courses\n`);

    console.log('✅ Course seeding complete!');
    console.log('🔗 Start Strapi and visit http://localhost:1337/admin to manage courses\n');

  } catch (error: any) {
    console.error('\n❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    if (strapi) {
      await strapi.destroy();
    }
  }
}

seedCourses()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
