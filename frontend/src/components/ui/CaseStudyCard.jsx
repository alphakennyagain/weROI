import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import BorderGlow from './BorderGlow';

export const CASE_STUDY_GLOW = {
  edgeSensitivity: 30,
  glowColor: '84 80% 65%',
  backgroundColor: '#111111',
  borderRadius: 16,
  glowRadius: 36,
  glowIntensity: 1.0,
  coneSpread: 25,
  colors: ['#bef264', '#84cc16', '#a3e635'],
  fillOpacity: 0.35,
};

const CaseStudyCard = ({
  category,
  title,
  description,
  imageUrl,
  metrics = [],
  href = '#',
  actionText = 'View Live Site',
  className = '',
  glowAnimated = true,
  'data-testid': testId,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const [tiltEnabled, setTiltEnabled] = useState(false);
  const [imgSrc, setImgSrc] = useState(imageUrl);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgSrc(imageUrl);
    setImgFailed(false);
  }, [imageUrl]);

  useEffect(() => {
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    const narrowViewport = window.matchMedia('(max-width: 768px)').matches;
    setTiltEnabled(!prefersReducedMotion && !coarsePointer && !narrowViewport);
  }, [prefersReducedMotion]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 18, stiffness: 180 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springY, [-0.5, 0.5], ['5deg', '-5deg']);
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-5deg', '5deg']);

  const handleMouseMove = (e) => {
    if (!tiltEnabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const tiltStyle = tiltEnabled
    ? {
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 1200,
      }
    : undefined;

  const isExternal = /^https?:\/\//i.test(href);
  const LinkTag = isExternal ? 'a' : Link;
  const linkProps = isExternal
    ? { href, target: '_blank', rel: 'noopener noreferrer' }
    : { to: href };

  return (
    <BorderGlow
      className={`case-study-border-glow ${className}`.trim()}
      animated={glowAnimated}
      {...CASE_STUDY_GLOW}
    >
      <motion.article
        className={`case-study-card${tiltEnabled ? ' case-study-card--tilt' : ''}`}
        data-testid={testId}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={tiltStyle}
      >
        <div className="case-study-card-image">
          {!imgFailed ? (
            <img
              src={imgSrc}
              alt={title}
              loading="lazy"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="case-study-card-fallback" aria-hidden="true">
              <span className="case-study-card-fallback-title">{title}</span>
            </div>
          )}
        </div>

        <div className="case-study-card-body">
          <span className="case-study-category">{category}</span>
          <h3 className="case-study-title">{title}</h3>
          <p className="case-study-desc">{description}</p>

          {metrics.length > 0 && (
            <div className="case-study-metrics">
              {metrics.map((metric) => (
                <div key={`${metric.label}-${metric.value}`} className="case-study-metric">
                  <span className="case-study-metric-value">
                    <span className="case-study-metric-arrow" aria-hidden="true">↑</span>
                    {metric.value}
                  </span>
                  <span className="case-study-metric-label">{metric.label}</span>
                </div>
              ))}
            </div>
          )}

          <LinkTag
            {...linkProps}
            className="case-study-link"
          >
            {actionText}
            <ArrowUpRight size={14} />
          </LinkTag>
        </div>
      </motion.article>
    </BorderGlow>
  );
};

export default CaseStudyCard;
