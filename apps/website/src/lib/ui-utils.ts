/**
 * Premium Islamic UI Utilities
 * Comprehensive utility functions for responsive design, accessibility, and Islamic UI patterns
 */

import { ComponentVariant, ComponentSize, AnimationType, LanguagePreference } from '@/types';

// Responsive breakpoints following Islamic design principles
export const breakpoints = {
  sm: '640px',   // Mobile portrait
  md: '768px',   // Tablet portrait
  lg: '1024px',  // Tablet landscape
  xl: '1280px',  // Desktop
  '2xl': '1536px' // Large desktop
} as const;

// Islamic color utilities
export const islamicColors = {
  green: {
    50: 'hsl(var(--islamic-green-50))',
    100: 'hsl(var(--islamic-green-100))',
    200: 'hsl(var(--islamic-green-200))',
    300: 'hsl(var(--islamic-green-300))',
    400: 'hsl(var(--islamic-green-400))',
    500: 'hsl(var(--islamic-green-500))',
    600: 'hsl(var(--islamic-green-600))',
    700: 'hsl(var(--islamic-green-700))',
    800: 'hsl(var(--islamic-green-800))',
    900: 'hsl(var(--islamic-green-900))',
    950: 'hsl(var(--islamic-green-950))',
  },
  gold: {
    50: 'hsl(var(--islamic-gold-50))',
    100: 'hsl(var(--islamic-gold-100))',
    200: 'hsl(var(--islamic-gold-200))',
    300: 'hsl(var(--islamic-gold-300))',
    400: 'hsl(var(--islamic-gold-400))',
    500: 'hsl(var(--islamic-gold-500))',
    600: 'hsl(var(--islamic-gold-600))',
    700: 'hsl(var(--islamic-gold-700))',
    800: 'hsl(var(--islamic-gold-800))',
    900: 'hsl(var(--islamic-gold-900))',
  },
  navy: {
    50: 'hsl(var(--islamic-navy-50))',
    100: 'hsl(var(--islamic-navy-100))',
    200: 'hsl(var(--islamic-navy-200))',
    300: 'hsl(var(--islamic-navy-300))',
    400: 'hsl(var(--islamic-navy-400))',
    500: 'hsl(var(--islamic-navy-500))',
    600: 'hsl(var(--islamic-navy-600))',
    700: 'hsl(var(--islamic-navy-700))',
    800: 'hsl(var(--islamic-navy-800))',
    900: 'hsl(var(--islamic-navy-900))',
  }
} as const;

// Component size mappings
export const sizeClasses = {
  sm: {
    text: 'text-sm',
    padding: 'p-2',
    gap: 'gap-2',
    rounded: 'rounded',
    shadow: 'shadow-sm'
  },
  md: {
    text: 'text-base',
    padding: 'p-4',
    gap: 'gap-3',
    rounded: 'rounded-lg',
    shadow: 'shadow'
  },
  lg: {
    text: 'text-lg',
    padding: 'p-6',
    gap: 'gap-4',
    rounded: 'rounded-xl',
    shadow: 'shadow-lg'
  },
  xl: {
    text: 'text-xl',
    padding: 'p-8',
    gap: 'gap-6',
    rounded: 'rounded-2xl',
    shadow: 'shadow-xl'
  }
} as const;

// Component variant utilities
export const getVariantClasses = (variant: ComponentVariant = 'default') => {
  const variants = {
    default: 'bg-white border border-gray-200 shadow-sm hover:shadow-md',
    compact: 'bg-gray-50 border border-gray-100 shadow-none',
    premium: 'card-premium islamic-geometric-pattern'
  };
  
  return variants[variant];
};

// Animation utilities
export const getAnimationClasses = (animation: AnimationType = 'fade', delay: number = 0) => {
  const animations = {
    fade: 'fade-in',
    slide: 'slide-up',
    scale: 'scale-in',
    bounce: 'animate-bounce',
    none: ''
  };
  
  const baseClass = animations[animation];
  const delayClass = delay > 0 ? `animation-delay-${delay}` : '';
  
  return `${baseClass} ${delayClass}`.trim();
};

// Responsive text utilities for Arabic support
export const getTextClasses = (
  size: ComponentSize = 'md',
  language: LanguagePreference = 'en',
  weight: 'normal' | 'medium' | 'semibold' | 'bold' = 'normal'
) => {
  const sizeMap = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };
  
  const weightMap = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };
  
  const directionClass = language === 'ar' ? 'arabic text-right' : 'text-left';
  
  return `${sizeMap[size]} ${weightMap[weight]} ${directionClass}`;
};

// Accessibility utilities
export const getAccessibilityProps = (label: string, description?: string) => ({
  'aria-label': label,
  'aria-describedby': description ? `desc-${Date.now()}` : undefined,
  role: 'button',
  tabIndex: 0
});

