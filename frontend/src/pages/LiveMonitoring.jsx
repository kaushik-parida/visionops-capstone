/**
 * LiveMonitoring.jsx
 *
 * THE REAL-TIME OBJECT DETECTION ENGINE.
 *
 * This component is responsible for the entire webcam inference pipeline:
 *
 * 1. getUserMedia() — requests browser camera access.
 * 2. Inference Loop — uses a self-referencing async function (NOT setInterval)
 *    to avoid request stacking. Each frame waits for the server response
 *    before capturing the next one.
 * 3. Frame Capture — captures a 640x480 frame from the live video element
 *    onto an offscreen canvas, converts to JPEG Blob, and POST-s to the backend.
 * 4. Bounding Box Overlay — draws the returned [x, y, w, h] bounding boxes
 *    onto a transparent <canvas> layered directly over the <video> element.
 * 5. Event Push — calls pushDetectionResult() on the IntelligenceContext,
 *    which triggers event deduplication and appends real events to the feed.
 * 6. Snapshot — also calls toDataURL on the capture canvas so each event
 *    stores a base64 image for investigation review.
 *
 * API CALL:
 *   POST http://127.0.0.1:8000/api/detect
 *   Body: FormData { file: <JPEG Blob>, conf_threshold: 0.45 }
 *   Response: { detections: [{label, confidence, bbox:[x,y,w,h]}], latency_ms, width, height }
 */

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import {
  Activity, Square, Play, Cpu, Wifi, Camera,
  AlertCircle, ChevronRight, Clock
} from 'lucide-react';
import { useIntelligence, getClassColor } from '../context/IntelligenceContext';
import { cn } from '../lib/utils';

const API_BASE = 'http://127.0.0.1:8000';
const CAPTURE_WIDTH = 640;
const CAPTURE_HEIGHT = 480;
// SSD MobileNet V2 scores on typical indoor webcam scenes range from 0.20-0.60.
// A threshold of 0.45 was silently filtering out all detections.
const CONF_THRESHOLD = 0.20;

