import React from 'react';
import { motion } from 'framer-motion';
import { Code, Briefcase, Palette, ArrowRight } from 'lucide-react';
import { activitiesData } from '../data';

const Activities: React.FC = () => {
  const getIconComponent = (iconName: string) => {
    switch(iconName) {
      case 'Code': return Code;
      case 'Briefcase': return Briefcase;
      case 'Palette': return Palette;
      default: return Code;
    }
  };

  const getColorClasses = (color: string) => {
    switch(color) {
      case 'orange':
        return 'bg-accent text-white';
      case 'blue':
        return 'bg-primary text-white';
      case 'purple':
        return 'bg-purple-600 text-white';
      default:
        return 'bg-accent text-white';
    }
  };


  return (
    <section id="activities" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Nos <span className="text-accent">Activités</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {activitiesData.subtitle}
          </p>
        </motion.div>

        <div className="space-y-12">
          {activitiesData.activities.map((activity, index) => {
            const IconComponent = getIconComponent(activity.icon);
            return (
              <motion.div
                key={activity.id}
                className={`rounded-2xl overflow-hidden shadow-xl ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex flex-col md:flex`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <div className={`md:w-1/3 ${getColorClasses(activity.color)} p-8 flex flex-col justify-center`}>
                  <div className="mb-4">
                    <IconComponent size={48} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{activity.title}</h3>
                  <h4 className="text-xl mb-4">{activity.subtitle}</h4>
                </div>
                
                <div className="md:w-2/3 bg-gray-50 p-8">
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                    {activity.description}
                  </p>
                  
                  <div className="mb-6">
                    <h5 className="font-bold text-lg mb-3 text-primary">Services inclus :</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {activity.services.map((service, serviceIndex) => (
                        <div key={serviceIndex} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bullet-accent rounded-full"></div>
                          <span className="text-gray-600">{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <motion.button
                    className={`inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      activity.color === 'orange' 
                        ? 'bg-accent hover-accent-light text-white' 
                        : activity.color === 'blue'
                        ? 'bg-primary hover-primary-light text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>En savoir plus</span>
                    <ArrowRight size={20} />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Activities;
