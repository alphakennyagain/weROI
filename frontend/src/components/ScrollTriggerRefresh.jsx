import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ScrollTriggerRefresh() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    let resizeTimer;
    const refresh = () => ScrollTrigger.refresh();

    const scrollToTarget = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      const behavior = prefersReducedMotion || isMobile ? 'auto' : 'smooth';

      if (hash) {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior });
          return;
        }
      }
      window.scrollTo({ top: 0, behavior });
    };

    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToTarget();
        refresh();
      });
    });

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(refresh, 150);
    };

    window.addEventListener('load', refresh);
    window.addEventListener('resize', onResize, { passive: true });

    const fontsReady = document.fonts?.ready;
    if (fontsReady) {
      fontsReady.then(refresh).catch(() => {});
    }

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener('load', refresh);
      window.removeEventListener('resize', onResize);
    };
  }, [pathname, hash]);

  return null;
}
