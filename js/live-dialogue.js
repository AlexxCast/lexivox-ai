/**
 * LexiVox AI - Live Spoken Dialogue Controller
 * Manages Voice Orb, Real-time Speech-to-Text, Conversational Flow,
 * Adaptive Micro-Lesson Interceptions, and Daily Active Speaking Timer.
 */

import { aiService } from './ai-service.js';
import { dsaTools } from './dsa-tools.js';
import { errorTracker } from './error-tracker.js';
import { microLessonManager } from './micro-lessons.js';
import { configManager } from './config.js';
import { fluencyAnalyzer } from './fluency-analyzer.js';

class LiveDialogueController {
  constructor() {
    this.container = null;
    this.sessionTimerInterval = null;
    this.isSessionActive = false;
    this.sessionSeconds = 0;
  }

  mount(container) {
    this.container = container;
    this.render();
    this.bindEvents();
    this.startSessionTimer();
    this.setupErrorInterceptor();

    // Auto-send initial scenario greeting if empty
    setTimeout(() => {
      const messagesScroll = this.container.querySelector('#chat-messages-scroll');
      if (messagesScroll && messagesScroll.children.length === 0) {
        const greeting = aiService.getInitialGreeting();
        this.appendMessage('ai', greeting.en, greeting.it);
      }
    }, 400);
  }

  setupErrorInterceptor() {
    errorTracker.setTriggerCallback((errorKey) => {
      // Pause speech and launch targeted micro-lesson modal
      dsaTools.stopAudio();
      dsaTools.stopListening();
      this.updateVoiceOrbState('idle');

      microLessonManager.launch(errorKey, () => {
        // Callback after mastery achieved
        this.updateErrorSidebar();
        // Prompt AI to resume conversation smoothly
        this.appendMessage('ai', "Awesome work! Let's get right back to our conversation. What else were you saying?", "Ottimo lavoro! Torniamo subito alla nostra conversazione. Cos'altro stavi dicendo?");
      });
    });
  }

