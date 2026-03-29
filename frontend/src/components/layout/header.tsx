"use client";
import { Store, Calendar, UsersRound } from "lucide-react";

export function Header({ activeFilter, onFilterChange }: { activeFilter: string, onFilterChange: (mode: string) => void }) {
  return (
    <header className="sticky top-0 z-10 w-full h-16 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md flex items-center px-6">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-xl font-bold tracking-tight text-white">Store Analytics</h1>

        <div className="flex items-center gap-4 text-sm text-neutral-400">

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-800 transition-colors cursor-pointer relative">
            <Calendar className="h-4 w-4 text-indigo-400" />
            <select 
              value={activeFilter}
              onChange={(e) => onFilterChange(e.target.value)}
              className="bg-transparent text-neutral-300 font-medium outline-none cursor-pointer appearance-none pr-4"
            >
              <option value="today">Real-Time (Today)</option>
              <option value="7d">Last 7 Days (Historical)</option>
            </select>
          </div>

          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 border border-neutral-700 ml-2 cursor-pointer"></div>
        </div>
      </div>
    </header>
  );
}
