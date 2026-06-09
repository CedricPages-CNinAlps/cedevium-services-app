import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Activities from './components/Activities';
import Games from './components/Games';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPanel from './admin/AdminPanel';
import { AdminDataProvider, useAdminData } from './contexts/AdminDataContext';

const AdminTrigger: React.FC = () => {
  const { openAdmin } = useAdminData();
  return (
    <button
      onClick={openAdmin}
      className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full shadow-lg flex items-center justify-center text-white text-xs font-bold transition-opacity opacity-20 hover:opacity-100"
      style={{ background: '#1E1A34' }}
      title="Ouvrir le back office (Ctrl+Shift+A)"
    >
      ⚙
    </button>
  );
};

function AppContent() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <Services />
      <Activities />
      <Games />
      <Contact />
      <Footer />
      <AdminPanel />
      <AdminTrigger />
    </div>
  );
}

function App() {
  return (
    <AdminDataProvider>
      <AppContent />
    </AdminDataProvider>
  );
}

export default App;
