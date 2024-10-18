import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <h1>MarioPool</h1>
      </div>
      <nav>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/RegisterLogin">Sign Up</Link></li>
          <li><Link to="/Login">Login</Link></li>
          <li><Link to="/Subscription">Subscription</Link></li>
          <li><Link to="/Profile">Profile</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
