import React from 'react';
import { Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  title: string;
  showNotifications?: boolean;
  showBackButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  showNotifications = true,
  showBackButton = false
}) => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNotificationClick = () => {
    // Mock notifications
    const notifications = [
      { id: 1, title: "New Report", description: "A new water pollution report has been submitted near your area." },
      { id: 2, title: "Status Update", description: "The chemical spill report you submitted has been marked as 'In Progress'." },
      { id: 3, title: "Community Alert", description: "Air quality in your area has decreased. Consider staying indoors." }
    ];
    
    // Show the most recent notification as a toast
    const latestNotification = notifications[0];
    toast.success({
      title: latestNotification.title,
      description: latestNotification.description,
    });
    
    // After a delay, show another notification
    setTimeout(() => {
      const secondNotification = notifications[1];
      toast.success({
        title: secondNotification.title,
        description: secondNotification.description,
      });
    }, 1000);
  };

  return (
    <header className="py-4 flex justify-between items-center eco-container animate-fade-in">
      <div className="flex items-center">
        {showBackButton && (
          <button 
            onClick={() => navigate(-1)}
            className="mr-3 w-8 h-8 rounded-full flex items-center justify-center text-foreground hover:bg-muted transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="m15 18-6-6 6-6"/></svg>
          </button>
        )}
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      </div>
      
      <div className="flex gap-2">
        {showNotifications && (
          <button 
            onClick={handleNotificationClick} 
            className="w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:bg-muted transition-colors duration-200"
          >
            <Bell className="w-5 h-5" />
          </button>
        )}
        <button 
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:bg-muted transition-colors duration-200"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};

export default Header;
