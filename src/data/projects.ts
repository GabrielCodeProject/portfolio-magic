import { Project } from '@/types';

export const projects: Project[] = [
  {
    id: 'magical-portfolio',
    title: 'Magical Portfolio',
    description: 'A Harry Potter themed portfolio website built with Next.js, featuring 3D magical elements, theme switching between Hogwarts houses, and interactive animations. Demonstrates advanced React patterns and modern web technologies.',
    image: '/images/projects/magical-portfolio.jpg',
    technologies: ['Next.js', 'React', 'TypeScript', 'Three.js', 'Tailwind CSS', 'Framer Motion'],
    githubUrl: 'https://github.com/example/magical-portfolio',
    liveUrl: 'https://magical-portfolio.vercel.app',
    featured: true,
    category: 'web'
  },
  {
    id: 'spellbook-api',
    title: 'Spellbook API',
    description: 'A RESTful API for managing magical spells, potions, and wizarding knowledge. Built with Node.js and Express, featuring authentication, rate limiting, and comprehensive documentation. Perfect for magical applications.',
    image: '/images/projects/spellbook-api.jpg',
    technologies: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Swagger', 'Jest'],
    githubUrl: 'https://github.com/example/spellbook-api',
    liveUrl: 'https://spellbook-api.herokuapp.com',
    featured: true,
    category: 'web'
  },
  {
    id: 'quidditch-tracker',
    title: 'Quidditch Match Tracker',
    description: 'A real-time sports tracking application for Quidditch matches. Features live score updates, player statistics, team management, and match scheduling. Built with React and Firebase for real-time functionality.',
    image: '/images/projects/quidditch-tracker.jpg',
    technologies: ['React', 'Firebase', 'Material-UI', 'Chart.js', 'PWA'],
    githubUrl: 'https://github.com/example/quidditch-tracker',
    liveUrl: 'https://quidditch-tracker.web.app',
    featured: true,
    category: 'web'
  },
  {
    id: 'enchanted-calculator',
    title: 'Enchanted Calculator',
    description: 'A magical calculator with advanced mathematical functions and beautiful animations. Features spell-casting animations for operations, mystical number formatting, and support for complex magical calculations.',
    image: '/images/projects/enchanted-calculator.jpg',
    technologies: ['JavaScript', 'CSS3', 'Web Animations API', 'Canvas API'],
    githubUrl: 'https://github.com/example/enchanted-calculator',
    liveUrl: 'https://enchanted-calculator.netlify.app',
    featured: true,
    category: 'web'
  },
  {
    id: 'magical-3d-scene',
    title: 'Interactive 3D Hogwarts',
    description: 'An immersive 3D recreation of Hogwarts castle using Three.js. Features interactive exploration, dynamic lighting, weather effects, and magical particle systems. Optimized for both desktop and mobile devices.',
    image: '/images/projects/magical-3d-scene.jpg',
    technologies: ['Three.js', 'WebGL', 'Blender', 'GLSL', 'Web Workers'],
    githubUrl: 'https://github.com/example/magical-3d-scene',
    liveUrl: 'https://hogwarts-3d.vercel.app',
    featured: true,
    category: '3d'
  },
  {
    id: 'wizarding-commerce',
    title: 'Wizarding Commerce Platform',
    description: 'A full-stack e-commerce platform for magical supplies and artifacts. Features user authentication, payment processing, inventory management, and order tracking. Built with modern web technologies for scalability.',
    image: '/images/projects/wizarding-commerce.jpg',
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'Redis', 'Docker'],
    githubUrl: 'https://github.com/example/wizarding-commerce',
    liveUrl: 'https://wizarding-commerce.vercel.app',
    featured: false,
    category: 'web'
  },
  {
    id: 'weather-crystal',
    title: 'Weather Crystal App',
    description: 'A mystical weather application with beautiful visualizations and accurate forecasts. Features location-based weather, interactive maps, and magical weather animations. Progressive Web App with offline capabilities.',
    image: '/images/projects/weather-crystal.jpg',
    technologies: ['Vue.js', 'OpenWeather API', 'PWA', 'Chart.js', 'Service Workers'],
    githubUrl: 'https://github.com/example/weather-crystal',
    liveUrl: 'https://weather-crystal.netlify.app',
    featured: false,
    category: 'web'
  },
  {
    id: 'magical-blog',
    title: 'Magical Blog CMS',
    description: 'A content management system for magical blogs and journals. Features markdown support, image optimization, SEO tools, and a beautiful admin interface. Built for performance and ease of use.',
    image: '/images/projects/magical-blog.jpg',
    technologies: ['Gatsby', 'GraphQL', 'Contentful', 'Netlify CMS', 'Algolia'],
    githubUrl: 'https://github.com/example/magical-blog',
    liveUrl: 'https://magical-blog.gatsbyjs.io',
    featured: false,
    category: 'web'
  },
  {
    id: 'potion-game',
    title: 'Potion Brewing Game',
    description: 'An interactive browser game where players brew magical potions by combining ingredients. Features drag-and-drop mechanics, particle effects, scoring system, and local leaderboards.',
    image: '/images/projects/potion-game.jpg',
    technologies: ['JavaScript', 'Canvas API', 'Web Audio API', 'Local Storage'],
    githubUrl: 'https://github.com/example/potion-game',
    liveUrl: 'https://potion-brewing-game.netlify.app',
    featured: false,
    category: 'web'
  },
  {
    id: 'spell-checker-extension',
    title: 'Magical Spell Checker',
    description: 'A Chrome extension that enhances text editing with magical spell checking and writing suggestions. Features custom dictionaries, writing analytics, and productivity tools for content creators.',
    image: '/images/projects/spell-checker.jpg',
    technologies: ['Chrome Extension API', 'JavaScript', 'Natural Language Processing', 'IndexedDB'],
    githubUrl: 'https://github.com/example/spell-checker-extension',
    featured: false,
    category: 'other'
  },
  {
    id: 'data-crystal-dashboard',
    title: 'Data Crystal Dashboard',
    description: 'A real-time data visualization dashboard with beautiful charts and analytics. Features customizable widgets, real-time updates, export capabilities, and responsive design for monitoring key metrics.',
    image: '/images/projects/data-dashboard.jpg',
    technologies: ['D3.js', 'WebSocket', 'Express', 'MongoDB', 'Chart.js', 'Socket.io'],
    githubUrl: 'https://github.com/example/data-crystal-dashboard',
    liveUrl: 'https://data-crystal.herokuapp.com',
    featured: false,
    category: 'web'
  }
];

export const featuredProjects = projects.filter(project => project.featured);

export const nonFeaturedProjects = projects.filter(project => !project.featured);

export const getAllProjects = () => projects;

export const getProjectsByCategory = (category: Project['category']) => 
  projects.filter(project => project.category === category);

export const getProjectById = (id: string) => 
  projects.find(project => project.id === id);