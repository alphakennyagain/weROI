import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const GlowButton = forwardRef(({
  children,
  onClick,
  className = '',
  variant = 'primary', // primary, ghost, outline
  size = 'default', // default, sm, lg
  glowColor = 'rgba(200, 245, 66, 0.5)',
  disabled = false,
  ...props
}, ref) => {
  const baseClasses = "relative inline-flex items-center justify-center gap-2.5 font-bold transition-all duration-200 outline-none focus:outline-none disabled:opacity-50 disabled:pointer-events-none";
  
  const sizeClasses = {
    sm: "h-9 px-4 text-sm rounded-lg",
    default: "h-11 px-5 text-sm rounded-lg",
    lg: "h-13 px-6 text-base rounded-lg"
  };

  const variantClasses = {
    primary: "bg-lime text-lime-ink border border-lime hover:bg-lime-hover",
    ghost: "bg-transparent text-ink border border-ink hover:bg-ink hover:text-paper",
    outline: "bg-transparent text-ink border border-line-mid hover:border-ink"
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ 
        scale: 1.02,
        boxShadow: variant === 'primary' ? `0 0 30px ${glowColor}, 0 0 60px ${glowColor.replace('0.5', '0.25')}` : 'none'
      }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      style={{
        '--glow-color': glowColor
      }}
      {...props}
    >
      {/* Glow effect layer for primary */}
      {variant === 'primary' && (
        <span 
          className="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
            filter: 'blur(20px)',
            transform: 'translateZ(-1px)'
          }}
        />
      )}
      
      {/* Button content */}
      <span className="relative z-10 flex items-center gap-2.5">
        {children}
      </span>
    </motion.button>
  );
});

GlowButton.displayName = "GlowButton";

export default GlowButton;
