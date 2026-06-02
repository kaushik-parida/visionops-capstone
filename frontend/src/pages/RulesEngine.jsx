import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ShieldAlert, Plus, Layers, Search, Code, Activity, AlertTriangle, Info, Clock } from 'lucide-react';
import { useIntelligence } from '../context/IntelligenceContext';
import { cn } from '../lib/utils';

const OPERATIONAL_RULES = [
  {
    id: 'rule-occupancy',
    name: 'Occupancy Event',
    type: 'info',
    zone: 'Global',
    description: 'Logs the presence of personnel in the monitored zone for occupancy tracking.',
    trigger: 'Person detection count > 0',
    action: 'Log occupancy duration.',
    targetEntities: ['Person'],
  },
  {
    id: 'rule-overcrowding',
    name: 'Overcrowding Risk',
    type: 'warning',
    zone: 'Global',
    description: 'Detects if the number of people exceeds the safe capacity threshold for the area.',
    trigger: 'Person detection count > 8',
    action: 'Dispatch facility manager to check ventilation/capacity.',
    targetEntities: ['Person'],
  },
  {
    id: 'rule-unattended-asset',
    name: 'Potential Unattended Asset',
    type: 'warning',
    zone: 'Global',
    description: 'Identifies high-value assets left without any personnel in the immediate vicinity.',
    trigger: 'Laptop count > 0 AND Person count == 0',
    action: 'Alert security desk to secure high-value assets.',
    targetEntities: ['Laptop', 'Person'],
  },
  {
    id: 'rule-phone-density',
    name: 'Mobile Device Density Alert',
    type: 'info',
    zone: 'Global',
    description: 'Monitors areas for an unusually high concentration of mobile recording devices.',
    trigger: 'Cell Phone count >= 3',
    action: 'Monitor for unauthorized recording or secure facility breach.',
    targetEntities: ['Cell Phone'],
  },
  {
    id: 'rule-review-required',
    name: 'Review Required',
    type: 'critical',
    zone: 'Global',
    description: 'Flags unusual or potentially hazardous objects that do not belong in standard operational areas.',
    trigger: 'Detection of Backpack, Suitcase, Handbag, or Umbrella',
    action: 'Investigate potential security threat or left baggage.',
    targetEntities: ['Backpack', 'Suitcase', 'Handbag', 'Umbrella'],
  }
];

