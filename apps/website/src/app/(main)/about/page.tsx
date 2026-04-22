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
  Star,
  Moon,
  Sun,
  Scroll,
  Shield,
  Compass,
  Sparkles,
  MessageCircle,
} from 'lucide-react';
import Link from 'next/link';
import { MOSQUE_INFO } from '@/constants';

const fivePillars = [
  {
    title: 'Shahadah — The Testification',
    description: '“I testify that there is no god but Allah, One and Alone without partner, and Prophet Muhammad is His servant and messenger.” A Muslim believes it in the heart, professes it with the tongue, and lives it in action.',
    icon: Star,
  },
  {
    title: 'Salah — The Prayer',
    description: 'The five daily prayers are a Muslim\'s direct connection with Allah — worship that keeps the believer conscious of Him throughout the day.',
    icon: Clock,
  },
  {
    title: 'Zakat — Mandatory Charity',
    description: 'An annual charity mandatory on every Muslim of means, for the care of the poor and less fortunate in the community.',
    icon: Heart,
  },
  {
    title: 'Sawm — Fasting in Ramadan',
    description: 'Every able Muslim fasts in the month of Ramadan from pre-dawn to sunset, abstaining from food and drink.',
    icon: Moon,
  },
  {
    title: 'Hajj — Pilgrimage to the Ka\'bah',
    description: 'Once in a lifetime, every Muslim who is able should make the pilgrimage to the Ka\'bah in Makkah in the month of Dhul-Hijjah.',
    icon: Compass,
  },
];

