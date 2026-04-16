// components/TestimonialInput.jsx (Admin Panel for Editing Testimonials)
import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const TestimonialInput = () => {
  // State for testimonial content
  const [testimonialContent, setTestimonialContent] = useState({
    title: "Testimonials",
    backgroundText: "Testimonials",
    mainTitle: "What People Say",
    subtitle: "Real feedback from real clients who trusted me with their projects",
    testimonials: [
      {
        id: 1,
        name: 'Sarah Johnson',
        position: 'CEO',
        company: 'TechStart',
        image: 'https://randomuser.me/api/portraits/women/1.jpg',
        rating: 5,
        text: 'Absolutely outstanding work! The attention to detail and creative vision brought our project to life. Could not be happier with the results.',
      },
      {
        id: 2,
        name: 'Michael Chen',
        position: 'Product Manager',
        company: 'InnovateLab',
        image: 'https://randomuser.me/api/portraits/men/2.jpg',
        rating: 5,
        text: 'Working with this team was a game-changer for our business. They delivered beyond expectations and exceeded every deadline.',
      },
      {
        id: 3,
        name: 'Emily Rodriguez',
        position: 'Creative Director',
        company: 'DesignHub',
        image: 'https://randomuser.me/api/portraits/women/3.jpg',
        rating: 5,
        text: 'Professional, creative, and incredibly talented. The designs were modern, user-friendly, and exactly what we needed.',
      },
      {
        id: 4,
        name: 'David Kim',
        position: 'Founder',
        company: 'StartupStudio',
        image: 'https://randomuser.me/api/portraits/men/4.jpg',
        rating: 5,
        text: 'One of the best designers I have ever worked with. Exceptional communication and delivered high-quality work on time.',
      },
      {
        id: 5,
        name: 'Lisa Wong',
        position: 'Marketing Director',
        company: 'BrandBoost',
        image: 'https://randomuser.me/api/portraits/women/5.jpg',
        rating: 5,
        text: 'Incredible design sense and great attention to user experience. Highly recommended for any design project.',
      },
      {
        id: 6,
        name: 'James Wilson',
        position: 'CTO',
        company: 'TechFlow',
        image: 'https://randomuser.me/api/portraits/men/6.jpg',
        rating: 5,
        text: 'A true professional who understands both design and business needs. The results speak for themselves.',
      },
    ]
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [imageFiles, setImageFiles] = useState({});

  // Available ratings
  const ratings = [5, 4, 3, 2, 1];

  // Load data from Firebase on component mount
  useEffect(() => {
    loadTestimonialData();
  }, []);

  // Load testimonial data from Firebase
  const loadTestimonialData = async () => {
    try {
      setLoading(true);
      const testimonialRef = doc(db, 'Resume', 'Testimonial');
      const testimonialSnap = await getDoc(testimonialRef);
      
      if (testimonialSnap.exists()) {
        const data = testimonialSnap.data();
        setTestimonialContent(prev => ({
          ...prev,
          ...data,
          testimonials: data.testimonials || prev.testimonials
        }));
        console.log('Testimonial data loaded from Firebase');
      } else {
        console.log('No testimonial data found, using defaults');
      }
    } catch (error) {
      console.error('Error loading testimonial data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Image upload handler for specific testimonial
  const handleImageUpload = async (e, testimonialId) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 20MB)
    const maxSizeMB = 20;
    if (file.size > maxSizeMB * 1024 * 1024) {
      alert(`Image size should be less than ${maxSizeMB}MB`);
      return;
    }

    // Update image files
    setImageFiles(prev => ({
      ...prev,
      [testimonialId]: file
    }));

    // Update upload progress
    setUploadProgress(prev => ({
      ...prev,
      [testimonialId]: 0
    }));

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    const updatedTestimonials = testimonialContent.testimonials.map(testimonial =>
      testimonial.id === testimonialId
        ? { ...testimonial, image: previewUrl }
        : testimonial
    );
    setTestimonialContent(prev => ({
      ...prev,
      testimonials: updatedTestimonials
    }));

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const currentProgress = prev[testimonialId] || 0;
        if (currentProgress >= 90) {
          clearInterval(interval);
          return { ...prev, [testimonialId]: 90 };
        }
        return { ...prev, [testimonialId]: currentProgress + 10 };
      });
    }, 100);
  };

  // Save testimonial data to Firebase
  const saveTestimonialData = async () => {
    try {
      setSaving(true);
      
      // Create a copy of testimonials to update with uploaded images
      const updatedTestimonials = [...testimonialContent.testimonials];
      
      // Upload all new images to Firebase Storage
      for (const [testimonialId, file] of Object.entries(imageFiles)) {
        if (file) {
          setUploadProgress(prev => ({
            ...prev,
            [testimonialId]: 95
          }));
          
          const storageRef = ref(storage, `testimonial-images/${Date.now()}_${file.name}`);
          await uploadBytes(storageRef, file);
          const imageUrl = await getDownloadURL(storageRef);
          
          const testimonialIndex = updatedTestimonials.findIndex(t => t.id === parseInt(testimonialId));
          if (testimonialIndex !== -1) {
            updatedTestimonials[testimonialIndex] = {
              ...updatedTestimonials[testimonialIndex],
              image: imageUrl
            };
          }
          
          setUploadProgress(prev => ({
            ...prev,
            [testimonialId]: 100
          }));
        }
      }

      // Prepare data for Firebase
      const dataToSave = {
        ...testimonialContent,
        testimonials: updatedTestimonials,
        updatedAt: new Date().toISOString()
      };

      // Save to Firestore
      const testimonialRef = doc(db, 'Resume', 'Testimonial');
      await setDoc(testimonialRef, dataToSave, { merge: true });
      
      console.log('Testimonial data saved to Firebase');
      alert('Testimonial section saved successfully!');
      
      // Reset upload state
      setImageFiles({});
      setUploadProgress({});
      
    } catch (error) {
      console.error('Error saving testimonial data:', error);
      alert('Error saving testimonial section: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Handler for input changes
  const handleInputChange = (field, value) => {
    setTestimonialContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler for testimonial changes
  const handleTestimonialChange = (testimonialId, field, value) => {
    const updatedTestimonials = testimonialContent.testimonials.map(testimonial =>
      testimonial.id === testimonialId
        ? { ...testimonial, [field]: value }
        : testimonial
    );
    setTestimonialContent(prev => ({
      ...prev,
      testimonials: updatedTestimonials
    }));
  };

  // Add new testimonial
  const addTestimonial = () => {
    if (testimonialContent.testimonials.length < 12) {
      const newId = Math.max(...testimonialContent.testimonials.map(t => t.id), 0) + 1;
      setTestimonialContent(prev => ({
        ...prev,
        testimonials: [...prev.testimonials, { 
          id: newId,
          name: "New Client",
          position: "Position",
          company: "Company Name",
          image: "",
          rating: 5,
          text: "Testimonial text goes here..."
        }]
      }));
    } else {
      alert('Maximum 12 testimonials allowed');
    }
  };

  // Remove testimonial
  const removeTestimonial = (testimonialId) => {
    if (testimonialContent.testimonials.length > 1) {
      const updatedTestimonials = testimonialContent.testimonials.filter(testimonial => testimonial.id !== testimonialId);
      setTestimonialContent(prev => ({
        ...prev,
        testimonials: updatedTestimonials
      }));
    } else {
      alert('At least one testimonial is required');
    }
  };

  // Move testimonial up
  const moveTestimonialUp = (index) => {
    if (index > 0) {
      const updatedTestimonials = [...testimonialContent.testimonials];
      [updatedTestimonials[index], updatedTestimonials[index - 1]] = [updatedTestimonials[index - 1], updatedTestimonials[index]];
      setTestimonialContent(prev => ({
        ...prev,
        testimonials: updatedTestimonials
      }));
    }
  };

  // Move testimonial down
  const moveTestimonialDown = (index) => {
    if (index < testimonialContent.testimonials.length - 1) {
      const updatedTestimonials = [...testimonialContent.testimonials];
      [updatedTestimonials[index], updatedTestimonials[index + 1]] = [updatedTestimonials[index + 1], updatedTestimonials[index]];
      setTestimonialContent(prev => ({
        ...prev,
        testimonials: updatedTestimonials
      }));
    }
  };

  // Reset form
  const resetForm = () => {
    setTestimonialContent({
      title: "Testimonials",
      backgroundText: "Testimonials",
      mainTitle: "What People Say",
      subtitle: "Real feedback from real clients who trusted me with their projects",
      testimonials: [
        {
          id: 1,
          name: 'Sarah Johnson',
          position: 'CEO',
          company: 'TechStart',
          image: 'https://randomuser.me/api/portraits/women/1.jpg',
          rating: 5,
          text: 'Absolutely outstanding work! The attention to detail and creative vision brought our project to life. Could not be happier with the results.',
        },
        {
          id: 2,
          name: 'Michael Chen',
          position: 'Product Manager',
          company: 'InnovateLab',
          image: 'https://randomuser.me/api/portraits/men/2.jpg',
          rating: 5,
          text: 'Working with this team was a game-changer for our business. They delivered beyond expectations and exceeded every deadline.',
        },
        {
          id: 3,
          name: 'Emily Rodriguez',
          position: 'Creative Director',
          company: 'DesignHub',
          image: 'https://randomuser.me/api/portraits/women/3.jpg',
          rating: 5,
          text: 'Professional, creative, and incredibly talented. The designs were modern, user-friendly, and exactly what we needed.',
        },
        {
          id: 4,
          name: 'David Kim',
          position: 'Founder',
          company: 'StartupStudio',
          image: 'https://randomuser.me/api/portraits/men/4.jpg',
          rating: 5,
          text: 'One of the best designers I have ever worked with. Exceptional communication and delivered high-quality work on time.',
        },
        {
          id: 5,
          name: 'Lisa Wong',
          position: 'Marketing Director',
          company: 'BrandBoost',
          image: 'https://randomuser.me/api/portraits/women/5.jpg',
          rating: 5,
          text: 'Incredible design sense and great attention to user experience. Highly recommended for any design project.',
        },
        {
          id: 6,
          name: 'James Wilson',
          position: 'CTO',
          company: 'TechFlow',
          image: 'https://randomuser.me/api/portraits/men/6.jpg',
          rating: 5,
          text: 'A true professional who understands both design and business needs. The results speak for themselves.',
        },
      ]
    });
    setImageFiles({});
    setUploadProgress({});
    alert('Form reset to defaults!');
  };

  // Render star rating
  const renderStars = (rating, onChange, disabled = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !disabled && onChange(star)}
            disabled={disabled}
            className={`${disabled ? 'cursor-default' : 'cursor-pointer'} focus:outline-none`}
          >
            <svg
              className={`w-5 h-5 ${
                star <= rating ? 'text-yellow-400' : 'text-gray-300'
              } ${!disabled && 'hover:scale-110 transition-transform'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-600">Loading testimonial data from Firebase...</p>
        </div>
      </div>
    );
  }

  return (
    
      <div className="w-full max-w-[1600px] mx-auto">
        {/* Full-width content area - takes all available space */}
        <div className="bg-gray-100">
          {/* Header with title and action buttons */}
          <div className="border-b border-gray-200 px-4 py-2 flex justify-between items-center flex-wrap gap-3">
            <h2 className="text-xl font-semibold text-gray-800">Edit Testimonial Content</h2>
            <div className="flex gap-3">
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                Reset to Defaults
              </button>
              <button
                onClick={saveTestimonialData}
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
            {/* LEFT SIDE - Header Settings (takes ~35% on large screens) */}
            <div className="xl:w-1/3 w-full">
              <div className="bg-gray-50 rounded-lg p-5 sticky top-6">
                <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Section Header Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title Badge Text
                    </label>
                    <input
                      type="text"
                      value={testimonialContent.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="e.g., Testimonials"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Background Text
                    </label>
                    <input
                      type="text"
                      value={testimonialContent.backgroundText}
                      onChange={(e) => handleInputChange('backgroundText', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="e.g., Testimonials"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Main Title
                    </label>
                    <input
                      type="text"
                      value={testimonialContent.mainTitle}
                      onChange={(e) => handleInputChange('mainTitle', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="e.g., What People Say"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subtitle
                    </label>
                    <textarea
                      value={testimonialContent.subtitle}
                      onChange={(e) => handleInputChange('subtitle', e.target.value)}
                      rows="3"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter subtitle description"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* RIGHT SIDE - Testimonials Management (takes ~67% on large screens) */}
            <div className="xl:w-2/3 w-full">
              <div className="bg-gray-50 rounded-lg p-5">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                  <h3 className="text-md font-semibold text-gray-800">
                    Testimonials List ({testimonialContent.testimonials.length} / 12)
                  </h3>
                  <button
                    onClick={addTestimonial}
                    className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Testimonial
                  </button>
                </div>
                
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {testimonialContent.testimonials.map((testimonial, index) => (
                    <div key={testimonial.id} className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-full text-sm">
                            #{index + 1}
                          </span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => moveTestimonialUp(index)}
                              disabled={index === 0}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 transition-colors"
                              title="Move Up"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => moveTestimonialDown(index)}
                              disabled={index === testimonialContent.testimonials.length - 1}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 transition-colors"
                              title="Move Down"
                            >
                              ↓
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeTestimonial(testimonial.id)}
                          className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                        {/* Left column - Testimonial details */}
                        <div className="space-y-4">
                          {/* Image Upload */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Client Image (Max 20MB)
                            </label>
                            <div className="flex items-center gap-4">
                              <div className="flex-1">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, testimonial.id)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                                />
                                {uploadProgress[testimonial.id] > 0 && uploadProgress[testimonial.id] < 100 && (
                                  <div className="mt-2">
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-green-500 transition-all duration-300"
                                        style={{ width: `${uploadProgress[testimonial.id]}%` }}
                                      ></div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Uploading: {uploadProgress[testimonial.id]}%</p>
                                  </div>
                                )}
                              </div>
                              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-purple-300 flex-shrink-0">
                                {testimonial.image ? (
                                  <img 
                                    src={testimonial.image} 
                                    alt={testimonial.name} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                                    No Image
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {/* Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Client Name
                            </label>
                            <input
                              type="text"
                              value={testimonial.name}
                              onChange={(e) => handleTestimonialChange(testimonial.id, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              placeholder="e.g., John Doe"
                            />
                          </div>
                          
                          {/* Position & Company - Side by side */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Position
                              </label>
                              <input
                                type="text"
                                value={testimonial.position}
                                onChange={(e) => handleTestimonialChange(testimonial.id, 'position', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="e.g., CEO"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Company
                              </label>
                              <input
                                type="text"
                                value={testimonial.company}
                                onChange={(e) => handleTestimonialChange(testimonial.id, 'company', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="e.g., Company Name"
                              />
                            </div>
                          </div>
                          
                          {/* Rating */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Rating
                            </label>
                            {renderStars(testimonial.rating, (rating) => 
                              handleTestimonialChange(testimonial.id, 'rating', rating)
                            )}
                          </div>
                          
                          {/* Testimonial Text */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Testimonial Text
                            </label>
                            <textarea
                              value={testimonial.text}
                              onChange={(e) => handleTestimonialChange(testimonial.id, 'text', e.target.value)}
                              rows="3"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              placeholder="Enter testimonial text..."
                            />
                          </div>
                        </div>
                        
                        {/* Right column - Live Preview */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 flex items-center justify-center">
                          <div className="text-center w-full">
                            <p className="text-xs text-gray-500 mb-3">Live Preview</p>
                            <div className="bg-white rounded-2xl shadow-md p-5 max-w-[280px] mx-auto">
                              <div className="flex justify-center mb-3">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-300">
                                  {testimonial.image ? (
                                    <img 
                                      src={testimonial.image} 
                                      alt={testimonial.name} 
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="mb-3">
                                {renderStars(testimonial.rating, () => {}, true)}
                              </div>
                              <p className="text-gray-700 text-sm text-center mb-3 line-clamp-4 italic">
                                "{testimonial.text}"
                              </p>
                              <div className="text-center">
                                <p className="text-sm font-bold text-gray-800">{testimonial.name || "Client Name"}</p>
                                <p className="text-purple-600 text-xs">
                                  {testimonial.position || "Position"}
                                  {testimonial.company && ` @ ${testimonial.company}`}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {testimonialContent.testimonials.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="mt-4 text-gray-500">No testimonials added yet. Click "Add Testimonial" to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default TestimonialInput;