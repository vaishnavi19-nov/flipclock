import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface FloatingBackgroundProps {
  themeId: string;
}

interface ElementConfig {
  id: number;
  x: number; // percentage 0-90
  y: number; // percentage 0-85
  z: number; // translateZ in px (-250 to 250)
  scale: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  duration: number;
  delay: number;
}

// Generate consistent positions and depth layering for elements
const generateElements = (count: number): ElementConfig[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (i * 19 + 7 * (i % 5)) % 88 + 6,
    y: (i * 24 + 11 * (i % 4)) % 82 + 8,
    z: ((i % 5) * 90) - 180,
    scale: 0.75 + (i % 4) * 0.25,
    rotateX: (i * 35) % 360,
    rotateY: (i * 55) % 360,
    rotateZ: (i * 25) % 360,
    duration: 10 + (i % 5) * 3.5,
    delay: i * 0.35,
  }));
};

const THEME_ELEMENTS_COUNT = 12;
const elementConfigs = generateElements(THEME_ELEMENTS_COUNT);

/* ==========================================================================
   CUSTOM FRAMELESS SVG SYMBOLS
   ========================================================================== */

// 1. Headphones (Lofi Study)
const HeadphonesSVG = ({ className = "w-14 h-14" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className}>
    <path d="M12 36 C12 20, 20 12, 32 12 C44 12, 52 20, 52 36" stroke="#5E503F" strokeWidth="5" strokeLinecap="round" />
    <rect x="8" y="32" width="10" height="20" rx="5" fill="#C6AC8F" stroke="#5E503F" strokeWidth="3" />
    <rect x="46" y="32" width="10" height="20" rx="5" fill="#C6AC8F" stroke="#5E503F" strokeWidth="3" />
    <path d="M18 16 C22 14, 42 14, 46 16" stroke="#FFB5A7" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// 2. Tea Cup & Saucer (Matcha Latte)
const TeaCupSVG = ({ className = "w-14 h-14" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className}>
    <path d="M14 44 C14 52, 50 52, 50 44 L46 24 L18 24 Z" fill="#94AF9F" stroke="#1e382b" strokeWidth="3" />
    <path d="M46 28 C54 28, 54 40, 46 40" stroke="#1e382b" strokeWidth="3" fill="none" strokeLinecap="round" />
    <ellipse cx="32" cy="52" rx="24" ry="4" fill="#DBE7C9" stroke="#7c9687" strokeWidth="3" />
    {/* Steam */}
    <path d="M24 18 C26 12, 22 8, 24 4" stroke="#7c9687" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    <path d="M32 16 C34 10, 30 6, 32 2" stroke="#7c9687" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    <path d="M40 18 C42 12, 38 8, 40 4" stroke="#7c9687" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
  </svg>
);

// Leaf (Matcha Latte)
const LeafSVG = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className}>
    <path d="M12 52 C12 52, 16 20, 52 12 C52 12, 48 44, 12 52 Z" fill="#94AF9F" stroke="#1e382b" strokeWidth="3" />
    <path d="M12 52 C24 38, 38 24, 52 12" stroke="#1e382b" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// 3. Sakura Flower (Sakura Blossom)
const SakuraFlowerSVG = ({ className = "w-14 h-14" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className}>
    <g fill="#FFB6C1" stroke="#C71585" strokeWidth="2.5">
      {/* 5 Petals */}
      <path d="M32 32 C26 18, 38 18, 32 6 C26 18, 38 18, 32 32 Z" />
      <path d="M32 32 C46 26, 46 38, 58 32 C46 26, 46 38, 32 32 Z" />
      <path d="M32 32 C38 46, 26 46, 32 58 C38 46, 26 46, 32 32 Z" />
      <path d="M32 32 C18 38, 18 26, 6 32 C18 38, 18 26, 32 32 Z" />
      <path d="M32 32 C20 20, 16 32, 14 16 C26 24, 24 30, 32 32 Z" />
    </g>
    <circle cx="32" cy="32" r="5" fill="#FFF0F5" stroke="#C71585" strokeWidth="2" />
    <path d="M32 32 L32 24 M32 32 L38 30 M32 32 L35 36 M32 32 L28 36 M32 32 L26 30" stroke="#C71585" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// Sakura Petal
const SakuraPetalSVG = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className}>
    <path d="M20 4 C32 14, 38 28, 20 38 C2 28, 8 14, 20 4 Z" fill="#FFC0CB" stroke="#C71585" strokeWidth="2" opacity="0.9" />
  </svg>
);

