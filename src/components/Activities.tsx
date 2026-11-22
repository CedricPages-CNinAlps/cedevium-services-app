import React from 'react';
import { motion } from 'framer-motion';
import { Code, Cpu, Users, Palette } from 'lucide-react';
import { useAdminData } from '../contexts/AdminDataContext';
import SectionTitle from '../animations/SectionTitle';
import TiltCard from '../animations/TiltCard';

const Activities: React.FC = () => {
  const { servicesData } = useAdminData();
  const getIconComponent = (iconName: string) => {
    switch(iconName) {
      case 'Code': return Code;
      case 'Cpu': return Cpu;
      case 'Users': return Users;
      case 'Palette': return Palette;
      default: return Code;
    }
  };

  return (
    <section id="activities" className="relative py-24 bg-gray-50 overflow-hidden">
      {/* Formes décoratives floues */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-orange/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-blue-night/10 blur-3xl" />

      <div className="relative container mx-auto px-4">
        <SectionTitle eyebrow="Ce que nous faisons" lead="Nos" highlight="Activités" subtitle={servicesData.subtitle} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {servicesData.services.map((service, index) => {
            const IconComponent = getIconComponent(service.icon);
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                <TiltCard
                  className="group h-full"
                  innerClassName="relative h-full overflow-hidden rounded-2xl bg-white p-7 shadow-lg ring-1 ring-black/5 transition-shadow duration-500 hover:shadow-2xl"
                >
                  {/* Barre orange qui se déploie au survol */}
                  <span className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-orange transition-transform duration-500 group-hover:scale-x-100" />

                  {/* Numéro et icône en filigrane */}
                  <span className="absolute right-5 top-4 text-5xl font-black text-blue-night/5" data-atropos-offset="-2">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <IconComponent
                    size={150}
                    className="pointer-events-none absolute -bottom-8 -right-8 text-blue-night/[0.04] transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110"
                  />

                  <div
                    className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-xl bg-orange/10 transition-all duration-500 group-hover:bg-orange group-hover:shadow-[0_10px_30px_-8px_rgba(220,88,42,0.7)]"
                    data-atropos-offset="6"
                  >
                    <IconComponent size={32} className="text-orange transition-colors duration-500 group-hover:text-white" />
                  </div>

                  <h3 className="relative text-xl font-bold mb-3 text-blue-night" data-atropos-offset="3">{service.title}</h3>

                  <p className="relative text-gray-600 mb-5">{service.description}</p>

                  <ul className="relative space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <motion.li
                        key={featureIndex}
                        className="flex items-center text-sm text-gray-600"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.12 + featureIndex * 0.06 }}
                      >
                        <span className="mr-2 h-1.5 w-1.5 rounded-full bg-orange transition-transform duration-300 group-hover:scale-150" />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Activities;
