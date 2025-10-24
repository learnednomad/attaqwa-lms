import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Phone, Mail, Clock, Users, Send, MessageSquare, Facebook, Youtube } from 'lucide-react';
import { MOSQUE_INFO } from '@attaqwa/shared';
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

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="mb-4 text-3xl font-bold text-islamic-navy-800 md:text-4xl">
          Contact Masjid At-Taqwa
        </h1>
        <p className="text-lg text-islamic-navy-600 max-w-3xl">
          We welcome your questions, feedback, and suggestions. Whether you're looking for 
          information about prayer times, Islamic education, community events, or need 
          spiritual guidance, our team is here to help.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-islamic-green-600" />
                Send Us a Message
              </CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" placeholder="Your first name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" placeholder="Your last name" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input id="email" type="email" placeholder="your.email@example.com" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="(555) 123-4567" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="prayer-times">Prayer Times</SelectItem>
                    <SelectItem value="education">Islamic Education</SelectItem>
                    <SelectItem value="events">Events & Programs</SelectItem>
                    <SelectItem value="donations">Donations & Zakat</SelectItem>
                    <SelectItem value="volunteer">Volunteer Opportunities</SelectItem>
                    <SelectItem value="facility">Facility Rental</SelectItem>
                    <SelectItem value="counseling">Religious Counseling</SelectItem>
                    <SelectItem value="nikah">Nikah (Marriage) Services</SelectItem>
                    <SelectItem value="janazah">Janazah (Funeral) Services</SelectItem>
                    <SelectItem value="website">Website Feedback</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea 
                  id="message" 
                  placeholder="Please describe your inquiry or provide any additional details..." 
                  className="min-h-32"
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferred-contact">Preferred Contact Method</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="How would you like us to respond?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone Call</SelectItem>
                    <SelectItem value="both">Either Email or Phone</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full sm:w-auto" size="lg">
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </Button>

              <p className="text-sm text-islamic-navy-600">
                * Required fields. We typically respond within 24 hours during business days.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          {/* Quick Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-islamic-green-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-islamic-navy-800">Address</p>
                  <p className="text-sm text-islamic-navy-600">{contactInfo.address}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 text-islamic-green-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-islamic-navy-800">Phone</p>
                  <p className="text-sm text-islamic-navy-600">{contactInfo.phone}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 text-islamic-green-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-islamic-navy-800">Email</p>
                  <p className="text-sm text-islamic-navy-600">Imam: {contactInfo.email}</p>
                  <p className="text-sm text-islamic-navy-600">School: {contactInfo.schoolEmail}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Office Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-islamic-green-600" />
                Office Hours
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium text-islamic-navy-800">Office</p>
                <p className="text-sm text-islamic-navy-600">{contactInfo.hours.office}</p>
              </div>
              <div>
                <p className="font-medium text-islamic-navy-800">Prayer Hall</p>
                <p className="text-sm text-islamic-navy-600">{contactInfo.hours.prayers}</p>
              </div>
              <div>
                <p className="font-medium text-islamic-navy-800">Jummah</p>
                <p className="text-sm text-islamic-navy-600">{contactInfo.hours.friday}</p>
              </div>
              <div>
                <p className="font-medium text-islamic-navy-800">Weekend</p>
                <p className="text-sm text-islamic-navy-600">{contactInfo.hours.weekend}</p>
              </div>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Follow Us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Facebook className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-islamic-navy-800">Facebook</p>
                  <a 
                    href={contactInfo.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Masjid At-Taqwa Atlanta
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Youtube className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-islamic-navy-800">YouTube</p>
                  <a 
                    href={contactInfo.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-red-600 hover:underline"
                  >
                    Masjid At-Taqwa Channel
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="bg-islamic-gold-50 border-islamic-gold-200">
            <CardContent className="p-4">
              <h3 className="mb-2 font-semibold text-islamic-gold-800">Emergency Contact</h3>
              <p className="text-sm text-islamic-gold-700 mb-3">
                For urgent religious matters (Janazah services, emergencies):
              </p>
              <p className="font-medium text-islamic-gold-800">{contactInfo.phone}</p>
              <p className="text-sm text-islamic-gold-600">Please call for urgent matters</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Staff Directory */}
      <section className="mt-12">
        <header className="mb-6">
          <h2 className="mb-2 text-2xl font-bold text-islamic-navy-800 flex items-center gap-2">
            <Users className="h-6 w-6 text-islamic-green-600" />
            Our Team
          </h2>
          <p className="text-islamic-navy-600">
            Meet our dedicated staff members who serve our Islamic community.
          </p>
        </header>
        
        <div className="grid gap-6 md:grid-cols-2">
          {staff.map((member, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{member.name}</CardTitle>
                <CardDescription className="text-islamic-green-600 font-medium">
                  {member.title}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-islamic-navy-400" />
                    <a href={`mailto:${member.email}`} className="text-islamic-green-600 hover:underline">
                      {member.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-islamic-navy-400" />
                    <span className="text-islamic-navy-600">{member.phone}</span>
                  </div>
                  
                  {member.education && (
                    <div>
                      <p className="text-sm font-medium text-islamic-navy-800 mb-2">Education:</p>
                      <ul className="text-sm text-islamic-navy-600 space-y-1">
                        {member.education.map((edu, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-islamic-gold-600 rounded-full"></span>
                            {edu}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {member.experience && (
                    <div>
                      <p className="text-sm font-medium text-islamic-navy-800 mb-2">Experience:</p>
                      <ul className="text-sm text-islamic-navy-600 space-y-1">
                        {member.experience.map((exp, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-islamic-green-600 rounded-full"></span>
                            {exp}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {member.languages && (
                    <div>
                      <p className="text-sm font-medium text-islamic-navy-800 mb-2">Languages:</p>
                      <div className="flex flex-wrap gap-1">
                        {member.languages.map((lang, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 bg-islamic-green-100 text-islamic-green-800 rounded-full">
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {member.classes && (
                    <div>
                      <p className="text-sm font-medium text-islamic-navy-800 mb-2">Classes & Teaching:</p>
                      <ul className="text-sm text-islamic-navy-600 space-y-1">
                        {member.classes.map((cls, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-islamic-navy-600 rounded-full"></span>
                            {cls}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm font-medium text-islamic-navy-800 mb-2">Responsibilities:</p>
                    <ul className="text-sm text-islamic-navy-600 space-y-1">
                      {member.responsibilities.map((responsibility, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-islamic-green-600 rounded-full"></span>
                          {responsibility}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Map Section */}
      <section className="mt-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-islamic-green-600" />
              Location & Directions
            </CardTitle>
            <CardDescription>
              Find us easily with our location details and parking information.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="mb-3 font-semibold text-islamic-navy-800">Getting Here</h3>
                <div className="space-y-3 text-sm text-islamic-navy-600">
                  <p>
                    <strong>By Car:</strong> Take Exit 15 from Highway 101. Turn right on Main Street, 
                    then left on Islamic Center Drive. The mosque will be on your right.
                  </p>
                  <p>
                    <strong>By Public Transit:</strong> Take Bus Route 42 to the Islamic Center stop. 
                    The mosque is a 2-minute walk from the bus stop.
                  </p>
                  <p>
                    <strong>Parking:</strong> Free parking available in our main lot. Additional 
                    parking during Jummah and special events in the adjacent community center lot.
                  </p>
                </div>
              </div>
              <div>
                <h3 className="mb-3 font-semibold text-islamic-navy-800">Nearby Landmarks</h3>
                <div className="space-y-2 text-sm text-islamic-navy-600">
                  <p>• Next to City Community Center</p>
                  <p>• Across from Sunshine Elementary School</p>
                  <p>• 0.5 miles from Downtown Shopping District</p>
                  <p>• Near the intersection of Main St & Center Dr</p>
                </div>
                
                <div className="mt-6">
                  <Button variant="outline" className="w-full">
                    <MapPin className="mr-2 h-4 w-4" />
                    Open in Google Maps
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Placeholder for actual map */}
            <div className="mt-6 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="mx-auto mb-2 h-8 w-8" />
                <p>Interactive map will be displayed here</p>
                <p className="text-sm">{contactInfo.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ Section */}
      <section className="mt-12">
        <Card className="bg-islamic-green-50 border-islamic-green-200">
          <CardContent className="p-8">
            <h3 className="mb-6 text-2xl font-bold text-islamic-green-800">
              Frequently Asked Questions
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-semibold text-islamic-green-800">
                  What are your prayer times?
                </h4>
                <p className="text-sm text-islamic-green-700 mb-4">
                  Prayer times change daily. Please check our prayer times page or call for today's schedule.
                </p>
                
                <h4 className="mb-2 font-semibold text-islamic-green-800">
                  Do you offer Islamic education classes?
                </h4>
                <p className="text-sm text-islamic-green-700 mb-4">
                  Yes, we offer classes for all ages including Quran study, Arabic language, and Islamic studies.
                </p>

                <h4 className="mb-2 font-semibold text-islamic-green-800">
                  Can non-Muslims visit the mosque?
                </h4>
                <p className="text-sm text-islamic-green-700">
                  Absolutely! We welcome visitors of all backgrounds. Please contact us to arrange a tour.
                </p>
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-islamic-green-800">
                  How can I get involved in the community?
                </h4>
                <p className="text-sm text-islamic-green-700 mb-4">
                  Contact our Community Coordinator to learn about volunteer opportunities and ways to contribute.
                </p>
                
                <h4 className="mb-2 font-semibold text-islamic-green-800">
                  Do you provide marriage and funeral services?
                </h4>
                <p className="text-sm text-islamic-green-700 mb-4">
                  Yes, our Imam provides Nikah (marriage) and Janazah (funeral) services. Please contact us for arrangements.
                </p>

                <h4 className="mb-2 font-semibold text-islamic-green-800">
                  Is there parking available?
                </h4>
                <p className="text-sm text-islamic-green-700">
                  Yes, we have free parking on-site. Additional parking is available during busy times.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}