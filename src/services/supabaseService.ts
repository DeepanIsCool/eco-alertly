
import { createClient } from '@supabase/supabase-js';
import { Report } from '@/types/report';

// Initialize Supabase client
// Replace with your Supabase URL and public key
const supabaseUrl = 'https://your-project-url.supabase.co';
const supabaseKey = 'your-public-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

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
        location: { name: 'Downtown Area' },
        status: 'Under Investigation',
        reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        mediaUrls: ['image1.jpg']
      },
      {
        id: '2',
        type: 'Noise Pollution',
        description: 'Excessive construction noise during quiet hours',
        location: { name: 'Downtown Area' },
        status: 'Resolved',
        reportedAt: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
      }
    ];
  }
};
