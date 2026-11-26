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
}
