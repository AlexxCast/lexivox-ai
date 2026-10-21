/**
 * LexiVox AI - Adaptive Micro-Lesson Engine (Targeted Mastery Drill)
 * Engages the student when persistent errors are caught, breaking down the concept
 * into intuitive multi-sensory steps and requiring 3 spontaneous spoken proofs before continuing.
 */

import { ERROR_DEFINITIONS } from './error-tracker.js';
import { dsaTools } from './dsa-tools.js';
import { configManager } from './config.js';

class MicroLessonManager {
  constructor() {
    this.currentLesson = null;
    this.promptIndex = 0;
    this.consecutiveSuccesses = 0;
    this.REQUIRED_SUCCESSES = 3;
    this.onCompletedCallback = null;
    this.modalOverlay = null;
  }

  init(modalElement) {
    this.modalOverlay = modalElement;
  }

  launch(errorKey, onComplete) {
    const lessonData = ERROR_DEFINITIONS[errorKey];
    if (!lessonData) {
      console.warn('Micro-lesson not found for key:', errorKey);
      if (onComplete) onComplete();
      return;
    }

    this.currentLesson = lessonData;
    this.promptIndex = 0;
    this.consecutiveSuccesses = 0;
    this.onCompletedCallback = onComplete;

    this.render();
    if (this.modalOverlay) {
      this.modalOverlay.classList.add('open');
    }

    // Audio announcement in Italian to relieve anxiety
    dsaTools.speakItalian(`Attenzione: abbiamo notato un piccolo ostacolo frequente su ${lessonData.title}. Risolviamolo subito insieme con tre prove vocali veloci!`);
  }

  render() {
    if (!this.modalOverlay || !this.currentLesson) return;

    const lesson = this.currentLesson;
    const currentPrompt = lesson.prompts[this.promptIndex % lesson.prompts.length];

    this.modalOverlay.innerHTML = `
      <div class="micro-lesson-card">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="micro-lesson-badge">🎯 Sblocco Ostacolo Adattivo</span>
          <button id="btn-close-lesson-early" class="modal-close-btn" title="Riprendi dialogo">✕</button>
        </div>

        <h2 class="micro-lesson-title">${lesson.title}</h2>

        <!-- Intuitive Neuro-friendly Rule Box -->
        <div class="rule-intuitive-box">
          <div class="rule-heading">La Regola Intuitiva (Zero Noia):</div>
          <div class="rule-body">${lesson.intuitiveRule}</div>
          
          <div class="contrast-examples-grid">
            <div class="example-box wrong">
              <strong>Evita:</strong><br>
              ${lesson.wrongExample}
            </div>
            <div class="example-box correct">
              <strong>Forma Naturale:</strong><br>
              ${lesson.correctExample}
              <button id="btn-listen-correct-rule" class="audio-btn-inline" title="Ascolta pronuncia corretta">🔊</button>
            </div>
          </div>
        </div>

        <!-- Spontaneous Spoken Drill -->
        <div class="drill-challenge-area">
          <div style="font-size: 13px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 8px;">
            Sfida di Spontaneità Vocale (${this.consecutiveSuccesses}/${this.REQUIRED_SUCCESSES})
          </div>

          <div class="drill-streak-dots">
            <div class="drill-dot ${this.consecutiveSuccesses >= 1 ? 'passed' : ''}">1</div>
            <div class="drill-dot ${this.consecutiveSuccesses >= 2 ? 'passed' : ''}">2</div>
            <div class="drill-dot ${this.consecutiveSuccesses >= 3 ? 'passed' : ''}">3</div>
          </div>

          <div class="drill-target-prompt" id="current-drill-prompt">
            🗣️ ${currentPrompt.it}
          </div>

          <div style="margin: 16px 0;">
            <button id="btn-drill-speak" class="drill-voice-btn">
              🎙️ Premi e Rispondi a Voce
            </button>
            <button id="btn-drill-hint" class="btn btn-secondary" style="margin-left: 10px; padding: 12px 18px;">
              💡 Suggerimento
            </button>
          </div>

          <div id="drill-feedback-msg" class="drill-feedback-msg">
            Ascolto pronto. Parla con naturalezza senza paura!
          </div>
        </div>

        <!-- Mastery Screen (Hidden until finished) -->
        <div id="mastery-achieved-screen" class="mastery-achieved-screen">
          <div class="mastery-star-icon">⭐</div>
          <h2 style="color: var(--accent-cyan); font-size: 26px; margin-bottom: 8px;">Ostacolo Superato con Successo!</h2>
          <p style="color: var(--text-secondary); margin-bottom: 20px;">
            Hai risposto correttamente per 3 volte consecutive. La regola ora è memorizzata nella tua memoria spontanea!
          </p>
          <button id="btn-finish-mastery" class="btn btn-accent btn-lg" style="width: 100%; max-width: 320px;">
            Continua la Conversazione Live ➔
          </button>
        </div>
      </div>
    `;

    this.bindEvents(currentPrompt);
  }

