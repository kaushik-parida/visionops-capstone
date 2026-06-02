import React from 'react';
import { motion } from 'framer-motion';
import { BaseSlide } from './BaseSlide';
import { Camera, Activity, Zap, Search, Eye, ShieldAlert, Database, Server, Cloud, Cpu, ArrowRight, ArrowDown } from 'lucide-react';

// --- SLIDE 15: LIVE DEMO FLOW ---
export function SlideDemoPrep() {
  const steps = [
    { title: "Start Monitoring", icon: Camera },
    { title: "Capture Frame", icon: Camera },
    { title: "Inference", icon: Cpu },
    { title: "Detection", icon: Target },
    { title: "Event Rules", icon: Zap },
    { title: "Investigation", icon: Search },
    { title: "Operational Insight", icon: Eye }
  ];

  return (
    <BaseSlide subtitle="Demonstration" title="Live Demo Flow">
      <div className="h-full flex flex-col justify-center items-center">
        <div className="w-full max-w-6xl bg-executive-surface border border-executive-elevated p-12 rounded-3xl mb-8 shadow-2xl">
          <div className="flex items-center justify-between">
            {steps.map((step, i) => (
              <React.Fragment key={i}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center w-28"
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 border-2 shadow-inner ${i === steps.length - 1 ? 'bg-executive-success/20 border-executive-success/50 text-executive-success' : 'bg-executive-elevated border-executive-accent/30 text-executive-accent'}`}>
                    <step.icon size={24} />
                  </div>
                  <h3 className={`text-xs font-bold ${i === steps.length - 1 ? 'text-executive-success' : 'text-executive-primary'}`}>{step.title}</h3>
                </motion.div>
                {i < steps.length - 1 && (
                  <motion.div initial={{ width: 0 }} animate={{ width: 40 }} transition={{ delay: i * 0.1 + 0.1 }} className="h-1 bg-executive-elevated relative flex-1 mx-2">
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-executive-secondary rotate-45"></div>
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="text-executive-success font-mono uppercase tracking-widest text-sm border border-executive-success/30 bg-executive-success/10 px-6 py-2 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          Transitioning to Live Environment
        </motion.p>
      </div>
    </BaseSlide>
  );
}

// --- SLIDE 16: PRODUCTION SCALE ARCHITECTURE (Diag 7) ---
export function SlideScalabilityDesign() {
  return (
    <BaseSlide subtitle="Architecture Diagram 7" title="Production Scale Architecture">
      <div className="h-full flex flex-col justify-center items-center">
        <h3 className="text-sm font-mono text-executive-secondary uppercase tracking-widest mb-8">How would this operate in a real enterprise?</h3>
        
        <div className="w-full max-w-6xl grid grid-cols-4 gap-6">
          
          {/* Layer 1: Edge */}
          <div className="col-span-1 flex flex-col gap-4 border-r border-executive-elevated pr-6 relative">
            <h4 className="text-xs font-mono text-executive-secondary uppercase tracking-widest text-center mb-2">Edge Layer</h4>
            {['RTSP Camera 1', 'RTSP Camera 2', 'RTSP Camera N'].map((cam, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="bg-executive-surface border border-executive-elevated p-4 rounded-xl flex items-center justify-between shadow-lg">
                <Camera size={16} className="text-executive-secondary" />
                <span className="text-xs text-white font-mono">{cam}</span>
                <ArrowRight size={16} className="text-executive-accent" />
              </motion.div>
            ))}
          </div>

          {/* Layer 2: Ingestion & Processing */}
          <div className="col-span-2 flex flex-col gap-6 px-6">
            <h4 className="text-xs font-mono text-executive-secondary uppercase tracking-widest text-center mb-2">Cloud Processing Layer</h4>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="w-full bg-executive-accent/10 border border-executive-accent/30 p-4 rounded-xl text-center text-executive-accent font-bold text-sm shadow-inner">
              Event Streaming (Kafka / RabbitMQ)
            </motion.div>
            <div className="flex justify-center text-executive-elevated"><ArrowDown size={20} /></div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="w-full bg-purple-900/20 border border-purple-500/30 p-6 rounded-xl flex justify-around shadow-inner">
              <div className="text-center"><Cpu size={24} className="mx-auto mb-2 text-purple-400"/><p className="text-xs font-bold text-white">GPU Node 1</p></div>
              <div className="text-center"><Cpu size={24} className="mx-auto mb-2 text-purple-400"/><p className="text-xs font-bold text-white">GPU Node 2</p></div>
              <div className="text-center"><Cpu size={24} className="mx-auto mb-2 text-purple-400"/><p className="text-xs font-bold text-white">GPU Node N</p></div>
            </motion.div>
            <div className="flex justify-center text-executive-elevated"><ArrowDown size={20} /></div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="w-full bg-executive-warning/10 border border-executive-warning/30 p-4 rounded-xl text-center text-executive-warning font-bold text-sm shadow-inner">
              Distributed Event Rule Engine
            </motion.div>
          </div>

          {/* Layer 3: Persistence & Client */}
          <div className="col-span-1 flex flex-col gap-6 border-l border-executive-elevated pl-6">
            <h4 className="text-xs font-mono text-executive-secondary uppercase tracking-widest text-center mb-2">Data & Client Layer</h4>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }} className="w-full bg-executive-surface border border-executive-elevated p-4 rounded-xl text-center shadow-lg">
              <Database size={24} className="mx-auto mb-2 text-executive-success" />
              <p className="text-xs font-bold text-white mb-1">PostgreSQL</p>
              <p className="text-[10px] text-executive-secondary">Centralized Warehouse</p>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }} className="w-full bg-executive-surface border border-executive-elevated p-4 rounded-xl text-center shadow-lg mt-auto">
              <Server size={24} className="mx-auto mb-2 text-executive-primary" />
              <p className="text-xs font-bold text-white mb-1">Enterprise Dashboard</p>
              <p className="text-[10px] text-executive-secondary">WebSockets + React</p>
            </motion.div>
          </div>

        </div>
      </div>
    </BaseSlide>
  );
}

// --- SLIDE 17: FUTURE SCOPE ---
export function SlideFutureRoadmap() {
  const phases = [
    { label: "Phase 1: Proof of Concept", title: "Current VisionOps Edge Architecture", color: "text-executive-success", current: true },
    { label: "Phase 2: Fine-Tuning", title: "Custom Office Dataset Training", color: "text-executive-primary", current: false },
    { label: "Phase 3: Network Scale", title: "Kafka Multi-Camera Streaming", color: "text-executive-primary", current: false },
    { label: "Phase 4: Cloud Migration", title: "AWS Deployment & Security", color: "text-executive-primary", current: false },
    { label: "Phase 5: Intelligence", title: "Predictive Risk Analytics", color: "text-executive-primary", current: false },
    { label: "Phase 6: The Ultimate Goal", title: "Digital Twin 3D Integration", color: "text-executive-accent", current: false }
  ];

  return (
    <BaseSlide subtitle="Product Evolution" title="Future Scope & Roadmap">
      <div className="h-full flex items-center justify-center">
        <div className="grid grid-cols-2 gap-4 w-full max-w-5xl">
          {phases.map((phase, i) => (
            <motion.div 
              key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-2xl shadow-xl border ${phase.current ? 'bg-executive-success/10 border-executive-success/30' : i === phases.length - 1 ? 'bg-executive-accent/10 border-executive-accent/30' : 'bg-executive-surface border-executive-elevated'}`}
            >
              <p className={`text-xs font-mono uppercase tracking-widest mb-2 ${phase.current ? 'text-executive-success' : i === phases.length -1 ? 'text-executive-accent' : 'text-executive-secondary'}`}>
                {phase.label}
              </p>
              <h3 className={`text-xl font-bold ${phase.current ? 'text-white' : 'text-executive-primary'}`}>
                {phase.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </BaseSlide>
  );
}

// --- SLIDE 18: CLOSING VISION STATEMENT ---
export function SlideVisionStatement() {
  return (
    <div className="w-full h-screen overflow-hidden flex flex-col justify-center items-center text-center relative bg-executive-bg p-12">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-executive-accent/10 via-executive-bg to-executive-bg"></div>
      
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="z-10 w-full max-w-5xl flex flex-col items-center">
        <ShieldAlert size={80} className="text-executive-accent mb-8 opacity-80" />
        
        <h2 className="text-3xl text-executive-secondary font-light tracking-wide mb-4">
          From Object Detection
        </h2>
        
        <h1 className="text-6xl lg:text-7xl font-display font-bold text-white mb-16 tracking-tight drop-shadow-2xl">
          To <span className="text-executive-accent">Operational Intelligence</span>
        </h1>
        
        <div className="grid grid-cols-4 gap-4 w-full border-t border-executive-elevated pt-12">
          {[
            "Live Detection", 
            "Event Generation", 
            "Investigation Workflow", 
            "Scalable Architecture"
          ].map((outcome, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + (i * 0.1) }}
              className="text-center"
            >
              <h3 className="text-lg font-bold text-executive-primary">{outcome}</h3>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// Missing imports fix
import { Target } from 'lucide-react';
