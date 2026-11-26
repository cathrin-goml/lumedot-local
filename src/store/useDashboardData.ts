import { useState, useEffect, useCallback } from 'react';
import type { MetricItem, DispatchItem } from '../types/dashboard';
import {
  fetchMetrics,
  fetchDispatches,
  updateDispatchStatusApi,
} from '../api/dashboardService';

const defaultMetrics: MetricItem[] = [
  {
    id: 'visits',
    label: "Day's Total Visits",
    value: '0',
    change: '0%',
    changeContext: 'vs prev day',
    isPrimary: true,
  },
  {
    id: 'engagement',
    label: 'Engagement Events',
    value: '0',
    change: '0%',
    changeContext: 'CTR: 0%',
  },
  {
    id: 'orders',
    label: 'Completed Orders',
    value: '0',
    change: '0%',
    changeContext: 'conv. rate',
  },
  {
    id: 'sales',
    label: 'Day Gross Sales',
    value: '$0.00',
    change: '$0.00',
    changeContext: 'vs yesterday',
  },
];

export const useDashboardData = (pollIntervalMs = 5000) => {
  const [metrics, setMetrics] = useState<MetricItem[]>(defaultMetrics);
  const [dispatches, setDispatches] = useState<DispatchItem[]>([]);
  const [isLive, setIsLive] = useState(true);

  // Core data synchronization
  const syncData = useCallback(async () => {
    if (import.meta.env.VITE_API_BASE_URL) {
      const todayUtc = new Date().toISOString().split('T')[0];
      const [latestMetrics, latestDispatches] = await Promise.all([
        fetchMetrics(),
        fetchDispatches(todayUtc),
      ]);

      if (latestMetrics.length > 0) {
        setMetrics(latestMetrics);
      }

      setDispatches((prev) => {
        const localDecisions = new Map(prev.map((p) => [p.id, p.status]));
        return latestDispatches.map((item) => {
          const userStatus = localDecisions.get(item.id);
          if (userStatus && userStatus !== 'Pending Review') {
            return { ...item, status: userStatus };
          }
          return item;
        });
      });
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
