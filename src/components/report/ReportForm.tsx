
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ReportType } from '@/types/report';
import HazardDetailsSection from './HazardDetailsSection';
import LocationSection from './LocationSection';
import MediaUploadSection from './MediaUploadSection';
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

interface ReportFormProps {
  location: any;
  isSubmitting: boolean;
  uploadProgress: number;
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>;
  onSubmit: (reportData: any, mediaUrls: string[]) => Promise<void>;
}

const ReportForm: React.FC<ReportFormProps> = ({ 
  location,
  isSubmitting,
  uploadProgress,
  setUploadProgress,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    severity: '',
    location: ''
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
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

  const uploadFiles = async (): Promise<string[]> => {
    if (selectedFiles.length === 0) return [];
    
    // Create the bucket if it doesn't exist (this is handled server-side via SQL)
    const bucketName = 'report_media';
    
    const uploadPromises = selectedFiles.map(async (file, index) => {
      const fileExt = file.name.split('.').pop();
      const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${uniqueFileName}`;
      
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });
      
      if (error) {
        console.error('Error uploading file:', error);
        throw error;
      }
      
      // Calculate progress after each upload
      const progress = ((index + 1) / selectedFiles.length) * 100;
      setUploadProgress(progress);
      
      // Get the public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
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
        }
      };
      
      await onSubmit(reportData, mediaUrls);
    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('Failed to submit report. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <HazardDetailsSection 
        formData={formData}
        reportTypes={reportTypes}
        severityLevels={severityLevels}
        onSelectChange={handleSelectChange}
        onChange={handleChange}
      />
      
      <LocationSection 
        location={formData.location}
        onChange={handleChange}
        isLocationDetected={!!location}
      />
      
      <MediaUploadSection 
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        previewUrls={previewUrls}
        setPreviewUrls={setPreviewUrls}
      />
      
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
              : 'Submitting...'}
          </>
        ) : 'Submit Report'}
      </Button>
    </form>
  );
};

export default ReportForm;
