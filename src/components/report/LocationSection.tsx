
import React from 'react';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';

interface LocationSectionProps {
  location: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLocationDetected: boolean;
}

const LocationSection: React.FC<LocationSectionProps> = ({
  location,
  onChange,
  isLocationDetected
}) => {
  return (
    <div className="rounded-xl border border-border p-4 bg-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-medium">Location</h2>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="location" className="text-sm font-medium">
          Current Location
        </label>
        <Input 
          id="location"
          name="location"
          value={location}
          onChange={onChange}
          disabled={isLocationDetected}
          className={isLocationDetected ? "bg-muted" : ""}
        />
        <p className="text-xs text-muted-foreground">
          {isLocationDetected ? "Location automatically detected" : "Please allow location access"}
        </p>
      </div>
    </div>
  );
};

export default LocationSection;
