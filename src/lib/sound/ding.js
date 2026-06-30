// Sonidos de la panadería, sintetizados con Web Audio API (sin archivos externos).
// Cálidos y suaves (senoidales, volumen bajo). Se disparan dentro de un gesto del
// usuario (click) → cumplen la política de autoplay.
//   playDing()  → campanita al AGREGAR
//   playEnviar()→ arpegio de confirmación al ENVIAR
//   playVaciar()→ barrido descendente al VACIAR
//   playMas()/playMenos() → blips al subir/bajar cantidad/comensales
//   playQuitar()→ "tick" al quitar un ítem
//   playAbrir()/playCerrar() → barridos al abrir/minimizar el carrito
//   playTap()   → click genérico de botón (muy sutil)
//   playHover() → hover sobre un ítem (apenas perceptible)
let ctx = null;

function getCtx() {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = ctx || new AC();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

// Tonos discretos: [{ f, t, dur, vol, type }]
function tocar(notas) {
  const ac = getCtx();
  if (!ac) return;
  const now = ac.currentTime;
  for (const n of notas) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = n.type || "sine";
    osc.frequency.value = n.f;
    const dur = n.dur ?? 0.4;
    const vol = n.vol ?? 0.1;
    gain.gain.setValueAtTime(0.0001, now + n.t);
    gain.gain.exponentialRampToValueAtTime(vol, now + n.t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + n.t + dur);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(now + n.t);
    osc.stop(now + n.t + dur + 0.02);
  }
}

// Barrido de frecuencia (glissando).
function barrido({ from, to, dur = 0.35, vol = 0.1, type = "sine" }) {
  const ac = getCtx();
  if (!ac) return;
  const now = ac.currentTime;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, now);
  osc.frequency.exponentialRampToValueAtTime(to, now + dur);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(vol, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(now);
  osc.stop(now + dur + 0.02);
}

const safe = (fn) => {
  try {
    fn();
  } catch {
    /* navegador bloquea audio */
  }
};

// Campanita cálida (dos toques con armónico de octava) al agregar.
export const playDing = () =>
  safe(() =>
    tocar([
      { f: 880, t: 0, vol: 0.09 },
      { f: 1760, t: 0, vol: 0.033 },
      { f: 1175, t: 0.1, vol: 0.09 },
    ])
  );

// Arpegio ascendente de confirmación (Do-Mi-Sol-Do) al enviar.
export const playEnviar = () =>
  safe(() =>
    tocar([
      { f: 523.25, t: 0, dur: 0.32 },
      { f: 659.25, t: 0.1, dur: 0.32 },
      { f: 783.99, t: 0.2, dur: 0.36 },
      { f: 1046.5, t: 0.32, dur: 0.6, vol: 0.12 },
    ])
  );

// Barrido descendente al vaciar.
export const playVaciar = () => safe(() => barrido({ from: 660, to: 180, dur: 0.32 }));

// Blip ascendente / descendente para cantidad/comensales.
export const playMas = () =>
  safe(() => tocar([{ f: 740, t: 0, dur: 0.16 }, { f: 988, t: 0.06, dur: 0.18 }]));
export const playMenos = () =>
  safe(() => tocar([{ f: 660, t: 0, dur: 0.16 }, { f: 494, t: 0.06, dur: 0.18 }]));

// Quitar un ítem (papelera): "tick" corto y seco.
export const playQuitar = () =>
  safe(() => tocar([{ f: 392, t: 0, dur: 0.12, vol: 0.085, type: "triangle" }]));

// Abrir / cerrar (minimizar) el carrito: barridos suaves opuestos.
export const playAbrir = () => safe(() => barrido({ from: 240, to: 540, dur: 0.18, vol: 0.08 }));
export const playCerrar = () => safe(() => barrido({ from: 540, to: 240, dur: 0.18, vol: 0.08 }));

// Click genérico de botón: "tap" muy corto y sutil.
export const playTap = () =>
  safe(() => tocar([{ f: 600, t: 0, dur: 0.05, vol: 0.04, type: "triangle" }]));

// Hover sobre un ítem: aún más sutil (apenas perceptible).
export const playHover = () =>
  safe(() => tocar([{ f: 1100, t: 0, dur: 0.035, vol: 0.035, type: "sine" }]));
