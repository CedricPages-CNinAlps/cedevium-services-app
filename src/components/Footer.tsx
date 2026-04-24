import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { footerData } from '../data';
import { COLORS } from '../constants/colors';

const Footer: React.FC = () => {
  const getIconComponent = (iconName: string) => {
    switch(iconName) {
      case 'Mail': return Mail;
      case 'Phone': return Phone;
      case 'MapPin': return MapPin;
      default: return Mail;
    }
  };
  return (
    <footer className={`{COLORS.CLASSES.BG_PRIMARY} text-white py-8`}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className={`w-10 h-10 {COLORS.CLASSES.BG_ACCENT} rounded-lg flex items-center justify-center`}>
                <span className="text-white font-bold text-xl">{footerData.company.logo}</span>
              </div>
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
            <h3 className={`text-lg font-semibold mb-4 {COLORS.CLASSES.TEXT_ACCENT}`}>{footerData.quickLinks.title}</h3>
            <ul className="space-y-2">
              {footerData.quickLinks.links.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className={`text-gray-300 hover:{COLORS.CLASSES.TEXT_ACCENT} transition-colors`}>
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
            <h3 className={`text-lg font-semibold mb-4 {COLORS.CLASSES.TEXT_ACCENT}`}>{footerData.contact.title}</h3>
            <div className="space-y-2">
              {footerData.contact.info.map((info, index) => {
                const IconComponent = getIconComponent(info.icon);
                return (
                  <div key={index} className="flex items-center space-x-2">
                    <IconComponent size={18} className={`{COLORS.CLASSES.TEXT_ACCENT}`} />
                    <span className="text-gray-300">{info.content}</span>
                  </div>
                );
              })}
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
            {footerData.copyright}
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
