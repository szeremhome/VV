import './style.css'

// Data builda – tutaj czas uruchomienia, ale możesz „zamrozić” ją build-time (patrz niżej)
const buildDt = () => import.meta.env.VITE_BUILD_DT
  ? new Date(import.meta.env.VITE_BUILD_DT)
  : new Date();

// Build ID – z env Vite
const buildId = () => import.meta.env.VITE_BUILD_ID ?? 'dev';

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <main class="container">
      <h1>Moja aplikacja 2</h1>

      <p>
        Aplikacja działa na GitHub Pages.
      </p>

      <p id="status">
        Status: OK
      </p>
    </main>
    <footer>
      <small>
        <span id="build-dt">${buildDt()}</span> &nbsp;|&nbsp; <span id="build-id">${buildId()}</span>
      </small>
    </footer>
`
