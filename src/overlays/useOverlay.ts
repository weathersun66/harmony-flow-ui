import { useEffect, useRef, type RefObject } from 'react';

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

interface LayerEntry { id: symbol }

const layerStack: LayerEntry[] = [];
let scrollLockCount = 0;
let previousBodyOverflow = '';

export interface DismissibleLayerOptions {
  modal?: boolean;
  closeOnOutside?: boolean;
  trapFocus?: boolean;
  lockScroll?: boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;
}

function isTopLayer(id: symbol) { return layerStack.at(-1)?.id === id; }
function addLayer(id: symbol) { layerStack.push({ id }); }
function removeLayer(id: symbol) {
  const index = layerStack.findIndex((layer) => layer.id === id);
  if (index >= 0) layerStack.splice(index, 1);
}

function lockBodyScroll() {
  if (scrollLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  scrollLockCount += 1;
}

function unlockBodyScroll() {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) document.body.style.overflow = previousBodyOverflow;
}

function focusInitialElement(root: HTMLElement) {
  const target = root.querySelector<HTMLElement>('[data-autofocus], [autofocus]')
    ?? root.querySelector<HTMLElement>(focusableSelector)
    ?? root;
  target.focus();
}

function trapTabKey(event: KeyboardEvent, root: HTMLElement) {
  const nodes = [...root.querySelectorAll<HTMLElement>(focusableSelector)]
    .filter((node) => !node.hasAttribute('disabled') && node.getAttribute('aria-hidden') !== 'true');
  if (!nodes.length) {
    event.preventDefault();
    root.focus();
    return;
  }
  const first = nodes[0]!;
  const last = nodes[nodes.length - 1]!;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

export function useDismissibleLayer<T extends HTMLElement>(
  open: boolean,
  onClose: () => void,
  modalOrOptions: boolean | DismissibleLayerOptions = false,
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const idRef = useRef(Symbol('dismissible-layer'));
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  const options = typeof modalOrOptions === 'boolean' ? { modal: modalOrOptions } : modalOrOptions;
  const modal = options.modal ?? false;
  const closeOnOutside = options.closeOnOutside ?? !modal;
  const trapFocus = options.trapFocus ?? modal;
  const lockScroll = options.lockScroll ?? modal;
  const autoFocus = options.autoFocus ?? true;
  const restoreFocus = options.restoreFocus ?? true;

  useEffect(() => {
    if (!open) return undefined;
    const id = idRef.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    addLayer(id);
    if (lockScroll) lockBodyScroll();

    const handlePointerDown = (event: PointerEvent) => {
      if (!isTopLayer(id) || !closeOnOutside) return;
      if (!ref.current?.contains(event.target as Node)) closeRef.current();
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isTopLayer(id)) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        closeRef.current();
      } else if (event.key === 'Tab' && trapFocus && ref.current) {
        trapTabKey(event, ref.current);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown, true);
    const animationFrame = autoFocus
      ? requestAnimationFrame(() => ref.current && focusInitialElement(ref.current))
      : undefined;

    return () => {
      if (animationFrame !== undefined) cancelAnimationFrame(animationFrame);
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown, true);
      removeLayer(id);
      if (lockScroll) unlockBodyScroll();
      if (restoreFocus && previousFocus?.isConnected) previousFocus.focus();
    };
  }, [autoFocus, closeOnOutside, lockScroll, modal, open, restoreFocus, trapFocus]);

  return ref;
}
