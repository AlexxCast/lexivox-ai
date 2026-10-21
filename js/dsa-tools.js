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

  /* ---------------- STT Engine (Speech Recognition - DSA Unbreakable Continuous Engine) ---------------- */
  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Web Speech API non supportata in questo browser. Fallback su input testuale.');
      return;
    }

    this.SpeechRecognitionClass = SpeechRecognition;
    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';
    this.recognition.maxAlternatives = 1;

    // State tracking
    this.isListening = false;
    this.isSessionActive = false;
    this.confirmedSessionText = '';
    this.currentPassFinal = '';
    this.silenceTimer = null;
    this.restartTimeout = null;
    this.SILENCE_DELAY_MS = 10000; // 10 seconds cognitive buffer: never interrupt DSA thought pauses
    this.mediaStream = null;
  }

  async startListening(onResult, onInterim, onError, onEnd) {
    if (!this.recognition) {
      if (typeof onError === 'function') onError('Microfono o browser non supporta il riconoscimento vocale. Usa la tastiera.');
      return;
    }

    this.stopAudio(); // Silence any playing audio when user starts speaking

    this.isSessionActive = true;
    this.isListening = true;
    this.confirmedSessionText = '';
    this.currentPassFinal = '';
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    if (this.restartTimeout) clearTimeout(this.restartTimeout);

    this.onResultCb = onResult;
    this.onInterimCb = onInterim;
    this.onErrorCb = onError;
    this.onEndCb = onEnd;

    // Keep audio hardware alive on mobile Chrome/Safari
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        if (!this.mediaStream) {
          this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        }
      } catch (streamErr) {
        console.warn('[DSA STT] MediaStream warning (proceeding):', streamErr);
      }
    }

    const commitAndSend = () => {
      if (!this.isSessionActive) return;
      if (this.silenceTimer) clearTimeout(this.silenceTimer);
      if (this.restartTimeout) clearTimeout(this.restartTimeout);

      if (this.currentPassFinal) {
        this.confirmedSessionText = (this.confirmedSessionText + ' ' + this.currentPassFinal).trim();
        this.currentPassFinal = '';
      }

      const textToSend = this.confirmedSessionText.trim();
      this.isSessionActive = false;
      this.isListening = false;

      try {
        this.recognition.stop();
      } catch (e) {}

      this.releaseMediaStream();

      if (textToSend && typeof this.onResultCb === 'function') {
        this.onResultCb(textToSend);
      }
      if (typeof this.onEndCb === 'function') {
        this.onEndCb();
      }
    };

    this.manualCommit = commitAndSend;
    this.bindRecognitionEvents(commitAndSend);

    try {
      this.recognition.start();
    } catch (e) {
      console.warn('[DSA STT] Recognition already started or retry:', e);
      this.recreateRecognition(commitAndSend);
    }
  }

  bindRecognitionEvents(commitAndSend) {
    this.recognition.onstart = () => {
      this.isListening = true;
      console.log('[DSA STT] Microfono attivo e in ascolto...');
    };

    this.recognition.onresult = (event) => {
      let turnFinal = '';
      let interimStr = '';

      for (let i = 0; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item && item[0]) {
          const text = item[0].transcript;
          if (item.isFinal) {
            turnFinal += text + ' ';
          } else {
            interimStr += text;
          }
        }
      }

      this.currentPassFinal = turnFinal.trim();
      const currentFullText = (this.confirmedSessionText + ' ' + this.currentPassFinal).trim();
      const currentDisplay = (currentFullText + ' ' + interimStr).trim();

      if (typeof this.onInterimCb === 'function') {
        this.onInterimCb(currentDisplay);
      }

      // Reset generous 10s cognitive pause timer on every vocal utterance
      if (this.silenceTimer) clearTimeout(this.silenceTimer);
      if (currentFullText) {
        this.silenceTimer = setTimeout(() => {
          if (this.isSessionActive) {
            console.log('[DSA STT] Pausa prolungata di 10s rilevata, invio automatico...');
            commitAndSend();
          }
        }, this.SILENCE_DELAY_MS);
      }
    };

    this.recognition.onerror = (event) => {
      console.log('[DSA STT] Evento errore:', event.error);
      if (event.error === 'no-speech') {
        // Pausa di riflessione DSA: NON staccare la registrazione!
        return;
      }
      if (event.error === 'aborted') {
        // Normale durante i cicli di auto-riavvio, ignora
        return;
      }
      if (event.error === 'network') {
        // Lieve ritardo di rete con i server vocali Google, lasciamo riprovare onend
        return;
      }

      // Solo in caso di rifiuto esplicito permessi o hardware assente
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed' || event.error === 'audio-capture') {
        this.isSessionActive = false;
        this.isListening = false;
        this.releaseMediaStream();
        if (typeof this.onErrorCb === 'function') {
          this.onErrorCb('Permesso microfono negato o non disponibile.');
        }
        if (typeof this.onEndCb === 'function') {
          this.onEndCb();
        }
      }
    };

    this.recognition.onend = () => {
      console.log('[DSA STT] onend scattato. Sessione attiva:', this.isSessionActive);

      // Salva il testo finora confermato in memoria
      if (this.currentPassFinal) {
        this.confirmedSessionText = (this.confirmedSessionText + ' ' + this.currentPassFinal).trim();
        this.currentPassFinal = '';
      }

      // SE L'UTENTE STA ANCORA PARLANDO: NON STACCARE! Riavvia istantaneamente il microfono!
      if (this.isSessionActive) {
        clearTimeout(this.restartTimeout);
        this.restartTimeout = setTimeout(() => {
          if (this.isSessionActive) {
            try {
              this.recognition.start();
              console.log('[DSA STT] Microfono riattivato in modo continuo.');
            } catch (err) {
              console.warn('[DSA STT] Riavvio rapido fallito, ricreo istanza SpeechRecognition...', err);
              this.recreateRecognition(commitAndSend);
            }
          }
        }, 80);
        return;
      }

      // Se l'utente ha premuto "Ho Finito di Parlare" o Stop
      this.isListening = false;
      this.releaseMediaStream();
      if (typeof this.onEndCb === 'function') {
        this.onEndCb();
      }
    };
  }

  recreateRecognition(commitAndSend) {
    if (!this.SpeechRecognitionClass || !this.isSessionActive) return;
    try {
      this.recognition = new this.SpeechRecognitionClass();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 1;
      this.bindRecognitionEvents(commitAndSend);
      this.recognition.start();
    } catch (e) {
      console.warn('[DSA STT] Ricreazione fallita:', e);
      setTimeout(() => {
        if (this.isSessionActive) {
          try { this.recognition.start(); } catch(err) {}
        }
      }, 250);
    }
  }

  releaseMediaStream() {
    if (this.mediaStream) {
      try {
        this.mediaStream.getTracks().forEach(t => t.stop());
      } catch (e) {}
      this.mediaStream = null;
    }
  }

  stopListening() {
    this.isSessionActive = false;
    this.isListening = false;
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    if (this.restartTimeout) clearTimeout(this.restartTimeout);
    this.releaseMediaStream();
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {}
    }
    if (typeof this.onEndCb === 'function') {
      this.onEndCb();
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