export default function LiveMonitoring() {
  const { addToast } = useOutletContext();
  const navigate = useNavigate();
  const {
    isMonitoring,
    latestDetections,
    eventHistory,
    currentLatency,
    fps,
    systemStatus,
    startMonitoring,
    stopMonitoring,
    pushDetectionResult,
    updateFps,
  } = useIntelligence();

  // DOM Refs
  const videoRef = useRef(null);
  const scenarioImgRef = useRef(null);     // for static scenarios
  const overlayCanvasRef = useRef(null);   // shown to user — bounding boxes
  const captureCanvasRef = useRef(null);   // offscreen — frame capture
  const streamRef = useRef(null);          // MediaStream handle
  const loopActiveRef = useRef(false);     // controls the inference loop
  const frameCountRef = useRef(0);
  const fpsTimerRef = useRef(null);

  const [backendOnline, setBackendOnline] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [inferenceError, setInferenceError] = useState(null);

  // Scenario Mode State
  const [dataSource, setDataSource] = useState('camera'); // 'camera' | 'scenario'
  const [selectedScenario, setSelectedScenario] = useState('normal_office.png');

  const SCENARIOS = [
    { id: 'normal_office.png', name: 'Normal Office' },
    { id: 'unauthorized_presence.png', name: 'Unauthorized Presence' },
    { id: 'safety_hazard.png', name: 'Safety Hazard' },
    { id: 'unattended_asset.png', name: 'Unattended Asset' },
    { id: 'overcrowding.png', name: 'Overcrowding' },
  ];

  // ─── CHECK BACKEND HEALTH ─────────────────────────────────────────────────
  useEffect(() => {
    fetch(`${API_BASE}/api/status`)
      .then(r => r.json())
      .then(data => setBackendOnline(data.status === 'active'))
      .catch(() => setBackendOnline(false));
  }, []);

  // ─── DRAW BOUNDING BOXES ──────────────────────────────────────────────────
  const drawOverlay = useCallback((detections, vidW, vidH) => {
    const canvas = overlayCanvasRef.current;
    if (!canvas) return;

    // Use getBoundingClientRect for reliable dimensions (offsetWidth can be 0 before layout)
    const rect = canvas.getBoundingClientRect();
    const displayW = rect.width || canvas.offsetWidth;
    const displayH = rect.height || canvas.offsetHeight;
    if (!displayW || !displayH) return;

    canvas.width = displayW;
    canvas.height = displayH;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, displayW, displayH);

    // The model returns pixel coords relative to the CAPTURE dimensions (640x480)
    // We must scale them to fit the display canvas dimensions.
    const scaleX = displayW / CAPTURE_WIDTH;
    const scaleY = displayH / CAPTURE_HEIGHT;

    for (const det of detections) {
      const [bx, by, bw, bh] = det.bbox;
      const x = bx * scaleX;
      const y = by * scaleY;
      const w = bw * scaleX;
      const h = bh * scaleY;
      const color = getClassColor(det.label);
      const conf = Math.round(det.confidence * 100);
      const label = `${det.label.toUpperCase()} ${conf}%`;

      // Box
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);

      // Box fill (subtle)
      ctx.fillStyle = color + '18';
      ctx.fillRect(x, y, w, h);

      // Label background
      const fontSize = 11;
      ctx.font = `bold ${fontSize}px "JetBrains Mono", monospace`;
      const textW = ctx.measureText(label).width;
      ctx.fillStyle = color;
      ctx.fillRect(x - 1, y - fontSize - 6, textW + 8, fontSize + 6);

      // Label text
      ctx.fillStyle = '#000000';
      ctx.fillText(label, x + 3, y - 4);
    }
  }, []);

  // ─── INFERENCE LOOP ───────────────────────────────────────────────────────
  // Uses a recursive async function — waits for each HTTP response before
  // scheduling the next frame. This prevents request stacking.
  const runInferenceLoop = useCallback(async () => {
    if (!loopActiveRef.current) return;

    const captureCanvas = captureCanvasRef.current;
    if (!captureCanvas) return;

    const ctx = captureCanvas.getContext('2d');
    captureCanvas.width = CAPTURE_WIDTH;
    captureCanvas.height = CAPTURE_HEIGHT;

    // Draw from correct source
    if (dataSource === 'camera') {
      const video = videoRef.current;
      if (!video || video.readyState < 2) {
        if (loopActiveRef.current) requestAnimationFrame(runInferenceLoop);
        return;
      }
      ctx.drawImage(video, 0, 0, CAPTURE_WIDTH, CAPTURE_HEIGHT);
    } else {
      const img = scenarioImgRef.current;
      if (!img || !img.complete) {
        if (loopActiveRef.current) requestAnimationFrame(runInferenceLoop);
        return;
      }
      ctx.drawImage(img, 0, 0, CAPTURE_WIDTH, CAPTURE_HEIGHT);
    }

    // Convert to JPEG blob (quality 0.7 for speed)
    captureCanvas.toBlob(async (blob) => {
      if (!blob || !loopActiveRef.current) return;

      // Capture base64 snapshot for investigation history
      const snapshot = captureCanvas.toDataURL('image/jpeg', 0.5);

      const formData = new FormData();
      formData.append('file', blob, 'frame.jpg');

      console.log(`[VisionOps] Request Sent | size=${blob.size}b | threshold=${CONF_THRESHOLD}`);

      try {
        const t0 = performance.now();
        const resp = await fetch(
          `${API_BASE}/api/detect?conf_threshold=${CONF_THRESHOLD}&nms_threshold=0.4&model_variant=coco`,
          { method: 'POST', body: formData }
        );

        // Explicitly check for non-200 responses — don't silently ignore HTTP 500
        if (!resp.ok) {
          const errText = await resp.text();
          console.error(`[VisionOps] Backend Error ${resp.status}:`, errText);
          setInferenceError(`Backend error ${resp.status}: ${errText.slice(0, 120)}`);
          if (loopActiveRef.current) requestAnimationFrame(runInferenceLoop);
          return;
        }

        const data = await resp.json();
        const latencyMs = Math.round(performance.now() - t0);

        console.log(`[VisionOps] Response Received | detections=${data.detections?.length ?? 0} | latency=${latencyMs}ms`);
        if (data.detections?.length > 0) {
          data.detections.forEach(d => {
            console.log(`  -> ${d.label} conf=${d.confidence.toFixed(3)} bbox=[${d.bbox.join(', ')}]`);
          });
        }

        if (loopActiveRef.current) {
          setInferenceError(null);
          // Push to global context (triggers event generation)
          pushDetectionResult({
            detections: data.detections || [],
            latencyMs,
            snapshot,
          });

          // Draw bounding boxes
          drawOverlay(data.detections || [], data.width, data.height);

          // FPS count
          frameCountRef.current += 1;
        }
      } catch (err) {
        console.error('[VisionOps] Network/Inference error:', err);
        setInferenceError(`Network error: ${err.message}`);
      }

      // Schedule next frame AFTER response is processed
      if (loopActiveRef.current) {
        requestAnimationFrame(runInferenceLoop);
      }
    }, 'image/jpeg', 0.7);
  }, [dataSource, pushDetectionResult, drawOverlay]);

  // ─── FPS COUNTER ──────────────────────────────────────────────────────────
  const handleStart = async () => {
    setCameraError(null);
    setInferenceError(null);

    if (dataSource === 'camera') {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: CAPTURE_WIDTH, height: CAPTURE_HEIGHT, facingMode: 'environment' }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setCameraError(`Camera access denied: ${err.message}`);
        return;
      }
    }

    startMonitoring();
    loopActiveRef.current = true;
    frameCountRef.current = 0;
    
    if (fpsTimerRef.current) clearInterval(fpsTimerRef.current);
    fpsTimerRef.current = setInterval(() => {
      if (loopActiveRef.current) {
        updateFps(frameCountRef.current);
        frameCountRef.current = 0;
      }
    }, 1000);

    runInferenceLoop();
  };

  const handleStop = () => {
    loopActiveRef.current = false;
    if (fpsTimerRef.current) {
      clearInterval(fpsTimerRef.current);
      fpsTimerRef.current = null;
    }
    if (streamRef.current && dataSource === 'camera') {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    const canvas = overlayCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    stopMonitoring();
  };

  // Cleanup on unmount
  useEffect(() => () => { loopActiveRef.current = false; }, []);

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full p-6 gap-5 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
            <Activity className="text-blue-400" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-display font-semibold text-[#F8FAFC]">Live Monitoring</h1>
            <p className="text-xs font-mono text-[#94A3B8] uppercase tracking-widest">Real-Time Object Detection Engine</p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-3">
          <StatusPill
            icon={Wifi}
            label="Model"
            active={backendOnline}
            activeText="Connected"
            inactiveText="Offline"
          />
          <StatusPill
            icon={Camera}
            label="Camera"
            active={systemStatus.cameraConnected}
            activeText="Connected"
            inactiveText="Inactive"
          />
          <StatusPill
            icon={Activity}
            label="Monitoring"
            active={isMonitoring}
            activeText="LIVE"
            inactiveText="Idle"
            pulse
          />
        </div>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-5 min-h-0">

        {/* ── LEFT: Camera Feed + Overlay ── */}
        <div className="col-span-2 flex flex-col gap-4 min-h-0">

          {/* Perf Metrics */}
          {isMonitoring && (
            <div className="flex items-center gap-4 shrink-0">
              <MetricChip icon={Cpu} label="FPS" value={fps} />
              <MetricChip icon={Clock} label="Latency" value={currentLatency != null ? `${currentLatency}ms` : '—'} />
              <MetricChip icon={Activity} label="Detections" value={latestDetections.length} />
            </div>
          )}

          {/* Source Toggle */}
          <div className="flex gap-2 p-1 bg-[#111827] border border-[#334155] rounded-lg">
            <button
              onClick={() => setDataSource('camera')}
              className={cn(
                "flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors",
                dataSource === 'camera' ? "bg-[#1F2937] text-white shadow" : "text-[#94A3B8] hover:text-white"
              )}
            >
              Live Camera
            </button>
            <button
              onClick={() => setDataSource('scenario')}
              className={cn(
                "flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors",
                dataSource === 'scenario' ? "bg-[#1F2937] text-white shadow" : "text-[#94A3B8] hover:text-white"
              )}
            >
              Scenario Simulator
            </button>
          </div>

          {/* Scenario Selector */}
          {dataSource === 'scenario' && (
            <div className="flex items-center gap-3 shrink-0 bg-[#0B1220] border border-[#334155] p-2 rounded-lg">
              <span className="text-xs font-mono text-[#94A3B8] uppercase">Load Scenario:</span>
              <div className="flex gap-2">
                {SCENARIOS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedScenario(s.id)}
                    className={cn(
                      "px-3 py-1.5 text-xs rounded transition-colors",
                      selectedScenario === s.id
                        ? "bg-emerald-600/20 border border-emerald-500/50 text-emerald-400 font-bold"
                        : "bg-[#111827] border border-[#334155] text-[#94A3B8] hover:border-[#475569] hover:text-[#F8FAFC]"
                    )}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Video / Scenario Container */}
          <div className="relative flex-1 bg-black rounded-xl border border-[#334155] overflow-hidden min-h-0">

            {/* Video element */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              playsInline
              style={{ display: dataSource === 'camera' && isMonitoring ? 'block' : 'none' }}
            />

            {/* Scenario Image element */}
            <img
              ref={scenarioImgRef}
              src={`/scenarios/${selectedScenario}`}
              crossOrigin="anonymous"
              className="w-full h-full object-cover"
              style={{ display: dataSource === 'scenario' ? 'block' : 'none' }}
              alt="Scenario"
            />

            {/* Bounding box overlay canvas — sits exactly on top */}
            <canvas
              ref={overlayCanvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ display: isMonitoring ? 'block' : 'none' }}
            />

            {/* Offscreen capture canvas (hidden) */}
            <canvas ref={captureCanvasRef} className="hidden" />

            {/* Idle State / Error State */}
            {!isMonitoring && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                {cameraError ? (
                  <>
                    <AlertCircle size={48} className="text-red-400" />
                    <p className="text-sm text-red-300 text-center max-w-xs px-4">{cameraError}</p>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <Camera size={36} className="text-blue-500/50" />
                    </div>
                    <div className="text-center">
                      <p className="text-[#94A3B8] text-sm mb-1">Webcam feed is inactive</p>
                      <p className="text-[#475569] text-xs">Click Start Monitoring to begin live inference</p>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Live badge */}
            {isMonitoring && (
              <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 bg-black/60 border border-white/10 rounded-lg backdrop-blur">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-mono font-bold text-white">LIVE</span>
              </div>
            )}

            {/* Camera label */}
            {isMonitoring && (
              <div className="absolute top-3 right-3 px-3 py-1.5 bg-black/60 border border-white/10 rounded-lg backdrop-blur">
                <span className="text-xs font-mono text-[#94A3B8]">CAM_01_WEBCAM</span>
              </div>
            )}
          </div>

          {/* Start / Stop Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            {!isMonitoring ? (
              <button
                onClick={handleStart}
                disabled={!backendOnline}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
                  backendOnline
                    ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)]"
                    : "bg-[#1F2937] text-[#475569] cursor-not-allowed border border-[#334155]"
                )}
              >
                <Play size={16} />
                Start Monitoring
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-semibold text-white transition-all duration-200 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
              >
                <Square size={16} />
                Stop Monitoring
              </button>
            )}

            {!backendOnline && (
              <p className="text-xs text-red-400 font-mono">
                ⚠ Backend offline. Start the FastAPI server on port 8000.
              </p>
            )}
            {inferenceError && (
              <p className="text-xs text-red-400 font-mono bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg max-w-xs">
                ⚠ {inferenceError}
              </p>
            )}
          </div>
        </div>

        {/* ── RIGHT: Current Detections + Event Feed ── */}
        <div className="flex flex-col gap-4 min-h-0">

          {/* Active Detections */}
          <div className="shrink-0">
            <h3 className="text-xs font-mono text-[#94A3B8] uppercase tracking-widest mb-3">Active Detections</h3>
            <div className="flex flex-col gap-2">
              {latestDetections.length === 0 ? (
                <p className="text-xs text-[#475569] font-mono py-2">No objects in frame</p>
              ) : (
                latestDetections.slice(0, 6).map((det, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#111827] border border-[#334155]">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: getClassColor(det.label) }} />
                      <span className="text-sm font-medium text-[#F8FAFC] capitalize">{det.label}</span>
                    </div>
                    <span className="text-xs font-mono font-bold" style={{ color: getClassColor(det.label) }}>
                      {Math.round(det.confidence * 100)}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="w-full h-px bg-[#334155] shrink-0" />

          {/* Intelligence Feed */}
          <div className="flex flex-col gap-2 flex-1 min-h-0">
            <div className="flex items-center justify-between shrink-0">
              <h3 className="text-xs font-mono text-[#94A3B8] uppercase tracking-widest">Intelligence Feed</h3>
              <button
                onClick={() => navigate('/')}
                className="text-[10px] font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
              >
                View All <ChevronRight size={10} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2 min-h-0">
              {eventHistory.length === 0 ? (
                <p className="text-xs text-[#475569] font-mono pt-2">
                  No events yet. Start monitoring to generate real events.
                </p>
              ) : (
                eventHistory.slice(0, 25).map((ev) => (
                  <button
                    key={ev.id}
                    onClick={() => setSelectedEvent(ev)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border transition-colors group",
                      ev.type === 'critical'
                        ? 'bg-red-500/10 border-red-500/25 hover:bg-red-500/20'
                        : ev.type === 'warning'
                          ? 'bg-yellow-500/10 border-yellow-500/25 hover:bg-yellow-500/20'
                          : 'bg-[#111827] border-[#334155] hover:bg-[#1F2937]'
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span
                        className="text-[10px] font-mono font-bold uppercase tracking-wider"
                        style={{ color: getClassColor(ev.label) }}
                      >
                        {ev.label}
                      </span>
                      <span className="text-[10px] font-mono text-[#475569] shrink-0">
                        {new Date(ev.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-[#F8FAFC]">{ev.message}</p>
                    {ev.confidence != null && (
                      <p className="text-[10px] font-mono text-[#94A3B8] mt-0.5">
                        Confidence: {Math.round(ev.confidence * 100)}%
                      </p>
                    )}
                    <p className="text-[10px] text-blue-400 mt-2 group-hover:text-blue-300 transition-colors">
                      Click to investigate →
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── INVESTIGATION MODAL ── */}
      {selectedEvent && (
        <InvestigationModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}

// ─── SUB-COMPONENTS ────────────────────────────────────────────────────────

function StatusPill({ icon: Icon, label, active, activeText, inactiveText, pulse }) {
  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors",
      active
        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
        : "bg-[#111827] border-[#334155] text-[#475569]"
    )}>
      {active && pulse
        ? <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        : <Icon size={12} />
      }
      <span>{label}: {active ? activeText : inactiveText}</span>
    </div>
  );
}

function MetricChip({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111827] border border-[#334155] rounded-lg">
      <Icon size={12} className="text-[#94A3B8]" />
      <span className="text-[10px] font-mono text-[#94A3B8]">{label}</span>
      <span className="text-xs font-mono font-bold text-[#F8FAFC]">{value}</span>
    </div>
  );
}

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
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#334155] flex items-center justify-between">
          <div>
            <h2 className="font-display font-semibold text-[#F8FAFC] text-lg">Investigation Workspace</h2>
            <p className="text-xs font-mono text-[#94A3B8] mt-0.5">
              {new Date(event.timestamp).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[#1F2937] transition-colors text-[#94A3B8] hover:text-[#F8FAFC]"
          >
            ✕
          </button>
        </div>

        <div className="p-6 flex gap-6">
          {/* Snapshot */}
          <div className="w-64 shrink-0">
            <p className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-widest mb-2">Snapshot</p>
            {event.snapshot ? (
              <img
                src={event.snapshot}
                alt="Detection snapshot"
                className="w-full rounded-lg border border-[#334155] object-cover"
              />
            ) : (
              <div className="w-full aspect-video bg-[#0B1220] rounded-lg border border-[#334155] flex items-center justify-center">
                <Camera size={24} className="text-[#334155]" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col gap-4">
            <div>
              <p className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-widest mb-2">Trigger Event</p>
              <div className={cn(
                "px-3 py-2 rounded-lg border text-sm font-medium",
                event.type === 'critical' ? 'bg-red-500/10 border-red-500/30 text-red-300'
                  : event.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
                    : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
              )}>
                {event.message}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-widest mb-2">
                Objects Detected ({event.allDetections?.length ?? 0})
              </p>
              <div className="flex flex-col gap-2">
                {event.allDetections?.length > 0 ? (
                  event.allDetections.map((det, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#0B1220] border border-[#334155]">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: getClassColor(det.label) }} />
                        <span className="text-sm capitalize text-[#F8FAFC]">{det.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-[#94A3B8]">
                          [{det.bbox.join(', ')}]
                        </span>
                        <span className="text-xs font-mono font-bold" style={{ color: getClassColor(det.label) }}>
                          {Math.round(det.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#475569] font-mono">Object left the scene — no active detections.</p>
                )}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-mono text-[#94A3B8] uppercase tracking-widest mb-2">Metadata</p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="px-3 py-2 bg-[#0B1220] rounded-lg border border-[#334155]">
                  <p className="text-[#475569]">Zone</p>
                  <p className="text-[#F8FAFC] font-bold mt-0.5">{event.zone}</p>
                </div>
                <div className="px-3 py-2 bg-[#0B1220] rounded-lg border border-[#334155]">
                  <p className="text-[#475569]">Severity</p>
                  <p className={cn("font-bold mt-0.5 uppercase",
                    event.type === 'critical' ? 'text-red-400'
                      : event.type === 'warning' ? 'text-yellow-400'
                        : 'text-blue-400'
                  )}>{event.type}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
