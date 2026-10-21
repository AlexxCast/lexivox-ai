/**
 * LexiVox AI - Mobile Notifications & PWA Installation Engine
 * Manages daily study reminders, lock-screen notifications, and mobile homescreen install prompt.
 */

import { configManager } from './config.js';

class NotificationService {
  constructor() {
    this.deferredPrompt = null;
    this.hasPermission = false;
    this.init();
  }

  async init() {
    // 1. Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.register('./sw.js');
        console.log('ServiceWorker registrato con successo:', reg.scope);
        // Ensure browser fetches the latest version immediately
        reg.update();
      } catch (err) {
        console.warn('Registrazione ServiceWorker fallita:', err);
      }
    }

    // 2. Check current notification status
    if ('Notification' in window) {
      this.hasPermission = Notification.permission === 'granted';
    }

    // 3. Catch PWA Install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallBanner();
    });
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      alert('Il tuo browser o dispositivo non supporta le notifiche di sistema.');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.hasPermission = permission === 'granted';
      if (this.hasPermission) {
        this.sendImmediateNotification(
          '🎉 Notifiche Attivate con Successo!',
          'Ti ricorderemo ogni giorno di dedicare i tuoi minuti di inglese parlato per non perdere il ritmo.'
        );
      }
      return this.hasPermission;
    } catch (err) {
      console.warn('Errore richiesta permessi notifica:', err);
      return false;
    }
  }

  sendImmediateNotification(title, body) {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SEND_NOTIFICATION',
        title,
        body
      });
    } else if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: 'assets/icon-192.svg',
        vibrate: [200, 100, 200]
      });
    }
  }

  showInstallBanner() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
      banner.style.display = 'flex';
      const btn = document.getElementById('btn-pwa-install');
      if (btn) {
        btn.onclick = async () => {
          if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            const { outcome } = await this.deferredPrompt.userChoice;
            console.log('PWA prompt outcome:', outcome);
            this.deferredPrompt = null;
            banner.style.display = 'none';
          }
        };
      }
    }
  }

  scheduleDailyCheck() {
    // Checks every 15 minutes if daily goal is not reached and sends a gentle habit reminder
    setInterval(() => {
      const profile = configManager.profile;
      const done = profile.todayMinutesStudied || 0;
      const target = profile.dailyTargetMinutes || 25;
      const curHour = new Date().getHours();

      // If after 17:00 and user has completed less than 50% of daily goal
      if (curHour >= 17 && done < (target / 2) && this.hasPermission) {
        const lastNotified = localStorage.getItem('lexivox_last_reminder');
        const today = new Date().toISOString().split('T')[0];
        
        if (lastNotified !== today) {
          localStorage.setItem('lexivox_last_reminder', today);
          this.sendImmediateNotification(
            `🔥 Non perdere la tua serie (${profile.streakDays} giorni)!`,
            `Oggi hai parlato solo per ${Math.round(done)} minuti. Bastano altri ${Math.round(target - done)} minuti per consolidare la tua memoria DSA!`
          );
        }
      }
    }, 15 * 60 * 1000);
  }
}

export const notificationService = new NotificationService();
