'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Compass, MapPin, Navigation, Info, ChevronRight } from 'lucide-react';
import { calculateQiblaDirection } from '@/lib/services/islamic-api';

interface QiblahData {
  latitude: number;
  longitude: number;
  qibla: {
    direction: number;
    compass: number;
  };
}

export default function QiblaDirectionPage() {
  const [qiblaData, setQiblaData] = useState<QiblahData | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [compassHeading, setCompassHeading] = useState(0);
  const [locationName, setLocationName] = useState('Your Location');

  useEffect(() => {
    getUserLocation();
    // Try to get compass heading if available
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleCompass);
    }
    return () => {
      window.removeEventListener('deviceorientation', handleCompass);
    };
  }, []);

  const getUserLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation({ lat, lng });
          
          // Calculate Qibla
          const qibla = await calculateQiblaDirection(lat, lng);
          setQiblaData(qibla);
          
          // Try to get location name
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
            );
            const data = await response.json();
            if (data.address) {
              const city = data.address.city || data.address.town || data.address.village;
              const country = data.address.country;
              setLocationName(`${city}, ${country}`);
            }
          } catch (err) {
            console.error('Error getting location name:', err);
          }
          
          setLoading(false);
          setError(null);
        },
        (err) => {
          setError('Unable to get your location. Please enable location services.');
          setLoading(false);
          // Use default location (Mecca)
          setDefaultLocation();
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      setDefaultLocation();
    }
  };

  const setDefaultLocation = async () => {
    // Default to New York
    const lat = 40.7128;
    const lng = -74.0060;
    setUserLocation({ lat, lng });
    const qibla = await calculateQiblaDirection(lat, lng);
    setQiblaData(qibla);
    setLocationName('New York, USA (Default)');
  };

  const handleCompass = (event: DeviceOrientationEvent) => {
    if (event.alpha !== null) {
      setCompassHeading(360 - event.alpha);
    }
  };

  const getQiblaRotation = () => {
    if (!qiblaData) return 0;
    return qiblaData.qibla.compass - compassHeading;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-islamic-green-50 via-white to-islamic-gold-50/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-islamic-navy-800 mb-4">
            🧭 Qibla Direction
          </h1>
          <p className="text-xl text-islamic-navy-600 max-w-3xl mx-auto">
            Find the accurate direction to the Holy Kaaba in Makkah for your prayers
          </p>
        </div>

        {loading ? (
          <Card className="mb-12">
            <CardContent className="py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-islamic-green-600 mx-auto"></div>
                <p className="mt-4 text-islamic-navy-600">Detecting your location...</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Main Qibla Compass */}
            <Card className="mb-12 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-islamic-green-500 to-islamic-green-600 text-white">
                <CardTitle className="text-2xl text-white flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Compass className="w-6 h-6" />
                    Qibla Compass
                  </span>
                  <Badge className="bg-white/20 text-white border-white/30">
                    {locationName}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-white/90">
                  Point your device towards the Kaaba
                </CardDescription>
              </CardHeader>
              <CardContent className="py-12">
                <div className="flex flex-col items-center space-y-8">
                  {/* Compass Display */}
                  <div className="relative w-64 h-64 md:w-80 md:h-80">
                    {/* Outer Circle */}
                    <div className="absolute inset-0 rounded-full border-4 border-islamic-green-200 bg-white shadow-lg">
                      {/* Compass Directions */}
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-islamic-green-600">
                        N
                      </div>
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-2xl font-bold text-gray-400">
                        S
                      </div>
                      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-gray-400">
                        W
                      </div>
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-2xl font-bold text-gray-400">
                        E
                      </div>
                    </div>

                    {/* Qibla Arrow */}
                    <div 
                      className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
                      style={{ transform: `rotate(${qiblaData?.qibla.compass || 0}deg)` }}
                    >
                      <div className="relative">
                        <div className="w-2 h-32 bg-gradient-to-t from-islamic-green-600 to-islamic-gold-500 rounded-full">
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                            <Navigation className="w-6 h-6 text-islamic-gold-600 fill-islamic-gold-600" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Center Kaaba Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-islamic-navy-800 rounded-lg flex items-center justify-center text-white text-2xl shadow-lg">
                        🕋
                      </div>
                    </div>
                  </div>

                  {/* Direction Info */}
                  {qiblaData && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl">
                      <Card className="bg-islamic-green-50 border-islamic-green-200">
                        <CardContent className="py-4">
                          <div className="text-center">
                            <p className="text-sm text-islamic-navy-600 mb-1">Qibla Direction</p>
                            <p className="text-2xl font-bold text-islamic-green-600">
                              {Math.round(qiblaData.qibla.compass)}°
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-islamic-gold-50 border-islamic-gold-200">
                        <CardContent className="py-4">
                          <div className="text-center">
                            <p className="text-sm text-islamic-navy-600 mb-1">Your Location</p>
                            <p className="text-lg font-semibold text-islamic-gold-600">
                              {userLocation ? `${userLocation.lat.toFixed(2)}, ${userLocation.lng.toFixed(2)}` : 'Unknown'}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-islamic-navy-50 border-islamic-navy-200">
                        <CardContent className="py-4">
                          <div className="text-center">
                            <p className="text-sm text-islamic-navy-600 mb-1">Distance to Kaaba</p>
                            <p className="text-2xl font-bold text-islamic-navy-700">
                              {calculateDistance(userLocation)} km
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">How to Use</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-islamic-green-100 flex items-center justify-center text-islamic-green-600 font-semibold text-sm">
                      1
                    </div>
                    <p className="text-sm text-islamic-navy-600">
                      Allow location access when prompted for accurate direction
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-islamic-green-100 flex items-center justify-center text-islamic-green-600 font-semibold text-sm">
                      2
                    </div>
                    <p className="text-sm text-islamic-navy-600">
                      Hold your device flat and parallel to the ground
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-islamic-green-100 flex items-center justify-center text-islamic-green-600 font-semibold text-sm">
                      3
                    </div>
                    <p className="text-sm text-islamic-navy-600">
                      Turn yourself until the arrow points to the Kaaba icon
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-islamic-green-100 flex items-center justify-center text-islamic-green-600 font-semibold text-sm">
                      4
                    </div>
                    <p className="text-sm text-islamic-navy-600">
                      You are now facing the Qibla direction for prayer
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Important Notes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-islamic-gold-600 mt-0.5" />
                    <p className="text-sm text-islamic-navy-600">
                      The calculation uses the Great Circle method for maximum accuracy
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-islamic-gold-600 mt-0.5" />
                    <p className="text-sm text-islamic-navy-600">
                      Keep device away from magnetic interference for best results
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-islamic-gold-600 mt-0.5" />
                    <p className="text-sm text-islamic-navy-600">
                      Compass may not work properly indoors or near metal objects
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-islamic-gold-600 mt-0.5" />
                    <p className="text-sm text-islamic-navy-600">
                      For prayers, slight deviation is acceptable if exact direction is difficult
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Prayer Times Integration */}
            <Card className="bg-islamic-green-50 border-islamic-green-200">
              <CardHeader>
                <CardTitle className="text-xl">Related Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <a href="/prayer-times" className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-islamic-green-100 rounded-lg flex items-center justify-center">
                        🕌
                      </div>
                      <span className="font-medium text-islamic-navy-700">Prayer Times</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-islamic-green-600" />
                  </a>
                  
                  <a href="/resources/quran-study" className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-islamic-green-100 rounded-lg flex items-center justify-center">
                        📖
                      </div>
                      <span className="font-medium text-islamic-navy-700">Quran Study</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-islamic-green-600" />
                  </a>

                  <a href="/resources/islamic-calendar" className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-islamic-green-100 rounded-lg flex items-center justify-center">
                        📅
                      </div>
                      <span className="font-medium text-islamic-navy-700">Islamic Calendar</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-islamic-green-600" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

// Helper function to calculate distance to Kaaba
function calculateDistance(userLocation: { lat: number; lng: number } | null): number {
  if (!userLocation) return 0;
  
  const kaabaLat = 21.4225;
  const kaabaLng = 39.8262;
  
  const R = 6371; // Earth's radius in km
  const dLat = (kaabaLat - userLocation.lat) * Math.PI / 180;
  const dLng = (kaabaLng - userLocation.lng) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(kaabaLat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return Math.round(distance);
}