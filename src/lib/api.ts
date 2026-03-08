const BASE_URL = "https://jipldlklzobiytkvxokf.supabase.co/functions/v1";

async function post<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${BASE_URL}/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res.json();
}

// WhatsApp
export const notifyStaff = (message: string) =>
  post("whatsapp-send", { notify_staff: true, staff_message: message });

export const sendWhatsApp = (to: string, message: string) =>
  post("whatsapp-send", { to, message });

// Flow.cl Payment
export interface FlowPaymentResponse {
  url: string;
  token: string;
}

export const createPayment = (data: {
  email: string;
  amount: number;
  subject: string;
  commerceOrder: string;
  nombre: string;
  telefono: string;
}) => post<FlowPaymentResponse>("flow-create-payment", data);

// Dental photo analysis
export interface DentalHallazgo {
  tipo: string;
  confianza: string;
  severidad: string;
  descripcion: string;
  ubicacion: string;
  recomendacionEspecifica: string;
}

export interface DentalAnalysis {
  analisisValido: boolean;
  mensajeGeneral: string;
  hallazgos: DentalHallazgo[];
  estadoGeneral: string;
  recomendacion: string;
  proximosPasos: string[];
  calidadImagen: string;
}

export const analyzeDental = (imageBase64: string) =>
  post<DentalAnalysis>("analyze-dental", { imageBase64 });

// Dentalink proxy
export const dentalinkProxy = (action: string, params?: Record<string, unknown>) =>
  post("dentalink-proxy", { action, ...(params ? { params } : {}) });
