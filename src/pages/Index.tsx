
import React from 'react';
import Header from '@/components/layout/Header';
import ReportButton from '@/components/ui/ReportButton';
import AirQualityCard from '@/components/dashboard/AirQualityCard';
import ReportCard from '@/components/dashboard/ReportCard';
import { MapPin } from 'lucide-react';
import PageTransition from '@/components/layout/PageTransition';
import Navigation from '@/components/layout/Navigation';

// Mock data - would be replaced with real API calls
const mockAirQuality = {
  index: 72,
  level: 'Moderate',
  pm25: 35,
  humidity: 65,
  temperature: 24
} as const;

const mockReports = [
  {
    id: '1',
    type: 'Water Pollution',
    description: 'Oil spill observed in river near industrial area',
    location: { name: 'Downtown Area' },
    status: 'Under Investigation',
    reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    mediaUrls: ['image1.jpg']
  },
  {
    id: '2',
    type: 'Noise Pollution',
    description: 'Excessive construction noise during quiet hours',
    location: { name: 'Downtown Area' },
    status: 'Resolved',
    reportedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  }
] as const;

const Index = () => {
  return (
    <>
      <Header title="EcoAlert" />
      
      <PageTransition className="pb-20">
        <div className="eco-container space-y-6">
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <MapPin className="w-4 h-4" />
            <span>Current Location: Downtown Area</span>
          </div>
          
          <ReportButton className="animate-fade-in" style={{ animationDelay: '0.2s' }} />
          
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <AirQualityCard airQuality={mockAirQuality} />
          </div>
          
          <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h2 className="text-lg font-semibold">Recent Reports</h2>
            
            <div className="space-y-3">
              {mockReports.map((report, index) => (
                <ReportCard 
                  key={report.id} 
                  report={report} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      </PageTransition>
      
      <Navigation />
    </>
  );
};

export default Index;
