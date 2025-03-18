
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MapPin, BarChart3, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navigation: React.FC = () => {
  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/map', label: 'Map', icon: MapPin },
    { to: '/stats', label: 'Stats', icon: BarChart3 },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/80 backdrop-blur-lg">
      <div className="eco-container">
        <div className="flex justify-between items-center py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                cn(
                  "flex flex-col items-center justify-center py-2 px-4 text-xs font-medium transition-colors",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn("w-5 h-5 mb-1", isActive ? "text-primary" : "text-muted-foreground")} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
