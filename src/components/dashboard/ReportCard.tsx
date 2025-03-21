
import React from 'react';
import { Link } from 'react-router-dom';
import { Report } from '@/types/report';
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, MapPin, ArrowUpRight } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { cn } from '@/lib/utils';

interface ReportCardProps {
  report: Report;
  className?: string;
  style?: React.CSSProperties;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, className, style }) => {
  const formattedDate = formatDistanceToNow(new Date(report.reportedAt), {
    addSuffix: true,
  });
  
  return (
    <Link 
      to={`/report/${report.id}`} 
      className={cn(
        "eco-card flex flex-col p-3 hover:shadow-md transition-shadow",
        className
      )}
      style={style}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-primary" />
          <span className="font-medium text-sm">{report.type}</span>
        </div>
        <StatusBadge status={report.status} />
      </div>
      
      <p className="text-sm line-clamp-2 mb-3">
        {report.description}
      </p>
      
      {/* Show image thumbnails if available */}
      {report.mediaUrls && report.mediaUrls.length > 0 && (
        <div className="flex gap-1 mb-3 overflow-x-auto">
          {report.mediaUrls.slice(0, 3).map((url, index) => (
            <div 
              key={index} 
              className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-muted"
            >
              <img 
                src={url} 
                alt={`Report ${index}`} 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  // Handle broken image by setting a placeholder
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
          ))}
          {report.mediaUrls.length > 3 && (
            <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 bg-muted/80 flex items-center justify-center text-sm font-medium">
              +{report.mediaUrls.length - 3}
            </div>
          )}
        </div>
      )}
      
      <div className="mt-auto pt-2 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span className="truncate max-w-[150px]">{report.location.name}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>{formattedDate}</span>
          <ArrowUpRight className="w-3 h-3" />
        </div>
      </div>
    </Link>
  );
};

export default ReportCard;
