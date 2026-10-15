// // src/index.ts

// import 'dotenv/config';
// import express from 'express';
// import { join, dirname } from 'node:path';
// import { fileURLToPath } from 'node:url';
// import { ViessmannAuth } from './viessmann-auth.js';
// import { ViessmannApi } from './viessmann-api.js';

// const __dirname = dirname(fileURLToPath(import.meta.url));

// // ─── Konfiguracja ────────────────────────────────────────────────

// const PORT = parseInt(process.env.PORT ?? '3000', 10);
// const CLIENT_ID = process.env.VIESSMANN_CLIENT_ID;
// const CLIENT_SECRET = process.env.VIESSMANN_CLIENT_SECRET;

// if (!CLIENT_ID || !CLIENT_SECRET) {
//   console.error('❌ Brak VIESSMANN_CLIENT_ID lub VIESSMANN_CLIENT_SECRET w .env');
//   console.error('   Skopiuj .env.example → .env i uzupełnij dane.');
//   process.exit(1);
// }

// const REDIRECT_URI = `http://localhost:${PORT}/callback`;

// // ─── Inicjalizacja ──────────────────────────────────────────────

// const auth = new ViessmannAuth(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
// const api = new ViessmannApi(auth);
// const app = express();

// app.use(express.json());
// app.use(express.static(join(__dirname, '..', 'public')));

// // ─── Routes ────────────────────────────────────────────────────

// /**
//  * GET /
//  * Strona główna — serwowana z public/index.html
//  */
// app.get('/', (_req, res) => {
//   res.sendFile(join(__dirname, '..', 'public', 'index.html'));
// });

// /**
//  * GET /auth/login
//  * Przekierowuje do Viessmann w celu logowania.
//  */
// app.get('/auth/login', (_req, res) => {
//   const url = auth.getAuthorizeUrl();
//   console.log(`[Auth] Redirecting to Viessmann: ${url}`);
//   res.redirect(url);
// });

// /**
//  * GET /callback?code=...
//  * Viessmann wraca tutaj po zalogowaniu użytkownika.
//  * Wymieniamy code na tokeny.
//  */
// app.get('/callback', async (req, res) => {
//   const code = req.query.code as string | undefined;

//   if (!code) {
//     const error = req.query.error as string | undefined;
//     res.status(400).send(`
//       <h2>❌ Błąd logowania</h2>
//       <p>${error ?? 'Brak kodu autoryzacyjnego w URL.'}</p>
//       <a href="/">← Wróć</a>
//     `);
//     return;
//   }

//   try {
//     await auth.exchangeCode(code);
//     console.log('[Auth] ✅ Authorization successful!');
//     res.redirect('/?connected=true');
//   } catch (error) {
//     const message = error instanceof Error ? error.message : String(error);
//     console.error('[Auth] ❌ Exchange failed:', message);
//     res.status(500).send(`
//       <h2>❌ Błąd wymiany kodu</h2>
//       <pre>${message}</pre>
//       <a href="/auth/login">Spróbuj ponownie</a>
//     `);
//   }
// });

// /**
//  * GET /api/status
//  * Zwraca aktualny status pieca.
//  */
// app.get('/api/status', async (_req, res) => {
//   try {
//     const status = await api.getBoilerStatus();
//     res.json({ success: true, data: status });
//   } catch (error) {
//     const message = error instanceof Error ? error.message : String(error);
//     console.error('[API] Status error:', message);
//     res.status(500).json({ success: false, error: message });
//   }
// });

// /**
//  * POST /api/temperature
//  * Ustawia temperaturę CO lub CWU.
//  *
//  * Body: { program: "heating" | "dhw", temperature: number }
//  */
// app.post('/api/temperature', async (req, res) => {
//   const { program, temperature } = req.body as {
//     program?: string;
//     temperature?: number;
//   };

//   if (!program || typeof temperature !== 'number') {
//     res.status(400).json({
//       success: false,
//       error: 'Wymagane pola: program ("heating"|"dhw"), temperature (number)',
//     });
//     return;
//   }

//   try {
//     if (program === 'heating') {
//       await api.setHeatingTemperature(temperature);
//     } else if (program === 'dhw') {
//       await api.setDhwTemperature(temperature);
//     } else {
//       res.status(400).json({
//         success: false,
//         error: `Nieznany program: ${program}. Użyj "heating" lub "dhw".`,
//       });
//       return;
//     }

//     res.json({
//       success: true,
//       data: {
//         program,
//         temperature,
//         message: `Temperatura ${program === 'heating' ? 'CO' : 'CWU'} ustawiona na ${temperature}°C`,
//       },
//     });
//   } catch (error) {
//     const message = error instanceof Error ? error.message : String(error);
//     console.error(`[API] Set temperature error:`, message);
//     res.status(500).json({ success: false, error: message });
//   }
// });

// /**
//  * GET /api/auth/status
//  * Sprawdza czy mamy ważne tokeny.
//  */
// app.get('/api/auth/status', (_req, res) => {
//   res.json({
//     success: true,
//     data: { connected: auth.hasValidTokens() },
//   });
// });

// // ─── Start ─────────────────────────────────────────────────────

// app.listen(PORT, () => {
//   console.log('');
//   console.log('╔══════════════════════════════════════════════════╗');
//   console.log('║   🔥 Viessmann Vitodens 100 — Local POC        ║');
//   console.log('╠══════════════════════════════════════════════════╣');
//   console.log(`║   🌐 http://localhost:${PORT}                      ║`);
//   console.log('║                                                  ║');
//   console.log('║   1. Otwórz URL w przeglądarce                   ║');
//   console.log('║   2. Kliknij "Połącz z Viessmann"                ║');
//   console.log('║   3. Zaloguj się danymi Viessmann                ║');
//   console.log('║   4. Steruj piecem!                              ║');
//   console.log('╚══════════════════════════════════════════════════╝');
//   console.log('');
// });