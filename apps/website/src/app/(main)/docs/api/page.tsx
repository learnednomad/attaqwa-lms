'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Swagger UI to avoid SSR issues
const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Swagger UI...</p>
      </div>
    </div>
  ),
});

/**
 * OpenAPI / Swagger UI Documentation Page
 * Interactive API explorer using OpenAPI 3.1.0 specification
 */
export default function ApiDocsPage() {
  const [spec, setSpec] = useState<object | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSpec() {
      try {
        // Fetch OpenAPI spec from the public docs directory
        const response = await fetch('/docs/openapi.yaml');
        if (!response.ok) {
          throw new Error(`Failed to load API specification: ${response.status}`);
        }

        const yamlText = await response.text();

        // Parse YAML to JSON using js-yaml
        const yaml = await import('js-yaml');
        const parsed = yaml.load(yamlText) as object;

        setSpec(parsed);
      } catch (err) {
        console.error('Error loading OpenAPI spec:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    loadSpec();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading API Documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to Load Documentation
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-y-2">
            <a
              href="/api/docs"
              className="inline-block px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors mr-2"
            >
              View JSON Documentation
            </a>
            <a
              href="/docs"
              className="inline-block px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Back to Documentation
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-green-700 text-white py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">At-Taqwa LMS API</h1>
            <p className="text-green-100 text-sm">Version 1.0.0 | OpenAPI 3.1.0</p>
          </div>
          <div className="flex gap-4">
            <a
              href="/docs"
              className="px-3 py-1 bg-green-600 rounded text-sm hover:bg-green-500 transition-colors"
            >
              User Docs
            </a>
            <a
              href="/api/docs"
              className="px-3 py-1 bg-green-600 rounded text-sm hover:bg-green-500 transition-colors"
            >
              JSON API
            </a>
            <a
              href="/docs/openapi.yaml"
              className="px-3 py-1 bg-green-600 rounded text-sm hover:bg-green-500 transition-colors"
              download
            >
              Download YAML
            </a>
          </div>
        </div>
      </header>

      {/* Quick Links */}
      <nav className="bg-gray-100 border-b py-2 px-6">
        <div className="max-w-7xl mx-auto flex gap-6 text-sm">
          <span className="text-gray-500">Quick Links:</span>
          <a href="#tag/Authentication" className="text-green-600 hover:underline">
            Authentication
          </a>
          <a href="#tag/Courses" className="text-green-600 hover:underline">
            Courses
          </a>
          <a href="#tag/Islamic-Services" className="text-green-600 hover:underline">
            Islamic Services
          </a>
          <a href="#tag/Community" className="text-green-600 hover:underline">
            Community
          </a>
          <a href="#tag/User" className="text-green-600 hover:underline">
            User
          </a>
        </div>
      </nav>

      {/* Swagger UI */}
      <div className="swagger-ui-container">
        {spec && (
          <SwaggerUI
            spec={spec}
            docExpansion="list"
            defaultModelsExpandDepth={1}
            displayRequestDuration={true}
            filter={true}
            showExtensions={true}
            showCommonExtensions={true}
            tryItOutEnabled={true}
          />
        )}
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        .swagger-ui-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }

        .swagger-ui .topbar {
          display: none;
        }

        .swagger-ui .info {
          margin-bottom: 30px;
        }

        .swagger-ui .info .title {
          color: #15803d;
        }

        .swagger-ui .opblock-tag {
          border-color: #15803d;
        }

        .swagger-ui .opblock.opblock-get .opblock-summary {
          border-color: #22c55e;
        }

        .swagger-ui .opblock.opblock-get .opblock-summary-method {
          background: #22c55e;
        }

        .swagger-ui .opblock.opblock-post .opblock-summary {
          border-color: #3b82f6;
        }

        .swagger-ui .opblock.opblock-post .opblock-summary-method {
          background: #3b82f6;
        }

        .swagger-ui .opblock.opblock-put .opblock-summary {
          border-color: #f59e0b;
        }

        .swagger-ui .opblock.opblock-put .opblock-summary-method {
          background: #f59e0b;
        }

        .swagger-ui .opblock.opblock-delete .opblock-summary {
          border-color: #ef4444;
        }

        .swagger-ui .opblock.opblock-delete .opblock-summary-method {
          background: #ef4444;
        }

        .swagger-ui .btn.execute {
          background-color: #15803d;
          border-color: #15803d;
        }

        .swagger-ui .btn.execute:hover {
          background-color: #166534;
        }

        .swagger-ui .scheme-container {
          background: #f0fdf4;
          box-shadow: none;
        }
      `}</style>
    </div>
  );
}
