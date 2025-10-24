import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils, ShoppingCart, Users, CheckCircle, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Halal Food Program | Masjid At-Taqwa',
  description: 'Community meals, food pantry, and halal certification guidance',
};

export default function HalalFoodProgramPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-islamic-green-50 via-white to-islamic-gold-50/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-islamic-navy-800 mb-4">
            Halal Food Program
          </h1>
          <p className="text-xl text-islamic-navy-600 max-w-3xl mx-auto">
            Providing nutritious halal meals, food assistance, and certification guidance to our community
          </p>
        </div>

        {/* Program Impact */}
        <Card className="mb-12 bg-gradient-to-r from-islamic-green-500 to-islamic-green-600 text-white">
          <CardContent className="py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <Utensils className="w-10 h-10 mx-auto mb-2 text-white/90" />
                <p className="text-3xl font-bold">10,000+</p>
                <p className="text-white/90">Meals Served Monthly</p>
              </div>
              <div>
                <ShoppingCart className="w-10 h-10 mx-auto mb-2 text-white/90" />
                <p className="text-3xl font-bold">500+</p>
                <p className="text-white/90">Food Boxes Weekly</p>
              </div>
              <div>
                <Users className="w-10 h-10 mx-auto mb-2 text-white/90" />
                <p className="text-3xl font-bold">300+</p>
                <p className="text-white/90">Families Supported</p>
              </div>
              <div>
                <CheckCircle className="w-10 h-10 mx-auto mb-2 text-white/90" />
                <p className="text-3xl font-bold">100%</p>
                <p className="text-white/90">Halal Certified</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Utensils className="w-8 h-8 text-islamic-green-600 mb-2" />
              <CardTitle>Community Meals</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Free hot halal meals served daily for those in need, including special iftar during Ramadan.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <ShoppingCart className="w-8 h-8 text-islamic-green-600 mb-2" />
              <CardTitle>Food Pantry</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Weekly distribution of halal groceries, fresh produce, and essential food items for families.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CheckCircle className="w-8 h-8 text-islamic-green-600 mb-2" />
              <CardTitle>Halal Certification</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Guidance on halal certification, trusted suppliers, and educational resources about halal standards.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Schedule */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Weekly Food Distribution Schedule</CardTitle>
            <CardDescription>Join us for meals and food distribution throughout the week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-3">Community Meals</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-islamic-green-50 rounded-lg">
                    <Clock className="w-5 h-5 text-islamic-green-600 mt-1" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">Daily Dinner</h4>
                          <p className="text-sm text-islamic-navy-600">Monday - Friday</p>
                        </div>
                        <span className="text-sm font-semibold text-islamic-green-600">6:00 - 8:00 PM</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-islamic-gold-50 rounded-lg">
                    <Clock className="w-5 h-5 text-islamic-gold-600 mt-1" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">Weekend Brunch</h4>
                          <p className="text-sm text-islamic-navy-600">Saturday & Sunday</p>
                        </div>
                        <span className="text-sm font-semibold text-islamic-gold-600">10:00 AM - 12:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg mb-3">Food Pantry Hours</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-islamic-navy-50 rounded-lg">
                    <Clock className="w-5 h-5 text-islamic-navy-600 mt-1" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">General Distribution</h4>
                          <p className="text-sm text-islamic-navy-600">Tuesday & Thursday</p>
                        </div>
                        <span className="text-sm font-semibold text-islamic-navy-600">2:00 - 6:00 PM</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-islamic-green-50 rounded-lg">
                    <Clock className="w-5 h-5 text-islamic-green-600 mt-1" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">Emergency Food Aid</h4>
                          <p className="text-sm text-islamic-navy-600">By appointment</p>
                        </div>
                        <span className="text-sm font-semibold text-islamic-green-600">24/7 Hotline</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Programs */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Special Food Programs</CardTitle>
            <CardDescription>Seasonal and targeted food assistance initiatives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border-l-4 border-islamic-green-500 pl-4">
                <h3 className="font-semibold mb-2">Ramadan Iftar Program</h3>
                <p className="text-sm text-islamic-navy-600 mb-2">
                  Daily iftar meals throughout Ramadan for 300+ community members
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-islamic-green-600" />
                  <span>Main Prayer Hall</span>
                </div>
              </div>

              <div className="border-l-4 border-islamic-gold-500 pl-4">
                <h3 className="font-semibold mb-2">Senior Meal Delivery</h3>
                <p className="text-sm text-islamic-navy-600 mb-2">
                  Weekly home delivery of halal meals for elderly and homebound members
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-islamic-gold-600" />
                  <span>50+ seniors served</span>
                </div>
              </div>

              <div className="border-l-4 border-islamic-navy-500 pl-4">
                <h3 className="font-semibold mb-2">School Lunch Support</h3>
                <p className="text-sm text-islamic-navy-600 mb-2">
                  Providing halal lunch options for Muslim students in local schools
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-islamic-navy-600" />
                  <span>5 schools partnered</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to Help & Get Help */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">How to Get Food Assistance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h3 className="font-semibold">Registration Process</h3>
                <p className="text-sm text-islamic-navy-600">
                  Simple registration at our office or online. No questions asked for emergency aid.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">What We Provide</h3>
                <ul className="text-sm text-islamic-navy-600 list-disc list-inside">
                  <li>Fresh halal meat and poultry</li>
                  <li>Rice, bread, and grains</li>
                  <li>Fresh fruits and vegetables</li>
                  <li>Dairy products and eggs</li>
                  <li>Baby food and formula</li>
                </ul>
              </div>
              <button className="w-full px-4 py-2 bg-islamic-green-600 text-white font-semibold rounded-lg hover:bg-islamic-green-700 transition-colors">
                Register for Food Aid
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Support the Program</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h3 className="font-semibold">Food Donations Needed</h3>
                <ul className="text-sm text-islamic-navy-600 list-disc list-inside">
                  <li>Non-perishable halal items</li>
                  <li>Fresh produce</li>
                  <li>Halal meat (from certified sources)</li>
                  <li>Cooking oil and spices</li>
                  <li>Baby supplies</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Volunteer Opportunities</h3>
                <p className="text-sm text-islamic-navy-600">
                  Help with meal preparation, food distribution, delivery, and pantry organization.
                </p>
              </div>
              <button className="w-full px-4 py-2 bg-islamic-gold-600 text-white font-semibold rounded-lg hover:bg-islamic-gold-700 transition-colors">
                Donate or Volunteer
              </button>
            </CardContent>
          </Card>
        </div>

        {/* Halal Certification Info */}
        <Card className="mt-12 border-islamic-green-200">
          <CardHeader>
            <CardTitle className="text-xl">Halal Certification Resources</CardTitle>
            <CardDescription>Information about halal standards and trusted suppliers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold mb-2">What is Halal?</h3>
                <p className="text-sm text-islamic-navy-600">
                  Learn about Islamic dietary laws and what makes food permissible (halal) in Islam.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Trusted Suppliers</h3>
                <p className="text-sm text-islamic-navy-600">
                  List of certified halal suppliers and restaurants in our area vetted by our committee.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Get Certified</h3>
                <p className="text-sm text-islamic-navy-600">
                  Guidance for businesses seeking halal certification for their products or services.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}