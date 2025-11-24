 import React from 'react';

const Home = () => {
  const features = [
    {
      icon: '✓',
      title: 'Smart Task Management',
      description: 'Create, organize, and prioritize your tasks with our intuitive interface. Set due dates, add descriptions, and track your progress effortlessly.',
      color: '#6366f1',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
    },
    {
      icon: '📊',
      title: 'Analytics & Insights',
      description: 'Get detailed insights into your productivity patterns. Track completion rates, time spent on tasks, and identify areas for improvement.',
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    {
      icon: '🔒',
      title: 'Secure & Reliable',
      description: 'Your data is protected with enterprise-grade security. Access your tasks from anywhere with our reliable cloud infrastructure.',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    }
  ];

  const stats = [
    { value: '50K+', label: 'Active Users' },
    { value: '1M+', label: 'Tasks Completed' },
    { value: '99.9%', label: 'Uptime' },
    { value: '4.9/5', label: 'User Rating' }
  ];

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
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
            transform: translateY(-20px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .home-wrapper {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          min-height: auto;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          padding: 3rem 1.5rem;
          padding-bottom: 4rem;
          position: relative;
          overflow: hidden;
        }

        .home-wrapper::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
          animation: float 20s ease-in-out infinite;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .hero-section {
          text-align: center;
          margin-bottom: 5rem;
          animation: fadeInDown 0.8s ease;
        }

        .hero-section h1 {
          font-size: 4rem;
          font-weight: 900;
          color: white;
          margin-bottom: 1.5rem;
          text-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
          line-height: 1.2;
        }

        .brand-name {
          background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text ;
          text-shadow: none;
          filter: drop-shadow(0 4px 20px rgba(255, 215, 0, 0.4));
        }

        .hero-section p {
          font-size: 1.4rem;
          color: rgba(255, 255, 255, 0.95);
          margin-bottom: 2.5rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .btn-group {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .btn {
          padding: 1rem 2.5rem;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          text-decoration: none;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        .btn-primary {
          background: white;
          color: #6366f1;
          border: 2px solid white;
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(255, 255, 255, 0.4);
        }

        .btn-secondary {
          background: transparent;
          color: white;
          border: 2px solid white;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-3px);
          box-shadow: 0 12px 35px rgba(255, 255, 255, 0.2);
        }

        .features-section {
          margin-bottom: 5rem;
          animation: fadeInUp 0.8s ease;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: var(--feature-gradient);
          transform: scaleX(0);
          transition: transform 0.4s ease;
        }

        .feature-card:hover::before {
          transform: scaleX(1);
        }

        .feature-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.25);
        }

        .feature-icon {
          width: 100px;
          height: 100px;
          background: var(--feature-gradient);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          margin: 0 auto 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          transition: all 0.4s ease;
        }

        .feature-card:hover .feature-icon {
          transform: scale(1.1) rotate(-5deg);
          animation: pulse 2s ease-in-out infinite;
        }

        .feature-card h4 {
          font-size: 1.6rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .feature-card p {
          font-size: 1rem;
          color: #6b7280;
          line-height: 1.7;
        }

        .stats-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 3rem;
          margin-bottom: 5rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
        }

        .stat-item {
          text-align: center;
          padding: 1.5rem;
          border-radius: 16px;
          transition: all 0.3s ease;
        }

        .stat-item:hover {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
          transform: translateY(-5px);
        }

        .stat-value {
          font-size: 3rem;
          font-weight: 900;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
          display: block;
        }

        .stat-label {
          font-size: 1.1rem;
          color: #6b7280;
          font-weight: 600;
        }

        .cta-section {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 32px;
          padding: 4rem 3rem;
          text-align: center;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.3);
          border: 2px solid rgba(255, 255, 255, 0.2);
          position: relative;
          overflow: hidden;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
          animation: float 15s ease-in-out infinite;
        }

        .cta-content {
          position: relative;
          z-index: 1;
        }

        .cta-section h2 {
          font-size: 2.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1rem;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .cta-section p {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 2.5rem;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .btn-cta {
          background: white;
          color: #6366f1;
          padding: 1.2rem 3rem;
          border-radius: 50px;
          font-size: 1.2rem;
          font-weight: 700;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.7rem;
          box-shadow: 0 10px 35px rgba(255, 255, 255, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          cursor: pointer;
        }

        .btn-cta:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 15px 45px rgba(255, 255, 255, 0.4);
        }

        @media (max-width: 768px) {
          .hero-section h1 {
            font-size: 2.5rem;
          }

          .hero-section p {
            font-size: 1.1rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .cta-section {
            padding: 3rem 2rem;
          }

          .cta-section h2 {
            font-size: 2rem;
          }
        }

        @media (max-width: 640px) {
          .home-wrapper {
            padding: 2rem 1rem;
          }

          .hero-section h1 {
            font-size: 2rem;
          }

          .feature-card {
            padding: 2rem 1.5rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .stat-value {
            font-size: 2.5rem;
          }
        }
      `}</style>

      <div className="home-wrapper">
        <div className="container">
          {/* Hero Section */}
          <div className="hero-section">
            <h1>
              Welcome to <span className="brand-name">TaskNest</span>
            </h1>
            <p>
              The ultimate task management platform to organize your life and boost productivity
            </p>
            <div className="btn-group">
              <a href="/register" className="btn btn-primary">
                <span>👤</span>
                Get Started Free
              </a>
              <a href="/login" className="btn btn-secondary">
                <span>🔑</span>
                Sign In
              </a>
            </div>
          </div>

          {/* Stats Section */}
          <div className="stats-section">
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <span className="stat-value">{stat.value}</span>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div className="features-section">
            <div className="features-grid">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="feature-card"
                  style={{ '--feature-gradient': feature.gradient }}
                >
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                  <h4>{feature.title}</h4>
                  <p>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="cta-section">
            <div className="cta-content">
              <h2>Ready to boost your productivity?</h2>
              <p>
                Join thousands of users who have transformed their workflow with TaskNest
              </p>
              <a href="/register" className="btn-cta">
                <span>🚀</span>
                Start Your Journey
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;