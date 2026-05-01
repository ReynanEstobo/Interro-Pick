import { useRef, useCallback } from "react";

// ============================================================
// useAudio — Synthesized SFX via Web Audio API
// No audio files needed — all sounds generated in-browser
// ============================================================
export function useAudio() {
  const ctxRef = useRef(null);
  const enabledRef = useRef(true);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume if suspended (browser autoplay policy)
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  // Core tone generator
  const playTone = useCallback(
    (freq, type = "sine", duration = 0.2, gain = 0.3, startDelay = 0) => {
      if (!enabledRef.current) return;
      try {
        const ctx = getCtx();
        const t = ctx.currentTime + startDelay;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.frequency.setValueAtTime(freq, t);
        osc.type = type;
        gainNode.gain.setValueAtTime(0, t);
        gainNode.gain.linearRampToValueAtTime(gain, t + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, t + duration);
        osc.start(t);
        osc.stop(t + duration + 0.05);
      } catch (e) {
        // Silently fail if audio context unavailable
      }
    },
    [getCtx]
  );

  // Roulette tick — high-freq click
  const sfxTick = useCallback(() => {
    playTone(880, "square", 0.04, 0.06);
  }, [playTone]);

  // Roulette spin — low rumble
  const sfxSpin = useCallback(() => {
    playTone(120 + Math.random() * 80, "sawtooth", 0.06, 0.08);
  }, [playTone]);

  // Countdown beep — pitched by number
  const sfxCountdown = useCallback(
    (n) => {
      const freqs = { 3: 440, 2: 550, 1: 660 };
      playTone(freqs[n] || 440, "triangle", 0.35, 0.5);
    },
    [playTone]
  );

  // Dramatic reveal chord — ascending
  const sfxReveal = useCallback(() => {
    const notes = [220, 330, 440, 550, 660, 880];
    notes.forEach((f, i) => playTone(f, "sawtooth", 0.5, 0.12, i * 0.04));
    // Climax note
    setTimeout(() => playTone(1760, "sine", 0.8, 0.4), 250);
  }, [playTone]);

  // Typing key sound
  const sfxKey = useCallback(() => {
    playTone(800 + Math.random() * 200, "square", 0.04, 0.05);
  }, [playTone]);

  // UI beep
  const sfxBeep = useCallback(() => {
    playTone(440, "square", 0.1, 0.12);
  }, [playTone]);

  const setEnabled = useCallback((val) => {
    enabledRef.current = val;
  }, []);

  return { sfxTick, sfxSpin, sfxCountdown, sfxReveal, sfxKey, sfxBeep, setEnabled };
}
