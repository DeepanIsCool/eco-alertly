
export type ReportType = 'Water Pollution' | 'Air Pollution' | 'Noise Pollution' | 'Chemical Spill' | 'Other';

export type ReportStatus = 'Pending' | 'Under Investigation' | 'Resolved' | 'Rejected';

export interface Report {
  id: string;
  type: ReportType;
  description: string;
  location: {
    name: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    }
  };
  status: ReportStatus;
  reportedAt: Date;
  mediaUrls?: string[];
  severity?: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface AirQuality {
  index: number;
  level: 'Good' | 'Moderate' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  pm25: number;
  humidity?: number;
  temperature?: number;
}
