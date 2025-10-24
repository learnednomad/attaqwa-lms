import { Heart, Users, BookOpen, Phone, Mail, Calendar, Clock, MapPin, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export const metadata = {
  title: 'Services | Masjid At-Taqwa',
  description: 'Comprehensive Islamic services including Nikah ceremonies, funeral services, counseling, community support, and spiritual guidance at Masjid At-Taqwa.',
};

interface Service {
  id: string;
  name: string;
  description: string;
  details: string[];
  process: string[];
  requirements?: string[];
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
    process: [
      'Initial consultation with Imam to discuss requirements',
      'Pre-marital counseling sessions (recommended)',
      'Marriage contract preparation and review',
      'Ceremony scheduling and arrangements',
      'Nikah ceremony with Khutbah and duas',
      'Documentation completion and filing'
    ],
    requirements: [
      'Valid identification for both parties',
      'Witnesses (two male or one male and two female Muslims)',
      'Mahr amount agreed upon by both parties',
      'Parents/guardians consent (if applicable)',
      'Previous marriage dissolution documentation (if applicable)'
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
    process: [
      'Immediate contact with masjid for urgent arrangements',
      'Body preparation coordination with funeral home',
      'Janazah prayer scheduling at masjid',
      'Burial arrangements at Islamic cemetery',
      'Family support and counseling',
      'Follow-up memorial services if requested'
    ],
    requirements: [
      'Death certificate and legal documentation',
      'Family authorization for burial arrangements',
      'Coordination with licensed funeral home',
      'Islamic cemetery plot arrangement'
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
    process: [
      'Initial confidential consultation',
      'Assessment of needs and Islamic guidance approach',
      'Regular counseling sessions as needed',
      'Islamic solutions and practical advice',
      'Follow-up support and check-ins',
      'Referral to professional services when needed'
    ],
    requirements: [
      'Appointment scheduling in advance',
      'Commitment to Islamic values and guidance',
      'Confidentiality agreement',
      'Openness to Quranic and Sunnah guidance'
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
    process: [
      'Contact masjid office to discuss needs',
      'Confidential assessment of assistance required',
      'Connect with appropriate resources',
      'Ongoing support and follow-up',
      'Community volunteer coordination'
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
    process: [
      'Schedule consultation with qualified Imam',
      'Present question or situation clearly',
      'Receive detailed Islamic guidance',
      'Follow-up questions and clarifications',
      'Written guidance provided when requested'
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
    process: [
      'Initial consultation with youth coordinators',
      'Assessment of individual/family needs',
      'Matching with appropriate programs or mentors',
      'Regular participation in activities',
      'Progress monitoring and family updates'
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-islamic-green-700 mb-4">Community Services</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Comprehensive Islamic services to support our community through life's important moments, 
          spiritual guidance, and everyday challenges with compassion and Islamic principles.
        </p>
      </div>

      {/* Emergency Contact Card */}
      <Card className="mb-8 bg-islamic-navy-50 border-islamic-navy-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-islamic-navy-800">
            <Phone className="h-5 w-5 text-islamic-navy-600" />
            24/7 Emergency Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-islamic-navy-700 mb-2">
                For urgent funeral services, spiritual emergencies, or immediate counseling needs:
              </p>
              <div className="space-y-1 text-sm">
                <p><strong>Phone:</strong> (404) 244-9577</p>
                <p><strong>Email:</strong> emergency@masjidattaqwaatlanta.org</p>
                <p><strong>After Hours:</strong> Contact imam directly through masjid phone</p>
              </div>
            </div>
            <div className="text-center">
              <Badge className="bg-islamic-navy-600 text-white px-4 py-2">
                Available 24/7 for Emergencies
              </Badge>
              <p className="text-sm text-islamic-navy-600 mt-2">
                "And it is He who created the heavens and earth in truth. And the day He says, 'Be,' and it is, His word is the truth." - Quran 6:73
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Services */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-islamic-green-700 text-center mb-8">Core Services</h2>
        <div className="grid lg:grid-cols-3 gap-8">
          {featuredServices.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card key={service.id} className="islamic-pattern border-islamic-green-200 relative">
                <div className="absolute top-4 right-4">
                  <Star className="h-5 w-5 text-islamic-gold-600 fill-islamic-gold-600" />
                </div>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-islamic-green-100 rounded-lg">
                      <IconComponent className="h-6 w-6 text-islamic-green-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl text-islamic-green-700 mb-2">
                        {service.name}
                      </CardTitle>
                      <p className="text-muted-foreground text-sm">{service.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-islamic-green-700 mb-2">Service Includes:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {service.details.slice(0, 4).map((detail, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-islamic-green-600 mt-0.5">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                      {service.details.length > 4 && (
                        <li className="text-islamic-green-600 text-sm font-medium">
                          + {service.details.length - 4} more services
                        </li>
                      )}
                    </ul>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-islamic-green-700">Contact:</span>
                      <p className="text-muted-foreground">{service.contact}</p>
                    </div>
                    <div>
                      <span className="font-medium text-islamic-green-700">Availability:</span>
                      <p className="text-muted-foreground">{service.availability}</p>
                    </div>
                    {service.fee && (
                      <div>
                        <span className="font-medium text-islamic-green-700">Fee:</span>
                        <p className="text-muted-foreground">{service.fee}</p>
                      </div>
                    )}
                  </div>

                  <Button className="w-full bg-islamic-green-600 hover:bg-islamic-green-700">
                    <Phone className="h-4 w-4 mr-2" />
                    Schedule Consultation
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Additional Services */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-islamic-green-700 text-center mb-8">Additional Community Services</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {otherServices.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card key={service.id} className="border-islamic-green-100">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-islamic-green-50 rounded-lg">
                      <IconComponent className="h-5 w-5 text-islamic-green-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-islamic-green-700 mb-1">
                        {service.name}
                      </CardTitle>
                      <p className="text-muted-foreground text-sm">{service.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-islamic-green-700 mb-2">What We Offer:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {service.details.slice(0, 3).map((detail, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-islamic-green-600 mt-0.5">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                      {service.details.length > 3 && (
                        <li className="text-islamic-green-600 text-sm">
                          + {service.details.length - 3} more offerings
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium text-islamic-green-700">Contact:</span>
                      <span className="text-muted-foreground text-right">{service.contact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-islamic-green-700">Available:</span>
                      <span className="text-muted-foreground text-right">{service.availability}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-islamic-green-700">Fee:</span>
                      <span className="text-muted-foreground text-right">{service.fee}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Service Process & Contact Information */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* How to Access Services */}
        <Card className="bg-islamic-green-50 border-islamic-green-200">
          <CardHeader>
            <CardTitle className="text-islamic-green-700">How to Access Our Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-islamic-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-islamic-green-700">Initial Contact</h4>
                  <p className="text-sm text-muted-foreground">
                    Call, email, or visit during office hours to discuss your needs
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-islamic-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-islamic-green-700">Consultation</h4>
                  <p className="text-sm text-muted-foreground">
                    Meet with appropriate imam or coordinator for detailed discussion
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-islamic-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-islamic-green-700">Service Delivery</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive the support or service with Islamic guidance and care
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-islamic-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-islamic-green-700">Follow-up</h4>
                  <p className="text-sm text-muted-foreground">
                    Ongoing support and check-ins as needed for your situation
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-islamic-gold-50 border-islamic-gold-200">
          <CardHeader>
            <CardTitle className="text-islamic-gold-800">Contact & Office Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-islamic-gold-800 mb-3">Main Contact Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-islamic-gold-600" />
                  <span>(404) 244-9577</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-islamic-gold-600" />
                  <span>info@masjidattaqwaatlanta.org</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-islamic-gold-600 mt-0.5" />
                  <span>1584 Rogers Lake Rd, Lithonia, GA 30058</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold text-islamic-gold-800 mb-3">Office Hours</h4>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-islamic-gold-600" />
                  <span><strong>Daily:</strong> After each prayer</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-islamic-gold-600" />
                  <span><strong>Appointments:</strong> Available 7 days a week</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-islamic-gold-600" />
                  <span><strong>Emergency:</strong> 24/7 for funeral services</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="text-center">
              <p className="text-islamic-gold-800 font-medium text-sm">
                "And whoever does righteous deeds, whether male or female, while being a believer - those will enter Paradise and will not be wronged, [even as much as] the speck on a date seed."
              </p>
              <p className="text-xs text-muted-foreground mt-1">- Quran 4:124</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}