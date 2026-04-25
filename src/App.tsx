import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Services from './components/Services';
import Activities from './components/Activities';
import Games from './components/Games';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <Services />
      <Activities />
      <Games />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
