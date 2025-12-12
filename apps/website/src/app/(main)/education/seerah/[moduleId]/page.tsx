/**
 * Individual Seerah Module Page
 * Displays module content, chapters, and quiz
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SeerahModuleContent } from '@/components/education/seerah-module-content';

interface PageProps {
  params: {
    moduleId: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // In production, fetch module data to generate proper metadata
  return {
    title: `Seerah Module - Masjid At-Taqwa`,
    description: 'Study authentic Seerah with comprehensive lessons and assessments',
  };
}

export default function SeerahModulePage({ params }: PageProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <SeerahModuleContent moduleId={params.moduleId} />
    </div>
  );
}