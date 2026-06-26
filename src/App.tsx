import React, { useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Activities from './components/Activities';
import Portfolio from './components/Portfolio';
import Games from './components/Games';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CustomPage from './components/CustomPage';
import AdminPanel from './admin/AdminPanel';
import TrackingTags from './components/TrackingTags';
import ScrollToTop from './components/ScrollToTop';
import { AdminDataProvider, useAdminData } from './contexts/AdminDataContext';


function AppContent() {
  const { logoConfig } = useAdminData();

  useEffect(() => {
    if (logoConfig.favicon) {
      const link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
      if (link) link.href = logoConfig.favicon;
    }
    if (logoConfig.appleTouchIcon) {
      const link = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
      if (link) link.href = logoConfig.appleTouchIcon;
    }
  }, [logoConfig.favicon, logoConfig.appleTouchIcon]);
  const pageSlug = new URLSearchParams(window.location.search).get('page');

  if (pageSlug) {
    return (
      <>
        <CustomPage slug={pageSlug} />
        <AdminPanel />
      </>
    );
  }

  return (
    <div className="App">
      <Header />
      <Hero />
      <Activities />
      <Services />
      <Portfolio />
      <Games />
      <Contact />
      <Footer />
      <AdminPanel />
      <TrackingTags />
      <ScrollToTop />
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
