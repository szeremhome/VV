// // src/viessmann-auth.ts

// import type { ViessmannTokens } from './types.js';
// import { saveTokens, loadTokens, isTokenValid } from './token-store.js';

// https://app.developer.viessmann-climatesolutions.com/
// https://account.viessmann-climatesolutions.com/
// https://api.viessmann-climatesolutions.com/translations/v2/phraseapp-proxy/projects/ec38b083a23c58c604a49d7f443dd7f2/locales/pl-PL/download?file_format=simple_json

// const AUTHORIZE_URL = 'https://iam.viessmann.com/idp/v2/authorize';
// const TOKEN_URL = 'https://iam.viessmann.com/idp/v2/token';
// const SCOPE = 'IoT User offline_access';

// export class ViessmannAuth {
//   constructor(
//     private readonly clientId: string,
//     private readonly clientSecret: string,
//     private readonly redirectUri: string,
//   ) {}

//   /**
//    * Krok 1: Zwraca URL do którego przekierowujemy użytkownika
//    * w celu zalogowania się w Viessmann.
//    */
//   getAuthorizeUrl(): string {
//     const params = new URLSearchParams({
//       client_id: this.clientId,
//       redirect_uri: this.redirectUri,
//       scope: SCOPE,
//       response_type: 'code',
//     });
//     return `${AUTHORIZE_URL}?${params.toString()}`;
//   }

//   /**
//    * Krok 2: Wymiana authorization code na tokeny.
//    * Wywoływane po powrocie z Viessmann na /callback?code=...
//    */
//   async exchangeCode(code: string): Promise<ViessmannTokens> {
//     const body = new URLSearchParams({
//       grant_type: 'authorization_code',
//       client_id: this.clientId,
//       client_secret: this.clientSecret,
//       code,
//       redirect_uri: this.redirectUri,
//     });

//     const res = await fetch(TOKEN_URL, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//       body: body.toString(),
//     });

//     if (!res.ok) {
//       const text = await res.text();
//       throw new Error(`Token exchange failed (${res.status}): ${text}`);
//     }

//     const data = await res.json() as {
//       access_token: string;
//       refresh_token: string;
//       token_type: string;
//       expires_in: number;
//     };

//     const tokens: ViessmannTokens = {
//       access_token: data.access_token,
//       refresh_token: data.refresh_token,
//       token_type: data.token_type,
//       expires_in: data.expires_in,
//       expires_at_ms: Date.now() + data.expires_in * 1000,
//     };

//     saveTokens(tokens);
//     return tokens;
//   }

//   /**
//    * Zwraca ważny access_token.
//    * Jeśli wygasł — automatycznie odświeża go.
//    */
//   async getAccessToken(): Promise<string> {
//     const tokens = loadTokens();

//     if (!tokens) {
//       throw new Error(
//         'Brak tokenów. Odwiedź http://localhost:3000 i kliknij "Połącz z Viessmann".'
//       );
//     }

//     if (isTokenValid(tokens)) {
//       return tokens.access_token;
//     }

//     // Token wygasł — odświeżamy
//     console.log('[Auth] Access token expired, refreshing...');
//     return this.refreshAccessToken(tokens.refresh_token);
//   }

//   /**
//    * Odświeżanie tokena za pomocą refresh_token.
//    */
//   private async refreshAccessToken(refreshToken: string): Promise<string> {
//     const body = new URLSearchParams({
//       grant_type: 'refresh_token',
//       client_id: this.clientId,
//       client_secret: this.clientSecret,
//       refresh_token: refreshToken,
//     });

//     const res = await fetch(TOKEN_URL, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//       body: body.toString(),
//     });

//     if (!res.ok) {
//       const text = await res.text();
//       throw new Error(
//         `Token refresh failed (${res.status}): ${text}. ` +
//         `Prawdopodobnie refresh_token wygasł — zaloguj się ponownie.`
//       );
//     }

//     const data = await res.json() as {
//       access_token: string;
//       refresh_token: string;
//       token_type: string;
//       expires_in: number;
//     };

//     const tokens: ViessmannTokens = {
//       access_token: data.access_token,
//       refresh_token: data.refresh_token,
//       token_type: data.token_type,
//       expires_in: data.expires_in,
//       expires_at_ms: Date.now() + data.expires_in * 1000,
//     };

//     saveTokens(tokens);
//     console.log('[Auth] Token refreshed successfully.');
//     return tokens.access_token;
//   }

//   /**
//    * Sprawdza czy mamy ważne tokeny (bez odświeżania).
//    */
//   hasValidTokens(): boolean {
//     const tokens = loadTokens();
//     return tokens !== null && isTokenValid(tokens);
//   }
// }