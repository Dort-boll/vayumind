import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Volume2, VolumeX } from 'lucide-react';

interface AIGuideProps {
  message: string;
  onSpeak?: (text: string) => void;
}

const AIGuide: React.FC<AIGuideProps> = ({ message, onSpeak }) => {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!isMuted && message && onSpeak) {
      onSpeak(message);
    }
  }, [message, isMuted]);

  return (
    <div className="flex items-start gap-4">
      <div className="relative">
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-10 h-10 rounded-lg bg-white/[0.02] backdrop-blur-xl border border-white/[0.05] flex items-center justify-center relative z-10 shadow-xl"
        >
          <Bot className="w-4 h-4 text-white/40" />
        </motion.div>
        <div className="absolute inset-0 bg-white/[0.02] rounded-lg blur-lg" />
      </div>
      
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[8px] font-mono uppercase tracking-[0.3em] text-white/20">VayuMind AI Guide</span>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="text-white/10 hover:text-white/30 transition-colors"
          >
            {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
          </button>
        </div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-sm text-white/50 leading-relaxed italic font-serif"
          >
            "{message}"
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIGuide;
