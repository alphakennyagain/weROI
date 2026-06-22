import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const Card3D = React.forwardRef(({
  title,
  subtitle,
  imageUrl,
  actionText,
  href,
  onActionClick,
  className = '',
  metrics = []
}, ref) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springY, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const { width, height, left, top } = rect;
    const mouseXVal = e.clientX - left;
    const mouseYVal = e.clientY - top;
    const xPct = mouseXVal / width - 0.5;
    const yPct = mouseYVal / height - 0.5;
    mouseX.set(xPct);
    mouseY.set(yPct);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`card-3d relative rounded-2xl bg-transparent ${className}`}
    >
      <div
        style={{
          transform: "translateZ(30px)",
          transformStyle: "preserve-3d",
        }}
        className="card-3d-inner absolute inset-0 grid rounded-xl overflow-hidden"
      >
        {/* Background Image */}
        <div className="card-3d-image">
          <img
            src={imageUrl}
            alt={`${title}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        
        {/* Overlay */}
        <div className="card-3d-overlay" />

        {/* Content */}
        <div className="card-3d-content">
          {/* Header */}
          <div className="card-3d-header">
            <div>
              <motion.span 
                style={{ transform: "translateZ(40px)" }}
                className="card-3d-category"
              >
                {subtitle}
              </motion.span>
              <motion.h3 
                style={{ transform: "translateZ(50px)" }}
                className="card-3d-title"
              >
                {title}
              </motion.h3>
            </div>
            <motion.a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, rotate: "2.5deg" }}
              whileTap={{ scale: 0.9 }}
              style={{ transform: "translateZ(60px)" }}
              className="card-3d-link-icon"
            >
              <ArrowUpRight size={18} />
            </motion.a>
          </div>

          {/* Metrics */}
          {metrics.length > 0 && (
            <div className="card-3d-metrics">
              {metrics.map((metric, idx) => (
                <div key={idx} className="card-3d-metric">
                  <span className="card-3d-metric-value">{metric.value}</span>
                  <span className="card-3d-metric-label">{metric.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Button */}
          <motion.a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ transform: "translateZ(40px)" }}
            className="card-3d-button"
          >
            {actionText} <ArrowUpRight size={14} />
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
});

Card3D.displayName = "Card3D";

export default Card3D;
