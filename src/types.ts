// src/types.ts

// ─── OAuth / Tokeny ────────────────────────────────────────────────

export interface ViessmannTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  /** Unix timestamp (ms) kiedy access_token wygasa */
  expires_at_ms: number;
}

// ─── Viessmann API responses ────────────────────────────────────────

export interface Installation {
  id: number;
  description: string;
  registeredAt: string;
}

export interface Gateway {
  serial: string;
  version: string;
}

export interface Device {
  id: string;
  deviceType: string;
  modelId: string;
  status: string;
}

export interface FeatureProperty {
  type: string;
  value: unknown;
  unit?: string;
}

export interface Feature {
  feature: string;
  isEnabled: boolean;
  isReady: boolean;
  properties: Record<string, FeatureProperty>;
  commands: Record<string, {
    uri: string;
    name: string;
    isExecutable: boolean;
    params: Record<string, unknown>;
  }>;
  timestamp: string;
}

// ─── Uproszczony status pieca ───────────────────────────────────────

export interface BoilerStatus {
  /** Ustawiona temperatura CO (program normal) */
  heatingTarget: number | null;
  /** Ustawiona temperatura CWU */
  dhwTarget: number | null;
  /** Aktualna temperatura zasilania */
  supplyTemp: number | null;
  /** Temperatura zewnętrzna */
  outsideTemp: number | null;
  /** Temperatura CWU (bojler) */
  dhwActual: number | null;
  /** Tryb pracy */
  operatingMode: string | null;
  /** Aktywny program */
  activeProgram: string | null;
  /** Czy palnik działa */
  burnerActive: boolean | null;
  /** Modulacja palnika % */
  burnerModulation: number | null;
  /** Ciśnienie w instalacji (bar) */
  pressure: number | null;
  /** Błędy */
  errors: string[];
  /** Kiedy odczytano */
  readAt: string;
}

// ─── Konfiguracja urządzenia (auto-discovered) ──────────────────────

export interface DeviceConfig {
  installationId: number;
  gatewaySerial: string;
  deviceId: string;
}