const sixArticles = [
  {
    title: 'Belief in Allah',
    description: 'Belief in the Oneness of God, without partner. He is All-Powerful, has dominion over all, and has no family, partner, or equal.',
    icon: Sparkles,
  },
  {
    title: 'Belief in the Angels',
    description: 'The angels were created from pure light. They are servants of Allah who carry out His commands without resistance or free choice.',
    icon: Sun,
  },
  {
    title: 'Belief in the Books',
    description: 'The Holy Scriptures revealed to the Messengers — the words, commands, and speech of Allah to humanity.',
    icon: BookOpen,
  },
  {
    title: 'Belief in the Prophets',
    description: 'The men chosen by Allah to teach and guide — calling people to the unity of Allah and deterring them from falsehood.',
    icon: Users,
  },
  {
    title: 'Belief in the Day of Judgment',
    description: 'The Day of Accountability when all people will be raised and questioned on their deeds — leading to paradise or hell by their actions.',
    icon: Scroll,
  },
  {
    title: 'Belief in Fate — Good and Bad',
    description: 'Everything that happens, good or bad, is by the Will of Allah. Nothing takes place without His knowledge and permission.',
    icon: Shield,
  },
];

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
    name: 'Imam Mohammad Zahirul Islam',
    role: 'Founding Imam',
    description: 'Founder of Masjid At-Taqwa and former Imam of Masjid Darus-Salam. Over 30 years teaching Qur\'anic and Islamic education in the Atlanta community. MA in Islamic Studies; completed Alimiyyah studies with Shaykh Abdul Ghaffar at Georgia Islamic Institute. Teaches in English and Bengali.',
    icon: Users,
  },
  {
    name: 'Ustadh Abdullah Khan',
    role: 'Imam & Qur\'an Teacher',
    description: 'Graduate of the University of Madinah — BA in Shari\'ah and MA in Qur\'an. Ijaazah from Masjid An-Nabawi. Former Imam of Masjid Al-\'Alawah in Madinah. Teaches Qur\'an memorization and Arabic language in Arabic, English, and Bengali.',
    icon: BookOpen,
  },
  {
    name: 'Ustadha Salina Sultana',
    role: 'Head Manager of Sisters',
    description: 'Leads the sisters\' programs and teaches adult Qur\'an and Islamic Studies in Bengali between Maghrib and Isha on Saturdays and Sundays.',
    icon: Heart,
  },
  {
    name: 'Ustadha Labibah Islam',
    role: 'Management & Teacher',
    description: 'Manages weekend classes and Tahfeedh for sisters. Primary point of contact for sisters\' education and Islamic counseling inquiries.',
    icon: Handshake,
  },
  {
    name: 'Ustadha Siddiqa Islam',
    role: 'Management & Teacher',
    description: 'Tahfeedhul Qur\'an instructor for sisters and weekend class teacher.',
    icon: BookOpen,
  },
  {
    name: 'Ustadha Maryam Islam',
    role: 'Management Administration',
    description: 'Supports the administrative operations of the masjid\'s education programs.',
    icon: Users,
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
                  <span className="font-medium text-neutral-900">Masjid At-Taqwa was founded in 2005</span> through the efforts of a few brothers
                  who were looking for a location to begin a masjid through which they could spread the religion
                  of Islam and nurture a community. It began as a residential home, slowly renovated and converted
                  with the help of Allah and the dedication of many brothers and sisters. Daily salah, Friday
                  Jumu&apos;ah, and Islamic classes for children and youth were established from the start.
                </p>
                <p>
                  As the community grew, a second building was added to accommodate the sisters and to expand the
                  school. Surrounding land was purchased to provide recreational space for the community.
                </p>
                <p>
                  In the years that followed, the unexpected passing of a community member surfaced the need for
                  proper burial facilities. By the grace of Allah, the second project of Masjid At-Taqwa was
                  undertaken: <span className="font-medium text-neutral-900">a Muslim cemetery and funeral home — Daarul Barzakh</span>. The first burials
                  have been facilitated and the site continues to develop.
                </p>
                <p>
                  With the congregation and schools continuing to grow, plans are now underway for a{' '}
                  <span className="font-medium text-neutral-900">new masjid building</span> to serve the community for years to come.
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

        {/* About Our Faith: Islam */}
        <section className="pb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">About Our Faith: Islam</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
            <div className="space-y-4 text-sm text-neutral-600 leading-relaxed">
              <p>
                <span className="font-medium text-neutral-900">&lsquo;Islam&rsquo;</span> is an Arabic word
                meaning submission, surrender, and peace — combined to convey that{' '}
                <em>surrendering and submitting to the Will of Allah (God Almighty) results in peace</em>.
                Its followers are called <span className="font-medium text-neutral-900">Muslims</span>, meaning
                &ldquo;those who have submitted.&rdquo;
              </p>
              <p>
                Muslims are monotheistic. They believe in One God without any partner — the sole Creator
                and Master of all creation, without parallel, without family, and with none who share His
                divine attributes. He created people to worship Him and to obey His commands for success
                in this life and the next.
              </p>
              <p>
                For this reason He sent prophets — the best of men, chosen from their communities — to
                teach and convey His message. Among them were <em>Adam, Nuh (Noah), Ibrahim (Abraham),
                Musa (Moses), Isa (Jesus)</em> and <em>Muhammad</em>, peace and blessings be upon them all.
              </p>
            </div>
          </div>
        </section>

        {/* Five Pillars of Islam */}
        <section className="pb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">The Five Pillars of Islam</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>
          <p className="text-sm text-neutral-500 max-w-3xl leading-relaxed mb-8">
            The fundamentals every Muslim practices — the five tenets that shape daily and lifelong worship.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {fivePillars.map((pillar) => {
              const IconComponent = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="rounded-xl border border-neutral-200 bg-white p-6"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                    <IconComponent className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-2">{pillar.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{pillar.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Six Articles of Faith */}
        <section className="pb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">The Six Articles of Faith</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>
          <p className="text-sm text-neutral-500 max-w-3xl leading-relaxed mb-8">
            The core beliefs a Muslim holds — the foundation of Iman (faith).
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sixArticles.map((article) => {
              const IconComponent = article.icon;
              return (
                <div
                  key={article.title}
                  className="rounded-xl border border-neutral-200 bg-neutral-50/40 p-6"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center mb-4">
                    <IconComponent className="h-5 w-5 text-amber-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-2">{article.title}</h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{article.description}</p>
                </div>
              );
            })}
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

              <div className="border-t border-neutral-100 pt-5 mt-5">
                <p className="text-xs font-semibold tracking-wide uppercase text-neutral-400 mb-3">
                  Stay Connected
                </p>
                <div className="space-y-2">
                  <a
                    href={MOSQUE_INFO.social.whatsappGroup}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-emerald-700 hover:text-emerald-800"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp Community Group
                  </a>
                  <a
                    href={MOSQUE_INFO.social.whatsappChannel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-emerald-700 hover:text-emerald-800"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp Announcements Channel
                  </a>
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
