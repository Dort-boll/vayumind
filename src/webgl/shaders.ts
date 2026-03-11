export const VERTEX_SHADER = `
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = position * 0.5 + 0.5;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

export const FRACTAL_SHADER = `
  precision highp float;
  varying vec2 vUv;
  uniform vec2 resolution;
  uniform float time;
  uniform float difficulty;
  uniform float speed;
  uniform float performance;
  uniform vec3 color1;
  uniform vec3 color2;

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / min(resolution.y, resolution.x);
    
    float t = time * 0.2 * speed;
    float zoom = 1.0 + sin(t * 0.5) * 0.5;
    uv *= zoom;
    
    vec2 c = vec2(-0.8, 0.156) + vec2(cos(t), sin(t)) * 0.1 * difficulty;
    vec2 z = uv;
    
    float iter = 0.0;
    float max_iter = 64.0 + 64.0 * performance;
    
    for(float i = 0.0; i < 128.0; i++) {
      if(i >= max_iter) break;
      z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
      if(length(z) > 4.0) break;
      iter++;
    }
    
    float f = iter / max_iter;
    f = pow(f, 0.5); // Gamma correction-like
    
    vec3 col = mix(color1, color2, f + sin(f * 10.0 + t) * 0.2);
    col += vec3(0.1, 0.2, 0.3) * (1.0 - f); // Glow
    
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const NOISE_SHADER = `
  precision highp float;
  varying vec2 vUv;
  uniform vec2 resolution;
  uniform float time;
  uniform float difficulty;
  uniform float speed;
  uniform vec3 color1;
  uniform vec3 color2;

  vec3 hash3(vec2 p) {
    vec3 q = vec3(dot(p, vec2(127.1, 311.7)), 
                  dot(p, vec2(269.5, 183.3)), 
                  dot(p, vec2(419.2, 371.9)));
    return fract(sin(q) * 43758.5453);
  }

  float iqnoise(in vec2 x, float u, float v) {
    vec2 p = floor(x);
    vec2 f = fract(x);
    float k = 1.0 + 63.0 * pow(1.0 - v, 4.0);
    float va = 0.0;
    float wt = 0.0;
    for(int j = -2; j <= 2; j++)
    for(int i = -2; i <= 2; i++) {
      vec2 g = vec2(float(i), float(j));
      vec3 o = hash3(p + g) * vec3(u, u, 1.0);
      vec2 r = g - f + o.xy;
      float d = dot(r, r);
      float ww = pow(1.0 - smoothstep(0.0, 1.414, sqrt(d)), k);
      va += o.z * ww;
      wt += ww;
    }
    return va / wt;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float t = time * speed;
    
    float n = iqnoise(uv * (5.0 + difficulty * 10.0) + t * 0.1, 1.0, 1.0);
    n = smoothstep(0.2, 0.8, n);
    
    vec3 col = mix(color1, color2, n);
    col *= 0.8 + 0.2 * sin(uv.y * 100.0 + t); // Scanline effect
    
    gl_FragColor = vec4(col, 1.0);
  }
`;

export const PARTICLE_SHADER = `
  precision highp float;
  varying vec2 vUv;
  uniform vec2 resolution;
  uniform float time;
  uniform float difficulty;
  uniform float speed;
  uniform float performance;
  uniform vec3 color1;
  uniform vec3 color2;

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / min(resolution.y, resolution.x);
    float t = time * speed;
    
    vec3 finalColor = vec3(0.0);
    float count = (20.0 + difficulty * 60.0) * (0.5 + 0.5 * performance);
    
    for(float i = 0.0; i < 150.0; i++) {
      if(i >= count) break;
      
      float seed = i * 543.21;
      float x = sin(seed + t * 0.2) * 0.8;
      float y = cos(seed * 1.2 + t * 0.3) * 0.8;
      vec2 pos = vec2(x, y);
      
      float dist = length(uv - pos);
      float size = 0.001 + 0.002 * sin(t + seed);
      
      vec3 pCol = mix(color1, color2, sin(seed + t) * 0.5 + 0.5);
      finalColor += pCol * (size / (dist * dist + 0.001));
    }
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

export const UNIVERSE_SHADER = `
  precision highp float;
  varying vec2 vUv;
  uniform vec2 resolution;
  uniform float time;
  uniform float performance;
  uniform vec3 color1;
  uniform vec3 color2;

  void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / min(resolution.y, resolution.x);
    float t = time * 0.1;
    
    vec3 col = vec3(0.0);
    float layers = 2.0 + 3.0 * performance;
    
    for(float i = 0.0; i < 6.0; i++) {
      if(i >= layers) break;
      vec2 p = uv * (1.0 + i * 0.5);
      p += vec2(sin(t + i), cos(t * 0.7 + i)) * 0.5;
      
      float d = length(p);
      float f = 0.01 / (d + 0.01);
      
      vec3 layerCol = mix(color1, color2, sin(t + i) * 0.5 + 0.5);
      col += layerCol * f;
    }
    
    col = pow(col, vec3(0.4545)); // Gamma correction
    gl_FragColor = vec4(col * 0.5, 1.0);
  }
`;
