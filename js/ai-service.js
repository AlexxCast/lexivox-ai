/**
 * LexiVox AI - Hyper-Adaptive Conversational AI Tutor
 * Adapts dynamically to the learner's cognitive profile (severe DSA),
 * current CEFR level, persistent error history, and spoken evolution.
 * Zero rigid/canned scenarios.
 */

import { configManager } from './config.js';

class AiService {
  constructor() {
    this.conversationHistory = [];
  }

  /* Construct deep learner context for Gemini / OpenAI */
  buildAdaptiveSystemPrompt() {
    const profile = configManager.profile;
    const name = profile.userName || 'Alessio';
    const level = profile.currentLevel || 'Pre-A1';
    
    // Extract top persistent error bottlenecks
    const activeErrors = Object.entries(profile.errorStats || {})
      .filter(([_, data]) => data.count > 0 && !data.conquered)
      .sort((a, b) => b[1].count - a[1].count)
      .map(([id, data]) => `- ${data.label}: commesso ${data.count} volte`);

    const conqueredSkills = (profile.conqueredBottlenecks || []).map(b => b.label);
    const wpm = profile.latestWpm || 65;

    return `You are David, a world-class, empathetic personal English tutor and speech coach.
You are talking directly to your adult student ${name}.

STUDENT PROFILE & LEARNING EVOLUTION:
- Cognitive Condition: Severe DSA (dyslexia and learning differences). Needs high patience, low cognitive friction.
- Current CEFR Spoken Level: ${level}
- Target Goal: ${profile.targetLevel}
- Known Persistent Weak Points (Error Tracker):
${activeErrors.length > 0 ? activeErrors.join('\n') : '- Still assessing initial speaking patterns (reinforce basic verbs, 3rd person -s, and past tense)'}
- Mastered Skills: ${conqueredSkills.length > 0 ? conqueredSkills.join(', ') : 'Initial greetings and basic routine'}
- Speech Tempo: ~${wpm} WPM.

PEDAGOGICAL RULES (STRICT):
1. NO ARTIFICIAL OR CHILDISH ROLEPLAY SCENARIOS. Talk like a real, supportive human friend and coach who knows ${name} personally.
2. CONCISE SPOKEN RESPONSES: Max 1 to 2 short sentences (under 25 words). Never produce long paragraphs or textbook grammar explanations.
3. ADAPT TO WEAKNESSES: Naturally steer the conversation so ${name} gets an opportunity to practice structures they struggle with (e.g. if they struggle with past verbs, ask about yesterday; if 3rd person -s, ask about someone in their family or a friend).
4. NATURAL RECASTING: If ${name} makes a mistake, NEVER say "You made an error". Instead, model the correct phrasing naturally in your conversational reply.
5. End with ONE simple, encouraging spoken question to prompt ${name}'s next turn.

OUTPUT FORMAT:
Respond ONLY with a valid JSON object:
{
  "en": "Short English coach response (1-2 sentences)",
  "it": "Traduzione italiana semplice e immediata"
}`;
  }

  getActiveLearningFocus() {
    const profile = configManager.profile;
    const activeErrors = Object.entries(profile.errorStats || {})
      .filter(([_, data]) => data.count > 0 && !data.conquered)
      .sort((a, b) => b[1].count - a[1].count);

    if (activeErrors.length > 0) {
      return `Rinforzo attivo: ${activeErrors[0][1].label}`;
    }
    return `Consolidamento parlato spontaneo (Livello ${profile.currentLevel})`;
  }

