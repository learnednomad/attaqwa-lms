'use client';

import { StudentLayout } from '@/components/layout/student-layout';
import { QuizContent } from '@/components/education/QuizContent';

export default function StudentQuizPage() {
  return (
    <StudentLayout title="Quiz" subtitle="Take a quiz">
      <QuizContent lessonUrlPrefix="/student/lessons" />
    </StudentLayout>
  );
}
