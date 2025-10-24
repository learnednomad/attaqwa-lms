'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface QiblaCompassProps {
  qiblaDirection: number;
  userLocation?: {
    latitude: number;
    longitude: number;
    city: string;
    country: string;
  };
  showAnimation?: boolean;
  variant?: 'default' | 'compact' | 'premium';
  className?: string;
}

export function QiblaCompass({
  qiblaDirection,
  userLocation,
  showAnimation = true,
  variant = 'default',
  className
}: QiblaCompassProps) {
  const [currentDirection, setCurrentDirection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceOrientation, setDeviceOrientation] = useState<number | null>(null);

  useEffect(() => {
    // Simulate loading compass
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Check for device orientation support
    if ('DeviceOrientationEvent' in window) {
      const handleOrientation = (event: DeviceOrientationEvent) => {
        if (event.alpha !== null) {
          setDeviceOrientation(event.alpha);
        }
      };

      window.addEventListener('deviceorientation', handleOrientation);
      return () => window.removeEventListener('deviceorientation', handleOrientation);
    }
  }, []);

  const compassSize = variant === 'compact' ? 120 : variant === 'premium' ? 200 : 160;
  const needleLength = compassSize * 0.35;
  const qiblaIndicatorLength = compassSize * 0.4;

  const getCardClassName = () => {
    const baseClasses = 'transition-all duration-300';
    
    switch (variant) {
      case 'premium':
        return cn('card-prayer-time', baseClasses, 'islamic-geometric-pattern', className);
      case 'compact':
        return cn('border border-border rounded-lg bg-card p-4', baseClasses, className);
      default:
        return cn('card-premium', baseClasses, className);
    }
  };

  const formatDirection = (direction: number): string => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(((direction % 360) + 360) % 360 / 45) % 8;
    return directions[index];
  };

  const getDistanceToKaaba = (): string => {
    if (!userLocation) return 'Unknown';
    
    // Simplified distance calculation (in reality, you'd use proper geolocation formulas)
    const kaabaLat = 21.4225;
    const kaabaLng = 39.8262;
    
    const R = 6371; // Earth's radius in km
    const dLat = (kaabaLat - userLocation.latitude) * Math.PI / 180;
    const dLng = (kaabaLng - userLocation.longitude) * Math.PI / 180;
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(userLocation.latitude * Math.PI / 180) * 
              Math.cos(kaabaLat * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance > 1000 
      ? `${Math.round(distance / 100) / 10}k km` 
      : `${Math.round(distance)} km`;
  };

  return (
    <Card className={getCardClassName()}>
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg font-semibold flex items-center justify-center gap-2">
          🧭 Qibla Compass
        </CardTitle>
        {userLocation && (
          <p className="text-sm text-muted-foreground">
            📍 {userLocation.city}, {userLocation.country}
          </p>
        )}
      </CardHeader>

      <CardContent className="flex flex-col items-center space-y-4">
        {/* Compass Container */}
        <div className="relative">
          {isLoading ? (
            <div className="flex items-center justify-center" style={{ width: compassSize, height: compassSize }}>
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <div className="relative">
              {/* Outer Compass Ring */}
              <svg 
                width={compassSize} 
                height={compassSize} 
                className="drop-shadow-lg"
                style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}
              >
                {/* Background Circle */}
                <circle
                  cx={compassSize / 2}
                  cy={compassSize / 2}
                  r={compassSize / 2 - 4}
                  fill="url(#compassGradient)"
                  stroke="hsl(var(--islamic-green-600))"
                  strokeWidth="3"
                />
                
                {/* Cardinal Direction Markers */}
                {[0, 90, 180, 270].map((angle, index) => {
                  const directions = ['N', 'E', 'S', 'W'];
                  const x1 = compassSize / 2 + Math.sin((angle * Math.PI) / 180) * (compassSize / 2 - 15);
                  const y1 = compassSize / 2 - Math.cos((angle * Math.PI) / 180) * (compassSize / 2 - 15);
                  const x2 = compassSize / 2 + Math.sin((angle * Math.PI) / 180) * (compassSize / 2 - 25);
                  const y2 = compassSize / 2 - Math.cos((angle * Math.PI) / 180) * (compassSize / 2 - 25);
                  
                  return (
                    <g key={angle}>
                      <line
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="hsl(var(--islamic-navy-700))"
                        strokeWidth="2"
                      />
                      <text
                        x={compassSize / 2 + Math.sin((angle * Math.PI) / 180) * (compassSize / 2 - 35)}
                        y={compassSize / 2 - Math.cos((angle * Math.PI) / 180) * (compassSize / 2 - 35) + 5}
                        textAnchor="middle"
                        className="text-sm font-bold"
                        fill="hsl(var(--islamic-navy-800))"
                      >
                        {directions[index]}
                      </text>
                    </g>
                  );
                })}

                {/* Minor Direction Markers */}
                {[45, 135, 225, 315].map((angle) => {
                  const x1 = compassSize / 2 + Math.sin((angle * Math.PI) / 180) * (compassSize / 2 - 15);
                  const y1 = compassSize / 2 - Math.cos((angle * Math.PI) / 180) * (compassSize / 2 - 15);
                  const x2 = compassSize / 2 + Math.sin((angle * Math.PI) / 180) * (compassSize / 2 - 20);
                  const y2 = compassSize / 2 - Math.cos((angle * Math.PI) / 180) * (compassSize / 2 - 20);
                  
                  return (
                    <line
                      key={angle}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="hsl(var(--islamic-navy-600))"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Qibla Direction Indicator */}
                <g
                  transform={`rotate(${qiblaDirection} ${compassSize / 2} ${compassSize / 2})`}
                  className={showAnimation ? 'transition-transform duration-500 ease-out' : ''}
                >
                  {/* Qibla Arrow */}
                  <line
                    x1={compassSize / 2}
                    y1={compassSize / 2}
                    x2={compassSize / 2}
                    y2={compassSize / 2 - qiblaIndicatorLength}
                    stroke="hsl(var(--islamic-gold-600))"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  {/* Arrow Head */}
                  <polygon
                    points={`${compassSize / 2},${compassSize / 2 - qiblaIndicatorLength} ${compassSize / 2 - 8},${compassSize / 2 - qiblaIndicatorLength + 15} ${compassSize / 2 + 8},${compassSize / 2 - qiblaIndicatorLength + 15}`}
                    fill="hsl(var(--islamic-gold-600))"
                  />
                  {/* Kaaba Icon */}
                  <text
                    x={compassSize / 2}
                    y={compassSize / 2 - qiblaIndicatorLength - 10}
                    textAnchor="middle"
                    className="text-lg"
                  >
                    🕋
                  </text>
                </g>

                {/* North Indicator */}
                {deviceOrientation !== null && (
                  <g
                    transform={`rotate(${-deviceOrientation} ${compassSize / 2} ${compassSize / 2})`}
                    className={showAnimation ? 'transition-transform duration-300' : ''}
                  >
                    <line
                      x1={compassSize / 2}
                      y1={compassSize / 2}
                      x2={compassSize / 2}
                      y2={compassSize / 2 - needleLength}
                      stroke="hsl(var(--destructive))"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <polygon
                      points={`${compassSize / 2},${compassSize / 2 - needleLength} ${compassSize / 2 - 6},${compassSize / 2 - needleLength + 12} ${compassSize / 2 + 6},${compassSize / 2 - needleLength + 12}`}
                      fill="hsl(var(--destructive))"
                    />
                  </g>
                )}

                {/* Center Dot */}
                <circle
                  cx={compassSize / 2}
                  cy={compassSize / 2}
                  r="4"
                  fill="hsl(var(--islamic-navy-800))"
                />

                {/* Gradient Definitions */}
                <defs>
                  <radialGradient id="compassGradient" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0%" stopColor="hsl(var(--background))" />
                    <stop offset="70%" stopColor="hsl(var(--islamic-green-50))" />
                    <stop offset="100%" stopColor="hsl(var(--islamic-green-100))" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
          )}
        </div>

        {/* Direction Info */}
        {!isLoading && (
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <span className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></span>
                <span className="font-medium">Qibla: {qiblaDirection}° {formatDirection(qiblaDirection)}</span>
              </div>
            </div>
            
            {userLocation && (
              <div className="text-xs text-muted-foreground">
                Distance to Kaaba: {getDistanceToKaaba()}
              </div>
            )}
            
            {deviceOrientation === null && (
              <div className="text-xs text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                💡 Allow device orientation for live compass
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}