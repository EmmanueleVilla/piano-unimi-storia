# Compilatore Piano di Studi — Corso di Laurea in Storia (L-42)

Un'applicazione web client-side semplice, veloce e interattiva per la compilazione guidata del piano di studi del Corso di Laurea in Storia (Classe L-42).

---

## 📖 Come Usare l'Applicazione

1. **Seleziona il Percorso del 3° Anno**:
   All'inizio della pagina, scegli il tuo percorso di specializzazione per il terzo anno tra:
   - 🏛️ *Età Antica*
   - 🏰 *Età Medievale*
   - 📜 *Età Moderna*
   - 🏙️ *Età Contemporanea*
   
   *La scelta del percorso aggiornerà automaticamente le tabelle degli insegnamenti per il 3° anno.*

2. **Seleziona gli Insegnamenti**:
   - Scorri le tabelle delle attività formative per il **2° Anno** e il **3° Anno**.
   - Clicca sulle caselle di spunta per selezionare o deselezionare gli esami desiderati.
   - Ogni tabella mostra in tempo reale i crediti (CFU) selezionati rispetto al minimo richiesto.

3. **Configura i 12 CFU a Scelta Libera (Gruppo K)**:
   Seleziona la modalità preferita per completare i 12 crediti a scelta libera:
   - **2 esami da 6 CFU**
   - **1 esame da 9 CFU + 1 laboratorio/modulo da 3 CFU**
   
   *Le 3 attività formative obblatorie (Laboratorio Tesi, Laboratorio/Tirocinio, AI Literacy per un totale di 9 CFU) sono già incluse automaticamente.*

4. **Verifica il Piano di Studi**:
   - Consulta il pannello laterale **Stato di Validazione**:
     - 🟢 **Valido**: Il piano rispetta tutti i vincoli didattici, di propedeuticità e di CFU.
     - 🔴 **Non Valido**: Viene mostrato l'elenco degli errori o delle regole violate. Cliccando su un errore verrai reindirizzato direttamente alla tabella interessata.

5. **Salvataggio Automatico & Reimpostazione**:
   - Le tue scelte vengono salvate **automaticamente nel browser** (in locale), così puoi chiudere la pagina e riprenderla in qualsiasi momento.
   - Se desideri ricominciare da capo, clicca sul pulsante **Reimposta Piano** in alto a destra.

---

## 🛠️ Tecnologie Utilizzate

- **HTML5 & CSS3** (Vanilla CSS responsive, nessun framework pesante)
- **JavaScript ES2022** (Architettura modulare basata su eventi)
- **Vite** (Build tool e bundler statico)
- **100% Client-Side**: Nessun dato personale viene inviato a server esterni.
