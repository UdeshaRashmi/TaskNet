import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Security', href: '/security' },
      { label: 'Roadmap', href: '/roadmap' }
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' },
      { label: 'Press Kit', href: '/press' }
    ],
    resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Help Center', href: '/help' },
      { label: 'Contact', href: '/contact' },
      { label: 'Status', href: '/status' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'GDPR', href: '/gdpr' }
    ]
  };

  const socialLinks = [
    { name: 'Twitter', icon: '𝕏', href: 'https://twitter.com', color: '#000000' },
    { name: 'Facebook', icon: 'f', href: 'https://facebook.com', color: '#1877f2' },
    { name: 'LinkedIn', icon: 'in', href: 'https://linkedin.com', color: '#0077b5' },
    { name: 'GitHub', icon: '⚡', href: 'https://github.com', color: '#333333' },
    { name: 'Instagram', icon: '📷', href: 'https://instagram.com', color: '#e4405f' }
  ];

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .footer-wrapper {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }

        .footer-wrapper::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent);
        }

        .footer-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 4rem 2rem 2rem;
        }

        .footer-main {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr;
          gap: 3rem;
          margin-bottom: 3rem;
          animation: fadeInUp 0.8s ease;
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .brand-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .brand-logo {
          width: 55px;
          height: 55px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
          animation: float 3s ease-in-out infinite;
        }

        .brand-name {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-description {
          color: #9ca3af;
          line-height: 1.7;
          font-size: 0.95rem;
        }

        .social-links {
          display: flex;
          gap: 0.8rem;
          flex-wrap: wrap;
        }

        .social-link {
          width: 45px;
          height: 45px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          color: white;
          font-size: 1.3rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .social-link:hover {
          transform: translateY(-5px);
          background: var(--social-color);
          box-shadow: 0 8px 25px var(--social-shadow);
          border-color: transparent;
        }

        .footer-section {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .footer-section-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.3rem;
          position: relative;
          display: inline-block;
        }

        .footer-section-title::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 30px;
          height: 3px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          border-radius: 2px;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          list-style: none;
        }

        .footer-link {
          color: #9ca3af;
          text-decoration: none;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          display: inline-block;
          position: relative;
        }

        .footer-link::before {
          content: '→';
          position: absolute;
          left: -20px;
          opacity: 0;
          transition: all 0.3s ease;
          color: #6366f1;
        }

        .footer-link:hover {
          color: #6366f1;
          transform: translateX(10px);
        }

        .footer-link:hover::before {
          opacity: 1;
          left: -15px;
        }

        .footer-bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .footer-copyright {
          color: #9ca3af;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .heart {
          color: #ef4444;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }

        .footer-badges {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          font-size: 0.85rem;
          color: #9ca3af;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .badge:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(99, 102, 241, 0.3);
          transform: translateY(-2px);
        }

        .badge-icon {
          font-size: 1.1rem;
        }

        .newsletter-section {
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 3rem;
          animation: fadeInUp 0.8s ease 0.2s backwards;
        }

        .newsletter-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .newsletter-text h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: white;
        }

        .newsletter-text p {
          color: #9ca3af;
          font-size: 0.95rem;
        }

        .newsletter-form {
          display: flex;
          gap: 0.8rem;
          flex: 1;
          max-width: 450px;
        }

        .newsletter-input {
          flex: 1;
          padding: 0.9rem 1.2rem;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.05);
          color: white;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .newsletter-input:focus {
          outline: none;
          border-color: #6366f1;
          background: rgba(255, 255, 255, 0.08);
        }

        .newsletter-input::placeholder {
          color: #6b7280;
        }

        .newsletter-button {
          padding: 0.9rem 2rem;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
          white-space: nowrap;
        }

        .newsletter-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
        }

        @media (max-width: 1200px) {
          .footer-main {
            grid-template-columns: 1.5fr 1fr 1fr 1fr;
          }

          .footer-section:last-child {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 968px) {
          .footer-main {
            grid-template-columns: 1fr 1fr;
            gap: 2.5rem;
          }

          .footer-brand {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 640px) {
          .footer-container {
            padding: 3rem 1.5rem 2rem;
          }

          .footer-main {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .newsletter-content {
            flex-direction: column;
            align-items: flex-start;
          }

          .newsletter-form {
            width: 100%;
            max-width: 100%;
            flex-direction: column;
          }

          .newsletter-button {
            width: 100%;
          }

          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
          }

          .footer-badges {
            width: 100%;
          }

          .badge {
            flex: 1;
            justify-content: center;
          }
        }
      `}</style>

      <footer className="footer-wrapper">
        <div className="footer-container">
          {/* Newsletter Section */}
          <div className="newsletter-section">
            <div className="newsletter-content">
              <div className="newsletter-text">
                <h3>Stay Updated</h3>
                <p>Subscribe to our newsletter for the latest updates and tips</p>
              </div>
              <div className="newsletter-form">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="newsletter-input"
                />
                <button className="newsletter-button">Subscribe</button>
              </div>
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="footer-main">
            {/* Brand Section */}
            <div className="footer-brand">
              <div className="brand-header">
                <div className="brand-logo">✓</div>
                <span className="brand-name">TaskNest</span>
              </div>
              <p className="brand-description">
                The ultimate task management platform to organize your life and boost productivity. 
                Trusted by thousands of users worldwide.
              </p>
              <div className="social-links">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="social-link"
                    style={{
                      '--social-color': social.color,
                      '--social-shadow': `${social.color}40`
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div className="footer-section">
              <h4 className="footer-section-title">Product</h4>
              <ul className="footer-links">
                {footerLinks.product.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="footer-link">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div className="footer-section">
              <h4 className="footer-section-title">Company</h4>
              <ul className="footer-links">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="footer-link">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div className="footer-section">
              <h4 className="footer-section-title">Resources</h4>
              <ul className="footer-links">
                {footerLinks.resources.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="footer-link">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div className="footer-section">
              <h4 className="footer-section-title">Legal</h4>
              <ul className="footer-links">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="footer-link">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="footer-bottom">
            <div className="footer-copyright">
              <span>© {currentYear} TaskNest. Made with</span>
              <span className="heart">♥</span>
              <span>for productivity</span>
            </div>
            <div className="footer-badges">
              <div className="badge">
                <span className="badge-icon">🔒</span>
                <span>SSL Secured</span>
              </div>
              <div className="badge">
                <span className="badge-icon">✓</span>
                <span>GDPR Compliant</span>
              </div>
              <div className="badge">
                <span className="badge-icon">⚡</span>
                <span>99.9% Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;