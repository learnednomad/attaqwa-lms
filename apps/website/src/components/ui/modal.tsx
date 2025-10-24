'use client';

import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  titleArabic?: string;
  showArabic?: boolean;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'premium' | 'prayer' | 'success' | 'warning' | 'error';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  actions?: Array<{
    label: string;
    labelArabic?: string;
    onClick: () => void;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
    disabled?: boolean;
  }>;
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  titleArabic,
  showArabic = false,
  children,
  size = 'md',
  variant = 'default',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  actions,
  className
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && closeOnEscape) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, closeOnEscape, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'max-w-md';
      case 'md':
        return 'max-w-lg';
      case 'lg':
        return 'max-w-2xl';
      case 'xl':
        return 'max-w-4xl';
      case 'full':
        return 'max-w-7xl mx-4';
      default:
        return 'max-w-lg';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'premium':
        return {
          headerBg: 'bg-gradient-to-r from-green-50 to-blue-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600',
          titleColor: 'text-green-800'
        };
      case 'prayer':
        return {
          headerBg: 'bg-gradient-to-r from-green-100 to-yellow-50',
          borderColor: 'border-green-300',
          iconColor: 'text-green-700',
          titleColor: 'text-green-900'
        };
      case 'success':
        return {
          headerBg: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600',
          titleColor: 'text-green-800'
        };
      case 'warning':
        return {
          headerBg: 'bg-amber-50',
          borderColor: 'border-amber-200',
          iconColor: 'text-amber-600',
          titleColor: 'text-amber-800'
        };
      case 'error':
        return {
          headerBg: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600',
          titleColor: 'text-red-800'
        };
      default:
        return {
          headerBg: 'bg-gray-50',
          borderColor: 'border-gray-200',
          iconColor: 'text-gray-600',
          titleColor: 'text-gray-800'
        };
    }
  };

  const getVariantIcon = () => {
    switch (variant) {
      case 'premium':
        return '✨';
      case 'prayer':
        return '🕌';
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return null;
    }
  };

  const styles = getVariantStyles();
  const icon = getVariantIcon();

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const getButtonVariant = (actionVariant?: string) => {
    switch (actionVariant) {
      case 'primary':
        return 'default';
      case 'success':
        return 'default';
      case 'warning':
        return 'outline';
      case 'error':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getButtonClassName = (actionVariant?: string) => {
    switch (actionVariant) {
      case 'primary':
        return 'btn-islamic';
      case 'success':
        return 'bg-green-600 hover:bg-green-700 text-white';
      case 'warning':
        return 'border-amber-300 text-amber-700 hover:bg-amber-50';
      case 'error':
        return 'border-red-300 text-red-700 hover:bg-red-50';
      default:
        return '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={cn(
          'relative w-full bg-white rounded-xl shadow-2xl transform transition-all duration-300',
          'scale-100 opacity-100', // Animation classes - could be controlled by state
          getSizeClasses(),
          variant === 'premium' && 'card-premium border-0',
          styles.borderColor,
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
      >
        {/* Header */}
        <div className={cn(
          'flex items-center justify-between p-6 rounded-t-xl border-b',
          styles.headerBg,
          styles.borderColor
        )}>
          <div className="flex items-center space-x-3">
            {icon && (
              <span className={cn('text-xl', styles.iconColor)}>
                {icon}
              </span>
            )}
            <div>
              <h2 
                id="modal-title"
                className={cn('text-xl font-semibold', styles.titleColor)}
              >
                {showArabic && titleArabic ? titleArabic : title}
              </h2>
              {showArabic && titleArabic && title !== titleArabic && (
                <p className="text-sm text-gray-600 mt-1">{title}</p>
              )}
            </div>
          </div>

          {showCloseButton && (
            <button
              onClick={onClose}
              className={cn(
                'p-2 rounded-full transition-colors',
                'hover:bg-white hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-green-500',
                styles.iconColor
              )}
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {children}
        </div>

        {/* Actions */}
        {actions && actions.length > 0 && (
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            {actions.map((action, index) => (
              <Button
                key={index}
                onClick={action.onClick}
                disabled={action.disabled}
                variant={getButtonVariant(action.variant)}
                className={cn(
                  'min-w-20',
                  getButtonClassName(action.variant)
                )}
              >
                {showArabic && action.labelArabic ? action.labelArabic : action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Confirmation dialog
export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  titleArabic,
  messageArabic,
  showArabic = false,
  confirmLabel = 'Confirm',
  confirmLabelArabic = 'تأكيد',
  cancelLabel = 'Cancel',
  cancelLabelArabic = 'إلغاء',
  variant = 'warning'
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  titleArabic?: string;
  messageArabic?: string;
  showArabic?: boolean;
  confirmLabel?: string;
  confirmLabelArabic?: string;
  cancelLabel?: string;
  cancelLabelArabic?: string;
  variant?: 'warning' | 'error' | 'success';
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      titleArabic={titleArabic}
      showArabic={showArabic}
      size="sm"
      variant={variant}
      actions={[
        {
          label: cancelLabel,
          labelArabic: cancelLabelArabic,
          onClick: onClose,
          variant: 'default'
        },
        {
          label: confirmLabel,
          labelArabic: confirmLabelArabic,
          onClick: () => {
            onConfirm();
            onClose();
          },
          variant: variant === 'error' ? 'error' : 'primary'
        }
      ]}
    >
      <p className="text-gray-700">
        {showArabic && messageArabic ? messageArabic : message}
      </p>
      {showArabic && messageArabic && message !== messageArabic && (
        <p className="text-sm text-gray-500 mt-2">{message}</p>
      )}
    </Modal>
  );
}

// Prayer time modal
export function PrayerTimeModal({
  isOpen,
  onClose,
  prayerName,
  prayerNameArabic,
  prayerTime,
  qiblaDirection,
  showArabic = false,
  onSetReminder
}: {
  isOpen: boolean;
  onClose: () => void;
  prayerName: string;
  prayerNameArabic?: string;
  prayerTime: string;
  qiblaDirection?: number;
  showArabic?: boolean;
  onSetReminder?: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${showArabic && prayerNameArabic ? prayerNameArabic : prayerName} Prayer`}
      titleArabic={prayerNameArabic ? `صلاة ${prayerNameArabic}` : undefined}
      showArabic={showArabic}
      variant="prayer"
      size="md"
      actions={[
        ...(onSetReminder ? [{
          label: 'Set Reminder',
          labelArabic: 'تعيين تذكير',
          onClick: onSetReminder,
          variant: 'primary' as const
        }] : []),
        {
          label: 'Close',
          labelArabic: 'إغلاق',
          onClick: onClose,
          variant: 'default' as const
        }
      ]}
    >
      <div className="space-y-4">
        <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
          <div className="text-3xl mb-2">🕌</div>
          <div className="text-2xl font-semibold text-green-700 mb-1">
            {prayerTime}
          </div>
          <div className="text-sm text-gray-600">
            {showArabic ? 'وقت الصلاة' : 'Prayer Time'}
          </div>
        </div>

        {qiblaDirection && (
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">🧭</span>
                <span className="font-medium text-yellow-800">
                  {showArabic ? 'اتجاه القبلة' : 'Qibla Direction'}
                </span>
              </div>
              <span className="text-lg font-semibold text-yellow-700">
                {qiblaDirection}°
              </span>
            </div>
          </div>
        )}

        <div className="text-sm text-gray-600 text-center">
          {showArabic 
            ? 'اللهم أعني على ذكرك وشكرك وحسن عبادتك'
            : 'May Allah help us in remembering Him, thanking Him, and worshiping Him well'
          }
        </div>
      </div>
    </Modal>
  );
}