  render() {
    const scenarios = aiService.getAvailableScenarios();
    const curLevel = configManager.profile.currentLevel;
    const targetMin = configManager.profile.dailyTargetMinutes;
    const todayMin = Math.round(configManager.profile.todayMinutesStudied);

    this.container.innerHTML = `
      <div class="conversation-layout">
        <!-- Main Chat Area -->
        <div class="chat-stage-card">
          <!-- Chat Header -->
          <div class="chat-stage-header">
            <div class="scenario-badge">
              <span>🎭 Scenario:</span>
              <select id="scenario-selector">
                ${scenarios.map(s => `<option value="${s.key}" ${s.key === aiService.currentScenarioKey ? 'selected' : ''}>${s.name}</option>`).join('')}
              </select>
            </div>

            <div class="live-channel-status">
              <div id="live-status-dot" class="status-dot"></div>
              <span id="live-status-text">Canale Vocale Attivo</span>
            </div>
          </div>

          <!-- Messages Stream -->
          <div class="chat-messages-scroll" id="chat-messages-scroll">
            <!-- Dynamic bubbles injected here -->
          </div>

          <!-- Interim Speech Feedback Indicator -->
          <div id="live-stream-feedback" class="live-stream-feedback"></div>

          <!-- Voice Console Footer -->
          <div class="voice-console">
            <!-- Glowing Voice Orb -->
            <div class="voice-orb-wrapper">
              <button id="btn-voice-orb" class="voice-orb-btn" title="Premi per parlare ad alta voce">
                🎙️
              </button>
              <div class="sound-ripple"></div>
              <div class="sound-ripple"></div>
              <div class="sound-ripple"></div>
            </div>

            <!-- Fallback Text Input & Status -->
            <div class="console-content">
              <div class="console-status-text" id="console-status-text">
                👉 Tocca il microfono e parla in inglese senza timore
              </div>
              <div class="console-input-row">
                <input type="text" id="console-fallback-input" class="console-text-input" placeholder="Oppure scrivi qui se non puoi usare il microfono..." />
                <button id="btn-send-text" class="btn-send-msg" title="Invia messaggio">➤</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Sidebar: Live Adaptation & Daily Timer -->
        <div class="conversation-sidebar">
          <!-- Daily Time Tracker Card -->
          <div class="live-metric-card">
            <div class="live-metric-title">
              <span>⏱️ Obiettivo del Giorno</span>
              <span id="timer-target-label">${todayMin} / ${targetMin} min</span>
            </div>
            
            <div class="daily-timer-box">
              <div class="timer-circle-wrap">
                <svg class="timer-svg" viewBox="0 0 72 72">
                  <defs>
                    <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#3a86ff" />
                      <stop offset="100%" stop-color="#06d6a0" />
                    </linearGradient>
                  </defs>
                  <circle class="timer-circle-bg" cx="36" cy="36" r="30" />
                  <circle id="timer-progress-circle" class="timer-circle-val" cx="36" cy="36" r="30" />
                </svg>
                <div class="timer-center-text" id="timer-percentage-text">0%</div>
              </div>

              <div class="timer-info-text">
                <h4 id="daily-timer-status">Pratica in corso</h4>
                <p>Ogni minuto a voce allena la tua memoria procedurale DSA.</p>
              </div>
            </div>
          </div>

          <!-- Real-time Active Issues Monitored -->
          <div class="live-metric-card">
            <div class="live-metric-title">
              <span>🎯 Radar Errori & Adattamento</span>
              <span style="font-size: 11px; color: var(--accent-cyan); font-weight: 600;">Monitor Live</span>
            </div>
            <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">
              L'IA rileva se ripeti errori. Al 2° errore scatta lo sblocco guidato!
            </p>

            <div class="error-monitor-list" id="error-monitor-list">
              <!-- Dynamically populated -->
            </div>
          </div>

          <!-- Quick Audio Control Card -->
          <div class="live-metric-card">
            <div class="live-metric-title">
              <span>🔊 Assistente Vocale</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 14px;">
                <span>Velocità Voce:</span>
                <select id="audio-speed-select" style="background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-subtle); padding: 4px 8px; border-radius: 6px;">
                  <option value="0.75">0.75x (Molto Lento)</option>
                  <option value="0.85" selected>0.85x (DSA Consigliato)</option>
                  <option value="1.0">1.0x (Naturale)</option>
                </select>
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; font-size: 14px;">
                <span>Auto-riproduzione:</span>
                <input type="checkbox" id="check-auto-read" checked style="width: 18px; height: 18px; cursor: pointer;" />
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.updateDailyTimerDisplay();
    this.updateErrorSidebar();
  }

  bindEvents() {
    const orbBtn = this.container.querySelector('#btn-voice-orb');
    const sendBtn = this.container.querySelector('#btn-send-text');
    const textInput = this.container.querySelector('#console-fallback-input');
    const scenarioSelector = this.container.querySelector('#scenario-selector');
    const speedSelect = this.container.querySelector('#audio-speed-select');
    const autoReadCheck = this.container.querySelector('#check-auto-read');

    // Voice Orb Click
    if (orbBtn) {
      orbBtn.addEventListener('click', () => {
        if (dsaTools.isListening) {
          dsaTools.stopListening();
          this.updateVoiceOrbState('idle');
        } else {
          this.startVoiceInput();
        }
      });
    }

    // Fallback Text Send
    if (sendBtn && textInput) {
      sendBtn.addEventListener('click', () => this.handleTextSubmit());
      textInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.handleTextSubmit();
      });
    }

    // Scenario switch
    if (scenarioSelector) {
      scenarioSelector.addEventListener('change', (e) => {
        aiService.setScenario(e.target.value);
        const messagesScroll = this.container.querySelector('#chat-messages-scroll');
        if (messagesScroll) messagesScroll.innerHTML = '';
        const greeting = aiService.getInitialGreeting();
        this.appendMessage('ai', greeting.en, greeting.it);
      });
    }

    // Speed change
    if (speedSelect) {
      speedSelect.value = configManager.profile.a11y.audioSpeed || 0.85;
      speedSelect.addEventListener('change', (e) => {
        dsaTools.setAudioSpeed(e.target.value);
      });
    }

    // Auto-read toggle
    if (autoReadCheck) {
      autoReadCheck.checked = configManager.profile.a11y.autoReadIncoming !== false;
      autoReadCheck.addEventListener('change', (e) => {
        configManager.profile.a11y.autoReadIncoming = e.target.checked;
        configManager.save();
      });
    }
  }

  startVoiceInput() {
    this.updateVoiceOrbState('listening');
    fluencyAnalyzer.startSpeechSession();
    const interimFeedback = this.container.querySelector('#live-stream-feedback');

    dsaTools.startListening(
      (finalText) => {
        this.updateVoiceOrbState('idle');
        if (interimFeedback) interimFeedback.textContent = '';
        if (finalText) {
          const stats = fluencyAnalyzer.analyzeUtterance(finalText);
          this.handleUserUtterance(finalText, stats);
        }
      },
      (interimText) => {
        if (interimFeedback) interimFeedback.textContent = `Sto ascoltando: "${interimText}"...`;
      },
      (err) => {
        this.updateVoiceOrbState('idle');
        if (interimFeedback) interimFeedback.textContent = 'Non ho udito chiaramente. Riprova quando vuoi!';
      },
      () => {
        this.updateVoiceOrbState('idle');
      }
    );
  }

  updateVoiceOrbState(state) {
    const orbBtn = this.container.querySelector('#btn-voice-orb');
    const statusDot = this.container.querySelector('#live-status-dot');
    const statusText = this.container.querySelector('#live-status-text');
    const consoleText = this.container.querySelector('#console-status-text');

    if (!orbBtn) return;

    if (state === 'listening') {
      orbBtn.classList.add('recording');
      if (statusDot) statusDot.className = 'status-dot listening';
      if (statusText) statusText.textContent = 'Ascolto la tua voce...';
      if (consoleText) consoleText.innerHTML = '🎤 <strong>Ti sto ascoltando:</strong> parla spontaneamente in inglese...';
    } else if (state === 'speaking') {
      orbBtn.classList.remove('recording');
      if (statusDot) statusDot.className = 'status-dot speaking';
      if (statusText) statusText.textContent = 'IA Tutor sta parlando...';
      if (consoleText) consoleText.textContent = '🔊 Ascolta la pronuncia con attenzione...';
    } else {
      orbBtn.classList.remove('recording');
      if (statusDot) statusDot.className = 'status-dot';
      if (statusText) statusText.textContent = 'Canale Vocale Pronto';
      if (consoleText) consoleText.textContent = '👉 Tocca il microfono o rispondi a voce';
    }
  }

  async handleUserUtterance(text, fluencyStats = null) {
    // 1. Append User Message Bubble with Fluency & Pronunciation stats
    this.appendMessage('user', text, null, fluencyStats);

    // 2. Real-time Linguistic / Error Analysis
    const errors = errorTracker.analyzeUserUtterance(text);
    this.updateErrorSidebar();

    // 3. Show "Thinking" feedback
    this.updateVoiceOrbState('speaking');
    const aiResponse = await aiService.generateResponse(text);

    // 4. Append AI Message Bubble
    this.appendMessage('ai', aiResponse.en, aiResponse.it);
  }

  handleTextSubmit() {
    const input = this.container.querySelector('#console-fallback-input');
    if (!input || !input.value.trim()) return;
    const text = input.value.trim();
    input.value = '';
    const stats = fluencyAnalyzer.analyzeUtterance(text);
    this.handleUserUtterance(text, stats);
  }

  appendMessage(sender, enText, itText = null, fluencyStats = null) {
    const messagesScroll = this.container.querySelector('#chat-messages-scroll');
    if (!messagesScroll) return;

    const row = document.createElement('div');
    row.className = `message-row ${sender}`;

    const uniqueId = 'msg-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

    let toolsHtml = '';
    if (sender === 'ai') {
      toolsHtml = `
        <div class="msg-tools">
          <button class="tool-chip-btn btn-play-msg" data-text="${encodeURIComponent(enText)}" data-speed="0.85">
            🔊 Ascolta (0.85x)
          </button>
          <button class="tool-chip-btn btn-play-slow" data-text="${encodeURIComponent(enText)}" data-speed="0.70">
            🐢 Lento (0.70x)
          </button>
          ${itText ? `
            <button class="tool-chip-btn btn-toggle-it" data-target="${uniqueId}">
              🇮🇹 Spiegami in Italiano
            </button>
          ` : ''}
        </div>
        ${itText ? `<div id="${uniqueId}" class="translation-box">${itText}</div>` : ''}
      `;
    } else if (sender === 'user' && fluencyStats) {
      toolsHtml = `
        <div class="user-fluency-badge" style="display: flex; align-items: center; gap: 10px; margin-top: 6px; font-size: 11px; color: var(--text-muted); background: rgba(0,0,0,0.25); padding: 4px 10px; border-radius: var(--radius-full);">
          <span>⚡ <strong>${fluencyStats.wpm} WPM</strong></span>
          <span>•</span>
          <span>🎯 Pronuncia: <strong style="color: #6ee7b7;">${fluencyStats.pronunciationScore}%</strong></span>
          <span>•</span>
          <span>⏱️ Reazione: <strong>${fluencyStats.latencySec}s</strong></span>
          <span style="color: ${fluencyStats.fluencyColor}; font-weight: 700; margin-left: auto;">${fluencyStats.fluencyRating}</span>
        </div>
      `;
    }

    row.innerHTML = `
      <div class="msg-avatar">${sender === 'ai' ? '🤖' : '👤'}</div>
      <div class="msg-body">
        <div class="msg-content speakable-text">
          ${enText}
        </div>
        ${toolsHtml}
      </div>
    `;

    messagesScroll.appendChild(row);
    messagesScroll.scrollTop = messagesScroll.scrollHeight;

    // Attach listeners for tools
    if (sender === 'ai') {
      const playBtn = row.querySelector('.btn-play-msg');
      const slowBtn = row.querySelector('.btn-play-slow');
      const itBtn = row.querySelector('.btn-toggle-it');

      if (playBtn) {
        playBtn.addEventListener('click', () => {
          dsaTools.speakEnglish(enText, 0.85, () => this.updateVoiceOrbState('speaking'), () => {
            this.updateVoiceOrbState('idle');
            fluencyAnalyzer.notifyAiFinishedSpeaking();
          });
        });
      }

      if (slowBtn) {
        slowBtn.addEventListener('click', () => {
          dsaTools.speakEnglish(enText, 0.70, () => this.updateVoiceOrbState('speaking'), () => {
            this.updateVoiceOrbState('idle');
            fluencyAnalyzer.notifyAiFinishedSpeaking();
          });
        });
      }

      if (itBtn) {
        itBtn.addEventListener('click', () => {
          const transBox = row.querySelector(`#${uniqueId}`);
          if (transBox) {
            transBox.classList.toggle('visible');
            if (transBox.classList.contains('visible')) {
              dsaTools.speakItalian(itText);
            }
          }
        });
      }

      // Auto-speak if setting is enabled
      if (configManager.profile.a11y.autoReadIncoming !== false) {
        dsaTools.speakEnglish(enText, configManager.profile.a11y.audioSpeed || 0.85, 
          () => this.updateVoiceOrbState('speaking'),
          () => {
            this.updateVoiceOrbState('idle');
            fluencyAnalyzer.notifyAiFinishedSpeaking();
          }
        );
      } else {
        fluencyAnalyzer.notifyAiFinishedSpeaking();
      }
    }
  }

  startSessionTimer() {
    if (this.sessionTimerInterval) clearInterval(this.sessionTimerInterval);

    this.sessionTimerInterval = setInterval(() => {
      // Accumulate study seconds while page is active
      this.sessionSeconds += 1;
      if (this.sessionSeconds % 30 === 0) {
        configManager.addStudyTime(30);
        this.updateDailyTimerDisplay();
      }
    }, 1000);
  }

  updateDailyTimerDisplay() {
    const target = configManager.profile.dailyTargetMinutes || 25;
    const studied = configManager.profile.todayMinutesStudied || 0;
    const pct = Math.min(100, Math.round((studied / target) * 100));

    const targetLabel = this.container?.querySelector('#timer-target-label');
    const pctText = this.container?.querySelector('#timer-percentage-text');
    const progressCircle = this.container?.querySelector('#timer-progress-circle');
    const statusText = this.container?.querySelector('#daily-timer-status');

    if (targetLabel) targetLabel.textContent = `${Math.round(studied)} / ${target} min`;
    if (pctText) pctText.textContent = `${pct}%`;

    if (progressCircle) {
      // Circle radius 30 -> circumference = 2 * PI * 30 ≈ 188.5
      const offset = 188.5 - (188.5 * (pct / 100));
      progressCircle.style.strokeDashoffset = offset;
    }

    if (statusText) {
      if (pct >= 100) {
        statusText.textContent = '🎉 Obiettivo Oggi Raggiunto!';
        statusText.style.color = 'var(--accent-cyan)';
      } else {
        statusText.textContent = `Mancano ${Math.max(1, Math.round(target - studied))} min al target`;
      }
    }
  }

  updateErrorSidebar() {
    const listEl = this.container?.querySelector('#error-monitor-list');
    if (!listEl) return;

    const issues = errorTracker.getActiveIssues();
    if (issues.length === 0) {
      listEl.innerHTML = `
        <div style="font-size: 13px; color: var(--accent-cyan); text-align: center; padding: 12px; background: rgba(6, 214, 160, 0.08); border-radius: 8px;">
          ✨ Nessun errore frequente rilevato finora. Ottima fluidità!
        </div>
      `;
      return;
    }

    listEl.innerHTML = issues.map(item => `
      <div class="error-tag-item ${item.count >= 2 ? 'high-priority' : ''}">
        <span class="error-tag-name">${item.label}</span>
        <span class="error-tag-count">${item.count} occorrenze</span>
      </div>
    `).join('');
  }

  destroy() {
    if (this.sessionTimerInterval) clearInterval(this.sessionTimerInterval);
    dsaTools.stopAudio();
    dsaTools.stopListening();
  }
}

export const liveDialogueController = new LiveDialogueController();
