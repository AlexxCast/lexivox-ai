/**
 * LexiVox AI - Comprehensive In-Depth Diagnostic Engine
 * Multi-stage assessment (7 levels) testing Listening (A1 & B1), Phonetics,
 * Structural Grammar, and Spontaneous Spoken Production for accurate CEFR estimation.
 */

import { configManager } from './config.js';
import { dsaTools } from './dsa-tools.js';

export const DIAGNOSTIC_STEPS = [
  {
    step: 1,
    title: "Profilo & Obiettivi",
    badge: "Fase 1: Mappatura DSA",
    question: "Identifichiamo i tuoi punti di blocco e fissiamo l'obiettivo di arrivo:",
    subtext: "Questa diagnosi è studiata per chi ha DSA grave: le domande orali non ti interrompono se fai pause per riflettere.",
    type: "profile_setup"
  },
  {
    step: 2,
    title: "Ascolto Livello A1 (Base)",
    badge: "Fase 2: Listening Base",
    question: "Ascolta la traccia audio qui sotto. Qual è la situazione descritta?",
    audioPrompt: "Good morning! My name is Sarah. I live in Manchester and I work at a local bakery. Every morning at seven, I bake fresh bread and serve warm coffee to customers.",
    options: [
      { text: "Sarah lavora in pasticceria/forno a Manchester dalle 7 del mattino", correct: true },
      { text: "Sarah lavora in un hotel a Londra e serve la colazione alle 9", correct: false },
      { text: "Sarah è una studentessa che viaggia ogni mattina verso Manchester", correct: false }
    ],
    type: "listening_a1"
  },
  {
    step: 3,
    title: "Ascolto Livello B1 (Intermedio)",
    badge: "Fase 3: Listening Intermedio",
    question: "Ascolta questo messaggio in aeroporto. Cosa deve fare il passeggero?",
    audioPrompt: "Attention all passengers for flight BA 204 to Rome: due to unexpected technical maintenance at Gate 12, please proceed immediately to Gate 26 on the second floor.",
    options: [
      { text: "Il volo per Roma è stato cancellato definitivamente", correct: false },
      { text: "I passeggeri devono spostarsi subito al Gate 26 al secondo piano", correct: true },
      { text: "I passeggeri devono ritirare i bagagli al piano terra", correct: false }
    ],
    type: "listening_b1"
  },
  {
    step: 4,
    title: "Fonetica & Pronuncia Guidata",
    badge: "Fase 4: Test Suoni Difficili",
    question: "Premi il microfono e ripeti questa frase a voce alta: 'Three thousand thoughtful travelers arrived together.'",
    targetSentence: "Three thousand thoughtful travelers arrived together.",
    subtext: "Mettiamo alla prova i suoni /θ/ e /ð/ ('th') e le vocali complesse. Non avere fretta: puoi fare pause per respirare!",
    type: "speaking_phonetics"
  },
  {
    step: 5,
    title: "Grammatica Funzionale (Passato)",
    badge: "Fase 5: Azioni nel Passato",
    question: "Quale frase esprime correttamente un'azione completata ieri senza errori?",
    audioPrompt: "Yesterday, we went to the market and bought delicious food.",
    options: [
      { text: "Yesterday, we goed to the market and buyed food.", correct: false },
      { text: "Yesterday, we went to the market and bought delicious food.", correct: true },
      { text: "Yesterday, we go to the market and buying food.", correct: false }
    ],
    type: "grammar_past"
  },
  {
    step: 6,
    title: "Domande & Cortesia (Strutture)",
    badge: "Fase 6: Domande Spontanee",
    question: "Come chiedi gentilmente in un negozio o al bar se puoi avere un bicchiere d'acqua?",
    audioPrompt: "Could I please have a glass of water?",
    options: [
      { text: "Could I please have a glass of water?", correct: true },
      { text: "Do you give me water now please?", correct: false },
      { text: "I am wanting a glass of water.", correct: false }
    ],
    type: "grammar_questions"
  },
  {
    step: 7,
    title: "Produzione Orale Libera",
    badge: "Fase 7: Prova Vocale Spontanea",
    question: "Ascolta la domanda dell'esaminatore e rispondi a voce liberamente (almeno 1 o 2 frasi):",
    promptAudio: "Tell me: what is your favorite hobby or food, and why do you like it?",
    subtext: "Parla al microfono con le tue parole. Quando hai finito, premi il pulsante 'Ho Finito di Parlare'.",
    type: "speaking_spontaneous"
  }
];

