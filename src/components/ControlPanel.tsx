import React, { useState } from 'react';
import { Settings, Play, Pause, RefreshCw, Zap, Eye, Target, Brain, Activity, MessageSquare, X } from 'lucide-react';
import { NeuralConfig, PatternType } from '../types';

interface ControlPanelProps {
  config: NeuralConfig;
  setConfig: (config: NeuralConfig) => void;
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
  onGenerateAI: (prompt: string) => void;
  isGenerating: boolean;
  onClose: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  config, 
  setConfig, 
  isPaused, 
  setIsPaused, 
  onGenerateAI,
  isGenerating,
  onClose
}) => {
  const [prompt, setPrompt] = useState('');

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onGenerateAI(prompt);
    }
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-display font-bold flex items-center gap-2">
          <Settings className="w-3 h-3 text-white/30" />
          Neural Controls
        </h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsPaused(!isPaused)}
            className="glass-button text-white"
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <form onSubmit={handlePromptSubmit} className="space-y-3">
        <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/20">AI Brain Engine</label>
        <div className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Improve peripheral focus..."
            className="w-full bg-white/[0.02] border border-white/[0.05] rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-white/10 transition-colors pr-12 text-white/70 placeholder:text-white/10"
          />
          <button 
            type="submit"
            disabled={isGenerating}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/50 hover:text-white disabled:opacity-50"
          >
            {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          </button>
        </div>
      </form>

      <div className="space-y-4 overflow-y-auto pr-2">
        <div className="space-y-2">
          <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/20">Pattern Algorithm</label>
          <select 
            value={config.pattern_type}
            onChange={(e) => setConfig({ ...config, pattern_type: e.target.value as PatternType })}
            className="w-full bg-white/[0.02] backdrop-blur-md border border-white/[0.05] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-white/10 transition-all cursor-pointer text-white/30"
          >
            <optgroup label="2D Algorithms" className="bg-black">
              <option value="rotating-snakes">Rotating Snakes</option>
              <option value="peripheral-drift">Peripheral Drift</option>
              <option value="hermann-grid">Hermann Grid</option>
              <option value="scintillating-grid">Scintillating Grid</option>
              <option value="spiral-motion">Spiral Motion</option>
              <option value="troxler-fading">Troxler Fading</option>
              <option value="kanizsa-triangle">Kanizsa Triangle</option>
              <option value="motion-aftereffect">Motion Aftereffect</option>
              <option value="radial-expansion">Radial Expansion</option>
              <option value="fractal-zoom">Fractal Zoom</option>
              <option value="pulsating-waves">Pulsating Waves</option>
              <option value="pattern-recognition">Pattern Recognition</option>
              <option value="cognitive-tracking">Cognitive Tracking</option>
              <option value="muller-lyer">Müller-Lyer Illusion</option>
              <option value="ebbinghaus">Ebbinghaus Illusion</option>
              <option value="poggendorff">Poggendorff Illusion</option>
            </optgroup>
            <optgroup label="GPU Accelerated" className="bg-black">
              <option value="gpu-fractal">Neural Fractal (GPU)</option>
              <option value="gpu-noise">Cognitive Noise (GPU)</option>
              <option value="gpu-particles">Synaptic Particles (GPU)</option>
            </optgroup>
          </select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/20">Intensity / Speed</label>
            <span className="text-[9px] font-mono text-white/10">{config.speed.toFixed(1)}x</span>
          </div>
          <input 
            type="range" min="0.1" max="5" step="0.1"
            value={config.speed}
            onChange={(e) => setConfig({ ...config, speed: parseFloat(e.target.value) })}
            className="w-full accent-white/20 bg-white/[0.01] h-px rounded-full appearance-none cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/20">Neural Difficulty</label>
            <span className="text-[9px] font-mono text-white/10">{Math.round(config.difficulty * 100)}%</span>
          </div>
          <input 
            type="range" min="0" max="1" step="0.01"
            value={config.difficulty}
            onChange={(e) => setConfig({ ...config, difficulty: parseFloat(e.target.value) })}
            className="w-full accent-white/20 bg-white/[0.01] h-px rounded-full appearance-none cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/20">Visual Style</label>
          <select 
            value={config.visual_style}
            onChange={(e) => setConfig({ ...config, visual_style: e.target.value as 'minimal' | 'complex' | 'psychedelic' })}
            className="w-full bg-white/[0.02] backdrop-blur-md border border-white/[0.05] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-white/10 transition-all cursor-pointer text-white/30"
          >
            <option value="minimal">Minimal</option>
            <option value="complex">Complex</option>
            <option value="psychedelic">Psychedelic</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setConfig({ ...config, training_mode: 'focus' })}
            className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${config.training_mode === 'focus' ? 'bg-white/5 border-white/10 text-white' : 'bg-white/[0.01] border-white/[0.03] text-white/20 hover:bg-white/[0.03]'}`}
          >
            <Target className="w-3 h-3" />
            <span className="text-[8px] font-mono uppercase tracking-widest">Focus</span>
          </button>
          <button 
            onClick={() => setConfig({ ...config, training_mode: 'peripheral' })}
            className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${config.training_mode === 'peripheral' ? 'bg-white/5 border-white/10 text-white' : 'bg-white/[0.01] border-white/[0.03] text-white/20 hover:bg-white/[0.03]'}`}
          >
            <Eye className="w-3 h-3" />
            <span className="text-[8px] font-mono uppercase tracking-widest">Peripheral</span>
          </button>
          <button 
            onClick={() => setConfig({ ...config, training_mode: 'reaction' })}
            className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${config.training_mode === 'reaction' ? 'bg-white/5 border-white/10 text-white' : 'bg-white/[0.01] border-white/[0.03] text-white/20 hover:bg-white/[0.03]'}`}
          >
            <Activity className="w-3 h-3" />
            <span className="text-[8px] font-mono uppercase tracking-widest">Reaction</span>
          </button>
          <button 
            onClick={() => setConfig({ ...config, training_mode: 'pattern' })}
            className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${config.training_mode === 'pattern' ? 'bg-white/5 border-white/10 text-white' : 'bg-white/[0.01] border-white/[0.03] text-white/20 hover:bg-white/[0.03]'}`}
          >
            <Brain className="w-3 h-3" />
            <span className="text-[8px] font-mono uppercase tracking-widest">Pattern</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
