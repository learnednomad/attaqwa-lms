import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Islamic Services from mosque theme analysis
const islamicServices = [
  {
    id: 'salah-prayer',
    name: 'Salah & Prayer',
    description: 'Daily prayer services, Jummah prayers, and spiritual guidance',
    href: '/services/salah-prayer',
    icon: '🕌',
    iconAlt: 'Mosque icon representing prayer services',
    gradient: 'from-islamic-green-500 to-islamic-green-600',
    bgColor: 'bg-islamic-green-50',
    borderColor: 'border-islamic-green-200',
    textColor: 'text-islamic-green-700',
    hoverShadow: 'hover:shadow-islamic-green/20',
  },
  {
    id: 'hajj-umrah',
    name: 'Hajj & Umrah',
    description: 'Pilgrimage guidance, travel assistance, and spiritual preparation',
    href: '/services/hajj-umrah',
    icon: '🕋',
    iconAlt: 'Kaaba icon representing pilgrimage services',
    gradient: 'from-islamic-navy-500 to-islamic-navy-600',
    bgColor: 'bg-islamic-navy-50',
    borderColor: 'border-islamic-navy-200',
    textColor: 'text-islamic-navy-700',
    hoverShadow: 'hover:shadow-islamic-navy/20',
  },
  {
    id: 'zakat',
    name: 'Zakat & Charity',
    description: 'Zakat calculation, charity distribution, and community support',
    href: '/services/zakat-charity',
    icon: '💰',
    iconAlt: 'Money icon representing zakat and charity',
    gradient: 'from-islamic-gold-500 to-islamic-gold-600',
    bgColor: 'bg-islamic-gold-50',
    borderColor: 'border-islamic-gold-200',
    textColor: 'text-islamic-gold-700',
    hoverShadow: 'hover:shadow-islamic-gold/20',
  },
  {
    id: 'quran-learning',
    name: 'Quran Learning',
    description: 'Quran recitation, Hifz program, and Islamic education classes',
    href: '/services/quran-learning',
    icon: '📖',
    iconAlt: 'Book icon representing Quran learning',
    gradient: 'from-islamic-green-600 to-islamic-navy-500',
    bgColor: 'bg-islamic-green-50',
    borderColor: 'border-islamic-green-200',
    textColor: 'text-islamic-green-700',
    hoverShadow: 'hover:shadow-islamic-green/20',
  },
  {
    id: 'funeral',
    name: 'Funeral Services',
    description: 'Islamic funeral rites, burial assistance, and family support',
    href: '/services/funeral-services',
    icon: '🤲',
    iconAlt: 'Praying hands representing funeral services',
    gradient: 'from-islamic-navy-600 to-islamic-green-500',
    bgColor: 'bg-islamic-navy-50',
    borderColor: 'border-islamic-navy-200',
    textColor: 'text-islamic-navy-700',
    hoverShadow: 'hover:shadow-islamic-navy/20',
  },
  {
    id: 'help-poor',
    name: 'Help the Poor',
    description: 'Community outreach, food assistance, and poverty alleviation',
    href: '/services/help-the-poor',
    icon: '❤️',
    iconAlt: 'Heart icon representing charity and helping the poor',
    gradient: 'from-islamic-gold-600 to-islamic-green-500',
    bgColor: 'bg-islamic-gold-50',
    borderColor: 'border-islamic-gold-200',
    textColor: 'text-islamic-gold-700',
    hoverShadow: 'hover:shadow-islamic-gold/20',
  },
  {
    id: 'scholarship',
    name: 'Scholarship Program',
    description: 'Educational scholarships, Islamic studies funding, and student support',
    href: '/services/scholarship-program',
    icon: '🎓',
    iconAlt: 'Graduation cap representing scholarship programs',
    gradient: 'from-islamic-green-500 to-islamic-gold-500',
    bgColor: 'bg-islamic-green-50',
    borderColor: 'border-islamic-green-200',
    textColor: 'text-islamic-green-700',
    hoverShadow: 'hover:shadow-islamic-green/20',
  },
  {
    id: 'halal-food',
    name: 'Halal Food Program',
    description: 'Community meals, food pantry, and halal certification guidance',
    href: '/services/halal-food-program',
    icon: '🍽️',
    iconAlt: 'Plate icon representing halal food services',
    gradient: 'from-islamic-navy-500 to-islamic-gold-500',
    bgColor: 'bg-islamic-navy-50',
    borderColor: 'border-islamic-navy-200',
    textColor: 'text-islamic-navy-700',
    hoverShadow: 'hover:shadow-islamic-navy/20',
  },
  // Quick Actions & Resources
  {
    id: 'donate',
    name: 'Make a Donation',
    description: 'Support our community programs and mosque operations',
    href: '/donate',
    icon: '💚',
    iconAlt: 'Heart icon representing donations',
    gradient: 'from-islamic-green-500 to-islamic-green-600',
    bgColor: 'bg-islamic-green-50',
    borderColor: 'border-islamic-green-200',
    textColor: 'text-islamic-green-700',
    hoverShadow: 'hover:shadow-islamic-green/20',
  },
  {
    id: 'contact',
    name: 'Contact Us',
    description: 'Get in touch with the masjid administration',
    href: '/contact',
    icon: '📧',
    iconAlt: 'Email icon representing contact',
    gradient: 'from-islamic-navy-500 to-islamic-navy-600',
    bgColor: 'bg-islamic-navy-50',
    borderColor: 'border-islamic-navy-200',
    textColor: 'text-islamic-navy-700',
    hoverShadow: 'hover:shadow-islamic-navy/20',
  },
  {
    id: 'education',
    name: 'Islamic Education',
    description: 'Learn and grow in faith with our educational programs',
    href: '/education',
    icon: '📚',
    iconAlt: 'Books icon representing Islamic education',
    gradient: 'from-islamic-gold-500 to-islamic-gold-600',
    bgColor: 'bg-islamic-gold-50',
    borderColor: 'border-islamic-gold-200',
    textColor: 'text-islamic-gold-700',
    hoverShadow: 'hover:shadow-islamic-gold/20',
  },
  {
    id: 'quran-study',
    name: 'Quran Study',
    description: 'Tafsir, recitation guides, and Quranic resources',
    href: '/resources/quran-study',
    icon: '📖',
    iconAlt: 'Open book icon representing Quran study',
    gradient: 'from-islamic-green-600 to-islamic-navy-500',
    bgColor: 'bg-islamic-green-50',
    borderColor: 'border-islamic-green-200',
    textColor: 'text-islamic-green-700',
    hoverShadow: 'hover:shadow-islamic-green/20',
  },
  {
    id: 'hadith',
    name: 'Hadith Collections',
    description: 'Prophetic traditions and authentic narrations',
    href: '/resources/hadith-collections',
    icon: '📜',
    iconAlt: 'Scroll icon representing hadith collections',
    gradient: 'from-islamic-navy-600 to-islamic-green-500',
    bgColor: 'bg-islamic-navy-50',
    borderColor: 'border-islamic-navy-200',
    textColor: 'text-islamic-navy-700',
    hoverShadow: 'hover:shadow-islamic-navy/20',
  },
  {
    id: 'qibla',
    name: 'Qibla Direction',
    description: 'Find the direction to Mecca for prayer',
    href: '/resources/qibla-direction',
    icon: '🧭',
    iconAlt: 'Compass icon representing Qibla direction',
    gradient: 'from-islamic-gold-600 to-islamic-green-500',
    bgColor: 'bg-islamic-gold-50',
    borderColor: 'border-islamic-gold-200',
    textColor: 'text-islamic-gold-700',
    hoverShadow: 'hover:shadow-islamic-gold/20',
  },
];

