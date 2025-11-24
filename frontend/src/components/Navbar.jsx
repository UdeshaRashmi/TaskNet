 import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const NavigationBar = ({ isAuthenticated, user, onLogout }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const authenticatedLinks = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/tasks', icon: '✓', label: 'Tasks' },
    { path: '/summary', icon: '📊', label: 'Summary' },
    { path: '/profile', icon: '👤', label: 'Profile' },
    { path: '/settings', icon: '⚙️', label: 'Settings' },
    { path: '/about', icon: 'ℹ️', label: 'About' },
    { path: '/contact', icon: '✉️', label: 'Contact' }
  ];

  const publicLinks = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/about', icon: 'ℹ️', label: 'About' },
    { path: '/contact', icon: '✉️', label: 'Contact' },
    { path: '/login', icon: '🔑', label: 'Login' },
    { path: '/register', icon: '✨', label: 'Register' }
  ];

  const links = isAuthenticated ? authenticatedLinks : publicLinks;

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .navbar-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(99, 102, 241, 0.1);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.08);
          animation: slideDown 0.5s ease;
        }

        .navbar-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
        }

        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          text-decoration: none;
          transition: transform 0.3s ease;
        }

        .navbar-brand:hover {
          transform: scale(1.05);
        }

        .brand-logo {
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.6rem;
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
          transition: all 0.3s ease;
        }

        .navbar-brand:hover .brand-logo {
          transform: rotate(-5deg) scale(1.1);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
        }

        .brand-name {
          font-size: 1.8rem;
          font-weight: 800;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .navbar-menu {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          list-style: none;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 1.2rem;
          border-radius: 12px;
          text-decoration: none;
          color: #4b5563;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 12px;
        }

        .nav-link:hover::before {
          opacity: 1;
        }

        .nav-link:hover {
          color: #6366f1;
          transform: translateY(-2px);
        }

        .nav-link-active {
          color: white !important;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }

        .nav-link-active::before {
          display: none;
        }

        .nav-link-active:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
        }

        .nav-icon {
          font-size: 1.2rem;
        }

        .logout-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 1.5rem;
          border-radius: 12px;
          text-decoration: none;
          color: white;
          font-weight: 700;
          font-size: 0.95rem;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          cursor: pointer;
          margin-left: 1rem;
        }

        .logout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
        }

        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: background 0.2s;
        }

        .mobile-toggle:hover {
          background: rgba(99, 102, 241, 0.1);
        }

        .hamburger {
          width: 28px;
          height: 20px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .hamburger span {
          width: 100%;
          height: 3px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .hamburger.open span:nth-child(1) {
          transform: rotate(45deg) translateY(8px);
        }

        .hamburger.open span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.open span:nth-child(3) {
          transform: rotate(-45deg) translateY(-8px);
        }

        .mobile-menu {
          display: none;
          position: fixed;
          top: 80px;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(99, 102, 241, 0.1);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          padding: 1rem 2rem 2rem;
          animation: fadeIn 0.3s ease;
          max-height: calc(100vh - 80px);
          overflow-y: auto;
        }

        .mobile-menu.open {
          display: block;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          text-decoration: none;
          color: #4b5563;
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 0.5rem;
          transition: all 0.3s ease;
        }

        .mobile-nav-link:hover {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
          color: #6366f1;
          transform: translateX(5px);
        }

        .mobile-nav-link-active {
          color: white !important;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
        }

        .mobile-logout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.7rem;
          padding: 1rem;
          border-radius: 12px;
          color: white;
          font-weight: 700;
          font-size: 1rem;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
          border: none;
          cursor: pointer;
          width: 100%;
          margin-top: 1rem;
        }

        @media (max-width: 1200px) {
          .navbar-menu {
            gap: 0.3rem;
          }

          .nav-link {
            padding: 0.6rem 1rem;
            font-size: 0.9rem;
          }
        }

        @media (max-width: 968px) {
          .navbar-menu {
            display: none;
          }

          .logout-btn {
            display: none;
          }

          .mobile-toggle {
            display: block;
          }
        }

        @media (max-width: 640px) {
          .navbar-container {
            padding: 0 1rem;
            height: 70px;
          }

          .brand-logo {
            width: 45px;
            height: 45px;
            font-size: 1.4rem;
          }

          .brand-name {
            font-size: 1.5rem;
          }

          .mobile-menu {
            top: 70px;
            max-height: calc(100vh - 70px);
            padding: 1rem;
          }

          .mobile-nav-link {
            padding: 0.9rem 1.2rem;
          }
        }
      `}</style>

      <nav className="navbar-wrapper">
        <div className="navbar-container">
          {/* Brand */}
          <a href="/" className="navbar-brand">
            <div className="brand-logo">✓</div>
            <span className="brand-name">TaskNest</span>
          </a>

          {/* Desktop Menu */}
          <ul className="navbar-menu">
            {links.map((link) => (
              <li key={link.path}>
                <a
                  href={link.path}
                  className={`nav-link ${location.pathname === link.path ? 'nav-link-active' : ''}`}
                  onClick={handleNavClick}
                >
                  <span className="nav-icon">{link.icon}</span>
                  <span>{link.label}</span>
                </a>
              </li>
            ))}
            {isAuthenticated && (
              <li>
                <button onClick={onLogout} className="logout-btn">
                  <span>🚪</span>
                  <span>Logout</span>
                </button>
              </li>
            )}
          </ul>

          {/* Mobile Toggle */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <div className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          {links.map((link) => (
            <a
              key={link.path}
              href={link.path}
              className={`mobile-nav-link ${location.pathname === link.path ? 'mobile-nav-link-active' : ''}`}
              onClick={handleNavClick}
            >
              <span className="nav-icon">{link.icon}</span>
              <span>{link.label}</span>
            </a>
          ))}
          {isAuthenticated && (
            <button onClick={() => { onLogout(); setMobileMenuOpen(false); }} className="mobile-logout-btn">
              <span>🚪</span>
              <span>Logout</span>
            </button>
          )}
        </div>
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div style={{ height: '80px' }}></div>
    </>
  );
};

export default NavigationBar;