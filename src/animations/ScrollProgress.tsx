import React from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

// Fine barre orange en haut de l'écran qui suit l'avancement dans la page.
const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-orange origin-left z-[60]"
      style={{ scaleX }}
      aria-hidden="true"
    />
  );
};

export default ScrollProgress;
