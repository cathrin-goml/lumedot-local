import type { MetricItem, DispatchItem } from '../types/dashboard';

export const mockMetrics: MetricItem[] = [
  {
    id: 'visits',
    label: "Day's Total Visits",
    value: '1,340',
    change: '+18.4%',
    changeContext: 'vs prev day',
    isPrimary: true,
  },
  {
    id: 'engagement',
    label: 'Engagement Events',
    value: '336',
    change: '+15.2%',
    changeContext: 'CTR: 25.1%',
  },
  {
    id: 'orders',
    label: 'Completed Orders',
    value: '16',
    change: '1.19%',
    changeContext: 'conv. rate',
  },
  {
    id: 'sales',
    label: 'Day Gross Sales',
    value: '$544.00',
    change: '+$86.00',
    changeContext: 'vs yesterday',
  },
];

export const mockDispatches: DispatchItem[] = [
  {
    id: '1',
    title: 'The Quantum Paradox',
    author: 'Dr. Eleanor Vance',
    price: '$34.00',
    recipientEmail: 'admin@lumedot.com',
    performanceReport: 'report.html',
    newsletterDraft: 'newsletter.html',
    status: 'Pending Review',
  },
  {
    id: '2',
    title: 'Signals in the Noise',
    author: 'Marcus Chen',
    price: '$28.00',
    recipientEmail: 'admin@lumedot.com',
    performanceReport: 'report.html',
    newsletterDraft: 'newsletter.html',
    status: 'Pending Review',
  },
  {
    id: '3',
    title: 'Northern Whispers',
    author: 'Sarah Callaghan',
    price: '$22.00',
    recipientEmail: 'info@canreads.ca',
    performanceReport: 'report.html',
    newsletterDraft: 'newsletter.html',
    status: 'Pending Review',
  },
];
