import { VERTEX_SHADER, FRACTAL_SHADER, NOISE_SHADER, PARTICLE_SHADER, UNIVERSE_SHADER } from './shaders';
import { PatternType } from '../types';

export class WebGLRenderer {
  private gl: WebGLRenderingContext;
  private programs: Map<string, WebGLProgram> = new Map();
  private currentProgram: WebGLProgram | null = null;
  private buffer: WebGLBuffer | null = null;

  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    this.init();
  }

  private init() {
    const gl = this.gl;
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    this.programs.set('gpu-fractal', this.createProgram(VERTEX_SHADER, FRACTAL_SHADER));
    this.programs.set('gpu-noise', this.createProgram(VERTEX_SHADER, NOISE_SHADER));
    this.programs.set('gpu-particles', this.createProgram(VERTEX_SHADER, PARTICLE_SHADER));
    this.programs.set('universe', this.createProgram(VERTEX_SHADER, UNIVERSE_SHADER));
  }

  private createProgram(vsSource: string, fsSource: string): WebGLProgram {
    const gl = this.gl;
    const vs = this.compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = this.compileShader(gl.FRAGMENT_SHADER, fsSource);
    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error('Unable to link program: ' + gl.getProgramInfoLog(program));
    }
    return program;
  }

  private compileShader(type: number, source: string): WebGLShader {
    const gl = this.gl;
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error('An error occurred compiling the shaders: ' + info);
    }
    return shader;
  }

  private hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255
    ] : [1, 1, 1];
  }

  public render(
    pattern: PatternType, 
    time: number, 
    width: number, 
    height: number, 
    difficulty: number, 
    speed: number, 
    colors: string[],
    performance: 'low' | 'medium' | 'high' = 'medium'
  ) {
    const gl = this.gl;
    const program = this.programs.get(pattern);
    if (!program) return;

    gl.useProgram(program);
    this.currentProgram = program;

    const positionLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionLoc);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

    gl.uniform2f(gl.getUniformLocation(program, 'resolution'), width, height);
    gl.uniform1f(gl.getUniformLocation(program, 'time'), time / 1000);
    gl.uniform1f(gl.getUniformLocation(program, 'difficulty'), difficulty);
    gl.uniform1f(gl.getUniformLocation(program, 'speed'), speed);
    
    const perfValue = performance === 'low' ? 0.5 : performance === 'medium' ? 0.75 : 1.0;
    gl.uniform1f(gl.getUniformLocation(program, 'performance'), perfValue);

    const c1 = this.hexToRgb(colors[0] || '#00ffff');
    const c2 = this.hexToRgb(colors[1] || '#ff00ff');

    gl.uniform3f(gl.getUniformLocation(program, 'color1'), c1[0], c1[1], c1[2]);
    gl.uniform3f(gl.getUniformLocation(program, 'color2'), c2[0], c2[1], c2[2]);

    gl.viewport(0, 0, width, height);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}
