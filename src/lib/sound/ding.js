// Campanita de mostrador (sonido de "servicio" de panadería) al agregar al pedido.
// Sintetizada con Web Audio API: sin archivos, liviana, y se dispara dentro del
// gesto del usuario (click), así cumple la política de autoplay del navegador.
let ctx = null;

export function playDing() {
  if (typeof window === "undefined") return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = ctx || new AC();
    if (ctx.state === "suspended") ctx.resume();

    const now = ctx.currentTime;
    // Dos toques tipo campana (ding-ding) alegre.
    const tonos = [
      { f: 988, t: 0 },     // Si
      { f: 1319, t: 0.085 }, // Mi
    ];
    for (const { f, t } of tonos) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = f;
      gain.gain.setValueAtTime(0.0001, now + t);
      gain.gain.exponentialRampToValueAtTime(0.22, now + t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.38);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + t);
      osc.stop(now + t + 0.4);
    }
  } catch {
    /* sin sonido si el navegador lo bloquea */
  }
}
