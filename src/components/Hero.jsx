// components/Hero.jsx (Updated to fetch from Firebase - structure unchanged)
import { useState, useEffect } from 'react';
// import { db } from '../../firebase/config';
// import { doc, getDoc } from 'firebase/firestore';

const Hero = () => {
  const [displayText, setDisplayText] = useState('');
  const [displayProductDesigner, setDisplayProductDesigner] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const defaultHeroData = {
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
  };

  // Load hero data from Firebase
  useEffect(() => {
    loadHeroData();
  }, []);

  const loadHeroData = async () => {
    try {
      setLoading(true);
      const heroRef = doc(db, 'Resume', 'Hero');
      const heroSnap = await getDoc(heroRef);
      
      if (heroSnap.exists()) {
        const data = heroSnap.data();
        setHeroData(data);
        console.log('Hero data loaded from Firebase');
      } else {
        setHeroData(defaultHeroData);
      }
    } catch (error) {
      console.error('Error loading hero data:', error);
      setHeroData(defaultHeroData);
    } finally {
      setLoading(false);
    }
  };

  const fullText = heroData ? `${heroData.namePrefix} ${heroData.name},` : "I'm Jenny,";
  const roleText = heroData?.role || "Product Designer";
  
  useEffect(() => {
    if (!heroData) return;
    
    let index = 0;
    // First, type the name text
    const timer1 = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer1);
        
        // Then, type the role text letter by letter on second row
        let roleIndex = 0;
        const timer2 = setInterval(() => {
          if (roleIndex < roleText.length) {
            setDisplayProductDesigner(roleText.slice(0, roleIndex + 1));
            roleIndex++;
          } else {
            clearInterval(timer2);
            setIsTypingComplete(true);
          }
        }, 100);
      }
    }, 100);
    
    return () => {
      clearInterval(timer1);
    };
  }, [heroData, fullText, roleText]);

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

  // Helper function to get icon SVG
  const getIconSvg = (iconType, className = "w-6 h-6 md:w-8 md:h-8") => {
    switch(iconType) {
      case 'figma':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.5 2C6.5 2 5 3.5 5 5.5C5 7.5 6.5 9 8.5 9H12V5.5C12 3.5 10.5 2 8.5 2Z" fill="#0ACF83"/>
            <path d="M12 2V9H15.5C17.5 9 19 7.5 19 5.5C19 3.5 17.5 2 15.5 2H12Z" fill="#A259FF"/>
            <path d="M12 9V16H15.5C17.5 16 19 14.5 19 12.5C19 10.5 17.5 9 15.5 9H12Z" fill="#F24E1E"/>
            <path d="M8.5 9C6.5 9 5 10.5 5 12.5C5 14.5 6.5 16 8.5 16C10.5 16 12 14.5 12 12.5V9H8.5Z" fill="#FF7262"/>
            <path d="M5 15.5C5 17.5 6.5 19 8.5 19H12V15.5C12 13.5 10.5 12 8.5 12C6.5 12 5 13.5 5 15.5Z" fill="#1ABCFE"/>
          </svg>
        );
      case 'photoshop':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#31A8FF"/>
            <path d="M9 8h3v8H9V8z" fill="white"/>
            <path d="M13 12c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4-4-1.79-4-4z" fill="white"/>
            <path d="M13 12c0-2.21 1.79-4 4-4v8c-2.21 0-4-1.79-4-4z" fill="#001D34"/>
          </svg>
        );
      case 'xd':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#FF61F6"/>
            <path d="M8 16h8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="12" r="2" fill="white"/>
          </svg>
        );
      case 'illustrator':
        return (
          <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#FF9A00"/>
            <path d="M8 8h2v8H8V8zM14 8h2v8h-2V8z" fill="white"/>
            <circle cx="15" cy="10" r="1" fill="white"/>
          </svg>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <main className="bg-white min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-white min-h-[calc(100vh-80px)] flex items-center relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-purple-50 rounded-full opacity-50 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-pink-50 rounded-full opacity-50 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-purple-50/20 via-transparent to-pink-50/20"></div>
      
      <div className="container mx-auto px-6 py-14 md:py-14 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          
          {/* Left Column - Text Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="mb-4">
              <span className="text-purple-600 font-semibold text-lg bg-purple-100 px-4 py-1 rounded-full inline-block">{heroData?.greeting || "Hello!"}</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 leading-tight mb-4">
              {displayText}
              {displayText === fullText && !displayProductDesigner && (
                <span className="animate-pulse text-purple-600"></span>
              )}
              <br />
              {displayProductDesigner && (
                <span className="text-purple-600 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                  {displayProductDesigner}
                  {!isTypingComplete && (
                    <span className="animate-pulse text-purple-600">|</span>
                  )}
                </span>
              )}
              {!displayProductDesigner && displayText === fullText && (
                <span className="animate-pulse text-purple-600"></span>
              )}
            </h1>
            
            {/* Testimonial / Quote */}
            <div className="mt-6 mb-8 max-w-md mx-auto md:mx-0">
              <p className="text-gray-700 leading-relaxed">
                {heroData?.description || "I'm an experienced product designer with a passion for creating intuitive and beautiful user experiences. I specialize in crafting seamless interfaces that delight users and drive business success."}
              </p>
            </div>

            {/* Stats and CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6 mt-8">
              
              {/* Buttons */}
              <div className="flex gap-4">
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300">
                  {heroData?.buttonPrimaryText || "Portfolio"}
                </button>
                <button className="px-6 py-3 border-2 border-purple-600 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transform hover:scale-105 transition duration-300">
                  {heroData?.buttonSecondaryText || "Hire Me"}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Image with Circle Background and Logo Badges */}
          <div className="flex-1 flex justify-center">
            <div className="relative group">
              {/* Animated gradient ring */}
              <div className="absolute inset-0 rounded-full w-80 h-80 md:w-96 md:h-96 top-76 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 opacity-75 blur-md animate-pulse"></div>
              
              {/* Purple Circle Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full w-80 h-80 md:w-96 md:h-96 top-76 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-2xl"></div>
              
              {/* Inner circle decoration */}
              <div className="absolute inset-0 rounded-full w-72 h-72 md:w-88 md:h-88 top-76 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm"></div>
              
              {/* Image on top of circle */}
              <div className="relative z-10">
                <img 
                  src={heroData?.profileImage || "https://preview.colorlib.com/theme/jony/img/about/my_img.png"} 
                  alt={`${heroData?.name || "Jenny"} - ${heroData?.role || "Product Designer"}`}
                  className="w-60 h-auto md:w-80 rounded-full object-cover"
                />
              </div>
              
              {/* Skill Badges */}
              {(heroData?.skills || defaultHeroData.skills).map((skill, idx) => (
                <div 
                  key={idx}
                  className={`absolute ${getPositionClasses(skill.position)} z-30 bg-white rounded-2xl shadow-xl p-2 md:p-3 transform rotate-6 hover:rotate-0 hover:scale-110 transition-all duration-300 cursor-pointer`}
                >
                  <div className="flex items-center gap-2">
                    {getIconSvg(skill.iconType, "w-6 h-6 md:w-8 md:h-8")}
                    <span className="font-bold text-gray-800 text-sm md:text-base hidden sm:inline">{skill.name}</span>
                  </div>
                </div>
              ))}

              {/* Small floating dot decorations around image */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-purple-200 rounded-full opacity-60 animate-pulse z-20"></div>
              <div className="absolute bottom-16 -left-18 w-28 h-28 bg-purple-100 rounded-full opacity-40 z-20"></div>
              <div className="absolute bottom-2 -right-10 w-12 h-12 bg-pink-200 rounded-full opacity-50 z-20 animate-bounce"></div>
              <div className="absolute bottom-40 -left-20 w-16 h-16 bg-pink-200 rounded-full opacity-40 z-20"></div>
              <div className="absolute top-20 -right-15 w-4 h-4 bg-purple-400 rounded-full opacity-70 z-20"></div>
              <div className="absolute bottom-20 -left-36 w-8 h-8 bg-yellow-200 rounded-full opacity-50 z-20 animate-bounce"></div>
              <div className="absolute top-18 -right-10 w-28 h-28 bg-purple-100 rounded-full opacity-40 z-20"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Hero;