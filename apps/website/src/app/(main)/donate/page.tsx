'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  DollarSign, 
  Users, 
  Building,
  BookOpen,
  Utensils,
  Home,
  GraduationCap,
  Calculator,
  Info,
  CreditCard,
  Banknote,
  Smartphone,
  Phone,
  Mail
} from 'lucide-react';

const donationCategories = [
  {
    id: 'zakat',
    title: 'Zakat (Obligatory Charity)',
    description: 'Fulfill your Islamic obligation of Zakat with proper calculation and distribution.',
    icon: Calculator,
    color: 'bg-islamic-green-600 text-white',
    minAmount: 0,
    suggested: [100, 250, 500, 1000],
    info: 'Zakat is 2.5% of savings held for one lunar year above the nisab threshold.'
  },
  {
    id: 'sadaqah',
    title: 'Sadaqah (Voluntary Charity)',
    description: 'Voluntary charity to earn reward and help those in need.',
    icon: Heart,
    color: 'bg-islamic-gold-600 text-white',
    minAmount: 5,
    suggested: [25, 50, 100, 250],
    info: 'Any amount given with sincere intention brings reward from Allah.'
  },
  {
    id: 'mosque',
    title: 'Mosque Operations',
    description: 'Support daily mosque operations, utilities, and maintenance.',
    icon: Building,
    color: 'bg-blue-600 text-white',
    minAmount: 10,
    suggested: [30, 75, 150, 300],
    info: 'Helps maintain our place of worship for the entire community.'
  },
  {
    id: 'education',
    title: 'Islamic Education',
    description: 'Fund Islamic education programs, teachers, and educational materials.',
    icon: BookOpen,
    color: 'bg-purple-600 text-white',
    minAmount: 15,
    suggested: [25, 60, 120, 250],
    info: 'Invest in the Islamic education of our children and community.'
  },
  {
    id: 'food',
    title: 'Food Programs',
    description: 'Support community meals, Ramadan Iftar, and food assistance.',
    icon: Utensils,
    color: 'bg-orange-600 text-white',
    minAmount: 10,
    suggested: [20, 50, 100, 200],
    info: 'Feed families in need and support community gathering meals.'
  },
  {
    id: 'emergency',
    title: 'Emergency Relief',
    description: 'Help community members facing urgent financial difficulties.',
    icon: Home,
    color: 'bg-red-600 text-white',
    minAmount: 25,
    suggested: [50, 100, 300, 500],
    info: 'Immediate assistance for families in crisis situations.'
  }
];

const zakatCalculation = {
  nisabThreshold: 4914, // CAD (approximate current gold nisab)
  zakatRate: 0.025, // 2.5%
};

