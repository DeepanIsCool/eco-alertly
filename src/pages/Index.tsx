
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/layout/Header';
import ReportButton from '@/components/ui/ReportButton';
import AirQualityCard from '@/components/dashboard/AirQualityCard';
import ReportCard from '@/components/dashboard/ReportCard';
import { MapPin } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import Navigation from '@/components/layout/Navigation';
import { useGeolocation } from '@/hooks/use-geolocation';
import { getAirQuality } from '@/services/airQualityService';
import { getRecentReports } from '@/services/supabaseService';

const Index = () => {
  const { location, loading: locationLoading, error: locationError } = useGeolocation();
  
  // Fetch air quality data
  const { 
    data: airQuality, 
    isLoading: airQualityLoading 
  } = useQuery({
    queryKey: ['airQuality', location?.coordinates?.latitude, location?.coordinates?.longitude],
    queryFn: () => getAirQuality(
      location?.coordinates?.latitude || 0, 
      location?.coordinates?.longitude || 0
    ),
    enabled: !!location?.coordinates,
    refetchOnWindowFocus: false
  });
  
  // Fetch recent reports
  const { 
    data: reports, 
    isLoading: reportsLoading 
  } = useQuery({
    queryKey: ['reports'],
    queryFn: getRecentReports,
    refetchOnWindowFocus: false
  });
  
  return (
    <>
      <Header title="EcoAlert" />
      
      <PageTransition className="pb-20">
        <div className="eco-container space-y-6">
          {locationLoading ? (
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground animate-pulse animate-fade-in">
              <MapPin className="w-4 h-4" />
              <span>Detecting your location...</span>
            </div>
          ) : locationError ? (
            <div className="mb-4 flex items-center gap-2 text-sm text-destructive animate-fade-in">
              <MapPin className="w-4 h-4" />
              <span>Location access denied. Some features may be limited.</span>
            </div>
          ) : (
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <MapPin className="w-4 h-4" />
              <span>Current Location: {location?.name || 'Unknown'}</span>
            </div>
          )}
          
          <ReportButton className="animate-fade-in" style={{ animationDelay: '0.2s' }} />
          
          {airQualityLoading ? (
            <div className="eco-card h-40 animate-pulse animate-fade-in" style={{ animationDelay: '0.3s' }} />
          ) : (
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <AirQualityCard airQuality={airQuality!} />
            </div>
          )}
          
          <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-lg font-semibold">Recent Reports</h2>
            
            {reportsLoading ? (
              <div className="space-y-3">
                {[1, 2].map((_, index) => (
                  <div 
                    key={index} 
                    className="eco-card h-32 animate-pulse"
                    style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {reports?.map((report, index) => (
                  <ReportCard 
                    key={report.id} 
                    report={report} 
                    className="animate-fade-in"
                    style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </PageTransition>
      
      <Navigation />
    </>
  );
};

export default Index;
