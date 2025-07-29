// Global Types
export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  category: 'web' | 'mobile' | '3d' | 'other';
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 1-100
  category: 'frontend' | 'backend' | '3d' | 'tools' | 'design';
  icon?: string;
}

export interface Service {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  features: string[];
  technologies: string[];
  category: 'web' | 'frontend' | 'backend' | '3d' | 'design' | 'consulting';
  ctaText?: string;
  ctaLink?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SEOMeta {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
}

// 3D Scene Types
export interface ThreeSceneConfig {
  enableShadows?: boolean;
  enableFog?: boolean;
  backgroundColor?: string;
  cameraPosition?: [number, number, number];
  cameraFov?: number;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Rotation3 {
  x: number;
  y: number;
  z: number;
}

export interface MagicalElement {
  id: string;
  position: Vector3;
  rotation?: Rotation3;
  scale?: number | Vector3;
  visible?: boolean;
  interactive?: boolean;
}

export interface CandleConfig {
  position: [number, number, number];
  scale?: number;
  animationOffset?: number;
  lightIntensity?: number;
}

export interface FloatingCandlesConfig {
  count?: number;
  spread?: number;
  candleScale?: number;
  lightIntensity?: number;
}

export interface PortraitConfig {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  portraitId: number;
}

export interface MovingPortraitsConfig {
  count?: number;
}
