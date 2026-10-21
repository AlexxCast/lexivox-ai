/**
 * LexiVox AI - Adaptive Grammar Gym Engine (Palestra di Grammatica Adattiva)
 * Genera automaticamente ed infinitamente esercizi di grammatica calibrati in tempo reale
 * sul livello CEFR (A1, A2, B1) e sui colli di bottiglia attivi dell'allievo (error-tracker).
 * STRICTLY ZERO RISPOSTA MULTIPLA: Inserimento diretto a tastiera o voce, correzione istantanea e pronuncia madrelingua.
 */

import { configManager } from './config.js';
import { dsaTools } from './dsa-tools.js';
import { aiService } from './ai-service.js';

// ============================================================================
// MATRICI COMBINATORIE PROCEDURALI PER GENERAZIONE INFINITA DI ESERCIZI
// ============================================================================

export const PROCEDURAL_SUBJECTS = {
  third_person_sing: [
    { en: "He", it: "Lui" },
    { en: "She", it: "Lei" },
    { en: "Marco", it: "Marco" },
    { en: "Sarah", it: "Sarah" },
    { en: "My brother", it: "Mio fratello" },
    { en: "My sister", it: "Mia sorella" },
    { en: "My boss", it: "Il mio responsabile" },
    { en: "The engineer", it: "L'ingegnere" },
    { en: "The doctor", it: "Il medico" },
    { en: "David", it: "David" },
    { en: "Our teacher", it: "Il nostro insegnante" }
  ],
  general: [
    { en: "I", it: "Io" },
    { en: "We", it: "Noi" },
    { en: "They", it: "Loro" },
    { en: "My friend and I", it: "Io e il mio amico" }
  ]
};

