/**
 * AsesorVirtual — Portal Paciente · Clínica Miró
 * Chat con Claude (claude-sonnet-4-20250514) via Anthropic API
 * Sistema: asistente de Clínica Miró, solo responde sobre la clínica
 * Sin altan-auth — usa supabase oficial para sesión
 */
import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Bot, User, Phone, Calendar, HelpCircle } from "lucide-react";
import { format } from "date-fns";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SYSTEM_PROMPT = `Eres el asesor virtual de Clínica Miró, una clínica dental de alta especialización en Santiago de Chile. Tu nombre es Miró.

INFORMACIÓN CLAVE:
- Dirección: Av. Nueva Providencia 2214, Oficina 189, Providencia, Santiago (Metro Los Leones)
- Teléfono nuevos pacientes: +56 9 7415 7966
- Teléfono pacientes en tratamiento: +56 9 3557 2986
- Email: administracion@clinicamiro.cl
- Horario: Lunes a Viernes 9:00–18:00
- Agenda online: https://ff.healthatom.io/41knMr
- Evaluación dental con IA: $49.000 CLP (90 min, Informe Clarity incluido)

PROGRAMAS:
- MIRO ONE: Implantes desde $2.800.000 CLP
- REVIVE: Rehabilitación oral estética desde $1.500.000 CLP
- ALIGN: Ortodoncia desde $1.200.000 CLP
- ZERO CARIES: Prevención familiar desde $350.000 CLP

HUMANA.AI: Ecosistema de 7 apps de IA dental. SCANDENT (pre-diagnóstico), ImplantX (riesgo implantes), Simetría (análisis facial), Armonía (diseño sonrisa), ZeroCaries, Copilot (plan tratamiento), Sentia.

REGLAS:
- Responde siempre en español
- Sé conciso y útil — máximo 4 párrafos cortos
- Para emergencias, indica llamar al +56 9 7415 7966 inmediatamente
- No inventes precios, diagnósticos ni horarios que no estén arriba
- Si no sabes algo, di "Te recomiendo contactar directamente a la clínica"
- No uses markdown pesado, escribe natural`;

