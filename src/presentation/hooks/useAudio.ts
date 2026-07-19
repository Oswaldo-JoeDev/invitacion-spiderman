// src/presentation/hooks/useAudio.ts
import { useState, useEffect, useRef } from 'react';

export const useAudio = (audioUrl: string) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const wasPlayingRef = useRef(false);

  useEffect(() => {
    const audio = new Audio(audioUrl);
    audio.loop = true;
    audioRef.current = audio;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (audioRef.current && !audioRef.current.paused) {
          wasPlayingRef.current = true;
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          wasPlayingRef.current = false;
        }
      } else {
        if (wasPlayingRef.current && audioRef.current) {
          audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(e => console.warn(e));
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      audio.pause();
      audioRef.current = null;
    };
  }, [audioUrl]);

  const initAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
  };

  const playThwip = () => {
    try {
      initAudioContext();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const duration = 0.22;
      const now = ctx.currentTime;

      // Create white noise buffer
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;

      // Bandpass sweep filter
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(12, now);
      filter.frequency.setValueAtTime(8000, now);
      filter.frequency.exponentialRampToValueAtTime(700, now + duration);

      // Gain Envelope
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.exponentialRampToValueAtTime(0.7, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

      // Pitch Bend Oscillator
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(10, now + 0.07);
      oscGain.gain.setValueAtTime(0.35, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      // Connections
      noiseSource.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      noiseSource.start(now);
      noiseSource.stop(now + duration);
      osc.start(now);
      osc.stop(now + 0.07);
    } catch (e) {
      console.warn("Web Audio synthesis failed.", e);
    }
  };

  const playHoverClick = () => {
    try {
      initAudioContext();
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);
      
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    playThwip();

    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(e => console.warn(e));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const forcePlayMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.play().then(() => setIsPlaying(true)).catch(e => console.warn(e));
  };

  return {
    isPlaying,
    toggleMusic,
    forcePlayMusic,
    playThwip,
    playHoverClick
  };
};
