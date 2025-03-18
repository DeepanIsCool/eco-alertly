
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import PageTransition from "@/components/layout/PageTransition";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <PageTransition className="min-h-screen">
      <div className="eco-container flex flex-col items-center justify-center min-h-screen">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6 animate-fade-in">
          <AlertTriangle className="w-10 h-10 text-muted-foreground" />
        </div>
        
        <h1 className="text-4xl font-bold mb-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>404</h1>
        <p className="text-xl text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Page not found
        </p>
        
        <Button 
          onClick={() => navigate('/')}
          className="animate-fade-in"
          style={{ animationDelay: '0.3s' }}
        >
          Return to Home
        </Button>
      </div>
    </PageTransition>
  );
};

export default NotFound;
