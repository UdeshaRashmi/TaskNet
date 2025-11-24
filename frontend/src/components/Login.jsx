import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api-fetch';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Redirect after successful login
  useEffect(() => {
    if (loginSuccess) {
      console.log('Login successful, redirecting to /tasks...');
      navigate('/tasks', { replace: true });
    }
  }, [loginSuccess, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', { email: formData.email });
      
      // Call actual backend API
      const response = await authAPI.login(formData);
      console.log('Full login response:', response);
      console.log('Response data:', response.data);
      
      if (response && response.data && response.data.success && response.data.data) {
        const { user, token } = response.data.data;
        
        console.log('Extracted user:', user);
        console.log('Extracted token:', token);
        
        // Validate user object has required properties
        if (!user || !token) {
          console.error('Invalid response structure:', { user, token });
          setError('Login failed. Invalid response from server.');
          return;
        }
        
        console.log('Login successful, calling onLogin with:', { user, token });
        
        // Call parent component's onLogin callback
        if (onLogin) {
          onLogin(user, token);
        }
        
        // Set success flag to trigger redirect in useEffect
        setLoginSuccess(true);
      } else {
        console.error('Invalid response format:', response);
        setError('Login failed. Invalid response from server.');
      }
      
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error stack:', err.stack);
      const errorMessage = err.message || 'Login failed. Please try again.';
      
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        setError('Cannot connect to server. Please ensure the backend server is running on http://localhost:5000');
      } else if (errorMessage.includes('401') || errorMessage.includes('Invalid credentials')) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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

        .login-wrapper {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .login-wrapper::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
          animation: float 20s ease-in-out infinite;
        }

        .login-container {
          width: 100%;
          max-width: 480px;
          position: relative;
          z-index: 1;
          animation: fadeIn 0.8s ease;
        }

        .login-card {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border-radius: 32px;
          padding: 3rem;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .logo-section {
          text-align: center;
          margin-bottom: 2.5rem;
        }

        .logo-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          margin: 0 auto 1.5rem;
          box-shadow: 0 10px 35px rgba(99, 102, 241, 0.4);
          animation: float 3s ease-in-out infinite;
        }

        .logo-section h2 {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .logo-section p {
          font-size: 1rem;
          color: #6b7280;
          font-weight: 500;
        }

        .alert-error {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          padding: 1rem 1.2rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          animation: slideIn 0.5s ease;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }

        .alert-error button {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          opacity: 0.8;
          transition: opacity 0.2s;
          padding: 0;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .alert-error button:hover {
          opacity: 1;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.6rem;
          font-size: 0.95rem;
        }

        .input-wrapper {
          position: relative;
        }

        .form-control {
          width: 100%;
          padding: 0.95rem 1.2rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: white;
          color: #1f2937;
          font-family: inherit;
        }

        .form-control:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
        }

        .form-control::placeholder {
          color: #9ca3af;
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          font-size: 1.2rem;
          padding: 0.5rem;
          transition: color 0.2s;
        }

        .password-toggle:hover {
          color: #6366f1;
        }

        .submit-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(99, 102, 241, 0.4);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 1.5rem 0;
          color: #9ca3af;
          font-size: 0.9rem;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }

        .divider span {
          padding: 0 1rem;
        }

        .signup-link {
          text-align: center;
          margin-top: 1.5rem;
        }

        .signup-link p {
          color: #6b7280;
          font-size: 0.95rem;
          margin: 0;
        }

        .signup-link a {
          color: #6366f1;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }

        .signup-link a:hover {
          color: #8b5cf6;
          text-decoration: underline;
        }

        .features-list {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }

        .feature-item {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          color: #6b7280;
          font-size: 0.9rem;
        }

        .feature-icon {
          width: 32px;
          height: 32px;
          min-width: 32px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 0.8rem;
          color: #6366f1;
          font-size: 1.1rem;
        }

        @media (max-width: 640px) {
          .login-wrapper {
            padding: 1rem;
          }

          .login-card {
            padding: 2rem 1.5rem;
          }

          .logo-section h2 {
            font-size: 1.8rem;
          }

          .logo-icon {
            width: 70px;
            height: 70px;
            font-size: 2rem;
          }
        }
      `}</style>

      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-card">
            {/* Logo Section */}
            <div className="logo-section">
              <div className="logo-icon">
                ✓
              </div>
              <h2>Welcome Back!</h2>
              <p>Sign in to your TaskNest account</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="alert-error">
                <span>⚠️ {error}</span>
                <button onClick={() => setError('')}>×</button>
              </div>
            )}

            {/* Login Form */}
            <div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <span>🔑</span>
                    Sign In
                  </>
                )}
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="signup-link">
              <p>
                Don't have an account?{' '}
                <a href="/register">Sign up here</a>
              </p>
            </div>

            {/* Features */}
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <span>Secure authentication & encrypted data</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <span>Lightning fast performance</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📱</div>
                <span>Access from any device, anywhere</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;