/**
 * OSON PRAVA — Web Audio API Sound Effects Engine
 * Zero-dependency audio synthesizer for instant feedback
 * Sounds: correct answer chime, incorrect buzz, victory fanfare, button click
 */

(function() {
  'use strict';

  let audioCtx = null;
  let isEnabled = true;

  // Initialize audio context safely on first user gesture
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Check saved preference
  function initSoundSettings() {
    try {
      const saved = localStorage.getItem('oson_sound_enabled');
      if (saved !== null) {
        isEnabled = JSON.parse(saved);
      }
    } catch (e) {
      isEnabled = true;
    }
    updateSoundUI();
  }

  function toggleSound() {
    isEnabled = !isEnabled;
    try {
      localStorage.setItem('oson_sound_enabled', JSON.stringify(isEnabled));
    } catch (e) {}

    updateSoundUI();

    if (isEnabled) {
      playCorrect();
      if (window.OSON_UI && window.OSON_UI.showToast) {
        window.OSON_UI.showToast('Ovoz effektlari yoqildi', 'success');
      }
    } else {
      if (window.OSON_UI && window.OSON_UI.showToast) {
        window.OSON_UI.showToast('Ovoz effektlari o‘chirildi', 'info');
      }
    }
    return isEnabled;
  }

  function updateSoundUI() {
    document.querySelectorAll('.sound-toggle-btn').forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (isEnabled) {
          icon.className = 'fa-solid fa-volume-high text-blue-600 dark:text-blue-400';
          btn.setAttribute('title', 'Ovozni o‘chirish');
        } else {
          icon.className = 'fa-solid fa-volume-xmark text-slate-400';
          btn.setAttribute('title', 'Ovozni yoqish');
        }
      }
    });
  }

  // Play pleasant upward chime for correct answers
  function playCorrect() {
    if (!isEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.3);
    });
  }

  // Play soft downward tone for wrong answers
  function playWrong() {
    if (!isEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.25);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  // Play victory celebration fanfare
  function playSuccess() {
    if (!isEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const fanfareNotes = [
      { f: 523.25, d: 0.12 }, // C5
      { f: 659.25, d: 0.12 }, // E5
      { f: 783.99, d: 0.12 }, // G5
      { f: 1046.50, d: 0.40 } // C6
    ];

    let t = now;
    fanfareNotes.forEach((n) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, t);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.22, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.d);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + n.d);

      t += n.d * 0.85;
    });
  }

  // Play subtle UI tap click
  function playClick() {
    if (!isEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Public API
  window.OSON_SOUND = {
    init: initSoundSettings,
    toggleSound: toggleSound,
    playCorrect: playCorrect,
    playWrong: playWrong,
    playSuccess: playSuccess,
    playClick: playClick,
    isEnabled: () => isEnabled
  };

  // Auto-init on script load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSoundSettings);
  } else {
    initSoundSettings();
  }
})();
