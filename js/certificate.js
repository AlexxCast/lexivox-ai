/**
 * LexiVox AI - Official Spoken Language Proficiency Certificate Engine
 * Generates an official, printable/exportable CEFR certificate validating conversational skills.
 */

import { configManager } from './config.js';

class CertificateController {
  constructor() {
    this.container = null;
  }

  mount(container) {
    this.container = container;
    this.render();
  }

  render() {
    const profile = configManager.profile;
    const certCode = 'LVX-' + new Date().getFullYear() + '-DSA-' + Math.floor(10000 + Math.random() * 90000);
    const currentDate = new Date().toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' });
    const levelName = profile.currentLevel;
    const totalHours = Math.max(1, Math.round((profile.totalSpokenMinutes / 60) * 10) / 10);

    this.container.innerHTML = `
      <div style="max-width: 900px; margin: 0 auto;">
        <!-- Top Toolbar -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
          <div>
            <h2 style="font-family: var(--font-heading); font-size: 24px; color: var(--text-primary);">
              Certificazione di Livello Linguistico Parlato
            </h2>
            <p style="color: var(--text-muted); font-size: 14px;">
              Attestato di competenza vocale e spontaneità comunicativa CEFR.
            </p>
          </div>

          <div style="display: flex; gap: 12px;">
            <button id="btn-edit-student-name" class="btn btn-secondary">
              ✏️ Modifica Nome
            </button>
            <button id="btn-print-certificate" class="btn btn-primary">
              🖨️ Stampa o Salva PDF
            </button>
          </div>
        </div>

        <!-- Certificate Viewport -->
        <div class="certificate-preview-wrapper">
          <div class="certificate-paper" id="printable-certificate">
            <div class="cert-inner-border">
              <div class="cert-title-top">LEXIVOX NEURO-INCLUSIVE LANGUAGE ACADEMY</div>
              <h1 class="cert-main-title">CERTIFICATE OF SPOKEN ENGLISH PROFICIENCY</h1>
              <p style="font-size: 13px; color: #4a5568; letter-spacing: 0.1em; text-transform: uppercase;">
                Common European Framework of Reference for Languages (CEFR)
              </p>

              <div style="margin: 28px 0 12px;">
                <p style="font-size: 14px; color: #718096; font-style: italic;">Si certifica con la presente che</p>
                <div class="cert-recipient-name" id="cert-user-name">${profile.userName || 'Studente'}</div>
                <p style="font-size: 14px; color: #718096; font-style: italic;">ha completato con successo il percorso intensivo di conversazione parlata</p>
              </div>

              <div style="background: #edf2f7; border: 1px solid #cbd5e0; border-radius: 10px; padding: 18px 24px; max-width: 620px; margin: 0 auto 24px;">
                <div style="font-size: 12px; font-weight: 700; color: #718096; text-transform: uppercase; margin-bottom: 4px;">
                  Livello Certificato Raggiunto
                </div>
                <div style="font-size: 26px; font-weight: 800; color: #2b6cb0;">
                  ${levelName}
                </div>
                <div style="font-size: 13px; color: #4a5568; margin-top: 4px;">
                  Valutazione basata su fluidità orale, pronuncia fonetica e reazione spontanea a stimoli in lingua.
                </div>
              </div>

              <div class="cert-badge-row">
                <div class="cert-score-pill">🗣️ Parlato: <strong>${totalHours} Ore Registrate</strong></div>
                <div class="cert-score-pill">⭐ Ostacoli Superati: <strong>${profile.conqueredBottlenecks.length}</strong></div>
                <div class="cert-score-pill">📅 Rilasciato: <strong>${currentDate}</strong></div>
              </div>

              <!-- Footer with Signatures & Seal -->
              <div class="cert-footer-row">
                <div class="cert-sign-block">
                  <div class="cert-signature">LexiVox AI Tutor</div>
                  <div style="font-size: 12px; color: #718096; border-top: 1px solid #a0aec0; padding-top: 4px;">
                    Pedagogical AI Lead
                  </div>
                </div>

                <div class="cert-gold-seal">
                  ★
                </div>

                <div class="cert-sign-block" style="text-align: right;">
                  <div style="font-family: monospace; font-size: 12px; font-weight: 700; color: #4a5568; margin-bottom: 4px;">
                    ID: ${certCode}
                  </div>
                  <div style="font-size: 12px; color: #718096; border-top: 1px solid #a0aec0; padding-top: 4px;">
                    Certificato Verificato CEFR
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const printBtn = this.container.querySelector('#btn-print-certificate');
    const editBtn = this.container.querySelector('#btn-edit-student-name');

    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    if (editBtn) {
      editBtn.addEventListener('click', () => {
        const cur = configManager.profile.userName || 'Studente';
        const newName = prompt('Inserisci il nome e cognome da mostrare sul certificato:', cur);
        if (newName && newName.trim()) {
          configManager.profile.userName = newName.trim();
          configManager.save();
          this.render();
        }
      });
    }
  }
}

export const certificateController = new CertificateController();
