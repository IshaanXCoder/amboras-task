"use client";

import { useAnalytics } from '@/hooks/use-analytics';
import { OverviewCards } from './overview-cards';
import { TopProducts } from './top-products';
import { RecentActivity } from './recent-activity';

interface DateRange { start?: string; end?: string; }

export function Dashboard({ storeId, dateRange }: { storeId: string, dateRange?: DateRange }) {
  const { overview, topProducts, recentActivity, isLoading, hasError } = useAnalytics(
    storeId, 
    dateRange?.start, 
    dateRange?.end
  );

  if (hasError) {
    return (
      <div className="p-8 border border-red-900 bg-red-950/20 text-red-500 rounded-lg text-center font-medium shadow-[0_0_15px_rgba(239,68,68,0.1)]">
        Error loading dashboard analytics. Please ensure the backend is running and reachable.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <OverviewCards data={overview} isLoading={isLoading} />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 rounded-xl border border-neutral-800/60 bg-neutral-900/40 backdrop-blur-md p-6 shadow-xl shadow-black/20">
          <TopProducts data={topProducts} isLoading={isLoading} />
        </div>
        <div className="col-span-3 rounded-xl border border-neutral-800/60 bg-neutral-900/40 backdrop-blur-md p-6 shadow-xl shadow-black/20">
          <RecentActivity data={recentActivity} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
