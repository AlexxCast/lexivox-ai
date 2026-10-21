/**
 * LexiVox AI - Analytics, Progress Reports & Neuro-Adaptive Metrics
 * Generates Radar Chart, Detailed Periodic Reports, and Conquered Hurdles History.
 */

import { configManager } from './config.js';

class AnalyticsController {
  constructor() {
    this.container = null;
  }

  mount(container) {
    this.container = container;
    this.render();
  }

  render() {
    const profile = configManager.profile;
    const radar = profile.radarMetrics;
    const targetMin = profile.dailyTargetMinutes;
    const todayMin = Math.round(profile.todayMinutesStudied * 10) / 10;
    const totalMin = Math.round(profile.totalSpokenMinutes * 10) / 10;
    const streak = profile.streakDays;
    const conquered = profile.conqueredBottlenecks;

    this.container.innerHTML = `
      <div>
        <!-- Hero Stat Row -->
        <div class="grid-4" style="margin-bottom: 28px;">
          <div class="stat-box">
            <div class="stat-icon" style="color: var(--accent-cyan); background: rgba(6, 214, 160, 0.1);">🏆</div>
            <div>
              <div class="stat-value">${profile.currentLevel.split(' ')[0]}</div>
              <div class="stat-label">Livello CEFR Attuale</div>
            </div>
          </div>

          <div class="stat-box">
            <div class="stat-icon" style="color: var(--accent-amber); background: rgba(255, 190, 11, 0.1);">🔥</div>
            <div>
              <div class="stat-value">${streak} Giorni</div>
              <div class="stat-label">Serie Consecutiva (Streak)</div>
            </div>
          </div>

          <div class="stat-box">
            <div class="stat-icon" style="color: var(--accent-blue); background: rgba(58, 134, 255, 0.1);">⏱️</div>
            <div>
              <div class="stat-value">${totalMin} min</div>
              <div class="stat-label">Parlato Totale Registrato</div>
            </div>
          </div>

          <div class="stat-box">
            <div class="stat-icon" style="color: var(--accent-purple); background: rgba(131, 56, 236, 0.1);">⭐</div>
            <div>
              <div class="stat-value">${conquered.length}</div>
              <div class="stat-label">Ostacoli DSA Superati</div>
            </div>
          </div>
        </div>

        <div class="grid-2" style="margin-bottom: 28px;">
          <!-- Radar Chart Card -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">📊 Profilo di Competenza Parlata (5 Dimensioni)</h3>
            </div>
            <div style="display: flex; justify-content: center; align-items: center; padding: 10px 0;">
              <canvas id="competence-radar-canvas" width="340" height="340" style="max-width: 100%;"></canvas>
            </div>
            <p style="font-size: 13px; color: var(--text-muted); text-align: center; margin-top: 10px;">
              Il grafico si aggiorna dinamicamente in base alle tue risposte parlate e alle micro-lezioni superate.
            </p>
          </div>

          <!-- Periodic Qualitative Report -->
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">📝 Report Periodico di Apprendimento Adattivo</h3>
              <span class="user-level-pill">Target: ${profile.targetLevel.split(' ')[0]}</span>
            </div>

            <div style="display: flex; flex-direction: column; gap: 16px;">
              <!-- Improvements -->
              <div style="background: rgba(16, 185, 129, 0.1); border-left: 4px solid var(--accent-emerald); padding: 14px 18px; border-radius: 8px;">
                <h4 style="color: #6ee7b7; font-size: 15px; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                  <span>📈</span> Cosa è Migliorato:
                </h4>
                <ul style="font-size: 14px; color: var(--text-primary); padding-left: 20px; line-height: 1.6;">
                  <li><strong>Spontaneità Orale:</strong> Diminuzione del tempo di esitazione iniziale nel rispondere all'IA tutor.</li>
                  <li><strong>Comprensione Acustica:</strong> Maggiore precisione nel cogliere il senso globale delle frasi inglesi senza dover tradurre mentalmente.</li>
                  <li><strong>Autonomia DSA:</strong> Capacità di correggersi subito dopo la micro-lezione guidata.</li>
                </ul>
              </div>

              <!-- Next Focus -->
              <div style="background: rgba(255, 190, 11, 0.1); border-left: 4px solid var(--accent-amber); padding: 14px 18px; border-radius: 8px;">
                <h4 style="color: #fde047; font-size: 15px; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                  <span>🎯</span> Su Cosa Lavorare Prossimamente:
                </h4>
                <ul style="font-size: 14px; color: var(--text-primary); padding-left: 20px; line-height: 1.6;">
                  <li><strong>Verbi Irregolari al Passato:</strong> Sostituire spontaneamente forme come 'goed' o 'buyed' con 'went' e 'bought'.</li>
                  <li><strong>Preposizioni ON vs AT:</strong> Rafforzare l'associazione mentale dei giorni della settimana con 'ON'.</li>
                </ul>
              </div>

              <!-- DSA Coaching Tip -->
              <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); padding: 14px 18px; border-radius: 8px;">
                <h4 style="color: var(--accent-blue); font-size: 14px; margin-bottom: 4px;">💡 Consiglio del Tutor Neuro-Inclusivo:</h4>
                <p style="font-size: 13px; color: var(--text-secondary); line-height: 1.6;">
                  Mantieni i tuoi ${targetMin} minuti al giorno. Per la memoria di lavoro DSA, la ripetizione quotidiana a voce 
                  vale 10 volte più di una maratona di studio settimanale!
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Conquered Hurdles History -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">⭐ Storico Ostacoli Sconfitti & Padronanze Acquisite</h3>
          </div>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px;">
            ${conquered.map(item => `
              <div style="background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: 10px; padding: 16px; display: flex; align-items: center; gap: 12px;">
                <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(6, 214, 160, 0.15); color: var(--accent-cyan); display: flex; align-items: center; justify-content: center; font-size: 18px;">✓</div>
                <div>
                  <div style="font-size: 14px; font-weight: 700; color: var(--text-primary);">${item.label}</div>
                  <div style="font-size: 12px; color: var(--text-muted);">Data superamento: ${item.date}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    this.drawRadarChart();
  }

