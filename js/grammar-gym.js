/**
 * LexiVox AI - Adaptive Grammar Gym Engine (Palestra di Grammatica Adattiva)
 * Fully adaptive exercise generator tailored to student's CEFR level (A1-B1) and active error bottlenecks.
 * STRICTLY NO MULTIPLE CHOICE: Direct fill-in by typing or speaking, instant correction, and native audio pronunciation.
 */

import { configManager } from './config.js';
import { dsaTools } from './dsa-tools.js';

export const GRAMMAR_EXERCISE_BANK = [
  // -------------------------------------------------------------
  // Category 1: 3ª Persona Singolare (-s / -es / doesn't)
  // -------------------------------------------------------------
  {
    id: 'tps_01',
    level: 'A1',
    category: '3ª Persona (-s)',
    categoryKey: 'third_person_s',
    itPrompt: "Lui lavora in un'azienda informatica ogni giorno.",
    beforeBlank: "He",
    afterBlank: "in an IT company every day.",
    expected: "works",
    acceptable: ["works"],
    fullSentence: "He works in an IT company every day.",
    rule: "Con He, She, It il verbo aggiunge sempre la '-S' finale al presente (work ➔ works).",
    hint: "Pensa alla desinenza finale: 'work' con He diventa..."
  },
  {
    id: 'tps_02',
    level: 'A1',
    category: '3ª Persona (-s)',
    categoryKey: 'third_person_s',
    itPrompt: "Lei vive a Roma con suo fratello.",
    beforeBlank: "She",
    afterBlank: "in Rome with her brother.",
    expected: "lives",
    acceptable: ["lives"],
    fullSentence: "She lives in Rome with her brother.",
    rule: "Con 'She' (terza persona singolare), il verbo 'live' prende la -s: 'lives'.",
    hint: "Il verbo è 'live', aggiungi la 's' per la terza persona."
  },
  {
    id: 'tps_03',
    level: 'A2',
    category: '3ª Persona (-s)',
    categoryKey: 'third_person_s',
    itPrompt: "A mio padre piace cucinare la pasta la domenica.",
    beforeBlank: "My father",
    afterBlank: "cooking pasta on Sundays.",
    expected: "likes",
    acceptable: ["likes", "loves"],
    fullSentence: "My father likes cooking pasta on Sundays.",
    rule: "'My father' equivale a 'He': il verbo like richiede la '-s' (likes).",
    hint: "Like ➔ likes."
  },
  {
    id: 'tps_04',
    level: 'A2',
    category: '3ª Persona (-s)',
    categoryKey: 'he_dont',
    itPrompt: "Lui non sa come risolvere questo errore.",
    beforeBlank: "He",
    afterBlank: "know how to solve this error.",
    expected: "doesn't",
    acceptable: ["doesn't", "does not", "doesnt"],
    fullSentence: "He doesn't know how to solve this error.",
    rule: "Per negare con He/She/It si usa sempre 'doesn't', mai 'don't'!",
    hint: "La negazione con la 'S' per He: do ➔ does ➔ doesn't."
  },
  {
    id: 'tps_05',
    level: 'A2',
    category: '3ª Persona (-s)',
    categoryKey: 'third_person_s',
    itPrompt: "Marco guarda un film ogni sera prima di dormire.",
    beforeBlank: "Marco",
    afterBlank: "a movie every evening before sleeping.",
    expected: "watches",
    acceptable: ["watches"],
    fullSentence: "Marco watches a movie every evening before sleeping.",
    rule: "I verbi che finiscono in -ch (watch) aggiungono '-es': watches.",
    hint: "Watch con Marco (He) prende -es finale."
  },

  // -------------------------------------------------------------
  // Category 2: Passato dei Verbi Irregolari (No '-ed')
  // -------------------------------------------------------------
  {
    id: 'irr_01',
    level: 'A2',
    category: 'Passato Irregolare',
    categoryKey: 'past_simple',
    itPrompt: "Ieri sera sono andato a mangiare una pizza con amici.",
    beforeBlank: "Yesterday evening I",
    afterBlank: "to eat pizza with friends.",
    expected: "went",
    acceptable: ["went"],
    fullSentence: "Yesterday evening I went to eat pizza with friends.",
    rule: "Il verbo 'Go' è irregolare: al passato diventa 'Went' (non esiste 'goed').",
    hint: "Il passato di 'go' cambia completamente abito."
  },
  {
    id: 'irr_02',
    level: 'A2',
    category: 'Passato Irregolare',
    categoryKey: 'past_simple',
    itPrompt: "La settimana scorsa ho comprato un computer nuovo.",
    beforeBlank: "Last week I",
    afterBlank: "a new computer.",
    expected: "bought",
    acceptable: ["bought"],
    fullSentence: "Last week I bought a new computer.",
    rule: "Il passato del verbo comprare (Buy) è 'Bought'.",
    hint: "Buy ➔ Bought."
  },
  {
    id: 'irr_03',
    level: 'A2',
    category: 'Passato Irregolare',
    categoryKey: 'past_simple',
    itPrompt: "Ieri ho visto un bel documentario in televisione.",
    beforeBlank: "Yesterday I",
    afterBlank: "a good documentary on television.",
    expected: "saw",
    acceptable: ["saw", "watched"],
    fullSentence: "Yesterday I saw a good documentary on television.",
    rule: "Il passato del verbo vedere (See) è 'Saw'.",
    hint: "See ➔ Saw."
  },
  {
    id: 'irr_04',
    level: 'A2',
    category: 'Passato Irregolare',
    categoryKey: 'past_simple',
    itPrompt: "Stamattina ho fatto una ricca colazione prima di uscire.",
    beforeBlank: "This morning I",
    afterBlank: "a big breakfast before leaving.",
    expected: "had",
    acceptable: ["had", "ate"],
    fullSentence: "This morning I had a big breakfast before leaving.",
    rule: "In inglese per dire 'fare colazione' al passato si usa 'Had' (o 'Ate').",
    hint: "Have breakfast al passato diventa Had breakfast."
  },
  {
    id: 'irr_05',
    level: 'A2',
    category: 'Passato Irregolare',
    categoryKey: 'past_simple',
    itPrompt: "Ieri ero stanchissimo dopo la giornata di lavoro.",
    beforeBlank: "Yesterday I",
    afterBlank: "very tired after the workday.",
    expected: "was",
    acceptable: ["was"],
    fullSentence: "Yesterday I was very tired after the workday.",
    rule: "Il passato del verbo essere (Be) per I, He, She è 'Was'.",
    hint: "Am/Is al passato diventa Was."
  },
  {
    id: 'irr_06',
    level: 'B1',
    category: 'Passato Irregolare',
    categoryKey: 'past_simple',
    itPrompt: "Ho preso il treno veloce per Milano alle 8 in punto.",
    beforeBlank: "I",
    afterBlank: "the fast train to Milan at 8 o'clock sharp.",
    expected: "took",
    acceptable: ["took", "caught"],
    fullSentence: "I took the fast train to Milan at 8 o'clock sharp.",
    rule: "Il passato di Take (prendere un mezzo) è 'Took'.",
    hint: "Take ➔ Took."
  },

  // -------------------------------------------------------------
  // Category 3: Passato dei Verbi Regolari (-ed)
  // -------------------------------------------------------------
  {
    id: 'reg_01',
    level: 'A1',
    category: 'Passato Regolare (-ed)',
    categoryKey: 'past_simple',
    itPrompt: "Domenica scorsa sono rimasto a casa a riposare.",
    beforeBlank: "Last Sunday I",
    afterBlank: "at home to rest.",
    expected: "stayed",
    acceptable: ["stayed"],
    fullSentence: "Last Sunday I stayed at home to rest.",
    rule: "I verbi regolari aggiungono semplicemente '-ed' al passato: stay ➔ stayed.",
    hint: "Stay aggiunge -ed."
  },
  {
    id: 'reg_02',
    level: 'A2',
    category: 'Passato Regolare (-ed)',
    categoryKey: 'past_simple',
    itPrompt: "Ieri ho cucinato la pasta per tutta la famiglia.",
    beforeBlank: "Yesterday I",
    afterBlank: "pasta for the whole family.",
    expected: "cooked",
    acceptable: ["cooked", "prepared"],
    fullSentence: "Yesterday I cooked pasta for the whole family.",
    rule: "Cook è un verbo regolare: al passato aggiunge '-ed' (cooked).",
    hint: "Cook + ed."
  },
  {
    id: 'reg_03',
    level: 'A2',
    category: 'Passato Regolare (-ed)',
    categoryKey: 'past_simple',
    itPrompt: "L'anno scorso abbiamo visitato Firenze e i suoi musei.",
    beforeBlank: "Last year we",
    afterBlank: "Florence and its museums.",
    expected: "visited",
    acceptable: ["visited"],
    fullSentence: "Last year we visited Florence and its museums.",
    rule: "Visit aggiunge -ed al passato: visited.",
    hint: "Visit ➔ visited."
  },

  // -------------------------------------------------------------
  // Category 4: Domande con DO, DOES, DID
  // -------------------------------------------------------------
  {
    id: 'aux_01',
    level: 'A1',
    category: 'Domande (Do/Does/Did)',
    categoryKey: 'do_does_auxiliary',
    itPrompt: "Parli inglese quando sei all'estero?",
    beforeBlank: "",
    afterBlank: "you speak English when you are abroad?",
    expected: "Do",
    acceptable: ["do", "Do"],
    fullSentence: "Do you speak English when you are abroad?",
    rule: "Nelle domande al presente con 'you' si usa l'ausiliare 'Do' a inizio frase.",
    hint: "La parolina ausiliare per le domande con You al presente."
  },
  {
    id: 'aux_02',
    level: 'A2',
    category: 'Domande (Do/Does/Did)',
    categoryKey: 'do_does_auxiliary',
    itPrompt: "Lei vive in centro o in periferia?",
    beforeBlank: "Where",
    afterBlank: "she live?",
    expected: "does",
    acceptable: ["does"],
    fullSentence: "Where does she live?",
    rule: "Nelle domande con He o She l'ausiliare è 'Does' (con la 'S').",
    hint: "Ausiliare della terza persona per le domande."
  },
  {
    id: 'aux_03',
    level: 'A2',
    category: 'Domande (Do/Does/Did)',
    categoryKey: 'do_does_auxiliary',
    itPrompt: "Sei andato in ufficio ieri o hai lavorato da casa?",
    beforeBlank: "",
    afterBlank: "you go to the office yesterday or work from home?",
    expected: "Did",
    acceptable: ["did", "Did"],
    fullSentence: "Did you go to the office yesterday or work from home?",
    rule: "Nelle domande al passato si usa sempre 'Did', e il verbo principale torna alla forma base ('go')!",
    hint: "L'ausiliare del passato per tutte le persone."
  },
  {
    id: 'aux_04',
    level: 'B1',
    category: 'Domande (Do/Does/Did)',
    categoryKey: 'do_does_auxiliary',
    itPrompt: "Cosa hai mangiato a cena ieri sera?",
    beforeBlank: "What",
    afterBlank: "you eat for dinner last night?",
    expected: "did",
    acceptable: ["did"],
    fullSentence: "What did you eat for dinner last night?",
    rule: "What + Did + Soggetto + Verbo base (eat).",
    hint: "Ausiliare interrogativo al passato."
  },

  // -------------------------------------------------------------
  // Category 5: Preposizioni di Tempo & Luogo (IN, ON, AT)
  // -------------------------------------------------------------
  {
    id: 'prep_01',
    level: 'A1',
    category: 'Preposizioni (In/On/At)',
    categoryKey: 'preposition_in_on_at',
    itPrompt: "Ci vediamo lunedì prossimo in ufficio.",
    beforeBlank: "See you",
    afterBlank: "Monday at the office.",
    expected: "on",
    acceptable: ["on"],
    fullSentence: "See you on Monday at the office.",
    rule: "Con i giorni della settimana si usa sempre la preposizione 'ON' (On Monday, On Friday).",
    hint: "La preposizione per i giorni della settimana."
  },
  {
    id: 'prep_02',
    level: 'A1',
    category: 'Preposizioni (In/On/At)',
    categoryKey: 'preposition_in_on_at',
    itPrompt: "Il treno parte alle 8 in punto.",
    beforeBlank: "The train departs",
    afterBlank: "8 o'clock.",
    expected: "at",
    acceptable: ["at"],
    fullSentence: "The train departs at 8 o'clock.",
    rule: "Per le ore precise dell'orologio si usa sempre 'AT' (At 8 o'clock, At 7:30).",
    hint: "La preposizione bersaglio per l'orario esatto."
  },
  {
    id: 'prep_03',
    level: 'A2',
    category: 'Preposizioni (In/On/At)',
    categoryKey: 'preposition_in_on_at',
    itPrompt: "Io vivo in Italia da tutta la vita.",
    beforeBlank: "I live",
    afterBlank: "Italy all my life.",
    expected: "in",
    acceptable: ["in"],
    fullSentence: "I live in Italy all my life.",
    rule: "Per città e nazioni si usa sempre 'IN' (In Italy, In Rome).",
    hint: "La preposizione per paesi e città."
  },
  {
    id: 'prep_04',
    level: 'A2',
    category: 'Preposizioni (In/On/At)',
    categoryKey: 'preposition_in_on_at',
    itPrompt: "Arrivo in hotel verso sera.",
    beforeBlank: "I will arrive",
    afterBlank: "the hotel in the evening.",
    expected: "at",
    acceptable: ["at"],
    fullSentence: "I will arrive at the hotel in the evening.",
    rule: "Per edifici e punti di arrivo specifici (hotel, station, airport) si usa 'AT'.",
    hint: "Arrive at..."
  },

  // -------------------------------------------------------------
  // Category 6: Modali di Cortesia & Problem Solving (Can, Could, Would)
  // -------------------------------------------------------------
  {
    id: 'mod_01',
    level: 'A2',
    category: 'Modali di Cortesia',
    categoryKey: 'polite_modals',
    itPrompt: "Potrei cambiare camera per favore? C'è troppo rumore.",
    beforeBlank: "",
    afterBlank: "I change room please? It is too noisy.",
    expected: "Could",
    acceptable: ["could", "Could", "Can", "can"],
    fullSentence: "Could I change room please? It is too noisy.",
    rule: "'Could' è la forma più educata ed efficace all'estero per chiedere qualcosa (Potrei...?).",
    hint: "La forma cortese di can: C-O-U-L-D."
  },
  {
    id: 'mod_02',
    level: 'A2',
    category: 'Modali di Cortesia',
    categoryKey: 'polite_modals',
    itPrompt: "Vorrei prenotare un tavolo per due persone per stasera.",
    beforeBlank: "I",
    afterBlank: "like to book a table for two people tonight.",
    expected: "would",
    acceptable: ["would", "'d"],
    fullSentence: "I would like to book a table for two people tonight.",
    rule: "Per dire 'Vorrei' si dice 'I would like' (o contratto 'I'd like'). Mai 'I want' al ristorante!",
    hint: "Would like = Vorrei."
  },
  {
    id: 'mod_03',
    level: 'B1',
    category: 'Modali di Cortesia',
    categoryKey: 'polite_modals',
    itPrompt: "Potresti aiutarmi a portare questa valigia pesante?",
    beforeBlank: "",
    afterBlank: "you help me carry this heavy suitcase?",
    expected: "Could",
    acceptable: ["could", "Could", "Would", "would", "Can", "can"],
    fullSentence: "Could you help me carry this heavy suitcase?",
    rule: "'Could you...' è il modo perfetto per chiedere un favore con cortesia.",
    hint: "Forma cortese per chiedere aiuto."
  },

  // -------------------------------------------------------------
  // Category 7: Connettori di Frase (Because, So, But, Although)
  // -------------------------------------------------------------
  {
    id: 'conn_01',
    level: 'A2',
    category: 'Connettori Frase',
    categoryKey: 'connectors',
    itPrompt: "Ieri sono rimasto a casa perché pioveva forte.",
    beforeBlank: "Yesterday I stayed at home",
    afterBlank: "it was raining heavily.",
    expected: "because",
    acceptable: ["because"],
    fullSentence: "Yesterday I stayed at home because it was raining heavily.",
    rule: "Per spiegare il motivo (perché) si usa 'Because'.",
    hint: "Parola per spiegare la causa: 'perché'."
  },
  {
    id: 'conn_02',
    level: 'A2',
    category: 'Connettori Frase',
    categoryKey: 'connectors',
    itPrompt: "Ero molto stanco, quindi sono andato a dormire presto.",
    beforeBlank: "I was very tired,",
    afterBlank: "I went to sleep early.",
    expected: "so",
    acceptable: ["so"],
    fullSentence: "I was very tired, so I went to sleep early.",
    rule: "'So' significa 'quindi / perciò' e collega la causa alla conseguenza.",
    hint: "Due lettere per dire 'quindi': S-O."
  },
  {
    id: 'conn_03',
    level: 'B1',
    category: 'Connettori Frase',
    categoryKey: 'connectors',
    itPrompt: "Anche se il volo era in ritardo, siamo arrivati in tempo.",
    beforeBlank: "",
    afterBlank: "the flight was delayed, we arrived on time.",
    expected: "Although",
    acceptable: ["although", "Although", "Even though", "even though", "Though", "though"],
    fullSentence: "Although the flight was delayed, we arrived on time.",
    rule: "'Although' introduce una concessione ('anche se / benché') per frasi di livello B1.",
    hint: "Significa 'anche se': A-L-T-H-O-U-G-H."
  },

  // -------------------------------------------------------------
  // Category 8: Espressioni Comuni & False Friends
  // -------------------------------------------------------------
  {
    id: 'expr_01',
    level: 'A2',
    category: 'Espressioni Tipiche',
    categoryKey: 'i_am_agree',
    itPrompt: "Sono perfettamente d'accordo con la tua idea.",
    beforeBlank: "I totally",
    afterBlank: "with your idea.",
    expected: "agree",
    acceptable: ["agree"],
    fullSentence: "I totally agree with your idea.",
    rule: "In inglese si dice 'I agree', MAI 'I am agree'!",
    hint: "Il verbo 'agree' non vuole l'ausiliare am."
  },
  {
    id: 'expr_02',
    level: 'B1',
    category: 'Espressioni Tipiche',
    categoryKey: 'false_friends',
    itPrompt: "In realtà, preferisco lavorare da remoto.",
    beforeBlank: "",
    afterBlank: ", I prefer working remotely.",
    expected: "Actually",
    acceptable: ["actually", "Actually"],
    fullSentence: "Actually, I prefer working remotely.",
    rule: "'Actually' significa 'in realtà / in verità'. Non significa 'attualmente'!",
    hint: "False friend per dire 'in realtà'."
  }
];