  getInitialGreeting() {
    const name = configManager.profile.userName || 'Alessio';
    const level = configManager.profile.currentLevel || 'Pre-A1';

    return {
      en: `Hi ${name}! I'm David, your adaptive English tutor. I've tuned our session to your level (${level}). How are you feeling today, and what did you do this morning?`,
      it: `Ciao ${name}! Sono David, il tuo tutor d'inglese adattivo. Ho calibrato la nostra sessione sul tuo livello (${level}). Come ti senti oggi e cosa hai fatto questa mattina?`
    };
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
        console.warn('Gemini API call failed, falling back to adaptive local engine:', err);
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
        console.warn('OpenAI API call failed, falling back to adaptive local engine:', err);
      }
    }

    // Adaptive local engine tailored to user evolution
    return this.generateAdaptiveLocalResponse(userText);
  }

  /* Intelligent Adaptive Local Engine (Learns from user errors & level without API key) */
  generateAdaptiveLocalResponse(userText) {
    const profile = configManager.profile;
    const name = profile.userName || 'Alessio';
    const level = profile.currentLevel || 'Pre-A1';
    const lower = userText.toLowerCase().trim();

    // Check if user is speaking nonsense or gibberish
    if (/(hakuna|matata|chicka|fluka|bla\s*bla|random|asdf|qwerty)/i.test(lower)) {
      return {
        en: "I didn't catch valid English words in that. Tell me in your own words: what did you do today?",
        it: "Non ho colto parole inglesi valide. Dimmi con le tue parole: cosa hai fatto oggi?"
      };
    }

    // Check if user mentions difficulties, DSA, or feeling stuck
    if (/(difficult|hard|help|cant|cannot|error|mistake|problem|dsa|dislessia|stuck|slow)/i.test(lower)) {
      return {
        en: `You are doing great, ${name}! Don't worry about mistakes. Let's take it easy: what is one thing you like doing in your free time?`,
        it: `Stai andando benissimo, ${name}! Non preoccuparti degli errori. Facciamola con calma: cosa ti piace fare nel tempo libero?`
      };
    }

    // Check if user spoke Italian
    if (/(ciao|buongiorno|come|stai|grazie|non|so|cosa|dire|bene|male|oggi)/i.test(lower)) {
      return {
        en: "I hear some Italian! In English you can say: 'I am doing well'. How was your morning today?",
        it: "Sento dell'italiano! In inglese puoi dire: 'I am doing well'. Com'è andata la tua mattinata oggi?"
      };
    }

    // Find the student's highest priority error to steer the practice
    const topErrorEntry = Object.entries(profile.errorStats || {})
      .filter(([_, data]) => data.count > 0 && !data.conquered)
      .sort((a, b) => b[1].count - a[1].count)[0];

    const activeErrorId = topErrorEntry ? topErrorEntry[0] : null;

    // Routine & Morning responses
    if (/(wake|woke|morning|breakfast|coffee|tea|bed|clock|hour|sleep|slept)/i.test(lower)) {
      if (activeErrorId === 'past_simple') {
        return {
          en: "Nice routine! Yesterday, what time did you wake up, and did you go out?",
          it: "Bella routine! Ieri, a che ora ti sei svegliato e sei uscito?"
        };
      }
      return {
        en: "Starting the day with coffee or breakfast is great. What are you planning to do this afternoon?",
        it: "Iniziare la giornata con caffè o colazione è ottimo. Cosa hai in programma di fare questo pomeriggio?"
      };
    }

    // Work, Study & Day activities
    if (/(work|worked|job|office|study|studied|school|busy|project)/i.test(lower)) {
      if (activeErrorId === 'third_person_s') {
        return {
          en: "I understand! Do you work with a colleague or friend? What does he or she do?",
          it: "Capisco! Lavori con un collega o un amico? Cosa fa lui o lei?"
        };
      }
      return {
        en: "Work keeps us busy! When you finish working, how do you usually relax?",
        it: "Il lavoro ci tiene impegnati! Quando finisci di lavorare, come ti rilassi di solito?"
      };
    }

    // Hobbies, Movies, Music, Food
    if (/(pizza|pasta|food|eat|ate|cinema|movie|film|music|game|sport|football|gym)/i.test(lower)) {
      if (activeErrorId === 'past_simple') {
        return {
          en: "That sounds delicious and fun! When did you last eat that or watch that?",
          it: "Sembra delizioso e divertente! Quando l'hai mangiato o guardato l'ultima volta?"
        };
      }
      return {
        en: "That's wonderful! Who do you usually share that with, friends or family?",
        it: "Che bello! Con chi lo condividi di solito, amici o famiglia?"
      };
    }

    // Weekend & Past activities
    if (/(yesterday|weekend|sunday|saturday|last\s+week|went|bought|saw|visited)/i.test(lower)) {
      return {
        en: "That sounds like a memorable day! Did you have fun, and who was with you?",
        it: "Sembra una giornata memorabile! Ti sei divertito e chi c'era con te?"
      };
    }

    // Adaptive default steering based on student's current CEFR level
    if (level === 'Pre-A1' || level === 'A1') {
      const adaptivePrompts = [
        {
          en: "I hear you! You are speaking clearly. Do you like living in your city?",
          it: "Ti ascolto! Stai parlando in modo chiaro. Ti piace vivere nella tua città?"
        },
        {
          en: "Good job! Tell me: what is your favorite food to eat on weekends?",
          it: "Ottimo lavoro! Dimmi: qual è il tuo cibo preferito da mangiare nel weekend?"
        },
        {
          en: "You are making steady progress! What music or sport do you enjoy most?",
          it: "Stai facendo progressi costanti! Che musica o sport ti piace di più?"
        }
      ];
      const res = adaptivePrompts[Math.floor(Math.random() * adaptivePrompts.length)];
      this.conversationHistory.push({ role: 'assistant', content: res.en });
      return res;
    } else {
      const advancedPrompts = [
        {
          en: "That's very interesting. How would you describe your typical week in a few words?",
          it: "Molto interessante. Come descriveresti la tua settimana tipica in poche parole?"
        },
        {
          en: "Great expression! If you could travel anywhere tomorrow, where would you go?",
          it: "Ottima espressione! Se potessi viaggiare ovunque domani, dove andresti?"
        }
      ];
      const res = advancedPrompts[Math.floor(Math.random() * advancedPrompts.length)];
      this.conversationHistory.push({ role: 'assistant', content: res.en });
      return res;
    }
  }

  async callGeminiApi(prompt, apiKey) {
    const systemPrompt = this.buildAdaptiveSystemPrompt();
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
    
    try {
      const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      return { en: rawText.trim(), it: "Traduzione non disponibile" };
    }
  }

  async callOpenAiApi(prompt, apiKey) {
    const systemPrompt = this.buildAdaptiveSystemPrompt();

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
          ...this.conversationHistory.slice(-6).map(m => ({ role: m.role, content: m.content })),
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
