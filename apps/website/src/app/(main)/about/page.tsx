import {
  Building,
  Users,
  BookOpen,
  Heart,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Handshake,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { MOSQUE_INFO } from '@/constants';

export const metadata = {
  title: 'About | Masjid At-Taqwa',
  description: 'Learn about Masjid At-Taqwa — a place of worship, community, and learning serving the Muslim community in Doraville, Georgia since 2005.',
};

const offerings = [
  {
    name: 'Daily Prayers',
    description: 'Five daily congregational prayers with Adhan and Iqamah times. Friday Jummah prayers with khutbah in Arabic and English.',
    icon: Building,
    color: 'emerald',
  },
  {
    name: 'Islamic Education',
    description: 'Comprehensive Islamic education for all ages including Quran studies, Arabic language classes, and Islamic history and jurisprudence.',
    icon: BookOpen,
    color: 'emerald',
  },
  {
    name: 'Community Events',
    description: 'Regular community gatherings, Eid celebrations, Ramadan activities, and interfaith dialogue to strengthen bonds and share Islamic values.',
    icon: Users,
    color: 'emerald',
  },
  {
    name: 'Community Support',
    description: 'Marriage counseling, funeral services, convert support, and assistance for community members in need.',
    icon: Heart,
    color: 'emerald',
  },
  {
    name: 'Youth Programs',
    description: 'Engaging youth programs including Islamic education, sports activities, and leadership development opportunities.',
    icon: Handshake,
    color: 'emerald',
  },
  {
    name: 'Islamic Events',
    description: 'Special observances including Ramadan programs, Hajj preparation, and Islamic holiday celebrations throughout the year.',
    icon: Calendar,
    color: 'emerald',
  },
];

const values = [
  {
    title: 'Authentic Islamic Education',
    description: 'Teaching based on Quran and authentic Sunnah with scholarly guidance',
    icon: BookOpen,
  },
  {
    title: 'Community Unity',
    description: 'Building strong bonds among Muslims and promoting brotherhood',
    icon: Users,
  },
  {
    title: 'Compassionate Service',
    description: 'Serving our community with kindness and understanding',
    icon: Heart,
  },
  {
    title: 'Interfaith Dialogue',
    description: 'Promoting understanding and peaceful coexistence with all communities',
    icon: Handshake,
  },
];

const leadership = [
  {
    name: 'Imam Abdullah Rahman',
    role: 'Lead Imam',
    description: 'Over 15 years of Islamic scholarship and community leadership. Specializes in Quranic studies and Islamic jurisprudence.',
    icon: Users,
  },
  {
    name: 'Sister Aisha Mohamed',
    role: 'Education Director',
    description: 'Masters in Islamic Studies with expertise in women\'s and children\'s Islamic education programs.',
    icon: BookOpen,
  },
  {
    name: 'Brother Omar Hassan',
    role: 'Community Coordinator',
    description: 'Manages community outreach, volunteer programs, and interfaith initiatives to strengthen community bonds.',
    icon: Handshake,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-700 mb-3">
            Masjid At-Taqwa
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
            About Our Masjid
          </h1>
          <p className="text-base text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            A place of worship, community, and learning dedicated to serving the Muslim community
            with authentic Islamic education, spiritual guidance, and community support.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        {/* Mission & Vision */}
        <section className="py-10">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-emerald-600" />
                </div>
                <h2 className="text-lg font-semibold text-neutral-900">Our Mission</h2>
              </div>
              <p className="text-sm text-neutral-500 leading-relaxed">
                To provide a welcoming space for worship, education, and community building
                that strengthens the faith of Muslims and promotes understanding of Islamic
                values. We strive to serve Allah (SWT) by serving our community with
                authentic Islamic teachings and practical guidance for daily life.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-emerald-600" />
                </div>
                <h2 className="text-lg font-semibold text-neutral-900">Our Vision</h2>
              </div>
              <p className="text-sm text-neutral-500 leading-relaxed">
                To be a thriving Islamic center that nurtures spiritual growth,
                educational excellence, and community unity. We envision a future where
                Muslims of all ages find knowledge, support, and brotherhood in their
                journey toward Allah (SWT) and service to humanity.
              </p>
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="pb-16">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-xl font-semibold text-neutral-900">What We Offer</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {offerings.map((item) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={item.name}
                  className="rounded-xl border border-neutral-200 bg-white p-6"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                    <IconComponent className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* History & Values */}
        <section className="pb-16">
          <div className="grid md:grid-cols-2 gap-5">
            {/* History */}
            <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-6 sm:p-8">
              <h2 className="text-base font-semibold text-neutral-900 mb-6">Our History</h2>
              <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
                <p>
                  <span className="font-medium text-neutral-900">Masjid At-Taqwa was founded in 2005</span> through the efforts of a few dedicated brothers
                  who were looking for a location to begin a masjid through which they would be able to spread
                  the religion of Islam and nurture a community.
                </p>
                <p>
                  It began as a residential home which was slowly renovated and converted. With the help of Allah
                  and the dedication of many brothers and sisters, the daily salah as well as a small school
                  for the children and youth began to flourish.
                </p>
                <p>
                  As the community grew, the demands and needs also expanded, which led to the slow development
                  of the building and its amenities. The one building masjid was expanded with another building
                  which transitioned the women&apos;s section therein to accommodate the growing number of attendees.
                  This also allowed the expansion of the school and classes, as well as the purchasing of surrounding
                  lands to allow recreational spaces.
                </p>
                <p>
                  Due to the death of a community member, there were issues which arose demanding the need for
                  further facilitations for the community. It was then, by the grace of Allah, that the second
                  Project of Masjid At-Taqwa was undertaken: <span className="font-medium text-neutral-900">a cemetery and funeral home for the Muslims — Daarul Barzakh</span>.
                </p>
                <p>
                  After the purchase, the burial of the first Muslims were facilitated and it is currently going
                  through further development. Soon after, due to further growing demands of masjid and school space,
                  the plans have been passed for a <span className="font-medium text-neutral-900">new masjid building</span> and it is currently going through
                  the first initial phases for its completion.
                </p>
              </div>
            </div>

            {/* Values */}
            <div className="rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
              <h2 className="text-base font-semibold text-neutral-900 mb-6">Our Values</h2>
              <div className="space-y-5">
                {values.map((value) => {
                  const IconComponent = value.icon;
                  return (
                    <div key={value.title} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                        <IconComponent className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-neutral-900">{value.title}</h4>
                        <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-neutral-100 pt-5 mt-6">
                <p className="text-xs text-neutral-400 italic leading-relaxed">
                  &ldquo;Indeed, the most noble of you in the sight of Allah is the most righteous of you. Indeed, Allah is Knowing and Aware.&rdquo;
                  <span className="block mt-1 not-italic text-neutral-500">&mdash; Quran 49:13</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Prayer Times */}
        <section className="pb-16">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-6 sm:p-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-emerald-600" />
                </div>
                <h2 className="text-lg font-semibold text-neutral-900">Prayer Times</h2>
              </div>
              <p className="text-sm text-neutral-500 max-w-lg mx-auto">
                We hold all five daily prayers in congregation. Join us for spiritual connection and community.
              </p>

              <div className="grid grid-cols-5 gap-4 max-w-md mx-auto py-4">
                {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((prayer) => (
                  <div key={prayer} className="text-center">
                    <p className="text-sm font-medium text-neutral-900">{prayer}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/prayer-times"
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
              >
                <Clock className="h-3.5 w-3.5" />
                View Current Prayer Times
              </Link>
            </div>
          </div>
        </section>

        {/* Leadership */}
        <section className="pb-16">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-xl font-semibold text-neutral-900">Our Leadership</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {leadership.map((person) => {
              const IconComponent = person.icon;
              return (
                <div
                  key={person.name}
                  className="rounded-xl border border-neutral-200 bg-white p-6 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 mx-auto mb-4 flex items-center justify-center">
                    <IconComponent className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-1">
                    {person.name}
                  </h3>
                  <p className="text-xs font-medium text-emerald-600 mb-3">{person.role}</p>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    {person.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact + Get Involved */}
        <section className="pb-20">
          <div className="grid md:grid-cols-2 gap-5">
            {/* Visit Us */}
            <div className="rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
              <h3 className="text-base font-semibold text-neutral-900 mb-6">
                Visit Us
              </h3>
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-neutral-400 mt-0.5" />
                  <span className="text-neutral-700">
                    {MOSQUE_INFO.address}<br />
                    {MOSQUE_INFO.city}, {MOSQUE_INFO.province} {MOSQUE_INFO.postalCode}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-neutral-400" />
                  <span className="font-medium text-neutral-900">{MOSQUE_INFO.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-neutral-400" />
                  <span className="text-neutral-700">{MOSQUE_INFO.email}</span>
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-5">
                <p className="text-xs font-semibold tracking-wide uppercase text-neutral-400 mb-3">
                  School Email
                </p>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-neutral-400" />
                  <span className="text-neutral-700">{MOSQUE_INFO.schoolEmail}</span>
                </div>
              </div>
            </div>

            {/* Join Our Community */}
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-6 sm:p-8 flex flex-col">
              <h3 className="text-base font-semibold text-neutral-900 mb-3">
                Join Our Community
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed mb-6">
                Whether you&apos;re new to Islam, visiting our area, or looking for a spiritual home,
                you&apos;re welcome at Masjid At-Taqwa. Come as you are, learn, grow, and be part
                of our extended family.
              </p>

              <div className="space-y-3 mt-auto">
                <Link
                  href="/events"
                  className="flex items-center justify-center gap-2 w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  Upcoming Events
                </Link>
                <Link
                  href="/education"
                  className="flex items-center justify-center gap-2 w-full rounded-lg border border-emerald-200 bg-white px-4 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  Start Learning
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center justify-center gap-2 w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" />
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
