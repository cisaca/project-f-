import React from "react";
import { Lock, X } from "lucide-react";
import { LowPolyCat } from "./Cats.jsx";
import { markDone } from "./progress.js";
import "./letters.css";

/* ════════════════════════════════════════════════════════════════
   CARTITA 3 · "ABRE CUANDO…"  (buzón de sobres sellados)

   CÓMO EDITAR
   Todo está en LETTERS. Cada sobre tiene:
     id      → nombre interno (no lo repitas)
     title   → lo que se lee en el sobre ("Cuando…")
     tone    → color del papel: rose · lilac · sky · peach · butter · mint · cream · gold
     seal    → dibujo del sello: heart · moon · star · sparkle · flower · paw · butterfly · sun · key
     text    → párrafos de la carta (cada elemento = un párrafo)
     ps      → posdata (opcional)
     photo   → foto opcional, ej. "abrir/1.jpg" (archivo en client/public/abrir/)
     unlock  → "AAAA-MM-DD": el sobre se abre recién ese día (se valida con la fecha del servidor)
     requires: "all" → se abre cuando ya abriste todos los demás (el sobre dorado final)
     glow    → true: el sobre brilla para llamar la atención

   Los textos de ejemplo son solo una guía: reemplázalos por tus palabras ♡
   ════════════════════════════════════════════════════════════════ */

const SIGNATURE = "Con todo mi cariño ♡";
const STORAGE_KEY = "portal-abre-cuando:v1";
const TIMEZONE = "America/Santiago";

