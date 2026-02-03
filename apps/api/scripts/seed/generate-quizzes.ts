/**
 * Quiz Generator
 * Generates comprehensive quizzes for Islamic content lessons
 */

import { QuranSurah } from './fetch-quran';
import { generateSlug } from '../utils/content-processor';

export interface QuizQuestion {
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  question: string;
  options?: string[]; // For multiple choice
  correct_answer: string;
  explanation: string;
  points: number;
}

export interface QuizData {
  title: string;
  slug: string;
  description: string;
  quiz_type: 'practice' | 'assessment' | 'final';
  time_limit_minutes: number | null;
  passing_score: number;
  max_attempts: number | null;
  randomize_questions: boolean;
  show_correct_answers: boolean;
  questions: QuizQuestion[];
  total_points: number;
  instructions: string;
  publishedAt: Date;
}

/**
 * Generate quiz for a Surah (Beginner level)
 */
export function generateSurahQuiz(surah: QuranSurah, lessonTitle: string, difficultyMultiplier: number = 1): QuizData {
  const questions: QuizQuestion[] = [];

  // Multiple Choice Questions (40%)
  questions.push(...generateSurahMCQ(surah));

  // True/False Questions (30%)
  questions.push(...generateSurahTrueFalse(surah));

  // Short Answer Questions (30%)
  questions.push(...generateSurahShortAnswer(surah));

  // Adjust question count based on difficulty
  const targetQuestions = Math.floor(15 * difficultyMultiplier);
  const selectedQuestions = questions.slice(0, targetQuestions);

  const totalPoints = selectedQuestions.reduce((sum, q) => sum + q.points, 0);

  return {
    title: `Quiz: ${lessonTitle}`,
    slug: generateSlug(`quiz ${lessonTitle}`),
    description: `Test your knowledge of ${lessonTitle}. This quiz covers the meaning, themes, and lessons from this Surah.`,
    quiz_type: 'practice',
    time_limit_minutes: Math.ceil(targetQuestions * 1.5), // 1.5 minutes per question
    passing_score: 70,
    max_attempts: 3,
    randomize_questions: true,
    show_correct_answers: true,
    questions: selectedQuestions,
    total_points: totalPoints,
    instructions: `
      <p>Answer all questions to the best of your ability. You have ${Math.ceil(targetQuestions * 1.5)} minutes to complete this quiz.</p>
      <ul>
        <li>Read each question carefully</li>
        <li>You can review your answers before submitting</li>
        <li>You have up to 3 attempts to pass with 70% or higher</li>
        <li>Correct answers will be shown after submission</li>
      </ul>
    `,
    publishedAt: new Date()
  };
}

/**
 * Generate Multiple Choice Questions for a Surah
 */