// 4. Coffee Beans (Espresso Roast)
const CoffeeBeanSVG = ({ className = "w-12 h-14" }: { className?: string }) => (
  <svg viewBox="0 0 48 64" fill="none" className={className}>
    <ellipse cx="24" cy="32" rx="20" ry="28" fill="#3C2A21" stroke="#D5CEA3" strokeWidth="3" />
    <path d="M24 8 C16 20, 32 44, 24 56" stroke="#1A120B" strokeWidth="4" strokeLinecap="round" fill="none" />
  </svg>
);

// Coffee Mug (Espresso Roast)
const CoffeeMugSVG = ({ className = "w-14 h-14" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className}>
    <rect x="12" y="20" width="34" height="34" rx="6" fill="#1A120B" stroke="#D5CEA3" strokeWidth="3.5" />
    <path d="M46 26 C56 26, 56 42, 46 42" stroke="#D5CEA3" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    {/* Steam */}
    <path d="M22 14 C24 8, 20 4, 22 0" stroke="#E5E5CB" strokeWidth="2" strokeLinecap="round" />
    <path d="M34 14 C36 8, 32 4, 34 0" stroke="#E5E5CB" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 5. Stars (Classic Black)
const StarSVG = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className}>
    <path d="M20 0 L24 16 L40 20 L24 24 L20 40 L16 24 L0 20 L16 16 Z" fill="#FFFFFF" opacity="0.9" />
    <circle cx="20" cy="20" r="3" fill="#FFFFFF" className="animate-ping" />
  </svg>
);

// 6. Chrome Heart (Monochrome Dark)
const ChromeHeartSVG = ({ className = "w-14 h-14" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className}>
    <defs>
      <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="30%" stopColor="#E0E0E0" />
        <stop offset="50%" stopColor="#4A4A4A" />
        <stop offset="70%" stopColor="#CCCCCC" />
        <stop offset="100%" stopColor="#1E1E1E" />
      </linearGradient>
    </defs>
    <path d="M32 56 C32 56, 6 36, 6 20 C6 10, 16 4, 26 10 C32 14, 32 14, 32 14 C32 14, 32 14, 38 10 C48 4, 58 10, 58 20 C58 36, 32 56, 32 56 Z" 
      fill="url(#chromeGrad)" stroke="#FFFFFF" strokeWidth="2.5" />
    <path d="M14 16 C18 10, 24 10, 26 14" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
  </svg>
);

// 7. Stereographer / Vintage Camera / Telescope (Dark Academia)
const StereographerSVG = ({ className = "w-14 h-14" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className}>
    <rect x="8" y="24" width="48" height="28" rx="4" fill="#1D241A" stroke="#D4AF37" strokeWidth="3" />
    {/* Dual Lenses for Stereographer */}
    <circle cx="22" cy="38" r="8" fill="#2C3627" stroke="#D4AF37" strokeWidth="2.5" />
    <circle cx="22" cy="38" r="4" fill="#D4AF37" />
    <circle cx="42" cy="38" r="8" fill="#2C3627" stroke="#D4AF37" strokeWidth="2.5" />
    <circle cx="42" cy="38" r="4" fill="#D4AF37" />
    <path d="M26 18 L38 18 L34 24 L30 24 Z" fill="#D4AF37" stroke="#D4AF37" strokeWidth="2" />
  </svg>
);

// Books (Dark Academia)
const BooksSVG = ({ className = "w-14 h-14" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className}>
    <rect x="8" y="44" width="44" height="10" rx="2" fill="#1D241A" stroke="#D4AF37" strokeWidth="2.5" />
    <rect x="12" y="32" width="40" height="10" rx="2" fill="#2C3627" stroke="#AA8C2B" strokeWidth="2.5" />
    <rect x="16" y="20" width="32" height="10" rx="2" fill="#1D241A" stroke="#D4AF37" strokeWidth="2.5" />
    <path d="M12 20 L12 54 M48 20 L48 54" stroke="#D4AF37" strokeWidth="2" />
  </svg>
);

// 8. Sun & Corona (Solar Eclipse)
const SunSVG = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className}>
    <circle cx="32" cy="32" r="18" fill="#050505" stroke="#FFAA00" strokeWidth="4" />
    {/* Sun Rays / Corona Flares */}
    <path d="M32 4 L32 10 M32 54 L32 60 M4 32 L10 32 M54 32 L60 32 M12 12 L16 16 M48 48 L52 52 M12 52 L16 48 M48 16 L52 12" 
      stroke="#FF8800" strokeWidth="3" strokeLinecap="round" />
    <circle cx="32" cy="32" r="22" stroke="#FFAA00" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.8" />
  </svg>
);

