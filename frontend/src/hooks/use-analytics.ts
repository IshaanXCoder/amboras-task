import useSWR from 'swr';
import { fetcher, API_BASE } from '@/lib/utils';

export function useAnalytics(storeId: string, startDate?: string, endDate?: string) {
  const refreshInterval = 2500; // 2.5 seconds for real-time feel

  const buildQuery = (path: string) => {
    const params = new URLSearchParams({ store_id: storeId });
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    return `${API_BASE}${path}?${params.toString()}`;
  };

  const { data: overview, error: overviewErr } = useSWR(
    buildQuery('/analytics/overview'),
    fetcher,
    { refreshInterval }
  );

  const { data: topProducts, error: topProductsErr } = useSWR(
    buildQuery('/analytics/top-products'),
    fetcher,
    { refreshInterval }
  );

  const { data: recentActivity, error: recentActivityErr } = useSWR(
    buildQuery('/analytics/recent-activity'),
    fetcher,
    { refreshInterval }
  );

  const isLoading = !overview || !topProducts || !recentActivity;
  const hasError = overviewErr || topProductsErr || recentActivityErr;

  return {
    overview,
    topProducts,
    recentActivity,
    isLoading,
    hasError
  };
}
