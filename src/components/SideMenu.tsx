import React from 'react';
import { Brain, Layers, History, Info, X } from 'lucide-react';
import GlassPanel from './GlassPanel';

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (module: string) => void;
}

export default function SideMenu({ isOpen, onClose, onSelectModule }: SideMenuProps) {
  return (
    <div className={`fixed inset-y-0 left-0 z-[100] flex transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <GlassPanel className="w-64 h-full p-6 flex flex-col gap-6 relative z-[101]">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display font-bold text-white">Modules</h2>
          <button onClick={onClose} className="text-white/50 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex flex-col gap-2">
          {['NeuroLab', 'Perception Lab', 'Memory Lab', 'Focus Lab', 'Decision Lab'].map((module) => (
            <button 
              key={module} 
              onClick={() => {
                onSelectModule(module);
                onClose();
              }}
              className="text-left px-4 py-3 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-white/70 hover:text-white transition-colors"
            >
              {module}
            </button>
          ))}
        </nav>
      </GlassPanel>
    </div>
  );
}
