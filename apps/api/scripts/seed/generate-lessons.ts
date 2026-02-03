/**
 * Lesson Generator
 * Generates lessons from Quran and Tafseer data
 */

import { QuranSurah, QuranJuz } from './fetch-quran';
import { TafseerEntry, generateTafseerContent } from './fetch-tafseer';
import { generateSlug, toRichText, estimateReadingTime, truncate } from '../utils/content-processor';

export interface LessonData {
  title: string;
  slug: string;
  description: string;
  lesson_order: number;
  lesson_type: 'video' | 'reading' | 'interactive' | 'quiz' | 'practice';
  duration_minutes: number;
  content: string;
  video_url: string | null;
  interactive_content: any | null;
  learning_objectives: string[];
  prerequisites: string | null;
  is_free: boolean;
  is_preview: boolean;
  publishedAt: Date;
}

/**
 * Generate lessons for Children's Beginner Quran (Short Surahs)
 */
export function generateChildrenLessons(shortSurahs: QuranSurah[]): LessonData[] {
  const lessons: LessonData[] = [];

  shortSurahs.forEach((surah, index) => {
    const content = generateChildFriendlyContent(surah);

    lessons.push({
      title: `${surah.englishName} - ${surah.englishNameTranslation}`,
      slug: generateSlug(`${surah.englishName} ${surah.englishNameTranslation}`),
      description: `Learn Surah ${surah.englishName} (${surah.englishNameTranslation}) - A beautiful short Surah with ${surah.numberOfAyahs} verses. Perfect for children to memorize and understand.`,
      lesson_order: index + 1,
      lesson_type: 'reading',
      duration_minutes: Math.max(5, Math.min(15, surah.numberOfAyahs * 2)),
      content,
      video_url: null,
      interactive_content: {
        ayah_count: surah.numberOfAyahs,
        surah_number: surah.number,
        recitation_available: true,
        memorization_tips: true
      },
      learning_objectives: [
        `Recite Surah ${surah.englishName} correctly`,
        `Understand the basic meaning`,
        `Learn when to recite this Surah`,
        `Memorize for daily prayers`
      ],
      prerequisites: index === 0 ? null : `Completion of previous Surah lessons`,
      is_free: index < 5, // First 5 lessons free
      is_preview: index < 2, // First 2 as preview
      publishedAt: new Date()
    });
  });

  return lessons;
}

/**
 * Generate child-friendly content
 */
function generateChildFriendlyContent(surah: QuranSurah): string {
  let content = `<h1>Surah ${surah.englishName}</h1>\n`;
  content += `<h2>${surah.englishNameTranslation}</h2>\n\n`;

  content += `<div class="info-box">\n`;
  content += `<p><strong>Number:</strong> ${surah.number}</p>\n`;
  content += `<p><strong>Verses:</strong> ${surah.numberOfAyahs}</p>\n`;
  content += `<p><strong>Revealed in:</strong> ${surah.revelationType === 'Meccan' ? 'Mecca' : 'Medina'}</p>\n`;
  content += `</div>\n\n`;

  content += `<h3>Arabic Text</h3>\n`;
  content += `<div class="arabic-text" style="font-size: 1.5em; direction: rtl; font-family: 'Amiri', serif;">\n`;
  content += `<p>${surah.arabicText}</p>\n`;
  content += `</div>\n\n`;

  content += `<h3>English Translation</h3>\n`;
  content += toRichText(surah.englishTranslation);
  content += `\n\n`;

  content += `<h3>What This Surah Teaches Us</h3>\n`;
  content += `<p><em>Listen to your teacher's explanation about the important lessons in this Surah.</em></p>\n\n`;

  content += `<h3>Tips for Memorization</h3>\n`;
  content += `<ul>\n`;
  content += `<li>Listen to the recitation multiple times</li>\n`;
  content += `<li>Repeat each verse 5-10 times</li>\n`;
  content += `<li>Practice before sleeping and after waking up</li>\n`;
  content += `<li>Recite to your parents or teacher</li>\n`;
  content += `</ul>\n`;

  return content;
}

/**
 * Generate lessons for Beginner Quran (All Surahs)
 */
