/**
 * LexiVox AI - Main Application Controller
 * Coordinates Views, Navigation, Accessibility Modals, and State Lifecycles.
 */

import { configManager } from './config.js';
import { dsaTools } from './dsa-tools.js';
import { diagnosticEngine } from './diagnostic.js';
import { liveDialogueController } from './live-dialogue.js';
import { analyticsController } from './analytics.js';
import { certificateController } from './certificate.js';
import { microLessonManager } from './micro-lessons.js';
import { notificationService } from './notifications.js';

class AppController {
  constructor() {
    this.currentView = 'view-live-dialogue';
  }

  init() {
    // Check if initial diagnostic was completed
    if (!configManager.profile.diagnosticCompleted) {
      this.currentView = 'view-diagnostic';
    }

    this.initMicroLessonModal();
    this.initNavigation();
    this.initAccessibilityModal();
    this.initSettingsModal();
    this.initNotificationButton();
    this.updateSidebarStats();
    notificationService.scheduleDailyCheck();

    // Custom navigation events
    window.addEventListener('navigate-to-view', (e) => {
      const viewId = `view-${e.detail.view}`;
      this.switchView(viewId);
    });

    // Mount initial view
    this.switchView(this.currentView);
  }

  initMicroLessonModal() {
    const modal = document.getElementById('micro-lesson-modal-overlay');
    if (modal) {
      microLessonManager.init(modal);
    }
  }

  initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sidebar = document.querySelector('.app-sidebar');
    const toggleSidebarBtn = document.getElementById('btn-toggle-sidebar');

