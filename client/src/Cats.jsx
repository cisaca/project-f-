import React from "react";

/* ════════════════════════════════════════════════════════════════
   GATITOS DEL FONDO · todos dibujados a mano en SVG (diseños propios)

   - Gato "low poly": cara y cuerpo hechos de triángulos con distintos tonos.
   - Gatito pan, gatito dormido y gatito espiando (con ojos de reojo).
   - Detalles que los acompañan: huellitas, pescaditos, ovillo, "miau"...

   Los textos de los globitos están en CAT_SAYS (edítalos a tu gusto).
   ════════════════════════════════════════════════════════════════ */

export const CAT_SAYS = ["miau ♡", "mmm… sí", "zzz…", "¿qué miras?"];

// Tonos: [0..3] facetas, [4] orejas/sombra, [5] hocico/patitas
const TONES = {
  orange: ["#ffb36b", "#f59a52", "#e67f3c", "#ffc88e", "#c9622b", "#ffe3c2"],
  lilac: ["#c3a9ff", "#ab8cf5", "#9270e6", "#d7c5ff", "#6f4fc4", "#efe6ff"],
  rose: ["#ffb7cf", "#ff9dbb", "#f27fa4", "#ffd0e0", "#c9547c", "#fff0f5"],
  mint: ["#a6efd0", "#8ae3bf", "#6fd2aa", "#c4f6e0", "#3fa57f", "#eafff5"],
  snow: ["#ffffff", "#f3f0ff", "#e6e0fb", "#ffffff", "#b9aee0", "#ffffff"],
  cream: ["#fffaf0", "#f6ead6", "#ead9bd", "#ffffff", "#cdb892", "#fff6e3"]
};
const toneOf = (name) => TONES[name] || TONES.orange;

const DARK = "#2b1a3a";
const NOSE = "#ff6f91";

/* ───────── Gato low poly ───────── */

const V = [
  [24, 10], [16, 44], [50, 28], [60, 34], [70, 28], [96, 10], [104, 44], [12, 64], [108, 64],
  [40, 44], [80, 44], [60, 52], [30, 74], [90, 74], [60, 64], [48, 76], [72, 76], [60, 90]
];
// [a, b, c, tono]
const FACETS = [
  [0, 1, 2, 4], [5, 6, 4, 4],
  [1, 2, 9, 1], [2, 3, 9, 2], [3, 9, 11, 3], [3, 11, 10, 2], [3, 10, 4, 1], [4, 10, 6, 2],
  [1, 9, 7, 3], [9, 7, 12, 0], [9, 12, 15, 1], [9, 15, 14, 2], [9, 14, 11, 0],
  [11, 14, 10, 1], [10, 14, 16, 3], [10, 16, 13, 1], [10, 13, 8, 0], [10, 8, 6, 3],
  [12, 15, 17, 2], [15, 14, 17, 5], [14, 16, 17, 5], [16, 13, 17, 2]
];
// Cuerpo sentado
const BODY = [
  [[30, 74], [60, 90], [36, 120], 1], [[60, 90], [36, 120], [84, 120], 2], [[60, 90], [90, 74], [84, 120], 0],
  [[30, 74], [36, 120], [16, 120], 3], [[90, 74], [84, 120], [104, 120], 1]
];
// Cola que se mueve
const TAIL = [
  [[98, 118], [114, 104], [104, 92], 2], [[114, 104], [104, 92], [118, 80], 1],
  [[104, 92], [118, 80], [112, 66], 3], [[118, 80], [112, 66], [126, 62], 0]
];

const pts = (arr) => arr.map((p) => p.join(",")).join(" ");