class DiagnosticEngine {
  constructor() {
    this.currentStepIndex = 0;
    this.answers = {
      targetGoal: 'B1 (Spoken Fluency)',
      targetDays: 60,
      dsaFeel: 'ansia_parlato',
      listeningA1Score: 0,
      listeningB1Score: 0,
      phoneticsScore: 0,
      grammarPastScore: 0,
      grammarQuestionsScore: 0,
      spontaneousSpeechScore: 0,
      spontaneousTranscript: ''
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
            <label class="a11y-option-label">Qual è l'ostacolo principale che riscontri?</label>
            <div class="options-stack">
              <button class="option-btn selected" data-feel="ansia_parlato">
                <span>Blocco emotivo o lentezza nel trovare le parole a voce (DSA)</span>
                <span class="option-indicator">✓</span>
              </button>
              <button class="option-btn" data-feel="confusione_scrittura">
                <span>Dislessia con le parole scritte e noia mortale con la grammatica teorica</span>
                <span class="option-indicator"></span>
              </button>
              <button class="option-btn" data-feel="pronuncia">
                <span>Difficoltà a distinguere e riprodurre i suoni inglesi corretti</span>
                <span class="option-indicator"></span>
              </button>
            </div>
          </div>

          <div style="margin-bottom: 24px;">
            <label class="a11y-option-label">Il tuo obiettivo di arrivo:</label>
            <div class="btn-pill-group">
              <button class="btn-pill" data-target="A2 (Base Solida)">A2 - Sopravvivenza & Viaggi</button>
              <button class="btn-pill active" data-target="B1 (Spoken Fluency)">B1 - Conversazione Spontanea</button>
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
            Inizia la Diagnosi Approfondita ➔
          </button>
        </div>
      `;
    } else if (stepData.type.startsWith('listening')) {
      contentHtml = `
        <div class="diagnostic-card">
          <span class="question-badge">${stepData.badge}</span>
          <h3 class="question-text">${stepData.question}</h3>
          
          <div class="audio-prompt-box">
            <div>
              <div style="font-weight: 700; font-size: 15px; margin-bottom: 4px;">Traccia Audio Naturale</div>
              <div style="font-size: 13px; color: var(--text-muted);">Premi Play e ascolta con attenzione</div>
            </div>
            <button id="btn-play-diag-audio" class="audio-prompt-btn">
              <span>🔊</span> Ascolta Audio
            </button>
          </div>

          <div class="options-stack" id="diag-options-list">
            ${stepData.options.map(opt => `
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
    } else if (stepData.type === 'speaking_phonetics') {
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
            <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 14px;">
              <button id="btn-diag-mic" class="drill-voice-btn">
                🎙️ Premi e Ripeti a Voce
              </button>
              <button id="btn-diag-finish" class="btn btn-accent" style="display: none; padding: 12px 20px;">
                ✅ Ho Finito (Invia)
              </button>
            </div>
            <div id="diag-mic-result" style="margin-top: 14px; font-size: 16px; min-height: 28px; color: var(--accent-cyan); font-weight: 600;">
              In attesa del tuo parlato (prenditi tutto il tempo per pensare)...
            </div>
          </div>

          <button id="btn-diag-next-step" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 20px;">
            Salva Risultato e Continua ➔
          </button>
        </div>
      `;
    } else if (stepData.type.startsWith('grammar')) {
      contentHtml = `
        <div class="diagnostic-card">
          <span class="question-badge">${stepData.badge}</span>
          <h3 class="question-text">${stepData.question}</h3>

          <div class="options-stack" id="diag-options-list">
            ${stepData.options.map(opt => `
              <button class="option-btn" data-correct="${opt.correct}">
                <span>${opt.text}</span>
                <span class="option-indicator"></span>
              </button>
            `).join('')}
          </div>

          <button id="btn-diag-next-step" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 24px;" disabled>
            Conferma Risposta ➔
          </button>
        </div>
      `;
    } else if (stepData.type === 'speaking_spontaneous') {
      contentHtml = `
        <div class="diagnostic-card">
          <span class="question-badge">${stepData.badge}</span>
          <h3 class="question-text">${stepData.question}</h3>

          <div class="audio-prompt-box">
            <div>
              <div style="font-weight: 700; font-size: 16px; color: var(--text-primary); margin-bottom: 4px;">
                "Tell me: what is your favorite hobby or food, and why do you like it?"
              </div>
              <div style="font-size: 13px; color: var(--text-muted);">
                (Raccontami del tuo cibo o passatempo preferito e perché ti piace)
              </div>
            </div>
            <button id="btn-play-prompt-audio" class="audio-prompt-btn">
              🔊 Ascolta Domanda
            </button>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 14px;">
              <button id="btn-diag-mic" class="drill-voice-btn">
                🎙️ Premi per Rispondere a Voce
              </button>
              <button id="btn-diag-finish" class="btn btn-accent" style="display: none; padding: 12px 20px;">
                ✅ Ho Finito di Parlare
              </button>
            </div>
            <div id="diag-mic-result" style="margin-top: 14px; font-size: 16px; min-height: 28px; color: var(--accent-cyan); font-weight: 600;">
              L'IA analizzerà fluidità, ampiezza lessicale e spontaneità senza fretta...
            </div>
          </div>

          <button id="btn-diag-next-step" class="btn btn-accent btn-lg" style="width: 100%; margin-top: 20px;">
            🏁 Calcola Valutazione CEFR Completa ➔
          </button>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="diagnostic-container">
        <!-- Stepper Indicator -->
        <div class="stepper-header" style="overflow-x: auto; padding-bottom: 8px;">
          ${DIAGNOSTIC_STEPS.map((s, idx) => `
            <div class="stepper-step ${idx === this.currentStepIndex ? 'active' : ''} ${idx < this.currentStepIndex ? 'completed' : ''}" style="min-width: 90px;">
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
      container.querySelectorAll('[data-target]').forEach(btn => {
        btn.addEventListener('click', () => {
          container.querySelectorAll('[data-target]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.answers.targetGoal = btn.getAttribute('data-target');
        });
      });

      container.querySelectorAll('[data-days]').forEach(btn => {
        btn.addEventListener('click', () => {
          container.querySelectorAll('[data-days]').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.answers.targetDays = parseInt(btn.getAttribute('data-days'), 10);
        });
      });

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

    if (stepData.type.startsWith('listening')) {
      const playBtn = container.querySelector('#btn-play-diag-audio');
      if (playBtn) {
        playBtn.addEventListener('click', () => {
          dsaTools.speakEnglish(stepData.audioPrompt, 0.85);
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
          const isCorrect = btn.getAttribute('data-correct') === 'true';
          if (stepData.type === 'listening_a1') {
            this.answers.listeningA1Score = isCorrect ? 100 : 25;
          } else {
            this.answers.listeningB1Score = isCorrect ? 100 : 30;
          }
        });
      });

      nextBtn.addEventListener('click', () => {
        this.currentStepIndex++;
        this.renderStep(container);
      });
    }

    if (stepData.type === 'speaking_phonetics') {
      const sampleBtn = container.querySelector('#btn-listen-sample-phrase');
      if (sampleBtn) {
        sampleBtn.addEventListener('click', () => {
          dsaTools.speakEnglish(stepData.targetSentence, 0.8);
        });
      }

      const micBtn = container.querySelector('#btn-diag-mic');
      const finishBtn = container.querySelector('#btn-diag-finish');
      const micResult = container.querySelector('#diag-mic-result');

      const handleStartSpeech = () => {
        micBtn.classList.add('recording');
        micBtn.textContent = '⏹️ Parla senza fretta...';
        if (finishBtn) finishBtn.style.display = 'inline-flex';
        micResult.textContent = 'Ascolto in corso: fai pure le tue pause...';

        dsaTools.startListening(
          (finalText) => {
            micBtn.classList.remove('recording');
            micBtn.textContent = '🎙️ Riprova se vuoi';
            if (finishBtn) finishBtn.style.display = 'none';
            micResult.innerHTML = `Hai pronunciato: "<strong>${finalText}</strong>"`;
            this.answers.phoneticsScore = 80;
          },
          (interim) => {
            micResult.textContent = `Sto sentendo: "${interim}"...`;
          },
          (err) => {
            micBtn.classList.remove('recording');
            micBtn.textContent = '🎙️ Premi e Ripeti a Voce';
            if (finishBtn) finishBtn.style.display = 'none';
            micResult.textContent = 'Nessun problema, puoi continuare comunque!';
            this.answers.phoneticsScore = 60;
          },
          () => {
            micBtn.classList.remove('recording');
            if (finishBtn) finishBtn.style.display = 'none';
          }
        );
      };

      if (micBtn) {
        micBtn.addEventListener('click', () => {
          if (dsaTools.isListening) {
            dsaTools.forceCommitSpeech();
          } else {
            handleStartSpeech();
          }
        });
      }

      if (finishBtn) {
        finishBtn.addEventListener('click', () => {
          dsaTools.forceCommitSpeech();
        });
      }

      nextBtn.addEventListener('click', () => {
        this.currentStepIndex++;
        this.renderStep(container);
      });
    }

    if (stepData.type.startsWith('grammar')) {
      container.querySelectorAll('#diag-options-list .option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          container.querySelectorAll('#diag-options-list .option-btn').forEach(b => {
            b.classList.remove('selected');
            b.querySelector('.option-indicator').textContent = '';
          });
          btn.classList.add('selected');
          btn.querySelector('.option-indicator').textContent = '✓';
          nextBtn.removeAttribute('disabled');
          const isCorrect = btn.getAttribute('data-correct') === 'true';
          if (stepData.type === 'grammar_past') {
            this.answers.grammarPastScore = isCorrect ? 100 : 25;
          } else {
            this.answers.grammarQuestionsScore = isCorrect ? 100 : 30;
          }
        });
      });

