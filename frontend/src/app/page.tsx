"use client";
import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { Dashboard } from '@/components/dashboard';
import { Lock, Store, User } from 'lucide-react';
import { API_BASE } from '@/lib/utils';

export default function Home() {
  const [dateRange, setDateRange] = useState<{start?: string, end?: string}>({});
  const [storeId, setStoreId] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Authentication State
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedId = localStorage.getItem('nexus_store_id');
    const savedName = localStorage.getItem('nexus_store_name');
    if (savedId) {
      setStoreId(savedId);
      setStoreName(savedName || 'Unknown');
    }
  }, []);

  if (!isMounted) return null;

  if (!storeId) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-950 text-neutral-50 font-sans selection:bg-indigo-500/30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-neutral-950 to-neutral-950"></div>
        
        <div className="z-10 w-full max-w-md p-8 rounded-2xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-xl shadow-2xl flex flex-col items-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
            <Store className="h-8 w-8 text-white" />
          </div>
          
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Nexus Analytics</h1>
          <p className="text-neutral-400 text-sm text-center mb-6">
            {isLoginMode ? "Enter your store credentials to access your live dashboard." : "Create a new store tenant for your analytics tracking."}
          </p>
          
          {/* Tabs */}
          <div className="flex w-full bg-neutral-900/50 rounded-lg p-1 mb-6 border border-neutral-800">
            <button 
              onClick={() => { setIsLoginMode(true); setErrorMsg(''); }}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${isLoginMode ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => { setIsLoginMode(false); setErrorMsg(''); }}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${!isLoginMode ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
              Create Account
            </button>
          </div>

          {errorMsg && (
            <div className="w-full bg-red-950/50 border border-red-900/50 text-red-500 text-sm p-3 rounded-lg mb-4 text-center">
              {errorMsg}
            </div>
          )}
          
          <form className="w-full flex flex-col gap-4" onSubmit={async (e) => {
            e.preventDefault();
            setErrorMsg('');
            if (!name.trim() || !password.trim()) {
              setErrorMsg("All fields are required.");
              return;
            }

            setIsLoading(true);
            try {
              const endpoint = isLoginMode ? '/auth/login' : '/auth/register';
              const res = await fetch(`${API_BASE}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim(), password: password.trim() })
              });
              
              const data = await res.json();
              if (!res.ok) {
                setErrorMsg(data.message || "Authentication failed");
              } else {
                localStorage.setItem('nexus_store_id', data.store_id);
                localStorage.setItem('nexus_store_name', data.name);
                setStoreName(data.name);
                setStoreId(data.store_id);
              }
            } catch (err) {
              setErrorMsg("Network error trying to contact backend.");
            } finally {
              setIsLoading(false);
            }
          }}>
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-4 w-4 text-neutral-500" />
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Store Name"
                disabled={isLoading}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-neutral-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                disabled={isLoading}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-3 pl-10 pr-4 text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                required
              />
            </div>
            
            <button disabled={isLoading} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-colors shadow-lg shadow-indigo-500/20 mt-2">
              {isLoading ? 'Authenticating...' : (isLoginMode ? 'Access Dashboard' : 'Register Store')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-50 font-sans overflow-hidden font-geist-sans selection:bg-indigo-500/30">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-neutral-950 relative">
        <Header activeFilter={dateRange.start ? '7d' : 'today'} onFilterChange={(mode: string) => {
          if (mode === 'today') setDateRange({});
          else if (mode === '7d') {
            const end = new Date();
            const start = new Date();
            start.setDate(end.getDate() - 7);
            setDateRange({ start: start.toISOString(), end: end.toISOString() });
          }
        }} />

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 z-0 scrollbar-thin scrollbar-thumb-neutral-800">
          <div className="max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-light tracking-tight text-white/90">
                  Welcome, <span className="font-bold text-white">{storeName}</span>
                </h1>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-neutral-500 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded">
                    Store ID: {storeId}
                  </span>
                </div>
              </div>
              <p className="text-neutral-400 text-sm">Here's what's happening in your store {dateRange.start ? 'over the last 7 days' : 'today'}.</p>
            </header>

            <Dashboard storeId={storeId} dateRange={dateRange} />
          </div>
        </main>
      </div>
    </div>
  );
}
