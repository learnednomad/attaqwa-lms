import { Metadata } from 'next';
import Link from 'next/link';
import {
  Heart,
  Star,
  HandHelping,
  Droplets,
  Languages,
  Moon,
  DoorOpen,
  BookOpen,
  History,
  Utensils,
  Users,
  HelpCircle,
  Download,
  Clock,
  Calendar,
  ChevronRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'New Muslim Guide | Masjid At-Taqwa',
  description:
    'A comprehensive guide for new Muslims covering the Shahada, Five Pillars, prayer, wudu, Ramadan, and more. Download free PDF resources for your journey.',
};

const topics = [
  {
    slug: 'shahada',
    title: 'The Shahada (Declaration of Faith)',
    description:
      'Understanding the testimony of faith — the first and most important step in becoming a Muslim.',
    icon: Heart,
    points: [
      'Meaning of La ilaha illallah Muhammadur Rasulullah',
      'How to pronounce the Shahada correctly',
      'What the Shahada means for your daily life',
      'The spiritual significance of this declaration',
    ],
  },
  {
    slug: 'five-pillars',
    title: 'The Five Pillars of Islam',
    description:
      'The foundational acts of worship that every Muslim practices — the pillars that support your faith.',
    icon: Star,
    points: [
      'Shahada, Salah, Zakat, Sawm, and Hajj',
      'How each pillar strengthens your connection to Allah',
      'Practical ways to begin practicing each pillar',
      'Common questions new Muslims have about the pillars',
    ],
  },
  {
    slug: 'how-to-pray',
    title: 'How to Pray (Salah)',
    description:
      'A step-by-step guide to performing the five daily prayers — the most important act of worship.',
    icon: HandHelping,
    points: [
      'The five daily prayer times and their names',
      'Step-by-step movements and recitations',
      'What to recite in Arabic with transliteration',
      'Common mistakes and how to correct them',
    ],
  },
  {
    slug: 'wudu',
    title: 'Wudu (Ablution)',
    description:
      'Learn the purification ritual performed before prayer — a beautiful act of spiritual cleansing.',
    icon: Droplets,
    points: [
      'Step-by-step wudu procedure with illustrations',
      'What breaks your wudu and requires renewal',
      'The spiritual meaning behind each washing',
      'Tayammum — the dry alternative when water is unavailable',
    ],
  },
  {
    slug: 'basic-arabic-duas',
    title: 'Basic Arabic & Duas',
    description:
      'Essential Arabic phrases and daily supplications to begin incorporating into your life.',
    icon: Languages,
    points: [
      'Common Islamic greetings and responses',
      'Daily duas for eating, sleeping, and traveling',
      'Short Quran surahs to memorize for prayer',
      'Tips for learning Arabic as a new Muslim',
    ],
  },
  {
    slug: 'ramadan-guide',
    title: 'Ramadan Guide',
    description:
      'Everything you need to know about the holy month of fasting — from suhoor to iftar.',
    icon: Moon,
    points: [
      'What is Ramadan and why do Muslims fast',
      'Suhoor and iftar — pre-dawn and sunset meals',
      'What breaks and does not break the fast',
      'Tarawih prayers and Laylatul Qadr',
    ],
  },
  {
    slug: 'mosque-etiquette',
    title: 'Mosque Etiquette',
    description:
      'How to feel comfortable visiting and praying at a mosque — you are always welcome.',
    icon: DoorOpen,
    points: [
      'What to wear and how to prepare for your visit',
      'Entering the mosque and prayer hall protocol',
      'Congregational prayer — when to stand, bow, and prostrate',
      'Building relationships with your mosque community',
    ],
  },
  {
    slug: 'understanding-quran',
    title: 'Understanding the Quran',
    description:
      'How to approach reading and understanding the holy book of Islam for the first time.',
    icon: BookOpen,
    points: [
      'Structure of the Quran — surahs, ayahs, and juz',
      'Choosing a translation that works for you',
      'Recommended surahs to start with',
      'The etiquette of handling and reciting the Quran',
    ],
  },
  {
    slug: 'islamic-history',
    title: 'Islamic History',
    description:
      'Key moments in Islamic history from Prophet Muhammad (PBUH) to the golden age of Islamic civilization.',
    icon: History,
    points: [
      'The life of Prophet Muhammad (PBUH)',
      'The Rightly Guided Caliphs and early Islam',
      'The spread of Islam and its golden age',
      'Islam in America — history and community',
    ],
  },
  {
    slug: 'halal-haram-lifestyle',
    title: 'Halal & Haram Lifestyle',
    description:
      'Understanding permissible and prohibited things in Islam — a practical guide for daily life.',
    icon: Utensils,
    points: [
      'Halal food — what to look for when shopping',
      'Islamic guidelines on clothing and modesty',
      'Entertainment, music, and social interactions',
      'Financial guidelines — avoiding riba (interest)',
    ],
  },
  {
    slug: 'community-integration',
    title: 'Community Integration',
    description:
      'Finding your place in the Muslim community — support, friendships, and belonging.',
    icon: Users,
    points: [
      'Finding a welcoming mosque and community',
      'Navigating family relationships after conversion',
      'Connecting with other new Muslims',
      'Resources and support groups available to you',
    ],
  },
  {
    slug: 'faq',
    title: 'Frequently Asked Questions',
    description:
      'Answers to common questions new Muslims have — no question is too simple or too basic.',
    icon: HelpCircle,
    points: [
      'Do I need to change my name?',
      'How do I tell my family and friends?',
      'What if I make mistakes in prayer?',
      'How do I handle social situations (holidays, food, etc.)?',
    ],
  },
];

