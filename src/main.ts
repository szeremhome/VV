import './style.css'

console.log("AAA");

const buildId = (): String => import.meta.env.VITE_BUILD_ID || "ID";
// const buildDt = (): Date => import.meta.env.VITE_BUILD_DT || new Date();

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
        
      </small>
    </footer>
`
// <span>z dnia: ${buildDt().toLocaleDateString()}</span>
console.log("CCC");
