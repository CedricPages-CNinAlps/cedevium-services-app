import React, { useState } from 'react';
import { X, RotateCcw, LogOut, Settings, Image, Briefcase, Activity, Gamepad2, Phone, Navigation, Shield, ImageIcon, Mail, FileText, Menu, LayoutGrid, BarChart2 } from 'lucide-react';
import { useAdminData } from '../contexts/AdminDataContext';
import AdminLogin from './AdminLogin';
import HeroSection from './sections/HeroSection';
import ServicesSection from './sections/ServicesSection';
import ActivitiesSection from './sections/ActivitiesSection';
import GamesSection from './sections/GamesSection';
import ContactSection from './sections/ContactSection';
import NavigationSection from './sections/NavigationSection';
import SecuritySection from './sections/SecuritySection';
import AssetsSection from './sections/AssetsSection';
import EmailSection from './sections/EmailSection';
import PagesSection from './sections/PagesSection';
import LogoSection from './sections/LogoSection';
import PortfolioSection from './sections/PortfolioSection';
import TrackingSection from './sections/TrackingSection';

const SECTIONS = [
  { id: 'hero', label: 'Hero & Image', Icon: Image, group: 'Contenu' },
  { id: 'services', label: 'Activités (cartes)', Icon: Briefcase, group: 'Contenu' },
  { id: 'activities', label: 'Services (blocs)', Icon: Activity, group: 'Contenu' },
  { id: 'portfolio', label: 'Portfolio (slider)', Icon: LayoutGrid, group: 'Contenu' },
  { id: 'games', label: 'Jeux', Icon: Gamepad2, group: 'Contenu' },
  { id: 'contact', label: 'Contact', Icon: Phone, group: 'Contenu' },
  { id: 'navigation', label: 'Navigation & Footer', Icon: Navigation, group: 'Contenu' },
  { id: 'logo', label: 'Logo & Identité', Icon: ImageIcon, group: 'Identité' },
  { id: 'pages', label: 'Pages', Icon: FileText, group: 'Identité' },
  { id: 'assets', label: 'Médiathèque', Icon: Image, group: 'Médias' },
  { id: 'email', label: 'Email (formulaire)', Icon: Mail, group: 'Paramètres' },
  { id: 'tracking', label: 'Tags & Analytics', Icon: BarChart2, group: 'Paramètres' },
  { id: 'security', label: 'Sécurité', Icon: Shield, group: 'Paramètres' },
];

const GROUPS = ['Contenu', 'Identité', 'Médias', 'Paramètres'];

const AdminPanel: React.FC = () => {
  const { isAdminOpen, isAuthenticated, closeAdmin, logout, resetToDefaults } = useAdminData();
  const [activeSection, setActiveSection] = useState('hero');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const handleSectionChange = (id: string) => {
    setActiveSection(id);
    setSidebarOpen(false);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'hero': return <HeroSection />;
      case 'services': return <ActivitiesSection />;
      case 'activities': return <ServicesSection />;
      case 'portfolio': return <PortfolioSection />;
      case 'games': return <GamesSection />;
      case 'contact': return <ContactSection />;
      case 'navigation': return <NavigationSection />;
      case 'logo': return <LogoSection />;
      case 'pages': return <PagesSection />;
      case 'assets': return <AssetsSection />;
      case 'email': return <EmailSection />;
      case 'tracking': return <TrackingSection />;
      case 'security': return <SecuritySection />;
      default: return null;
    }
  };

  const currentSection = SECTIONS.find(s => s.id === activeSection);

  const SidebarContent = () => (
    <>
      <div className="p-4 border-b flex-shrink-0" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
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

      <nav className="flex-1 p-3 overflow-y-auto">
        {GROUPS.map(group => {
          const groupSections = SECTIONS.filter(s => s.group === group);
          return (
            <div key={group} className="mb-4">
              <p className="text-xs font-semibold uppercase tracking-wider px-3 mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {group}
              </p>
              <div className="space-y-0.5">
                {groupSections.map(({ id, label, Icon }) => (
                  <button key={id} onClick={() => handleSectionChange(id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm"
                    style={{
                      background: activeSection === id ? '#DC582A' : 'transparent',
                      color: activeSection === id ? 'white' : 'rgba(255,255,255,0.65)',
                    }}
                    onMouseEnter={e => { if (activeSection !== id) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                    onMouseLeave={e => { if (activeSection !== id) e.currentTarget.style.background = 'transparent'; }}>
                    <Icon size={15} className="flex-shrink-0" />
                    <span className="font-medium truncate">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="p-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={handleReset}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm"
          style={{ background: showResetConfirm ? '#dc2626' : 'transparent', color: showResetConfirm ? 'white' : 'rgba(255,255,255,0.5)' }}>
          <RotateCcw size={15} />
          <span>{showResetConfirm ? 'Confirmer ?' : 'Réinitialiser'}</span>
        </button>
        <button onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm"
          style={{ color: 'rgba(255,255,255,0.5)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'white'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}>
          <LogOut size={15} />
          <span>Déconnexion</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 z-[1000] flex" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[1001] bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar desktop (toujours visible) */}
      <div className="hidden md:flex w-60 flex-col flex-shrink-0 overflow-hidden" style={{ background: '#1E1A34' }}>
        <SidebarContent />
      </div>

      {/* Sidebar mobile (slide-in) */}
      <div
        className={`fixed top-0 left-0 h-full w-72 flex flex-col z-[1002] md:hidden transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: '#1E1A34' }}
      >
        <div className="flex justify-end p-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg text-white" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <X size={18} />
          </button>
        </div>
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-100">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-2 md:gap-3">
            {/* Hamburger mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 mr-1"
            >
              <Menu size={20} />
            </button>
            {currentSection && <currentSection.Icon size={20} style={{ color: '#DC582A' }} />}
            <h1 className="font-bold text-base md:text-lg truncate" style={{ color: '#1E1A34' }}>{currentSection?.label}</h1>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="hidden lg:block text-xs text-gray-400">Ctrl+Shift+A pour fermer</span>
            <button onClick={closeAdmin} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Section content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
