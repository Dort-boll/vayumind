export const getDevicePerformance = () => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const memory = (navigator as any).deviceMemory || 4;
  const cores = navigator.hardwareConcurrency || 4;
  
  // Check for WebGL capabilities as a proxy for GPU power
  let gpuPower = 'low';
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext;
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        if (renderer.match(/NVIDIA|AMD|Apple M/)) gpuPower = 'high';
        else if (renderer.match(/Intel|Iris/)) gpuPower = 'medium';
      }
    }
  } catch (e) {}

  if (isMobile || memory < 4 || cores < 4 || gpuPower === 'low') {
    return 'low';
  }
  if (memory >= 8 && cores >= 8 && gpuPower === 'high') {
    return 'high';
  }
  return 'medium';
};

export const isTouchDevice = () => {
  return (('ontouchstart' in window) || (navigator.maxTouchPoints > 0));
};
