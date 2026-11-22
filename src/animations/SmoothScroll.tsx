import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { prefersReducedMotion, setLenis } from './motion';

const HEADER_HEIGHT = 64; // h-16 du header fixe

// Défilement fluide (Lenis). Désactivé si l'utilisateur réduit les animations.
const SmoothScroll: React.FC = () => {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      autoRaf: true,
      anchors: { offset: -HEADER_HEIGHT },
      // Les zones à défilement interne (panneau admin, menus) gardent leur scroll natif
      allowNestedScroll: true,
    });
    setLenis(lenis);

    return () => {
      setLenis(null);
      lenis.destroy();
    };
  }, []);

  return null;
};

export default SmoothScroll;
