import React, { useState } from 'react';
import { Activity, Target, Zap, Eye, TrendingUp, Brain, ChevronDown, ChevronUp } from 'lucide-react';

interface MetricsPanelProps {
  scores: {
    focus: number;
    reaction: number;
    accuracy: number;
    peripheral: number;
    adaptability: number;
  };
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ scores }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const metrics = [
    { label: 'Focus Score', value: scores.focus, icon: Target, color: 'text-white', max: 1000 },
    { label: 'Reaction Time', value: scores.reaction, icon: Zap, color: 'text-white', max: 1000 },
    { label: 'Accuracy', value: scores.accuracy, icon: Activity, color: 'text-white', max: 100 },
    { label: 'Peripheral Shift', value: scores.peripheral, icon: Eye, color: 'text-white', max: 1000 },
    { label: 'Adaptability', value: scores.adaptability, icon: Brain, color: 'text-white', max: 100 },
  ];

  return (
    <div className="flex flex-col gap-4 md:gap-6 h-full">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <h2 className="text-base font-display font-bold flex items-center gap-2">
          <TrendingUp className="w-3 h-3 text-white/30" />
          Neural Metrics
        </h2>
        {isExpanded ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 overflow-y-auto pr-1">
          {metrics.map((m, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <m.icon className={`w-3 h-3 text-white/20`} />
                  <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-white/30">{m.label}</span>
                </div>
                <span className={`text-xs font-mono font-bold text-white/50`}>
                  {m.max === 100 ? `${Math.round(m.value)}%` : Math.round(m.value)}
                </span>
              </div>
              <div className="h-px w-full bg-white/[0.02] rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-white/20 transition-all duration-500`} 
                  style={{ width: `${Math.min(100, (m.value / m.max) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {isExpanded && (
        <div className="mt-auto p-4 bg-white/[0.01] border border-white/[0.03] rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-1 rounded-full bg-white/20 animate-pulse" />
            <p className="text-[8px] font-mono text-white/20 uppercase tracking-[0.2em]">AI Recommendation</p>
          </div>
          <p className="text-xs text-white/40 leading-relaxed italic font-serif">
            {scores.adaptability < 70 
              ? "Neural plasticity detected at sub-optimal levels. Initiating disruption protocols."
              : "Cognitive adaptability is at peak efficiency. Deploying high-complexity engagement."}
          </p>
        </div>
      )}
    </div>
  );
};

export default MetricsPanel;
