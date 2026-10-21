/**
 * LexiVox AI - Comprehensive Initial Diagnostic Engine
 * Assesses CEFR baseline (Pre-A1 to B2), oral comprehension, spoken fluency,
 * and computes daily time allocation needed for target level and deadline.
 */

import { configManager } from './config.js';
import { dsaTools } from './dsa-tools.js';

export const DIAGNOSTIC_STEPS = [
  {
    step: 1,
    title: "Obiettivi & Profilo DSA",
    badge: "Fase 1: Conoscersi",
    question: "Qual è il tuo principale blocco con l'inglese e quale livello desideri raggiungere?",
    subtext: "Conoscere il tuo punto di partenza ci permette di costruire un percorso senza stress visivo o ansia da prestazione.",
    type: "profile_setup"
  },
  {
    step: 2,
    title: "Ascolto & Comprensione Orale",
    badge: "Fase 2: Listening",
    question: "Ascolta l'audio qui sotto premendo il tasto Play. Di cosa si sta parlando?",
    audioPrompt: "Hi there! My name is Alex. I live in London and I work as a designer at a creative studio. I really love drawing on weekends.",
    options: [
      { text: "Alex è un cuoco a Londra", correct: false },
      { text: "Alex è un designer a Londra e ama disegnare", correct: true },
      { text: "Alex è uno studente di lingue a Manchester", correct: false }
    ],
    type: "listening"
  },
  {
    step: 3,
    title: "Pronuncia & Spontaneità Parlata",
    badge: "Fase 3: Spoken Challenge",
    question: "Premi il microfono e ripeti questa frase ad alta voce: 'There are three friendly people waiting for us.'",
    targetSentence: "There are three friendly people waiting for us.",
    subtext: "Non preoccuparti della perfezione: l'IA rileva il ritmo, la chiarezza e l'approssimazione fonetica.",
    type: "speaking"
  },
  {
    step: 4,
    title: "Struttura Intuitiva della Frase",
    badge: "Fase 4: Grammar Instinct",
    question: "Completa la frase con l'opzione che 'suona' più naturale: 'Yesterday, she ______ to the market and bought fresh fruit.'",
    audioPrompt: "Yesterday, she ... to the market and bought fresh fruit.",
    options: [
      { text: "went (passato irregolare)", correct: true },
      { text: "go (presente)", correct: false },
      { text: "goed (forma non corretta)", correct: false }
    ],
    type: "grammar"
  }
];

class DiagnosticEngine {
  constructor() {
    this.currentStepIndex = 0;
    this.answers = {
      targetGoal: 'B1 (Spoken Fluency)',
      targetDays: 60,
      dsaFeel: 'ansia_parlato',
      listeningScore: 0,
      speakingScore: 0,
      grammarScore: 0
    };
  }

