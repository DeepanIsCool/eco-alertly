
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Plus, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface MediaUploadSectionProps {
  selectedFiles: File[];
  setSelectedFiles: React.Dispatch<React.SetStateAction<File[]>>;
  previewUrls: string[];
  setPreviewUrls: React.Dispatch<React.SetStateAction<string[]>>;
}

const MediaUploadSection: React.FC<MediaUploadSectionProps> = ({
  selectedFiles,
  setSelectedFiles,
  previewUrls,
  setPreviewUrls
}) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const totalFiles = [...selectedFiles, ...newFiles];
      
      // Limit to 5 files
      if (totalFiles.length > 5) {
        toast.error("Maximum of 5 files allowed");
        return;
      }

      // Check file size (limit to 5MB each)
      const oversizedFiles = newFiles.filter(file => file.size > 5 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        toast.error(`Some files exceed the 5MB size limit and won't be uploaded`);
        // Filter out oversized files
        const validFiles = newFiles.filter(file => file.size <= 5 * 1024 * 1024);
        setSelectedFiles([...selectedFiles, ...validFiles]);
        
        // Create preview URLs for valid files
        const newPreviews = validFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls([...previewUrls, ...newPreviews]);
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

  return (
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
        Maximum 5 images. Accepted formats: JPEG, PNG. Max size: 5MB per image.
      </p>
    </div>
  );
};

export default MediaUploadSection;
