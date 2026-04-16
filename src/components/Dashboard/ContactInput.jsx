// components/ContactInput.jsx (Admin Panel for Editing Contact Section)
import React, { useState, useEffect } from 'react';
// import { db } from '../../firebase/config';
// import { doc, setDoc, getDoc } from 'firebase/firestore';

const ContactInput = () => {
  // State for contact content
  const [contactContent, setContactContent] = useState({
    title: "Get In Touch",
    backgroundText: "Contact",
    mainTitle: "Let's Work Together",
    subtitle: "Have a project in mind? I'd love to hear about it. Let's create something amazing together.",
    contactInfo: [
      {
        id: 1,
        title: 'Email Us',
        details: 'hello@jennyportfolio.com',
        sub: 'support@jennyportfolio.com',
        action: 'mailto:hello@jennyportfolio.com',
        iconType: 'email'
      },
      {
        id: 2,
        title: 'Call Us',
        details: '+1 (555) 123-4567',
        sub: 'Mon-Fri, 9am-6pm',
        action: 'tel:+15551234567',
        iconType: 'phone'
      },
      {
        id: 3,
        title: 'Visit Us',
        details: '123 Design Street',
        sub: 'Creative District, NY 10001',
        action: 'https://maps.google.com',
        iconType: 'location'
      }
    ],
    services: [
      'UI/UX Design',
      'Web Development',
      'App Design',
      'Graphic Design',
      'Consultation',
      'Other'
    ],
    formValidation: {
      nameMinLength: 2,
      messageMinLength: 10,
      messageMaxLength: 500,
      requirePhone: false
    },
    submitButtonText: "Send Message",
    submittingText: "Sending...",
    successMessage: "Message sent successfully! I'll get back to you soon.",
    emailRecipient: "hello@jennyportfolio.com"
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Icon options for contact info
  const iconOptions = [
    { 
      value: 'email', 
      label: 'Email Icon',
      svg: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      value: 'phone', 
      label: 'Phone Icon',
      svg: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      )
    },
    { 
      value: 'location', 
      label: 'Location Icon',
      svg: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  // Load data from Firebase on component mount
  useEffect(() => {
    loadContactData();
  }, []);

  // Load contact data from Firebase
  const loadContactData = async () => {
    try {
      setLoading(true);
      const contactRef = doc(db, 'Resume', 'Contact');
      const contactSnap = await getDoc(contactRef);
      
      if (contactSnap.exists()) {
        const data = contactSnap.data();
        setContactContent(prev => ({
          ...prev,
          ...data,
          contactInfo: data.contactInfo || prev.contactInfo,
          services: data.services || prev.services,
          formValidation: { ...prev.formValidation, ...data.formValidation }
        }));
        console.log('Contact data loaded from Firebase');
      } else {
        console.log('No contact data found, using defaults');
      }
    } catch (error) {
      console.error('Error loading contact data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save contact data to Firebase
  const saveContactData = async () => {
    try {
      setSaving(true);
      
      // Prepare data for Firebase
      const dataToSave = {
        ...contactContent,
        updatedAt: new Date().toISOString()
      };

      // Save to Firestore
      const contactRef = doc(db, 'Resume', 'Contact');
      await setDoc(contactRef, dataToSave, { merge: true });
      
      console.log('Contact data saved to Firebase');
      alert('Contact section saved successfully!');
      
    } catch (error) {
      console.error('Error saving contact data:', error);
      alert('Error saving contact section: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Handler for input changes
  const handleInputChange = (field, value) => {
    setContactContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler for form validation changes
  const handleValidationChange = (field, value) => {
    setContactContent(prev => ({
      ...prev,
      formValidation: {
        ...prev.formValidation,
        [field]: value
      }
    }));
  };

  // Handler for contact info changes
  const handleContactInfoChange = (infoId, field, value) => {
    const updatedInfo = contactContent.contactInfo.map(info =>
      info.id === infoId
        ? { ...info, [field]: value }
        : info
    );
    setContactContent(prev => ({
      ...prev,
      contactInfo: updatedInfo
    }));
  };

  // Add new contact info
  const addContactInfo = () => {
    if (contactContent.contactInfo.length < 6) {
      const newId = Math.max(...contactContent.contactInfo.map(c => c.id), 0) + 1;
      setContactContent(prev => ({
        ...prev,
        contactInfo: [...prev.contactInfo, { 
          id: newId,
          title: "New Contact",
          details: "Contact details",
          sub: "Additional info",
          action: "#",
          iconType: "email"
        }]
      }));
    } else {
      alert('Maximum 6 contact items allowed');
    }
  };

  // Remove contact info
  const removeContactInfo = (infoId) => {
    if (contactContent.contactInfo.length > 1) {
      const updatedInfo = contactContent.contactInfo.filter(info => info.id !== infoId);
      setContactContent(prev => ({
        ...prev,
        contactInfo: updatedInfo
      }));
    } else {
      alert('At least one contact item is required');
    }
  };

  // Move contact info up
  const moveContactInfoUp = (index) => {
    if (index > 0) {
      const updatedInfo = [...contactContent.contactInfo];
      [updatedInfo[index], updatedInfo[index - 1]] = [updatedInfo[index - 1], updatedInfo[index]];
      setContactContent(prev => ({
        ...prev,
        contactInfo: updatedInfo
      }));
    }
  };

  // Move contact info down
  const moveContactInfoDown = (index) => {
    if (index < contactContent.contactInfo.length - 1) {
      const updatedInfo = [...contactContent.contactInfo];
      [updatedInfo[index], updatedInfo[index + 1]] = [updatedInfo[index + 1], updatedInfo[index]];
      setContactContent(prev => ({
        ...prev,
        contactInfo: updatedInfo
      }));
    }
  };

  // Services Management
  const addService = () => {
    setContactContent(prev => ({
      ...prev,
      services: [...prev.services, "New Service"]
    }));
  };

  const updateService = (index, value) => {
    const updatedServices = [...contactContent.services];
    updatedServices[index] = value;
    setContactContent(prev => ({
      ...prev,
      services: updatedServices
    }));
  };

  const removeService = (index) => {
    if (contactContent.services.length > 1) {
      const updatedServices = contactContent.services.filter((_, i) => i !== index);
      setContactContent(prev => ({
        ...prev,
        services: updatedServices
      }));
    } else {
      alert('At least one service is required');
    }
  };

  // Reset form
  const resetForm = () => {
    setContactContent({
      title: "Get In Touch",
      backgroundText: "Contact",
      mainTitle: "Let's Work Together",
      subtitle: "Have a project in mind? I'd love to hear about it. Let's create something amazing together.",
      contactInfo: [
        {
          id: 1,
          title: 'Email Us',
          details: 'hello@jennyportfolio.com',
          sub: 'support@jennyportfolio.com',
          action: 'mailto:hello@jennyportfolio.com',
          iconType: 'email'
        },
        {
          id: 2,
          title: 'Call Us',
          details: '+1 (555) 123-4567',
          sub: 'Mon-Fri, 9am-6pm',
          action: 'tel:+15551234567',
          iconType: 'phone'
        },
        {
          id: 3,
          title: 'Visit Us',
          details: '123 Design Street',
          sub: 'Creative District, NY 10001',
          action: 'https://maps.google.com',
          iconType: 'location'
        }
      ],
      services: [
        'UI/UX Design',
        'Web Development',
        'App Design',
        'Graphic Design',
        'Consultation',
        'Other'
      ],
      formValidation: {
        nameMinLength: 2,
        messageMinLength: 10,
        messageMaxLength: 500,
        requirePhone: false
      },
      submitButtonText: "Send Message",
      submittingText: "Sending...",
      successMessage: "Message sent successfully! I'll get back to you soon.",
      emailRecipient: "hello@jennyportfolio.com"
    });
    alert('Form reset to defaults!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-600">Loading contact data from Firebase...</p>
        </div>
      </div>
    );
  }

  return (
  
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDE - Admin Inputs */}
          <div className="lg:w-2/5 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Edit Contact Content</h2>
            
            {/* Header Inputs */}
            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800">Section Header</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title Badge Text
                </label>
                <input
                  type="text"
                  value={contactContent.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Get In Touch"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background Text
                </label>
                <input
                  type="text"
                  value={contactContent.backgroundText}
                  onChange={(e) => handleInputChange('backgroundText', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Contact"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Main Title
                </label>
                <input
                  type="text"
                  value={contactContent.mainTitle}
                  onChange={(e) => handleInputChange('mainTitle', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Let's Work Together"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle
                </label>
                <textarea
                  value={contactContent.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  rows="2"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter subtitle"
                />
              </div>
            </div>

            {/* Contact Info Management */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-800">
                  Contact Information ({contactContent.contactInfo.length})
                </h3>
                <button
                  onClick={addContactInfo}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  + Add Contact
                </button>
              </div>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {contactContent.contactInfo.map((info, index) => (
                  <div key={info.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">Contact #{index + 1}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => moveContactInfoUp(index)}
                            disabled={index === 0}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => moveContactInfoDown(index)}
                            disabled={index === contactContent.contactInfo.length - 1}
                            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
                          >
                            ↓
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => removeContactInfo(info.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Icon
                        </label>
                        <div className="flex gap-3">
                          {iconOptions.map((icon) => (
                            <button
                              key={icon.value}
                              type="button"
                              onClick={() => handleContactInfoChange(info.id, 'iconType', icon.value)}
                              className={`p-2 rounded-lg border transition-all duration-200 ${
                                info.iconType === icon.value
                                  ? 'border-purple-500 bg-purple-50'
                                  : 'border-gray-300 hover:border-purple-300'
                              }`}
                            >
                              <div className="text-purple-600">
                                {React.cloneElement(icon.svg, { className: "w-5 h-5" })}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          value={info.title}
                          onChange={(e) => handleContactInfoChange(info.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Main Details
                        </label>
                        <input
                          type="text"
                          value={info.details}
                          onChange={(e) => handleContactInfoChange(info.id, 'details', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Sub Details
                        </label>
                        <input
                          type="text"
                          value={info.sub}
                          onChange={(e) => handleContactInfoChange(info.id, 'sub', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Action URL
                        </label>
                        <input
                          type="text"
                          value={info.action}
                          onChange={(e) => handleContactInfoChange(info.id, 'action', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                          placeholder="mailto:email@example.com or https://..."
                        />
                      </div>
                      
                      {/* Live Preview */}
                      <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-500 mb-2">Preview:</p>
                        <div className="flex items-start p-3 bg-white rounded-lg">
                          <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                            {iconOptions.find(i => i.value === info.iconType)?.svg}
                          </div>
                          <div className="ml-3">
                            <h3 className="font-semibold text-gray-800 text-sm">{info.title}</h3>
                            <p className="text-gray-600 text-xs">{info.details}</p>
                            <p className="text-gray-500 text-xs mt-0.5">{info.sub}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Services Management */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-800">
                  Service Options ({contactContent.services.length})
                </h3>
                <button
                  onClick={addService}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  + Add Service
                </button>
              </div>
              <div className="space-y-2">
                {contactContent.services.map((service, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={service}
                      onChange={(e) => updateService(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded"
                      placeholder="Service name"
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

            {/* Form Validation Settings */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Form Validation Settings</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Name Length
                  </label>
                  <input
                    type="number"
                    value={contactContent.formValidation.nameMinLength}
                    onChange={(e) => handleValidationChange('nameMinLength', parseInt(e.target.value))}
                    min="1"
                    max="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Message Length
                  </label>
                  <input
                    type="number"
                    value={contactContent.formValidation.messageMinLength}
                    onChange={(e) => handleValidationChange('messageMinLength', parseInt(e.target.value))}
                    min="5"
                    max="50"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Message Length
                  </label>
                  <input
                    type="number"
                    value={contactContent.formValidation.messageMaxLength}
                    onChange={(e) => handleValidationChange('messageMaxLength', parseInt(e.target.value))}
                    min="100"
                    max="1000"
                    step="50"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={contactContent.formValidation.requirePhone}
                    onChange={(e) => handleValidationChange('requirePhone', e.target.checked)}
                    className="w-4 h-4 text-purple-600"
                  />
                  <span className="text-sm text-gray-700">Require Phone Number</span>
                </label>
              </div>
            </div>

            {/* Button Texts */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Button & Message Texts</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Submit Button Text
                  </label>
                  <input
                    type="text"
                    value={contactContent.submitButtonText}
                    onChange={(e) => handleInputChange('submitButtonText', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Submitting Text
                  </label>
                  <input
                    type="text"
                    value={contactContent.submittingText}
                    onChange={(e) => handleInputChange('submittingText', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Success Message
                  </label>
                  <input
                    type="text"
                    value={contactContent.successMessage}
                    onChange={(e) => handleInputChange('successMessage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Recipient
                  </label>
                  <input
                    type="email"
                    value={contactContent.emailRecipient}
                    onChange={(e) => handleInputChange('emailRecipient', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              </div>
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
                onClick={saveContactData}
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
                <p className="text-sm text-gray-500">Your contact section will look like this</p>
              </div>
              <div className="p-6">
                {/* EXACT preview of your Contact.jsx component */}
                <section className="py-14 bg-white">
                  <div className="container mx-auto px-6">
                    {/* Section Header */}
                    <div className="text-center mb-14">
                      <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider bg-purple-100 px-4 py-1 rounded-full inline-block">
                        {contactContent.title}
                      </span>
                      <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-4 mb-4">
                        {contactContent.mainTitle}
                      </h2>
                      <p className="text-gray-600 max-w-2xl mx-auto">
                        {contactContent.subtitle}
                      </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-8">
                      {/* Contact Info Cards - Left Side */}
                      <div className="w-full lg:w-1/3 space-y-6">
                        {contactContent.contactInfo.map((info, idx) => {
                          const icon = iconOptions.find(i => i.value === info.iconType);
                          return (
                            <a
                              key={idx}
                              href={info.action}
                              target={info.title === 'Visit Us' ? '_blank' : '_self'}
                              rel="noopener noreferrer"
                              className="flex items-start p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
                            >
                              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                                {icon && React.cloneElement(icon.svg, { className: "w-6 h-6" })}
                              </div>
                              <div className="ml-4">
                                <h3 className="font-semibold text-gray-800 mb-1">{info.title}</h3>
                                <p className="text-gray-600 text-sm">{info.details}</p>
                                <p className="text-gray-500 text-xs mt-1">{info.sub}</p>
                              </div>
                            </a>
                          );
                        })}
                      </div>

                      {/* Contact Form Preview */}
                      <div className="w-full lg:w-2/3">
                        <div className="bg-white rounded-xl shadow-lg p-8">
                          <div className="space-y-5">
                            <div>
                              <label className="block text-gray-700 font-medium mb-2 text-sm">Full Name *</label>
                              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" placeholder="John Doe" />
                            </div>
                            <div>
                              <label className="block text-gray-700 font-medium mb-2 text-sm">Email Address *</label>
                              <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" placeholder="john@example.com" />
                            </div>
                            {contactContent.formValidation.requirePhone && (
                              <div>
                                <label className="block text-gray-700 font-medium mb-2 text-sm">Phone Number *</label>
                                <input type="tel" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" placeholder="+1 (555) 123-4567" />
                              </div>
                            )}
                            <div>
                              <label className="block text-gray-700 font-medium mb-2 text-sm">Service Interested In</label>
                              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm">
                                <option value="">Select a service</option>
                                {contactContent.services.map((service, idx) => (
                                  <option key={idx} value={service}>{service}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-gray-700 font-medium mb-2 text-sm">Subject *</label>
                              <input type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" placeholder="How can I help you?" />
                            </div>
                            <div>
                              <label className="block text-gray-700 font-medium mb-2 text-sm">Message *</label>
                              <textarea rows="4" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Tell me about your project..."></textarea>
                            </div>
                          </div>
                          <button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-lg text-sm">
                            {contactContent.submitButtonText}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default ContactInput;