// components/ServicesInput.jsx (Admin Panel for Editing Services)
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const ServicesInput = () => {
  // State for services content
  const [servicesContent, setServicesContent] = useState({
    title: "Services",
    backgroundText: "Services",
    mainTitle: "Services I Provide",
    subtitle: "Have a project in mind? I'd love to hear about it. Let's create something amazing together.",
    buttonText: "Learn more",
    services: [
      {
        id: 1,
        title: 'UI/UX Design',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        iconType: 'monitor'
      },
      {
        id: 2,
        title: 'Application Design',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        iconType: 'cube'
      },
      {
        id: 3,
        title: 'Website Design',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        iconType: 'globe'
      },
      {
        id: 4,
        title: 'UI/UX Design',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        iconType: 'monitor'
      },
      {
        id: 5,
        title: 'Application Design',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        iconType: 'cube'
      },
      {
        id: 6,
        title: 'Website Design',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        iconType: 'globe'
      }
    ]
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Icon options
  const iconOptions = [
    { 
      value: 'monitor', 
      label: 'Monitor/UI Design',
      svg: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      value: 'cube', 
      label: 'Cube/Application',
      svg: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      )
    },
    { 
      value: 'globe', 
      label: 'Globe/Website',
      svg: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4-3-9s1.34-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
    }
  ];

  // Load data from Firebase on component mount
  useEffect(() => {
    loadServicesData();
  }, []);

  // Load services data from Firebase
  const loadServicesData = async () => {
    try {
      setLoading(true);
      const servicesRef = doc(db, 'Resume', 'Services');
      const servicesSnap = await getDoc(servicesRef);
      
      if (servicesSnap.exists()) {
        const data = servicesSnap.data();
        setServicesContent(prev => ({
          ...prev,
          ...data,
          services: data.services || prev.services
        }));
        console.log('Services data loaded from Firebase');
      } else {
        console.log('No services data found, using defaults');
      }
    } catch (error) {
      console.error('Error loading services data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save services data to Firebase
  const saveServicesData = async () => {
    try {
      setSaving(true);
      
      // Prepare data for Firebase
      const dataToSave = {
        ...servicesContent,
        updatedAt: new Date().toISOString()
      };

      // Save to Firestore
      const servicesRef = doc(db, 'Resume', 'Services');
      await setDoc(servicesRef, dataToSave, { merge: true });
      
      console.log('Services data saved to Firebase');
      alert('Services section saved successfully!');
      
    } catch (error) {
      console.error('Error saving services data:', error);
      alert('Error saving services section: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Handler for input changes
  const handleInputChange = (field, value) => {
    setServicesContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler for service changes
  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...servicesContent.services];
    updatedServices[index] = {
      ...updatedServices[index],
      [field]: value
    };
    setServicesContent(prev => ({
      ...prev,
      services: updatedServices
    }));
  };

  // Add new service
  const addService = () => {
    if (servicesContent.services.length < 12) {
      const newId = Math.max(...servicesContent.services.map(s => s.id), 0) + 1;
      setServicesContent(prev => ({
        ...prev,
        services: [...prev.services, { 
          id: newId,
          title: "New Service", 
          description: "Service description here",
          iconType: "monitor"
        }]
      }));
    } else {
      alert('Maximum 12 services allowed');
    }
  };

  // Remove service
  const removeService = (index) => {
    if (servicesContent.services.length > 1) {
      const updatedServices = servicesContent.services.filter((_, i) => i !== index);
      setServicesContent(prev => ({
        ...prev,
        services: updatedServices
      }));
    } else {
      alert('At least one service is required');
    }
  };

  // Move service up
  const moveServiceUp = (index) => {
    if (index > 0) {
      const updatedServices = [...servicesContent.services];
      [updatedServices[index], updatedServices[index - 1]] = [updatedServices[index - 1], updatedServices[index]];
      setServicesContent(prev => ({
        ...prev,
        services: updatedServices
      }));
    }
  };

  // Move service down
  const moveServiceDown = (index) => {
    if (index < servicesContent.services.length - 1) {
      const updatedServices = [...servicesContent.services];
      [updatedServices[index], updatedServices[index + 1]] = [updatedServices[index + 1], updatedServices[index]];
      setServicesContent(prev => ({
        ...prev,
        services: updatedServices
      }));
    }
  };

  // Reset form
  const resetForm = () => {
    setServicesContent({
      title: "Services",
      backgroundText: "Services",
      mainTitle: "Services I Provide",
      subtitle: "Have a project in mind? I'd love to hear about it. Let's create something amazing together.",
      buttonText: "Learn more",
      services: [
        {
          id: 1,
          title: 'UI/UX Design',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          iconType: 'monitor'
        },
        {
          id: 2,
          title: 'Application Design',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          iconType: 'cube'
        },
        {
          id: 3,
          title: 'Website Design',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          iconType: 'globe'
        },
        {
          id: 4,
          title: 'UI/UX Design',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          iconType: 'monitor'
        },
        {
          id: 5,
          title: 'Application Design',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          iconType: 'cube'
        },
        {
          id: 6,
          title: 'Website Design',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          iconType: 'globe'
        }
      ]
    });
    alert('Form reset to defaults!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-600">Loading services data from Firebase...</p>
        </div>
      </div>
    );
  }

  // Helper function to get icon SVG by type
  const getIconSvg = (iconType, className = "w-12 h-12 text-purple-600") => {
    const icon = iconOptions.find(opt => opt.value === iconType);
    if (icon) {
      return React.cloneElement(icon.svg, { className });
    }
    return iconOptions[0].svg;
  };

  return (
    
      <div className="w-full max-w-[1600px] mx-auto">
        {/* Full-width content area - takes all available space */}
        <div className="bg-gray-100">
          {/* Header with title and action buttons */}
          <div className="border-b border-gray-200 px-4 py-2 flex justify-between items-center flex-wrap gap-3">
            <h2 className="text-xl font-semibold text-gray-800">Edit Services Content</h2>
            <div className="flex gap-3">
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                Reset to Defaults
              </button>
              <button
                onClick={saveServicesData}
                disabled={saving}
                className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-colors min-w-[140px]"
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
          
          {/* Main content - two columns that expand to full width */}
          <div className="flex flex-col xl:flex-row gap-8 p-6">
            {/* LEFT SIDE - Admin Inputs (takes ~40% on large screens) */}
            <div className="xl:w-2/5 w-full">
              <div className="space-y-6">
                {/* Header Inputs Section */}
                <div className="bg-gray-50 rounded-lg p-5">
                  <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Section Header Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title Badge Text
                      </label>
                      <input
                        type="text"
                        value={servicesContent.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., Services"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Background Text
                      </label>
                      <input
                        type="text"
                        value={servicesContent.backgroundText}
                        onChange={(e) => handleInputChange('backgroundText', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., Services"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Main Title
                      </label>
                      <input
                        type="text"
                        value={servicesContent.mainTitle}
                        onChange={(e) => handleInputChange('mainTitle', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., Services I Provide"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subtitle
                      </label>
                      <textarea
                        value={servicesContent.subtitle}
                        onChange={(e) => handleInputChange('subtitle', e.target.value)}
                        rows="3"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Enter subtitle description"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Button Text
                      </label>
                      <input
                        type="text"
                        value={servicesContent.buttonText}
                        onChange={(e) => handleInputChange('buttonText', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., Learn more"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* RIGHT SIDE - Services Management (takes ~60% on large screens) */}
            <div className="xl:w-3/5 w-full">
              <div className="bg-gray-50 rounded-lg p-5">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                  <h3 className="text-md font-semibold text-gray-800">
                    Services List ({servicesContent.services.length} / 12)
                  </h3>
                  <button
                    onClick={addService}
                    className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Service
                  </button>
                </div>
                
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {servicesContent.services.map((service, index) => (
                    <div key={service.id} className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-full text-sm">
                            #{index + 1}
                          </span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => moveServiceUp(index)}
                              disabled={index === 0}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 transition-colors"
                              title="Move Up"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => moveServiceDown(index)}
                              disabled={index === servicesContent.services.length - 1}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 transition-colors"
                              title="Move Down"
                            >
                              ↓
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeService(index)}
                          className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Left column - Service details */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Service Title
                            </label>
                            <input
                              type="text"
                              value={service.title}
                              onChange={(e) => handleServiceChange(index, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              placeholder="e.g., UI/UX Design"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <textarea
                              value={service.description}
                              onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                              rows="3"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              placeholder="Enter service description"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Icon
                            </label>
                            <div className="flex flex-wrap gap-3">
                              {iconOptions.map((icon) => (
                                <button
                                  key={icon.value}
                                  type="button"
                                  onClick={() => handleServiceChange(index, 'iconType', icon.value)}
                                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                                    service.iconType === icon.value
                                      ? 'border-purple-500 bg-purple-50'
                                      : 'border-gray-300 hover:border-purple-300'
                                  }`}
                                >
                                  <div className="text-purple-600">
                                    {React.cloneElement(icon.svg, { className: "w-8 h-8" })}
                                  </div>
                                  <p className="text-xs text-gray-600 mt-1">{icon.label}</p>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Right column - Live Preview */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 flex items-center justify-center">
                          <div className="text-center w-full">
                            <p className="text-xs text-gray-500 mb-3">Live Preview</p>
                            <div className="bg-white rounded-lg p-4 border-2 border-purple-600 shadow-md max-w-[220px] mx-auto">
                              <div className="mb-3 flex justify-center">
                                {getIconSvg(service.iconType, "w-12 h-12 text-purple-600")}
                              </div>
                              <h3 className="text-base font-bold text-gray-800 mb-2 text-center">
                                {service.title || "Service Title"}
                              </h3>
                              <p className="text-xs text-gray-600 text-center line-clamp-3">
                                {service.description || "Service description will appear here"}
                              </p>
                              <div className="flex justify-center mt-3">
                                <span className="text-xs text-purple-600 font-semibold">
                                  {servicesContent.buttonText || "Learn more"} →
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {servicesContent.services.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="mt-4 text-gray-500">No services added yet. Click "Add Service" to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default ServicesInput;