import React, { useEffect, useRef, useState } from 'react';
import { NeuralConfig } from '../types';
import { ILLUSION_ALGORITHMS } from '../illusionAlgorithms';
import { WebGLRenderer } from '../webgl/WebGLRenderer';
import { getDevicePerformance } from '../utils/device';

interface NeuralCanvasProps {
  config: NeuralConfig;
  isPaused: boolean;
}

const NeuralCanvas: React.FC<NeuralCanvasProps> = ({ config, isPaused }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glCanvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(null);
  const startTimeRef = useRef<number>(Date.now());
  const webglRendererRef = useRef<WebGLRenderer | null>(null);
  const textureImageRef = useRef<HTMLImageElement | null>(null);
  const [performance, setPerformance] = useState<'low' | 'medium' | 'high'>('medium');

  const isGPU = config.pattern_type.startsWith('gpu-');

  useEffect(() => {
    setPerformance(getDevicePerformance());
  }, []);

  useEffect(() => {
    if (config.texture_url) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = config.texture_url;
      img.onload = () => {
        textureImageRef.current = img;
      };
      img.onerror = () => {
        console.error('Texture image failed to load');
        textureImageRef.current = null;
      };
    } else {
      textureImageRef.current = null;
    }
  }, [config.texture_url]);

  const animate = (time: number) => {
    if (isPaused) {
      requestRef.current = requestAnimationFrame(animate);
      return;
    }

    const elapsed = Date.now() - startTimeRef.current;
    
    // Performance scaling
    const scaleFactor = performance === 'low' ? 0.5 : performance === 'medium' ? 0.75 : 1.0;
    const adjustedDifficulty = config.difficulty * scaleFactor;

    if (isGPU) {
      const canvas = glCanvasRef.current;
      if (canvas) {
        if (!webglRendererRef.current) {
          const gl = canvas.getContext('webgl', { antialias: performance === 'high' });
          if (gl) {
            webglRendererRef.current = new WebGLRenderer(gl);
          }
        }
        if (webglRendererRef.current) {
          webglRendererRef.current.render(
            config.pattern_type,
            elapsed,
            canvas.width,
            canvas.height,
            adjustedDifficulty,
            config.speed,
            config.color_palette,
            performance
          );
        }
      }
    } else {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d', { alpha: false });
        if (ctx) {
          const { width, height } = canvas;
          ctx.clearRect(0, 0, width, height);
          ctx.fillStyle = '#000';
          ctx.fillRect(0, 0, width, height);
          const algorithm = ILLUSION_ALGORITHMS[config.pattern_type];
          if (algorithm) {
            algorithm(ctx, width, height, elapsed, adjustedDifficulty, config.speed, config.color_palette);
          }

          // Overlay AI Texture
          if (textureImageRef.current && config.visual_style !== 'minimal') {
            ctx.save();
            ctx.globalAlpha = config.visual_style === 'psychedelic' ? 0.3 : 0.15;
            ctx.globalCompositeOperation = config.visual_style === 'psychedelic' ? 'overlay' : 'soft-light';
            
            // Draw texture scaled to cover
            const img = textureImageRef.current;
            const imgRatio = img.width / img.height;
            const canvasRatio = width / height;
            let drawW, drawH, drawX, drawY;

            if (imgRatio > canvasRatio) {
              drawH = height;
              drawW = height * imgRatio;
              drawX = (width - drawW) / 2;
              drawY = 0;
            } else {
              drawW = width;
              drawH = width / imgRatio;
              drawX = 0;
              drawY = (height - drawH) / 2;
            }

            ctx.drawImage(img, drawX, drawY, drawW, drawH);
            ctx.restore();
          }
        }
      }
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const glCanvas = glCanvasRef.current;
    const container = canvas?.parentElement;

    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (canvas) {
          canvas.width = width;
          canvas.height = height;
        }
        if (glCanvas) {
          glCanvas.width = width;
          glCanvas.height = height;
        }
      }
    });

    resizeObserver.observe(container);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      resizeObserver.disconnect();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [config, isPaused, performance]);

  return (
    <div className="w-full h-full relative overflow-hidden rounded-xl border border-white/5 bg-black">
      <canvas
        ref={canvasRef}
        className={`w-full h-full block absolute inset-0 ${isGPU ? 'hidden' : 'z-0'}`}
      />
      <canvas
        ref={glCanvasRef}
        className={`w-full h-full block absolute inset-0 ${!isGPU ? 'hidden' : 'z-0'}`}
      />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_4px,3px_100%] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-transparent to-black/60" />
    </div>
  );
};

export default NeuralCanvas;
