import React, { useState, useCallback } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Activity, LayoutDashboard, Shield, ShieldAlert, Settings, Hexagon, Zap, X } from 'lucide-react';
import { cn } from '../lib/utils';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Operations Center', path: '/' },
  { icon: Activity, label: 'Live Monitoring', path: '/monitoring' },
  { icon: ShieldAlert, label: 'Rules Engine', path: '/rules' },
  { icon: Shield, label: 'Analytics Hub', path: '/analytics' },
  { icon: Settings, label: 'Configuration', path: '/settings' },
];

export default function SidebarLayout() {
  const navigate = useNavigate();
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  return (
    <div className="flex h-screen bg-[#0B1220] text-[#F8FAFC] overflow-hidden relative">
      
      {/* Toast Container */}
      <div className="absolute bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className="animate-slide-up flex items-center justify-between gap-4 px-4 py-3 bg-[#111827] border border-[#334155] rounded-lg shadow-xl min-w-[250px] pointer-events-auto">
            <span className="text-sm font-medium">{toast.message}</span>
            <X size={14} className="text-[#94A3B8] cursor-pointer hover:text-white" onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} />
          </div>
        ))}
      </div>
      
      {/* Sidebar */}
      <aside className="w-16 md:w-64 border-r border-[#334155] bg-[#0B1220] flex flex-col transition-all duration-300 relative z-20">
        
        {/* Brand */}
        <div className="h-16 border-b border-[#334155] flex items-center justify-center md:justify-start md:px-6">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="w-8 h-8 rounded bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500 shrink-0 relative overflow-hidden">
              <Hexagon size={18} className="relative z-10 group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-blue-500/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
            </div>
            <span className="font-display font-bold tracking-wide hidden md:block text-lg">VisionOps</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 flex flex-col gap-2 px-2 md:px-4">
          <div className="mb-2 px-2 hidden md:block">
            <span className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-widest font-semibold">Core Modules</span>
          </div>
          
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative overflow-hidden",
                isActive 
                  ? "bg-blue-500/10 text-blue-400" 
                  : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#1F2937]"
              )}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-blue-500 rounded-r-full" />
                  )}
                  <item.icon size={18} className={cn("shrink-0", isActive && "animate-pulse-soft")} />
                  <span className="text-sm font-medium hidden md:block">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* System Status Footer */}
        <div className="p-4 border-t border-[#334155] flex flex-col items-center md:items-start gap-2">
          <div className="w-full flex items-center justify-center md:justify-start gap-3">
            <div className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-semibold text-emerald-500">SYSTEM NOMINAL</span>
              <span className="text-[10px] font-mono text-[#94A3B8]">WS_LINK_ACTIVE</span>
            </div>
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden bg-[#0B1220] flex flex-col">
        {/* Subtle global gradient noise to make it feel less flat */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-[#0B1220] to-[#0B1220] pointer-events-none opacity-50 z-0"></div>
        
        <div className="flex-1 overflow-auto relative z-10 custom-scrollbar">
          <Outlet context={{ addToast }} />
        </div>
      </main>

    </div>
  );
}
