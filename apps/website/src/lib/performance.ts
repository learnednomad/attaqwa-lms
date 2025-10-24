/**
 * Core Web Vitals and Performance Optimization for Masjid At-Taqwa
 * Comprehensive performance monitoring and optimization utilities
 */

// Performance thresholds based on Google's Core Web Vitals
export const PERFORMANCE_THRESHOLDS = {
  // Largest Contentful Paint (LCP) - Loading performance
  LCP: {
    GOOD: 2500,
    NEEDS_IMPROVEMENT: 4000,
  },
  // First Input Delay (FID) - Interactivity 
  FID: {
    GOOD: 100,
    NEEDS_IMPROVEMENT: 300,
  },
  // Cumulative Layout Shift (CLS) - Visual stability
  CLS: {
    GOOD: 0.1,
    NEEDS_IMPROVEMENT: 0.25,
  },
  // First Contentful Paint (FCP) - Loading
  FCP: {
    GOOD: 1800,
    NEEDS_IMPROVEMENT: 3000,
  },
  // Time to Interactive (TTI) - Interactivity
  TTI: {
    GOOD: 3800,
    NEEDS_IMPROVEMENT: 7300,
  },
} as const;

/**
 * Performance observer for Core Web Vitals monitoring
 */
export class PerformanceMonitor {
  private metrics: Record<string, number> = {};
  
  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeObservers();
    }
  }

  private initializeObservers() {
    // Largest Contentful Paint (LCP)
    this.observeLCP();
    
    // First Input Delay (FID)
    this.observeFID();
    
    // Cumulative Layout Shift (CLS)
    this.observeCLS();
    
    // First Contentful Paint (FCP)
    this.observeFCP();
  }

  private observeLCP() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.lcp = lastEntry.startTime;
          this.reportMetric('LCP', lastEntry.startTime);
        });
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        console.warn('LCP observation failed:', error);
      }
    }
  }

  private observeFID() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.metrics.fid = entry.processingStart - entry.startTime;
            this.reportMetric('FID', entry.processingStart - entry.startTime);
          });
        });
        observer.observe({ entryTypes: ['first-input'] });
      } catch (error) {
        console.warn('FID observation failed:', error);
      }
    }
  }

  private observeCLS() {
    if ('PerformanceObserver' in window) {
      try {
        let clsValue = 0;
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              this.metrics.cls = clsValue;
              this.reportMetric('CLS', clsValue);
            }
          });
        });
        observer.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('CLS observation failed:', error);
      }
    }
  }

  private observeFCP() {
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.fcp = entry.startTime;
              this.reportMetric('FCP', entry.startTime);
            }
          });
        });
        observer.observe({ entryTypes: ['paint'] });
      } catch (error) {
        console.warn('FCP observation failed:', error);
      }
    }
  }

  private reportMetric(name: string, value: number) {
    // Send metrics to your analytics service
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'web_vital', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(value),
        custom_parameter_1: this.getPerformanceRating(name, value),
      });
    }
    
    console.log(`${name}: ${value} (${this.getPerformanceRating(name, value)})`);
  }

  private getPerformanceRating(metric: string, value: number): string {
    const thresholds = PERFORMANCE_THRESHOLDS[metric as keyof typeof PERFORMANCE_THRESHOLDS];
    if (!thresholds) return 'unknown';
    
    if (value <= thresholds.GOOD) return 'good';
    if (value <= thresholds.NEEDS_IMPROVEMENT) return 'needs-improvement';
    return 'poor';
  }

  public getMetrics() {
    return { ...this.metrics };
  }
}

/**
 * Image optimization utilities
 */
export const ImageOptimization = {
  // Generate responsive image URLs for different screen sizes
  generateResponsiveImageUrls(baseUrl: string, sizes: number[] = [320, 640, 768, 1024, 1280]) {
    return sizes.map(size => ({
      url: `${baseUrl}?w=${size}&q=75&f=webp`,
      width: size,
    }));
  },

  // Generate appropriate sizes attribute for responsive images
  generateSizesAttribute(breakpoints: Array<{ minWidth: string; width: string }>) {
    const sizeStrings = breakpoints.map(bp => `(min-width: ${bp.minWidth}) ${bp.width}`);
    sizeStrings.push('100vw'); // Default fallback
    return sizeStrings.join(', ');
  },

  // Lazy loading intersection observer options
  lazyLoadOptions: {
    rootMargin: '50px 0px',
    threshold: 0.01,
  },
};

