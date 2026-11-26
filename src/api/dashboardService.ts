import { api } from './axiosConfig';
import type {
  MetricItem,
  DispatchItem,
  ApiReportLogsResponse,
} from '../types/dashboard';

export const fetchMetrics = async (): Promise<MetricItem[]> => {
  if (import.meta.env.VITE_API_BASE_URL) {
    try {
      const response = await api.get<MetricItem[]>('/metrics');
      if (response.data) return response.data;
    } catch {
      // Returns empty if backend endpoint fails
    }
  }
  return [];
};

export const fetchReportLogs = async (
  date?: string
): Promise<DispatchItem[]> => {
  const targetDate = date ?? new Date().toISOString().split('T')[0];

  if (import.meta.env.VITE_API_BASE_URL) {
    try {
      const response = await api.get<ApiReportLogsResponse>(
        '/api/v1/reports/logs',
        {
          params: { date: targetDate },
        }
      );

      if (response.data && Array.isArray(response.data.items)) {
        return response.data.items.map((item) => {
          let timeLabel = 'Generated';
          try {
            const d = new Date(item.generated_at);
            timeLabel =
              d.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'UTC',
              }) + ' UTC';
          } catch {
            // keep fallback
          }

          return {
            id: item.id,
            title: item.name || 'Untitled Report',
            author: timeLabel,
            price: item.run_id ? `Run: ${item.run_id.slice(-6)}` : '',
            recipientEmail: item.email,
            performanceReport: 'report.html',
            newsletterDraft: 'newsletter.html',
            status: 'Pending Review',
            reportUrl: item.report_html,
            newsletterUrl: item.newsletter_html,
          };
        });
      }
    } catch {
      // Returns empty if backend endpoint fails
    }
  }
  return [];
};

export const fetchDispatches = async (date?: string): Promise<DispatchItem[]> => {
  return fetchReportLogs(date);
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
      // Optimistic update
    }
  }
  return true;
};
