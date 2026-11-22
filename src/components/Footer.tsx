import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useAdminData, isPublished } from '../contexts/AdminDataContext';

const Footer: React.FC = () => {
  const { footerData, logoConfig, openAdmin } = useAdminData();
  const getIconComponent = (iconName: string) => {
    switch(iconName) {
      case 'Mail': return Mail;
      case 'Phone': return Phone;
      case 'MapPin': return MapPin;
      default: return Mail;
    }
  };
  return (
    <footer className="relative bg-blue-night text-white pt-12 pb-8">
      {/* Vague de transition avec la section précédente */}
      <svg
        className="absolute bottom-full left-0 w-full h-12 md:h-20 text-blue-night"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path fill="currentColor" d="M0,40 C240,80 480,0 720,30 C960,60 1200,10 1440,40 L1440,80 L0,80 Z" />
      </svg>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              {logoConfig.type === 'image' && logoConfig.imageData ? (
                <img src={logoConfig.imageData} alt={logoConfig.imageAlt} className="h-10 w-auto object-contain" />
              ) : (
                <div className={`w-10 h-10 bg-accent rounded-lg flex items-center justify-center`}>
                  <span className="text-white font-bold text-xl">{footerData.company.logo}</span>
                </div>
              )}
              <span className="text-xl font-bold">{footerData.company.name}</span>
            </div>
            <p className="text-gray-300 mb-4">
              {footerData.company.description}
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className={`text-lg font-semibold mb-4 text-accent`}>{footerData.quickLinks.title}</h3>
            <ul className="space-y-2">
              {footerData.quickLinks.links.filter(isPublished).map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="link-underline text-gray-300 hover:text-orange transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className={`text-lg font-semibold mb-4 text-accent`}>{footerData.contact.title}</h3>
            <div className="space-y-2">
              {footerData.contact.info.map((info, index) => {
                const IconComponent = getIconComponent(info.icon);
                return (
                  <div key={index} className="flex items-center space-x-2">
                    <IconComponent size={18} className={`text-accent`} />
                    <span className="text-gray-300">{info.content}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          className="border-t border-gray-600 mt-8 pt-8 flex items-center justify-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-gray-300">
            {footerData.copyright}
          </p>
          <button
            onClick={openAdmin}
            title="Ouvrir le back office (Ctrl+Shift+A)"
            className="text-gray-600 hover:text-gray-300 transition-colors text-base leading-none"
          >
            ⚙
          </button>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