function generateSurahMCQ(surah: QuranSurah): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  // Q1: About Surah name and meaning
  questions.push({
    type: 'multiple_choice',
    question: `What does "${surah.englishName}" mean in English?`,
    options: [
      surah.englishNameTranslation,
      generateIncorrectTranslation(),
      generateIncorrectTranslation(),
      generateIncorrectTranslation()
    ],
    correct_answer: surah.englishNameTranslation,
    explanation: `Surah ${surah.englishName} means "${surah.englishNameTranslation}".`,
    points: 5
  });

  // Q2: About revelation type
  questions.push({
    type: 'multiple_choice',
    question: `Where was Surah ${surah.englishName} revealed?`,
    options: shuffleArray([
      surah.revelationType === 'Meccan' ? 'Mecca' : 'Medina',
      surah.revelationType === 'Meccan' ? 'Medina' : 'Mecca',
      'Jerusalem',
      'Taif'
    ]),
    correct_answer: surah.revelationType === 'Meccan' ? 'Mecca' : 'Medina',
    explanation: `Surah ${surah.englishName} is a ${surah.revelationType} Surah, revealed in ${surah.revelationType === 'Meccan' ? 'Mecca' : 'Medina'}.`,
    points: 5
  });

  // Q3: About verse count
  questions.push({
    type: 'multiple_choice',
    question: `How many verses does Surah ${surah.englishName} have?`,
    options: shuffleArray([
      surah.numberOfAyahs.toString(),
      (surah.numberOfAyahs + 5).toString(),
      (surah.numberOfAyahs - 3).toString(),
      (surah.numberOfAyahs + 10).toString()
    ]),
    correct_answer: surah.numberOfAyahs.toString(),
    explanation: `Surah ${surah.englishName} contains ${surah.numberOfAyahs} verses.`,
    points: 5
  });

  // Q4: About Surah position
  questions.push({
    type: 'multiple_choice',
    question: `What is the position of Surah ${surah.englishName} in the Quran?`,
    options: shuffleArray([
      `Surah ${surah.number}`,
      `Surah ${Math.max(1, surah.number - 5)}`,
      `Surah ${Math.min(114, surah.number + 5)}`,
      `Surah ${Math.min(114, surah.number + 10)}`
    ]),
    correct_answer: `Surah ${surah.number}`,
    explanation: `Surah ${surah.englishName} is the ${surah.number}${getOrdinalSuffix(surah.number)} Surah in the Quran.`,
    points: 5
  });

  // Q5: Thematic question
  questions.push({
    type: 'multiple_choice',
    question: `What is a main theme discussed in Surah ${surah.englishName}?`,
    options: shuffleArray([
      getThemeForSurah(surah.number),
      'Business transactions',
      'Agricultural practices',
      'Scientific discoveries'
    ]),
    correct_answer: getThemeForSurah(surah.number),
    explanation: `Surah ${surah.englishName} primarily discusses ${getThemeForSurah(surah.number).toLowerCase()}.`,
    points: 10
  });

  // Q6: Practical application
  questions.push({
    type: 'multiple_choice',
    question: `When should you recite Surah ${surah.englishName}?`,
    options: shuffleArray([
      'In daily prayers and for remembrance of Allah',
      'Only during Ramadan',
      'Only on Fridays',
      'Only during Hajj'
    ]),
    correct_answer: 'In daily prayers and for remembrance of Allah',
    explanation: `Quranic Surahs can be recited anytime, especially in prayers and for drawing closer to Allah.`,
    points: 10
  });

  return questions;
}

/**
 * Generate True/False Questions for a Surah
 */
function generateSurahTrueFalse(surah: QuranSurah): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  // Q1: About revelation
  questions.push({
    type: 'true_false',
    question: `Surah ${surah.englishName} was revealed in ${surah.revelationType === 'Meccan' ? 'Mecca' : 'Medina'}. True or False?`,
    correct_answer: 'true',
    explanation: `This is TRUE. Surah ${surah.englishName} is a ${surah.revelationType} Surah.`,
    points: 5
  });

  // Q2: About verse count
  const wrongCount = surah.numberOfAyahs + 10;
  questions.push({
    type: 'true_false',
    question: `Surah ${surah.englishName} has ${wrongCount} verses. True or False?`,
    correct_answer: 'false',
    explanation: `This is FALSE. Surah ${surah.englishName} actually has ${surah.numberOfAyahs} verses.`,
    points: 5
  });

  // Q3: About Quran position
  questions.push({
    type: 'true_false',
    question: `Surah ${surah.englishName} is the ${surah.number}${getOrdinalSuffix(surah.number)} Surah in the Quran. True or False?`,
    correct_answer: 'true',
    explanation: `This is TRUE. Surah ${surah.englishName} is Surah number ${surah.number} in the Quran.`,
    points: 5
  });

  // Q4: About importance
  questions.push({
    type: 'true_false',
    question: `Every Surah in the Quran, including ${surah.englishName}, contains important guidance from Allah. True or False?`,
    correct_answer: 'true',
    explanation: `This is TRUE. Every verse and Surah in the Quran is divinely revealed and contains guidance for humanity.`,
    points: 5
  });

  // Q5: About recitation
  questions.push({
    type: 'true_false',
    question: `Surah ${surah.englishName} can only be recited during specific times of day. True or False?`,
    correct_answer: 'false',
    explanation: `This is FALSE. Quranic Surahs can be recited at any time, though certain times (like after Fajr) are more virtuous.`,
    points: 5
  });

  return questions;
}

