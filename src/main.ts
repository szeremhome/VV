import './style.css'

console.log("AAA");

const buildId = () => import.meta.env.VITE_BUILD_ID || "ID";
const buildDt = () => import.meta.env.VITE_BUILD_DT || "DT";

console.log({ Id: buildId(), Dt: buildDt() });
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <main class="container">
      <h1>Moja aplikacja</h1>

      <p>
        Aplikacja działa na GitHub Pages.
      </p>

      <p id="status">
        Status: OK
      </p>
    </main>
    <footer>
      <small>

      </small>
    </footer>
`
console.log("CCC");
        // <span>wersja:${buildId()}</span> &nbsp;|&nbsp;<span>z dani ${buildDt()}</span>