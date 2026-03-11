import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DENTALINK_BASE = "https://api.dentalink.healthatom.com/api/v1";

/* ── Simple password hashing with Web Crypto (PBKDF2) ─────── */
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  const hashArray = new Uint8Array(bits);
  // Store as salt:hash in hex
  const saltHex = Array.from(salt).map(b => b.toString(16).padStart(2, "0")).join("");
  const hashHex = Array.from(hashArray).map(b => b.toString(16).padStart(2, "0")).join("");
  return `${saltHex}:${hashHex}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(":");
  const salt = new Uint8Array(saltHex.match(/.{2}/g)!.map(h => parseInt(h, 16)));
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  const computed = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, "0")).join("");
  return computed === hashHex;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { action, params, rut, phone_last4, password } = body;
    const TOKEN = Deno.env.get("DENTALINK_TOKEN")!;
    const headers = {
      Authorization: `Token ${TOKEN}`,
      "Content-Type": "application/json",
    };

    // Supabase admin client for patient_credentials
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let result: unknown;

    switch (action) {
      /* ── Register: RUT + password ───────────────────────────── */
      case "register_patient_portal": {
        if (!rut || !password || password.length < 4) {
          return new Response(JSON.stringify({ error: "RUT y contraseña (mín. 4 caracteres) son requeridos" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Check if already registered
        const { data: existing } = await supabaseAdmin
          .from("patient_credentials")
          .select("id")
          .eq("rut", rut)
          .maybeSingle();

        if (existing) {
          return new Response(JSON.stringify({ error: "Este RUT ya tiene una cuenta. Usa tu contraseña para ingresar." }), {
            status: 409,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Verify RUT exists in Dentalink
        let patients: Record<string, unknown>[] = [];
        const rutFilter = JSON.stringify({ rut: { eq: rut } });
        const searchUrl = `${DENTALINK_BASE}/pacientes?q=${encodeURIComponent(rutFilter)}`;
        const searchRes = await fetch(searchUrl, { headers });
        const searchData = await searchRes.json();
        patients = searchData?.data ?? [];

        if (!patients.length) {
          const buscarUrl = `${DENTALINK_BASE}/pacientes/buscar?rut=${encodeURIComponent(rut)}`;
          const buscarRes = await fetch(buscarUrl, { headers });
          const buscarData = await buscarRes.json();
          patients = buscarData?.data ? (Array.isArray(buscarData.data) ? buscarData.data : [buscarData.data]) : [];
        }

        if (!patients.length) {
          return new Response(JSON.stringify({ error: "No se encontró un paciente con ese RUT en nuestros registros" }), {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const patient = patients[0];
        const patientName = `${patient.nombre ?? ""} ${patient.apellido ?? ""}`.trim();
        const passwordHash = await hashPassword(password);

        const { error: insertErr } = await supabaseAdmin
          .from("patient_credentials")
          .insert({
            rut,
            password_hash: passwordHash,
            name: patientName,
            dentalink_patient_id: String(patient.id ?? ""),
          });

        if (insertErr) {
          console.error("Insert error:", insertErr);
          return new Response(JSON.stringify({ error: "Error al crear la cuenta" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        result = { success: true, message: "Cuenta creada. Ya puedes ingresar." };
        break;
      }

      /* ── Login: RUT + password → fetch Dentalink data ───────── */
      case "login_patient_portal": {
        if (!rut || !password) {
          return new Response(JSON.stringify({ error: "RUT y contraseña son requeridos" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const { data: cred } = await supabaseAdmin
          .from("patient_credentials")
          .select("*")
          .eq("rut", rut)
          .maybeSingle();

        if (!cred) {
          return new Response(JSON.stringify({ error: "No existe una cuenta con ese RUT. Regístrate primero." }), {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const valid = await verifyPassword(password, cred.password_hash);
        if (!valid) {
          return new Response(JSON.stringify({ error: "Contraseña incorrecta" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Fetch data from Dentalink
        let citas: unknown[] = [];
        const patientId = cred.dentalink_patient_id;
        if (patientId) {
          try {
            const citasRes = await fetch(`${DENTALINK_BASE}/citas?id_paciente=${patientId}`, { headers });
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
        }

        // Get patient info from Dentalink
        let patientName = cred.name || rut;
        let patientEmail = "";
        let patientPhone = "";
        if (patientId) {
          try {
            const pRes = await fetch(`${DENTALINK_BASE}/pacientes/${patientId}`, { headers });
            const pData = await pRes.json();
            const p = pData?.data ?? pData;
            patientName = `${p.nombre ?? ""} ${p.apellido ?? ""}`.trim() || patientName;
            patientEmail = p.email ?? "";
            patientPhone = (p.telefono ?? p.celular ?? "").replace(/\D/g, "");
          } catch { /* swallow */ }
        }

        result = {
          name: patientName,
          email: patientEmail,
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

      /* ── Legacy: RUT + phone (keep for backwards compat) ───── */
      case "get_patient_portal": {
        if (!rut || !phone_last4 || phone_last4.length !== 4) {
          return new Response(JSON.stringify({ error: "RUT y últimos 4 dígitos del teléfono son requeridos" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        let patients: Record<string, unknown>[] = [];
        const rutFilter = JSON.stringify({ rut: { eq: rut } });
        const searchUrl = `${DENTALINK_BASE}/pacientes?q=${encodeURIComponent(rutFilter)}`;
        const searchRes = await fetch(searchUrl, { headers });
        const searchData = await searchRes.json();
        patients = searchData?.data ?? [];

        if (!patients.length) {
          const buscarUrl = `${DENTALINK_BASE}/pacientes/buscar?rut=${encodeURIComponent(rut)}`;
          const buscarRes = await fetch(buscarUrl, { headers });
          const buscarData = await buscarRes.json();
          patients = buscarData?.data ? (Array.isArray(buscarData.data) ? buscarData.data : [buscarData.data]) : [];
        }

        if (!patients.length) {
          return new Response(JSON.stringify({ error: "No se encontró un paciente con ese RUT" }), {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const patient = patients[0];
        const patientPhone = (patient.telefono ?? patient.celular ?? "").replace(/\D/g, "");

        if (!patientPhone.endsWith(phone_last4)) {
          return new Response(JSON.stringify({ error: "Los dígitos del teléfono no coinciden" }), {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const patientId = patient.id;
        let citas: unknown[] = [];
        try {
          const citasRes = await fetch(`${DENTALINK_BASE}/citas?id_paciente=${patientId}`, { headers });
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
        const reqBody: Record<string, unknown> = { nombre, apellido, telefono, email };
        if (pRut) reqBody.rut = pRut;

        const res = await fetch(`${DENTALINK_BASE}/pacientes`, {
          method: "POST",
          headers,
          body: JSON.stringify(reqBody),
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
