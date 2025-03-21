
import React, { useState, useCallback } from 'react';
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
import { Camera, MapPin, AlertTriangle, X, Plus, Upload, Image } from 'lucide-react';
import { toast } from 'sonner';
import { ReportType } from '@/types/report';
import { useGeolocation } from '@/hooks/use-geolocation';
import { submitReport } from '@/services/supabaseService';
import { supabase } from '@/integrations/supabase/client';

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
  const { location } = useGeolocation();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    severity: '',
    location: ''
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  React.useEffect(() => {
    if (location?.name) {
      setFormData(prev => ({
        ...prev,
        location: location.name
      }));
    }
  }, [location]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const totalFiles = [...selectedFiles, ...newFiles];
      
      // Limit to 5 files
      if (totalFiles.length > 5) {
        toast.error("Maximum of 5 files allowed");
        return;
      }

      setSelectedFiles([...selectedFiles, ...newFiles]);
      
      // Create preview URLs
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls([...previewUrls, ...newPreviews]);
    }
  };

  const removeFile = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setPreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
  };

  const uploadFiles = async (): Promise<string[]> => {
    if (selectedFiles.length === 0) return [];
    
    const uploadPromises = selectedFiles.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${index}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('report_media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });
      
      if (error) {
        throw error;
      }
      
      // Calculate progress after each upload
      const progress = ((index + 1) / selectedFiles.length) * 100;
      setUploadProgress(progress);
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('report_media')
        .getPublicUrl(filePath);
      
      return publicUrl;
    });
    
    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload images. Please try again.');
      return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type) {
      toast.error('Please select a hazard type');
      return;
    }
    
    if (!formData.description) {
      toast.error('Please provide a description');
      return;
    }
    
    if (!formData.location) {
      toast.error('Location is required');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // First upload any images
      const mediaUrls = await uploadFiles();
      
      // Then submit the report with the media URLs
      const reportData = {
        type: formData.type as ReportType,
        description: formData.description,
        severity: formData.severity ? formData.severity as 'Low' | 'Medium' | 'High' | 'Critical' : undefined,
        location: {
          name: formData.location,
          coordinates: location?.coordinates
        },
        mediaUrls
      };
      
      await submitReport(reportData);
      toast.success('Report submitted successfully');
      navigate('/');
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header 
        title="Report Environmental Hazard" 
        showNotifications={false} 
        showBackButton={true}
      />
      
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
                  disabled={!!location}
                  className={location ? "bg-muted" : ""}
                />
                <p className="text-xs text-muted-foreground">
                  {location ? "Location automatically detected" : "Please allow location access"}
                </p>
              </div>
            </div>
            
            <div className="rounded-xl border border-border p-4 bg-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2 mb-2">
                <Camera className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-medium">Media</h2>
              </div>
              
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative rounded-md overflow-hidden h-24 bg-muted">
                      <img 
                        src={url} 
                        alt={`Preview ${index}`} 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  
                  {previewUrls.length < 5 && (
                    <label className="flex items-center justify-center bg-muted rounded-md h-24 cursor-pointer border-2 border-dashed border-muted-foreground/50 hover:border-muted-foreground/80">
                      <Plus className="w-5 h-5 text-muted-foreground" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              )}
              
              {previewUrls.length === 0 && (
                <div className="border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center bg-muted/50">
                  <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Upload photos of the hazard</p>
                  <label className="cursor-pointer">
                    <Button 
                      variant="outline" 
                      type="button" 
                      className="mt-2"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Select Files
                    </Button>
                    <input 
                      id="file-upload"
                      type="file" 
                      accept="image/*" 
                      multiple
                      onChange={handleFileChange} 
                      className="hidden"
                    />
                  </label>
                </div>
              )}
              
              <p className="text-xs text-muted-foreground mt-2">
                Maximum 5 images. Accepted formats: JPEG, PNG.
              </p>
            </div>
            
            <Button 
              type="submit" 
              className="w-full py-6 text-base font-medium animate-fade-in" 
              style={{ animationDelay: '0.4s' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  {uploadProgress > 0 && uploadProgress < 100 
                    ? `Uploading... ${Math.round(uploadProgress)}%` 
                    : 'Submitting...'
                  }
                </>
              ) : 'Submit Report'}
            </Button>
          </form>
        </div>
      </PageTransition>
    </>
  );
};

export default Report;
