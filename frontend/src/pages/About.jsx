import React from 'react';

const About = () => {
  const features = [
    {
      icon: 'bi-lightning-charge-fill',
      title: 'Lightning Fast',
      description: 'Quick and responsive interface for seamless task management',
      color: '#6366f1',
      bgGradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
    },
    {
      icon: 'bi-shield-lock-fill',
      title: 'Secure & Private',
      description: 'Your data is encrypted and stored securely',
      color: '#10b981',
      bgGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    {
      icon: 'bi-people-fill',
      title: 'User Friendly',
      description: 'Intuitive design that anyone can use without training',
      color: '#f59e0b',
      bgGradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    },
    {
      icon: 'bi-graph-up-arrow',
      title: 'Productivity Boost',
      description: 'Increase your productivity by 40% with organized tasks',
      color: '#ec4899',
      bgGradient: 'linear-gradient(135deg, #ec4899 0%, #d946ef 100%)'
    }
  ];

  const stats = [
    { label: 'Task Completion', value: 85, color: '#6366f1' },
    { label: 'User Satisfaction', value: 95, color: '#10b981' },
    { label: 'Productivity Gain', value: 78, color: '#f59e0b' },
    { label: 'Time Saved', value: 65, color: '#ec4899' }
  ];

  const benefits = [
    {
      title: 'Smart Organization',
      description: 'Intelligent categorization and prioritization',
      icon: 'bi-kanban',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
    },
    {
      title: 'Cross-Platform Sync',
      description: 'Access your tasks from any device, anywhere',
      icon: 'bi-cloud-check-fill',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    {
      title: 'Advanced Analytics',
      description: 'Track your productivity with detailed insights',
      icon: 'bi-graph-up',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    },
    {
      title: '24/7 Support',
      description: 'Always here to help you succeed',
      icon: 'bi-headset',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #d946ef 100%)'
    }
  ];

  return (
    <>
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.10.0/font/bootstrap-icons.min.css"
      />
      
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
        }

        .about-page-wrapper {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          min-height: auto;
          padding: 3rem 1rem;
          padding-bottom: 4rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          text-align: center;
          color: white;
          margin-bottom: 4rem;
          animation: fadeInDown 0.8s ease;
        }

        .header h1 {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
          text-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
          background: linear-gradient(135deg, #fff 0%, #f0f0f0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header p {
          font-size: 1.4rem;
          opacity: 0.95;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          font-weight: 300;
          letter-spacing: 0.5px;
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

        .card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          margin-bottom: 2.5rem;
          overflow: hidden;
          animation: fadeInUp 0.8s ease;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .card:hover {
          transform: translateY(-8px);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.25);
        }

        .card-body {
          padding: 3rem;
        }

        .hero-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%);
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero-card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(102, 126, 234, 0.15) 0%, transparent 70%);
          animation: rotate 20s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .hero-content {
          position: relative;
          z-index: 1;
        }

        .mission-icon {
          width: 90px;
          height: 90px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          box-shadow: 0 10px 35px rgba(99, 102, 241, 0.5);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .mission-icon i {
          font-size: 2.8rem;
          color: white;
        }

        h3 {
          font-size: 2.2rem;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 1.5rem;
        }

        .mission-text {
          font-size: 1.2rem;
          color: #4b5563;
          line-height: 1.9;
          max-width: 800px;
          margin: 0 auto;
          font-weight: 400;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 2.5rem;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.3);
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
          transform: translateY(-12px) scale(1.03);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
        }

        .feature-icon {
          width: 100px;
          height: 100px;
          background: var(--feature-gradient);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .feature-card:hover .feature-icon {
          transform: scale(1.1) rotate(-5deg);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.25);
        }

        .feature-icon i {
          font-size: 2.8rem;
          color: white;
          transition: all 0.4s ease;
        }

        .feature-card:hover .feature-icon i {
          transform: scale(1.1);
        }

        .feature-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.75rem;
        }

        .feature-description {
          color: #6b7280;
          line-height: 1.7;
          font-size: 1rem;
        }

        .stats-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 3.5rem 3rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          margin-bottom: 2.5rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .stats-title {
          text-align: center;
          font-size: 2.2rem;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 3rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2.5rem;
        }

        .stat-item {
          position: relative;
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.2rem;
        }

        .stat-label {
          font-weight: 600;
          color: #374151;
          font-size: 1.1rem;
        }

        .stat-value {
          font-weight: 800;
          font-size: 1.8rem;
          color: var(--stat-color);
        }

        .progress-bar {
          width: 100%;
          height: 14px;
          background: #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
          position: relative;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .progress-fill {
          height: 100%;
          background: var(--stat-color);
          border-radius: 10px;
          transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .benefits-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 3.5rem 3rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .benefits-title {
          text-align: center;
          font-size: 2.2rem;
          font-weight: 800;
          color: #1f2937;
          margin-bottom: 3rem;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .benefit-item {
          display: flex;
          align-items: start;
          gap: 1.5rem;
          padding: 1.8rem;
          border-radius: 20px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
        }

        .benefit-item:hover {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
          transform: translateX(10px);
          border: 1px solid rgba(99, 102, 241, 0.1);
        }

        .benefit-icon {
          width: 70px;
          height: 70px;
          min-width: 70px;
          background: var(--benefit-gradient);
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }

        .benefit-item:hover .benefit-icon {
          transform: scale(1.1) rotate(-5deg);
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.2);
        }

        .benefit-icon i {
          font-size: 2rem;
          color: white;
        }

        .benefit-content h6 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .benefit-content p {
          color: #6b7280;
          line-height: 1.7;
          margin: 0;
        }

        .image-section {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          margin-bottom: 2.5rem;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .image-wrapper {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 15px 45px rgba(0, 0, 0, 0.2);
          margin: 1.5rem 0;
        }

        .image-wrapper img {
          width: 100%;
          height: auto;
          display: block;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .image-wrapper:hover img {
          transform: scale(1.08);
        }

        .section-title {
          text-align: center;
          color: white;
          margin-bottom: 2.5rem;
          text-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          font-size: 2.2rem;
          font-weight: 800;
        }

        @media (max-width: 768px) {
          .header h1 {
            font-size: 2.5rem;
          }
          
          .features-grid {
            grid-template-columns: 1fr;
          }
          
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .card-body {
            padding: 2rem;
          }

          .stats-section, .benefits-section {
            padding: 2.5rem 2rem;
          }
        }
      `}</style>

      <div className="about-page-wrapper">
        <div className="container">
        <div className="header">
          <h1>✨ About TaskNest</h1>
          <p>The ultimate task management solution for modern professionals</p>
        </div>

        <div className="card hero-card">
          <div className="card-body">
            <div className="hero-content">
              <div className="mission-icon">
                <i className="bi bi-bullseye"></i>
              </div>
              <h3>Our Mission</h3>
              <p className="mission-text">
                To empower individuals and teams to achieve their full potential through 
                intuitive and powerful task management tools. We believe that organized 
                work leads to organized minds and extraordinary results.
              </p>
            </div>
          </div>
        </div>

        <div className="image-section">
          <h3 style={{ marginBottom: '1rem' }}>Experience the Power of Organization</h3>
          <div className="image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=1200&h=600&fit=crop" 
              alt="Productive workspace with laptop and organized tasks"
            />
          </div>
        </div>

        <h3 className="section-title">
          Why Choose TaskNest?
        </h3>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
              style={{ 
                '--feature-color': feature.color,
                '--feature-gradient': feature.bgGradient
              }}
            >
              <div className="feature-icon">
                <i className={`bi ${feature.icon}`}></i>
              </div>
              <h4 className="feature-title">{feature.title}</h4>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="image-section">
          <h3 style={{ marginBottom: '1rem' }}>Team Collaboration Made Easy</h3>
          <div className="image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=600&fit=crop" 
              alt="Team collaboration and task management"
            />
          </div>
        </div>

        <div className="stats-section">
          <h3 className="stats-title">📊 Our Impact</h3>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item" style={{ '--stat-color': stat.color }}>
                <div className="stat-header">
                  <span className="stat-label">{stat.label}</span>
                  <span className="stat-value">{stat.value}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${stat.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="benefits-section">
          <h3 className="benefits-title">🚀 Premium Features</h3>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className="benefit-item"
                style={{ '--benefit-gradient': benefit.gradient }}
              >
                <div className="benefit-icon">
                  <i className={`bi ${benefit.icon}`}></i>
                </div>
                <div className="benefit-content">
                  <h6>{benefit.title}</h6>
                  <p>{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="image-section" style={{ marginTop: '2.5rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>Boost Your Productivity Today</h3>
          <div className="image-wrapper">
            <img 
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=600&fit=crop" 
              alt="Productivity dashboard and analytics"
            />
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default About;