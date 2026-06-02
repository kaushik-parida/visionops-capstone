import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Shield, TrendingUp, AlertOctagon, BarChart3, ChevronDown, DownloadCloud } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AnalyticsHub() {
  const { addToast } = useOutletContext();
  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-end justify-between animate-slide-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <Shield className="text-emerald-400" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-display font-semibold text-[#F8FAFC]">Intelligence Archive</h1>
            <p className="text-xs font-mono text-[#94A3B8]">COMPLIANCE & RISK ANALYTICS</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div 
            onClick={() => addToast('Opening date range selector...', 'info')}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#111827] border border-[#334155] rounded-md text-sm font-medium cursor-pointer hover:bg-[#1F2937] transition-colors"
          >
            Last 30 Days <ChevronDown size={14} className="text-[#94A3B8]" />
          </div>
          <button 
            onClick={() => addToast('Exporting analytics archive (CSV)...', 'success')}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#1F2937] hover:bg-[#334155] border border-[#334155] text-white text-sm font-medium rounded-md transition-colors"
          >
            <DownloadCloud size={14} />
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="p-5 bg-[#111827] border border-[#334155] rounded-xl flex flex-col gap-2">
          <span className="text-xs font-mono text-[#94A3B8] uppercase tracking-wider">Facility Risk Score</span>
          <div className="flex items-end justify-between">
            <span className="text-4xl font-display font-bold text-emerald-400">94.2</span>
            <div className="flex items-center gap-1 text-emerald-500 text-sm font-medium">
              <TrendingUp size={14} /> +2.1%
            </div>
          </div>
          <div className="w-full h-1 bg-[#1F2937] rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-emerald-500 w-[94.2%] rounded-full"></div>
          </div>
        </div>

        <div className="p-5 bg-[#111827] border border-[#334155] rounded-xl flex flex-col gap-2">
          <span className="text-xs font-mono text-[#94A3B8] uppercase tracking-wider">Total Rule Breaches</span>
          <div className="flex items-end justify-between">
            <span className="text-4xl font-display font-bold text-[#F8FAFC]">1,284</span>
            <div className="flex items-center gap-1 text-red-400 text-sm font-medium">
              <TrendingUp size={14} /> +12%
            </div>
          </div>
          <span className="text-[10px] text-[#94A3B8]">Compared to previous 30 days</span>
        </div>

        <div className="p-5 bg-[#111827] border border-[#334155] rounded-xl flex flex-col gap-2">
          <span className="text-xs font-mono text-[#94A3B8] uppercase tracking-wider">Most Violated Zone</span>
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xl font-display font-bold text-yellow-400 block mb-1">Loading Dock 4</span>
              <span className="px-2 py-0.5 bg-[#1F2937] border border-[#334155] rounded text-[9px] font-mono">422 INCIDENTS</span>
            </div>
            <AlertOctagon size={24} className="text-yellow-500/50" />
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-2 gap-6 flex-1 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        
        {/* Trend Chart Mock */}
        <div className="bg-[#111827] border border-[#334155] rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-sm">30-Day Incident Trend</h3>
            <BarChart3 size={16} className="text-[#94A3B8]" />
          </div>
          <div className="flex-1 flex items-end gap-2 justify-between pt-4 border-b border-[#334155]/50 pb-2 relative">
            {/* Y-Axis lines */}
            <div className="absolute inset-x-0 top-1/4 border-t border-dashed border-[#334155]/30"></div>
            <div className="absolute inset-x-0 top-2/4 border-t border-dashed border-[#334155]/30"></div>
            <div className="absolute inset-x-0 top-3/4 border-t border-dashed border-[#334155]/30"></div>
            
            {Array.from({ length: 30 }).map((_, i) => {
              const height = Math.random() * 80 + 10;
              return (
                <div key={i} className="w-full flex justify-center group relative z-10">
                  <div 
                    className="w-1.5 bg-blue-500/40 rounded-t-sm group-hover:bg-blue-400 transition-colors" 
                    style={{ height: `${height}%` }}
                  ></div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-mono text-[#94A3B8]">
            <span>1 MAY</span>
            <span>15 MAY</span>
            <span>30 MAY</span>
          </div>
        </div>

        {/* Breakdown List */}
        <div className="bg-[#111827] border border-[#334155] rounded-xl p-5 flex flex-col">
          <h3 className="font-semibold text-sm mb-4">Incident Severity Breakdown</h3>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
            {[
              { type: 'CRITICAL', label: 'Unauthorized Entry (HV Room)', count: 42, color: 'text-red-400 bg-red-400/10 border-red-400/20', bar: 'bg-red-400' },
              { type: 'WARNING', label: 'Loitering > 5m', count: 184, color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', bar: 'bg-yellow-400' },
              { type: 'INFO', label: 'Object Left Behind', count: 532, color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', bar: 'bg-blue-400' },
              { type: 'WARNING', label: 'PPE Missing', count: 126, color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20', bar: 'bg-yellow-400' },
              { type: 'CRITICAL', label: 'Perimeter Breach', count: 12, color: 'text-red-400 bg-red-400/10 border-red-400/20', bar: 'bg-red-400' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-2 p-3 rounded-lg border border-[#1F2937] bg-[#0B1220]/50 hover:bg-[#1F2937] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn("px-1.5 py-0.5 text-[9px] font-mono font-bold rounded border", item.color)}>
                      {item.type}
                    </span>
                    <span className="text-sm font-medium text-[#F8FAFC]">{item.label}</span>
                  </div>
                  <span className="font-mono text-sm">{item.count}</span>
                </div>
                <div className="w-full h-1 bg-[#1F2937] rounded-full overflow-hidden">
                  <div className={cn("h-full rounded-full", item.bar)} style={{ width: `${(item.count / 600) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
