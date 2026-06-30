// Sonidos de la panadería, sintetizados con Web Audio API (sin archivos).
// Se disparan dentro de un gesto del usuario (click), así pasan la política de
// autoplay del navegador.
//   playDing()   → campanita de mostrador al AGREGAR al pedido.
//   playEnviar() → arpegio ascendente de confirmación al ENVIAR por WhatsApp.
let ctx = null;

function getCtx() {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = ctx || new AC();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

// Reproduce una secuencia de tonos [{ f, t, dur, vol, type }].
function tocar(notas) {
  const ac = getCtx();
  if (!ac) return;
  const now = ac.currentTime;
  for (const n of notas) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = n.type || "triangle";
    osc.frequency.value = n.f;
    const dur = n.dur ?? 0.38;
    const vol = n.vol ?? 0.22;
    gain.gain.setValueAtTime(0.0001, now + n.t);
    gain.gain.exponentialRampToValueAtTime(vol, now + n.t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + n.t + dur);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(now + n.t);
    osc.stop(now + n.t + dur + 0.02);
  }
}

// Campanita de mostrador (ding-ding) al agregar.
export function playDing() {
  try {
    tocar([
      { f: 988, t: 0 },
      { f: 1319, t: 0.085 },
    ]);
  } catch {
    /* sin sonido si el navegador lo bloquea */
  }
}

// Arpegio ascendente de confirmación (Do-Mi-Sol-Do) al enviar el pedido.
export function playEnviar() {
  try {
    tocar([
      { f: 523.25, t: 0, type: "sine", dur: 0.3 },
      { f: 659.25, t: 0.1, type: "sine", dur: 0.3 },
      { f: 783.99, t: 0.2, type: "sine", dur: 0.35 },
      { f: 1046.5, t: 0.32, type: "sine", dur: 0.55, vol: 0.26 },
    ]);
  } catch {
    /* sin sonido si el navegador lo bloquea */
  }
}
