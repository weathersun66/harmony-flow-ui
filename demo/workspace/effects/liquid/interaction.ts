export function attachInteraction(surface: HTMLElement, press: (pressed: boolean) => void) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let active: number | null = null;
  let frame = 0;
  let x = 50, y = 50;
  const move = (event: PointerEvent) => {
    if (reduced.matches || (active !== null && event.pointerId !== active)) return;
    const rect = surface.getBoundingClientRect();
    x = Math.max(0, Math.min(100, (event.clientX - rect.left) / rect.width * 100));
    y = Math.max(0, Math.min(100, (event.clientY - rect.top) / rect.height * 100));
    if (!frame) frame = requestAnimationFrame(() => {
      frame = 0;
      surface.style.setProperty('--hf-liquid-x', `${x}%`);
      surface.style.setProperty('--hf-liquid-y', `${y}%`);
    });
  };
  const reset = () => { if (surface.dataset.hfLiquidPressed) press(false); active = null; delete surface.dataset.hfLiquidPressed; };
  const down = (event: PointerEvent) => {
    if (active !== null || !event.isPrimary || event.button !== 0 || surface.matches(':disabled,[aria-disabled="true"]')) return;
    active = event.pointerId; surface.dataset.hfLiquidPressed = 'true'; press(true); move(event);
  };
  const up = (event: PointerEvent) => { if (event.pointerId === active) reset(); };
  const keydown = (event: KeyboardEvent) => {
    if (event.target === surface && /^(Enter| )$/.test(event.key) && surface.matches('button,[role="button"]')) {
      surface.dataset.hfLiquidPressed = 'true'; press(true);
    }
  };
  const visibility = () => { if (document.hidden) reset(); };
  const preference = () => { cancelAnimationFrame(frame); frame = 0; reset(); };
  reduced.addEventListener('change', preference);
  surface.addEventListener('pointermove', move, { passive: true });
  surface.addEventListener('pointerdown', down, { passive: true });
  surface.addEventListener('keydown', keydown);
  surface.addEventListener('keyup', reset); surface.addEventListener('focusout', reset);
  window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
  window.addEventListener('blur', reset); document.addEventListener('visibilitychange', visibility);
  return () => {
    cancelAnimationFrame(frame); reset();
    surface.removeEventListener('pointermove', move); surface.removeEventListener('pointerdown', down);
    surface.removeEventListener('keydown', keydown); surface.removeEventListener('keyup', reset);
    surface.removeEventListener('focusout', reset); window.removeEventListener('pointerup', up);
    window.removeEventListener('pointercancel', up); window.removeEventListener('blur', reset);
    document.removeEventListener('visibilitychange', visibility);
    reduced.removeEventListener('change', preference);
    surface.style.removeProperty('--hf-liquid-x'); surface.style.removeProperty('--hf-liquid-y');
  };
}
