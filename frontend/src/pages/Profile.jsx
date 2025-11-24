import React, { useState, useEffect } from 'react';
import { authAPI, tasksAPI } from '../services/api-fetch';
import { autoCapitalize, validateCapitalization, getCapitalizationError } from '../utils/validation';

const Profile = ({ user: currentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    bio: currentUser?.preferences?.bio || '',
    location: currentUser?.preferences?.location || '',
    joinDate: currentUser?.createdAt || new Date().toISOString(),
    avatar: currentUser?.avatar || ''
  });

  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    completionRate: 0,
    currentStreak: 0,
    productivityScore: 0
  });

  const [achievements, setAchievements] = useState([]);

  // Load user statistics and achievements
  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser?.id) {
        try {
          // Load task statistics
          const statsResponse = await tasksAPI.getStats();
          if (statsResponse.data.success && statsResponse.data.data) {
            const overallStats = statsResponse.data.data.overall || {};
            const completionRate = overallStats.total > 0 
              ? Math.round((overallStats.completed / overallStats.total) * 100) 
              : 0;
            
            setStats({
              totalTasks: overallStats.total || 0,
              completedTasks: overallStats.completed || 0,
              completionRate: completionRate,
              currentStreak: 0, // Not provided by backend yet
              productivityScore: completionRate
            });

            // Generate achievements based on real data
            const userAchievements = [];
            const overall = statsResponse.data.data?.overall || {};
            
            if (overall.completed >= 1) {
              userAchievements.push({
                name: 'First Task Completed',
                icon: 'bi-check-circle-fill',
                description: 'Complete your first task',
                color: '#28a745'
              });
            }
            
            if (overall.completed >= 10) {
              userAchievements.push({
                name: 'Task Master',
                icon: 'bi-trophy-fill',
                description: 'Complete 10 tasks',
                color: '#ffc107'
              });
            }
            
            if (overall.completed >= 50) {
              userAchievements.push({
                name: 'Productivity Pro',
                icon: 'bi-stars',
                description: 'Complete 50 tasks',
                color: '#17a2b8'
              });
            }
            
            if (completionRate >= 80) {
              userAchievements.push({
                name: 'Perfectionist',
                icon: 'bi-award-fill',
                description: 'Maintain 80%+ completion rate',
                color: '#6f42c1'
              });
            }
            
            setAchievements(userAchievements);
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      }
    };

    loadUserData();
  }, [currentUser]);

  // Handle profile update
  const handleUpdateProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate name capitalization
    if (!validateCapitalization(profile.name)) {
      setError(getCapitalizationError('Name'));
      setLoading(false);
      return;
    }

    // Validate location capitalization if provided
    if (profile.location && !validateCapitalization(profile.location)) {
      setError(getCapitalizationError('Location'));
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.updateProfile({
        name: profile.name,
        preferences: {
          bio: profile.bio,
          location: profile.location
        }
      });

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Update localStorage with new user data
      const updatedUser = { ...currentUser, ...response.data.data.user };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-capitalize name and location fields
    let processedValue = value;
    if (name === 'name' || name === 'location') {
      processedValue = autoCapitalize(value);
    }
    
    setProfile(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

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

        .profile-page-wrapper {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          min-height: 100%;
          padding: 2rem 1rem;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .header {
          text-align: center;
          color: white;
          margin-bottom: 3rem;
          animation: fadeInDown 0.8s ease;
        }

        .header h1 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .header p {
          font-size: 1.2rem;
          opacity: 0.95;
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

        .profile-grid {
          display: grid;
          grid-template-columns: 350px 1fr;
          gap: 2rem;
        }

        @media (max-width: 992px) {
          .profile-grid {
            grid-template-columns: 1fr;
          }
        }

        .card {
          background: linear-gradient(135deg, #2d3561 0%, #1f2544 100%);
          border-radius: 20px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
          animation: fadeInUp 0.8s ease;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.6);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .profile-card {
          text-align: center;
          padding: 2.5rem;
        }

        .avatar-wrapper {
          position: relative;
          display: inline-block;
          margin-bottom: 1.5rem;
        }

        .avatar {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #ff8c00 0%, #ffd700 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 25px rgba(255, 140, 0, 0.4);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 8px 25px rgba(255, 140, 0, 0.4);
          }
          50% {
            box-shadow: 0 8px 35px rgba(255, 140, 0, 0.6);
          }
        }

        .avatar i {
          font-size: 4rem;
          color: white;
        }

        .edit-avatar-btn {
          position: absolute;
          bottom: 5px;
          right: 5px;
          width: 36px;
          height: 36px;
          background: white;
          border: 3px solid #ff8c00;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .edit-avatar-btn:hover {
          background: #ff8c00;
          transform: scale(1.1);
        }

        .edit-avatar-btn i {
          font-size: 1rem;
          color: #ff8c00;
        }

        .edit-avatar-btn:hover i {
          color: white;
        }

        .profile-name {
          font-size: 1.8rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.5rem;
        }

        .profile-email {
          color: #b8b8d1;
          margin-bottom: 1rem;
        }

        .member-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #ff8c00 0%, #ffd700 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .productivity-section {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 2px solid rgba(255, 255, 255, 0.1);
        }

        .productivity-title {
          color: #b8b8d1;
          font-size: 0.95rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .progress-bar {
          width: 100%;
          height: 12px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 0.75rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff8c00 0%, #ffd700 100%);
          border-radius: 10px;
          transition: width 1s ease;
          position: relative;
          overflow: hidden;
        }

        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          bottom: 0;
          right: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        .progress-text {
          color: #b8b8d1;
          font-size: 0.9rem;
        }

        .achievements-card {
          padding: 2rem;
          margin-top: 1.5rem;
        }

        .achievements-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 1.5rem;
        }

        .achievement-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          margin-bottom: 1rem;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .achievement-item:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(5px);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .achievement-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .achievement-info {
          flex: 1;
        }

        .achievement-name {
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 0.25rem;
        }

        .achievement-desc {
          color: #b8b8d1;
          font-size: 0.85rem;
        }

        .info-card {
          padding: 2.5rem;
          margin-bottom: 2rem;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
        }

        .btn {
          padding: 0.65rem 1.5rem;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        .btn-primary {
          background: linear-gradient(135deg, #ff8c00 0%, #ffd700 100%);
          color: white;
        }

        .btn-outline {
          background: transparent;
          border: 2px solid #ff8c00;
          color: #ff8c00;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 140, 0, 0.4);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          font-weight: 600;
          color: #b8b8d1;
          margin-bottom: 0.5rem;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.05);
          color: #ffffff;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #ff8c00;
          box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.2);
          background: rgba(255, 255, 255, 0.08);
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }

        .info-row {
          display: flex;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .info-label {
          font-weight: 600;
          color: #b8b8d1;
          min-width: 120px;
        }

        .info-value {
          color: #ffffff;
          flex: 1;
        }

        .stats-card {
          padding: 2.5rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }

        .stat-box {
          background: rgba(255, 255, 255, 0.05);
          padding: 2rem;
          border-radius: 15px;
          text-align: center;
          transition: all 0.3s ease;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }

        .stat-box:hover {
          transform: translateY(-5px);
          border-color: var(--stat-color);
          background: rgba(255, 255, 255, 0.1);
        }

        .stat-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          color: var(--stat-color);
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--stat-color);
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: #b8b8d1;
          font-weight: 500;
        }
      `}</style>

      <div className="profile-page-wrapper">
        <div className="container">
        <div className="header">
          <h1>👤 My Profile</h1>
          <p>Manage your personal information and track your progress</p>
        </div>

        <div className="profile-grid">
          {/* Left Column */}
          <div>
            {/* Profile Card */}
            <div className="card profile-card">
              <div className="avatar-wrapper">
                <div className="avatar">
                  <i className="bi bi-person-fill"></i>
                </div>
                <div className="edit-avatar-btn" onClick={() => setIsEditing(!isEditing)}>
                  <i className="bi bi-pencil-fill"></i>
                </div>
              </div>
              
              <h2 className="profile-name">{profile.name}</h2>
              <p className="profile-email">{profile.email}</p>
              
              <div className="member-badge">
                <i className="bi bi-calendar-check"></i>
                <span>Member since {new Date(profile.joinDate).toLocaleDateString()}</span>
              </div>
              
              <div className="productivity-section">
                <h6 className="productivity-title">Productivity Score</h6>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${stats.productivityScore}%` }}
                  ></div>
                </div>
                <p className="progress-text">
                  {stats.productivityScore}% - {stats.productivityScore >= 80 ? 'Excellent! 🎉' : stats.productivityScore >= 50 ? 'Good job! 👍' : 'Keep going! 💪'}
                </p>
              </div>
            </div>

            {/* Achievements Card */}
            <div className="card achievements-card">
              <h3 className="achievements-title">🏆 Your Achievements</h3>
              {achievements.length > 0 ? (
                achievements.map((achievement, index) => (
                  <div key={index} className="achievement-item">
                    <div 
                      className="achievement-icon"
                      style={{ background: `${achievement.color}15`, color: achievement.color }}
                    >
                      <i className={`bi ${achievement.icon}`}></i>
                    </div>
                    <div className="achievement-info">
                      <div className="achievement-name">{achievement.name}</div>
                      <div className="achievement-desc">{achievement.description}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-award text-muted" style={{ fontSize: '3rem' }}></i>
                  <p className="text-muted mt-2">Complete tasks to earn achievements!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Profile Information Card */}
            <div className="card info-card">
              <div className="card-header">
                <h3 className="card-title">Profile Information</h3>
                <button
                  className="btn btn-outline"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <i className="bi bi-pencil"></i>
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {isEditing ? (
                <div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-input"
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-input"
                        name="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-input"
                      name="location"
                      value={profile.location}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bio</label>
                    <textarea
                      className="form-textarea"
                      rows="4"
                      name="bio"
                      value={profile.bio}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button onClick={handleUpdateProfile} className="btn btn-primary" disabled={loading}>
                    <i className="bi bi-check-lg"></i>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="info-row">
                    <div className="info-label">Email:</div>
                    <div className="info-value">{profile.email}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label">Location:</div>
                    <div className="info-value">{profile.location || 'Not specified'}</div>
                  </div>
                  <div className="info-row">
                    <div className="info-label">Bio:</div>
                    <div className="info-value">{profile.bio || 'No bio available'}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Statistics Card */}
            <div className="card stats-card">
              <h3 className="card-title" style={{ marginBottom: '2rem' }}>📊 Your Statistics</h3>
              <div className="stats-grid">
                <div className="stat-box" style={{ '--stat-color': '#ff8c00' }}>
                  <div className="stat-icon">
                    <i className="bi bi-list-check"></i>
                  </div>
                  <div className="stat-value">{stats.totalTasks}</div>
                  <div className="stat-label">Total Tasks</div>
                </div>

                <div className="stat-box" style={{ '--stat-color': '#28a745' }}>
                  <div className="stat-icon">
                    <i className="bi bi-check-circle-fill"></i>
                  </div>
                  <div className="stat-value">{stats.completedTasks}</div>
                  <div className="stat-label">Completed</div>
                </div>

                <div className="stat-box" style={{ '--stat-color': '#ffc107' }}>
                  <div className="stat-icon">
                    <i className="bi bi-star-fill"></i>
                  </div>
                  <div className="stat-value">{stats.completionRate}%</div>
                  <div className="stat-label">Completion Rate</div>
                </div>

                <div className="stat-box" style={{ '--stat-color': '#17a2b8' }}>
                  <div className="stat-icon">
                    <i className="bi bi-calendar-week"></i>
                  </div>
                  <div className="stat-value">{stats.currentStreak}</div>
                  <div className="stat-label">Day Streak</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default Profile;