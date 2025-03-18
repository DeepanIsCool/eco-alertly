
import React from 'react';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import Navigation from '@/components/layout/Navigation';
import { BarChart3, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const Stats = () => {
  const stats = [
    { label: 'Total Reports', value: 154, icon: BarChart3, color: 'bg-eco-blue/10 text-eco-blue' },
    { label: 'Resolved', value: 89, icon: CheckCircle2, color: 'bg-eco-green/10 text-eco-green' },
    { label: 'Critical', value: 12, icon: AlertCircle, color: 'bg-eco-red/10 text-eco-red' },
    { label: 'Pending', value: 53, icon: Clock, color: 'bg-eco-yellow/10 text-eco-yellow' },
  ];

  const reportTypes = [
    { type: 'Water Pollution', count: 42, percentage: 27 },
    { type: 'Air Pollution', count: 36, percentage: 23 },
    { type: 'Noise Pollution', count: 31, percentage: 20 },
    { type: 'Chemical Spill', count: 28, percentage: 18 },
    { type: 'Other', count: 17, percentage: 12 },
  ];

  return (
    <>
      <Header title="Statistics" />
      
      <PageTransition className="pb-20">
        <div className="eco-container space-y-6">
          <div className="grid grid-cols-2 gap-4 animate-fade-in">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="eco-card p-4 flex flex-col items-center"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
          
          <div className="eco-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-lg font-medium mb-4">Report Types</h3>
            
            <div className="space-y-4">
              {reportTypes.map((item, index) => (
                <div key={item.type} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.type}</span>
                    <span className="text-muted-foreground">{item.count} reports</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="eco-card animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <h3 className="text-lg font-medium mb-4">Monthly Trend</h3>
            
            <div className="h-48 flex items-end justify-between gap-2">
              {Array.from({ length: 7 }).map((_, index) => {
                const height = 30 + Math.random() * 70;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-primary/80 rounded-t-sm"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs text-muted-foreground mt-2">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][index]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </PageTransition>
      
      <Navigation />
    </>
  );
};

export default Stats;
