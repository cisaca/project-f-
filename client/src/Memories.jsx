import React from "react";
import { Camera, X } from "lucide-react";
import { FLOATER_KINDS, FLOAT_PICS, FloaterShape, Peeker, catImageUrl } from "./Cats.jsx";
import { markDone } from "./progress.js";
import "./memories.css";

/* ════════════════════════════════════════════════════════════════
   CARTITA 2 · RECUERDOS  (collage tipo scrapbook)

   CÓMO PONER TUS FOTOS
   Copia tus fotos a  client/public/recuerdos/  con los nombres
   1.jpg, 2.jpg, 3.jpg …  Cada foto del collage usa un número
   (campo `n`). Si una foto no existe, se muestra un marco rosa
   con una cámara, así que puedes ir llenándolas de a poco.

   CÓMO EDITAR TEXTOS Y ACOMODO
   Todo está en MEMORY_PAGES más abajo. Cada elemento tiene:
     x, y  → posición en % dentro de la hoja
     w     → ancho en % de la hoja
     rot   → inclinación en grados
     z     → qué queda encima de qué
   ════════════════════════════════════════════════════════════════ */

const PHOTO_EXT = "jpg";
const photoUrl = (n) => `${import.meta.env.BASE_URL}recuerdos/${n}.${PHOTO_EXT}`;

/* ───────────── Bordes rasgados (clip-path) ───────────── */

