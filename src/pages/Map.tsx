
import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import Navigation from '@/components/layout/Navigation';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useGeolocation } from '@/hooks/use-geolocation';
import { getAirQuality } from '@/services/airQualityService';
import AirQualityCard from '@/components/dashboard/AirQualityCard';

const Map = () => {
  const [loading, setLoading] = useState(true);
  const [showAlerts, setShowAlerts] = useState(false);
  const [airQuality, setAirQuality] = useState<any>(null);
  const { location, loading: locationLoading, error: locationError } = useGeolocation();
  const [mapImageUrl, setMapImageUrl] = useState<string | null>(null);
  
  // Load air quality data when location is available
  useEffect(() => {
    if (location?.coordinates) {
      fetchAirQuality();
      loadMapForLocation(location.coordinates.latitude, location.coordinates.longitude);
    }
  }, [location]);

  const fetchAirQuality = async () => {
    if (!location?.coordinates) return;
    
    try {
      const data = await getAirQuality(
        location.coordinates.latitude,
        location.coordinates.longitude
      );
      setAirQuality(data);
    } catch (error) {
      console.error('Error fetching air quality:', error);
      toast.error('Failed to fetch air quality data');
    }
  };

  const loadMapForLocation = async (latitude: number, longitude: number) => {
    setLoading(true);
    
    try {
      // Revoke previous object URL if it exists to prevent memory leaks
      if (mapImageUrl && mapImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(mapImageUrl);
      }
      
      // Convert lat/long to tile coordinates using Web Mercator projection
      const zoom = 12; // Higher zoom level for better detail
      const n = Math.pow(2, zoom);
      const x = Math.floor((longitude + 180) / 360 * n);
      const latRad = latitude * Math.PI / 180;
      const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n);
      
      const url = `https://maptiles.p.rapidapi.com/es/map/v1/${zoom}/${x}/${y}.png`;
      const options = {
        method: 'GET',
        headers: {
          'x-rapidapi-key': '297c2d5a7fmsh3b80b8d10389ff1p102ab1jsnc34fcd6334a7',
          'x-rapidapi-host': 'maptiles.p.rapidapi.com'
        }
      };

      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error('Failed to load map tile');
      }
      
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      
      // Update the state with the new image URL
      setMapImageUrl(imageUrl);
      setLoading(false);
    } catch (error) {
      console.error('Error loading map:', error);
      toast.error('Failed to load map tile');
      setLoading(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapImageUrl && mapImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(mapImageUrl);
      }
    };
  }, [mapImageUrl]);

  const toggleEnvironmentalAlerts = () => {
    setShowAlerts(!showAlerts);
    
    if (!showAlerts && !airQuality) {
      fetchAirQuality();
    }
  };

  return (
    <>
      <Header title="Map View" />
      
      <PageTransition className="pb-20">
        <div className="eco-container space-y-6">
          {/* Map container - smaller size */}
          <div className="relative bg-muted rounded-xl overflow-hidden h-[350px] animate-fade-in mx-auto">
            <div className="absolute inset-0 bg-muted-foreground/10">
              {mapImageUrl && !loading && (
                <img 
                  src={mapImageUrl} 
                  alt="Map tile" 
                  className="w-full h-full object-cover"
                />
              )}
              
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                  <Loader2 className="w-12 h-12 mb-4 animate-spin" />
                  <p className="text-sm">Loading map...</p>
                </div>
              )}
              
              {locationError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                  <AlertTriangle className="w-12 h-12 mb-4" />
                  <p className="text-sm text-center px-4">
                    Unable to access your location.<br />
                    Please enable location services to see your area map.
                  </p>
                </div>
              )}
            </div>
            
            <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg p-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-eco-green"></div>
              <span className="text-xs">Good</span>
              
              <div className="w-3 h-3 rounded-full bg-status-investigating ml-2"></div>
              <span className="text-xs">Moderate</span>
              
              <div className="w-3 h-3 rounded-full bg-status-critical ml-2"></div>
              <span className="text-xs">Critical</span>
            </div>
          </div>
          
          {/* Environmental Alerts Section */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Button 
              className="w-full py-3 rounded-xl"
              variant="secondary" 
              onClick={toggleEnvironmentalAlerts}
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              {showAlerts ? 'Hide Environmental Alerts' : 'Show Environmental Alerts'}
            </Button>
            
            {showAlerts && (
              <div className="mt-4 animate-slide-up">
                {locationLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                  </div>
                ) : locationError ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Unable to access your location.</p>
                    <p className="text-sm">Please enable location services to see environmental alerts.</p>
                  </div>
                ) : (
                  <AirQualityCard 
                    airQuality={airQuality}
                    location={location?.name}
                    isLoading={!airQuality}
                    onRefresh={fetchAirQuality}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </PageTransition>
      
      <Navigation />
    </>
  );
};

export default Map;
