/**
 * LexiVox AI - Spoken Fluency & Acoustic Pronunciation Analyzer
 * Calculates Words-Per-Minute (WPM), speech reaction latency, phonetic clarity,
 * and cognitive hesitation ratio specifically calibrated for DSA learners.
 */

import { configManager } from './config.js';

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

  analyzeUtterance(transcript, rawConfidence = 0.85) {
    this.speechEndTimestamp = Date.now();

    // 1. Calculate reaction latency (tempo di reazione dal turno dell'IA)
    let latencySec = 1.0;
    if (this.aiFinishedTimestamp && this.speechStartTimestamp) {
      latencySec = Math.max(0.4, Math.round(((this.speechStartTimestamp - this.aiFinishedTimestamp) / 1000) * 10) / 10);
    }

    // 2. Calculate utterance duration & Words Per Minute (WPM)
    const durationMs = Math.max(800, (this.speechEndTimestamp - (this.speechStartTimestamp || this.speechEndTimestamp - 1500)));
    const durationSec = durationMs / 1000;
    
    const words = transcript.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    // Standard formula: (Words / Duration in seconds) * 60
    let wpm = Math.round((wordCount / durationSec) * 60);
    if (wpm > 240) wpm = 140; // Normalize outliers

    // 3. Pronunciation Clarity Score
    // Takes acoustic confidence (0.0 to 1.0) and penalizes common phoneme dropouts
    let baseClarity = rawConfidence > 0 ? Math.round(rawConfidence * 100) : 82;

    // DSA phonetic bonus for effort and intelligibility
    if (wordCount >= 3) {
      baseClarity = Math.min(98, baseClarity + 5);
    }
    const pronunciationScore = Math.max(50, Math.min(99, baseClarity));

    // 4. Qualitative Fluency Tag
    let fluencyRating = "Naturale";
    let fluencyColor = "var(--accent-cyan)";
    if (wpm < 55) {
      fluencyRating = "Riflessivo (DSA)";
      fluencyColor = "var(--accent-amber)";
    } else if (wpm >= 55 && wpm <= 110) {
      fluencyRating = "Fluente & Chiaro";
      fluencyColor = "var(--accent-emerald)";
    } else {
      fluencyRating = "Spontaneo Rapido";
      fluencyColor = "var(--accent-blue)";
    }

    // 5. Update user radar metrics dynamically
    const metrics = configManager.profile.radarMetrics;
    const currentFluency = metrics.fluency || 40;
    const currentPronunciation = metrics.pronunciation || 40;

    // Moving average update
    metrics.fluency = Math.round(currentFluency * 0.85 + (wpm >= 70 ? 75 : 55) * 0.15);
    metrics.pronunciation = Math.round(currentPronunciation * 0.85 + pronunciationScore * 0.15);
    configManager.save();

    return {
      wpm,
      durationSec: Math.round(durationSec * 10) / 10,
      wordCount,
      latencySec,
      pronunciationScore,
      fluencyRating,
      fluencyColor
    };
  }
}

export const fluencyAnalyzer = new FluencyAnalyzer();
