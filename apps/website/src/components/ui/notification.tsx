'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface NotificationProps {
  type?: 'success' | 'error' | 'warning' | 'info' | 'prayer';
  title: string;
  message: string;
  titleArabic?: string;
  messageArabic?: string;
  showArabic?: boolean;
  duration?: number;
  onClose?: () => void;
  action?: {
    label: string;
    labelArabic?: string;
    onClick: () => void;
  };
  className?: string;
}

export function Notification({
  type = 'info',
  title,
  message,
  titleArabic,
  messageArabic,
  showArabic = false,
  duration = 5000,
  onClose,
  action,
  className
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300); // Animation duration
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          icon: '✅',
          bgColor: 'bg-green-50 border-green-200',
          iconColor: 'text-green-600',
          titleColor: 'text-green-800',
          messageColor: 'text-green-700',
          progressColor: 'bg-green-500'
        };
      case 'error':
        return {
          icon: '❌',
          bgColor: 'bg-red-50 border-red-200',
          iconColor: 'text-red-600',
          titleColor: 'text-red-800',
          messageColor: 'text-red-700',
          progressColor: 'bg-red-500'
        };
      case 'warning':
        return {
          icon: '⚠️',
          bgColor: 'bg-amber-50 border-amber-200',
          iconColor: 'text-amber-600',
          titleColor: 'text-amber-800',
          messageColor: 'text-amber-700',
          progressColor: 'bg-amber-500'
        };
      case 'prayer':
        return {
          icon: '🕌',
          bgColor: 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200',
          iconColor: 'text-green-600',
          titleColor: 'text-green-800',
          messageColor: 'text-green-700',
          progressColor: 'bg-gradient-to-r from-green-500 to-blue-500'
        };
      default: // info
        return {
          icon: 'ℹ️',
          bgColor: 'bg-blue-50 border-blue-200',
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-800',
          messageColor: 'text-blue-700',
          progressColor: 'bg-blue-500'
        };
    }
  };

  const styles = getTypeStyles();

  if (!isVisible) return null;

  return (
    <div className={cn(
      'fixed top-4 right-4 z-50 w-96 max-w-sm',
      'transform transition-all duration-300 ease-in-out',
      isClosing ? 'translate-x-full opacity-0 scale-95' : 'translate-x-0 opacity-100 scale-100',
      className
    )}>
      <div className={cn(
        'relative p-4 rounded-lg border shadow-lg backdrop-blur-sm',
        styles.bgColor,
        'slide-up'
      )}>
        {/* Progress bar for timed notifications */}
        {duration > 0 && (
          <div className="absolute top-0 left-0 h-1 bg-gray-200 rounded-t-lg w-full overflow-hidden">
            <div 
              className={cn('h-full rounded-t-lg', styles.progressColor)}
              style={{
                animation: `shrink ${duration}ms linear forwards`
              }}
            />
          </div>
        )}

        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className={cn('text-xl flex-shrink-0', styles.iconColor)}>
            {styles.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className={cn('font-semibold text-sm mb-1', styles.titleColor)}>
              {showArabic && titleArabic ? titleArabic : title}
            </h3>
            
            <p className={cn('text-sm', styles.messageColor)}>
              {showArabic && messageArabic ? messageArabic : message}
            </p>

            {showArabic && titleArabic && title !== titleArabic && (
              <p className="text-xs text-gray-500 mt-1">{title}</p>
            )}

            {showArabic && messageArabic && message !== messageArabic && (
              <p className="text-xs text-gray-500 mt-1">{message}</p>
            )}

            {/* Action button */}
            {action && (
              <button
                onClick={() => {
                  action.onClick();
                  handleClose();
                }}
                className={cn(
                  'mt-2 text-sm font-medium underline hover:no-underline transition-colors',
                  styles.titleColor
                )}
              >
                {showArabic && action.labelArabic ? action.labelArabic : action.label}
              </button>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className={cn(
              'text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0',
              'w-5 h-5 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-50'
            )}
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}

// Prayer time notification component
export function PrayerNotification({
  prayerName,
  prayerNameArabic,
  time,
  timeLeft,
  showArabic = false,
  onClose,
  onSnooze
}: {
  prayerName: string;
  prayerNameArabic?: string;
  time: string;
  timeLeft?: string;
  showArabic?: boolean;
  onClose?: () => void;
  onSnooze?: () => void;
}) {
  return (
    <Notification
      type="prayer"
      title={`${showArabic && prayerNameArabic ? prayerNameArabic : prayerName} Prayer Time`}
      message={timeLeft ? `Starting in ${timeLeft}` : `Prayer time: ${time}`}
      titleArabic={prayerNameArabic ? `وقت صلاة ${prayerNameArabic}` : undefined}
      messageArabic={timeLeft ? `يبدأ في ${timeLeft}` : `وقت الصلاة: ${time}`}
      showArabic={showArabic}
      duration={10000} // 10 seconds for prayer notifications
      onClose={onClose}
      action={onSnooze ? {
        label: 'Remind in 5 min',
        labelArabic: 'تذكيرني خلال ٥ دقائق',
        onClick: onSnooze
      } : undefined}
    />
  );
}

// Islamic event notification
export function IslamicEventNotification({
  eventName,
  eventNameArabic,
  eventType,
  showArabic = false,
  onClose,
  onViewDetails
}: {
  eventName: string;
  eventNameArabic?: string;
  eventType: 'eid' | 'ramadan' | 'hajj' | 'general';
  showArabic?: boolean;
  onClose?: () => void;
  onViewDetails?: () => void;
}) {
  const getEventIcon = (type: string) => {
    const iconMap = {
      eid: '🌙',
      ramadan: '🕌',
      hajj: '🕋',
      general: '📅'
    };
    return iconMap[type as keyof typeof iconMap] || '📅';
  };

  return (
    <Notification
      type="info"
      title={`${getEventIcon(eventType)} ${showArabic && eventNameArabic ? eventNameArabic : eventName}`}
      message="Islamic event notification"
      titleArabic={eventNameArabic ? `${getEventIcon(eventType)} ${eventNameArabic}` : undefined}
      messageArabic="إشعار الحدث الإسلامي"
      showArabic={showArabic}
      duration={8000}
      onClose={onClose}
      action={onViewDetails ? {
        label: 'View Details',
        labelArabic: 'عرض التفاصيل',
        onClick: onViewDetails
      } : undefined}
    />
  );
}

// Notification container for managing multiple notifications
export function NotificationContainer() {
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    component: React.ReactNode;
  }>>([]);

  const addNotification = (notification: React.ReactNode) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, component: notification }]);
    
    // Auto-remove after animation
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 6000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-2 pointer-events-none">
      {notifications.map((notification, index) => (
        <div 
          key={notification.id}
          className="pointer-events-auto"
          style={{ 
            transform: `translateY(${index * 8}px)`,
            zIndex: 50 - index 
          }}
        >
          {notification.component}
        </div>
      ))}
    </div>
  );
}