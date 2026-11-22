import React from 'react';
import { motion } from 'framer-motion';
import { Code, Briefcase, Palette, Network, ArrowRight, MessageCircle } from 'lucide-react';
import { useAdminData, isPublished } from '../contexts/AdminDataContext';
import SectionTitle from '../animations/SectionTitle';
import { scrollToElement } from '../animations/motion';

const Services: React.FC = () => {
  const { activitiesData, setPrefilledSubject } = useAdminData();

  const getIconComponent = (iconName: string) => {
    switch(iconName) {
      case 'Code': return Code;
      case 'Briefcase': return Briefcase;
      case 'Palette': return Palette;
      case 'Network': return Network;
      default: return Code;
    }
  };

  const getColorClasses = (color: string) => {
    switch(color) {
      case 'orange': return 'bg-accent text-white';
      case 'blue': return 'bg-primary text-white';
      case 'purple': return 'bg-purple-600 text-white';
      default: return 'bg-accent text-white';
    }
  };

  const handleContactClick = (contactSubject: string) => {
    setPrefilledSubject(contactSubject || 'autre');
    const section = document.getElementById('contact');
    if (section) scrollToElement(section);
  };

  if (!isPublished(activitiesData)) return null;

  return (
    <section id="services" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <SectionTitle eyebrow="Notre expertise" lead="Nos" highlight="Services" subtitle={activitiesData.subtitle} />

        <div className="space-y-16">
          {activitiesData.activities.filter(isPublished).map((activity, index) => {
            const IconComponent = getIconComponent(activity.icon);
            const image = (activity as any).image as string | undefined;
            const showIcon = (activity as any).showIcon !== false;
            const contactSubject = (activity as any).contactSubject as string | undefined;
            const learnMoreUrl = (activity as any).learnMoreUrl as string | undefined;

            return (
              <motion.div
                key={activity.id}
                className={`group rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5 transition-shadow duration-500 hover:shadow-2xl ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex flex-col md:flex`}
                initial={{ opacity: 0, y: 60, clipPath: 'inset(10% 5% 10% 5% round 24px)' }}
                whileInView={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 24px)' }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Panneau coloré — icône + logo optionnel sur la même ligne */}
                <div className={`relative overflow-hidden md:w-1/3 ${getColorClasses(activity.color)} p-8 flex flex-col justify-center`}>
                  {/* Décor : reflet en dégradé, icône géante en rotation lente, numéro */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/15 via-transparent to-black/20" />
                  <IconComponent
                    size={260}
                    className="pointer-events-none absolute -right-16 -bottom-16 opacity-10 spin-very-slow"
                  />
                  <span className="pointer-events-none absolute top-4 right-6 text-7xl font-black leading-none text-white/10">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="relative mb-4 transition-transform duration-500 group-hover:-translate-y-1">
                    {showIcon && <IconComponent size={48} className={image ? 'mb-3' : ''} />}
                    {image && (
                      <img
                        src={image}
                        alt={`Logo ${activity.title} — ${activity.subtitle}`}
                        className="h-24 w-auto object-contain max-w-[200px] rounded"
                        style={{ filter: 'brightness(0) invert(1)' }}
                      />
                    )}
                  </div>
                  <h3 className="relative text-2xl font-bold mb-2">{activity.title}</h3>
                  <h4 className="relative text-xl mb-4 text-white/85">{activity.subtitle}</h4>
                  <span className="relative block h-1 w-12 rounded-full bg-white/60 transition-all duration-500 group-hover:w-24" />
                </div>

                {/* Contenu principal */}
                <div className="md:w-2/3 bg-gray-50 p-8 md:p-10">
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                    {activity.description}
                  </p>

                  <div className="mb-6">
                    <h5 className="font-bold text-lg mb-3 text-primary">Services inclus :</h5>
                    <motion.div
                      className="grid grid-cols-1 md:grid-cols-2 gap-3"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.3 }}
                      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } } }}
                    >
                      {activity.services.map((service, serviceIndex) => (
                        <motion.div
                          key={serviceIndex}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-300 hover:bg-white hover:shadow-sm"
                          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}
                        >
                          <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-orange/15">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange" />
                          </span>
                          <span className="text-gray-700">{service}</span>
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {learnMoreUrl && (
                      <motion.a
                        href={learnMoreUrl}
                        className={`group/more relative inline-flex items-center gap-2 overflow-hidden px-6 py-3 rounded-lg border-2 font-semibold text-white transition-colors duration-300 ${
                          activity.color === 'orange'
                            ? 'bg-orange border-orange hover:border-blue-night'
                            : activity.color === 'blue'
                            ? 'bg-blue-night border-blue-night hover:border-orange'
                            : 'bg-purple-600 border-purple-600 hover:border-purple-800'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {/* Remplissage contrasté qui glisse de gauche à droite au survol */}
                        <span
                          className={`absolute inset-0 origin-left scale-x-0 transition-transform duration-300 ease-out group-hover/more:scale-x-100 ${
                            activity.color === 'orange' ? 'bg-blue-night' : activity.color === 'blue' ? 'bg-orange' : 'bg-purple-800'
                          }`}
                        />
                        <span className="relative">En savoir plus</span>
                        <ArrowRight size={20} className="relative transition-transform duration-300 group-hover/more:translate-x-1" />
                      </motion.a>
                    )}

                    <motion.button
                      onClick={() => handleContactClick(contactSubject || 'autre')}
                      className="group/btn relative inline-flex items-center gap-2 overflow-hidden px-6 py-3 rounded-lg font-semibold border-2 border-orange text-orange hover:text-white transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Remplissage orange qui glisse de gauche à droite au survol */}
                      <span className="absolute inset-0 origin-left scale-x-0 bg-orange transition-transform duration-300 ease-out group-hover/btn:scale-x-100" />
                      <MessageCircle size={20} className="relative" />
                      <span className="relative">Nous contacter</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
