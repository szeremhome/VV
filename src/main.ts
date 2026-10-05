import './style.css'


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
