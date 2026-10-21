/**
 * LexiVox AI - Oral Examiner Interview Engine (Colloquio Vocale con l'Esaminatore)
 * Replaces cold button quizzes with an authentic, empathetic 4-turn spoken interview
 * evaluating genuine spoken English, vocabulary variety, tense control, and DSA access latency.
 */

import { configManager } from './config.js';
import { dsaTools } from './dsa-tools.js';
import { isEnglishWord, PAST_TENSE_MARKERS, CONNECTORS } from './lexicon.js';

export const EXAMINER_QUESTIONS = [
  {
    turn: 1,
    title: "Accoglienza & Difficoltà DSA",
    badge: "Turno 1: Conoscersi",
    enAudio: "Hello! Welcome to your language assessment. I am Professor David, your oral examiner. Don't worry at all about making mistakes. First, please introduce yourself and tell me what difficulties you have had learning English.",
    itGuide: "Presentati liberamente (nome, cosa fai) e racconta a voce quali difficoltà o blocchi hai sempre avuto con l'inglese.",
    category: "introduction"
  },
  {
    turn: 2,
    title: "Vita Quotidiana & Abitudini",
    badge: "Turno 2: Presente & Routine",
    enAudio: "Thank you for sharing that with me. Now, please describe your daily routine: what time do you usually wake up, and what is your favorite part of the day?",
    itGuide: "Descrivi la tua routine quotidiana: a che ora ti svegli di solito e cosa fai durante la giornata.",
    category: "routine"
  },
  {
    turn: 3,
    title: "Esperienze Passate",
    badge: "Turno 3: Narrazione al Passato",
    enAudio: "Great effort! Now, think about last weekend or yesterday: where did you go, what did you do, and what was something interesting you ate or saw?",
    itGuide: "Racconta al passato di ieri o dell'ultimo weekend: dove sei andato, cosa hai fatto o mangiato.",
    category: "past"
  },
  {
    turn: 4,
    title: "Situazione Pratica all'Estero",
    badge: "Turno 4: Problem Solving",
    enAudio: "Imagine you are traveling abroad and you arrive at your hotel, but the receptionist cannot find your reservation. What would you say to ask for help?",
    itGuide: "Immagina di essere in un hotel all'estero e non trovano la tua prenotazione. Cosa dici all'addetto per spiegare il problema?",
    category: "situation"
  }
];

class DiagnosticEngine {
  constructor() {
    this.currentTurn = 0;
    this.candidateResponses = [];
    this.isRecording = false;
  }

