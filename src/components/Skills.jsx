// components/Skills.jsx (Updated to fetch from Firebase - structure unchanged)
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const SkillCircle = ({ name, percentage, color }) => {
  const [offset, setOffset] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const circleRef = useRef(null);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (circleRef.current) {
      observer.observe(circleRef.current);
    }

    return () => {
      if (circleRef.current) {
        observer.unobserve(circleRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        setOffset(circumference - (percentage / 100) * circumference);
      }, 200);
    }
  }, [isVisible, percentage, circumference]);

  const getGradientId = () => {
    return `gradient-${name.replace(/\s/g, '')}`;
  };

  const getGradientColors = () => {
    switch(color) {
      case 'purple': return { start: '#8b5cf6', end: '#a78bfa' };
      case 'orange': return { start: '#f97316', end: '#fb923c' };
      case 'blue': return { start: '#3b82f6', end: '#60a5fa' };
      case 'pink': return { start: '#ec4899', end: '#f472b6' };
      case 'green': return { start: '#10b981', end: '#34d399' };
      case 'teal': return { start: '#14b8a6', end: '#2dd4bf' };
      default: return { start: '#8b5cf6', end: '#a78bfa' };
    }
  };

  const gradientColors = getGradientColors();

  return (
    <div ref={circleRef} className="flex flex-col items-center">
      <div className="relative">
        <svg width="160" height="160" className="transform -rotate-90">
          <defs>
            <linearGradient id={getGradientId()} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradientColors.start} />
              <stop offset="100%" stopColor={gradientColors.end} />
            </linearGradient>
          </defs>
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={`url(#${getGradientId()})`}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-gray-800">{percentage}%</span>
        </div>
      </div>
      <p className="mt-3 text-gray-800 font-semibold text-lg">{name}</p>
    </div>
  );
};

const Skills = () => {
  const [skillsData, setSkillsData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const defaultSkills = [
    { name: 'PHP', percentage: 85, color: 'purple' },
    { name: 'HTML', percentage: 80, color: 'purple' },
    { name: 'CSS', percentage: 90, color: 'purple' },
    { name: 'Ruby', percentage: 75, color: 'purple' }
  ];

  // Load skills data from Firebase
  useEffect(() => {
    loadSkillsData();
  }, []);

  const loadSkillsData = async () => {
    try {
      setLoading(true);
      const skillsRef = doc(db, 'Resume', 'Skills');
      const skillsSnap = await getDoc(skillsRef);
      
      if (skillsSnap.exists()) {
        const data = skillsSnap.data();
        setSkillsData(data);
        console.log('Skills data loaded from Firebase');
      } else {
        setSkillsData({
          title: "Technical Skills",
          mainTitle: "My Development Expertise",
          subtitle: "Here are some of my core programming languages and technical competencies",
          skills: defaultSkills
        });
      }
    } catch (error) {
      console.error('Error loading skills data:', error);
      setSkillsData({
        title: "Technical Skills",
        mainTitle: "My Development Expertise",
        subtitle: "Here are some of my core programming languages and technical competencies",
        skills: defaultSkills
      });
    } finally {
      setLoading(false);
    }
  };

  const skills = skillsData?.skills || defaultSkills;

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-r from-purple-50 to-purple-100">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-600">Loading skills...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-r from-purple-50 to-purple-100">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider bg-purple-100 px-4 py-1 rounded-full inline-block">
            {skillsData?.title || "Technical Skills"}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2 mb-4">
            {skillsData?.mainTitle || "My Development Expertise"}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {skillsData?.subtitle || "Here are some of my core programming languages and technical competencies"}
          </p>
        </div>

        {/* Skills - Horizontal Row with Circle Progress */}
        <div className="flex flex-wrap justify-center items-center gap-14 md:gap-20">
          {skills.map((skill) => (
            <SkillCircle key={skill.name} {...skill} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;