export function generateBeginnerLessons(surahs: QuranSurah[], ageGroup: 'youth' | 'adults' | 'seniors'): LessonData[] {
  const lessons: LessonData[] = [];

  surahs.forEach((surah, index) => {
    const content = generateBeginnerContent(surah, ageGroup);
    const readingTime = estimateReadingTime(surah.englishTranslation);

    lessons.push({
      title: `Surah ${surah.number}: ${surah.englishName} (${surah.englishNameTranslation})`,
      slug: generateSlug(`surah ${surah.number} ${surah.englishName}`),
      description: `Study Surah ${surah.englishName} - "${surah.englishNameTranslation}". ${surah.revelationType} Surah with ${surah.numberOfAyahs} verses. Explore the meaning, context, and guidance from this chapter of the Holy Quran.`,
      lesson_order: index + 1,
      lesson_type: 'reading',
      duration_minutes: Math.max(10, Math.min(30, readingTime + 5)),
      content,
      video_url: null,
      interactive_content: {
        surah_number: surah.number,
        ayah_count: surah.numberOfAyahs,
        revelation_type: surah.revelationType,
        juz: surah.ayahs[0].juz,
        recitation_available: true
      },
      learning_objectives: [
        `Understand the meaning of Surah ${surah.englishName}`,
        `Learn the historical context and revelation`,
        `Identify key themes and messages`,
        `Apply Quranic guidance to daily life`
      ],
      prerequisites: index === 0 ? null : null, // All can be studied independently
      is_free: index < 10, // First 10 Surahs free
      is_preview: index < 3,
      publishedAt: new Date()
    });
  });

  return lessons;
}

/**
 * Generate beginner content
 */
function generateBeginnerContent(surah: QuranSurah, ageGroup: string): string {
  let content = `<h1>Surah ${surah.number}: ${surah.englishName}</h1>\n`;
  content += `<h2>${surah.englishNameTranslation}</h2>\n\n`;

  content += `<div class="surah-info">\n`;
  content += `<ul>\n`;
  content += `<li><strong>Name:</strong> ${surah.englishName} (${surah.name})</li>\n`;
  content += `<li><strong>Meaning:</strong> ${surah.englishNameTranslation}</li>\n`;
  content += `<li><strong>Verses:</strong> ${surah.numberOfAyahs}</li>\n`;
  content += `<li><strong>Revelation:</strong> ${surah.revelationType}</li>\n`;
  content += `<li><strong>Juz:</strong> ${surah.ayahs[0].juz}</li>\n`;
  content += `</ul>\n`;
  content += `</div>\n\n`;

  content += `<h3>Arabic Text with Translation</h3>\n\n`;

  // Add first few verses as example
  const verseCount = Math.min(5, surah.numberOfAyahs);
  for (let i = 0; i < verseCount; i++) {
    const ayah = surah.ayahs[i];
    content += `<div class="ayah-block">\n`;
    content += `<div class="arabic-text" style="font-size: 1.8em; direction: rtl; font-family: 'Amiri', serif;">\n`;
    content += `<p>${ayah.text} ﴿${ayah.numberInSurah}﴾</p>\n`;
    content += `</div>\n`;
    content += `<div class="translation">\n`;
    content += `<p><em>${ayah.translation}</em></p>\n`;
    content += `</div>\n`;
    content += `</div>\n\n`;
  }

  if (surah.numberOfAyahs > 5) {
    content += `<p><em>... [Complete Arabic text and translation available in full lesson] ...</em></p>\n\n`;
  }

  content += `<h3>Key Themes</h3>\n`;
  content += `<p><em>This Surah discusses important themes of faith, guidance, and righteous conduct. Study the complete text to understand all the lessons Allah has provided in this chapter.</em></p>\n\n`;

  content += `<h3>Reflection Questions</h3>\n`;
  content += `<ul>\n`;
  content += `<li>What is the main message of this Surah?</li>\n`;
  content += `<li>How can you apply this guidance in your daily life?</li>\n`;
  content += `<li>What does this Surah teach about your relationship with Allah?</li>\n`;
  content += `</ul>\n`;

  return content;
}

/**
 * Generate lessons for Intermediate Quran (Juz-based with Tafseer)
 */
