// src/presentation/hooks/useAudio.ts
import { useState, useEffect, useRef, useMemo } from 'react';

export const useAudio = (
  playlistInput: string | string[] = ['/sunflower.mp3', '/amidreaming.mp3']
) => {
  const playlistKey = Array.isArray(playlistInput)
    ? playlistInput.join(',')
    : playlistInput;

  const playlist = useMemo(() => {
    return Array.isArray(playlistInput) ? playlistInput : [playlistInput];
  }, [playlistKey]);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const wasPlayingRef = useRef(false);
  const isTransitioningRef = useRef(false);

  // Initialize current track audio instance
  useEffect(() => {
    const currentSrc = playlist[currentTrackIndex];
    const audio = new Audio(currentSrc);
    audio.loop = false; // Native loop disabled so 'ended' event triggers for playlist transition
    audio.volume = wasPlayingRef.current || isTransitioningRef.current ? 0 : 1.0;
    audioRef.current = audio;

    const FADE_OUT_SECONDS = 2.5; // start fading this many seconds before the track naturally ends
    const FADE_IN_MS = 2000;

    let fadeRafId: number | null = null;
    let fadeOutStarted = false;
    let endFallbackTimer: ReturnType<typeof setTimeout> | null = null;

    const cancelFade = () => {
      if (fadeRafId !== null) {
        cancelAnimationFrame(fadeRafId);
        fadeRafId = null;
      }
    };

    const clearEndFallback = () => {
      if (endFallbackTimer !== null) {
        clearTimeout(endFallbackTimer);
        endFallbackTimer = null;
      }
    };

    // Smoothly interpolate volume over `durationMs`, driven by real elapsed time
    // (robust against setInterval throttling) so the ramp is actually audible.
    const rampVolume = (from: number, to: number, durationMs: number) => {
      cancelFade();
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        audio.volume = from + (to - from) * t;
        if (t < 1) {
          fadeRafId = requestAnimationFrame(step);
        } else {
          fadeRafId = null;
        }
      };
      fadeRafId = requestAnimationFrame(step);
    };

    // Advance to next track in loop (e.g. 0 -> 1 -> 0 -> 1...) once it truly ends
    const handleEnded = () => {
      clearEndFallback();
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      cancelFade();
      setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    };

    // Begin fading out while the track is still audibly playing, not after it stops
    const handleTimeUpdate = () => {
      if (fadeOutStarted || isNaN(audio.duration) || !isFinite(audio.duration)) return;
      const remaining = audio.duration - audio.currentTime;
      if (remaining <= FADE_OUT_SECONDS) {
        fadeOutStarted = true;
        const remainingMs = Math.max(200, remaining * 1000);
        rampVolume(audio.volume, 0, remainingMs);

        // Safety net: VBR-encoded mp3s often report an unreliable `duration`,
        // and some browsers occasionally never fire `ended` for them. Force
        // the transition if that happens so the playlist can't get stuck.
        endFallbackTimer = setTimeout(handleEnded, remainingMs + 800);
      }
    };

    // Skip a track that fails to load/play instead of silently stopping the playlist
    const handleError = () => {
      console.warn('Audio failed to load/play, skipping to next track.');
      handleEnded();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Auto-play next track smoothly if music was currently active or transitioning
    if (wasPlayingRef.current || isTransitioningRef.current) {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          isTransitioningRef.current = false;
          rampVolume(0, 1.0, FADE_IN_MS);
        })
        .catch((e) => {
          console.warn('Audio transition play error:', e);
          isTransitioningRef.current = false;
        });
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      cancelFade();
      clearEndFallback();
      audio.pause();
      audioRef.current = null;
    };
  }, [currentTrackIndex, playlistKey]);

  // Handle visibility change & window blur/focus: pause on hide/blur, resume from exact same second on focus return
  useEffect(() => {
    const handlePause = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (!audio.paused) {
        wasPlayingRef.current = true;
        audio.pause(); // Pauses at current second without resetting currentTime
        setIsPlaying(false);
      }
    };

    const handleResume = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (wasPlayingRef.current && audio.paused) {
        audio
          .play() // Resumes from exact same second
          .then(() => {
            setIsPlaying(true);
          })
          .catch((e) => console.warn('Resume play error:', e));
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handlePause();
      } else {
        handleResume();
      }
    };

    const handleWindowBlur = () => {
      handlePause();
    };

    const handleWindowFocus = () => {
      handleResume();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, []);

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
      wasPlayingRef.current = true;
      audio.volume = 1.0;
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.warn(e));
    } else {
      wasPlayingRef.current = false;
      audio.pause();
      setIsPlaying(false);
    }
  };

  const forcePlayMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    wasPlayingRef.current = true;
    audio.volume = 1.0;
    setIsPlaying(true);
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((e) => console.warn('forcePlayMusic failed:', e));
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
