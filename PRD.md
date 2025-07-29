# Product Requirements Document (PRD)

## Harry Potter Themed NextJS Portfolio

---

### **1. Project Overview**

**Product Name:** Personal Portfolio Website  
**Theme:** Harry Potter Universe (Slytherin Focus)  
**Primary Goal:** Create a modern, SEO-friendly personal portfolio that showcases professional identity, skills, and projects with an immersive Harry Potter theme.

### **2. Target Audience**

- **Primary:** Potential employers and clients
- **Secondary:** Fellow developers and tech enthusiasts
- **Tertiary:** Harry Potter fans interested in themed web experiences

### **3. Core Objectives**

1. **Professional Representation:** Clearly communicate who you are and what services you offer
2. **SEO Optimization:** Ensure discoverability through search engines
3. **Modern User Experience:** Provide engaging, responsive design with smooth animations
4. **Thematic Immersion:** Create authentic Harry Potter atmosphere while maintaining professionalism

### **4. Technical Specifications**

**Tech Stack:**

- **Framework:** Next.js (Latest version)
- **Deployment:** GitHub Pages
- **Styling:** CSS-in-JS or Tailwind CSS (TBD)
- **3D Graphics:** Three.js with React Three Fiber (@react-three/fiber)
- **3D Utilities:** @react-three/drei for pre-built components
- **SEO:** Next.js built-in SEO features

**Performance Requirements:**

- Lighthouse score >90 for Performance, SEO, Accessibility
- Mobile-first responsive design
- Fast loading times (<3 seconds)

### **5. Feature Requirements**

#### **5.1 Core Features**

**Theme Toggle System**

- **Binary toggle between two house themes only**
- **Dark Mode (Slytherin):** Deep green color palette, dark backgrounds, silver accents
- **Light Mode (Gryffindor):** Red and gold color palette, warm lighting, bright backgrounds
- Smooth transitions between themes
- Persistent user preference storage

**Hero Section**

- Professional introduction with Harry Potter theming
- Animated house crest or magical elements
- Clear value proposition

**Tech Stack Section**

- Visual representation of technical skills
- Interactive elements (hover effects, animations)
- Categorized by proficiency or technology type

**Projects Section**

- Showcase 3-5 featured projects initially
- Expandable component to view additional projects
- Project cards with hover effects and magical transitions
- Links to live demos and repositories
- "View More Projects" expansion functionality

**3D Animated Background & Magical Elements**

- **Floating Candles:**
  - Illuminate and highlight content sections in dark mode
  - Implemented using `<Float>` component from @react-three/drei
  - Custom candle geometry with point lights
  - CSS blend modes for content highlighting
- **Moving Portraits:**
  - Subtle animated portraits that follow cursor/scroll
  - 2D planes with portrait textures and magical frame borders
  - Rotation/movement based on scroll position and mouse interaction
- **Golden Snitch:**
  - Interactive flying element with animated wings
  - Complex geometry with Bezier curve flight paths
  - Appears on random scroll triggers with trail effects
- **Technical Implementation:**
  - React Three Fiber for declarative 3D scene composition
  - Lazy loading of 3D elements after page content loads
  - LOD (Level of Detail) optimization for mobile devices
  - Instance rendering for multiple similar elements
  - Frustum culling to only render visible elements

#### **5.2 SEO Features**

- Meta tags optimization
- Structured data markup
- Sitemap generation
- Open Graph tags for social sharing
- Fast loading and mobile optimization

#### **5.3 User Experience Features**

- Smooth scroll navigation
- Loading animations
- Micro-interactions
- Keyboard navigation support
- Screen reader compatibility

### **6. Content Structure**

#### **6.1 Navigation Menu**

- Home/About
- Skills/Tech Stack
- Projects/Portfolio
- Services
- Contact

#### **6.2 Page Sections**

**About Section:**

- Personal introduction and professional background
- Technical skills and expertise overview
- Personal interests and hobbies
- Career journey and achievements
- House affiliation (Slytherin) integration
- Call-to-action for services

**Skills Section:**

- Technical skills visualization
- Experience levels
- Magical theming for skill categories

**Projects Section:**

- 3-5 featured projects displayed initially
- Expandable "Show More" component for additional projects
- Project cards with descriptions and magical hover effects
- Technology stack used for each project
- Live demo and repository links
- Project screenshots/previews with lightbox functionality

**Services Section:**

- Website building and development services
- Mobile application development
- Technical consultation offerings
- Project collaboration opportunities

**Contact Section:**

- Contact form for inquiries
- Social media integration
- Professional availability and response times

### **7. Design Requirements**

#### **7.1 Visual Design**

**Slytherin Theme (Dark Mode):**

- Primary: Dark Green (#1a472a, #15532e)
- Secondary: Silver (#c0c0c0, #e5e5e5)
- Accent: Emerald (#10b981)
- Background: Near black (#0f0f0f)

**Gryffindor Theme (Light Mode):**

- Primary: Scarlet Red (#dc2626, #b91c1c)
- Secondary: Gold (#f59e0b, #d97706)
- Accent: Deep Red (#7f1d1d)
- Background: Light cream (#fefce8)

#### **7.2 Typography**

- Elegant, readable fonts that complement the magical theme
- Hierarchy with clear headings and body text
- Consistent sizing and spacing

#### **7.3 UI Components**

- Custom buttons with house-themed styling
- Card components with magical borders/effects
- Interactive elements with hover states
- Loading spinners with thematic design

### **8. Technical Constraints**

- **Deployment:** Must work with GitHub Pages static hosting
- **Performance:** Optimized for mobile and desktop
- **Browser Support:** Modern browsers (Chrome, Firefox, Safari, Edge)
- **Accessibility:** WCAG 2.1 AA compliance

### **9. Success Metrics**

- **Performance:** Lighthouse scores >90
- **SEO:** Indexed by search engines within 2 weeks
- **User Engagement:** Low bounce rate, good session duration
- **Professional Impact:** Increased portfolio views and inquiries

### **10. Development Dependencies**

**Required NPM Packages:**

```bash
npm install @react-three/fiber @react-three/drei three
npm install --save-dev @types/three
```

**Optional Performance Packages:**

```bash
npm install @react-three/postprocessing  # For visual effects
npm install use-gesture                  # For advanced interactions
```

### **11. Future Enhancements (Post-Launch)**

- Blog section with magical theming
- Interactive spell-casting animations
- Advanced 3D interactions (wand controls, spell effects)
- Achievement/badge system
- Multi-language support
- Contact form with backend integration

### **12. Risk Mitigation**

- **Performance Risk:** Regular testing and optimization, fallback to CSS animations if 3D impacts performance
- **3D Complexity Risk:** Progressive enhancement - core content works without 3D elements
- **Theme Consistency:** Design system documentation
- **SEO Risk:** Follow Next.js best practices, ensure 3D doesn't block critical rendering
- **Accessibility Risk:** Regular audit and testing, provide reduced motion alternatives

---

**Document Version:** 1.0  
**Last Updated:** July 28, 2025  
**Status:** Draft - Pending User Feedback