export const LETTERS = [
  {
    id: "triste",
    title: "Cuando estés triste",
    tone: "rose",
    seal: "heart",
    text: [
      "Si estás leyendo esto, es porque hoy el día pesa un poquito más. Ven, respira conmigo.",
      "No tienes que estar bien ahora mismo. Se puede estar triste y seguir siendo increíble: las dos cosas caben juntas.",
      "Lo que sientes importa, y tú importas muchísimo más. Esto también va a pasar, y mientras tanto no tienes que cargarlo en solitario."
    ],
    ps: "PD: toma agua y abraza algo suave. Si es un gatito, mejor."
  },
  {
    id: "dormir",
    title: "Cuando no puedas dormir",
    tone: "lilac",
    seal: "moon",
    text: [
      "Shhh… ya es tarde y la luna te está cuidando.",
      "Cierra los ojos y piensa en tres cosas lindas de hoy, aunque sean pequeñitas: un café rico, una risa, un gatito en la calle.",
      "Respira lento: cuatro segundos para entrar, cuatro para soltar. Yo estoy al otro lado de la luna, deseándote dulces sueños."
    ],
    ps: "PD: mañana todo se ve mejor con descanso ✦"
  },
  {
    id: "extrañes",
    title: "Cuando me extrañes",
    tone: "sky",
    seal: "butterfly",
    text: [
      "Sé que a veces el tiempo o la distancia se sienten largos.",
      "Pero cada vez que me extrañes, acuérdate de que yo también estoy pensando en ti, seguramente más de lo que imaginas.",
      "Mira una de nuestras fotos, escucha una canción nuestra y piensa en la próxima vez que nos veamos. Cada día falta un poquito menos."
    ],
    ps: "PD: guarda este abrazo virtual y úsalo cuando quieras ♡"
  },
  {
    id: "enojada",
    title: "Cuando estés enojada conmigo",
    tone: "peach",
    seal: "flower",
    text: [
      "Okay. Primero: probablemente tienes razón. (Segundo: probablemente tengo una explicación, pero este no es el momento.)",
      "Lo que haya pasado, no quiero que nos quedemos enojados con el mundo ni entre nosotros.",
      "Respira, toma agua, y cuando quieras hablamos con calma. Prometo escuchar de verdad y ponerle cariño a la solución."
    ],
    ps: "PD: este sobre incluye una disculpa anticipada y un gatito triste (imagínalo)."
  },
  {
    id: "dudes",
    title: "Cuando dudes de ti",
    tone: "butter",
    seal: "star",
    text: [
      "Hagamos una lista rápida, porque a veces se te olvida:",
      "Eres capaz de mucho más de lo que crees. Has pasado por cosas que otras personas ni habrían intentado.",
      "Tu forma de ser hace mejor a la gente que te rodea, y eso me incluye.",
      "No hace falta que todo salga perfecto para que valgas muchísimo. Ya lo haces."
    ],
    ps: "PD: léelo en voz alta frente al espejo. Es en serio."
  },
  {
    id: "maldia",
    title: "Cuando tengas un mal día",
    tone: "mint",
    seal: "paw",
    text: [
      "Declaro oficialmente este día como «malo, pero con solución».",
      "Este sobre vale por UN cupón canjeable cuando quieras: elegir la comida, una peli sin quejas, o un abrazo largo sin preguntas.",
      "Mándame una captura de este mensaje y yo cumplo. Sin letra chica."
    ],
    ps: "PD: los cupones no caducan (a menos que los use yo)."
  },
  {
    id: "reir",
    title: "Cuando necesites reír",
    tone: "cream",
    seal: "sun",
    text: [
      "Alerta de risa en 3, 2, 1…",
      "Acuérdate de aquella vez que nos reímos tanto que no podíamos parar. Sí, esa. Piénsala un segundo.",
      "Todos los días contigo tienen algo gracioso, aunque no lo notemos, y eso es lo que más se me queda."
    ],
    ps: "PD: pon esa canción o ese video que nos hace reír. Hoy toca."
  },
  {
    id: "aniversario",
    title: "Cuando cumplamos un año más",
    tone: "rose",
    seal: "butterfly",
    unlock: "2027-02-14", // ← cambia por la fecha que quieras
    text: [
      "Si ya llegó este día, quiere decir que seguimos aquí, juntos, y eso ya es una victoria.",
      "Cada año contigo ha tenido sus risas, sus gatitos y su magia. Gracias por quedarte, por elegirme y por hacer la vida más bonita.",
      "Esto es solo una parte de lo que quiero decirte. Lo demás te lo digo en persona, con un abrazo."
    ],
    ps: "PD: prepárate, que hay sorpresa ✦"
  },
  {
    id: "cual",
    title: "Cuando no sepas cuál abrir",
    tone: "lilac",
    seal: "sparkle",
    glow: true,
    text: [
      "Jaja, te conozco. No sabías cuál abrir y por eso elegiste este.",
      "Te doy un consejo: abre el que te llame la atención por el color, y si no, el que tenga el sello más bonito.",
      "Y si ninguno te convence, vuelve aquí: este sobre siempre estará para decirte que te quiero un montón."
    ]
  },
  {
    id: "final",
    title: "Para cuando abras todos los demás",
    tone: "gold",
    seal: "star",
    requires: "all",
    text: [
      "Lo lograste: abriste todos los sobres. Ahora sí lo sabes todo… bueno, casi todo.",
      "Esto era mi forma de decirte lo importante que eres, en los días buenos y en los malos.",
      "Lo que sigue ya no cabe en un sobre."
    ],
    ps: "PD: y esto… continuará ♡"
  }
];

/* ───────── Colores de papel ───────── */

const TONES = {
  rose: { back: "#f3a3b9", front: "#ffc6d4", flap: "#ffd9e3", inner: "#ec8aa4", wax: "#c8365f", wax2: "#8f2243", sheet: "#fff4f6" },
  lilac: { back: "#b39cf0", front: "#cdbdf8", flap: "#ded2fc", inner: "#9f84e8", wax: "#6d4fc9", wax2: "#46308f", sheet: "#f8f4ff" },
  sky: { back: "#87c2ee", front: "#b1dbf8", flap: "#cbe8fc", inner: "#70b1e2", wax: "#3b78bf", wax2: "#244f86", sheet: "#f2f9ff" },
  peach: { back: "#f5a58a", front: "#fbc1ab", flap: "#fed5c6", inner: "#ec8e72", wax: "#d4503a", wax2: "#962f20", sheet: "#fff5ef" },
  butter: { back: "#f1d067", front: "#fbe593", flap: "#fff0b9", inner: "#e6bd47", wax: "#d8782a", wax2: "#9a4f14", sheet: "#fffbec" },
  mint: { back: "#86d9b9", front: "#aeebd1", flap: "#c6f3e0", inner: "#6fcdaa", wax: "#2f9c78", wax2: "#1d6b52", sheet: "#f2fff9" },
  cream: { back: "#e3cfae", front: "#f4e6cd", flap: "#fbf0dc", inner: "#d6bd92", wax: "#9b2f4c", wax2: "#681d33", sheet: "#fffaf0" },
  gold: { back: "#dfae45", front: "#f6d77d", flap: "#fbe7a4", inner: "#cc9424", wax: "#8d304a", wax2: "#5c1a2e", sheet: "#fffcee" }
};