export function LowPolyCat({ tone = "orange", flip = false, className = "" }) {
  const t = toneOf(tone);
  return (
    <svg viewBox="0 0 132 124" className={`cat cat-lowpoly ${className}`} style={flip ? { transform: "scaleX(-1)" } : undefined} aria-hidden="true">
      <g className="cat-tail">
        {TAIL.map(([a, b, c, k], i) => (
          <polygon key={i} points={pts([a, b, c])} fill={t[k]} stroke="rgba(255,255,255,.28)" strokeWidth=".6" strokeLinejoin="round" />
        ))}
      </g>
      {BODY.map(([a, b, c, k], i) => (
        <polygon key={i} points={pts([a, b, c])} fill={t[k]} stroke="rgba(255,255,255,.28)" strokeWidth=".6" strokeLinejoin="round" />
      ))}
      <ellipse cx="44" cy="119" rx="11" ry="5" fill={t[5]} />
      <ellipse cx="76" cy="119" rx="11" ry="5" fill={t[5]} />

      {FACETS.map(([a, b, c, k], i) => (
        <polygon key={i} points={pts([V[a], V[b], V[c]])} fill={t[k]} stroke="rgba(255,255,255,.3)" strokeWidth=".6" strokeLinejoin="round" />
      ))}
      {/* orejas por dentro */}
      <polygon points="26,17 22,38 44,28" fill={NOSE} opacity=".55" />
      <polygon points="94,17 98,38 76,28" fill={NOSE} opacity=".55" />
      {/* ojos */}
      {[41, 79].map((cx) => (
        <g key={cx} className="cat-eye">
          <path d={`M${cx - 9} 47 Q${cx} 38 ${cx + 9} 47 Q${cx} 54 ${cx - 9} 47Z`} fill="#fff" />
          <ellipse cx={cx} cy="47" rx="4" ry="5" fill={DARK} />
          <circle cx={cx + 1.4} cy="45" r="1.4" fill="#fff" />
        </g>
      ))}
      {/* nariz, boca y bigotes */}
      <polygon points="55,61 65,61 60,68" fill={NOSE} />
      <path d="M60 68 L60 72 M60 72 Q55 77 50 73 M60 72 Q65 77 70 73" stroke={DARK} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M34 66 L6 60 M34 70 L6 73 M86 66 L114 60 M86 70 L114 73" stroke="rgba(255,255,255,.85)" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

/* ───────── Gatito pan ───────── */

export function LoafCat({ tone = "lilac", className = "" }) {
  const t = toneOf(tone);
  return (
    <svg viewBox="0 0 150 90" className={`cat cat-loaf ${className}`} aria-hidden="true">
      <path d="M142 80 C152 72 152 58 145 54" stroke={t[2]} strokeWidth="7" strokeLinecap="round" fill="none" className="cat-tail" />
      <path d="M8 88 C4 46 34 22 78 22 C122 22 146 48 142 88 Z" fill={t[0]} />
      <path d="M78 22 L142 88 L100 88 Z" fill={t[1]} opacity=".7" />
      <path d="M78 22 L8 88 L52 88 Z" fill={t[2]} opacity=".35" />
      <polygon points="28,40 32,14 52,28" fill={t[4]} />
      <polygon points="60,28 80,14 86,42" fill={t[4]} />
      <polygon points="33,34 34,20 46,29" fill={NOSE} opacity=".55" />
      <polygon points="66,29 78,20 81,36" fill={NOSE} opacity=".55" />
      <ellipse cx="56" cy="52" rx="32" ry="26" fill={t[3]} />
      <path d="M40 52 Q46 57 52 52 M62 52 Q68 57 74 52" stroke={DARK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <circle cx="36" cy="60" r="5" fill={NOSE} opacity=".4" />
      <circle cx="76" cy="60" r="5" fill={NOSE} opacity=".4" />
      <polygon points="52,57 60,57 56,62" fill={NOSE} />
      <path d="M56 62 Q52 67 48 64 M56 62 Q60 67 64 64" stroke={DARK} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <ellipse cx="40" cy="86" rx="12" ry="5" fill={t[5]} />
      <ellipse cx="72" cy="86" rx="12" ry="5" fill={t[5]} />
    </svg>
  );
}

/* ───────── Gatito dormido ───────── */

export function SleepCat({ tone = "rose", className = "" }) {
  const t = toneOf(tone);
  return (
    <svg viewBox="0 0 150 84" className={`cat cat-sleep ${className}`} aria-hidden="true">
      <path d="M136 56 C152 74 120 82 84 80" stroke={t[2]} strokeWidth="9" strokeLinecap="round" fill="none" />
      <ellipse cx="78" cy="56" rx="62" ry="26" fill={t[0]} />
      <polygon points="78,30 140,60 100,80" fill={t[1]} opacity=".6" />
      <polygon points="78,30 16,60 56,80" fill={t[2]} opacity=".3" />
      <polygon points="18,42 20,22 34,34" fill={t[4]} />
      <polygon points="38,34 50,22 52,44" fill={t[4]} />
      <circle cx="35" cy="54" r="21" fill={t[3]} />
      <path d="M25 54 Q29 58 33 54 M38 54 Q42 58 46 54" stroke={DARK} strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="35" cy="60" r="2.2" fill={NOSE} />
      <ellipse cx="62" cy="76" rx="12" ry="5" fill={t[5]} />
      <g className="zzz" fill={DARK}>
        <text x="58" y="26" fontSize="15" className="z1">z</text>
        <text x="72" y="16" fontSize="19" className="z2">z</text>
        <text x="90" y="8" fontSize="23" className="z3">Z</text>
      </g>
    </svg>
  );
}

/* ───────── Gatito espiando (ojos de reojo) ───────── */

export function PeekCat({ tone = "mint", className = "" }) {
  const t = toneOf(tone);
  return (
    <svg viewBox="0 0 120 84" className={`cat cat-peek ${className}`} aria-hidden="true">
      <polygon points="30,40 32,8 54,26" fill={t[4]} />
      <polygon points="66,26 88,8 90,40" fill={t[4]} />
      <polygon points="35,32 35,17 47,27" fill={NOSE} opacity=".55" />
      <polygon points="73,27 85,17 85,32" fill={NOSE} opacity=".55" />
      <circle cx="60" cy="52" r="32" fill={t[0]} />
      <polygon points="60,20 90,52 60,40" fill={t[1]} opacity=".5" />
      <polygon points="60,20 30,52 60,40" fill={t[2]} opacity=".3" />
      {[46, 74].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy="48" r="10" fill="#fff" />
          <circle cx={cx} cy="48" r="5" fill={DARK} className="pupil" />
        </g>
      ))}
      <polygon points="56,58 64,58 60,63" fill={NOSE} />
      <path d="M60 63 Q56 68 52 65 M60 63 Q64 68 68 65" stroke={DARK} strokeWidth="1.3" fill="none" strokeLinecap="round" />
      <path d="M32 60 L8 55 M32 64 L8 67 M88 60 L112 55 M88 64 L112 67" stroke="rgba(255,255,255,.8)" strokeWidth="1" strokeLinecap="round" />
      {[34, 86].map((cx) => (
        <g key={cx}>
          <ellipse cx={cx} cy="76" rx="15" ry="8" fill={t[3]} stroke={t[2]} strokeWidth="1.2" />
          <path d={`M${cx - 4} 71 V78 M${cx + 4} 71 V78`} stroke={t[2]} strokeWidth="1.2" strokeLinecap="round" />
        </g>
      ))}
    </svg>
  );
}

/* ───────── Detalles pequeños ───────── */

const PAW =
  '<ellipse cx="50" cy="66" rx="22" ry="18"/><circle cx="20" cy="42" r="9"/><circle cx="40" cy="26" r="9.5"/><circle cx="62" cy="26" r="9.5"/><circle cx="82" cy="42" r="9"/>';
const FISH =
  '<ellipse cx="42" cy="30" rx="34" ry="20"/><polygon points="70,30 98,8 98,52"/>';
const HEART = '<path d="M16 28 C16 28 2 18 2 9.5 C2 5 5.5 2 9.5 2 C12.5 2 15 3.8 16 6.5 C17 3.8 19.5 2 22.5 2 C26.5 2 30 5 30 9.5 C30 18 16 28 16 28 Z"/>';
const SPARKLE = '<path d="M50 2 C54 34 66 46 98 50 C66 54 54 66 50 98 C46 66 34 54 2 50 C34 46 46 34 50 2Z"/>';

export const FLOATER_KINDS = {
  heart: { vb: "0 0 32 29", html: HEART },
  sparkle: { vb: "0 0 100 100", html: SPARKLE },
  paw: { vb: "0 0 100 100", html: PAW },
  fish: { vb: "0 0 100 60", html: FISH }
};

export function FloaterShape({ kind }) {
  const k = FLOATER_KINDS[kind] || FLOATER_KINDS.heart;
  return <g dangerouslySetInnerHTML={{ __html: k.html }} />;
}

export function Yarn({ color = "#ff8fb1", className = "" }) {
  return (
    <svg viewBox="0 0 110 70" className={`yarn ${className}`} aria-hidden="true">
      <path d="M52 54 C70 68 84 42 106 58" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
      <g className="yarn-ball">
        <circle cx="30" cy="40" r="25" fill={color} />
        <path d="M10 34 Q30 22 50 34 M7 44 Q30 32 53 44 M14 55 Q30 46 46 55" stroke="rgba(255,255,255,.55)" strokeWidth="2" fill="none" />
        <path d="M22 18 Q36 36 28 64" stroke="rgba(255,255,255,.45)" strokeWidth="2" fill="none" />
      </g>
    </svg>
  );
}

/* ───────── Gatito que se asoma sobre cada hoja ───────── */

const KINDS = ["lowpoly", "loaf", "sleep", "peek"];
const PEEK_TONES = ["orange", "lilac", "rose", "mint"];

export function CatByKind({ kind, tone }) {
  if (kind === "loaf") return <LoafCat tone={tone} />;
  if (kind === "sleep") return <SleepCat tone={tone} />;
  if (kind === "peek") return <PeekCat tone={tone} />;
  return <LowPolyCat tone={tone} />;
}

export function Peeker({ index }) {
  const kind = KINDS[index % KINDS.length];
  const tone = PEEK_TONES[index % PEEK_TONES.length];
  return (
    <div className={`peeker peeker-right peeker-${kind}`} aria-hidden="true">
      <span className="cat-says">{CAT_SAYS[index % CAT_SAYS.length]}</span>
      <CatByKind kind={kind} tone={tone} />
    </div>
  );
}

/* ───────── Gatitos (tus imágenes) que flotan por el fondo ─────────

   Las imágenes están en client/public/gatos/gato-1.png … gato-4.png.
   Cada fila de FLOAT_PICS es un gatito en pantalla: puedes repetir la misma imagen
   cuantas veces quieras o agregar más filas.
     img   → número de imagen (1 a 6)
     size  → ancho en px
     mode  → "rise" (sube flotando) o "cross" (cruza la pantalla de lado a lado)
     left  → posición horizontal en % (solo "rise")
     top   → altura en % (solo "cross")
     dur   → segundos que tarda en cruzar o subir
     delay → arranque; negativo = ya va en camino al abrir
   ───────────────────────────────────────────────────────────────────── */

export const CAT_IMAGE_COUNT = 6;
export const catImageUrl = (n) => `${import.meta.env.BASE_URL}gatos/gato-${n}.png`;

export const FLOAT_PICS = [
  { img: 1, mode: "cross", top: 14, size: 120, dur: 20, delay: -3 },
  { img: 1, mode: "cross", top: 52, size: 96, dur: 26, delay: -15 },
  { img: 1, mode: "cross", top: 80, size: 110, dur: 23, delay: -9 },
  { img: 2, mode: "rise", left: 4, size: 96, dur: 32, delay: -6 },
  { img: 2, mode: "rise", left: 62, size: 80, dur: 38, delay: -22 },
  { img: 3, mode: "rise", left: 18, size: 74, dur: 30, delay: -14 },
  { img: 3, mode: "rise", left: 80, size: 88, dur: 34, delay: -2 },
  { img: 3, mode: "rise", left: 44, size: 64, dur: 40, delay: -28 },
  { img: 4, mode: "rise", left: 30, size: 110, dur: 36, delay: -10 },
  { img: 4, mode: "rise", left: 72, size: 92, dur: 29, delay: -19 },
  { img: 4, mode: "rise", left: 10, size: 84, dur: 42, delay: -33 },
  { img: 5, mode: "rise", left: 24, size: 104, dur: 35, delay: -12 },
  { img: 5, mode: "rise", left: 88, size: 86, dur: 41, delay: -26 },
  { img: 5, mode: "rise", left: 52, size: 96, dur: 31, delay: -5 },
  { img: 6, mode: "rise", left: 8, size: 70, dur: 33, delay: -18 },
  { img: 6, mode: "rise", left: 68, size: 62, dur: 39, delay: -7 },
  { img: 6, mode: "rise", left: 38, size: 76, dur: 28, delay: -24 }
];
