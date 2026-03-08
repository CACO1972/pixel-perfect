import { useState, useRef, useEffect, useCallback } from "react";

interface Props {
  onCapture: (base64: string) => void;
  onClose: () => void;
}

const CameraCapture = ({ onCapture, onClose }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 1280 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => setReady(true);
      }
    } catch {
      setCameraError("No se pudo acceder a la cámara. Verifica los permisos.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const size = Math.min(video.videoWidth, video.videoHeight);
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;

    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d")!;
    // Mirror for selfie
    ctx.translate(1024, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, sx, sy, size, size, 0, 0, 1024, 1024);
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    const base64 = canvas.toDataURL("image/jpeg", 0.92);
    stopCamera();
    onCapture(base64);
  }, [stopCamera, onCapture]);

  const handleCapture = () => {
    setCountdown(3);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setFlash(true);
      setTimeout(() => setFlash(false), 300);
      capturePhoto();
      return;
    }
    const t = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, capturePhoto]);

  if (cameraError) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive font-medium mb-4">{cameraError}</p>
        <button onClick={onClose} className="text-accent underline text-[0.9rem]">Volver</button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Camera viewport */}
      <div className="relative w-full aspect-square overflow-hidden bg-foreground/5 border border-border">
        {/* Video feed — mirrored for selfie */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
          style={{ transform: "scaleX(-1)" }}
        />

        {/* Professional overlay guides */}
        {ready && (
          <svg
            viewBox="0 0 400 400"
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Dark vignette corners */}
            <defs>
              <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
                <stop offset="60%" stopColor="transparent" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
              </radialGradient>
              <mask id="frameMask">
                <rect width="400" height="400" fill="white" />
                <ellipse cx="200" cy="185" rx="135" ry="165" fill="black" />
              </mask>
            </defs>

            {/* Darkened area outside face oval */}
            <rect width="400" height="400" fill="rgba(0,0,0,0.45)" mask="url(#frameMask)" />

            {/* Face oval guide */}
            <ellipse
              cx="200" cy="185" rx="135" ry="165"
              fill="none"
              stroke="hsl(34,38%,63%)"
              strokeWidth="1.5"
              strokeDasharray="6 4"
              opacity="0.8"
            />

            {/* Vertical midline */}
            <line
              x1="200" y1="20" x2="200" y2="380"
              stroke="hsl(34,38%,63%)"
              strokeWidth="0.5"
              strokeDasharray="3 6"
              opacity="0.5"
            />

            {/* Horizontal proportion lines */}
            {/* Eyes line */}
            <line
              x1="60" y1="155" x2="340" y2="155"
              stroke="hsl(34,38%,63%)"
              strokeWidth="0.5"
              strokeDasharray="3 6"
              opacity="0.35"
            />
            {/* Nose line */}
            <line
              x1="100" y1="220" x2="300" y2="220"
              stroke="hsl(34,38%,63%)"
              strokeWidth="0.5"
              strokeDasharray="3 6"
              opacity="0.35"
            />
            {/* Smile line — emphasized */}
            <line
              x1="80" y1="270" x2="320" y2="270"
              stroke="hsl(34,38%,63%)"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.6"
            />

            {/* Smile zone bracket */}
            <rect
              x="110" y="245" width="180" height="60" rx="8"
              fill="none"
              stroke="hsl(34,38%,63%)"
              strokeWidth="1.2"
              opacity="0.5"
            />

            {/* Corner brackets — top-left */}
            <path d="M30 60 L30 30 L60 30" fill="none" stroke="white" strokeWidth="2" opacity="0.7" />
            {/* top-right */}
            <path d="M340 30 L370 30 L370 60" fill="none" stroke="white" strokeWidth="2" opacity="0.7" />
            {/* bottom-left */}
            <path d="M30 340 L30 370 L60 370" fill="none" stroke="white" strokeWidth="2" opacity="0.7" />
            {/* bottom-right */}
            <path d="M340 370 L370 370 L370 340" fill="none" stroke="white" strokeWidth="2" opacity="0.7" />

            {/* Smile label */}
            <text
              x="200" y="320"
              textAnchor="middle"
              fill="hsl(34,38%,63%)"
              fontSize="9"
              fontFamily="var(--font-display)"
              letterSpacing="0.15em"
              opacity="0.7"
            >
              ZONA SONRISA
            </text>

            {/* Crosshair center dot */}
            <circle cx="200" cy="185" r="3" fill="none" stroke="hsl(34,38%,63%)" strokeWidth="0.8" opacity="0.5" />
            <circle cx="200" cy="185" r="1" fill="hsl(34,38%,63%)" opacity="0.5" />
          </svg>
        )}

        {/* SCANDENT branding on camera */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-status-success rounded-full animate-pulse" />
          <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-white/70 drop-shadow-md">
            SCANDENT · LIVE
          </span>
        </div>
        <div className="absolute top-3 right-3 z-20">
          <span className="font-mono text-[9px] tracking-[0.12em] uppercase text-white/50 drop-shadow-md">
            1024 × 1024
          </span>
        </div>

        {/* Countdown overlay */}
        {countdown !== null && countdown > 0 && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-foreground/20 backdrop-blur-sm">
            <span className="font-display font-[900] text-[5rem] text-white drop-shadow-2xl animate-pulse">
              {countdown}
            </span>
          </div>
        )}

        {/* Flash effect */}
        {flash && (
          <div className="absolute inset-0 z-40 bg-white animate-[flashFade_0.3s_ease-out_forwards]" />
        )}

        {/* Loading skeleton */}
        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center bg-secondary">
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="font-display text-[0.8rem] text-mid-gray">Iniciando cámara...</p>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <p className="text-center text-[0.75rem] text-mid-gray mt-3 mb-4 leading-relaxed">
        Alinea tu rostro dentro del óvalo · Muestra los dientes con sonrisa natural
      </p>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-mid-gray hover:text-foreground hover:border-foreground/30 transition-colors"
          title="Cancelar"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <button
          onClick={handleCapture}
          disabled={!ready || countdown !== null}
          className="w-[72px] h-[72px] rounded-full bg-accent flex items-center justify-center disabled:opacity-40 transition-all hover:scale-105 active:scale-95 shadow-lg relative"
          title="Capturar"
        >
          {/* Outer ring */}
          <span className="absolute inset-0 rounded-full border-[3px] border-accent-foreground/30" />
          <span className="w-[56px] h-[56px] rounded-full bg-accent-foreground/90 flex items-center justify-center">
            <svg className="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="4" />
              <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
        </button>

        <div className="w-12 h-12" /> {/* Spacer for symmetry */}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
