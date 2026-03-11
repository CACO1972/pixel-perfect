export type Input = {
  age: number;
  smoker: "no" | "moderado" | "intenso";
  diabetes: "no" | "controlada" | "descontrolada";
  bruxism: "ausente" | "controlado" | "severo";
  lossTime: "reciente" | "intermedio" | "prolongado";
  hygiene: "excelente" | "buena" | "regular" | "deficiente";
  zone: "anterior_superior" | "posterior_superior" | "anterior_inferior" | "posterior_inferior";
  cause: "trauma" | "caries" | "periodontal" | "congenita";
  oralStatus: "sano" | "caries_menores" | "periodontal" | "multiples";
  prevExp: "sin" | "exitosa" | "complicaciones";
  motivation: "alta" | "moderada" | "baja";
  confidenceAvg?: number; // 0..1 (opcional)
};

const BASE = 0.88;

const W = {
  smoker: { no: 1.00, moderado: 0.85, intenso: 0.70 },
  diabetes: { no: 1.00, controlada: 0.82, descontrolada: 0.58 },
  bruxism: { ausente: 1.00, controlado: 0.88, severo: 0.68 },
  lossTime: { reciente: 1.00, intermedio: 0.90, prolongado: 0.78 },
  hygiene: { excelente: 1.08, buena: 1.00, regular: 0.80, deficiente: 0.62 },
  zone: { anterior_superior: 1.00, posterior_superior: 0.85, anterior_inferior: 0.92, posterior_inferior: 0.78 },
  cause: { trauma: 1.00, caries: 0.88, periodontal: 0.72, congenita: 0.95 },
  oralStatus: { sano: 1.00, caries_menores: 0.88, periodontal: 0.65, multiples: 0.52 },
  prevExp: { sin: 1.00, exitosa: 1.12, complicaciones: 0.75 },
  ageGroup: { joven: 1.05, adulto: 1.00, mayor: 0.88 },
  motivation: { alta: 1.08, moderada: 1.00, baja: 0.85 }
} as const;

function ageToGroup(age: number): keyof typeof W.ageGroup {
  if (age <= 35) return "joven";
  if (age <= 60) return "adulto";
  return "mayor";
}

type Contribution = { key: string; weight: number; effectPct: number };

function clamp(x:number, lo:number, hi:number){ return Math.max(lo, Math.min(hi, x)); }

function confidenceAdjust(avg?: number){
  if (avg == null) return 1.0;
  if (avg < 0.70) return 0.93; // ajuste automático si confianza <70%
  if (avg < 0.85) return 0.97;
  return 1.00;
}

type Synergy = { id:string; factor:number; when:(i:Input)=>boolean; rationale:string };

const S: Synergy[] = [
  { id:"vascular", factor:0.75, rationale:"Fumador intenso + Diabetes descontrolada", when:(i)=> i.smoker==="intenso" && i.diabetes==="descontrolada" },
  { id:"infeccioso1", factor:0.80, rationale:"Fumador intenso + Enfermedad periodontal", when:(i)=> i.smoker==="intenso" && i.oralStatus==="periodontal" },
  { id:"mecanico", factor:0.82, rationale:"Bruxismo severo + Posterior inferior", when:(i)=> i.bruxism==="severo" && i.zone==="posterior_inferior" },
  { id:"inmunologico", factor:0.70, rationale:"Diabetes descontrolada + Enfermedad periodontal", when:(i)=> i.diabetes==="descontrolada" && i.oralStatus==="periodontal" },
  { id:"infeccioso2", factor:0.78, rationale:"Higiene deficiente + Causa periodontal", when:(i)=> i.hygiene==="deficiente" && i.cause==="periodontal" },
  { id:"anatomico", factor:0.85, rationale:"Tiempo prolongado + Posterior superior", when:(i)=> i.lossTime==="prolongado" && i.zone==="posterior_superior" },
  { id:"multifactorial", factor:0.88, rationale:"Fumador intenso + Bruxismo severo", when:(i)=> i.smoker==="intenso" && i.bruxism==="severo" },
  { id:"sistemico", factor:0.80, rationale:"Edad mayor + Múltiples problemas", when:(i)=> (i.age>60) && i.oralStatus==="multiples" }
];

export type Output = {
  prob: number;               // 0..1
  level: 1|2|3|4|5;
  contributions: Contribution[];
  synergies: { id:string; factor:number; rationale:string }[];
  message: string;
};

export function scoreImplantX(i: Input): Output {
  const ageG = ageToGroup(i.age);
  const weights = [
    ["smoker", W.smoker[i.smoker]],
    ["diabetes", W.diabetes[i.diabetes]],
    ["bruxism", W.bruxism[i.bruxism]],
    ["lossTime", W.lossTime[i.lossTime]],
    ["hygiene", W.hygiene[i.hygiene]],
    ["zone", W.zone[i.zone]],
    ["cause", W.cause[i.cause]],
    ["oralStatus", W.oralStatus[i.oralStatus]],
    ["prevExp", W.prevExp[i.prevExp]],
    ["age", W.ageGroup[ageG]],
    ["motivation", W.motivation[i.motivation]],
  ] as const;

  let prod = BASE;
  const contributions: Contribution[] = [];
  for (const [k, w] of weights) {
    prod *= w;
    contributions.push({ key: k, weight: w, effectPct: Math.round((w-1)*100) });
  }

  const usedSynergies = S.filter(s => s.when(i)).map(s=>({ id:s.id, factor:s.factor, rationale:s.rationale }));
  for (const s of usedSynergies) prod *= s.factor;

  // Ajuste por confianza promedio (opcional)
  prod *= confidenceAdjust(i.confidenceAvg);

  // Clamp
  const p = clamp(prod, 0.25, 0.98);

  let level: 1|2|3|4|5 = 5;
  if (p >= 0.85) level = 1;
  else if (p >= 0.75) level = 2;
  else if (p >= 0.65) level = 3;
  else if (p >= 0.50) level = 4;
  else level = 5;

  const message =
    level === 1 ? "Condiciones muy favorables." :
    level === 2 ? "Condiciones favorables." :
    level === 3 ? "Condiciones moderadas, conviene optimizar algunos factores." :
    level === 4 ? "Requiere preparación previa y control de riesgos." :
    "Caso complejo: se recomienda preparación y evaluación clínica detallada.";

  return { prob: p, level, contributions, synergies: usedSynergies, message };
}
