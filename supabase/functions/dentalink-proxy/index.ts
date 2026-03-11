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
    const { action, params, rut, phone_last4 } = await req.json();
    const TOKEN = Deno.env.get("DENTALINK_TOKEN")!;
    const headers = {
      Authorization: `Token ${TOKEN}`,
      "Content-Type": "application/json",
    };

    let result: unknown;

    switch (action) {
      /* ── Portal Paciente: lookup + verify phone ─────────────── */
      case "get_patient_portal": {
        if (!rut || !phone_last4 || phone_last4.length !== 4) {
          return new Response(JSON.stringify({ error: "RUT y últimos 4 dígitos del teléfono son requeridos" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Search patient by RUT
        const searchRes = await fetch(
          `${DENTALINK_BASE}/pacientes?q=${encodeURIComponent(rut)}`,
          { headers }
        );
        const searchData = await searchRes.json();
        const patients = searchData?.data ?? [];

        if (!patients.length) {
          return new Response(JSON.stringify({ error: "No se encontró un paciente con ese RUT" }), {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const patient = patients[0];
        const patientPhone = (patient.telefono ?? patient.celular ?? "").replace(/\D/g, "");

        // Verify last 4 digits
        if (!patientPhone.endsWith(phone_last4)) {
          return new Response(JSON.stringify({ error: "Los dígitos del teléfono no coinciden con nuestros registros" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Fetch appointments
        const patientId = patient.id;
        let citas: unknown[] = [];
        try {
          const citasRes = await fetch(
            `${DENTALINK_BASE}/citas?id_paciente=${patientId}`,
            { headers }
          );
          const citasData = await citasRes.json();
          citas = (citasData?.data ?? []).map((c: Record<string, unknown>) => ({
            id: String(c.id ?? ""),
            fecha: c.fecha ?? "",
            hora: c.hora_inicio ?? "",
            estado: c.estado ?? "",
            tratamiento: c.tipo_cita ?? "Consulta",
            doctor: c.profesional_nombre ?? "",
            consultorio: c.sucursal_nombre ?? "",
          }));
        } catch { /* swallow */ }

        result = {
          name: `${patient.nombre ?? ""} ${patient.apellido ?? ""}`.trim(),
          email: patient.email ?? "",
          phone: patientPhone,
          citas,
          radiografias: [],
          tratamientos: [],
          pagos: [],
          recetas: [],
          consentimientos: [],
        };
        break;
      }

      case "create_patient": {
        const { nombre, apellido, telefono, email, rut: pRut } = params || {};
        const body: Record<string, unknown> = { nombre, apellido, telefono, email };
        if (pRut) body.rut = pRut;

        const res = await fetch(`${DENTALINK_BASE}/pacientes`, {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        });
        result = await res.json();

        if (res.status === 409 && pRut) {
          const searchRes = await fetch(`${DENTALINK_BASE}/pacientes?q=${encodeURIComponent(pRut)}`, { headers });
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
        const url = `${DENTALINK_BASE}/dentistas/${profesional_id}/disponibilidad?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`;
        const res = await fetch(url, { headers });
        result = await res.json();
        break;
      }

      case "get_professionals": {
        const res = await fetch(`${DENTALINK_BASE}/dentistas`, { headers });
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
