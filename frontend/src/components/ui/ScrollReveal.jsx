import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollReveal.css';

gsap.registerPlugin(ScrollTrigger);

const extractText = (node) => {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node.type === 'br') return '\n';
  if (node.props?.children != null) return extractText(node.props.children);
  return '';
};

const ScrollReveal = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.12,
  baseRotation = 0,
  blurStrength,
  containerClassName = '',
  className = '',
  textClassName = '',
  start = 'top 88%',
  end = 'top 52%',
  stagger = 0.045,
  scrub = 0.65,
  as: Tag = 'div',
}) => {
  const containerRef = useRef(null);
  const text = useMemo(() => extractText(children), [children]);

  const splitText = useMemo(() => {
    return text.split(/(\s+|\n)/).map((part, index) => {
      if (part === '\n') return <br key={`br-${index}`} />;
      if (part.match(/^\s+$/)) return part;
      if (!part) return null;
      return (
        <span className="word" key={index}>
          {part}
        </span>
      );
    });
  }, [text]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      el.classList.add('is-visible');
      return undefined;
    }

    const wordElements = el.querySelectorAll('.word');
    if (wordElements.length === 0) return undefined;

    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
    if (inView) {
      el.classList.add('is-ready', 'is-visible');
      gsap.set(wordElements, { opacity: 1, filter: 'blur(0px)' });
      return undefined;
    }

    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const effectiveBlur = enableBlur && !isMobile ? (blurStrength ?? 4) : null;
    const scroller = scrollContainerRef?.current ?? undefined;
    const useScrub = !isMobile;

    let ctx;
    let rafId = 0;

    const setup = () => {
      ctx?.revert();

      ctx = gsap.context(() => {
        const triggerConfig = {
          trigger: el,
          scroller,
          start,
          end,
          invalidateOnRefresh: true,
          ...(useScrub
            ? { scrub }
            : { toggleActions: 'play none none none', once: true }),
        };

        if (baseRotation) {
          gsap.fromTo(
            el,
            { transformOrigin: '0% 50%', rotate: baseRotation },
            {
              ease: useScrub ? 'none' : 'power2.out',
              rotate: 0,
              duration: useScrub ? undefined : 0.6,
              scrollTrigger: triggerConfig,
            }
          );
        }

        gsap.fromTo(
          wordElements,
          { opacity: baseOpacity, willChange: 'opacity' },
          {
            opacity: 1,
            ease: useScrub ? 'none' : 'power2.out',
            duration: useScrub ? undefined : 0.5,
            stagger: isMobile ? stagger * 0.6 : stagger,
            scrollTrigger: { ...triggerConfig },
          }
        );

        if (effectiveBlur != null) {
          gsap.fromTo(
            wordElements,
            { filter: `blur(${effectiveBlur}px)` },
            {
              filter: 'blur(0px)',
              ease: 'none',
              stagger,
              scrollTrigger: { ...triggerConfig },
            }
          );
        }
      }, el);

      el.classList.add('is-ready');
      ScrollTrigger.refresh();
    };

    rafId = requestAnimationFrame(() => {
      requestAnimationFrame(setup);
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      ctx?.revert();
      el.classList.remove('is-ready', 'is-visible');
    };
  }, [
    scrollContainerRef,
    enableBlur,
    baseRotation,
    baseOpacity,
    start,
    end,
    stagger,
    scrub,
    blurStrength,
    text,
  ]);

  return (
    <Tag ref={containerRef} className={`scroll-reveal ${containerClassName} ${className}`.trim()}>
      <span className={`scroll-reveal-text ${textClassName}`.trim()}>{splitText}</span>
    </Tag>
  );
};

export default ScrollReveal;
