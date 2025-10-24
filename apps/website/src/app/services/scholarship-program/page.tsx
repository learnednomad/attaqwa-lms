import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Award, BookOpen, Users, Calendar, DollarSign } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Scholarship Program | Masjid At-Taqwa',
  description: 'Educational scholarships, Islamic studies funding, and student support',
};

export default function ScholarshipProgramPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-islamic-green-50 via-white to-islamic-gold-50/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-islamic-navy-800 mb-4">
            Scholarship Program
          </h1>
          <p className="text-xl text-islamic-navy-600 max-w-3xl mx-auto">
            Investing in the future of our community through educational scholarships and student support
          </p>
        </div>

        {/* Program Overview */}
        <Card className="mb-12 bg-gradient-to-r from-islamic-gold-100 to-islamic-gold-50 border-islamic-gold-200">
          <CardContent className="py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <Award className="w-12 h-12 text-islamic-gold-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-islamic-navy-800">250+</p>
                <p className="text-islamic-navy-600">Students Supported</p>
              </div>
              <div>
                <DollarSign className="w-12 h-12 text-islamic-gold-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-islamic-navy-800">$500K</p>
                <p className="text-islamic-navy-600">Total Scholarships Awarded</p>
              </div>
              <div>
                <GraduationCap className="w-12 h-12 text-islamic-gold-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-islamic-navy-800">95%</p>
                <p className="text-islamic-navy-600">Graduation Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scholarship Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <GraduationCap className="w-8 h-8 text-islamic-green-600 mb-2" />
              <CardTitle>Academic Excellence</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Merit-based scholarships for high-achieving students pursuing undergraduate or graduate degrees.
              </CardDescription>
              <div className="text-sm space-y-1">
                <p><strong>Amount:</strong> $2,000 - $5,000</p>
                <p><strong>GPA Required:</strong> 3.5+</p>
                <p><strong>Deadline:</strong> March 31st</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="w-8 h-8 text-islamic-green-600 mb-2" />
              <CardTitle>Islamic Studies</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Supporting students pursuing Islamic education, including Quran memorization and scholarly studies.
              </CardDescription>
              <div className="text-sm space-y-1">
                <p><strong>Amount:</strong> $1,500 - $3,000</p>
                <p><strong>Programs:</strong> All levels</p>
                <p><strong>Deadline:</strong> April 15th</p>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-8 h-8 text-islamic-green-600 mb-2" />
              <CardTitle>Need-Based Aid</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Financial assistance for students from low-income families pursuing higher education.
              </CardDescription>
              <div className="text-sm space-y-1">
                <p><strong>Amount:</strong> $1,000 - $4,000</p>
                <p><strong>Income Limit:</strong> Varies</p>
                <p><strong>Deadline:</strong> Rolling basis</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Application Process */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Application Process</CardTitle>
            <CardDescription>Follow these steps to apply for our scholarship programs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-islamic-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-islamic-green-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Check Eligibility</h3>
                <p className="text-sm text-islamic-navy-600">Review requirements for your chosen scholarship type</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-islamic-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-islamic-green-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Gather Documents</h3>
                <p className="text-sm text-islamic-navy-600">Transcripts, letters of recommendation, and essays</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-islamic-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-islamic-green-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Submit Application</h3>
                <p className="text-sm text-islamic-navy-600">Complete online form with all required materials</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-islamic-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-islamic-green-600 font-bold">4</span>
                </div>
                <h3 className="font-semibold mb-2">Interview</h3>
                <p className="text-sm text-islamic-navy-600">Selected candidates invited for interview</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Stories */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="text-2xl">Success Stories</CardTitle>
            <CardDescription>Our scholarship recipients making a difference</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-islamic-green-50 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-islamic-green-200 rounded-full flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold mb-1">Sarah Ahmed</h3>
                    <p className="text-sm text-islamic-gold-600 mb-2">2023 Recipient - Medical School</p>
                    <p className="text-sm text-islamic-navy-600">
                      "The scholarship allowed me to focus on my studies without financial stress. I'm now in my second year of medical school."
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-islamic-gold-50 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-islamic-gold-200 rounded-full flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold mb-1">Ahmad Hassan</h3>
                    <p className="text-sm text-islamic-green-600 mb-2">2022 Recipient - Engineering</p>
                    <p className="text-sm text-islamic-navy-600">
                      "Thanks to the community's support, I graduated with honors and now work as a software engineer."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requirements and Deadlines */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">General Requirements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2 text-sm text-islamic-navy-600">
                <li className="flex items-start gap-2">
                  <span className="text-islamic-green-600 mt-1">•</span>
                  <span>Must be an active member of the Muslim community</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-islamic-green-600 mt-1">•</span>
                  <span>Enrolled or accepted in accredited institution</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-islamic-green-600 mt-1">•</span>
                  <span>Maintain minimum GPA requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-islamic-green-600 mt-1">•</span>
                  <span>Demonstrate community service involvement</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-islamic-green-600 mt-1">•</span>
                  <span>Submit complete application by deadline</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Important Dates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-islamic-green-600" />
                  <div>
                    <p className="font-semibold">January 15</p>
                    <p className="text-sm text-islamic-navy-600">Application portal opens</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-islamic-green-600" />
                  <div>
                    <p className="font-semibold">March 31</p>
                    <p className="text-sm text-islamic-navy-600">Academic Excellence deadline</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-islamic-green-600" />
                  <div>
                    <p className="font-semibold">April 15</p>
                    <p className="text-sm text-islamic-navy-600">Islamic Studies deadline</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-islamic-green-600" />
                  <div>
                    <p className="font-semibold">May 1</p>
                    <p className="text-sm text-islamic-navy-600">Winners announced</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}