    if (toggleSidebarBtn && sidebar) {
      toggleSidebarBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('mobile-open');
      });

      document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && e.target !== toggleSidebarBtn) {
          sidebar.classList.remove('mobile-open');
        }
      });
    }

    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetView = btn.getAttribute('data-view');
        if (targetView) {
          this.switchView(targetView);
          if (sidebar) sidebar.classList.remove('mobile-open');
        }
      });
    });
  }

  initNotificationButton() {
    const btn = document.getElementById('btn-toggle-notifications');
    if (btn) {
      btn.addEventListener('click', async () => {
        const granted = await notificationService.requestPermission();
        if (granted) {
          btn.style.background = 'rgba(6, 214, 160, 0.2)';
          btn.style.color = 'var(--accent-cyan)';
          btn.style.borderColor = 'rgba(6, 214, 160, 0.5)';
          btn.innerHTML = '<span>🔔</span> Notifiche Attive ✓';
        }
      });
    }
  }

  switchView(viewId) {
    this.currentView = viewId;

    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(b => {
      if (b.getAttribute('data-view') === viewId) b.classList.add('active');
      else b.classList.remove('active');
    });

    // Update view panels
    document.querySelectorAll('.view-panel').forEach(panel => {
      panel.classList.remove('active');
    });

    const activePanel = document.getElementById(viewId);
    if (!activePanel) return;

    activePanel.classList.add('active');

    // Update Header Title
    const titleEl = document.getElementById('page-header-title');
    if (titleEl) {
      switch (viewId) {
        case 'view-diagnostic':
          titleEl.textContent = '🩺 Diagnosi Iniziale & Obiettivo Personalizzato';
          break;
        case 'view-live-dialogue':
          titleEl.textContent = '🎙️ Canale Vocale Live (Conversazione & Sblocco Adattivo)';
          break;
        case 'view-analytics':
          titleEl.textContent = '📊 Report Periodico & Monitoraggio Apprendimento';
          break;
        case 'view-certificate':
          titleEl.textContent = '🎓 Certificato Ufficiale di Competenza Parlata';
          break;
      }
    }

    // Mount view components
    if (viewId === 'view-diagnostic') {
      diagnosticEngine.renderStep(activePanel);
    } else if (viewId === 'view-live-dialogue') {
      liveDialogueController.mount(activePanel);
    } else if (viewId === 'view-analytics') {
      analyticsController.mount(activePanel);
    } else if (viewId === 'view-certificate') {
      certificateController.mount(activePanel);
    }

    this.updateSidebarStats();
  }

  updateSidebarStats() {
    const streakEl = document.getElementById('sidebar-streak-count');
    const fillEl = document.getElementById('sidebar-streak-fill');
    const levelEl = document.getElementById('header-user-level');

    if (streakEl) streakEl.textContent = `${configManager.profile.streakDays} gg`;
    
    if (fillEl) {
      const target = configManager.profile.dailyTargetMinutes || 25;
      const done = configManager.profile.todayMinutesStudied || 0;
      const pct = Math.min(100, Math.round((done / target) * 100));
      fillEl.style.width = `${pct}%`;
    }

    if (levelEl) {
      levelEl.textContent = `Livello: ${configManager.profile.currentLevel.split(' ')[0]}`;
    }
  }

  /* ---------------- Accessibility Modal & Controls ---------------- */
  initAccessibilityModal() {
    const openBtn = document.getElementById('btn-open-a11y-modal');
    const modalBackdrop = document.getElementById('a11y-modal-backdrop');
    const closeBtn = document.getElementById('btn-close-a11y-modal');

    if (openBtn && modalBackdrop) {
      openBtn.addEventListener('click', () => {
        modalBackdrop.classList.add('open');
      });
    }

    if (closeBtn && modalBackdrop) {
      closeBtn.addEventListener('click', () => {
        modalBackdrop.classList.remove('open');
      });
    }

    // Font size pill buttons
    document.querySelectorAll('[data-font-size]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-font-size]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        dsaTools.setFontSize(btn.getAttribute('data-font-size'));
      });
    });

    // Theme mode buttons
    document.querySelectorAll('[data-set-theme]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-set-theme]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        dsaTools.setTheme(btn.getAttribute('data-set-theme'));
      });
    });

    // Color Tint buttons
    document.querySelectorAll('[data-screen-tint]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-screen-tint]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        dsaTools.setScreenTint(btn.getAttribute('data-screen-tint'));
      });
    });

    // Wide spacing switch
    const spacingSwitch = document.getElementById('switch-wide-spacing');
    if (spacingSwitch) {
      spacingSwitch.checked = configManager.profile.a11y.wideSpacing !== false;
      spacingSwitch.addEventListener('change', (e) => {
        dsaTools.toggleWideSpacing(e.target.checked);
      });
    }

    // Reading ruler switch
    const rulerSwitch = document.getElementById('switch-reading-ruler');
    if (rulerSwitch) {
      rulerSwitch.checked = configManager.profile.a11y.readingRuler === true;
      rulerSwitch.addEventListener('change', (e) => {
        dsaTools.toggleReadingRuler(e.target.checked);
      });
    }
  }

  /* ---------------- Settings & AI API Modal ---------------- */
  initSettingsModal() {
    const openBtn = document.getElementById('btn-open-settings-modal');
    const modalBackdrop = document.getElementById('settings-modal-backdrop');
    const closeBtn = document.getElementById('btn-close-settings-modal');
    const saveBtn = document.getElementById('btn-save-settings');

    if (openBtn && modalBackdrop) {
      openBtn.addEventListener('click', () => {
        const ai = configManager.profile.aiConfig;
        const providerSel = document.getElementById('setting-ai-provider');
        const geminiInput = document.getElementById('setting-gemini-key');
        const dailyTargetInput = document.getElementById('setting-daily-target');
        const studentNameInput = document.getElementById('setting-student-name');

        if (providerSel) providerSel.value = ai.provider || 'local';
        if (geminiInput) geminiInput.value = ai.geminiKey || '';
        if (dailyTargetInput) dailyTargetInput.value = configManager.profile.dailyTargetMinutes || 25;
        if (studentNameInput) studentNameInput.value = configManager.profile.userName || 'Studente';

        modalBackdrop.classList.add('open');
      });
    }

    if (closeBtn && modalBackdrop) {
      closeBtn.addEventListener('click', () => {
        modalBackdrop.classList.remove('open');
      });
    }

    if (saveBtn && modalBackdrop) {
      saveBtn.addEventListener('click', () => {
        const providerSel = document.getElementById('setting-ai-provider');
        const geminiInput = document.getElementById('setting-gemini-key');
        const dailyTargetInput = document.getElementById('setting-daily-target');
        const studentNameInput = document.getElementById('setting-student-name');

        if (providerSel) configManager.profile.aiConfig.provider = providerSel.value;
        if (geminiInput) configManager.profile.aiConfig.geminiKey = geminiInput.value.trim();
        if (dailyTargetInput) configManager.profile.dailyTargetMinutes = parseInt(dailyTargetInput.value, 10) || 25;
        if (studentNameInput) configManager.profile.userName = studentNameInput.value.trim() || 'Studente';

        configManager.save();
        modalBackdrop.classList.remove('open');
        this.updateSidebarStats();

        // Refresh live timer if dialogue view is open
        if (this.currentView === 'view-live-dialogue') {
          liveDialogueController.updateDailyTimerDisplay();
        }
      });
    }
  }
}

// Global initialization on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new AppController();
  app.init();
});
