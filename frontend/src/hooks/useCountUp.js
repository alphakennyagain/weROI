import { useEffect, useRef, useState } from 'react';

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function formatCount(value, decimals) {
  if (decimals > 0) return value.toFixed(decimals);
  return String(Math.round(value));
}

export function useCountUp(target, { duration = 1800, decimals = 0 } = {}) {
  const ref = useRef(null);
  const startedRef = useRef(false);
  const [display, setDisplay] = useState(() =>
    prefersReducedMotion() ? formatCount(target, decimals) : formatCount(0, decimals),
  );

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplay(formatCount(target, decimals));
      return undefined;
    }

    const el = ref.current;
    if (!el) return undefined;

    const runAnimation = () => {
      const t0 = performance.now();
      const step = (now) => {
        const progress = Math.min((now - t0) / duration, 1);
        setDisplay(formatCount(target * easeOutCubic(progress), decimals));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          observer.disconnect();
          runAnimation();
        }
      },
      { threshold: 0.25, rootMargin: '0px 0px -8% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, decimals]);

  return { ref, display };
}
