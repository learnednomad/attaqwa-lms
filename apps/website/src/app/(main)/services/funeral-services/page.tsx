import { Metadata } from 'next';
import { Heart, Phone, Users, Clock, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Funeral Services | Masjid At-Taqwa',
  description: 'Islamic funeral rites, burial assistance, and family support services',
};

export default function FuneralServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-6 py-16 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-emerald-700 mb-3">
            Masjid At-Taqwa
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4">
            Funeral Services
          </h1>
          <p className="text-base text-neutral-500 max-w-2xl mx-auto leading-relaxed">
            Compassionate support and guidance for Islamic funeral rites, burial services, and family assistance during difficult times
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        {/* Emergency Contact */}
        <section className="py-10">
          <div className="rounded-xl border border-red-100 bg-red-50/40 p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-neutral-900">24/7 Emergency Contact</h3>
                  <p className="text-sm text-neutral-500">For immediate assistance</p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-2xl font-bold text-red-600">(555) 123-4567</p>
                <p className="text-sm text-neutral-500">Available 24 hours a day</p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="pb-16">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-xl font-semibold text-neutral-900">Our Services</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                <Heart className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">Ghusl Services</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Islamic ritual washing performed by trained volunteers with respect and dignity.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">Janazah Prayer</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Congregational funeral prayer services held at the masjid or graveside.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                <MapPin className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-2">Burial Assistance</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                Coordination with Islamic cemeteries and assistance with burial arrangements.
              </p>
            </div>
          </div>
        </section>

        {/* Comprehensive Services */}
        <section className="pb-16">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-xl font-semibold text-neutral-900">Complete Funeral Support</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
            <p className="text-sm text-neutral-500 mb-6">We provide comprehensive assistance during your time of need</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-neutral-900 mb-3">Immediate Services</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-neutral-900">Death Certificate Assistance</h4>
                      <p className="text-sm text-neutral-500 mt-0.5 leading-relaxed">Help with documentation and legal requirements</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-neutral-900">Transportation</h4>
                      <p className="text-sm text-neutral-500 mt-0.5 leading-relaxed">Arrangement of body transportation to funeral home or cemetery</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-neutral-900">Kafan (Shroud) Provision</h4>
                      <p className="text-sm text-neutral-500 mt-0.5 leading-relaxed">Islamic burial shrouds available at the masjid</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-semibold text-neutral-900 mb-3">Family Support</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Heart className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-neutral-900">Grief Counseling</h4>
                      <p className="text-sm text-neutral-500 mt-0.5 leading-relaxed">Islamic grief counseling and spiritual support</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Heart className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-neutral-900">Meal Support</h4>
                      <p className="text-sm text-neutral-500 mt-0.5 leading-relaxed">Community meal coordination for bereaved families</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                      <Heart className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-neutral-900">Financial Assistance</h4>
                      <p className="text-sm text-neutral-500 mt-0.5 leading-relaxed">Support for families facing financial hardship</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Important Information */}
        <section className="pb-16">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-xl font-semibold text-neutral-900">Important Information</h2>
            <div className="flex-1 h-px bg-neutral-100" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
              <h3 className="text-base font-semibold text-neutral-900 mb-5">Islamic Guidelines</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-neutral-900">Burial Timeline</h4>
                  <p className="text-sm text-neutral-500 leading-relaxed">Islamic burial should occur as soon as possible, preferably within 24 hours</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-neutral-900">Simplicity</h4>
                  <p className="text-sm text-neutral-500 leading-relaxed">Islamic funerals emphasize simplicity and humility</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-neutral-900">Community Obligation</h4>
                  <p className="text-sm text-neutral-500 leading-relaxed">Janazah prayer is Fard Kifayah (communal obligation)</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-6 sm:p-8">
              <h3 className="text-base font-semibold text-neutral-900 mb-5">Pre-Planning Services</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-neutral-900">Islamic Will Guidance</h4>
                  <p className="text-sm text-neutral-500 leading-relaxed">Assistance with creating an Islamic will (Wasiyyah)</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-neutral-900">Cemetery Plot Information</h4>
                  <p className="text-sm text-neutral-500 leading-relaxed">Information about local Islamic cemetery options</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-neutral-900">Educational Workshops</h4>
                  <p className="text-sm text-neutral-500 leading-relaxed">Regular workshops on Islamic funeral rites and preparation</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Volunteer Information */}
        <section className="pb-20">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-base font-semibold text-neutral-900">Volunteer Opportunities</h3>
            </div>
            <p className="text-sm text-neutral-500 leading-relaxed mb-2">Join our funeral services volunteer team</p>
            <p className="text-sm text-neutral-600 leading-relaxed mb-6">
              We are always looking for compassionate volunteers to help with Ghusl services and funeral support.
              Training is provided for all volunteers.
            </p>
            <button className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors">
              Become a Volunteer
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
