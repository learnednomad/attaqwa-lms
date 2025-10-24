/**
 * Client-side logging and monitoring for Islamic features
 * Tracks user interactions with Islamic content and features
 */

interface LogEvent {
  level: 'info' | 'warn' | 'error' | 'debug';
  event: string;
  timestamp: string;
  sessionId: string;
  userId?: string;
  data?: Record<string, any>;
  islamicContext?: {
    hijriDate?: string;
    prayerTimeContext?: string;
    currentPrayer?: string;
    qiblaDirection?: number;
  };
}

class ClientLogger {
  private sessionId: string;
  private userId?: string;
  private events: LogEvent[] = [];
  private maxEvents = 100;

  constructor() {
    this.sessionId = this.generateSessionId();
    
    // Initialize Islamic context
    this.initializeIslamicContext();
    
    // Send buffered events periodically
    this.startEventFlush();
    
    // Global error handler
    this.setupGlobalErrorHandler();
    
    // Performance monitoring
    this.setupPerformanceMonitoring();
  }

  // Set user ID when user logs in
  setUserId(userId: string) {
    this.userId = userId;
    this.log('info', 'user_session_start', { userId });
  }

  // Clear user ID when user logs out
  clearUserId() {
    this.log('info', 'user_session_end', { userId: this.userId });
    this.userId = undefined;
  }

