import React, { useEffect, useRef } from 'react';
import { socketService } from '../../services/socket';

export const LocationTracker: React.FC = () => {
  const watchId = useRef<number | null>(null);

  const startTracking = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported');
      return;
    }

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        socketService.updateLocation(location);
      },
      (error) => {
        console.error('Error getting location:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    socketService.connect();
    startTracking();

    return () => {
      if (watchId.current) {
        navigator.geolocation.clearWatch(watchId.current);
      }
      socketService.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
};
