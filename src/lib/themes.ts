export type Theme = {
  id: string;
  name: string;
  category: 'Cozy & Natural' | 'Dark & Atmospheric' | 'Retro & Cyber' | 'Modern & Minimal';
  colors: {
    background: string;
    card: string;
    cardShadow: string;
    text: string;
    accent: string;
    divider: string;
  };
  fontFamily: 'sans' | 'mono';
  effects?: {
    crt?: boolean;
    noise?: boolean;
    glow?: boolean;
  };
};

export const themes: Theme[] = [
  // Cozy & Natural
  {
    id: 'lofi-study',
    name: 'Lofi Study Room',
    category: 'Cozy & Natural',
    colors: {
      background: '#EAE0D5',
      card: '#C6AC8F',
      cardShadow: 'rgba(94, 80, 63, 0.2)',
      text: '#5E503F',
      accent: '#FFB5A7',
      divider: '#A89279'
    },
    fontFamily: 'sans',
    effects: { noise: true }
  },
  {
    id: 'matcha-latte',
    name: 'Matcha Latte',
    category: 'Cozy & Natural',
    colors: {
      background: '#F1F7ED',
      card: '#94AF9F',
      cardShadow: 'rgba(67, 85, 75, 0.15)',
      text: '#1e382b',
      accent: '#DBE7C9',
      divider: '#7c9687'
    },
    fontFamily: 'sans'
  },
  {
    id: 'sakura',
    name: 'Sakura Blossom',
    category: 'Cozy & Natural',
    colors: {
      background: '#FFD1DC',
      card: '#FFF0F5',
      cardShadow: 'rgba(219, 112, 147, 0.2)',
      text: '#C71585',
      accent: '#FFB6C1',
      divider: '#FFC0CB'
    },
    fontFamily: 'sans'
  },
  {
    id: 'espresso',
    name: 'Espresso Roast',
    category: 'Cozy & Natural',
    colors: {
      background: '#3C2A21',
      card: '#1A120B',
      cardShadow: 'rgba(0,0,0,0.5)',
      text: '#D5CEA3',
      accent: '#E5E5CB',
      divider: '#2c1e17'
    },
    fontFamily: 'sans'
  },

  // Dark & Atmospheric
  {
    id: 'classic-black',
    name: 'Classic Black',
    category: 'Dark & Atmospheric',
    colors: {
      background: '#000000',
      card: '#111111',
      cardShadow: 'rgba(0,0,0,0)',
      text: '#FFFFFF',
      accent: '#FFFFFF',
      divider: '#000000'
    },
    fontFamily: 'sans'
  },
  {
    id: 'monochrome',
    name: 'Monochrome Dark',
    category: 'Dark & Atmospheric',
    colors: {
      background: '#121212',
      card: '#1E1E1E',
      cardShadow: 'rgba(0,0,0,0.8)',
      text: '#F5F5F5',
      accent: '#FFFFFF',
      divider: '#000000'
    },
    fontFamily: 'sans'
  },
  {
    id: 'midnight-ocean',
    name: 'Midnight Ocean',
    category: 'Dark & Atmospheric',
    colors: {
      background: '#0B132B',
      card: '#1C2541',
      cardShadow: 'rgba(5, 10, 24, 0.6)',
      text: '#E0FBFC',
      accent: '#98C1D9',
      divider: '#161d36'
    },
    fontFamily: 'sans'
  },
  {
    id: 'dark-academia',
    name: 'Dark Academia',
    category: 'Dark & Atmospheric',
    colors: {
      background: '#2C3627',
      card: '#1D241A',
      cardShadow: 'rgba(0,0,0,0.7)',
      text: '#D4AF37',
      accent: '#AA8C2B',
      divider: '#141812'
    },
    fontFamily: 'mono'
  },
  {
    id: 'solar-eclipse',
    name: 'Solar Eclipse',
    category: 'Dark & Atmospheric',
    colors: {
      background: '#050505',
      card: '#111111',
      cardShadow: 'rgba(255, 170, 0, 0.1)',
      text: '#FFAA00',
      accent: '#FF8800',
      divider: '#1a1a1a'
    },
    fontFamily: 'sans',
    effects: { glow: true }
  },

  // Retro & Cyber
  {
    id: 'cyberpunk',
    name: 'Cyberpunk Neon',
    category: 'Retro & Cyber',
    colors: {
      background: '#0D0221',
      card: '#260451',
      cardShadow: 'rgba(255, 0, 255, 0.3)',
      text: '#00FFFF',
      accent: '#FF00FF',
      divider: '#1a0338'
    },
    fontFamily: 'mono',
    effects: { glow: true }
  },
  {
    id: 'vaporwave',
    name: 'Vaporwave Sunset',
    category: 'Retro & Cyber',
    colors: {
      background: '#2B00FF', // Will be overridden by gradient in App
      card: 'rgba(255, 255, 255, 0.2)',
      cardShadow: 'rgba(255, 0, 204, 0.4)',
      text: '#00FFFF',
      accent: '#FF00CC',
      divider: 'rgba(255,255,255,0.1)'
    },
    fontFamily: 'sans'
  },
  {
    id: 'crt-terminal',
    name: 'Retro Terminal',
    category: 'Retro & Cyber',
    colors: {
      background: '#000000',
      card: '#0a0a0a',
      cardShadow: 'rgba(0, 255, 0, 0.1)',
      text: '#33FF00',
      accent: '#33FF00',
      divider: '#050505'
    },
    fontFamily: 'mono',
    effects: { crt: true, glow: true }
  },
  {
    id: 'arcade-80s',
    name: '80s Arcade',
    category: 'Retro & Cyber',
    colors: {
      background: '#1A0B2E',
      card: '#291147',
      cardShadow: 'rgba(255, 107, 0, 0.4)',
      text: '#FFD700',
      accent: '#FF6B00',
      divider: '#200c3a'
    },
    fontFamily: 'mono'
  },

  // Modern & Minimal
  {
    id: 'nord-frost',
    name: 'Nord Frost',
    category: 'Modern & Minimal',
    colors: {
      background: '#2E3440',
      card: '#eceff4',
      cardShadow: 'rgba(0,0,0,0.2)',
      text: '#2e3440',
      accent: '#5E81AC',
      divider: '#e5e9f0'
    },
    fontFamily: 'sans'
  },
  {
    id: 'lavender-haze',
    name: 'Lavender Haze',
    category: 'Modern & Minimal',
    colors: {
      background: '#E6E6FA', // Or gradient
      card: 'rgba(255,255,255,0.6)',
      cardShadow: 'rgba(75, 0, 130, 0.1)',
      text: '#4B0082',
      accent: '#9370DB',
      divider: 'rgba(255,255,255,0.3)'
    },
    fontFamily: 'sans'
  },
  {
    id: 'pure-light',
    name: 'Pure Light',
    category: 'Modern & Minimal',
    colors: {
      background: '#F8F9FA',
      card: '#FFFFFF',
      cardShadow: 'rgba(0,0,0,0.05)',
      text: '#212529',
      accent: '#495057',
      divider: '#F1F3F5'
    },
    fontFamily: 'sans'
  }
];

export const defaultTheme = themes.find(t => t.id === 'classic-black') || themes[0];
