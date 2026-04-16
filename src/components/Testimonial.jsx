// components/Testimonial.jsx (Updated to fetch from Firebase - structure unchanged)
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const Testimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonialData, setTestimonialData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const defaultTestimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      position: 'CEO',
      company: 'TechStart',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
      rating: 5,
      text: 'Absolutely outstanding work! The attention to detail and creative vision brought our project to life. Could not be happier with the results.',
    },
    {
      id: 2,
      name: 'Michael Chen',
      position: 'Product Manager',
      company: 'InnovateLab',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
      rating: 5,
      text: 'Working with this team was a game-changer for our business. They delivered beyond expectations and exceeded every deadline.',
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      position: 'Creative Director',
      company: 'DesignHub',
      image: 'https://randomuser.me/api/portraits/women/3.jpg',
      rating: 5,
      text: 'Professional, creative, and incredibly talented. The designs were modern, user-friendly, and exactly what we needed.',
    },
    {
      id: 4,
      name: 'David Kim',
      position: 'Founder',
      company: 'StartupStudio',
      image: 'https://randomuser.me/api/portraits/men/4.jpg',
      rating: 5,
      text: 'One of the best designers I have ever worked with. Exceptional communication and delivered high-quality work on time.',
    },
    {
      id: 5,
      name: 'Lisa Wong',
      position: 'Marketing Director',
      company: 'BrandBoost',
      image: 'https://randomuser.me/api/portraits/women/5.jpg',
      rating: 5,
      text: 'Incredible design sense and great attention to user experience. Highly recommended for any design project.',
    },
    {
      id: 6,
      name: 'James Wilson',
      position: 'CTO',
      company: 'TechFlow',
      image: 'https://randomuser.me/api/portraits/men/6.jpg',
      rating: 5,
      text: 'A true professional who understands both design and business needs. The results speak for themselves.',
    },
  ];

  // Load testimonial data from Firebase
  useEffect(() => {
    loadTestimonialData();
  }, []);

  const loadTestimonialData = async () => {
    try {
      setLoading(true);
      const testimonialRef = doc(db, 'Resume', 'Testimonial');
      const testimonialSnap = await getDoc(testimonialRef);
      
      if (testimonialSnap.exists()) {
        const data = testimonialSnap.data();
        setTestimonialData(data);
        console.log('Testimonial data loaded from Firebase');
      } else {
        setTestimonialData({
          title: "Testimonials",
          mainTitle: "What People Say",
          subtitle: "Real feedback from real clients who trusted me with their projects",
          testimonials: defaultTestimonials
        });
      }
    } catch (error) {
      console.error('Error loading testimonial data:', error);
      setTestimonialData({
        title: "Testimonials",
        mainTitle: "What People Say",
        subtitle: "Real feedback from real clients who trusted me with their projects",
        testimonials: defaultTestimonials
      });
    } finally {
      setLoading(false);
    }
  };

  const testimonials = testimonialData?.testimonials || defaultTestimonials;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % (testimonials.length - 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + (testimonials.length - 2)) % (testimonials.length - 2));
  };

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex justify-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <section id="testimonial" className="py-20 bg-gradient-to-r from-purple-50 to-purple-100 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-600">Loading testimonials...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonial" className="py-20 bg-gradient-to-r from-purple-50 to-purple-100 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-100 rounded-full filter blur-3xl opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-100 rounded-full filter blur-3xl opacity-40"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider bg-purple-100 px-4 py-1 rounded-full inline-block">
            {testimonialData?.title || "Testimonials"}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-4 mb-4">
            {testimonialData?.mainTitle || "What People Say"}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {testimonialData?.subtitle || "Real feedback from real clients who trusted me with their projects"}
          </p>
        </div>

        {/* 3 Testimonials Grid */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-4 z-20 p-3 rounded-full bg-white shadow-lg hover:shadow-xl hover:bg-purple-50 transition-all duration-300 group"
          >
            <svg className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-4 z-20 p-3 rounded-full bg-white shadow-lg hover:shadow-xl hover:bg-purple-50 transition-all duration-300 group"
          >
            <svg className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Cards Container */}
          <div className="overflow-hidden p-6">
            <div 
              className="flex transition-transform duration-500 ease-out gap-6"
              style={{ transform: `translateX(-${currentIndex * 33.333}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="min-w-[calc(33.333%-16px)] bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Quote Icon */}
                  <div className="flex justify-center mb-4">
                    <svg className="w-10 h-10 text-purple-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>
                  
                  {/* Stars Rating */}
                  {renderStars(testimonial.rating)}
                  
                  {/* Testimonial Text */}
                  <p className="text-gray-700 text-sm md:text-base text-center mb-6 leading-relaxed line-clamp-4">
                    "{testimonial.text}"
                  </p>
                  
                  {/* Client Info */}
                  <div className="text-center pt-4 border-t border-gray-100">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full mx-auto mb-3 border-2 border-purple-300 shadow-md object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${testimonial.name.replace(' ', '+')}&background=8b5cf6&color=fff&bold=true&size=128`;
                      }}
                    />
                    <h4 className="text-base font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-purple-600 text-sm font-medium">{testimonial.position}</p>
                    <p className="text-gray-500 text-xs">{testimonial.company}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-3">
            {[...Array(Math.ceil(testimonials.length / 1))].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 ${
                  Math.floor(currentIndex) === idx
                    ? 'w-8 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full'
                    : 'w-2 h-2 bg-gray-300 rounded-full hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;