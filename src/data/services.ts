import { Service } from '@/types';

export const services: Service[] = [
  {
    id: 'web-enchantments',
    title: 'Web Enchantments',
    subtitle: 'Magical Web Development',
    description: 'Craft enchanting websites and web applications that captivate users and drive results. From simple portfolios to complex e-commerce platforms, every project is infused with modern magic and cutting-edge technology.',
    icon: '🌐',
    features: [
      'Custom website development',
      'E-commerce platforms',
      'Progressive Web Apps (PWA)',
      'Performance optimization',
      'SEO & accessibility',
      'Responsive design'
    ],
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
    category: 'web',
    ctaText: 'Start Your Project',
    ctaLink: '#contact'
  },
  {
    id: 'digital-alchemy',
    title: 'Digital Alchemy',
    subtitle: '3D & Interactive Experiences',
    description: 'Transform ordinary websites into extraordinary realms with immersive 3D experiences and interactive animations. Blend the mystical art of Three.js with modern web technologies to create unforgettable digital journeys.',
    icon: '🔮',
    features: [
      '3D web experiences',
      'Interactive animations',
      'WebGL applications',
      'Virtual product showcases',
      'Immersive storytelling',
      'Cross-platform compatibility'
    ],
    technologies: ['Three.js', 'WebGL', 'GLSL', 'Blender', 'React Three Fiber', 'Framer Motion'],
    category: '3d',
    ctaText: 'Explore Possibilities',
    ctaLink: '#contact'
  },
  {
    id: 'frontend-sorcery',
    title: 'Frontend Sorcery',
    subtitle: 'Modern Frontend Development',
    description: 'Weave powerful spells with React, Vue, and other modern frameworks to create lightning-fast, user-friendly interfaces. Every component is crafted with precision and optimized for peak performance.',
    icon: '⚡',
    features: [
      'React & Vue applications',
      'Component libraries',
      'State management',
      'API integration',
      'Performance optimization',
      'Testing & quality assurance'
    ],
    technologies: ['React', 'Vue.js', 'TypeScript', 'Redux', 'Jest', 'Cypress'],
    category: 'frontend',
    ctaText: 'Build Together',
    ctaLink: '#contact'
  },
  {
    id: 'backend-wizardry',
    title: 'Backend Wizardry',
    subtitle: 'Server-Side Magic',
    description: 'Conjure robust backend systems and APIs that power your applications with reliability and scalability. From database design to serverless architectures, every spell is cast with precision and foresight.',
    icon: '📜',
    features: [
      'RESTful & GraphQL APIs',
      'Database design & optimization',
      'Authentication & security',
      'Serverless architectures',
      'Microservices',
      'Performance monitoring'
    ],
    technologies: ['Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker'],
    category: 'backend',
    ctaText: 'Architect Solutions',
    ctaLink: '#contact'
  },
  {
    id: 'design-divination',
    title: 'Design Divination',
    subtitle: 'UI/UX Design Services',
    description: 'Peer into the future of user experience with intuitive designs that delight and convert. Every interface is thoughtfully crafted to guide users on a magical journey from first click to final conversion.',
    icon: '🎨',
    features: [
      'User interface design',
      'User experience optimization',
      'Wireframing & prototyping',
      'Design systems',
      'Usability testing',
      'Brand identity'
    ],
    technologies: ['Figma', 'Adobe Creative Suite', 'Sketch', 'InVision', 'Miro', 'Principle'],
    category: 'design',
    ctaText: 'Design Magic',
    ctaLink: '#contact'
  },
  {
    id: 'technical-prophecy',
    title: 'Technical Prophecy',
    subtitle: 'Consulting & Guidance',
    description: 'Illuminate the path forward with expert technical consulting and strategic guidance. Whether you need architecture planning, code reviews, or team mentoring, wisdom gained through years of digital sorcery guides every recommendation.',
    icon: '🦉',
    features: [
      'Technical architecture planning',
      'Code reviews & audits',
      'Performance optimization',
      'Team mentoring',
      'Technology strategy',
      'Project rescue & recovery'
    ],
    technologies: ['System Design', 'Code Analysis', 'Performance Tuning', 'DevOps', 'Best Practices', 'Leadership'],
    category: 'consulting',
    ctaText: 'Seek Wisdom',
    ctaLink: '#contact'
  }
];

export const getServicesByCategory = (category: Service['category']) => 
  services.filter(service => service.category === category);

export const getServiceById = (id: string) => 
  services.find(service => service.id === id);