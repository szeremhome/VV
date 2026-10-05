import './style.css'

function formatDate(d: Date): string {
  // np. 2026-10-05 14:23
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} `
       + `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Data builda – tutaj czas uruchomienia, ale możesz „zamrozić” ją build-time (patrz niżej)
const buildDt = import.meta.env.VITE_BUILD_DT 
  ? new Date(import.meta.env.VITE_BUILD_DT)
  : new Date();
const buildDtElement = document.getElementById('build-dt');
if (buildDtElement) buildDtElement.textContent = `Build date: ${formatDate(buildDt)}`;

// Build ID – z env Vite
const buildId = import.meta.env.VITE_BUILD_ID ?? 'dev';
const buildIdElement = document.getElementById('build-id');
if (buildIdElement) buildIdElement.textContent = `Build id: ${buildId}`;


const app = document.querySelector<HTMLDivElement>('#app');
if (app) {
  app.innerHTML = `
    <main class="container">
      <h1>Moja aplikacja</h1>

      <p>
        Aplikacja działa na GitHub Pages.
      </p>

      <p id="status">
        Status: OK
      </p>
    </main>
`;
} else {
  console.error("Nie znaleziono elementu #app");
}
