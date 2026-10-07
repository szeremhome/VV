import './style.css'

console.log("AAA");

const buildId = (): String => import.meta.env.VITE_BUILD_ID || "ID";
const buildDt = (): String => import.meta.env.VITE_BUILD_DT || "DT";

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
        <samp>Wersja: ${buildId()}</samp>
        &nbsp;|&nbsp;
        <samp>Wersja: ${buildDt()}</samp>
      </small>
    </footer>
`
console.log("CCC");
