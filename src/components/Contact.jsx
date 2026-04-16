// components/Contact.jsx (Updated to fetch from Firebase - structure unchanged)
import React, { useState, useEffect } from 'react';
// import { db } from '../../firebase/config';
// import { doc, getDoc } from 'firebase/firestore';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    service: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [characterCount, setCharacterCount] = useState(0);
  const [contactData, setContactData] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultServices = [
    'UI/UX Design',
    'Web Development',
    'App Design',
    'Graphic Design',
    'Consultation',
    'Other'
  ];

  const defaultContactInfo = [
    {
      iconType: 'email',
      title: 'Email Us',
      details: 'hello@jennyportfolio.com',
      sub: 'support@jennyportfolio.com',
      action: 'mailto:hello@jennyportfolio.com'
    },
    {
      iconType: 'phone',
      title: 'Call Us',
      details: '+1 (555) 123-4567',
      sub: 'Mon-Fri, 9am-6pm',
      action: 'tel:+15551234567'
    },
    {
      iconType: 'location',
      title: 'Visit Us',
      details: '123 Design Street',
      sub: 'Creative District, NY 10001',
      action: 'https://maps.google.com'
    }
  ];

  // Load contact data from Firebase
  useEffect(() => {
    loadContactData();
  }, []);

  const loadContactData = async () => {
    try {
      setLoading(true);
      const contactRef = doc(db, 'Resume', 'Contact');
      const contactSnap = await getDoc(contactRef);
      
      if (contactSnap.exists()) {
        const data = contactSnap.data();
        setContactData(data);
        console.log('Contact data loaded from Firebase');
      } else {
        setContactData({
          title: "Get In Touch",
          mainTitle: "Let's Work Together",
          subtitle: "Have a project in mind? I'd love to hear about it. Let's create something amazing together.",
          contactInfo: defaultContactInfo,
          services: defaultServices,
          formValidation: {
            nameMinLength: 2,
            messageMinLength: 10,
            messageMaxLength: 500,
            requirePhone: false
          },
          submitButtonText: "Send Message",
          submittingText: "Sending...",
          successMessage: "Message sent successfully! I'll get back to you soon.",
          emailRecipient: "hello@jennyportfolio.com"
        });
      }
    } catch (error) {
      console.error('Error loading contact data:', error);
      setContactData({
        title: "Get In Touch",
        mainTitle: "Let's Work Together",
        subtitle: "Have a project in mind? I'd love to hear about it. Let's create something amazing together.",
        contactInfo: defaultContactInfo,
        services: defaultServices,
        formValidation: {
          nameMinLength: 2,
          messageMinLength: 10,
          messageMaxLength: 500,
          requirePhone: false
        },
        submitButtonText: "Send Message",
        submittingText: "Sending...",
        successMessage: "Message sent successfully! I'll get back to you soon.",
        emailRecipient: "hello@jennyportfolio.com"
      });
    } finally {
      setLoading(false);
    }
  };

  const services = contactData?.services || defaultServices;
  const contactInfo = contactData?.contactInfo || defaultContactInfo;
  const validation = contactData?.formValidation || { nameMinLength: 2, messageMinLength: 10, messageMaxLength: 500, requirePhone: false };

  // Helper function to get icon SVG
  const getIconSvg = (iconType, className = "w-6 h-6") => {
    switch(iconType) {
      case 'email':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'phone':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      case 'location':
        return (
          <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'message') {
      setCharacterCount(value.length);
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < validation.nameMinLength) {
      newErrors.name = `Name must be at least ${validation.nameMinLength} characters`;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (validation.requirePhone && !formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone && !/^[\d\s+()-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < validation.messageMinLength) {
      newErrors.message = `Message must be at least ${validation.messageMinLength} characters`;
    } else if (formData.message.length > validation.messageMaxLength) {
      newErrors.message = `Message cannot exceed ${validation.messageMaxLength} characters`;
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        console.log('Form submitted:', formData);
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          service: ''
        });
        setCharacterCount(0);
        setIsSubmitting(false);
        
        // Clear success message after 5 seconds
        setTimeout(() => setSubmitStatus(null), 5000);
      }, 1500);
    } else {
      setErrors(newErrors);
    }
  };

  if (loading) {
    return (
      <section className="py-14 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-4 text-gray-600">Loading contact form...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="text-purple-600 font-semibold text-sm uppercase tracking-wider bg-purple-100 px-4 py-1 rounded-full inline-block">
            {contactData?.title || "Get In Touch"}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-4 mb-4">
            {contactData?.mainTitle || "Let's Work Together"}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {contactData?.subtitle || "Have a project in mind? I'd love to hear about it. Let's create something amazing together."}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Contact Info Cards - Left Side */}
          <div className="w-full lg:w-1/3 space-y-6">
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.action}
                target={info.title === 'Visit Us' ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="flex items-start p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                  {getIconSvg(info.iconType, "w-6 h-6")}
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800 mb-1">{info.title}</h3>
                  <p className="text-gray-600 text-sm">{info.details}</p>
                  <p className="text-gray-500 text-xs mt-1">{info.sub}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Contact Form - Minimized Width */}
          <div className="w-full lg:w-2/3">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center text-sm">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {contactData?.successMessage || "Message sent successfully! I'll get back to you soon."}
                </div>
              )}

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition text-sm ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition text-sm ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Phone Number {validation.requirePhone && '*'}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition text-sm ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Service */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Service Interested In
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition text-sm"
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition text-sm ${
                      errors.subject ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="How can I help you?"
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2 text-sm">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition resize-none text-sm ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Tell me about your project..."
                  ></textarea>
                  <div className="flex justify-between mt-1">
                    {errors.message && (
                      <p className="text-red-500 text-xs">{errors.message}</p>
                    )}
                    <p className={`text-xs ml-auto ${characterCount > validation.messageMaxLength ? 'text-red-500' : 'text-gray-500'}`}>
                      {characterCount}/{validation.messageMaxLength} characters
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {contactData?.submittingText || "Sending..."}
                  </span>
                ) : (
                  contactData?.submitButtonText || "Send Message"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;