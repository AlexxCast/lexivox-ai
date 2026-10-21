/**
 * LexiVox AI - DSA Accessibility & Speech Engine (TTS & STT)
 * Optimized for Neuro-inclusivity, Clear Auditory Feedback and Low Friction
 */

import { configManager } from './config.js';

class DsaTools {
  constructor() {
    this.synth = window.speechSynthesis;
    this.currentUtterance = null;
    this.recognition = null;
    this.isListening = false;
    this.preferredEnVoice = null;
    this.preferredItVoice = null;
    
    this.initVoices();
    this.initSpeechRecognition();
    this.initReadingRuler();
    this.applyUserPreferences();
  }

  /* ---------------- TTS Engine ---------------- */
  initVoices() {
    if (!this.synth) return;

    const load = () => {
      const voices = this.synth.getVoices();
      // Look for natural English voices (US / UK)
      this.preferredEnVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel')))
        || voices.find(v => v.lang.startsWith('en'))
        || null;

      // Look for Italian voice for explanations
      this.preferredItVoice = voices.find(v => v.lang.startsWith('it') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Alice')))
        || voices.find(v => v.lang.startsWith('it'))
        || null;
    };

    load();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = load;
    }
  }

  speakEnglish(text, speedMultiplier = null, onStart = null, onEnd = null) {
    if (!this.synth) return;
    this.stopAudio();

    const speed = speedMultiplier || configManager.profile.a11y.audioSpeed || 0.85;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = speed;
    utterance.pitch = 1.0;
    if (this.preferredEnVoice) {
      utterance.voice = this.preferredEnVoice;
    }

    utterance.onstart = () => {
      if (typeof onStart === 'function') onStart();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      if (typeof onEnd === 'function') onEnd();
    };

    utterance.onerror = (err) => {
      console.warn('TTS error:', err);
      this.currentUtterance = null;
      if (typeof onEnd === 'function') onEnd();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  speakItalian(text, onEnd = null) {
    if (!this.synth) return;
    this.stopAudio();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'it-IT';
    utterance.rate = 0.95;
    if (this.preferredItVoice) {
      utterance.voice = this.preferredItVoice;
    }

    utterance.onend = () => {
      this.currentUtterance = null;
      if (typeof onEnd === 'function') onEnd();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  stopAudio() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }

  /* ---------------- STT Engine (Speech Recognition - DSA Thinking-Guard) ---------------- */
  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Web Speech API not supported in this browser. Fallback to text input.');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true; // Stay alive during cognitive pauses
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;
    this.accumulatedTranscript = '';
    this.silenceTimer = null;
    this.SILENCE_DELAY_MS = 5000; // 5 seconds of silence before auto-submitting (generous for DSA)
  }

  startListening(onResult, onInterim, onError, onEnd) {
    if (!this.recognition) {
      if (onError) onError('Microfono o browser non supporta il riconoscimento vocale. Usa la tastiera.');
      return;
    }

    this.stopAudio(); // Silence any playing audio when user starts speaking
    this.accumulatedTranscript = '';
    if (this.silenceTimer) clearTimeout(this.silenceTimer);

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    const commitAndSend = () => {
      if (this.silenceTimer) clearTimeout(this.silenceTimer);
      const textToSend = this.accumulatedTranscript.trim();
      if (textToSend && typeof onResult === 'function') {
        this.stopListening();
        onResult(textToSend);
      }
    };

    this.recognition.onresult = (event) => {
      let interim = '';
      let newFinal = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          newFinal += event.results[i][0].transcript + ' ';
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      if (newFinal) {
        this.accumulatedTranscript += newFinal;
      }

      const currentTotalDisplay = (this.accumulatedTranscript + interim).trim();
      if (typeof onInterim === 'function') {
        onInterim(currentTotalDisplay);
      }

      // Reset generous DSA thinking timer on every detected speech snippet
      if (this.silenceTimer) clearTimeout(this.silenceTimer);
      if (this.accumulatedTranscript.trim()) {
        this.silenceTimer = setTimeout(() => {
          commitAndSend();
        }, this.SILENCE_DELAY_MS);
      }
    };

    this.recognition.onerror = (event) => {
      if (event.error === 'no-speech') {
        // Keep listening, do not abort on brief silence
        return;
      }
      this.isListening = false;
      if (this.silenceTimer) clearTimeout(this.silenceTimer);
      if (typeof onError === 'function') onError(event.error);
    };

    this.recognition.onend = () => {
      // If stopped naturally but we have pending text that wasn't committed
      if (this.isListening && this.accumulatedTranscript.trim()) {
        commitAndSend();
      }
      this.isListening = false;
      if (typeof onEnd === 'function') onEnd();
    };

    this.manualCommit = () => {
      commitAndSend();
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.warn('Recognition already started or error:', e);
    }
  }

  stopListening() {
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  forceCommitSpeech() {
    if (typeof this.manualCommit === 'function') {
      this.manualCommit();
    } else {
      this.stopListening();
    }
  }

  /* ---------------- Reading Ruler (Guida per Dislessia) ---------------- */
  initReadingRuler() {
    const ruler = document.getElementById('dsa-reading-ruler');
    if (!ruler) return;

    window.addEventListener('mousemove', (e) => {
      if (configManager.profile.a11y.readingRuler) {
        ruler.style.top = `${e.clientY}px`;
      }
    });
  }

  toggleReadingRuler(enabled) {
    const ruler = document.getElementById('dsa-reading-ruler');
    configManager.profile.a11y.readingRuler = enabled;
    configManager.save();
    if (ruler) {
      if (enabled) {
        ruler.classList.add('active');
      } else {
        ruler.classList.remove('active');
      }
    }
  }

  /* ---------------- Visual Themes & Font Sizes ---------------- */
  applyUserPreferences() {
    const a11y = configManager.profile.a11y;
    const body = document.body;

    // Theme
    if (a11y.theme === 'warm-cream') {
      document.documentElement.setAttribute('data-theme', 'warm-cream');
    } else if (a11y.theme === 'soft-sage') {
      document.documentElement.setAttribute('data-theme', 'soft-sage');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    // Font size
    body.classList.remove('text-size-sm', 'text-size-md', 'text-size-lg', 'text-size-xl');
    body.classList.add(`text-size-${a11y.fontSize || 'md'}`);

    // Spacing
    if (a11y.wideSpacing) {
      body.classList.add('dsa-wide-spacing');
    } else {
      body.classList.remove('dsa-wide-spacing');
    }

    // Tint
    body.setAttribute('data-tint', a11y.screenTint || 'none');

    // Ruler
    const ruler = document.getElementById('dsa-reading-ruler');
    if (ruler) {
      if (a11y.readingRuler) ruler.classList.add('active');
      else ruler.classList.remove('active');
    }
  }

  setFontSize(size) {
    configManager.profile.a11y.fontSize = size;
    configManager.save();
    this.applyUserPreferences();
  }

  setTheme(theme) {
    configManager.profile.a11y.theme = theme;
    configManager.save();
    this.applyUserPreferences();
  }

  setScreenTint(tint) {
    configManager.profile.a11y.screenTint = tint;
    configManager.save();
    this.applyUserPreferences();
  }

  toggleWideSpacing(enabled) {
    configManager.profile.a11y.wideSpacing = enabled;
    configManager.save();
    this.applyUserPreferences();
  }

  setAudioSpeed(speed) {
    configManager.profile.a11y.audioSpeed = parseFloat(speed);
    configManager.save();
  }
}

export const dsaTools = new DsaTools();
