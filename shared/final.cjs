// Lógica de la puerta final (compartida por el servidor local y por la función de Vercel).
// La carta y las pistas viven en secret/final.json y SOLO salen del servidor cuando llega su hora.

const fs = require("fs");
const path = require("path");

const DAY = 86400000;

function loadConfig() {
  const file = path.join(__dirname, "..", "secret", "final.json");
  let cfg;
  try {
    cfg = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    cfg = require("../secret/final.json"); // respaldo (Vercel lo incluye por vercel.json)
  }
  // Se puede cambiar la hora sin tocar archivos: variable de entorno FINAL_OPENS_AT (ISO con zona).
  const opensAt = Date.parse(process.env.FINAL_OPENS_AT || cfg.opensAt);
  if (Number.isNaN(opensAt)) throw new Error("opensAt inválido en secret/final.json");
  return { ...cfg, opensAtMs: opensAt };
}

// "5d" | "3h" | "40m" | "12s" → milisegundos
function parseOffset(text) {
  const m = /^(\d+)([dhms])$/.exec(text || "");
  if (!m) return null;
  return Number(m[1]) * { d: DAY, h: 3600000, m: 60000, s: 1000 }[m[2]];
}

function previewAllowed() {
  return process.env.FINAL_ALLOW_PREVIEW === "1" || process.env.NODE_ENV !== "production";
}

/**
 * preview (solo local o con FINAL_ALLOW_PREVIEW=1):
 *   "open"  → simula que ya llegó el día
 *   "5d"    → simula que faltan 5 días (también h, m, s)
 */
function buildPayload(preview) {
  const cfg = loadConfig();
  let now = Date.now();
  let previewing = false;

  if (preview && previewAllowed()) {
    if (preview === "open") now = cfg.opensAtMs + 1000;
    else {
      const off = parseOffset(preview);
      if (off !== null) now = cfg.opensAtMs - off;
    }
    previewing = true;
  }

  const open = now >= cfg.opensAtMs;
  const clues = (cfg.clues || [])
    .slice()
    .sort((a, b) => b.daysBefore - a.daysBefore)
    .map((c) => {
      const unlocked = now >= cfg.opensAtMs - c.daysBefore * DAY;
      return unlocked ? { daysBefore: c.daysBefore, unlocked, text: c.text } : { daysBefore: c.daysBefore, unlocked };
    });

  return {
    now,
    opensAt: cfg.opensAtMs,
    open,
    preview: previewing,
    teaser: cfg.teaser || "",
    clues,
    letter: open ? cfg.letter : null
  };
}

module.exports = { buildPayload };
