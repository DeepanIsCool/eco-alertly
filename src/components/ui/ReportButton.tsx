
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ReportButtonProps {
  className?: string;
  variant?: 'default' | 'outline';
  label?: string;
}

const ReportButton: React.FC<ReportButtonProps> = ({ 
  className,
  variant = 'default',
  label = 'Report Hazard Now'
}) => {
  return (
    <Link
      to="/report"
      className={cn(
        "inline-flex items-center justify-center w-full rounded-xl text-base font-medium shadow-sm transition-all duration-200 transform hover:translate-y-[-2px] focus:outline-none",
        variant === 'default' 
          ? "bg-primary text-primary-foreground py-3 px-4 hover:bg-primary/90" 
          : "bg-secondary text-secondary-foreground py-3 px-4 hover:bg-secondary/80",
        className
      )}
    >
      <AlertTriangle className="w-5 h-5 mr-2" />
      {label}
    </Link>
  );
};

export default ReportButton;
