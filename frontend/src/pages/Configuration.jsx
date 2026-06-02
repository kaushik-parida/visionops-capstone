import React from 'react';
import { useIntelligence } from '../context/IntelligenceContext';
import { Settings, Database, Camera, Activity, Cpu, Box } from 'lucide-react';

export default function Configuration() {
  const { isMonitoring, systemStatus, fps, currentLatency } = useIntelligence();

  return (
    <div className="flex flex-col h-full overflow-y-auto custom-scrollbar p-6 space-y-6">
      <div className="flex items-end justify-between animate-slide-up">
        <div>
          <h2 className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-widest font-bold mb-1">System Administration</h2>
          <h1 className="text-3xl font-display font-semibold text-[#F8FAFC] flex items-center gap-3">
            <Settings className="text-blue-500" /> Configuration
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        
        {/* Engine Settings */}
        <div className="bg-[#111827] border border-[#334155] rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-[#334155] pb-3">
            <Cpu className="text-emerald-400" size={20} /> Inference Engine
          </h3>
          <div className="space-y-4">
            <ConfigRow label="Detection Threshold" value="0.20 (20%)" desc="Minimum confidence required to render bounding box." />
            <ConfigRow label="Active Model" value="SSD MobileNet V2 COCO" desc="TensorFlow / OpenCV DNN backend." />
            <ConfigRow label="Frame Capture Rate" value="requestAnimationFrame" desc="Dynamic pacing matching backend response time." />
            <ConfigRow label="Input Resolution" value="640x480" desc="Standardized blob resize for model input." />
          </div>
        </div>

        {/* Operational Intelligence */}
        <div className="bg-[#111827] border border-[#334155] rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-[#334155] pb-3">
            <Database className="text-blue-400" size={20} /> Risk Engine & Storage
          </h3>
          <div className="space-y-4">
            <ConfigRow label="Rule Aggregation Window" value="5000ms" desc="Rolling window to prevent event spam." />
            <ConfigRow label="Storage Layer" value="In-Memory / SQLite" desc="Local persistence for event history." />
            <ConfigRow label="Overcrowding Threshold" value="> 8 Persons" desc="Triggers Warning event automatically." />
            <ConfigRow label="Unattended Asset Rule" value="Active" desc="Fires when Laptop > 0 && Person == 0." />
          </div>
        </div>

        {/* Live Diagnostics */}
        <div className="col-span-2 bg-[#111827] border border-[#334155] rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-[#334155] pb-3">
            <Activity className="text-yellow-400" size={20} /> Live Diagnostics
          </h3>
          <div className="grid grid-cols-4 gap-4">
            <DiagnosticCard title="Backend Health" value="ONLINE" status="good" />
            <DiagnosticCard title="Monitoring State" value={isMonitoring ? "ACTIVE" : "IDLE"} status={isMonitoring ? "good" : "neutral"} />
            <DiagnosticCard title="Current Latency" value={currentLatency ? `${currentLatency}ms` : '—'} status={currentLatency && currentLatency < 150 ? 'good' : 'warning'} />
            <DiagnosticCard title="Frontend FPS" value={fps} status={fps > 15 ? 'good' : 'warning'} />
          </div>
        </div>

      </div>
    </div>
  );
}

function ConfigRow({ label, value, desc }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-[#F8FAFC]">{label}</span>
        <span className="text-sm font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">{value}</span>
      </div>
      <p className="text-xs text-[#64748B]">{desc}</p>
    </div>
  );
}

function DiagnosticCard({ title, value, status }) {
  const colors = {
    good: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
    warning: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
    error: "text-red-400 bg-red-400/10 border-red-400/30",
    neutral: "text-[#94A3B8] bg-[#1F2937] border-[#334155]"
  };

  return (
    <div className={`p-4 rounded-lg border flex flex-col items-center justify-center text-center ${colors[status]}`}>
      <span className="text-[10px] uppercase font-mono tracking-widest opacity-80 mb-1">{title}</span>
      <span className="text-xl font-bold font-mono">{value}</span>
    </div>
  );
}
