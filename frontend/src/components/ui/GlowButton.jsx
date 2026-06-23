import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const GlowButton = forwardRef(({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'default',
  glowColor = 'rgba(200, 245, 66, 0.55)',
  disabled = false,
  type = 'button',
  ...props
}, ref) => {
  const sizeClass = {
    sm: 'glow-button-sm',
    default: 'glow-button-md',
    lg: 'glow-button-lg',
  }[size] || 'glow-button-md';

  const variantClass = {
    primary: 'glow-button-primary',
    ghost: 'glow-button-ghost',
    outline: 'glow-button-outline',
  }[variant] || 'glow-button-primary';

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`glow-button rounded-full ${sizeClass} ${variantClass} ${className}`}
      style={{ '--glow-color': glowColor }}
      {...props}
    >
      <span className="glow-button-shine" aria-hidden="true" />
      <span className="glow-button-content">{children}</span>
    </motion.button>
  );
});

GlowButton.displayName = 'GlowButton';

export default GlowButton;
