import React from 'react';
import { motion } from 'framer-motion';
import { BaseSlide } from './BaseSlide';
import { Layout, Server, Brain, Database, ArrowRight, ArrowDown, Settings, Search, Zap, Camera, Activity, Monitor, Code } from 'lucide-react';

// --- SLIDE 3: RUNTIME SYSTEM ARCHITECTURE (Diag 2) ---
export function SlideRuntimeArchitecture() {
  return (
    <BaseSlide subtitle="Architecture Diagram 2" title="Runtime System Architecture">
      <div className="h-full flex flex-col justify-center items-center">
        <h3 className="text-sm font-mono text-executive-secondary uppercase tracking-widest mb-8">What components interact during execution?</h3>
        
        <div className="w-full max-w-6xl grid grid-cols-5 gap-4">
          {/* Frontend Stack */}
          <div className="col-span-2 flex flex-col gap-2">
            <h4 className="text-xs font-mono text-executive-accent uppercase tracking-widest mb-2 flex items-center gap-2"><Layout size={14}/> Browser (React)</h4>
            {['Context State Layer', 'Webcam Manager', 'Detection Overlay', 'Event Feed'].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="bg-executive-surface border border-executive-elevated p-3 rounded-lg text-sm text-white font-mono shadow-lg">{item}</motion.div>
            ))}
          </div>

          {/* Network Gap */}
          <div className="col-span-1 flex flex-col items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-col items-center text-executive-secondary">
              <span className="text-xs font-mono mb-2">REST API (HTTP/Blob)</span>
              <ArrowRight size={24} />
            </motion.div>
          </div>

          {/* Backend Stack */}
          <div className="col-span-2 flex flex-col gap-2">
            <h4 className="text-xs font-mono text-executive-success uppercase tracking-widest mb-2 flex items-center gap-2"><Server size={14}/> FastAPI Backend</h4>
            {['Request Validation', 'Detection Service', 'Event Processor', 'Rule Evaluator'].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (i * 0.1) + 0.5 }} className="bg-executive-surface border border-executive-elevated p-3 rounded-lg text-sm text-white font-mono shadow-lg">{item}</motion.div>
            ))}
          </div>
        </div>
        
        {/* Deep Layers */}
        <div className="w-full max-w-6xl mt-8 grid grid-cols-5 gap-4">
          <div className="col-span-2 flex justify-center"><ArrowDown size={20} className="text-executive-elevated" /></div>
          <div className="col-span-1"></div>
          <div className="col-span-2 flex justify-center"><ArrowDown size={20} className="text-executive-elevated" /></div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="col-span-2 bg-executive-bg border border-executive-elevated p-4 rounded-xl text-center text-sm font-mono text-executive-secondary">DOM Rendering</motion.div>
          <div className="col-span-1"></div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="col-span-2 bg-purple-900/10 border border-purple-500/30 p-4 rounded-xl text-center text-sm font-mono text-purple-400">TensorFlow Inference Engine</motion.div>
        </div>
      </div>
    </BaseSlide>
  );
}

