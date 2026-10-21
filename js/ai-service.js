/**
 * LexiVox AI - Conversational AI Service
 * Supports built-in contextual conversational scenarios (offline/zero config)
 * and optional live Google Gemini / OpenAI API integration.
 */

import { configManager } from './config.js';

const SCENARIOS = {
  casual: {
    name: "Caffè & Conversazione Quotidiana",
    description: "Parla della tua giornata, delle tue passioni e di cosa hai fatto oggi.",
    initialAiMessage: {
      en: "Hi! It's great to talk with you today. How are you feeling, and what did you do this morning?",
      it: "Ciao! È fantastico parlare con te oggi. Come ti senti e cosa hai fatto questa mattina?"
    },
    contextReplies: [
      {
        match: /(coffee|breakfast|tea|eat|drink|ate)/i,
        en: "Nice! A good coffee or breakfast always helps start the day right. Do you drink coffee every morning?",
        it: "Bello! Un buon caffè o una colazione aiuta sempre a iniziare bene la giornata. Bevi caffè ogni mattina?"
      },
      {
        match: /(work|job|office|busy|study|school)/i,
        en: "I see! Having a busy day can be tiring, but you are doing great. What kind of work or projects do you enjoy most?",
        it: "Capisco! Avere una giornata intensa può essere stancante, ma stai andando alla grande. Che tipo di lavoro o progetti ti piacciono di più?"
      },
      {
        match: /(good|fine|well|happy|great|tired)/i,
        en: "I'm glad to hear from you! By the way, what are your plans for tomorrow or this weekend?",
        it: "Mi fa molto piacere sentirti! A proposito, quali sono i tuoi piani per domani o per questo fine settimana?"
      },
      {
        match: /(cinema|movie|film|music|game|sport|football|relax)/i,
        en: "That sounds like a lot of fun! Who do you usually watch movies or listen to music with?",
        it: "Sembra davvero divertente! Di solito con chi guardi film o ascolti musica?"
      }
    ],
    defaultReplies: [
      {
        en: "That is really interesting! Could you tell me a little bit more about that?",
        it: "È davvero interessante! Mi diresti qualcosa in più su questo?"
      },
      {
        en: "I understand! And what do you usually like to do when you have free time in the afternoon?",
        it: "Ho capito! E cosa ti piace fare di solito quando hai tempo libero nel pomeriggio?"
      },
      {
        en: "You are speaking very clearly! How often do you practice speaking English like this?",
        it: "Stai parlando in modo molto chiaro! Quanto spesso fai pratica parlando in inglese così?"
      }
    ]
  },

  travel: {
    name: "Viaggi, Aeroporto & Hotel",
    description: "Simula situazioni reali all'estero: check-in, ordinare, chiedere indicazioni.",
    initialAiMessage: {
      en: "Welcome to London Heathrow Airport! May I please see your passport and flight ticket?",
      it: "Benvenuto all'aeroporto di Londra Heathrow! Posso vedere il suo passaporto e il biglietto aereo?"
    },
    contextReplies: [
      {
        match: /(here|passport|ticket|take|please)/i,
        en: "Thank you very much. Everything looks in order! Are you traveling for business or for a holiday?",
        it: "Molte grazie. Sembra tutto in ordine! Viaggia per lavoro o per vacanza?"
      },
      {
        match: /(holiday|vacation|fun|visit|trip|tourism)/i,
        en: "Wonderful! London has fantastic museums and parks. How many days will you stay here?",
        it: "Meraviglioso! Londra ha musei e parchi fantastici. Quanti giorni rimarrai qui?"
      },
      {
        match: /(business|work|meeting|conference)/i,
        en: "Understood. I hope you have a productive stay. Do you need any assistance finding a taxi into the city center?",
        it: "Ricevuto. Spero tu abbia un soggiorno produttivo. Ha bisogno di aiuto per trovare un taxi verso il centro?"
      }
    ],
    defaultReplies: [
      {
        en: "Excellent! Here is your boarding pass. Gate 14 is just down the hall on your left. Have a safe flight!",
        it: "Eccellente! Ecco la sua carta d'imbarco. Il gate 14 è in fondo al corridoio a sinistra. Buon volo!"
      }
    ]
  },

  restaurant: {
    name: "Al Ristorante & Pub",
    description: "Impara a ordinare cibo, chiedere il conto e scambiare due chiacchiere con il cameriere.",
    initialAiMessage: {
      en: "Good evening! Welcome to The Green Table. Table for one or two people tonight?",
      it: "Buonasera! Benvenuti a The Green Table. Tavolo per una o due persone stasera?"
    },
    contextReplies: [
      {
        match: /(one|two|table|person|people)/i,
        en: "Perfect, right this way please! Would you like to start with something to drink while you check the menu?",
        it: "Perfetto, da questa parte prego! Desidera iniziare con qualcosa da bere mentre consulta il menu?"
      },
      {
        match: /(water|beer|wine|coke|juice|drink)/i,
        en: "Coming right up! For the main dish, our chef recommends the grilled salmon or pasta. What do you feel like eating?",
        it: "Arriva subito! Come piatto principale, il nostro chef consiglia il salmone alla griglia o la pasta. Cosa le andrebbe di mangiare?"
      },
      {
        match: /(bill|check|pay|card|cash)/i,
        en: "Certainly! Here is the bill. You can pay by card or cash whenever you are ready.",
        it: "Certamente! Ecco il conto. Può pagare con carta o contanti quando preferisce."
      }
    ],
    defaultReplies: [
      {
        en: "Delicious choice! I'll bring that to the kitchen immediately. Enjoy your meal!",
        it: "Scelta deliziosa! Lo porto subito in cucina. Buon appetito!"
      }
    ]
  }
};

