
export type SmileMetrics = {
  smileArc: "consonante" | "plano" | "inverso";
  gingival: { mm: number; class: "baja" | "media" | "alta" };
  midline: { mm: number; side: "izquierda" | "derecha" | "centrado" };
  buccalRatio: number; // 0..1
};

const d = (a:any, b:any) => Math.hypot(a.x - b.x, a.y - b.y);

function toMM(norm: number, ipdNorm: number) {
  const IPD_MM = 63;
  return (norm / ipdNorm) * IPD_MM;
}

export function computeMetrics(params: {
  restLm: any[]; smileLm: any[]; imgW: number; imgH: number;
}): SmileMetrics {
  const { smileLm } = params;
  const LEFT_EYE_OUT = 33, RIGHT_EYE_OUT = 263;
  const MOUTH_LEFT = 61, MOUTH_RIGHT = 291;
  const UPPER_LIP = 13, LOWER_LIP = 14;
  const NOSE_TIP = 1;

  const eyeL = smileLm[LEFT_EYE_OUT], eyeR = smileLm[RIGHT_EYE_OUT];
  const mouthL = smileLm[MOUTH_LEFT], mouthR = smileLm[MOUTH_RIGHT];
  const upper = smileLm[UPPER_LIP], lower = smileLm[LOWER_LIP];
  const nose = smileLm[NOSE_TIP];

  const ipd = d(eyeL, eyeR) || 1e-6;

  const centerX = (mouthL.x + mouthR.x) / 2;
  const dx = nose.x - centerX;
  const midlineMM = Math.abs(toMM(Math.abs(dx), ipd));
  const side = Math.abs(dx) < 0.003 ? "centrado" : (dx > 0 ? "derecha" : "izquierda");

  const yCorners = (mouthL.y + mouthR.y) / 2;
  const delta = (upper.y - yCorners) / (1/ipd);
  let smileArc: SmileMetrics["smileArc"];
  if (delta > 0.5) smileArc = "consonante";
  else if (delta < -0.2) smileArc = "inverso";
  else smileArc = "plano";

  const lipOpen = d(upper, lower);
  const gingMM = Math.max(0, toMM(lipOpen - 0.012, ipd));
  const gingClass = gingMM < 1 ? "baja" : gingMM < 3 ? "media" : "alta";

  const mouthW = d(mouthL, mouthR);
  const faceW = d(eyeL, eyeR) * 2.8;
  const buccalRatio = Math.min(1, mouthW / faceW);

  return {
    smileArc,
    gingival: { mm: gingMM, class: gingClass },
    midline: { mm: midlineMM, side },
    buccalRatio
  };
}

export function drawOverlay(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  lm: any[],
  m: SmileMetrics
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height);

  const dots = [33, 263, 61, 291, 13, 14, 1];
  ctx.lineWidth = 2; ctx.strokeStyle = "rgba(0,200,255,0.9)"; ctx.fillStyle = "rgba(0,200,255,0.9)";
  dots.forEach(i => {
    const p = lm[i];
    ctx.beginPath();
    ctx.arc(p.x * ctx.canvas.width, p.y * ctx.canvas.height, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  const nose = lm[1]; const mouthL = lm[61]; const mouthR = lm[291];
  const cx = ((mouthL.x + mouthR.x) / 2) * ctx.canvas.width;
  ctx.strokeStyle = "rgba(255,180,0,0.9)";
  ctx.beginPath();
  ctx.moveTo(nose.x * ctx.canvas.width, nose.y * ctx.canvas.height);
  ctx.lineTo(cx, lm[13].y * ctx.canvas.height);
  ctx.stroke();

  ctx.fillStyle = "white";
  ctx.font = "12px system-ui";
  ctx.fillText(`Arc: ${m.smileArc}`, 10, 18);
  ctx.fillText(`Ging: ${m.gingival.mm.toFixed(1)}mm (${m.gingival.class})`, 10, 34);
  ctx.fillText(`Midline: ${m.midline.mm.toFixed(1)}mm ${m.midline.side}`, 10, 50);
  ctx.fillText(`Buccal: ${Math.round(m.buccalRatio*100)}%`, 10, 66);
}
