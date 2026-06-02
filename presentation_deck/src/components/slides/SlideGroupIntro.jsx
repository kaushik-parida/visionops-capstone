import React from 'react';
import { motion } from 'framer-motion';
import { BaseSlide } from './BaseSlide';
import { Camera, ShieldAlert, Zap, Search, Activity, Clock, ArrowRight } from 'lucide-react';

// --- SLIDE 1: HERO ---
export function SlideHero() {
  return (
    <div className="w-full h-screen overflow-hidden flex flex-col justify-center items-center text-center relative bg-executive-bg p-12">
      {/* Animated Architecture Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1F2937_1px,transparent_1px),linear-gradient(to_bottom,#1F2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
      
      {/* Deep Executive Glow */}
      <div className="absolute inset-0 bg-executive-accent/5 blur-[150px] rounded-full pointer-events-none"></div>
      
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }} className="z-10 w-full max-w-5xl flex flex-col items-center">
        <h2 className="text-executive-secondary font-mono tracking-[0.4em] uppercase text-xs mb-8 bg-executive-surface border border-executive-elevated px-6 py-2 rounded-full shadow-2xl">
          TEKsystems Global Services
        </h2>
        
        <h1 className="text-7xl lg:text-8xl font-display font-bold text-executive-primary mb-6 tracking-tighter drop-shadow-2xl">
          VISIONOPS
        </h1>
        
        <p className="text-3xl text-executive-secondary font-light max-w-3xl leading-relaxed mb-20 border-t border-executive-elevated pt-8">
          Intelligent Facility Operations Platform
          <span className="block text-xl text-executive-accent mt-4 font-mono font-medium tracking-tight">Transforming Visual Data Into Operational Intelligence</span>
        </p>
        
        <div className="border border-executive-elevated bg-executive-surface/50 backdrop-blur-xl rounded-3xl p-8 w-full max-w-3xl shadow-2xl">
          <p className="text-executive-secondary font-mono text-xs uppercase tracking-widest mb-6">Group 1 Engineering Team</p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-xl text-executive-primary font-medium">
            <span>Kaushik</span>
            <span>Prabhudutta</span>
            <span>Anoushka</span>
            <span>Priyanshu</span>
            <span>Akshay</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- SLIDE 2: THE PROBLEM ---