export const PROCEDURAL_TEMPLATES = {
  // --------------------------------------------------------------------------
  // Categoria 1: 3ª Persona Singolare (-s / -es / doesn't / has / goes)
  // --------------------------------------------------------------------------
  third_person_s: [
    {
      verbBase: "work",
      expected: "works",
      acceptable: ["works"],
      level: "A1",
      category: "3ª Persona (-s)",
      buildIt: (s) => `${s.it} lavora ogni giorno con grande impegno.`,
      buildSentence: (s) => ({
        beforeBlank: `${s.en}`,
        afterBlank: "hard every day at work.",
        fullSentence: `${s.en} works hard every day at work.`
      }),
      rule: "Con He, She, It e soggetti singolari, al presente il verbo aggiunge sempre la '-S' finale (work ➔ works).",
      hint: "Work alla 3ª persona singolare aggiunge la 's'."
    },
    {
      verbBase: "live",
      expected: "lives",
      acceptable: ["lives"],
      level: "A1",
      category: "3ª Persona (-s)",
      buildIt: (s) => `${s.it} vive in una bella casa vicino a Roma.`,
      buildSentence: (s) => ({
        beforeBlank: `${s.en}`,
        afterBlank: "in a nice apartment near Rome.",
        fullSentence: `${s.en} lives in a nice apartment near Rome.`
      }),
      rule: "Il verbo 'live' con la 3ª persona singolare diventa 'lives'.",
      hint: "Live ➔ lives."
    },
    {
      verbBase: "speak",
      expected: "speaks",
      acceptable: ["speaks"],
      level: "A2",
      category: "3ª Persona (-s)",
      buildIt: (s) => `${s.it} parla inglese molto bene durante le riunioni.`,
      buildSentence: (s) => ({
        beforeBlank: `${s.en}`,
        afterBlank: "English very well during meetings.",
        fullSentence: `${s.en} speaks English very well during meetings.`
      }),
      rule: "Con un soggetto singolare il verbo speak aggiunge la desinenza '-s' (speaks).",
      hint: "Speak con He/She diventa speaks."
    },
    {
      verbBase: "watch",
      expected: "watches",
      acceptable: ["watches"],
      level: "A2",
      category: "3ª Persona (-s)",
      buildIt: (s) => `${s.it} guarda un film interessante tutte le sere.`,
      buildSentence: (s) => ({
        beforeBlank: `${s.en}`,
        afterBlank: "an interesting movie every evening.",
        fullSentence: `${s.en} watches an interesting movie every evening.`
      }),
      rule: "I verbi terminanti in -ch (watch) aggiungono '-es' alla terza persona singolare: watches.",
      hint: "Termina in -ch, quindi prende -es finale."
    },
    {
      verbBase: "teach",
      expected: "teaches",
      acceptable: ["teaches"],
      level: "A2",
      category: "3ª Persona (-s)",
      buildIt: (s) => `${s.it} insegna tecnologia agli studenti universitari.`,
      buildSentence: (s) => ({
        beforeBlank: `${s.en}`,
        afterBlank: "technology to university students.",
        fullSentence: `${s.en} teaches technology to university students.`
      }),
      rule: "Teach termina con suono sibilante (-ch) e prende '-es': teaches.",
      hint: "Aggiungi -es a teach."
    },
    {
      verbBase: "like",
      expected: "likes",
      acceptable: ["likes", "loves"],
      level: "A1",
      category: "3ª Persona (-s)",
      buildIt: (s) => `A ${s.it} piace molto cucinare la pasta la domenica.`,
      buildSentence: (s) => ({
        beforeBlank: `${s.en}`,
        afterBlank: "cooking pasta on Sundays.",
        fullSentence: `${s.en} likes cooking pasta on Sundays.`
      }),
      rule: "Il verbo 'like' con la 3ª persona singolare richiede sempre la '-s': likes.",
      hint: "Like con He/She diventa likes."
    },
    {
      verbBase: "have",
      expected: "has",
      acceptable: ["has"],
      level: "A2",
      category: "3ª Persona (-s)",
      buildIt: (s) => `${s.it} ha un appuntamento urgente oggi pomeriggio.`,
      buildSentence: (s) => ({
        beforeBlank: `${s.en}`,
        afterBlank: "an urgent appointment this afternoon.",
        fullSentence: `${s.en} has an urgent appointment this afternoon.`
      }),
      rule: "Il verbo 'have' è irregolare alla terza persona singolare: diventa 'HAS' (non haves!).",
      hint: "Have alla 3ª persona diventa H-A-S."
    },
    {
      verbBase: "go",
      expected: "goes",
      acceptable: ["goes"],
      level: "A2",
      category: "3ª Persona (-s)",
      buildIt: (s) => `${s.it} va in palestra tre volte a settimana.`,
      buildSentence: (s) => ({
        beforeBlank: `${s.en}`,
        afterBlank: "to the gym three times a week.",
        fullSentence: `${s.en} goes to the gym three times a week.`
      }),
      rule: "Il verbo 'go' alla terza persona aggiunge '-es': goes.",
      hint: "Go ➔ goes."
    },
    {
      verbBase: "doesn't",
      expected: "doesn't",
      acceptable: ["doesn't", "does not", "doesnt"],
      level: "A2",
      category: "3ª Persona (-s)",
      buildIt: (s) => `${s.it} non sa come risolvere questo errore nel sistema.`,
      buildSentence: (s) => ({
        beforeBlank: `${s.en}`,
        afterBlank: "know how to solve this system error.",
        fullSentence: `${s.en} doesn't know how to solve this system error.`
      }),
      rule: "Per negare con He/She/It al presente si usa sempre 'doesn't', mai 'don't'!",
      hint: "La negazione con la 'S' per soggetti singolari: doesn't."
    },
    {
      verbBase: "doesn't",
      expected: "doesn't",
      acceptable: ["doesn't", "does not", "doesnt"],
      level: "A2",
      category: "3ª Persona (-s)",
      buildIt: (s) => `${s.it} non beve caffè dopo cena per dormire meglio.`,
      buildSentence: (s) => ({
        beforeBlank: `${s.en}`,
        afterBlank: "drink coffee after dinner to sleep better.",
        fullSentence: `${s.en} doesn't drink coffee after dinner to sleep better.`
      }),
      rule: "Con la 3ª persona singolare la negazione corretta è 'doesn't' + verbo base.",
      hint: "Doesn't."
    }
  ],

  // --------------------------------------------------------------------------
  // Categoria 2: Passato dei Verbi (Irregolari & Regolari)
  // --------------------------------------------------------------------------
  past_simple: [
    {
      verbBase: "go",
      expected: "went",
      acceptable: ["went"],
      level: "A2",
      category: "Passato Verbi",
      buildIt: () => "Ieri sera sono andato a cena fuori con gli amici.",
      buildSentence: () => ({
        beforeBlank: "Yesterday evening I",
        afterBlank: "to dinner with some friends.",
        fullSentence: "Yesterday evening I went to dinner with some friends."
      }),
      rule: "Il verbo 'Go' al passato è irregolare: diventa 'Went' (non esiste 'goed').",
      hint: "Il passato irregolare di go è W-E-N-T."
    },
    {
      verbBase: "buy",
      expected: "bought",
      acceptable: ["bought"],
      level: "A2",
      category: "Passato Verbi",
      buildIt: () => "La settimana scorsa ho comprato un nuovo computer portatile.",
      buildSentence: () => ({
        beforeBlank: "Last week I",
        afterBlank: "a brand new laptop.",
        fullSentence: "Last week I bought a brand new laptop."
      }),
      rule: "Il passato del verbo comprare (Buy) è 'Bought'.",
      hint: "Buy ➔ Bought."
    },
    {
      verbBase: "see",
      expected: "saw",
      acceptable: ["saw", "watched"],
      level: "A2",
      category: "Passato Verbi",
      buildIt: () => "Ieri ho visto un documentario davvero interessante.",
      buildSentence: () => ({
        beforeBlank: "Yesterday I",
        afterBlank: "a very interesting documentary.",
        fullSentence: "Yesterday I saw a very interesting documentary."
      }),
      rule: "Il passato del verbo vedere (See) è 'Saw'.",
      hint: "See ➔ Saw."
    },
    {
      verbBase: "have",
      expected: "had",
      acceptable: ["had", "ate"],
      level: "A2",
      category: "Passato Verbi",
      buildIt: () => "Stamattina ho fatto una colazione abbondante prima di uscire.",
      buildSentence: () => ({
        beforeBlank: "This morning I",
        afterBlank: "a big breakfast before leaving.",
        fullSentence: "This morning I had a big breakfast before leaving."
      }),
      rule: "In inglese per dire 'fare colazione' o 'avere' al passato si usa 'Had'.",
      hint: "Have ➔ Had."
    },
    {
      verbBase: "speak",
      expected: "spoke",
      acceptable: ["spoke", "talked"],
      level: "A2",
      category: "Passato Verbi",
      buildIt: () => "Ieri ho parlato con il mio responsabile del progetto.",
      buildSentence: () => ({
        beforeBlank: "Yesterday I",
        afterBlank: "with my project manager.",
        fullSentence: "Yesterday I spoke with my project manager."
      }),
      rule: "Il passato del verbo parlare (Speak) è 'Spoke'.",
      hint: "Speak ➔ Spoke."
    },
    {
      verbBase: "eat",
      expected: "ate",
      acceptable: ["ate", "had"],
      level: "A2",
      category: "Passato Verbi",
      buildIt: () => "Ieri a pranzo abbiamo mangiato una pizza deliziosa.",
      buildSentence: () => ({
        beforeBlank: "Yesterday for lunch we",
        afterBlank: "a delicious pizza.",
        fullSentence: "Yesterday for lunch we ate a delicious pizza."
      }),
      rule: "Il passato del verbo mangiare (Eat) è 'Ate'.",
      hint: "Eat ➔ Ate."
    },
    {
      verbBase: "meet",
      expected: "met",
      acceptable: ["met"],
      level: "A2",
      category: "Passato Verbi",
      buildIt: () => "Due giorni fa ho incontrato un vecchio compagno di scuola.",
      buildSentence: () => ({
        beforeBlank: "Two days ago I",
        afterBlank: "an old school friend.",
        fullSentence: "Two days ago I met an old school friend."
      }),
      rule: "Il passato del verbo incontrare (Meet) perde una 'e': diventa 'Met'.",
      hint: "Meet ➔ Met."
    },
    {
      verbBase: "find",
      expected: "found",
      acceptable: ["found"],
      level: "A2",
      category: "Passato Verbi",
      buildIt: () => "Stamattina ho finalmente trovato le chiavi smarrite.",
      buildSentence: () => ({
        beforeBlank: "This morning I finally",
        afterBlank: "my lost keys.",
        fullSentence: "This morning I finally found my lost keys."
      }),
      rule: "Il passato del verbo trovare (Find) è 'Found'.",
      hint: "Find ➔ Found."
    },
    {
      verbBase: "write",
      expected: "wrote",
      acceptable: ["wrote"],
      level: "A2",
      category: "Passato Verbi",
      buildIt: () => "Ieri sera ho scritto una lunga email al supporto clienti.",
      buildSentence: () => ({
        beforeBlank: "Yesterday evening I",
        afterBlank: "a long email to customer support.",
        fullSentence: "Yesterday evening I wrote a long email to customer support."
      }),
      rule: "Il passato del verbo scrivere (Write) è 'Wrote'.",
      hint: "Write ➔ Wrote."
    },
    {
      verbBase: "didn't",
      expected: "didn't",
      acceptable: ["didn't", "did not", "didnt"],
      level: "A2",
      category: "Passato Verbi",
      buildIt: () => "Ieri non sono uscito perché faceva troppo freddo.",
      buildSentence: () => ({
        beforeBlank: "Yesterday I",
        afterBlank: "go out because it was too cold.",
        fullSentence: "Yesterday I didn't go out because it was too cold."
      }),
      rule: "Al passato la negazione per tutte le persone si forma con 'didn't' + verbo base.",
      hint: "La negazione universale del passato: didn't."
    }
  ],

  // --------------------------------------------------------------------------
  // Categoria 3: Ausiliari Domande & Negazioni (Do / Does / Did)
  // --------------------------------------------------------------------------
  do_does_auxiliary: [
    {
      expected: "Do",
      acceptable: ["Do", "do"],
      level: "A1",
      category: "Do / Does / Did",
      buildIt: () => "Abiti vicino al centro città?",
      buildSentence: () => ({
        beforeBlank: "",
        afterBlank: "you live near the city center?",
        fullSentence: "Do you live near the city center?"
      }),
      rule: "Per fare una domanda al presente con 'you' usiamo l'ausiliare 'DO'.",
      hint: "Ausiliare per fare domande al presente con you: D-O."
    },
    {
      expected: "Does",
      acceptable: ["Does", "does"],
      level: "A2",
      category: "Do / Does / Did",
      buildIt: () => "Tuo fratello lavora ancora a Milano?",
      buildSentence: () => ({
        beforeBlank: "",
        afterBlank: "your brother still work in Milan?",
        fullSentence: "Does your brother still work in Milan?"
      }),
      rule: "Nelle domande al presente con soggetto singolare (He, She, Your brother) si usa l'ausiliare 'DOES'.",
      hint: "La forma con la 's' dell'ausiliare: DOES."
    },
    {
      expected: "Did",
      acceptable: ["Did", "did"],
      level: "A2",
      category: "Do / Does / Did",
      buildIt: () => "Hai visto il messaggio che ti ho inviato ieri?",
      buildSentence: () => ({
        beforeBlank: "",
        afterBlank: "you see the message I sent you yesterday?",
        fullSentence: "Did you see the message I sent you yesterday?"
      }),
      rule: "Per fare domande al passato con qualsiasi persona si usa sempre l'ausiliare 'DID'.",
      hint: "L'ausiliare delle domande al passato: D-I-D."
    },
    {
      expected: "Did",
      acceptable: ["Did", "did"],
      level: "A2",
      category: "Do / Does / Did",
      buildIt: () => "Sei andato alla riunione ieri mattina?",
      buildSentence: () => ({
        beforeBlank: "",
        afterBlank: "you go to the meeting yesterday morning?",
        fullSentence: "Did you go to the meeting yesterday morning?"
      }),
      rule: "'DID' porta il tempo passato, quindi il verbo principale resta alla forma base (Did you go).",
      hint: "Did you go..."
    },
    {
      expected: "do",
      acceptable: ["do", "Do"],
      level: "A2",
      category: "Do / Does / Did",
      buildIt: () => "A che ora finisci di lavorare di solito la sera?",
      buildSentence: () => ({
        beforeBlank: "What time",
        afterBlank: "you usually finish work in the evening?",
        fullSentence: "What time do you usually finish work in the evening?"
      }),
      rule: "Nelle Wh- questions (What, Where, When) al presente con you si inserisce 'do' prima del soggetto.",
      hint: "What time DO you..."
    }
  ],

  // --------------------------------------------------------------------------
  // Categoria 4: Preposizioni Bersaglio (In / On / At)
  // --------------------------------------------------------------------------
  preposition_in_on_at: [
    {
      expected: "at",
      acceptable: ["at"],
      level: "A1",
      category: "Preposizioni (In/On/At)",
      buildIt: () => "La riunione con il cliente inizia alle 9 in punto.",
      buildSentence: () => ({
        beforeBlank: "The client meeting starts",
        afterBlank: "9 o'clock sharp.",
        fullSentence: "The client meeting starts at 9 o'clock sharp."
      }),
      rule: "Per le ore precise dell'orologio si usa sempre 'AT' (At 9 o'clock, At 7:30).",
      hint: "La preposizione per l'orario preciso."
    },
    {
      expected: "at",
      acceptable: ["at"],
      level: "A2",
      category: "Preposizioni (In/On/At)",
      buildIt: () => "Oggi lavoro da casa anziché andare in ufficio.",
      buildSentence: () => ({
        beforeBlank: "Today I am working",
        afterBlank: "home instead of going to the office.",
        fullSentence: "Today I am working at home instead of going to the office."
      }),
      rule: "Per luoghi fissi e punti di stazionamento diciamo 'at home' e 'at work'.",
      hint: "At home."
    },
    {
      expected: "on",
      acceptable: ["on"],
      level: "A1",
      category: "Preposizioni (In/On/At)",
      buildIt: () => "Il mio giorno libero è di lunedì.",
      buildSentence: () => ({
        beforeBlank: "My day off is",
        afterBlank: "Monday.",
        fullSentence: "My day off is on Monday."
      }),
      rule: "Per i giorni della settimana si usa sempre 'ON' (On Monday, On Friday).",
      hint: "La preposizione per i giorni della settimana."
    },
    {
      expected: "on",
      acceptable: ["on"],
      level: "A2",
      category: "Preposizioni (In/On/At)",
      buildIt: () => "Ho lasciato le chiavi sul tavolo dell'ingresso.",
      buildSentence: () => ({
        beforeBlank: "I left the keys",
        afterBlank: "the entrance table.",
        fullSentence: "I left the keys on the entrance table."
      }),
      rule: "Per superfici d'appoggio si usa sempre 'ON' (on the table).",
      hint: "Sopra una superficie: on."
    },
    {
      expected: "in",
      acceptable: ["in"],
      level: "A1",
      category: "Preposizioni (In/On/At)",
      buildIt: () => "Io vivo in Italia con la mia famiglia.",
      buildSentence: () => ({
        beforeBlank: "I live",
        afterBlank: "Italy with my family.",
        fullSentence: "I live in Italy with my family."
      }),
      rule: "Per paesi, nazioni e città si usa sempre 'IN' (In Italy, In Rome).",
      hint: "Preposizione per stati e città."
    },
    {
      expected: "in",
      acceptable: ["in"],
      level: "A2",
      category: "Preposizioni (In/On/At)",
      buildIt: () => "Andiamo in vacanza ad agosto.",
      buildSentence: () => ({
        beforeBlank: "We usually take our holidays",
        afterBlank: "August.",
        fullSentence: "We usually take our holidays in August."
      }),
      rule: "Per i mesi dell'anno e le stagioni si usa sempre 'IN' (In August, In summer).",
      hint: "Preposizione per i mesi."
    }
  ],

  // --------------------------------------------------------------------------
  // Categoria 5: Modali di Cortesia & Problem Solving (Could / Would / Can / Should)
  // --------------------------------------------------------------------------
  polite_modals: [
    {
      expected: "Could",
      acceptable: ["Could", "could", "Can", "can"],
      level: "A2",
      category: "Modali di Cortesia",
      buildIt: () => "Potrei avere il conto per favore?",
      buildSentence: () => ({
        beforeBlank: "",
        afterBlank: "I have the bill, please?",
        fullSentence: "Could I have the bill, please?"
      }),
      rule: "'Could' è la formula più educata ed efficace all'estero per chiedere qualcosa (Potrei...?).",
      hint: "La forma cortese di can: C-O-U-L-D."
    },
    {
      expected: "would",
      acceptable: ["would", "'d"],
      level: "A2",
      category: "Modali di Cortesia",
      buildIt: () => "Vorrei ordinare una bottiglia d'acqua minerale.",
      buildSentence: () => ({
        beforeBlank: "I",
        afterBlank: "like to order a bottle of mineral water.",
        fullSentence: "I would like to order a bottle of mineral water."
      }),
      rule: "Per dire 'Vorrei' si usa 'I would like' (o contratto 'I'd like'). Mai 'I want'!",
      hint: "Would like = Vorrei."
    },
    {
      expected: "Could",
      acceptable: ["Could", "could", "Would", "would"],
      level: "B1",
      category: "Modali di Cortesia",
      buildIt: () => "Potresti aiutarmi a caricare questi file pesanti?",
      buildSentence: () => ({
        beforeBlank: "",
        afterBlank: "you help me upload these heavy files?",
        fullSentence: "Could you help me upload these heavy files?"
      }),
      rule: "'Could you...' è il modo naturale per chiedere un favore con cortesia in ambiente di lavoro.",
      hint: "Could you..."
    },
    {
      expected: "should",
      acceptable: ["should"],
      level: "B1",
      category: "Modali di Cortesia",
      buildIt: () => "Dovresti riposare se non ti senti bene.",
      buildSentence: () => ({
        beforeBlank: "You",
        afterBlank: "take some rest if you don't feel well.",
        fullSentence: "You should take some rest if you don't feel well."
      }),
      rule: "'Should' si usa per dare consigli amichevoli o suggerire la cosa giusta da fare (Dovresti...).",
      hint: "Modale di consiglio: S-H-O-U-L-D."
    }
  ],

  // --------------------------------------------------------------------------
  // Categoria 6: Connettori Logici di Frase (Because / So / Although / But)
  // --------------------------------------------------------------------------
  connectors: [
    {
      expected: "because",
      acceptable: ["because"],
      level: "A2",
      category: "Connettori Frase",
      buildIt: () => "Ieri sono rimasto a casa perché pioveva forte.",
      buildSentence: () => ({
        beforeBlank: "Yesterday I stayed home",
        afterBlank: "it was raining heavily.",
        fullSentence: "Yesterday I stayed home because it was raining heavily."
      }),
      rule: "Per spiegare la causa o la motivazione (perché) si usa 'Because'.",
      hint: "Parola per spiegare il motivo: because."
    },
    {
      expected: "so",
      acceptable: ["so"],
      level: "A2",
      category: "Connettori Frase",
      buildIt: () => "Ero molto stanco, quindi ho deciso di dormire presto.",
      buildSentence: () => ({
        beforeBlank: "I was very tired,",
        afterBlank: "I decided to go to sleep early.",
        fullSentence: "I was very tired, so I decided to go to sleep early."
      }),
      rule: "'So' significa 'quindi / perciò' e collega una situazione alla sua conseguenza.",
      hint: "Due lettere per dire quindi: S-O."
    },
    {
      expected: "Although",
      acceptable: ["Although", "although", "Even though", "even though"],
      level: "B1",
      category: "Connettori Frase",
      buildIt: () => "Anche se il volo era in ritardo, siamo arrivati in tempo.",
      buildSentence: () => ({
        beforeBlank: "",
        afterBlank: "the flight was delayed, we arrived on time.",
        fullSentence: "Although the flight was delayed, we arrived on time."
      }),
      rule: "'Although' introduce una concessione ('anche se / benché') per frasi di livello B1.",
      hint: "Significa anche se: A-L-T-H-O-U-G-H."
    },
    {
      expected: "but",
      acceptable: ["but"],
      level: "A2",
      category: "Connettori Frase",
      buildIt: () => "Vorrei venire, ma ho una consegna urgente da finire.",
      buildSentence: () => ({
        beforeBlank: "I would like to come,",
        afterBlank: "I have an urgent deadline to meet.",
        fullSentence: "I would like to come, but I have an urgent deadline to meet."
      }),
      rule: "'But' collega due frasi in contrasto tra loro (ma / però).",
      hint: "Ma: B-U-T."
    }
  ],

  // --------------------------------------------------------------------------
  // Categoria 7: Errori Tipici Italiani & False Friends (Agree / Actually / Wait for)
  // --------------------------------------------------------------------------
  common_italian_bottlenecks: [
    {
      expected: "agree",
      acceptable: ["agree"],
      level: "A2",
      category: "Espressioni Tipiche",
      buildIt: () => "Sono perfettamente d'accordo con la tua proposta.",
      buildSentence: () => ({
        beforeBlank: "I totally",
        afterBlank: "with your proposal.",
        fullSentence: "I totally agree with your proposal."
      }),
      rule: "In inglese si dice 'I agree', MAI 'I am agree'!",
      hint: "Il verbo 'agree' non vuole il verbo essere."
    },
    {
      expected: "Actually",
      acceptable: ["Actually", "actually"],
      level: "B1",
      category: "Espressioni Tipiche",
      buildIt: () => "In realtà, preferisco lavorare da remoto.",
      buildSentence: () => ({
        beforeBlank: "",
        afterBlank: ", I prefer working remotely.",
        fullSentence: "Actually, I prefer working remotely."
      }),
      rule: "'Actually' significa 'in realtà / a dire il vero'. Non significa 'attualmente'!",
      hint: "False friend per dire 'in realtà': Actually."
    },
    {
      expected: "for",
      acceptable: ["for"],
      level: "A2",
      category: "Espressioni Tipiche",
      buildIt: () => "Devo aspettare il mio collega prima di entrare.",
      buildSentence: () => ({
        beforeBlank: "I have to wait",
        afterBlank: "my colleague before entering.",
        fullSentence: "I have to wait for my colleague before entering."
      }),
      rule: "In inglese il verbo 'wait' richiede sempre la preposizione 'FOR' (Wait for someone).",
      hint: "Wait FOR someone."
    }
  ]
};

