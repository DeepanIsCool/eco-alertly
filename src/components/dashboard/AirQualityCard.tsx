
import React from 'react';
import { cn } from '@/lib/utils';
import { AirQuality } from '@/types/report';
import { Droplets, MapPin, Thermometer, Wind, RefreshCw } from 'lucide-react';

interface AirQualityCardProps {
  airQuality?: AirQuality;
  location?: string;
  className?: string;
  style?: React.CSSProperties;
  isLoading?: boolean;
  onRefresh?: () => void;
}

const AirQualityCard: React.FC<AirQualityCardProps> = ({ 
  airQuality, 
  location,
  className,
  style,
  isLoading,
  onRefresh
}) => {
  // Add a loading or error state if airQuality is undefined
  if (isLoading) {
    return (
      <div className={cn(
        "eco-card animate-enter eco-glow",
        className
      )} style={style}>
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin">
            <RefreshCw className="w-8 h-8 text-eco-green/40" />
          </div>
        </div>
      </div>
    );
  }
  
  if (!airQuality) {
    return (
      <div className={cn(
        "eco-card animate-enter eco-glow",
        className
      )} style={style}>
        <div className="flex flex-col items-center justify-center h-40 gap-3">
          <p className="text-muted-foreground">Air quality data unavailable</p>
          {onRefresh && (
            <button 
              onClick={onRefresh}
              className="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-secondary/40 hover:bg-secondary transition-colors"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          )}
        </div>
      </div>
    );
  }
  
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
      <div className="flex items-center justify-between mb-4">
        {location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>Current Location: {location}</span>
          </div>
        )}
        
        {onRefresh && (
          <button 
            onClick={onRefresh}
            className="p-1 rounded-full hover:bg-secondary/50 transition-colors"
            title="Refresh air quality data"
          >
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Air Quality Index</h3>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-4xl font-bold">{airQuality.index}</span>
          </div>
          <div className={cn(
            "text-sm font-medium px-3 py-1 rounded-full",
            getQualityColor(airQuality.level),
            airQuality.level === 'Good' ? 'bg-eco-green/10' : 
            airQuality.level === 'Moderate' ? 'bg-status-investigating/10' : 
            'bg-status-critical/10'
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
