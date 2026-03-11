/**
 * MiPerfil — Portal Paciente · Clínica Miró
 * Uses profiles table (which exists in the DB types) instead of pacientes
 */
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, MapPin, Save, CheckCircle } from "lucide-react";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

const MiPerfil = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile>({ id: "", first_name: "", last_name: "", email: "", phone: "" });

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Use profiles table which exists in the schema
      const { data, error } = await supabase
        .from("profiles" as any)
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && (error as any).code !== "PGRST116") throw error;

      setProfile({
        id: user.id,
        first_name: (data as any)?.first_name ?? "",
        last_name: (data as any)?.last_name ?? "",
        email: user.email ?? "",
        phone: (data as any)?.phone ?? "",
      });
    } catch (err) {
      console.error("fetchProfile:", err);
      toast({ title: "Error", description: "No se pudo cargar el perfil", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await (supabase.from("profiles" as any) as any).upsert({
        id: profile.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
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
    <div className="min-h-[400px] flex items-center justify-center">
      <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground">Cargando perfil…</span>
    </div>
  );

  const Field = ({ id, label, value, type = "text", disabled = false, placeholder = "" }: { id: string; label: string; value: string; type?: string; disabled?: boolean; placeholder?: string }) => (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="font-display font-bold text-[0.7rem] tracking-widest uppercase">{label}</Label>
      <Input id={id} name={id} type={type} value={value} onChange={handleChange} disabled={disabled} placeholder={placeholder} style={{ borderRadius: 0 }} className={disabled ? "bg-secondary" : ""} />
    </div>
  );

  return (
    <div className="max-w-[860px] mx-auto px-6 py-8">
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-accent mb-1">Portal Paciente</p>
        <h1 className="font-serif font-light text-[clamp(1.8rem,4vw,2.5rem)] leading-tight">Mi Perfil</h1>
      </div>

      <Alert className="border-accent/30 bg-accent/5 mb-6" style={{ borderRadius: 0 }}>
        <CheckCircle className="w-4 h-4 text-accent" />
        <AlertDescription className="font-body text-sm text-foreground">
          Mantén tus datos actualizados para recordatorios de citas y contacto.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card style={{ borderRadius: 0 }} className="border-border">
          <CardHeader className="border-b border-border px-6 py-4">
            <CardTitle className="font-display font-bold text-sm tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-accent" /> Datos Personales
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Field id="first_name" label="Nombre" value={profile.first_name} placeholder="Tu nombre" />
              <Field id="last_name" label="Apellido" value={profile.last_name} placeholder="Tu apellido" />
            </div>
            <Field id="email" label="Email" value={profile.email} type="email" disabled />
            <p className="text-xs text-muted-foreground -mt-2">El email no se puede modificar</p>
            <Field id="phone" label="Teléfono" value={profile.phone} type="tel" placeholder="+56 9 1234 5678" />
          </CardContent>
        </Card>

        <Card style={{ borderRadius: 0 }} className="border-border">
          <CardHeader className="border-b border-border px-6 py-4">
            <CardTitle className="font-display font-bold text-sm tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent" /> Clínica Miró
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex flex-col gap-4">
            {[
              { icon: Phone, label: "Nuevos pacientes", val: "+56 9 7415 7966" },
              { icon: Phone, label: "Pacientes en tratamiento", val: "+56 9 3557 2986" },
              { icon: Mail, label: "Email", val: "administracion@clinicamiro.cl" },
              { icon: MapPin, label: "Dirección", val: "Av. Nueva Providencia 2214, Of. 189, Providencia" },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="flex gap-3 items-start">
                <Icon className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="font-mono text-[0.65rem] tracking-widest uppercase text-muted-foreground mb-0.5">{label}</p>
                  <p className="font-body text-sm">{val}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}
          className="bg-accent text-accent-foreground font-display font-bold text-xs tracking-widest uppercase flex items-center gap-2"
          style={{ borderRadius: 0, padding: "1rem 2rem", opacity: saving ? 0.6 : 1 }}>
          <Save className="w-3.5 h-3.5" />
          {saving ? "Guardando…" : "Guardar Cambios"}
        </Button>
      </div>
    </div>
  );
};

export default MiPerfil;