// ============================================================================
// MOTORE GENERATORE ADATTIVO AUTOMATICO (Procedurale & Live AI)
// ============================================================================

export class DynamicGrammarGenerator {
  constructor() {
    this.sessionGeneratedIds = new Set();
  }

  /**
   * Genera automaticamente una serie di esercizi procedurali basati su:
   * 1. Livello CEFR reale dell'allievo (A1, A2, B1)
   * 2. Errori persistenti registrati nell'error-tracker
   * 3. Filtro categoria selezionato
   */
  generateProceduralBatch(count = 10, categoryFilter = 'all') {
    const profile = configManager.profile;
    const levelStr = profile.currentLevel || 'A2';
    const isB1 = levelStr.includes('B1') || levelStr.includes('B2');
    const isA1 = levelStr.includes('A1');

    // Identifica i colli di bottiglia attivi dell'allievo
    const activeErrors = Object.entries(profile.errorStats || {})
      .filter(([_, data]) => data.count > 0 && !data.conquered)
      .map(([id, _]) => id);

    const availableCategories = categoryFilter === 'all'
      ? Object.keys(PROCEDURAL_TEMPLATES)
      : [categoryFilter];

    const generated = [];
    const maxTries = count * 6;
    let tries = 0;

    while (generated.length < count && tries < maxTries) {
      tries++;

      // Scelta categoria ponderata (priorità agli errori attivi)
      let catKey = availableCategories[Math.floor(Math.random() * availableCategories.length)];
      if (categoryFilter === 'all' && activeErrors.length > 0 && Math.random() < 0.6) {
        // Seleziona preferibilmente la categoria che corrisponde al punto debole dell'allievo
        const matched = activeErrors.find(errKey => PROCEDURAL_TEMPLATES[errKey]);
        if (matched) catKey = matched;
      }

      const templates = PROCEDURAL_TEMPLATES[catKey] || PROCEDURAL_TEMPLATES.third_person_s;
      const tmpl = templates[Math.floor(Math.random() * templates.length)];

      // Verifica affinità di livello
      if (isA1 && tmpl.level === 'B1' && Math.random() < 0.7) continue;
      if (isB1 && tmpl.level === 'A1' && Math.random() < 0.7) continue;

      // Scelta soggetto (se necessario)
      const isThirdPerson = catKey === 'third_person_s';
      const subjList = isThirdPerson ? PROCEDURAL_SUBJECTS.third_person_sing : PROCEDURAL_SUBJECTS.general;
      const subj = subjList[Math.floor(Math.random() * subjList.length)];

      const itPrompt = tmpl.buildIt(subj);
      const sentenceData = tmpl.buildSentence(subj);

      const uniqueId = `proc_${catKey}_${Math.random().toString(36).substring(2, 8)}`;
      if (this.sessionGeneratedIds.has(uniqueId)) continue;
      this.sessionGeneratedIds.add(uniqueId);

      generated.push({
        id: uniqueId,
        level: tmpl.level,
        category: tmpl.category,
        categoryKey: catKey,
        itPrompt: itPrompt,
        beforeBlank: sentenceData.beforeBlank,
        afterBlank: sentenceData.afterBlank,
        expected: tmpl.expected,
        acceptable: tmpl.acceptable,
        fullSentence: sentenceData.fullSentence,
        rule: tmpl.rule,
        hint: tmpl.hint,
        isAiGenerated: false
      });
    }

    return generated;
  }

