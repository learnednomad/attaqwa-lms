import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Scale, Shield, AlertTriangle, Mail, Calendar } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-islamic-navy-800 mb-4">
          Terms of Service
        </h1>
        <div className="flex items-center justify-center gap-4 mb-6">
          <Badge variant="outline" className="bg-islamic-green-50 text-islamic-green-800">
            <Calendar className="h-3 w-3 mr-1" />
            Last Updated: August 13, 2025
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-800">
            <Scale className="h-3 w-3 mr-1" />
            Governed by Canadian Law
          </Badge>
        </div>
        <p className="text-lg text-gray-600 leading-relaxed">
          These terms govern your use of Masjid At-Taqwa's digital services, educational platform, 
          and community resources. By using our services, you agree to these terms.
        </p>
      </section>

      <div className="space-y-8">
        {/* Acceptance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-islamic-green-600" />
              Acceptance of Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using the Masjid At-Taqwa website, mobile applications, 
              educational platform, and related services, you acknowledge that you have read, 
              understood, and agree to be bound by these Terms of Service and our Privacy Policy.
            </p>
          </CardContent>
        </Card>

        {/* Use of Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-islamic-green-600" />
              Permitted Use of Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-islamic-navy-800 mb-2">You May:</h4>
              <ul className="text-gray-700 space-y-1 ml-4">
                <li>• Access prayer times, announcements, and event information</li>
                <li>• Participate in educational programs and track your learning progress</li>
                <li>• Make donations and receive tax receipts</li>
                <li>• Register for events and community programs</li>
                <li>• Contact us for Islamic services and support</li>
                <li>• Share our content for educational and religious purposes</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-islamic-navy-800 mb-2">You May Not:</h4>
              <ul className="text-gray-700 space-y-1 ml-4">
                <li>• Use our services for any unlawful or prohibited activities</li>
                <li>• Attempt to gain unauthorized access to our systems</li>
                <li>• Share false or misleading information</li>
                <li>• Use our platform to spread content contradictory to Islamic teachings</li>
                <li>• Interfere with other users' access to our services</li>
                <li>• Reproduce our content without proper attribution</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Educational Content */}
        <Card>
          <CardHeader>
            <CardTitle>Islamic Educational Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-islamic-navy-800 mb-2">Content Accuracy</h4>
              <p className="text-gray-700">
                Our Islamic educational content is prepared with care and reviewed by qualified scholars. 
                However, for specific religious rulings or complex Islamic matters, we encourage 
                consultation with local Islamic scholars and authorities.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-islamic-navy-800 mb-2">User Contributions</h4>
              <p className="text-gray-700">
                If you contribute content through comments, questions, or feedback, you grant us 
                permission to use such content for educational and community purposes while 
                maintaining your anonymity if requested.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-islamic-navy-800 mb-2">Age-Appropriate Content</h4>
              <p className="text-gray-700">
                Our age-tier system is designed to provide appropriate Islamic content for different 
                age groups. Parents and guardians are responsible for supervising minors' use of our platform.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Donations */}
        <Card>
          <CardHeader>
            <CardTitle>Donation Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-islamic-navy-800 mb-2">Processing</h4>
              <p className="text-gray-700">
                All donations are processed securely and used for the specified purposes. 
                Tax receipts are issued for donations above the minimum threshold as required by law.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-islamic-navy-800 mb-2">Zakat Distribution</h4>
              <p className="text-gray-700">
                Zakat funds are distributed according to Islamic principles to the eight categories 
                mentioned in the Quran, prioritizing local community needs.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-islamic-navy-800 mb-2">Refund Policy</h4>
              <p className="text-gray-700">
                Donation refunds are handled on a case-by-case basis. Please contact us immediately 
                if you have concerns about a donation transaction.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Liability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Limitation of Liability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              Masjid At-Taqwa provides services and information in good faith. While we strive 
              for accuracy and reliability, we cannot guarantee uninterrupted service or complete 
              accuracy of all information. Our liability is limited to the extent permitted by law.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card>
          <CardHeader>
            <CardTitle>Changes to These Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              We may update these Terms of Service from time to time to reflect changes in our 
              services or legal requirements. We will notify users of significant changes through 
              our website and email communications. Continued use of our services after changes 
              constitutes acceptance of the updated terms.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="bg-islamic-green-50 border-islamic-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-islamic-green-600" />
              Questions About These Terms?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              If you have questions about these Terms of Service or need clarification about 
              our policies, please don't hesitate to contact us:
            </p>
            
            <div className="bg-white rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-islamic-green-600" />
                <span className="text-sm">legal@attaqwa.org</span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-islamic-green-600" />
                <span className="text-sm">Masjid At-Taqwa Legal Department</span>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mt-4">
              We are committed to transparency and will work with you to address any concerns 
              about our terms and policies.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}