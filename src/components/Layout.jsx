import React from 'react';
import { Outlet } from 'react-router-dom'; // Outlet will render the matched child route

// You can import your header and footer components here
import Header from './Header'; 
import Footer from './Footer'; 

const Layout = () => {
  return (
    <div>
      <Header /> {/* Header will be displayed on all pages */}
      
      <main>
        <Outlet /> {/* This will render the content of the current route (page) */}
      </main>
      
      <Footer /> {/* Footer will be displayed on all pages */}
    </div>
  );
};

export default Layout;