  bindEvents(currentPrompt) {
    const speakBtn = this.modalOverlay.querySelector('#btn-drill-speak');
    const hintBtn = this.modalOverlay.querySelector('#btn-drill-hint');
    const feedbackMsg = this.modalOverlay.querySelector('#btn-close-lesson-early');
    const listenCorrectBtn = this.modalOverlay.querySelector('#btn-listen-correct-rule');
    const closeBtn = this.modalOverlay.querySelector('#btn-close-lesson-early');
    const feedbackBox = this.modalOverlay.querySelector('#drill-feedback-msg');

    if (listenCorrectBtn) {
      listenCorrectBtn.addEventListener('click', () => {
        dsaTools.speakEnglish(currentPrompt.target, 0.8);
      });
    }

    if (hintBtn) {
      hintBtn.addEventListener('click', () => {
        dsaTools.speakItalian(`Puoi dire: ${currentPrompt.target}. Prova a ripeterlo tu a voce!`);
        feedbackBox.className = 'drill-feedback-msg retry';
        feedbackBox.textContent = `Suggerimento: "${currentPrompt.target}"`;
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.close();
      });
    }

    if (speakBtn) {
      speakBtn.addEventListener('click', () => {
        if (dsaTools.isListening) {
          dsaTools.stopListening();
          speakBtn.classList.remove('recording');
          speakBtn.textContent = '🎙️ Premi e Rispondi a Voce';
        } else {
          speakBtn.classList.add('recording');
          speakBtn.textContent = '⏹️ In Ascolto...';
          feedbackBox.className = 'drill-feedback-msg';
          feedbackBox.textContent = 'Ti sto ascoltando...';

          dsaTools.startListening(
            (transcript) => {
              speakBtn.classList.remove('recording');
              speakBtn.textContent = '🎙️ Premi e Rispondi a Voce';
              this.evaluateSpokenResponse(transcript, currentPrompt, feedbackBox);
            },
            (interim) => {
              feedbackBox.textContent = `Sto sentendo: "${interim}"...`;
            },
            (err) => {
              speakBtn.classList.remove('recording');
              speakBtn.textContent = '🎙️ Premi e Rispondi a Voce';
              feedbackBox.className = 'drill-feedback-msg retry';
              feedbackBox.textContent = 'Microfono non udito chiaramente. Puoi riprovare o usare il suggerimento.';
            },
            () => {
              speakBtn.classList.remove('recording');
            }
          );
        }
      });
    }
  }

  evaluateSpokenResponse(transcript, prompt, feedbackBox) {
    const cleanTranscript = transcript.toLowerCase().trim();
    let isCorrect = false;

    // Check against expected patterns
    for (const pattern of prompt.expectedPatterns) {
      if (pattern.test(cleanTranscript)) {
        isCorrect = true;
        break;
      }
    }

    // High tolerance check for DSA acoustic similarity
    if (!isCorrect && cleanTranscript.includes(prompt.target.toLowerCase().substring(0, 6))) {
      isCorrect = true;
    }

    if (isCorrect) {
      this.consecutiveSuccesses += 1;
      feedbackBox.className = 'drill-feedback-msg success';
      feedbackBox.innerHTML = `✅ <strong>Bravissimo!</strong> Hai detto: "${transcript}".`;

      if (this.consecutiveSuccesses >= this.REQUIRED_SUCCESSES) {
        // Complete mastery!
        this.completeMastery();
      } else {
        // Next prompt
        this.promptIndex += 1;
        dsaTools.speakItalian("Esatto! Ora facciamo un'altra prova per fissarlo bene.", () => {
          this.render();
        });
      }
    } else {
      feedbackBox.className = 'drill-feedback-msg retry';
      feedbackBox.innerHTML = `Hai detto: "${transcript}". Ci sei quasi! Prova a ricordare la forma corretta: "${prompt.target}".`;
      dsaTools.speakItalian("Ci sei quasi! Riascolta la forma naturale e riprova.");
    }
  }

  completeMastery() {
    configManager.conquerError(this.currentLesson.id);

    const challengeArea = this.modalOverlay.querySelector('.drill-challenge-area');
    const ruleBox = this.modalOverlay.querySelector('.rule-intuitive-box');
    const masteryScreen = this.modalOverlay.querySelector('#mastery-achieved-screen');

    if (challengeArea) challengeArea.style.display = 'none';
    if (ruleBox) ruleBox.style.display = 'none';
    if (masteryScreen) {
      masteryScreen.classList.add('active');
      const finishBtn = masteryScreen.querySelector('#btn-finish-mastery');
      if (finishBtn) {
        finishBtn.addEventListener('click', () => {
          this.close();
        });
      }
    }

    dsaTools.speakItalian("Complimenti! Ostacolo superato con spontaneità. Ora sei pronto a riprendere la conversazione senza più questo dubbio!");
  }

  close() {
    if (this.modalOverlay) {
      this.modalOverlay.classList.remove('open');
    }
    if (typeof this.onCompletedCallback === 'function') {
      this.onCompletedCallback();
    }
  }
}

export const microLessonManager = new MicroLessonManager();
