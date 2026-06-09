import React, { useState } from 'react';
import { X, RotateCcw, LogOut, Settings, Image, Layout, Briefcase, Activity, Gamepad2, Phone, Navigation } from 'lucide-react';
import { useAdminData } from '../contexts/AdminDataContext';
import AdminLogin from './AdminLogin';
import HeroSection from './sections/HeroSection';
import ServicesSection from './sections/ServicesSection';
import ActivitiesSection from './sections/ActivitiesSection';
import GamesSection from './sections/GamesSection';
import ContactSection from './sections/ContactSection';
import NavigationSection from './sections/NavigationSection';

const SECTIONS = [
  { id: 'hero', label: 'Hero & Image', Icon: Image },
  { id: 'services', label: 'Services', Icon: Briefcase },
  { id: 'activities', label: 'Activités', Icon: Activity },
  { id: 'games', label: 'Jeux', Icon: Gamepad2 },
  { id: 'contact', label: 'Contact', Icon: Phone },
  { id: 'navigation', label: 'Navigation & Footer', Icon: Navigation },
];

const AdminPanel: React.FC = () => {
  const { isAdminOpen, isAuthenticated, closeAdmin, logout, resetToDefaults } = useAdminData();
  const [activeSection, setActiveSection] = useState('hero');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isAdminOpen) return null;
  if (!isAuthenticated) return <AdminLogin />;

  const handleReset = () => {
    if (showResetConfirm) {
      resetToDefaults();
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'hero': return <HeroSection />;
      case 'services': return <ServicesSection />;
      case 'activities': return <ActivitiesSection />;
      case 'games': return <GamesSection />;
      case 'contact': return <ContactSection />;
      case 'navigation': return <NavigationSection />;
      default: return null;
    }
  };

  const currentSection = SECTIONS.find(s => s.id === activeSection);

  return (
    <div className="fixed inset-0 z-[1000] flex" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Sidebar */}
      <div className="w-60 flex flex-col flex-shrink-0" style={{ background: '#1E1A34' }}>
        <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#DC582A' }}>
              <Settings size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Back Office</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Cedevium Services</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {SECTIONS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm"
              style={{
                background: activeSection === id ? '#DC582A' : 'transparent',
                color: activeSection === id ? 'white' : 'rgba(255,255,255,0.65)',
              }}
              onMouseEnter={e => {
                if (activeSection !== id) e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              }}
              onMouseLeave={e => {
                if (activeSection !== id) e.currentTarget.style.background = 'transparent';
              }}
            >
              <Icon size={16} className="flex-shrink-0" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 space-y-1" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={handleReset}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm"
            style={{
              background: showResetConfirm ? '#dc2626' : 'transparent',
              color: showResetConfirm ? 'white' : 'rgba(255,255,255,0.5)',
            }}
          >
            <RotateCcw size={15} />
            <span>{showResetConfirm ? 'Confirmer la réinitialisation ?' : 'Réinitialiser'}</span>
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm"
            style={{ color: 'rgba(255,255,255,0.5)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
          >
            <LogOut size={15} />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            {currentSection && <currentSection.Icon size={20} style={{ color: '#DC582A' }} />}
            <h1 className="font-bold text-lg" style={{ color: '#1E1A34' }}>{currentSection?.label}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">Ctrl+Shift+A pour fermer</span>
            <button
              onClick={closeAdmin}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