class AiService {
  constructor() {
    this.currentScenarioKey = 'casual';
    this.conversationHistory = [];
  }

  getAvailableScenarios() {
    return Object.entries(SCENARIOS).map(([key, data]) => ({
      key,
      name: data.name,
      description: data.description
    }));
  }

  setScenario(key) {
    if (SCENARIOS[key]) {
      this.currentScenarioKey = key;
      this.conversationHistory = [];
    }
  }

  getInitialGreeting() {
    const scn = SCENARIOS[this.currentScenarioKey] || SCENARIOS.casual;
    return scn.initialAiMessage;
  }

  async generateResponse(userText) {
    const aiConfig = configManager.profile.aiConfig;

    // Save in session history
    this.conversationHistory.push({ role: 'user', content: userText });

    // Try Gemini API if key is set
    if (aiConfig.provider === 'gemini' && aiConfig.geminiKey) {
      try {
        const geminiResult = await this.callGeminiApi(userText, aiConfig.geminiKey);
        if (geminiResult) {
          this.conversationHistory.push({ role: 'assistant', content: geminiResult.en });
          return geminiResult;
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local simulation:', err);
      }
    }

    // Try OpenAI API if key is set
    if (aiConfig.provider === 'openai' && aiConfig.openaiKey) {
      try {
        const openaiResult = await this.callOpenAiApi(userText, aiConfig.openaiKey);
        if (openaiResult) {
          this.conversationHistory.push({ role: 'assistant', content: openaiResult.en });
          return openaiResult;
        }
      } catch (err) {
        console.warn('OpenAI API call failed, falling back to local simulation:', err);
      }
    }

    // High quality built-in simulation engine
    return this.generateSimulatedResponse(userText);
  }

  generateSimulatedResponse(userText) {
    const scn = SCENARIOS[this.currentScenarioKey] || SCENARIOS.casual;
    const lower = userText.toLowerCase();

    // Check if user is speaking nonsense or gibberish
    if (/(hakuna|matata|chicka|fluka|bla\s*bla|random|asdf)/i.test(lower)) {
      return {
        en: "I didn't detect valid English words in that. Please try expressing a real thought or phrase in English!",
        it: "Non ho rilevato parole inglesi valide. Prova a formulare un pensiero reale o una frase in inglese!"
      };
    }

    // Look for matching context rules
    for (const item of scn.contextReplies) {
      if (item.match.test(userText)) {
        this.conversationHistory.push({ role: 'assistant', content: item.en });
        return { en: item.en, it: item.it };
      }
    }

    // Contextual handling for waking up / morning routines
    if (/(wake|woke|waking|up|sleep|slept|bed|9:00|8:00|7:00|am|clock)/i.test(lower)) {
      return {
        en: "Waking up at that time gives you a fresh start! What do you usually have for breakfast after getting out of bed?",
        it: "Svegliarsi a quell'ora dà un buon inizio di giornata! Cosa mangi di solito per colazione dopo esserti alzato?"
      };
    }

    // Contextual handling for speaking difficulties / DSA
    if (/(difficult|hard|help|cant|cannot|error|mistake|problem|dsa|dislessia)/i.test(lower)) {
      return {
        en: "Don't worry at all! Take your time, breathe, and speak slowly. What topic would you like to practice today?",
        it: "Non preoccuparti affatto! Prenditi il tuo tempo, respira e parla lentamente. Di quale argomento vorresti parlare oggi?"
      };
    }

    // Contextual handling for Italian phrases
    if (/(ciao|buongiorno|come|stai|grazie|non|so|cosa|dire)/i.test(lower)) {
      return {
        en: "I noticed you spoke some Italian! In English you can say: 'Hello, I'm ready to learn'. Give it a try!",
        it: "Ho notato che hai usato parole italiane! In inglese puoi dire: 'Hello, I'm ready to learn'. Prova a ripeterlo a voce!"
      };
    }

    // Fallback to rotating default replies
    const randomIndex = Math.floor(Math.random() * scn.defaultReplies.length);
    const chosen = scn.defaultReplies[randomIndex];
    this.conversationHistory.push({ role: 'assistant', content: chosen.en });
    return { en: chosen.en, it: chosen.it };
  }

  async callGeminiApi(prompt, apiKey) {
    const systemPrompt = `You are LexiVox AI, an empathetic, supportive spoken English tutor for an adult with severe DSA (dyslexia/learning differences).
Keep your reply CONCISE (1 to 2 sentences max), natural, friendly, and easy to understand aloud.
End with one simple, engaging open question to keep the spoken conversation alive.
Respond ONLY with a JSON object in this format:
{"en": "Your english response here", "it": "Traduzione italiana concisa per facilitare la comprensione"}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          ...this.conversationHistory.slice(-6).map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
          })),
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nStudent just said to you: "${prompt}"` }] }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Parse JSON
    try {
      const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      return { en: rawText.trim(), it: "Traduzione non disponibile" };
    }
  }

  async callOpenAiApi(prompt, apiKey) {
    const systemPrompt = `You are LexiVox AI, an empathetic spoken English tutor for an adult with severe DSA (dyslexia).
Keep your reply CONCISE (1-2 sentences), warm, clear, ending with a question.
Return JSON: {"en": "your response", "it": "italian translation"}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const content = data.choices[0].message.content;
    try {
      const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      return { en: content.trim(), it: "Traduzione" };
    }
  }
}

export const aiService = new AiService();