// Planet (Solar Eclipse)
const PlanetSVG = ({ className = "w-16 h-16" }: { className?: string }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className}>
    <circle cx="32" cy="32" r="14" fill="#FF8800" stroke="#FFAA00" strokeWidth="2" />
    <ellipse cx="32" cy="32" rx="28" ry="8" stroke="#FFAA00" strokeWidth="3" fill="none" transform="rotate(-20 32 32)" />
  </svg>
);

// 9. Cyber Building / Skyscrapers (Cyberpunk)
const CyberBuildingSVG = ({ className = "w-14 h-20" }: { className?: string }) => (
  <svg viewBox="0 0 48 80" fill="none" className={className}>
    <rect x="8" y="16" width="32" height="60" fill="#0D0221" stroke="#00FFFF" strokeWidth="2.5" />
    <line x1="24" y1="0" x2="24" y2="16" stroke="#FF00FF" strokeWidth="3" />
    <circle cx="24" cy="4" r="3" fill="#FF00FF" />
    {/* Cyber Windows */}
    <rect x="14" y="24" width="6" height="8" fill="#FF00FF" />
    <rect x="28" y="24" width="6" height="8" fill="#00FFFF" />
    <rect x="14" y="38" width="6" height="8" fill="#00FFFF" />
    <rect x="28" y="38" width="6" height="8" fill="#FF00FF" />
    <rect x="14" y="52" width="6" height="8" fill="#FF00FF" />
    <rect x="28" y="52" width="6" height="8" fill="#00FFFF" />
  </svg>
);

