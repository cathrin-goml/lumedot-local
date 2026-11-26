import React from 'react';
import { Navbar } from '../components/Navbar';
import { PerformanceHeader } from '../components/PerformanceHeader';
import { MetricCards } from '../components/MetricCards';
import { DispatchesTable } from '../components/DispatchesTable';
import { useDashboardData } from '../store/useDashboardData';

export const Dashboard: React.FC = () => {
  const { metrics, dispatches, updateDispatchStatus } = useDashboardData();

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex flex-col">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Area - Full Responsive Width */}
      <main className="w-full flex-1 px-4 sm:px-6 lg:px-10 py-6 sm:py-8 space-y-6">
        {/* Daily Store Performance Hero Card */}
        <PerformanceHeader />

        {/* 4 Metric Cards - Updates without page refresh */}
        <MetricCards metrics={metrics} />

        {/* Dispatches & Newsletter Reviews Table - Updates without page refresh */}
        <DispatchesTable
          items={dispatches}
          onStatusChange={updateDispatchStatus}
        />
      </main>
    </div>
  );
};

export default Dashboard;
