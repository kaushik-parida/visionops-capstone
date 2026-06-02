import React from 'react';
import { motion } from 'framer-motion';
import { BaseSlide } from './BaseSlide';
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';

// --- SLIDE 8: FRONTEND TRADEOFFS ---
export function SlideWhyReact() {
  const comparisons = [
    { tech: "React", status: "SELECTED", why: "Component architecture and Virtual DOM are essential. Redrawing bounding boxes 30 times a second without full DOM layout thrashing ensures steady framerates.", bg: "bg-executive-success/10 border-executive-success/30", color: "text-executive-success", icon: CheckCircle2 },
    { tech: "Angular", status: "REJECTED", why: "Two-way data binding introduces unacceptable performance overhead for high-frequency continuous visual updates (e.g., streaming inference).", bg: "bg-executive-critical/10 border-executive-critical/30", color: "text-executive-critical", icon: XCircle },
    { tech: "Vue.js", status: "CONSIDERED", why: "Strong reactivity model, but the ecosystem for React (e.g., framer-motion, react-router) and enterprise talent pool made React the safer long-term choice.", bg: "bg-executive-warning/10 border-executive-warning/30", color: "text-executive-warning", icon: AlertTriangle }
  ];

  return (
    <BaseSlide subtitle="Technology Decisions" title="Frontend: Why React?">
      <div className="h-full flex flex-col justify-center items-center gap-8">
        <div className="grid grid-cols-3 gap-6 w-full max-w-5xl">
          {comparisons.map((d, i) => (
            <motion.div 
              key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`border p-8 rounded-2xl shadow-xl flex flex-col relative ${d.bg}`}
            >
              <d.icon size={28} className={`absolute top-8 right-8 ${d.color}`} />
              <h3 className="text-2xl font-bold text-white mb-4">{d.tech}</h3>
              <div className={`font-mono text-xs uppercase tracking-widest mb-6 ${d.color}`}>{d.status}</div>
              <p className="text-sm text-executive-primary leading-relaxed border-t border-executive-elevated/50 pt-6">
                {d.why}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </BaseSlide>
  );
}

// --- SLIDE 9: BACKEND TRADEOFFS ---
export function SlideWhyFastAPI() {
  const comparisons = [
    { tech: "FastAPI (ASGI)", status: "SELECTED", why: "Provides true asynchronous I/O. Crucial for handling incoming image blobs concurrently while OpenCV DNN blocks the CPU for inference.", bg: "bg-executive-success/10 border-executive-success/30", color: "text-executive-success", icon: CheckCircle2 },
    { tech: "Flask (WSGI)", status: "REJECTED", why: "Synchronous blocking architecture. A 100ms ML inference blocks the thread, causing catastrophic cascading latency if multiple cameras are connected.", bg: "bg-executive-critical/10 border-executive-critical/30", color: "text-executive-critical", icon: XCircle },
    { tech: "Django", status: "REJECTED", why: "Massive monolith overhead. We do not need an ORM, templating engine, or admin panel for a pure high-throughput ML endpoint.", bg: "bg-executive-critical/10 border-executive-critical/30", color: "text-executive-critical", icon: XCircle }
  ];

  return (
    <BaseSlide subtitle="Technology Decisions" title="Backend: Why FastAPI?">
      <div className="h-full flex flex-col justify-center items-center gap-8">
        <div className="grid grid-cols-3 gap-6 w-full max-w-5xl">
          {comparisons.map((d, i) => (
            <motion.div 
              key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`border p-8 rounded-2xl shadow-xl flex flex-col relative ${d.bg}`}
            >
              <d.icon size={28} className={`absolute top-8 right-8 ${d.color}`} />
              <h3 className="text-2xl font-bold text-white mb-4">{d.tech}</h3>
              <div className={`font-mono text-xs uppercase tracking-widest mb-6 ${d.color}`}>{d.status}</div>
              <p className="text-sm text-executive-primary leading-relaxed border-t border-executive-elevated/50 pt-6">
                {d.why}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </BaseSlide>
  );
}

// --- SLIDE 10: STORAGE TRADEOFFS ---
export function SlideWhySQLite() {
  const comparisons = [
    { tech: "SQLite", status: "CURRENT", why: "Zero-configuration edge persistence. Allows the PoC to run on isolated corporate networks without spinning up dedicated database clusters.", bg: "bg-executive-success/10 border-executive-success/30", color: "text-executive-success", icon: CheckCircle2 },
    { tech: "PostgreSQL", status: "ROADMAP (PHASE 4)", why: "Mandatory for Multi-Tenant analytics, advanced RBAC, and centralized event warehouses. Scheduled for Cloud Migration.", bg: "bg-executive-accent/10 border-executive-accent/30", color: "text-executive-accent", icon: AlertTriangle },
    { tech: "MongoDB", status: "REJECTED", why: "Event history (Timestamp, Class, Severity) is highly structured. NoSQL introduces unnecessary schema validation complexity.", bg: "bg-executive-critical/10 border-executive-critical/30", color: "text-executive-critical", icon: XCircle }
  ];

  return (
    <BaseSlide subtitle="Technology Decisions" title="Storage: Edge vs Cloud">
      <div className="h-full flex flex-col justify-center items-center gap-8">
        <div className="grid grid-cols-3 gap-6 w-full max-w-5xl">
          {comparisons.map((d, i) => (
            <motion.div 
              key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`border p-8 rounded-2xl shadow-xl flex flex-col relative ${d.bg}`}
            >
              <d.icon size={28} className={`absolute top-8 right-8 ${d.color}`} />
              <h3 className="text-2xl font-bold text-white mb-4">{d.tech}</h3>
              <div className={`font-mono text-xs uppercase tracking-widest mb-6 ${d.color}`}>{d.status}</div>
              <p className="text-sm text-executive-primary leading-relaxed border-t border-executive-elevated/50 pt-6">
                {d.why}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </BaseSlide>
  );
}

// --- SLIDE 11: MODEL COMPARISON MATRIX ---
export function SlideModelMatrix() {
  const headers = ["Metric", "SSD MobileNet V2", "YOLOv8", "Faster R-CNN", "EfficientDet"];
  const rows = [
    { label: "Accuracy (mAP)", vals: ["Moderate (~22%)", "High (~50%)", "Very High (~55%)", "High (~51%)"] },
    { label: "Latency (CPU)", vals: ["~85ms (Real-time)", ">300ms (Laggy)", ">800ms (Unusable)", ">400ms (Laggy)"] },
    { label: "Memory Footprint", vals: ["~50 MB", "~150 MB", ">500 MB", "~200 MB"] },
    { label: "Hardware Target", vals: ["Edge / Mobile CPU", "Dedicated GPU", "Cloud GPU Cluster", "Edge TPU / GPU"] },
    { label: "Deployment Complexity", vals: ["Low (Zero deps)", "Medium (PyTorch)", "High (Cuda/CUDNN)", "High (TensorRT)"] }
  ];

  return (
    <BaseSlide subtitle="Technology Decisions" title="Model Comparison Matrix">
      <div className="h-full flex flex-col justify-center items-center">
        <div className="w-full max-w-6xl bg-executive-surface border border-executive-elevated rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="grid grid-cols-5 bg-executive-bg border-b border-executive-elevated p-4">
            {headers.map((h, i) => (
              <div key={i} className={`font-bold font-mono text-sm tracking-wide ${i === 1 ? 'text-executive-success' : 'text-executive-secondary'}`}>
                {h}
                {i === 1 && <span className="ml-2 text-[10px] bg-executive-success/20 px-2 py-1 rounded uppercase">Selected</span>}
              </div>
            ))}
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <motion.div 
              key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
              className="grid grid-cols-5 border-b border-executive-elevated last:border-0 p-4 hover:bg-executive-elevated/30 transition-colors"
            >
              <div className="font-bold text-white text-sm flex items-center">{row.label}</div>
              {row.vals.map((v, j) => (
                <div key={j} className={`text-sm flex items-center ${j === 0 ? 'text-executive-success font-bold' : 'text-executive-primary'}`}>
                  {v}
                </div>
              ))}
            </motion.div>
          ))}

        </div>
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-8 bg-executive-warning/10 border border-executive-warning/30 p-4 rounded-xl w-full max-w-6xl flex items-center gap-4">
          <AlertTriangle className="text-executive-warning shrink-0" />
          <p className="text-sm text-white font-mono"><strong>Architectural Justification:</strong> The strict requirement for real-time edge processing on CPU hardware disqualified all GPU-dependent architectures, making SSD MobileNet the only viable candidate.</p>
        </motion.div>
      </div>
    </BaseSlide>
  );
}
