
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle } from 'lucide-react';
import { ReportType } from '@/types/report';

interface HazardDetailsSectionProps {
  formData: {
    type: string;
    description: string;
    severity: string;
  };
  reportTypes: ReportType[];
  severityLevels: { value: string; label: string }[];
  onSelectChange: (name: string, value: string) => void;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const HazardDetailsSection: React.FC<HazardDetailsSectionProps> = ({
  formData,
  reportTypes,
  severityLevels,
  onSelectChange,
  onChange
}) => {
  return (
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
            onValueChange={(value) => onSelectChange('type', value)}
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
            onChange={onChange}
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
            onValueChange={(value) => onSelectChange('severity', value)}
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
  );
};

export default HazardDetailsSection;
