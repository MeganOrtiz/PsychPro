import React from 'react';

/**
 * CTAButton
 * Outlined cyan glow button. Used for primary actions across the app.
 *
 * Variants:
 *   - default: standard outlined glow
 *   - filled: subtle filled cyan tint
 *   - small: reduced padding
 */
export default function CTAButton({
  children,
  icon: Icon,
  iconRight: IconRight,
  variant = 'default',
  size = 'default',
  onClick,
  type = 'button',
  className = '',
  ...rest
}) {
  const classes = [
    'cta-button',
    variant === 'filled' && 'cta-button-filled',
    size === 'small' && 'cta-button-small',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} onClick={onClick} {...rest}>
      {Icon && <Icon size={size === 'small' ? 14 : 16} strokeWidth={1.5} />}
      <span>{children}</span>
      {IconRight && <IconRight size={size === 'small' ? 14 : 16} strokeWidth={1.5} />}
    </button>
  );
}
