import { Heart, Users, BookOpen, Phone, Mail, Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Services | Masjid At-Taqwa',
  description: 'Comprehensive Islamic services including Nikah ceremonies, funeral services, counseling, community support, and spiritual guidance at Masjid At-Taqwa.',
};

interface Service {
  id: string;
  name: string;
  description: string;
  details: string[];
  contact: string;
  availability: string;
  fee?: string;
  icon: any;
  featured?: boolean;
}

const services: Service[] = [
  {
    id: 'nikah',
    name: 'Nikah (Islamic Wedding) Ceremonies',
    description: 'Beautiful Islamic wedding ceremonies performed by our certified Imams, following authentic Sunnah traditions.',
    details: [
      'Complete Islamic wedding ceremony with Khutbah',
      'Mahr (dower) documentation and witness arrangements',
      'Marriage contract preparation and signing',
      'Pre-marital counseling and guidance',
      'Flexible scheduling including weekends',
      'Beautiful masjid venue with accommodations for families'
    ],
    contact: 'Imam Mohammad Zahirul Islam',
    availability: 'Available 7 days a week by appointment',
    fee: 'Suggested donation: $200-500 (based on family circumstances)',
    icon: Heart,
    featured: true
  },
  {
    id: 'funeral',
    name: 'Funeral & Burial Services',
    description: 'Complete Islamic funeral services including Janazah prayers, burial arrangements, and family support during difficult times.',
    details: [
      'Islamic funeral prayer (Salat al-Janazah) at masjid',
      'Body preparation coordination (Ghusl and Kafan)',
      'Burial arrangements at Islamic cemetery',
      'Family counseling and spiritual support',
      '24/7 emergency funeral services available',
      'Transportation coordination for burial',
      'Memorial services and Quran recitation programs'
    ],
    contact: 'Imam Mohammad Zahirul Islam (24/7 Emergency)',
    availability: '24/7 emergency services, immediate response',
    fee: 'No fee for funeral prayers, burial costs vary by cemetery',
    icon: Users,
    featured: true
  },
  {
    id: 'counseling',
    name: 'Islamic Counseling & Guidance',
    description: 'Confidential Islamic counseling services for individuals, couples, and families facing personal, marital, or spiritual challenges.',
    details: [
      'Individual counseling for personal and spiritual issues',
      'Marriage and relationship counseling',
      'Family mediation and conflict resolution',
      'Youth guidance and mentoring',
      'Addiction recovery support with Islamic approach',
      'Grief counseling and bereavement support',
      'Financial guidance according to Islamic principles'
    ],
    contact: 'Imam Mohammad Zahirul Islam or Imam Abdullah Khan',
    availability: 'Tuesday-Saturday, by appointment',
    fee: 'Free of charge, donations welcomed',
    icon: BookOpen,
    featured: true
  },
  {
    id: 'community-support',
    name: 'Community Support Services',
    description: 'Comprehensive support services for community members including food assistance, financial help, and social services.',
    details: [
      'Emergency financial assistance for families in need',
      'Food pantry and meal distribution programs',
      'Zakat collection and distribution',
      'New Muslim support and mentorship',
      'Elderly care and support services',
      'Job placement assistance and networking',
      'Language interpretation services (Bengali/English)'
    ],
    contact: 'Masjid office or community coordinators',
    availability: 'Daily after prayers or by appointment',
    fee: 'Free services supported by community donations',
    icon: Users
  },
  {
    id: 'islamic-consultation',
    name: 'Islamic Legal & Religious Consultation',
    description: 'Expert consultation on Islamic jurisprudence (Fiqh), religious rulings, and guidance on Islamic lifestyle matters.',
    details: [
      'Islamic jurisprudence (Fiqh) consultations',
      'Halal/Haram guidance for modern situations',
      'Business transaction Islamic compliance',
      'Islamic will and estate planning guidance',
      'Religious rulings on contemporary issues',
      'Conversion to Islam guidance and support',
      'Islamic calendar and ritual timing'
    ],
    contact: 'Imam Mohammad Zahirul Islam',
    availability: 'After daily prayers or by appointment',
    fee: 'Free consultations, donations appreciated',
    icon: BookOpen
  },
  {
    id: 'youth-services',
    name: 'Youth & Family Services',
    description: 'Specialized programs and support for Muslim youth and families in building strong Islamic identity and community connections.',
    details: [
      'Youth mentorship and guidance programs',
      'Islamic identity building workshops',
      'College and career guidance with Islamic perspective',
      'Family counseling and parenting workshops',
      'Teen Islamic education and discussion groups',
      'Community service project coordination',
      'Leadership development for Muslim youth'
    ],
    contact: 'Youth coordinators and Imam Abdullah Khan',
    availability: 'Friday evenings and weekends',
    fee: 'Free programs, some activities may have small fees',
    icon: Users
  }
];

