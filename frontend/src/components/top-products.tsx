"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function TopProducts({ data, isLoading }: { data: any, isLoading: boolean }) {
  if (isLoading || !data) {
    return <div className="h-64 animate-pulse bg-neutral-800/50 rounded-lg"></div>;
  }

  const products = data.top_products || [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-white">Top Products by Revenue</h3>
          <p className="text-sm text-neutral-400">Past 24 hours</p>
        </div>
      </div>
      
      {products.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-neutral-500 italic">No purchase data available.</div>
      ) : (
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={products} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333333" />
              <XAxis 
                dataKey="product_id" 
                stroke="#888888" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(value) => value.replace(/_/g, ' ')}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                contentStyle={{
                  backgroundColor: 'rgba(10, 10, 10, 0.9)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '12px', 
                  color: '#fff',
                  backdropFilter: 'blur(8px)'
                }}
                itemStyle={{ color: '#818cf8' }}
              />
              <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
