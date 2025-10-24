'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { AgeTier } from '@attaqwa/shared';

interface AgeTierFilterProps {
  selectedTier?: AgeTier;
  onTierChange: (tier: AgeTier | undefined) => void;
  showStats?: boolean;
  contentCounts?: Record<AgeTier, number>;
  className?: string;
}

const AGE_TIER_CONFIG = {
  [AgeTier.CHILDREN]: {
    label: 'Children',
    description: 'Ages 5-12',
    icon: '👶',
    color: 'bg-blue-100 text-blue-800',
    borderColor: 'border-blue-200 hover:border-blue-300',
  },
  [AgeTier.YOUTH]: {
    label: 'Youth',
    description: 'Ages 13-17',
    icon: '🧑',
    color: 'bg-green-100 text-green-800',
    borderColor: 'border-green-200 hover:border-green-300',
  },
  [AgeTier.ADULTS]: {
    label: 'Adults',
    description: 'Ages 18+',
    icon: '👨',
    color: 'bg-purple-100 text-purple-800',
    borderColor: 'border-purple-200 hover:border-purple-300',
  },
  [AgeTier.SENIORS]: {
    label: 'Seniors',
    description: 'Ages 60+',
    icon: '👴',
    color: 'bg-orange-100 text-orange-800',
    borderColor: 'border-orange-200 hover:border-orange-300',
  },
  [AgeTier.ALL_AGES]: {
    label: 'All Ages',
    description: 'Suitable for everyone',
    icon: '👥',
    color: 'bg-gray-100 text-gray-800',
    borderColor: 'border-gray-200 hover:border-gray-300',
  },
};

export function AgeTierFilter({
  selectedTier,
  onTierChange,
  showStats = false,
  contentCounts,
  className,
}: AgeTierFilterProps) {
  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-islamic-green-700">
          Filter by Age Group
        </CardTitle>
        {selectedTier && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Currently showing:</span>
            <Badge variant="secondary" className={AGE_TIER_CONFIG[selectedTier].color}>
              {AGE_TIER_CONFIG[selectedTier].icon} {AGE_TIER_CONFIG[selectedTier].label}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTierChange(undefined)}
              className="h-6 px-2 text-xs"
            >
              Clear
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Object.entries(AGE_TIER_CONFIG).map(([tier, config]) => {
            const tierKey = tier as AgeTier;
            const isSelected = selectedTier === tierKey;
            const count = contentCounts?.[tierKey] || 0;

            return (
              <button
                key={tier}
                onClick={() => onTierChange(isSelected ? undefined : tierKey)}
                className={cn(
                  'p-4 rounded-lg border-2 transition-all duration-200 text-left',
                  'hover:shadow-md hover:scale-105',
                  isSelected
                    ? 'border-islamic-green-500 bg-islamic-green-50 shadow-md scale-105'
                    : config.borderColor,
                  'focus:outline-none focus:ring-2 focus:ring-islamic-green-500 focus:ring-offset-2'
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{config.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {config.label}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {config.description}
                      </p>
                    </div>
                  </div>
                  {showStats && (
                    <Badge
                      variant="outline"
                      className={cn(
                        'ml-2 text-xs',
                        isSelected && 'border-islamic-green-500 text-islamic-green-700'
                      )}
                    >
                      {count}
                    </Badge>
                  )}
                </div>

                {/* Islamic Education Guidance for Each Age Group */}
                <div className="mt-3 text-xs text-gray-500">
                  {tier === AgeTier.CHILDREN && (
                    <span>Basic Islamic stories, prayers, and moral values</span>
                  )}
                  {tier === AgeTier.YOUTH && (
                    <span>Islamic identity, contemporary issues, and guidance</span>
                  )}
                  {tier === AgeTier.ADULTS && (
                    <span>In-depth Islamic knowledge and practical application</span>
                  )}
                  {tier === AgeTier.SENIORS && (
                    <span>Wisdom, reflection, and life experience sharing</span>
                  )}
                  {tier === AgeTier.ALL_AGES && (
                    <span>Universal Islamic teachings for the whole family</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Age-Appropriate Content Guidelines */}
        <div className="mt-6 p-4 bg-islamic-green-50 rounded-lg border border-islamic-green-200">
          <h4 className="font-semibold text-islamic-green-800 mb-2">
            🌟 Age-Appropriate Islamic Education
          </h4>
          <p className="text-sm text-islamic-green-700">
            Our content is carefully curated to match Islamic educational principles and 
            developmental stages. Each age group receives content that is both engaging 
            and appropriate for their level of understanding and spiritual growth.
          </p>
        </div>

        {selectedTier && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h5 className="font-medium text-blue-800 mb-1">
              Learning Focus for {AGE_TIER_CONFIG[selectedTier].label}
            </h5>
            <p className="text-sm text-blue-700">
              {selectedTier === AgeTier.CHILDREN && (
                <>
                  Focus on foundational Islamic concepts through stories, interactive 
                  activities, and simple prayers. Content emphasizes love for Allah, 
                  Prophet Muhammad (ﷺ), and basic Islamic manners.
                </>
              )}
              {selectedTier === AgeTier.YOUTH && (
                <>
                  Addresses questions about Islamic identity, peer pressure, and 
                  contemporary challenges. Includes guidance on worship, relationships, 
                  and preparing for adult responsibilities.
                </>
              )}
              {selectedTier === AgeTier.ADULTS && (
                <>
                  Comprehensive Islamic education covering jurisprudence, theology, 
                  family life, career guidance, and community responsibilities from 
                  an Islamic perspective.
                </>
              )}
              {selectedTier === AgeTier.SENIORS && (
                <>
                  Wisdom-focused content on reflection, legacy, preparing for the 
                  hereafter, and sharing life experiences with younger generations.
                </>
              )}
              {selectedTier === AgeTier.ALL_AGES && (
                <>
                  Family-friendly content that can be enjoyed and learned from by 
                  all family members together, promoting Islamic family bonding.
                </>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Component for displaying age tier badge
export function AgeTierBadge({ 
  tier, 
  showDescription = false,
  className 
}: { 
  tier: AgeTier; 
  showDescription?: boolean;
  className?: string;
}) {
  const config = AGE_TIER_CONFIG[tier];

  return (
    <Badge 
      variant="secondary" 
      className={cn(config.color, className)}
    >
      <span className="mr-1">{config.icon}</span>
      {config.label}
      {showDescription && (
        <span className="ml-1 text-xs opacity-75">
          ({config.description})
        </span>
      )}
    </Badge>
  );
}

// Hook for age tier filtering logic
export function useAgeTierFilter() {
  const [selectedTier, setSelectedTier] = React.useState<AgeTier | undefined>();

  const filterContentByAge = React.useCallback((content: any[]) => {
    if (!selectedTier) return content;
    
    return content.filter(item => 
      item.ageTier === selectedTier || item.ageTier === AgeTier.ALL_AGES
    );
  }, [selectedTier]);

  const getRecommendedTier = React.useCallback((userAge?: number): AgeTier => {
    if (!userAge) return AgeTier.ALL_AGES;
    
    if (userAge <= 12) return AgeTier.CHILDREN;
    if (userAge <= 17) return AgeTier.YOUTH;
    if (userAge <= 59) return AgeTier.ADULTS;
    return AgeTier.SENIORS;
  }, []);

  return {
    selectedTier,
    setSelectedTier,
    filterContentByAge,
    getRecommendedTier,
    clearFilter: () => setSelectedTier(undefined),
  };
}