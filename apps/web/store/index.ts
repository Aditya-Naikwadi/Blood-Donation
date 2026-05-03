import { create } from 'zustand';
import apiClient from '../lib/apiClient';

interface AuthState {
  user: any | null;
  setUser: (user: any) => void;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: async () => {
    await apiClient.post('/auth/logout');
    set({ user: null });
  },
  hydrate: async () => {
    try {
      const { data } = await apiClient.get('/auth/me');
      set({ user: data });
    } catch (e) {
      set({ user: null });
    }
  }
}));

interface DonorState {
  nearbyDonors: any[];
  setNearbyDonors: (donors: any[]) => void;
  fetchNearby: (params: any) => Promise<void>;
}

export const useDonorStore = create<DonorState>((set) => ({
  nearbyDonors: [],
  setNearbyDonors: (donors) => set({ nearbyDonors: donors }),
  fetchNearby: async (params) => {
    const { data } = await apiClient.get('/donors/nearby', { params });
    set({ nearbyDonors: data });
  }
}));
