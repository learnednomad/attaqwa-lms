'use client';

import React, { useState } from 'react';
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
  CreditCard,
  Banknote,
  Smartphone,
  Phone,
  Mail,
  ChevronRight,
  Check,
} from 'lucide-react';
import Link from 'next/link';

const donationCategories = [
  {
    id: 'zakat',
    title: 'Zakat',
    subtitle: 'Obligatory Charity',
    description: 'Fulfill your Islamic obligation of Zakat with proper calculation and distribution.',
    icon: Calculator,
    suggested: [100, 250, 500, 1000],
    minAmount: 0,
    info: 'Zakat is 2.5% of savings held for one lunar year above the nisab threshold.',
    impact: 'Fulfills your Islamic obligation',
  },
  {
    id: 'sadaqah',
    title: 'Sadaqah',
    subtitle: 'Voluntary Charity',
    description: 'Voluntary charity to earn reward and help those in need.',
    icon: Heart,
    suggested: [25, 50, 100, 250],
    minAmount: 5,
    info: 'Any amount given with sincere intention brings reward from Allah.',
    impact: "Voluntary charity for Allah's pleasure",
  },
  {
    id: 'mosque',
    title: 'Mosque Operations',
    subtitle: 'Facility & Maintenance',
    description: 'Support daily mosque operations, utilities, and maintenance.',
    icon: Building,
    suggested: [30, 75, 150, 300],
    minAmount: 10,
    info: 'Helps maintain our place of worship for the entire community.',
    impact: 'Supports mosque operations for the community',
  },
  {
    id: 'education',
    title: 'Islamic Education',
    subtitle: 'Knowledge & Growth',
    description: 'Fund Islamic education programs, teachers, and educational materials.',
    icon: BookOpen,
    suggested: [25, 60, 120, 250],
    minAmount: 15,
    info: 'Invest in the Islamic education of our children and community.',
    impact: 'Funds Islamic education programs',
  },
  {
    id: 'food',
    title: 'Food Programs',
    subtitle: 'Community Meals',
    description: 'Support community meals, Ramadan Iftar, and food assistance.',
    icon: Utensils,
    suggested: [20, 50, 100, 200],
    minAmount: 10,
    info: 'Feed families in need and support community gathering meals.',
    impact: 'Provides meals for families in need',
  },
  {
    id: 'emergency',
    title: 'Emergency Relief',
    subtitle: 'Urgent Assistance',
    description: 'Help community members facing urgent financial difficulties.',
    icon: Home,
    suggested: [50, 100, 300, 500],
    minAmount: 25,
    info: 'Immediate assistance for families in crisis situations.',
    impact: 'Immediate help for families in crisis',
  },
];

const NISAB_THRESHOLD = 5244; // USD (approximate gold nisab)
const ZAKAT_RATE = 0.025; // 2.5%

