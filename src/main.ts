import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <main class="container">
    <h1>Moja aplikacja</h1>

    <p>
      Aplikacja działa na GitHub Pages.
    </p>

    <p id="status">
      Status: OK
    </p>
  </main>
`