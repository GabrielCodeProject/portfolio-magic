// Re-export the useTheme hook from ThemeProvider
export { useTheme } from '@/components/ThemeProvider';

// This file exists for consistency with the hooks structure  
// The actual useTheme hook is defined in ThemeProvider.tsx
import { useTheme } from '@/components/ThemeProvider';
export default useTheme;