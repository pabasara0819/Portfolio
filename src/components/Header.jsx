// components/Header.jsx
import { useState, useEffect } from 'react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navLinks = [
    { name: 'Home', href: 'home', section: 'home' },
    { name: 'Skills', href: 'skill', section: 'skills' },
    { name: 'Services', href: 'services', section: 'services' },
    { name: 'Portfolio', href: 'portfolio', section: 'portfolio' },
    { name: 'Testimonials', href: 'testimonials', section: 'testimonials' },
    { name: 'Contact Us', href: 'contact', section: 'contact' },
  ];

  // Scroll spy logic to detect which section is currently visible
  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map(link => link.section);
      
      // Find the current section based on scroll position
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          const offset = 150; // Offset for header height
          
          // Check if section is in viewport
          if (rect.top <= offset && rect.bottom >= offset) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    // Call once to set initial active section
    handleScroll();
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (sectionId, e) => {
    e.preventDefault();
    
    // Find the element by ID
    const element = document.getElementById(sectionId);
    
    if (element) {
      // Smooth scroll to the element
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // Update active section immediately
      setActiveSection(sectionId);
    }
    
    // Close mobile menu if open
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-18 md:px-26 py-4">
        <div className="flex items-center justify-between">
          
          {/* Desktop Navigation - Left side */}
          <nav className="hidden md:flex space-x-12 flex-1 justify-start">
            {navLinks.slice(0, 3).map((link) => (
              <a
                key={link.name}
                href={`#${link.href}`}
                onClick={(e) => handleNavigation(link.section, e)}
                className={`font-medium transition duration-300 cursor-pointer relative ${
                  activeSection === link.section
                    ? 'text-purple-600 font-semibold'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                {link.name}
                {activeSection === link.section && (
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-purple-600 rounded-full"></span>
                )}
              </a>
            ))}
          </nav>

          {/* Logo/Brand - Centered with Rounded Background */}
          <div className="flex-shrink-0">
            <a 
              href="#home" 
              onClick={(e) => handleNavigation('hero', e)}
              className="flex items-center justify-center group"
            >
              {/* Rounded background with gradient */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-full p-2 shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                {/* Icon inside rounded bg */}
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
              {/* Jenny text */}
              <span className="ml-2 text-2xl font-bold text-purple-600 group-hover:text-purple-700 transition duration-300">
                Jenny
              </span>
            </a>
          </div>

          {/* Desktop Navigation - Right side */}
          <nav className="hidden md:flex space-x-12 flex-1 justify-end">
            {navLinks.slice(3).map((link) => (
              <a
                key={link.name}
                href={`#${link.href}`}
                onClick={(e) => handleNavigation(link.section, e)}
                className={`font-medium transition duration-300 cursor-pointer relative ${
                  activeSection === link.section
                    ? 'text-purple-600 font-semibold'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                {link.name}
                {activeSection === link.section && (
                  <span className="absolute -bottom-1 left-0 w-full h-1 bg-purple-600 rounded-full"></span>
                )}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-600 focus:outline-none ml-auto"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-3">
            {/* Show logo first in mobile menu */}
            <div className="text-center py-2 mb-2">
              <a 
                href="#home" 
                onClick={(e) => handleNavigation('hero', e)}
                className="flex items-center justify-center"
              >
                {/* Rounded background with gradient for mobile */}
                <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-full p-2 shadow-md">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
                <span className="ml-2 text-2xl font-bold text-purple-600">
                  Jenny
                </span>
              </a>
            </div>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={`#${link.href}`}
                onClick={(e) => handleNavigation(link.section, e)}
                className={`block font-medium transition duration-300 py-2 text-center cursor-pointer ${
                  activeSection === link.section
                    ? 'text-purple-600 font-semibold'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;