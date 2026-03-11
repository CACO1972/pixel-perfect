import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DENTALINK_BASE = "https://api.dentalink.healthatom.com/api/v1";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { action, params } = await req.json();
    const TOKEN = Deno.env.get("DENTALINK_TOKEN")!;
    const headers = {
      Authorization: `Token ${TOKEN}`,
      "Content-Type": "application/json",
    };

    let result: unknown;

    switch (action) {
      case "create_patient": {
        const { nombre, apellido, telefono, email, rut } = params || {};
        const body: Record<string, unknown> = {
          nombre,
          apellido,
          telefono,
          email,
        };
        if (rut) body.rut = rut;

        const res = await fetch(`${DENTALINK_BASE}/pacientes`, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        });
        result = await res.json();

        // If patient already exists (409), try to find them
        if (res.status === 409 && rut) {
          const searchRes = await fetch(`${DENTALINK_BASE}/pacientes?q=${encodeURIComponent(rut)}`, {
            headers,
          });
          const searchData = await searchRes.json();
          result = { existing: true, ...searchData };
        }
        break;
      }

      case "create_appointment": {
        const { paciente_id, sucursal_id, profesional_id, fecha, hora, duracion, tipo_cita_id } = params || {};
        const res = await fetch(`${DENTALINK_BASE}/citas`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            id_paciente: paciente_id,
            id_sucursal: sucursal_id || 1,
            id_profesional: profesional_id,
            fecha,
            hora_inicio: hora,
            duracion: duracion || 60,
            id_tipo_cita: tipo_cita_id || 1,
          }),
        });
        result = await res.json();
        break;
      }

      case "get_availability": {
        const { profesional_id, fecha_inicio, fecha_fin } = params || {};
        const url = `${DENTALINK_BASE}/profesionales/${profesional_id}/disponibilidad?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`;
        const res = await fetch(url, { headers });
        result = await res.json();
        break;
      }

      case "get_professionals": {
        const res = await fetch(`${DENTALINK_BASE}/profesionales`, { headers });
        result = await res.json();
        break;
      }

      default:
        return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("dentalink-proxy error:", err);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
