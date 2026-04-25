import React from 'react';
import { motion } from 'framer-motion';
import { gamesData } from '../data';

const Games: React.FC = () => {
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
    <section id="games" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Nos <span className="text-accent">Jeux</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {gamesData.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gamesData.games.map((game, index) => (
            <motion.div
              key={game.id}
              className={`rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${getColorClasses(index)}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="text-center">
                <div className="text-3xl font-bold mb-3">
                  {game.emoji}
                </div>
                <h3 className="text-xl font-bold mb-2">
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
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-primary">
              Pourquoi nos jeux d'équipe ?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {gamesData.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">{benefit.title}</h4>
                    <p className="text-gray-600 text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Games;