const relatedResources = [
  {
    title: 'Prayer Times',
    description: 'Find accurate daily prayer times for your location',
    href: '/prayer-times',
    icon: Clock,
  },
  {
    title: 'Quran Study',
    description: 'Read and study the Holy Quran with translations',
    href: '/resources/quran-study',
    icon: BookOpen,
  },
  {
    title: 'Islamic Calendar',
    description: 'Stay informed about important Islamic dates',
    href: '/resources/islamic-calendar',
    icon: Calendar,
  },
];

export default function NewMuslimGuidePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-700 mb-3">
            Masjid At-Taqwa
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
            New Muslim Guide
          </h1>
          <p className="text-base text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            Welcome to Islam. This comprehensive guide will help you on your journey with
            foundational knowledge, practical guides, and downloadable resources.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        {/* Welcome Banner */}
        <section className="py-10">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6 sm:p-8 text-center">
            <p className="text-2xl font-semibold text-emerald-800 arabic mb-3" dir="rtl">
              لَا إِلٰهَ إِلَّا ٱللَّٰهُ مُحَمَّدٌ رَسُولُ ٱللَّٰهِ
            </p>
            <p className="text-sm text-emerald-700 italic mb-4">
              &ldquo;There is no god but Allah, and Muhammad is the Messenger of Allah&rdquo;
            </p>
            <p className="text-sm text-neutral-600 max-w-2xl mx-auto leading-relaxed">
              Taking your Shahada is one of the most beautiful moments in life. Whether you took it
              yesterday or years ago, this guide is here to support you. Remember — every Muslim was
              once a beginner, and the entire community is here to help you grow.
            </p>
          </div>
        </section>

        {/* Topic Cards Grid */}
        <section className="pb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Essential Topics</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topics.map((topic) => {
              const IconComponent = topic.icon;
              return (
                <div
                  key={topic.slug}
                  className="rounded-xl border border-neutral-200 bg-white p-6 flex flex-col"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                      <IconComponent className="h-5 w-5 text-emerald-600" />
                    </div>
                    <h3 className="text-sm font-semibold text-neutral-900 pt-2">{topic.title}</h3>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                    {topic.description}
                  </p>
                  <ul className="space-y-1.5 mb-5 flex-1">
                    {topic.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-neutral-600">
                        <div className="w-1 h-1 bg-emerald-400 rounded-full shrink-0 mt-1.5" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={`/pdfs/new-muslim/${topic.slug}.pdf`}
                    download
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100 hover:border-emerald-300"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download PDF Guide
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        {/* Related Resources */}
        <section className="pb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Related Resources</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {relatedResources.map((resource) => {
              const IconComponent = resource.icon;
              return (
                <Link
                  key={resource.href}
                  href={resource.href}
                  className="group rounded-xl border border-neutral-200 bg-white p-5 transition-colors hover:border-emerald-300 hover:bg-emerald-50/30"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                      <IconComponent className="h-4 w-4 text-emerald-600" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-emerald-500 transition-colors" />
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-1">{resource.title}</h3>
                  <p className="text-xs text-neutral-500">{resource.description}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Community Support CTA */}
        <section className="pb-20">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-6 sm:p-8 text-center">
            <h3 className="text-base font-semibold text-neutral-900 mb-2">
              Need Support on Your Journey?
            </h3>
            <p className="text-sm text-neutral-500 max-w-xl mx-auto mb-5 leading-relaxed">
              Our community is here to help. Whether you have questions, need a mentor, or just want
              to connect with fellow Muslims, don&apos;t hesitate to reach out.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Contact Us
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