interface IslamicServicesGridProps {
  className?: string;
  showTitle?: boolean;
  compact?: boolean;
}

export function IslamicServicesGrid({ 
  className, 
  showTitle = true, 
  compact = false 
}: IslamicServicesGridProps) {
  return (
    <section 
      className={cn('relative py-16 px-4 sm:px-6 lg:px-8', className)}
      aria-labelledby={showTitle ? "islamic-services-heading" : undefined}
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        {showTitle && (
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-islamic-green-400"></div>
              <span className="text-sm font-medium text-islamic-green-600 uppercase tracking-wider">
                OUR SERVICES
              </span>
              <div className="w-12 h-0.5 bg-gradient-to-l from-transparent to-islamic-green-400"></div>
            </div>
            <h2 id="islamic-services-heading" className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What We Offer
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive Islamic services and community support programs designed to strengthen our faith and brotherhood
            </p>
          </div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {islamicServices.map((service, index) => (
            <Link
              key={service.id}
              href={service.href}
              className="group block"
            >
              <Card className="relative overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-islamic-green-400 group-hover:bg-islamic-green-500 h-64">
                <CardContent className="p-8 h-full flex flex-col items-center justify-center text-center">
                  {/* Service Icon */}
                  <div className="mb-6">
                    <div className="w-16 h-16 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                      <span role="img" aria-label={service.iconAlt} className="filter grayscale group-hover:grayscale-0 group-hover:brightness-0 group-hover:invert transition-all duration-300">
                        {service.icon}
                      </span>
                    </div>
                  </div>

                  {/* Service Title */}
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-white transition-colors duration-300 mb-2">
                    {service.name}
                  </h3>

                  {/* Service Description */}
                  {!compact && (
                    <p className="text-sm text-gray-600 group-hover:text-white/90 transition-colors duration-300 leading-relaxed">
                      {service.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}