class GrammarGymController {
  constructor() {
    this.container = null;
    this.currentCategoryFilter = 'all';
    this.currentIndex = 0;
    this.exercisesList = [];
    this.streakCount = 0;
    this.isListening = false;
  }

  mount(container) {
    this.container = container;
    this.buildAdaptiveList();
    this.render();
  }

  /* Dynamically sorts and prioritizes exercises based on learner's errors and CEFR level */
  buildAdaptiveList() {
    const profile = configManager.profile;
    const levelStr = profile.currentLevel || 'A2';
    const isB1 = levelStr.includes('B1') || levelStr.includes('B2');
    const isA1 = levelStr.includes('A1');

    // Find active student bottlenecks
    const activeErrors = Object.entries(profile.errorStats || {})
      .filter(([_, data]) => data.count > 0 && !data.conquered)
      .map(([id, _]) => id);

    // Score and rank all exercises adaptively
    const scored = GRAMMAR_EXERCISE_BANK.map(ex => {
      let priorityScore = 0;

      // Filter by category if requested
      if (this.currentCategoryFilter !== 'all' && ex.categoryKey !== this.currentCategoryFilter) {
        return null;
      }

      // Prioritize active error bottlenecks
      if (activeErrors.includes(ex.categoryKey)) {
        priorityScore += 10;
      }

      // Level affinity
      if (isB1 && ex.level === 'B1') priorityScore += 5;
      if (!isB1 && ex.level === 'A2') priorityScore += 4;
      if (isA1 && ex.level === 'A1') priorityScore += 6;

      return { exercise: ex, score: priorityScore };
    }).filter(item => item !== null);

    scored.sort((a, b) => b.score - a.score);
    this.exercisesList = scored.map(s => s.exercise);
    if (this.currentIndex >= this.exercisesList.length) {
      this.currentIndex = 0;
    }
  }

