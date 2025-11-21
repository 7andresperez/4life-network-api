import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <h1>4Life Network</h1>
        </Link>
        <nav className="nav">
          <Link to="/" className={`nav-link ${isActive('/')}`}>
            Dashboard
          </Link>
          <Link to="/network" className={`nav-link ${isActive('/network')}`}>
            Red
          </Link>
          <Link to="/search" className={`nav-link ${isActive('/search')}`}>
            Buscar
          </Link>
          <Link to="/import" className={`nav-link ${isActive('/import')}`}>
            Importar
          </Link>
          <Link to="/reports" className={`nav-link ${isActive('/reports')}`}>
            Reportes
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