const toneVars = (tone) => {
  const t = TONES[tone] || TONES.rose;
  return {
    "--back": t.back,
    "--front": t.front,
    "--flap": t.flap,
    "--inner": t.inner,
    "--wax": t.wax,
    "--wax2": t.wax2,
    "--sheet": t.sheet
  };
};

/* ───────── Dibujitos del sello ───────── */

function SealIcon({ kind }) {
  const common = { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true, className: "seal-icon" };
  switch (kind) {
    case "moon":
      return (
        <svg {...common}>
          <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2 6.4 20.2l1.1-6.3L2.9 9.5l6.3-.9z" />
        </svg>
      );
    case "sparkle":
      return (
        <svg {...common}>
          <path d="M12 2c.7 5.6 2.7 7.6 8.3 8.3-5.6.7-7.6 2.7-8.3 8.3-.7-5.6-2.7-7.6-8.3-8.3C9.3 9.6 11.3 7.6 12 2z" />
          <circle cx="19" cy="19" r="1.7" />
          <circle cx="5" cy="5" r="1.2" />
        </svg>
      );
    case "flower":
      return (
        <svg {...common}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="12" cy="6.4" rx="3.2" ry="4.6" transform={`rotate(${a} 12 12)`} />
          ))}
          <circle cx="12" cy="12" r="2.6" fill="var(--wax2)" />
        </svg>
      );
    case "paw":
      return (
        <svg {...common}>
          <ellipse cx="12" cy="15.4" rx="5" ry="4.2" />
          <circle cx="5.4" cy="10.2" r="2.1" />
          <circle cx="9.6" cy="6.4" r="2.2" />
          <circle cx="14.6" cy="6.4" r="2.2" />
          <circle cx="18.8" cy="10.2" r="2.1" />
        </svg>
      );
    case "butterfly":
      return (
        <svg {...common}>
          <ellipse cx="7.4" cy="8.6" rx="5.2" ry="4.2" transform="rotate(-22 7.4 8.6)" />
          <ellipse cx="16.6" cy="8.6" rx="5.2" ry="4.2" transform="rotate(22 16.6 8.6)" />
          <ellipse cx="8.2" cy="15.4" rx="3.6" ry="3" transform="rotate(24 8.2 15.4)" />
          <ellipse cx="15.8" cy="15.4" rx="3.6" ry="3" transform="rotate(-24 15.8 15.4)" />
          <rect x="11.2" y="6" width="1.6" height="11" rx=".8" fill="var(--wax2)" />
        </svg>
      );
    case "sun":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4.4" />
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={i} x="11.1" y="1.8" width="1.8" height="4" rx=".9" transform={`rotate(${i * 45} 12 12)`} />
          ))}
        </svg>
      );
    case "key":
      return (
        <svg {...common}>
          <circle cx="8" cy="9" r="4.4" />
          <circle cx="8" cy="9" r="1.7" fill="var(--wax2)" />
          <rect x="11" y="8" width="10" height="2.6" rx="1.2" />
          <rect x="16" y="10" width="2.2" height="4" rx="1" />
          <rect x="19.2" y="10" width="2" height="3" rx="1" />
        </svg>
      );
    case "heart":
    default:
      return (
        <svg {...common}>
          <path d="M12 20.4s-8-5-8-10.7A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.7c0 5.7-8 10.7-8 10.7z" />
        </svg>
      );
  }
}

/* ───────── Sello de cera (entero, agrietado o abriéndose) ───────── */