  renderStep(container) {
    if (this.currentTurn >= EXAMINER_QUESTIONS.length) {
      this.evaluateAndRenderReport(container);
      return;
    }

    const question = EXAMINER_QUESTIONS[this.currentTurn];

    container.innerHTML = `
      <div class="diagnostic-container" style="max-width: 820px; margin: 0 auto;">
        <!-- Examiner Room Header -->
        <div class="card" style="margin-bottom: 24px; border: 1px solid rgba(58, 134, 255, 0.3); background: linear-gradient(135deg, rgba(28, 38, 59, 0.9), rgba(15, 23, 42, 0.9));">
          <div style="display: flex; align-items: center; gap: 16px;">
            <div style="width: 58px; height: 58px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-blue), var(--accent-purple)); display: flex; align-items: center; justify-content: center; font-size: 28px; box-shadow: 0 0 20px rgba(58, 134, 255, 0.4);">
              👨‍🏫
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <h3 style="font-family: var(--font-heading); font-size: 18px; color: var(--text-primary); margin: 0;">Prof. David</h3>
                <span class="brand-tag">Esaminatore Orale CEFR</span>
              </div>
              <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">
                Colloquio d'Esame Adattivo per DSA • Turno ${this.currentTurn + 1} di ${EXAMINER_QUESTIONS.length}
              </p>
            </div>
          </div>
        </div>

        <!-- Examiner Speech Card -->
        <div class="diagnostic-card" style="position: relative;">
          <span class="question-badge">${question.badge}</span>
          
          <div style="background: var(--bg-surface); border-left: 4px solid var(--accent-blue); padding: 18px 20px; border-radius: 10px; margin: 16px 0 24px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
              <p style="font-size: 17px; font-weight: 600; color: var(--text-primary); line-height: 1.6; margin: 0;">
                "${question.enAudio}"
              </p>
              <button id="btn-examiner-speak" class="audio-btn-inline" style="width: 40px; height: 40px; font-size: 18px; flex-shrink: 0;" title="Ascolta l'esaminatore">
                🔊
              </button>
            </div>

            <div style="margin-top: 14px; font-size: 14px; color: var(--accent-cyan); font-style: italic; border-top: 1px dashed var(--border-subtle); padding-top: 10px;">
              💡 <strong>Cosa ti chiede l'esaminatore:</strong> ${question.itGuide}
            </div>
          </div>

          <!-- Spoken Candidate Console -->
          <!-- Spoken Candidate Console -->
          <div style="text-align: center; padding: 16px 0 8px;">
            <div style="display: flex; justify-content: center; align-items: center; gap: 14px; flex-wrap: wrap; margin-bottom: 12px;">
              <button id="btn-diag-mic" class="drill-voice-btn" style="min-width: 220px;">
                🎙️ Premi e Rispondi a Voce
              </button>
              <button id="btn-diag-finish" class="btn btn-accent btn-finish-recording" style="display: none; padding: 14px 22px; font-weight: 700;">
                ✅ Ho Finito di Parlare
              </button>
            </div>

            <div id="diag-mic-feedback" style="font-size: 14px; color: var(--text-muted); min-height: 28px; line-height: 1.5;">
              Tocca il microfono e parla in inglese, oppure scrivi direttamente nel riquadro sotto.
            </div>
          </div>

          <!-- Live Real-Time Editable Transcript Box -->
          <div style="margin: 12px 0 16px; text-align: left;">
            <label style="font-size: 13px; font-weight: 700; color: var(--text-primary); display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <span>📝 La tua risposta (parlata a voce o scritta):</span>
              <span id="diag-recording-indicator" style="display: none; color: #ef4444; font-size: 12px; font-weight: 700;">🔴 In Ascolto...</span>
            </label>
            <textarea id="diag-response-input" rows="3" class="console-text-input" style="width: 100%; border-radius: 8px; padding: 12px 14px; font-size: 16px; line-height: 1.5; resize: vertical;" placeholder="Tocca il microfono e parla in inglese, oppure digita qui la tua risposta..."></textarea>
            <div id="diag-warning-msg" style="display: none; color: #f59e0b; font-size: 13px; margin-top: 6px; font-weight: 600;"></div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 14px;">
            <button id="btn-next-turn" class="btn btn-primary btn-lg" style="width: 100%;">
              ${this.currentTurn < EXAMINER_QUESTIONS.length - 1 ? 'Conferma e Passa alla Prossima Domanda ➔' : 'Completa il Colloquio e Mostra Valutazione CEFR ➔'}
            </button>
            <button id="btn-skip-turn" class="btn" style="width: 100%; background: transparent; border: 1px solid var(--border-subtle); color: var(--text-muted); font-size: 13px; padding: 8px;">
              Non riesco a rispondere, salta domanda ➔
            </button>
          </div>
        </div>
      </div>
    `;

    // Auto-speak examiner question
    setTimeout(() => {
      dsaTools.speakEnglish(question.enAudio, 0.85);
    }, 400);

    this.bindTurnEvents(container, question);
  }