export function SlideProblem() {
  const flow = [
    { text: "Traditional CCTV", icon: Camera, color: "text-executive-secondary" },
    { text: "Passive Monitoring", icon: Activity, color: "text-executive-secondary" },
    { text: "Human Review", icon: Search, color: "text-executive-warning" },
    { text: "Delayed Response", icon: Clock, color: "text-executive-warning" },
    { text: "Operational Risk", icon: ShieldAlert, color: "text-executive-critical" }
  ];

  return (
    <BaseSlide subtitle="Business Context" title="Why does this problem exist?">
      <div className="h-full flex items-center justify-center">
        <div className="flex items-center gap-4 w-full max-w-6xl justify-center">
          {flow.map((step, i) => (
            <React.Fragment key={i}>
              <motion.div 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
                className={`flex flex-col items-center bg-executive-surface p-6 rounded-2xl border border-executive-elevated text-center w-40 h-40 justify-center shadow-lg ${step.color}`}
              >
                <step.icon size={40} className="mb-4" />
                <span className="text-sm font-bold leading-tight">{step.text}</span>
              </motion.div>
              {i < flow.length - 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15 + 0.1 }} className="text-executive-elevated">
                  <ArrowRight size={24} />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </BaseSlide>
  );
}

// --- SLIDE 3: WHY OBJECT DETECTION IS NOT ENOUGH ---
export function SlideWhyNotEnough() {
  return (
    <BaseSlide subtitle="Product Strategy" title="Why Object Detection Is Not Enough">
      <div className="h-full flex flex-col justify-center items-center gap-12">
        
        {/* Top Flow: Object Detection */}
        <div className="flex items-center gap-6 w-full max-w-5xl opacity-60">
          <div className="bg-executive-surface border border-executive-elevated p-6 rounded-2xl shrink-0 w-64 text-center">
            <h3 className="text-xl font-bold text-executive-primary mb-2">Object Detection</h3>
            <p className="text-sm font-mono text-executive-secondary">Person, Laptop, Phone</p>
          </div>
          <ArrowRight className="text-executive-elevated shrink-0" />
          <div className="bg-executive-surface border border-executive-elevated p-6 rounded-2xl flex-1 text-center text-executive-warning">
            <h3 className="text-lg font-bold mb-2">No Business Context</h3>
          </div>
          <ArrowRight className="text-executive-elevated shrink-0" />
          <div className="bg-executive-surface border border-executive-elevated p-6 rounded-2xl flex-1 text-center text-executive-critical">
            <h3 className="text-lg font-bold mb-2">Low Operational Value</h3>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-executive-elevated to-transparent"></div>

        {/* Bottom Flow: VisionOps */}
        <div className="flex items-center gap-4 w-full max-w-6xl">
          {[
            { text: "VisionOps", bg: "bg-executive-accent/20 border-executive-accent/30 text-executive-accent" },
            { text: "Detection", bg: "bg-executive-surface border-executive-elevated text-executive-primary" },
            { text: "Rules Engine", bg: "bg-executive-surface border-executive-elevated text-executive-primary" },
            { text: "Event Generation", bg: "bg-executive-surface border-executive-elevated text-executive-primary" },
            { text: "Investigation", bg: "bg-executive-surface border-executive-elevated text-executive-primary" },
            { text: "Operational Intelligence", bg: "bg-executive-success/20 border-executive-success/30 text-executive-success" }
          ].map((node, i) => (
            <React.Fragment key={i}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                className={`p-4 rounded-xl border flex-1 text-center font-bold text-sm shadow-xl ${node.bg}`}
              >
                {node.text}
              </motion.div>
              {i < 5 && <ArrowRight size={20} className="text-executive-elevated shrink-0" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </BaseSlide>
  );
}

// --- SLIDE 4: PROJECT EVOLUTION ---
export function SlideProjectEvolution() {
  const steps = [
    { title: "GitHub Repository", sub: "Initial Research" },
    { title: "UI Analysis", sub: "React Scaffolding" },
    { title: "Backend Integration", sub: "FastAPI Connection" },
    { title: "Live Detection", sub: "Webcam Inference" },
    { title: "Event Generation", sub: "Risk Intelligence" },
    { title: "Investigation Workflow", sub: "Operations Center" },
    { title: "VisionOps", sub: "Platform Delivery" }
  ];

  return (
    <BaseSlide subtitle="Implementation Journey" title="Project Evolution">
      <div className="h-full flex items-center justify-center">
        <div className="w-full max-w-6xl relative h-64 flex items-center">
          {/* Main Timeline Axis */}
          <div className="absolute left-0 right-0 h-1 bg-executive-elevated rounded-full top-1/2 -translate-y-1/2"></div>
          
          <div className="flex justify-between w-full relative z-10">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: i % 2 === 0 ? 30 : -30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.1 }}
                className={`flex flex-col items-center w-32 ${i % 2 === 0 ? 'mt-32' : 'mb-32'}`}
              >
                <div className={`w-6 h-6 rounded-full border-4 border-executive-bg mb-4 mt-4 ${i === steps.length - 1 ? 'bg-executive-success scale-150' : 'bg-executive-accent'}`}></div>
                <div className="text-center">
                  <h3 className={`font-bold text-sm leading-tight mb-1 ${i === steps.length - 1 ? 'text-executive-success' : 'text-executive-primary'}`}>{step.title}</h3>
                  <p className="text-[10px] font-mono text-executive-secondary uppercase tracking-wider">{step.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </BaseSlide>
  );
}
