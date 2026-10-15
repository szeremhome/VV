// // src/viessmann-api.ts

// import type {
//   BoilerStatus,
//   DeviceConfig,
//   Installation,
//   Gateway,
//   Device,
//   Feature,
// } from './types.js';
// import { ViessmannAuth } from './viessmann-auth.js';

// const API_BASE = 'https://api.viessmann.com/iot/v1';

// // Ścieżki do features Vitodens 100
// const F = {
//   HEATING_NORMAL:    'heating.circuits.0.programs.normal',
//   HEATING_REDUCED:   'heating.circuits.0.programs.reduced',
//   HEATING_COMFORT:   'heating.circuits.0.programs.comfort',
//   OPERATING_MODE:    'heating.circuits.0.operating.modes.active',
//   ACTIVE_PROGRAM:    'heating.circuits.0.operating.programs.active',
//   SUPPLY_TEMP:       'heating.circuits.0.sensors.temperature.supply',
//   OUTSIDE_TEMP:      'heating.sensors.temperature.outside',
//   DHW_TEMP_MAIN:     'heating.dhw.temperature.main',
//   DHW_TEMP_STORAGE:  'heating.dhw.sensors.temperature.hotWaterStorage',
//   BURNER_ACTIVE:     'heating.burners.0.active',
//   BURNER_MODULATION: 'heating.burners.0.modulation',
//   PRESSURE:          'heating.circuits.0.sensors.pressure.supply',
// } as const;

// export class ViessmannApi {
//   private deviceConfig: DeviceConfig | null = null;

//   constructor(private readonly auth: ViessmannAuth) {}

//   // ─── Device Discovery ──────────────────────────────────────

//   /**
//    * Automatyczne wykrycie instalacji → gateway → device.
//    * Wywołaj raz po zalogowaniu. Wynik cache'owany w pamięci.
//    */
//   async discoverDevice(): Promise<DeviceConfig> {
//     if (this.deviceConfig) return this.deviceConfig;

//     const token = await this.auth.getAccessToken();

//     // 1. Instalacje
//     const installations = await this.apiGet<{ data: Installation[] }>(
//       '/equipment/installations', token
//     );
//     const installation = installations.data[0];
//     if (!installation) throw new Error('Brak instalacji w koncie Viessmann.');
//     console.log(`[API] Installation: #${installation.id} "${installation.description}"`);

//     // 2. Gateways
//     const gateways = await this.apiGet<{ data: Gateway[] }>(
//       `/equipment/installations/${installation.id}/gateways`, token
//     );
//     const gateway = gateways.data[0];
//     if (!gateway) throw new Error('Brak gateway w instalacji.');
//     console.log(`[API] Gateway: ${gateway.serial}`);

//     // 3. Devices
//     const devices = await this.apiGet<{ data: Device[] }>(
//       `/equipment/installations/${installation.id}/gateways/${gateway.serial}/devices`, token
//     );
//     const device = devices.data.find(d => d.deviceType === 'heating') ?? devices.data[0];
//     if (!device) throw new Error('Brak urządzeń w gateway.');
//     console.log(`[API] Device: ${device.id} (${device.modelId})`);

//     this.deviceConfig = {
//       installationId: installation.id,
//       gatewaySerial: gateway.serial,
//       deviceId: device.id,
//     };

//     return this.deviceConfig;
//   }

//   // ─── Odczyt statusu ────────────────────────────────────────

//   /**
//    * Pobiera wszystkie interesujące nas features i buduje
//    * uproszczony obiekt BoilerStatus.
//    */
//   async getBoilerStatus(): Promise<BoilerStatus> {
//     const token = await this.auth.getAccessToken();
//     const device = await this.discoverDevice();

//     const featuresRes = await this.apiGet<{ data: Feature[] }>(
//       `/equipment/installations/${device.installationId}` +
//       `/gateways/${device.gatewaySerial}` +
//       `/devices/${device.deviceId}/features`,
//       token
//     );

