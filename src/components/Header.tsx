import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Code, Briefcase, Home, Mail, Gamepad2 } from 'lucide-react';
import { useAdminData, isPublished } from '../contexts/AdminDataContext';

const Header: React.FC = () => {
  const { headerData, logoConfig } = useAdminData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const solid = scrolled || isMenuOpen;

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
    <header
      className={`fixed top-0 w-full text-white z-50 transition-all duration-500 ${
        solid
          ? 'bg-blue-night/85 backdrop-blur-md shadow-lg'
          : 'bg-transparent hover:bg-blue-night/85 hover:backdrop-blur-md hover:shadow-lg'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className={`flex justify-between items-center transition-all duration-500 ${scrolled ? 'h-16' : 'h-20'}`}>
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {logoConfig.type === 'image' && logoConfig.imageData ? (
              <img src={logoConfig.imageData} alt={logoConfig.imageAlt} className="h-10 w-auto object-contain" />
            ) : (
              <div className={`w-10 h-10 bg-accent rounded-lg flex items-center justify-center`}>
                <span className="text-white font-bold text-xl">{headerData.logo.text}</span>
              </div>
            )}
            <span className="text-xl font-bold">{headerData.logo.company}</span>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {headerData.navigation.filter(isPublished).map((item, index) => {
              const IconComponent = getIconComponent(item.icon);
              return (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="group relative flex items-center space-x-1 py-1 hover-text-accent transition-colors duration-300"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <IconComponent size={18} />
                  <span>{item.name}</span>
                  <span className="absolute left-0 -bottom-0.5 h-0.5 w-full origin-left scale-x-0 bg-orange transition-transform duration-300 group-hover:scale-x-100" />
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
            {headerData.navigation.filter(isPublished).map((item, index) => {
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
