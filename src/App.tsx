/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Brain, Layers, History, ShieldAlert, Info, Menu, Settings } from 'lucide-react';
import GlassPanel from './components/GlassPanel';
import NeuralCanvas from './components/NeuralCanvas';
import ControlPanel from './components/ControlPanel';
import MetricsPanel from './components/MetricsPanel';
import AIGuide from './components/AIGuide';
import NeuralUniverse from './components/NeuralUniverse';
import SideMenu from './components/SideMenu';
import IntroScreen from './components/IntroScreen';
import { NeuralConfig, PuterAIResponse } from './types';

const DEFAULT_CONFIG: NeuralConfig = {
  pattern_type: 'rotating-snakes',
  brain_goal: 'General Perception Enhancement',
  speed: 1.0,
  difficulty: 0.5,
  color_palette: ['#00ffff', '#ff00ff', '#ffffff', '#000000'],
  visual_style: 'minimal',
  training_mode: 'focus'
};

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [config, setConfig] = useState<NeuralConfig>(DEFAULT_CONFIG);
  const [isPaused, setIsPaused] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(true);
  const [guideMessage, setGuideMessage] = useState('Welcome to VayuMind AI. Select a training mode to begin your cognitive evolution.');
  const [scores, setScores] = useState({
    focus: 450,
    reaction: 320,
    accuracy: 88,
    peripheral: 150,
    adaptability: 65
  });
  const [sessions, setSessions] = useState<any[]>([]);
  const [systemStatus, setSystemStatus] = useState({ cpu: 12, mem: 45, net: 88 });

  // Simulate system status updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStatus({
        cpu: Math.floor(Math.random() * 20 + 10),
        mem: Math.floor(Math.random() * 10 + 40),
        net: Math.floor(Math.random() * 20 + 80)
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Load sessions from Puter.js
  useEffect(() => {
    if (window.puter) {
      window.puter.fs.read('vayu_sessions.json')
        .then((data: string) => {
          try {
            setSessions(JSON.parse(data));
          } catch (e) {
            console.error('Failed to parse sessions', e);
          }
        })
        .catch(() => {
          // File might not exist yet
          console.log('No previous sessions found');
        });
    }
  }, []);

  // Save session when training ends or periodically
  const saveSession = useCallback(() => {
    if (window.puter) {
      const newSession = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        mode: config.training_mode,
        pattern: config.pattern_type,
        scores: { ...scores }
      };
      
      const updatedSessions = [newSession, ...sessions].slice(0, 50);
      setSessions(updatedSessions);
      window.puter.fs.write('vayu_sessions.json', JSON.stringify(updatedSessions));
    }
  }, [config, scores, sessions]);

  const handleAISpeak = useCallback(async (text: string) => {
    if (window.puter) {
      try {
        await window.puter.ai.txt2speech(text);
      } catch (e) {
        console.error('Puter TTS failed', e);
      }
    }
  }, []);

  const handleGenerateAI = async (prompt: string) => {
    setIsGenerating(true);
    setGuideMessage('Synthesizing neural pattern locally...');

    // Simulate AI latency
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock AI response
    const mockConfig = {
      pattern_type: 'spiral-motion',
      brain_goal: 'Enhanced Focus',
      speed: 1.2,
      difficulty: 0.6,
      color_palette: ['#ff00ff', '#00ffff', '#ffff00', '#000000'],
      visual_style: 'psychedelic',
      training_mode: 'focus',
      texture_url: 'https://picsum.photos/seed/neural/800/800'
    };

    setConfig(prev => ({
      ...prev,
      ...mockConfig
    }));
    
    setGuideMessage(`Neural pattern generated locally: ${mockConfig.brain_goal}.`);
    setIsGenerating(false);
  };

  // Simulate score updates
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setScores(prev => ({
        focus: Math.max(0, prev.focus + (Math.random() * 10 - 4)),
        reaction: Math.max(0, prev.reaction + (Math.random() * 6 - 3)),
        accuracy: Math.min(100, Math.max(0, prev.accuracy + (Math.random() * 2 - 1))),
        peripheral: Math.max(0, prev.peripheral + (Math.random() * 8 - 4)),
        adaptability: Math.min(100, Math.max(0, prev.adaptability + (Math.random() * 4 - 2)))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isPaused]);

  if (!hasEntered) {
    return <IntroScreen onEnter={() => setHasEntered(true)} />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col overflow-x-hidden relative bg-black">
      <SideMenu 
        isOpen={isSideMenuOpen} 
        onClose={() => setIsSideMenuOpen(false)} 
        onSelectModule={(module) => {
          setGuideMessage(`Switching to ${module}...`);
        }}
      />

      {/* Top Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4 flex items-center justify-between bg-black/50 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSideMenuOpen(true)} className="p-2 text-white/70 hover:text-white">
            <Menu className="w-6 h-6" />
          </button>
          <div className="w-8 h-8 rounded-lg bg-white/90 flex items-center justify-center">
            <Brain className="text-black w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-display font-bold tracking-[-0.02em] text-white/90">VayuMind AI OS</h1>
          </div>
        </div>
        <nav className="flex items-center gap-2">
          <button className="glass-button text-white">Lab</button>
        </nav>
      </header>

      {/* Main Content - Fullscreen Canvas */}
      <main className="flex-1 relative w-full h-screen">
        <div className="absolute inset-0">
          <NeuralCanvas config={config} isPaused={isPaused} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/40" />
        </div>

        {/* Floating Controls */}
        {isControlPanelOpen ? (
          <div className="absolute top-20 left-4 z-40 w-full max-w-xs">
            <GlassPanel className="p-4">
              <ControlPanel 
                config={config} 
                setConfig={setConfig} 
                isPaused={isPaused} 
                setIsPaused={setIsPaused}
                onGenerateAI={handleGenerateAI}
                isGenerating={isGenerating}
                onClose={() => setIsControlPanelOpen(false)}
              />
            </GlassPanel>
          </div>
        ) : (
          <button 
            onClick={() => setIsControlPanelOpen(true)}
            className="absolute top-20 left-4 z-40 glass-button text-white p-3"
          >
            <Settings className="w-4 h-4" />
          </button>
        )}

        {/* Bottom Metrics Panel */}
        <div className="absolute bottom-4 right-4 z-40 w-full max-w-xs">
          <GlassPanel className="p-4">
            <MetricsPanel scores={scores} />
          </GlassPanel>
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="flex items-center justify-between text-[8px] font-mono uppercase tracking-[0.3em] text-white/20 border-t border-white/5 pt-4 px-4">
        <div className="flex gap-6">
          <span className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-cyan-500 animate-pulse" />
            CPU: {systemStatus.cpu}%
          </span>
          <span className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-purple-500 animate-pulse" />
            MEM: {systemStatus.mem}%
          </span>
          <span className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            NET: {systemStatus.net}ms
          </span>
        </div>
        <div className="flex items-center gap-2 text-white/5">
          <ShieldAlert className="w-2.5 h-2.5" />
          System Secure
        </div>
      </footer>

      <NeuralUniverse />

      {/* Subtle Background Accents */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/[0.03] rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