/**
 * Generate Short Answer Questions for a Surah
 */
function generateSurahShortAnswer(surah: QuranSurah): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  // Q1: Meaning
  questions.push({
    type: 'short_answer',
    question: `What does the name "${surah.englishName}" mean?`,
    correct_answer: surah.englishNameTranslation,
    explanation: `The name ${surah.englishName} means "${surah.englishNameTranslation}".`,
    points: 10
  });

  // Q2: Main lesson
  questions.push({
    type: 'short_answer',
    question: `What is one main lesson you learned from Surah ${surah.englishName}?`,
    correct_answer: 'Any valid lesson about faith, guidance, or righteous conduct',
    explanation: `Acceptable answers include lessons about Tawheed, following Allah's guidance, being patient, showing gratitude, or any theme present in the Surah.`,
    points: 15
  });

  // Q3: Application
  questions.push({
    type: 'short_answer',
    question: `How can you apply the teachings of Surah ${surah.englishName} in your daily life?`,
    correct_answer: 'Any practical application related to the Surah\'s themes',
    explanation: `Good answers demonstrate understanding of the Surah's message and show how to implement it practically in daily actions and behavior.`,
    points: 15
  });

  // Q4: Reflection
  questions.push({
    type: 'short_answer',
    question: `Why is it important to understand the meaning of the Quran, not just recite it?`,
    correct_answer: 'To implement Allah\'s guidance and draw closer to Him',
    explanation: `Understanding the Quran helps us implement its teachings, strengthens our faith, and guides us to live as Allah wants us to live.`,
    points: 10
  });

  return questions;
}

/**
 * Generate Assessment Quiz (higher difficulty)
 */
export function generateAssessmentQuiz(content: string, title: string, questionCount: number = 20): QuizData {
  // Assessment quizzes are more challenging and comprehensive
  return {
    title: `Assessment: ${title}`,
    slug: generateSlug(`assessment ${title}`),
    description: `Comprehensive assessment covering all material from ${title}. Tests deep understanding and application.`,
    quiz_type: 'assessment',
    time_limit_minutes: Math.ceil(questionCount * 2),
    passing_score: 75,
    max_attempts: 2,
    randomize_questions: true,
    show_correct_answers: false, // Don't show answers immediately for assessments
    questions: [],
    total_points: questionCount * 5,
    instructions: `
      <p>This is a comprehensive assessment. Answer all questions carefully.</p>
      <ul>
        <li>You have ${Math.ceil(questionCount * 2)} minutes to complete this assessment</li>
        <li>You have 2 attempts to achieve 75% or higher</li>
        <li>Questions test understanding, not just memorization</li>
        <li>Correct answers will be shown after your final attempt</li>
      </ul>
    `,
    publishedAt: new Date()
  };
}

/**
 * Utility functions
 */

function generateIncorrectTranslation(): string {
  const translations = [
    'The Opening',
    'The Light',
    'The Victory',
    'The Mercy',
    'The Guidance',
    'The Wisdom',
    'The Journey',
    'The Believers',
    'The Righteous',
    'The Blessed'
  ];
  return translations[Math.floor(Math.random() * translations.length)];
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}

function getThemeForSurah(surahNumber: number): string {
  const themes: { [key: number]: string } = {
    1: 'Praise and supplication to Allah',
    2: 'Guidance for believers and disbelievers',
    12: 'The story of Prophet Yusuf (Joseph)',
    18: 'Stories and wisdom including the People of the Cave',
    19: 'The story of Maryam (Mary) and Prophet Isa (Jesus)',
    36: 'The Oneness of Allah and resurrection',
    55: 'The countless bounties of Allah',
    67: 'Allah\'s sovereignty and the purpose of creation',
    112: 'The absolute Oneness and uniqueness of Allah',
    113: 'Seeking Allah\'s protection from evil',
    114: 'Seeking Allah\'s protection from whispers of Satan'
  };

  return themes[surahNumber] || 'Faith, guidance, and righteous conduct';
}
