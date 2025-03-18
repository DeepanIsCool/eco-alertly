
import { AirQuality } from '@/types/report';

// Dummy data for air quality
const DUMMY_AIR_QUALITY: AirQuality = {
  index: 45,
  level: 'Moderate',
  pm25: 22,
  humidity: 65,
  temperature: 24
};

// Function to generate slight variations in the dummy data to make it seem more realistic
const getVariedDummyData = (): AirQuality => {
  const variation = Math.floor(Math.random() * 20) - 10; // -10 to +10
  const index = Math.max(0, Math.min(500, DUMMY_AIR_QUALITY.index + variation));
  
  // Determine level based on index
  let level: AirQuality['level'];
  if (index <= 50) level = 'Good';
  else if (index <= 100) level = 'Moderate';
  else if (index <= 150) level = 'Unhealthy';
  else level = 'Hazardous';
  
  return {
    index,
    level,
    pm25: Math.max(0, Math.min(500, DUMMY_AIR_QUALITY.pm25 + Math.floor(variation / 2))),
    humidity: Math.max(20, Math.min(90, DUMMY_AIR_QUALITY.humidity + Math.floor(variation / 3))),
    temperature: Math.max(10, Math.min(35, DUMMY_AIR_QUALITY.temperature + Math.floor(variation / 5)))
  };
};

export const getAirQuality = async (
  latitude: number, 
  longitude: number
): Promise<AirQuality> => {
  // Return dummy data instead of making API calls
  return getVariedDummyData();

  /* Commented out OpenWeather API integration
  try {
    // Using the Open Weather Map API for air quality data
    // You will need to replace 'YOUR_API_KEY' with an actual API key
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=YOUR_API_KEY`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch air quality data');
    }
    
    const data = await response.json();
    
    // Also fetch temperature and humidity
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=YOUR_API_KEY`
    );
    
    if (!weatherResponse.ok) {
      throw new Error('Failed to fetch weather data');
    }
    
    const weatherData = await weatherResponse.json();
    
    // Process AQI data (Air Quality Index)
    const aqi = data.list[0].main.aqi;
    
    // Map AQI number to level description
    let level: AirQuality['level'];
    switch (aqi) {
      case 1:
        level = 'Good';
        break;
      case 2:
        level = 'Moderate';
        break;
      case 3:
      case 4:
        level = 'Unhealthy';
        break;
      case 5:
        level = 'Hazardous';
        break;
      default:
        level = 'Moderate';
    }
    
    // Extract PM2.5 value
    const pm25 = data.list[0].components.pm2_5;
    
    return {
      index: Math.round(pm25 * 2), // Simple mapping as example
      level,
      pm25: Math.round(pm25),
      humidity: Math.round(weatherData.main.humidity),
      temperature: Math.round(weatherData.main.temp)
    };
  } catch (error) {
    console.error('Error fetching air quality:', error);
    
    // Return fallback data in case of error
    return getVariedDummyData();
  }
  */
};
