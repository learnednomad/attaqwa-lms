/**
 * Starter templates per lesson type. One click pre-fills the form so
 * authors don't stare at an empty canvas. Keep these short, opinionated,
 * and easy to edit.
 */

import type { LessonType } from '@/components/lessons/lesson-type-badge';

export interface LessonTemplate {
  name: string;
  description: string;
  // Form defaults (merged into LessonForm initialData).
  initial: {
    title?: string;
    description?: string;
    duration_minutes?: number;
    content?: string;
  };
}

export const LESSON_TEMPLATES: Record<LessonType, LessonTemplate> = {
  video: {
    name: 'Video walkthrough',
    description: 'Embed a recorded lecture with a transcript placeholder.',
    initial: {
      title: 'Untitled video lesson',
      description: 'A short video introducing the topic, with a transcript for accessibility.',
      duration_minutes: 15,
    },
  },
  reading: {
    name: 'Reading with reflection',
    description: 'Tafseer-style article ending with reflection questions.',
    initial: {
      title: 'Untitled reading',
      description: 'A short reading followed by 2–3 reflection prompts.',
      duration_minutes: 12,
      content: [
        '# Introduction',
        '',
        'Write a short intro that sets context for the learner.',
        '',
        '## Key points',
        '',
        '- Point one',
        '- Point two',
        '- Point three',
        '',
        '## Reflection',
        '',
        '1. What did you learn?',
        '2. How can you apply this in daily life?',
        '3. What question remains?',
      ].join('\n'),
    },
  },
  interactive: {
    name: 'Guided interactive',
    description: 'Scaffold for an interactive lesson with check-in prompts.',
    initial: {
      title: 'Untitled interactive lesson',
      description: 'Students work through an activity with periodic check-ins.',
      duration_minutes: 20,
    },
  },
  quiz: {
    name: 'Short quiz',
    description: 'Five-question formative assessment starter.',
    initial: {
      title: 'Untitled quiz',
      description: 'Five multiple-choice questions checking understanding of the topic.',
      duration_minutes: 10,
    },
  },
  practice: {
    name: 'Practice drill',
    description: 'Memorization or pronunciation drill with a target outcome.',
    initial: {
      title: 'Untitled practice drill',
      description: 'Repeat the target passage until fluent. Record yourself and compare.',
      duration_minutes: 15,
    },
  },
};