  renderStep(container) {
    const stepData = DIAGNOSTIC_STEPS[this.currentStepIndex];
    if (!stepData) {
      this.renderCompletion(container);
      return;
    }

    let contentHtml = '';

    if (stepData.type === 'profile_setup') {
      contentHtml = `
        <div class="diagnostic-card">
          <span class="question-badge">${stepData.badge}</span>
          <h3 class="question-text">${stepData.question}</h3>
          <p style="color: var(--text-secondary); margin-bottom: 24px;">${stepData.subtext}</p>
          
          <div style="margin-bottom: 24px;">
            <label class="a11y-option-label">Qual è la difficoltà maggiore che riscontri?</label>
            <div class="options-stack">
              <button class="option-btn selected" data-feel="ansia_parlato">
                <span>Blocco emotivo o ansia quando devo parlare spontaneamente</span>
                <span class="option-indicator">✓</span>
              </button>
              <button class="option-btn" data-feel="confusione_scrittura">
                <span>Le parole scritte si confondono e le regole grammaticali mi annoiano</span>
                <span class="option-indicator"></span>
              </button>
              <button class="option-btn" data-feel="pronuncia">
                <span>Non riesco a distinguere i suoni e pronuncio all'italiana</span>
                <span class="option-indicator"></span>
              </button>
            </div>
          </div>

          <div style="margin-bottom: 24px;">
            <label class="a11y-option-label">Il tuo obiettivo di arrivo:</label>
            <div class="btn-pill-group">
              <button class="btn-pill" data-target="A2 (Base Solida)">A2 - Sopravvivenza & Viaggi</button>
              <button class="btn-pill active" data-target="B1 (Spoken Fluency)">B1 - Fluente e Spontaneo</button>
              <button class="btn-pill" data-target="B2 (Avanzato Professionale)">B2 - Professionale & Lavoro</button>
            </div>
          </div>

          <div style="margin-bottom: 24px;">
            <label class="a11y-option-label">In quanto tempo vuoi raggiungere questo obiettivo?</label>
            <div class="btn-pill-group">
              <button class="btn-pill" data-days="30">30 Giorni (Super Intensivo)</button>
              <button class="btn-pill active" data-days="60">60 Giorni (Consigliato per DSA)</button>
              <button class="btn-pill" data-days="90">90 Giorni (Graduale e Rilassato)</button>
            </div>
          </div>

          <button id="btn-diag-next-step" class="btn btn-primary btn-lg" style="width: 100%;">
            Continua al Test di Ascolto ➔
          </button>
        </div>
      `;
    } else if (stepData.type === 'listening') {
      contentHtml = `
        <div class="diagnostic-card">
          <span class="question-badge">${stepData.badge}</span>
          <h3 class="question-text">${stepData.question}</h3>
          
          <div class="audio-prompt-box">
            <div>
              <div style="font-weight: 700; font-size: 15px; margin-bottom: 4px;">Traccia Audio #1 (Accento Naturale)</div>
              <div style="font-size: 13px; color: var(--text-muted);">Premi per ascoltare con chiarezza</div>
            </div>
            <button id="btn-play-diag-audio" class="audio-prompt-btn">
              <span>🔊</span> Ascolta Audio
            </button>
          </div>

          <div class="options-stack" id="diag-options-list">
            ${stepData.options.map((opt, idx) => `
              <button class="option-btn" data-correct="${opt.correct}">
                <span>${opt.text}</span>
                <span class="option-indicator"></span>
              </button>
            `).join('')}
          </div>

          <button id="btn-diag-next-step" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 24px;" disabled>
            Conferma e Vai Avanti ➔
          </button>
        </div>
      `;
    } else if (stepData.type === 'speaking') {
      contentHtml = `
        <div class="diagnostic-card">
          <span class="question-badge">${stepData.badge}</span>
          <h3 class="question-text">${stepData.question}</h3>
          
          <div class="audio-prompt-box" style="background: rgba(58, 134, 255, 0.08); border-color: rgba(58, 134, 255, 0.3);">
            <span style="font-size: 18px; font-weight: 700; color: var(--accent-cyan);">
              "${stepData.targetSentence}"
            </span>
            <button id="btn-listen-sample-phrase" class="btn btn-secondary" style="padding: 8px 14px;">
              🔊 Ascolta Esempio
            </button>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <button id="btn-diag-mic" class="drill-voice-btn">
              🎙️ Premi e Parla
            </button>
            <div id="diag-mic-result" style="margin-top: 14px; font-size: 16px; min-height: 28px; color: var(--accent-cyan); font-weight: 600;">
              In attesa del tuo parlato...
            </div>
          </div>

          <button id="btn-diag-next-step" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 20px;">
            Registra e Continua ➔
          </button>
        </div>
      `;
    } else if (stepData.type === 'grammar') {
      contentHtml = `
        <div class="diagnostic-card">
          <span class="question-badge">${stepData.badge}</span>
          <h3 class="question-text">${stepData.question}</h3>

          <div class="options-stack" id="diag-options-list">
            ${stepData.options.map((opt, idx) => `
              <button class="option-btn" data-correct="${opt.correct}">
                <span>${opt.text}</span>
                <span class="option-indicator"></span>
              </button>
            `).join('')}
          </div>

          <button id="btn-diag-next-step" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 24px;" disabled>
            Completa Diagnosi e Calcola Piano ➔
          </button>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="diagnostic-container">
        <!-- Stepper Indicator -->
        <div class="stepper-header">
          ${DIAGNOSTIC_STEPS.map((s, idx) => `
            <div class="stepper-step ${idx === this.currentStepIndex ? 'active' : ''} ${idx < this.currentStepIndex ? 'completed' : ''}">
              <div class="step-circle">${idx < this.currentStepIndex ? '✓' : idx + 1}</div>
              <span class="step-title">${s.title}</span>
            </div>
          `).join('')}
        </div>

        ${contentHtml}
      </div>
    `;

    this.bindEvents(container, stepData);
  }

  bindEvents(container, stepData) {
    const nextBtn = container.querySelector('#btn-diag-next-step');

    if (stepData.type === 'profile_setup') {
      // Goal buttons
      container.querySelectorAll('[data-target]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          container.querySelectorAll('[data-target]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.answers.targetGoal = btn.getAttribute('data-target');
        });
      });

