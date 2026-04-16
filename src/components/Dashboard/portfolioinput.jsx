// components/PortfolioInput.jsx (Admin Panel for Editing Portfolio)
import React, { useState, useEffect } from 'react';
// import { db, storage } from '../../firebase/config';
// import { doc, setDoc, getDoc } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const PortfolioInput = () => {
  // State for portfolio content
  const [portfolioContent, setPortfolioContent] = useState({
    title: "My Portfolio",
    backgroundText: "Portfolio",
    mainTitle: "My Portfolio",
    subtitle: "Explore a collection of my UI/UX design projects, each crafted to deliver seamless, user-centered experiences.",
    buttonText: "View More Projects",
    filterButtonText: "Get In Touch",
    filters: ['UI/UX', 'Website Design', 'App Design', 'Graphic Design'],
    projects: [
      {
        id: 1,
        title: 'Website Landing Page Design & Service',
        category: 'Website Design',
        image: 'https://img.freepik.com/free-vector/cartoon-web-design-landing-page_52683-70880.jpg?ga=GA1.1.2004732093.1748974615&semt=ais_hybrid&w=740&q=80',
        tags: ['Design']
      },
      {
        id: 2,
        title: 'Website Landing Page Design & Service',
        category: 'Website Design',
        image: 'https://img.freepik.com/free-photo/close-up-image-programer-working-his-desk-office_1098-18707.jpg?ga=GA1.1.2004732093.1748974615&semt=ais_hybrid&w=740&q=80',
        tags: ['Design']
      },
      {
        id: 3,
        title: 'Website Landing Page Design',
        category: 'Website Design',
        image: 'https://img.freepik.com/free-photo/html-css-collage-concept-with-person_23-2150062004.jpg?ga=GA1.1.2004732093.1748974615&semt=ais_hybrid&w=740&q=80',
        tags: ['Design']
      },
      {
        id: 4,
        title: 'Mobile App UI/UX Design',
        category: 'UI/UX',
        image: 'https://img.freepik.com/free-vector/flat-design-ui-ux-background_23-2149093996.jpg?ga=GA1.1.2004732093.1748974615&semt=ais_hybrid&w=740&q=80',
        tags: ['UI/UX']
      },
      {
        id: 5,
        title: 'E-commerce App Design',
        category: 'App Design',
        image: 'https://img.freepik.com/free-vector/banking-app-interface-concept_52683-41893.jpg?ga=GA1.1.2004732093.1748974615&semt=ais_hybrid&w=740&q=80',
        tags: ['App Design']
      },
      {
        id: 6,
        title: 'Brand Identity Design',
        category: 'Graphic Design',
        image: 'https://img.freepik.com/free-photo/ideas-design-draft-creative-sketch-objective-concept_53876-121105.jpg?ga=GA1.1.2004732093.1748974615&semt=ais_hybrid&w=740&q=80',
        tags: ['Graphic Design']
      }
    ]
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [imageFiles, setImageFiles] = useState({});

  // Available categories for dropdown
  const availableCategories = [
    "UI/UX", "Website Design", "App Design", "Graphic Design",
    "Branding", "Web Development", "Illustration", "Animation"
  ];

  // Available tags
  const availableTags = [
    "Design", "UI/UX", "App Design", "Web Design", "Graphic Design",
    "Branding", "Development", "Illustration", "Animation", "Marketing"
  ];

  // Load data from Firebase on component mount
  useEffect(() => {
    loadPortfolioData();
  }, []);

  // Load portfolio data from Firebase
  const loadPortfolioData = async () => {
    try {
      setLoading(true);
      const portfolioRef = doc(db, 'Resume', 'Portfolio');
      const portfolioSnap = await getDoc(portfolioRef);
      
      if (portfolioSnap.exists()) {
        const data = portfolioSnap.data();
        setPortfolioContent(prev => ({
          ...prev,
          ...data,
          projects: data.projects || prev.projects
        }));
        console.log('Portfolio data loaded from Firebase');
      } else {
        console.log('No portfolio data found, using defaults');
      }
    } catch (error) {
      console.error('Error loading portfolio data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Image upload handler for specific project
  const handleImageUpload = async (e, projectId) => {
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
      [projectId]: file
    }));

    // Update upload progress
    setUploadProgress(prev => ({
      ...prev,
      [projectId]: 0
    }));

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    const updatedProjects = portfolioContent.projects.map(project =>
      project.id === projectId
        ? { ...project, image: previewUrl }
        : project
    );
    setPortfolioContent(prev => ({
      ...prev,
      projects: updatedProjects
    }));

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const currentProgress = prev[projectId] || 0;
        if (currentProgress >= 90) {
          clearInterval(interval);
          return { ...prev, [projectId]: 90 };
        }
        return { ...prev, [projectId]: currentProgress + 10 };
      });
    }, 100);
  };

  // Save portfolio data to Firebase
  const savePortfolioData = async () => {
    try {
      setSaving(true);
      
      // Create a copy of projects to update with uploaded images
      const updatedProjects = [...portfolioContent.projects];
      
      // Upload all new images to Firebase Storage
      for (const [projectId, file] of Object.entries(imageFiles)) {
        if (file) {
          setUploadProgress(prev => ({
            ...prev,
            [projectId]: 95
          }));
          
          const storageRef = ref(storage, `portfolio-images/${Date.now()}_${file.name}`);
          await uploadBytes(storageRef, file);
          const imageUrl = await getDownloadURL(storageRef);
          
          const projectIndex = updatedProjects.findIndex(p => p.id === parseInt(projectId));
          if (projectIndex !== -1) {
            updatedProjects[projectIndex] = {
              ...updatedProjects[projectIndex],
              image: imageUrl
            };
          }
          
          setUploadProgress(prev => ({
            ...prev,
            [projectId]: 100
          }));
        }
      }

      // Prepare data for Firebase
      const dataToSave = {
        ...portfolioContent,
        projects: updatedProjects,
        updatedAt: new Date().toISOString()
      };

      // Save to Firestore
      const portfolioRef = doc(db, 'Resume', 'Portfolio');
      await setDoc(portfolioRef, dataToSave, { merge: true });
      
      console.log('Portfolio data saved to Firebase');
      alert('Portfolio section saved successfully!');
      
      // Reset upload state
      setImageFiles({});
      setUploadProgress({});
      
    } catch (error) {
      console.error('Error saving portfolio data:', error);
      alert('Error saving portfolio section: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Handler for input changes
  const handleInputChange = (field, value) => {
    setPortfolioContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler for project changes
  const handleProjectChange = (projectId, field, value) => {
    const updatedProjects = portfolioContent.projects.map(project =>
      project.id === projectId
        ? { ...project, [field]: value }
        : project
    );
    setPortfolioContent(prev => ({
      ...prev,
      projects: updatedProjects
    }));
  };

  // Add new project
  const addProject = () => {
    const newId = Math.max(...portfolioContent.projects.map(p => p.id), 0) + 1;
    setPortfolioContent(prev => ({
      ...prev,
      projects: [...prev.projects, {
        id: newId,
        title: "New Project",
        category: "Website Design",
        image: "",
        tags: ["Design"]
      }]
    }));
  };

  // Remove project
  const removeProject = (projectId) => {
    if (portfolioContent.projects.length > 1) {
      const updatedProjects = portfolioContent.projects.filter(project => project.id !== projectId);
      setPortfolioContent(prev => ({
        ...prev,
        projects: updatedProjects
      }));
    }
  };

  // Add tag to project
  const addTagToProject = (projectId, tag) => {
    if (tag && !portfolioContent.projects.find(p => p.id === projectId)?.tags.includes(tag)) {
      const updatedProjects = portfolioContent.projects.map(project =>
        project.id === projectId
          ? { ...project, tags: [...project.tags, tag] }
          : project
      );
      setPortfolioContent(prev => ({
        ...prev,
        projects: updatedProjects
      }));
    }
  };

  // Remove tag from project
  const removeTagFromProject = (projectId, tagToRemove) => {
    const updatedProjects = portfolioContent.projects.map(project =>
      project.id === projectId
        ? { ...project, tags: project.tags.filter(tag => tag !== tagToRemove) }
        : project
    );
    setPortfolioContent(prev => ({
      ...prev,
      projects: updatedProjects
    }));
  };

  // Reset form
  const resetForm = () => {
    setPortfolioContent({
      title: "My Portfolio",
      backgroundText: "Portfolio",
      mainTitle: "My Portfolio",
      subtitle: "Explore a collection of my UI/UX design projects, each crafted to deliver seamless, user-centered experiences.",
      buttonText: "View More Projects",
      filterButtonText: "Get In Touch",
      filters: ['UI/UX', 'Website Design', 'App Design', 'Graphic Design'],
      projects: [
        {
          id: 1,
          title: 'Website Landing Page Design & Service',
          category: 'Website Design',
          image: 'https://img.freepik.com/free-vector/cartoon-web-design-landing-page_52683-70880.jpg?ga=GA1.1.2004732093.1748974615&semt=ais_hybrid&w=740&q=80',
          tags: ['Design']
        },
        {
          id: 2,
          title: 'Website Landing Page Design & Service',
          category: 'Website Design',
          image: 'https://img.freepik.com/free-photo/close-up-image-programer-working-his-desk-office_1098-18707.jpg?ga=GA1.1.2004732093.1748974615&semt=ais_hybrid&w=740&q=80',
          tags: ['Design']
        },
        {
          id: 3,
          title: 'Website Landing Page Design',
          category: 'Website Design',
          image: 'https://img.freepik.com/free-photo/html-css-collage-concept-with-person_23-2150062004.jpg?ga=GA1.1.2004732093.1748974615&semt=ais_hybrid&w=740&q=80',
          tags: ['Design']
        },
        {
          id: 4,
          title: 'Mobile App UI/UX Design',
          category: 'UI/UX',
          image: 'https://img.freepik.com/free-vector/flat-design-ui-ux-background_23-2149093996.jpg?ga=GA1.1.2004732093.1748974615&semt=ais_hybrid&w=740&q=80',
          tags: ['UI/UX']
        },
        {
          id: 5,
          title: 'E-commerce App Design',
          category: 'App Design',
          image: 'https://img.freepik.com/free-vector/banking-app-interface-concept_52683-41893.jpg?ga=GA1.1.2004732093.1748974615&semt=ais_hybrid&w=740&q=80',
          tags: ['App Design']
        },
        {
          id: 6,
          title: 'Brand Identity Design',
          category: 'Graphic Design',
          image: 'https://img.freepik.com/free-photo/ideas-design-draft-creative-sketch-objective-concept_53876-121105.jpg?ga=GA1.1.2004732093.1748974615&semt=ais_hybrid&w=740&q=80',
          tags: ['Graphic Design']
        }
      ]
    });
    setImageFiles({});
    setUploadProgress({});
    alert('Form reset to defaults!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-600">Loading portfolio data from Firebase...</p>
        </div>
      </div>
    );
  }

  return (
   
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDE - Admin Inputs */}
          <div className="lg:w-2/5 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Edit Portfolio Content</h2>
            
            {/* Header Inputs */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Filter Button Text
                </label>
                <input
                  type="text"
                  value={portfolioContent.filterButtonText}
                  onChange={(e) => handleInputChange('filterButtonText', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Main Title
                </label>
                <input
                  type="text"
                  value={portfolioContent.mainTitle}
                  onChange={(e) => handleInputChange('mainTitle', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Background Text
                </label>
                <input
                  type="text"
                  value={portfolioContent.backgroundText}
                  onChange={(e) => handleInputChange('backgroundText', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle
                </label>
                <textarea
                  value={portfolioContent.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={portfolioContent.buttonText}
                  onChange={(e) => handleInputChange('buttonText', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            
            {/* Filter Categories Management */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter Categories
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {portfolioContent.filters.map((filter, index) => (
                  <span key={index} className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    {filter}
                    <button
                      type="button"
                      onClick={() => {
                        const newFilters = portfolioContent.filters.filter((_, i) => i !== index);
                        handleInputChange('filters', newFilters);
                      }}
                      className="hover:text-purple-900 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <select
                  onChange={(e) => {
                    if (e.target.value && !portfolioContent.filters.includes(e.target.value)) {
                      handleInputChange('filters', [...portfolioContent.filters, e.target.value]);
                    }
                    e.target.value = '';
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Add new category...</option>
                  {availableCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Projects Management */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-800">
                  Projects ({portfolioContent.projects.length})
                </h3>
                <button
                  onClick={addProject}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  + Add Project
                </button>
              </div>
              
              <div className="space-y-4 max-h-[600px] overflow-y-auto">
                {portfolioContent.projects.map((project) => (
                  <div key={project.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-gray-700">Project #{project.id}</span>
                      <button
                        onClick={() => removeProject(project.id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {/* Image Upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Project Image (Max 20MB)
                        </label>
                        <div className="flex items-center gap-4">
                          <div className="flex-1">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, project.id)}
                              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                            />
                            {uploadProgress[project.id] > 0 && uploadProgress[project.id] < 100 && (
                              <div className="mt-2">
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-green-500 transition-all duration-300"
                                    style={{ width: `${uploadProgress[project.id]}%` }}
                                  ></div>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Uploading: {uploadProgress[project.id]}%</p>
                              </div>
                            )}
                          </div>
                          <div className="w-20 h-20 rounded-lg overflow-hidden border border-gray-300">
                            {project.image ? (
                              <img 
                                src={project.image} 
                                alt="Preview" 
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
                      
                      {/* Project Title */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Project Title
                        </label>
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => handleProjectChange(project.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      
                      {/* Category */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          value={project.category}
                          onChange={(e) => handleProjectChange(project.id, 'category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                          {availableCategories.map((category, idx) => (
                            <option key={idx} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Tags */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tags
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {project.tags.map((tag, idx) => (
                            <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTagFromProject(project.id, tag)}
                                className="hover:text-blue-900"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                addTagToProject(project.id, e.target.value);
                                e.target.value = '';
                              }
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          >
                            <option value="">Add tag...</option>
                            {availableTags.map(tag => (
                              <option key={tag} value={tag}>{tag}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                onClick={savePortfolioData}
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
                <p className="text-sm text-gray-500">Your portfolio will look like this</p>
              </div>
              <div className="p-6">
                {/* This is an EXACT preview of your Portfolio.jsx component */}
                <section className="py-20 bg-white">
                  <div className="container mx-auto px-6">
                    {/* Section Header */}
                    <div className="text-center mb-14">
                      <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider bg-purple-100 px-4 py-1 rounded-full inline-block">
                        {portfolioContent.filterButtonText}
                      </span>
                      <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-4 mb-4">
                        {portfolioContent.mainTitle}
                      </h2>
                      <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                        {portfolioContent.subtitle}
                      </p>
                      
                      {/* Filter Buttons */}
                      <div className="flex flex-wrap justify-center gap-4 mb-12">
                        <button className="px-6 py-2 rounded-full font-semibold bg-purple-600 text-white shadow-lg">
                          All
                        </button>
                        {portfolioContent.filters.map((filter, idx) => (
                          <button
                            key={idx}
                            className="px-6 py-2 rounded-full font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200"
                          >
                            {filter}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {portfolioContent.projects.map((project) => (
                        <div
                          key={project.id}
                          className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          {/* Project Image */}
                          <div className="relative overflow-hidden h-54">
                            <img
                              src={project.image || 'https://via.placeholder.com/400x300?text=No+Image'}
                              alt={project.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                              }}
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <button className="bg-white text-purple-600 px-4 py-2 rounded-full font-semibold hover:bg-purple-600 hover:text-white transition-colors duration-300">
                                View Project
                              </button>
                            </div>
                          </div>
                          
                          {/* Project Info */}
                          <div className="p-6">
                            <div className="mb-2">
                              <span className="text-sm text-purple-600 font-semibold">
                                {project.tags[0] || 'Design'}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                              {project.title}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {project.category}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* View More Button */}
                    <div className="text-center mt-12">
                      <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors duration-300 shadow-lg hover:shadow-xl">
                        {portfolioContent.buttonText}
                      </button>
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

export default PortfolioInput;