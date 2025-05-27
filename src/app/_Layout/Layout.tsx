import React, { useState } from 'react';
import Header from './_components/Header/Header';
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
      </div>
    </div>
  );
};

export default Layout;