export default function ServicesPage() {
  const featuredServices = services.filter(service => service.featured);
  const otherServices = services.filter(service => !service.featured);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-700 mb-3">
            Masjid At-Taqwa
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
            Community Services
          </h1>
          <p className="text-base text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            Comprehensive Islamic services to support our community through life&apos;s important moments,
            spiritual guidance, and everyday challenges with compassion and Islamic principles.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        {/* Emergency Contact */}
        <section className="py-10">
          <div className="rounded-xl border border-red-100 bg-red-50/40 p-6 sm:p-8">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                <Phone className="h-4 w-4 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-neutral-900">24/7 Emergency Services</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-neutral-600 mb-4">
                  For urgent funeral services, spiritual emergencies, or immediate counseling needs:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 text-sm">
                    <Phone className="h-3.5 w-3.5 text-neutral-400" />
                    <span className="font-medium text-neutral-900">(404) 244-9577</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm">
                    <Mail className="h-3.5 w-3.5 text-neutral-400" />
                    <span className="text-neutral-700">emergency@masjidattaqwaatlanta.org</span>
                  </div>
                </div>
              </div>
              <div className="flex items-end sm:justify-end">
                <p className="text-xs text-neutral-400 italic leading-relaxed max-w-sm">
                  &ldquo;And it is He who created the heavens and earth in truth. And the day He says, &apos;Be,&apos; and it is, His word is the truth.&rdquo;
                  <span className="block mt-1 not-italic text-neutral-500">— Quran 6:73</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Services */}
        <section className="pb-16">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-xl font-semibold text-neutral-900">Core Services</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {featuredServices.map((service) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={service.id}
                  className="group rounded-xl border border-neutral-200 bg-white p-6 flex flex-col"
                >
                  {/* Icon + Title */}
                  <div className="mb-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                      <IconComponent className="h-5 w-5 text-emerald-600" />
                    </div>
                    <h3 className="text-base font-semibold text-neutral-900 leading-snug">
                      {service.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-neutral-500 leading-relaxed mb-5">
                    {service.description}
                  </p>

                  {/* Details */}
                  <div className="mb-5 flex-1">
                    <ul className="space-y-2">
                      {service.details.slice(0, 4).map((detail, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-neutral-600">
                          <ChevronRight className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                    {service.details.length > 4 && (
                      <p className="text-xs text-emerald-600 font-medium mt-2 ml-5.5">
                        + {service.details.length - 4} more services
                      </p>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="border-t border-neutral-100 pt-4 space-y-2.5">
                    <div className="text-xs">
                      <span className="font-medium text-neutral-900">Contact</span>
                      <p className="text-neutral-500 mt-0.5">{service.contact}</p>
                    </div>
                    <div className="text-xs">
                      <span className="font-medium text-neutral-900">Availability</span>
                      <p className="text-neutral-500 mt-0.5">{service.availability}</p>
                    </div>
                    {service.fee && (
                      <div className="text-xs">
                        <span className="font-medium text-neutral-900">Fee</span>
                        <p className="text-neutral-500 mt-0.5">{service.fee}</p>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <a
                    href="tel:4042449577"
                    className="mt-5 flex items-center justify-center gap-2 w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Schedule Consultation
                  </a>
                </div>
              );
            })}
          </div>
        </section>

        {/* Additional Services */}
        <section className="pb-16">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-xl font-semibold text-neutral-900">Additional Services</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {otherServices.map((service) => {
              const IconComponent = service.icon;
              return (
                <div
                  key={service.id}
                  className="rounded-xl border border-neutral-200 bg-white p-6 flex flex-col"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center shrink-0">
                      <IconComponent className="h-4 w-4 text-neutral-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 leading-snug">
                        {service.name}
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1">{service.availability}</p>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  <ul className="space-y-1.5 mb-4 flex-1">
                    {service.details.slice(0, 3).map((detail, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs text-neutral-600">
                        <ChevronRight className="h-3 w-3 text-neutral-300 mt-0.5 shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                    {service.details.length > 3 && (
                      <li className="text-xs text-emerald-600 font-medium ml-5">
                        + {service.details.length - 3} more
                      </li>
                    )}
                  </ul>

                  <div className="border-t border-neutral-100 pt-3 flex items-center justify-between text-xs">
                    <span className="text-neutral-500">{service.contact}</span>
                    <span className="text-neutral-400">{service.fee}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* How to Access + Contact */}
        <section className="pb-20">
          <div className="grid md:grid-cols-2 gap-5">
            {/* How to Access */}
            <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-6 sm:p-8">
              <h3 className="text-base font-semibold text-neutral-900 mb-6">
                How to Access Our Services
              </h3>
              <div className="space-y-5">
                {[
                  { step: '01', title: 'Initial Contact', desc: 'Call, email, or visit during office hours to discuss your needs' },
                  { step: '02', title: 'Consultation', desc: 'Meet with appropriate imam or coordinator for detailed discussion' },
                  { step: '03', title: 'Service Delivery', desc: 'Receive the support or service with Islamic guidance and care' },
                  { step: '04', title: 'Follow-up', desc: 'Ongoing support and check-ins as needed for your situation' },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <span className="text-xs font-bold text-emerald-600 tabular-nums mt-0.5">
                      {item.step}
                    </span>
                    <div>
                      <h4 className="text-sm font-medium text-neutral-900">{item.title}</h4>
                      <p className="text-xs text-neutral-500 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div className="rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
              <h3 className="text-base font-semibold text-neutral-900 mb-6">
                Contact & Office Hours
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-neutral-400" />
                  <span className="font-medium text-neutral-900">(404) 244-9577</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-neutral-400" />
                  <span className="text-neutral-700">info@masjidattaqwaatlanta.org</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-neutral-400 mt-0.5" />
                  <span className="text-neutral-700">2674 Woodwin Rd, Doraville, GA 30360</span>
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-5 mb-6">
                <p className="text-xs font-semibold tracking-wide uppercase text-neutral-400 mb-3">
                  Office Hours
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2.5">
                    <Clock className="h-3.5 w-3.5 text-neutral-400" />
                    <span className="text-neutral-600"><span className="font-medium text-neutral-900">Daily:</span> After each prayer</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                    <span className="text-neutral-600"><span className="font-medium text-neutral-900">Appointments:</span> Available 7 days a week</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="h-3.5 w-3.5 text-neutral-400" />
                    <span className="text-neutral-600"><span className="font-medium text-neutral-900">Emergency:</span> 24/7 for funeral services</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-5">
                <p className="text-xs text-neutral-400 italic leading-relaxed">
                  &ldquo;And whoever does righteous deeds, whether male or female, while being a believer — those will enter Paradise and will not be wronged, [even as much as] the speck on a date seed.&rdquo;
                  <span className="block mt-1 not-italic text-neutral-500">— Quran 4:124</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
