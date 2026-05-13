import React from 'react';

/**
 * DashboardCard
 * Translucent glass card wrapper for dashboard sections.
 */
export default function DashboardCard({
  children,
  title,
  titleIcon: TitleIcon,
  trailing,
  style = {},
  ...rest
}) {
  return (
    <section className="glass-card" style={style} {...rest}>
      {(title || trailing) && (
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {TitleIcon && (
              <TitleIcon
                size={18}
                strokeWidth={1.5}
                style={{ color: 'var(--cyan-glow)' }}
              />
            )}
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 500,
                fontSize: '1.0625rem',
                color: 'var(--text-primary)',
                letterSpacing: '0.01em',
              }}
            >
              {title}
            </h2>
          </div>
          {trailing}
        </header>
      )}
      {children}
    </section>
  );
}
