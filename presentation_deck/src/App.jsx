import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, LayoutGrid, MonitorPlay, FileText, Mic, HelpCircle, Code } from 'lucide-react';

import { 
  SlideHero, SlideProblemStatement, SlideObjectives, SlideBusinessFlow
} from './components/slides/SlideGroupSummary';

import { 
  SlideRuntimeArchitecture, SlideDetectionPipeline, SlideFrontendArchitecture, SlideBackendArchitecture, SlideStateManagement
} from './components/slides/SlideGroupArchitecture';

import {
  SlideWhyReact, SlideWhyFastAPI, SlideWhySQLite, SlideModelMatrix
} from './components/slides/SlideGroupTechDecisions';

import { 
  SlideEngineeringChallenges, SlideEdgeCases, SlidePerformance
} from './components/slides/SlideGroupEngineering';

import { 
  SlideDemoPrep, SlideScalabilityDesign, SlideFutureRoadmap, SlideVisionStatement 
} from './components/slides/SlideGroupOperations';

import { SLIDE_NOTES, SME_QUESTIONS, CODE_EXPLANATION } from './components/PresenterNotes';

const SLIDES = [
  SlideHero, 
  SlideProblemStatement,
  SlideObjectives,
  SlideBusinessFlow, 
  SlideRuntimeArchitecture, 
  SlideDetectionPipeline, 
  SlideFrontendArchitecture,
  SlideBackendArchitecture,
  SlideStateManagement,
  SlideWhyReact,
  SlideWhyFastAPI,
  SlideWhySQLite,
  SlideModelMatrix,
  SlideEngineeringChallenges,
  SlideEdgeCases,
  SlidePerformance,
  SlideDemoPrep, 
  SlideScalabilityDesign,
  SlideFutureRoadmap, 
  SlideVisionStatement
];

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mode, setMode] = useState('presentation'); // 'presentation' | 'overview' | 'presenter'
  const [activeTab, setActiveTab] = useState('notes'); // 'notes' | 'sme' | 'code'

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        if (mode !== 'overview') setCurrentSlide(prev => Math.min(prev + 1, SLIDES.length - 1));
      } else if (e.key === 'ArrowLeft') {
        if (mode !== 'overview') setCurrentSlide(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        setMode('presentation');
      } else if (e.key === 'o' || e.key === 'O') {
        setMode(prev => prev === 'overview' ? 'presentation' : 'overview');
      } else if (e.key === 'p' || e.key === 'P') {
        setMode(prev => prev === 'presenter' ? 'presentation' : 'presenter');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode]);

  const CurrentSlideComponent = SLIDES[currentSlide];
  const NextSlideComponent = currentSlide < SLIDES.length - 1 ? SLIDES[currentSlide + 1] : null;

  // Retrieve notes for current slide
  const currentNotes = SLIDE_NOTES[currentSlide] || { say: "No notes.", why: "", q: "" };

  // --- OVERVIEW MODE ---
  if (mode === 'overview') {
    return (
      <div className="min-h-screen bg-executive-bg p-8 text-executive-primary">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-display font-bold">Slide Overview ({SLIDES.length} Slides)</h1>
          <button onClick={() => setMode('presentation')} className="px-4 py-2 bg-executive-surface border border-executive-elevated rounded-lg">Exit Overview (Esc)</button>
        </div>
        <div className="grid grid-cols-6 gap-4">
          {SLIDES.map((Slide, i) => (
            <div 
              key={i} 
              onClick={() => { setCurrentSlide(i); setMode('presentation'); }}
              className={`aspect-video bg-executive-surface border-2 rounded-xl overflow-hidden cursor-pointer hover:border-executive-accent transition-colors relative ${currentSlide === i ? 'border-executive-accent' : 'border-executive-elevated'}`}
            >
              <div className="absolute top-2 left-2 z-10 bg-black/80 text-white text-xs px-2 py-1 rounded font-mono border border-white/10">{i + 1}</div>
              <div className="origin-top-left scale-[0.16] w-[625%] h-[625%] pointer-events-none">
                <Slide />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- PRESENTER MODE ---
  if (mode === 'presenter') {
    return (
      <div className="min-h-screen h-screen bg-black text-white flex flex-col overflow-hidden">
        <div className="h-16 bg-executive-bg border-b border-executive-elevated flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4 text-executive-success font-mono font-bold">
            <MonitorPlay /> PRESENTER VIEW <span className="text-executive-secondary ml-4">({currentSlide + 1} / {SLIDES.length})</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 0))}
              className="px-3 py-1 bg-executive-surface rounded border border-executive-elevated text-xs"
            >PREV</button>
            <button 
              onClick={() => setCurrentSlide(prev => Math.min(prev + 1, SLIDES.length - 1))}
              className="px-3 py-1 bg-executive-surface rounded border border-executive-elevated text-xs"
            >NEXT</button>
            <button onClick={() => setMode('presentation')} className="px-4 py-1 ml-4 bg-executive-accent rounded text-sm text-white">Exit Presenter (Esc)</button>
          </div>
        </div>

        <div className="flex-1 flex min-h-0">
          
          {/* Left Column: Slide Previews */}
          <div className="w-1/2 flex flex-col border-r border-executive-elevated bg-executive-bg">
            <div className="flex-1 p-8 flex flex-col min-h-0">
              <h2 className="text-executive-secondary font-mono text-sm mb-2 uppercase tracking-widest">Current Slide (Live)</h2>
              <div className="flex-1 bg-executive-surface rounded-xl border-2 border-executive-accent overflow-hidden relative shadow-2xl">
                 <div className="absolute inset-0 pointer-events-none">
                   <CurrentSlideComponent />
                 </div>
              </div>
            </div>
            <div className="h-1/3 p-8 pt-0 flex flex-col min-h-0">
              <h2 className="text-executive-secondary font-mono text-sm mb-2 uppercase tracking-widest">Next Slide</h2>
              <div className="flex-1 bg-executive-surface rounded-xl border border-executive-elevated overflow-hidden opacity-50 relative">
                 <div className="absolute inset-0 pointer-events-none">
                   {NextSlideComponent && <NextSlideComponent />}
                 </div>
              </div>
            </div>
          </div>

          {/* Right Column: Presenter Dashboard */}
          <div className="w-1/2 flex flex-col bg-executive-surface overflow-hidden">
            
            {/* Tabs */}
            <div className="flex border-b border-executive-elevated shrink-0">
              <button 
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'notes' ? 'border-executive-accent text-white' : 'border-transparent text-executive-secondary hover:text-white'}`}
              ><Mic size={16} /> Current Slide Notes</button>
              <button 
                onClick={() => setActiveTab('sme')}
                className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'sme' ? 'border-executive-warning text-white' : 'border-transparent text-executive-secondary hover:text-white'}`}
              ><HelpCircle size={16} /> SME Bank (100 Qs)</button>
              <button 
                onClick={() => setActiveTab('code')}
                className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-bold border-b-2 transition-colors ${activeTab === 'code' ? 'border-executive-success text-white' : 'border-transparent text-executive-secondary hover:text-white'}`}
              ><Code size={16} /> Code Appendix</button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 p-8 overflow-y-auto">
              
              {/* TAB 1: Slide Notes (Dynamic) */}
              {activeTab === 'notes' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-white mb-6 border-b border-executive-elevated pb-4">Script & Strategy</h3>
                  
                  <div className="bg-executive-bg p-6 rounded-xl border-l-4 border-executive-accent shadow-lg">
                    <h4 className="text-xs font-mono text-executive-accent uppercase tracking-widest mb-2">What to say</h4>
                    <p className="text-lg text-white leading-relaxed">{currentNotes.say}</p>
                  </div>

                  <div className="bg-executive-bg p-6 rounded-xl border-l-4 border-executive-success shadow-lg">
                    <h4 className="text-xs font-mono text-executive-success uppercase tracking-widest mb-2">Why it matters (Strategy)</h4>
                    <p className="text-md text-executive-secondary">{currentNotes.why}</p>
                  </div>

                  <div className="bg-executive-warning/10 p-6 rounded-xl border border-executive-warning/30 shadow-lg">
                    <h4 className="text-xs font-mono text-executive-warning uppercase tracking-widest mb-2">Expected SME Trap Question</h4>
                    <p className="text-md text-white font-bold">{currentNotes.q}</p>
                    <p className="text-xs text-executive-secondary mt-2 italic">* Refer to the SME Bank tab for full answers *</p>
                  </div>
                </div>
              )}

              {/* TAB 2: SME Bank */}
              {activeTab === 'sme' && (
                <div className="space-y-8 pb-12">
                  <div className="bg-executive-warning/10 border border-executive-warning text-executive-warning p-4 rounded-lg text-sm mb-6 flex items-start gap-3">
                    <HelpCircle className="shrink-0" />
                    <p><strong>SME Question Bank:</strong> 100 highly-technical questions organized by engineering domain to defend the architecture during the review.</p>
                  </div>

                  {SME_QUESTIONS.map((section, idx) => (
                    <div key={idx} className="bg-executive-bg rounded-xl p-6 border border-executive-elevated shadow-lg">
                      <h4 className="text-lg font-bold text-executive-primary mb-4">{section.category}</h4>
                      <div className="space-y-4">
                        {section.questions.map((q, qIdx) => (
                          <div key={qIdx} className="bg-executive-surface p-4 rounded-lg border border-executive-elevated">
                            <p className="text-white font-bold mb-2 text-sm leading-relaxed">Q: {q.q}</p>
                            <p className="text-executive-secondary text-sm leading-relaxed"><span className="text-executive-accent font-bold">A:</span> {q.a}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: Code Appendix */}
              {activeTab === 'code' && (
                <div className="space-y-8 pb-12">
                  <div className="bg-executive-success/10 border border-executive-success text-executive-success p-4 rounded-lg text-sm mb-6 flex items-start gap-3">
                    <Code className="shrink-0" />
                    <p><strong>Code Review Appendix:</strong> Internal logic flows to answer implementation questions immediately.</p>
                  </div>

                  {CODE_EXPLANATION.map((section, idx) => (
                    <div key={idx} className="bg-executive-bg rounded-xl p-6 border border-executive-elevated shadow-lg">
                      <h4 className="text-lg font-bold text-executive-accent mb-2">{section.module}</h4>
                      <p className="text-sm text-executive-primary mb-4 italic">{section.purpose}</p>
                      
                      <div className="space-y-3">
                        {section.files.map((file, fIdx) => (
                          <div key={fIdx} className="flex gap-4 p-3 bg-executive-surface rounded-lg border border-executive-elevated">
                            <span className="font-mono text-xs text-executive-warning shrink-0">{file.name}</span>
                            <span className="text-xs text-executive-secondary">{file.role}</span>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2 mt-4 p-4 bg-executive-surface rounded-lg border border-executive-elevated">
                        {section.flow.map((step, sIdx) => (
                          <p key={sIdx} className="text-sm text-executive-secondary font-mono">{step}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- STANDARD PRESENTATION MODE ---
  return (
    <div className="h-screen w-screen bg-executive-bg text-executive-primary overflow-hidden flex flex-col relative selection:bg-executive-accent/30">
      
      {/* Slide Container (Strict Viewport) */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 flex"
          >
            <CurrentSlideComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Toolbar Footer */}
      <div className="h-12 border-t border-executive-elevated flex items-center justify-between px-6 bg-executive-bg/80 backdrop-blur shrink-0 relative z-50">
        <div className="text-executive-secondary font-mono text-xs tracking-widest flex items-center gap-4 uppercase">
          VISIONOPS <span className="w-1 h-1 rounded-full bg-executive-elevated"></span> Architecture Review Board
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-executive-secondary">
            <button onClick={() => setMode('overview')} className="p-1 hover:text-white transition-colors" title="Overview (O)"><LayoutGrid size={16} /></button>
            <button onClick={() => setMode('presenter')} className="p-1 hover:text-executive-success transition-colors" title="Presenter View (P)"><MonitorPlay size={16} /></button>
          </div>
          
          <div className="flex items-center gap-4 border-l border-executive-elevated pl-6">
            <button 
              onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 0))}
              disabled={currentSlide === 0}
              className="text-executive-secondary hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="font-mono text-sm text-executive-secondary w-16 text-center">
              {currentSlide + 1} / {SLIDES.length}
            </div>
            <button 
              onClick={() => setCurrentSlide(prev => Math.min(prev + 1, SLIDES.length - 1))}
              disabled={currentSlide === SLIDES.length - 1}
              className="text-executive-secondary hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div 
          className="absolute top-0 left-0 h-[1px] bg-executive-accent transition-all duration-300"
          style={{ width: `${((currentSlide + 1) / SLIDES.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
