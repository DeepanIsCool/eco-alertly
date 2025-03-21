
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { X, Image as ImageIcon } from 'lucide-react';

interface ReportImageGalleryProps {
  images: string[];
  className?: string;
}

const ReportImageGallery: React.FC<ReportImageGalleryProps> = ({ 
  images, 
  className 
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  
  if (!images || images.length === 0) {
    return null;
  }
  
  const handleImageError = (index: number) => {
    setImageErrors(prev => ({
      ...prev,
      [index]: true
    }));
  };
  
  return (
    <div className={cn("space-y-2", className)}>
      <h3 className="text-sm font-medium text-muted-foreground">
        Images ({images.length})
      </h3>
      
      <div className="grid grid-cols-4 gap-2">
        {images.map((imageUrl, index) => (
          <Dialog key={index}>
            <DialogTrigger asChild>
              <div
                className="relative rounded-md overflow-hidden h-16 cursor-pointer bg-muted hover:opacity-90 transition-opacity"
                onClick={() => setSelectedImage(imageUrl)}
              >
                {imageErrors[index] ? (
                  <div className="flex items-center justify-center w-full h-full bg-muted">
                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                  </div>
                ) : (
                  <img 
                    src={imageUrl} 
                    alt={`Report image ${index + 1}`} 
                    className="w-full h-full object-cover"
                    onError={() => handleImageError(index)}
                  />
                )}
              </div>
            </DialogTrigger>
            <DialogContent className="p-0 max-w-xl border-0 bg-transparent">
              <div className="relative">
                {imageErrors[index] ? (
                  <div className="flex items-center justify-center w-full h-80 bg-muted rounded-md">
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground">Image unavailable</p>
                    </div>
                  </div>
                ) : (
                  <img 
                    src={imageUrl} 
                    alt={`Report image ${index + 1}`} 
                    className="w-full max-h-[80vh] object-contain rounded-md"
                    onError={() => handleImageError(index)}
                  />
                )}
                <button
                  className="absolute top-3 right-3 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80"
                  onClick={(e) => {
                    // Find the close button and trigger it
                    const closeButton = document.querySelector('[data-radix-dialog-close]') as HTMLElement;
                    if (closeButton) {
                      closeButton.click();
                    }
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  );
};

export default ReportImageGallery;
