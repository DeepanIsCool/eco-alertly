
import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import Navigation from '@/components/layout/Navigation';
import { AlertTriangle, Loader2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useGeolocation } from '@/hooks/use-geolocation';
import { getAirQuality } from '@/services/airQualityService';
import AirQualityCard from '@/components/dashboard/AirQualityCard';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';

// Fix for default marker icon in Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Create custom marker icon
const customIcon = new Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

// Component to recenter map when location changes
const RecenterMapView = ({ coords }: { coords: [number, number] | null }) => {
  const map = useMap();
  
  useEffect(() => {
    if (coords) {
      map.setView(coords, map.getZoom());
    }
  }, [coords, map]);
  
  return null;
};

const Map = () => {
  const [showAlerts, setShowAlerts] = useState(false);
  const [airQuality, setAirQuality] = useState<any>(null);
  const { location, loading: locationLoading, error: locationError } = useGeolocation();
  
  // Default position (will be updated when location is available)
  const [position, setPosition] = useState<[number, number] | null>(null);
  
  // Load air quality data when location is available
  useEffect(() => {
    if (location?.coordinates) {
      fetchAirQuality();
      setPosition([location.coordinates.latitude, location.coordinates.longitude]);
      
      // Show location information in a toast
      toast.info(
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <div>
            <div className="font-medium">Location detected</div>
            <div className="text-sm text-muted-foreground">{location.name}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {location.coordinates.latitude.toFixed(6)}, {location.coordinates.longitude.toFixed(6)}
            </div>
          </div>
        </div>
      );
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
          <div className="relative rounded-xl overflow-hidden h-[350px] animate-fade-in mx-auto">
            {locationLoading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground">
                <Loader2 className="w-12 h-12 mb-4 animate-spin" />
                <p className="text-sm">Getting your location...</p>
              </div>
            ) : locationError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground">
                <AlertTriangle className="w-12 h-12 mb-4" />
                <p className="text-sm text-center px-4">
                  Unable to access your location.<br />
                  Please enable location services to see your area map.
                </p>
              </div>
            ) : (
              position && (
                <MapContainer 
                  center={position} 
                  zoom={13} 
                  scrollWheelZoom={true}
                  style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
                  attributionControl={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={position} icon={customIcon}>
                    <Popup>
                      You are here<br/>
                      {location?.name || 'Current Location'}
                    </Popup>
                  </Marker>
                  <RecenterMapView coords={position} />
                </MapContainer>
              )
            )}
            
            <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg p-3 flex items-center gap-2 z-[1000]">
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
