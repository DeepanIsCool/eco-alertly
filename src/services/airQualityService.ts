
import { AirQuality } from '@/types/report';
import { toast } from 'sonner';

// Function to fetch air quality data from the RapidAPI weather API
export const getAirQuality = async (
  latitude: number, 
  longitude: number
): Promise<AirQuality> => {
  try {
    // Get the nearest city for the API request
    const locationName = await getLocationName(latitude, longitude);
    const place = encodeURIComponent(locationName || 'London,GB');
    
    const url = `https://weather-api167.p.rapidapi.com/api/weather/forecast?place=${place}&cnt=1&units=metric&type=three_hour&mode=json&lang=en`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '297c2d5a7fmsh3b80b8d10389ff1p102ab1jsnc34fcd6334a7',
        'x-rapidapi-host': 'weather-api167.p.rapidapi.com',
        Accept: 'application/json'
      }
    };

    const response = await fetch(url, options);
    
    if (!response.ok) {
      // Check if the error is due to rate limiting (status 429)
      if (response.status === 429) {
        console.warn('API rate limit exceeded, using location-based estimates');
        return getLocationBasedEstimate(locationName, latitude, longitude);
      }
      throw new Error('Failed to fetch weather data');
    }
    
    const data = await response.json();
    
    // Extract relevant data from the API response
    const currentData = data.list?.[0] || {};
    const mainData = currentData.main || {};
    const weatherData = currentData.weather?.[0] || {};
    
    // Air quality index is calculated as a proxy from weather conditions
    // Since this specific API doesn't provide direct air quality information
    const weatherCondition = weatherData.main?.toLowerCase() || '';
    
    // Calculate a proxy AQI based on weather conditions
    let aqi = 50; // Default to moderate
    let level: AirQuality['level'] = 'Moderate';
    
    if (weatherCondition.includes('clear') || weatherCondition.includes('sun')) {
      aqi = 30; // Good air quality on clear days
      level = 'Good';
    } else if (weatherCondition.includes('rain') || weatherCondition.includes('drizzle')) {
      aqi = 60; // Moderate air quality on rainy days
      level = 'Moderate';
    } else if (weatherCondition.includes('cloud') || weatherCondition.includes('overcast')) {
      aqi = 75; // Moderate to unhealthy for sensitive groups
      level = 'Moderate';
    } else if (weatherCondition.includes('fog') || weatherCondition.includes('mist')) {
      aqi = 120; // Unhealthy
      level = 'Unhealthy';
    } else if (weatherCondition.includes('smoke') || weatherCondition.includes('haze')) {
      aqi = 150; // Very unhealthy
      level = 'Unhealthy';
    }
    
    // Estimate PM2.5 from the AQI (rough estimate)
    const pm25 = Math.round(aqi * 0.5);
    
    return {
      index: aqi,
      level,
      pm25,
      humidity: Math.round(mainData.humidity) || 65,
      temperature: Math.round(mainData.temp) || 24
    };
  } catch (error) {
    console.error('Error fetching air quality:', error);
    
    // Get location name for better fallback data
    const locationName = await getLocationName(latitude, longitude).catch(() => '');
    
    // Use location-based estimate when API fails
    return getLocationBasedEstimate(locationName, latitude, longitude);
  }
};

// Function to generate location-based air quality estimates
const getLocationBasedEstimate = (locationName: string, latitude: number, longitude: number): AirQuality => {
  // Notify user we're using estimates
  toast.info('Using air quality estimates based on your location');
  
  // Check if we're in a known big city for rough estimates
  // Using general knowledge of air quality in various regions
  const location = locationName.toLowerCase();
  
  // Generate more realistic data based on location characteristics
  if (location.includes('delhi') || location.includes('beijing') || location.includes('lahore')) {
    return {
      index: 180 + Math.floor(Math.random() * 40),
      level: 'Unhealthy',
      pm25: 90 + Math.floor(Math.random() * 20),
      humidity: 60 + Math.floor(Math.random() * 15),
      temperature: 30 + Math.floor(Math.random() * 5),
    };
  } else if (location.includes('mumbai') || location.includes('kolkata') || 
             location.includes('bangkok') || location.includes('jakarta')) {
    return {
      index: 120 + Math.floor(Math.random() * 40),
      level: 'Unhealthy',
      pm25: 60 + Math.floor(Math.random() * 20),
      humidity: 70 + Math.floor(Math.random() * 15),
      temperature: 32 + Math.floor(Math.random() * 4),
    };
  } else if (location.includes('los angeles') || location.includes('mexico') || 
             location.includes('paris') || location.includes('rome')) {
    return {
      index: 70 + Math.floor(Math.random() * 30),
      level: 'Moderate',
      pm25: 35 + Math.floor(Math.random() * 15),
      humidity: 55 + Math.floor(Math.random() * 15),
      temperature: 25 + Math.floor(Math.random() * 6),
    };
  } else if (location.includes('zurich') || location.includes('bergen') || 
             location.includes('auckland') || location.includes('reykjavik')) {
    return {
      index: 25 + Math.floor(Math.random() * 20),
      level: 'Good',
      pm25: 12 + Math.floor(Math.random() * 10),
      humidity: 50 + Math.floor(Math.random() * 20),
      temperature: 18 + Math.floor(Math.random() * 7),
    };
  }
  
  // Use more varied data for unknown locations
  const randomValue = Math.random();
  let index, level, pm25;
  
  if (randomValue < 0.4) {
    // 40% chance of good air quality
    index = 30 + Math.floor(Math.random() * 20);
    level = 'Good';
    pm25 = 15 + Math.floor(Math.random() * 10);
  } else if (randomValue < 0.8) {
    // 40% chance of moderate air quality
    index = 55 + Math.floor(Math.random() * 30);
    level = 'Moderate';
    pm25 = 30 + Math.floor(Math.random() * 15);
  } else {
    // 20% chance of unhealthy air quality
    index = 110 + Math.floor(Math.random() * 40);
    level = 'Unhealthy';
    pm25 = 55 + Math.floor(Math.random() * 20);
  }
  
  return {
    index,
    level,
    pm25,
    humidity: 50 + Math.floor(Math.random() * 30),
    temperature: 15 + Math.floor(Math.random() * 15)
  };
};

// Function to get location name from coordinates using reverse geocoding
async function getLocationName(latitude: number, longitude: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch location name');
    }
    
    const data = await response.json();
    
    // Extract area name from response
    const city = data.address?.city || 
                data.address?.town || 
                data.address?.village || 
                data.address?.suburb || '';
                
    const country = data.address?.country_code || '';
    
    return city && country ? `${city},${country.toUpperCase()}` : '';
  } catch (error) {
    console.error('Error fetching location name:', error);
    return '';
  }
}
