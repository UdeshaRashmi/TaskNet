  import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api-fetch';
import { autoCapitalize, validateCapitalization, getCapitalizationError } from '../utils/validation';

const Register = ({ onLogin }) => {
  const navigate = useNavigate();
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Redirect after successful registration
  useEffect(() => {
    if (registerSuccess) {
      console.log('Registration successful, redirecting to /tasks...');
      navigate('/tasks', { replace: true });
    }
  }, [registerSuccess, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-capitalize name field
    let processedValue = value;
    if (name === 'name') {
      processedValue = autoCapitalize(value);
    }
    
    setFormData({
      ...formData,
      [name]: processedValue
    });

    // Calculate password strength
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 6) strength += 25;
      if (value.length >= 8) strength += 25;
      if (/[A-Z]/.test(value)) strength += 25;
      if (/[0-9]/.test(value) || /[^A-Za-z0-9]/.test(value)) strength += 25;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation - Name capitalization
    if (!validateCapitalization(formData.name)) {
      setError(getCapitalizationError('Name'));
      setLoading(false);
      return;
    }

    // Validation - Passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validation - Password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting registration with:', { name: formData.name, email: formData.email });
      
      // Call actual backend API
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      console.log('Full registration response:', response);
      console.log('Response data:', response.data);
      
      if (response && response.data && response.data.success && response.data.data) {
        const { user, token } = response.data.data;
        
        console.log('Extracted user:', user);
        console.log('Extracted token:', token);
        
        // Validate user object has required properties
        if (!user || !token) {
          console.error('Invalid response structure:', { user, token });
          setError('Registration failed. Invalid response from server.');
          return;
        }
        
        console.log('Registration successful, calling onLogin with:', { user, token });
        
        // Call parent component's onLogin callback
        if (onLogin) {
          onLogin(user, token);
        }
        
        // Set success flag to trigger redirect in useEffect
        setRegisterSuccess(true);
      } else {
        console.error('Invalid response format:', response);
        setError('Registration failed. Invalid response from server.');
      }
      
    } catch (err) {
      console.error('Registration error:', err);
      console.error('Error stack:', err.stack);
      const errorMessage = err.message || 'Registration failed. Please try again.';
      
      if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
        setError('Cannot connect to server. Please ensure the backend server is running on http://localhost:5000');
      } else if (errorMessage.includes('User already exists')) {
        setError('An account with this email already exists. Please use a different email or login.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return '#ef4444';
    if (passwordStrength <= 50) return '#f59e0b';
    if (passwordStrength <= 75) return '#10b981';
    return '#059669';
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 25) return 'Weak';
    if (passwordStrength <= 50) return 'Fair';
    if (passwordStrength <= 75) return 'Good';
    return 'Strong';
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

        .register-wrapper {
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

        .register-wrapper::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
          animation: float 20s ease-in-out infinite;
        }

        .register-container {
          width: 100%;
          max-width: 520px;
          position: relative;
          z-index: 1;
          animation: fadeIn 0.8s ease;
        }

        .register-card {
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
          border-color: #10b981;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
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
          color: #10b981;
        }

        .password-strength {
          margin-top: 0.5rem;
        }

        .password-strength-bar {
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 0.4rem;
        }

        .password-strength-fill {
          height: 100%;
          transition: all 0.3s ease;
          border-radius: 3px;
        }

        .password-strength-label {
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .submit-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(16, 185, 129, 0.4);
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

        .login-link {
          text-align: center;
          margin-top: 1.5rem;
        }

        .login-link p {
          color: #6b7280;
          font-size: 0.95rem;
          margin: 0;
        }

        .login-link a {
          color: #10b981;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s;
        }

        .login-link a:hover {
          color: #059669;
          text-decoration: underline;
        }

        .benefits-list {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }

        .benefit-item {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          color: #6b7280;
          font-size: 0.9rem;
        }

        .benefit-icon {
          width: 32px;
          height: 32px;
          min-width: 32px;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 0.8rem;
          color: #10b981;
          font-size: 1.1rem;
        }

        @media (max-width: 640px) {
          .register-wrapper {
            padding: 1rem;
          }

          .register-card {
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

      <div className="register-wrapper">
        <div className="register-container">
          <div className="register-card">
            {/* Logo Section */}
            <div className="logo-section">
              <div className="logo-icon">
                ✨
              </div>
              <h2>Create Account</h2>
              <p>Join TaskNest and boost your productivity</p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="alert-error">
                <span>⚠️ {error}</span>
                <button onClick={() => setError('')}>×</button>
              </div>
            )}

            {/* Registration Form */}
            <div>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

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
                    placeholder="Create a password (min 6 characters)"
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
                {formData.password && (
                  <div className="password-strength">
                    <div className="password-strength-bar">
                      <div 
                        className="password-strength-fill"
                        style={{
                          width: `${passwordStrength}%`,
                          background: getPasswordStrengthColor()
                        }}
                      />
                    </div>
                    <div 
                      className="password-strength-label"
                      style={{ color: getPasswordStrengthColor() }}
                    >
                      <span>{getPasswordStrengthLabel()}</span>
                      <span>{passwordStrength}%</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    Create Account
                  </>
                )}
              </button>
            </div>

            {/* Login Link */}
            <div className="login-link">
              <p>
                Already have an account?{' '}
                <a href="/login">Sign in here</a>
              </p>
            </div>

            {/* Benefits */}
            <div className="benefits-list">
              <div className="benefit-item">
                <div className="benefit-icon">✓</div>
                <span>Free forever - No credit card required</span>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">🔒</div>
                <span>Your data is encrypted and secure</span>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">⚡</div>
                <span>Start organizing in under 60 seconds</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;