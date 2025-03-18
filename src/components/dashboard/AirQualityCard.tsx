
import React from 'react';
import { cn } from '@/lib/utils';
import { AirQuality } from '@/types/report';
import { Droplets, MapPin, Thermometer, Wind } from 'lucide-react';

interface AirQualityCardProps {
  airQuality: AirQuality;
  location?: string;
  className?: string;
  style?: React.CSSProperties;
}

const AirQualityCard: React.FC<AirQualityCardProps> = ({ 
  airQuality, 
  location,
  className,
  style
}) => {
  const getQualityColor = (level: string) => {
    switch (level) {
      case 'Good': return 'text-eco-green';
      case 'Moderate': return 'text-status-investigating';
      case 'Unhealthy': 
      case 'Very Unhealthy':
      case 'Hazardous': return 'text-status-critical';
      default: return 'text-foreground';
    }
  };

  return (
    <div className={cn(
      "eco-card animate-enter eco-glow",
      className
    )} style={style}>
      {location && (
        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>Current Location: {location}</span>
        </div>
      )}
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Air Quality Index</h3>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-4xl font-bold">{airQuality.index}</span>
          </div>
          <div className={cn(
            "text-sm font-medium",
            getQualityColor(airQuality.level)
          )}>
            {airQuality.level}
          </div>
        </div>
      </div>

      {(airQuality.humidity || airQuality.temperature) && (
        <div className="grid grid-cols-3 gap-2 mt-6">
          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-secondary/50">
            <Wind className="w-5 h-5 mb-1 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">PM2.5</span>
            <span className="text-sm font-medium">{airQuality.pm25} μg/m³</span>
          </div>
          
          {airQuality.humidity && (
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-secondary/50">
              <Droplets className="w-5 h-5 mb-1 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Humidity</span>
              <span className="text-sm font-medium">{airQuality.humidity}%</span>
            </div>
          )}
          
          {airQuality.temperature && (
            <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-secondary/50">
              <Thermometer className="w-5 h-5 mb-1 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Temperature</span>
              <span className="text-sm font-medium">{airQuality.temperature}°C</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AirQualityCard;
