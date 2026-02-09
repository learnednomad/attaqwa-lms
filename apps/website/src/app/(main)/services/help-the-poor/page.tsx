import { Metadata } from 'next';
import { Heart, Home, ShoppingBag, Users, Phone, HandHeart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Help the Poor | Masjid At-Taqwa',
  description: 'Community outreach, food assistance, and poverty alleviation programs',
};

export default function HelpThePoorPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-700 mb-3">Masjid At-Taqwa</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
            Help the Poor Program
          </h1>
          <p className="text-base text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            Extending compassionate support to families in need through comprehensive assistance programs
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        {/* Impact Statistics */}
        <section className="py-12">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-neutral-900">1,200+</p>
                <p className="text-neutral-500">Families Helped</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-neutral-900">50,000+</p>
                <p className="text-neutral-500">Meals Provided</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-neutral-900">$250K</p>
                <p className="text-neutral-500">Annual Support</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-neutral-900">24/7</p>
                <p className="text-neutral-500">Emergency Aid</p>
              </div>
            </div>
          </div>
        </section>

        {/* Programs Grid */}
        <section className="pb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Our Programs</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                <ShoppingBag className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Food Pantry</h3>
              <p className="text-sm text-neutral-500">
                Weekly food distribution providing nutritious groceries and essentials to families.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                <Home className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Rent Assistance</h3>
              <p className="text-sm text-neutral-500">
                Emergency housing support to prevent eviction and maintain stable homes.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                <Heart className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Medical Support</h3>
              <p className="text-sm text-neutral-500">
                Assistance with medical bills, prescriptions, and healthcare access.
              </p>
            </div>
          </div>
        </section>

        {/* Current Initiatives */}
        <section className="pb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Active Support Programs</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>
          <p className="text-sm text-neutral-500 mb-6">Join us in making a difference in our community</p>
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <div className="space-y-6">
              <div className="border-l-4 border-emerald-500 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg text-neutral-900">Weekend Food Boxes</h3>
                  <span className="text-sm bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100">Every Saturday</span>
                </div>
                <p className="text-neutral-600 mb-3">
                  Providing weekend food packages for families with school-aged children
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-neutral-900">Families Served:</span> <span className="text-neutral-600">150/week</span>
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900">Volunteers Needed:</span> <span className="text-neutral-600">10</span>
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900">Time:</span> <span className="text-neutral-600">10 AM - 2 PM</span>
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900">Location:</span> <span className="text-neutral-600">Masjid Hall</span>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-amber-500 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg text-neutral-900">Monthly Utility Assistance</h3>
                  <span className="text-sm bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-100">1st Monday</span>
                </div>
                <p className="text-neutral-600 mb-3">
                  Help with electricity, water, and gas bills for qualifying families
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-neutral-900">Budget:</span> <span className="text-neutral-600">$10,000/month</span>
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900">Applications:</span> <span className="text-neutral-600">50+ monthly</span>
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900">Avg Support:</span> <span className="text-neutral-600">$200-500</span>
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900">Apply By:</span> <span className="text-neutral-600">25th of month</span>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-neutral-400 pl-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg text-neutral-900">Emergency Relief Fund</h3>
                  <span className="text-sm bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full border border-neutral-200">24/7 Available</span>
                </div>
                <p className="text-neutral-600 mb-3">
                  Immediate assistance for families facing unexpected crises
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-neutral-900">Response Time:</span> <span className="text-neutral-600">24 hours</span>
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900">Crisis Types:</span> <span className="text-neutral-600">Various</span>
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900">Max Support:</span> <span className="text-neutral-600">$1,000</span>
                  </div>
                  <div>
                    <span className="font-semibold text-neutral-900">Hotline:</span> <span className="text-neutral-600">(555) 123-4567</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How to Help */}
        <section className="pb-12">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Get Involved</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Ways to Contribute</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                    <HandHeart className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900">Monthly Sponsorship</h4>
                    <p className="text-sm text-neutral-500">Sponsor a family with regular monthly support</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900">Food Donations</h4>
                    <p className="text-sm text-neutral-500">Donate non-perishable food items to our pantry</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Users className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900">Volunteer Time</h4>
                    <p className="text-sm text-neutral-500">Help with distribution, sorting, and outreach</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Heart className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900">Professional Services</h4>
                    <p className="text-sm text-neutral-500">Offer pro-bono legal, medical, or other services</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Eligibility & Application</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-neutral-900">Who Can Apply?</h4>
                  <p className="text-sm text-neutral-500">
                    Families facing financial hardship regardless of faith or background
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900">Required Documents</h4>
                  <ul className="text-sm text-neutral-500 list-disc list-inside">
                    <li>Proof of income</li>
                    <li>ID and residence proof</li>
                    <li>Specific bills or notices (if applicable)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900">Application Process</h4>
                  <p className="text-sm text-neutral-500">
                    Visit our office or apply online. Confidential review within 48 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="pb-20">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-1">Need Assistance?</h3>
            <p className="text-sm text-neutral-500 mb-6">Our team is here to help with dignity and compassion</p>
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-neutral-900">Support Hotline</p>
                  <p className="text-xl text-emerald-600">(555) 123-4567</p>
                </div>
              </div>
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors">
                  Apply for Help
                </button>
                <button className="px-6 py-3 bg-white text-emerald-600 font-semibold rounded-lg border border-emerald-200 hover:bg-emerald-50 transition-colors">
                  Donate Now
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