//     // Mapujemy features do Mapy dla szybkiego dostępu
//     const features = new Map<string, Feature>();
//     for (const f of featuresRes.data) {
//       features.set(f.feature, f);
//     }

//     // Helper: wyciąga wartość property z feature
//     const val = (featureName: string, propName: string = 'value'): unknown => {
//       const f = features.get(featureName);
//       if (!f?.isEnabled) return null;
//       return f.properties[propName]?.value ?? null;
//     };

//     return {
//       heatingTarget:     val(F.HEATING_NORMAL, 'temperature') as number | null,
//       dhwTarget:         val(F.DHW_TEMP_MAIN) as number | null,
//       supplyTemp:        val(F.SUPPLY_TEMP) as number | null,
//       outsideTemp:       val(F.OUTSIDE_TEMP) as number | null,
//       dhwActual:         val(F.DHW_TEMP_STORAGE) as number | null,
//       operatingMode:     val(F.OPERATING_MODE) as string | null,
//       activeProgram:     val(F.ACTIVE_PROGRAM) as string | null,
//       burnerActive:      val(F.BURNER_ACTIVE) as boolean | null,
//       burnerModulation:  val(F.BURNER_MODULATION) as number | null,
//       pressure:          val(F.PRESSURE) as number | null,
//       errors:            [],
//       readAt:            new Date().toISOString(),
//     };
//   }

//   // ─── Ustawianie temperatury ────────────────────────────────

//   /**
//    * Ustawia temperaturę CO (program "normal").
//    * Dla Vitodens 100 zakres to 3–37°C.
//    */
//   async setHeatingTemperature(temperature: number): Promise<void> {
//     if (temperature < 3 || temperature > 37) {
//       throw new Error(`Temperatura CO ${temperature}°C poza zakresem (3–37°C).`);
//     }

//     const token = await this.auth.getAccessToken();
//     const device = await this.discoverDevice();

//     const commandUrl =
//       `/equipment/installations/${device.installationId}` +
//       `/gateways/${device.gatewaySerial}` +
//       `/devices/${device.deviceId}` +
//       `/features/${F.HEATING_NORMAL}` +
//       `/commands/setTemperature`;

//     await this.apiPost(commandUrl, { targetTemperature: temperature }, token);
//     console.log(`[API] ✅ Heating temperature set to ${temperature}°C`);
//   }

//   /**
//    * Ustawia temperaturę CWU (ciepła woda użytkowa).
//    * Dla Vitodens 100 zakres to 10–60°C.
//    */
//   async setDhwTemperature(temperature: number): Promise<void> {
//     if (temperature < 10 || temperature > 60) {
//       throw new Error(`Temperatura CWU ${temperature}°C poza zakresem (10–60°C).`);
//     }

//     const token = await this.auth.getAccessToken();
//     const device = await this.discoverDevice();

//     const commandUrl =
//       `/equipment/installations/${device.installationId}` +
//       `/gateways/${device.gatewaySerial}` +
//       `/devices/${device.deviceId}` +
//       `/features/${F.DHW_TEMP_MAIN}` +
//       `/commands/setTargetTemperature`;

//     await this.apiPost(commandUrl, { temperature }, token);
//     console.log(`[API] ✅ DHW temperature set to ${temperature}°C`);
//   }

//   // ─── HTTP helpers ──────────────────────────────────────────

//   private async apiGet<T>(path: string, token: string): Promise<T> {
//     const url = `${API_BASE}${path}`;
//     const res = await fetch(url, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         Accept: 'application/json',
//       },
//     });

//     if (!res.ok) {
//       const body = await res.text();
//       throw new Error(`GET ${path} → ${res.status}: ${body}`);
//     }

//     return res.json() as Promise<T>;
//   }

//   private async apiPost(path: string, body: unknown, token: string): Promise<void> {
//     const url = `${API_BASE}${path}`;
//     const res = await fetch(url, {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//       },
//       body: JSON.stringify(body),
//     });

//     if (!res.ok) {
//       const text = await res.text();
//       throw new Error(`POST ${path} → ${res.status}: ${text}`);
//     }
//   }
// }