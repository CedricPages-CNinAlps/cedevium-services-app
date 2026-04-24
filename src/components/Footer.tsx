import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-night text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-orange rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">CS</span>
              </div>
              <span className="text-xl font-bold">Cedevium Services</span>
            </div>
            <p className="text-gray-300 mb-4">
              Votre partenaire de confiance pour le développement web, les services entreprises et la conception 3D.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-orange">Liens Rapides</h3>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-300 hover:text-orange transition-colors">Accueil</a></li>
              <li><a href="#services" className="text-gray-300 hover:text-orange transition-colors">Services</a></li>
              <li><a href="#activities" className="text-gray-300 hover:text-orange transition-colors">Activités</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-orange transition-colors">Contact</a></li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold mb-4 text-orange">Contact</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail size={18} className="text-orange" />
                <span className="text-gray-300">contact@cedevium-services.fr</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={18} className="text-orange" />
                <span className="text-gray-300">+33 6 00 00 00 00</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={18} className="text-orange" />
                <span className="text-gray-300">France</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          className="border-t border-gray-600 mt-8 pt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-gray-300">
            © 2024 Cedevium Services. Développé par Cedevium Services
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
