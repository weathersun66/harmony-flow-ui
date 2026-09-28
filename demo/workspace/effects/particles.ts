interface Grain { x: number; y: number; size: number; color: string; seed: number }

function sampleSurface(target: HTMLElement, bounds: DOMRect): Grain[] {
  const grains: Grain[] = [];
  const base = getComputedStyle(target);
  const color = base.backgroundColor === 'rgba(0, 0, 0, 0)' ? 'rgb(160, 200, 240)' : base.backgroundColor;
  const step = Math.max(7, Math.sqrt(bounds.width * bounds.height / 550));
  for (let y = 2; y < bounds.height; y += step) for (let x = 2; x < bounds.width; x += step) {
    grains.push({ x, y, color, size: 1.5 + (x % 3), seed: ((x * 13 + y * 7) % 97) / 97 });
  }
  // 从实际文字范围取样，碎片沿内容原位置散开，而非在容器外随机撒点。
  const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode()) && grains.length < 1000) {
    if (!node.textContent?.trim() || !node.parentElement) continue;
    const range = document.createRange(); range.selectNodeContents(node);
    for (const rect of range.getClientRects()) {
      for (let x = 0; x < rect.width && grains.length < 1000; x += 5) {
        const px = rect.left - bounds.left + x;
        const py = rect.top - bounds.top + rect.height * .6;
        if (px < 0 || py < 0 || px > bounds.width || py > bounds.height) continue;
        grains.push({ x: px, y: py, color: getComputedStyle(node.parentElement).color, size: 1.3, seed: (x % 31) / 31 });
      }
    }
  }
  return grains;
}

export function dissolve(target: HTMLElement, canvas: HTMLCanvasElement, done: () => void): () => void {
  const bounds = target.getBoundingClientRect();
  const context = canvas.getContext('2d');
  if (!context || !bounds.width || !bounds.height) { done(); return () => {}; }
  const pad = 100;
  const ratio = Math.min(devicePixelRatio || 1, 2);
  const width = Math.min(bounds.width + pad * 2, 1800);
  const height = Math.min(bounds.height + pad * 2, 1200);
  canvas.width = width * ratio; canvas.height = height * ratio;
  Object.assign(canvas.style, { width: `${width}px`, height: `${height}px`, left: `${bounds.left - pad}px`, top: `${bounds.top - pad}px` });
  context.scale(ratio, ratio);
  const grains = sampleSurface(target, bounds);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = reduced ? 120 : 850;
  const animation = target.animate(reduced ? [{ opacity: 1 }, { opacity: 0 }] : [
    { clipPath: 'inset(0 0 0 0)', opacity: 1 },
    { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
  ], { duration: reduced ? 120 : 570, fill: 'forwards', easing: 'ease-out' });
  let frame = 0;
  const start = performance.now();
  function tick(now: number) {
    const t = Math.min(1, (now - start) / duration);
    context!.clearRect(0, 0, width, height);
    if (!reduced) for (const grain of grains) {
      const delay = (1 - grain.x / bounds.width) * .3;
      const life = Math.max(0, (t - delay) / (1 - delay));
      if (life <= 0) continue;
      context!.globalAlpha = Math.pow(1 - life, 1.4);
      context!.fillStyle = grain.color;
      const x = pad + grain.x + life * (30 + grain.seed * 65);
      const y = pad + grain.y - life * (20 + grain.seed * 65) + Math.sin(life * 6 + grain.seed * 8) * life * 12;
      context!.beginPath(); context!.arc(x, y, grain.size * (1 - life * .65), 0, Math.PI * 2); context!.fill();
    }
    if (t < 1 && !document.hidden && target.isConnected) frame = requestAnimationFrame(tick);
    else { context!.clearRect(0, 0, width, height); done(); }
  }
  frame = requestAnimationFrame(tick);
  return () => { cancelAnimationFrame(frame); animation.cancel(); context.clearRect(0, 0, width, height); };
}
