import { useState, useEffect, useCallback } from 'react';
import type { MetricItem, DispatchItem } from '../types/dashboard';
import { mockMetrics, mockDispatches } from '../data/mockData';
import {
  fetchMetrics,
  fetchDispatches,
  updateDispatchStatusApi,
} from '../api/dashboardService';

export const useDashboardData = (pollIntervalMs = 5000) => {
  const [metrics, setMetrics] = useState<MetricItem[]>(mockMetrics);
  const [dispatches, setDispatches] = useState<DispatchItem[]>(mockDispatches);
  const [isLive, setIsLive] = useState(true);

  // Core data synchronization
  const syncData = useCallback(async () => {
    if (import.meta.env.VITE_API_BASE_URL) {
      const [latestMetrics, latestDispatches] = await Promise.all([
        fetchMetrics(),
        fetchDispatches(),
      ]);
      setMetrics(latestMetrics);
      setDispatches(latestDispatches);
    } else {
      // Local live simulation: increment live visits and events subtly
      setMetrics((prev) =>
        prev.map((m) => {
          if (m.id === 'visits') {
            const currentNumeric = parseInt(m.value.replace(/,/g, ''), 10);
            const increment = Math.floor(Math.random() * 2); // 0 or 1 visit
            const nextVal = currentNumeric + increment;
            return {
              ...m,
              value: nextVal.toLocaleString(),
            };
          }
          if (m.id === 'engagement') {
            const currentNumeric = parseInt(m.value.replace(/,/g, ''), 10);
            const increment = Math.random() > 0.6 ? 1 : 0;
            const nextVal = currentNumeric + increment;
            return {
              ...m,
              value: nextVal.toLocaleString(),
            };
          }
          return m;
        })
      );
    }
  }, []);

  // Poll in background without refreshing the page
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      void syncData();
    }, pollIntervalMs);

    return () => clearInterval(interval);
  }, [isLive, pollIntervalMs, syncData]);

  // Update dispatch status without page reload
  const updateDispatchStatus = useCallback(
    async (id: string, newStatus: DispatchItem['status']) => {
      // Optimistic local state update
      setDispatches((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );

      // If accepted, update orders metric live without page reload
      if (newStatus === 'Accepted') {
        setMetrics((prev) =>
          prev.map((m) => {
            if (m.id === 'orders') {
              const currentOrders = parseInt(m.value, 10) || 0;
              return { ...m, value: (currentOrders + 1).toString() };
            }
            return m;
          })
        );
      }

      // Notify backend API
      await updateDispatchStatusApi(id, newStatus);
    },
    []
  );

  return {
    metrics,
    dispatches,
    isLive,
    setIsLive,
    syncData,
    updateDispatchStatus,
  };
};
