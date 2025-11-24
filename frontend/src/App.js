import React, { useState, useEffect } from "react";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import NavigationBar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import TaskManager from "./components/TaskManager";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Contact from "./pages/Contact";
import TaskSummary from "./pages/TaskSummary";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    console.log('App mounted - checking auth:', { hasToken: !!token, hasUserData: !!userData });
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('Found existing session:', parsedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        handleLogout();
      }
    }
    
    setLoading(false);
  }, []);

  // Monitor authentication state changes
  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated, user });
  }, [isAuthenticated, user]);

  const handleLogin = (userData, token) => {
    console.log('handleLogin called with:', { userData, token });
    
    // Validate inputs
    if (!userData) {
      console.error('handleLogin: userData is undefined or null');
      return;
    }
    
    if (!token) {
      console.error('handleLogin: token is undefined or null');
      return;
    }
    
    try {
      // Save token
      localStorage.setItem('token', token);
      console.log('Token saved to localStorage');
      
      // Save user data
      const userString = JSON.stringify(userData);
      localStorage.setItem('user', userString);
      console.log('User data saved to localStorage:', userString);
      
      // Update state
      setUser(userData);
      setIsAuthenticated(true);
      console.log('Authentication state updated:', { user: userData, isAuthenticated: true });
    } catch (error) {
      console.error('Error in handleLogin:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3"></div>
          <p>Loading TaskNest...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
        {/* Navbar always visible */}
        <NavigationBar 
          isAuthenticated={isAuthenticated} 
          user={user} 
          onLogout={handleLogout} 
        />

        {/* Main content with padding for fixed navbar */}
        <main className="flex-grow-1" style={{ paddingTop: '76px' }}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                <Navigate to="/tasks" replace /> : 
                <Login onLogin={handleLogin} />
              } 
            />
            <Route 
              path="/register" 
              element={
                isAuthenticated ? 
                <Navigate to="/tasks" replace /> : 
                <Register onLogin={handleLogin} />
              } 
            />
            
            {/* Protected routes */}
            <Route 
              path="/tasks" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <TaskManager user={user} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Profile user={user} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Settings user={user} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/summary" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <TaskSummary user={user} />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer always visible */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;