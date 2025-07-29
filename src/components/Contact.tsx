'use client';

import React, { useEffect, useRef, useState } from 'react';

import { useSafeTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';

interface ContactProps {
  className?: string;
}

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const socialLinks = [
  {
    name: 'GitHub',
    icon: '🔮',
    href: '#',
    description: 'Explore my magical code repositories',
  },
  {
    name: 'LinkedIn',
    icon: '🦉',
    href: '#',
    description: 'Connect with me professionally',
  },
  {
    name: 'Twitter',
    icon: '⚡',
    href: '#',
    description: 'Follow my latest magical discoveries',
  },
  {
    name: 'Email',
    icon: '📜',
    href: 'mailto:wizard@example.com',
    description: 'Send me a direct message',
  },
];

export const Contact: React.FC<ContactProps> = ({ className }) => {
  const { isSlytherin } = useSafeTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [backgroundParticles, setBackgroundParticles] = useState<Array<{
    left: number;
    top: number;
    delay: number;
    duration: number;
  }>>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Generate background particles on client side to avoid hydration mismatch
  useEffect(() => {
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: i * 0.8,
      duration: 12 + Math.random() * 8,
    }));
    setBackgroundParticles(newParticles);
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Your name is required for proper introductions';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'An owl needs an address to deliver messages';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please provide a valid magical email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Every good spell needs a clear purpose';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Your message cannot be empty - share your thoughts!';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Please provide more details (at least 10 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Form submitted:', formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative min-h-screen py-20 px-6 overflow-hidden',
        'bg-gradient-to-br from-theme-bg-primary via-theme-bg-secondary to-theme-bg-primary',
        className
      )}
      id="contact"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Orbs */}
        <div 
          className={cn(
            'absolute w-96 h-96 rounded-full opacity-15 blur-3xl transition-all duration-1000',
            isSlytherin 
              ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
              : 'bg-gradient-to-r from-amber-500 to-red-500',
            isVisible ? 'animate-pulse' : ''
          )}
          style={{ 
            top: '20%', 
            left: '5%',
            animationDuration: '15s'
          }}
        />
        <div 
          className={cn(
            'absolute w-80 h-80 rounded-full opacity-20 blur-3xl transition-all duration-1000',
            isSlytherin 
              ? 'bg-gradient-to-r from-teal-500 to-cyan-500' 
              : 'bg-gradient-to-r from-orange-500 to-yellow-500',
            isVisible ? 'animate-pulse' : ''
          )}
          style={{ 
            bottom: '15%', 
            right: '10%',
            animationDuration: '18s',
            animationDelay: '4s'
          }}
        />

        {/* Floating Particles */}
        {backgroundParticles.map((particle, index) => (
          <div
            key={index}
            className={cn(
              'absolute w-1.5 h-1.5 rounded-full opacity-30 animate-bounce',
              isSlytherin ? 'bg-emerald-300' : 'bg-amber-300'
            )}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div 
            className={cn(
              'inline-flex items-center gap-3 mb-6 transition-all duration-1000',
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            )}
          >
            <div 
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-lg',
                isSlytherin 
                  ? 'bg-emerald-600/20 text-emerald-400' 
                  : 'bg-amber-600/20 text-amber-400'
              )}
            >
              📬
            </div>
            <span 
              className={cn(
                'font-philosopher text-sm uppercase tracking-wider font-medium',
                isSlytherin ? 'text-emerald-400' : 'text-amber-400'
              )}
            >
              Send a Message
            </span>
          </div>

          <h2 
            className={cn(
              'font-cinzel text-4xl md:text-5xl font-bold mb-6 transition-all duration-1000',
              'text-theme-text-primary',
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '200ms' }}
          >
            Let&apos;s Create{' '}
            <span 
              className={cn(
                'magical-text bg-gradient-to-r bg-clip-text text-transparent',
                isSlytherin 
                  ? 'from-emerald-400 to-teal-400' 
                  : 'from-amber-400 to-orange-400'
              )}
            >
              Something Magical
            </span>
          </h2>

          <p 
            className={cn(
              'font-philosopher text-lg text-theme-text-secondary max-w-3xl mx-auto leading-relaxed transition-all duration-1000',
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '400ms' }}
          >
            Whether you have a project in mind, want to collaborate, or simply wish to connect, 
            I&apos;d love to hear from you. Send me a message and let&apos;s start our magical journey together.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Form */}
          <div 
            className={cn(
              'transition-all duration-1000',
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '600ms' }}
          >
            <div className="glass p-8 rounded-xl">
              <h3 className="font-cinzel text-2xl font-semibold text-theme-text-primary mb-6">
                Cast Your Message
              </h3>

              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">✨</div>
                  <h4 className="font-cinzel text-xl font-semibold text-theme-text-primary mb-3">
                    Message Delivered!
                  </h4>
                  <p className="font-philosopher text-theme-text-secondary">
                    Your message has been sent successfully. I&apos;ll get back to you as soon as possible!
                  </p>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className={cn(
                      'mt-6 px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                      isSlytherin
                        ? 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30'
                        : 'bg-amber-600/20 text-amber-400 hover:bg-amber-600/30'
                    )}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label 
                      htmlFor="name" 
                      className="block font-philosopher text-sm font-medium text-theme-text-primary mb-2"
                    >
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={cn(
                        'w-full px-4 py-3 rounded-lg transition-all duration-300',
                        'bg-theme-bg-tertiary border-2 text-theme-text-primary',
                        'focus:outline-none focus:ring-2 focus:ring-offset-2 magical-form-field',
                        errors.name
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-400'
                          : isSlytherin
                          ? 'border-emerald-600/30 focus:border-emerald-500 focus:ring-emerald-400'
                          : 'border-amber-600/30 focus:border-amber-500 focus:ring-amber-400'
                      )}
                      placeholder="Enter your magical name"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-400">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label 
                      htmlFor="email" 
                      className="block font-philosopher text-sm font-medium text-theme-text-primary mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={cn(
                        'w-full px-4 py-3 rounded-lg transition-all duration-300',
                        'bg-theme-bg-tertiary border-2 text-theme-text-primary',
                        'focus:outline-none focus:ring-2 focus:ring-offset-2 magical-form-field',
                        errors.email
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-400'
                          : isSlytherin
                          ? 'border-emerald-600/30 focus:border-emerald-500 focus:ring-emerald-400'
                          : 'border-amber-600/30 focus:border-amber-500 focus:ring-amber-400'
                      )}
                      placeholder="your.email@domain.com"
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-400">{errors.email}</p>
                    )}
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label 
                      htmlFor="subject" 
                      className="block font-philosopher text-sm font-medium text-theme-text-primary mb-2"
                    >
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={cn(
                        'w-full px-4 py-3 rounded-lg transition-all duration-300',
                        'bg-theme-bg-tertiary border-2 text-theme-text-primary',
                        'focus:outline-none focus:ring-2 focus:ring-offset-2 magical-form-field',
                        errors.subject
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-400'
                          : isSlytherin
                          ? 'border-emerald-600/30 focus:border-emerald-500 focus:ring-emerald-400'
                          : 'border-amber-600/30 focus:border-amber-500 focus:ring-amber-400'
                      )}
                      placeholder="What's this message about?"
                    />
                    {errors.subject && (
                      <p className="mt-2 text-sm text-red-400">{errors.subject}</p>
                    )}
                  </div>

                  {/* Message Field */}
                  <div>
                    <label 
                      htmlFor="message" 
                      className="block font-philosopher text-sm font-medium text-theme-text-primary mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className={cn(
                        'w-full px-4 py-3 rounded-lg transition-all duration-300 resize-none',
                        'bg-theme-bg-tertiary border-2 text-theme-text-primary',
                        'focus:outline-none focus:ring-2 focus:ring-offset-2',
                        errors.message
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-400'
                          : isSlytherin
                          ? 'border-emerald-600/30 focus:border-emerald-500 focus:ring-emerald-400'
                          : 'border-amber-600/30 focus:border-amber-500 focus:ring-amber-400'
                      )}
                      placeholder="Share your thoughts, ideas, or project details..."
                    />
                    {errors.message && (
                      <p className="mt-2 text-sm text-red-400">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      'w-full py-4 px-6 rounded-lg font-medium transition-all duration-300',
                      'magical-button hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2',
                      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
                      isSlytherin
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 focus:ring-emerald-400'
                        : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-500 hover:to-orange-500 focus:ring-amber-400'
                    )}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending Message...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        Send Message
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Info & Social Links */}
          <div 
            className={cn(
              'space-y-8 transition-all duration-1000',
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '800ms' }}
          >
            {/* Contact Information */}
            <div className="glass p-8 rounded-xl">
              <h3 className="font-cinzel text-2xl font-semibold text-theme-text-primary mb-6">
                Other Ways to Connect
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div 
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0',
                      isSlytherin 
                        ? 'bg-emerald-600/20 text-emerald-400' 
                        : 'bg-amber-600/20 text-amber-400'
                    )}
                  >
                    📍
                  </div>
                  <div>
                    <h4 className="font-philosopher font-medium text-theme-text-primary mb-1">
                      Location
                    </h4>
                    <p className="text-theme-text-secondary">
                      Hogwarts School of Witchcraft and Web Development
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div 
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0',
                      isSlytherin 
                        ? 'bg-emerald-600/20 text-emerald-400' 
                        : 'bg-amber-600/20 text-amber-400'
                    )}
                  >
                    ⏰
                  </div>
                  <div>
                    <h4 className="font-philosopher font-medium text-theme-text-primary mb-1">
                      Response Time
                    </h4>
                    <p className="text-theme-text-secondary">
                      Usually within 24 hours (faster than an owl!)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div 
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0',
                      isSlytherin 
                        ? 'bg-emerald-600/20 text-emerald-400' 
                        : 'bg-amber-600/20 text-amber-400'
                    )}
                  >
                    💼
                  </div>
                  <div>
                    <h4 className="font-philosopher font-medium text-theme-text-primary mb-1">
                      Availability
                    </h4>
                    <p className="text-theme-text-secondary">
                      Open for freelance projects and collaborations
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="glass p-8 rounded-xl">
              <h3 className="font-cinzel text-2xl font-semibold text-theme-text-primary mb-6">
                Follow the Magic
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((link, index) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className={cn(
                      'group p-4 rounded-lg transition-all duration-300',
                      'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2',
                      'bg-theme-bg-tertiary hover:bg-theme-bg-secondary',
                      isSlytherin
                        ? 'hover:border-emerald-500/50 focus:ring-emerald-400'
                        : 'hover:border-amber-500/50 focus:ring-amber-400'
                    )}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{link.icon}</div>
                      <h4 className="font-philosopher font-medium text-theme-text-primary mb-1">
                        {link.name}
                      </h4>
                      <p className="text-xs text-theme-text-secondary">
                        {link.description}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-theme-border to-transparent" />
    </section>
  );
};

export default Contact;