export function generateIntermediateLessons(
  juzArray: QuranJuz[],
  surahs: QuranSurah[],
  tafseerData: Map<number, TafseerEntry>,
  ageGroup: 'youth' | 'adults' | 'seniors'
): LessonData[] {
  const lessons: LessonData[] = [];

  juzArray.forEach((juz, index) => {
    const surahsInJuz = juz.surahs.map(num => surahs.find(s => s.number === num)!).filter(Boolean);
    const content = generateIntermediateContent(juz, surahsInJuz, tafseerData);
    const readingTime = estimateReadingTime(juz.englishTranslation) + 10; // Extra time for Tafseer

    lessons.push({
      title: `Juz ${juz.number}: Comprehensive Study with Tafseer`,
      slug: generateSlug(`juz ${juz.number} tafseer`),
      description: `Deep study of Juz ${juz.number} containing ${surahsInJuz.map(s => s.englishName).join(', ')}. Includes Quranic text, translation, and classical Tafseer Ibn Kathir for comprehensive understanding. ${juz.ayahCount} verses total.`,
      lesson_order: index + 1,
      lesson_type: 'reading',
      duration_minutes: Math.max(20, Math.min(40, readingTime)),
      content,
      video_url: null,
      interactive_content: {
        juz_number: juz.number,
        surah_numbers: juz.surahs,
        ayah_count: juz.ayahCount,
        tafseer_included: true,
        notes_enabled: true
      },
      learning_objectives: [
        `Complete understanding of Juz ${juz.number}`,
        `Knowledge of classical Tafseer interpretations`,
        `Understanding of Asbab al-Nuzul (reasons for revelation)`,
        `Ability to derive lessons and apply to life`,
        `Connection to broader Quranic themes`
      ],
      prerequisites: index === 0 ? 'Basic Quran knowledge' : `Completion of previous Juz lessons`,
      is_free: index < 3,
      is_preview: index < 1,
      publishedAt: new Date()
    });
  });

  return lessons;
}

/**
 * Generate intermediate content with Tafseer
 */
function generateIntermediateContent(
  juz: QuranJuz,
  surahsInJuz: QuranSurah[],
  tafseerData: Map<number, TafseerEntry>
): string {
  let content = `<h1>Juz ${juz.number} - Comprehensive Study</h1>\n\n`;

  content += `<div class="juz-info">\n`;
  content += `<p><strong>Juz Number:</strong> ${juz.number}</p>\n`;
  content += `<p><strong>Total Verses:</strong> ${juz.ayahCount}</p>\n`;
  content += `<p><strong>Surahs Included:</strong> ${surahsInJuz.map(s => s.englishName).join(', ')}</p>\n`;
  content += `</div>\n\n`;

  surahsInJuz.forEach(surah => {
    content += `<h2>Surah ${surah.number}: ${surah.englishName} (${surah.englishNameTranslation})</h2>\n\n`;

    content += `<h3>Quranic Text and Translation</h3>\n`;
    content += `<p><em>Study the complete Arabic text with English translation in your Quran.</em></p>\n\n`;

    const tafseer = tafseerData.get(surah.number);
    if (tafseer) {
      content += `<h3>Tafseer Ibn Kathir</h3>\n`;
      content += `<div class="tafseer-content">\n`;
      content += toRichText(truncate(tafseer.tafseerText, 2000));
      content += `\n<p><em>[Full Tafseer available in complete lesson view]</em></p>\n`;
      content += `</div>\n\n`;
    }

    content += `<h3>Key Points and Lessons</h3>\n`;
    content += `<ul>\n`;
    content += `<li>Historical context and revelation circumstances</li>\n`;
    content += `<li>Main themes and messages</li>\n`;
    content += `<li>Legal rulings and guidance</li>\n`;
    content += `<li>Spiritual lessons and wisdom</li>\n`;
    content += `</ul>\n\n`;
  });

  content += `<h2>Study Questions</h2>\n`;
  content += `<ol>\n`;
  content += `<li>What are the main themes covered in this Juz?</li>\n`;
  content += `<li>How do the Surahs in this Juz relate to each other?</li>\n`;
  content += `<li>What legal rulings or guidance can you extract?</li>\n`;
  content += `<li>How does the Tafseer enhance your understanding?</li>\n`;
  content += `<li>What practical applications can you make in your life?</li>\n`;
  content += `</ol>\n`;

  return content;
}

/**
 * Generate lessons for Advanced Quran (Thematic with comparative Tafseer)
 */
