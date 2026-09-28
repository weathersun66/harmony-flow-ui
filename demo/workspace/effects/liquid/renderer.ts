// 背景位移独立于前景 DOM；圆角距离场只扭曲玻璃后面的内容。
const ns = 'http://www.w3.org/2000/svg';
let sequence = 0;
export function attachRefraction(surface: HTMLElement) {
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.cssText = 'position:fixed;pointer-events:none';
  const filter = document.createElementNS(ns, 'filter');
  const id = `hf-liquid-${++sequence}`;
  filter.id = id;
  filter.setAttribute('color-interpolation-filters', 'sRGB');
  filter.setAttribute('x', '-20%'); filter.setAttribute('y', '-20%');
  filter.setAttribute('width', '140%'); filter.setAttribute('height', '140%');
  const map = document.createElementNS(ns, 'feImage');
  map.setAttribute('result', 'lens'); map.setAttribute('preserveAspectRatio', 'none');
  const displacement = document.createElementNS(ns, 'feDisplacementMap');
  displacement.setAttribute('in', 'SourceGraphic'); displacement.setAttribute('in2', 'lens');
  displacement.setAttribute('xChannelSelector', 'R'); displacement.setAttribute('yChannelSelector', 'G');
  displacement.setAttribute('result', 'refracted');
  const blur = document.createElementNS(ns, 'feGaussianBlur');
  blur.setAttribute('in', 'refracted');
  blur.setAttribute('stdDeviation', surface.dataset.hfLiquidPreset === 'overlay' ? '5' : '1');
  filter.append(map, displacement, blur); svg.append(filter);
  let previous = '';
  let baseScale = 12, amount = 1, animation = 0;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const resize = () => {
    const { width, height } = surface.getBoundingClientRect();
    if (!width || !height) return;
    const corner = getComputedStyle(surface).borderTopLeftRadius;
    const radius = Math.min((parseFloat(corner) || 0) * (corner.includes('%') ? Math.min(width, height) / 100 : 1), width / 2, height / 2);
    const key = `${Math.round(width)},${Math.round(height)},${radius}`;
    if (key === previous) return;
    previous = key;
    const ratio = Math.min(1, 512 / Math.max(width, height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(2, Math.round(width * ratio));
    canvas.height = Math.max(2, Math.round(height * ratio));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('无法创建折射贴图');
    const pixels = context.createImageData(canvas.width, canvas.height);
    const rim = Math.min(18, Math.min(width, height) * .24);
    for (let y = 0; y < canvas.height; y++) for (let x = 0; x < canvas.width; x++) {
      const px = (x + .5) / ratio - width / 2, py = (y + .5) / ratio - height / 2;
      const qx = Math.abs(px) - width / 2 + radius, qy = Math.abs(py) - height / 2 + radius;
      const ox = Math.max(qx, 0), oy = Math.max(qy, 0), length = Math.hypot(ox, oy);
      const distance = length + Math.min(Math.max(qx, qy), 0) - radius;
      const strength = Math.pow(Math.max(0, 1 - Math.abs(distance) / rim), 1.5);
      const nx = length ? ox / length : qx > qy ? 1 : 0;
      const ny = length ? oy / length : qy >= qx ? 1 : 0;
      const offset = (y * canvas.width + x) * 4;
      pixels.data[offset] = 128 + Math.sign(px) * nx * strength * 120;
      pixels.data[offset + 1] = 128 + Math.sign(py) * ny * strength * 120;
      pixels.data[offset + 2] = 128; pixels.data[offset + 3] = 255;
    }
    context.putImageData(pixels, 0, 0);
    map.setAttribute('href', canvas.toDataURL());
    map.setAttribute('x', '0'); map.setAttribute('y', '0');
    map.setAttribute('width', String(width)); map.setAttribute('height', String(height));
    baseScale = Math.min(24, Math.min(width, height) * .38);
    displacement.setAttribute('scale', String(baseScale * amount));
  };
  const fallback = () => {
    cancelAnimationFrame(animation);
    surface.style.removeProperty('--hf-liquid-filter');
    surface.dataset.hfLiquidRenderer = 'css';
  };
  const observer = new ResizeObserver(() => {
    try { resize(); } catch (error) { fallback(); console.warn('液态尺寸更新失败，使用兼容材质', error); }
  });
  resize();
  document.body.append(svg); observer.observe(surface);
  map.addEventListener('error', fallback);
  surface.style.setProperty('--hf-liquid-filter', `url("#${id}")`);
  surface.dataset.hfLiquidRenderer = 'svg';
  const press = (pressed: boolean) => {
    cancelAnimationFrame(animation);
    const from = amount, to = pressed && !reduced.matches ? 1.3 : 1;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 200);
      amount = from + (to - from) * (1 - Math.pow(1 - t, 3));
      displacement.setAttribute('scale', String(baseScale * amount));
      if (t < 1) animation = requestAnimationFrame(tick);
    };
    if (reduced.matches || document.hidden) { amount = 1; displacement.setAttribute('scale', String(baseScale)); }
    else animation = requestAnimationFrame(tick);
  };
  return { press, dispose: () => {
    cancelAnimationFrame(animation);
    observer.disconnect(); map.removeEventListener('error', fallback); svg.remove();
    surface.style.removeProperty('--hf-liquid-filter'); delete surface.dataset.hfLiquidRenderer;
  } };
}