  /**
   * Genera esercizi tramite LLM (Gemini o OpenAI) se la chiave API è presente,
   * altrimenti ripiega istantaneamente sulla generazione procedurale algoritmica.
   */
  async generateAdaptiveBatch(count = 10, categoryFilter = 'all') {
    const aiConfig = configManager.profile.aiConfig;
    const hasApiKey = (aiConfig.provider === 'gemini' && aiConfig.geminiKey) ||
                      (aiConfig.provider === 'openai' && aiConfig.openaiKey);

    if (hasApiKey) {
      try {
        const aiItems = await aiService.generateAdaptiveGrammarExercises(Math.min(count, 5), categoryFilter);
        if (aiItems && aiItems.length > 0) {
          // Completa fino al conteggio desiderato con procedurale
          const remainingCount = count - aiItems.length;
          const procItems = remainingCount > 0 ? this.generateProceduralBatch(remainingCount, categoryFilter) : [];
          return [...aiItems, ...procItems];
        }
      } catch (e) {
        console.warn('Live AI grammar generation fallback to procedural:', e);
      }
    }

    // Generazione procedurale affidabile al 100% (anche offline)
    return this.generateProceduralBatch(count, categoryFilter);
  }
}

export const dynamicGrammarGenerator = new DynamicGrammarGenerator();

