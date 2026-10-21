# 🗣️ LexiVox AI - English Spoken Fluency per DSA Grave & Dislessia

> **Applicazione Adattiva di Inglese Parlato basata su Intelligenza Artificiale per l'Apprendimento Rapido, Inclusivo e Senza Stress Visivo o Grammaticale.**

---

## 🌟 Principi di Progettazione per DSA Grave

L'approccio tradizionale scolastico basato su libri scritti e grammatica astratta fallisce drammaticamente con chi ha DSA grave (Dislessia, Disortografia, Disgrafia, ADHD). **LexiVox AI** ribalta completamente la metodologia:

1. **Canale Parlato First (Voice-First & Hands-Free)**: L'inglese viene appreso tramite memoria procedurale e acustica (come i bambini madrelingua), azzerando l'ansia da prestazione ortografica.
2. **Diagnosi Iniziale Multidimensionale**: Rileva il livello di partenza reale (Pre-A1 ➔ B2), stabilisce l'obiettivo (es. B1 Fluente) e calcola il tempo giornaliero obbligatorio (es. 25 min/giorno per 60 giorni).
3. **Loop di Correzione Mirata (Adaptive Micro-Lessons)**:
   - Se l'algoritmo rileva che commetti lo stesso errore (es. dimenticare la `-s` alla terza persona, scambiare i verbi irregolari o sbagliare preposizioni `in/on/at`), scatta una **Micro-Lezione Immediata**.
   - Spiegazione intuitiva in 2 righe (zero gergo noioso) + confronto sonoro.
   - **Sfida di Spontaneità**: 3 prove vocali veloci consecutive. Appena dimostri spontaneità, l'errore viene archiviato nei "Successi Conquistati" e si riprende la conversazione!
4. **Accessibilità Neuro-Inclusiva**:
   - Font ad alta leggibilità **Lexend** (studiato per ridurre il sovraffollamento visivo).
   - Spaziatura allargata tra lettere e parole (`dsa-wide-spacing`).
   - Filtro di contrasto anti-riflesso per la **Sindrome di Irlen** (Ambra calda, Verde tenue, Rosa riposante, Slate scuro).
   - **Righello Guida Visivo** che segue il cursore per non perdere il segno.
   - Sintesi vocale (TTS) sempre disponibile su ogni frase con opzione **0.85x** o **0.70x** (ascolto lento) e traduzione immediata in italiano.
5. **Costanza & Disciplina ("Tempo Congruo al Giorno")**:
   - Timer attivo di parlato reale che conteggia i minuti della sessione.
   - Daily Streak giornaliero per creare l'abitudine solida.
6. **Reportistica & Certificazione CEFR**:
   - Grafico a Radar a 5 Dimensioni (Pronuncia, Fluidità, Vocabolario, Grammatica, Ascolto).
   - Report qualitativo automatico su cosa è migliorato e su cosa concentrarsi.
   - **Certificato Ufficiale di Competenza Parlata** stampabile ed esportabile in PDF.

---

## 🚀 Come Avviare l'Applicazione

Il server locale è ultra-leggero e non necessita di installare né Node.js né Python (utilizza il motore nativo Windows PowerShell):

### Avvio Veloce:
1. Apri una finestra di PowerShell nella cartella `e:\aitech`.
2. Esegui il comando:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\start_server.ps1
   ```
3. Apri il browser all'indirizzo:
   👉 **`http://localhost:8085`**

---

## 🤖 Integrazione IA (Flessibile & Gratuita)

- **Modalità 1 (Pronta Subito)**: Simulatore Conversazionale Intelligente integrato con scenari realistici (Caffè e conversazione quotidiana, Viaggi/Aeroporto, Ristorante, ecc.). Funziona subito offline senza chiavi API o carte di credito.
- **Modalità 2 (Live AI Google Gemini o OpenAI)**: Nelle **Impostazioni Percorso** puoi inserire la tua chiave gratuita di Google Gemini (Gemini 1.5 Flash o Gemini 2.0) per sbloccare dialoghi orali infiniti e liberi con un prompt di sistema istruito specificamente per allievi con DSA.

---

## 📁 Struttura dei File

```
e:\aitech\
├── index.html                  # Interfaccia utente SPA accessibile
├── start_server.ps1            # Web server locale leggero PowerShell (porta 8085)
├── css/
│   ├── main.css                # Design system, colori riposanti, layout
│   ├── dsa-accessibility.css   # Righello guida, filtri Irlen, font Lexend
│   ├── components.css          # Card, stepper diagnostico, certificato CEFR
│   └── conversation.css        # Voice Orb pulsante, soundwave e micro-lezioni
└── js/
    ├── app.js                  # Controller centrale e navigazione
    ├── config.js               # Gestore stato, profilo utente, errori e streak
    ├── dsa-tools.js            # Motore TTS (voci native) e STT (microfono)
    ├── diagnostic.js           # Diagnosi iniziale guidata A0-B2 e calcolo piano
    ├── error-tracker.js        # Rilevatore pattern di errore per allievi italiani/DSA
    ├── micro-lessons.js        # Sblocco ostacoli con 3 prove di spontaneità
    ├── live-dialogue.js        # Canale vocale continuo e timer di studio
    ├── ai-service.js           # Scenari contestuali + connettore Gemini/OpenAI
    ├── analytics.js            # Radar chart 5D e report periodici
    └── certificate.js          # Generatore certificato ufficiale stampabile
```
