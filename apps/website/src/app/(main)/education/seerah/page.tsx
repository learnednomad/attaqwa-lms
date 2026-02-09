/**
 * Seerah Course Listing Page
 * Displays all 8 modules of the authentic Seerah curriculum
 */

import { Metadata } from 'next';
import { SeerahModules } from '@/components/education/seerah-modules';
import { SeerahProgress } from '@/components/education/seerah-progress';
import { Suspense } from 'react';
import { BookOpen, Award, Clock, Users, Scroll, Globe, GraduationCap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Seerah Curriculum - Masjid At-Taqwa',
  description: 'Study the authentic biography of Prophet Muhammad ﷺ based on The Sealed Nectar, Ibn Kathir, and Al-Baghawi',
};

export default function SeerahPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-700 mb-3">
            Masjid At-Taqwa
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
            Authentic Seerah Curriculum
          </h1>
          <p className="text-base text-neutral-500 max-w-2xl mx-auto leading-relaxed mb-6">
            Study the biography of Prophet Muhammad ﷺ through authentic sources:
            The Sealed Nectar, Ibn Kathir&apos;s Al-Bidayah wan-Nihayah, and Imam al-Baghawi&apos;s works.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span className="text-sm text-neutral-600">8 Comprehensive Modules</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span className="text-sm text-neutral-600">60+ Hours of Content</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span className="text-sm text-neutral-600">Certificate Upon Completion</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-600" />
              <span className="text-sm text-neutral-600">All Age Groups</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        {/* Progress Overview */}
        <section className="py-10">
          <Suspense fallback={<ProgressSkeleton />}>
            <SeerahProgress />
          </Suspense>
        </section>

        {/* Course Modules */}
        <section className="pb-10">
          <Suspense fallback={<ModulesSkeleton />}>
            <SeerahModules />
          </Suspense>
        </section>

        {/* Course Features */}
        <section className="pb-10">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Course Features</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FeatureCard
              title="Authentic Sources Only"
              description="Every narration is verified from classical sources with proper authentication"
              icon={<Scroll className="h-4 w-4 text-emerald-600" />}
            />
            <FeatureCard
              title="Interactive Quizzes"
              description="Test your knowledge with quizzes after each module"
              icon={<BookOpen className="h-4 w-4 text-emerald-600" />}
            />
            <FeatureCard
              title="Progress Tracking"
              description="Track your learning journey with detailed progress metrics"
              icon={<Award className="h-4 w-4 text-emerald-600" />}
            />
            <FeatureCard
              title="Bilingual Content"
              description="Key terms and references provided in Arabic with translation"
              icon={<Globe className="h-4 w-4 text-emerald-600" />}
            />
            <FeatureCard
              title="Age-Appropriate"
              description="Content adapted for different age groups and learning levels"
              icon={<Users className="h-4 w-4 text-emerald-600" />}
            />
            <FeatureCard
              title="Certificates"
              description="Earn a verifiable certificate upon successful completion"
              icon={<GraduationCap className="h-4 w-4 text-emerald-600" />}
            />
          </div>
        </section>

        {/* Learning Methodology */}
        <section className="pb-20">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Our Learning Methodology</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
            <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
              <p>
                This curriculum follows strict Islamic jurisprudential standards, using only authenticated
                narrations from the most reliable classical sources. We avoid weak narrations and clearly
                distinguish between established facts and scholarly discussions.
              </p>
              <p>
                Each module includes detailed lesson plans, assessment materials, interactive activities,
                and extensive source quotations. The content is designed to build both knowledge and love
                for the Prophet ﷺ while maintaining academic integrity.
              </p>
              <p className="font-medium text-emerald-700">
                May Allah accept this effort and make it beneficial for the Ummah.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function FeatureCard({ title, description, icon }: {
  title: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-3">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-neutral-900 mb-1">{title}</h3>
      <p className="text-xs text-neutral-500 leading-relaxed">{description}</p>
    </div>
  );
}

function ProgressSkeleton() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 animate-pulse">
      <div className="h-6 bg-neutral-100 rounded w-1/3 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-neutral-100 rounded w-full"></div>
        <div className="h-12 bg-neutral-100 rounded"></div>
      </div>
    </div>
  );
}

function ModulesSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border border-neutral-200 bg-white p-6 animate-pulse">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="h-6 bg-neutral-100 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-neutral-100 rounded w-full"></div>
            </div>
            <div className="h-10 w-24 bg-neutral-100 rounded"></div>
          </div>
          <div className="h-20 bg-neutral-100 rounded"></div>
        </div>
      ))}
    </div>
  );
}
