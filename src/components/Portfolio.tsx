import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { useAdminData } from '../contexts/AdminDataContext';

const Portfolio: React.FC = () => {
  const { portfolioData } = useAdminData();
  const items = portfolioData.items;
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const count = items.length;

  const goTo = useCallback(
    (index: number) => setCurrent(((index % count) + count) % count),
    [count]
  );

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (count > 1) timerRef.current = setInterval(goNext, 5000);
  }, [count, goNext]);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  if (count === 0) return null;

  // Distance relative au slide courant, en tenant compte du wrap circulaire
  const getOffset = (index: number): number => {
    let off = index - current;
    if (off > count / 2) off -= count;
    if (off < -count / 2) off += count;
    return off;
  };

  const currentItem = items[current];

  // Propriétés visuelles selon la position dans le carousel
  const getAnimProps = (offset: number) => {
    const isCenter = offset === 0;
    return {
      // x : ±72 % de la largeur propre de la carte
      x: `${offset * 72}%`,
      // y : centrage vertical via -50 % de la hauteur propre
      y: '-50%',
      // Rotation 3D — cartes latérales de biais
      rotateY: offset * -48,
      scale: isCenter ? 1 : 0.78,
      opacity: isCenter ? 1 : 0.55,
      zIndex: isCenter ? 10 : 5,
    };
  };

  // Titre dynamique : dernier mot en accent
  const titleWords = portfolioData.title.split(' ');

  return (
    <section id="portfolio" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">

        {/* En-tête */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {titleWords.slice(0, -1).join(' ')}{' '}
            <span className="text-accent">{titleWords.slice(-1)}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {portfolioData.subtitle}
          </p>
        </motion.div>

        {/* ── Coverflow 3D ── */}
        <div
          className="relative overflow-hidden"
          style={{ height: '300px', perspective: '1200px' }}
        >
          {items.map((item, index) => {
            const offset = getOffset(index);
            if (Math.abs(offset) > 1) return null;

            const isCenter = offset === 0;

            return (
              <motion.div
                key={item.id}
                className="absolute rounded-2xl overflow-hidden shadow-2xl"
                style={{
                  width: '60%',
                  aspectRatio: '16 / 9',
                  left: '20%',
                  top: '100%',
                  cursor: !isCenter ? 'pointer' : item.url ? 'pointer' : 'default',
                }}
                animate={getAnimProps(offset)}
                transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                onClick={() => {
                  if (!isCenter) {
                    goTo(index);
                    resetTimer();
                  } else if (item.url) {
                    window.open(item.url, '_blank', 'noopener,noreferrer');
                  }
                }}
              >
                {/* div enfant absolu — indépendant de Framer Motion, background-position garanti stable */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: item.image ? `url(${item.image})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'top center',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: '#e5e7eb',
                  }}
                >
                  {!item.image && (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-accent">
                      <ExternalLink size={48} className="text-white opacity-30" />
                    </div>
                  )}
                </div>

                {/* Overlay "Visiter" sur la carte centrale au survol */}
                {isCenter && (
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/45 transition-all duration-300 flex items-center justify-center group">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white text-center pointer-events-none">
                      <ExternalLink size={38} className="mx-auto mb-2" />
                      <span className="text-sm font-semibold tracking-wide">Visiter le site</span>
                    </div>
                  </div>
                )}

                {/* Contour accent sur la carte active */}
                {isCenter && (
                  <div className="absolute inset-0 ring-2 ring-accent rounded-2xl pointer-events-none" />
                )}
              </motion.div>
            );
          })}

          {/* Flèches de navigation */}
          {count > 1 && (
            <>
              <button
                onClick={() => { goPrev(); resetTimer(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-colors"
                aria-label="Projet précédent"
              >
                <ChevronLeft size={22} className="text-primary" />
              </button>
              <button
                onClick={() => { goNext(); resetTimer(); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-colors"
                aria-label="Projet suivant"
              >
                <ChevronRight size={22} className="text-primary" />
              </button>
            </>
          )}
        </div>

        {/* ── Texte sous le carousel ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="text-center mt-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-primary mb-2">
              {currentItem.title}
            </h3>
            {currentItem.description && (
              <p className="text-gray-500 max-w-lg mx-auto mb-4">
                {currentItem.description}
              </p>
            )}
            {currentItem.url && (
              <a
                href={currentItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent hover:opacity-75 font-semibold text-sm transition-opacity"
              >
                <ExternalLink size={16} />
                Visiter le site
              </a>
            )}
          </motion.div>
        </AnimatePresence>

        {/* ── Indicateurs dots ── */}
        {count > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => { goTo(i); resetTimer(); }}
                className={`rounded-full transition-all duration-300 ${
                  i === current
                    ? 'w-8 h-3 bg-accent'
                    : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Aller au projet ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Portfolio;
