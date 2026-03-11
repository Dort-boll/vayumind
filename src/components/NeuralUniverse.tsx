import React, { useEffect, useRef } from 'react';
import { WebGLRenderer } from '../webgl/WebGLRenderer';
import { getDevicePerformance } from '../utils/device';

const NeuralUniverse: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<WebGLRenderer | null>(null);
  const requestRef = useRef<number>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    rendererRef.current = new WebGLRenderer(gl);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (canvas) {
          canvas.width = width;
          canvas.height = height;
        }
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    } else {
      resizeObserver.observe(document.body);
    }

    const animate = (time: number) => {
      if (rendererRef.current && canvas) {
        const perf = getDevicePerformance();
        rendererRef.current.render(
          'universe' as any,
          time,
          canvas.width,
          canvas.height,
          1,
          1,
          ['#00ffff', '#ff00ff'],
          perf
        );
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      resizeObserver.disconnect();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-20 w-full h-full pointer-events-none opacity-10"
    />
  );
};

export default NeuralUniverse;
