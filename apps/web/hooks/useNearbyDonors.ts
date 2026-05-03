import { useEffect } from 'react';
import { useDonorStore } from '../store';
import SocketService from '../lib/socket';

export const useNearbyDonors = (location: { lat: number; lng: number }, bloodType: string) => {
  const { nearbyDonors, fetchNearby, setNearbyDonors } = useDonorStore();
  const socket = SocketService.getInstance();

  useEffect(() => {
    // Initial fetch
    fetchNearby({ lat: location.lat, lng: location.lng, bloodType });

    // Polling fallback
    const interval = setInterval(() => {
      fetchNearby({ lat: location.lat, lng: location.lng, bloodType });
    }, 30000);

    // WebSocket real-time update
    socket.on('new_donor_nearby', (newDonor) => {
      if (newDonor.bloodType === bloodType) {
        setNearbyDonors([...nearbyDonors, newDonor]);
      }
    });

    return () => {
      clearInterval(interval);
      socket.off('new_donor_nearby');
    };
  }, [location.lat, location.lng, bloodType]);

  return { nearbyDonors };
};
