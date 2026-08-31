import { motion } from 'framer-motion';
import { X, Volume2, VolumeX, Maximize, Minimize, Moon, Sun, Clock } from 'lucide-react';
import { themes } from '../lib/themes';
import type { Theme } from '../lib/themes';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  is24Hour: boolean;
  onFormatChange: (is24: boolean) => void;
  showSeconds: boolean;
  onShowSecondsChange: (show: boolean) => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
  isFullscreen: boolean;
  onFullscreenToggle: () => void;
}

export const SettingsPanel = ({
  isOpen,
  onClose,
  activeTheme,
  onThemeChange,
  is24Hour,
  onFormatChange,
  showSeconds,
  onShowSecondsChange,
  soundEnabled,
  onSoundToggle,
  isFullscreen,
  onFullscreenToggle
}: SettingsPanelProps) => {
  
  const categories = Array.from(new Set(themes.map(t => t.category)));

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Slide-out Panel */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-card/80 backdrop-blur-xl border-l border-divider z-50 p-6 overflow-y-auto shadow-2xl glass-panel text-text"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Appearance</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Toggles */}
        <div className="space-y-4 mb-10">
          <h3 className="text-sm font-semibold uppercase tracking-wider opacity-60 mb-4">Preferences</h3>
          
          <div className="flex items-center justify-between p-4 rounded-xl glass-panel-dark">
            <div className="flex items-center space-x-3">
              {is24Hour ? <Moon size={20} /> : <Sun size={20} />}
              <span className="font-medium">Time Format</span>
            </div>
            <div className="flex bg-black/20 p-1 rounded-lg">
              <button 
                onClick={() => onFormatChange(false)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${!is24Hour ? 'bg-accent text-white shadow-lg' : 'opacity-70 hover:opacity-100'}`}
              >
                12h
              </button>
              <button 
                onClick={() => onFormatChange(true)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${is24Hour ? 'bg-accent text-white shadow-lg' : 'opacity-70 hover:opacity-100'}`}
              >
                24h
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl glass-panel-dark">
            <div className="flex items-center space-x-3">
              <Clock size={20} />
              <span className="font-medium">Clock Display</span>
            </div>
            <div className="flex bg-black/20 p-1 rounded-lg">
              <button 
                onClick={() => onShowSecondsChange(true)}
                className={`px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${showSeconds ? 'bg-accent text-white shadow-lg' : 'opacity-70 hover:opacity-100'}`}
              >
                HH:MM:SS
              </button>
              <button 
                onClick={() => onShowSecondsChange(false)}
                className={`px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-colors ${!showSeconds ? 'bg-accent text-white shadow-lg' : 'opacity-70 hover:opacity-100'}`}
              >
                HH:MM
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl glass-panel-dark">
            <div className="flex items-center space-x-3">
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              <span className="font-medium">Ambient Tick</span>
            </div>
            <button 
              onClick={onSoundToggle}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${soundEnabled ? 'bg-accent' : 'bg-black/30'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl glass-panel-dark">
            <div className="flex items-center space-x-3">
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
              <span className="font-medium">Fullscreen</span>
            </div>
            <button 
              onClick={onFullscreenToggle}
              className="p-2 rounded-lg bg-black/20 hover:bg-black/30 transition-colors"
            >
              {isFullscreen ? 'Exit' : 'Enter'}
            </button>
          </div>
        </div>

        {/* Theme Selection */}
        <div className="space-y-8">
          <h3 className="text-sm font-semibold uppercase tracking-wider opacity-60">Themes</h3>
          
          {categories.map(category => (
            <div key={category} className="space-y-3">
              <h4 className="text-xs font-medium opacity-50">{category}</h4>
              <div className="grid grid-cols-2 gap-3">
                {themes.filter(t => t.category === category).map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => onThemeChange(theme)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all border-2 
                      ${activeTheme.id === theme.id ? 'border-accent shadow-lg scale-[1.02]' : 'border-transparent hover:bg-black/5 hover:border-white/10'}
                    `}
                    style={{ backgroundColor: theme.colors.background }}
                  >
                    <div 
                      className="w-full h-8 rounded-md mb-2 shadow-sm border border-black/10 flex items-center justify-center"
                      style={{ backgroundColor: theme.colors.card, color: theme.colors.text }}
                    >
                      <span className="text-xs font-bold font-mono">12:34</span>
                    </div>
                    <span className="text-xs font-medium text-center line-clamp-1 w-full" style={{ color: theme.colors.text }}>
                      {theme.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
};
