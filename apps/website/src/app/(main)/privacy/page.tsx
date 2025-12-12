import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Eye, Lock, Mail, FileText, Calendar, MapPin } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold text-islamic-navy-800 mb-4">
          Privacy Policy
        </h1>
        <div className="flex items-center justify-center gap-4 mb-6">
          <Badge variant="outline" className="bg-islamic-green-50 text-islamic-green-800">
            <Calendar className="h-3 w-3 mr-1" />
            Last Updated: August 13, 2025
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-800">
            <Shield className="h-3 w-3 mr-1" />
            GDPR Compliant
          </Badge>
        </div>
        <p className="text-lg text-gray-600 leading-relaxed">
          Masjid At-Taqwa is committed to protecting your privacy and personal information. 
          This policy explains how we collect, use, and safeguard your data.
        </p>
      </section>

      <div className="space-y-8">
        {/* Information We Collect */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-islamic-green-600" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-islamic-navy-800 mb-2">Personal Information</h4>
              <ul className="text-gray-700 space-y-1 ml-4">
                <li>• Name and contact information for registration and communication</li>
                <li>• Email address for newsletters and event notifications</li>
                <li>• Phone number for emergency contact and service coordination</li>
                <li>• Address for local community services and documentation</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-islamic-navy-800 mb-2">Educational Information</h4>
              <ul className="text-gray-700 space-y-1 ml-4">
                <li>• Learning progress and course completion data</li>
                <li>• Quiz scores and educational achievement records</li>
                <li>• Age-appropriate content preferences</li>
                <li>• Educational feedback and assessments</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-islamic-navy-800 mb-2">Usage Information</h4>
              <ul className="text-gray-700 space-y-1 ml-4">
                <li>• Website usage patterns and page visits</li>
                <li>• Prayer time notification preferences</li>
                <li>• Event attendance and participation records</li>
                <li>• Donation history for tax receipt purposes</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-islamic-green-600" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-islamic-navy-800 mb-3">Religious Services</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Coordinating Islamic ceremonies and services</li>
                  <li>• Providing spiritual guidance and counseling</li>
                  <li>• Managing prayer time notifications</li>
                  <li>• Organizing religious education programs</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-islamic-navy-800 mb-3">Community Services</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Sending event announcements and updates</li>
                  <li>• Coordinating volunteer opportunities</li>
                  <li>• Managing community support programs</li>
                  <li>• Providing emergency assistance coordination</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-islamic-navy-800 mb-3">Educational Purposes</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Tracking learning progress and achievements</li>
                  <li>• Providing personalized educational content</li>
                  <li>• Issuing certificates and recognitions</li>
                  <li>• Improving educational program effectiveness</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-islamic-navy-800 mb-3">Administrative</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Processing donations and issuing tax receipts</li>
                  <li>• Maintaining membership and attendance records</li>
                  <li>• Complying with legal and regulatory requirements</li>
                  <li>• Improving our services and programs</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Protection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-islamic-green-600" />
              How We Protect Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-islamic-navy-800 mb-3">Technical Safeguards</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Encrypted data transmission (SSL/TLS)</li>
                  <li>• Secure database storage with access controls</li>
                  <li>• Regular security audits and updates</li>
                  <li>• Password protection and authentication</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-islamic-navy-800 mb-3">Administrative Safeguards</h4>
                <ul className="text-gray-700 space-y-1 text-sm">
                  <li>• Limited access to authorized personnel only</li>
                  <li>• Staff training on privacy and confidentiality</li>
                  <li>• Regular privacy policy reviews and updates</li>
                  <li>• Incident response and breach notification procedures</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-islamic-green-600" />
              Your Privacy Rights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-islamic-navy-800">Access</h4>
                  <p className="text-gray-600 text-sm">Request copies of your personal information</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-islamic-navy-800">Correction</h4>
                  <p className="text-gray-600 text-sm">Update or correct any inaccurate information</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-islamic-navy-800">Deletion</h4>
                  <p className="text-gray-600 text-sm">Request deletion of your personal information</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-islamic-navy-800">Portability</h4>
                  <p className="text-gray-600 text-sm">Receive your data in a portable format</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-islamic-navy-800">Opt-out</h4>
                  <p className="text-gray-600 text-sm">Unsubscribe from communications at any time</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-islamic-navy-800">Restriction</h4>
                  <p className="text-gray-600 text-sm">Limit how we process your information</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cookies and Tracking */}
        <Card>
          <CardHeader>
            <CardTitle>Cookies and Website Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                Our website uses essential cookies for functionality and optional cookies for analytics. 
                We do not use tracking cookies for advertising purposes.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-islamic-navy-800 mb-2">Essential Cookies</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• User authentication and session management</li>
                    <li>• Prayer time preferences and notifications</li>
                    <li>• Educational progress tracking</li>
                    <li>• Website security and functionality</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-islamic-navy-800 mb-2">Analytics (Optional)</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Website usage statistics (anonymized)</li>
                    <li>• Educational content effectiveness</li>
                    <li>• Community engagement metrics</li>
                    <li>• Service improvement insights</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-islamic-green-600" />
              Privacy Questions?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              If you have questions about this privacy policy or how we handle your information, 
              please contact us:
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-islamic-green-600" />
                <span className="text-sm">privacy@attaqwa.org</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-islamic-green-600" />
                <span className="text-sm">Masjid At-Taqwa Privacy Officer</span>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mt-4">
              We will respond to privacy inquiries within 30 days and work to resolve any concerns 
              about how your personal information is handled.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}