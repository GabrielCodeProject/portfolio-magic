import type { Metadata } from 'next';
import { Cinzel, Philosopher } from 'next/font/google';

import ThemeProvider from '@/components/ThemeProvider';

import './globals.css';

const cinzel = Cinzel({
  variable: '--font-cinzel',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const philosopher = Philosopher({
  variable: '--font-philosopher',
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: 'Harry Potter Portfolio - Magical Web Development',
  description:
    'A magical portfolio showcasing web development skills with Harry Potter themes. Switch between Slytherin and Gryffindor houses.',
  keywords: [
    'portfolio',
    'web development',
    'React',
    'Next.js',
    'Three.js',
    'Harry Potter',
    'frontend',
    'developer',
  ],
  authors: [{ name: 'Gabriel' }],
  creator: 'Gabriel',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-username.github.io/portfolio',
    title: 'Harry Potter Portfolio - Magical Web Development',
    description:
      'A magical portfolio showcasing web development skills with Harry Potter themes.',
    siteName: 'Harry Potter Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Harry Potter Portfolio - Magical Web Development',
    description:
      'A magical portfolio showcasing web development skills with Harry Potter themes.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cinzel.variable} ${philosopher.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
