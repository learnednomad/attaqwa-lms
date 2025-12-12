import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  viewAllHref: string;
  accentColor?: 'emerald' | 'amber';
}

export function SectionHeader({
  icon,
  title,
  subtitle,
  viewAllHref,
  accentColor = 'emerald',
}: SectionHeaderProps) {
  const colorClasses = {
    emerald: {
      iconBg: 'bg-emerald-50',
      iconText: 'text-emerald-600',
      link: 'text-emerald-600 hover:text-emerald-700',
    },
    amber: {
      iconBg: 'bg-amber-50',
      iconText: 'text-amber-600',
      link: 'text-amber-600 hover:text-amber-700',
    },
  };

  const colors = colorClasses[accentColor];

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className={cn('p-2.5 rounded-lg', colors.iconBg)}>
          <div className={cn('w-5 h-5', colors.iconText)}>{icon}</div>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
      </div>
      <Link
        href={viewAllHref}
        className={cn(
          'flex items-center gap-1.5 font-medium text-sm transition-colors',
          colors.link
        )}
      >
        View All
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
