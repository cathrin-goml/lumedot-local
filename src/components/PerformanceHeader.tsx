import React, { useState, useEffect } from 'react';

export const PerformanceHeader: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  useEffect(() => {
    const now = new Date();
    const msUntilMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() -
      now.getTime();
    const timer = setTimeout(() => {
      setCurrentDate(new Date());
    }, msUntilMidnight);

    return () => clearTimeout(timer);
  }, [currentDate]);

  const weekday = currentDate.toLocaleDateString(undefined, { weekday: 'long' });
  const formattedDate = currentDate.toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <section className="w-full bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 md:p-8 shadow-xs">
      {/* Category Badge */}
      <div className="inline-block px-3 py-1 rounded-full bg-[#EEF2FF] text-[#6366F1] text-[11px] font-semibold tracking-wide uppercase mb-4">
        DAILY STORE PERFORMANCE
      </div>

      {/* Main Dynamic Date Title */}
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
        <span className="text-slate-900">{weekday} </span>
        <span className="text-[#4F46E5]">, {formattedDate}</span>
      </h1>

      {/* Subtitle */}
      <p className="mt-2 text-sm md:text-base text-slate-500 max-w-4xl">
        Aggregated store performance, traffic metrics, and AI-generated drafts ready for owner review.
      </p>
    </section>
  );
};
