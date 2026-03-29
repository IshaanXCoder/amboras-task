"use client";

import { Activity, CreditCard, MousePointerClick, ShoppingBag, Users } from 'lucide-react';

export function OverviewCards({ data, isLoading }: { data: any, isLoading: boolean }) {
  if (isLoading || !data) {
    return <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-32 rounded-xl bg-neutral-900 animate-pulse border border-neutral-800"></div>)}
    </div>;
  }

  const metrics = [
    {
      title: 'Active Visitors',
      value: (data.today?.active_visitors || 0).toLocaleString(),
      icon: <Users className="h-5 w-5 text-amber-400" />,
      subtext: 'live right now',
      trend: "up"
    },
    {
      title: 'Daily Revenue',
      value: `$${(data.today?.revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <CreditCard className="h-5 w-5 text-neutral-400" />,
      trend: "up"
    },
    {
      title: 'Conversion Rate',
      value: `${data.today?.conversion_rate || '0.00'}%`,
      icon: <Activity className="h-5 w-5 text-neutral-400" />,
      subtext: 'purchases per visit',
      trend: "neutral"
    },
    {
      title: 'Total Events',
      value: (data.today?.events || 0).toLocaleString(),
      icon: <MousePointerClick className="h-5 w-5 text-neutral-400" />,
      subtext: 'activities logged',
      trend: "up"
    },
    {
      title: 'Sales Volume',
      value: (data.today?.purchases || 0).toLocaleString(),
      icon: <ShoppingBag className="h-5 w-5 text-neutral-400" />,
      subtext: 'items checked out',
      trend: "up"
    }
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {metrics.map((metric, i) => (
        <div key={i} className={`relative overflow-hidden rounded-xl border border-neutral-800/60 bg-neutral-900 flex flex-col justify-between p-6 shadow-sm hover:border-neutral-700 transition duration-300`}>

          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-medium text-neutral-400">{metric.title}</h3>
            {metric.icon}
          </div>
          <div className="mt-2">
            <div className="text-3xl font-bold text-white">
              {metric.value}
            </div>
            <p className="text-xs text-neutral-500 mt-2 flex items-center gap-1">
              <span className={metric.trend === 'up' ? 'text-neutral-400 font-medium' : ''}>{metric.subtext}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