export default function DonatePage() {
  const [selectedCategory, setSelectedCategory] = useState(donationCategories[0]);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [zakatSavings, setZakatSavings] = useState('');
  const [calculatedZakat, setCalculatedZakat] = useState<number | null>(null);

  const calculateZakat = () => {
    const savings = parseFloat(zakatSavings);
    if (savings >= NISAB_THRESHOLD) {
      setCalculatedZakat(savings * ZAKAT_RATE);
    } else {
      setCalculatedZakat(0);
    }
  };

  const finalAmount = selectedAmount || parseFloat(customAmount) || 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-700 mb-3">
            Masjid At-Taqwa
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
            Support Our Community
          </h1>
          <p className="text-base text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            Your generosity helps us serve the Muslim community through worship, education,
            and support programs. Every contribution, no matter the size, makes a difference.
          </p>

          <div className="mt-8 inline-block rounded-xl border border-neutral-200 bg-neutral-50/50 px-6 py-4 max-w-2xl">
            <p className="text-sm text-neutral-600 italic leading-relaxed">
              &ldquo;The example of those who spend their wealth in the way of Allah is like a seed
              which grows seven spikes, in each spike a hundred grains.&rdquo;
            </p>
            <p className="text-xs text-neutral-400 mt-2 not-italic">&mdash; Quran 2:261</p>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        {/* Zakat Calculator */}
        <section className="py-10">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <Calculator className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">Zakat Calculator</h2>
                <p className="text-xs text-neutral-500">Calculate your obligatory charity</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Total Savings (USD)
                </label>
                <input
                  type="number"
                  value={zakatSavings}
                  onChange={(e) => setZakatSavings(e.target.value)}
                  placeholder="Enter your total savings"
                  className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow"
                />
                <p className="text-xs text-neutral-400 mt-1.5">
                  Current Nisab threshold: ${NISAB_THRESHOLD.toLocaleString()} USD
                </p>
              </div>

              <div className="flex flex-col justify-end gap-3">
                <button
                  onClick={calculateZakat}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                >
                  <Calculator className="h-3.5 w-3.5" />
                  Calculate Zakat
                </button>

                {calculatedZakat !== null && (
                  <div className="rounded-lg border border-neutral-200 bg-white p-4 text-center">
                    <p className="text-xs text-neutral-500 mb-1">Your Zakat Amount</p>
                    <p className="text-xl font-bold text-emerald-600">
                      ${calculatedZakat.toFixed(2)}
                    </p>
                    {calculatedZakat === 0 && (
                      <p className="text-xs text-neutral-400 mt-1">
                        Below nisab threshold — no Zakat required
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Donation Categories */}
        <section className="pb-10">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-xl font-semibold text-neutral-900">Choose Your Contribution</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {donationCategories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory.id === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-left rounded-xl border p-5 transition-all ${
                    isSelected
                      ? 'border-emerald-300 bg-emerald-50/40 ring-1 ring-emerald-200'
                      : 'border-neutral-200 bg-white hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-emerald-100 border border-emerald-200'
                        : 'bg-emerald-50 border border-emerald-100'
                    }`}>
                      <Icon className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900">{category.title}</h3>
                      <p className="text-xs text-neutral-400">{category.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-sm text-neutral-500 leading-relaxed">{category.description}</p>
                </button>
              );
            })}
          </div>

          {/* Selected Category — Donation Form */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <selectedCategory.icon className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">{selectedCategory.title}</h3>
                <p className="text-xs text-neutral-500">{selectedCategory.info}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Amount Selection */}
              <div>
                <h4 className="text-sm font-medium text-neutral-900 mb-3">Select Amount</h4>

                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  {selectedCategory.suggested.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        setSelectedAmount(amount);
                        setCustomAmount('');
                      }}
                      className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                        selectedAmount === amount
                          ? 'border-emerald-300 bg-emerald-600 text-white'
                          : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                      }`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5">
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
                    className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow"
                  />
                </div>
              </div>

              {/* Donation Impact */}
              <div>
                <h4 className="text-sm font-medium text-neutral-900 mb-3">Your Impact</h4>

                <div className="rounded-lg border border-emerald-100 bg-emerald-50/40 p-4 mb-4">
                  <p className="text-2xl font-bold text-emerald-600 mb-1">
                    ${finalAmount.toFixed(2)}
                  </p>
                  <p className="text-sm text-neutral-600">{selectedCategory.impact}</p>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 text-sm text-neutral-500">
                    <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>100% of donations go directly to the selected cause</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-neutral-500">
                    <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>Tax-deductible receipt provided for US tax purposes</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-sm text-neutral-500">
                    <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>Anonymous donations welcome and respected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="border-t border-neutral-100 mt-8 pt-8">
              <h4 className="text-sm font-medium text-neutral-900 mb-4">Payment Method</h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                {[
                  { icon: CreditCard, label: 'Credit/Debit Card', desc: 'Secure online payment' },
                  { icon: Banknote, label: 'Bank Transfer', desc: 'Direct bank transfer' },
                  { icon: Smartphone, label: 'Zelle / Venmo', desc: 'Mobile payment' },
                ].map((method) => (
                  <div
                    key={method.label}
                    className="rounded-lg border border-neutral-200 bg-white p-4 text-center hover:border-neutral-300 transition-colors cursor-pointer"
                  >
                    <method.icon className="h-5 w-5 mx-auto mb-2 text-neutral-400" />
                    <p className="text-sm font-medium text-neutral-900">{method.label}</p>
                    <p className="text-xs text-neutral-400">{method.desc}</p>
                  </div>
                ))}
              </div>

              {/* Donation Form */}
              <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-6">
                <h5 className="text-sm font-medium text-neutral-900 mb-4">Donation Details</h5>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                      Full Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="For tax receipt"
                      className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="For receipt delivery"
                      className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-sm text-neutral-600">Make this donation anonymous</span>
                  </label>
                </div>

                <div className="mb-6">
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Any specific instructions for your donation..."
                    className="w-full px-4 py-2.5 text-sm border border-neutral-200 rounded-lg bg-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-shadow resize-none"
                  />
                </div>

                <button
                  disabled={finalAmount === 0}
                  className="inline-flex items-center justify-center gap-2 w-full rounded-lg bg-emerald-600 px-5 py-3 text-sm font-medium text-white hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Heart className="h-4 w-4" />
                  Donate ${finalAmount.toFixed(2)}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Other Ways to Contribute */}
        <section className="pb-10">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-xl font-semibold text-neutral-900">Other Ways to Contribute</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Users,
                title: 'Volunteer',
                description: 'Donate your time and skills to help with events, education, and community programs.',
                link: '/contact',
                linkLabel: 'Get Involved',
              },
              {
                icon: BookOpen,
                title: 'Sponsor Programs',
                description: 'Sponsor specific programs like Ramadan Iftar, educational classes, or community events.',
                link: '/contact',
                linkLabel: 'Contact Us',
              },
              {
                icon: GraduationCap,
                title: 'Scholarship Fund',
                description: 'Support Islamic education by contributing to our scholarship fund for students.',
                link: '/contact',
                linkLabel: 'Contribute',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-neutral-200 bg-white p-6"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                  <item.icon className="h-5 w-5 text-emerald-600" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-900 mb-2">{item.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed mb-4">{item.description}</p>
                <Link
                  href={item.link}
                  className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  {item.linkLabel}
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Major Contribution CTA */}
        <section className="pb-20">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-6 sm:p-8 text-center">
            <div className="flex items-center justify-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </div>
              <h2 className="text-lg font-semibold text-neutral-900">Planning a Major Contribution?</h2>
            </div>
            <p className="text-sm text-neutral-500 max-w-lg mx-auto mb-6">
              For larger donations, estate planning, or ongoing sponsorships,
              we&apos;d love to discuss how your contribution can make the greatest impact.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="tel:+1-000-000-0000"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                Call Us
              </Link>
              <Link
                href="mailto:info@masjidattaqwa.org"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-white px-5 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                Email Us
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
