/**
 * MiPerfil — Portal Paciente · Clínica Miró
 * Lee y actualiza tabla `pacientes` del Supabase oficial
 * Supabase ref: jipldlklzobiytkvxokf
 *
 * Tabla requerida (si no existe, crear en Supabase):
 *   CREATE TABLE IF NOT EXISTS pacientes (
 *     id            uuid PRIMARY KEY REFERENCES auth.users(id),
 *     first_name    text,
 *     last_name     text,
 *     phone         text,
 *     address       text,
 *     emergency_contact text,
 *     emergency_phone   text,
 *     created_at    timestamptz DEFAULT now(),
 *     updated_at    timestamptz DEFAULT now()
 *   );
 *   ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
 *   CREATE POLICY "own_row" ON pacientes USING (auth.uid() = id);
 */
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, MapPin, Save, CheckCircle } from "lucide-react";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  emergency_contact: string;
  emergency_phone: string;
}

const EMPTY: Profile = { id: "", first_name: "", last_name: "", email: "", phone: "", address: "", emergency_contact: "", emergency_phone: "" };

const MiPerfil = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile>(EMPTY);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("pacientes")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error; // PGRST116 = row not found

      setProfile({
        id: user.id,
        first_name: data?.first_name ?? "",
        last_name: data?.last_name ?? "",
        email: user.email ?? "",
        phone: data?.phone ?? "",
        address: data?.address ?? "",
        emergency_contact: data?.emergency_contact ?? "",
        emergency_phone: data?.emergency_phone ?? "",
      });
    } catch (err) {
      console.error("fetchProfile:", err);
      toast({ title: "Error", description: "No se pudo cargar el perfil", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.from("pacientes").upsert({
        id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        address: profile.address,
        emergency_contact: profile.emergency_contact,
        emergency_phone: profile.emergency_phone,
        updated_at: new Date().toISOString(),
      }, { onConflict: "id" });

      if (error) throw error;
      toast({ title: "Perfil guardado", description: "Tus datos han sido actualizados." });
    } catch (err) {
      console.error("handleSave:", err);
      toast({ title: "Error", description: "No se pudo guardar el perfil", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
      <span style={{ fontFamily: "monospace", fontSize: ".75rem", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--mid)" }}>Cargando perfil…</span>
    </div>
  );

  const Field = ({ id, label, value, type = "text", disabled = false, placeholder = "" }: any) => (
    <div style={{ display: "flex", flexDirection: "column", gap: ".4rem" }}>
      <Label htmlFor={id} style={{ fontFamily: "var(--font-d)", fontWeight: 700, fontSize: ".7rem", letterSpacing: ".1em", textTransform: "uppercase" }}>{label}</Label>
      <Input id={id} name={id} type={type} value={value} onChange={handleChange} disabled={disabled} placeholder={placeholder}
        style={{ fontFamily: "var(--font-b)", borderRadius: 0, background: disabled ? "var(--secondary)" : "var(--bg)" }} />
    </div>
  );

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 4 }}>Portal Paciente</p>
        <h1 style={{ fontFamily: "var(--font-s)", fontWeight: 300, fontSize: "clamp(1.8rem,4vw,2.5rem)", lineHeight: 1.1 }}>Mi Perfil</h1>
      </div>

      <Alert style={{ border: "1px solid rgba(201,168,124,.3)", background: "rgba(201,168,124,.05)", borderRadius: 0, marginBottom: "1.5rem" }}>
        <CheckCircle style={{ width: 16, height: 16, color: "var(--accent)" }} />
        <AlertDescription style={{ fontFamily: "var(--font-b)", fontSize: ".85rem", color: "var(--dark)" }}>
          Mantén tus datos actualizados para recordatorios de citas y contacto de emergencia.
        </AlertDescription>
      </Alert>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
        {/* Datos personales */}
        <Card style={{ borderRadius: 0, border: "1px solid var(--border)" }}>
          <CardHeader style={{ borderBottom: "1px solid var(--border)", padding: "1.25rem 1.5rem" }}>
            <CardTitle style={{ fontFamily: "var(--font-d)", fontWeight: 700, fontSize: ".9rem", letterSpacing: ".05em", display: "flex", alignItems: "center", gap: 8 }}>
              <User style={{ width: 16, height: 16, color: "var(--accent)" }} />Datos Personales
            </CardTitle>
          </CardHeader>
          <CardContent style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Field id="first_name" label="Nombre"   value={profile.first_name} placeholder="Tu nombre" />
              <Field id="last_name"  label="Apellido" value={profile.last_name}  placeholder="Tu apellido" />
            </div>
            <Field id="email" label="Email" value={profile.email} type="email" disabled />
            <div style={{ fontFamily: "var(--font-b)", fontSize: ".75rem", color: "var(--mid)", marginTop: -8 }}>El email no se puede modificar</div>
            <Field id="phone" label="Teléfono" value={profile.phone} type="tel" placeholder="+56 9 1234 5678" />
            <div style={{ display: "flex", flexDirection: "column", gap: ".4rem" }}>
              <Label htmlFor="address" style={{ fontFamily: "var(--font-d)", fontWeight: 700, fontSize: ".7rem", letterSpacing: ".1em", textTransform: "uppercase" }}>Dirección</Label>
              <Textarea id="address" name="address" value={profile.address} onChange={handleChange} placeholder="Tu dirección" rows={3} style={{ fontFamily: "var(--font-b)", borderRadius: 0 }} />
            </div>
          </CardContent>
        </Card>

        {/* Contacto de emergencia */}
        <Card style={{ borderRadius: 0, border: "1px solid var(--border)" }}>
          <CardHeader style={{ borderBottom: "1px solid var(--border)", padding: "1.25rem 1.5rem" }}>
            <CardTitle style={{ fontFamily: "var(--font-d)", fontWeight: 700, fontSize: ".9rem", letterSpacing: ".05em", display: "flex", alignItems: "center", gap: 8 }}>
              <Phone style={{ width: 16, height: 16, color: "var(--accent)" }} />Contacto de Emergencia
            </CardTitle>
          </CardHeader>
          <CardContent style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <Field id="emergency_contact" label="Nombre del contacto" value={profile.emergency_contact} placeholder="Nombre completo" />
            <Field id="emergency_phone"   label="Teléfono"            value={profile.emergency_phone}   type="tel" placeholder="+56 9 1234 5678" />
            <Alert style={{ border: "1px solid var(--border)", background: "var(--secondary)", borderRadius: 0 }}>
              <Phone style={{ width: 14, height: 14 }} />
              <AlertDescription style={{ fontSize: ".8rem", color: "var(--mid)" }}>
                Este contacto será notificado en emergencias durante tu tratamiento.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Info clínica */}
      <Card style={{ borderRadius: 0, border: "1px solid var(--border)", marginBottom: "2rem" }}>
        <CardHeader style={{ borderBottom: "1px solid var(--border)", padding: "1.25rem 1.5rem" }}>
          <CardTitle style={{ fontFamily: "var(--font-d)", fontWeight: 700, fontSize: ".9rem", letterSpacing: ".05em", display: "flex", alignItems: "center", gap: 8 }}>
            <MapPin style={{ width: 16, height: 16, color: "var(--accent)" }} />Clínica Miró
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "1.5rem" }}>
            {[
              { icon: Phone, label: "Nuevos pacientes",      val: "+56 9 7415 7966" },
              { icon: Phone, label: "Pacientes en tratamiento", val: "+56 9 3557 2986" },
              { icon: Mail,  label: "Email",                 val: "administracion@clinicamiro.cl" },
              { icon: MapPin,label: "Dirección",             val: "Av. Nueva Providencia 2214, Of. 189, Providencia" },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <Icon style={{ width: 16, height: 16, color: "var(--accent)", marginTop: 2, flexShrink: 0 }} />
                <div>
                  <p style={{ fontFamily: "monospace", fontSize: ".65rem", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--mid)", marginBottom: 2 }}>{label}</p>
                  <p style={{ fontFamily: "var(--font-b)", fontSize: ".875rem" }}>{val}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={handleSave} disabled={saving}
          style={{ borderRadius: 0, fontFamily: "var(--font-d)", fontWeight: 700, fontSize: ".8rem", letterSpacing: ".12em", textTransform: "uppercase", padding: "1rem 2rem", background: "var(--accent)", color: "var(--accent-fg)", border: "none", opacity: saving ? .6 : 1, cursor: saving ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <Save style={{ width: 14, height: 14 }} />
          {saving ? "Guardando…" : "Guardar Cambios"}
        </Button>
      </div>
    </div>
  );
};

export default MiPerfil;