export default function RulesEngine() {
  const { addToast } = useOutletContext();
  const { eventHistory } = useIntelligence();
  const [selectedRuleId, setSelectedRuleId] = useState(OPERATIONAL_RULES[0].id);

  const selectedRule = OPERATIONAL_RULES.find(r => r.id === selectedRuleId);

  // Find last triggered event for the selected rule
  const lastTriggeredEvent = eventHistory.find(e => e.id.includes(selectedRuleId));

  return (
    <div className="flex flex-col h-full p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-end justify-between animate-slide-up">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
            <ShieldAlert className="text-indigo-400" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-display font-semibold text-[#F8FAFC]">Rules Engine</h1>
            <p className="text-xs font-mono text-[#94A3B8]">OPERATIONAL RISK LOGIC</p>
          </div>
        </div>
        <button 
          onClick={() => addToast('Creating custom rules requires Enterprise tier.', 'warning')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-md transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]"
        >
          <Plus size={16} />
          Create Custom Rule
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        
        {/* Rules List */}
        <div className="flex flex-col gap-4 border-r border-[#334155] pr-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
            <input 
              type="text" 
              placeholder="Search rules..." 
              className="w-full bg-[#111827] border border-[#334155] rounded-md py-2 pl-9 pr-4 text-sm text-[#F8FAFC] focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          
          <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-1">
            {OPERATIONAL_RULES.map(rule => {
              const hasTriggeredRecently = eventHistory.slice(0, 50).some(e => e.id.includes(rule.id));
              return (
                <RuleItem 
                  key={rule.id}
                  title={rule.name} 
                  zone={rule.zone} 
                  type={rule.type} 
                  active={hasTriggeredRecently} 
                  isSelected={selectedRuleId === rule.id}
                  onClick={() => setSelectedRuleId(rule.id)}
                />
              );
            })}
          </div>
        </div>

        {/* Rule Editor / Viewer */}
        <div className="lg:col-span-2 flex flex-col gap-6 pl-2">
          
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-semibold text-[#F8FAFC]">{selectedRule.name}</h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400">ENABLED</span>
              <div 
                onClick={() => addToast('System rules cannot be disabled.', 'error')}
                className="w-10 h-5 bg-emerald-500/20 rounded-full border border-emerald-500/50 flex items-center p-0.5 cursor-pointer hover:bg-emerald-500/30 transition-colors"
              >
                <div className="w-4 h-4 bg-emerald-500 rounded-full translate-x-5"></div>
              </div>
            </div>
          </div>

          <p className="text-sm text-[#94A3B8]">{selectedRule.description}</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#111827] border border-[#334155] p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2 text-[#94A3B8]">
                <Code size={16} />
                <span className="text-xs font-mono uppercase tracking-wider">Logic Trigger</span>
              </div>
              <p className="font-mono text-sm text-indigo-300 bg-indigo-500/10 p-2 rounded border border-indigo-500/20">
                {selectedRule.trigger}
              </p>
            </div>
            
            <div className="bg-[#111827] border border-[#334155] p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2 text-[#94A3B8]">
                <Activity size={16} />
                <span className="text-xs font-mono uppercase tracking-wider">System Action</span>
              </div>
              <p className="text-sm text-[#F8FAFC] bg-[#1F2937] p-2 rounded border border-[#334155]">
                {selectedRule.action}
              </p>
            </div>
          </div>

          {/* Target Entities */}
          <div>
            <h3 className="text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-2">Target Entities (COCO Classes)</h3>
            <div className="flex flex-wrap gap-2">
              {selectedRule.targetEntities.map(entity => (
                <span key={entity} className="px-3 py-1 bg-[#1F2937] border border-[#334155] text-xs font-medium text-[#F8FAFC] rounded-md">
                  {entity}
                </span>
              ))}
            </div>
          </div>

          {/* Last Triggered Status */}
          <div className="mt-auto border-t border-[#334155] pt-6">
            <h3 className="text-xs font-mono text-[#94A3B8] uppercase tracking-wider mb-4">Rule History</h3>
            {lastTriggeredEvent ? (
              <div className="flex items-start gap-4 p-4 rounded-lg bg-[#0B1220] border border-[#334155]">
                <div className={cn(
                  "p-2 rounded-lg border",
                  lastTriggeredEvent.type === 'critical' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                  lastTriggeredEvent.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' :
                  'bg-blue-500/10 border-blue-500/30 text-blue-400'
                )}>
                  {lastTriggeredEvent.type === 'critical' ? <AlertTriangle size={20} /> :
                   lastTriggeredEvent.type === 'warning' ? <AlertTriangle size={20} /> : <Info size={20} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-[#F8FAFC]">{lastTriggeredEvent.message}</p>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-[#94A3B8]">
                      <Clock size={12} />
                      {new Date(lastTriggeredEvent.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-1">{lastTriggeredEvent.recommendedAction}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#475569] italic">This rule has not been triggered in the current session.</p>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}

function RuleItem({ title, zone, type, active, isSelected, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "p-3 rounded border cursor-pointer transition-all duration-200 group flex flex-col gap-2",
        isSelected 
          ? "bg-indigo-600/10 border-indigo-500/50 shadow-[0_0_15px_rgba(79,70,229,0.1)]" 
          : "bg-[#111827] border-[#1F2937] hover:border-[#334155] hover:bg-[#1F2937]"
      )}
    >
      <div className="flex justify-between items-start">
        <h4 className={cn(
          "text-sm font-semibold transition-colors",
          isSelected ? "text-indigo-400" : "text-[#F8FAFC] group-hover:text-indigo-300"
        )}>
          {title}
        </h4>
        {active && <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>}
      </div>
      <div className="flex items-center gap-2">
        <span className="px-1.5 py-0.5 bg-[#0B1220] border border-[#334155] text-[9px] font-mono text-[#94A3B8] rounded">
          {zone}
        </span>
        <span className={cn(
          "px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded border",
          type === 'critical' ? 'text-red-400 border-red-500/30 bg-red-500/10' : 
          type === 'warning' ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' : 'text-blue-400 border-blue-500/30 bg-blue-500/10'
        )}>
          {type}
        </span>
      </div>
    </div>
  );
}