function WaxSeal({ kind, mode = "whole", locked = false }) {
  // mode: whole | cracked (leído) | breaking (se rompe en el lector)
  const face = locked ? <Lock className="seal-icon seal-lock" strokeWidth={2.4} /> : <SealIcon kind={kind} />;
  const body = (
    <span className={`seal-body ${locked ? "is-lock" : ""}`}>
      <span className="seal-ring" />
      {face}
    </span>
  );

  if (mode === "whole") return <span className="seal">{body}</span>;

  return (
    <span className={`seal seal-split seal-${mode}`}>
      <span className="seal-half seal-l">{body}</span>
      <span className="seal-half seal-r">{body}</span>
      {mode === "breaking" && (
        <span className="seal-burst" aria-hidden="true">
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i / 16) * Math.PI * 2 + (i % 2) * 0.2;
            const d = 70 + (i % 4) * 22;
            return (
              <i
                key={i}
                style={{
                  "--bx": `${Math.cos(a) * d}px`,
                  "--by": `${Math.sin(a) * d - 14}px`,
                  "--bs": 0.6 + (i % 3) * 0.35,
                  "--bd": `${(i % 5) * 0.025}s`
                }}
              />
            );
          })}
        </span>
      )}
    </span>
  );
}

/* ───────── Sobre ───────── */

function Envelope({ letter, sealMode = "whole", locked = false, children, className = "", style }) {
  return (
    <div className={`env tone-${letter.tone} ${className}`} style={{ ...toneVars(letter.tone), ...style }}>
      <div className="env-back" />
      {children}
      <div className="env-front">
        <i className="ef-l" />
        <i className="ef-r" />
        <i className="ef-b" />
      </div>
      <div className="env-flap">
        <i className="flap-out" />
        <i className="flap-in" />
      </div>
      <WaxSeal kind={letter.seal} mode={sealMode} locked={locked} />
      {letter.tone === "gold" && <span className="env-shine" aria-hidden="true" />}
    </div>
  );
}

/* ───────── Hora y fecha ───────── */

function localToday() {
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

function prettyDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });
}

function greetingNow() {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return "Buen día";
  if (h >= 12 && h < 20) return "Buenas tardes";
  return "Buenas noches";
}

/* ───────── Texto que se escribe solo ───────── */

export function Typed({ text }) {
  const [n, setN] = React.useState(0);
  React.useEffect(() => {
    setN(0);
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setN(text.length);
      return;
    }
    const id = setInterval(() => setN((v) => (v >= text.length ? v : v + 1)), 28);
    return () => clearInterval(id);
  }, [text]);
  return <>{text.slice(0, n)}</>;
}

/* ───────── Cielo: estrellas, luciérnagas y estrellas fugaces ───────── */

function makeSky() {
  let s = 7;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const stars = Array.from({ length: 96 }, () => ({
    x: rnd() * 100,
    y: rnd() * 78,
    r: rnd() < 0.14 ? 3 : rnd() < 0.5 ? 2 : 1.4,
    d: 2 + rnd() * 4,
    t: rnd() * 6,
    big: rnd() < 0.1
  }));
  const flies = Array.from({ length: 18 }, () => ({
    x: rnd() * 100,
    y: 40 + rnd() * 55,
    s: 3 + rnd() * 4,
    d: 9 + rnd() * 10,
    t: -rnd() * 14,
    dx: (rnd() - 0.5) * 70
  }));
  return { stars, flies };
}
const SKY = makeSky();

function Sky() {
  return (
    <div className="lt-sky" aria-hidden="true">
      <div className="lt-aurora a1" />
      <div className="lt-aurora a2" />
      <div className="lt-aurora a3" />
      <div className="lt-stars">
        {SKY.stars.map((st, i) => (
          <span
            key={i}
            className={st.big ? "star big" : "star"}
            style={{ left: `${st.x}%`, top: `${st.y}%`, width: st.r, height: st.r, animationDuration: `${st.d}s`, animationDelay: `${st.t}s` }}
          />
        ))}
      </div>
      <span className="shoot s1" />
      <span className="shoot s2" />
      <span className="shoot s3" />
      <svg className="lt-hills" viewBox="0 0 1440 220" preserveAspectRatio="none">
        <path className="hill-back" d="M0 130 C180 70 320 150 520 110 C720 70 860 140 1060 100 C1220 72 1340 110 1440 90 V220 H0Z" />
        <path className="hill-front" d="M0 170 C200 120 380 190 600 160 C820 128 980 196 1200 160 C1320 142 1390 160 1440 150 V220 H0Z" />
      </svg>
      <div className="lt-flies">
        {SKY.flies.map((f, i) => (
          <span
            key={i}
            style={{ left: `${f.x}%`, top: `${f.y}%`, width: f.s, height: f.s, animationDuration: `${f.d}s`, animationDelay: `${f.t}s`, "--fx": `${f.dx}px` }}
          />
        ))}
      </div>
    </div>
  );
}

