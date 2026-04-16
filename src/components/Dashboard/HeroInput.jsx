// components/HeroInput.jsx (Admin Panel for Editing Hero Section)
import React, { useState, useEffect } from 'react';
// import { db, storage } from '../../firebase/config';
// import { doc, setDoc, getDoc } from 'firebase/firestore';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const HeroInput = () => {
  // State for hero content
  const [heroContent, setHeroContent] = useState({
    greeting: "Hello!",
    namePrefix: "I'm",
    name: "Jenny",
    role: "Product Designer",
    description: "I'm an experienced product designer with a passion for creating intuitive and beautiful user experiences. I specialize in crafting seamless interfaces that delight users and drive business success.",
    buttonPrimaryText: "Portfolio",
    buttonSecondaryText: "Hire Me",
    profileImage: "https://preview.colorlib.com/theme/jony/img/about/my_img.png",
    skills: [
      { name: "Figma", iconType: "figma", position: "topRight" },
      { name: "Photoshop", iconType: "photoshop", position: "bottomLeft" },
      { name: "Adobe XD", iconType: "xd", position: "topLeft" },
      { name: "Illustrator", iconType: "illustrator", position: "bottomRight" }
    ]
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [profileImageFile, setProfileImageFile] = useState(null);

  // Skill positions
  const positionOptions = [
    { value: "topRight", label: "Top Right" },
    { value: "bottomLeft", label: "Bottom Left" },
    { value: "topLeft", label: "Top Left" },
    { value: "bottomRight", label: "Bottom Right" }
  ];

  // Icon options
  const iconOptions = [
    { 
      value: 'figma', 
      label: 'Figma',
      svg: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.5 2C6.5 2 5 3.5 5 5.5C5 7.5 6.5 9 8.5 9H12V5.5C12 3.5 10.5 2 8.5 2Z" fill="#0ACF83"/>
          <path d="M12 2V9H15.5C17.5 9 19 7.5 19 5.5C19 3.5 17.5 2 15.5 2H12Z" fill="#A259FF"/>
          <path d="M12 9V16H15.5C17.5 16 19 14.5 19 12.5C19 10.5 17.5 9 15.5 9H12Z" fill="#F24E1E"/>
          <path d="M8.5 9C6.5 9 5 10.5 5 12.5C5 14.5 6.5 16 8.5 16C10.5 16 12 14.5 12 12.5V9H8.5Z" fill="#FF7262"/>
          <path d="M5 15.5C5 17.5 6.5 19 8.5 19H12V15.5C12 13.5 10.5 12 8.5 12C6.5 12 5 13.5 5 15.5Z" fill="#1ABCFE"/>
        </svg>
      )
    },
    { 
      value: 'photoshop', 
      label: 'Photoshop',
      svg: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#31A8FF"/>
          <path d="M9 8h3v8H9V8z" fill="white"/>
          <path d="M13 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z" fill="white"/>
          <path d="M13 12c0-2.21 1.79-4 4-4v8c-2.21 0-4-1.79-4-4z" fill="#001D34"/>
        </svg>
      )
    },
    { 
      value: 'xd', 
      label: 'Adobe XD',
      svg: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#FF61F6"/>
          <path d="M8 16h8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="12" cy="12" r="2" fill="white"/>
        </svg>
      )
    },
    { 
      value: 'illustrator', 
      label: 'Illustrator',
      svg: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#FF9A00"/>
          <path d="M8 8h2v8H8V8zM14 8h2v8h-2V8z" fill="white"/>
          <circle cx="15" cy="10" r="1" fill="white"/>
        </svg>
      )
    }
  ];

  // Load data from Firebase on component mount
  useEffect(() => {
    loadHeroData();
  }, []);

  // Load hero data from Firebase
  const loadHeroData = async () => {
    try {
      setLoading(true);
      const heroRef = doc(db, 'Resume', 'Hero');
      const heroSnap = await getDoc(heroRef);
      
      if (heroSnap.exists()) {
        const data = heroSnap.data();
        setHeroContent(prev => ({
          ...prev,
          ...data,
          skills: data.skills || prev.skills
        }));
        console.log('Hero data loaded from Firebase');
      } else {
        console.log('No hero data found, using defaults');
      }
    } catch (error) {
      console.error('Error loading hero data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Image upload handler
  const handleImageUpload = async (e) => {
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

    setProfileImageFile(file);
    setUploadProgress(0);

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setHeroContent(prev => ({
      ...prev,
      profileImage: previewUrl
    }));

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);
  };

  // Save hero data to Firebase
  const saveHeroData = async () => {
    try {
      setSaving(true);
      
      let finalImageUrl = heroContent.profileImage;
      
      // Upload new image to Firebase Storage if exists
      if (profileImageFile) {
        setUploadProgress(95);
        const storageRef = ref(storage, `hero-images/${Date.now()}_${profileImageFile.name}`);
        await uploadBytes(storageRef, profileImageFile);
        finalImageUrl = await getDownloadURL(storageRef);
        setUploadProgress(100);
      }

      // Prepare data for Firebase
      const dataToSave = {
        ...heroContent,
        profileImage: finalImageUrl,
        updatedAt: new Date().toISOString()
      };

      // Save to Firestore
      const heroRef = doc(db, 'Resume', 'Hero');
      await setDoc(heroRef, dataToSave, { merge: true });
      
      console.log('Hero data saved to Firebase');
      alert('Hero section saved successfully!');
      
      // Reset upload state
      setProfileImageFile(null);
      setUploadProgress(0);
      
    } catch (error) {
      console.error('Error saving hero data:', error);
      alert('Error saving hero section: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Handler for input changes
  const handleInputChange = (field, value) => {
    setHeroContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler for skill changes
  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...heroContent.skills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      [field]: value
    };
    setHeroContent(prev => ({
      ...prev,
      skills: updatedSkills
    }));
  };

  // Add new skill
  const addSkill = () => {
    if (heroContent.skills.length < 8) {
      setHeroContent(prev => ({
        ...prev,
        skills: [...prev.skills, { 
          name: "New Skill", 
          iconType: "figma",
          position: "topRight"
        }]
      }));
    } else {
      alert('Maximum 8 skills allowed');
    }
  };

  // Remove skill
  const removeSkill = (index) => {
    if (heroContent.skills.length > 1) {
      const updatedSkills = heroContent.skills.filter((_, i) => i !== index);
      setHeroContent(prev => ({
        ...prev,
        skills: updatedSkills
      }));
    } else {
      alert('At least one skill is required');
    }
  };

  // Reset form
  const resetForm = () => {
    setHeroContent({
      greeting: "Hello!",
      namePrefix: "I'm",
      name: "Jenny",
      role: "Product Designer",
      description: "I'm an experienced product designer with a passion for creating intuitive and beautiful user experiences. I specialize in crafting seamless interfaces that delight users and drive business success.",
      buttonPrimaryText: "Portfolio",
      buttonSecondaryText: "Hire Me",
      profileImage: "https://preview.colorlib.com/theme/jony/img/about/my_img.png",
      skills: [
        { name: "Figma", iconType: "figma", position: "topRight" },
        { name: "Photoshop", iconType: "photoshop", position: "bottomLeft" },
        { name: "Adobe XD", iconType: "xd", position: "topLeft" },
        { name: "Illustrator", iconType: "illustrator", position: "bottomRight" }
      ]
    });
    setProfileImageFile(null);
    setUploadProgress(0);
    alert('Form reset to defaults!');
  };

  // Helper function to get position CSS classes
  const getPositionClasses = (position) => {
    switch(position) {
      case 'topRight': return 'top-40 -left-28';
      case 'bottomLeft': return 'bottom-26 -right-38';
      case 'topLeft': return '-top-3 -left-13';
      case 'bottomRight': return 'top-53 -right-28';
      default: return 'top-40 -left-28';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-600">Loading hero data from Firebase...</p>
        </div>
      </div>
    );
  }

  return (
  
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT SIDE - Admin Inputs */}
          <div className="lg:w-2/5 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Edit Hero Content</h2>
            
            {/* Header Inputs */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Greeting Text
                </label>
                <input
                  type="text"
                  value={heroContent.greeting}
                  onChange={(e) => handleInputChange('greeting', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., Hello!"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name Prefix
                  </label>
                  <input
                    type="text"
                    value={heroContent.namePrefix}
                    onChange={(e) => handleInputChange('namePrefix', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., I'm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={heroContent.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., Jenny"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role / Title
                </label>
                <input
                  type="text"
                  value={heroContent.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="e.g., Product Designer"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={heroContent.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter description"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Button Text
                  </label>
                  <input
                    type="text"
                    value={heroContent.buttonPrimaryText}
                    onChange={(e) => handleInputChange('buttonPrimaryText', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., Portfolio"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Secondary Button Text
                  </label>
                  <input
                    type="text"
                    value={heroContent.buttonSecondaryText}
                    onChange={(e) => handleInputChange('buttonSecondaryText', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="e.g., Hire Me"
                  />
                </div>
              </div>
              
              {/* Profile Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image (Max 20MB)
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="mt-2">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Uploading: {uploadProgress}%</p>
                      </div>
                    )}
                  </div>
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-purple-300">
                    {heroContent.profileImage ? (
                      <img 
                        src={heroContent.profileImage} 
                        alt="Profile" 
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
            </div>
            
            {/* Skills Management */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium text-gray-800">
                  Skills Badges ({heroContent.skills.length})
                </h3>
                <button
                  onClick={addSkill}
                  className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  + Add Skill
                </button>
              </div>
              
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {heroContent.skills.map((skill, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700 text-sm">Skill #{index + 1}</span>
                      <button
                        onClick={() => removeSkill(index)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      {/* Skill Name */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Skill Name
                        </label>
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="e.g., Figma"
                        />
                      </div>
                      
                      {/* Icon Selection */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Icon
                        </label>
                        <div className="flex gap-2">
                          {iconOptions.map((icon) => (
                            <button
                              key={icon.value}
                              type="button"
                              onClick={() => handleSkillChange(index, 'iconType', icon.value)}
                              className={`p-2 rounded-lg border transition-all duration-200 ${
                                skill.iconType === icon.value
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
                      
                      {/* Position Selection */}
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Badge Position
                        </label>
                        <select
                          value={skill.position}
                          onChange={(e) => handleSkillChange(index, 'position', e.target.value)}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        >
                          {positionOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {/* Preview */}
                      <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {iconOptions.find(i => i.value === skill.iconType)?.svg}
                            <span className="text-sm font-medium text-gray-800">{skill.name}</span>
                          </div>
                          <span className="text-xs text-gray-500">{positionOptions.find(p => p.value === skill.position)?.label}</span>
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
                onClick={saveHeroData}
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
                <p className="text-sm text-gray-500">Your hero section will look like this</p>
              </div>
              <div className="p-6">
                {/* EXACT preview of your Hero.jsx component */}
                <main className="bg-white min-h-[500px] flex items-center relative overflow-hidden">
                  <div className="absolute top-20 left-10 w-64 h-64 bg-purple-50 rounded-full opacity-50 blur-3xl"></div>
                  <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-50 rounded-full opacity-50 blur-3xl"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-purple-50/20 via-transparent to-pink-50/20"></div>
                  
                  <div className="container mx-auto px-6 py-14 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                      
                      {/* Left Column - Text Content */}
                      <div className="flex-1 text-center md:text-left">
                        <div className="mb-4">
                          <span className="text-purple-600 font-semibold text-lg bg-purple-100 px-4 py-1 rounded-full inline-block">
                            {heroContent.greeting}
                          </span>
                        </div>
                        
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 leading-tight mb-4">
                          {heroContent.namePrefix} {heroContent.name},
                          <br />
                          <span className="text-purple-600 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                            {heroContent.role}
                          </span>
                        </h1>
                        
                        <div className="mt-6 mb-8 max-w-md mx-auto md:mx-0">
                          <p className="text-gray-700 leading-relaxed">
                            {heroContent.description}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6 mt-8">
                          <div className="flex gap-4">
                            <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300">
                              {heroContent.buttonPrimaryText}
                            </button>
                            <button className="px-6 py-3 border-2 border-purple-600 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transform hover:scale-105 transition duration-300">
                              {heroContent.buttonSecondaryText}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Image with Badges */}
                      <div className="flex-1 flex justify-center">
                        <div className="relative group">
                          <div className="absolute inset-0 rounded-full w-80 h-80 md:w-96 md:h-96 top-76 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-75 blur-md animate-pulse"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full w-80 h-80 md:w-96 md:h-96 top-76 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl"></div>
                          <div className="absolute inset-0 rounded-full w-72 h-72 md:w-88 md:h-88 top-76 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm"></div>
                          
                          <div className="relative z-10">
                            <img 
                              src={heroContent.profileImage} 
                              alt={`${heroContent.name} - ${heroContent.role}`}
                              className="w-60 h-auto md:w-80 rounded-full object-cover"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/400x400?text=Profile';
                              }}
                            />
                          </div>
                          
                          {/* Skill Badges */}
                          {heroContent.skills.map((skill, idx) => {
                            const icon = iconOptions.find(i => i.value === skill.iconType);
                            return (
                              <div 
                                key={idx}
                                className={`absolute ${getPositionClasses(skill.position)} z-30 bg-white rounded-2xl shadow-xl p-2 md:p-3 transform rotate-6 hover:rotate-0 hover:scale-110 transition-all duration-300 cursor-pointer`}
                              >
                                <div className="flex items-center gap-2">
                                  {icon && React.cloneElement(icon.svg, { className: "w-6 h-6 md:w-8 md:h-8" })}
                                  <span className="font-bold text-gray-800 text-sm md:text-base hidden sm:inline">{skill.name}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default HeroInput;