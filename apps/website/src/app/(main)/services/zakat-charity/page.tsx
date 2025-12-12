import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Heart, Users, DollarSign, HandHeart, Target } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Zakat & Charity Services | Masjid At-Taqwa',
  description: 'Zakat calculation, charity distribution, and community support services',
};

export default function ZakatCharityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-islamic-green-50 via-white to-islamic-gold-50/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-islamic-navy-800 mb-4">
            Zakat & Charity Services
          </h1>
          <p className="text-xl text-islamic-navy-600 max-w-3xl mx-auto">
            Calculate your Zakat, contribute to community welfare, and support those in need through our organized charity programs
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Calculator className="w-8 h-8 text-islamic-green-600 mb-2" />
              <CardTitle>Zakat Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Easy-to-use online calculator to determine your annual Zakat obligation accurately.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <HandHeart className="w-8 h-8 text-islamic-green-600 mb-2" />
              <CardTitle>Zakat Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Transparent distribution to eligible recipients following Islamic guidelines.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-8 h-8 text-islamic-green-600 mb-2" />
              <CardTitle>Community Support</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Emergency assistance, monthly support programs, and community welfare initiatives.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Zakat Calculator Section */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Quick Zakat Calculator</CardTitle>
            <CardDescription>Calculate your Zakat obligation based on current Nisab values</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-islamic-gold-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Gold Nisab</h3>
                  <p className="text-2xl font-bold text-islamic-green-600">85 grams</p>
                  <p className="text-sm text-islamic-navy-600">Current value: $5,234</p>
                </div>
                <div className="p-4 bg-islamic-gold-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Silver Nisab</h3>
                  <p className="text-2xl font-bold text-islamic-green-600">595 grams</p>
                  <p className="text-sm text-islamic-navy-600">Current value: $467</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-islamic-green-50 rounded-lg">
                  <h3 className="font-semibold mb-2">Zakat Rate</h3>
                  <p className="text-2xl font-bold text-islamic-green-600">2.5%</p>
                  <p className="text-sm text-islamic-navy-600">Of eligible wealth held for one lunar year</p>
                </div>
                <button className="w-full px-6 py-3 bg-islamic-green-600 text-white font-semibold rounded-lg hover:bg-islamic-green-700 transition-colors">
                  Use Full Calculator
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Campaigns */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Current Charity Campaigns</CardTitle>
            <CardDescription>Support our ongoing community initiatives</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border-l-4 border-islamic-green-500 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">Ramadan Food Drive</h3>
                  <span className="text-sm bg-islamic-green-100 text-islamic-green-700 px-3 py-1 rounded-full">Active</span>
                </div>
                <p className="text-islamic-navy-600 mb-3">Providing iftar meals and food packages to needy families</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-islamic-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <span className="text-sm font-semibold">$75,000 / $100,000</span>
                </div>
              </div>

              <div className="border-l-4 border-islamic-gold-500 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">Student Scholarship Fund</h3>
                  <span className="text-sm bg-islamic-gold-100 text-islamic-gold-700 px-3 py-1 rounded-full">Ongoing</span>
                </div>
                <p className="text-islamic-navy-600 mb-3">Supporting education for underprivileged students</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-islamic-gold-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                  <span className="text-sm font-semibold">$30,000 / $50,000</span>
                </div>
              </div>

              <div className="border-l-4 border-islamic-navy-500 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">Emergency Relief Fund</h3>
                  <span className="text-sm bg-islamic-navy-100 text-islamic-navy-700 px-3 py-1 rounded-full">Permanent</span>
                </div>
                <p className="text-islamic-navy-600 mb-3">Immediate assistance for families facing crisis situations</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-islamic-navy-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  <span className="text-sm font-semibold">$20,000 / $50,000</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How It Works */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">How to Give</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-islamic-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Online Donation</h3>
                  <p className="text-sm text-islamic-navy-600">Secure online portal for Zakat and Sadaqah</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-islamic-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">In-Person</h3>
                  <p className="text-sm text-islamic-navy-600">Drop off at the masjid office during operating hours</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-islamic-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">Bank Transfer</h3>
                  <p className="text-sm text-islamic-navy-600">Direct transfer to our charity account</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Distribution Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-islamic-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">The Poor (Fuqara)</h3>
                  <p className="text-sm text-islamic-navy-600">Those without sufficient means</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-islamic-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">The Needy (Masakin)</h3>
                  <p className="text-sm text-islamic-navy-600">Those facing temporary hardship</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-islamic-green-600 mt-1" />
                <div>
                  <h3 className="font-semibold">New Muslims</h3>
                  <p className="text-sm text-islamic-navy-600">Support for those new to Islam</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}