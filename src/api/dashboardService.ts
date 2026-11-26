import { api } from './axiosConfig';
import type { MetricItem, DispatchItem } from '../types/dashboard';
import { mockMetrics, mockDispatches } from '../data/mockData';

export const fetchMetrics = async (): Promise<MetricItem[]> => {
  if (import.meta.env.VITE_API_BASE_URL) {
    try {
      const response = await api.get<MetricItem[]>('/metrics');
      if (response.data) return response.data;
    } catch {
      // Fallback to local data when backend endpoint is not yet connected
    }
  }
  return mockMetrics;
};

export const fetchDispatches = async (): Promise<DispatchItem[]> => {
  if (import.meta.env.VITE_API_BASE_URL) {
    try {
      const response = await api.get<DispatchItem[]>('/dispatches');
      if (response.data) return response.data;
    } catch {
      // Fallback to local data when backend endpoint is not yet connected
    }
  }
  return mockDispatches;
};

export const updateDispatchStatusApi = async (
  id: string,
  status: DispatchItem['status']
): Promise<boolean> => {
  if (import.meta.env.VITE_API_BASE_URL) {
    try {
      await api.patch(`/dispatches/${id}`, { status });
      return true;
    } catch {
      // Optimistic update handled locally
    }
  }
  return true;
};
