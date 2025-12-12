import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Phone, Users, FileText, Clock, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Funeral Services | Masjid At-Taqwa',
  description: 'Islamic funeral rites, burial assistance, and family support services',
};

export default function FuneralServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-islamic-green-50 via-white to-islamic-gold-50/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-islamic-navy-800 mb-4">
            Funeral Services
          </h1>
          <p className="text-xl text-islamic-navy-600 max-w-3xl mx-auto">
            Compassionate support and guidance for Islamic funeral rites, burial services, and family assistance during difficult times
          </p>
        </div>

        {/* Emergency Contact */}
        <Card className="mb-12 bg-islamic-green-50 border-islamic-green-200">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Phone className="w-6 h-6 text-islamic-green-600" />
                <div>
                  <h3 className="font-semibold text-lg">24/7 Emergency Contact</h3>
                  <p className="text-islamic-navy-600">For immediate assistance</p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-2xl font-bold text-islamic-green-600">(555) 123-4567</p>
                <p className="text-sm text-islamic-navy-600">Available 24 hours a day</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Heart className="w-8 h-8 text-islamic-green-600 mb-2" />
              <CardTitle>Ghusl Services</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Islamic ritual washing performed by trained volunteers with respect and dignity.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-8 h-8 text-islamic-green-600 mb-2" />
              <CardTitle>Janazah Prayer</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Congregational funeral prayer services held at the masjid or graveside.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <MapPin className="w-8 h-8 text-islamic-green-600 mb-2" />
              <CardTitle>Burial Assistance</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Coordination with Islamic cemeteries and assistance with burial arrangements.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Comprehensive Services */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Complete Funeral Support</CardTitle>
            <CardDescription>We provide comprehensive assistance during your time of need</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-3">Immediate Services</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-islamic-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">Death Certificate Assistance</h4>
                      <p className="text-sm text-islamic-navy-600">Help with documentation and legal requirements</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-islamic-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">Transportation</h4>
                      <p className="text-sm text-islamic-navy-600">Arrangement of body transportation to funeral home or cemetery</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-islamic-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">Kafan (Shroud) Provision</h4>
                      <p className="text-sm text-islamic-navy-600">Islamic burial shrouds available at the masjid</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-3">Family Support</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-islamic-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">Grief Counseling</h4>
                      <p className="text-sm text-islamic-navy-600">Islamic grief counseling and spiritual support</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-islamic-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">Meal Support</h4>
                      <p className="text-sm text-islamic-navy-600">Community meal coordination for bereaved families</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-islamic-green-600 mt-1" />
                    <div>
                      <h4 className="font-semibold">Financial Assistance</h4>
                      <p className="text-sm text-islamic-navy-600">Support for families facing financial hardship</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Islamic Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-semibold">Burial Timeline</h4>
                <p className="text-sm text-islamic-navy-600">Islamic burial should occur as soon as possible, preferably within 24 hours</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Simplicity</h4>
                <p className="text-sm text-islamic-navy-600">Islamic funerals emphasize simplicity and humility</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Community Obligation</h4>
                <p className="text-sm text-islamic-navy-600">Janazah prayer is Fard Kifayah (communal obligation)</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Pre-Planning Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h4 className="font-semibold">Islamic Will Guidance</h4>
                <p className="text-sm text-islamic-navy-600">Assistance with creating an Islamic will (Wasiyyah)</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Cemetery Plot Information</h4>
                <p className="text-sm text-islamic-navy-600">Information about local Islamic cemetery options</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Educational Workshops</h4>
                <p className="text-sm text-islamic-navy-600">Regular workshops on Islamic funeral rites and preparation</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Volunteer Information */}
        <Card className="mt-12 border-islamic-gold-200">
          <CardHeader>
            <CardTitle className="text-xl">Volunteer Opportunities</CardTitle>
            <CardDescription>Join our funeral services volunteer team</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-islamic-navy-600 mb-4">
              We are always looking for compassionate volunteers to help with Ghusl services and funeral support. 
              Training is provided for all volunteers.
            </p>
            <button className="px-6 py-3 bg-islamic-green-600 text-white font-semibold rounded-lg hover:bg-islamic-green-700 transition-colors">
              Become a Volunteer
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}