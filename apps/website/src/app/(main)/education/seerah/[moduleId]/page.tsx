/**
 * Individual Seerah Module Page
 * Displays module content, chapters, and quiz
 *
 * Updated for Next.js 16: params is now async
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SeerahModuleContent } from '@/components/education/seerah-module-content';

interface PageProps {
  params: Promise<{
    moduleId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { moduleId } = await params;
  // In production, fetch module data to generate proper metadata
  return {
    title: `Seerah Module - Masjid At-Taqwa`,
    description: 'Study authentic Seerah with comprehensive lessons and assessments',
  };
}

export default async function SeerahModulePage({ params }: PageProps) {
  const { moduleId } = await params;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <SeerahModuleContent moduleId={moduleId} />
    </div>
  );
}