/**
 * Resource loading optimization
 */
export const ResourceOptimization = {
  // Preload critical resources
  preloadCriticalResources() {
    if (typeof document === 'undefined') return;

    const criticalResources = [
      // Critical fonts
      { href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', as: 'style' },
      { href: 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap', as: 'style' },
      
      // Critical images
      { href: '/images/mosque-hero.jpg', as: 'image' },
      { href: '/images/prayer-times-bg.jpg', as: 'image' },
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.href;
      link.as = resource.as;
      if (resource.as === 'style') {
        link.onload = () => {
          link.rel = 'stylesheet';
        };
      }
      document.head.appendChild(link);
    });
  },

  // Prefetch next page resources
  prefetchNextPageResources(urls: string[]) {
    if (typeof document === 'undefined') return;

    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  },

  // DNS prefetch for external domains
  dnsPrefetch() {
    if (typeof document === 'undefined') return;

    const domains = [
      'https://api.aladhan.com',
      'https://www.google-analytics.com',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ];

    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });
  },
};

/**
 * Bundle optimization utilities
 */
export const BundleOptimization = {
  // Dynamic import with loading state
  async dynamicImport<T>(importFn: () => Promise<T>, fallback?: T): Promise<T> {
    try {
      return await importFn();
    } catch (error) {
      console.warn('Dynamic import failed:', error);
      if (fallback !== undefined) {
        return fallback;
      }
      throw error;
    }
  },

  // Chunk loading with retry
  async loadChunkWithRetry<T>(
    importFn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await importFn();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
    throw new Error('Failed to load chunk after retries');
  },
};

/**
 * Performance budget monitoring
 */
export const PerformanceBudget = {
  // JavaScript bundle size limits (in KB)
  BUNDLE_SIZE_LIMITS: {
    CRITICAL_JS: 150, // Critical JS that blocks rendering
    TOTAL_JS: 500,    // Total JS for the page
    CSS: 50,          // Critical CSS
  },

  // Resource count limits
  RESOURCE_COUNT_LIMITS: {
    HTTP_REQUESTS: 50,
    IMAGES: 20,
    FONTS: 4,
  },

  // Check if current page meets performance budget
  checkPerformanceBudget(): {
    withinBudget: boolean;
    violations: string[];
  } {
    const violations: string[] = [];

    if (typeof window === 'undefined') {
      return { withinBudget: true, violations: [] };
    }

    // Check resource timing
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    const jsResources = resources.filter(r => r.name.includes('.js'));
    const cssResources = resources.filter(r => r.name.includes('.css'));
    const imageResources = resources.filter(r => 
      r.name.includes('.jpg') || 
      r.name.includes('.png') || 
      r.name.includes('.webp') || 
      r.name.includes('.svg')
    );

    if (jsResources.length > this.RESOURCE_COUNT_LIMITS.HTTP_REQUESTS) {
      violations.push(`Too many JS requests: ${jsResources.length}`);
    }

    if (imageResources.length > this.RESOURCE_COUNT_LIMITS.IMAGES) {
      violations.push(`Too many images: ${imageResources.length}`);
    }

    return {
      withinBudget: violations.length === 0,
      violations,
    };
  },
};

/**
 * Initialize performance monitoring
 */
export function initializePerformanceMonitoring() {
  if (typeof window === 'undefined') return;

  // Initialize Core Web Vitals monitoring
  new PerformanceMonitor();

  // Optimize resource loading
  ResourceOptimization.preloadCriticalResources();
  ResourceOptimization.dnsPrefetch();

  // Check performance budget on page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      const budget = PerformanceBudget.checkPerformanceBudget();
      if (!budget.withinBudget) {
        console.warn('Performance budget violations:', budget.violations);
      }
    }, 2000);
  });
}