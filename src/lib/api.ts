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
  rut?: string;
  urlReturn?: string;
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

export interface ImplantXScore {
  nivel: 1 | 2 | 3 | 4 | 5;
  etiqueta: string;
  score: number;
  factores: string[];
  recomendacion: string;
  viable: boolean;
}

export interface DentalAnalysis {
  analisisValido: boolean;
  mensajeGeneral: string;
  hallazgos: DentalHallazgo[];
  estadoGeneral: string;
  recomendacion: string;
  proximosPasos: string[];
  calidadImagen: string;
  ausenciaDental?: boolean;
  riesgoImplante?: { detectado: boolean; notas: string };
  implantxScore?: ImplantXScore;
}

export const analyzeDental = (
  imageBase64: string,
  wizardData?: Record<string, unknown>,
) => post<DentalAnalysis>("analyze-dental", { imageBase64, wizardData });

// Dentalink proxy
export const dentalinkProxy = (action: string, params?: Record<string, unknown>) =>
  post("dentalink-proxy", { action, ...(params ? { params } : {}) });
