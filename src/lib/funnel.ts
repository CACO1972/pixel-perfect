/**
 * funnel.ts — Clínica Miró
 * Tracking del embudo de conversión:
 *   wizard_start → ai_result → payment_success
 *
 * Escribe directo a Supabase (tabla funnel_events).
 * Usa un sessionId anónimo persistido en sessionStorage.
 */
import { supabase } from "@/integrations/supabase/client";

export type FunnelEvent = "wizard_start" | "ai_result" | "payment_success";

/** Genera o recupera un ID de sesión anónimo */
function getSessionId(): string {
  const KEY = "miro_session_id";
  let id = sessionStorage.getItem(KEY);
  if (!id) {
    id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem(KEY, id);
  }
  return id;
}

interface TrackOptions {
  orderId?:  string;
  nombre?:   string;
  email?:    string;
  motivo?:   string;
  zona?:     string;
  metadata?: Record<string, unknown>;
}

/**
 * Registra un evento del funnel.
 * Fire-and-forget: nunca bloquea el flujo del usuario.
 */
export function trackFunnel(event: FunnelEvent, opts: TrackOptions = {}): void {
  const row: Record<string, unknown> = {
    event,
    session_id: getSessionId(),
    order_id:   opts.orderId  ?? null,
    nombre:     opts.nombre   ?? null,
    email:      opts.email    ?? null,
    motivo:     opts.motivo   ?? null,
    zona:       opts.zona     ?? null,
    metadata:   (opts.metadata ?? {}) as Record<string, unknown>,
  };

  // Async fire-and-forget — no await, no throw
  supabase
    .from("funnel_events")
    .insert([row])
    .then(({ error }) => {
      if (error) console.warn("[funnel] track error:", error.message);
    });
}
