# Tasks for Harry Potter Themed NextJS Portfolio

## Relevant Files

- `next.config.ts` - Next.js configuration for GitHub Pages deployment and optimization
- `package.json` - Project dependencies and scripts including quality control scripts
- `tailwind.config.js` - Tailwind CSS configuration with Harry Potter theme colors
- `app/globals.css` - Global styles with Harry Potter theme variables and magical effects
- `app/layout.tsx` - Root layout with ThemeProvider and improved metadata
- `lib/constants.ts` - Application constants including theme definitions and configurations
- `lib/theme.ts` - Theme management utilities and color configurations
- `lib/utils.ts` - General utility functions for the application
- `components/ThemeProvider.tsx` - React context provider for theme switching
- `components/ThemeToggle.tsx` - Interactive theme toggle component with smooth transitions
- `components/ui/LoadingSpinner.tsx` - Magical loading spinner with multiple Harry Potter themed variants
- `components/Hero.tsx` - Hero section with animated house crests and magical effects
- `components/About.tsx` - About section with The Wizard's Tale narrative and magical stats
- `components/Skills.tsx` - Interactive skills section with magical disciplines and mastery levels
- `hooks/useTheme.ts` - Custom hook for theme management
- `components/Projects.tsx` - Projects showcase with featured projects and magical styling
- `components/ProjectCard.tsx` - Individual project card component with hover effects
- `components/Services.tsx` - Services section with magical-themed service offerings
- `components/ServiceCard.tsx` - Individual service card component with hover effects and CTAs
- `data/projects.ts` - Project data structure and sample featured projects
- `data/services.ts` - Service data structure with 6 magical-themed service offerings
- `app/page.tsx` - Main portfolio page with Hero, About, Skills, Projects, and Services sections
- `src/types/index.ts` - TypeScript type definitions
- `eslint.config.mjs` - ESLint configuration with TypeScript and code quality rules
- `.prettierrc` - Prettier configuration for consistent code formatting
- `.vscode/settings.json` - VSCode settings for optimal development experience

- `components/3D/ThreeScene.tsx` - Main 3D scene wrapper component with WebGL support detection, accessibility features, and performance optimizations
- `components/3D/FloatingCandles.tsx` - Animated floating candles with dynamic lighting, theme-responsive colors, and realistic flame effects
- `components/3D/MovingPortraits.tsx` - Interactive magical portraits with cursor tracking, scroll effects, and theme-responsive mystical elements

### TODO: Components to be implemented in future tasks
- `components/Layout.tsx` - Main layout wrapper with navigation and 3D canvas (Task 3.0)
- `components/Navigation.tsx` - Site navigation with smooth scrolling, active section tracking, and magical styling
- `components/Contact.tsx` - Contact form and social links with magical styling and form validation
- `components/3D/GoldenSnitch.tsx` - Golden Snitch 3D component (Task 4.4)
- `lib/seo.ts` - SEO configuration and meta tag utilities (Task 5.1)
- `public/sitemap.xml` - Generated sitemap for SEO (Task 5.3)
- `public/robots.txt` - Robots.txt file for search engines (Task 5.3)

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.

## Tasks

- [x] 1.0 Project Setup & Configuration
  - [x] 1.1 Initialize Next.js project with TypeScript
  - [x] 1.2 Install required dependencies (@react-three/fiber, @react-three/drei, three, @types/three)
  - [x] 1.3 Configure Tailwind CSS with Harry Potter theme colors
  - [x] 1.4 Set up GitHub Pages deployment configuration
  - [x] 1.5 Create project structure and folder organization
  - [x] 1.6 Configure ESLint and Prettier for code quality
  - [x] 1.7 Set up Jest testing framework

- [x] 2.0 Theme System & UI Foundation
  - [x] 2.1 Create ThemeProvider context with Slytherin/Gryffindor themes
  - [x] 2.2 Implement theme toggle component with smooth transitions
  - [x] 2.3 Set up CSS variables for theme colors and properties
  - [x] 2.4 Create base UI components (buttons, cards, containers)
  - [x] 2.5 Implement responsive layout system
  - [x] 2.6 Add magical styling utilities and animations
  - [x] 2.7 Create loading spinner with thematic design

- [x] 3.0 Core Page Sections & Content
  - [x] 3.1 Build Hero section with house crest animation
  - [x] 3.2 Create About section with personal background content
  - [x] 3.3 Develop Skills section with interactive tech stack visualization
  - [x] 3.4 Implement Projects section with 3-5 featured projects
  - [x] 3.5 Add expandable "Show More Projects" functionality
  - [x] 3.6 Create Services section highlighting offerings
  - [x] 3.7 Build Contact section with form and social links
  - [x] 3.8 Implement smooth scroll navigation between sections
  - [x] 3.9 Add micro-interactions and hover effects

- [ ] 4.0 3D Magical Elements Integration
  - [x] 4.1 Set up React Three Fiber canvas and scene
  - [x] 4.2 Create floating candles component with point lights
  - [x] 4.3 Implement moving portraits with cursor/scroll interaction
  - [ ] 4.4 Develop Golden Snitch with animated wings and flight paths
  - [ ] 4.5 Add lazy loading for 3D elements
  - [ ] 4.6 Implement LOD optimization for mobile devices
  - [ ] 4.7 Set up frustum culling and performance optimization
  - [ ] 4.8 Create fallback system for devices without 3D support
  - [ ] 4.9 Add reduced motion alternatives for accessibility

- [ ] 5.0 SEO Optimization & Performance
  - [ ] 5.1 Configure Next.js SEO with meta tags and Open Graph
  - [ ] 5.2 Implement structured data markup
  - [ ] 5.3 Generate sitemap.xml and robots.txt
  - [ ] 5.4 Optimize images and assets for fast loading
  - [ ] 5.5 Implement performance monitoring and Lighthouse optimization
  - [ ] 5.6 Add keyboard navigation support
  - [ ] 5.7 Ensure WCAG 2.1 AA accessibility compliance
  - [ ] 5.8 Test and optimize for mobile responsiveness
  - [ ] 5.9 Configure GitHub Pages deployment and CI/CD
