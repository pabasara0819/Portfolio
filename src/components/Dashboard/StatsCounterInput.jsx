// components/StatsCounterInput.jsx (Admin Panel for Editing Stats Counter)
import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const StatsCounterInput = () => {
  // State for stats counter content
  const [statsContent, setStatsContent] = useState({
    title: "Stats",
    backgroundText: "Achievements",
    mainTitle: "Our Achievements",
    subtitle: "Numbers that speak for themselves",
    stats: [
      { id: 1, end: 18, label: "Years of Experience", suffix: "+", prefix: "" },
      { id: 2, end: 150, label: "Projects Completed", suffix: "+", prefix: "" },
      { id: 3, end: 95, label: "Happy Clients", suffix: "%", prefix: "" },
      { id: 4, end: 25, label: "Awards Won", suffix: "", prefix: "" }
    ],
    animation: {
      duration: 2000,
      threshold: 0.3
    },
    snowEffect: {
      enabled: true,
      dotCount: 100,
      minSize: 6,
      maxSize: 14,
      minDuration: 4,
      maxDuration: 12
    }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load data from Firebase on component mount
  useEffect(() => {
    loadStatsData();
  }, []);

  // Load stats data from Firebase
  const loadStatsData = async () => {
    try {
      setLoading(true);
      const statsRef = doc(db, 'Resume', 'Stats');
      const statsSnap = await getDoc(statsRef);
      
      if (statsSnap.exists()) {
        const data = statsSnap.data();
        setStatsContent(prev => ({
          ...prev,
          ...data,
          stats: data.stats || prev.stats,
          animation: { ...prev.animation, ...data.animation },
          snowEffect: { ...prev.snowEffect, ...data.snowEffect }
        }));
        console.log('Stats data loaded from Firebase');
      } else {
        console.log('No stats data found, using defaults');
      }
    } catch (error) {
      console.error('Error loading stats data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save stats data to Firebase
  const saveStatsData = async () => {
    try {
      setSaving(true);
      
      // Prepare data for Firebase
      const dataToSave = {
        ...statsContent,
        updatedAt: new Date().toISOString()
      };

      // Save to Firestore
      const statsRef = doc(db, 'Resume', 'Stats');
      await setDoc(statsRef, dataToSave, { merge: true });
      
      console.log('Stats data saved to Firebase');
      alert('Stats counter section saved successfully!');
      
    } catch (error) {
      console.error('Error saving stats data:', error);
      alert('Error saving stats section: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  // Handler for input changes
  const handleInputChange = (field, value) => {
    setStatsContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler for animation changes
  const handleAnimationChange = (field, value) => {
    setStatsContent(prev => ({
      ...prev,
      animation: {
        ...prev.animation,
        [field]: value
      }
    }));
  };

  // Handler for snow effect changes
  const handleSnowEffectChange = (field, value) => {
    setStatsContent(prev => ({
      ...prev,
      snowEffect: {
        ...prev.snowEffect,
        [field]: value
      }
    }));
  };

  // Handler for stat changes
  const handleStatChange = (statId, field, value) => {
    const updatedStats = statsContent.stats.map(stat =>
      stat.id === statId
        ? { ...stat, [field]: field === 'end' ? parseInt(value) || 0 : value }
        : stat
    );
    setStatsContent(prev => ({
      ...prev,
      stats: updatedStats
    }));
  };

  // Add new stat
  const addStat = () => {
    if (statsContent.stats.length < 8) {
      const newId = Math.max(...statsContent.stats.map(s => s.id), 0) + 1;
      setStatsContent(prev => ({
        ...prev,
        stats: [...prev.stats, { 
          id: newId,
          end: 50,
          label: "New Stat",
          suffix: "+",
          prefix: ""
        }]
      }));
    } else {
      alert('Maximum 8 stats allowed');
    }
  };

  // Remove stat
  const removeStat = (statId) => {
    if (statsContent.stats.length > 1) {
      const updatedStats = statsContent.stats.filter(stat => stat.id !== statId);
      setStatsContent(prev => ({
        ...prev,
        stats: updatedStats
      }));
    } else {
      alert('At least one stat is required');
    }
  };

  // Move stat up
  const moveStatUp = (index) => {
    if (index > 0) {
      const updatedStats = [...statsContent.stats];
      [updatedStats[index], updatedStats[index - 1]] = [updatedStats[index - 1], updatedStats[index]];
      setStatsContent(prev => ({
        ...prev,
        stats: updatedStats
      }));
    }
  };

  // Move stat down
  const moveStatDown = (index) => {
    if (index < statsContent.stats.length - 1) {
      const updatedStats = [...statsContent.stats];
      [updatedStats[index], updatedStats[index + 1]] = [updatedStats[index + 1], updatedStats[index]];
      setStatsContent(prev => ({
        ...prev,
        stats: updatedStats
      }));
    }
  };

  // Reset form
  const resetForm = () => {
    setStatsContent({
      title: "Stats",
      backgroundText: "Achievements",
      mainTitle: "Our Achievements",
      subtitle: "Numbers that speak for themselves",
      stats: [
        { id: 1, end: 18, label: "Years of Experience", suffix: "+", prefix: "" },
        { id: 2, end: 150, label: "Projects Completed", suffix: "+", prefix: "" },
        { id: 3, end: 95, label: "Happy Clients", suffix: "%", prefix: "" },
        { id: 4, end: 25, label: "Awards Won", suffix: "", prefix: "" }
      ],
      animation: {
        duration: 2000,
        threshold: 0.3
      },
      snowEffect: {
        enabled: true,
        dotCount: 100,
        minSize: 6,
        maxSize: 14,
        minDuration: 4,
        maxDuration: 12
      }
    });
    alert('Form reset to defaults!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-600">Loading stats data from Firebase...</p>
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
            <h2 className="text-xl font-semibold text-gray-800">Edit Stats Counter Content</h2>
            <div className="flex gap-3">
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
              >
                Reset to Defaults
              </button>
              <button
                onClick={saveStatsData}
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
            {/* LEFT SIDE - Header and Stats Management (takes ~60% on large screens) */}
            <div className="xl:w-3/5 w-full">
              <div className="space-y-6">
                {/* Header Inputs Section */}
                <div className="bg-gray-50 rounded-lg p-5">
                  <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Section Header Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title Badge Text
                      </label>
                      <input
                        type="text"
                        value={statsContent.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., Stats"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Background Text
                      </label>
                      <input
                        type="text"
                        value={statsContent.backgroundText}
                        onChange={(e) => handleInputChange('backgroundText', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., Achievements"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Main Title
                      </label>
                      <input
                        type="text"
                        value={statsContent.mainTitle}
                        onChange={(e) => handleInputChange('mainTitle', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="e.g., Our Achievements"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subtitle
                      </label>
                      <textarea
                        value={statsContent.subtitle}
                        onChange={(e) => handleInputChange('subtitle', e.target.value)}
                        rows="2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Enter subtitle description"
                      />
                    </div>
                  </div>
                </div>

                {/* Stats Management */}
                <div className="bg-gray-50 rounded-lg p-5">
                  <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                    <h3 className="text-md font-semibold text-gray-800">
                      Statistics List ({statsContent.stats.length} / 8)
                    </h3>
                    <button
                      onClick={addStat}
                      className="px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Stat
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                    {statsContent.stats.map((stat, index) => (
                      <div key={stat.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded-full text-xs">
                              #{index + 1}
                            </span>
                            <div className="flex gap-1">
                              <button
                                onClick={() => moveStatUp(index)}
                                disabled={index === 0}
                                className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 transition-colors"
                                title="Move Up"
                              >
                                ↑
                              </button>
                              <button
                                onClick={() => moveStatDown(index)}
                                disabled={index === statsContent.stats.length - 1}
                                className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50 transition-colors"
                                title="Move Down"
                              >
                                ↓
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={() => removeStat(stat.id)}
                            className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Value (Number)
                            </label>
                            <input
                              type="number"
                              value={stat.end}
                              onChange={(e) => handleStatChange(stat.id, 'end', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              placeholder="e.g., 150"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Label
                            </label>
                            <input
                              type="text"
                              value={stat.label}
                              onChange={(e) => handleStatChange(stat.id, 'label', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                              placeholder="e.g., Projects Completed"
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Prefix (Optional)
                              </label>
                              <input
                                type="text"
                                value={stat.prefix}
                                onChange={(e) => handleStatChange(stat.id, 'prefix', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="e.g., $"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Suffix (Optional)
                              </label>
                              <input
                                type="text"
                                value={stat.suffix}
                                onChange={(e) => handleStatChange(stat.id, 'suffix', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                placeholder="e.g., +, %, K"
                              />
                            </div>
                          </div>
                          
                          {/* Live Preview */}
                          <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                            <p className="text-xs text-purple-600 mb-2 font-medium">Live Preview:</p>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600">
                                {stat.prefix}{stat.end}{stat.suffix}
                              </div>
                              <div className="text-gray-600 text-sm">{stat.label}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {statsContent.stats.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
                      <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p className="mt-4 text-gray-500">No statistics added yet. Click "Add Stat" to get started.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* RIGHT SIDE - Animation & Snow Effect Settings (takes ~40% on large screens) */}
            <div className="xl:w-2/5 w-full">
              <div className="space-y-6">
                {/* Animation Settings */}
                <div className="bg-gray-50 rounded-lg p-5">
                  <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Animation Settings
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Animation Duration (ms)
                      </label>
                      <input
                        type="number"
                        value={statsContent.animation.duration}
                        onChange={(e) => handleAnimationChange('duration', parseInt(e.target.value))}
                        min="500"
                        max="5000"
                        step="100"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Time taken for counter animation (500-5000ms)</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Visibility Threshold
                      </label>
                      <input
                        type="number"
                        value={statsContent.animation.threshold}
                        onChange={(e) => handleAnimationChange('threshold', parseFloat(e.target.value))}
                        min="0"
                        max="1"
                        step="0.1"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">How much of the section must be visible to start animation (0-1)</p>
                    </div>
                    
                    {/* Animation Preview Indicator */}
                    <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">Animation Preview:</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Counter will count from 0 to target value</span>
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Snow Effect Settings */}
                <div className="bg-gray-50 rounded-lg p-5">
                  <h3 className="text-md font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Snow Effect Settings
                  </h3>
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={statsContent.snowEffect.enabled}
                        onChange={(e) => handleSnowEffectChange('enabled', e.target.checked)}
                        className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-gray-700">Enable Snow Effect</span>
                    </label>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Dots
                      </label>
                      <input
                        type="number"
                        value={statsContent.snowEffect.dotCount}
                        onChange={(e) => handleSnowEffectChange('dotCount', parseInt(e.target.value))}
                        min="20"
                        max="300"
                        step="10"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">More dots = more particles (performance may vary)</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Min Dot Size (px)
                        </label>
                        <input
                          type="number"
                          value={statsContent.snowEffect.minSize}
                          onChange={(e) => handleSnowEffectChange('minSize', parseInt(e.target.value))}
                          min="2"
                          max="20"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Max Dot Size (px)
                        </label>
                        <input
                          type="number"
                          value={statsContent.snowEffect.maxSize}
                          onChange={(e) => handleSnowEffectChange('maxSize', parseInt(e.target.value))}
                          min="4"
                          max="30"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Min Duration (s)
                        </label>
                        <input
                          type="number"
                          value={statsContent.snowEffect.minDuration}
                          onChange={(e) => handleSnowEffectChange('minDuration', parseFloat(e.target.value))}
                          min="2"
                          max="10"
                          step="0.5"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Max Duration (s)
                        </label>
                        <input
                          type="number"
                          value={statsContent.snowEffect.maxDuration}
                          onChange={(e) => handleSnowEffectChange('maxDuration', parseFloat(e.target.value))}
                          min="4"
                          max="20"
                          step="0.5"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        />
                      </div>
                    </div>
                    
                    {/* Snow Effect Preview */}
                    <div className="mt-4 p-3 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden relative min-h-[100px]">
                      <p className="text-xs text-white/70 mb-2">Snow Effect Preview:</p>
                      <div className="relative h-16">
                        {[...Array(12)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute bg-white rounded-full opacity-70 animate-pulse"
                            style={{
                              width: `${Math.random() * (statsContent.snowEffect.maxSize - statsContent.snowEffect.minSize) + statsContent.snowEffect.minSize}px`,
                              height: `${Math.random() * (statsContent.snowEffect.maxSize - statsContent.snowEffect.minSize) + statsContent.snowEffect.minSize}px`,
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                              animationDuration: `${Math.random() * (statsContent.snowEffect.maxDuration - statsContent.snowEffect.minDuration) + statsContent.snowEffect.minDuration}s`
                            }}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-white/50 text-center mt-2">Floating particles animation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
};

export default StatsCounterInput;