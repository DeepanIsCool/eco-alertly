
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getReportById } from '@/services/supabaseService';
import Header from '@/components/layout/Header';
import PageTransition from '@/components/layout/PageTransition';
import StatusBadge from '@/components/dashboard/StatusBadge';
import ReportImageGallery from '@/components/report/ReportImageGallery';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow, format } from 'date-fns';
import { MapPin, AlertTriangle, Calendar, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: report, isLoading, error } = useQuery({
    queryKey: ['report', id],
    queryFn: () => getReportById(id!),
    enabled: !!id,
    meta: {
      onError: () => {
        toast.error('Failed to load report details. Please try again later.');
      }
    }
  });
  
  if (isLoading) {
    return (
      <>
        <Header title="Report Details" showBackButton={true} />
        <PageTransition className="pb-10">
          <div className="eco-container">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-24 bg-muted rounded"></div>
              <div className="h-16 bg-muted rounded"></div>
            </div>
          </div>
        </PageTransition>
      </>
    );
  }
  
  if (error || !report) {
    return (
      <>
        <Header title="Report Details" showBackButton={true} />
        <PageTransition className="pb-10">
          <div className="eco-container">
            <div className="rounded-xl border border-destructive p-4 text-center">
              <p>Failed to load report details. The report may have been removed or doesn't exist.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </div>
          </div>
        </PageTransition>
      </>
    );
  }
  
  const reportDate = new Date(report.reportedAt);
  const formattedDateRelative = formatDistanceToNow(reportDate, { addSuffix: true });
  const formattedDateAbsolute = format(reportDate, 'PPP');
  
  return (
    <>
      <Header 
        title="Report Details" 
        showBackButton={true}
      />
      
      <PageTransition className="pb-10">
        <div className="eco-container space-y-6">
          <div className="rounded-xl border border-border p-4 bg-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-primary" />
                <h1 className="text-xl font-semibold">{report.type}</h1>
              </div>
              <StatusBadge status={report.status} size="lg" />
            </div>
            
            {report.severity && (
              <div className="mb-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted">
                  Severity: {report.severity}
                </span>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-1">Description</h2>
                <p className="text-sm">{report.description}</p>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{report.location.name}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>
                  Reported {formattedDateRelative} ({formattedDateAbsolute})
                </span>
              </div>
            </div>
          </div>
          
          {report.mediaUrls && report.mediaUrls.length > 0 && (
            <div className="rounded-xl border border-border p-4 bg-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <ReportImageGallery images={report.mediaUrls} />
            </div>
          )}
        </div>
      </PageTransition>
    </>
  );
};

export default ReportDetail;
