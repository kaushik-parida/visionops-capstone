/**
 * OperationsCenter.jsx
 *
 * THE REAL-TIME COMMAND VIEW.
 *
 * This page consumes live data from IntelligenceContext — the same context
 * fed by the webcam inference loop in LiveMonitoring.jsx.
 *
 * ALL fake setInterval data generation has been removed.
 * ALL mocked events have been removed.
 *
 * What this page now shows:
 *   - System Status Bar: real monitoring state, real detection count, real latency.
 *   - Intelligence Feed: the actual eventHistory from real model inferences.
 *   - Investigation: clicking an event opens the full investigation modal.
 */

import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import {
  Activity, Camera, AlertTriangle, ShieldCheck,
  Clock, Zap, ChevronRight, LayoutGrid, Play
} from 'lucide-react';
import { useIntelligence, getClassColor } from '../context/IntelligenceContext';
import { cn } from '../lib/utils';

function InvestigationModal({ event, onClose }) {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-[#111827] border border-[#334155] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#334155] flex items-center justify-between">
          <div>
            <h2 className="font-display font-semibold text-[#F8FAFC] text-lg">Investigation Workspace</h2>
            <p className="text-xs font-mono text-[#94A3B8] mt-0.5">
              {new Date(event.timestamp).toLocaleString()}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#1F2937] transition-colors text-[#94A3B8]">✕</button>
        </div>
        <div className="p-6 flex gap-6">
          <div className="w-64 shrink-0">
            <p className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-widest mb-2">Snapshot</p>
            {event.snapshot ? (
              <img src={event.snapshot} alt="Snapshot" className="w-full rounded-lg border border-[#334155]" />
            ) : (
              <div className="w-full aspect-video bg-[#0B1220] rounded-lg border border-[#334155] flex items-center justify-center">
                <Camera size={24} className="text-[#334155]" />
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <div>
              <p className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-widest mb-2">Trigger Event</p>
              <div className={cn("px-3 py-2 rounded-lg border text-sm font-medium",
                event.type === 'critical' ? 'bg-red-500/10 border-red-500/30 text-red-300'
                  : event.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
                    : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
              )}>
                {event.ruleName && <div className="font-bold mb-1 opacity-80 text-xs tracking-wider uppercase">{event.ruleName}</div>}
                {event.message}
                {event.recommendedAction && (
                  <div className="mt-2 pt-2 border-t border-current/20 text-xs italic">
                    Action: {event.recommendedAction}
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-widest mb-2">
                Detected Objects ({event.allDetections?.length ?? 0})
              </p>
              <div className="flex flex-col gap-2">
                {event.allDetections?.length > 0 ? event.allDetections.map((det, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#0B1220] border border-[#334155]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: getClassColor(det.label) }} />
                      <span className="text-sm capitalize text-[#F8FAFC]">{det.label}</span>
                    </div>
                    <span className="text-xs font-mono font-bold" style={{ color: getClassColor(det.label) }}>
                      {Math.round(det.confidence * 100)}%
                    </span>
                  </div>
                )) : (
                  <p className="text-xs text-[#475569] font-mono">Object left the scene.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OperationsCenter() {
  const { addToast } = useOutletContext();
  const navigate = useNavigate();
  const {
    isMonitoring,
    eventHistory,
    latestDetections,
    currentLatency,
    fps,
    systemStatus,
  } = useIntelligence();

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [dateFilter, setDateFilter] = useState('all'); // 'all', '1h', '24h'

  const handleExportCSV = () => {
    if (eventHistory.length === 0) {
      addToast('No events to export', 'error');
      return;
    }

    const headers = ['Timestamp', 'Detected Object', 'Confidence', 'Severity', 'Rule Triggered', 'Event Description', 'Session ID'];
    const rows = eventHistory.map(ev => [
      new Date(ev.timestamp).toISOString(),
      ev.label || 'Unknown',
      ev.confidence != null ? Math.round(ev.confidence * 100) + '%' : 'N/A',
      ev.type.toUpperCase(),
      ev.ruleName || 'None',
      `"${ev.message}"`, // Escape commas in message
      systemStatus.monitoringStartTime || 'N/A'
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const today = new Date().toISOString().split('T')[0];
    const filename = `VisionOps_Report_${today}.csv`;

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast(`Exported ${eventHistory.length} events successfully`, 'success');
  };

  const filteredEvents = eventHistory.filter(ev => {
    if (dateFilter === 'all') return true;
    const evTime = new Date(ev.timestamp).getTime();
    const now = Date.now();
    if (dateFilter === '1h') return (now - evTime) <= 60 * 60 * 1000;
    if (dateFilter === '24h') return (now - evTime) <= 24 * 60 * 60 * 1000;
    return true;
  });

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar p-6 space-y-6">

      {/* Header */}
      <div className="flex items-end justify-between animate-slide-up">
        <div>
          <h2 className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-widest font-bold mb-1">VisionOps Platform</h2>
          <h1 className="text-3xl font-display font-semibold text-[#F8FAFC]">Operations Center</h1>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-1.5 rounded-md bg-[#1F2937] border border-[#334155] text-xs font-mono text-[#F8FAFC] outline-none"
          >
            <option value="all">All Time</option>
            <option value="24h">Last 24 Hours</option>
            <option value="1h">Last 1 Hour</option>
          </select>
          <div className="px-3 py-1.5 rounded-md bg-[#1F2937] border border-[#334155] flex items-center gap-2">
            <Clock size={14} className="text-[#94A3B8]" />
            <span className="text-xs font-mono text-[#F8FAFC]">{new Date().toLocaleTimeString()}</span>
          </div>
          <button
            onClick={handleExportCSV}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-md transition-colors"
          >
            Export Report (CSV)
          </button>
        </div>
      </div>

      {/* Real System Status Bar */}
      <div className="grid grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <StatusCard
          title="Monitoring Status"
          value={isMonitoring ? 'LIVE' : 'IDLE'}
          icon={Camera}
          color={isMonitoring ? 'text-emerald-400' : 'text-[#475569]'}
          pulse={isMonitoring}
        />
        <StatusCard
          title="Active Detections"
          value={latestDetections.length}
          icon={ShieldCheck}
          color="text-blue-400"
        />
        <StatusCard
          title="Total Events"
          value={eventHistory.length}
          icon={AlertTriangle}
          color={eventHistory.some(e => e.type === 'critical') ? 'text-red-400' : 'text-emerald-400'}
        />
        <StatusCard
          title="Engine Latency"
          value={currentLatency != null ? `${currentLatency}ms` : '—'}
          icon={Zap}
          color="text-yellow-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 animate-slide-up" style={{ animationDelay: '0.2s' }}>

        {/* Center: Live Camera Status */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#F8FAFC] flex items-center gap-2">
              <LayoutGrid size={16} className="text-blue-500" />
              Live Detection View
            </h3>
            <span className={cn(
              "text-[10px] font-mono px-2 py-1 rounded border",
              isMonitoring
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-[#1F2937] border-[#334155] text-[#475569]"
            )}>
              {isMonitoring ? 'ACTIVE' : 'OFFLINE'}
            </span>
          </div>

          {/* Camera Preview / CTA */}
          <div className="flex-1 relative rounded-lg border border-[#334155] bg-[#0B1220] flex flex-col items-center justify-center gap-5 min-h-[280px]">
            {isMonitoring ? (
              <div className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 font-mono text-sm font-bold">MONITORING ACTIVE</span>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="px-3 py-2 bg-[#111827] rounded-lg border border-[#334155]">
                    <p className="text-[10px] font-mono text-[#94A3B8]">FPS</p>
                    <p className="text-xl font-mono font-bold text-[#F8FAFC]">{fps}</p>
                  </div>
                  <div className="px-3 py-2 bg-[#111827] rounded-lg border border-[#334155]">
                    <p className="text-[10px] font-mono text-[#94A3B8]">LATENCY</p>
                    <p className="text-xl font-mono font-bold text-[#F8FAFC]">{currentLatency ?? '—'}ms</p>
                  </div>
                  <div className="px-3 py-2 bg-[#111827] rounded-lg border border-[#334155]">
                    <p className="text-[10px] font-mono text-[#94A3B8]">OBJECTS</p>
                    <p className="text-xl font-mono font-bold text-[#F8FAFC]">{latestDetections.length}</p>
                  </div>
                </div>
                {latestDetections.length > 0 && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {latestDetections.map((det, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-md text-xs font-mono font-bold border"
                        style={{
                          color: getClassColor(det.label),
                          borderColor: getClassColor(det.label) + '40',
                          background: getClassColor(det.label) + '15',
                        }}
                      >
                        {det.label.toUpperCase()} {Math.round(det.confidence * 100)}%
                      </span>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => navigate('/monitoring')}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-[#111827] hover:bg-[#1F2937] border border-[#334155] rounded-lg text-sm transition-colors mx-auto"
                >
                  Open Live View <ChevronRight size={14} />
                </button>
              </div>
            ) : (
              <>
                <Camera size={48} className="text-[#334155]" />
                <div className="text-center">
                  <p className="text-[#94A3B8] text-sm mb-1">No active monitoring session</p>
                  <p className="text-[#475569] text-xs mb-4">Start monitoring to see real-time detections here</p>
                  <button
                    onClick={() => navigate('/monitoring')}
                    className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(34,197,94,0.2)] mx-auto"
                  >
                    <Play size={14} />
                    Go to Live Monitoring
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Real Intelligence Feed */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[#F8FAFC] flex items-center gap-2">
              <Activity size={16} className="text-blue-500" />
              Intelligence Feed
            </h3>
            <span className="text-[10px] font-mono text-[#94A3B8]">{eventHistory.length} events</span>
          </div>

          <div className="flex-1 rounded-lg border border-[#334155] bg-[#111827] flex flex-col overflow-hidden relative min-h-[300px]">
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#111827] to-transparent z-10 pointer-events-none" />

            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
              {filteredEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-10">
                  <Activity size={28} className="text-[#334155]" />
                  <p className="text-xs text-[#475569] font-mono px-4">
                    No events generated yet.<br />
                    Start Live Monitoring to see real detections here.
                  </p>
                </div>
              ) : (
                filteredEvents.map((ev) => (
                  <button
                    key={ev.id}
                    onClick={() => setSelectedEvent(ev)}
                    className={cn(
                      "w-full text-left p-3 rounded border text-sm animate-slide-left transition-colors cursor-pointer group",
                      ev.type === 'critical'
                        ? 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20'
                        : ev.type === 'warning'
                          ? 'bg-yellow-500/10 border-yellow-500/30 hover:bg-yellow-500/20'
                          : 'bg-[#1F2937] border-[#334155] hover:bg-[#334155]'
                    )}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span
                        className="font-mono text-[10px] font-bold uppercase tracking-wider"
                        style={{ color: getClassColor(ev.label) }}
                      >
                        {ev.ruleName || ev.label}
                      </span>
                      <span className="text-[10px] font-mono text-[#94A3B8]">
                        {new Date(ev.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-[#F8FAFC] font-medium text-sm">{ev.message}</p>
                    {ev.recommendedAction && (
                      <p className="text-[10px] text-[#94A3B8] mt-1 border-l-2 pl-2" style={{ borderColor: getClassColor(ev.label) + '40' }}>
                        {ev.recommendedAction}
                      </p>
                    )}
                    {ev.confidence != null && (
                      <p className="text-[10px] font-mono text-[#94A3B8] mt-1">
                        {Math.round(ev.confidence * 100)}% confidence
                      </p>
                    )}
                    <p className="mt-2 text-[10px] text-blue-400 group-hover:text-blue-300 transition-colors">
                      Investigate →
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Investigation Modal */}
      {selectedEvent && (
        <InvestigationModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}

function StatusCard({ title, value, icon: Icon, color, pulse }) {
  return (
    <div className="p-4 rounded-xl border border-[#334155] bg-[#111827] flex items-start justify-between group cursor-pointer hover:border-[#475569] transition-colors relative overflow-hidden">
      <div className="absolute right-0 top-0 w-24 h-24 bg-gradient-to-bl from-white/[0.02] to-transparent pointer-events-none" />
      <div>
        <p className="text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-1">{title}</p>
        <p className="text-2xl font-display font-semibold text-[#F8FAFC]">{value}</p>
      </div>
      <div className={cn("p-2 rounded-lg bg-[#1F2937] border border-[#334155]", color, pulse && "animate-pulse")}>
        <Icon size={18} />
      </div>
    </div>
  );
}
