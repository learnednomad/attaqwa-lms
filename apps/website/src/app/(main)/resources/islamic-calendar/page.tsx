'use client';

import { useState, useEffect } from 'react';
import { Calendar, Moon, Star, Info, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { fetchIslamicCalendar } from '@/lib/services/islamic-api';

interface IslamicDate {
  date: string;
  format: string;
  day: string;
  weekday: {
    en: string;
    ar: string;
  };
  month: {
    number: number;
    en: string;
    ar: string;
  };
  year: string;
  designation: {
    abbreviated: string;
    expanded: string;
  };
  holidays: string[];
}

const islamicMonths = [
  { number: 1, name: 'Muharram', arabic: 'محرّم', days: 30, significance: 'Sacred month, New Year, Day of Ashura' },
  { number: 2, name: 'Safar', arabic: 'صفر', days: 29, significance: 'Month of travel and migration' },
  { number: 3, name: "Rabi' al-awwal", arabic: 'ربيع الأول', days: 30, significance: "Prophet Muhammad's ﷺ birth month" },
  { number: 4, name: "Rabi' al-thani", arabic: 'ربيع الآخر', days: 29, significance: 'Second spring month' },
  { number: 5, name: 'Jumada al-awwal', arabic: 'جمادى الأولى', days: 30, significance: 'First month of dryness' },
  { number: 6, name: 'Jumada al-thani', arabic: 'جمادى الآخرة', days: 29, significance: 'Second month of dryness' },
  { number: 7, name: 'Rajab', arabic: 'رجب', days: 30, significance: 'Sacred month, Isra and Miraj' },
  { number: 8, name: "Sha'ban", arabic: 'شعبان', days: 29, significance: 'Month of preparation for Ramadan' },
  { number: 9, name: 'Ramadan', arabic: 'رمضان', days: 30, significance: 'Month of fasting, Quran revelation' },
  { number: 10, name: 'Shawwal', arabic: 'شوّال', days: 29, significance: 'Eid al-Fitr, six days of Shawwal' },
  { number: 11, name: "Dhu al-Qi'dah", arabic: 'ذو القعدة', days: 30, significance: 'Sacred month, preparation for Hajj' },
  { number: 12, name: 'Dhu al-Hijjah', arabic: 'ذو الحجة', days: 29, significance: 'Month of Hajj, Eid al-Adha' },
];

const islamicEvents = [
  { date: '1 Muharram', name: 'Islamic New Year', arabic: 'رأس السنة الهجرية', type: 'celebration' },
  { date: '10 Muharram', name: 'Day of Ashura', arabic: 'يوم عاشوراء', type: 'important' },
  { date: '12 Rabi al-awwal', name: "Mawlid an-Nabi", arabic: 'المولد النبوي', type: 'celebration' },
  { date: '27 Rajab', name: 'Isra and Miraj', arabic: 'الإسراء والمعراج', type: 'important' },
  { date: '15 Shaban', name: "Laylat al-Bara'at", arabic: 'ليلة البراءة', type: 'special' },
  { date: '1 Ramadan', name: 'First day of Ramadan', arabic: 'أول رمضان', type: 'important' },
  { date: '27 Ramadan', name: 'Laylat al-Qadr', arabic: 'ليلة القدر', type: 'special' },
  { date: '1 Shawwal', name: 'Eid al-Fitr', arabic: 'عيد الفطر', type: 'celebration' },
  { date: '9 Dhu al-Hijjah', name: 'Day of Arafah', arabic: 'يوم عرفة', type: 'important' },
  { date: '10 Dhu al-Hijjah', name: 'Eid al-Adha', arabic: 'عيد الأضحى', type: 'celebration' },
];

export default function IslamicCalendarPage() {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [islamicDate, setIslamicDate] = useState<IslamicDate | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<number>(0);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  useEffect(() => {
    if (currentDate) {
      loadIslamicDate();
    }
  }, [currentDate]);

  const loadIslamicDate = async () => {
    setLoading(true);
    try {
      const data = await fetchIslamicCalendar(currentDate ?? undefined);
      setIslamicDate(data);
      if (data && data.month) {
        setSelectedMonth(data.month.number);
        calculateUpcomingEvents(data);
      }
    } catch (error) {
      console.error('Error loading Islamic date:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateUpcomingEvents = (islamicData: IslamicDate) => {
    const currentMonth = islamicData.month.number;
    const currentDay = parseInt(islamicData.day);

    const upcoming = islamicEvents
      .map(event => {
        const [day, month] = event.date.split(' ');
        const monthNum = islamicMonths.find(m => m.name === month)?.number || 0;
        const dayNum = parseInt(day);

        let daysUntil = 0;
        if (monthNum > currentMonth) {
          daysUntil = (monthNum - currentMonth) * 30 + (dayNum - currentDay);
        } else if (monthNum === currentMonth && dayNum > currentDay) {
          daysUntil = dayNum - currentDay;
        } else {
          daysUntil = (12 - currentMonth + monthNum) * 30 + dayNum;
        }

        return { ...event, daysUntil, monthNum, dayNum };
      })
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 5);

    setUpcomingEvents(upcoming);
  };

  const navigateMonth = (direction: number) => {
    if (!currentDate) return;
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'celebration':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'important':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'special':
        return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
      default:
        return 'bg-neutral-50 text-neutral-700 border border-neutral-200';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'celebration':
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      case 'important':
        return <Star className="w-4 h-4 text-emerald-600" />;
      case 'special':
        return <Moon className="w-4 h-4 text-indigo-600" />;
      default:
        return <Calendar className="w-4 h-4 text-neutral-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-700 mb-3">
            Resources
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
            Islamic Calendar
          </h1>
          <p className="text-base text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            Hijri calendar with important Islamic dates, events, and observances
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto" />
            <p className="mt-4 text-sm text-neutral-500">Loading Islamic calendar...</p>
          </div>
        ) : (
          <>
            {/* Today's Date + Navigation */}
            <section className="py-10">
              {/* Navigation */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3 mb-0">
                  <h2 className="text-xl font-semibold text-neutral-900">Today&apos;s Date</h2>
                  <div className="flex-1 h-px bg-neutral-100" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="rounded-lg border border-neutral-200 bg-white p-2 text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="rounded-lg border border-neutral-200 bg-white p-2 text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Date Cards */}
              {islamicDate && currentDate && (
                <div className="grid md:grid-cols-2 gap-5">
                  {/* Hijri Date */}
                  <div className="rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                        <Moon className="h-5 w-5 text-emerald-600" />
                      </div>
                      <p className="text-sm font-medium text-neutral-500">Hijri Date</p>
                    </div>
                    <p className="text-3xl font-bold text-neutral-900 mb-1">
                      {islamicDate.day} {islamicDate.month.en}
                    </p>
                    <p className="text-xl font-arabic text-neutral-500 mb-2" dir="rtl">
                      {islamicDate.day} {islamicDate.month.ar}
                    </p>
                    <p className="text-sm text-neutral-500">
                      Year {islamicDate.year} AH
                    </p>
                  </div>

                  {/* Gregorian Date */}
                  <div className="rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-emerald-600" />
                      </div>
                      <p className="text-sm font-medium text-neutral-500">Gregorian Date</p>
                    </div>
                    <p className="text-3xl font-bold text-neutral-900 mb-1">
                      {currentDate.getDate()} {currentDate.toLocaleDateString('en-US', { month: 'long' })}
                    </p>
                    <p className="text-sm text-neutral-500 mb-2">
                      {currentDate.getFullYear()} CE
                    </p>
                    <p className="text-sm text-neutral-500">
                      {currentDate.toLocaleDateString('en-US', { weekday: 'long' })}
                    </p>
                  </div>
                </div>
              )}

              {/* Special Day Notification */}
              {islamicDate?.holidays && islamicDate.holidays.length > 0 && (
                <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <Star className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-sm font-medium text-neutral-900">
                    Today is: {islamicDate.holidays.join(', ')}
                  </p>
                </div>
              )}
            </section>

            {/* Islamic Months */}
            <section className="pb-16">
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-xl font-semibold text-neutral-900">Islamic Months</h2>
                <div className="flex-1 h-px bg-neutral-100" />
              </div>
              <p className="text-sm text-neutral-500 mb-6">The twelve months of the Hijri calendar</p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {islamicMonths.map((month) => (
                  <div
                    key={month.number}
                    className={`rounded-xl border p-5 transition-colors ${
                      selectedMonth === month.number
                        ? 'border-emerald-200 bg-emerald-50/40'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-sm font-semibold text-neutral-900">
                          {month.number}. {month.name}
                        </h3>
                        <p className="text-base font-arabic text-neutral-500 mt-0.5" dir="rtl">
                          {month.arabic}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-neutral-500 border border-neutral-200 rounded-md px-2 py-0.5">
                        {month.days} days
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500 mt-2">
                      {month.significance}
                    </p>
                    {(month.number === 1 || month.number === 7 || month.number === 11 || month.number === 12) && (
                      <span className="inline-block mt-3 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 rounded-md px-2 py-0.5">
                        Sacred Month
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Upcoming Events & Moon Phases */}
            <section className="pb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Upcoming Events */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-xl font-semibold text-neutral-900">Upcoming Events</h2>
                    <div className="flex-1 h-px bg-neutral-100" />
                  </div>
                  <div className="space-y-3">
                    {upcomingEvents.map((event, index) => (
                      <div key={index} className="rounded-xl border border-neutral-200 bg-white p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                            {getEventIcon(event.type)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-neutral-900">{event.name}</p>
                            <p className="text-xs text-neutral-500">{event.arabic}</p>
                          </div>
                        </div>
                        <span className={`text-xs font-medium rounded-md px-2 py-0.5 ${getEventTypeColor(event.type)}`}>
                          {event.daysUntil === 0 ? 'Today' : `${event.daysUntil} days`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Moon Phases */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <h2 className="text-xl font-semibold text-neutral-900">Moon Phases</h2>
                    <div className="flex-1 h-px bg-neutral-100" />
                  </div>
                  <div className="rounded-xl border border-neutral-200 bg-white p-6">
                    <div className="flex items-center justify-center mb-5">
                      <div className="w-28 h-28 bg-neutral-100 rounded-full flex items-center justify-center">
                        <Moon className="w-16 h-16 text-neutral-400" />
                      </div>
                    </div>
                    <p className="text-center text-sm text-neutral-500 leading-relaxed mb-5">
                      The Islamic calendar follows lunar cycles. Each month begins with the sighting of the new crescent moon.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-neutral-50 p-3 text-center">
                        <p className="text-sm font-medium text-neutral-900">New Moon</p>
                        <p className="text-xs text-neutral-500 mt-0.5">Month begins</p>
                      </div>
                      <div className="rounded-lg bg-neutral-50 p-3 text-center">
                        <p className="text-sm font-medium text-neutral-900">Full Moon</p>
                        <p className="text-xs text-neutral-500 mt-0.5">Mid-month</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* About the Islamic Calendar */}
            <section className="pb-20">
              <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-6 sm:p-8">
                <h2 className="text-base font-semibold text-neutral-900 mb-5">About the Islamic Calendar</h2>
                <div className="space-y-3">
                  {[
                    'The Islamic (Hijri) calendar is a lunar calendar consisting of 12 months and 354 or 355 days',
                    'It began with the Hijra (migration) of Prophet Muhammad ﷺ from Makkah to Madinah in 622 CE',
                    'Four months are considered sacred: Muharram, Rajab, Dhu al-Qidah, and Dhu al-Hijjah',
                    'Dates may vary by 1-2 days depending on moon sighting and geographical location',
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Info className="w-4 h-4 text-emerald-600" />
                      </div>
                      <p className="text-sm text-neutral-500 leading-relaxed pt-2">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
