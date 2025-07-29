// Theme Constants
export const THEMES = {
  SLYTHERIN: 'slytherin',
  GRYFFINDOR: 'gryffindor',
} as const;

export type Theme = (typeof THEMES)[keyof typeof THEMES];

// App Constants
export const APP_CONFIG = {
  name: 'Harry Potter Portfolio',
  description:
    'A magical portfolio showcasing web development skills with Harry Potter themes',
  author: 'Developer Name',
  url: 'https://your-username.github.io/portfolio',
  social: {
    github: 'https://github.com/your-username',
    linkedin: 'https://linkedin.com/in/your-profile',
    email: 'your-email@example.com',
  },
};

// 3D Scene Settings
export const SCENE_CONFIG = {
  camera: {
    position: [0, 0, 5] as [number, number, number],
    fov: 75,
  },
  lighting: {
    ambient: 0.4,
    directional: 0.6,
  },
  performance: {
    maxFPS: 60,
    pixelRatio: 1, // Will be set dynamically in browser
  },
};

// Animation Durations
export const ANIMATIONS = {
  pageTransition: 0.5,
  hover: 0.3,
  theme: 0.4,
  scroll: 0.8,
} as const;
