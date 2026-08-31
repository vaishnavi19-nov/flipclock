import { useRef, useCallback } from 'react';

// A simple tick sound generated via Web Audio API to avoid external assets
export function useSound(enabled: boolean) {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  const playTick = useCallback(() => {
    if (!enabled || !audioCtxRef.current) return;
    
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    const osc = audioCtxRef.current.createOscillator();
    const gainNode = audioCtxRef.current.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtxRef.current.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, audioCtxRef.current.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0.1, audioCtxRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtxRef.current.currentTime + 0.05);

    osc.connect(gainNode);
    gainNode.connect(audioCtxRef.current.destination);

    osc.start();
    osc.stop(audioCtxRef.current.currentTime + 0.05);
  }, [enabled]);

  return { initAudio, playTick };
}