// Neon Symbols (Cyberpunk)
const NeonSymbolSVG = ({ className = "w-12 h-12" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M28 4 L12 26 L24 26 L20 44 L36 22 L24 22 Z" fill="#00FFFF" stroke="#FF00FF" strokeWidth="2" />
  </svg>
);

// 10. Palm Tree (Vaporwave Sunset)
const PalmTreeSVG = ({ className = "w-16 h-20" }: { className?: string }) => (
  <svg viewBox="0 0 64 80" fill="none" className={className}>
    <path d="M28 76 C30 50, 36 30, 32 20" stroke="#FF00CC" strokeWidth="5" strokeLinecap="round" />
    {/* Fronds */}
    <path d="M32 20 C20 10, 4 16, 2 24" stroke="#00FFFF" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    <path d="M32 20 C44 10, 60 16, 62 24" stroke="#00FFFF" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    <path d="M32 20 C18 20, 6 34, 4 42" stroke="#FF00CC" strokeWidth="3.5" strokeLinecap="round" fill="none" />
    <path d="M32 20 C46 20, 58 34, 60 42" stroke="#FF00CC" strokeWidth="3.5" strokeLinecap="round" fill="none" />
  </svg>
);

// 11. Retro Radio Boombox (Retro Terminal)
const RetroRadioSVG = ({ className = "w-16 h-14" }: { className?: string }) => (
  <svg viewBox="0 0 64 48" fill="none" className={className}>
    <rect x="6" y="16" width="52" height="28" rx="3" fill="#000000" stroke="#33FF00" strokeWidth="2.5" />
    {/* Speakers */}
    <circle cx="18" cy="30" r="8" fill="#050505" stroke="#33FF00" strokeWidth="2" />
    <circle cx="46" cy="30" r="8" fill="#050505" stroke="#33FF00" strokeWidth="2" />
    {/* Cassette Deck */}
    <rect x="28" y="24" width="8" height="12" stroke="#33FF00" strokeWidth="1.5" />
    {/* Antenna & Handle */}
    <path d="M12 16 L12 8 L52 8 L52 16" stroke="#33FF00" strokeWidth="2" strokeLinecap="round" />
    <line x1="16" y1="8" x2="4" y2="0" stroke="#33FF00" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Retro Boots (Retro Terminal)
const RetroBootsSVG = ({ className = "w-14 h-14" }: { className?: string }) => (
  <svg viewBox="0 0 56 56" fill="none" className={className}>
    <path d="M16 8 L30 8 L30 32 L46 36 L46 46 L14 46 L14 14 Z" fill="#000000" stroke="#33FF00" strokeWidth="2.5" strokeLinejoin="round" />
    <line x1="20" y1="16" x2="26" y2="16" stroke="#33FF00" strokeWidth="2" />
    <line x1="20" y1="22" x2="26" y2="22" stroke="#33FF00" strokeWidth="2" />
    <line x1="20" y1="28" x2="26" y2="28" stroke="#33FF00" strokeWidth="2" />
  </svg>
);

// 12. Arcade Machine (80s Arcade)
const ArcadeMachineSVG = ({ className = "w-14 h-20" }: { className?: string }) => (
  <svg viewBox="0 0 48 72" fill="none" className={className}>
    <path d="M8 8 L40 8 L44 24 L38 42 L42 68 L6 68 L10 42 L4 24 Z" fill="#1A0B2E" stroke="#FFD700" strokeWidth="3" strokeLinejoin="round" />
    {/* Marquee Banner */}
    <rect x="12" y="12" width="24" height="8" fill="#FF6B00" stroke="#FFD700" strokeWidth="1.5" />
    {/* Screen */}
    <rect x="12" y="24" width="24" height="16" fill="#000000" stroke="#FF6B00" strokeWidth="2" />
    <circle cx="20" cy="32" r="2" fill="#FFD700" />
    <circle cx="28" cy="30" r="3" fill="#FF6B00" />
    {/* Control Panel / Joystick */}
    <line x1="18" y1="50" x2="18" y2="44" stroke="#FF6B00" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="18" cy="43" r="3" fill="#FF6B00" />
    <circle cx="28" cy="48" r="2" fill="#FFD700" />
    <circle cx="34" cy="46" r="2" fill="#FF6B00" />
  </svg>
);

// 13. Chic Coat (Nord Frost / Chic Minimal)
const ChicCoatSVG = ({ className = "w-14 h-18" }: { className?: string }) => (
  <svg viewBox="0 0 56 72" fill="none" className={className}>
    <path d="M18 8 L28 18 L38 8 L48 20 L42 66 L14 66 L8 20 Z" fill="#ECEFF4" stroke="#5E81AC" strokeWidth="3" strokeLinejoin="round" />
    <path d="M28 18 L28 66" stroke="#5E81AC" strokeWidth="2" />
    <path d="M14 20 L28 32 L42 20" stroke="#5E81AC" strokeWidth="2" strokeLinecap="round" />
    {/* Buttons */}
    <circle cx="32" cy="38" r="2" fill="#5E81AC" />
    <circle cx="32" cy="48" r="2" fill="#5E81AC" />
  </svg>
);

// Chic Pants (Nord Frost / Chic Minimal)
const ChicPantsSVG = ({ className = "w-12 h-18" }: { className?: string }) => (
  <svg viewBox="0 0 48 72" fill="none" className={className}>
    <path d="M10 8 L38 8 L42 66 L27 66 L24 30 L21 66 L6 66 Z" fill="#ECEFF4" stroke="#5E81AC" strokeWidth="3" strokeLinejoin="round" />
    <line x1="10" y1="16" x2="38" y2="16" stroke="#5E81AC" strokeWidth="2" />
  </svg>
);

// 14. Lavender Flowers (Lavender Haze)
const LavenderFlowerSVG = ({ className = "w-12 h-20" }: { className?: string }) => (
  <svg viewBox="0 0 40 80" fill="none" className={className}>
    <path d="M20 78 L20 20" stroke="#4B0082" strokeWidth="2.5" strokeLinecap="round" />
    {/* Flower Clusters */}
    <g fill="#9370DB" stroke="#4B0082" strokeWidth="1.5">
      <circle cx="20" cy="14" r="5" />
      <circle cx="14" cy="22" r="5" />
      <circle cx="26" cy="22" r="5" />
      <circle cx="13" cy="32" r="5.5" />
      <circle cx="27" cy="32" r="5.5" />
      <circle cx="14" cy="42" r="5" />
      <circle cx="26" cy="42" r="5" />
      <circle cx="16" cy="52" r="4.5" />
      <circle cx="24" cy="52" r="4.5" />
    </g>
  </svg>
);

// 15. Light Bulb (Pure Light)
const LightBulbSVG = ({ className = "w-14 h-18" }: { className?: string }) => (
  <svg viewBox="0 0 56 72" fill="none" className={className}>
    <path d="M16 28 C16 14, 40 14, 40 28 C40 36, 34 40, 34 48 L22 48 C22 40, 16 36, 16 28 Z" fill="#FFFFFF" stroke="#495057" strokeWidth="3" />
    <rect x="22" y="48" width="12" height="10" rx="2" fill="#E9ECEF" stroke="#495057" strokeWidth="2" />
    <path d="M25 58 C25 62, 31 62, 31 58" stroke="#495057" strokeWidth="2" strokeLinecap="round" fill="none" />
    {/* Filament */}
    <path d="M24 36 L26 26 L30 26 L32 36" stroke="#FFD700" strokeWidth="2" fill="none" strokeLinecap="round" />
  </svg>
);


/* ==========================================================================
   MAIN FLOATING BACKGROUND COMPONENT
   ========================================================================== */

export const FloatingBackground: React.FC<FloatingBackgroundProps> = ({ themeId }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) * 2 - 1;
      const y = (e.clientY / innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const renderSymbol = (id: number) => {
    switch (themeId) {
      // 1. Lofi Study Room: Headphone floaters, tea/coffee, vinyl
      case 'lofi-study': {
        return id % 2 === 0 ? <HeadphonesSVG /> : <TeaCupSVG />;
      }

      // 2. Matcha Latte: Leaf and tea cup
      case 'matcha-latte': {
        return id % 2 === 0 ? <TeaCupSVG /> : <LeafSVG />;
      }

      // 3. Sakura Blossom: Petals and sakura flowers
      case 'sakura': {
        return id % 2 === 0 ? <SakuraFlowerSVG /> : <SakuraPetalSVG />;
      }

      // 4. Espresso Roast: Coffee beans and mug
      case 'espresso': {
        return id % 2 === 0 ? <CoffeeMugSVG /> : <CoffeeBeanSVG />;
      }

      // 5. Classic Black: Stars
      case 'classic-black': {
        return <StarSVG />;
      }

      // 6. Monochrome Dark: Chrome hearts
      case 'monochrome': {
        return <ChromeHeartSVG />;
      }

      // 7. Dark Academia: Stereographer and books
      case 'dark-academia': {
        return id % 2 === 0 ? <StereographerSVG /> : <BooksSVG />;
      }

      // 8. Solar Eclipse: Sun and planets
      case 'solar-eclipse': {
        return id % 2 === 0 ? <SunSVG /> : <PlanetSVG />;
      }

      // 9. Cyberpunk: Buildings and neon symbols
      case 'cyberpunk': {
        return id % 2 === 0 ? <CyberBuildingSVG /> : <NeonSymbolSVG />;
      }

      // 10. Vaporwave Sunset: Trees (Palm trees)
      case 'vaporwave': {
        return <PalmTreeSVG />;
      }

      // 11. Retro Terminal: Radio and boots
      case 'crt-terminal': {
        return id % 2 === 0 ? <RetroRadioSVG /> : <RetroBootsSVG />;
      }

      // 12. 80s Arcade: Arcade machine
      case 'arcade-80s': {
        return <ArcadeMachineSVG />;
      }

      // 13. Nord Frost (Modern Minimalist): Chic coats and pants
      case 'nord-frost': {
        return id % 2 === 0 ? <ChicCoatSVG /> : <ChicPantsSVG />;
      }

      // 14. Lavender Haze: Lavender flowers
      case 'lavender-haze': {
        return <LavenderFlowerSVG />;
      }

      // 15. Pure Light: Light bulbs
      case 'pure-light': {
        return <LightBulbSVG />;
      }

      // 16. Midnight Ocean: Ocean bioluminescent stars & drops
      case 'midnight-ocean':
      default: {
        return <StarSVG className="w-12 h-12 text-[#98C1D9]" />;
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d'
      }}
    >
      <motion.div
        className="w-full h-full relative"
        animate={{
          rotateX: -mousePos.y * 14,
          rotateY: mousePos.x * 14
        }}
        transition={{ type: 'spring', stiffness: 40, damping: 25 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {elementConfigs.map((item) => (
          <motion.div
            key={`${themeId}-${item.id}`}
            className="absolute transform-gpu"
            style={{
              left: `${item.x}%`,
              top: `${item.y}%`,
              transformStyle: 'preserve-3d',
            }}
            initial={{
              z: item.z,
              scale: item.scale,
              rotateX: item.rotateX,
              rotateY: item.rotateY,
              rotateZ: item.rotateZ,
              opacity: 0
            }}
            animate={{
              z: [item.z - 40, item.z + 60, item.z - 40],
              y: [-25, 30, -25],
              x: [-20, 20, -20],
              rotateX: [item.rotateX, item.rotateX + 180, item.rotateX + 360],
              rotateY: [item.rotateY, item.rotateY + 360, item.rotateY],
              rotateZ: [item.rotateZ, item.rotateZ + 90, item.rotateZ],
              opacity: [0.65, 0.95, 0.65]
            }}
            transition={{
              duration: item.duration,
              delay: item.delay,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            {/* Pure frameless symbol floating seamlessly with organic drop shadow */}
            <div className="filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.3)] hover:scale-110 transition-transform">
              {renderSymbol(item.id)}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
