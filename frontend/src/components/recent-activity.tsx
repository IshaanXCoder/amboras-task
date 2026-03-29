"use client";

import { formatDistanceToNow } from 'date-fns';
import { ShoppingCart, Eye, HandCoins, ArrowRightLeft, Bell } from 'lucide-react';

const eventConfig = {
  'purchase': { icon: HandCoins, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  'page_view': { icon: Eye, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  'add_to_cart': { icon: ShoppingCart, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  'checkout_started': { icon: ArrowRightLeft, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
};

export function RecentActivity({ data, isLoading }: { data: any, isLoading: boolean }) {
  if (isLoading || !data) {
    return <div className="h-64 animate-pulse bg-neutral-800/50 rounded-lg"></div>;
  }

  const activities = data.recent_activity || [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-white">Live Activity Stream</h3>
          <p className="text-sm text-neutral-400">Monitoring real-time events</p>
        </div>
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-400">
          <Bell className="h-4 w-4" />
        </div>
      </div>

      <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
        {activities.length === 0 ? (
          <div className="text-center text-sm text-neutral-500 italic py-8">Waiting for incoming events...</div>
        ) : (
          activities.map((activity: any) => {
            const config = eventConfig[activity.type as keyof typeof eventConfig] || { icon: Eye, color: 'text-neutral-400', bg: 'bg-neutral-800 border-neutral-700' };
            const Icon = config.icon;
            
            return (
              <div key={activity.id} className="flex items-center justify-between gap-4 py-3 px-3 border border-transparent hover:border-neutral-800 hover:bg-neutral-800/30 rounded-lg transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl border ${config.bg} shadow-inner`}>
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium capitalize text-neutral-200">
                      {activity.type.replace(/_/g, ' ')}
                    </p>
                    {activity.data?.product_id && (
                      <p className="text-xs text-neutral-500 mt-0.5 group-hover:text-neutral-400 transition-colors">
                        Product ID: {activity.data.product_id}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="text-right flex flex-col items-end">
                  {activity.data?.amount && (
                    <div className="text-sm font-semibold text-white bg-white/10 px-2 py-0.5 rounded backdrop-blur-sm shadow-sm group-hover:bg-white/15 transition-colors">
                      +${activity.data.amount.toFixed(2)}
                    </div>
                  )}
                  <div className={`text-[11px] ${activity.data?.amount ? 'mt-1.5' : ''} text-neutral-600 group-hover:text-neutral-400 transition-colors whitespace-nowrap`}>
                    {formatDistanceToNow(new Date(activity.timestamp))} ago
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
