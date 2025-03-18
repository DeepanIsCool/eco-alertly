
import React from 'react';
import { cn } from '@/lib/utils';
import { ReportStatus } from '@/types/report';

interface StatusBadgeProps {
  status: ReportStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusStyles = (status: ReportStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-muted text-muted-foreground';
      case 'Under Investigation':
        return 'bg-status-investigating/10 text-status-investigating';
      case 'Resolved':
        return 'bg-status-resolved/10 text-status-resolved';
      case 'Rejected':
        return 'bg-status-critical/10 text-status-critical';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      getStatusStyles(status),
      className
    )}>
      {status}
    </span>
  );
};

export default StatusBadge;
