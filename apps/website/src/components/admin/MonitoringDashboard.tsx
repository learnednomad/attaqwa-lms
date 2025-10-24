'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useClientLogger } from '@/lib/monitoring/client-logger';

interface SystemMetrics {
  timestamp: string;
  system: {
    uptime: string;
    memory: {
      used: string;
      total: string;
      rss: string;
    };
    cpu: string;
    nodeVersion: string;
  };
  islamicFeatures: {
    prayerTimesRequests24h: number;
    educationContentViews24h: number;
    quizAttempts24h: number;
    qiblaDirectionUsage24h: number;
    activeUsers24h: number;
  };
  errors: {
    total24h: number;
    islamicFeatureErrors24h: number;
    criticalErrors: number;
  };
  performance: {
    averageResponseTime: string;
    slowQueries: number;
    prayerTimeApiLatency: string;
  };
  userEngagement: {
    newUsers24h: number;
    contentCompletions24h: number;
    topIslamicSubjects: string[];
    userRetention: string;
  };
}

interface IslamicAnalytics {
  timestamp: string;
  prayerTimes: {
    totalRequests: number;
    topLocations: Array<{ city: string; requests: number }>;
    calculationMethods: Array<{ method: string; usage: number }>;
    peakUsageHours: number[];
  };
  education: {
    popularContent: Array<{ title: string; views: number }>;
    completionRates: {
      overall: string;
      bySubject: Record<string, string>;
    };
    subjectDistribution: Array<{ subject: string; percentage: number }>;
    ageGroupEngagement: Array<{ ageGroup: string; engagement: string }>;
    quizPerformance: {
      averageScore: number;
      completionRate: string;
      retakeRate: string;
      topPerformingQuizzes: string[];
    };
  };
  qiblaDirection: {
    totalUsage: number;
    userLocations: Array<{ country: string; users: number }>;
    accuracyMetrics: {
      averageAccuracy: string;
      gpsUsage: string;
      manualEntry: string;
    };
  };
  userBehavior: {
    sessionDuration: string;
    featureUsage: Array<{ feature: string; usage: string }>;
    islamicContentPreferences: Array<{ preference: string; percentage: number }>;
    retentionByFeature: Array<{ feature: string; retention: string }>;
  };
}

export function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  const [analytics, setAnalytics] = useState<IslamicAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const { logUserInteraction } = useClientLogger();

  useEffect(() => {
    fetchMetrics();
    fetchAnalytics();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchMetrics();
      fetchAnalytics();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/monitoring/metrics');
      if (!response.ok) throw new Error('Failed to fetch metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/monitoring/islamic-analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    logUserInteraction('tab_click', 'monitoring_dashboard', { tab });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-islamic-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading monitoring data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-xl mb-2">⚠️ Error loading dashboard</p>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-islamic-green-600 text-white rounded hover:bg-islamic-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">🕌 Islamic Platform Monitoring</h1>
        <p className="text-gray-600 mt-2">
          Real-time monitoring of Islamic features and community engagement
        </p>
        <div className="text-sm text-gray-500 mt-1">
          Last updated: {metrics?.timestamp ? new Date(metrics.timestamp).toLocaleString() : 'Never'}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'System Overview' },
            { id: 'islamic', label: 'Islamic Features' },
            { id: 'users', label: 'User Engagement' },
            { id: 'performance', label: 'Performance' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-islamic-green-500 text-islamic-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">System Uptime</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{metrics.system.uptime}</div>
              <p className="text-xs text-gray-500">Node.js {metrics.system.nodeVersion}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Memory Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.system.memory.used}</div>
              <p className="text-xs text-gray-500">of {metrics.system.memory.total}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Active Users (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-islamic-green-600">
                {metrics.islamicFeatures.activeUsers24h}
              </div>
              <p className="text-xs text-gray-500">Unique users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Healthy
                </Badge>
                <span className="text-sm text-gray-500">
                  {metrics.errors.criticalErrors === 0 ? 'No critical errors' : `${metrics.errors.criticalErrors} critical`}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Islamic Features Tab */}
      {activeTab === 'islamic' && metrics && analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>🕐 Prayer Times Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-islamic-green-600 mb-2">
                  {metrics.islamicFeatures.prayerTimesRequests24h}
                </div>
                <p className="text-sm text-gray-600">Requests in last 24 hours</p>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Top Locations</h4>
                  {analytics.prayerTimes.topLocations.map((location, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{location.city}</span>
                      <span className="text-gray-500">{location.requests}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📚 Education System</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {metrics.islamicFeatures.educationContentViews24h}
                </div>
                <p className="text-sm text-gray-600">Content views (24h)</p>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Completion Rate</h4>
                  <div className="text-2xl font-bold text-green-600">
                    {analytics.education.completionRates.overall}
                  </div>
                  
                  <div className="mt-2">
                    <h5 className="text-sm font-medium mb-1">Quiz Performance</h5>
                    <div className="text-lg font-semibold">
                      {analytics.education.quizPerformance.averageScore}/100
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🧭 Qibla Direction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {metrics.islamicFeatures.qiblaDirectionUsage24h}
                </div>
                <p className="text-sm text-gray-600">Uses in last 24 hours</p>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Accuracy</h4>
                  <div className="text-lg font-semibold">
                    {analytics.qiblaDirection.accuracyMetrics.averageAccuracy}
                  </div>
                  <p className="text-sm text-gray-500">
                    GPS: {analytics.qiblaDirection.accuracyMetrics.gpsUsage}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>📈 Subject Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {analytics.education.subjectDistribution.map((subject, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-20 text-sm text-gray-600">{subject.subject}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-islamic-green-600 h-2 rounded-full"
                        style={{ width: `${subject.percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-12 text-sm text-gray-500">{subject.percentage}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* User Engagement Tab */}
      {activeTab === 'users' && metrics && analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">New Users (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {metrics.userEngagement.newUsers24h}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">User Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {metrics.userEngagement.userRetention}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Avg Session</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {analytics.userBehavior.sessionDuration}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Content Completions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {metrics.userEngagement.contentCompletions24h}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Feature Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.userBehavior.featureUsage.map((feature, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{feature.feature}</span>
                      <Badge variant="secondary">{feature.usage}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Age Group Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analytics.education.ageGroupEngagement.map((group, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm">{group.ageGroup}</span>
                      <Badge variant="outline">{group.engagement}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && metrics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>⚡ Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {metrics.performance.averageResponseTime}
                </div>
                <p className="text-sm text-gray-600">Average response time</p>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-1">Prayer Times API</h4>
                  <div className="text-lg font-semibold">
                    {metrics.performance.prayerTimeApiLatency}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🐌 Slow Queries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {metrics.performance.slowQueries}
                </div>
                <p className="text-sm text-gray-600">Queries {'>'}1s (24h)</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>❌ Errors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {metrics.errors.total24h}
                </div>
                <p className="text-sm text-gray-600">Total errors (24h)</p>
                
                <div className="mt-2">
                  <span className="text-sm text-orange-600">
                    {metrics.errors.islamicFeatureErrors24h} Islamic feature errors
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}