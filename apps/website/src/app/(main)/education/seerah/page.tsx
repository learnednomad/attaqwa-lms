/**
 * Seerah Course Listing Page
 * Displays all 8 modules of the authentic Seerah curriculum
 */

import { Metadata } from 'next';
import { SeerahModules } from '@/components/education/seerah-modules';
import { SeerahProgress } from '@/components/education/seerah-progress';
import { Suspense } from 'react';
import { BookOpen, Award, Clock, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Seerah Curriculum - Masjid At-Taqwa',
  description: 'Study the authentic biography of Prophet Muhammad ﷺ based on The Sealed Nectar, Ibn Kathir, and Al-Baghawi',
};

export default function SeerahPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-islamic-green-50 to-islamic-gold-50 rounded-2xl p-8 mb-8">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-bold text-islamic-navy mb-4 font-['Amiri']">
            Authentic Seerah Curriculum
          </h1>
          <p className="text-lg text-islamic-navy/80 mb-6">
            Study the biography of Prophet Muhammad ﷺ through authentic sources: 
            The Sealed Nectar, Ibn Kathir&apos;s Al-Bidayah wan-Nihayah, and Imam al-Baghawi&apos;s works.
          </p>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-islamic-green-600" />
              <span className="text-sm font-medium">8 Comprehensive Modules</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-islamic-green-600" />
              <span className="text-sm font-medium">60+ Hours of Content</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-islamic-green-600" />
              <span className="text-sm font-medium">Certificate Upon Completion</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-islamic-green-600" />
              <span className="text-sm font-medium">All Age Groups</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <Suspense fallback={<ProgressSkeleton />}>
        <SeerahProgress />
      </Suspense>

      {/* Course Modules */}
      <Suspense fallback={<ModulesSkeleton />}>
        <SeerahModules />
      </Suspense>

      {/* Course Features */}
      <div className="mt-12 bg-white rounded-xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-islamic-navy mb-6">Course Features</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            title="Authentic Sources Only"
            description="Every narration is verified from classical sources with proper authentication"
            icon="📚"
          />
          <FeatureCard
            title="Interactive Quizzes"
            description="Test your knowledge with quizzes after each module"
            icon="📝"
          />
          <FeatureCard
            title="Progress Tracking"
            description="Track your learning journey with detailed progress metrics"
            icon="📊"
          />
          <FeatureCard
            title="Bilingual Content"
            description="Key terms and references provided in Arabic with translation"
            icon="🌍"
          />
          <FeatureCard
            title="Age-Appropriate"
            description="Content adapted for different age groups and learning levels"
            icon="👨‍👩‍👧‍👦"
          />
          <FeatureCard
            title="Certificates"
            description="Earn a verifiable certificate upon successful completion"
            icon="🏆"
          />
        </div>
      </div>

      {/* Learning Methodology */}
      <div className="mt-8 bg-islamic-green-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-islamic-navy mb-4">Our Learning Methodology</h2>
        <div className="space-y-4 text-islamic-navy/80">
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
          <p className="font-semibold text-islamic-green-700">
            May Allah accept this effort and make it beneficial for the Ummah.
          </p>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, description, icon }: { 
  title: string; 
  description: string; 
  icon: string;
}) {
  return (
    <div className="flex gap-4">
      <span className="text-3xl">{icon}</span>
      <div>
        <h3 className="font-semibold text-islamic-navy mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function ProgressSkeleton() {
  return (
    <div className="bg-white rounded-xl p-6 mb-8 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-12 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

function ModulesSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="h-10 w-24 bg-gray-200 rounded"></div>
          </div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}