// ============================================================================
// CONTROLLER INTERFACCIA PALESTRA DI GRAMMATICA
// ============================================================================

class GrammarGymController {
  constructor() {
    this.container = null;
    this.currentCategoryFilter = 'all';
    this.currentIndex = 0;
    this.exercisesList = [];
    this.streakCount = 0;
    this.isGenerating = false;
  }

  async mount(container) {
    this.container = container;
    if (this.exercisesList.length === 0) {
      await this.generateNewExercises(10);
    } else {
      this.render();
    }
  }

  /**
   * Genera un nuovo set fresco di esercizi adattivi
   */
  async generateNewExercises(count = 10) {
    this.isGenerating = true;
    if (this.container) {
      this.renderLoadingState();
    }

    try {
      const freshBatch = await dynamicGrammarGenerator.generateAdaptiveBatch(count, this.currentCategoryFilter);
      this.exercisesList = freshBatch;
      this.currentIndex = 0;
    } catch (err) {
      console.error('Error generating exercises:', err);
      this.exercisesList = dynamicGrammarGenerator.generateProceduralBatch(count, this.currentCategoryFilter);
      this.currentIndex = 0;
    } finally {
      this.isGenerating = false;
      this.render();
    }
  }

  renderLoadingState() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="card" style="max-width: 800px; margin: 40px auto; text-align: center; padding: 50px 30px;">
        <div style="font-size: 40px; margin-bottom: 16px; animation: spin 2s linear infinite;">⚡</div>
        <h3 style="color: var(--accent-cyan); font-size: 20px; margin-bottom: 8px;">
          Generazione Automatica Esercizi in Corso...
        </h3>
        <p style="color: var(--text-muted); font-size: 14px; max-width: 520px; margin: 0 auto;">
          Il motore adattivo sta componendo nuovi esercizi su misura per il tuo livello e per i tuoi colli di bottiglia attivi. Zero risposte a crocette: solo inserimento diretto e pronuncia!
        </p>
      </div>
    `;
  }

  render() {
    if (!this.container) return;

    if (this.exercisesList.length === 0) {
      this.container.innerHTML = `
        <div class="card" style="max-width: 780px; margin: 40px auto; text-align: center; padding: 40px;">
          <h3>Nessun esercizio generato</h3>
          <button id="btn-gym-force-generate" class="btn btn-primary" style="margin-top: 16px;">
            ⚡ Genera 10 Nuovi Esercizi Ora
          </button>
        </div>
      `;
      const btn = this.container.querySelector('#btn-gym-force-generate');
      if (btn) btn.addEventListener('click', () => this.generateNewExercises(10));
      return;
    }

    const ex = this.exercisesList[this.currentIndex];
    const profile = configManager.profile;
    const name = profile.userName || 'Alessio';

    this.container.innerHTML = `
      <div class="grammar-gym-container" style="max-width: 840px; margin: 0 auto;">
        
