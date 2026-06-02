import React from 'react';
import { motion } from 'framer-motion';
import { BaseSlide } from './BaseSlide';
import { RefreshCcw, Maximize, Database, AlertOctagon, CheckCircle2, Bug, ShieldX, Code } from 'lucide-react';

// --- SLIDE ENGINEERING CHALLENGES ---
export function SlideEngineeringChallenges() {
  const challenges = [
    { 
      title: "Bounding Box Scaling", 
      prob: "OpenCV returns absolute bounding boxes for a static 640x480 frame. The React UI scales dynamically via CSS.", 
      sol: "Implemented dynamic recalculation via Canvas getBoundingClientRect() to scale ratios universally.",
      lesson: "Decouple backend ML coordinates from frontend CSS dimensions."
    },
    { 
      title: "State Synchronization", 
      prob: "Backend generates events statelessly, but UI needs historical timeline without triggering complete re-renders.", 
      sol: "Deployed React Context API to manage a rolling 50-event queue, decoupling visual timeline from detection loop.",
      lesson: "Context API is highly effective for unidirectional data pipelines."
    }
  ];

  return (
    <BaseSlide subtitle="Implementation Reality" title="Engineering Challenges Solved">
      <div className="h-full flex items-center justify-center pt-4">
        <div className="grid grid-cols-5 gap-6 w-full max-w-6xl">
          
          {/* Left Column: UI Thread Freezing Solution (Code Snippet) */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="col-span-3 bg-[#0d1117] border border-executive-elevated rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[600px]">
            <div className="flex items-center justify-between border-b border-executive-elevated p-3 bg-executive-surface shrink-0">
              <div className="flex items-center gap-3 text-executive-secondary">
                <Code size={16} /> <span className="font-mono text-xs">src/pages/LiveMonitoring.jsx</span>
              </div>
              <div className="text-[10px] text-executive-success font-mono uppercase tracking-widest border border-executive-success/30 bg-executive-success/10 px-2 py-1 rounded shrink-0">UI Thread Protected</div>
            </div>
            
            <div className="p-5 flex-1 flex flex-col overflow-hidden">
              <h3 className="text-lg font-bold text-white mb-2 shrink-0">Challenge: HTTP Queue Stacking</h3>
              <p className="text-xs text-executive-secondary mb-4 shrink-0">Using <code className="text-executive-critical">setInterval(..., 30)</code> crashed the browser because the Python backend occasionally took &gt;100ms. The HTTP requests stacked up and exhausted Chrome's memory pool.</p>
              
              <div className="flex-1 overflow-y-auto bg-black/50 p-3 rounded-lg border border-executive-elevated">
                <pre className="text-[10px] font-mono leading-relaxed text-gray-300">
                  <code className="language-javascript">
{`const captureFrame = async () => {
  // 1. Wait until the PREVIOUS inference request completes
  if (isProcessingRef.current) return;
  isProcessingRef.current = true;

  try {
    const blob = await extractCanvasBlob();
    
    // 2. Await the FastAPI response before continuing
    const response = await fetch('/api/detect', {
      method: 'POST', body: formData
    });
    const results = await response.json();
    dispatchToContext(results);
    
  } finally {
    // 3. Unlock the thread and request the next frame immediately
    isProcessingRef.current = false;
    requestAnimationFrame(captureFrame); 
  }
};`}
                  </code>
                </pre>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Other Challenges */}
          <div className="col-span-2 flex flex-col gap-4">
            {challenges.map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
                className="bg-executive-surface border border-executive-elevated rounded-2xl p-5 shadow-xl relative overflow-hidden flex-1 flex flex-col justify-center"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-executive-accent"></div>
                <h3 className="text-sm font-bold text-executive-primary mb-3 ml-2">{c.title}</h3>
                
                <div className="space-y-3 ml-2">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest text-executive-critical flex items-center gap-2"><AlertOctagon size={12}/> Root Cause</h4>
                    <p className="text-[11px] text-executive-secondary leading-tight mt-1">{c.prob}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest text-executive-success flex items-center gap-2"><CheckCircle2 size={12}/> Resolution</h4>
                    <p className="text-[11px] text-white leading-tight mt-1">{c.sol}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
        </div>
      </div>
    </BaseSlide>
  );
}

// --- SLIDE EDGE CASE ANALYSIS ---
export function SlideEdgeCases() {
  return (
    <BaseSlide subtitle="Model Limitations" title="Machine Learning Edge Cases">
      <div className="h-full flex flex-col justify-center items-center">
        <div className="grid grid-cols-2 gap-8 w-full max-w-6xl">
          
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-executive-surface border border-executive-elevated rounded-3xl p-8 flex flex-col shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-executive-warning opacity-20"><Bug size={100} /></div>
            <h3 className="text-xl font-bold text-executive-primary mb-3 relative z-10">Feature Similarity (Mouse vs Phone)</h3>
            <p className="text-sm text-executive-secondary leading-relaxed mb-6 relative z-10">
              <strong>ML Root Cause:</strong> At 640x480 resolution, the convolutional layers extract identical edge features and pixel contours for a black wireless mouse and a smartphone lying flat. The COCO dataset lacks sufficient context for overhead angles.
            </p>
            <div className="mt-auto p-4 bg-executive-bg border-l-4 border-executive-success rounded-lg relative z-10">
              <span className="text-xs font-mono uppercase tracking-widest text-executive-success block mb-1">System Mitigation</span>
              <p className="text-sm text-white">Threshold tuning and Rule Density logic filtering isolated anomalies.</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-executive-surface border border-executive-elevated rounded-3xl p-8 flex flex-col shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 text-executive-warning opacity-20"><ShieldX size={100} /></div>
            <h3 className="text-xl font-bold text-executive-primary mb-3 relative z-10">Occlusion & Geometric Reflections</h3>
            <p className="text-sm text-executive-secondary leading-relaxed mb-6 relative z-10">
              <strong>ML Root Cause:</strong> The SSD model lacks 3D depth perception. Persons reflected in glass office walls produce high-confidence false positives. Furthermore, severe occlusions (desks covering 60% of a person) drop confidence below the NMS threshold.
            </p>
            <div className="mt-auto p-4 bg-executive-bg border-l-4 border-executive-success rounded-lg relative z-10">
              <span className="text-xs font-mono uppercase tracking-widest text-executive-success block mb-1">System Mitigation</span>
              <p className="text-sm text-white">Implementation of static polygon exclusion zones (Spatial Masking) for operators.</p>
            </div>
          </motion.div>

        </div>
      </div>
    </BaseSlide>
  );
}

// --- SLIDE PERFORMANCE CONSTRAINTS ---
export function SlidePerformance() {
  const metrics = [
    { label: "Measured Engine Latency", value: "85ms", context: "Per-frame execution strictly on CPU.", color: "text-executive-success" },
    { label: "Pipeline Frame Rate", value: "12 FPS", context: "Hard bottlenecked by OpenCV DNN forward pass.", color: "text-executive-warning" },
    { label: "Container Memory", value: "850 MB", context: "Includes FastAPI overhead + TF Weights.", color: "text-executive-success" },
    { label: "Cloud Bandwidth", value: "0 MB/s", context: "100% Edge Processing. Zero payload transfer.", color: "text-executive-success" }
  ];

  return (
    <BaseSlide subtitle="System Metrics" title="Performance Constraints">
      <div className="h-full flex items-center justify-center">
        <div className="grid grid-cols-2 gap-6 w-full max-w-6xl">
          {metrics.map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-executive-surface border border-executive-elevated rounded-3xl p-8 flex flex-col relative overflow-hidden shadow-2xl"
            >
              <div className={`absolute top-0 left-0 w-2 h-full bg-current opacity-50 ${m.color}`}></div>
              <h4 className="text-sm font-mono text-executive-secondary uppercase tracking-widest mb-2 ml-4">{m.label}</h4>
              <p className={`text-5xl font-display font-bold mb-4 ml-4 ${m.color}`}>{m.value}</p>
              <p className="text-sm text-executive-primary bg-executive-bg border border-executive-elevated py-3 px-4 rounded-xl ml-4">{m.context}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </BaseSlide>
  );
}
