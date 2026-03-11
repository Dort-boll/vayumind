import { PatternType } from './types';

export const ILLUSION_ALGORITHMS: Partial<Record<PatternType, (ctx: CanvasRenderingContext2D, width: number, height: number, time: number, difficulty: number, speed: number, colors: string[]) => void>> = {
  'rotating-snakes': (ctx, w, h, t, d, s, colors) => {
    const centerX = w / 2;
    const centerY = h / 2;
    const count = 6 + Math.floor(d * 4);
    const radius = Math.min(w, h) * 0.35;
    
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + t * 0.001 * s;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      // Draw snake circle
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle + Math.PI / 2);
      
      const segments = 12;
      for (let j = 0; j < segments; j++) {
        const segAngle = (j / segments) * Math.PI * 2;
        ctx.fillStyle = colors[j % colors.length];
        ctx.beginPath();
        ctx.arc(Math.cos(segAngle) * 30, Math.sin(segAngle) * 30, 10, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  },

  'peripheral-drift': (ctx, w, h, t, d, s, colors) => {
    const size = 40 + (1 - d) * 40;
    for (let x = 0; x < w; x += size) {
      for (let y = 0; y < h; y += size) {
        const offset = Math.sin(t * 0.002 * s + (x + y) * 0.01) * 5;
        ctx.fillStyle = colors[0];
        ctx.fillRect(x + offset, y, size * 0.8, size * 0.8);
        ctx.fillStyle = colors[1];
        ctx.fillRect(x + size * 0.1 + offset, y + size * 0.1, size * 0.6, size * 0.6);
      }
    }
  },

  'hermann-grid': (ctx, w, h, t, d, s, colors) => {
    const gap = 15;
    const size = 50 + (1 - d) * 50;
    ctx.fillStyle = colors[0] || '#fff';
    for (let x = gap; x < w; x += size + gap) {
      for (let y = gap; y < h; y += size + gap) {
        ctx.fillRect(x, y, size, size);
      }
    }
  },

  'scintillating-grid': (ctx, w, h, t, d, s, colors) => {
    const gap = 10;
    const size = 40;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = gap;
    for (let x = 0; x < w; x += size + gap) {
      ctx.beginPath(); ctx.moveTo(x + gap/2, 0); ctx.lineTo(x + gap/2, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += size + gap) {
      ctx.beginPath(); ctx.moveTo(0, y + gap/2); ctx.lineTo(w, y + gap/2); ctx.stroke();
    }
    
    for (let x = 0; x < w; x += size + gap) {
      for (let y = 0; y < h; y += size + gap) {
        const dist = Math.sqrt((x - w/2)**2 + (y - h/2)**2);
        const pulse = Math.sin(t * 0.005 * s - dist * 0.01) * 0.5 + 0.5;
        ctx.fillStyle = pulse > 0.8 ? '#fff' : '#000';
        ctx.beginPath();
        ctx.arc(x + gap/2, y + gap/2, gap * 0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },

  'spiral-motion': (ctx, w, h, t, d, s, colors) => {
    ctx.save();
    ctx.translate(w/2, h/2);
    ctx.rotate(t * 0.001 * s);
    for (let i = 0; i < 200; i++) {
      const angle = 0.1 * i;
      const x = (1 + angle) * Math.cos(angle);
      const y = (1 + angle) * Math.sin(angle);
      ctx.fillStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.arc(x * 2, y * 2, 2 + d * 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },

  'troxler-fading': (ctx, w, h, t, d, s, colors) => {
    const centerX = w / 2;
    const centerY = h / 2;
    const radius = 150;
    const count = 12;
    const activeIdx = Math.floor(t * 0.005 * s) % count;
    
    ctx.fillStyle = '#888';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('+', centerX, centerY + 10);

    for (let i = 0; i < count; i++) {
      if (i === activeIdx) continue;
      const angle = (i / count) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      ctx.fillStyle = 'rgba(255, 0, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  'kanizsa-triangle': (ctx, w, h, t, d, s, colors) => {
    const size = 100;
    const cx = w/2;
    const cy = h/2;
    
    const drawPacman = (x: number, y: number, rotation: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(0, 0, 40, 0.2 * Math.PI, 1.8 * Math.PI);
      ctx.lineTo(0, 0);
      ctx.fill();
      ctx.restore();
    };

    drawPacman(cx - size, cy + size, -Math.PI/4);
    drawPacman(cx + size, cy + size, Math.PI + Math.PI/4);
    drawPacman(cx, cy - size, Math.PI/2);
  },

  'motion-aftereffect': (ctx, w, h, t, d, s, colors) => {
    ctx.save();
    ctx.translate(w/2, h/2);
    const rings = 20;
    for (let i = 0; i < rings; i++) {
      const r = (i * 20 + t * 0.05 * s) % (rings * 20);
      ctx.strokeStyle = i % 2 === 0 ? colors[0] : colors[1];
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  },

  'color-adaptation': (ctx, w, h, t, d, s, colors) => {
    const phase = Math.floor(t * 0.0002 * s) % 2;
    if (phase === 0) {
      ctx.fillStyle = '#0ff';
      ctx.fillRect(0, 0, w/2, h);
      ctx.fillStyle = '#f0f';
      ctx.fillRect(w/2, 0, w/2, h);
    } else {
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, w, h);
    }
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(w/2, h/2, 5, 0, Math.PI * 2); ctx.fill();
  },

  'radial-expansion': (ctx, w, h, t, d, s, colors) => {
    ctx.save();
    ctx.translate(w/2, h/2);
    const lines = 36;
    for (let i = 0; i < lines; i++) {
      const angle = (i / lines) * Math.PI * 2;
      const length = (t * 0.1 * s + i * 10) % (w/2);
      ctx.strokeStyle = colors[i % colors.length];
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * length, Math.sin(angle) * length);
      ctx.lineTo(Math.cos(angle) * (length + 50), Math.sin(angle) * (length + 50));
      ctx.stroke();
    }
    ctx.restore();
  },

  'checker-shadow': (ctx, w, h, t, d, s, colors) => {
    const size = 60;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        ctx.fillStyle = (i + j) % 2 === 0 ? '#333' : '#ccc';
        ctx.fillRect(i * size + 50, j * size + 50, size, size);
      }
    }
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.arc(300, 300, 100, 0, Math.PI * 2);
    ctx.fill();
  },

  'ambiguous-figure': (ctx, w, h, t, d, s, colors) => {
    // Simple Necker Cube
    const size = 150;
    const cx = w/2 - size/2;
    const cy = h/2 - size/2;
    const off = 50;
    
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx, cy, size, size);
    ctx.strokeRect(cx + off, cy + off, size, size);
    
    ctx.beginPath();
    ctx.moveTo(cx, cy); ctx.lineTo(cx + off, cy + off);
    ctx.moveTo(cx + size, cy); ctx.lineTo(cx + size + off, cy + off);
    ctx.moveTo(cx, cy + size); ctx.lineTo(cx + off, cy + off + size);
    ctx.moveTo(cx + size, cy + size); ctx.lineTo(cx + size + off, cy + off + size);
    ctx.stroke();
  },

  'fractal-zoom': (ctx, w, h, t, d, s, colors) => {
    const zoom = Math.pow(1.1, (t * 0.001 * s) % 50);
    ctx.save();
    ctx.translate(w/2, h/2);
    ctx.scale(zoom, zoom);
    for (let i = 0; i < 10; i++) {
      const scale = Math.pow(0.5, i);
      ctx.strokeStyle = colors[i % colors.length];
      ctx.strokeRect(-100 * scale, -100 * scale, 200 * scale, 200 * scale);
    }
    ctx.restore();
  },

  'pulsating-waves': (ctx, w, h, t, d, s, colors) => {
    for (let i = 0; i < 10; i++) {
      const r = (t * 0.05 * s + i * 50) % 500;
      const alpha = 1 - r / 500;
      ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(w/2, h/2, r, 0, Math.PI * 2);
      ctx.stroke();
    }
  },

  'dynamic-contrast': (ctx, w, h, t, d, s, colors) => {
    const val = Math.sin(t * 0.01 * s) * 127 + 128;
    ctx.fillStyle = `rgb(${val}, ${val}, ${val})`;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#888';
    ctx.fillRect(w/4, h/4, w/2, h/2);
  },

  'visual-noise': (ctx, w, h, t, d, s, colors) => {
    const imageData = ctx.createImageData(w, h);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const val = Math.random() * 255;
      imageData.data[i] = val;
      imageData.data[i+1] = val;
      imageData.data[i+2] = val;
      imageData.data[i+3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
  },

  'pattern-recognition': (ctx, w, h, t, d, s, colors) => {
    const size = 30;
    for (let x = 0; x < w; x += size) {
      for (let y = 0; y < h; y += size) {
        const rand = Math.random();
        ctx.strokeStyle = rand > d ? '#fff' : '#333';
        ctx.beginPath();
        if (Math.random() > 0.5) {
          ctx.moveTo(x, y); ctx.lineTo(x + size, y + size);
        } else {
          ctx.moveTo(x + size, y); ctx.lineTo(x, y + size);
        }
        ctx.stroke();
      }
    }
  },

  'peripheral-flash': (ctx, w, h, t, d, s, colors) => {
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(w/2, h/2, 5, 0, Math.PI * 2); ctx.fill();
    
    if (Math.floor(t * 0.01 * s) % 20 === 0) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 200 + Math.random() * 100;
      ctx.fillStyle = colors[0];
      ctx.beginPath();
      ctx.arc(w/2 + Math.cos(angle) * dist, h/2 + Math.sin(angle) * dist, 20, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  'reaction-time': (ctx, w, h, t, d, s, colors) => {
    const interval = 2000 / s;
    const phase = Math.floor(t / interval);
    if (phase % 2 === 0) {
      ctx.fillStyle = '#f00';
      ctx.beginPath(); ctx.arc(w/2, h/2, 50, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillStyle = '#0f0';
      ctx.beginPath(); ctx.arc(w/2, h/2, 50, 0, Math.PI * 2); ctx.fill();
    }
  },

  'cognitive-tracking': (ctx, w, h, t, d, s, colors) => {
    const count = 4 + Math.floor(d * 6);
    for (let i = 0; i < count; i++) {
      const x = w/2 + Math.cos(t * 0.001 * s + i) * 150;
      const y = h/2 + Math.sin(t * 0.001 * s * 1.5 + i) * 150;
      ctx.fillStyle = i === 0 ? '#0ff' : '#fff';
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  'muller-lyer': (ctx, w, h, t, d, s, colors) => {
    const cx = w/2;
    const cy = h/2;
    const len = 200;
    const angle = 0.5 + Math.sin(t * 0.002 * s) * 0.4;
    
    const drawLine = (y: number, inward: boolean) => {
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx - len/2, y);
      ctx.lineTo(cx + len/2, y);
      ctx.stroke();
      
      const wingLen = 30;
      const dir = inward ? 1 : -1;
      
      // Left wings
      ctx.beginPath();
      ctx.moveTo(cx - len/2, y);
      ctx.lineTo(cx - len/2 + Math.cos(angle) * wingLen * dir, y - Math.sin(angle) * wingLen);
      ctx.moveTo(cx - len/2, y);
      ctx.lineTo(cx - len/2 + Math.cos(angle) * wingLen * dir, y + Math.sin(angle) * wingLen);
      ctx.stroke();
      
      // Right wings
      ctx.beginPath();
      ctx.moveTo(cx + len/2, y);
      ctx.lineTo(cx + len/2 - Math.cos(angle) * wingLen * dir, y - Math.sin(angle) * wingLen);
      ctx.moveTo(cx + len/2, y);
      ctx.lineTo(cx + len/2 - Math.cos(angle) * wingLen * dir, y + Math.sin(angle) * wingLen);
      ctx.stroke();
    };

    drawLine(cy - 50, true);
    drawLine(cy + 50, false);
  },

  'ebbinghaus': (ctx, w, h, t, d, s, colors) => {
    const cx = w/2;
    const cy = h/2;
    const centerSize = 30;
    const pulse = Math.sin(t * 0.003 * s) * 5;
    
    const drawSet = (x: number, surroundSize: number, count: number, dist: number) => {
      ctx.fillStyle = '#ff6b6b';
      ctx.beginPath();
      ctx.arc(x, cy, centerSize + pulse, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.fillStyle = '#4ecdc4';
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + t * 0.001;
        ctx.beginPath();
        ctx.arc(x + Math.cos(angle) * dist, cy + Math.sin(angle) * dist, surroundSize, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    drawSet(cx - 150, 10, 8, 60);
    drawSet(cx + 150, 50, 6, 100);
  },

  'poggendorff': (ctx, w, h, t, d, s, colors) => {
    const cx = w/2;
    const cy = h/2;
    const rectW = 80;
    
    ctx.fillStyle = '#333';
    ctx.fillRect(cx - rectW/2, cy - 150, rectW, 300);
    
    ctx.strokeStyle = '#0ff';
    ctx.lineWidth = 4;
    const offset = Math.sin(t * 0.002 * s) * 20;
    
    ctx.beginPath();
    ctx.moveTo(cx - 150, cy - 100 + offset);
    ctx.lineTo(cx - rectW/2, cy - 50 + offset);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(cx + rectW/2, cy + offset);
    ctx.lineTo(cx + 150, cy + 50 + offset);
    ctx.stroke();
  }
};
