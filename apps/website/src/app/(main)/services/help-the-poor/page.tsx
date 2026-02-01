import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Home, ShoppingBag, Users, Phone, HandHeart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Help the Poor | Masjid At-Taqwa',
  description: 'Community outreach, food assistance, and poverty alleviation programs',
};

export default function HelpThePoorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-islamic-green-50 via-white to-islamic-gold-50/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-islamic-navy-800 mb-4">
            Help the Poor Program
          </h1>
          <p className="text-xl text-islamic-navy-600 max-w-3xl mx-auto">
            Extending compassionate support to families in need through comprehensive assistance programs
          </p>
        </div>

        {/* Impact Statistics */}
        <Card className="mb-12 bg-gradient-to-r from-islamic-green-500 to-islamic-green-600 text-white">
          <CardContent className="py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold">1,200+</p>
                <p className="text-white/90">Families Helped</p>
              </div>
              <div>
                <p className="text-3xl font-bold">50,000+</p>
                <p className="text-white/90">Meals Provided</p>
              </div>
              <div>
                <p className="text-3xl font-bold">$250K</p>
                <p className="text-white/90">Annual Support</p>
              </div>
              <div>
                <p className="text-3xl font-bold">24/7</p>
                <p className="text-white/90">Emergency Aid</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <ShoppingBag className="w-8 h-8 text-islamic-green-600 mb-2" />
              <CardTitle>Food Pantry</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Weekly food distribution providing nutritious groceries and essentials to families.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Home className="w-8 h-8 text-islamic-green-600 mb-2" />
              <CardTitle>Rent Assistance</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Emergency housing support to prevent eviction and maintain stable homes.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Heart className="w-8 h-8 text-islamic-green-600 mb-2" />
              <CardTitle>Medical Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Assistance with medical bills, prescriptions, and healthcare access.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Current Initiatives */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Active Support Programs</CardTitle>
            <CardDescription>Join us in making a difference in our community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border-l-4 border-islamic-green-500 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">Weekend Food Boxes</h3>
                  <span className="text-sm bg-islamic-green-100 text-islamic-green-700 px-3 py-1 rounded-full">Every Saturday</span>
                </div>
                <p className="text-islamic-navy-600 mb-3">
                  Providing weekend food packages for families with school-aged children
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Families Served:</span> 150/week
                  </div>
                  <div>
                    <span className="font-semibold">Volunteers Needed:</span> 10
                  </div>
                  <div>
                    <span className="font-semibold">Time:</span> 10 AM - 2 PM
                  </div>
                  <div>
                    <span className="font-semibold">Location:</span> Masjid Hall
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-islamic-gold-500 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">Monthly Utility Assistance</h3>
                  <span className="text-sm bg-islamic-gold-100 text-islamic-gold-700 px-3 py-1 rounded-full">1st Monday</span>
                </div>
                <p className="text-islamic-navy-600 mb-3">
                  Help with electricity, water, and gas bills for qualifying families
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Budget:</span> $10,000/month
                  </div>
                  <div>
                    <span className="font-semibold">Applications:</span> 50+ monthly
                  </div>
                  <div>
                    <span className="font-semibold">Avg Support:</span> $200-500
                  </div>
                  <div>
                    <span className="font-semibold">Apply By:</span> 25th of month
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-islamic-navy-500 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">Emergency Relief Fund</h3>
                  <span className="text-sm bg-islamic-navy-100 text-islamic-navy-700 px-3 py-1 rounded-full">24/7 Available</span>
                </div>
                <p className="text-islamic-navy-600 mb-3">
                  Immediate assistance for families facing unexpected crises
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Response Time:</span> 24 hours
                  </div>
                  <div>
                    <span className="font-semibold">Crisis Types:</span> Various
                  </div>
                  <div>
                    <span className="font-semibold">Max Support:</span> $1,000
                  </div>
                  <div>
                    <span className="font-semibold">Hotline:</span> (555) 123-4567
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to Help */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Ways to Contribute</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <HandHeart className="w-5 h-5 text-islamic-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Monthly Sponsorship</h3>
                  <p className="text-sm text-islamic-navy-600">Sponsor a family with regular monthly support</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShoppingBag className="w-5 h-5 text-islamic-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Food Donations</h3>
                  <p className="text-sm text-islamic-navy-600">Donate non-perishable food items to our pantry</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-islamic-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Volunteer Time</h3>
                  <p className="text-sm text-islamic-navy-600">Help with distribution, sorting, and outreach</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-islamic-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Professional Services</h3>
                  <p className="text-sm text-islamic-navy-600">Offer pro-bono legal, medical, or other services</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Eligibility & Application</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <h3 className="font-semibold">Who Can Apply?</h3>
                <p className="text-sm text-islamic-navy-600">
                  Families facing financial hardship regardless of faith or background
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Required Documents</h3>
                <ul className="text-sm text-islamic-navy-600 list-disc list-inside">
                  <li>Proof of income</li>
                  <li>ID and residence proof</li>
                  <li>Specific bills or notices (if applicable)</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Application Process</h3>
                <p className="text-sm text-islamic-navy-600">
                  Visit our office or apply online. Confidential review within 48 hours.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <Card className="bg-islamic-green-50 border-islamic-green-200">
          <CardHeader>
            <CardTitle className="text-xl">Need Assistance?</CardTitle>
            <CardDescription>Our team is here to help with dignity and compassion</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="flex items-center gap-3">
                <Phone className="w-6 h-6 text-islamic-green-600" />
                <div>
                  <p className="font-semibold">Support Hotline</p>
                  <p className="text-xl text-islamic-green-600">(555) 123-4567</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-islamic-green-600 text-white font-semibold rounded-lg hover:bg-islamic-green-700 transition-colors">
                  Apply for Help
                </button>
                <button className="px-6 py-3 bg-white text-islamic-green-600 font-semibold rounded-lg border border-islamic-green-600 hover:bg-islamic-green-50 transition-colors">
                  Donate Now
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}