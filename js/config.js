/**
 * LexiVox AI - Configuration & Persistent State Engine
 * Manages user profile, DSA accessibility preferences, error counters, and daily habit tracking.
 */

const STORAGE_KEY = 'lexivox_dsa_profile_v1';

const DEFAULT_PROFILE = {
  userName: 'Alessio',
  diagnosticCompleted: false,
  currentLevel: 'Pre-A1',
  currentScore: 25, // 0 - 100
  targetLevel: 'B1 (Spoken Fluency)',
  targetDays: 60,
  dailyTargetMinutes: 25,
  todayMinutesStudied: 0,
  lastStudyDate: new Date().toISOString().split('T')[0],
  streakDays: 1,
  totalWordsLearned: 42,
  totalSpokenMinutes: 0,
  
  // Specific DSA accessibility preferences
  a11y: {
    theme: 'default', // 'default' (dark slate), 'warm-cream', 'soft-sage'
    fontSize: 'md',   // 'sm', 'md', 'lg', 'xl'
    wideSpacing: true,
    screenTint: 'none', // 'none', 'amber', 'sage', 'rose'
    readingRuler: false,
    audioSpeed: 0.85,  // Slow natural speed for DSA listening ease
    autoReadIncoming: true,
    fontFamily: 'lexend'
  },

  // Real-time Adaptive Error Memory
  errorStats: {
    'third_person_s': { count: 0, lastSeen: null, conquered: false, label: "3ª persona singolare ('-s')" },
    'past_simple': { count: 0, lastSeen: null, conquered: false, label: "Passato semplice regolare/irregolare" },
    'preposition_in_on_at': { count: 0, lastSeen: null, conquered: false, label: "Preposizioni di tempo/luogo (in, on, at)" },
    'do_does_auxiliary': { count: 0, lastSeen: null, conquered: false, label: "Ausiliare interrogativo (Do vs Does)" },
    'pronunciation_th': { count: 0, lastSeen: null, conquered: false, label: "Pronuncia del fonema 'th' (/θ/, /ð/)" },
    'false_friends': { count: 0, lastSeen: null, conquered: false, label: "False Friends (actually, eventually)" }
  },

  // Conquered mastery badges
  conqueredBottlenecks: [
    { id: 'greeting_spontaneous', label: "Saluti e Presentazioni Spontanee", date: "Completato" }
  ],

  // Radar metrics (0 - 100)
  radarMetrics: {
    pronunciation: 40,
    fluency: 35,
    vocabulary: 45,
    grammar: 30,
    listening: 55
  },

  // AI Connection Config
  aiConfig: {
    provider: 'local', // 'local' | 'gemini' | 'openai'
    geminiKey: '',
    openaiKey: '',
    model: 'gemini-1.5-flash'
  }
};

class ConfigManager {
  constructor() {
    this.profile = this.load();
    this.checkDayRollover();
  }

  load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_PROFILE, ...parsed, a11y: { ...DEFAULT_PROFILE.a11y, ...parsed.a11y }, errorStats: { ...DEFAULT_PROFILE.errorStats, ...parsed.errorStats } };
      }
    } catch (e) {
      console.warn('Errore lettura localStorage:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_PROFILE));
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile));
    } catch (e) {
      console.error('Errore salvataggio localStorage:', e);
    }
  }

  checkDayRollover() {
    const today = new Date().toISOString().split('T')[0];
    if (this.profile.lastStudyDate !== today) {
      const lastDate = new Date(this.profile.lastStudyDate);
      const curDate = new Date(today);
      const diffDays = Math.round((curDate - lastDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Consecutive streak maintained
        if (this.profile.todayMinutesStudied >= this.profile.dailyTargetMinutes) {
          this.profile.streakDays += 1;
        }
      } else if (diffDays > 1) {
        // Streak broken
        this.profile.streakDays = 1;
      }
      this.profile.todayMinutesStudied = 0;
      this.profile.lastStudyDate = today;
      this.save();
    }
  }

  addStudyTime(seconds) {
    const minutes = seconds / 60;
    this.profile.todayMinutesStudied = Math.round((this.profile.todayMinutesStudied + minutes) * 10) / 10;
    this.profile.totalSpokenMinutes = Math.round((this.profile.totalSpokenMinutes + minutes) * 10) / 10;
    this.save();
  }

  recordError(errorKey) {
    if (this.profile.errorStats[errorKey]) {
      this.profile.errorStats[errorKey].count += 1;
      this.profile.errorStats[errorKey].lastSeen = new Date().toISOString();
      this.save();
      return this.profile.errorStats[errorKey].count;
    }
    return 0;
  }

  conquerError(errorKey) {
    if (this.profile.errorStats[errorKey]) {
      const item = this.profile.errorStats[errorKey];
      item.conquered = true;
      item.count = 0;
      
      // Add to conquered list if not already present
      if (!this.profile.conqueredBottlenecks.some(b => b.id === errorKey)) {
        this.profile.conqueredBottlenecks.unshift({
          id: errorKey,
          label: item.label,
          date: new Date().toLocaleDateString('it-IT')
        });
      }

      // Boost metrics
      this.profile.radarMetrics.grammar = Math.min(100, this.profile.radarMetrics.grammar + 8);
      this.profile.radarMetrics.fluency = Math.min(100, this.profile.radarMetrics.fluency + 6);
      this.save();
    }
  }
}

export const configManager = new ConfigManager();
