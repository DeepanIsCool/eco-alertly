
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, className }) => {
  return (
    <div className={cn("page-transition w-full flex-1", className)}>
      {children}
    </div>
  );
};

export default PageTransition;
