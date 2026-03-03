let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return ctx;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = 'sine',
  startTime = 0,
  gainValue = 0.3
) {
  const audioCtx = getCtx();
  if (!audioCtx) return;

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(
    frequency,
    audioCtx.currentTime + startTime
  );

  gainNode.gain.setValueAtTime(gainValue, audioCtx.currentTime + startTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    audioCtx.currentTime + startTime + duration
  );

  oscillator.start(audioCtx.currentTime + startTime);
  oscillator.stop(audioCtx.currentTime + startTime + duration);
}

export function playCorrect() {
  playTone(523.25, 0.15, 'sine', 0, 0.3); // C5
  playTone(659.25, 0.2, 'sine', 0.12, 0.3); // E5
}

export function playWrong() {
  playTone(392, 0.15, 'sawtooth', 0, 0.25); // G4
  playTone(293.66, 0.3, 'sawtooth', 0.1, 0.2); // D4
}

export function playTick() {
  playTone(880, 0.05, 'square', 0, 0.1);
}

export function playWin() {
  playTone(523.25, 0.15, 'sine', 0, 0.3); // C5
  playTone(659.25, 0.15, 'sine', 0.15, 0.3); // E5
  playTone(783.99, 0.15, 'sine', 0.3, 0.3); // G5
  playTone(1046.5, 0.4, 'sine', 0.45, 0.4); // C6
}

export function resumeAudio() {
  const audioCtx = getCtx();
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}
