export type PatternType = 
  | 'rotating-snakes'
  | 'peripheral-drift'
  | 'hermann-grid'
  | 'scintillating-grid'
  | 'spiral-motion'
  | 'troxler-fading'
  | 'kanizsa-triangle'
  | 'motion-aftereffect'
  | 'color-adaptation'
  | 'radial-expansion'
  | 'checker-shadow'
  | 'ambiguous-figure'
  | 'fractal-zoom'
  | 'pulsating-waves'
  | 'dynamic-contrast'
  | 'visual-noise'
  | 'pattern-recognition'
  | 'peripheral-flash'
  | 'reaction-time'
  | 'cognitive-tracking'
  | 'muller-lyer'
  | 'ebbinghaus'
  | 'poggendorff'
  | 'gpu-fractal'
  | 'gpu-noise'
  | 'gpu-particles';

export interface NeuralConfig {
  pattern_type: PatternType;
  brain_goal: string;
  speed: number;
  difficulty: number;
  color_palette: string[];
  visual_style: 'minimal' | 'complex' | 'psychedelic';
  training_mode: 'focus' | 'peripheral' | 'reaction' | 'meditation' | 'pattern' | 'adaptability';
  texture_url?: string;
}

export interface SessionData {
  id: string;
  timestamp: number;
  duration: number;
  mode: string;
  pattern: string;
  scores: {
    focus: number;
    reaction: number;
    accuracy: number;
    peripheral: number;
    adaptability: number;
  };
}

export interface NeuralMetrics {
  focus: number;
  reaction: number;
  accuracy: number;
  peripheral: number;
  adaptability: number;
  level: number;
  total_training_time: number;
}

export interface PuterAIResponse {
  pattern_type: PatternType;
  brain_goal: string;
  speed: number;
  difficulty: number;
  color_palette: string[];
  visual_style: 'minimal' | 'complex' | 'psychedelic';
  training_mode: string;
  texture_url?: string;
}

declare global {
  interface Window {
    puter: any;
  }
}
