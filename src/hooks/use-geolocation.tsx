
import { useState, useEffect } from 'react';

interface GeolocationState {
  loading: boolean;
  error: string | null;
  location: {
    name: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    }
  } | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    loading: true,
    error: null,
    location: null
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        loading: false,
        error: 'Geolocation is not supported by your browser',
        location: null
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Reverse geocoding to get location name
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
          );
          
          if (!response.ok) {
            throw new Error('Failed to fetch location name');
          }
          
          const data = await response.json();
          
          // Extract area name from response
          const locationName = data.address?.city || 
                              data.address?.town || 
                              data.address?.village || 
                              data.address?.suburb || 
                              'Unknown Location';
          
          setState({
            loading: false,
            error: null,
            location: {
              name: locationName,
              coordinates: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }
            }
          });
        } catch (error) {
          setState({
            loading: false,
            error: 'Failed to get location name',
            location: {
              name: 'Unknown Location',
              coordinates: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              }
            }
          });
        }
      },
      (error) => {
        setState({
          loading: false,
          error: error.message,
          location: null
        });
      }
    );
  }, []);

  return state;
};
