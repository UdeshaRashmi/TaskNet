import React, { useState } from 'react';
import api from '../services/api';

const EmailTestComponent = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const testEmailNotification = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const response = await api.post('/users/test-email');
      setTestResult({ success: true, message: response.data.message });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send test email';
      setTestResult({ 
        success: false, 
        message: errorMessage
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="email-test-section">
      <h3>Test Email Notifications</h3>
      <p>Send a test email to verify your notification settings are working correctly.</p>
      
      <button 
        onClick={testEmailNotification} 
        disabled={isTesting}
        className="btn btn-secondary"
      >
        {isTesting ? 'Sending...' : 'Send Test Email'}
      </button>
      
      {testResult && (
        <div className={`alert ${testResult.success ? 'alert-success' : 'alert-danger'} mt-3`}>
          {testResult.message}
        </div>
      )}
      
      <div className="mt-3">
        <small className="text-muted">
          Note: Make sure your email preferences are enabled in your profile settings.
        </small>
      </div>
    </div>
  );
};

export default EmailTestComponent;