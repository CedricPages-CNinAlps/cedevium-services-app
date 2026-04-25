import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Code, Briefcase, Home, Mail, Gamepad2 } from 'lucide-react';
import { headerData } from '../data';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const getIconComponent = (iconName: string) => {
    switch(iconName) {
      case 'Home': return Home;
      case 'Briefcase': return Briefcase;
      case 'Code': return Code;
      case 'Gamepad2': return Gamepad2;
      case 'Mail': return Mail;
      default: return Home;
    }
  };

  return (
    <header className={`fixed top-0 w-full bg-primary text-white z-50 shadow-lg`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`w-10 h-10 bg-accent rounded-lg flex items-center justify-center`}>
              <span className="text-white font-bold text-xl">{headerData.logo.text}</span>
            </div>
            <span className="text-xl font-bold">{headerData.logo.company}</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {headerData.navigation.map((item, index) => {
              const IconComponent = getIconComponent(item.icon);
              return (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1 hover-text-accent transition-colors duration-300`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <IconComponent size={18} />
                  <span>{item.name}</span>
                </motion.a>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden"
            onClick={toggleMenu}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.nav
            className={`md:hidden py-4 border-t border-accent/20`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {headerData.navigation.map((item, index) => {
              const IconComponent = getIconComponent(item.icon);
              return (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-2 py-2 hover-text-accent transition-colors duration-300`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IconComponent size={18} />
                  <span>{item.name}</span>
                </motion.a>
              );
            })}
          </motion.nav>
        )}
      </div>
    </header>
  );
};

export default Header;
