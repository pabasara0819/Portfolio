// components/Services.jsx (Updated to fetch from Firebase - structure unchanged)
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const Services = () => {
  const [servicesData, setServicesData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const defaultServices = [
    {
      title: 'UI/UX Design',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      iconType: 'monitor'
    },
    {
      title: 'Application Design',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      iconType: 'cube'
    },
    {
      title: 'Website Design',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      iconType: 'globe'
    },
    {
      title: 'UI/UX Design',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      iconType: 'monitor'
    },
    {
      title: 'Application Design',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      iconType: 'cube'
    },
    {
      title: 'Website Design',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      iconType: 'globe'
    }
  ];

  // Load services data from Firebase
  useEffect(() => {
    loadServicesData();
  }, []);

  const loadServicesData = async () => {
    try {
      setLoading(true);
      const servicesRef = doc(db, 'Resume', 'Services');
      const servicesSnap = await getDoc(servicesRef);
      
      if (servicesSnap.exists()) {
        const data = servicesSnap.data();
        setServicesData(data);
        console.log('Services data loaded from Firebase');
      } else {
        setServicesData({
          title: "Services",
          mainTitle: "Services I Provide",
          subtitle: "Have a project in mind? I'd love to hear about it. Let's create something amazing together.",
          buttonText: "Learn more",
          services: defaultServices
        });
      }
    } catch (error) {
      console.error('Error loading services data:', error);
      setServicesData({
        title: "Services",
        mainTitle: "Services I Provide",
        subtitle: "Have a project in mind? I'd love to hear about it. Let's create something amazing together.",
        buttonText: "Learn more",
        services: defaultServices
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get icon SVG by type
  const getIconSvg = (iconType, className = "w-12 h-12 text-purple-600") => {
    switch(iconType) {
      case 'monitor':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'cube':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case 'globe':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4-3-9s1.34-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
        );
      default:
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
    }
  };

  const services = servicesData?.services || defaultServices;
  const buttonText = servicesData?.buttonText || "Learn more";

  if (loading) {
    return (
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider bg-purple-100 px-4 py-1 rounded-full inline-block">
            {servicesData?.title || "Services"}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-4 mb-4">
            {servicesData?.mainTitle || "Services I Provide"}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {servicesData?.subtitle || "Have a project in mind? I'd love to hear about it. Let's create something amazing together."}
          </p>
        </div>

        {/* Services Grid - Minimized width, Maximized height */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 border-2 border-purple-600 shadow-md hover:shadow-lg transition-all duration-300 group hover:-translate-y-2 cursor-pointer relative overflow-hidden flex flex-col h-auto"
            >
              {/* Icon */}
              <div className="mb-4 transition-all duration-300 flex justify-center">
                {getIconSvg(service.iconType, "w-12 h-12 text-purple-600")}
              </div>
              
              {/* Title with hover effect */}
              <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-purple-600 transition-colors duration-300 text-center">
                {service.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 leading-relaxed text-center transition-colors duration-300 flex-grow text-sm">
                {service.description}
              </p>
              
              {/* Learn More Link */}
              <a
                href="#"
                className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700 hover:underline mt-6 justify-center"
              >
                {buttonText}
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;