  // Main logging method
  log(level: LogEvent['level'], event: string, data?: Record<string, any>) {
    const logEvent: LogEvent = {
      level,
      event,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
      data,
      islamicContext: this.getIslamicContext(),
    };

    this.events.push(logEvent);
    
    // Keep only recent events in memory
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[${level.toUpperCase()}] ${event}:`, data);
    }

    // Send critical errors immediately
    if (level === 'error') {
      this.flushEvents();
    }
  }

  // Islamic feature specific logging methods
  logPrayerTimeViewed(location?: { lat: number; lng: number }) {
    this.log('info', 'prayer_times_viewed', {
      location,
      userLocation: location ? this.formatLocation(location) : 'unknown',
    });
  }

  logPrayerTimeCalculated(prayerTimes: Record<string, string>, method: string) {
    this.log('info', 'prayer_times_calculated', {
      calculationMethod: method,
      nextPrayer: this.getNextPrayer(prayerTimes),
      currentTime: new Date().toLocaleTimeString(),
    });
  }

  logQiblaDirectionUsed(userLocation: { lat: number; lng: number }, direction: number) {
    this.log('info', 'qibla_direction_used', {
      userLocation: this.formatLocation(userLocation),
      qiblaDirection: direction,
      accuracy: 'calculated', // Could be GPS, calculated, etc.
    });
  }

  logEducationContentViewed(contentId: string, contentType: string, subject: string) {
    this.log('info', 'education_content_viewed', {
      contentId,
      contentType,
      subject,
      ageTier: this.getUserAgeTier(),
    });
  }

  logEducationContentCompleted(contentId: string, timeSpent: number, score?: number) {
    this.log('info', 'education_content_completed', {
      contentId,
      timeSpent,
      score,
      completionRate: score ? `${score}%` : undefined,
    });
  }

  logQuizAttempt(quizId: string, score: number, timeSpent: number, passed: boolean) {
    this.log('info', 'quiz_attempt', {
      quizId,
      score,
      timeSpent,
      passed,
      attempt: this.getQuizAttemptCount(quizId),
    });
  }

  logAnnouncementViewed(announcementId: string, type: string, priority: string) {
    this.log('info', 'announcement_viewed', {
      announcementId,
      type,
      priority,
      viewDuration: Date.now(), // Will calculate duration on view end
    });
  }

  logIslamicFeatureError(feature: string, error: Error, context?: Record<string, any>) {
    this.log('error', 'islamic_feature_error', {
      feature,
      errorMessage: error.message,
      errorStack: error.stack?.slice(0, 1000), // Truncate stack trace
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
    });
  }

  // Performance monitoring for Islamic features
  logPerformance(feature: string, duration: number, metadata?: Record<string, any>) {
    this.log('info', 'performance_metric', {
      feature,
      duration: `${duration}ms`,
      performanceGrade: this.getPerformanceGrade(duration),
      metadata,
      connection: this.getConnectionInfo(),
    });
  }

  // User interaction tracking
  logUserInteraction(action: string, element: string, context?: Record<string, any>) {
    this.log('info', 'user_interaction', {
      action,
      element,
      context,
      pageUrl: window.location.pathname,
      timestamp: Date.now(),
    });
  }

  // Search and discovery
  logSearch(query: string, results: number, filters?: Record<string, any>) {
    this.log('info', 'content_search', {
      query: query.slice(0, 100), // Truncate long queries
      resultCount: results,
      filters,
      searchCategory: this.categorizeSearchQuery(query),
    });
  }

  // Error boundary logging
  logReactError(error: Error, errorInfo: { componentStack: string }) {
    this.log('error', 'react_error', {
      errorMessage: error.message,
      componentStack: errorInfo.componentStack.slice(0, 1000),
      userAgent: navigator.userAgent,
      url: window.location.href,
    });
  }

  // Send events to backend
  private async flushEvents() {
    if (this.events.length === 0) return;

    const eventsToSend = [...this.events];
    this.events = [];

    try {
      await fetch('/api/monitoring/client-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          events: eventsToSend,
          metadata: {
            userAgent: navigator.userAgent,
            screen: {
              width: window.screen.width,
              height: window.screen.height,
            },
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
        }),
      });
    } catch (error) {
      console.error('Failed to send client events:', error);
      // Put events back if sending failed
      this.events.unshift(...eventsToSend);
    }
  }

  // Utility methods
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private initializeIslamicContext() {
    // Initialize Islamic calendar and prayer time context
    this.log('info', 'islamic_context_initialized', {
      hijriDate: this.getHijriDate(),
      userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      currentPrayerContext: this.getCurrentPrayerContext(),
    });
  }

  private getIslamicContext() {
    return {
      hijriDate: this.getHijriDate(),
      prayerTimeContext: this.getCurrentPrayerContext(),
      currentPrayer: this.getCurrentPrayer(),
    };
  }

  private getHijriDate(): string {
    // Simple approximation - in production use proper Islamic calendar library
    const gregorianDate = new Date();
    const hijriYear = gregorianDate.getFullYear() - 579;
    return `${hijriYear} AH`;
  }

  private getCurrentPrayerContext(): string {
    const hour = new Date().getHours();
    if (hour < 6) return 'fajr_time';
    if (hour < 12) return 'dhuhr_time';
    if (hour < 16) return 'asr_time';
    if (hour < 19) return 'maghrib_time';
    return 'isha_time';
  }

  private getCurrentPrayer(): string {
    // This would normally use actual prayer times from API
    const hour = new Date().getHours();
    if (hour < 6) return 'isha';
    if (hour < 12) return 'fajr';
    if (hour < 16) return 'dhuhr';
    if (hour < 19) return 'asr';
    return 'maghrib';
  }

  private getNextPrayer(prayerTimes: Record<string, string>): string {
    const currentTime = new Date().toTimeString().slice(0, 5);
    const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
    
    for (const prayer of prayers) {
      if (prayerTimes[prayer] && prayerTimes[prayer] > currentTime) {
        return prayer;
      }
    }
    return 'fajr'; // Next day
  }

  private formatLocation(location: { lat: number; lng: number }): string {
    return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
  }

  private getUserAgeTier(): string {
    // This would normally come from user profile
    return localStorage.getItem('userAgeTier') || 'unknown';
  }

  private getQuizAttemptCount(quizId: string): number {
    const key = `quiz_attempts_${quizId}`;
    const count = parseInt(localStorage.getItem(key) || '0') + 1;
    localStorage.setItem(key, count.toString());
    return count;
  }

  private getPerformanceGrade(duration: number): string {
    if (duration < 100) return 'excellent';
    if (duration < 300) return 'good';
    if (duration < 1000) return 'fair';
    return 'poor';
  }

  private getConnectionInfo() {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
      };
    }
    return { type: 'unknown' };
  }

  private categorizeSearchQuery(query: string): string {
    const lowerQuery = query.toLowerCase();
    if (lowerQuery.includes('prayer') || lowerQuery.includes('salah')) return 'prayer';
    if (lowerQuery.includes('quran') || lowerQuery.includes('qur')) return 'quran';
    if (lowerQuery.includes('hadith')) return 'hadith';
    if (lowerQuery.includes('fiqh') || lowerQuery.includes('law')) return 'fiqh';
    return 'general';
  }

  private setupGlobalErrorHandler() {
    window.addEventListener('error', (event) => {
      this.log('error', 'javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack?.slice(0, 1000),
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.log('error', 'unhandled_promise_rejection', {
        reason: event.reason?.toString(),
        stack: event.reason?.stack?.slice(0, 1000),
      });
    });
  }

  private setupPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        this.log('info', 'page_load_performance', {
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
          firstPaint: this.getFirstPaint(),
          largestContentfulPaint: this.getLargestContentfulPaint(),
        });
      }, 1000);
    });
  }

  private getFirstPaint(): number | undefined {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint?.startTime;
  }

  private getLargestContentfulPaint(): number | undefined {
    // This would normally use PerformanceObserver for LCP
    return undefined; // Placeholder
  }

  private startEventFlush() {
    // Send events every 30 seconds
    setInterval(() => {
      this.flushEvents();
    }, 30000);

    // Send events before page unload
    window.addEventListener('beforeunload', () => {
      // Use sendBeacon for better reliability
      if (navigator.sendBeacon && this.events.length > 0) {
        navigator.sendBeacon(
          '/api/monitoring/client-events',
          JSON.stringify({ events: this.events })
        );
      }
    });
  }
}

// Create singleton instance
export const clientLogger = new ClientLogger();

// React Error Boundary helper
export const logReactError = (error: Error, errorInfo: { componentStack: string }) => {
  clientLogger.logReactError(error, errorInfo);
};

// Performance measurement helper
export const measurePerformance = (name: string, fn: () => void | Promise<void>) => {
  return async () => {
    const start = performance.now();
    try {
      await fn();
    } finally {
      const duration = performance.now() - start;
      clientLogger.logPerformance(name, duration);
    }
  };
};

// Hook for logging user interactions
export const useClientLogger = () => {
  return {
    logPrayerTimeViewed: clientLogger.logPrayerTimeViewed.bind(clientLogger),
    logEducationContentViewed: clientLogger.logEducationContentViewed.bind(clientLogger),
    logQuizAttempt: clientLogger.logQuizAttempt.bind(clientLogger),
    logUserInteraction: clientLogger.logUserInteraction.bind(clientLogger),
    logSearch: clientLogger.logSearch.bind(clientLogger),
    logError: clientLogger.logIslamicFeatureError.bind(clientLogger),
    setUserId: clientLogger.setUserId.bind(clientLogger),
    clearUserId: clientLogger.clearUserId.bind(clientLogger),
  };
};