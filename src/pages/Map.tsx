
import React, { useEffect, useRef, useState } from 'react';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import Navigation from '@/components/layout/Navigation';
import { MapPin, AlertTriangle, Loader2 } from 'lucide-react';
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
  
  const [mapConfig, setMapConfig] = useState({
    zoom: 3,
    centerX: 2,
    centerY: 2
  });

  // Load air quality data when location is available
  useEffect(() => {
    if (location?.coordinates) {
      fetchAirQuality();
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

  const loadMapTile = async () => {
    setLoading(true);
    
    try {
      // Revoke previous object URL if it exists to prevent memory leaks
      if (mapImageUrl && mapImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(mapImageUrl);
      }
      
      const { zoom, centerX, centerY } = mapConfig;
      const url = `https://maptiles.p.rapidapi.com/es/map/v1/${zoom}/${centerX}/${centerY}.png`;
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

  // Load map tile when component mounts or config changes
  useEffect(() => {
    loadMapTile();
    
    // Cleanup object URLs when component unmounts or when config changes
    return () => {
      if (mapImageUrl && mapImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(mapImageUrl);
      }
    };
  }, [mapConfig]);

  // Navigation controls
  const moveMap = (direction: 'up' | 'down' | 'left' | 'right') => {
    setMapConfig(prev => {
      const newConfig = { ...prev };
      
      switch (direction) {
        case 'up':
          newConfig.centerY = Math.max(0, prev.centerY - 1);
          break;
        case 'down':
          newConfig.centerY = prev.centerY + 1;
          break;
        case 'left':
          newConfig.centerX = Math.max(0, prev.centerX - 1);
          break;
        case 'right':
          newConfig.centerX = prev.centerX + 1;
          break;
      }
      
      return newConfig;
    });
  };

  const adjustZoom = (delta: number) => {
    setMapConfig(prev => ({
      ...prev,
      zoom: Math.min(Math.max(1, prev.zoom + delta), 6)
    }));
  };

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
          <div className="relative bg-muted rounded-xl overflow-hidden h-[calc(100vh-220px)] min-h-[400px] animate-fade-in">
            {/* Map container */}
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
                  <p className="text-sm">Loading map tiles...</p>
                </div>
              )}
            </div>
            
            {/* Map navigation controls */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg p-2">
              <Button variant="outline" size="icon" onClick={() => moveMap('up')}>
                <span className="sr-only">Pan up</span>
                <span className="block rotate-180">↓</span>
              </Button>
              
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => moveMap('left')}>
                  <span className="sr-only">Pan left</span>
                  <span className="block rotate-180">→</span>
                </Button>
                <Button variant="outline" size="icon" onClick={() => moveMap('right')}>
                  <span className="sr-only">Pan right</span>
                  <span>→</span>
                </Button>
              </div>
              
              <Button variant="outline" size="icon" onClick={() => moveMap('down')}>
                <span className="sr-only">Pan down</span>
                <span>↓</span>
              </Button>
              
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="icon" onClick={() => adjustZoom(-1)}>
                  <span className="sr-only">Zoom out</span>
                  <span>-</span>
                </Button>
                <Button variant="outline" size="icon" onClick={() => adjustZoom(1)}>
                  <span className="sr-only">Zoom in</span>
                  <span>+</span>
                </Button>
              </div>
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
