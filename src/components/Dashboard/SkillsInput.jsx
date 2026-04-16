// components/SkillsInput.jsx (Admin Panel for Editing Skills)
import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const SkillsInput = () => {
  // State for skills content
  const [skillsContent, setSkillsContent] = useState({
    title: "Technical Skills",
    backgroundText: "Skills",
    mainTitle: "My Development Expertise",
    subtitle: "Here are some of my core programming languages and technical competencies",
    buttonText: "View All Skills",
    skills: [
      { name: 'PHP', percentage: 85, color: 'purple' },
      { name: 'HTML', percentage: 80, color: 'purple' },
      { name: 'CSS', percentage: 90, color: 'purple' },
      { name: 'Ruby', percentage: 75, color: 'purple' }
    ]
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Available colors for skill circles
  const availableColors = [
    { value: 'purple', label: 'Purple', gradient: 'from-purple-500 to-purple-400' },
    { value: 'orange', label: 'Orange', gradient: 'from-orange-500 to-orange-400' },
    { value: 'blue', label: 'Blue', gradient: 'from-blue-500 to-blue-400' },
    { value: 'pink', label: 'Pink', gradient: 'from-pink-500 to-pink-400' },
    { value: 'green', label: 'Green', gradient: 'from-green-500 to-green-400' },
    { value: 'teal', label: 'Teal', gradient: 'from-teal-500 to-teal-400' }
  ];

  // Load data from Firebase on component mount
  useEffect(() => {
    loadSkillsData();
  }, []);

  // Load skills data from Firebase
  const loadSkillsData = async () => {
    try {
      setLoading(true);
      const skillsRef = doc(db, 'Resume', 'Skills');
      const skillsSnap = await getDoc(skillsRef);
      
      if (skillsSnap.exists()) {
        const data = skillsSnap.data();
        setSkillsContent(prev => ({
          ...prev,
          ...data,
          skills: data.skills || prev.skills
        }));
        console.log('Skills data loaded from Firebase');
      } else {
        console.log('No skills data found, using defaults');
      }
    } catch (error) {
      console.error('Error loading skills data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save skills data to Firebase
  const saveSkillsData = async () => {
    try {
      setSaving(true);
      
      // Prepare data for Firebase
      const dataToSave = {
        ...skillsContent,
        updatedAt: new Date().toISOString()
      };

      // Save to Firestore
      const skillsRef = doc(db, 'Resume', 'Skills');
      await setDoc(skillsRef, dataToSave, { merge: true });
      
      console.log('Skills data saved to Firebase');
      alert('Skills section saved successfully!');
      
    } catch (error) {
      console.error('Error saving skills data:', error);
      alert('Error saving skills section: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Handler for input changes
  const handleInputChange = (field, value) => {
    setSkillsContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler for skill changes
  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...skillsContent.skills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      [field]: value
    };
    setSkillsContent(prev => ({
      ...prev,
      skills: updatedSkills
    }));
  };

  // Add new skill
  const addSkill = () => {
    if (skillsContent.skills.length < 12) {
      setSkillsContent(prev => ({
        ...prev,
        skills: [...prev.skills, { 
          name: "New Skill", 
          percentage: 50,
          color: "purple"
        }]
      }));
    } else {
      alert('Maximum 12 skills allowed');
    }
  };

  // Remove skill
  const removeSkill = (index) => {
    if (skillsContent.skills.length > 1) {
      const updatedSkills = skillsContent.skills.filter((_, i) => i !== index);
      setSkillsContent(prev => ({
        ...prev,
        skills: updatedSkills
      }));
    } else {
      alert('At least one skill is required');
    }
  };

  // Move skill up
  const moveSkillUp = (index) => {
    if (index > 0) {
      const updatedSkills = [...skillsContent.skills];
      [updatedSkills[index], updatedSkills[index - 1]] = [updatedSkills[index - 1], updatedSkills[index]];
      setSkillsContent(prev => ({
        ...prev,
        skills: updatedSkills
      }));
    }
  };

  // Move skill down
  const moveSkillDown = (index) => {
    if (index < skillsContent.skills.length - 1) {
      const updatedSkills = [...skillsContent.skills];
      [updatedSkills[index], updatedSkills[index + 1]] = [updatedSkills[index + 1], updatedSkills[index]];
      setSkillsContent(prev => ({
        ...prev,
        skills: updatedSkills
      }));
    }
  };

  // Reset form
  const resetForm = () => {
    setSkillsContent({
      title: "Technical Skills",
      backgroundText: "Skills",
      mainTitle: "My Development Expertise",
      subtitle: "Here are some of my core programming languages and technical competencies",
      buttonText: "View All Skills",
      skills: [
        { name: 'PHP', percentage: 85, color: 'purple' },
        { name: 'HTML', percentage: 80, color: 'purple' },
        { name: 'CSS', percentage: 90, color: 'purple' },
        { name: 'Ruby', percentage: 75, color: 'purple' }
      ]
    });
    alert('Form reset to defaults!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-600">Loading skills data from Firebase...</p>
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
            <h2 className="text-xl font-semibold text-gray-800">Edit Skills Content</h2>
            <div className="flex gap-3">
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                Reset to Defaults
              </button>
              <button
                onClick={saveSkillsData}
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
                        value={skillsContent.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., Technical Skills"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Background Text
                      </label>
                      <input
                        type="text"
                        value={skillsContent.backgroundText}
                        onChange={(e) => handleInputChange('backgroundText', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., Skills"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Main Title
                      </label>
                      <input
                        type="text"
                        value={skillsContent.mainTitle}
                        onChange={(e) => handleInputChange('mainTitle', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., My Development Expertise"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subtitle
                      </label>
                      <textarea
                        value={skillsContent.subtitle}
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
                        value={skillsContent.buttonText}
                        onChange={(e) => handleInputChange('buttonText', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., View All Skills"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* RIGHT SIDE - Skills Management (takes ~60% on large screens) */}
            <div className="xl:w-3/5 w-full">
              <div className="bg-gray-50 rounded-lg p-5">
                <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                  <h3 className="text-md font-semibold text-gray-800">
                    Skills List ({skillsContent.skills.length} / 12)
                  </h3>
                  <button
                    onClick={addSkill}
                    className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Skill
                  </button>
                </div>
                
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {skillsContent.skills.map((skill, index) => (
                    <div key={index} className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded-full text-sm">
                            #{index + 1}
                          </span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => moveSkillUp(index)}
                              disabled={index === 0}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 transition-colors"
                              title="Move Up"
                            >
                              ↑
                            </button>
                            <button
                              onClick={() => moveSkillDown(index)}
                              disabled={index === skillsContent.skills.length - 1}
                              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 transition-colors"
                              title="Move Down"
                            >
                              ↓
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeSkill(index)}
                          className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Remove
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Left column - Skill details */}
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Skill Name
                            </label>
                            <input
                              type="text"
                              value={skill.name}
                              onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              placeholder="e.g., JavaScript, React, Python"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Proficiency: {skill.percentage}%
                            </label>
                            <div className="flex items-center gap-4">
                              <input
                                type="range"
                                value={skill.percentage}
                                onChange={(e) => handleSkillChange(index, 'percentage', parseInt(e.target.value))}
                                min="0"
                                max="100"
                                step="1"
                                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                              />
                              <input
                                type="number"
                                value={skill.percentage}
                                onChange={(e) => handleSkillChange(index, 'percentage', parseInt(e.target.value))}
                                min="0"
                                max="100"
                                className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-center"
                              />
                            </div>
                            <div className="mt-2">
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-purple-500 transition-all duration-300 rounded-full"
                                  style={{ width: `${skill.percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Circle Color
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {availableColors.map((color) => (
                                <button
                                  key={color.value}
                                  type="button"
                                  onClick={() => handleSkillChange(index, 'color', color.value)}
                                  className={`w-10 h-10 rounded-full transition-all duration-200 ${
                                    skill.color === color.value
                                      ? 'ring-4 ring-offset-2 ring-purple-500 scale-110'
                                      : 'hover:scale-105'
                                  }`}
                                  style={{
                                    background: `linear-gradient(135deg, ${color.value === 'purple' ? '#8b5cf6' : 
                                      color.value === 'orange' ? '#f97316' :
                                      color.value === 'blue' ? '#3b82f6' :
                                      color.value === 'pink' ? '#ec4899' :
                                      color.value === 'green' ? '#10b981' : '#14b8a6'}, 
                                      ${color.value === 'purple' ? '#a78bfa' :
                                      color.value === 'orange' ? '#fb923c' :
                                      color.value === 'blue' ? '#60a5fa' :
                                      color.value === 'pink' ? '#f472b6' :
                                      color.value === 'green' ? '#34d399' : '#2dd4bf'})`
                                  }}
                                  title={color.label}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Right column - Live Preview */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-xs text-gray-500 mb-3">Live Preview</p>
                            <div className="relative w-28 h-28 mx-auto">
                              <svg width="112" height="112" className="transform -rotate-90">
                                <circle
                                  cx="56"
                                  cy="56"
                                  r="46"
                                  stroke="#e5e7eb"
                                  strokeWidth="8"
                                  fill="none"
                                />
                                <circle
                                  cx="56"
                                  cy="56"
                                  r="46"
                                  stroke={skill.color === 'purple' ? '#8b5cf6' :
                                          skill.color === 'orange' ? '#f97316' :
                                          skill.color === 'blue' ? '#3b82f6' :
                                          skill.color === 'pink' ? '#ec4899' :
                                          skill.color === 'green' ? '#10b981' : '#14b8a6'}
                                  strokeWidth="8"
                                  fill="none"
                                  strokeDasharray={2 * Math.PI * 46}
                                  strokeDashoffset={2 * Math.PI * 46 * (1 - skill.percentage / 100)}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xl font-bold text-gray-800">{skill.percentage}%</span>
                                <span className="text-xs text-gray-500 mt-1 max-w-[80px] truncate">{skill.name}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {skillsContent.skills.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <p className="mt-4 text-gray-500">No skills added yet. Click "Add Skill" to get started.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default SkillsInput;