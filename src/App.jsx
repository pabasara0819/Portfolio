// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import HorizontalDivider from './components/HorizontalDivider';
import Skills from './components/Skills';
import Services from './components/Services';
import Counter from './components/Counter';
import Portfolio from './components/Portfolio';
import Testimonial from './components/Testimonial';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Admin imports
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  
  return children;
};

// Public Route Component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';
  
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return children;
};

// Main Portfolio Website Component
const PortfolioWebsite = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div id="home">
        <Hero />
      </div>
      
      <HorizontalDivider />
      
      <div id="skills">
        <Skills />
      </div>
      
      <div id="services">
        <Services />
      </div>
      
      <Counter />
      
      <div id="portfolio">
        <Portfolio />
      </div>
      
      <div id="testimonials">
        <Testimonial />
      </div>
      
      <div id="contact">
        <Contact />
      </div>
      
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Main portfolio website at root URL */}
          <Route path="/" element={<PortfolioWebsite />} />
          
          {/* Admin Login Page */}
          <Route 
            path="/admin/login" 
            element={
              <PublicRoute>
                <AdminLogin />
              </PublicRoute>
            } 
          />
          
          {/* Admin Dashboard - Protected */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirect /admin to login */}
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
