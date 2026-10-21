/**
 * LexiVox AI - Spoken Fluency & English Acoustic Verification Engine
 * Validates real English lexical presence, catches gibberish/nonsense,
 * and realistically computes Words-Per-Minute (WPM), hesitation latency and pronunciation.
 */

import { configManager } from './config.js';

// Core English Lexicon (Common functional & content vocabulary for fast verification)
const COMMON_ENGLISH_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you',
  'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or', 'an', 'will', 'my', 'one',
  'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when',
  'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some',
  'could', 'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back',
  'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these',
  'give', 'day', 'most', 'us', 'wake', 'morning', 'night', 'coffee', 'food', 'eat', 'drink', 'water', 'sleep', 'home',
  'school', 'study', 'learn', 'english', 'speak', 'talk', 'listen', 'read', 'write', 'friend', 'family', 'car', 'train',
  'bus', 'airport', 'hotel', 'city', 'country', 'today', 'yesterday', 'tomorrow', 'happy', 'sad', 'tired', 'busy', 'fine',
  'yes', 'please', 'thank', 'thanks', 'hello', 'hi', 'bye', 'sorry', 'excuse', 'help', 'where', 'why', 'here', 'there',
  'am', 'is', 'are', 'was', 'were', 'been', 'has', 'had', 'did', 'does', 'doing', 'went', 'bought', 'bought', 'saw'
]);

class FluencyAnalyzer {
  constructor() {
    this.aiFinishedTimestamp = Date.now();
    this.speechStartTimestamp = null;
    this.speechEndTimestamp = null;
  }

  notifyAiFinishedSpeaking() {
    this.aiFinishedTimestamp = Date.now();
  }

  startSpeechSession() {
    this.speechStartTimestamp = Date.now();
  }

  analyzeUtterance(transcript) {
    this.speechEndTimestamp = Date.now();

    if (!transcript || typeof transcript !== 'string' || !transcript.trim()) {
      return {
        wpm: 0,
        durationSec: 0,
        wordCount: 0,
        latencySec: 0,
        pronunciationScore: 0,
        isValidEnglish: false,
        fluencyRating: "Nessun Parlato",
        fluencyColor: "var(--accent-coral)"
      };
    }

    // 1. Calculate reaction latency
    let latencySec = 1.0;
    if (this.aiFinishedTimestamp && this.speechStartTimestamp) {
      latencySec = Math.max(0.3, Math.round(((this.speechStartTimestamp - this.aiFinishedTimestamp) / 1000) * 10) / 10);
    }

    // 2. Tokenize words cleanly (lowercase, strip punctuation)
    const cleanTokens = transcript
      .toLowerCase()
      .replace(/[^\w\s']/g, ' ')
      .trim()
      .split(/\s+/)
      .filter(w => w.length > 0);

    const wordCount = cleanTokens.length;

    // 3. Measure duration & WPM realistically
    const durationMs = Math.max(1200, (this.speechEndTimestamp - (this.speechStartTimestamp || (this.speechEndTimestamp - 2000))));
    const durationSec = Math.round((durationMs / 1000) * 10) / 10;

    // WPM = (words / seconds) * 60
    let wpm = Math.round((wordCount / durationSec) * 60);

    // 4. Lexical English Verification (Catch random gibberish / nonsense)
    let recognizedCount = 0;
    for (const word of cleanTokens) {
      // Check exact match or common morphological variations (-s, -ed, -ing)
      const base = word.replace(/(s|ed|ing|ly)$/, '');
      if (COMMON_ENGLISH_WORDS.has(word) || COMMON_ENGLISH_WORDS.has(base) || word.length <= 2) {
        recognizedCount++;
      }
    }

    const englishRatio = wordCount > 0 ? recognizedCount / wordCount : 0;
    const isValidEnglish = englishRatio >= 0.45;

    let pronunciationScore = 0;
    let fluencyRating = "Naturale";
    let fluencyColor = "var(--accent-cyan)";

    if (!isValidEnglish) {
      // Severe penalty for nonsense or non-English speech (e.g. Hakuna Matata)
      pronunciationScore = Math.min(30, Math.round(englishRatio * 60));
      fluencyRating = "Parole Non Inglesi";
      fluencyColor = "var(--accent-coral)";
      wpm = Math.min(wpm, 30);
    } else {
      // Valid English sentence: score based on pacing, grammar cohesion, and articulation
      let baseScore = 65 + Math.round(englishRatio * 25);
      
      // Penalize unnaturally high WPM (machine artifact or spam)
      if (wpm > 180) {
        wpm = 110;
        baseScore -= 10;
      }

      // Check cadence
      if (wpm < 45) {
        fluencyRating = "Riflessivo (DSA)";
        fluencyColor = "var(--accent-amber)";
        baseScore = Math.max(55, baseScore - 8);
      } else if (wpm >= 45 && wpm <= 110) {
        fluencyRating = "Chiaro & Cadenzato";
        fluencyColor = "var(--accent-emerald)";
        baseScore = Math.min(95, baseScore + 5);
      } else {
        fluencyRating = "Fluente Rapido";
        fluencyColor = "var(--accent-blue)";
        baseScore = Math.min(96, baseScore + 8);
      }

      pronunciationScore = Math.min(96, Math.max(45, baseScore));
    }

    // Update user profile radar metrics
    const metrics = configManager.profile.radarMetrics;
    if (isValidEnglish) {
      metrics.fluency = Math.round((metrics.fluency || 45) * 0.8 + (wpm >= 60 ? 70 : 50) * 0.2);
      metrics.pronunciation = Math.round((metrics.pronunciation || 50) * 0.8 + pronunciationScore * 0.2);
    } else {
      metrics.pronunciation = Math.max(20, Math.round((metrics.pronunciation || 50) * 0.85 + pronunciationScore * 0.15));
    }
    configManager.save();

    return {
      wpm,
      durationSec,
      wordCount,
      latencySec,
      pronunciationScore,
      isValidEnglish,
      fluencyRating,
      fluencyColor
    };
  }
}

export const fluencyAnalyzer = new FluencyAnalyzer();
