export interface MetricItem {
  id: string;
  label: string;
  value: string;
  change: string;
  changeContext: string;
  isPrimary?: boolean;
}

export interface DispatchItem {
  id: string;
  title: string;
  author: string;
  price: string;
  recipientEmail: string;
  performanceReport: string;
  newsletterDraft: string;
  status: 'Pending Review' | 'Accepted' | 'Rejected';
  reportUrl?: string;
  newsletterUrl?: string;
}

export interface ApiReportLogItem {
  id: string;
  run_id: string;
  uuid: string;
  name: string;
  email: string;
  generated_at: string;
  report_html: string;
  newsletter_html: string;
}

export interface ApiReportLogsResponse {
  date: string;
  table: string;
  count: number;
  items: ApiReportLogItem[];
}
