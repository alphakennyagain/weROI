import React, { Children, useEffect, useMemo, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import useMeasure from 'react-use-measure';

const InfiniteSlider = ({
  children,
  gap = 16,
  speed = 25,
  speedOnHover,
  direction = 'horizontal',
  reverse = false,
  className = '',
}) => {
  const [currentSpeed, setCurrentSpeed] = useState(speed);
  const [containerRef, { width: containerWidth, height: containerHeight }] = useMeasure();
  const [singleSetRef, { width: singleSetWidth, height: singleSetHeight }] = useMeasure();
  const translation = useMotionValue(0);
  const childArray = useMemo(() => Children.toArray(children), [children]);
  const [copyCount, setCopyCount] = useState(2);

  const containerSize = direction === 'horizontal' ? containerWidth : containerHeight;
  const setSize = direction === 'horizontal' ? singleSetWidth : singleSetHeight;

  useEffect(() => {
    setCurrentSpeed(speed);
  }, [speed]);

  useEffect(() => {
    if (setSize <= 0 || containerSize <= 0) return;
    const needed = Math.max(2, Math.ceil(containerSize / setSize) + 2);
    setCopyCount((prev) => (prev === needed ? prev : needed));
  }, [setSize, containerSize]);

  useEffect(() => {
    if (setSize <= 0) return;

    const from = reverse ? -setSize : 0;
    const to = reverse ? 0 : -setSize;

    const controls = animate(translation, [from, to], {
      ease: 'linear',
      duration: currentSpeed,
      repeat: Infinity,
      repeatType: 'loop',
      repeatDelay: 0,
    });

    return () => controls.stop();
  }, [setSize, currentSpeed, translation, reverse]);

  const hoverProps = speedOnHover
    ? {
        onHoverStart: () => setCurrentSpeed(speedOnHover),
        onHoverEnd: () => setCurrentSpeed(speed),
      }
    : {};

  const flexStyle = {
    gap: `${gap}px`,
    flexDirection: direction === 'horizontal' ? 'row' : 'column',
  };

  const setStyle = {
    ...flexStyle,
    marginRight: direction === 'horizontal' ? `${gap}px` : 0,
    marginBottom: direction === 'vertical' ? `${gap}px` : 0,
  };

  const renderSet = (keyPrefix) => (
    <div key={keyPrefix} className="flex shrink-0 items-center" style={setStyle}>
      {childArray.map((child, childIdx) => (
        <div key={`${keyPrefix}-${childIdx}`} className="flex shrink-0 items-center">
          {child}
        </div>
      ))}
    </div>
  );

  return (
    <div ref={containerRef} className={`relative w-full overflow-hidden ${className}`}>
      <div
        ref={singleSetRef}
        className="flex w-max absolute left-0 top-0 opacity-0 pointer-events-none"
        style={setStyle}
        aria-hidden="true"
      >
        {childArray.map((child, childIdx) => (
          <div key={`measure-${childIdx}`} className="flex shrink-0 items-center">
            {child}
          </div>
        ))}
      </div>

      <motion.div
        className="flex w-max"
        style={{
          ...(direction === 'horizontal' ? { x: translation } : { y: translation }),
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
        }}
        {...hoverProps}
      >
        {Array.from({ length: copyCount }).map((_, copyIdx) => renderSet(copyIdx))}
      </motion.div>
    </div>
  );
};

export default InfiniteSlider;
