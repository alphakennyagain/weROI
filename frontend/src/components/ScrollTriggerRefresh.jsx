import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ScrollTriggerRefresh() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();

    const scrollToTarget = () => {
      if (hash) {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      window.scrollTo(0, 0);
    };

    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToTarget();
        refresh();
      });
    });

    window.addEventListener('load', refresh);

    const fontsReady = document.fonts?.ready;
    if (fontsReady) {
      fontsReady.then(refresh).catch(() => {});
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('load', refresh);
    };
  }, [pathname, hash]);

  return null;
}