  bindTurnEvents(container, question) {
    const speakBtn = container.querySelector('#btn-examiner-speak');
    const micBtn = container.querySelector('#btn-diag-mic');
    const finishBtn = container.querySelector('#btn-diag-finish');
    const feedbackText = container.querySelector('#diag-mic-feedback');
    const responseInput = container.querySelector('#diag-response-input');
    const recordingIndicator = container.querySelector('#diag-recording-indicator');
    const warningMsg = container.querySelector('#diag-warning-msg');
    const nextBtn = container.querySelector('#btn-next-turn');
    const skipBtn = container.querySelector('#btn-skip-turn');

    if (speakBtn) {
      speakBtn.addEventListener('click', () => {
        dsaTools.speakEnglish(question.enAudio, 0.85);
      });
    }

    const startRecording = () => {
      this.isRecording = true;
      micBtn.classList.add('recording');
      micBtn.textContent = '⏹️ Parla Pure...';
      if (finishBtn) finishBtn.style.display = 'inline-flex';
      if (recordingIndicator) recordingIndicator.style.display = 'inline';
      if (warningMsg) warningMsg.style.display = 'none';
      feedbackText.style.color = 'var(--accent-cyan)';
      feedbackText.textContent = '🎤 Ti sto ascoltando: fai tutte le tue pause. Quando hai detto tutto premi "Ho Finito di Parlare"!';

      dsaTools.startListening(
        (finalText) => {
          this.isRecording = false;
          micBtn.classList.remove('recording');
          micBtn.textContent = '🎙️ Riascolta / Riprova';
          if (finishBtn) finishBtn.style.display = 'none';
          if (recordingIndicator) recordingIndicator.style.display = 'none';

          if (finalText && responseInput) {
            responseInput.value = finalText;
          }
          feedbackText.style.color = 'var(--accent-emerald)';
          feedbackText.textContent = '✅ Risposta recepita! Puoi correggerla a mano o premere il tasto blu per confermare.';
        },
        (interimText) => {
          if (interimText && responseInput) {
            responseInput.value = interimText;
          }
          feedbackText.textContent = `Sto sentendo la tua voce...`;
        },
        (err) => {
          this.isRecording = false;
          micBtn.classList.remove('recording');
          micBtn.textContent = '🎙️ Premi e Rispondi';
          if (finishBtn) finishBtn.style.display = 'none';
          if (recordingIndicator) recordingIndicator.style.display = 'none';
          feedbackText.textContent = 'Microfono non udito o non disponibile. Puoi anche scrivere la risposta qui sotto.';
        },
        () => {
          this.isRecording = false;
          micBtn.classList.remove('recording');
          if (finishBtn) finishBtn.style.display = 'none';
          if (recordingIndicator) recordingIndicator.style.display = 'none';
        }
      );
    };

    if (micBtn) {
      micBtn.addEventListener('click', () => {
        if (dsaTools.isListening) {
          dsaTools.forceCommitSpeech();
        } else {
          startRecording();
        }
      });
    }

    if (finishBtn) {
      finishBtn.addEventListener('click', () => {
        dsaTools.forceCommitSpeech();
      });
    }

    const proceedWithAnswer = (text) => {
      if (dsaTools.isListening) {
        dsaTools.stopListening();
      }
      this.candidateResponses.push({
        turn: question.turn,
        category: question.category,
        transcript: text || ''
      });
      this.currentTurn++;
      this.renderStep(container);
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (dsaTools.isListening) {
          dsaTools.forceCommitSpeech();
        }
        let text = responseInput ? responseInput.value.trim() : '';
        if (!text && dsaTools.latestRecognizedText) {
          text = dsaTools.latestRecognizedText.trim();
          if (responseInput) responseInput.value = text;
        }

        if (!text) {
          if (warningMsg) {
            warningMsg.style.display = 'block';
            warningMsg.textContent = '⚠️ Non hai ancora risposto: tocca il microfono per parlare, scrivi nel riquadro o premi "Salta domanda" se preferisci non rispondere.';
          }
          return;
        }
        proceedWithAnswer(text);
      });
    }

    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        proceedWithAnswer('');
      });
    }
  }

  evaluateAndRenderReport(container) {
    // Thorough Multi-Factor CEFR Linguistics Evaluation using 2000+ Word Lexicon & Morphology
    let totalWordsCount = 0;
    let legitimateEnglishCount = 0;
    let pastVerbsCount = 0;
    let connectorsCount = 0;
    let uniqueWords = new Set();
    const recognizedTokens = [];

    for (const res of this.candidateResponses) {
      const words = (res.transcript || '')
        .toLowerCase()
        .replace(/[^\w\s']/g, ' ')
        .trim()
        .split(/\s+/)
        .filter(w => w.length > 0);

      totalWordsCount += words.length;

      for (const w of words) {
        uniqueWords.add(w);

        if (isEnglishWord(w)) {
          legitimateEnglishCount++;
          recognizedTokens.push(w);
        }

        if (PAST_TENSE_MARKERS.has(w) || (w.endsWith('ed') && isEnglishWord(w))) {
          pastVerbsCount++;
        }

        if (CONNECTORS.has(w)) {
          connectorsCount++;
        }
      }
    }

    // Realistic, fair CEFR Level mapping calibrated for spoken English & DSA learners
    let cefrLevel = 'A2 (Pre-Intermedio)';
    let overallScore = 72;
    let feedbackNotes = [];

    if (totalWordsCount === 0 || legitimateEnglishCount === 0) {
      cefrLevel = 'Pre-A1 (Base Assoluta)';
      overallScore = 20;
      feedbackNotes = [
        "Nessuna frase registrata durante il colloquio orale.",
        "Se il microfono non ha catturato la tua voce, puoi ripetere il test oppure selezionare direttamente il tuo livello (es. A2 o B1) nei pulsanti qui sotto."
      ];
    } else if (totalWordsCount < 8 && legitimateEnglishCount <= 3) {
      cefrLevel = 'A1.1 (Principiante)';
      overallScore = 45;
      feedbackNotes = [
        `Hai usato ${legitimateEnglishCount} parole in inglese. Le risposte sono state molto brevi o frammentate.`,
        "Ottimo punto di partenza: alleneremo a voce le strutture minime (Soggetto + Verbo) per superare i blocchi."
      ];
    } else if (totalWordsCount < 18 && connectorsCount === 0 && pastVerbsCount === 0) {
      cefrLevel = 'A1.2 (Elementare Parlato)';
      overallScore = 58;
      feedbackNotes = [
        `Buona produzione di base (${legitimateEnglishCount} parole inglesi riconosciute). Riesci a farti capire sulle informazioni essenziali.`,
        "Consigliato lavoro sull'unione di frasi e l'uso spontaneo di connettori come 'and', 'because', 'so'."
      ];
    } else if (totalWordsCount >= 32 && (connectorsCount >= 2 || pastVerbsCount >= 1 || uniqueWords.size >= 16)) {
      cefrLevel = 'B1 (Intermedio Spontaneo)';
      overallScore = 84;
      feedbackNotes = [
        `Livello conversazionale molto solido: ${legitimateEnglishCount} parole autentiche su ${totalWordsCount}!`,
        "Capacità dimostrata di descrivere esperienze passate, gestire l'imprevisto all'hotel e collegare le frasi con naturalezza.",
        "Percorso sintonizzato su B1: espressioni idiomatiche, micro-sfumature e fluidità a tempo reale."
      ];
    } else {
      // Solid communicative A2
      cefrLevel = 'A2 (Pre-Intermedio)';
      overallScore = 72;
      feedbackNotes = [
        `Ottima competenza comunicativa dimostrata (${legitimateEnglishCount} parole inglesi riconosciute)!`,
        "Capacità di sostenere il dialogo, presentarsi, parlare della propria vita quotidiana e risolvere problemi pratici.",
        "Il tutor David partirà da questo livello per farti raggiungere la piena sicurezza B1 senza ansia."
      ];
    }

    const dailyTargetMinutes = 25;

    // Persist verified profile
    configManager.profile.diagnosticCompleted = true;
    configManager.profile.currentLevel = cefrLevel;
    configManager.profile.currentScore = overallScore;
    configManager.profile.dailyTargetMinutes = dailyTargetMinutes;
    configManager.profile.radarMetrics.listening = Math.round(overallScore * 0.9);
    configManager.profile.radarMetrics.fluency = Math.round(overallScore * 0.85);
    configManager.profile.radarMetrics.grammar = Math.round(overallScore * 0.8);
    configManager.profile.radarMetrics.vocabulary = Math.round(Math.min(100, Math.max(40, uniqueWords.size * 3.5)));
    configManager.save();

    // Update level badge in header
    const headerPill = document.getElementById('header-user-level');
    if (headerPill) {
      headerPill.textContent = `Livello: ${cefrLevel.split(' ')[0]}`;
    }

    container.innerHTML = `
      <div class="diagnostic-container" style="max-width: 820px; margin: 0 auto;">
        <div class="diagnostic-result-card">
          <div id="diag-big-badge" class="cefr-big-badge">${cefrLevel.split(' ')[0]}</div>
          <h2 style="font-family: var(--font-heading); font-size: 26px; color: var(--text-primary); margin-bottom: 8px;">
            Verdetto Ufficiale del Colloquio Orale
          </h2>
          <div style="font-size: 14px; color: var(--text-muted); margin-bottom: 20px;">
            Valutato da Prof. David in base alle tue risposte vocali autentiche
          </div>

          <div style="background: var(--bg-surface); border-radius: var(--radius-md); padding: 20px; text-align: left; margin-bottom: 24px; border-left: 4px solid var(--accent-blue);">
            <div style="font-size: 13px; font-weight: 700; color: var(--accent-blue); text-transform: uppercase; margin-bottom: 8px;">
              📋 Valutazione Qualitativa dell'Esaminatore:
            </div>
            <ul style="font-size: 14px; color: var(--text-primary); line-height: 1.7; padding-left: 20px; margin-bottom: 0;">
              ${feedbackNotes.map(n => `<li>${n}</li>`).join('')}
            </ul>
          </div>

          <div class="plan-summary-grid">
            <div class="plan-item">
              <div class="plan-item-title">Livello Diagnosticato</div>
              <div id="diag-summary-level" class="plan-item-value">${cefrLevel}</div>
            </div>
            <div class="plan-item">
              <div class="plan-item-title">Parole Riconosciute</div>
              <div class="plan-item-value">${legitimateEnglishCount} / ${totalWordsCount}</div>
            </div>
            <div class="plan-item">
              <div class="plan-item-title">Vocabolario Unico</div>
              <div class="plan-item-value" style="color: var(--accent-cyan);">${uniqueWords.size} termini</div>
            </div>
          </div>

          <!-- Interactive Level Manual Selector (Full control for the learner) -->
          <div style="margin: 22px 0; padding: 18px 20px; background: rgba(58, 134, 255, 0.08); border-radius: 12px; border: 1px dashed rgba(58, 134, 255, 0.4); text-align: center;">
            <div style="font-size: 15px; font-weight: 700; color: var(--accent-cyan); margin-bottom: 6px;">
              🎯 Desideri confermare o personalizzare il tuo livello?
            </div>
            <p style="font-size: 13px; color: var(--text-muted); margin: 0 0 14px; line-height: 1.5;">
              Se ritieni che il tuo reale livello parlato sia tra <strong>A2</strong> e <strong>B1</strong>, tocca il livello con cui desideri iniziare. L'IA adatterà subito tutte le conversazioni:
            </p>
            <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
              <button class="btn btn-sm diag-pick-btn ${cefrLevel.includes('A1') ? 'active-level' : ''}" data-level="A1 (Principiante)" style="padding: 8px 14px;">A1 (Principiante)</button>
              <button class="btn btn-sm diag-pick-btn ${cefrLevel.includes('A2') ? 'active-level' : ''}" data-level="A2 (Pre-Intermedio)" style="padding: 8px 14px; font-weight: 700;">A2 (Pre-Intermedio)</button>
              <button class="btn btn-sm diag-pick-btn ${cefrLevel.includes('B1') ? 'active-level' : ''}" data-level="B1 (Intermedio Spontaneo)" style="padding: 8px 14px; font-weight: 700;">B1 (Intermedio Spontaneo)</button>
              <button class="btn btn-sm diag-pick-btn ${cefrLevel.includes('B2') ? 'active-level' : ''}" data-level="B2 (Autonomo Avanzato)" style="padding: 8px 14px;">B2 (Autonomo)</button>
            </div>
            <div id="diag-level-feedback" style="margin-top: 10px; font-size: 13px; color: var(--accent-emerald); font-weight: 600; display: none;"></div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px; align-items: center; margin-top: 20px;">
            <button id="btn-enter-live-chat" class="btn btn-accent btn-lg" style="width: 100%; max-width: 440px;">
              🎙️ Entra nel Canale di Conversazione Quotidiano ➔
            </button>
            <button id="btn-repeat-diagnostic" class="btn" style="background: transparent; border: 1px solid var(--border-subtle); color: var(--text-muted); font-size: 13px; padding: 8px 18px;">
              🔄 Ripeti il Colloquio d'Esame con l'Esaminatore
            </button>
          </div>
        </div>
      </div>
    `;

    dsaTools.speakItalian(`Colloquio completato. Il tuo livello stimato è ${cefrLevel}. Abbiamo preparato il percorso su misura per te.`);

    // Bind Level Picker Buttons
    const pickBtns = container.querySelectorAll('.diag-pick-btn');
    const feedbackMsg = container.querySelector('#diag-level-feedback');
    const bigBadge = container.querySelector('#diag-big-badge');
    const summaryLevel = container.querySelector('#diag-summary-level');

    pickBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const picked = btn.getAttribute('data-level');
        configManager.profile.currentLevel = picked;
        configManager.save();

        pickBtns.forEach(b => b.classList.remove('active-level'));
        btn.classList.add('active-level');

        if (bigBadge) bigBadge.textContent = picked.split(' ')[0];
        if (summaryLevel) summaryLevel.textContent = picked;
        if (headerPill) headerPill.textContent = `Livello: ${picked.split(' ')[0]}`;

        if (feedbackMsg) {
          feedbackMsg.style.display = 'block';
          feedbackMsg.textContent = `✅ Livello impostato su ${picked}! Il tutor David si adatterà immediatamente.`;
        }
        dsaTools.speakItalian(`Livello impostato su ${picked}.`);
      });
    });

    // Bind Navigation & Repeat
    const enterBtn = container.querySelector('#btn-enter-live-chat');
    if (enterBtn) {
      enterBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('navigate-to-view', { detail: { view: 'live-dialogue' } }));
      });
    }

    const repeatBtn = container.querySelector('#btn-repeat-diagnostic');
    if (repeatBtn) {
      repeatBtn.addEventListener('click', () => {
        this.currentTurn = 0;
        this.candidateResponses = [];
        this.renderStep(container);
      });
    }
  }
}

export const diagnosticEngine = new DiagnosticEngine();
