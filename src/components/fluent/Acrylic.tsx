import { ReactNode, useEffect, useRef } from 'react';

interface AcrylicProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  intensity?: 'light' | 'medium' | 'heavy';
  dark?: boolean;
}

export function Acrylic({
  children,
  className = '',
  style = {},
  intensity = 'medium',
  dark = true,
}: AcrylicProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Reveal 光效跟随鼠标
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      element.style.setProperty('--mouse-x', `${x}%`);
      element.style.setProperty('--mouse-y', `${y}%`);
    };

    element.addEventListener('mousemove', handleMouseMove);
    return () => element.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const blurAmount = {
    light: '20px',
    medium: '40px',
    heavy: '60px',
  }[intensity];

  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{
        position: 'relative',
        backgroundColor: dark ? 'rgba(12, 12, 12, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: `blur(${blurAmount}) saturate(125%)`,
        WebkitBackdropFilter: `blur(${blurAmount}) saturate(125%)`,
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: dark
            ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 100%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
        {children}
      </div>
    </div>
  );
}
