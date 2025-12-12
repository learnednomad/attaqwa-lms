'use client';

import { useState, useEffect } from 'react';
import { Search, Book, Code, Users, HelpCircle, MessageSquare, ChevronRight } from 'lucide-react';

interface DocumentationData {
  meta: {
    title: string;
    version: string;
    lastUpdated: string;
  };
  api: any;
  userGuides: any;
  islamicFeatures: any;
  faq: any;
  troubleshooting: any;
  integrationGuides: any;
  bestPractices: any;
  support: any;
}

export default function DocumentationPage() {
  const [docs, setDocs] = useState<DocumentationData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState<string>('api');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocumentation();
  }, []);

  const fetchDocumentation = async () => {
    try {
      const response = await fetch('/api/docs');
      const data = await response.json();
      setDocs(data);
    } catch (error) {
      console.error('Failed to fetch documentation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      fetchDocumentation();
      return;
    }

    try {
      const response = await fetch(`/api/docs?search=${encodeURIComponent(query)}`);
      const data = await response.json();
      // Handle search results
      console.log('Search results:', data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-islamic-green-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-islamic-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading documentation...</p>
        </div>
      </div>
    );
  }

  if (!docs) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-islamic-green-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Failed to load documentation</p>
        </div>
      </div>
    );
  }

  const sections = [
    { id: 'api', title: 'API Reference', icon: Code, data: docs.api },
    { id: 'userGuides', title: 'User Guides', icon: Users, data: docs.userGuides },
    { id: 'islamicFeatures', title: 'Islamic Features', icon: Book, data: docs.islamicFeatures },
    { id: 'faq', title: 'FAQ', icon: HelpCircle, data: docs.faq },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: MessageSquare, data: docs.troubleshooting },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-islamic-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-islamic-green-600 dark:bg-islamic-green-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">{docs.meta.title}</h1>
          <p className="text-islamic-green-100 mb-6">
            Complete documentation for students, parents, teachers, and administrators
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search documentation..."
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-islamic-green-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-2">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Sections</h2>
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-islamic-green-100 dark:bg-islamic-green-900 text-islamic-green-700 dark:text-islamic-green-300'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{section.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
              {activeSection === 'api' && <APIReference data={docs.api} />}
              {activeSection === 'userGuides' && <UserGuides data={docs.userGuides} />}
              {activeSection === 'islamicFeatures' && <IslamicFeatures data={docs.islamicFeatures} />}
              {activeSection === 'faq' && <FAQ data={docs.faq} />}
              {activeSection === 'troubleshooting' && <Troubleshooting data={docs.troubleshooting} />}
            </div>
          </div>
        </div>
      </div>

      {/* Support Footer */}
      <div className="bg-islamic-green-600 dark:bg-islamic-green-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Need Help?</h3>
          <p className="mb-6">Contact our support team for assistance</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={`mailto:${docs.meta.mosque.email}`}
              className="bg-white text-islamic-green-600 px-6 py-2 rounded-lg hover:bg-islamic-green-50 transition-colors"
            >
              Email Support
            </a>
            <a
              href={`tel:${docs.meta.mosque.phone}`}
              className="bg-islamic-green-700 text-white px-6 py-2 rounded-lg hover:bg-islamic-green-800 transition-colors"
            >
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function APIReference({ data }: { data: any }) {
  const categories = Object.entries(data);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">API Reference</h2>
        <p className="text-gray-600 dark:text-gray-400">Complete API documentation for developers</p>
      </div>

      {categories.map(([category, endpoints]: [string, any]) => (
        <div key={category} className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 capitalize">
            {category.replace(/([A-Z])/g, ' $1').trim()}
          </h3>

          <div className="space-y-4">
            {Object.entries(endpoints).map(([name, endpoint]: [string, any]) => (
              <div key={name} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{endpoint.name}</h4>
                  <span className={`px-3 py-1 rounded text-sm font-medium ${
                    endpoint.method === 'GET' ? 'bg-blue-100 text-blue-700' :
                    endpoint.method === 'POST' ? 'bg-green-100 text-green-700' :
                    endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {endpoint.method}
                  </span>
                </div>

                <code className="block bg-gray-900 text-green-400 px-4 py-2 rounded mb-3 text-sm">
                  {endpoint.endpoint}
                </code>

                <p className="text-gray-600 dark:text-gray-400 mb-4">{endpoint.description}</p>

                {endpoint.example && (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-islamic-green-600 dark:text-islamic-green-400 font-medium">
                      View Example
                    </summary>
                    <pre className="mt-2 bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto text-sm">
                      {JSON.stringify(endpoint.example, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function UserGuides({ data }: { data: any }) {
  const guides = Object.entries(data);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">User Guides</h2>
        <p className="text-gray-600 dark:text-gray-400">Step-by-step guides for all user types</p>
      </div>

      {guides.map(([role, guide]: [string, any]) => (
        <div key={role} className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 capitalize">
            {role} Guide
          </h3>

          <div className="space-y-6">
            {Object.entries(guide).map(([section, content]: [string, any]) => (
              <div key={section} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  {section.replace(/([A-Z])/g, ' $1').trim()}
                </h4>

                {Array.isArray(content) ? (
                  <ul className="space-y-2">
                    {content.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <ChevronRight className="text-islamic-green-600 mt-1 flex-shrink-0" size={16} />
                        <span className="text-gray-600 dark:text-gray-400">{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">{content}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function IslamicFeatures({ data }: { data: any }) {
  const features = Object.entries(data);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Islamic Features</h2>
        <p className="text-gray-600 dark:text-gray-400">Learn about our Islamic tools and resources</p>
      </div>

      {features.map(([feature, info]: [string, any]) => (
        <div key={feature} className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            {info.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{info.description}</p>

          {info.features && (
            <div className="bg-islamic-green-50 dark:bg-islamic-green-900/20 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Features</h4>
              <ul className="space-y-2">
                {info.features.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <ChevronRight className="text-islamic-green-600 mt-1 flex-shrink-0" size={16} />
                    <span className="text-gray-600 dark:text-gray-400">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function FAQ({ data }: { data: any }) {
  const categories = Object.entries(data);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Frequently Asked Questions</h2>
        <p className="text-gray-600 dark:text-gray-400">Find answers to common questions</p>
      </div>

      {categories.map(([category, questions]: [string, any]) => (
        <div key={category} className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 capitalize">
            {category}
          </h3>

          <div className="space-y-4">
            {questions.map((faq: any, idx: number) => (
              <details key={idx} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white">
                  {faq.question}
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Troubleshooting({ data }: { data: any }) {
  const categories = Object.entries(data);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Troubleshooting</h2>
        <p className="text-gray-600 dark:text-gray-400">Solutions to common problems</p>
      </div>

      {categories.map(([category, issues]: [string, any]) => (
        <div key={category} className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 capitalize">
            {category}
          </h3>

          <div className="space-y-4">
            {issues.map((issue: any, idx: number) => (
              <div key={idx} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">{issue.problem}</h4>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Solution:</p>
                  <ol className="list-decimal list-inside space-y-1 text-gray-600 dark:text-gray-400">
                    {issue.solution.map((step: string, stepIdx: number) => (
                      <li key={stepIdx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
