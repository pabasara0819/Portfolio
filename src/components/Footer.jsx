// components/Footer.jsx (Updated to fetch from Firebase - structure unchanged)
import React, { useState, useEffect } from 'react';
// import { db } from '../../firebase/config';
// import { doc, getDoc } from 'firebase/firestore';

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState(null);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);

  const currentYear = new Date().getFullYear();

  const defaultFooterData = {
    brandName: "Jenny",
    brandDescription: "Creating beautiful and functional digital experiences that make a difference. Let's bring your ideas to life.",
    copyrightText: "Jenny Portfolio. All rights reserved.",
    quickLinks: [
      { name: 'Home', href: '#' },
      { name: 'Skill', href: '#' },
      { name: 'Services', href: '#' },
      { name: 'Portfolio', href: '#' },
      { name: 'Testimonials', href: '#' },
      { name: 'Contact', href: '#' }
    ],
    services: [
      { name: 'UI/UX Design', href: '#' },
      { name: 'Web Development', href: '#' },
      { name: 'App Design', href: '#' },
      { name: 'Graphic Design', href: '#' },
      { name: 'Branding', href: '#' }
    ],
    socialLinks: [
      { name: 'Facebook', url: '#', color: 'hover:bg-blue-600', iconType: 'facebook' },
      { name: 'Twitter', url: '#', color: 'hover:bg-blue-400', iconType: 'twitter' },
      { name: 'LinkedIn', url: '#', color: 'hover:bg-blue-700', iconType: 'linkedin' },
      { name: 'GitHub', url: '#', color: 'hover:bg-gray-700', iconType: 'github' }
    ],
    newsletter: {
      title: "Newsletter",
      description: "Subscribe to get updates on latest projects and offers.",
      placeholder: "Your email address",
      buttonText: "Subscribe",
      successMessage: "Subscribed successfully! 🎉",
      errorMessage: "Please enter a valid email address."
    },
    footerLinks: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookies Policy', href: '#' }
    ],
    showBackToTop: true
  };

  // Load footer data from Firebase
  useEffect(() => {
    loadFooterData();
  }, []);

  const loadFooterData = async () => {
    try {
      setLoading(true);
      const footerRef = doc(db, 'Resume', 'Footer');
      const footerSnap = await getDoc(footerRef);
      
      if (footerSnap.exists()) {
        const data = footerSnap.data();
        setFooterData(data);
        console.log('Footer data loaded from Firebase');
      } else {
        setFooterData(defaultFooterData);
      }
    } catch (error) {
      console.error('Error loading footer data:', error);
      setFooterData(defaultFooterData);
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail || !/\S+@\S+\.\S+/.test(newsletterEmail)) {
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus(null), 3000);
      return;
    }
    
    setIsSubscribing(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Subscribed:', newsletterEmail);
      setNewsletterStatus('success');
      setNewsletterEmail('');
      setIsSubscribing(false);
      setTimeout(() => setNewsletterStatus(null), 3000);
    }, 1000);
  };

  // Helper function to get icon SVG
  const getIconSvg = (iconType, className = "w-5 h-5") => {
    switch(iconType) {
      case 'facebook':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
          </svg>
        );
      case 'twitter':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
          </svg>
        );
      case 'linkedin':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        );
      case 'github':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <footer className="bg-gray-900 text-gray-300">
        <div className="container mx-auto px-6 py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-2 text-gray-400">Loading footer...</p>
        </div>
      </footer>
    );
  }

  const data = footerData || defaultFooterData;

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">
              {data.brandName}<span className="text-purple-500">.</span>
            </h2>
            <p className="text-gray-400 mb-4 leading-relaxed">
              {data.brandDescription}
            </p>
            <div className="flex space-x-3">
              {data.socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  className={`w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 ${social.color} transition-all duration-300 hover:text-white hover:scale-110`}
                  aria-label={social.name}
                >
                  {getIconSvg(social.iconType, "w-5 h-5")}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {data.quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Services</h3>
            <ul className="space-y-2">
              {data.services.map((service, idx) => (
                <li key={idx}>
                  <a
                    href={service.href}
                    className="text-gray-400 hover:text-purple-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition-opacity">•</span>
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{data.newsletter.title}</h3>
            <p className="text-gray-400 mb-3 text-sm">
              {data.newsletter.description}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="mb-4">
              <div className="flex flex-col space-y-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={data.newsletter.placeholder}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
                >
                  {isSubscribing ? 'Subscribing...' : data.newsletter.buttonText}
                </button>
              </div>
            </form>
            {newsletterStatus === 'success' && (
              <p className="text-green-400 text-sm">{data.newsletter.successMessage}</p>
            )}
            {newsletterStatus === 'error' && (
              <p className="text-red-400 text-sm">{data.newsletter.errorMessage}</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p className="text-gray-400">
              © {currentYear} {data.copyrightText}
            </p>
            <div className="flex space-x-6 mt-2 md:mt-0">
              {data.footerLinks.map((link, idx) => (
                <a key={idx} href={link.href} className="text-gray-400 hover:text-purple-400 transition-colors">
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {data.showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 z-50"
          aria-label="Back to top"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </footer>
  );
};

export default Footer;