import React from 'react';
import { motion } from 'framer-motion';
import { BaseSlide } from './BaseSlide';
import { Camera, Search, ArrowRight, Zap, Target, ShieldAlert, Cpu, Crosshair, Brain } from 'lucide-react';

// --- SLIDE 1: TITLE SLIDE ---
export function SlideHero() {
  return (
    <div className="w-full h-screen overflow-hidden flex flex-col justify-center items-center text-center relative bg-executive-bg p-12">
      {/* Heavy Engineering Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1F2937_1px,transparent_1px),linear-gradient(to_bottom,#1F2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30"></div>
      
      {/* Precision Node Connections */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-executive-accent shadow-[0_0_20px_rgba(59,130,246,1)]"></div>
      <div className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-executive-success shadow-[0_0_20px_rgba(16,185,129,1)]"></div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: "easeOut" }} className="z-10 w-full max-w-5xl flex flex-col items-center">
        <h2 className="text-executive-secondary font-mono tracking-[0.4em] uppercase text-xs mb-8 border border-executive-elevated bg-executive-surface px-8 py-3 rounded-full shadow-2xl flex items-center gap-3">
          <Brain size={16} className="text-executive-accent" /> Applied Computer Vision
        </h2>
        
        <h1 className="text-6xl lg:text-8xl font-display font-bold text-white mb-6 tracking-tighter drop-shadow-2xl">
          VISIONOPS
        </h1>
        
        <p className="text-2xl text-executive-secondary font-light max-w-3xl leading-relaxed mb-16 border-t border-executive-elevated pt-8">
          Intelligent Facility Operations & Machine Learning Platform
          <span className="block text-lg text-executive-accent mt-4 font-mono font-medium tracking-tight uppercase">Technical Capstone Defense</span>
        </p>
        
        <div className="border border-executive-elevated bg-executive-surface/80 backdrop-blur-xl rounded-2xl p-6 w-full max-w-4xl shadow-2xl flex justify-between items-center text-sm">
          <div className="flex flex-col text-left">
            <span className="text-executive-secondary font-mono uppercase tracking-widest text-[10px] mb-2">Engineering Team</span>
            <span className="text-white font-bold leading-relaxed">Kaushik</span>
            <span className="text-white font-bold leading-relaxed">Prabhudutta</span>
            <span className="text-white font-bold leading-relaxed">Anoushka</span>
            <span className="text-white font-bold leading-relaxed">Priyanshu</span>
            <span className="text-white font-bold leading-relaxed">Akshay</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-executive-secondary font-mono uppercase tracking-widest text-[10px] mb-2">Organization</span>
            <span className="text-white font-bold">TEKsystems Global Services</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- SLIDE 2: PROBLEM STATEMENT ---
export function SlideProblemStatement() {
  return (
    <BaseSlide subtitle="Project Context" title="Problem Statement">
      <div className="h-full flex flex-col justify-center items-center">
        <div className="w-full max-w-5xl bg-executive-surface border border-executive-elevated rounded-3xl p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-executive-critical opacity-10"><ShieldAlert size={150} /></div>
          
          <h3 className="text-3xl font-display font-bold text-white mb-8 relative z-10">Traditional CCTV Monitoring is Passive and Inefficient</h3>
          
          <div className="space-y-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="mt-1"><Target size={24} className="text-executive-critical" /></div>
              <div>
                <h4 className="text-lg font-bold text-executive-primary mb-1">Human Fatigue</h4>
                <p className="text-executive-secondary leading-relaxed">Security Operations Center (SOC) personnel cannot actively monitor dozens of camera feeds continuously. Cognitive fatigue leads to missed security events and delayed incident response.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="mt-1"><Target size={24} className="text-executive-critical" /></div>
              <div>
                <h4 className="text-lg font-bold text-executive-primary mb-1">Reactive Instead of Proactive</h4>
                <p className="text-executive-secondary leading-relaxed">Most enterprise camera systems are only reviewed *after* an incident has occurred (forensic analysis). They fail to provide real-time alerts for policy violations (e.g., unauthorized access to server rooms).</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1"><Target size={24} className="text-executive-critical" /></div>
              <div>
                <h4 className="text-lg font-bold text-executive-primary mb-1">Cloud Bandwidth Limitations</h4>
                <p className="text-executive-secondary leading-relaxed">Streaming 24/7 high-definition video from edge facilities to a centralized cloud for ML processing consumes massive bandwidth and introduces unacceptable latency.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseSlide>
  );
}

// --- SLIDE 3: OBJECTIVES ---
export function SlideObjectives() {
  return (
    <BaseSlide subtitle="Project Goals" title="System Objectives">
      <div className="h-full flex flex-col justify-center items-center">
        <div className="grid grid-cols-2 gap-8 w-full max-w-5xl">
          
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-executive-surface border-t-4 border-executive-accent rounded-b-2xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">1. Edge Machine Learning</h3>
            <p className="text-executive-secondary leading-relaxed">
              Deploy an efficient Object Detection model (SSD MobileNet) directly at the edge. Process video frames locally on CPU without relying on expensive cloud GPUs or streaming raw video over the network.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-executive-surface border-t-4 border-executive-warning rounded-b-2xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">2. Automated Event Rules</h3>
            <p className="text-executive-secondary leading-relaxed">
              Translate raw machine learning output (bounding boxes and confidence scores) into actionable business logic by applying density constraints and spatial rules in real-time.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-executive-surface border-t-4 border-executive-success rounded-b-2xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">3. High-Performance Monitoring</h3>
            <p className="text-executive-secondary leading-relaxed">
              Build a real-time React dashboard utilizing asynchronous data polling to render live detections without freezing the browser's UI thread or causing DOM layout thrashing.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-executive-surface border-t-4 border-purple-500 rounded-b-2xl p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">4. Ephemeral Storage</h3>
            <p className="text-executive-secondary leading-relaxed">
              Ensure data privacy and ease of deployment by implementing a zero-configuration local database (SQLite) for storing event logs and snapshots directly on the edge node.
            </p>
          </motion.div>

        </div>
      </div>
    </BaseSlide>
  );
}

// --- SLIDE 4: BUSINESS FLOW ARCHITECTURE ---
export function SlideBusinessFlow() {
  const nodes = [
    { label: "Facility Environment", icon: ShieldAlert, color: "text-executive-secondary", bg: "bg-executive-surface border-executive-elevated" },
    { label: "Image Sources", icon: Camera, color: "text-executive-secondary", bg: "bg-executive-surface border-executive-elevated" },
    { label: "ML Detection Layer", icon: Target, color: "text-executive-accent", bg: "bg-executive-accent/10 border-executive-accent/30" },
    { label: "Rule Evaluation", icon: Zap, color: "text-executive-warning", bg: "bg-executive-warning/10 border-executive-warning/30" },
    { label: "Investigation Workflow", icon: Search, color: "text-executive-secondary", bg: "bg-executive-surface border-executive-elevated" },
    { label: "Operational Intelligence", icon: Cpu, color: "text-executive-success", bg: "bg-executive-success/20 border-executive-success/50" }
  ];

  return (
    <BaseSlide subtitle="Architecture Diagram 1" title="Business Flow Architecture">
      <div className="h-full flex flex-col justify-center items-center">
        <h3 className="text-sm font-mono text-executive-secondary uppercase tracking-widest mb-10">How does business value flow through the platform?</h3>
        
        <div className="grid grid-cols-3 gap-y-12 gap-x-8 w-full max-w-5xl">
          {nodes.map((node, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-2xl border flex flex-col items-center justify-center text-center shadow-xl relative ${node.bg}`}
            >
              <div className="mb-4">
                <node.icon size={36} className={node.color} />
              </div>
              <span className={`font-mono font-bold tracking-wider text-sm mb-2 ${node.color === 'text-executive-secondary' ? 'text-white' : node.color}`}>{node.label}</span>
              
              <div className="text-[11px] text-executive-secondary leading-relaxed px-2">
                {i === 0 && "Physical offices, restricted zones, and server rooms."}
                {i === 1 && "Edge CCTV, Webcams, or IP Camera RTSP feeds."}
                {i === 2 && "VisionOps ML Pipeline extracting class bounding boxes."}
                {i === 3 && "Applying density thresholds and spatial constraints."}
                {i === 4 && "SOC dashboard with snapshot timelines & exports."}
                {i === 5 && "Actionable insights for immediate security response."}
              </div>

              {/* Connecting Arrows */}
              {i !== 2 && i !== 5 && (
                <div className="absolute -right-6 top-1/2 -translate-y-1/2 text-executive-elevated hidden md:block z-10">
                  <ArrowRight size={24} />
                </div>
              )}
              {i === 2 && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-executive-elevated hidden md:block z-10">
                  <ArrowRight size={24} className="rotate-90" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </BaseSlide>
  );
}