export function generateAdvancedLessons(
  themes: any,
  surahs: QuranSurah[],
  ibnKathirData: Map<number, TafseerEntry>,
  baghawiData: Map<number, TafseerEntry>
): LessonData[] {
  const lessons: LessonData[] = [];
  let lessonOrder = 1;

  Object.entries(themes).forEach(([themeKey, themeData]: [string, any]) => {
    const themeSurahs = themeData.surahs
      .map((num: number) => surahs.find(s => s.number === num))
      .filter(Boolean);

    const content = generateAdvancedContent(themeData, themeSurahs, ibnKathirData, baghawiData);

    lessons.push({
      title: `${themeData.name}: Thematic Quranic Study`,
      slug: generateSlug(`theme ${themeData.name}`),
      description: themeData.description + ` Comparative analysis using Tafseer Ibn Kathir and al-Baghawi. Advanced study covering ${themeSurahs.length} related Surahs.`,
      lesson_order: lessonOrder++,
      lesson_type: 'reading',
      duration_minutes: Math.max(35, Math.min(50, themeSurahs.length * 5 + 20)),
      content,
      video_url: null,
      interactive_content: {
        theme: themeKey,
        surah_count: themeSurahs.length,
        comparative_tafseer: true,
        research_mode: true,
        annotation_enabled: true
      },
      learning_objectives: [
        `Master the Quranic perspective on ${themeData.name}`,
        `Compare different Tafseer methodologies`,
        `Develop skills in thematic Quranic research`,
        `Understand scholarly discussions and opinions`,
        `Apply advanced knowledge to contemporary issues`
      ],
      prerequisites: 'Intermediate Quran knowledge and basic Arabic recommended',
      is_free: lessonOrder <= 2,
      is_preview: lessonOrder === 1,
      publishedAt: new Date()
    });
  });

  return lessons;
}

/**
 * Generate advanced thematic content
 */
function generateAdvancedContent(
  themeData: any,
  themeSurahs: QuranSurah[],
  ibnKathirData: Map<number, TafseerEntry>,
  baghawiData: Map<number, TafseerEntry>
): string {
  let content = `<h1>${themeData.name}</h1>\n`;
  content += `<p class="lead">${themeData.description}</p>\n\n`;

  content += `<h2>Quranic Framework</h2>\n`;
  content += `<p>This theme is explored across ${themeSurahs.length} Surahs of the Holy Quran, each providing unique perspectives and guidance:</p>\n\n`;

  content += `<ul>\n`;
  themeSurahs.forEach(surah => {
    content += `<li><strong>Surah ${surah.number} (${surah.englishName}):</strong> ${surah.englishNameTranslation} - ${surah.numberOfAyahs} verses</li>\n`;
  });
  content += `</ul>\n\n`;

  content += `<h2>Comparative Tafseer Analysis</h2>\n`;
  content += `<p>We examine this theme through two classical Tafseer works:</p>\n\n`;

  themeSurahs.slice(0, 3).forEach(surah => {
    content += `<h3>From Surah ${surah.englishName}</h3>\n\n`;

    const ibnKathir = ibnKathirData.get(surah.number);
    if (ibnKathir) {
      content += `<h4>Ibn Kathir's Perspective</h4>\n`;
      content += `<div class="tafseer-excerpt">\n`;
      content += toRichText(truncate(ibnKathir.tafseerText, 1000));
      content += `</div>\n\n`;
    }

    const baghawi = baghawiData.get(surah.number);
    if (baghawi) {
      content += `<h4>Al-Baghawi's Perspective</h4>\n`;
      content += `<div class="tafseer-excerpt">\n`;
      content += toRichText(truncate(baghawi.tafseerText, 1000));
      content += `</div>\n\n`;
    }
  });

  content += `<h2>Synthesis and Modern Application</h2>\n`;
  content += `<p><em>Through this thematic study, we develop a comprehensive understanding that can be applied to contemporary challenges and questions.</em></p>\n\n`;

  content += `<h2>Research Questions</h2>\n`;
  content += `<ol>\n`;
  content += `<li>How do different Surahs complement each other on this theme?</li>\n`;
  content += `<li>What similarities and differences exist between the two Tafseer approaches?</li>\n`;
  content += `<li>How have scholars understood this theme throughout Islamic history?</li>\n`;
  content += `<li>What contemporary applications can be derived?</li>\n`;
  content += `<li>How does this theme relate to other Islamic sciences (Fiqh, Aqeedah, etc.)?</li>\n`;
  content += `</ol>\n`;

  return content;
}
