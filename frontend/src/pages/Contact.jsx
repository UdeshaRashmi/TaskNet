import React, { useState, useEffect } from 'react';
import { contactsAPI } from '../services/api-fetch';
import { autoCapitalize, validateCapitalization, getCapitalizationError } from '../utils/validation';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'normal'
  });
  const [contacts, setContacts] = useState([]);
  const [editingContact, setEditingContact] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [loading, setLoading] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0
  });
  const [error, setError] = useState('');

  // Load user's contact messages (if authenticated)
  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Loading contacts, token exists:', !!token);
      
      if (token) {
        console.log('Fetching contacts and stats...');
        const [contactsResponse, statsResponse] = await Promise.all([
          contactsAPI.getAll(),
          contactsAPI.getStats()
        ]);
        
        console.log('Contacts response:', contactsResponse);
        console.log('Stats response:', statsResponse);
        
        setContacts(contactsResponse.data.data?.contacts || []);
        setStats(statsResponse.data.data?.overall || {
          total: 0,
          pending: 0,
          inProgress: 0,
          resolved: 0,
          closed: 0
        });
        
        console.log('Contacts loaded:', contactsResponse.data.data?.contacts?.length || 0);
      } else {
        console.log('No token found, skipping contacts load');
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      console.error('Error details:', error.response || error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-capitalize name and subject fields
    let processedValue = value;
    if (name === 'name' || name === 'subject') {
      processedValue = autoCapitalize(value);
    }
    
    setFormData({
      ...formData,
      [name]: processedValue
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate name capitalization
    if (!validateCapitalization(formData.name)) {
      setError(getCapitalizationError('Name'));
      setLoading(false);
      return;
    }

    // Validate subject capitalization
    if (!validateCapitalization(formData.subject)) {
      setError(getCapitalizationError('Subject'));
      setLoading(false);
      return;
    }

    try {
      if (editingContact) {
        // Update existing contact
        await contactsAPI.update(editingContact._id, formData);
        setAlertMessage('✅ Contact message updated successfully!');
        setEditingContact(null);
      } else {
        // Create new contact
        await contactsAPI.create(formData);
        setAlertMessage('✅ Thank you for your message! We\'ll get back to you soon.');
      }
      
      setAlertType('success');
      setShowAlert(true);
      setFormData({ name: '', email: '', subject: '', message: '', priority: 'normal' });
      
      // Reload contacts if user is authenticated
      await loadContacts();
      
      setTimeout(() => setShowAlert(false), 5000);
    } catch (error) {
      console.error('Error submitting contact:', error);
      setAlertType('error');
      setAlertMessage('❌ Failed to submit message. Please try again.');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (contact) => {
    setFormData({
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
      priority: contact.priority || 'normal'
    });
    setEditingContact(contact);
    setShowMessages(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setFormData({ name: '', email: '', subject: '', message: '', priority: 'normal' });
    setEditingContact(null);
    setError('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      await contactsAPI.delete(id);
      setAlertType('success');
      setAlertMessage('✅ Message deleted successfully!');
      setShowAlert(true);
      await loadContacts();
      setTimeout(() => setShowAlert(false), 3000);
    } catch (error) {
      console.error('Error deleting contact:', error);
      setAlertType('error');
      setAlertMessage('❌ Failed to delete message.');
      setShowAlert(true);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'pending': { color: '#f59e0b', text: 'Pending' },
      'in-progress': { color: '#3b82f6', text: 'In Progress' },
      'resolved': { color: '#10b981', text: 'Resolved' },
      'closed': { color: '#6b7280', text: 'Closed' }
    };
    return badges[status] || badges['pending'];
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      'low': { color: '#10b981', text: 'Low' },
      'normal': { color: '#3b82f6', text: 'Normal' },
      'high': { color: '#f59e0b', text: 'High' },
      'urgent': { color: '#ef4444', text: 'Urgent' }
    };
    return badges[priority] || badges['normal'];
  };

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email Us',
      details: 'support@tasknest.com',
      description: 'Send us an email anytime',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
    },
    {
      icon: '📞',
      title: 'Call Us',
      details: '+1 (555) 123-4567',
      description: 'Mon-Fri from 9am to 6pm',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    {
      icon: '📍',
      title: 'Visit Us',
      details: '123 Tech Street, Suite 100',
      description: 'San Francisco, CA 94107',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    }
  ];

  const faqs = [
    {
      question: 'How do I reset my password?',
      answer: 'Go to Settings → Account → Change Password. You\'ll receive an email with reset instructions.'
    },
    {
      question: 'Can I use TaskNest with my team?',
      answer: 'Yes! We offer team plans with collaborative features. Contact sales for more information.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use enterprise-grade encryption and follow strict security protocols.'
    }
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

        .contact-wrapper {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
          padding: 2rem 1.5rem;
          padding-bottom: 3rem;
          min-height: auto;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          text-align: center;
          margin-bottom: 3.5rem;
          animation: fadeInDown 0.8s ease;
        }

        .header h1 {
          font-size: 3.5rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1rem;
          text-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
        }

        .header p {
          font-size: 1.3rem;
          color: rgba(255, 255, 255, 0.95);
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          max-width: 700px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .alert-success {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 1.2rem 1.5rem;
          border-radius: 16px;
          margin-bottom: 2rem;
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3);
          animation: fadeInDown 0.5s ease;
          font-weight: 500;
        }

        .alert-error {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          padding: 1.2rem 1.5rem;
          border-radius: 16px;
          margin-bottom: 2rem;
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
          animation: fadeInDown 0.5s ease;
          font-weight: 500;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
          animation: fadeInUp 0.8s ease;
        }

        .card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.25);
        }

        .card h4 {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 2rem;
        }

        .contact-info-item {
          display: flex;
          align-items: start;
          margin-bottom: 2rem;
          padding: 1.2rem;
          border-radius: 16px;
          transition: all 0.3s ease;
        }

        .contact-info-item:hover {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%);
          transform: translateX(5px);
        }

        .contact-icon {
          width: 60px;
          height: 60px;
          min-width: 60px;
          background: var(--icon-gradient);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          margin-right: 1.2rem;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }

        .contact-info-item:hover .contact-icon {
          transform: scale(1.1) rotate(-5deg);
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.2);
        }

        .contact-details h6 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.3rem;
        }

        .contact-details p {
          font-size: 1rem;
          font-weight: 600;
          color: #4b5563;
          margin-bottom: 0.2rem;
        }

        .contact-details small {
          font-size: 0.9rem;
          color: #9ca3af;
        }

        .business-hours {
          margin-top: 2rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          border-radius: 16px;
          border-left: 4px solid #6366f1;
        }

        .business-hours-header {
          display: flex;
          align-items: center;
          margin-bottom: 0.8rem;
        }

        .business-hours-icon {
          font-size: 1.5rem;
          margin-right: 0.8rem;
        }

        .business-hours h6 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .business-hours p {
          font-size: 0.9rem;
          color: #6b7280;
          line-height: 1.8;
          margin: 0;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }

        .form-control {
          width: 100%;
          padding: 0.9rem 1.2rem;
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

        textarea.form-control {
          resize: vertical;
          min-height: 150px;
        }

        .submit-btn {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          padding: 1rem 2.5rem;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(99, 102, 241, 0.4);
        }

        .submit-btn:active {
          transform: translateY(0);
        }

        .faq-section {
          margin-top: 2rem;
        }

        .faq-item {
          padding: 1.5rem;
          border-radius: 16px;
          margin-bottom: 1rem;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(139, 92, 246, 0.03) 100%);
          border-left: 4px solid #6366f1;
          transition: all 0.3s ease;
        }

        .faq-item:hover {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%);
          transform: translateX(5px);
        }

        .faq-item h6 {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.6rem;
        }

        .faq-item p {
          font-size: 0.95rem;
          color: #6b7280;
          line-height: 1.6;
          margin: 0;
        }

        .messages-toggle-btn {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.3);
        }

        .messages-toggle-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 16px;
          text-align: center;
          border: 2px solid #e5e7eb;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          border-color: var(--stat-color);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: var(--stat-color);
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #6b7280;
          font-weight: 500;
        }

        .message-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .message-card {
          background: white;
          padding: 1.5rem;
          border-radius: 16px;
          border: 2px solid #e5e7eb;
          transition: all 0.3s ease;
        }

        .message-card:hover {
          border-color: #6366f1;
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.15);
        }

        .message-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 1rem;
        }

        .message-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .message-meta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .badge {
          padding: 0.3rem 0.8rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          color: white;
        }

        .message-content {
          color: #4b5563;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .message-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-edit, .btn-delete, .btn-cancel {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-edit {
          background: #3b82f6;
          color: white;
        }

        .btn-delete {
          background: #ef4444;
          color: white;
        }

        .btn-cancel {
          background: #6b7280;
          color: white;
        }

        .btn-edit:hover {
          background: #2563eb;
          transform: translateY(-2px);
        }

        .btn-delete:hover {
          background: #dc2626;
          transform: translateY(-2px);
        }

        .btn-cancel:hover {
          background: #4b5563;
          transform: translateY(-2px);
        }

        .editing-banner {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          margin-bottom: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 600;
        }

        @media (max-width: 968px) {
          .grid {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .header h1 {
            font-size: 2.5rem;
          }

          .header p {
            font-size: 1.1rem;
          }

          .card {
            padding: 2rem;
          }
        }

        @media (max-width: 640px) {
          .contact-wrapper {
            padding: 2rem 1rem;
          }

          .header h1 {
            font-size: 2rem;
          }

          .card {
            padding: 1.5rem;
          }

          .contact-icon {
            width: 50px;
            height: 50px;
            min-width: 50px;
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="contact-wrapper">
        <div className="container">
          <div className="header">
            <h1>Get In Touch</h1>
            <p>
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          {showAlert && (
            <div className={alertType === 'success' ? 'alert-success' : 'alert-error'}>
              {alertMessage}
            </div>
          )}

          {/* Toggle button for viewing messages (only for authenticated users) */}
          {localStorage.getItem('token') && (
            <button 
              className="messages-toggle-btn"
              onClick={() => setShowMessages(!showMessages)}
            >
              {showMessages ? '✉️ Send New Message' : '📋 View My Messages'}
            </button>
          )}

          {/* Messages List View */}
          {showMessages && localStorage.getItem('token') && (
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h4>My Contact Messages</h4>
              
              {/* Statistics */}
              <div className="stats-grid">
                <div className="stat-card" style={{ '--stat-color': '#6366f1' }}>
                  <div className="stat-number">{stats.total}</div>
                  <div className="stat-label">Total</div>
                </div>
                <div className="stat-card" style={{ '--stat-color': '#f59e0b' }}>
                  <div className="stat-number">{stats.pending}</div>
                  <div className="stat-label">Pending</div>
                </div>
                <div className="stat-card" style={{ '--stat-color': '#3b82f6' }}>
                  <div className="stat-number">{stats.inProgress}</div>
                  <div className="stat-label">In Progress</div>
                </div>
                <div className="stat-card" style={{ '--stat-color': '#10b981' }}>
                  <div className="stat-number">{stats.resolved}</div>
                  <div className="stat-label">Resolved</div>
                </div>
              </div>

              {/* Messages List */}
              {contacts.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#6b7280', padding: '2rem' }}>
                  No messages yet. Send your first message below!
                </p>
              ) : (
                <div className="message-list">
                  {contacts.map((contact) => (
                    <div key={contact._id} className="message-card">
                      <div className="message-header">
                        <div>
                          <h5 className="message-title">{contact.subject}</h5>
                          <div className="message-meta">
                            <span 
                              className="badge" 
                              style={{ background: getStatusBadge(contact.status).color }}
                            >
                              {getStatusBadge(contact.status).text}
                            </span>
                            <span 
                              className="badge" 
                              style={{ background: getPriorityBadge(contact.priority).color }}
                            >
                              {getPriorityBadge(contact.priority).text}
                            </span>
                            <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                              📅 {new Date(contact.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="message-content">
                        <strong>Message:</strong> {contact.message}
                      </div>
                      {contact.adminNotes && (
                        <div style={{ 
                          background: '#f3f4f6', 
                          padding: '1rem', 
                          borderRadius: '8px',
                          marginBottom: '1rem'
                        }}>
                          <strong style={{ color: '#6366f1' }}>Admin Response:</strong>
                          <p style={{ margin: '0.5rem 0 0', color: '#4b5563' }}>{contact.adminNotes}</p>
                        </div>
                      )}
                      {contact.status === 'pending' && (
                        <div className="message-actions">
                          <button 
                            className="btn-edit"
                            onClick={() => handleEdit(contact)}
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            className="btn-delete"
                            onClick={() => handleDelete(contact._id)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="grid">
            {/* Contact Information */}
            <div>
              <div className="card">
                <h4>Contact Information</h4>
                {contactInfo.map((info, index) => (
                  <div 
                    key={index} 
                    className="contact-info-item"
                    style={{ '--icon-gradient': info.gradient }}
                  >
                    <div className="contact-icon">
                      {info.icon}
                    </div>
                    <div className="contact-details">
                      <h6>{info.title}</h6>
                      <p>{info.details}</p>
                      <small>{info.description}</small>
                    </div>
                  </div>
                ))}

                <div className="business-hours">
                  <div className="business-hours-header">
                    <span className="business-hours-icon">🕐</span>
                    <h6>Business Hours</h6>
                  </div>
                  <p>
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 4:00 PM<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form & FAQ */}
            <div>
              <div className="card">
                <h4>{editingContact ? 'Edit Message' : 'Send us a Message'}</h4>
                
                {editingContact && (
                  <div className="editing-banner">
                    <span>📝 Editing message...</span>
                    <button 
                      className="btn-cancel"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                )}

                {error && (
                  <div className="alert-error" style={{ marginBottom: '1rem' }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Subject *</label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Enter message subject"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Priority</label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="form-control"
                      >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="form-control"
                      placeholder="Tell us about your inquiry..."
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span>⏳</span>
                        {editingContact ? 'Updating...' : 'Sending...'}
                      </>
                    ) : (
                      <>
                        <span>✉️</span>
                        {editingContact ? 'Update Message' : 'Send Message'}
                      </>
                    )}
                  </button>
                </form>
              </div>

              <div className="card faq-section">
                <h4>Frequently Asked Questions</h4>
                {faqs.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <h6>{faq.question}</h6>
                    <p>{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;