import React, { useState, useEffect } from 'react';
import api from '../services/api';
import EmailTestComponent from '../components/EmailTestComponent';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      setUser(response.data.data.user);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      setMessage('Failed to load profile');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      const response = await api.put('/users/profile', {
        preferences: user?.preferences || {}
      });
      
      setUser(response.data.data.user);
      setMessage('Settings saved successfully');
      setMessageType('success');
    } catch (error) {
      console.error('Failed to save settings:', error);
      setMessage('Failed to save settings');
      setMessageType('error');
    } finally {
      setSaving(false);
    }
  };

  const handlePreferenceChange = (category, field, value) => {
    setUser(prevUser => {
      // Handle case where prevUser is null
      if (!prevUser) return prevUser;
      
      // For theme, which is a direct property of preferences
      if (category === 'theme') {
        return {
          ...prevUser,
          preferences: {
            ...(prevUser.preferences || {}),
            theme: value
          }
        };
      }
      
      // For nested properties like notifications.email
      return {
        ...prevUser,
        preferences: {
          ...(prevUser.preferences || {}),
          [category]: {
            ...(prevUser.preferences?.[category] || {}),
            [field]: value
          }
        }
      };
    });
  };

  if (loading) {
    return <div className="container mt-4">Loading...</div>;
  }

  // Handle case where user is null
  if (!user) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          Failed to load user profile. Please try refreshing the page.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <h2>Settings</h2>
          
          {message && (
            <div className={`alert alert-${messageType === 'success' ? 'success' : 'danger'}`}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleSave}>
            <div className="card mb-4">
              <div className="card-header">
                <h5>Notification Preferences</h5>
              </div>
              <div className="card-body">
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="emailNotifications"
                    checked={user.preferences?.notifications?.email !== false}
                    onChange={(e) => handlePreferenceChange('notifications', 'email', e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="emailNotifications">
                    Email Notifications
                  </label>
                  <div className="form-text">
                    Receive email notifications for important events like task due dates.
                  </div>
                </div>
                
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="pushNotifications"
                    checked={user.preferences?.notifications?.push !== false}
                    onChange={(e) => handlePreferenceChange('notifications', 'push', e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="pushNotifications">
                    Push Notifications
                  </label>
                  <div className="form-text">
                    Receive browser push notifications for task reminders.
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card mb-4">
              <div className="card-header">
                <h5>Appearance</h5>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label">Theme</label>
                  <select
                    className="form-select"
                    value={user.preferences?.theme || 'light'}
                    onChange={(e) => handlePreferenceChange('theme', '', e.target.value)}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </form>
          
          <div className="card mt-4">
            <div className="card-header">
              <h5>Email Testing</h5>
            </div>
            <div className="card-body">
              <EmailTestComponent />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;