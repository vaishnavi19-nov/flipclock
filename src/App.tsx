import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Timer as TimerIcon, Clock as ClockIcon, BarChart3 } from 'lucide-react';
import { useTime } from './hooks/useTime';
import { useSound } from './hooks/useSound';
import { FlipClock } from './components/FlipClock';
import { SettingsPanel } from './components/SettingsPanel';
import { TimerControls } from './components/TimerControls';
import { FloatingBackground } from './components/FloatingBackground';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { useTimer } from './hooks/useTimer';
import { useTimeTracker } from './hooks/useTimeTracker';
import { defaultTheme } from './lib/themes';
import type { Theme } from './lib/themes';

function App() {
  const [activeTheme, setActiveTheme] = useState<Theme>(defaultTheme);
  const [is24Hour, setIs24Hour] = useState(false);
  const [showSeconds, setShowSeconds] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [prevSeconds, setPrevSeconds] = useState<string>('');

  const [appMode, setAppMode] = useState<'clock' | 'timer'>('clock');
  const [timerSetup, setTimerSetup] = useState({ h: 0, m: 5, s: 0 });
  
  const timer = useTimer();
  const isTimerActive = appMode === 'timer' && timer.isRunning;
  const { stats, resetStats } = useTimeTracker(isTimerActive);

  // Close analytics panel if switching back to normal clock mode
  useEffect(() => {
    if (appMode === 'clock') {
      setAnalyticsOpen(false);
    }
  }, [appMode]);

  const { hours, minutes, seconds, ampm } = useTime(!is24Hour);
  const { initAudio, playTick } = useSound(soundEnabled);

  // Apply theme colors to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--background', activeTheme.colors.background);
    root.style.setProperty('--card', activeTheme.colors.card);
    root.style.setProperty('--card-shadow', activeTheme.colors.cardShadow);
    root.style.setProperty('--text', activeTheme.colors.text);
    root.style.setProperty('--accent', activeTheme.colors.accent);
    root.style.setProperty('--divider', activeTheme.colors.divider);
    
    // Remove previous fonts
    root.classList.remove('font-sans', 'font-mono');
    // Add new font
    root.classList.add(`font-${activeTheme.fontFamily}`);

  }, [activeTheme]);

  // Handle tick sound
  useEffect(() => {
    const currentSeconds = appMode === 'clock' ? seconds : timer.seconds;
    if (currentSeconds !== prevSeconds) {
      setPrevSeconds(currentSeconds);
      if (soundEnabled && (appMode === 'clock' || timer.isRunning)) {
        playTick();
      }
    }
  }, [seconds, timer.seconds, timer.isRunning, prevSeconds, soundEnabled, playTick, appMode]);

  // Initialize audio context on first user interaction to comply with browser autoplay policies
  useEffect(() => {
    const handleInteraction = () => {
      initAudio();
      window.removeEventListener('click', handleInteraction);
    };
    window.addEventListener('click', handleInteraction);
    return () => window.removeEventListener('click', handleInteraction);
  }, [initAudio]);

  // Fullscreen handling
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
  const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  let displayHours = hours;
  let displayMinutes = minutes;
  let displaySeconds = seconds;
  let displayAmpm = !is24Hour ? ampm : undefined;

  if (appMode === 'timer') {
    displayAmpm = undefined;
    if (timer.isIdle) {
      displayHours = timerSetup.h.toString().padStart(2, '0');
      displayMinutes = timerSetup.m.toString().padStart(2, '0');
      displaySeconds = timerSetup.s.toString().padStart(2, '0');
    } else {
      displayHours = timer.hours;
      displayMinutes = timer.minutes;
      displaySeconds = timer.seconds;
    }
  }

  return (
    <div className={`relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden transition-colors duration-1000 ${activeTheme.id === 'vaporwave' ? 'bg-gradient-to-br from-magenta-500 to-cyan-500' : ''}`}>
      
      {/* 3D Floating Theme Background */}
      <FloatingBackground themeId={activeTheme.id} />

      {/* Visual Effects */}
      {activeTheme.effects?.crt && <div className="crt-overlay" />}
      {activeTheme.effects?.noise && <div className="noise-overlay" />}
      {activeTheme.effects?.glow && <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[var(--accent)]/20 via-transparent to-transparent pointer-events-none" />}

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center">
        
        {/* Flip Clock */}
        <FlipClock hours={displayHours} minutes={displayMinutes} seconds={displaySeconds} ampm={displayAmpm} showSeconds={showSeconds} />
        
        {/* Timer Controls */}
        {appMode === 'timer' && (
          <TimerControls 
            hours={timerSetup.h} 
            minutes={timerSetup.m} 
            seconds={timerSetup.s}
            setHours={(h) => setTimerSetup(prev => ({...prev, h}))}
            setMinutes={(m) => setTimerSetup(prev => ({...prev, m}))}
            setSeconds={(sec) => setTimerSetup(prev => ({...prev, s: sec}))}
            isRunning={timer.isRunning}
            isPaused={timer.isPaused}
            isIdle={timer.isIdle}
            onStart={() => timer.start(timerSetup.h * 3600 + timerSetup.m * 60 + timerSetup.s)}
            onPause={timer.pause}
            onResume={timer.resume}
            onReset={timer.reset}
          />
        )}
      </main>

      {/* Floating Action Buttons */}
      <div className="absolute bottom-8 right-8 flex space-x-4 z-30">
        {appMode === 'timer' && (
          <button 
            onClick={() => setAnalyticsOpen(true)}
            className="p-3 md:p-4 rounded-full bg-card shadow-lg border border-divider text-text hover:scale-110 hover:shadow-[var(--glow)] transition-all duration-300"
            aria-label="Time Analytics"
            title="Time Category Breakdown"
          >
            <BarChart3 size={24} className="opacity-70 group-hover:opacity-100" />
          </button>
        )}
        <button 
          onClick={() => setAppMode(m => m === 'clock' ? 'timer' : 'clock')}
          className="p-3 md:p-4 rounded-full bg-card shadow-lg border border-divider text-text hover:scale-110 hover:shadow-[var(--glow)] transition-all duration-300"
          aria-label={appMode === 'clock' ? "Switch to Timer" : "Switch to Clock"}
        >
          {appMode === 'clock' ? <TimerIcon size={24} className="opacity-70 group-hover:opacity-100" /> : <ClockIcon size={24} className="opacity-70 group-hover:opacity-100" />}
        </button>
        <button 
          onClick={() => setSettingsOpen(true)}
          className="p-3 md:p-4 rounded-full bg-card shadow-lg border border-divider text-text hover:scale-110 hover:shadow-[var(--glow)] transition-all duration-300"
          aria-label="Settings"
        >
          <SettingsIcon size={24} className="opacity-70 group-hover:opacity-100" />
        </button>
      </div>

      {/* Analytics Panel */}
      <AnalyticsPanel
        isOpen={analyticsOpen}
        onClose={() => setAnalyticsOpen(false)}
        stats={stats}
        onReset={resetStats}
      />

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        activeTheme={activeTheme}
        onThemeChange={setActiveTheme}
        is24Hour={is24Hour}
        onFormatChange={setIs24Hour}
        showSeconds={showSeconds}
        onShowSecondsChange={setShowSeconds}
        soundEnabled={soundEnabled}
        onSoundToggle={() => setSoundEnabled(!soundEnabled)}
        isFullscreen={isFullscreen}
        onFullscreenToggle={toggleFullscreen}
      />
    </div>
  );
}

export default App;
