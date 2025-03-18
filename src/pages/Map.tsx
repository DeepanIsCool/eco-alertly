
import React from 'react';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import Navigation from '@/components/layout/Navigation';
import { MapPin, AlertTriangle } from 'lucide-react';

const Map = () => {
  return (
    <>
      <Header title="Map View" />
      
      <PageTransition className="pb-20">
        <div className="eco-container space-y-6">
          <div className="relative bg-muted rounded-xl overflow-hidden h-[calc(100vh-220px)] min-h-[400px] animate-fade-in">
            <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
              <MapPin className="w-12 h-12 mb-4" />
              <h3 className="text-lg font-medium mb-2">Map View</h3>
              <p className="text-sm max-w-xs text-center">
                Interactive map will be displayed here with environmental hazard reports.
              </p>
            </div>
            
            <div className="absolute bottom-4 right-4 bg-background rounded-lg shadow-lg p-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-eco-green"></div>
              <span className="text-xs">Good</span>
              
              <div className="w-3 h-3 rounded-full bg-status-investigating ml-2"></div>
              <span className="text-xs">Moderate</span>
              
              <div className="w-3 h-3 rounded-full bg-status-critical ml-2"></div>
              <span className="text-xs">Critical</span>
            </div>
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <button className="w-full py-3 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center font-medium">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Show Environmental Alerts
            </button>
          </div>
        </div>
      </PageTransition>
      
      <Navigation />
    </>
  );
};

export default Map;
