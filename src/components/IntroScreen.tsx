import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'motion/react';
import { Brain, ChevronRight } from 'lucide-react';

interface IntroScreenProps {
  onEnter: () => void;
}

export default function IntroScreen({ onEnter }: IntroScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Constants for fixed, robust, and mathematically accurate layout across all screens
  const TRACK_WIDTH = 280;
  const HANDLE_WIDTH = 52;
  const PADDING = 3; // matching p-[3px]
  const DRAG_RANGE = TRACK_WIDTH - HANDLE_WIDTH - (PADDING * 2); // 280 - 52 - 6 = 222

  // Framer motion drag tracking
  const x = useMotionValue(0);
  
  // Create transforms for the background glow and slider progression
  const opacity = useTransform(x, [0, DRAG_RANGE], [1, 0]);
  const scale = useTransform(x, [0, DRAG_RANGE], [1, 1.05]);
  const bgGlowOpacity = useTransform(x, [0, DRAG_RANGE], [0.15, 0.6]);
  const widthTransform = useTransform(x, (latestX) => `${latestX + HANDLE_WIDTH}px`);

  // Monitor drag changes to unlock when it reaches the threshold
  useEffect(() => {
    const unsubscribe = x.on('change', (latestX) => {
      if (latestX >= DRAG_RANGE - 2 && !isUnlocked) {
        setIsUnlocked(true);
        // Subtle delay for transition polish before triggering enter
        setTimeout(() => {
          onEnter();
        }, 150);
      }
    });
    return () => unsubscribe();
  }, [DRAG_RANGE, isUnlocked, onEnter, x]);

  // Smoothly snap back if let go before unlocking
  const handleDragEnd = () => {
    if (x.get() < DRAG_RANGE - 2) {
      animate(x, 0, { type: 'spring', stiffness: 220, damping: 24 });
    }
  };

  // Hypnotic Tunnel Optical Illusion Canvas Background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const dpr = window.devicePixelRatio || 1;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const initCanvas = () => {
      if (!canvas || !ctx) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    initCanvas();

    const handleResize = () => {
      initCanvas();
    };
    window.addEventListener('resize', handleResize);

    let frame = 0;

    const draw = () => {
      if (!ctx || !canvas) return;
      frame++;

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const maxRadius = Math.sqrt(cx * cx + cy * cy);

      // Draw futuristic grid matrix lines in the far background
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.012)';
      ctx.lineWidth = 1;
      const gridSpacing = 60;
      for (let i = 0; i < width; i += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let j = 0; j < height; j += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(width, j);
        ctx.stroke();
      }

      // Draw Hypnotic Concentric Spiral / Illusion Tunnel
      ctx.save();
      ctx.translate(cx, cy);

      // Deterministic particle system drifting from the center of the illusion
      const numParticles = 40;
      for (let p = 0; p < numParticles; p++) {
        // Deterministic angle based on golden ratio for maximum organic distribution
        const angle = (p * 2.39996) % (Math.PI * 2);
        const speed = 0.4 + (p % 4) * 0.15;
        // Radial progress loop
        const progress = (frame * speed + p * (maxRadius / numParticles)) % maxRadius;
        
        // Spiral swirl distortion
        const spiralAngle = angle + (progress * 0.0015);
        
        const px = Math.cos(spiralAngle) * progress;
        const py = Math.sin(spiralAngle) * progress;
        
        // Soft fading at boundaries
        const opacityVal = Math.sin((progress / maxRadius) * Math.PI) * 0.22;
        
        const hue = p % 2 === 0 ? 190 : 275;
        ctx.fillStyle = `hsla(${hue}, 90%, 65%, ${opacityVal})`;
        
        ctx.beginPath();
        ctx.arc(px, py, 1 + (p % 2), 0, Math.PI * 2);
        ctx.fill();
      }

      const rings = 12;
      const t = frame * 0.005; // Ultra-smooth, cinematic speed

      for (let r = rings; r > 0; r--) {
        const radius = (r / rings) * maxRadius * 1.25;
        // Smooth multi-frequency oscillation for organic breathing depth
        const pulse = Math.sin(t * 1.5 + r * 0.35) * 10 + Math.cos(t * 0.8 - r * 0.2) * 6;
        const finalRadius = radius + pulse;

        if (finalRadius <= 0) continue;

        // Visual pattern complexity
        const segments = 16;
        const baseWidth = 1 + (1 - r / rings) * 3;

        for (let s = 0; s < segments; s++) {
          const angleStart = (s / segments) * Math.PI * 2 + t * (r % 2 === 0 ? 0.4 : -0.4);
          const angleEnd = ((s + 0.5) / segments) * Math.PI * 2 + t * (r % 2 === 0 ? 0.4 : -0.4);

          const hue = (190 + r * 12) % 360;

          // Layer 1: Glow Halo Underlay
          ctx.strokeStyle = `hsla(${hue}, 90%, 60%, ${0.05 + (1 - r / rings) * 0.12})`;
          ctx.lineWidth = baseWidth * 2.5;
          ctx.beginPath();
          ctx.arc(0, 0, finalRadius, angleStart, angleEnd);
          ctx.stroke();

          // Layer 2: Main sharp neon core segment
          ctx.strokeStyle = `hsla(${hue}, 95%, 65%, ${0.15 + (1 - r / rings) * 0.38})`;
          ctx.lineWidth = baseWidth;
          ctx.beginPath();
          ctx.arc(0, 0, finalRadius, angleStart, angleEnd);
          ctx.stroke();
        }

        // Draw geometric star spokes to anchor illusion rotation
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const spokeAngle = (i / 6) * Math.PI * 2 + t * 0.1;
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(spokeAngle) * finalRadius, Math.sin(spokeAngle) * finalRadius);
        }
        ctx.stroke();
      }

      ctx.restore();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-black select-none font-sans">
      {/* Visual illusion canvas background */}
      <canvas ref={canvasRef} className="absolute inset-0 block z-0" />

      {/* Cyber overlay effects */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/80 pointer-events-none z-10" />
      <div className="scanline absolute inset-0 pointer-events-none z-10" />

      {/* Dynamic glow linked to slide trigger */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full filter blur-[100px] pointer-events-none z-10 bg-gradient-to-tr from-cyan-500/20 to-purple-500/25"
        style={{ opacity: bgGlowOpacity }}
      />

      {/* Central Brand & Typography Container - Perfect Mathematical Center */}
      <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none p-6">
        <motion.div 
          style={{ scale }}
          className="flex flex-col items-center text-center max-w-lg pointer-events-auto"
        >
          {/* Logo with pulsating tech rings */}
          <motion.div 
            initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-20 h-20 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center shadow-2xl backdrop-blur-xl mb-6 relative group"
          >
            <div className="absolute inset-[-1px] rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 opacity-20 group-hover:opacity-100 blur transition-opacity duration-1000" />
            <div className="absolute inset-[3px] rounded-xl bg-black flex items-center justify-center z-10">
              <Brain className="w-10 h-10 text-cyan-400" />
            </div>
          </motion.div>

          {/* Clean VayuMind AI display title */}
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-display font-bold tracking-tight text-white"
          >
            VayuMind <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">AI</span>
          </motion.h1>
        </motion.div>
      </div>

      {/* Bottom Swipe Button Container */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-[280px] flex flex-col items-center z-20 px-4">
        {/* Drag Track */}
        <div className="relative w-[280px] h-[58px] rounded-full p-[3px] bg-white/[0.02] backdrop-blur-md border border-white/[0.08] shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] overflow-hidden">
          
          {/* Track Fill Progress Indicator */}
          <motion.div 
            className="absolute left-[3px] top-[3px] bottom-[3px] rounded-full bg-gradient-to-r from-cyan-500/25 to-purple-500/25 border-r border-cyan-400/40"
            style={{ width: widthTransform }}
          />

          {/* Swipe text hint centered inside track */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-white/20 uppercase select-none">
              SWIPE TO ENTER
            </span>
          </div>

          {/* Draggable Handle */}
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: DRAG_RANGE }}
            dragElastic={0}
            dragMomentum={false}
            onDragEnd={handleDragEnd}
            style={{ x }}
            className="w-[52px] h-[50px] rounded-full bg-white flex items-center justify-center cursor-grab active:cursor-grabbing shadow-[0_4px_12px_rgba(0,255,255,0.25)] relative group z-30"
            animate={{
              boxShadow: isUnlocked 
                ? "0 0 24px rgba(168, 85, 247, 0.8)" 
                : "0 4px 12px rgba(6, 182, 212, 0.25)"
            }}
          >
            {/* Glowing ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 opacity-20 group-hover:opacity-40 transition-opacity" />
            
            {/* Inner circle */}
            <div className="w-[44px] h-[44px] rounded-full bg-black flex items-center justify-center">
              <ChevronRight className="w-5 h-5 text-cyan-400 group-hover:text-purple-400 transition-colors" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
