
import React from 'react';
import { Bell } from 'lucide-react';

interface HeaderProps {
  title: string;
  showNotifications?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, showNotifications = true }) => {
  return (
    <header className="py-4 flex justify-between items-center eco-container animate-fade-in">
      <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      {showNotifications && (
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:bg-muted transition-colors duration-200">
          <Bell className="w-5 h-5" />
        </button>
      )}
    </header>
  );
};

export default Header;
