import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Mock prayer times data - replace with real data from your API
const mockPrayerTimes = {
  fajr: '04:21 AM',
  dhuhr: '12:31 PM',
  asr: '03:53 PM',
  maghrib: '06:36 PM',
  isha: '08:21 PM'
};

// Prayer icons using PNG images
const prayerIcons = {
  fajr: (
    <Image
      src="/prayer-icon1.png"
      alt="Fajr prayer icon"
      width={250}
      height={250}
      className="w-8 h-12 object-cover"
    />
  ),
  dhuhr: (
    <Image
      src="/prayer-icon2.png"
      alt="Dhuhr prayer icon"
      width={250}
      height={250}
      className="w-8 h-12 object-cover"
    />
  ),
  asr: (
    <Image
      src="/prayer-icon3.png"
      alt="Asr prayer icon"
      width={250}
      height={250}
      className="w-8 h-12 object-cover"
    />
  ),
  maghrib: (
    <Image
      src="/prayer-icon4.png"
      alt="Maghrib prayer icon"
      width={250}
      height={250}
      className="w-8 h-12 object-cover"
    />
  ),
  isha: (
    <Image
      src="/prayer-icon5.png"
      alt="Isha prayer icon"
      width={250}
      height={250}
      className="w-8 h-12 object-cover"
    />
  )
};

interface MosquePrayerTimesSectionProps {
  className?: string;
  location?: string;
}