function tornPolygon(seed = 1, steps = 16, depth = 2.4) {
  let s = seed * 9301;
  const rnd = () => ((s = (s * 49297 + 233280) % 233280) / 233280);
  const jag = () => rnd() * depth;
  const pts = [];
  for (let i = 0; i <= steps; i++) pts.push([(i / steps) * 100, jag()]);
  for (let i = 1; i <= steps; i++) pts.push([100 - jag(), (i / steps) * 100]);
  for (let i = steps - 1; i >= 0; i--) pts.push([(i / steps) * 100, 100 - jag()]);
  for (let i = steps - 1; i > 0; i--) pts.push([jag(), (i / steps) * 100]);
  return `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}% ${y.toFixed(1)}%`).join(",")})`;
}
const TORN = [tornPolygon(1), tornPolygon(2), tornPolygon(3), tornPolygon(4)];

/* ───────────── Stickers (SVG) ───────────── */

const STAR_PATH = "M50 4 L61 38 L97 38 L68 59 L79 94 L50 73 L21 94 L32 59 L3 38 L39 38 Z";
const SPARKLE_PATH = "M50 2 C54 34 66 46 98 50 C66 54 54 66 50 98 C46 66 34 54 2 50 C34 46 46 34 50 2Z";
const HEART_PATH =
  "M16 28 C16 28 2 18 2 9.5 C2 5 5.5 2 9.5 2 C12.5 2 15 3.8 16 6.5 C17 3.8 19.5 2 22.5 2 C26.5 2 30 5 30 9.5 C30 18 16 28 16 28 Z";

function Sticker({ kind, c1 = "#e8638a", c2 = "#f6c4cf" }) {
  switch (kind) {
    case "star":
      return (
        <svg viewBox="0 0 100 100" className="stk">
          <path d={STAR_PATH} fill={c1} stroke={c2} strokeWidth="5" strokeLinejoin="round" />
          <circle cx="40" cy="42" r="3" fill="#fff" opacity=".85" />
          <circle cx="60" cy="52" r="2.2" fill="#fff" opacity=".7" />
          <circle cx="50" cy="66" r="2.6" fill="#fff" opacity=".8" />
          <circle cx="30" cy="58" r="1.8" fill="#fff" opacity=".6" />
        </svg>
      );
    case "sparkle":
      return (
        <svg viewBox="0 0 100 100" className="stk">
          <path d={SPARKLE_PATH} fill={c1} />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 32 29" className="stk">
          <path d={HEART_PATH} fill={c1} stroke={c2} strokeWidth="1.2" />
          <ellipse cx="9" cy="8" rx="2.4" ry="1.4" fill="#fff" opacity=".5" transform="rotate(-30 9 8)" />
        </svg>
      );
    case "lips":
      return (
        <svg viewBox="0 0 120 70" className="stk">
          <path d="M4 36 C24 8 44 6 60 20 C76 6 96 8 116 36 C96 64 76 66 60 66 C44 66 24 64 4 36 Z" fill={c1} />
          <path d="M6 36 C30 44 90 44 114 36" stroke="#8d1d3c" strokeWidth="2.5" fill="none" />
          <ellipse cx="40" cy="24" rx="9" ry="3" fill="#fff" opacity=".35" transform="rotate(-15 40 24)" />
        </svg>
      );
    case "flower":
      return (
        <svg viewBox="0 0 100 100" className="stk">
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <ellipse key={a} cx="50" cy="26" rx="14" ry="22" fill={c2} stroke={c1} strokeWidth="1.5" transform={`rotate(${a} 50 50)`} />
          ))}
          <circle cx="50" cy="50" r="11" fill="#f7dc86" stroke={c1} strokeWidth="1.5" />
        </svg>
      );
    case "butterfly":
      return (
        <svg viewBox="0 0 100 80" className="stk">
          <ellipse cx="28" cy="28" rx="26" ry="20" fill={c1} transform="rotate(-20 28 28)" />
          <ellipse cx="72" cy="28" rx="26" ry="20" fill={c1} transform="rotate(20 72 28)" />
          <ellipse cx="32" cy="56" rx="18" ry="14" fill={c2} transform="rotate(25 32 56)" />
          <ellipse cx="68" cy="56" rx="18" ry="14" fill={c2} transform="rotate(-25 68 56)" />
          <circle cx="24" cy="26" r="6" fill="#fff" opacity=".55" />
          <circle cx="76" cy="26" r="6" fill="#fff" opacity=".55" />
          <rect x="47" y="18" width="6" height="46" rx="3" fill="#3a0f1f" />
        </svg>
      );
    case "mushroom":
      return (
        <svg viewBox="0 0 100 100" className="stk">
          <rect x="36" y="52" width="28" height="38" rx="12" fill="#fbf1e4" stroke="#d9c7b0" strokeWidth="2" />
          <path d="M6 58 C6 16 94 16 94 58 Z" fill={c1} />
          <circle cx="32" cy="38" r="7" fill="#fff" opacity=".85" />
          <circle cx="62" cy="32" r="5" fill="#fff" opacity=".85" />
          <circle cx="74" cy="48" r="4" fill="#fff" opacity=".85" />
        </svg>
      );
    case "cupcake":
      return (
        <svg viewBox="0 0 100 120" className="stk">
          <path d="M18 62 H82 L74 112 H26 Z" fill={c2} stroke={c1} strokeWidth="2" />
          {[34, 46, 58, 70].map((x) => (
            <path key={x} d={`M${x} 64 L${x - 2} 110`} stroke={c1} strokeWidth="2" opacity=".5" />
          ))}
          <path d="M12 64 C8 44 30 42 34 30 C38 12 62 12 66 30 C70 42 92 44 88 64 Z" fill="#fff5e6" stroke="#e5cfae" strokeWidth="2" />
          <rect x="30" y="44" width="7" height="3" rx="1.5" fill="#e8638a" transform="rotate(30 30 44)" />
          <rect x="52" y="38" width="7" height="3" rx="1.5" fill="#7cc4a4" transform="rotate(-20 52 38)" />
          <rect x="66" y="50" width="7" height="3" rx="1.5" fill="#f2b83a" transform="rotate(60 66 50)" />
          <rect x="42" y="54" width="7" height="3" rx="1.5" fill="#9a7fd6" transform="rotate(10 42 54)" />
          <circle cx="50" cy="14" r="7" fill="#d62f55" />
          <path d="M50 8 C52 2 58 0 60 2" stroke="#3b7a4a" strokeWidth="2" fill="none" />
        </svg>
      );
    case "partyhat":
      return (
        <svg viewBox="0 0 60 80" className="stk">
          <path d="M30 6 L56 74 H4 Z" fill={c1} />
          <circle cx="24" cy="40" r="3" fill="#fff" opacity=".8" />
          <circle cx="36" cy="54" r="3" fill="#fff" opacity=".8" />
          <circle cx="22" cy="62" r="3" fill="#fff" opacity=".8" />
          <circle cx="38" cy="30" r="2.4" fill="#fff" opacity=".8" />
          <rect x="4" y="70" width="52" height="6" rx="3" fill={c2} />
          <circle cx="30" cy="6" r="7" fill={c2} />
        </svg>
      );
    case "clip":
      return (
        <svg viewBox="0 0 30 80" className="stk">
          <path d="M10 60 V18 C10 4 24 4 24 18 V64 C24 78 6 78 6 62 V24" stroke="#9aa0ad" strokeWidth="3.2" fill="none" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

function Banner({ colors }) {
  const pennants = Array.from({ length: 8 }, (_, i) => {
    const t = 0.07 + (i / 7) * 0.86;
    const x = 300 * t;
    const y = (1 - t) ** 2 * 6 + 2 * t * (1 - t) * 40 + t * t * 6;
    return { x, y, c: colors[i % colors.length] };
  });
  return (
    <svg viewBox="0 0 300 70" className="stk">
      <path d="M0 6 Q150 40 300 6" stroke="#a88f7a" strokeWidth="2" fill="none" />
      {pennants.map((p, i) => (
        <path key={i} d={`M${p.x - 16} ${p.y} L${p.x + 16} ${p.y} L${p.x} ${p.y + 34} Z`} fill={p.c} stroke="#fff" strokeWidth="1.2" />
      ))}
    </svg>
  );
}

/* ───────────── Fotos ───────────── */

const PH_GRADS = [
  "linear-gradient(145deg,#f9d3dc,#e8a1b6)",
  "linear-gradient(145deg,#ddd0f5,#b9a2e6)",
  "linear-gradient(145deg,#fbe6a8,#f2c46a)",
  "linear-gradient(145deg,#cdeedd,#93d3b6)",
  "linear-gradient(145deg,#ffd9c4,#f4a98a)"
];

function Pic({ n, ar = 1, alt = "" }) {
  const [failed, setFailed] = React.useState(false);
  return (
    <div className="pic" style={{ aspectRatio: ar }}>
      {failed ? (
        <div className="pic-ph" style={{ background: PH_GRADS[n % PH_GRADS.length] }}>
          <Camera size={22} />
          <span>foto {n}</span>
        </div>
      ) : (
        <img src={photoUrl(n)} alt={alt} loading="lazy" onError={() => setFailed(true)} draggable="false" />
      )}
    </div>
  );
}

function Photo({ it }) {
  const { shape = "rect", n, ar = 1, caption } = it;
  if (shape === "polaroid") {
    return (
      <div className="ph polaroid">
        <Pic n={n} ar={ar} alt={caption} />
        {caption && <span className="cap">{caption}</span>}
      </div>
    );
  }
  if (shape === "torn") {
    return (
      <div className="ph-shadow">
        <div className="ph torn" style={{ clipPath: TORN[(it.seed ?? 0) % TORN.length] }}>
          <Pic n={n} ar={ar} alt={caption} />
        </div>
      </div>
    );
  }
  if (shape === "heart") {
    return (
      <div className="ph-shadow">
        <div className="ph heart-clip">
          <Pic n={n} ar={1.1} alt={caption} />
        </div>
      </div>
    );
  }
  if (shape === "round") {
    return (
      <div className="ph round">
        <Pic n={n} ar={1} alt={caption} />
      </div>
    );
  }
  return (
    <div className="ph rect">
      <Pic n={n} ar={ar} alt={caption} />
    </div>
  );
}

function Strip({ it }) {
  return (
    <div className="strip">
      {it.ns.map((n) => (
        <Pic key={n} n={n} ar={4 / 3} />
      ))}
      <span className="strip-text">{it.label || "photobooth"}</span>
    </div>
  );
}

function Note({ it }) {
  return (
    <div className="ph-shadow">
      <div className={`note note-${it.tone || "pink"}`} style={{ clipPath: TORN[(it.seed ?? 1) % TORN.length], aspectRatio: it.ar || 0.95 }}>
        <p>{it.text}</p>
      </div>
    </div>
  );
}

function Item({ it, i }) {
  let body = null;
  if (it.k === "photo") body = <Photo it={it} />;
  else if (it.k === "strip") body = <Strip it={it} />;
  else if (it.k === "note") body = <Note it={it} />;
  else if (it.k === "sticker") body = <Sticker kind={it.kind} c1={it.c1} c2={it.c2} />;
  else if (it.k === "banner") body = <Banner colors={it.colors || ["#f6c4cf", "#e8638a", "#fbe6a8", "#c9b6ee"]} />;
  else if (it.k === "tape") body = <div className="tape" style={{ background: it.color || "rgba(247,220,134,.75)" }} />;

  return (
    <div
      className={`it it-${it.k}`}
      style={{
        left: `${it.x}%`,
        top: `${it.y}%`,
        width: `${it.w}%`,
        zIndex: it.z ?? 2,
        "--rot": `${it.rot || 0}deg`,
        "--d": `${0.08 * (i % 9) + 0.1}s`
      }}
    >
      {body}
    </div>
  );
}

/* ───────────── Contenido: edita aquí ───────────── */

const MEMORY_PAGES = [
  {
    bg: "bg-floral",
    items: [
      // Tira de fotomatón
      { k: "strip", ns: [1, 2, 3, 4], x: 4, y: 5, w: 21, rot: -1.5, z: 3 },
      { k: "tape", x: 8, y: 3, w: 13, rot: -6, z: 6 },
      // Foto grande sobre fondo de lunares
      { k: "photo", shape: "rect", n: 5, ar: 1.1, x: 31, y: 4, w: 62, rot: 1.2, z: 2 },
      { k: "tape", x: 52, y: 2.5, w: 16, rot: 3, z: 6, color: "rgba(201,182,238,.8)" },
      // Nota rosa
      { k: "note", tone: "pink", seed: 1, ar: 1.05, x: 44, y: 47, w: 50, rot: 2.5, z: 4, text: "Los recuerdos son las cosas más preciadas que tendremos ♡" },
      // Polaroid con gorrito
      { k: "photo", shape: "polaroid", n: 6, ar: 0.9, caption: "mi favorita", x: 31, y: 63, w: 31, rot: -3, z: 5 },
      { k: "sticker", kind: "partyhat", c1: "#c9b6ee", c2: "#e8638a", x: 41, y: 58, w: 9, rot: 10, z: 8 },
      // Círculo con gorrito
      { k: "photo", shape: "round", n: 7, x: 3, y: 74, w: 26, rot: 0, z: 4 },
      { k: "sticker", kind: "partyhat", c1: "#7fc3d6", c2: "#fbe6a8", x: 2, y: 71, w: 8, rot: -22, z: 8 },
      // Banderines
      { k: "banner", x: 3, y: 63, w: 48, rot: -2, z: 3 },
      // Stickers
      { k: "sticker", kind: "lips", c1: "#d62f55", x: 3, y: 33, w: 17, rot: -12, z: 5 },
      { k: "sticker", kind: "flower", c1: "#d96a9a", c2: "#f6c4cf", x: 25, y: 28, w: 15, rot: 14, z: 5 },
      { k: "sticker", kind: "star", c1: "#c9558a", c2: "#f6c4cf", x: 29, y: 41, w: 17, rot: -8, z: 5 },
      { k: "sticker", kind: "star", c1: "#c9b6ee", c2: "#e8638a", x: 10, y: 49, w: 14, rot: 12, z: 5 },
      { k: "sticker", kind: "sparkle", c1: "#f2b83a", x: 86, y: 40, w: 8, rot: 0, z: 5 },
      { k: "sticker", kind: "cupcake", x: 31, y: 86, w: 14, rot: -4, z: 6 },
      { k: "sticker", kind: "butterfly", c1: "#e8638a", c2: "#f7dc86", x: 66, y: 66, w: 13, rot: 18, z: 6 },
      { k: "sticker", kind: "star", c1: "#b890e6", c2: "#fff", x: 84, y: 78, w: 12, rot: 14, z: 5 },
      { k: "sticker", kind: "mushroom", c1: "#9a7fd6", x: 83, y: 88, w: 11, rot: -6, z: 5 },
      { k: "sticker", kind: "heart", c1: "#e8638a", c2: "#fff", x: 68, y: 86, w: 9, rot: 12, z: 5 },
      { k: "sticker", kind: "clip", x: 49, y: 44, w: 4, rot: 8, z: 7 }
    ]
  },
  {
    bg: "bg-gingham",
    items: [
      { k: "photo", shape: "polaroid", n: 8, ar: 1, caption: "ese día", x: 5, y: 5, w: 40, rot: -4, z: 3 },
      { k: "tape", x: 18, y: 3, w: 14, rot: 4, z: 7 },
      { k: "photo", shape: "polaroid", n: 9, ar: 1, caption: "otra vez", x: 52, y: 8, w: 40, rot: 3.5, z: 3 },
      { k: "tape", x: 66, y: 6, w: 14, rot: -5, z: 7, color: "rgba(246,196,207,.85)" },
      { k: "photo", shape: "heart", n: 10, x: 28, y: 33, w: 44, rot: -2, z: 4 },
      { k: "note", tone: "mint", seed: 2, ar: 1.15, x: 4, y: 57, w: 46, rot: -2.5, z: 5, text: "Gracias por cada risa que no se me va a olvidar" },
      { k: "photo", shape: "torn", seed: 1, n: 11, ar: 0.8, x: 54, y: 56, w: 40, rot: 2, z: 4 },
      { k: "photo", shape: "rect", n: 12, ar: 1.4, x: 8, y: 77, w: 46, rot: 2, z: 3 },
      { k: "sticker", kind: "heart", c1: "#d62f55", c2: "#fff", x: 8, y: 31, w: 11, rot: -14, z: 6 },
      { k: "sticker", kind: "sparkle", c1: "#f2b83a", x: 76, y: 31, w: 10, rot: 0, z: 6 },
      { k: "sticker", kind: "star", c1: "#c9558a", c2: "#f6c4cf", x: 80, y: 47, w: 15, rot: 12, z: 6 },
      { k: "sticker", kind: "flower", c1: "#7a63c4", c2: "#c9b6ee", x: 52, y: 79, w: 18, rot: -10, z: 6 },
      { k: "sticker", kind: "butterfly", c1: "#7fc3d6", c2: "#f6c4cf", x: 74, y: 86, w: 16, rot: -12, z: 6 },
      { k: "sticker", kind: "cupcake", x: 40, y: 54, w: 11, rot: 8, z: 7 },
      { k: "sticker", kind: "lips", c1: "#e8638a", x: 4, y: 92, w: 14, rot: 10, z: 6 }
    ]
  },
  {
    bg: "bg-confetti",
    items: [
      { k: "photo", shape: "round", n: 13, x: 5, y: 4, w: 46, rot: 0, z: 3 },
      { k: "photo", shape: "torn", seed: 2, n: 14, ar: 1.2, x: 40, y: 18, w: 56, rot: 2.5, z: 4 },
      { k: "sticker", kind: "star", c1: "#f2b83a", c2: "#fff", x: 38, y: 5, w: 15, rot: 16, z: 6 },
      { k: "note", tone: "ticket", seed: 3, ar: 2.3, x: 6, y: 47, w: 60, rot: -3, z: 5, text: "ADMIT ONE ♡ un recuerdo para siempre" },
      { k: "photo", shape: "polaroid", n: 15, ar: 0.95, caption: "los mejores", x: 8, y: 62, w: 36, rot: -4, z: 4 },
      { k: "photo", shape: "rect", n: 16, ar: 0.8, x: 52, y: 58, w: 38, rot: 4, z: 3 },
      { k: "tape", x: 62, y: 56, w: 15, rot: -4, z: 7, color: "rgba(185,230,211,.85)" },
      { k: "sticker", kind: "heart", c1: "#e8638a", c2: "#fff", x: 74, y: 41, w: 12, rot: 14, z: 6 },
      { k: "sticker", kind: "mushroom", c1: "#e8638a", x: 70, y: 84, w: 15, rot: 6, z: 6 },
      { k: "sticker", kind: "flower", c1: "#d96a9a", c2: "#f6c4cf", x: 45, y: 82, w: 16, rot: -14, z: 6 },
      { k: "sticker", kind: "sparkle", c1: "#9a7fd6", x: 6, y: 87, w: 9, rot: 0, z: 6 },
      { k: "sticker", kind: "cupcake", x: 18, y: 84, w: 13, rot: -6, z: 6 },
      { k: "banner", colors: ["#c9b6ee", "#f6c4cf", "#e8638a", "#fff"], x: 4, y: 93, w: 60, rot: 1, z: 3 }
    ]
  },
  {
    bg: "bg-mint",
    items: [
      { k: "strip", ns: [17, 18, 19, 20], label: "otra más", x: 70, y: 4, w: 21, rot: 2, z: 3 },
      { k: "photo", shape: "rect", n: 21, ar: 1.15, x: 5, y: 6, w: 60, rot: -2, z: 2 },
      { k: "tape", x: 25, y: 4, w: 15, rot: -4, z: 7 },
      { k: "photo", shape: "torn", seed: 3, n: 22, ar: 1, x: 48, y: 34, w: 46, rot: 2, z: 4 },
      { k: "photo", shape: "polaroid", n: 23, ar: 1, caption: "siempre", x: 4, y: 38, w: 38, rot: -3, z: 5 },
      { k: "note", tone: "pink", seed: 0, ar: 1.1, x: 12, y: 67, w: 48, rot: 2, z: 5, text: "Y esto… continuará ♡" },
      { k: "photo", shape: "heart", n: 24, x: 56, y: 66, w: 38, rot: 6, z: 4 },
      { k: "sticker", kind: "star", c1: "#e8638a", c2: "#f6c4cf", x: 40, y: 31, w: 14, rot: 12, z: 6 },
      { k: "sticker", kind: "sparkle", c1: "#f2b83a", x: 88, y: 28, w: 8, rot: 0, z: 6 },
      { k: "sticker", kind: "butterfly", c1: "#9a7fd6", c2: "#f6c4cf", x: 3, y: 83, w: 16, rot: -14, z: 6 },
      { k: "sticker", kind: "flower", c1: "#d96a9a", c2: "#f6c4cf", x: 40, y: 84, w: 16, rot: 10, z: 6 },
      { k: "sticker", kind: "lips", c1: "#d62f55", x: 75, y: 88, w: 17, rot: 12, z: 6 },
      { k: "sticker", kind: "heart", c1: "#d62f55", c2: "#fff", x: 20, y: 94, w: 8, rot: -10, z: 6 }
    ]
  }
];

/* ───────────── Escena ───────────── */

function Board({ page, index }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("show");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("show");
          io.disconnect();
        }
      },
      { threshold: 0.18 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`board-wrap ${index === 0 ? "has-peeker" : ""}`}>
      <div ref={ref} className={`board ${page.bg}`}>
        {page.items.map((it, i) => (
          <Item key={i} it={it} i={i} />
        ))}
      </div>
      {index === 0 && <Peeker index={0} />}
    </div>
  );
}

/* Fondos de la escena: uno por hoja (se repiten si agregas más hojas).
   Cada uno es el tono contrario al de su hoja: rosa→verde azulado, lila→dorado,
   amarillo→violeta, menta→frambuesa. Se ven por detrás, al deslizar cambian con un cruce suave. */
const BACKDROPS = 4;

// Corazones y destellos que suben lentamente por el fondo
const FLOAT_ORDER = ["heart", "paw", "sparkle", "fish", "heart", "paw"];
const FLOATERS = Array.from({ length: 20 }, (_, i) => ({
  kind: FLOAT_ORDER[i % FLOAT_ORDER.length],
  left: (i * 37 + 8) % 96,
  size: 16 + ((i * 11) % 22),
  dur: 14 + ((i * 5) % 12),
  delay: -((i * 7) % 18)
}));

export default function MemoriesScene({ onBack }) {
  const sceneRef = React.useRef(null);
  const [active, setActive] = React.useState(0);

  // Detecta cuál hoja está más centrada en la pantalla
  React.useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      scene.querySelectorAll(".board").forEach((b, i) => {
        const r = b.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    scene.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      scene.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const which = active % BACKDROPS;

  // Cuenta como "pasada" cuando llega al pie de la última hoja.
  const footRef = React.useRef(null);
  React.useEffect(() => {
    const foot = footRef.current;
    const root = sceneRef.current;
    if (!foot || !root || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          markDone("memories");
          io.disconnect();
        }
      },
      { root, threshold: 0.55 }
    );
    io.observe(foot);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sceneRef} className="memories-scene" data-bg={which} aria-label="Recuerdos">
      {/* Recorte en forma de corazón para las fotos */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <clipPath id="heartClip" clipPathUnits="objectBoundingBox">
            <path d="M0.5,0.96 C0.5,0.96 0.02,0.64 0.02,0.32 C0.02,0.15 0.14,0.05 0.27,0.05 C0.38,0.05 0.46,0.11 0.5,0.2 C0.54,0.11 0.62,0.05 0.73,0.05 C0.86,0.05 0.98,0.15 0.98,0.32 C0.98,0.64 0.5,0.96 0.5,0.96 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Fondo que cambia de color con cada hoja */}
      <div className="mem-bg" aria-hidden="true">
        {Array.from({ length: BACKDROPS }, (_, i) => (
          <div key={i} className={`mem-bg-layer mem-bg-${i} ${i === which ? "on" : ""}`} />
        ))}
        <div className="mem-floaters">
          {FLOATERS.map((f, i) => (
            <svg
              key={i}
              viewBox={FLOATER_KINDS[f.kind].vb}
              style={{ left: `${f.left}%`, width: f.size, animationDuration: `${f.dur}s`, animationDelay: `${f.delay}s` }}
            >
              <FloaterShape kind={f.kind} />
            </svg>
          ))}
          {FLOAT_PICS.map((c, i) => (
            <div
              key={`cat-${i}`}
              className={`float-cat float-pic-${c.img} ${c.mode === "cross" ? "float-cross" : ""}`}
              style={{
                width: c.size,
                left: c.mode === "cross" ? undefined : `${c.left}%`,
                top: c.mode === "cross" ? `${c.top}%` : undefined,
                animationDuration: `${c.dur}s`,
                animationDelay: `${c.delay}s`
              }}
            >
              <img src={catImageUrl(c.img)} alt="" draggable="false" decoding="async" />
            </div>
          ))}
        </div>
      </div>

      <button type="button" className="close-button mem-back" onClick={onBack}>
        <X size={16} /> Volver
      </button>

      <header className="mem-head">
        <h2>
          <em>Nuestros</em> recuerdos
        </h2>
        <p className="mem-scroll-hint">desliza hacia abajo ↓</p>
      </header>

      {MEMORY_PAGES.map((page, i) => (
        <Board key={i} page={page} index={i} />
      ))}

      <footer className="mem-foot" ref={footRef}>
        <span>♡</span>
        <p>Y todavía faltan muchos más</p>
        <button type="button" className="accept-button mem-foot-btn" onClick={onBack}>
          Volver a las cartitas
        </button>
      </footer>
    </section>
  );
}
