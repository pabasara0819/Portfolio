// components/FooterInput.jsx (Admin Panel for Editing Footer)
import React, { useState, useEffect } from 'react';
// import { db } from '../../firebase/config';
// import { doc, setDoc, getDoc } from 'firebase/firestore';

const FooterInput = () => {
  // State for footer content
  const [footerContent, setFooterContent] = useState({
    brandName: "Jenny",
    brandDescription: "Creating beautiful and functional digital experiences that make a difference. Let's bring your ideas to life.",
    copyrightText: "Jenny Portfolio. All rights reserved.",
    quickLinks: [
      { name: 'Home', href: '#' },
      { name: 'Skill', href: '#' },
      { name: 'Services', href: '#' },
      { name: 'Portfolio', href: '#' },
      { name: 'Testimonials', href: '#' },
      { name: 'Contact', href: '#' }
    ],
    services: [
      { name: 'UI/UX Design', href: '#' },
      { name: 'Web Development', href: '#' },
      { name: 'App Design', href: '#' },
      { name: 'Graphic Design', href: '#' },
      { name: 'Branding', href: '#' }
    ],
    socialLinks: [
      { name: 'Facebook', url: '#', color: 'hover:bg-blue-600', iconType: 'facebook' },
      { name: 'Twitter', url: '#', color: 'hover:bg-blue-400', iconType: 'twitter' },
      { name: 'LinkedIn', url: '#', color: 'hover:bg-blue-700', iconType: 'linkedin' },
      { name: 'GitHub', url: '#', color: 'hover:bg-gray-700', iconType: 'github' }
    ],
    newsletter: {
      title: "Newsletter",
      description: "Subscribe to get updates on latest projects and offers.",
      placeholder: "Your email address",
      buttonText: "Subscribe",
      successMessage: "Subscribed successfully! 🎉",
      errorMessage: "Please enter a valid email address."
    },
    footerLinks: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookies Policy', href: '#' }
    ],
    showBackToTop: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Icon options
  const iconOptions = [
    { 
      value: 'facebook', 
      label: 'Facebook',
      svg: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
        </svg>
      )
    },
    { 
      value: 'twitter', 
      label: 'Twitter',
      svg: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
        </svg>
      )
    },
    { 
      value: 'linkedin', 
      label: 'LinkedIn',
      svg: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      )
    },
    { 
      value: 'github', 
      label: 'GitHub',
      svg: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
        </svg>
      )
    }
  ];

  // Color options for social links
  const colorOptions = [
    { value: 'hover:bg-blue-600', label: 'Blue' },
    { value: 'hover:bg-blue-400', label: 'Light Blue' },
    { value: 'hover:bg-blue-700', label: 'Dark Blue' },
    { value: 'hover:bg-gray-700', label: 'Gray' },
    { value: 'hover:bg-purple-600', label: 'Purple' },
    { value: 'hover:bg-pink-600', label: 'Pink' }
  ];

  // Load data from Firebase on component mount
  useEffect(() => {
    loadFooterData();
  }, []);

  // Load footer data from Firebase
  const loadFooterData = async () => {
    try {
      setLoading(true);
      const footerRef = doc(db, 'Resume', 'Footer');
      const footerSnap = await getDoc(footerRef);
      
      if (footerSnap.exists()) {
        const data = footerSnap.data();
        setFooterContent(prev => ({
          ...prev,
          ...data,
          quickLinks: data.quickLinks || prev.quickLinks,
          services: data.services || prev.services,
          socialLinks: data.socialLinks || prev.socialLinks,
          footerLinks: data.footerLinks || prev.footerLinks,
          newsletter: { ...prev.newsletter, ...data.newsletter }
        }));
        console.log('Footer data loaded from Firebase');
      } else {
        console.log('No footer data found, using defaults');
      }
    } catch (error) {
      console.error('Error loading footer data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save footer data to Firebase
  const saveFooterData = async () => {
    try {
      setSaving(true);
      
      // Prepare data for Firebase
      const dataToSave = {
        ...footerContent,
        updatedAt: new Date().toISOString()
      };

      // Save to Firestore
      const footerRef = doc(db, 'Resume', 'Footer');
      await setDoc(footerRef, dataToSave, { merge: true });
      
      console.log('Footer data saved to Firebase');
      alert('Footer section saved successfully!');
      
    } catch (error) {
      console.error('Error saving footer data:', error);
      alert('Error saving footer section: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Handler for input changes
  const handleInputChange = (field, value) => {
    setFooterContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler for newsletter changes
  const handleNewsletterChange = (field, value) => {
    setFooterContent(prev => ({
      ...prev,
      newsletter: {
        ...prev.newsletter,
        [field]: value
      }
    }));
  };

  // Quick Links Management
  const addQuickLink = () => {
    setFooterContent(prev => ({
      ...prev,
      quickLinks: [...prev.quickLinks, { name: 'New Link', href: '#' }]
    }));
  };

  const updateQuickLink = (index, field, value) => {
    const updatedLinks = [...footerContent.quickLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setFooterContent(prev => ({ ...prev, quickLinks: updatedLinks }));
  };

  const removeQuickLink = (index) => {
    if (footerContent.quickLinks.length > 1) {
      const updatedLinks = footerContent.quickLinks.filter((_, i) => i !== index);
      setFooterContent(prev => ({ ...prev, quickLinks: updatedLinks }));
    }
  };

  // Services Management
  const addService = () => {
    setFooterContent(prev => ({
      ...prev,
      services: [...prev.services, { name: 'New Service', href: '#' }]
    }));
  };

  const updateService = (index, field, value) => {
    const updatedServices = [...footerContent.services];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setFooterContent(prev => ({ ...prev, services: updatedServices }));
  };

  const removeService = (index) => {
    if (footerContent.services.length > 1) {
      const updatedServices = footerContent.services.filter((_, i) => i !== index);
      setFooterContent(prev => ({ ...prev, services: updatedServices }));
    }
  };

  // Social Links Management
  const addSocialLink = () => {
    setFooterContent(prev => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { name: 'New Social', url: '#', color: 'hover:bg-blue-600', iconType: 'facebook' }]
    }));
  };

  const updateSocialLink = (index, field, value) => {
    const updatedLinks = [...footerContent.socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setFooterContent(prev => ({ ...prev, socialLinks: updatedLinks }));
  };

  const removeSocialLink = (index) => {
    if (footerContent.socialLinks.length > 1) {
      const updatedLinks = footerContent.socialLinks.filter((_, i) => i !== index);
      setFooterContent(prev => ({ ...prev, socialLinks: updatedLinks }));
    }
  };

  // Footer Links Management
  const addFooterLink = () => {
    setFooterContent(prev => ({
      ...prev,
      footerLinks: [...prev.footerLinks, { name: 'New Link', href: '#' }]
    }));
  };

  const updateFooterLink = (index, field, value) => {
    const updatedLinks = [...footerContent.footerLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setFooterContent(prev => ({ ...prev, footerLinks: updatedLinks }));
  };

  const removeFooterLink = (index) => {
    if (footerContent.footerLinks.length > 1) {
      const updatedLinks = footerContent.footerLinks.filter((_, i) => i !== index);
      setFooterContent(prev => ({ ...prev, footerLinks: updatedLinks }));
    }
  };

  // Reset form
  const resetForm = () => {
    setFooterContent({
      brandName: "Jenny",
      brandDescription: "Creating beautiful and functional digital experiences that make a difference. Let's bring your ideas to life.",
      copyrightText: "Jenny Portfolio. All rights reserved.",
      quickLinks: [
        { name: 'Home', href: '#' },
        { name: 'Skill', href: '#' },
        { name: 'Services', href: '#' },
        { name: 'Portfolio', href: '#' },
        { name: 'Testimonials', href: '#' },
        { name: 'Contact', href: '#' }
      ],
      services: [
        { name: 'UI/UX Design', href: '#' },
        { name: 'Web Development', href: '#' },
        { name: 'App Design', href: '#' },
        { name: 'Graphic Design', href: '#' },
        { name: 'Branding', href: '#' }
      ],
      socialLinks: [
        { name: 'Facebook', url: '#', color: 'hover:bg-blue-600', iconType: 'facebook' },
        { name: 'Twitter', url: '#', color: 'hover:bg-blue-400', iconType: 'twitter' },
        { name: 'LinkedIn', url: '#', color: 'hover:bg-blue-700', iconType: 'linkedin' },
        { name: 'GitHub', url: '#', color: 'hover:bg-gray-700', iconType: 'github' }
      ],
      newsletter: {
        title: "Newsletter",
        description: "Subscribe to get updates on latest projects and offers.",
        placeholder: "Your email address",
        buttonText: "Subscribe",
        successMessage: "Subscribed successfully! 🎉",
        errorMessage: "Please enter a valid email address."
      },
      footerLinks: [
        { name: 'Privacy Policy', href: '#' },
        { name: 'Terms of Service', href: '#' },
        { name: 'Cookies Policy', href: '#' }
      ],
      showBackToTop: true
    });
    alert('Form reset to defaults!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-600">Loading footer data from Firebase...</p>
        </div>
      </div>
    );
  }

  return (
   
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDE - Admin Inputs */}
          <div className="lg:w-2/5 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Edit Footer Content</h2>
            
            {/* Brand Section */}
            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800">Brand Section</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={footerContent.brandName}
                  onChange={(e) => handleInputChange('brandName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand Description
                </label>
                <textarea
                  value={footerContent.brandDescription}
                  onChange={(e) => handleInputChange('brandDescription', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Copyright Text
                </label>
                <input
                  type="text"
                  value={footerContent.copyrightText}
                  onChange={(e) => handleInputChange('copyrightText', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>

            {/* Quick Links Management */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-800">Quick Links</h3>
                <button
                  onClick={addQuickLink}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  + Add Link
                </button>
              </div>
              <div className="space-y-2">
                {footerContent.quickLinks.map((link, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={link.name}
                      onChange={(e) => updateQuickLink(index, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                      placeholder="Link Name"
                    />
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) => updateQuickLink(index, 'href', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                      placeholder="URL"
                    />
                    <button
                      onClick={() => removeQuickLink(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Services Management */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-800">Services</h3>
                <button
                  onClick={addService}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  + Add Service
                </button>
              </div>
              <div className="space-y-2">
                {footerContent.services.map((service, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={service.name}
                      onChange={(e) => updateService(index, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                      placeholder="Service Name"
                    />
                    <input
                      type="text"
                      value={service.href}
                      onChange={(e) => updateService(index, 'href', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                      placeholder="URL"
                    />
                    <button
                      onClick={() => removeService(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links Management */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-800">Social Links</h3>
                <button
                  onClick={addSocialLink}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  + Add Social Link
                </button>
              </div>
              <div className="space-y-3">
                {footerContent.socialLinks.map((link, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={link.name}
                        onChange={(e) => updateSocialLink(index, 'name', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded"
                        placeholder="Platform Name"
                      />
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded"
                        placeholder="URL"
                      />
                      <button
                        onClick={() => removeSocialLink(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={link.iconType}
                        onChange={(e) => updateSocialLink(index, 'iconType', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded"
                      >
                        {iconOptions.map(icon => (
                          <option key={icon.value} value={icon.value}>{icon.label}</option>
                        ))}
                      </select>
                      <select
                        value={link.color}
                        onChange={(e) => updateSocialLink(index, 'color', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded"
                      >
                        {colorOptions.map(color => (
                          <option key={color.value} value={color.value}>{color.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Newsletter Section</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Newsletter Title
                  </label>
                  <input
                    type="text"
                    value={footerContent.newsletter.title}
                    onChange={(e) => handleNewsletterChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={footerContent.newsletter.description}
                    onChange={(e) => handleNewsletterChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Placeholder Text
                  </label>
                  <input
                    type="text"
                    value={footerContent.newsletter.placeholder}
                    onChange={(e) => handleNewsletterChange('placeholder', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={footerContent.newsletter.buttonText}
                    onChange={(e) => handleNewsletterChange('buttonText', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Success Message
                  </label>
                  <input
                    type="text"
                    value={footerContent.newsletter.successMessage}
                    onChange={(e) => handleNewsletterChange('successMessage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Error Message
                  </label>
                  <input
                    type="text"
                    value={footerContent.newsletter.errorMessage}
                    onChange={(e) => handleNewsletterChange('errorMessage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>

            {/* Footer Bottom Links */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-800">Footer Bottom Links</h3>
                <button
                  onClick={addFooterLink}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  + Add Link
                </button>
              </div>
              <div className="space-y-2">
                {footerContent.footerLinks.map((link, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={link.name}
                      onChange={(e) => updateFooterLink(index, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded"
                      placeholder="Link Name"
                    />
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) => updateFooterLink(index, 'href', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded"
                      placeholder="URL"
                    />
                    <button
                      onClick={() => removeFooterLink(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Settings */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Settings</h3>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={footerContent.showBackToTop}
                  onChange={(e) => handleInputChange('showBackToTop', e.target.checked)}
                  className="w-4 h-4 text-purple-600"
                />
                <span className="text-sm text-gray-700">Show "Back to Top" Button</span>
              </label>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={resetForm}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
              >
                Reset to Defaults
              </button>
              <button
                onClick={saveFooterData}
                disabled={saving}
                className="flex-1 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-t-2 border-white rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  'Save to Firebase'
                )}
              </button>
            </div>
          </div>
          
          {/* RIGHT SIDE - Live Preview */}
          <div className="lg:w-3/5">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-4">
              <div className="p-4 bg-gray-100 border-b">
                <h3 className="font-semibold text-gray-700">Live Preview</h3>
                <p className="text-sm text-gray-500">Your footer will look like this</p>
              </div>
              <div className="p-6">
                {/* EXACT preview of your Footer.jsx component */}
                <footer className="bg-gray-900 text-gray-300 rounded-lg">
                  <div className="px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                      
                      {/* Brand Section */}
                      <div>
                        <h2 className="text-2xl font-bold text-white mb-4">
                          {footerContent.brandName}<span className="text-purple-500">.</span>
                        </h2>
                        <p className="text-gray-400 mb-4 leading-relaxed text-sm">
                          {footerContent.brandDescription}
                        </p>
                        <div className="flex space-x-3">
                          {footerContent.socialLinks.map((social, idx) => {
                            const icon = iconOptions.find(i => i.value === social.iconType);
                            return (
                              <a
                                key={idx}
                                href={social.url}
                                className={`w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:text-white hover:scale-110`}
                              >
                                {icon && React.cloneElement(icon.svg, { className: "w-5 h-5" })}
                              </a>
                            );
                          })}
                        </div>
                      </div>

                      {/* Quick Links */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                          {footerContent.quickLinks.map((link, idx) => (
                            <li key={idx}>
                              <a href={link.href} className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center group text-sm">
                                <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                {link.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Services */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
                        <ul className="space-y-2">
                          {footerContent.services.map((service, idx) => (
                            <li key={idx}>
                              <a href={service.href} className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center group text-sm">
                                <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">•</span>
                                {service.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Newsletter */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-4">{footerContent.newsletter.title}</h3>
                        <p className="text-gray-400 mb-3 text-sm">
                          {footerContent.newsletter.description}
                        </p>
                        <div className="mb-4">
                          <div className="flex flex-col space-y-2">
                            <input
                              type="email"
                              placeholder={footerContent.newsletter.placeholder}
                              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                            />
                            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all duration-300 text-sm">
                              {footerContent.newsletter.buttonText}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Bar */}
                  <div className="border-t border-gray-800">
                    <div className="px-6 py-4">
                      <div className="flex flex-col md:flex-row justify-between items-center text-sm">
                        <p className="text-gray-400">
                          © {new Date().getFullYear()} {footerContent.copyrightText}
                        </p>
                        <div className="flex space-x-6 mt-2 md:mt-0">
                          {footerContent.footerLinks.map((link, idx) => (
                            <a key={idx} href={link.href} className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                              {link.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </footer>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default FooterInput;