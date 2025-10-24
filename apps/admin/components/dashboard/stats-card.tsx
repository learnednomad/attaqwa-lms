/**
 * Stats Card Component
 * Display key metrics with trend indicators
 */

import { TrendingDown, TrendingUp } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';
import { formatNumber } from '@/lib/utils/formatters';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  description?: string;
  iconClassName?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  trend,
  description,
  iconClassName,
}: StatsCardProps) {
  const formattedValue = typeof value === 'number' ? formatNumber(value) : value;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-charcoal-600">{title}</p>
            <p className="mt-2 text-3xl font-bold text-charcoal-900">
              {formattedValue}
            </p>
            {description && (
              <p className="mt-1 text-sm text-charcoal-500">{description}</p>
            )}
            {trend && (
              <div className="mt-3 flex items-center text-sm">
                {trend.isPositive ? (
                  <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="mr-1 h-4 w-4 text-red-600" />
                )}
                <span
                  className={cn(
                    'font-medium',
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {trend.value}%
                </span>
                <span className="ml-1 text-charcoal-500">
                  {trend.label || 'vs last month'}
                </span>
              </div>
            )}
          </div>
          <div
            className={cn(
              'rounded-lg bg-primary-100 p-3',
              iconClassName
            )}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
