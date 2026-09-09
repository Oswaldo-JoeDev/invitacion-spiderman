// src/presentation/hooks/useAudio.ts
import { useState, useEffect, useRef, useMemo } from 'react';

export const useAudio = (
  playlistInput: string | string[] = ['/sunflower.mp3', '/amidreaming.mp3']
) => {
  const playlist = useMemo(() => {
    return Array.isArray(playlistInput) ? playlistInput : [playlistInput];
  }, [playlistInput]);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const wasPlayingRef = useRef(false);
  const isTransitioningRef = useRef(false);

  // Initialize and handle playback of current track in playlist
  useEffect(() => {
    const currentSrc = playlist[currentTrackIndex];
    const audio = new Audio(currentSrc);
    audio.loop = false; // Native loop disabled so 'ended' event triggers for playlist transition
    audio.volume = 1.0;
    audioRef.current = audio;

    // Smooth volume fade out and switch to next track on ended
    const handleEnded = () => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;

      // Smooth volume level change fade out before switching
      let vol = audio.volume;
      const fadeInterval = setInterval(() => {
        vol = Math.max(0, vol - 0.15);
        audio.volume = vol;
        if (vol <= 0) {
          clearInterval(fadeInterval);
          // Advance to next track in loop (e.g. 0 -> 1 -> 0 -> 1...)
          setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
        }
      }, 50);
    };

    audio.addEventListener('ended', handleEnded);

    // Auto-play next track smoothly if music was currently active
    if (isPlaying || isTransitioningRef.current) {
      audio.volume = 0;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          isTransitioningRef.current = false;
          // Fade volume back in smoothly (cambio de nivel)
          let vol = 0;
          const fadeInInterval = setInterval(() => {
            vol = Math.min(1.0, vol + 0.15);
            audio.volume = vol;
            if (vol >= 1.0) clearInterval(fadeInInterval);
          }, 50);
        })
        .catch((e) => {
          console.warn('Audio play failed:', e);
          isTransitioningRef.current = false;
        });
    }

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
          audioRef.current
            .play()
            .then(() => setIsPlaying(true))
            .catch((e) => console.warn(e));
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, [currentTrackIndex, playlist]);

  const initAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
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
      console.warn('Web Audio synthesis failed.', e);
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
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.warn(e));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const forcePlayMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((e) => console.warn(e));
  };

  return {
    isPlaying,
    currentTrack: playlist[currentTrackIndex],
    currentTrackIndex,
    toggleMusic,
    forcePlayMusic,
    playThwip,
    playHoverClick,
  };
};
