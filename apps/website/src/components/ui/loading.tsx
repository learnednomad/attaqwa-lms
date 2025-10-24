'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  variant?: 'spinner' | 'dots' | 'prayer' | 'islamic' | 'minimal';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  messageArabic?: string;
  showMessage?: boolean;
  showArabic?: boolean;
  className?: string;
}

export function Loading({
  variant = 'spinner',
  size = 'md',
  message,
  messageArabic,
  showMessage = true,
  showArabic = false,
  className
}: LoadingProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-6 h-6';
      case 'md':
        return 'w-10 h-10';
      case 'lg':
        return 'w-16 h-16';
      case 'xl':
        return 'w-24 h-24';
      default:
        return 'w-10 h-10';
    }
  };

  const getTextSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'md':
        return 'text-sm';
      case 'lg':
        return 'text-base';
      case 'xl':
        return 'text-lg';
      default:
        return 'text-sm';
    }
  };

  const defaultMessage = showArabic && messageArabic 
    ? messageArabic 
    : message || 'Loading...';

  const renderSpinner = () => (
    <div className={cn(
      getSizeClasses(),
      'border-3 border-gray-200 border-t-3 border-t-green-600 rounded-full animate-spin'
    )} />
  );

  const renderDots = () => (
    <div className="flex items-center space-x-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : size === 'xl' ? 'w-6 h-6' : 'w-3 h-3',
            'bg-green-600 rounded-full animate-bounce'
          )}
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );

  const renderPrayerSpinner = () => (
    <div className="relative flex items-center justify-center">
      <div className={cn(
        getSizeClasses(),
        'border-2 border-gray-200 rounded-full'
      )}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-green-600 animate-pulse" style={{
            fontSize: size === 'sm' ? '12px' : size === 'lg' ? '24px' : size === 'xl' ? '32px' : '16px'
          }}>
            🕌
          </div>
        </div>
      </div>
      <div className={cn(
        getSizeClasses(),
        'absolute border-t-2 border-green-600 rounded-full animate-spin'
      )} />
    </div>
  );

  const renderIslamicSpinner = () => (
    <div className="relative flex items-center justify-center">
      {/* Outer ring */}
      <div className={cn(
        getSizeClasses(),
        'border-2 border-green-200 rounded-full animate-spin'
      )} style={{ animationDuration: '3s' }}>
        <div className="absolute inset-0 border-t-2 border-green-600 rounded-full" />
      </div>
      
      {/* Inner ring */}
      <div className={cn(
        size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-10 h-10' : size === 'xl' ? 'w-16 h-16' : 'w-6 h-6',
        'absolute border-2 border-gold-200 rounded-full animate-spin'
      )} style={{ animationDirection: 'reverse', animationDuration: '2s' }}>
        <div className="absolute inset-0 border-t-2 border-yellow-500 rounded-full" />
      </div>
      
      {/* Center icon */}
      <div className="absolute flex items-center justify-center">
        <div className="text-green-700 animate-pulse" style={{
          fontSize: size === 'sm' ? '8px' : size === 'lg' ? '16px' : size === 'xl' ? '24px' : '12px'
        }}>
          ☪️
        </div>
      </div>
    </div>
  );

  const renderMinimal = () => (
    <div className="flex items-center space-x-3">
      <div className={cn(
        getSizeClasses(),
        'border-2 border-gray-300 border-t-green-600 rounded-full animate-spin'
      )} />
    </div>
  );

  const renderLoadingElement = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'prayer':
        return renderPrayerSpinner();
      case 'islamic':
        return renderIslamicSpinner();
      case 'minimal':
        return renderMinimal();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className={cn(
      'flex flex-col items-center justify-center space-y-3 p-6',
      className
    )}>
      {renderLoadingElement()}
      
      {showMessage && defaultMessage && (
        <div className="text-center space-y-1">
          <p className={cn(
            'text-gray-600 font-medium animate-pulse',
            getTextSizeClasses(),
            showArabic && 'arabic'
          )}>
            {defaultMessage}
          </p>
          
          {showArabic && messageArabic && message && message !== messageArabic && (
            <p className={cn('text-gray-500', getTextSizeClasses())}>
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Skeleton loading components for different content types
export function PrayerTimesSkeleton() {
  return (
    <div className="card-prayer-time p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-200 rounded w-32"></div>
        <div className="h-4 bg-green-200 rounded-full w-12"></div>
      </div>
      
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EducationCardSkeleton() {
  return (
    <div className="card-premium p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="h-6 bg-gray-200 rounded w-20"></div>
        <div className="h-6 bg-gray-200 rounded w-16"></div>
      </div>
      
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      
      <div className="h-20 bg-gray-200 rounded mb-4"></div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-12"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
      
      <div className="flex space-x-2 mt-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-6 bg-gray-200 rounded w-16"></div>
        ))}
      </div>
    </div>
  );
}

export function AnnouncementSkeleton() {
  return (
    <div className="card-premium p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="h-6 bg-gray-200 rounded w-24"></div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
      
      <div className="h-8 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
      
      <div className="h-32 bg-gray-200 rounded mb-4"></div>
      
      <div className="flex items-center justify-between">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <div className="h-8 bg-green-200 rounded w-24"></div>
      </div>
    </div>
  );
}

// Loading overlay component
export function LoadingOverlay({ 
  isLoading, 
  children, 
  message = 'Loading...',
  messageArabic,
  showArabic = false
}: {
  isLoading: boolean;
  children: React.ReactNode;
  message?: string;
  messageArabic?: string;
  showArabic?: boolean;
}) {
  return (
    <div className="relative">
      {children}
      
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50 rounded-lg">
          <Loading
            variant="islamic"
            size="lg"
            message={message}
            messageArabic={messageArabic}
            showArabic={showArabic}
          />
        </div>
      )}
    </div>
  );
}