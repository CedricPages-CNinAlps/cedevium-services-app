import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, Variants } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { useAdminData, isPublished } from '../contexts/AdminDataContext';

const titleContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const titleWord: Variants = {
  hidden: { y: '110%', rotate: 4 },
  visible: { y: '0%', rotate: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
  exit: { y: '-110%', transition: { duration: 0.4, ease: [0.64, 0, 0.78, 0] } },
};

const fadeUp = (delay: number): Variants => ({
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.3 } },
});

const Hero: React.FC = () => {
  const { heroData, images } = useAdminData();
  const slides = heroData.slides.filter(isPublished);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Parallaxe au défilement : l'image descend moins vite, le texte s'efface
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '45%']);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, heroData.slider.autoPlayInterval);
    return () => clearInterval(timer);
  }, [slides.length, heroData.slider.autoPlayInterval, currentSlide]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const slide = slides[currentSlide] ?? slides[0];
  if (!slide) return null;
  const titleWords = slide.title.split(' ').filter(Boolean);

  return (
    <section ref={sectionRef} id="home" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-blue-night">
      {/* Image de fond : parallaxe + zoom lent (Ken Burns) */}
      <motion.div className="absolute inset-0 will-change-transform" style={{ y: bgY }}>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat hero-kenburns"
          style={{ backgroundImage: `url('${images.hero.background}')` }}
        />
      </motion.div>

      {/* Vagues blanches translucides animées en bas de l'image */}
      <svg
        className="hero-waves absolute bottom-0 left-0 w-full h-24 md:h-32 pointer-events-none"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <path id="hero-wave" d="M-160 44c30 0 58-18 88-18s58 18 88 18 58-18 88-18 58 18 88 18v44h-352z" />
        </defs>
        <g>
          <use href="#hero-wave" x="48" y="0" fill="rgba(255,255,255,0.10)" />
          <use href="#hero-wave" x="48" y="3" fill="rgba(255,255,255,0.14)" />
          <use href="#hero-wave" x="48" y="5" fill="rgba(255,255,255,0.18)" />
          <use href="#hero-wave" x="48" y="7" fill="rgba(255,255,255,0.22)" />
        </g>
      </svg>

      {/* Contenu du slide */}
      <motion.div
        className="relative z-10 container mx-auto px-4 text-center text-white hero-text-shadow"
        style={{ y: contentY }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="max-w-4xl mx-auto pb-24"
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.h1
              className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-[1.05]"
              variants={titleContainer}
            >
              {titleWords.map((w, i) => (
                <React.Fragment key={i}>
                  <span className="inline-block overflow-hidden align-bottom pb-[0.1em] -mb-[0.1em]">
                    <motion.span className="inline-block origin-bottom-left" variants={titleWord}>{w}</motion.span>
                  </span>{' '}
                </React.Fragment>
              ))}
            </motion.h1>

            <motion.div variants={fadeUp(0.35)} className="flex items-center justify-center gap-4 mb-6">
              <span className="h-px w-10 bg-orange" />
              <h2 className="text-xl md:text-2xl font-medium text-white/90">{slide.subtitle}</h2>
              <span className="h-px w-10 bg-orange" />
            </motion.div>

            <motion.p variants={fadeUp(0.5)} className="text-lg md:text-xl mb-10 text-white/80 max-w-2xl mx-auto">
              {slide.description}
            </motion.p>

            {slide.ctaUrl && (
              <motion.div variants={fadeUp(0.65)}>
                <a
                  href={slide.ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-orange px-8 py-4 font-bold text-white shadow-[0_10px_40px_-10px_rgba(220,88,42,0.8)] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <span className="absolute inset-0 -translate-x-full bg-white/20 skew-x-12 transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative">{slide.cta}</span>
                  <ArrowRight size={20} className="relative transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Contrôles du slider, ancrés à la section */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 z-10 text-white">
        <button
          onClick={prevSlide}
          aria-label="Slide précédente"
          className="p-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/25 transition-colors"
        >
          <ChevronRight className="rotate-180" size={22} />
        </button>

        <div className="flex gap-2">
          {slides.map((s, index) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Aller à la slide ${index + 1}`}
              className="relative h-1.5 w-10 overflow-hidden rounded-full bg-white/30"
            >
              {index === currentSlide && (
                <span
                  key={currentSlide}
                  className="hero-progress absolute inset-y-0 left-0 bg-orange"
                  style={{ animationDuration: `${heroData.slider.autoPlayInterval}ms` }}
                />
              )}
            </button>
          ))}
        </div>

        <button
          onClick={nextSlide}
          aria-label="Slide suivante"
          className="p-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/25 transition-colors"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Indicateur de défilement */}
      <a
        href="#activities"
        aria-label="Défiler vers la suite"
        className="hidden md:flex absolute bottom-8 right-8 z-10 flex-col items-center gap-2 text-white/70 hover:text-white transition-colors"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] [writing-mode:vertical-rl]">Défiler</span>
        <span className="relative h-12 w-px overflow-hidden bg-white/25">
          <span className="hero-scroll-line absolute left-0 top-0 h-1/2 w-full bg-orange" />
        </span>
      </a>
    </section>
  );
};

export default Hero;
