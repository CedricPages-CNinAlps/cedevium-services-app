import React from 'react';
import { motion } from 'framer-motion';
import { Code, Cpu, Users, Palette } from 'lucide-react';
import { servicesData, colors } from '../data';

const Services: React.FC = () => {
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
    <section id="services" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Nos <span className="text-orange">Services</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {servicesData.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {servicesData.services.map((service, index) => {
            const IconComponent = getIconComponent(service.icon);
            return (
              <motion.div
                key={service.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="w-16 h-16 bg-orange/10 rounded-lg flex items-center justify-center mb-4">
                  <IconComponent size={32} className="text-orange" />
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-blue-night">{service.title}</h3>
                
                <p className="text-gray-600 mb-4">{service.description}</p>
                
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-orange rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
