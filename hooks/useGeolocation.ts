
import { useState, useEffect } from 'react';
import { Coordinates } from '../types';

export function useGeolocation() {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let watchId: number;

    const onSuccess = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setError(null);
    };

    const onError = (err: GeolocationPositionError) => {
      setError(`위치 정보 오류: ${err.message}`);
    };

    if (!navigator.geolocation) {
      setError('브라우저에서 위치 정보 서비스를 지원하지 않습니다.');
    } else {
      watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  return { location, error };
}
