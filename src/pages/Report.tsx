
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Camera, MapPin, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { ReportType } from '@/types/report';

const reportTypes: ReportType[] = [
  'Water Pollution',
  'Air Pollution',
  'Noise Pollution',
  'Chemical Spill',
  'Other'
];

const severityLevels = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
  { value: 'Critical', label: 'Critical' }
];

const Report = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    severity: '',
    location: 'Downtown Area'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      toast.success('Report submitted successfully');
      setIsSubmitting(false);
      navigate('/');
    }, 1500);
  };

  return (
    <>
      <Header title="Report Environmental Hazard" showNotifications={false} />
      
      <PageTransition className="pb-10">
        <div className="eco-container">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-xl border border-border p-4 bg-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-medium">Hazard Details</h2>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium">
                    Type of Hazard
                  </label>
                  <Select 
                    value={formData.type}
                    onValueChange={(value) => handleSelectChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select hazard type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description
                  </label>
                  <Textarea 
                    id="description"
                    name="description"
                    placeholder="Describe the hazard in detail"
                    value={formData.description}
                    onChange={handleChange}
                    className="resize-none"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="severity" className="text-sm font-medium">
                    Severity
                  </label>
                  <Select 
                    value={formData.severity}
                    onValueChange={(value) => handleSelectChange('severity', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity level" />
                    </SelectTrigger>
                    <SelectContent>
                      {severityLevels.map(level => (
                        <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="rounded-xl border border-border p-4 bg-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-medium">Location</h2>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">
                  Current Location
                </label>
                <Input 
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Location is automatically detected</p>
              </div>
            </div>
            
            <div className="rounded-xl border border-border p-4 bg-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2 mb-2">
                <Camera className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-medium">Media</h2>
              </div>
              
              <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center bg-muted/50">
                <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Upload photos or videos of the hazard</p>
                <Button variant="outline" type="button" className="mt-2">
                  Select Files
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full py-6 text-base font-medium animate-fade-in" 
              style={{ animationDelay: '0.4s' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </form>
        </div>
      </PageTransition>
    </>
  );
};

export default Report;
