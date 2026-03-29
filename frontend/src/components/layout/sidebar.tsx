"use client";

import { LayoutDashboard, ShoppingCart, Users, Settings, BarChart2, HelpCircle } from "lucide-react";

export function Sidebar() {
  const items = [
    { name: "Dashboard", icon: LayoutDashboard, active: true },
    { name: "Analytics", icon: BarChart2, active: false },
    { name: "Orders", icon: ShoppingCart, active: false },
    { name: "Customers", icon: Users, active: false },
    { name: "Settings", icon: Settings, active: false },
  ];

  return (
    <aside className="w-64 fixed left-0 top-0 bottom-0 bg-neutral-950 border-r border-neutral-800 flex flex-col pt-6 pb-4">
      <nav className="flex-1 px-4 space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.name}
              href="#"
              className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${item.active
                ? "bg-neutral-800/60 text-indigo-400 font-medium"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900"
                }`}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </a>
          );
        })}
      </nav>

      <div className="px-4 mt-auto">
        <button
          onClick={() => {
            localStorage.removeItem('nexus_store_id');
            window.location.reload();
          }}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-neutral-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
        >
          <HelpCircle className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