/* ───────── Lluvia de corazones (sobre final) ───────── */

function Celebrate() {
  const bits = React.useMemo(
    () =>
      Array.from({ length: 46 }, (_, i) => ({
        ch: ["♡", "✦", "✧", "♥", "·"][i % 5],
        x: (i * 23.7) % 100,
        d: (i % 11) * 0.12,
        t: 3.4 + (i % 6) * 0.45,
        r: ((i * 53) % 360) - 180,
        s: 14 + (i % 5) * 7,
        dx: ((i * 37) % 140) - 70
      })),
    []
  );
  return (
    <div className="lt-celebrate" aria-hidden="true">
      {bits.map((b, i) => (
        <span key={i} style={{ left: `${b.x}%`, fontSize: b.s, animationDelay: `${b.d}s`, animationDuration: `${b.t}s`, "--dx": `${b.dx}px`, "--rr": `${b.r}deg` }}>
          {b.ch}
        </span>
      ))}
    </div>
  );
}

/* ───────── Lector: el sobre vuela al centro, se rompe el sello y sale la carta ───────── */

const PHASES = ["fly", "crack", "flap", "rise", "read"];

function Reader({ letter, fromRect, fast, onClose }) {
  const [phase, setPhase] = React.useState(0);
  const [leaving, setLeaving] = React.useState(false);
  const closeRef = React.useRef(null);
  const [photoOk, setPhotoOk] = React.useState(true);
  const k = fast ? 0.45 : 1;
  const idx = (name) => PHASES.indexOf(name);

  // Desde dónde "vuela" el sobre (el lugar donde estaba en la lista)
  const [fly] = React.useState(() => {
    const W = Math.min(window.innerWidth * 0.86, 460);
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    if (!fromRect) return { x: 0, y: 80, s: 0.6 };
    return {
      x: fromRect.left + fromRect.width / 2 - cx,
      y: fromRect.top + fromRect.height / 2 - cy,
      s: fromRect.width / W
    };
  });

  React.useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPhase(idx("read"));
      return;
    }
    const at = [700, 1150, 1800, 2700].map((ms) => ms * k);
    const ids = at.map((ms, i) => setTimeout(() => setPhase(i + 1), ms));
    return () => ids.forEach(clearTimeout);
  }, [k]);

  React.useEffect(() => {
    if (phase === idx("read")) closeRef.current?.focus({ preventScroll: true });
  }, [phase]);

  const close = React.useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(onClose, 420);
  }, [leaving, onClose]);

  React.useEffect(() => {
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  const cls = PHASES.map((p, i) => (i <= phase ? `p-${p}` : "")).join(" ");
  const sealMode = phase >= idx("crack") ? "breaking" : "whole";
  const isGold = letter.tone === "gold";
  const photo = letter.photo && photoOk ? `${import.meta.env.BASE_URL}${letter.photo}` : null;

  return (
    <div
      className={`reader ${cls} ${leaving ? "is-leaving" : ""} ${fast ? "is-fast" : ""}`}
      style={{ "--k": k, "--fx": `${fly.x}px`, "--fy": `${fly.y}px`, "--fs": fly.s, ...toneVars(letter.tone) }}
      role="dialog"
      aria-modal="true"
      aria-label={letter.title}
      onClick={(e) => {
        if (phase < idx("read")) setPhase(idx("read"));
        else if (!e.target.closest(".rd-letter, .reader-x")) close();
      }}
    >
      <div className="reader-veil" />
      {phase >= idx("read") && isGold && <Celebrate />}

      <button ref={closeRef} type="button" className="reader-x" onClick={close} aria-label="Cerrar carta">
        <X size={20} />
      </button>

      <div className="reader-stage">
        <div className="reader-fly">
          <Envelope letter={letter} sealMode={sealMode} className="env-reader">
            <article className="rd-letter">
              <span className="rd-tape rd-tape-l" />
              <span className="rd-tape rd-tape-r" />
              <div className="rd-scroll">
                <header className="rd-line" style={{ "--n": 0 }}>
                  <span className="rd-kicker">♡ abre cuando ♡</span>
                  <h2>{letter.title}</h2>
                  <i className="rd-rule">✦</i>
                </header>
                {photo && (
                  <figure className="rd-photo rd-line" style={{ "--n": 1 }}>
                    <img src={photo} alt="" onError={() => setPhotoOk(false)} />
                  </figure>
                )}
                {letter.text.map((p, i) => (
                  <p key={i} className="rd-line" style={{ "--n": i + 2 }}>
                    {p}
                  </p>
                ))}
                {letter.ps && (
                  <p className="rd-ps rd-line" style={{ "--n": letter.text.length + 2 }}>
                    {letter.ps}
                  </p>
                )}
                <footer className="rd-line rd-sign" style={{ "--n": letter.text.length + 3 }}>
                  <span>{SIGNATURE}</span>
                  <i className="rd-mini-seal" />
                </footer>
                <div className="rd-actions rd-line" style={{ "--n": letter.text.length + 4 }}>
                  <button type="button" className="rd-close" onClick={close}>
                    Guardar en mi corazón ♡
                  </button>
                </div>
              </div>
            </article>
          </Envelope>
        </div>
      </div>
    </div>
  );
}

/* ───────── Escena principal ───────── */

export default function LettersScene({ onBack, apiUrl = "" }) {
  const [opened, setOpened] = React.useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return new Set(Array.isArray(raw) ? raw : []);
    } catch {
      return new Set();
    }
  });
  const [today, setToday] = React.useState(localToday);
  const [active, setActive] = React.useState(null); // { letter, rect, fast }
  const [shakeId, setShakeId] = React.useState(null);
  const [bubble, setBubble] = React.useState(null);
  const timers = React.useRef([]);
  const bubbleTimer = React.useRef(null);

  // La fecha de hoy la manda el servidor, para que no se pueda adelantar cambiando el reloj.
  React.useEffect(() => {
    let alive = true;
    fetch(`${apiUrl}/api/now`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => alive && /^\d{4}-\d{2}-\d{2}$/.test(d?.today || "") && setToday(d.today))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [apiUrl]);

  const say = React.useCallback((text, hold = 4200) => {
    clearTimeout(bubbleTimer.current);
    setBubble({ text, key: Math.random() });
    bubbleTimer.current = setTimeout(() => setBubble(null), hold + text.length * 40);
  }, []);

  // Bienvenida del gatito (cuando ya cayeron los sobres)
  React.useEffect(() => {
    const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
    const first = opened.size === 0;
    later(() => say(`${greetingNow()} ♡`, 1700), 3500);
    later(
      () => say(first ? "Cada sobre es para un momento distinto. Elige según cómo te sientas hoy ♡" : "Qué bueno verte por aquí otra vez ♡", 5200),
      5900
    );
    return () => {
      timers.current.forEach(clearTimeout);
      clearTimeout(bubbleTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lockInfo = (L) => {
    if (L.unlock && today < L.unlock) return { locked: true, label: prettyDate(L.unlock), say: `Todavía no… ese es para el ${prettyDate(L.unlock)} ♡` };
    if (L.requires === "all") {
      const rest = LETTERS.filter((x) => x.requires !== "all" && !x.unlock);
      if (!rest.every((x) => opened.has(x.id))) {
        return { locked: true, label: "al abrir todos", say: "Este se abre cuando hayas leído todos los demás ✦" };
      }
    }
    return { locked: false };
  };

  const remember = (id) => {
    setOpened((prev) => {
      const next = new Set(prev);
      next.add(id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      } catch {
        /* sin almacenamiento: no pasa nada */
      }
      return next;
    });
  };

  const openLetter = (L, el) => {
    const info = lockInfo(L);
    if (info.locked) {
      setShakeId(L.id);
      setTimeout(() => setShakeId(null), 650);
      say(info.say, 3600);
      return;
    }
    clearTimeout(bubbleTimer.current);
    setBubble(null);
    const rect = el?.getBoundingClientRect();
    setActive({ letter: L, rect, fast: opened.has(L.id) });
  };

  const closeLetter = () => {
    if (!active) return;
    const id = active.letter.id;
    const wasNew = !opened.has(id);
    remember(id);
    const nextOpened = new Set(opened).add(id);
    if (LETTERS.filter((x) => !x.unlock).every((x) => nextOpened.has(x.id))) markDone("letters");
    setActive(null);
    const reactions = ["¡Aww! ♡", "miau ♡", "mmm… qué bonito", "¡qué lindo! ✦"];
    const left = LETTERS.filter((x) => x.requires !== "all" && !x.unlock && !(x.id === id || opened.has(x.id)));
    if (wasNew && active.letter.requires === "all") say("Lo lograste… ♡✦♡", 4000);
    else if (wasNew && left.length === 0 && LETTERS.some((x) => x.requires === "all")) say("¡Se abrió el sobre dorado! ✦", 4800);
    else say(reactions[Math.floor(Math.random() * reactions.length)], 2600);
  };

  return (
    <>
      <div className="lt-iris-ring" aria-hidden="true" />
      <section className="letters-scene" aria-label="Abre cuando">
        <Sky />

        <button type="button" className="close-button lt-back" onClick={onBack}>
          <X size={16} /> Volver
        </button>
        <div className="lt-count" aria-live="polite">
          <span>✦</span> {opened.size} de {LETTERS.length} abiertos
        </div>

        <header className="lt-head">
          <div className="lt-moon" aria-hidden="true">
            <span className="lt-moon-glow" />
            <span className="lt-moon-shape" />
            <span className="lt-moon-orbit">
              <i>✦</i>
            </span>
          </div>
          <h2>
            <em>Abre</em> <span className="lt-when">cuando…</span>
          </h2>
          <p>Un sobre para cada momento</p>
        </header>

        <div className="lt-grid">
          {LETTERS.map((L, i) => {
            const info = lockInfo(L);
            const isOpen = opened.has(L.id);
            const sealMode = isOpen ? "cracked" : "whole";
            const dx = ((i * 37) % 60) - 30;
            const rot = [-3.2, 2.4, -1.6, 3.1, -2.4, 1.8, -3, 2.6, -1.4, 2][i % 10];
            return (
              <div
                key={L.id}
                className="lt-item"
                style={{ "--i": i, "--dx": `${dx}vw`, "--rot": `${rot}deg`, "--bob": `${(i % 5) * 0.45}s` }}
              >
                <button
                  type="button"
                  className={[
                    "lt-env-btn",
                    info.locked ? "is-locked" : "",
                    isOpen ? "is-opened" : "",
                    L.glow && !isOpen ? "is-glow" : "",
                    L.tone === "gold" ? "is-gold" : "",
                    shakeId === L.id ? "is-shaking" : "",
                    active?.letter.id === L.id ? "is-away" : ""
                  ].join(" ")}
                  onClick={(e) => openLetter(L, e.currentTarget.querySelector(".env"))}
                  aria-label={info.locked ? `${L.title}. Todavía no se puede abrir: ${info.label}` : `Abrir: ${L.title}`}
                >
                  <Envelope letter={L} sealMode={sealMode} locked={info.locked} />
                  <span className="lt-cap">{L.title}</span>
                  <span className="lt-sub">
                    {info.locked ? `🔒 ${info.label}` : isOpen ? "leída ♡" : " "}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        <div className={`lt-cat ${bubble ? "is-talking" : ""}`}>
          {bubble && (
            <span className="lt-bubble" key={bubble.key} role="status">
              <Typed text={bubble.text} />
            </span>
          )}
          <LowPolyCat tone="cream" />
        </div>
      </section>

      {active && <Reader letter={active.letter} fromRect={active.rect} fast={active.fast} onClose={closeLetter} />}
    </>
  );
}
