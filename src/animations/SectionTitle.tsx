import React from 'react';
import { motion, Variants } from 'framer-motion';

interface SectionTitleProps {
  eyebrow?: string;
  lead: string;
  highlight: string;
  subtitle?: string;
  dark?: boolean;
}

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const word: Variants = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

const fade: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// Mot révélé par un masque : il monte depuis sous sa ligne de base.
const MaskedWord: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
    <motion.span className={`inline-block ${className}`} variants={word}>{children}</motion.span>
  </span>
);

// En-tête de section commun : surtitre, titre révélé mot à mot, soulignement
// orange qui se dessine, sous-titre en fondu.
const SectionTitle: React.FC<SectionTitleProps> = ({ eyebrow, lead, highlight, subtitle, dark = false }) => {
  const leadWords = lead.split(' ').filter(Boolean);

  return (
    <motion.div
      className="text-center mb-16"
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
    >
      {eyebrow && (
        <motion.p
          variants={fade}
          className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-orange mb-4"
        >
          <span className="h-px w-8 bg-orange" />
          {eyebrow}
          <span className="h-px w-8 bg-orange" />
        </motion.p>
      )}

      <h2 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-5 ${dark ? 'text-white' : 'text-blue-night'}`}>
        {leadWords.map((w, i) => (
          <React.Fragment key={i}>
            <MaskedWord>{w}</MaskedWord>{' '}
          </React.Fragment>
        ))}
        <span className="relative inline-block">
          <MaskedWord className="text-orange">{highlight}</MaskedWord>
          <motion.span
            className="absolute left-0 -bottom-1 h-[6px] w-full rounded-full bg-orange/30 origin-left"
            variants={{
              hidden: { scaleX: 0 },
              visible: { scaleX: 1, transition: { duration: 0.8, delay: 0.35, ease: [0.22, 1, 0.36, 1] } },
            }}
          />
        </span>
      </h2>

      {subtitle && (
        <motion.p variants={fade} className={`text-xl max-w-3xl mx-auto ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
};

export default SectionTitle;
