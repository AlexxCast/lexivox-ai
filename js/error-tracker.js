/**
 * LexiVox AI - Real-time Adaptive Error Detection & Pattern Watcher
 * Detects recurrent linguistic hurdles, tallies frequencies, and triggers targeted micro-lessons.
 */

import { configManager } from './config.js';

export const ERROR_DEFINITIONS = {
  third_person_s: {
    id: 'third_person_s',
    title: "La 'S' della Terza Persona (He / She / It)",
    category: "Grammatica Spontanea",
    intuitiveRule: "In inglese, quando parli di 'Lui', 'Lei' o 'Una cosa' (He, She, It), il verbo aggiunge sempre il suono finale <strong>'-S'</strong>. Pensa a una campana che suona solo per la terza persona!",
    wrongExample: "❌ He live in London / She work here",
    correctExample: "✅ He lives in London / She works here",
    prompts: [
      { it: "Come dici a voce: 'Lui vive a Roma'?", expectedPatterns: [/he lives in rome/i, /he live in rome/i], target: "He lives in Rome" },
      { it: "Come dici a voce: 'Lei lavora ogni giorno'?", expectedPatterns: [/she works every day/i, /she work every day/i], target: "She works every day" },
      { it: "Come dici a voce: 'A lui piace la musica'?", expectedPatterns: [/he likes music/i, /he like music/i], target: "He likes music" }
    ],
    patterns: [
      /\b(he|she|it|my friend|my father|my mother|the boy|the girl)\s+(work|live|like|love|want|need|play|speak|eat|go|know)\b/i
    ]
  },

  past_simple: {
    id: 'past_simple',
    title: "Il Passato dei Verbi Irregolari (No '-ed')",
    category: "Verbi & Azioni",
    intuitiveRule: "I verbi più usati in inglese non prendono '-ed' nel passato, ma cambiano proprio abito! (Go ➔ Went, Buy ➔ Bought, Make ➔ Made).",
    wrongExample: "❌ Yesterday I goed to the cinema / I buyed shoes",
    correctExample: "✅ Yesterday I went to the cinema / I bought shoes",
    prompts: [
      { it: "Come dici a voce: 'Ieri sono andato a casa'?", expectedPatterns: [/yesterday i went home/i, /i went home yesterday/i], target: "Yesterday I went home" },
      { it: "Come dici a voce: 'Ho comprato un caffè'?", expectedPatterns: [/i bought a coffee/i, /i buyed a coffee/i], target: "I bought a coffee" },
      { it: "Come dici a voce: 'Ho visto un bel film'?", expectedPatterns: [/i saw a nice movie/i, /i saw a good film/i], target: "I saw a nice movie" }
    ],
    patterns: [
      /\b(buyed|goed|maked|catched|taked|seed|eated|drinked)\b/i,
      /\b(yesterday|last week|last year|two days ago)\s+(i|you|we|they|he|she)\s+(go|buy|make|see|eat)\b/i
    ]
  },

  preposition_in_on_at: {
    id: 'preposition_in_on_at',
    title: "Preposizioni: ON per i Giorni, AT per le Ore",
    category: "Preposizioni",
    intuitiveRule: "Ricorda la regola del bersaglio: <strong>AT</strong> per le ore precise (At 3 PM), <strong>ON</strong> per i giorni della settimana (On Monday), <strong>IN</strong> per mesi o paesi grandi (In Italy).",
    wrongExample: "❌ I will see you in Monday / in 5 PM",
    correctExample: "✅ I will see you on Monday / at 5 PM",
    prompts: [
      { it: "Come dici a voce: 'Ci vediamo lunedì'?", expectedPatterns: [/see you on monday/i, /we meet on monday/i], target: "See you on Monday" },
      { it: "Come dici a voce: 'Arrivo alle 8'?", expectedPatterns: [/i arrive at eight/i, /i arrive at 8/i], target: "I arrive at 8" },
      { it: "Come dici a voce: 'Sono in Italia'?", expectedPatterns: [/i am in italy/i, /i'm in italy/i], target: "I am in Italy" }
    ],
    patterns: [
      /\b(in\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday))\b/i,
      /\b(in\s+([0-9]|1[0-2])\s*(am|pm|o'clock))\b/i
    ]
  },

  do_does_auxiliary: {
    id: 'do_does_auxiliary',
    title: "Le Domande con DO e DOES",
    category: "Domande & Conversazione",
    intuitiveRule: "In inglese, per fare una domanda al presente serve sempre la parolina magica davanti al soggetto: <strong>DO</strong> per You/I, e <strong>DOES</strong> per He/She!",
    wrongExample: "❌ What you want? / Where he live?",
    correctExample: "✅ What do you want? / Where does he live?",
    prompts: [
      { it: "Come chiedi a voce: 'Cosa vuoi?'?", expectedPatterns: [/what do you want/i], target: "What do you want?" },
      { it: "Come chiedi a voce: 'Dove vive lei?'?", expectedPatterns: [/where does she live/i], target: "Where does she live?" },
      { it: "Come chiedi a voce: 'Parli inglese?'?", expectedPatterns: [/do you speak english/i], target: "Do you speak English?" }
    ],
    patterns: [
      /\b(what|where|why|when|how)\s+(you|he|she|they)\s+(want|live|like|work|go)\b/i,
      /\b(what|where|why|when)\s+he\s+wants\b/i
    ]
  },

  pronunciation_th: {
    id: 'pronunciation_th',
    title: "Il Suono 'TH' (/θ/ e /ð/)",
    category: "Fonetica & Pronuncia",
    intuitiveRule: "Per il suono 'TH', metti la punta della lingua dolcemente tra i denti davanti e soffia aria. Non dire 'Tree' per dire 'Three'!",
    wrongExample: "❌ 'Tree' (albero) invece di 'Three' (tre)",
    correctExample: "✅ 'Three' con la lingua tra i denti",
    prompts: [
      { it: "Ripeti a voce curando il 'TH': 'Thank you very much'", expectedPatterns: [/thank you/i, /tanks you/i], target: "Thank you very much" },
      { it: "Ripeti a voce: 'There are three dogs'", expectedPatterns: [/there are three/i], target: "There are three dogs" },
      { it: "Ripeti a voce: 'Think about that'", expectedPatterns: [/think about that/i], target: "Think about that" }
    ],
    patterns: [
      /\b(i have tree|tree people|tank you|tank you very much|dis and dat)\b/i
    ]
  },

  i_am_agree: {
    id: 'i_am_agree',
    title: "Sono d'accordo: 'I agree' (senza AM)",
    category: "Espressioni Comuni",
    intuitiveRule: "In inglese 'Agree' è già un verbo di azione! Non serve aggiungere 'am'. Dici semplicemente <strong>'I agree'</strong> (come dire 'io concordo').",
    wrongExample: "❌ I am agree with you",
    correctExample: "✅ I agree with you",
    prompts: [
      { it: "Come dici a voce: 'Sono d'accordo con te'?", expectedPatterns: [/i agree with you/i], target: "I agree with you" },
      { it: "Come dici a voce: 'Lei è d'accordo'?", expectedPatterns: [/she agrees/i], target: "She agrees" },
      { it: "Come dici a voce: 'Siamo tutti d'accordo'?", expectedPatterns: [/we all agree/i], target: "We all agree" }
    ],
    patterns: [
      /\b(i am agree|i'm agree|he is agree|she is agree)\b/i
    ]
  },

  he_dont: {
    id: 'he_dont',
    title: "Negazione alla 3ª Persona: 'He doesn't'",
    category: "Negazioni Spontanee",
    intuitiveRule: "Ricorda la 'S' della 3ª persona: la negazione per He/She/It prende sempre la forma con la 'S' ➔ <strong>doesn't</strong> (non 'don't')!",
    wrongExample: "❌ He don't know / She don't like it",
    correctExample: "✅ He doesn't know / She doesn't like it",
    prompts: [
      { it: "Come dici a voce: 'Lui non sa'?", expectedPatterns: [/he doesn't know/i, /he does not know/i], target: "He doesn't know" },
      { it: "Come dici a voce: 'A lei non piace il caffè'?", expectedPatterns: [/she doesn't like coffee/i], target: "She doesn't like coffee" },
      { it: "Come dici a voce: 'Lui non lavora qui'?", expectedPatterns: [/he doesn't work here/i], target: "He doesn't work here" }
    ],
    patterns: [
      /\b(he|she|it|my friend|my father|the teacher)\s+(don't|dont)\b/i
    ]
  }
};

class ErrorTracker {
  constructor() {
    this.sessionErrorHits = {};
    this.TRIGGER_THRESHOLD = 2; // Trigger targeted micro-lesson after 2 occurrences
    this.onMicroLessonTriggered = null;
  }

  setTriggerCallback(cb) {
    this.onMicroLessonTriggered = cb;
  }

  analyzeUserUtterance(text) {
    if (!text || typeof text !== 'string') return null;

    const detected = [];

    for (const [key, def] of Object.entries(ERROR_DEFINITIONS)) {
      for (const pattern of def.patterns) {
        if (pattern.test(text)) {
          detected.push(key);
          this.recordHit(key);
          break; // Avoid counting same definition multiple times in one phrase
        }
      }
    }

    return detected;
  }

  recordHit(errorKey) {
    this.sessionErrorHits[errorKey] = (this.sessionErrorHits[errorKey] || 0) + 1;
    const persistentCount = configManager.recordError(errorKey);

    // Notify listeners or check if micro-lesson should trigger
    if (this.sessionErrorHits[errorKey] >= this.TRIGGER_THRESHOLD) {
      this.sessionErrorHits[errorKey] = 0; // Reset session threshold after triggering
      if (typeof this.onMicroLessonTriggered === 'function') {
        this.onMicroLessonTriggered(errorKey);
      }
    }

    return persistentCount;
  }

  getActiveIssues() {
    const list = [];
    for (const [key, stats] of Object.entries(configManager.profile.errorStats)) {
      if (stats.count > 0 && !stats.conquered) {
        list.push({ key, ...stats });
      }
    }
    return list.sort((a, b) => b.count - a.count);
  }
}

export const errorTracker = new ErrorTracker();
