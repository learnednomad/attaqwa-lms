import { MapPin, Phone, Mail, Clock, Users, Send, MessageSquare, Facebook, Youtube, AlertCircle, ChevronRight, GraduationCap, BookOpen, Globe } from 'lucide-react';
import { generateSEOMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = generateSEOMetadata({
  title: "Contact Masjid At-Taqwa - Islamic Community Center",
  description: "Contact Masjid At-Taqwa for prayer times, Islamic education inquiries, event information, and community support. Visit us, call, or send a message to our Islamic center administration.",
  keywords: [
    "contact mosque",
    "islamic center contact",
    "masjid location",
    "prayer time inquiries",
    "islamic education contact",
    "mosque administration",
    "community support",
    "mosque phone number",
    "islamic center address",
    "mosque hours"
  ],
  canonical: "/contact",
  type: "website"
});

const contactInfo = {
  address: "2674 Woodwin Rd, Doraville, GA 30360",
  phone: "(678) 896-9257",
  email: "Mohammad30360@hotmail.com",
  schoolEmail: "Attaqwa.du@gmail.com",
  hours: {
    office: "Monday - Friday: 9:00 AM - 5:00 PM",
    prayers: "Daily prayers open to all",
    friday: "Jummah: 2:00 PM & 2:30 PM (Office closed 12:30-2:00 PM)",
    weekend: "Saturday - Sunday: Limited office hours"
  },
  social: {
    facebook: "https://www.facebook.com/MasjidAttaqwa2674WoodwinRd",
    youtube: "https://www.youtube.com/@MasjidAttaqwa2674"
  }
};

const staff = [
  {
    name: "Imam Mohammad Zahirul Islam",
    title: "Chief Imam",
    email: "Mohammad30360@hotmail.com",
    phone: "(678) 896-9257",
    education: [
      "MA in Islamic Studies",
      "Completed memorization of the Qur'an at Masjid An-Nabawi",
      "Studied Alimiyyah program with Shaykh Abdul Ghaffar from Georgia Islamic Institute"
    ],
    experience: [
      "Former Imam and teacher at Masjid Darus-Salam in GA, USA"
    ],
    languages: ["Bengali", "English"],
    classes: [
      "Tafseer class (English & Bengali)",
      "Qur'an & Islamic Studies for Adults (English & Bengali)",
      "Tahfeedhul Qur'an teacher"
    ],
    responsibilities: ["Religious guidance", "Nikah ceremonies", "Janazah services", "Religious counseling", "Community leadership"]
  },
  {
    name: "Imam Abdullah Khan",
    title: "Imam & Teacher",
    email: "Mohammad30360@hotmail.com",
    phone: "(678) 896-9257",
    education: [
      "BA in the Faculty of Shari'ah from University of Madinah",
      "MA in the Faculty of Qur'an from University of Madinah",
      "Completed memorization of the Qur'an from Masjid Miqat in Madinah",
      "Received Ijaazah from Masjid An-Nabawi"
    ],
    experience: [
      "Former Imaam of Masjid Al-'Alawah in Madinah",
      "Former Imaam of Masjid in Madinah"
    ],
    languages: ["Bengali", "English", "Arabic"],
    classes: [
      "Tafseer class (Arabic)",
      "Shari'ah & Aqeedah class (Arabic; online)",
      "Tahfeedhul Qur'an teacher",
      "Arabic language teacher"
    ],
    responsibilities: ["Islamic law guidance", "Arabic instruction", "Quran memorization supervision", "Advanced Islamic studies"]
  },
  {
    name: "School Administration",
    title: "Education Department",
    email: "Attaqwa.du@gmail.com",
    phone: "(678) 896-9257",
    responsibilities: ["Islamic education programs", "Weekend classes", "Homeschooling coordination", "Student registration", "Educational resources"]
  }
];

const subjectOptions = [
  'General Inquiry',
  'Prayer Times',
  'Islamic Education',
  'Events & Programs',
  'Donations & Zakat',
  'Volunteer Opportunities',
  'Facility Rental',
  'Religious Counseling',
  'Nikah (Marriage) Services',
  'Janazah (Funeral) Services',
  'Website Feedback',
];

const faqs = [
  {
    q: 'What are your prayer times?',
    a: 'Prayer times change daily. Please check our prayer times page or call for today\'s schedule.',
  },
  {
    q: 'Do you offer Islamic education classes?',
    a: 'Yes, we offer classes for all ages including Quran study, Arabic language, and Islamic studies.',
  },
  {
    q: 'Can non-Muslims visit the mosque?',
    a: 'Absolutely! We welcome visitors of all backgrounds. Please contact us to arrange a tour.',
  },
  {
    q: 'How can I get involved in the community?',
    a: 'Contact our Community Coordinator to learn about volunteer opportunities and ways to contribute.',
  },
  {
    q: 'Do you provide marriage and funeral services?',
    a: 'Yes, our Imam provides Nikah (marriage) and Janazah (funeral) services. Please contact us for arrangements.',
  },
  {
    q: 'Is there parking available?',
    a: 'Yes, we have free parking on-site. Additional parking is available during busy times.',
  },
];

const stats = [
  { label: 'Response Time', value: '24h', icon: Clock },
  { label: 'Team Members', value: '3', icon: Users },
  { label: 'Languages', value: '3', icon: Globe },
  { label: 'Programs', value: '10+', icon: BookOpen },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-700 mb-3">
            Masjid At-Taqwa
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4 max-w-2xl">
            Contact Us
          </h1>
          <p className="text-base text-neutral-500 max-w-2xl leading-relaxed">
            We welcome your questions, feedback, and suggestions. Whether you&apos;re looking for
            information about prayer times, Islamic education, community events, or need
            spiritual guidance, our team is here to help.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        {/* Stats */}
        <section className="py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div key={stat.label} className="rounded-xl border border-neutral-200 bg-white p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                      <IconComponent className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-neutral-900 leading-tight">{stat.value}</p>
                      <p className="text-xs text-neutral-500">{stat.label}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Contact Form + Sidebar */}
        <section className="pb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Get in Touch</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-2 rounded-xl border border-neutral-200 bg-white p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900">Send Us a Message</h3>
                  <p className="text-xs text-neutral-500">We&apos;ll get back to you as soon as possible</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="block text-xs font-medium text-neutral-700 mb-1.5">
                      First Name *
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="Your first name"
                      className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-xs font-medium text-neutral-700 mb-1.5">
                      Last Name *
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Your last name"
                      className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-neutral-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-xs font-medium text-neutral-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-medium text-neutral-700 mb-1.5">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300"
                    defaultValue=""
                  >
                    <option value="" disabled>Select a subject</option>
                    {subjectOptions.map((opt) => (
                      <option key={opt} value={opt.toLowerCase().replace(/\s+/g, '-')}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-neutral-700 mb-1.5">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    placeholder="Please describe your inquiry or provide any additional details..."
                    rows={5}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300 resize-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="preferred-contact" className="block text-xs font-medium text-neutral-700 mb-1.5">
                    Preferred Contact Method
                  </label>
                  <select
                    id="preferred-contact"
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-300"
                    defaultValue=""
                  >
                    <option value="" disabled>How would you like us to respond?</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone Call</option>
                    <option value="both">Either Email or Phone</option>
                  </select>
                </div>

                <button className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white w-full sm:w-auto">
                  <Send className="h-3.5 w-3.5" />
                  Send Message
                </button>

                <p className="text-xs text-neutral-400">
                  * Required fields. We typically respond within 24 hours during business days.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Quick Contact */}
              <div className="rounded-xl border border-neutral-200 bg-white p-5">
                <h3 className="text-sm font-semibold text-neutral-900 mb-4">Quick Contact</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-neutral-900">Address</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{contactInfo.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Phone className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-neutral-900">Phone</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{contactInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Mail className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-neutral-900">Email</p>
                      <p className="text-xs text-neutral-500 mt-0.5">Imam: {contactInfo.email}</p>
                      <p className="text-xs text-neutral-500">School: {contactInfo.schoolEmail}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div className="rounded-xl border border-neutral-200 bg-white p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center">
                    <Clock className="h-3.5 w-3.5 text-neutral-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900">Office Hours</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-neutral-900">Office</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{contactInfo.hours.office}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-900">Prayer Hall</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{contactInfo.hours.prayers}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-900">Jummah</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{contactInfo.hours.friday}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-neutral-900">Weekend</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{contactInfo.hours.weekend}</p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="rounded-xl border border-neutral-200 bg-white p-5">
                <h3 className="text-sm font-semibold text-neutral-900 mb-4">Follow Us</h3>
                <div className="space-y-3">
                  <a
                    href={contactInfo.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm"
                  >
                    <div className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center shrink-0">
                      <Facebook className="h-3.5 w-3.5 text-neutral-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-neutral-900">Facebook</p>
                      <p className="text-xs text-neutral-500">Masjid At-Taqwa Atlanta</p>
                    </div>
                  </a>
                  <a
                    href={contactInfo.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm"
                  >
                    <div className="w-8 h-8 rounded-lg bg-neutral-50 border border-neutral-100 flex items-center justify-center shrink-0">
                      <Youtube className="h-3.5 w-3.5 text-neutral-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-neutral-900">YouTube</p>
                      <p className="text-xs text-neutral-500">Masjid At-Taqwa Channel</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5">
                <div className="flex items-center gap-2.5 mb-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <h3 className="text-sm font-semibold text-amber-900">Emergency Contact</h3>
                </div>
                <p className="text-xs text-amber-700 mb-2">
                  For urgent religious matters (Janazah services, emergencies):
                </p>
                <p className="text-sm font-medium text-amber-900">{contactInfo.phone}</p>
                <p className="text-xs text-amber-600 mt-0.5">Please call for urgent matters</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="pb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Our Team</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>
          <p className="text-sm text-neutral-500 mb-6">
            Meet our dedicated staff members who serve our Islamic community.
          </p>

          <div className="grid md:grid-cols-2 gap-5">
            {staff.map((member, index) => (
              <div key={index} className="rounded-xl border border-neutral-200 bg-white p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <Users className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900">{member.name}</h3>
                    <p className="text-xs text-emerald-600 font-medium mt-0.5">{member.title}</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-neutral-500">
                    <Mail className="h-3.5 w-3.5 text-neutral-400" />
                    <a href={`mailto:${member.email}`} className="text-emerald-600">
                      {member.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-500">
                    <Phone className="h-3.5 w-3.5 text-neutral-400" />
                    <span>{member.phone}</span>
                  </div>

                  {member.education && (
                    <div className="pt-2 border-t border-neutral-100">
                      <p className="font-medium text-neutral-900 mb-1.5">Education</p>
                      <ul className="space-y-1">
                        {member.education.map((edu, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-neutral-600">
                            <div className="w-1 h-1 bg-emerald-400 rounded-full shrink-0 mt-1.5" />
                            {edu}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {member.experience && (
                    <div className="pt-2 border-t border-neutral-100">
                      <p className="font-medium text-neutral-900 mb-1.5">Experience</p>
                      <ul className="space-y-1">
                        {member.experience.map((exp, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-neutral-600">
                            <div className="w-1 h-1 bg-emerald-400 rounded-full shrink-0 mt-1.5" />
                            {exp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {member.languages && (
                    <div className="pt-2 border-t border-neutral-100">
                      <p className="font-medium text-neutral-900 mb-1.5">Languages</p>
                      <div className="flex flex-wrap gap-1.5">
                        {member.languages.map((lang, idx) => (
                          <span key={idx} className="px-2 py-0.5 text-[10px] font-medium bg-neutral-100 text-neutral-600 rounded-md border border-neutral-200">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {member.classes && (
                    <div className="pt-2 border-t border-neutral-100">
                      <p className="font-medium text-neutral-900 mb-1.5">Classes & Teaching</p>
                      <ul className="space-y-1">
                        {member.classes.map((cls, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-neutral-600">
                            <div className="w-1 h-1 bg-neutral-400 rounded-full shrink-0 mt-1.5" />
                            {cls}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-2 border-t border-neutral-100">
                    <p className="font-medium text-neutral-900 mb-1.5">Responsibilities</p>
                    <ul className="space-y-1">
                      {member.responsibilities.map((responsibility, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-neutral-600">
                          <div className="w-1 h-1 bg-emerald-400 rounded-full shrink-0 mt-1.5" />
                          {responsibility}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Location & Directions */}
        <section className="pb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Location & Directions</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">Getting Here</h3>
                <div className="space-y-3 text-sm text-neutral-500 leading-relaxed">
                  <p>
                    <span className="font-medium text-neutral-700">By Car:</span> Take Exit 15 from Highway 101. Turn right on Main Street,
                    then left on Islamic Center Drive. The mosque will be on your right.
                  </p>
                  <p>
                    <span className="font-medium text-neutral-700">By Public Transit:</span> Take Bus Route 42 to the Islamic Center stop.
                    The mosque is a 2-minute walk from the bus stop.
                  </p>
                  <p>
                    <span className="font-medium text-neutral-700">Parking:</span> Free parking available in our main lot. Additional
                    parking during Jummah and special events in the adjacent community center lot.
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">Nearby Landmarks</h3>
                <ul className="space-y-2 text-sm text-neutral-500">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-neutral-400 rounded-full shrink-0" />
                    Next to City Community Center
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-neutral-400 rounded-full shrink-0" />
                    Across from Sunshine Elementary School
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-neutral-400 rounded-full shrink-0" />
                    0.5 miles from Downtown Shopping District
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-neutral-400 rounded-full shrink-0" />
                    Near the intersection of Main St & Center Dr
                  </li>
                </ul>

                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(contactInfo.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-5 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700"
                >
                  <MapPin className="h-3.5 w-3.5" />
                  Open in Google Maps
                </a>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="mt-6 h-56 rounded-lg border border-neutral-200 bg-neutral-50 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="mx-auto mb-2 h-6 w-6 text-neutral-300" />
                <p className="text-xs text-neutral-400">Interactive map will be displayed here</p>
                <p className="text-xs text-neutral-500 font-medium mt-1">{contactInfo.address}</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-16">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Frequently Asked Questions</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-6 sm:p-8">
            <div className="grid md:grid-cols-2 gap-6">
              {faqs.map((faq, i) => (
                <div key={i}>
                  <h4 className="text-sm font-semibold text-neutral-900 mb-1.5">{faq.q}</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-20">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-8 sm:p-10 text-center">
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Visit Us Today
            </h3>
            <p className="text-sm text-neutral-500 max-w-xl mx-auto mb-6 leading-relaxed">
              Our doors are always open. Come join our community for prayers,
              educational programs, and community events.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/prayer-times"
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white"
              >
                View Prayer Times
              </a>
              <a
                href="/events"
                className="inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700"
              >
                Upcoming Events
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
