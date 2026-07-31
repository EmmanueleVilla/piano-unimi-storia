import { store } from './state/store.js';
import { initUI } from './ui/renderer.js';

async function bootstrap() {
  try {
    // 1. Initialize UI listeners & event handlers
    initUI();

    // 2. Fetch degree rules configuration JSON
    const response = await fetch('./data/degree-rules.json');
    if (!response.ok) {
      throw new Error(`Impossibile caricare le regole del piano di studi (${response.status})`);
    }

    const degreeConfig = await response.json();

    // 3. Initialize state store
    store.init(degreeConfig);
  } catch (error) {
    console.error('Errore nell\'inizializzazione dell\'applicazione:', error);
    const container = document.getElementById('app');
    if (container) {
      const alert = document.createElement('div');
      alert.className = 'error-banner';
      alert.style.margin = '2rem';
      alert.style.padding = '1.5rem';
      alert.style.fontSize = '1.1rem';
      alert.innerHTML = `<strong>Errore di caricamento:</strong> ${error.message}`;
      container.prepend(alert);
    }
  }
}

document.addEventListener('DOMContentLoaded', bootstrap);