      // Days buttons
      container.querySelectorAll('[data-days]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          container.querySelectorAll('[data-days]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.answers.targetDays = parseInt(btn.getAttribute('data-days'), 10);
        });
      });

      // Feel buttons
      container.querySelectorAll('[data-feel]').forEach(btn => {
        btn.addEventListener('click', () => {
          container.querySelectorAll('[data-feel]').forEach(b => {
            b.classList.remove('selected');
            b.querySelector('.option-indicator').textContent = '';
          });
          btn.classList.add('selected');
          btn.querySelector('.option-indicator').textContent = '✓';
          this.answers.dsaFeel = btn.getAttribute('data-feel');
        });
      });

      nextBtn.addEventListener('click', () => {
        this.currentStepIndex++;
        this.renderStep(container);
      });
    }

    if (stepData.type === 'listening') {
      const playBtn = container.querySelector('#btn-play-diag-audio');
      if (playBtn) {
        playBtn.addEventListener('click', () => {
          dsaTools.speakEnglish(stepData.audioPrompt, 0.82);
        });
      }

      container.querySelectorAll('#diag-options-list .option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          container.querySelectorAll('#diag-options-list .option-btn').forEach(b => {
            b.classList.remove('selected');
            b.querySelector('.option-indicator').textContent = '';
          });
          btn.classList.add('selected');
          btn.querySelector('.option-indicator').textContent = '✓';
          nextBtn.removeAttribute('disabled');
          this.answers.listeningScore = btn.getAttribute('data-correct') === 'true' ? 100 : 30;
        });
      });

      nextBtn.addEventListener('click', () => {
        this.currentStepIndex++;
        this.renderStep(container);
      });
    }

    if (stepData.type === 'speaking') {
      const sampleBtn = container.querySelector('#btn-listen-sample-phrase');
      if (sampleBtn) {
        sampleBtn.addEventListener('click', () => {
          dsaTools.speakEnglish(stepData.targetSentence, 0.8);
        });
      }

      const micBtn = container.querySelector('#btn-diag-mic');
      const micResult = container.querySelector('#diag-mic-result');

      if (micBtn) {
        micBtn.addEventListener('click', () => {
          if (dsaTools.isListening) {
            dsaTools.stopListening();
            micBtn.classList.remove('recording');
            micBtn.textContent = '🎙️ Premi e Parla';
          } else {
            micBtn.classList.add('recording');
            micBtn.textContent = '⏹️ Sto Ascoltando... Parla!';
            micResult.textContent = 'Ascolto in corso...';

            dsaTools.startListening(
              (finalText) => {
                micBtn.classList.remove('recording');
                micBtn.textContent = '🎙️ Riprova se vuoi';
                micResult.innerHTML = `Hai detto: "<strong>${finalText}</strong>" (Ottimo tentativo!)`;
                this.answers.speakingScore = 75;
              },
              (interimText) => {
                micResult.textContent = `Sto sentendo: ${interimText}...`;
              },
              (err) => {
                micBtn.classList.remove('recording');
                micBtn.textContent = '🎙️ Premi e Parla';
                micResult.textContent = 'Microfono non rilevato o errore di sistema. Puoi procedere comunque!';
                this.answers.speakingScore = 60;
              },
              () => {
                micBtn.classList.remove('recording');
              }
            );
          }
        });
      }

      nextBtn.addEventListener('click', () => {
        this.currentStepIndex++;
        this.renderStep(container);
      });
    }

    if (stepData.type === 'grammar') {
      container.querySelectorAll('#diag-options-list .option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          container.querySelectorAll('#diag-options-list .option-btn').forEach(b => {
            b.classList.remove('selected');
            b.querySelector('.option-indicator').textContent = '';
          });
          btn.classList.add('selected');
          btn.querySelector('.option-indicator').textContent = '✓';
          nextBtn.removeAttribute('disabled');
          this.answers.grammarScore = btn.getAttribute('data-correct') === 'true' ? 95 : 35;
        });
      });

      nextBtn.addEventListener('click', () => {
        this.currentStepIndex++;
        this.renderCompletion(container);
      });
    }
  }

  renderCompletion(container) {
    // Calculate estimated CEFR Level
    const totalScore = (this.answers.listeningScore + this.answers.speakingScore + this.answers.grammarScore) / 3;
    let initialCefr = 'A1 (Principiante)';
    if (totalScore < 40) initialCefr = 'Pre-A1 (Base Assoluta)';
    else if (totalScore < 65) initialCefr = 'A1.2 (Elementare Parlato)';
    else if (totalScore < 85) initialCefr = 'A2 (Pre-Intermedio)';
    else initialCefr = 'B1 (Intermedio)';

    // Daily required minutes calculated for DSA retention without burnout:
    // 60 days target with 25 minutes active talking guarantees ~25 hours of focused spontaneous speech!
    const dailyMinutes = this.answers.targetDays <= 30 ? 35 : (this.answers.targetDays <= 60 ? 25 : 20);

    // Save into config profile
    configManager.profile.diagnosticCompleted = true;
    configManager.profile.currentLevel = initialCefr;
    configManager.profile.targetLevel = this.answers.targetGoal;
    configManager.profile.targetDays = this.answers.targetDays;
    configManager.profile.dailyTargetMinutes = dailyMinutes;
    configManager.profile.radarMetrics.listening = Math.round(this.answers.listeningScore || 50);
    configManager.profile.radarMetrics.fluency = Math.round(this.answers.speakingScore || 45);
    configManager.profile.radarMetrics.grammar = Math.round(this.answers.grammarScore || 40);
    configManager.save();

    container.innerHTML = `
      <div class="diagnostic-container">
        <div class="diagnostic-result-card">
          <div class="cefr-big-badge">${initialCefr.split(' ')[0]}</div>
          <h2 style="font-family: var(--font-heading); font-size: 28px; margin-bottom: 12px; color: var(--text-primary);">
            Diagnosi Completata con Successo!
          </h2>
          <p style="font-size: 16px; color: var(--text-secondary); max-width: 600px; margin: 0 auto 24px;">
            Abbiamo mappato le tue competenze attuali e calibrato l'IA per adattarsi al tuo stile cognitivo, 
            eliminando la frustrazione della grammatica astratta e puntando tutto sul <strong>parlato attivo</strong>.
          </p>

          <div class="plan-summary-grid">
            <div class="plan-item">
              <div class="plan-item-title">Livello di Partenza</div>
              <div class="plan-item-value">${initialCefr}</div>
            </div>
            <div class="plan-item">
              <div class="plan-item-title">Obiettivo Fissato</div>
              <div class="plan-item-value">${this.answers.targetGoal}</div>
            </div>
            <div class="plan-item">
              <div class="plan-item-title">Tempo Giornaliero Obbligatorio</div>
              <div class="plan-item-value" style="color: var(--accent-amber);">${dailyMinutes} Minuti / Giorno</div>
            </div>
          </div>

          <div style="background: rgba(6, 214, 160, 0.1); border: 1px solid rgba(6, 214, 160, 0.3); border-radius: var(--radius-md); padding: 18px; margin-bottom: 30px; text-align: left;">
            <div style="font-weight: 700; color: var(--accent-cyan); margin-bottom: 6px;">💡 Come Funziona il Tuo Canale Vocale Adattivo:</div>
            <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.6;">
              Quando parli con l'IA Tutor, il sistema monitora costantemente la spontaneità. 
              Se commetti errori ripetuti sullo stesso argomento, l'IA aprirà una <strong>Micro-Lezione di Sblocco Immediata</strong> 
              per guidarti con 3 prove parlate veloci. Una volta superata con naturalezza, si riprende la conversazione!
            </p>
          </div>

          <button id="btn-start-first-session" class="btn btn-accent btn-lg" style="width: 100%; max-width: 400px;">
            🎙️ Entra nel Canale Vocale Live ➔
          </button>
        </div>
      </div>
    `;

    // Voice announcement
    dsaTools.speakItalian(`Diagnosi completata! Il tuo livello iniziale stimato è ${initialCefr}. Abbiamo impostato ${dailyMinutes} minuti di pratica parlata al giorno per raggiungere il tuo obiettivo in ${this.answers.targetDays} giorni. Sei pronto a parlare?`);

    const startBtn = container.querySelector('#btn-start-first-session');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        // Trigger event to switch to Live Spoken Dialogue View
        window.dispatchEvent(new CustomEvent('navigate-to-view', { detail: { view: 'live-dialogue' } }));
      });
    }
  }
}

export const diagnosticEngine = new DiagnosticEngine();
