import { Clock, Compass, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DailyPrayerTimes } from '@/types';
import { cn } from '@/lib/utils';

interface PrayerTimesWidgetProps {
  prayerTimes: DailyPrayerTimes;
  className?: string;
  compact?: boolean;
  currentPrayer?: string;
}

export function PrayerTimesWidget({ 
  prayerTimes, 
  className, 
  compact = false,
  currentPrayer
}: PrayerTimesWidgetProps) {
  const prayers = [
    { 
      name: 'Fajr', 
      time: prayerTimes.fajr, 
      iqama: prayerTimes.iqama?.fajr,
      key: 'fajr' 
    },
    { 
      name: 'Sunrise', 
      time: prayerTimes.sunrise, 
      key: 'sunrise', 
      isShurooq: true 
    },
    { 
      name: 'Dhuhr', 
      time: prayerTimes.dhuhr, 
      iqama: prayerTimes.iqama?.dhuhr,
      key: 'dhuhr' 
    },
    { 
      name: 'Asr', 
      time: prayerTimes.asr, 
      iqama: prayerTimes.iqama?.asr,
      key: 'asr' 
    },
    { 
      name: 'Maghrib', 
      time: prayerTimes.maghrib, 
      iqama: prayerTimes.iqama?.maghrib,
      key: 'maghrib' 
    },
    { 
      name: 'Isha', 
      time: prayerTimes.isha, 
      iqama: prayerTimes.iqama?.isha,
      key: 'isha' 
    },
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (compact) {
    return (
      <Card className={cn('', className)}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-islamic-green-700">
              Today&apos;s Prayer Times
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2 text-sm">
            {prayers.filter(prayer => !prayer.isShurooq).map((prayer) => (
              <div 
                key={prayer.key}
                className={cn(
                  'flex justify-between rounded-md p-2',
                  currentPrayer === prayer.key 
                    ? 'bg-islamic-green-100 text-islamic-green-800' 
                    : 'bg-gray-50'
                )}
              >
                <span className="font-medium">{prayer.name}</span>
                <span className="prayer-time font-bold">{prayer.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('islamic-pattern bg-gradient-to-br from-white via-islamic-green-50/30 to-islamic-gold-50/20 shadow-lg hover:shadow-xl transition-all duration-500 border border-islamic-green/10', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-xl font-bold text-islamic-green-700">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Clock className="h-6 w-6" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-islamic-green-500 rounded-full animate-pulse"></div>
            </div>
            <span>Today&apos;s Prayer Times</span>
          </div>
          <Badge className="bg-islamic-green-100 text-islamic-green-700 border-islamic-green-200 hover:bg-islamic-green-200">
            Live
          </Badge>
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-islamic-navy-600 mt-2">
          <MapPin className="h-4 w-4" />
          <span className="font-medium">{formatDate(prayerTimes.date)}</span>
          <div className="w-2 h-0.5 bg-islamic-gold-400 rounded-full"></div>
          <span className="text-xs opacity-75">مواقيت الصلاة اليوم</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Clean mosque theme inspired prayer times grid */}
        <div className="space-y-2">
          {prayers.map((prayer, index) => (
            <div key={prayer.key} className="group">
              <div 
                className={cn(
                  'flex items-center justify-between rounded-xl p-4 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 border',
                  prayer.isShurooq 
                    ? 'bg-gradient-to-r from-orange-50 to-orange-100/50 border-orange-200 hover:border-orange-300' 
                    : currentPrayer === prayer.key
                    ? 'bg-gradient-to-r from-islamic-green-100 to-islamic-green-200/50 border-islamic-green-300 shadow-md shadow-islamic-green/10'
                    : 'bg-gradient-to-r from-white to-islamic-navy-50/30 border-gray-200 hover:border-islamic-green/30 hover:from-islamic-green-50/50'
                )}
              >
                {/* Prayer name and status */}
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-2 h-8 rounded-full',
                    prayer.isShurooq 
                      ? 'bg-orange-400' 
                      : currentPrayer === prayer.key
                      ? 'bg-islamic-green-500 shadow-sm shadow-islamic-green/30'
                      : 'bg-islamic-navy-300'
                  )}></div>
                  <div>
                    <span 
                      className={cn(
                        'font-bold text-lg',
                        prayer.isShurooq 
                          ? 'text-orange-700'
                          : currentPrayer === prayer.key
                          ? 'text-islamic-green-800'
                          : 'text-islamic-navy-700'
                      )}
                    >
                      {prayer.name}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      {prayer.isShurooq && (
                        <Badge variant="outline" className="text-xs border-orange-300 text-orange-700 bg-orange-50">
                          Shurooq
                        </Badge>
                      )}
                      {currentPrayer === prayer.key && !prayer.isShurooq && (
                        <Badge className="text-xs bg-islamic-green-600 shadow-sm animate-pulse">
                          Current Prayer
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Prayer times display - mosque theme clean layout */}
                <div className="text-right">
                  <div className="space-y-1">
                    {/* Adhan time */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 min-w-[45px] text-right">Adhan</span>
                      <span 
                        className={cn(
                          'prayer-time text-xl font-bold font-mono',
                          prayer.isShurooq 
                            ? 'text-orange-700'
                            : currentPrayer === prayer.key
                            ? 'text-islamic-green-700'
                            : 'text-islamic-navy-700'
                        )}
                      >
                        {prayer.time}
                      </span>
                    </div>
                    
                    {/* Iqama time if available */}
                    {prayer.iqama && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-islamic-green-600 min-w-[45px] text-right">Iqama</span>
                        <span 
                          className={cn(
                            'prayer-time text-lg font-bold font-mono',
                            currentPrayer === prayer.key
                              ? 'text-islamic-green-600'
                              : 'text-islamic-green-700'
                          )}
                        >
                          {prayer.iqama}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Subtle separator between prayers */}
              {index < prayers.length - 1 && (
                <div className="h-px bg-gradient-to-r from-transparent via-islamic-navy-200/50 to-transparent my-2"></div>
              )}
            </div>
          ))}
        </div>

        {/* Enhanced Jummah Prayer Times - Mosque Theme Style */}
        {prayerTimes.jummah && prayerTimes.jummah.length > 0 && (
          <>
            <div className="my-4">
              <div className="h-px bg-gradient-to-r from-transparent via-islamic-gold-300/50 to-transparent"></div>
            </div>
            <div className="rounded-xl bg-gradient-to-r from-islamic-gold-50 via-islamic-gold-100/50 to-islamic-gold-50 border border-islamic-gold-300 p-4 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-6 rounded-full bg-islamic-gold-500"></div>
                  <div>
                    <span className="font-bold text-lg text-islamic-gold-800">
                      Jumu&apos;ah Prayer
                    </span>
                    <div className="text-xs text-islamic-gold-600 opacity-75">صلاة الجمعة</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {prayerTimes.jummah.map((time, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xs text-islamic-gold-600 mb-0.5">
                        {index === 0 ? '1st' : '2nd'} Khutbah
                      </div>
                      <span className="prayer-time text-xl font-bold font-mono text-islamic-gold-700 block">
                        {time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Enhanced Qibla Direction - Mosque Theme Style */}
        <div className="mt-4">
          <div className="h-px bg-gradient-to-r from-transparent via-islamic-navy-200/50 to-transparent mb-4"></div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-islamic-navy-50 via-white to-islamic-green-50/30 border border-islamic-navy-200 hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Compass className="h-6 w-6 text-islamic-navy-600" />
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-islamic-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="font-bold text-islamic-navy-700">Qibla Direction</span>
                <div className="text-xs text-islamic-navy-500 opacity-75">اتجاه القبلة</div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-islamic-navy-500 mb-0.5">Bearing</div>
              <span className="prayer-time text-2xl font-bold font-mono text-islamic-green-700">
                {prayerTimes.qibla}°
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}