        <!-- Header Banner with Live Adaptive Generator Status -->
        <div class="card" style="margin-bottom: 20px; background: linear-gradient(135deg, rgba(28, 38, 59, 0.95), rgba(15, 23, 42, 0.95)); border: 1px solid rgba(6, 214, 160, 0.35);">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
            <div>
              <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <span style="font-size: 26px;">🏋️</span>
                <h2 style="font-family: var(--font-heading); font-size: 20px; color: var(--text-primary); margin: 0;">
                  Palestra di Grammatica Adattiva
                </h2>
                <span class="brand-tag" style="background: rgba(6, 214, 160, 0.15); color: #06d6a0;">Zero Scelta Multipla</span>
                <span class="badge" style="background: rgba(58, 134, 255, 0.2); color: #60a5fa; border: 1px solid rgba(96, 165, 250, 0.3); font-size: 11px; padding: 3px 8px; border-radius: 12px;">
                  🤖 Generatore Automatico Attivo
                </span>
              </div>
              <p style="font-size: 13px; color: var(--text-muted); margin-top: 6px;">
                Esercizi generati proceduralmente e con IA per ${name} • Inserimento diretto a voce o tastiera con correzione e audio madrelingua.
              </p>
            </div>
            
            <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
              <button id="btn-gym-generate-new" class="btn btn-sm btn-accent" style="display: flex; align-items: center; gap: 6px;" title="Crea un nuovo set di esercizi freschi">
                ⚡ Genera Nuovi Esercizi
              </button>
              <div style="background: rgba(255, 190, 11, 0.12); border: 1px solid rgba(255, 190, 11, 0.3); padding: 6px 14px; border-radius: 20px; font-size: 13px; color: var(--accent-amber); font-weight: 700;">
                🔥 Serie: <span id="gym-streak-badge">${this.streakCount}</span>
              </div>
              <div style="font-size: 12px; color: var(--text-muted); font-weight: 600;">
                ${this.currentIndex + 1} di ${this.exercisesList.length}
              </div>
            </div>
          </div>

