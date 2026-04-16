// components/Portfolio.jsx (Updated to fetch from Firebase - structure unchanged)
import React, { useState, useEffect } from 'react';
// import { db } from '../../firebase/config';
// import { doc, getDoc } from 'firebase/firestore';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const defaultFilters = ['All', 'UI/UX', 'Website Design', 'App Design', 'Graphic Design'];
  
  const defaultProjects = [
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
  ];

  // Load portfolio data from Firebase
  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    try {
      setLoading(true);
      const portfolioRef = doc(db, 'Resume', 'Portfolio');
      const portfolioSnap = await getDoc(portfolioRef);
      
      if (portfolioSnap.exists()) {
        const data = portfolioSnap.data();
        setPortfolioData(data);
        console.log('Portfolio data loaded from Firebase');
      } else {
        setPortfolioData({
          filterButtonText: "Get In Touch",
          mainTitle: "My Portfolio",
          subtitle: "Explore a collection of my UI/UX design projects, each crafted to deliver seamless, user-centered experiences.",
          buttonText: "View More Projects",
          filters: defaultFilters.slice(1),
          projects: defaultProjects
        });
      }
    } catch (error) {
      console.error('Error loading portfolio data:', error);
      setPortfolioData({
        filterButtonText: "Get In Touch",
        mainTitle: "My Portfolio",
        subtitle: "Explore a collection of my UI/UX design projects, each crafted to deliver seamless, user-centered experiences.",
        buttonText: "View More Projects",
        filters: defaultFilters.slice(1),
        projects: defaultProjects
      });
    } finally {
      setLoading(false);
    }
  };

  const filters = portfolioData ? ['All', ...portfolioData.filters] : defaultFilters;
  const projects = portfolioData ? portfolioData.projects : defaultProjects;
  const filteredProjects = activeFilter === 'All' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-600">Loading portfolio...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider bg-purple-100 px-4 py-1 rounded-full inline-block">
            {portfolioData?.filterButtonText || "Get In Touch"}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-4 mb-4">
            {portfolioData?.mainTitle || "My Portfolio"}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            {portfolioData?.subtitle || "Explore a collection of my UI/UX design projects, each crafted to deliver seamless, user-centered experiences."}
          </p>
          
          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  activeFilter === filter
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300"
            >
              {/* Project Image */}
              <div className="relative overflow-hidden h-54">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                  }}
                />
                <div className="absolute inset-0 bg-black/40 bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button className="bg-white text-purple-600 px-4 py-2 rounded-full font-semibold hover:bg-purple-600 hover:text-white transition-colors duration-300">
                    View Project
                  </button>
                </div>
              </div>
              
              {/* Project Info */}
              <div className="p-6">
                <div className="mb-2">
                  <span className="text-sm text-purple-600 font-semibold">
                    {project.tags[0]}
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
            {portfolioData?.buttonText || "View More Projects"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;