  drawRadarChart() {
    const canvas = this.container.querySelector('#competence-radar-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 110;

    const metrics = configManager.profile.radarMetrics;
    const labels = [
      { text: "Pronuncia", key: "pronunciation" },
      { text: "Fluidità", key: "fluency" },
      { text: "Vocabolario", key: "vocabulary" },
      { text: "Grammatica", key: "grammar" },
      { text: "Ascolto", key: "listening" }
    ];

    const numPoints = labels.length;
    const angleStep = (Math.PI * 2) / numPoints;

    ctx.clearRect(0, 0, width, height);

    // Draw concentric polygons (background grid)
    const levels = 4;
    for (let l = 1; l <= levels; l++) {
      const r = (radius / levels) * l;
      ctx.beginPath();
      for (let i = 0; i < numPoints; i++) {
        const angle = i * angleStep - Math.PI / 2;
        const x = centerX + Math.cos(angle) * r;
        const y = centerY + Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Draw axis lines and labels
    ctx.font = '12px Lexend, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < numPoints; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.stroke();

      // Label text
      const lx = centerX + Math.cos(angle) * (radius + 24);
      const ly = centerY + Math.sin(angle) * (radius + 24);
      ctx.fillStyle = '#a8b6d4';
      ctx.fillText(labels[i].text, lx, ly);
    }

    // Draw user data polygon
    ctx.beginPath();
    for (let i = 0; i < numPoints; i++) {
      const val = (metrics[labels[i].key] || 40) / 100;
      const r = radius * val;
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = 'rgba(58, 134, 255, 0.35)';
    ctx.fill();
    ctx.strokeStyle = '#3a86ff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Data points circles
    for (let i = 0; i < numPoints; i++) {
      const val = (metrics[labels[i].key] || 40) / 100;
      const r = radius * val;
      const angle = i * angleStep - Math.PI / 2;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#06d6a0';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }
}

export const analyticsController = new AnalyticsController();