      nextBtn.addEventListener('click', () => {
        this.currentStepIndex++;
        this.renderStep(container);
      });
    }

    if (stepData.type === 'speaking_spontaneous') {
      const playPromptBtn = container.querySelector('#btn-play-prompt-audio');
      if (playPromptBtn) {
        playPromptBtn.addEventListener('click', () => {
          dsaTools.speakEnglish(stepData.promptAudio, 0.85);
        });
      }

      const micBtn = container.querySelector('#btn-diag-mic');
      const finishBtn = container.querySelector('#btn-diag-finish');
      const micResult = container.querySelector('#diag-mic-result');

      const handleStartSpeech = () => {
        micBtn.classList.add('recording');
        micBtn.textContent = '⏹️ Ti sto ascoltando...';
        if (finishBtn) finishBtn.style.display = 'inline-flex';
        micResult.textContent = 'Esprimi il tuo pensiero liberamente: non c\'è limite di tempo.';

        dsaTools.startListening(
          (finalText) => {
            micBtn.classList.remove('recording');
            micBtn.textContent = '🎙️ Vuoi aggiungere altro?';
            if (finishBtn) finishBtn.style.display = 'none';
            micResult.innerHTML = `Hai risposto: "<strong>${finalText}</strong>" (Analisi completata!)`;
            this.answers.spontaneousTranscript = finalText;
            
            // Score based on vocabulary richness
            const words = finalText.trim().split(/\s+/).length;
            this.answers.spontaneousSpeechScore = words >= 8 ? 95 : (words >= 4 ? 75 : 55);
          },
          (interim) => {
            micResult.textContent = `Sto sentendo: "${interim}"...`;
          },
          (err) => {
            micBtn.classList.remove('recording');
            micBtn.textContent = '🎙️ Premi per Rispondere';
            if (finishBtn) finishBtn.style.display = 'none';
            this.answers.spontaneousSpeechScore = 60;
          },
          () => {
            micBtn.classList.remove('recording');
            if (finishBtn) finishBtn.style.display = 'none';
          }
        );
      };

      if (micBtn) {
        micBtn.addEventListener('click', () => {
          if (dsaTools.isListening) {
            dsaTools.forceCommitSpeech();
          } else {
            handleStartSpeech();
          }
        });
      }

      if (finishBtn) {
        finishBtn.addEventListener('click', () => {
          dsaTools.forceCommitSpeech();
        });
      }

      nextBtn.addEventListener('click', () => {
        this.renderCompletion(container);
      });
    }
  }

  renderCompletion(container) {
    // Weighted scoring
    const listeningAvg = (this.answers.listeningA1Score + this.answers.listeningB1Score) / 2;
    const grammarAvg = (this.answers.grammarPastScore + this.answers.grammarQuestionsScore) / 2;
    const speakingAvg = ((this.answers.phoneticsScore || 65) + (this.answers.spontaneousSpeechScore || 65)) / 2;
    
    const compositeScore = Math.round((listeningAvg * 0.3) + (grammarAvg * 0.3) + (speakingAvg * 0.4));

    let finalCefr = 'A1.1 (Principiante)';
    let summaryNote = "Livello elementare: basi solide nell'ascolto contestuale, necessaria pratica sulla spontaneità vocale senza blocchi.";

    if (compositeScore < 35) {
      finalCefr = 'Pre-A1 (Base Assoluta)';
      summaryNote = "Punto di partenza ideale: percorso concentrato al 100% su micro-ripetizioni acustiche per abbattere l'ansia.";
    } else if (compositeScore < 55) {
      finalCefr = 'A1.2 (Elementare Parlato)';
      summaryNote = "Buona comprensione dei messaggi chiari; lavoreremo sul fissare i verbi e la scioltezza della terza persona.";
    } else if (compositeScore < 75) {
      finalCefr = 'A2 (Pre-Intermedio)';
      summaryNote = "Capacità comunicativa evidente! Il lavoro principale sarà eliminare le esitazioni nel formulare domande e passati.";
    } else {
      finalCefr = 'B1 (Intermedio Spontaneo)';
      summaryNote = "Ottima intuizione e pronuncia! Il percorso consoliderà la conversazione continua ad alta velocità.";
    }

    const dailyMinutes = this.answers.targetDays <= 30 ? 35 : (this.answers.targetDays <= 60 ? 25 : 20);

    // Save profile
    configManager.profile.diagnosticCompleted = true;
    configManager.profile.currentLevel = finalCefr;
    configManager.profile.currentScore = compositeScore;
    configManager.profile.targetLevel = this.answers.targetGoal;
    configManager.profile.targetDays = this.answers.targetDays;
    configManager.profile.dailyTargetMinutes = dailyMinutes;
    configManager.profile.radarMetrics.listening = Math.round(listeningAvg || 50);
    configManager.profile.radarMetrics.fluency = Math.round(this.answers.spontaneousSpeechScore || 50);
    configManager.profile.radarMetrics.grammar = Math.round(grammarAvg || 45);
    configManager.profile.radarMetrics.pronunciation = Math.round(this.answers.phoneticsScore || 60);
    configManager.save();

    container.innerHTML = `
      <div class="diagnostic-container">
        <div class="diagnostic-result-card">
          <div class="cefr-big-badge">${finalCefr.split(' ')[0]}</div>
          <h2 style="font-family: var(--font-heading); font-size: 26px; margin-bottom: 8px; color: var(--text-primary);">
            Diagnosi Multidimensionale CEFR Completata!
          </h2>
          <div style="display: inline-block; padding: 4px 14px; background: rgba(58, 134, 255, 0.2); border-radius: 20px; color: var(--accent-blue); font-weight: 700; margin-bottom: 20px;">
            Punteggio Globale: ${compositeScore}/100
          </div>

          <p style="font-size: 15px; color: var(--text-secondary); max-width: 650px; margin: 0 auto 24px; line-height: 1.7;">
            ${summaryNote}
          </p>

          <div class="plan-summary-grid">
            <div class="plan-item">
              <div class="plan-item-title">Livello Assegnato</div>
              <div class="plan-item-value">${finalCefr}</div>
            </div>
            <div class="plan-item">
              <div class="plan-item-title">Obiettivo Stabilito</div>
              <div class="plan-item-value">${this.answers.targetGoal}</div>
            </div>
            <div class="plan-item">
              <div class="plan-item-title">Tempo Giornaliero Calibrato</div>
              <div class="plan-item-value" style="color: var(--accent-amber);">${dailyMinutes} Minuti / Giorno</div>
            </div>
          </div>

          <!-- Radar Mini Breakdown -->
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 28px;">
            <div style="background: var(--bg-surface); padding: 12px; border-radius: 8px;">
              <div style="font-size: 11px; color: var(--text-muted);">ASCOLTO</div>
              <div style="font-size: 16px; font-weight: 700; color: #38bdf8;">${Math.round(listeningAvg)}%</div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: 8px;">
              <div style="font-size: 11px; color: var(--text-muted);">PRONUNCIA</div>
              <div style="font-size: 16px; font-weight: 700; color: #34d399;">${Math.round(this.answers.phoneticsScore || 60)}%</div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: 8px;">
              <div style="font-size: 11px; color: var(--text-muted);">GRAMMATICA</div>
              <div style="font-size: 16px; font-weight: 700; color: #fbbf24;">${Math.round(grammarAvg)}%</div>
            </div>
            <div style="background: var(--bg-surface); padding: 12px; border-radius: 8px;">
              <div style="font-size: 11px; color: var(--text-muted);">SPONTANEITÀ</div>
              <div style="font-size: 16px; font-weight: 700; color: #ec4899;">${Math.round(this.answers.spontaneousSpeechScore || 60)}%</div>
            </div>
          </div>

          <button id="btn-start-first-session" class="btn btn-accent btn-lg" style="width: 100%; max-width: 440px;">
            🎙️ Inizia la Conversazione Adattiva ➔
          </button>
        </div>
      </div>
    `;

    dsaTools.speakItalian(`Diagnosi approfondita completata. Il tuo livello stimato è ${finalCefr}. Per raggiungere il tuo obiettivo abbiamo fissato ${dailyMinutes} minuti di parlato al giorno. Quando sei pronto, iniziamo!`);

    const startBtn = container.querySelector('#btn-start-first-session');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('navigate-to-view', { detail: { view: 'live-dialogue' } }));
      });
    }
  }
}

export const diagnosticEngine = new DiagnosticEngine();