export default function DonatePage() {
  const [selectedCategory, setSelectedCategory] = useState(donationCategories[0]);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [zakatAmount, setZakatAmount] = useState('');
  const [calculatedZakat, setCalculatedZakat] = useState<number | null>(null);

  const calculateZakat = () => {
    const savings = parseFloat(zakatAmount);
    if (savings >= zakatCalculation.nisabThreshold) {
      setCalculatedZakat(savings * zakatCalculation.zakatRate);
    } else {
      setCalculatedZakat(0);
    }
  };

  const finalAmount = selectedAmount || parseFloat(customAmount) || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <section className="text-center mb-12">
        <h1 className="text-5xl font-bold text-islamic-navy-800 mb-6">
          Support Our Community
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Your generosity helps us serve the Muslim community through worship, education, 
          and support programs. Every contribution, no matter the size, makes a difference.
        </p>
        
        <div className="mt-6 text-center">
          <div className="inline-block bg-islamic-green-50 border border-islamic-green-200 rounded-lg p-4">
            <p className="text-islamic-green-800 font-medium">
              "The example of those who spend their wealth in the way of Allah is like a seed 
              which grows seven spikes, in each spike a hundred grains."
            </p>
            <p className="text-islamic-green-600 text-sm mt-2">— Quran 2:261</p>
          </div>
        </div>
      </section>

      {/* Zakat Calculator */}
      <section className="mb-12">
        <Card className="border-islamic-green-200 bg-islamic-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-islamic-green-800">
              <Calculator className="h-6 w-6" />
              Zakat Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-islamic-green-800 mb-2">
                  Total Savings (CAD)
                </label>
                <input
                  type="number"
                  value={zakatAmount}
                  onChange={(e) => setZakatAmount(e.target.value)}
                  placeholder="Enter your total savings"
                  className="w-full px-4 py-3 border border-islamic-green-300 rounded-lg focus:ring-2 focus:ring-islamic-green-500 focus:border-transparent"
                />
                <p className="text-xs text-islamic-green-600 mt-1">
                  Current Nisab threshold: ${zakatCalculation.nisabThreshold.toLocaleString()} CAD
                </p>
              </div>
              
              <div className="flex flex-col justify-end">
                <Button 
                  onClick={calculateZakat}
                  className="bg-islamic-green-600 hover:bg-islamic-green-700 mb-2"
                >
                  Calculate Zakat
                </Button>
                
                {calculatedZakat !== null && (
                  <div className="text-center p-4 bg-white rounded-lg border border-islamic-green-200">
                    <p className="text-sm text-gray-600">Your Zakat Amount:</p>
                    <p className="text-2xl font-bold text-islamic-green-600">
                      ${calculatedZakat.toFixed(2)} CAD
                    </p>
                    {calculatedZakat === 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Below nisab threshold - no Zakat required
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Donation Categories */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-islamic-navy-800 text-center mb-8">
          Choose Your Contribution
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {donationCategories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory.id === category.id;
            
            return (
              <Card 
                key={category.id}
                className={`cursor-pointer transition-all ${
                  isSelected 
                    ? 'ring-2 ring-islamic-green-500 border-islamic-green-300' 
                    : 'hover:shadow-md border-gray-200'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${category.color}`}>
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-islamic-navy-800 mb-2">
                    {category.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {category.description}
                  </p>
                  <div className="text-xs text-gray-500 italic">
                    {category.info}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Selected Category Details */}
        <Card className="border-islamic-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <selectedCategory.icon className="h-5 w-5" />
              {selectedCategory.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Amount Selection */}
              <div>
                <h4 className="font-semibold text-islamic-navy-800 mb-4">Select Amount (CAD)</h4>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {selectedCategory.suggested.map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedAmount === amount ? 'default' : 'outline'}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount('');
                      }}
                      className={selectedAmount === amount ? 'bg-islamic-green-600 hover:bg-islamic-green-700' : ''}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Amount
                  </label>
                  <input
                    type="number"
                    min={selectedCategory.minAmount}
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(null);
                    }}
                    placeholder={`Minimum $${selectedCategory.minAmount}`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Donation Impact */}
              <div>
                <h4 className="font-semibold text-islamic-navy-800 mb-4">Your Impact</h4>
                
                <div className="bg-islamic-green-50 border border-islamic-green-200 rounded-lg p-4 mb-4">
                  <div className="text-2xl font-bold text-islamic-green-600 mb-2">
                    ${finalAmount.toFixed(2)} CAD
                  </div>
                  <p className="text-islamic-green-700 text-sm">
                    {selectedCategory.id === 'zakat' && 'Fulfills your Islamic obligation'}
                    {selectedCategory.id === 'sadaqah' && 'Voluntary charity for Allah\'s pleasure'}
                    {selectedCategory.id === 'mosque' && 'Supports mosque operations for the community'}
                    {selectedCategory.id === 'education' && 'Funds Islamic education programs'}
                    {selectedCategory.id === 'food' && 'Provides meals for families in need'}
                    {selectedCategory.id === 'emergency' && 'Immediate help for families in crisis'}
                  </p>
                </div>

                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    <span>100% of donations go directly to the selected cause</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span>Tax receipt provided for Canadian tax purposes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <span>Anonymous donations welcome and respected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h4 className="font-semibold text-islamic-navy-800 mb-4">Payment Methods</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="text-center p-4">
                  <CreditCard className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <h5 className="font-medium">Credit/Debit Card</h5>
                  <p className="text-xs text-gray-600">Secure online payment</p>
                </Card>
                
                <Card className="text-center p-4">
                  <Banknote className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <h5 className="font-medium">Bank Transfer</h5>
                  <p className="text-xs text-gray-600">Direct bank transfer</p>
                </Card>
                
                <Card className="text-center p-4">
                  <Smartphone className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <h5 className="font-medium">E-Transfer</h5>
                  <p className="text-xs text-gray-600">Interac e-Transfer</p>
                </Card>
              </div>

              {/* Donation Form */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h5 className="font-semibold text-islamic-navy-800 mb-4">Donation Details</h5>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="For tax receipt"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="For receipt delivery"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green-500"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-islamic-green-600 focus:ring-islamic-green-500" />
                    <span className="text-sm text-gray-700">Make this donation anonymous</span>
                  </label>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Any specific instructions for your donation..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-islamic-green-500"
                  />
                </div>

                <Button 
                  size="lg" 
                  className="w-full bg-islamic-green-600 hover:bg-islamic-green-700"
                  disabled={finalAmount === 0}
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Donate ${finalAmount.toFixed(2)} CAD
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Alternative Donation Methods */}
      <section className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Other Ways to Contribute</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <Users className="h-12 w-12 mx-auto mb-4 text-islamic-green-600" />
                <h4 className="font-semibold text-islamic-navy-800 mb-2">Volunteer</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Donate your time and skills to help with events, education, and community programs.
                </p>
                <Button variant="outline" size="sm">Learn More</Button>
              </div>

              <div>
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-islamic-gold-600" />
                <h4 className="font-semibold text-islamic-navy-800 mb-2">Sponsor Programs</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Sponsor specific programs like Ramadan Iftar, educational classes, or community events.
                </p>
                <Button variant="outline" size="sm">Contact Us</Button>
              </div>

              <div>
                <GraduationCap className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h4 className="font-semibold text-islamic-navy-800 mb-2">Scholarship Fund</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Support Islamic education by contributing to our scholarship fund for students.
                </p>
                <Button variant="outline" size="sm">Contribute</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Contact for Large Donations */}
      <section>
        <Card className="bg-gradient-to-r from-islamic-navy-50 to-islamic-green-50 border-islamic-navy-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-islamic-navy-800 mb-4">
              Planning a Major Contribution?
            </h3>
            <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
              For larger donations, estate planning, or ongoing sponsorships, 
              we'd love to discuss how your contribution can make the greatest impact.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-islamic-navy-600 hover:bg-islamic-navy-700">
                <Phone className="h-5 w-5 mr-2" />
                Call Us
              </Button>
              
              <Button size="lg" variant="outline" className="border-islamic-navy-600 text-islamic-navy-600">
                <Mail className="h-5 w-5 mr-2" />
                Email Us
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}