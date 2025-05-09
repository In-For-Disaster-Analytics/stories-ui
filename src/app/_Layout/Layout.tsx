import React, { useState } from 'react';
import Header from './_components/Header/Header';
import Footer from './_components/Footer/Footer';
import Router from '../_Router/_Router';

const Layout: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div>
      <div className="w-full flex flex-col min-h-screen">
        <Header toggleMenu={toggleMenu} />
        <main>
          <Router />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
