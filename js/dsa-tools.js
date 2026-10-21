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

  /* ---------------- STT Engine (Speech Recognition - DSA Anti-Multiplication & Continuous Engine) ---------------- */
  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Web Speech API non supportata in questo browser. Fallback su input testuale.');
      return;
    }

    this.SpeechRecognitionClass = SpeechRecognition;
    this.recognition = null;

    // State tracking
    this.isListening = false;
    this.isSessionActive = false;
    this.confirmedSessionText = '';
    this.currentPassFinal = '';
    this.silenceTimer = null;
    this.restartTimeout = null;
    this.SILENCE_DELAY_MS = 10000; // 10 seconds cognitive buffer: never interrupt DSA thought pauses
  }

  /* Robust Transcript Sanitizer: Removes duplicate identical phrases and adjacent stutter words */
  sanitizeTranscript(str) {
    if (!str) return '';
    let text = str.trim();
    if (!text) return '';

    // 1. Remove duplicate multi-word phrases (e.g. "I went to London I went to London" -> "I went to London")
    const words = text.split(/\s+/);
    if (words.length >= 2) {
      const resultWords = [];
      let i = 0;
      while (i < words.length) {
        let matched = false;
        // Check phrase lengths from 8 down to 2 words
        const maxLen = Math.min(8, Math.floor((words.length - i) / 2));
        for (let len = maxLen; len >= 2; len--) {
          const phrase1 = words.slice(i, i + len).map(w => w.toLowerCase()).join(' ');
          const phrase2 = words.slice(i + len, i + len * 2).map(w => w.toLowerCase()).join(' ');
          if (phrase1 === phrase2) {
            // Match found! Keep phrase1 once and skip phrase2
            for (let k = 0; k < len; k++) {
              resultWords.push(words[i + k]);
            }
            i += len * 2;
            matched = true;
            break;
          }
        }
        if (!matched) {
          resultWords.push(words[i]);
          i++;
        }
      }

      // 2. Remove duplicate adjacent single words (e.g. "the the", "my my name")
      const dedupedSingle = [];
      for (let j = 0; j < resultWords.length; j++) {
        if (j === 0 || resultWords[j].toLowerCase() !== resultWords[j - 1].toLowerCase()) {
          dedupedSingle.push(resultWords[j]);
        }
      }
      text = dedupedSingle.join(' ');
    }

    return text.replace(/\s+/g, ' ').trim();
  }

  /* Smart Overlap Merger: Merges base text and incoming chunk without multiplying overlapping words */
  mergeTranscripts(base, addition) {
    base = (base || '').trim();
    addition = (addition || '').trim();
    if (!base) return addition;
    if (!addition) return base;

    // Direct subset checks
    const baseLower = base.toLowerCase();
    const addLower = addition.toLowerCase();
    if (baseLower === addLower) return base;
    if (baseLower.endsWith(addLower)) return base;
    if (addLower.startsWith(baseLower)) return addition;

    // Overlapping suffix/prefix check (e.g. "my name is" + "is Alessio" -> "my name is Alessio")
    const baseWords = base.split(/\s+/);
    const addWords = addition.split(/\s+/);
    const maxOverlap = Math.min(baseWords.length, addWords.length);

    for (let len = maxOverlap; len > 0; len--) {
      const baseTail = baseWords.slice(baseWords.length - len).map(w => w.toLowerCase()).join(' ');
      const addHead = addWords.slice(0, len).map(w => w.toLowerCase()).join(' ');
      if (baseTail === addHead) {
        const nonOverlapping = addWords.slice(len).join(' ');
        return nonOverlapping ? `${base} ${nonOverlapping}` : base;
      }
    }

    return `${base} ${addition}`;
  }

  startListening(onResult, onInterim, onError, onEnd) {
    if (!this.SpeechRecognitionClass) {
      if (typeof onError === 'function') onError('Microfono non supportato in questo browser. Usa la tastiera.');
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

    const commitAndSend = () => {
      if (!this.isSessionActive) return;
      if (this.silenceTimer) clearTimeout(this.silenceTimer);
      if (this.restartTimeout) clearTimeout(this.restartTimeout);

      if (this.currentPassFinal) {
        this.confirmedSessionText = this.mergeTranscripts(this.confirmedSessionText, this.currentPassFinal);
        this.currentPassFinal = '';
      }

      const textToSend = this.sanitizeTranscript(this.confirmedSessionText);
      this.isSessionActive = false;
      this.isListening = false;

      this.destroyRecognition();

      if (typeof this.onResultCb === 'function') {
        this.onResultCb(textToSend || '');
      }
      if (typeof this.onEndCb === 'function') {
        this.onEndCb();
      }
    };

    this.manualCommit = commitAndSend;
    this.startFreshRecognitionPass(commitAndSend);
  }

  startFreshRecognitionPass(commitAndSend) {
    if (!this.SpeechRecognitionClass || !this.isSessionActive) return;

    // Always destroy any previous recognition instance so results NEVER accumulate in memory
    this.destroyRecognition();

    try {
      this.recognition = new this.SpeechRecognitionClass();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 1;
      this.currentPassFinal = '';

      this.recognition.onstart = () => {
        this.isListening = true;
        console.log('[DSA STT] Nuova sessione microfono pulita e attiva...');
      };

      this.recognition.onresult = (event) => {
        let passFinal = '';
        let passInterim = '';

        for (let i = 0; i < event.results.length; ++i) {
          const item = event.results[i];
          if (item && item[0]) {
            const text = item[0].transcript;
            if (item.isFinal) {
              passFinal += text + ' ';
            } else {
              passInterim += text;
            }
          }
        }

        this.currentPassFinal = passFinal.trim();
        const mergedFinal = this.mergeTranscripts(this.confirmedSessionText, this.currentPassFinal);
        const mergedDisplay = this.mergeTranscripts(mergedFinal, passInterim.trim());
        const cleanDisplay = this.sanitizeTranscript(mergedDisplay);

        if (typeof this.onInterimCb === 'function') {
          this.onInterimCb(cleanDisplay);
        }

        // Reset generous 10s cognitive pause timer on every vocal utterance
        if (this.silenceTimer) clearTimeout(this.silenceTimer);
        if (cleanDisplay) {
          this.silenceTimer = setTimeout(() => {
            if (this.isSessionActive) {
              console.log('[DSA STT] Pausa di 10s rilevata, invio automatico...');
              commitAndSend();
            }
          }, this.SILENCE_DELAY_MS);
        }
      };

      this.recognition.onerror = (event) => {
        console.log('[DSA STT] Evento errore:', event.error);
        if (event.error === 'no-speech' || event.error === 'aborted' || event.error === 'network') {
          // Pausa di riflessione o reset silenzioso: non abortire l'utente
          return;
        }

        // Solo in caso di rifiuto esplicito permessi o hardware assente
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed' || event.error === 'audio-capture') {
          this.isSessionActive = false;
          this.isListening = false;
          this.destroyRecognition();
          if (typeof this.onErrorCb === 'function') {
            this.onErrorCb('Permesso microfono negato o non disponibile.');
          }
          if (typeof this.onEndCb === 'function') {
            this.onEndCb();
          }
        }
      };

      this.recognition.onend = () => {
        console.log('[DSA STT] onend pass terminato. Sessione attiva:', this.isSessionActive);

        // Salva il testo finora confermato in memoria senza duplicazioni
        if (this.currentPassFinal) {
          this.confirmedSessionText = this.mergeTranscripts(this.confirmedSessionText, this.currentPassFinal);
          this.confirmedSessionText = this.sanitizeTranscript(this.confirmedSessionText);
          this.currentPassFinal = '';
        }

        // SE L'UTENTE STA ANCORA PARLANDO: Riavvia con una NUOVA istanza fresca (buffer pulito)
        if (this.isSessionActive) {
          clearTimeout(this.restartTimeout);
          this.restartTimeout = setTimeout(() => {
            if (this.isSessionActive) {
              this.startFreshRecognitionPass(commitAndSend);
            }
          }, 80);
          return;
        }

        // Se l'utente ha premuto "Ho Finito di Parlare" o Stop
        this.isListening = false;
        this.destroyRecognition();
        if (typeof this.onEndCb === 'function') {
          this.onEndCb();
        }
      };

      this.recognition.start();
    } catch (e) {
      console.warn('[DSA STT] startFreshRecognitionPass eccezione:', e);
      if (this.isSessionActive) {
        setTimeout(() => {
          if (this.isSessionActive) {
            this.startFreshRecognitionPass(commitAndSend);
          }
        }, 200);
      }
    }
  }

  destroyRecognition() {
    if (this.recognition) {
      try {
        this.recognition.onstart = null;
        this.recognition.onresult = null;
        this.recognition.onerror = null;
        this.recognition.onend = null;
        this.recognition.abort();
      } catch (e) {}
      this.recognition = null;
    }
  }

  stopListening() {
    this.isSessionActive = false;
    this.isListening = false;
    if (this.silenceTimer) clearTimeout(this.silenceTimer);
    if (this.restartTimeout) clearTimeout(this.restartTimeout);
    this.destroyRecognition();
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
