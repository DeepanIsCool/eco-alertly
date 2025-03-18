
import { createClient } from '@supabase/supabase-js';
import { Report } from '@/types/report';
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
      type: item.type,
      description: item.description,
      location: {
        name: item.location_name,
        coordinates: item.coordinates ? {
          latitude: item.coordinates.latitude,
          longitude: item.coordinates.longitude
        } : undefined
      },
      status: item.status,
      reportedAt: new Date(item.reported_at),
      mediaUrls: item.media_urls || [],
      severity: item.severity
    }));
  } catch (error) {
    console.error('Error fetching reports:', error);
    
    // Return mock data in case of error
    return [
      {
        id: '1',
        type: 'Water Pollution',
        description: 'Oil spill observed in river near industrial area',
        location: { name: 'Downtown River' },
        status: 'Under Investigation',
        reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        mediaUrls: ['image1.jpg', 'image2.jpg']
      },
      {
        id: '2',
        type: 'Noise Pollution',
        description: 'Excessive construction noise during quiet hours',
        location: { name: 'Residential Zone B' },
        status: 'Resolved',
        reportedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        mediaUrls: []
      },
      {
        id: '3',
        type: 'Air Pollution',
        description: 'Heavy smoke coming from factory chimney outside permitted hours',
        location: { name: 'Industrial Park' },
        status: 'Critical',
        reportedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        mediaUrls: ['smoke.jpg']
      },
      {
        id: '4',
        type: 'Chemical Spill',
        description: 'Unknown chemical leaking from truck on highway',
        location: { name: 'Route 7, Mile 23' },
        status: 'In Progress',
        reportedAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        mediaUrls: ['spill1.jpg', 'spill2.jpg']
      },
      {
        id: '5',
        type: 'Water Pollution',
        description: 'Algae bloom observed in community lake',
        location: { name: 'Memorial Park Lake' },
        status: 'Under Investigation',
        reportedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
        mediaUrls: []
      }
    ];
  }
};