// Focus ring utility for accessibility
export const getFocusRing = (color: 'green' | 'gold' | 'navy' = 'green') => {
  const colors = {
    green: 'focus:ring-green-500 focus:border-green-500',
    gold: 'focus:ring-yellow-500 focus:border-yellow-500',
    navy: 'focus:ring-blue-500 focus:border-blue-500'
  };
  
  return `focus:outline-none focus:ring-2 focus:ring-offset-2 ${colors[color]}`;
};

// Prayer time utilities
export const formatPrayerTime = (time: string, format: '12h' | '24h' = '12h') => {
  if (format === '12h') {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }
  return time;
};

export const getNextPrayerTime = (prayerTimes: Record<string, string>) => {
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  const prayers = [
    { name: 'Fajr', nameAr: 'الفجر', time: prayerTimes.fajr, icon: '🌅' },
    { name: 'Dhuhr', nameAr: 'الظهر', time: prayerTimes.dhuhr, icon: '☀️' },
    { name: 'Asr', nameAr: 'العصر', time: prayerTimes.asr, icon: '🌇' },
    { name: 'Maghrib', nameAr: 'المغرب', time: prayerTimes.maghrib, icon: '🌆' },
    { name: 'Isha', nameAr: 'العشاء', time: prayerTimes.isha, icon: '🌙' },
  ];
  
  for (const prayer of prayers) {
    if (prayer.time > currentTime) {
      return prayer;
    }
  }
  
  return prayers[0]; // Tomorrow's Fajr
};

// Islamic calendar utilities
export const getHijriDate = (date: Date = new Date()) => {
  // Simplified Hijri conversion (in production, use a proper library like moment-hijri)
  const gregorianYear = date.getFullYear();
  const hijriYear = Math.floor(((gregorianYear - 622) * 33) / 32) + 1;
  
  const hijriMonths = [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
    'جمادى الأولى', 'جمادى الثانية', 'رجب', 'شعبان',
    'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
  ];
  
  return {
    year: hijriYear,
    month: hijriMonths[date.getMonth() % 12],
    day: date.getDate(),
    formatted: `${date.getDate()} ${hijriMonths[date.getMonth() % 12]} ${hijriYear} هـ`
  };
};

// Educational content utilities
export const getReadingTime = (content: string) => {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  
  return {
    minutes,
    formatted: minutes === 1 ? '1 minute' : `${minutes} minutes`,
    formattedAr: minutes === 1 ? 'دقيقة واحدة' : `${minutes} دقائق`
  };
};

export const getDifficultyColor = (level: string) => {
  const colors = {
    beginner: 'bg-green-100 text-green-800 border-green-200',
    intermediate: 'bg-amber-100 text-amber-800 border-amber-200',
    advanced: 'bg-purple-100 text-purple-800 border-purple-200'
  };
  
  return colors[level as keyof typeof colors] || colors.beginner;
};

// Responsive image utilities
export const getImageSizes = (variant: ComponentVariant = 'default') => {
  const sizes = {
    default: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    compact: '(max-width: 640px) 80vw, (max-width: 1024px) 40vw, 25vw',
    premium: '(max-width: 640px) 100vw, (max-width: 1024px) 60vw, 40vw'
  };
  
  return sizes[variant];
};

// Performance optimization utilities
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Local storage utilities with error handling
export const safeLocalStorage = {
  getItem: (key: string, defaultValue: any = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  setItem: (key: string, value: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }
};

// Date formatting utilities
export const formatIslamicDate = (date: Date, showArabic: boolean = false) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  const gregorian = date.toLocaleDateString(showArabic ? 'ar' : 'en', options);
  const hijri = getHijriDate(date);
  
  return {
    gregorian,
    hijri: hijri.formatted,
    combined: showArabic 
      ? `${gregorian} - ${hijri.formatted}` 
      : `${gregorian} (${hijri.formatted})`
  };
};

// Screen reader utilities
export const announceToScreenReader = (message: string) => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('class', 'sr-only');
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Touch and gesture utilities for mobile
export const getTouchEventProps = (
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  threshold: number = 50
) => {
  let startX = 0;
  let startY = 0;
  
  return {
    onTouchStart: (e: React.TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    },
    
    onTouchEnd: (e: React.TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      
      // Only trigger swipe if horizontal movement is greater than vertical
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      }
    }
  };
};

export default {
  breakpoints,
  islamicColors,
  sizeClasses,
  getVariantClasses,
  getAnimationClasses,
  getTextClasses,
  getAccessibilityProps,
  getFocusRing,
  formatPrayerTime,
  getNextPrayerTime,
  getHijriDate,
  getReadingTime,
  getDifficultyColor,
  getImageSizes,
  debounce,
  throttle,
  safeLocalStorage,
  formatIslamicDate,
  announceToScreenReader,
  getTouchEventProps
};