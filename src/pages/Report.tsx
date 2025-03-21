
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import { toast } from 'sonner';
import { ReportType } from '@/types/report';
import { useGeolocation } from '@/hooks/use-geolocation';
import { submitReport } from '@/services/supabaseService';
import ReportForm from '@/components/report/ReportForm';

const Report = () => {
  const navigate = useNavigate();
  const { location } = useGeolocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleSubmitReport = async (reportData: any, mediaUrls: string[]) => {
    setIsSubmitting(true);
    
    try {
      // Include media URLs in the report data
      const completeReportData = {
        ...reportData,
        mediaUrls
      };
      
      await submitReport(completeReportData);
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
          <ReportForm 
            location={location} 
            isSubmitting={isSubmitting}
            uploadProgress={uploadProgress}
            setUploadProgress={setUploadProgress}
            onSubmit={handleSubmitReport}
          />
        </div>
      </PageTransition>
    </>
  );
};

export default Report;