          <!-- Category Quick Filter Pills & Info Link -->
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; margin-top: 18px; border-top: 1px solid var(--border-subtle); padding-top: 14px;">
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button class="btn btn-sm gym-cat-btn ${this.currentCategoryFilter === 'all' ? 'active-level' : ''}" data-cat="all">🎯 Tutti i Consigliati</button>
              <button class="btn btn-sm gym-cat-btn ${this.currentCategoryFilter === 'third_person_s' ? 'active-level' : ''}" data-cat="third_person_s">3ª Persona (-s)</button>
              <button class="btn btn-sm gym-cat-btn ${this.currentCategoryFilter === 'past_simple' ? 'active-level' : ''}" data-cat="past_simple">Passato Verbi</button>
              <button class="btn btn-sm gym-cat-btn ${this.currentCategoryFilter === 'do_does_auxiliary' ? 'active-level' : ''}" data-cat="do_does_auxiliary">Do / Does / Did</button>
              <button class="btn btn-sm gym-cat-btn ${this.currentCategoryFilter === 'preposition_in_on_at' ? 'active-level' : ''}" data-cat="preposition_in_on_at">In / On / At</button>
              <button class="btn btn-sm gym-cat-btn ${this.currentCategoryFilter === 'polite_modals' ? 'active-level' : ''}" data-cat="polite_modals">Modali di Cortesia</button>
              <button class="btn btn-sm gym-cat-btn ${this.currentCategoryFilter === 'connectors' ? 'active-level' : ''}" data-cat="connectors">Connettori</button>
              <button class="btn btn-sm gym-cat-btn ${this.currentCategoryFilter === 'common_italian_bottlenecks' ? 'active-level' : ''}" data-cat="common_italian_bottlenecks">Errori Tipici</button>
            </div>
            <button id="btn-gym-explain" class="btn btn-sm" style="background: transparent; color: var(--accent-cyan); font-size: 11px; padding: 4px 8px; border: 1px dashed rgba(6, 214, 160, 0.4);">
              ℹ️ Come funziona la generazione?
            </button>
          </div>
        </div>

        <!-- Active Exercise Card -->
        <div class="card" id="gym-main-card" style="padding: 28px; position: relative;">
          
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span class="question-badge" style="font-size: 12px; padding: 4px 10px; border-radius: 6px; background: rgba(58, 134, 255, 0.15); color: #60a5fa; font-weight: 700;">
                ${ex.category} • Livello ${ex.level}
              </span>
              ${ex.isAiGenerated ? `<span class="badge" style="font-size: 10px; background: rgba(131, 56, 236, 0.2); color: #c084fc; border: 1px solid rgba(192, 132, 252, 0.4); padding: 2px 6px; border-radius: 4px;">✨ IA Generata</span>` : `<span class="badge" style="font-size: 10px; background: rgba(6, 214, 160, 0.15); color: #06d6a0; border: 1px solid rgba(6, 214, 160, 0.3); padding: 2px 6px; border-radius: 4px;">⚡ Procedurale</span>`}
            </div>
            <button id="btn-gym-listen-italian" class="audio-btn-inline" title="Ascolta frase italiana" style="width: 36px; height: 36px; font-size: 16px;">
              🇮🇹 🔊
            </button>
          </div>