export function MosquePrayerTimesSection({ 
  className,
  location = "Abu Dhabi" 
}: MosquePrayerTimesSectionProps) {
  const prayers = [
    { name: 'Fajr', time: mockPrayerTimes.fajr, key: 'fajr' },
    { name: 'Dhuhr', time: mockPrayerTimes.dhuhr, key: 'dhuhr' },
    { name: 'Asr', time: mockPrayerTimes.asr, key: 'asr' },
    { name: 'Maghrib', time: mockPrayerTimes.maghrib, key: 'maghrib' },
    { name: 'Isha', time: mockPrayerTimes.isha, key: 'isha' }
  ];

  return (
    <section className={cn('relative', className)}>
      {/* Enhanced Hero Section with Islamic Design */}
      <div className="bg-gradient-to-br from-islamic-navy-100 via-islamic-green-100/60 to-islamic-gold-100/50 py-16 relative overflow-hidden">
        {/* Islamic Geometric Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2316A34A' fill-opacity='0.08'%3E%3Cpath d='M50 10L70 30L50 50L30 30z'/%3E%3Cpath d='M50 50L70 70L50 90L30 70z'/%3E%3Cpath d='M10 50L30 30L50 50L30 70z'/%3E%3Cpath d='M50 50L70 30L90 50L70 70z'/%3E%3Ccircle cx='50' cy='50' r='6'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            {/* Left: Prayer Times Header */}
            <div className="lg:col-span-3 text-center lg:text-left mt-8">
              <h2 className="text-4xl lg:text-5xl font-bold text-islamic-navy-800 mb-3 leading-tight">
                Prayer Times
              </h2>
              <p className="text-lg text-islamic-navy-600 mb-4">
                Prayer times in {location}
              </p>
              {/* Islamic decorative element */}
              <div className="flex justify-center lg:justify-start items-center gap-2 mb-6">
                <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-islamic-gold-400 to-transparent"></div>
                <div className="w-2 h-2 bg-islamic-gold-400 rounded-full animate-pulse"></div>
                <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-islamic-gold-400 to-transparent"></div>
              </div>
            </div>

            {/* Right: Join Community Card - Properly Positioned */}
            <div className="lg:col-span-2 flex justify-center lg:justify-end">
              <Card className="bg-gradient-to-br from-islamic-green-500 via-islamic-green-600 to-islamic-green-700 border-0 shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden transform hover:scale-105 max-w-sm w-full">
                <CardContent className="p-6 h-full flex flex-col justify-center relative">
                  {/* Enhanced Islamic Pattern */}
                  <div className="absolute inset-0 opacity-12">
                    <div className="w-full h-full" style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M30 5L45 20L30 35L15 20z'/%3E%3Cpath d='M30 25L45 40L30 55L15 40z'/%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      backgroundSize: '30px 30px'
                    }}></div>
                  </div>
                  
                  {/* Subtle border accent */}
                  <div className="absolute inset-0 rounded-2xl border border-islamic-gold-400/20"></div>
                  
                  <div className="relative z-10 text-center">
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 leading-tight">
                      Join Our Community
                    </h3>
                    <p className="text-black/90 text-sm leading-relaxed mb-4">
                      Join our welcoming Muslim community for daily prayers, Islamic education, community events, and spiritual growth together.
                    </p>
                    <Link 
                      href="/contact" 
                      className="inline-flex items-center px-6 py-3 bg-white text-islamic-green-600 font-semibold rounded-lg hover:bg-islamic-gold-50 hover:text-islamic-navy-700 hover:shadow-md transition-all duration-300 group text-sm"
                    >
                      <span>Learn More</span>
                      <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Prayer Times Grid with Islamic Design */}
      <div className="bg-gradient-to-br from-white via-islamic-green-50/20 to-islamic-gold-50/15 py-16 relative">
        {/* Subtle Islamic border pattern */}
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-islamic-gold-300 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {prayers.map((prayer, index) => (
              <div
                key={prayer.key}
                className="text-center group animate-fade-in"
                style={{ 
                  animationDelay: `${index * 150}ms`
                }}
                role="article"
                aria-labelledby={`prayer-${prayer.key}-name`}
                aria-describedby={`prayer-${prayer.key}-time`}
              >
                {/* Enhanced Prayer Icon */}
                <div className="mb-6 flex justify-center">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-islamic-green-50 via-white to-islamic-green-100 rounded-full shadow-lg flex items-center justify-center text-islamic-green-600 group-hover:shadow-2xl group-hover:scale-110 group-hover:from-islamic-green-100 group-hover:to-islamic-green-200 transition-all duration-500 border-2 border-islamic-green-200/30 group-hover:border-islamic-green-300/50">
                      <div aria-label={`${prayer.name} prayer time`}>
                        {prayerIcons[prayer.key as keyof typeof prayerIcons]}
                      </div>
                    </div>
                    {/* Islamic geometric accent */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-islamic-gold-200/30 via-transparent to-islamic-gold-200/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
                  </div>
                </div>

                {/* Enhanced Prayer Name with Islamic Typography */}
                <h3 
                  id={`prayer-${prayer.key}-name`}
                  className="text-xl font-bold text-islamic-navy-800 mb-3 group-hover:text-islamic-green-600 transition-colors duration-300 font-serif leading-tight"
                >
                  {prayer.name}
                </h3>

                {/* Enhanced Prayer Time with Tabular Numbers */}
                <p 
                  id={`prayer-${prayer.key}-time`}
                  className="text-lg font-bold text-islamic-navy-700 prayer-time font-mono tracking-wide group-hover:text-islamic-green-700 transition-colors duration-300"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {prayer.time}
                </p>

                {/* Islamic decorative dot */}
                <div className="mt-3 flex justify-center">
                  <div className="w-1 h-1 bg-islamic-gold-400 rounded-full opacity-60 group-hover:opacity-100 group-hover:scale-150 transition-all duration-300"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Information Section with Islamic Design */}
          <div className="hidden mt-20 text-center">
            <div className="max-w-lg mx-auto p-6 rounded-2xl bg-gradient-to-br from-islamic-gold-50/50 via-white to-islamic-navy-50/30 border border-islamic-gold-200/40 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
              {/* Islamic pattern overlay */}
              <div className="absolute inset-0 opacity-5">
                <div className="w-full h-full" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D97706' fill-opacity='0.1'%3E%3Cpath d='M20 5L30 15L20 25L10 15z'/%3E%3Ccircle cx='20' cy='20' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '20px 20px'
                }}></div>
              </div>

              <div className="relative z-10">
                {/* Islamic decorative header */}
                <div className="flex justify-center items-center gap-3 mb-4">
                  <div className="w-6 h-0.5 bg-gradient-to-r from-transparent via-islamic-gold-400 to-transparent"></div>
                  <div className="w-2 h-2 bg-islamic-gold-400 rounded-full"></div>
                  <div className="w-6 h-0.5 bg-gradient-to-r from-transparent via-islamic-gold-400 to-transparent"></div>
                </div>

                <p className="text-sm text-islamic-navy-700 mb-2 font-medium">
                  Prayer times calculated for <span className="font-bold text-islamic-green-600">{location}</span>
                </p>
                <p className="text-xs text-islamic-navy-500 mb-5 opacity-75">
                  Times may vary slightly based on your exact location
                </p>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}