import React from 'react';
import { cn } from '@/lib/utils';
import { Report } from '@/types/report';
import StatusBadge from './StatusBadge';
import { Clock, Image } from 'lucide-react';

interface ReportCardProps {
  report: Report;
  className?: string;
  style?: React.CSSProperties; // Add style prop to support animation delay
}

const ReportCard: React.FC<ReportCardProps> = ({ report, className, style }) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 24) {
      return `${Math.floor(hours / 24)}d ago`;
    }
    
    if (hours > 0) {
      return `${hours}h ago`;
    }
    
    if (minutes > 0) {
      return `${minutes}m ago`;
    }
    
    return 'Just now';
  };

  return (
    <div className={cn(
      "group eco-card animate-enter",
      className
    )}
    style={style}>
      <div className="flex gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <ReportTypeIcon type={report.type} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="text-base font-medium truncate">{report.type}</h3>
            <div className="text-xs text-muted-foreground ml-2 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {formatTime(report.reportedAt)}
            </div>
          </div>
          
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {report.description}
          </p>
          
          <div className="flex justify-between items-center mt-2">
            <StatusBadge status={report.status} />
            
            {report.mediaUrls && report.mediaUrls.length > 0 && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Image className="w-3 h-3 mr-1" />
                <span>{report.mediaUrls.length} photo{report.mediaUrls.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportTypeIcon = ({ type }: { type: Report['type'] }) => {
  switch (type) {
    case 'Water Pollution':
      return <span className="text-eco-blue text-lg">💧</span>;
    case 'Air Pollution':
      return <span className="text-eco-gray text-lg">🌫️</span>;
    case 'Noise Pollution':
      return <span className="text-eco-yellow text-lg">🔊</span>;
    case 'Chemical Spill':
      return <span className="text-eco-red text-lg">⚠️</span>;
    default:
      return <span className="text-eco-green text-lg">🌱</span>;
  }
};

export default ReportCard;
