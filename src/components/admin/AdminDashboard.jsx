import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Overview from '../Dashboard/overview';
import HomeInput from '../Dashboard/HeroInput';
import SkillInput from '../Dashboard/SkillsInput';
import ServicesInput from '../Dashboard/ServicesInput';
import CounterInput from '../Dashboard/StatsCounterInput';
import Portfolio from '../Dashboard/portfolioinput';
import Testimonials from '../Dashboard/testimonialsinput';
import ContactInput from '../Dashboard/ContactInput';
import FooterInput from '../Dashboard/FooterInput';


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const adminEmail = localStorage.getItem('adminEmail');

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    localStorage.removeItem('adminEmail');
    navigate('/admin/login');
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const stats = [
    { title: 'Total Visitors', value: '12,345', change: '+15%', icon: '👥' },
    { title: 'Projects', value: '24', change: '+3', icon: '📁' },
    { title: 'Testimonials', value: '18', change: '+2', icon: '💬' },
    { title: 'Contact Messages', value: '156', change: '+12', icon: '✉️' },
  ];

  const recentMessages = [
    { id: 1, name: 'John Doe', email: 'john@example.com', message: 'Interested in your services...', date: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', message: 'Great portfolio! Would love to work...', date: '2024-01-14' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', message: 'Looking for a web developer...', date: '2024-01-13' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header Bar */}
      <header className={`bg-white shadow-md fixed top-0 right-0 z-30 transition-all duration-300 ${
        isSidebarCollapsed ? 'left-16' : 'left-64'
      }`}>
        <div className="flex items-center justify-between px-4 py-3">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Page Title */}
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-gray-800 capitalize">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'home' && 'Home Management'}
              {activeTab === 'skill' && 'Skills Management'}
              {activeTab === 'services' && 'Services Management'}
              {activeTab === 'counter' && 'Counter Management'}
              {activeTab === 'portfolio' && 'Portfolio Management'}
              {activeTab === 'testimonials' && 'Testimonials Management'}
              {activeTab === 'contact' && 'Contact Management'}
              {activeTab === 'footer' && 'Footer Management'}
            </h1>
          </div>

          {/* Header Right Section */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 focus:outline-none">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {adminEmail?.charAt(0).toUpperCase() || 'A'}
                </div>
                <span className="hidden md:block text-gray-700">{adminEmail}</span>
                <svg className="hidden md:block w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  👤 Profile
                </button>
                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  ⚙️ Account Settings
                </button>
                <hr className="my-1" />
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar - Desktop with Collapse Toggle */}
      <div className={`fixed inset-y-0 left-0 text-gray-900 bg-white transform transition-all duration-300 ease-in-out z-20 ${
        isSidebarCollapsed ? 'w-16' : 'w-64'
      } ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        
       {/* Logo and Toggle Button Section */}
<div className={`p-4 flex items-center justify-between ${isSidebarCollapsed ? 'flex-col' : ''}`}>
  {!isSidebarCollapsed && (
    <div className="flex-1 flex items-center gap-3">
      {/* Rounded background with gradient */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-full p-2 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
        {/* Icon inside rounded bg */}
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </div>
      <h2 className="text-2xl font-bold">Jenny</h2>
    </div>
  )}
  
  {isSidebarCollapsed && (
    <div className="w-full flex justify-center mb-4">
      {/* Rounded background with gradient - collapsed view */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-full p-2 shadow-md">
        {/* Icon inside rounded bg */}
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        </svg>
      </div>
    </div>
  )}
  
  {/* Toggle Button */}
  <button
    onClick={toggleSidebar}
    className={`p-2 rounded-lg transition-all duration-200 ${
      isSidebarCollapsed ? 'mt-4' : ''
    }`}
    title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
  >
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      {isSidebarCollapsed ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
      )}
    </svg>
  </button>
</div>
        
        {/* Navigation */}
        <nav className="mt-2 space-y-3">
          <button
            onClick={() => {
              setActiveTab('overview');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left transition duration-200 ${
              activeTab === 'overview' ? 'bg-purple-100 text-purple-800 border-l-4 border-purple-600' : 'hover:bg-purple-100 hover:text-purple-800'
            } ${isSidebarCollapsed ? 'px-2 py-2 flex justify-center' : 'px-6 py-2'}`}
            title={isSidebarCollapsed ? 'Overview' : ''}
          >
            <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.25 2.25 0 0 0 .091-.086L12 5.432Z" />
              </svg>
              {!isSidebarCollapsed && <span className="ml-3">Overview</span>}
            </div>
          </button>
          
          <button
            onClick={() => {
              setActiveTab('home');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left transition duration-200 ${
              activeTab === 'home' ? 'bg-purple-100 text-purple-800 border-l-4 border-purple-600' : 'hover:bg-purple-100 hover:text-purple-800'
            } ${isSidebarCollapsed ? 'px-2 py-2 flex justify-center' : 'px-6 py-2'}`}
            title={isSidebarCollapsed ? 'Home' : ''}
          >
            <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path d="M19.006 3.705a.75.75 0 1 0-.512-1.41L6 6.838V3.75a.75.75 0 0 0-.75-.75h-1.5A.75.75 0 0 0 3 3.75v4.586l-2.244.703a.75.75 0 1 0 .512 1.41l1.732-.543L3 21.75h18l.744-12.604 1.732.543a.75.75 0 1 0 .512-1.41l-2.982-.934Z" />
                <path d="M8.25 9.75v6.75h7.5V9.75h-7.5Z" />
              </svg>
              {!isSidebarCollapsed && <span className="ml-3">Home</span>}
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('skill');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left transition duration-200 ${
              activeTab === 'skill' ? 'bg-purple-100 text-purple-800 border-l-4 border-purple-600' : 'hover:bg-purple-100 hover:text-purple-800'
            } ${isSidebarCollapsed ? 'px-2 py-2 flex justify-center' : 'px-6 py-2'}`}
            title={isSidebarCollapsed ? 'Skill' : ''}
          >
            <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path d="M11.7 2.805a.75.75 0 0 1 .6 0A60.65 60.65 0 0 1 22.83 8.72a.75.75 0 0 1-.231 1.337 49.948 49.948 0 0 0-9.902 3.912l-.003.002c-.114.06-.227.119-.34.18a.75.75 0 0 1-.707 0A50.88 50.88 0 0 0 7.5 12.173v-.224c0-.131.067-.248.172-.311a54.615 54.615 0 0 1 4.653-2.52.75.75 0 0 0-.65-1.352 56.123 56.123 0 0 0-4.78 2.589 1.858 1.858 0 0 0-.859 1.228 49.803 49.803 0 0 0-4.634-1.527.75.75 0 0 1-.231-1.337A60.653 60.653 0 0 1 11.7 2.805Z" />
                <path d="M13.06 15.473a48.45 48.45 0 0 1 7.666-3.282c.134 1.414.22 2.843.255 4.284a.75.75 0 0 1-.46.711 47.87 47.87 0 0 0-8.105 4.342.75.75 0 0 1-.832 0 47.87 47.87 0 0 0-8.104-4.342.75.75 0 0 1-.461-.71c.035-1.442.121-2.87.255-4.286.921.304 1.83.634 2.726.99l1.92.763a.75.75 0 0 0 .528 0l2.653-1.055Z" />
              </svg>
              {!isSidebarCollapsed && <span className="ml-3">Skill</span>}
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('services');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left transition duration-200 ${
              activeTab === 'services' ? 'bg-purple-100 text-purple-800 border-l-4 border-purple-600' : 'hover:bg-purple-100 hover:text-purple-800'
            } ${isSidebarCollapsed ? 'px-2 py-2 flex justify-center' : 'px-6 py-2'}`}
            title={isSidebarCollapsed ? 'Services' : ''}
          >
            <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path d="M5.625 3.75a2.625 2.625 0 1 0 0 5.25h12.75a2.625 2.625 0 0 0 0-5.25H5.625ZM3.75 11.25a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75ZM3 15.75a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75ZM3.75 18.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5H3.75Z" />
              </svg>
              {!isSidebarCollapsed && <span className="ml-3">Services</span>}
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('counter');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left transition duration-200 ${
              activeTab === 'counter' ? 'bg-purple-100 text-purple-800 border-l-4 border-purple-600' : 'hover:bg-purple-100 hover:text-purple-800'
            } ${isSidebarCollapsed ? 'px-2 py-2 flex justify-center' : 'px-6 py-2'}`}
            title={isSidebarCollapsed ? 'Counter' : ''}
          >
            <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.035-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 15c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v4.875c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875V15Z" />
              </svg>
              {!isSidebarCollapsed && <span className="ml-3">Counter</span>}
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('portfolio');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left transition duration-200 ${
              activeTab === 'portfolio' ? 'bg-purple-100 text-purple-800 border-l-4 border-purple-600' : 'hover:bg-purple-100 hover:text-purple-800'
            } ${isSidebarCollapsed ? 'px-2 py-2 flex justify-center' : 'px-6 py-2'}`}
            title={isSidebarCollapsed ? 'Portfolio' : ''}
          >
            <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.75c0-2.25-1.5-4.5-4.5-4.5h-9c-2.25 0-4.5 1.5-4.5 4.5h.002a3 3 0 0 1 3 3v9.375A3.375 3.375 0 0 1 7.502 6Z" clipRule="evenodd" />
                <path d="M12 22.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM10.5 16a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1-.75-.75v-1.5Z" />
                <path d="M4.5 9.75h15a.75.75 0 0 0 0-1.5h-15a.75.75 0 0 0 0 1.5Z" />
              </svg>
              {!isSidebarCollapsed && <span className="ml-3">Portfolio</span>}
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('testimonials');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left transition duration-200 ${
              activeTab === 'testimonials' ? 'bg-purple-100 text-purple-800 border-l-4 border-purple-600' : 'hover:bg-purple-100 hover:text-purple-800'
            } ${isSidebarCollapsed ? 'px-2 py-2 flex justify-center' : 'px-6 py-2'}`}
            title={isSidebarCollapsed ? 'Testimonials' : ''}
          >
            <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
              </svg>
              {!isSidebarCollapsed && <span className="ml-3">Testimonials</span>}
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('contact');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left transition duration-200 ${
              activeTab === 'contact' ? 'bg-purple-100 text-purple-800 border-l-4 border-purple-600' : 'hover:bg-purple-100 hover:text-purple-800'
            } ${isSidebarCollapsed ? 'px-2 py-2 flex justify-center' : 'px-6 py-2'}`}
            title={isSidebarCollapsed ? 'Contact' : ''}
          >
            <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
              </svg>
              {!isSidebarCollapsed && <span className="ml-3">Contact</span>}
            </div>
          </button>

          <button
            onClick={() => {
              setActiveTab('footer');
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left transition duration-200 ${
              activeTab === 'footer' ? 'bg-purple-100 text-purple-800 border-l-4 border-purple-600' : 'hover:bg-purple-100 hover:text-purple-800'
            } ${isSidebarCollapsed ? 'px-2 py-2 flex justify-center' : 'px-6 py-2'}`}
            title={isSidebarCollapsed ? 'Footer' : ''}
          >
            <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path fillRule="evenodd" d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm4.5 7.5a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-1.5 0v-.5a.75.75 0 0 1 .75-.75Zm4.5 1.25a.75.75 0 0 0-1.5 0v.5a.75.75 0 0 0 1.5 0v-.5Zm3.75-.75a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-1.5 0v-.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
              </svg>
              {!isSidebarCollapsed && <span className="ml-3">Footer</span>}
            </div>
          </button>
        </nav>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        isSidebarCollapsed ? 'md:ml-16' : 'md:ml-64'
      } pt-16`}>
        <div className="p-8">
          {activeTab === 'overview' && (
            <Overview stats={stats} recentMessages={recentMessages} setActiveTab={setActiveTab} />
          )}
          {activeTab === 'home' && (
            <HomeInput />
          )}
          {activeTab === 'skill' && (
            <SkillInput />
          )}
          {activeTab === 'services' && (
            <ServicesInput />
          )}
          {activeTab === 'counter' && (
            <CounterInput />
          )}
          {activeTab === 'portfolio' && (
            <Portfolio />
          )}
          {activeTab === 'testimonials' && (
            <Testimonials />
          )}
          {activeTab === 'contact' && (
            <ContactInput />
          )}
          {activeTab === 'footer' && (
            <FooterInput adminEmail={adminEmail} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;