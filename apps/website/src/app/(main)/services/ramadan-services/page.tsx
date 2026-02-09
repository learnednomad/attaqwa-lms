import { Metadata } from 'next';
import { Moon, Clock, Users, UtensilsCrossed, BookOpen, Heart, Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Ramadan Services | Masjid At-Taqwa',
  description: 'Tarawee prayers, community Iftar, Tahajjud, Quran recitation, and Ramadan programs at Masjid At-Taqwa',
};

const ramadanPrograms = [
  {
    icon: Moon,
    title: 'Tarawee Prayer',
    description: '20 rakhat Tarawee prayers held every night after Isha. Complete Quran recitation throughout the month led by our Huffaz.',
    time: 'After Isha Prayer',
  },
  {
    icon: Clock,
    title: 'Tahajjud Prayer',
    description: 'Late night prayers for those seeking extra closeness to Allah during the blessed month.',
    time: '4:45 AM Daily',
  },
  {
    icon: UtensilsCrossed,
    title: 'Community Iftar',
    description: 'Free community Iftar served daily throughout the month of Ramadan. All are welcome to break their fast together.',
    time: 'At Maghrib Daily',
  },
  {
    icon: BookOpen,
    title: 'Daily Tafseer & Dua',
    description: 'Brief Tafseer of the Quran and collective dua session before Maghrib every day.',
    time: 'Before Maghrib',
  },
  {
    icon: Users,
    title: 'Itikaf',
    description: 'Spiritual retreat during the last 10 nights of Ramadan. Limited spaces available — register early.',
    time: 'Last 10 Nights',
  },
  {
    icon: Heart,
    title: 'Zakat ul-Fitr',
    description: '$10 per person, to be paid before Eid ul-Fitr Salah. Ensure the needy can also celebrate Eid.',
    time: 'Before Eid Salah',
  },
];

const scheduleItems = [
  { title: 'Tahajjud', time: '4:45 AM', highlight: false },
  { title: 'Suhoor Ends / Fajr Adhan', time: 'See daily prayer times', highlight: false },
  { title: 'Tafseer & Dua', time: 'Before Maghrib', highlight: false },
  { title: 'Iftar', time: 'At Maghrib', highlight: true },
  { title: 'Isha Prayer', time: 'See daily prayer times', highlight: false },
  { title: 'Tarawee (20 Rakhat)', time: 'After Isha', highlight: false },
];

const reminders = [
  {
    title: 'Community Iftar',
    description: 'Iftar is served daily throughout Ramadan. Volunteers are always welcome to help with preparation and serving.',
  },
  {
    title: 'Zakat ul-Fitr',
    description: '$10 per person must be paid before Eid ul-Fitr Salah. You can pay at the masjid office or during any prayer.',
  },
  {
    title: 'Parking',
    description: 'Due to increased attendance during Ramadan, please carpool when possible and follow volunteer directions for parking.',
  },
  {
    title: 'Children',
    description: "Please supervise children during Tarawee prayers. A dedicated children's area is available.",
  },
];

export default function RamadanServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-700 mb-3">
            Masjid At-Taqwa
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
            Ramadan Services
          </h1>
          <p className="text-base text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            Join our community for a spiritually enriching Ramadan with nightly Tarawee, daily Iftar, Tahajjud, and special programs throughout the blessed month
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        {/* Programs Grid */}
        <section className="py-10">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Ramadan Programs</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ramadanPrograms.map((program) => {
              const IconComponent = program.icon;
              return (
                <div key={program.title} className="rounded-xl border border-neutral-200 bg-white p-6">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                    <IconComponent className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="text-base font-semibold text-neutral-900 mb-1">{program.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium mb-3">
                    <Clock className="w-3.5 h-3.5" />
                    {program.time}
                  </div>
                  <p className="text-sm text-neutral-500 leading-relaxed">
                    {program.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Ramadan Schedule */}
        <section className="pb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Daily Ramadan Schedule</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-6 sm:p-8">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-amber-600" />
              </div>
              <p className="text-sm text-neutral-500">Typical daily schedule during the blessed month</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scheduleItems.map((item) => (
                <div
                  key={item.title}
                  className={`flex items-center gap-4 p-4 rounded-lg ${
                    item.highlight
                      ? 'border border-amber-200 bg-amber-50/50'
                      : 'border border-neutral-200 bg-white'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${item.highlight ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                  <div>
                    <h3 className="font-semibold text-neutral-900">{item.title}</h3>
                    <p className="text-sm text-neutral-500">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Important Reminders */}
        <section className="pb-20">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Important Reminders</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6 sm:p-8">
            <div className="space-y-5">
              {reminders.map((reminder) => (
                <div key={reminder.title} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Heart className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900">{reminder.title}</h3>
                    <p className="text-sm text-neutral-600 mt-1 leading-relaxed">{reminder.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
