
import React from 'react';
import { cn } from '@/lib/utils';
import { ReportStatus } from '@/types/report';

interface StatusBadgeProps {
  status: ReportStatus;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className, size = 'sm' }) => {
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
      case 'In Progress':
        return 'bg-amber-100 text-amber-800';
      case 'Critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getSizeStyles = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-0.5';
      case 'md':
        return 'text-sm px-2.5 py-0.5';
      case 'lg':
        return 'text-sm px-3 py-1';
      default:
        return 'text-xs px-2 py-0.5';
    }
  };

  return (
    <span className={cn(
      "inline-flex items-center rounded-full font-medium",
      getStatusStyles(status),
      getSizeStyles(size),
      className
    )}>
      {status}
    </span>
  );
};

export default StatusBadge;
