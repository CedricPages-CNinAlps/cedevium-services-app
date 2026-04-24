import React from 'react';
import { motion } from 'framer-motion';
import { Code, Briefcase, Palette, ArrowRight } from 'lucide-react';

const Activities: React.FC = () => {
  const activities = [
    {
      icon: Code,
      title: "Activité 1",
      subtitle: "Développement Web & SaaS",
      description: "Prestation de service de développement web et commercialisation d'un abonnement sur une plateforme SaaS (Software As A Service) visant à automatiser des processus réglementaires de génération de documents.",
      services: [
        "Création de sites internet",
        "Développements web spécifiques",
        "Refonte de sites internet",
        "Maintenance de sites internet"
      ],
      color: "orange"
    },
    {
      icon: Briefcase,
      title: "Activité 2",
      subtitle: "Services Entreprises",
      description: "Prestation de services divers pour des entreprises, aide divers sur leurs activités, communications et services web, évènement de groupe et animation.",
      services: [
        "Aide sur vos activités",
        "Services de communication",
        "Services web pour entreprises",
        "Événements de groupe et animation"
      ],
      color: "blue"
    },
    {
      icon: Palette,
      title: "Activité 3",
      subtitle: "Conception 3D",
      description: "Prestation de service d'aide à la conception 3D sur les logiciels d'aménagement professionnels pour les professionnels et particuliers (cuisine, dressing, etc.) sans activité de montage.",
      services: [
        "Conception 3D professionnelle",
        "Aménagement de cuisine",
        "Conception de dressing",
        "Projets pour particuliers et professionnels"
      ],
      color: "purple"
    }
  ];

  const getColorClasses = (color: string) => {
    switch(color) {
      case 'orange':
        return 'bg-orange text-white';
      case 'blue':
        return 'bg-blue-night text-white';
      case 'purple':
        return 'bg-purple-600 text-white';
      default:
        return 'bg-orange text-white';
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
            Nos <span className="text-orange">Activités</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez nos trois pôles d'expertise pour accompagner votre développement
          </p>
        </motion.div>

        <div className="space-y-12">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.title}
              className={`rounded-2xl overflow-hidden shadow-xl ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } flex flex-col md:flex`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className={`md:w-1/3 ${getColorClasses(activity.color)} p-8 flex flex-col justify-center`}>
                <div className="mb-4">
                  <activity.icon size={48} />
                </div>
                <h3 className="text-2xl font-bold mb-2">{activity.title}</h3>
                <h4 className="text-xl mb-4">{activity.subtitle}</h4>
              </div>
              
              <div className="md:w-2/3 bg-gray-50 p-8">
                <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                  {activity.description}
                </p>
                
                <div className="mb-6">
                  <h5 className="font-bold text-lg mb-3 text-blue-night">Services inclus :</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activity.services.map((service, serviceIndex) => (
                      <div key={serviceIndex} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-orange rounded-full"></div>
                        <span className="text-gray-600">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <motion.button
                  className={`inline-flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                    activity.color === 'orange' 
                      ? 'bg-orange hover:bg-orange/90 text-white' 
                      : activity.color === 'blue'
                      ? 'bg-blue-night hover:bg-blue-night/90 text-white'
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default Activities;
