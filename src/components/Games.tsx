import React from 'react';
import { motion } from 'framer-motion';
import { useAdminData } from '../contexts/AdminDataContext';
import TiltCard from '../animations/TiltCard';
import SectionTitle from '../animations/SectionTitle';

const Games: React.FC = () => {
  const { gamesData } = useAdminData();
  const getColorClasses = (index: number) => {
    const colors = [
      'bg-accent text-white',
      'bg-primary text-white',
      'bg-accent text-white',
      'bg-primary text-white',
      'bg-accent text-white',
      'bg-primary text-white',
      'bg-accent text-white',
      'bg-primary text-white',
      'bg-accent text-white',
      'bg-primary text-white'
    ];
    return colors[index % colors.length];
  };

  return (
    <section id="games" className="relative py-24 bg-white overflow-hidden">
      <div className="pointer-events-none absolute top-1/3 -right-40 h-[30rem] w-[30rem] rounded-full bg-orange/10 blur-3xl" />
      <div className="relative container mx-auto px-4">
        <SectionTitle eyebrow="Team building" lead="Nos" highlight="Jeux" subtitle={gamesData.subtitle} />

        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="bg-white rounded-3xl shadow-xl ring-1 ring-black/5 p-8 md:p-10 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-primary">
              Pourquoi nos jeux d'équipe ?
            </h3>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } } }}
            >
              {gamesData.benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="group flex items-start space-x-3 rounded-xl p-3 transition-colors duration-300 hover:bg-orange/5"
                  variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                >
                  <motion.div
                    className="flex-shrink-0 w-8 h-8 bg-orange rounded-full flex items-center justify-center text-white text-sm font-bold shadow-[0_6px_16px_-6px_rgba(220,88,42,0.8)] transition-transform duration-300 group-hover:scale-110"
                    variants={{ hidden: { scale: 0 }, visible: { scale: 1, transition: { type: 'spring', stiffness: 400, damping: 15 } } }}
                  >
                    {index + 1}
                  </motion.div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">{benefit.title}</h4>
                    <p className="text-gray-600 text-sm">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6">
          {gamesData.games.map((game, index) => (
            <motion.div
              key={game.id}
              className="w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1.125rem)]"
              initial={{ opacity: 0, y: 50, rotate: index % 2 ? 2 : -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: (index % 4) * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <TiltCard className="h-full" innerClassName={`relative h-full overflow-hidden rounded-2xl p-6 shadow-lg ${getColorClasses(index)}`}>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/15" />
              <div className="relative text-center">
                <div className="text-5xl mb-4" data-atropos-offset="10">
                  <span className="inline-block float-slow" style={{ animationDelay: `${index * -0.7}s` }}>{game.emoji}</span>
                </div>
                <h3 className="text-xl font-bold mb-2" data-atropos-offset="4">
                  {game.name}
                </h3>
                <p className="text-sm opacity-90 leading-relaxed">
                  {game.description}
                </p>
                {game.difficulty && (
                  <div className="mt-3 text-xs font-semibold">
                    Difficulté: {game.difficulty}
                  </div>
                )}
                {game.duration && (
                  <div className="mt-1 text-xs font-semibold">
                    Durée: {game.duration}
                  </div>
                )}
                {game.players && (
                  <div className="mt-1 text-xs font-semibold">
                    Joueurs: {game.players}
                  </div>
                )}
              </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Games;