const AsesorVirtual = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: "Hola, soy Miró, el asistente virtual de Clínica Miró. Puedo ayudarte con información sobre citas, tratamientos, precios y más. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date(),
    }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { id: `u_${Date.now()}`, role: "user", content: input.trim(), timestamp: new Date() };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 600,
          system: SYSTEM_PROMPT,
          messages: history
            .filter(m => m.id !== "welcome")
            .map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      const text = data.content?.find((b: any) => b.type === "text")?.text ?? "Lo siento, hubo un error. Intenta de nuevo.";

      setMessages([...history, {
        id: `a_${Date.now()}`,
        role: "assistant",
        content: text,
        timestamp: new Date(),
      }]);
    } catch {
      setMessages([...history, {
        id: `err_${Date.now()}`,
        role: "assistant",
        content: "Error de conexión. Para atención inmediata llama al +56 9 7415 7966.",
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const QUICK = [
    { icon: Calendar, label: "Agendar cita",       msg: "Quiero agendar una cita" },
    { icon: Phone,    label: "Emergencia dental",   msg: "Tengo dolor dental urgente" },
    { icon: HelpCircle, label: "Precios y programas", msg: "¿Cuáles son los precios de los tratamientos?" },
  ];

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 4 }}>Portal Paciente</p>
        <h1 style={{ fontFamily: "var(--font-s)", fontWeight: 300, fontSize: "clamp(1.8rem,4vw,2.5rem)", lineHeight: 1.1 }}>Asesor Virtual</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1.5rem", alignItems: "start" }}>
        {/* Chat */}
        <Card style={{ borderRadius: 0, border: "1px solid var(--border)", display: "flex", flexDirection: "column", height: 580 }}>
          <CardHeader style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)" }}>
            <CardTitle style={{ fontFamily: "var(--font-d)", fontWeight: 700, fontSize: ".9rem", letterSpacing: ".05em", display: "flex", alignItems: "center", gap: "8px" }}>
              <MessageCircle style={{ width: 16, height: 16, color: "var(--accent)" }} />
              Asistente Miró
              <span style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4, fontFamily: "monospace", fontSize: ".65rem", letterSpacing: ".1em", textTransform: "uppercase", color: "#059669" }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#059669", display: "inline-block" }} />
                En línea
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent style={{ flex: 1, overflow: "hidden", padding: 0, display: "flex", flexDirection: "column" }}>
            <ScrollArea style={{ flex: 1, padding: "1.25rem 1.5rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {messages.map(m => (
                  <div key={m.id} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", gap: "8px" }}>
                    {m.role === "assistant" && (
                      <div style={{ width: 32, height: 32, border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: "var(--secondary)" }}>
                        <Bot style={{ width: 14, height: 14, color: "var(--accent)" }} />
                      </div>
                    )}
                    <div style={{
                      maxWidth: "78%", padding: ".75rem 1rem",
                      background: m.role === "user" ? "var(--accent)" : "var(--secondary)",
                      color: m.role === "user" ? "var(--accent-fg)" : "var(--fg)",
                      border: "1px solid " + (m.role === "user" ? "transparent" : "var(--border)"),
                    }}>
                      <p style={{ fontFamily: "var(--font-b)", fontSize: ".875rem", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{m.content}</p>
                      <span style={{ fontFamily: "monospace", fontSize: ".6rem", opacity: .6, marginTop: 4, display: "block" }}>
                        {format(m.timestamp, "HH:mm")}
                      </span>
                    </div>
                    {m.role === "user" && (
                      <div style={{ width: 32, height: 32, border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: "var(--accent)" }}>
                        <User style={{ width: 14, height: 14, color: "var(--accent-fg)" }} />
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <div style={{ width: 32, height: 32, border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--secondary)" }}>
                      <Bot style={{ width: 14, height: 14, color: "var(--accent)" }} />
                    </div>
                    <div style={{ background: "var(--secondary)", border: "1px solid var(--border)", padding: ".75rem 1rem", display: "flex", gap: 4 }}>
                      {[0, .15, .3].map(d => (
                        <span key={d} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", display: "inline-block", animation: `pulse-dot 1.2s ${d}s ease-in-out infinite` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div style={{ padding: "1rem 1.5rem", borderTop: "1px solid var(--border)", display: "flex", gap: "8px" }}>
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendMessage())}
                placeholder="Escribe tu consulta…"
                disabled={loading}
                style={{ borderRadius: 0, fontFamily: "var(--font-b)", flex: 1 }}
              />
              <Button onClick={sendMessage} disabled={loading || !input.trim()}
                style={{ borderRadius: 0, background: "var(--accent)", color: "var(--accent-fg)", border: "none", padding: ".75rem 1.25rem" }}>
                <Send style={{ width: 14, height: 14 }} />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar acciones rápidas */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", minWidth: 180 }}>
          <p style={{ fontFamily: "monospace", fontSize: ".65rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--mid)" }}>Consultas rápidas</p>
          {QUICK.map(q => (
            <button key={q.label} onClick={() => setInput(q.msg)}
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: ".875rem 1rem", border: "1px solid var(--border)", background: "var(--bg)", cursor: "pointer", fontFamily: "var(--font-b)", fontSize: ".8rem", textAlign: "left", transition: "border-color .2s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--accent)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}>
              <q.icon style={{ width: 14, height: 14, color: "var(--accent)", flexShrink: 0 }} />
              {q.label}
            </button>
          ))}

          <div style={{ marginTop: "1rem", padding: "1rem", border: "1px solid var(--border)", background: "var(--secondary)" }}>
            <p style={{ fontFamily: "monospace", fontSize: ".65rem", letterSpacing: ".12em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "8px" }}>Contacto directo</p>
            <a href="https://wa.me/56974157966" target="_blank" rel="noopener noreferrer"
              style={{ display: "block", fontFamily: "var(--font-b)", fontSize: ".8rem", color: "var(--fg)", marginBottom: 4 }}>
              +56 9 7415 7966
            </a>
            <p style={{ fontFamily: "monospace", fontSize: ".65rem", color: "var(--mid)" }}>Lun–Vie 9:00–18:00</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AsesorVirtual;
