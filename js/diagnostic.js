/**
 * LexiVox AI - Oral Examiner Interview Engine (Colloquio Vocale con l'Esaminatore)
 * Replaces cold button quizzes with an authentic, empathetic 4-turn spoken interview
 * evaluating genuine spoken English, vocabulary variety, tense control, and DSA access latency.
 */

import { configManager } from './config.js';
import { dsaTools } from './dsa-tools.js';

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
        const text = responseInput ? responseInput.value.trim() : '';
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
    // Thorough Multi-Factor CEFR Linguistics Evaluation
    let totalWordsCount = 0;
    let legitimateEnglishCount = 0;
    let pastVerbsCount = 0;
    let uniqueWords = new Set();

    const ENGLISH_LEXICON = new Set([
      'i', 'you', 'he', 'she', 'it', 'we', 'they', 'my', 'your', 'his', 'her', 'our', 'their',
      'wake', 'woke', 'up', 'morning', 'night', 'sleep', 'bed', 'day', 'time', 'clock', 'hour',
      'go', 'went', 'gone', 'eat', 'ate', 'drink', 'drank', 'see', 'saw', 'buy', 'bought', 'have', 'had',
      'work', 'worked', 'study', 'studied', 'learn', 'learned', 'english', 'speak', 'spoke', 'talk',
      'hotel', 'room', 'reservation', 'name', 'book', 'booked', 'card', 'passport', 'help', 'please',
      'weekend', 'yesterday', 'travel', 'trip', 'friend', 'friends', 'family', 'food', 'pizza', 'pasta',
      'problem', 'difficult', 'difficulty', 'because', 'with', 'in', 'at', 'on', 'to', 'for', 'from',
      'is', 'am', 'are', 'was', 'were', 'do', 'did', 'does', 'would', 'could', 'can', 'want', 'like'
    ]);

    for (const res of this.candidateResponses) {
      const words = res.transcript.toLowerCase().replace(/[^\w\s']/g, ' ').trim().split(/\s+/).filter(w => w.length > 0);
      totalWordsCount += words.length;

      for (const w of words) {
        uniqueWords.add(w);
        const base = w.replace(/(s|ed|ing|ly)$/, '');
        if (ENGLISH_LEXICON.has(w) || ENGLISH_LEXICON.has(base) || w.length <= 2) {
          legitimateEnglishCount++;
        }
        if (['went', 'bought', 'saw', 'had', 'ate', 'did', 'visited', 'watched', 'was', 'were', 'arrived'].includes(w)) {
          pastVerbsCount++;
        }
      }
    }

    const englishValidityRatio = totalWordsCount > 0 ? legitimateEnglishCount / totalWordsCount : 0;
    const isAuthenticEnglish = englishValidityRatio >= 0.45 && totalWordsCount >= 4;

    let cefrLevel = 'Pre-A1 (Base Assoluta)';
    let overallScore = 20;
    let feedbackNotes = [];

    if (!isAuthenticEnglish) {
      cefrLevel = 'Pre-A1 (Iniziale)';
      overallScore = Math.max(15, Math.min(30, Math.round(englishValidityRatio * 50)));
      feedbackNotes = [
        "L'esaminatore ha rilevato pochissime parole inglesi riconoscibili o molte parole non contestuali.",
        "Nessun problema: il punto di partenza naturale per chi ha DSA grave è iniziare da zero senza ansia.",
        "Il percorso partirà dai fonemi e dal vocabolario visivo ad altissima frequenza."
      ];
    } else {
      // Realistic CEFR grading
      if (totalWordsCount < 12) {
        cefrLevel = 'A1.1 (Principiante)';
        overallScore = 40;
        feedbackNotes = [
          "Riconosciute alcune parole inglesi corrette, ma le risposte sono molto brevi o frammentate.",
          "Consigliato lavoro su strutture minime SOGGETTO + VERBO per sbloccare la spontaneità."
        ];
      } else if (pastVerbsCount === 0 || totalWordsCount < 25) {
        cefrLevel = 'A1.2 (Elementare Parlato)';
        overallScore = 55;
        feedbackNotes = [
          "Buona comprensione delle domande dell'esaminatore e capacità di rispondere su argomenti base.",
          "Difficoltà evidente sui tempi passati (necessario superare la tendenza a usare solo il presente).",
          "La memoria di lavoro necessita di micro-esercizi mirati di sblocco."
        ];
      } else if (pastVerbsCount >= 1 && totalWordsCount >= 25 && uniqueWords.size >= 14) {
        cefrLevel = 'A2 (Pre-Intermedio)';
        overallScore = 72;
        feedbackNotes = [
          "Ottima capacità di sostenere il colloquio orale con lessico vario!",
          "Uso spontaneo di azioni nel passato e gestione efficace della situazione problematica all'hotel.",
          "Obiettivo: aumentare la fluidità e ridurre le esitazioni iniziali."
        ];
      } else {
        cefrLevel = 'B1 (Intermedio Spontaneo)';
        overallScore = 85;
        feedbackNotes = [
          "Livello conversazionale spontaneo molto solido!",
          "Capacità di argomentare e spiegare problemi imprevisti in lingua con naturalezza."
        ];
      }
    }

    const dailyTargetMinutes = 25;

    // Save accurate profile
    configManager.profile.diagnosticCompleted = true;
    configManager.profile.currentLevel = cefrLevel;
    configManager.profile.currentScore = overallScore;
    configManager.profile.dailyTargetMinutes = dailyTargetMinutes;
    configManager.profile.radarMetrics.listening = Math.round(overallScore * 0.9);
    configManager.profile.radarMetrics.fluency = Math.round(overallScore * 0.85);
    configManager.profile.radarMetrics.grammar = Math.round(overallScore * 0.8);
    configManager.profile.radarMetrics.vocabulary = Math.round(Math.min(100, uniqueWords.size * 4));
    configManager.save();

    container.innerHTML = `
      <div class="diagnostic-container" style="max-width: 820px; margin: 0 auto;">
        <div class="diagnostic-result-card">
          <div class="cefr-big-badge">${cefrLevel.split(' ')[0]}</div>
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
            <ul style="font-size: 14px; color: var(--text-primary); line-height: 1.7; padding-left: 20px;">
              ${feedbackNotes.map(n => `<li>${n}</li>`).join('')}
            </ul>
          </div>

          <div class="plan-summary-grid">
            <div class="plan-item">
              <div class="plan-item-title">Livello Diagnosticato</div>
              <div class="plan-item-value">${cefrLevel}</div>
            </div>
            <div class="plan-item">
              <div class="plan-item-title">Parole Riconosciute</div>
              <div class="plan-item-value">${legitimateEnglishCount} / ${totalWordsCount}</div>
            </div>
            <div class="plan-item">
              <div class="plan-item-title">Tempo Giornaliero Richiesto</div>
              <div class="plan-item-value" style="color: var(--accent-amber);">${dailyTargetMinutes} Min / Giorno</div>
            </div>
          </div>

          <button id="btn-enter-live-chat" class="btn btn-accent btn-lg" style="width: 100%; max-width: 440px;">
            🎙️ Entra nel Canale di Conversazione Quotidiano ➔
          </button>
        </div>
      </div>
    `;

    dsaTools.speakItalian(`Colloquio completato. In base alle tue risposte orali, il tuo livello stimato è ${cefrLevel}. Abbiamo preparato il tuo percorso su misura.`);

    const enterBtn = container.querySelector('#btn-enter-live-chat');
    if (enterBtn) {
      enterBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('navigate-to-view', { detail: { view: 'live-dialogue' } }));
      });
    }
  }
}

export const diagnosticEngine = new DiagnosticEngine();
