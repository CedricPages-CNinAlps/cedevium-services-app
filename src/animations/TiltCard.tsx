import React, { useEffect, useRef } from 'react';
import Atropos from 'atropos';
import 'atropos/css';
import { prefersReducedMotion, isTouchDevice } from './motion';

interface TiltCardProps {
  className?: string;
  innerClassName?: string;
  children: React.ReactNode;
}

// Carte qui s'incline en 3D au survol (Atropos). Sur tactile ou si
// l'utilisateur réduit les animations, la carte reste simplement à plat.
const TiltCard: React.FC<TiltCardProps> = ({ className = '', innerClassName = '', children }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion() || isTouchDevice()) return;
    const instance = Atropos({
      el: ref.current,
      activeOffset: 30,
      shadowScale: 1.03,
      rotateXMax: 10,
      rotateYMax: 10,
      highlight: true,
    });
    return () => instance.destroy();
  }, []);

  return (
    <div ref={ref} className={`atropos ${className}`}>
      <div className="atropos-scale">
        <div className="atropos-rotate">
          <div className={`atropos-inner ${innerClassName}`}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default TiltCard;
