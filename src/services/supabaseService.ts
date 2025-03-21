
import { Report, ReportType, ReportStatus } from '@/types/report';
import { supabase } from '@/integrations/supabase/client';

export const getRecentReports = async (): Promise<Report[]> => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('reported_at', { ascending: false })
      .limit(5);
    
    if (error) {
      throw error;
    }
    
    // Convert from Supabase format to our app's format
    return data.map(item => ({
      id: item.id,
      type: item.type as ReportType,
      description: item.description,
      location: {
        name: item.location_name,
        coordinates: item.coordinates ? {
          latitude: item.coordinates.latitude,
          longitude: item.coordinates.longitude
        } : undefined
      },
      status: item.status as ReportStatus,
      reportedAt: new Date(item.reported_at),
      mediaUrls: item.media_urls || [],
      severity: item.severity as 'Low' | 'Medium' | 'High' | 'Critical' | undefined
    }));
  } catch (error) {
    console.error('Error fetching reports:', error);
    throw error;
  }
};

export const submitReport = async (reportData: {
  type: ReportType;
  description: string;
  location: { name: string; coordinates?: { latitude: number; longitude: number } };
  mediaUrls?: string[];
  severity?: 'Low' | 'Medium' | 'High' | 'Critical';
}): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .insert({
        type: reportData.type,
        description: reportData.description,
        location_name: reportData.location.name,
        coordinates: reportData.location.coordinates,
        media_urls: reportData.mediaUrls || [],
        severity: reportData.severity,
        status: 'Pending' // All new reports start as pending
      })
      .select();
    
    if (error) {
      throw error;
    }
    
    return data[0].id;
  } catch (error) {
    console.error('Error submitting report:', error);
    throw error;
  }
};

// Get a specific report by ID
export const getReportById = async (reportId: string): Promise<Report | null> => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single();
    
    if (error) {
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    return {
      id: data.id,
      type: data.type as ReportType,
      description: data.description,
      location: {
        name: data.location_name,
        coordinates: data.coordinates ? {
          latitude: data.coordinates.latitude,
          longitude: data.coordinates.longitude
        } : undefined
      },
      status: data.status as ReportStatus,
      reportedAt: new Date(data.reported_at),
      mediaUrls: data.media_urls || [],
      severity: data.severity as 'Low' | 'Medium' | 'High' | 'Critical' | undefined
    };
  } catch (error) {
    console.error('Error fetching report:', error);
    return null;
  }
};
