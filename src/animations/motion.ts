import type Lenis from 'lenis';

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isTouchDevice = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

// Instance Lenis partagée (null si désactivée), pour que les autres composants
// puissent faire défiler la page sans entrer en conflit avec elle.
let lenisInstance: Lenis | null = null;
export const setLenis = (l: Lenis | null) => { lenisInstance = l; };

export const scrollToTop = () => {
  if (lenisInstance) lenisInstance.scrollTo(0);
  else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
};

export const scrollToElement = (el: HTMLElement) => {
  if (lenisInstance) lenisInstance.scrollTo(el, { offset: -64 });
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
};
