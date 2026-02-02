import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Crumb {
  label: string;
  href?: string;
}

export function HadithBreadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-neutral-500">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3 w-3 text-neutral-300" />}
            {crumb.href && !isLast ? (
              <Link
                href={crumb.href}
                className="hover:text-emerald-600 transition-colors"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-neutral-900 font-medium' : ''}>
                {crumb.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
