
import React from 'react';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import Navigation from '@/components/layout/Navigation';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Profile = () => {
  const menuItems = [
    { icon: Bell, label: 'Notifications', badge: '4' },
    { icon: Shield, label: 'Privacy & Security' },
    { icon: HelpCircle, label: 'Help & Support' },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      <Header title="Profile" />
      
      <PageTransition className="pb-20">
        <div className="eco-container space-y-6">
          <div className="eco-card flex items-center animate-fade-in">
            <Avatar className="w-16 h-16 border-2 border-primary">
              <AvatarImage src="https://i.pravatar.cc/150?img=32" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            
            <div className="ml-4">
              <h2 className="text-xl font-semibold">Jane Doe</h2>
              <p className="text-sm text-muted-foreground">Environmental Advocate</p>
              <Button variant="outline" size="sm" className="mt-2 text-xs h-8">
                Edit Profile
              </Button>
            </div>
          </div>
          
          <div className="space-y-1 rounded-xl border border-border overflow-hidden animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {menuItems.map((item, index) => (
              <button 
                key={index}
                className="w-full flex items-center justify-between p-4 transition-colors hover:bg-muted/50 bg-card" 
              >
                <div className="flex items-center">
                  <item.icon className="w-5 h-5 text-primary mr-3" />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center">
                  {item.badge && (
                    <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center mr-2">
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Log Out</span>
            </Button>
          </div>
        </div>
      </PageTransition>
      
      <Navigation />
    </>
  );
};

export default Profile;