// --- SLIDE 4: DETECTION PIPELINE (Diag 3) ---
export function SlideDetectionPipeline() {
  const steps = [
    { title: "Camera Frame", loc: "Video Stream" },
    { title: "Canvas Capture", loc: "Image Compression" },
    { title: "REST Upload", loc: "FastAPI Endpoint" },
    { title: "Preprocessing", loc: "NumPy Matrix" },
    { title: "Inference", loc: "SSD MobileNet" },
    { title: "Bounding Boxes", loc: "Event Generation" },
    { title: "Rendering", loc: "React UI" }
  ];

  return (
    <BaseSlide subtitle="Architecture Diagram 3" title="Detection Pipeline Flow">
      <div className="h-full flex flex-col justify-center items-center">
        <h3 className="text-sm font-mono text-executive-secondary uppercase tracking-widest mb-12">How does a single frame move through the system?</h3>
        <div className="flex flex-wrap justify-center items-center gap-4 w-full max-w-6xl">
          {steps.map((step, i) => (
            <React.Fragment key={i}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                className={`flex flex-col items-center w-36 p-4 rounded-xl border shadow-xl ${i === 4 ? 'bg-purple-900/20 border-purple-500/50 text-purple-400' : 'bg-executive-surface border-executive-elevated text-white'}`}
              >
                <h4 className="text-center font-bold text-sm leading-tight mb-2">{step.title}</h4>
                <p className="text-[10px] text-executive-secondary font-mono uppercase tracking-widest text-center">{step.loc}</p>
              </motion.div>
              {i < steps.length - 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 + 0.1 }} className="text-executive-elevated">
                  <ArrowRight size={20} />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </BaseSlide>
  );
}

// --- SLIDE 5: FRONTEND COMPONENT ARCHITECTURE (Diag 4) ---
export function SlideFrontendArchitecture() {
  return (
    <BaseSlide subtitle="Architecture Diagram 4" title="Frontend Component Architecture">
      <div className="h-full flex flex-col justify-center items-center">
        <h3 className="text-sm font-mono text-executive-secondary uppercase tracking-widest mb-8">How is the React application organized?</h3>
        
        <div className="w-full max-w-4xl bg-executive-surface border border-executive-elevated rounded-2xl p-8 flex flex-col gap-6 relative shadow-2xl">
          {/* App Shell */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="w-full bg-executive-bg border border-executive-elevated p-4 rounded-xl text-center font-bold text-white shadow-inner">
            App Shell & Routing Layer (React Router)
          </motion.div>
          
          <div className="flex justify-center gap-12 text-executive-elevated"><ArrowDown size={24} /><ArrowDown size={24} /><ArrowDown size={24} /></div>
          
          {/* Modules */}
          <div className="grid grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-executive-accent/10 border border-executive-accent/30 p-4 rounded-xl text-center"><Monitor size={24} className="mx-auto mb-2 text-executive-accent"/><p className="text-sm font-bold text-white">Monitoring Module</p></motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-executive-warning/10 border border-executive-warning/30 p-4 rounded-xl text-center"><Search size={24} className="mx-auto mb-2 text-executive-warning"/><p className="text-sm font-bold text-white">Investigation Module</p></motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-executive-bg border border-executive-elevated p-4 rounded-xl text-center"><Settings size={24} className="mx-auto mb-2 text-executive-secondary"/><p className="text-sm font-bold text-white">Configuration Module</p></motion.div>
          </div>
          
          <div className="flex justify-center text-executive-elevated"><ArrowDown size={24} /></div>
          
          {/* Context API */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="w-full bg-executive-success/10 border border-executive-success/30 p-4 rounded-xl text-center font-mono text-executive-success font-bold tracking-widest shadow-inner">
            SHARED CONTEXT STATE LAYER (IntelligenceContext)
          </motion.div>
        </div>
      </div>
    </BaseSlide>
  );
}

// --- SLIDE 6: BACKEND COMPONENT ARCHITECTURE (Diag 5) WITH CODE ---
export function SlideBackendArchitecture() {
  return (
    <BaseSlide subtitle="Architecture Diagram 5" title="Backend Component Architecture">
      <div className="h-full flex items-center justify-center">
        <div className="grid grid-cols-2 gap-8 w-full max-w-6xl">
          
          {/* Left: Diagram */}
          <div className="bg-executive-surface border border-executive-elevated rounded-2xl p-8 flex flex-col gap-6 shadow-2xl">
            <h3 className="text-sm font-mono text-executive-secondary uppercase tracking-widest text-center mb-2">Service Separation</h3>
            
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="w-full bg-executive-bg border border-executive-elevated p-4 rounded-xl text-center font-bold text-white font-mono shadow-inner">
              API GATEWAY (FastAPI App)
            </motion.div>
            <div className="flex justify-center text-executive-elevated"><ArrowDown size={24} /></div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-executive-elevated rounded-xl p-4 flex flex-col gap-4">
                <div className="bg-purple-900/10 border border-purple-500/30 p-3 rounded-lg text-center text-purple-400 font-bold text-sm">Detection Service</div>
                <div className="flex justify-center text-executive-elevated"><ArrowDown size={16} /></div>
                <div className="bg-executive-bg p-3 rounded-lg text-center text-executive-secondary font-mono text-xs shadow-inner">Inference Engine (Singleton)</div>
              </div>
              
              <div className="border border-executive-elevated rounded-xl p-4 flex flex-col gap-4">
                <div className="bg-executive-warning/10 border border-executive-warning/30 p-3 rounded-lg text-center text-executive-warning font-bold text-sm">Event Service</div>
                <div className="flex justify-center text-executive-elevated"><ArrowDown size={16} /></div>
                <div className="bg-executive-bg p-3 rounded-lg text-center text-executive-secondary font-mono text-xs shadow-inner">Storage Service (SQLite)</div>
              </div>
            </div>
          </div>

          {/* Right: Actual Code Implementation */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-[#0d1117] border border-executive-elevated rounded-2xl p-6 shadow-2xl overflow-hidden relative">
            <div className="flex items-center gap-3 border-b border-executive-elevated pb-4 mb-4 text-executive-secondary">
              <Code size={16} /> <span className="font-mono text-xs">backend/model.py (The Singleton Engine)</span>
            </div>
            <pre className="text-[11px] font-mono leading-relaxed overflow-x-auto text-gray-300">
              <code className="language-python">
{`class ObjectDetector:
    _instance = None

    def __new__(cls):
        # Prevent RAM bloat by loading graph only once
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls.net = cv2.dnn.readNetFromTensorflow(
                'frozen_inference_graph.pb',
                'graph.pbtxt'
            )
        return cls._instance

    def detect(self, image_array):
        # Mean subtraction, scaling, and channel swapping
        blob = cv2.dnn.blobFromImage(
            image_array, size=(300, 300), swapRB=True
        )
        
        # Execute C++ Inference without blocking other HTTP requests
        self.net.setInput(blob)
        detections = self.net.forward() 
        
        return self._parse_detections(detections)`}
              </code>
            </pre>
            <div className="absolute top-16 right-6 px-3 py-1 bg-purple-900/30 border border-purple-500/50 text-purple-400 rounded text-[10px] font-mono tracking-widest uppercase shadow-lg">
              OpenCV DNN Layer
            </div>
          </motion.div>

        </div>
      </div>
    </BaseSlide>
  );
}

// --- SLIDE 7: STATE MANAGEMENT FLOW (Diag 6) ---
export function SlideStateManagement() {
  const steps = [
    { title: "Detection Results", desc: "JSON array from Backend", bg: "bg-executive-surface" },
    { title: "Context Provider", desc: "Global State Container", bg: "bg-executive-accent/10 border-executive-accent/30 text-executive-accent" },
    { title: "Event Rule Engine", desc: "Client-side Threshold Logic", bg: "bg-executive-warning/10 border-executive-warning/30 text-executive-warning" },
    { title: "History Store", desc: "Rolling 50-Event Array", bg: "bg-executive-success/10 border-executive-success/30 text-executive-success" },
    { title: "UI Consumers", desc: "Monitoring & Investigation Modules", bg: "bg-executive-bg" }
  ];

  return (
    <BaseSlide subtitle="Architecture Diagram 6" title="State Management Flow">
      <div className="h-full flex flex-col justify-center items-center">
        <h3 className="text-sm font-mono text-executive-secondary uppercase tracking-widest mb-12">How does information move through the React UI?</h3>
        
        <div className="flex flex-col gap-4 w-full max-w-3xl relative">
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-executive-elevated"></div>
          
          {steps.map((step, i) => (
            <motion.div 
              key={i} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
              className={`relative z-10 p-4 rounded-xl border flex items-center justify-between shadow-xl ${step.bg}`}
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-executive-bg border border-executive-elevated rounded-full flex items-center justify-center font-mono font-bold text-sm shrink-0">0{i+1}</div>
                <h4 className="font-bold text-lg">{step.title}</h4>
              </div>
              <span className="text-xs font-mono tracking-widest uppercase opacity-70">{step.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </BaseSlide>
  );
}
