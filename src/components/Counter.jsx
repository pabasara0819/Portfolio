// components/Counter.jsx (Updated to fetch from Firebase - structure unchanged)
import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const Counter = ({ end, duration = 2000, label, suffix = '', prefix = '', icon }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    // Intersection Observer to start counter when visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime = null;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);
      
      setCount(currentCount);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isVisible, end, duration]);

  return (
    <div ref={counterRef} className="flex items-center justify-center gap-4 group">
      {/* Content - Centered */}
      <div className="text-center">
        <div className="text-4xl md:text-6xl font-bold text-purple-600">
          {prefix}{count}{suffix}
        </div>
        {label && <div className="text-gray-600 text-lg md:text-base">{label}</div>}
      </div>
    </div>
  );
};

// White Dot Snowflake component
const SnowDot = ({ left, delay, duration, size }) => {
  return (
    <div
      className="fixed pointer-events-none rounded-full animate-snow"
      style={{
        left: `${left}%`,
        top: '-10px',
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: 'white',
        position: 'absolute',
        boxShadow: '0 0 4px rgba(255,255,255,0.8)',
      }}
    />
  );
};

// Stats Counter Component with White Dot Snowing Effect
const StatsCounter = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const defaultStats = [
    { end: 18, label: "Years of Experience", suffix: "+", prefix: "" },
    { end: 150, label: "Projects Completed", suffix: "+", prefix: "" },
    { end: 95, label: "Happy Clients", suffix: "%", prefix: "" },
    { end: 25, label: "Awards Won", suffix: "", prefix: "" }
  ];

  const defaultSnowConfig = {
    enabled: true,
    dotCount: 100,
    minSize: 6,
    maxSize: 14,
    minDuration: 4,
    maxDuration: 12
  };

  // Load stats data from Firebase
  useEffect(() => {
    loadStatsData();
  }, []);

  const loadStatsData = async () => {
    try {
      setLoading(true);
      const statsRef = doc(db, 'Resume', 'Stats');
      const statsSnap = await getDoc(statsRef);
      
      if (statsSnap.exists()) {
        const data = statsSnap.data();
        setStatsData(data);
        console.log('Stats data loaded from Firebase');
      } else {
        setStatsData({
          title: "Stats",
          mainTitle: "Our Achievements",
          subtitle: "Numbers that speak for themselves",
          stats: defaultStats,
          animation: { duration: 2000, threshold: 0.3 },
          snowEffect: defaultSnowConfig
        });
      }
    } catch (error) {
      console.error('Error loading stats data:', error);
      setStatsData({
        title: "Stats",
        mainTitle: "Our Achievements",
        subtitle: "Numbers that speak for themselves",
        stats: defaultStats,
        animation: { duration: 2000, threshold: 0.3 },
        snowEffect: defaultSnowConfig
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = statsData?.stats || defaultStats;
  const snowConfig = statsData?.snowEffect || defaultSnowConfig;
  const animationDuration = statsData?.animation?.duration || 2000;

  // Generate random white dots
  const snowDots = [];
  if (snowConfig.enabled) {
    for (let i = 0; i < snowConfig.dotCount; i++) {
      snowDots.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 15,
        duration: snowConfig.minDuration + Math.random() * (snowConfig.maxDuration - snowConfig.minDuration),
        size: snowConfig.minSize + Math.random() * (snowConfig.maxSize - snowConfig.minSize),
      });
    }
  }

  if (loading) {
    return (
      <div className="relative bg-gradient-to-r from-purple-50 to-purple-100 py-12 px-6 rounded-2xl overflow-hidden">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-2 text-gray-600">Loading stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-r from-purple-50 to-purple-100 py-12 px-6 rounded-2xl overflow-hidden">
      {/* White Dot Snowing Effect */}
      {snowConfig.enabled && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {snowDots.map((dot) => (
            <SnowDot
              key={dot.id}
              left={dot.left}
              delay={dot.delay}
              duration={dot.duration}
              size={dot.size}
            />
          ))}
        </div>
      )}
      
      
      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Counter
              key={index}
              end={stat.end}
              label={stat.label}
              suffix={stat.suffix || ''}
              prefix={stat.prefix || ''}
              duration={animationDuration}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes snow {
          0% {
            transform: translateY(-80px) translateX(0px);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) translateX(80px);
            opacity: 0;
          }
        }
        .animate-snow {
          animation: snow linear infinite;
        }
      `}</style>
    </div>
  );
};

export { Counter, StatsCounter };
export default StatsCounter;