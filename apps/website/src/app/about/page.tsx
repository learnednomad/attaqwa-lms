import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Handshake
} from 'lucide-react';
import Link from 'next/link';
import { MOSQUE_INFO } from '@/constants';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-5xl font-bold text-islamic-navy-800 mb-6">
          About Masjid At-Taqwa
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          A place of worship, community, and learning dedicated to serving the Muslim community 
          with authentic Islamic education, spiritual guidance, and community support.
        </p>
      </section>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Heart className="h-6 w-6 text-islamic-green-600" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg">
            <p className="text-gray-700 leading-relaxed">
              To provide a welcoming space for worship, education, and community building 
              that strengthens the faith of Muslims and promotes understanding of Islamic 
              values. We strive to serve Allah (SWT) by serving our community with 
              authentic Islamic teachings and practical guidance for daily life.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <BookOpen className="h-6 w-6 text-islamic-gold-600" />
              Our Vision
            </CardTitle>
          </CardHeader>
          <CardContent className="text-lg">
            <p className="text-gray-700 leading-relaxed">
              To be a thriving Islamic center that nurtures spiritual growth, 
              educational excellence, and community unity. We envision a future where 
              Muslims of all ages find knowledge, support, and brotherhood in their 
              journey toward Allah (SWT) and service to humanity.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Our Services */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-islamic-navy-800 text-center mb-8">
          What We Offer
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="bg-islamic-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Building className="h-8 w-8 text-islamic-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-islamic-navy-800 mb-2">
                Daily Prayers
              </h3>
              <p className="text-gray-600">
                Five daily congregational prayers with Adhan and Iqamah times. 
                Friday Jummah prayers with khutbah in Arabic and English.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="bg-islamic-gold-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-islamic-gold-600" />
              </div>
              <h3 className="text-xl font-semibold text-islamic-navy-800 mb-2">
                Islamic Education
              </h3>
              <p className="text-gray-600">
                Comprehensive Islamic education for all ages including Quran studies, 
                Arabic language classes, and Islamic history and jurisprudence.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-islamic-navy-800 mb-2">
                Community Events
              </h3>
              <p className="text-gray-600">
                Regular community gatherings, Eid celebrations, Ramadan activities, 
                and interfaith dialogue to strengthen bonds and share Islamic values.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-islamic-navy-800 mb-2">
                Community Support
              </h3>
              <p className="text-gray-600">
                Marriage counseling, funeral services, convert support, 
                and assistance for community members in need.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="bg-emerald-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Handshake className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-islamic-navy-800 mb-2">
                Youth Programs
              </h3>
              <p className="text-gray-600">
                Engaging youth programs including Islamic education, 
                sports activities, and leadership development opportunities.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-islamic-navy-800 mb-2">
                Islamic Events
              </h3>
              <p className="text-gray-600">
                Special observances including Ramadan programs, Hajj preparation, 
                and Islamic holiday celebrations throughout the year.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* History & Values */}
      <section className="mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-3xl font-bold text-islamic-navy-800 mb-6">Our History</h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                <strong>Masjid At-Taqwa was founded in 2005</strong> through the efforts of a few dedicated brothers 
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
                which transitioned the women's section therein to accommodate the growing number of attendees. 
                This also allowed the expansion of the school and classes, as well as the purchasing of surrounding 
                lands to allow recreational spaces.
              </p>
              <p>
                Due to the death of a community member, there were issues which arose demanding the need for 
                further facilitations for the community. It was then, by the grace of Allah, that the second 
                Project of Masjid At-Taqwa was undertaken: <strong>a cemetery and funeral home for the Muslims</strong>.
              </p>
              <p>
                After the purchase, the burial of the first Muslims were facilitated and it is currently going 
                through further development. Soon after, due to further growing demands of masjid and school space, 
                the plans have been passed for a <strong>new masjid building</strong> and it is currently going through 
                the first initial phases for its completion.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-islamic-navy-800 mb-6">Our Values</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="bg-islamic-green-100 p-2 rounded-full mt-1">
                  <BookOpen className="h-4 w-4 text-islamic-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-islamic-navy-800">Authentic Islamic Education</h4>
                  <p className="text-gray-600 text-sm">
                    Teaching based on Quran and authentic Sunnah with scholarly guidance
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-islamic-gold-100 p-2 rounded-full mt-1">
                  <Users className="h-4 w-4 text-islamic-gold-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-islamic-navy-800">Community Unity</h4>
                  <p className="text-gray-600 text-sm">
                    Building strong bonds among Muslims and promoting brotherhood
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full mt-1">
                  <Heart className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-islamic-navy-800">Compassionate Service</h4>
                  <p className="text-gray-600 text-sm">
                    Serving our community with kindness and understanding
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-2 rounded-full mt-1">
                  <Handshake className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-islamic-navy-800">Interfaith Dialogue</h4>
                  <p className="text-gray-600 text-sm">
                    Promoting understanding and peaceful coexistence with all communities
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Visit Us</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <MapPin className="h-6 w-6 text-islamic-green-600" />
                <h4 className="font-semibold text-islamic-navy-800">Location</h4>
                <p className="text-gray-600 text-sm">
                  {MOSQUE_INFO.address}<br />
                  {MOSQUE_INFO.city}, {MOSQUE_INFO.province} {MOSQUE_INFO.postalCode}
                </p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Phone className="h-6 w-6 text-islamic-green-600" />
                <h4 className="font-semibold text-islamic-navy-800">Phone</h4>
                <p className="text-gray-600 text-sm">
                  {MOSQUE_INFO.phone}
                </p>
              </div>

              <div className="flex flex-col items-center gap-2">
                <Mail className="h-6 w-6 text-islamic-green-600" />
                <h4 className="font-semibold text-islamic-navy-800">Email</h4>
                <p className="text-gray-600 text-sm">
                  {MOSQUE_INFO.email}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Prayer Times */}
      <section className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Prayer Times</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                We hold all five daily prayers in congregation. Join us for spiritual connection and community.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-islamic-navy-800">Fajr</div>
                  <div className="text-gray-600">Dawn Prayer</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-islamic-navy-800">Dhuhr</div>
                  <div className="text-gray-600">Midday Prayer</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-islamic-navy-800">Asr</div>
                  <div className="text-gray-600">Afternoon Prayer</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-islamic-navy-800">Maghrib</div>
                  <div className="text-gray-600">Sunset Prayer</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-islamic-navy-800">Isha</div>
                  <div className="text-gray-600">Night Prayer</div>
                </div>
              </div>

              <Link href="/prayer-times">
                <Button className="bg-islamic-green-600 hover:bg-islamic-green-700">
                  <Clock className="h-4 w-4 mr-2" />
                  View Current Prayer Times
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Leadership */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-islamic-navy-800 text-center mb-8">
          Our Leadership
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-20 h-20 bg-islamic-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Users className="h-10 w-10 text-islamic-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-islamic-navy-800 mb-2">
                Imam Abdullah Rahman
              </h4>
              <p className="text-islamic-green-600 font-medium mb-2">Lead Imam</p>
              <p className="text-gray-600 text-sm">
                Over 15 years of Islamic scholarship and community leadership. 
                Specializes in Quranic studies and Islamic jurisprudence.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-20 h-20 bg-islamic-gold-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="h-10 w-10 text-islamic-gold-600" />
              </div>
              <h4 className="text-xl font-semibold text-islamic-navy-800 mb-2">
                Sister Aisha Mohamed
              </h4>
              <p className="text-islamic-gold-600 font-medium mb-2">Education Director</p>
              <p className="text-gray-600 text-sm">
                Masters in Islamic Studies with expertise in women's and children's 
                Islamic education programs.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Handshake className="h-10 w-10 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-islamic-navy-800 mb-2">
                Brother Omar Hassan
              </h4>
              <p className="text-blue-600 font-medium mb-2">Community Coordinator</p>
              <p className="text-gray-600 text-sm">
                Manages community outreach, volunteer programs, and interfaith initiatives 
                to strengthen community bonds.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Get Involved */}
      <section className="text-center">
        <Card className="bg-gradient-to-r from-islamic-green-50 to-islamic-gold-50 border-islamic-green-200">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-islamic-navy-800 mb-4">
              Join Our Community
            </h2>
            <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
              Whether you're new to Islam, visiting our area, or looking for a spiritual home, 
              you're welcome at Masjid At-Taqwa. Come as you are, learn, grow, and be part 
              of our extended family.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/events">
                <Button size="lg" className="bg-islamic-green-600 hover:bg-islamic-green-700">
                  <Calendar className="h-5 w-5 mr-2" />
                  Upcoming Events
                </Button>
              </Link>
              
              <Link href="/education">
                <Button size="lg" variant="outline" className="border-islamic-green-600 text-islamic-green-600 hover:bg-islamic-green-50">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Start Learning
                </Button>
              </Link>
              
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-islamic-navy-600 text-islamic-navy-600 hover:bg-islamic-navy-50">
                  <Phone className="h-5 w-5 mr-2" />
                  Contact Us
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}