          <!-- Italian Meaning Prompt -->
          <div style="background: rgba(58, 134, 255, 0.06); border-left: 4px solid var(--accent-blue); padding: 16px 18px; border-radius: 8px; margin-bottom: 22px;">
            <div style="font-size: 12px; font-weight: 700; color: var(--accent-blue); text-transform: uppercase; margin-bottom: 4px;">
              💡 Significato da esprimere in inglese:
            </div>
            <div style="font-size: 18px; font-weight: 600; color: var(--text-primary); line-height: 1.5;">
              "${ex.itPrompt}"
            </div>
          </div>

          <!-- English Challenge Sentence with Inline Blank Input -->
          <div style="margin: 24px 0; text-align: left;">
            <label style="font-size: 13px; font-weight: 700; color: var(--text-secondary); display: block; margin-bottom: 8px;">
              Inserisci la parola mancante (puoi digitare o premere il microfono):
            </label>

            <div class="grammar-interactive-sentence" style="font-size: 20px; line-height: 2.2; color: var(--text-primary); background: var(--bg-surface); padding: 20px; border-radius: 12px; border: 1px solid var(--border-subtle); display: flex; align-items: center; flex-wrap: wrap; gap: 8px;">
              ${ex.beforeBlank ? `<span>${ex.beforeBlank}</span>` : ''}
              
              <input type="text" id="gym-blank-input" class="console-text-input" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
                style="display: inline-block; width: 190px; max-width: 100%; font-size: 20px; font-weight: 700; color: var(--accent-cyan); text-align: center; border-bottom: 3px solid var(--accent-blue); padding: 6px 10px; border-radius: 6px;"
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
    const generateNewBtn = this.container.querySelector('#btn-gym-generate-new');
    const explainBtn = this.container.querySelector('#btn-gym-explain');
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

    if (explainBtn) {
      explainBtn.addEventListener('click', () => {
        const text = "Gli esercizi vengono generati automaticamente dal motore adattivo di LexiVox ad ogni richiesta. L'algoritmo combina matrici grammaticali e intelligenza artificiale per creare frasi sempre nuove sul tuo livello CEFR e sui tuoi errori ricorrenti, senza scelte multiple.";
        dsaTools.speakItalian(text);
        alert(`🤖 Come vengono generati gli esercizi?\n\n${text}`);
      });
    }

    if (generateNewBtn) {
      generateNewBtn.addEventListener('click', () => {
        this.generateNewExercises(10);
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
        this.generateNewExercises(10);
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

  extractWordFromSpoken(spoken, ex) {
    const cleanSpoken = spoken.toLowerCase().replace(/[^\w\s']/g, ' ').trim();
    const cleanExpected = ex.expected.toLowerCase().trim();

    if (cleanSpoken === cleanExpected) return ex.expected;

    for (const acc of ex.acceptable) {
      const accLower = acc.toLowerCase();
      if (cleanSpoken.split(/\s+/).includes(accLower)) {
        return acc;
      }
    }

    const words = cleanSpoken.split(/\s+/);
    if (words.includes(cleanExpected)) {
      return ex.expected;
    }

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

      dsaTools.speakEnglish(ex.fullSentence, 0.85);
    }

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
        if (this.currentIndex + 1 >= this.exercisesList.length) {
          this.renderSetCompleted();
        } else {
          this.currentIndex++;
          this.render();
        }
      });
    }
  }

  renderSetCompleted() {
    if (!this.container) return;
    const name = configManager.profile.userName || 'Alessio';

    this.container.innerHTML = `
      <div class="card" style="max-width: 800px; margin: 40px auto; text-align: center; padding: 50px 30px; border: 2px solid rgba(6, 214, 160, 0.5); background: linear-gradient(135deg, rgba(28, 38, 59, 0.95), rgba(15, 23, 42, 0.95));">
        <div style="font-size: 50px; margin-bottom: 16px;">🏆</div>
        <h2 style="color: var(--accent-cyan); font-size: 24px; margin-bottom: 10px;">
          Fantastico, ${name}! Hai completato questa serie!
        </h2>
        <p style="color: var(--text-secondary); font-size: 16px; max-width: 540px; margin: 0 auto 24px auto; line-height: 1.6;">
          Hai praticato con successo l'inserimento diretto a voce e tastiera. La tua serie corrente è di <strong>${this.streakCount}</strong> risposte corrette.
        </p>

        <div style="display: flex; gap: 14px; justify-content: center; flex-wrap: wrap;">
          <button id="btn-gym-more-batch" class="btn btn-accent btn-lg" style="padding: 14px 28px; font-size: 16px;">
            ⚡ Genera Subito Altri 10 Nuovi Esercizi
          </button>
          <button id="btn-gym-return-first" class="btn btn-secondary btn-lg" style="padding: 14px 20px;">
            🔄 Rivedi Questa Serie
          </button>
        </div>
      </div>
    `;

    dsaTools.speakItalian(`Congratulazioni ${name}! Hai completato la serie di esercizi. Vuoi generarne altri dieci?`);

    const moreBtn = this.container.querySelector('#btn-gym-more-batch');
    if (moreBtn) {
      moreBtn.addEventListener('click', () => this.generateNewExercises(10));
    }

    const returnBtn = this.container.querySelector('#btn-gym-return-first');
    if (returnBtn) {
      returnBtn.addEventListener('click', () => {
        this.currentIndex = 0;
        this.render();
      });
    }
  }
}

export const grammarGymController = new GrammarGymController();