  render() {
    if (!this.container) return;

    if (this.exercisesList.length === 0) {
      this.container.innerHTML = `
        <div class="card" style="max-width: 780px; margin: 40px auto; text-align: center; padding: 40px;">
          <h3>Nessun esercizio trovato per questa categoria</h3>
          <button id="btn-gym-reset-filter" class="btn btn-primary" style="margin-top: 16px;">Mostra Tutti gli Esercizi</button>
        </div>
      `;
      const resetBtn = this.container.querySelector('#btn-gym-reset-filter');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          this.currentCategoryFilter = 'all';
          this.buildAdaptiveList();
          this.render();
        });
      }
      return;
    }

    const ex = this.exercisesList[this.currentIndex];
    const profile = configManager.profile;
    const name = profile.userName || 'Alessio';

    this.container.innerHTML = `
      <div class="grammar-gym-container" style="max-width: 840px; margin: 0 auto;">
        
        <!-- Header Banner with Motivational DSA Status -->
        <div class="card" style="margin-bottom: 20px; background: linear-gradient(135deg, rgba(28, 38, 59, 0.95), rgba(15, 23, 42, 0.95)); border: 1px solid rgba(6, 214, 160, 0.3);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
            <div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 26px;">🏋️</span>
                <h2 style="font-family: var(--font-heading); font-size: 20px; color: var(--text-primary); margin: 0;">
                  Palestra di Grammatica Adattiva
                </h2>
                <span class="brand-tag" style="background: rgba(6, 214, 160, 0.15); color: #06d6a0;">Zero Risposta Multipla</span>
              </div>
              <p style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">
                Esercizi su misura per ${name} • Inserimento diretto a voce o tastiera con correzione e audio madrelingua.
              </p>
            </div>
            
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="background: rgba(255, 190, 11, 0.12); border: 1px solid rgba(255, 190, 11, 0.3); padding: 6px 14px; border-radius: 20px; font-size: 13px; color: var(--accent-amber); font-weight: 700;">
                🔥 Serie Corrette: <span id="gym-streak-badge">${this.streakCount}</span>
              </div>
              <div style="font-size: 12px; color: var(--text-muted);">
                ${this.currentIndex + 1} di ${this.exercisesList.length}
              </div>
            </div>
          </div>

          <!-- Category Quick Filter Pills -->
          <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 18px; border-top: 1px solid var(--border-subtle); padding-top: 14px;">
            <button class="btn btn-sm gym-cat-btn ${this.currentCategoryFilter === 'all' ? 'active-level' : ''}" data-cat="all">🎯 Tutti i Consigliati</button>
            <button class="btn btn-sm gym-cat-btn ${this.currentCategoryFilter === 'third_person_s' ? 'active-level' : ''}" data-cat="third_person_s">3ª Persona (-s)</button>
            <button class="btn btn-sm gym-cat-btn ${this.currentCategoryFilter === 'past_simple' ? 'active-level' : ''}" data-cat="past_simple">Passato Verbi</button>
            <button class="btn btn-sm gym-cat-btn ${this.currentCategoryFilter === 'do_does_auxiliary' ? 'active-level' : ''}" data-cat="do_does_auxiliary">Do / Does / Did</button>
            <button class="btn btn-sm gym-cat-btn ${this.currentCategoryFilter === 'preposition_in_on_at' ? 'active-level' : ''}" data-cat="preposition_in_on_at">In / On / At</button>
            <button class="btn btn-sm gym-cat-btn ${this.currentCategoryFilter === 'polite_modals' ? 'active-level' : ''}" data-cat="polite_modals">Modali di Cortesia</button>
            <button class="btn btn-sm gym-cat-btn ${this.currentCategoryFilter === 'connectors' ? 'active-level' : ''}" data-cat="connectors">Connettori</button>
          </div>
        </div>

        <!-- Active Exercise Card -->
        <div class="card" id="gym-main-card" style="padding: 28px; position: relative;">
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <span class="question-badge" style="font-size: 12px; padding: 4px 10px; border-radius: 6px; background: rgba(58, 134, 255, 0.15); color: #60a5fa; font-weight: 700;">
              ${ex.category} • Livello ${ex.level}
            </span>
            <button id="btn-gym-listen-italian" class="audio-btn-inline" title="Ascolta frase italiana" style="width: 36px; height: 36px; font-size: 16px;">
              🇮🇹 🔊
            </button>
          </div>

          <!-- Italian Meaning Prompt -->
          <div style="background: rgba(58, 134, 255, 0.06); border-left: 4px solid var(--accent-blue); padding: 16px 18px; border-radius: 8px; margin-bottom: 22px;">
            <div style="font-size: 12px; font-weight: 700; color: var(--accent-blue); text-transform: uppercase; margin-bottom: 4px;">
              💡 Cosa devi dire in inglese:
            </div>
            <div style="font-size: 18px; font-weight: 600; color: var(--text-primary); line-height: 1.5;">
              "${ex.itPrompt}"
            </div>
          </div>

          <!-- English Challenge Sentence with Inline Blank Input -->
          <div style="margin: 24px 0; text-align: left;">
            <label style="font-size: 13px; font-weight: 700; color: var(--text-secondary); display: block; margin-bottom: 8px;">
              Completa la frase con la forma corretta (puoi digitare o premere il microfono):
            </label>

            <div class="grammar-interactive-sentence" style="font-size: 20px; line-height: 2.2; color: var(--text-primary); background: var(--bg-surface); padding: 20px; border-radius: 12px; border: 1px solid var(--border-subtle); display: flex; align-items: center; flex-wrap: wrap; gap: 8px;">
              ${ex.beforeBlank ? `<span>${ex.beforeBlank}</span>` : ''}
              
              <input type="text" id="gym-blank-input" class="console-text-input" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
                style="display: inline-block; width: 180px; max-width: 100%; font-size: 20px; font-weight: 700; color: var(--accent-cyan); text-align: center; border-bottom: 3px solid var(--accent-blue); padding: 6px 10px; border-radius: 6px;"
                placeholder="..." />
              
              ${ex.afterBlank ? `<span>${ex.afterBlank}</span>` : ''}
            </div>
          </div>

          <!-- Voice & Action Controls -->
          <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; margin-top: 20px;">
            <button id="btn-gym-verify" class="btn btn-primary btn-lg" style="flex: 1; min-width: 180px;">
              ✅ Verifica Risposta
            </button>
            <button id="btn-gym-voice" class="drill-voice-btn" style="padding: 12px 20px; min-width: 190px;">
              🎙️ Rispondi a Voce
            </button>
            <button id="btn-gym-hint" class="btn btn-secondary" style="padding: 12px 18px;" title="Vedi un indizio intuitivo">
              💡 Indizio
            </button>
          </div>

          <div id="gym-voice-interim" style="min-height: 24px; font-size: 13px; color: var(--accent-cyan); margin-top: 10px; font-style: italic;"></div>

          <!-- Result & Correction Feedback Box (Hidden initially) -->
          <div id="gym-feedback-box" style="display: none; margin-top: 24px; padding: 20px; border-radius: 12px; border: 1px solid transparent;"></div>

        </div>
      </div>
    `;

    this.bindEvents(ex);
  }

  bindEvents(ex) {
    const blankInput = this.container.querySelector('#gym-blank-input');
    const verifyBtn = this.container.querySelector('#btn-gym-verify');
    const voiceBtn = this.container.querySelector('#btn-gym-voice');
    const hintBtn = this.container.querySelector('#btn-gym-hint');
    const listenItBtn = this.container.querySelector('#btn-gym-listen-italian');
    const feedbackBox = this.container.querySelector('#gym-feedback-box');
    const voiceInterim = this.container.querySelector('#gym-voice-interim');

    // Auto-focus input
    if (blankInput) {
      setTimeout(() => blankInput.focus(), 150);
      blankInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.checkAnswer(blankInput.value, ex, feedbackBox);
        }
      });
    }

    if (listenItBtn) {
      listenItBtn.addEventListener('click', () => {
        dsaTools.speakItalian(ex.itPrompt);
      });
    }

    if (hintBtn) {
      hintBtn.addEventListener('click', () => {
        dsaTools.speakItalian(ex.hint);
        if (voiceInterim) {
          voiceInterim.textContent = `💡 Indizio: ${ex.hint}`;
        }
      });
    }

    // Category Filter Buttons
    const catBtns = this.container.querySelectorAll('.gym-cat-btn');
    catBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentCategoryFilter = btn.getAttribute('data-cat');
        this.currentIndex = 0;
        this.buildAdaptiveList();
        this.render();
      });
    });

    // Voice Input Handler
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        if (dsaTools.isListening) {
          dsaTools.forceCommitSpeech();
        } else {
          voiceBtn.classList.add('recording');
          voiceBtn.textContent = '⏹️ Parla Ora...';
          if (voiceInterim) voiceInterim.textContent = 'Ti ascolto: dì la parola mancante o l\'intera frase...';

          dsaTools.startListening(
            (finalText) => {
              voiceBtn.classList.remove('recording');
              voiceBtn.textContent = '🎙️ Rispondi a Voce';
              if (voiceInterim) voiceInterim.textContent = '';

              if (finalText) {
                // Extract answer: if user spoke single word or full sentence
                const extracted = this.extractWordFromSpoken(finalText, ex);
                if (blankInput) blankInput.value = extracted;
                this.checkAnswer(extracted, ex, feedbackBox);
              }
            },
            (interimText) => {
              if (voiceInterim) voiceInterim.textContent = `Sto sentendo: "${interimText}"...`;
            },
            (err) => {
              voiceBtn.classList.remove('recording');
              voiceBtn.textContent = '🎙️ Rispondi a Voce';
              if (voiceInterim) voiceInterim.textContent = 'Microfono non udito. Puoi digitare la risposta nella casella.';
            },
            () => {
              voiceBtn.classList.remove('recording');
              voiceBtn.textContent = '🎙️ Rispondi a Voce';
            }
          );
        }
      });
    }

    if (verifyBtn) {
      verifyBtn.addEventListener('click', () => {
        const val = blankInput ? blankInput.value : '';
        this.checkAnswer(val, ex, feedbackBox);
      });
    }
  }

  /* Extract target word if user spoken the whole sentence instead of single word */
  extractWordFromSpoken(spoken, ex) {
    const cleanSpoken = spoken.toLowerCase().replace(/[^\w\s']/g, ' ').trim();
    const cleanExpected = ex.expected.toLowerCase().trim();

    // Direct match
    if (cleanSpoken === cleanExpected) return ex.expected;

    // Check if any acceptable matches
    for (const acc of ex.acceptable) {
      const accLower = acc.toLowerCase();
      if (cleanSpoken.split(/\s+/).includes(accLower)) {
        return acc;
      }
    }

    // Check if expected is in words
    const words = cleanSpoken.split(/\s+/);
    if (words.includes(cleanExpected)) {
      return ex.expected;
    }

    // Default to first word or full input
    return spoken.trim();
  }

  checkAnswer(userInput, ex, feedbackBox) {
    if (!feedbackBox) return;
    const cleanInput = (userInput || '').toLowerCase().replace(/[^\w']/g, '').trim();
    const cleanExpected = ex.expected.toLowerCase().replace(/[^\w']/g, '').trim();

    let isMatch = cleanInput === cleanExpected;
    if (!isMatch) {
      for (const acc of ex.acceptable) {
        if (cleanInput === acc.toLowerCase().replace(/[^\w']/g, '').trim()) {
          isMatch = true;
          break;
        }
      }
    }

    feedbackBox.style.display = 'block';

    if (isMatch) {
      this.streakCount++;
      const streakBadge = this.container.querySelector('#gym-streak-badge');
      if (streakBadge) streakBadge.textContent = this.streakCount;

      // Add to studied minutes in profile
      configManager.profile.todayMinutesStudied = (configManager.profile.todayMinutesStudied || 0) + 1;
      configManager.save();

      feedbackBox.style.background = 'rgba(6, 214, 160, 0.1)';
      feedbackBox.style.borderColor = 'rgba(6, 214, 160, 0.4)';
      feedbackBox.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
          <span style="font-size: 24px;">🎉</span>
          <h3 style="color: var(--accent-cyan); font-size: 18px; margin: 0;">Eccellente! Risposta Corretta!</h3>
        </div>

        <div style="font-size: 18px; color: var(--text-primary); margin-bottom: 14px; background: var(--bg-surface); padding: 14px 18px; border-radius: 8px;">
          ${ex.fullSentence.replace(new RegExp(`\\b${ex.expected}\\b`, 'i'), `<strong style="color: #06d6a0; text-decoration: underline;">${ex.expected}</strong>`)}
        </div>

        <div style="font-size: 14px; color: var(--text-secondary); line-height: 1.6; margin-bottom: 18px;">
          📘 <strong>La Regola:</strong> ${ex.rule}
        </div>

        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <button id="btn-gym-listen-correct" class="btn btn-secondary" style="padding: 10px 16px;">
            🔊 Ascolta Pronuncia Madrelingua (0.8x)
          </button>
          <button id="btn-gym-repeat-speak" class="btn btn-secondary" style="padding: 10px 16px;">
            🎙️ Prova a Ripeterla Tu
          </button>
          <button id="btn-gym-next" class="btn btn-accent btn-lg" style="margin-left: auto; padding: 10px 24px;">
            Prossimo Esercizio ➔
          </button>
        </div>
      `;

      dsaTools.speakItalian("Esatto! Bravissimo. Ascolta come suona la frase completa.", () => {
        dsaTools.speakEnglish(ex.fullSentence, 0.85);
      });

    } else {
      this.streakCount = 0;
      const streakBadge = this.container.querySelector('#gym-streak-badge');
      if (streakBadge) streakBadge.textContent = this.streakCount;

      feedbackBox.style.background = 'rgba(239, 71, 111, 0.08)';
      feedbackBox.style.borderColor = 'rgba(239, 71, 111, 0.35)';
      feedbackBox.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
          <span style="font-size: 24px;">💡</span>
          <h3 style="color: var(--accent-coral); font-size: 18px; margin: 0;">Ci sei quasi! Ecco la correzione:</h3>
        </div>

        <div style="display: flex; gap: 16px; flex-wrap: wrap; margin-bottom: 14px;">
          <div style="background: var(--bg-surface); padding: 10px 16px; border-radius: 8px;">
            <div style="font-size: 11px; text-transform: uppercase; color: var(--text-muted); font-weight: 700;">Cosa hai inserito:</div>
            <div style="font-size: 16px; color: var(--accent-coral); text-decoration: line-through;">${userInput || '(vuoto)'}</div>
          </div>
          <div style="background: var(--bg-surface); padding: 10px 16px; border-radius: 8px; border: 1px solid rgba(6, 214, 160, 0.4);">
            <div style="font-size: 11px; text-transform: uppercase; color: #06d6a0; font-weight: 700;">Forma Corretta:</div>
            <div style="font-size: 18px; color: #06d6a0; font-weight: 700;">${ex.expected}</div>
          </div>
        </div>

        <div style="font-size: 14px; color: var(--text-primary); line-height: 1.6; margin-bottom: 16px;">
          📘 <strong>Perché:</strong> ${ex.rule}
        </div>

        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <button id="btn-gym-listen-correct" class="btn btn-secondary" style="padding: 10px 16px;">
            🔊 Ascolta Come si Pronuncia Correttamente
          </button>
          <button id="btn-gym-retry-now" class="btn btn-primary" style="padding: 10px 18px;">
            🔄 Riprova Subito Questo Esercizio
          </button>
          <button id="btn-gym-next" class="btn" style="background: transparent; border: 1px solid var(--border-subtle); color: var(--text-muted); margin-left: auto; padding: 10px 18px;">
            Salta al Prossimo ➔
          </button>
        </div>
      `;

      // Read correct answer out loud in English to form the auditory anchor
      dsaTools.speakEnglish(ex.fullSentence, 0.85);
    }

    // Bind Result Buttons
    const listenCorrectBtn = feedbackBox.querySelector('#btn-gym-listen-correct');
    if (listenCorrectBtn) {
      listenCorrectBtn.addEventListener('click', () => {
        dsaTools.speakEnglish(ex.fullSentence, 0.8);
      });
    }

    const repeatSpeakBtn = feedbackBox.querySelector('#btn-gym-repeat-speak');
    if (repeatSpeakBtn) {
      repeatSpeakBtn.addEventListener('click', () => {
        repeatSpeakBtn.textContent = '⏹️ Parla Ora...';
        dsaTools.startListening(
          (text) => {
            repeatSpeakBtn.textContent = '🎙️ Prova a Ripeterla Tu';
            dsaTools.speakItalian(`Bravo! Hai pronunciato: "${text}". Pratica completata.`);
          },
          null,
          () => { repeatSpeakBtn.textContent = '🎙️ Prova a Ripeterla Tu'; },
          () => { repeatSpeakBtn.textContent = '🎙️ Prova a Ripeterla Tu'; }
        );
      });
    }

    const retryBtn = feedbackBox.querySelector('#btn-gym-retry-now');
    if (retryBtn) {
      retryBtn.addEventListener('click', () => {
        feedbackBox.style.display = 'none';
        const blankInput = this.container.querySelector('#gym-blank-input');
        if (blankInput) {
          blankInput.value = '';
          blankInput.focus();
        }
      });
    }

    const nextBtn = feedbackBox.querySelector('#btn-gym-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.currentIndex = (this.currentIndex + 1) % this.exercisesList.length;
        this.render();
      });
    }
  }
}

export const grammarGymController = new GrammarGymController();
