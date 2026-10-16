import React from "react";
import { CalendarPlus, X } from "lucide-react";
import { LowPolyCat } from "./Cats.jsx";
import { Typed } from "./Letters.jsx";
import { getProgress, setFlag } from "./progress.js";
import "./door.css";

/* ════════════════════════════════════════════════════════════════
   CARTITA 5 · LA PUERTA  (cuenta regresiva hasta el día especial)

   QUÉ PASA
   - Mientras falta tiempo: una puerta de piedra sellada con cadenas y una cerradura
     de corazón, un reloj de cuenta regresiva y las pistas que ya tocan.
   - Cuando llega la hora: la cerradura brilla; al tocarla se rompe, las cadenas caen,
     la puerta se abre y aparece la carta.

   DÓNDE SE EDITA TODO
   La carta, las pistas, el texto misterioso y la fecha/hora de apertura NO están aquí:
   viven en  secret/final.json  (solo en el servidor). El navegador no recibe la carta
   hasta que llega la hora, así que nadie puede espiarla antes.

   VISTA PREVIA (solo en tu computador, con npm run dev):
     http://localhost:5173/?preview=open   → como si ya fuera el día
     http://localhost:5173/?preview=5d     → como si faltaran 5 días (también 3h, 40m, 12s)
   ════════════════════════════════════════════════════════════════ */

const DAY = 86400000;
const TIMEZONE = "America/Santiago";
const ORDER = ["closed", "ready", "unlock", "swing", "light", "opened"];

const reduceMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const pad2 = (n) => String(Math.max(0, n)).padStart(2, "0");

function split(ms) {
  const t = Math.max(0, ms);
  return {
    d: Math.floor(t / DAY),
    h: Math.floor((t % DAY) / 3600000),
    m: Math.floor((t % 3600000) / 60000),
    s: Math.floor((t % 60000) / 1000)
  };
}

function catLine(rem, open) {
  if (open) return "¡Tócala! La cerradura te está esperando ✦";
  const d = rem / DAY;
  if (d >= 30) return "Falta un montón, pero va a valer cada segundo ♡";
  if (d >= 14) return "Ya se siente más cerca…";
  if (d >= 7) return "¿Ya adivinaste qué hay detrás de la puerta?";
  if (d >= 2) return "Shhh… ya casi. Me muero de ganas de que la abras ✦";
  if (d >= 1) return "¡Mañana! ¡Mañana! ♡";
  if (rem > 3600000) return "Hoy es el día… ¿sientes los nervios? ♡";
  return "¡Ya casi! Respira hondo ✦";
}
const bucketOf = (rem, open) => (open ? "open" : rem >= 30 * DAY ? "a" : rem >= 14 * DAY ? "b" : rem >= 7 * DAY ? "c" : rem >= 2 * DAY ? "d" : rem >= DAY ? "e" : rem > 3600000 ? "f" : "g");

/* ───────── Datos desde el servidor ───────── */

function useFinal(apiUrl) {
  const [data, setData] = React.useState(null);
  const [error, setError] = React.useState(false);
  const offset = React.useRef(0);
  const preview = React.useMemo(() => new URLSearchParams(window.location.search).get("preview") || "", []);

  const load = React.useCallback(
    async (override) => {
      const pv = override ?? preview;
      try {
        const res = await fetch(`${apiUrl}/api/final${pv ? `?preview=${encodeURIComponent(pv)}` : ""}`, { cache: "no-store" });
        if (!res.ok) throw new Error("bad");
        const d = await res.json();
        offset.current = d.now - Date.now(); // la hora la manda el servidor, no el reloj del teléfono
        setData(d);
        setError(false);
        return d;
      } catch {
        setError(true);
        return null;
      }
    },
    [apiUrl, preview]
  );

  React.useEffect(() => {
    load();
    if (preview) return undefined; // en vista previa la hora simulada no se refresca sola
    const id = setInterval(load, 60000);
    return () => clearInterval(id);
  }, [load, preview]);

  const nowMs = React.useCallback(() => Date.now() + offset.current, []);
  return { data, error, load, nowMs, preview };
}

/* ───────── Reloj con tarjetas que giran ───────── */

function FlipUnit({ value, label }) {
  const text = typeof value === "number" ? pad2(value) : value;
  const [flip, setFlip] = React.useState(null);
  const last = React.useRef(text);

  React.useEffect(() => {
    if (text === last.current) return undefined;
    const from = last.current;
    last.current = text;
    if (reduceMotion()) return undefined;
    setFlip({ from, to: text, id: Math.random() });
    const t = setTimeout(() => setFlip(null), 720);
    return () => clearTimeout(t);
  }, [text]);

  const top = flip ? flip.to : text;
  const bottom = flip ? flip.from : text;

  return (
    <div className="fu">
      <div className="flip" aria-label={`${text} ${label}`}>
        <div className="half top"><span>{top}</span></div>
        <div className="half bot"><span>{bottom}</span></div>
        {flip && (
          <div className="leaf" key={flip.id}>
            <div className="half top front"><span>{flip.from}</span></div>
            <div className="half bot back"><span>{flip.to}</span></div>
          </div>
        )}
        <i className="pin l" />
        <i className="pin r" />
      </div>
      <span className="fu-label">{label}</span>
    </div>
  );
}

/* ───────── Piezas del dibujo ───────── */

const HEART = "M60 124C60 124 6 88 6 52C6 34 20 22 36 22C47 22 56 28 60 37C64 28 73 22 84 22C100 22 114 34 114 52C114 88 60 124 60 124Z";
const RUNES = ["✦", "☾", "◇", "♡", "✧", "☼", "◇", "✦"];

function makeChain(x1, y1, x2, y2, n, seed) {
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
  return Array.from({ length: n }, (_, i) => {
    const t = (i + 0.5) / n;
    const side = rnd() > 0.5 ? 1 : -1;
    return {
      x: x1 + dx * t,
      y: y1 + dy * t,
      ang,
      edge: i % 2 === 1,
      dx: side * (30 + rnd() * 150),
      rot: side * (200 + rnd() * 420),
      del: Math.abs(t - 0.5) * 0.9 + rnd() * 0.12
    };
  });
}
const CHAIN_A = makeChain(30, 118, 370, 482, 17, 11);
const CHAIN_B = makeChain(370, 118, 30, 482, 17, 29);

function Chains() {
  return (
    <svg className="door-chains" viewBox="0 0 400 560" aria-hidden="true">
      <defs>
        <linearGradient id="dr-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff0b4" />
          <stop offset=".5" stopColor="#e2ac3c" />
          <stop offset="1" stopColor="#9a6a1c" />
        </linearGradient>
      </defs>
      {[CHAIN_A, CHAIN_B].map((chain, ci) => (
        <g key={ci}>
          {chain.map((l, i) => (
            <g
              key={i}
              className="clink"
              style={{ transformOrigin: `${l.x}px ${l.y}px`, "--dx": `${l.dx}px`, "--rot": `${l.rot}deg`, "--del": `${l.del}s` }}
            >
              <g transform={`translate(${l.x} ${l.y}) rotate(${l.ang})`}>
                <ellipse rx="19" ry={l.edge ? 4.6 : 10.5} fill="none" stroke="#5c3a0c" strokeWidth="9.5" />
                <ellipse rx="19" ry={l.edge ? 4.6 : 10.5} fill="none" stroke="url(#dr-gold)" strokeWidth="6" />
                <ellipse rx="17" ry={l.edge ? 3.4 : 9} fill="none" stroke="#fff6cf" strokeOpacity=".55" strokeWidth="1.2" />
              </g>
            </g>
          ))}
          {/* argolla donde se clava la cadena */}
          {[chain[0], chain[chain.length - 1]].map((e, i) => (
            <g key={`a${i}`} className="clink anchor" style={{ transformOrigin: `${e.x}px ${e.y}px`, "--dx": `${e.dx}px`, "--rot": `${e.rot}deg`, "--del": "0s" }}>
              <circle cx={i === 0 ? e.x - Math.cos((e.ang * Math.PI) / 180) * 18 : e.x + Math.cos((e.ang * Math.PI) / 180) * 18} cy={i === 0 ? e.y - Math.sin((e.ang * Math.PI) / 180) * 18 : e.y + Math.sin((e.ang * Math.PI) / 180) * 18} r="11" fill="url(#dr-gold)" stroke="#5c3a0c" strokeWidth="3" />
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

function Frame() {
  const stoneLines = [];
  for (let a = 180; a < 360; a += 12) {
    const r = (a * Math.PI) / 180;
    stoneLines.push([200 + Math.cos(r) * 172, 200 + Math.sin(r) * 172, 200 + Math.cos(r) * 200, 200 + Math.sin(r) * 200]);
  }
  const runeAngles = [198, 222, 246, 270, 294, 318, 342].map((a, i) => ({ a, ch: RUNES[i] }));
  return (
    <svg className="door-frame" viewBox="0 0 400 560" aria-hidden="true">
      <defs>
        <linearGradient id="dr-stone" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9484a6" />
          <stop offset=".5" stopColor="#66587c" />
          <stop offset="1" stopColor="#3b2f50" />
        </linearGradient>
        <filter id="dr-grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="4" result="n" />
          <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .55 0" result="m" />
          <feComposite in="m" in2="SourceGraphic" operator="in" />
        </filter>
        <filter id="dr-rune-glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <mask id="dr-moonmask">
          <rect x="170" y="-10" width="60" height="50" fill="#000" />
          <circle cx="200" cy="15" r="13" fill="#fff" />
          <circle cx="206" cy="11" r="11" fill="#000" />
        </mask>
      </defs>
      <path d="M0 560V200A200 200 0 0 1 400 200V560ZM28 560V200A172 172 0 0 1 372 200V560Z" fill="url(#dr-stone)" fillRule="evenodd" />
      <path d="M0 560V200A200 200 0 0 1 400 200V560ZM28 560V200A172 172 0 0 1 372 200V560Z" fill="#12081c" fillRule="evenodd" filter="url(#dr-grain)" opacity=".8" />
      <g stroke="#1b1028" strokeOpacity=".7" strokeWidth="1.7">
        {stoneLines.map((l, i) => (
          <line key={i} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} />
        ))}
        {[256, 312, 368, 424, 480, 536].map((y) => (
          <g key={y}>
            <line x1="0" y1={y} x2="28" y2={y} />
            <line x1="372" y1={y + 28} x2="400" y2={y + 28} />
          </g>
        ))}
        <path d="M0 200A200 200 0 0 1 400 200" fill="none" strokeOpacity=".35" />
      </g>
      <g stroke="#cdbfe0" strokeOpacity=".22" strokeWidth="1">
        {stoneLines.map((l, i) => (
          <line key={i} x1={l[0] + 1.6} y1={l[1] + 1.2} x2={l[2] + 1.6} y2={l[3] + 1.2} />
        ))}
      </g>
      {/* borde dorado interior y sombra de la abertura */}
      <path d="M28 560V200A172 172 0 0 1 372 200V560" fill="none" stroke="#0a0412" strokeOpacity=".7" strokeWidth="9" />
      <path d="M29.5 560V200A170.5 170.5 0 0 1 370.5 200V560" fill="none" stroke="#e4b552" strokeWidth="2.4" />
      {/* runas que brillan más cuando se acerca el día */}
      <g className="runes" filter="url(#dr-rune-glow)">
        {runeAngles.map(({ a, ch }, i) => {
          const r = (a * Math.PI) / 180;
          return (
            <text key={i} className="rune" x={200 + Math.cos(r) * 187} y={200 + Math.sin(r) * 187 + 5} textAnchor="middle" fontSize="15" style={{ animationDelay: `${-i * 0.7}s` }}>
              {ch}
            </text>
          );
        })}
      </g>
      {/* clave del arco con luna */}
      <path d="M168 -16L232 -16L226 44L174 44Z" fill="url(#dr-stone)" stroke="#e4b552" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M168 -16L232 -16L226 44L174 44Z" fill="#12081c" filter="url(#dr-grain)" opacity=".6" />
      <circle cx="200" cy="15" r="13" fill="#ffe9a6" mask="url(#dr-moonmask)" className="keystone-moon" />
      <path d="M214 4l1.4 3.4 3.4 1.4-3.4 1.4-1.4 3.4-1.4-3.4-3.4-1.4 3.4-1.4z" fill="#ffe9a6" className="keystone-moon" />
      {/* base */}
      <rect x="-6" y="548" width="412" height="12" rx="3" fill="#2a1f3a" stroke="#e4b552" strokeWidth="1.4" />
    </svg>
  );
}

function Leaf({ side }) {
  return (
    <div className={`leaf-door ${side}`}>
      <i className="strap s1" />
      <i className="strap s2" />
      <i className="strap s3" />
      <svg className="carve" viewBox="0 0 100 100" aria-hidden="true">
        {side === "l" ? (
          <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round">
            <circle cx="50" cy="50" r="17" fill="currentColor" fillOpacity=".25" />
            {Array.from({ length: 12 }, (_, i) => (
              <line key={i} x1="50" y1="14" x2="50" y2={i % 2 ? 22 : 26} transform={`rotate(${i * 30} 50 50)`} />
            ))}
          </g>
        ) : (
          <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M66 62A28 28 0 1 1 42 22a22 22 0 0 0 24 40z" fill="currentColor" fillOpacity=".25" />
            <path d="M74 30l1.4 3.6 3.6 1.4-3.6 1.4L74 40l-1.4-3.6-3.6-1.4 3.6-1.4z" />
          </g>
        )}
      </svg>
      <i className="pull" />
    </div>
  );
}

/* ───────── Cerradura de corazón ───────── */

function LockArt({ broken }) {
  const body = (
    <>
      <path d={HEART} fill="url(#hl-gold)" stroke="#6a420c" strokeWidth="2.6" strokeLinejoin="round" />
      <path d={HEART} transform="translate(60 73) scale(.8) translate(-60 -73)" fill="url(#hl-gold2)" stroke="#fff3bd" strokeOpacity=".6" strokeWidth="1.4" />
      <ellipse cx="37" cy="45" rx="11" ry="5.5" fill="#fff" opacity=".5" transform="rotate(-32 37 45)" />
      <circle cx="60" cy="72" r="20" fill="url(#hl-glow)" className="keyglow" />
      <circle cx="60" cy="68" r="7.5" fill="#2a0b1c" />
      <path d="M55.6 72L52 93H68L64.4 72Z" fill="#2a0b1c" />
    </>
  );
  const shackle = (
    <>
      <path d="M38 30V12A22 22 0 0 1 82 12V30" fill="none" stroke="#5c3a0c" strokeWidth="12" strokeLinecap="round" />
      <path d="M38 30V12A22 22 0 0 1 82 12V30" fill="none" stroke="url(#hl-gold)" strokeWidth="7.4" strokeLinecap="round" />
      <path d="M40.5 28V12.5A19.5 19.5 0 0 1 79.5 12.5" fill="none" stroke="#fff6cf" strokeOpacity=".5" strokeWidth="1.4" strokeLinecap="round" />
    </>
  );
  return (
    <svg className={`lock-svg ${broken ? "is-broken" : ""}`} viewBox="-6 -20 132 152" aria-hidden="true">
      <defs>
        <linearGradient id="hl-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff0b4" />
          <stop offset=".45" stopColor="#e3ad3d" />
          <stop offset="1" stopColor="#97661a" />
        </linearGradient>
        <linearGradient id="hl-gold2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe28a" />
          <stop offset="1" stopColor="#c58b27" />
        </linearGradient>
        <radialGradient id="hl-glow">
          <stop offset="0" stopColor="#fff7d6" stopOpacity=".95" />
          <stop offset=".45" stopColor="#ff9fc0" stopOpacity=".6" />
          <stop offset="1" stopColor="#ff9fc0" stopOpacity="0" />
        </radialGradient>
        <clipPath id="hl-cl">
          <polygon points="-10,-30 62,-30 55,26 66,54 53,82 62,140 -10,140" />
        </clipPath>
        <clipPath id="hl-cr">
          <polygon points="62,-30 140,-30 140,140 62,140 53,82 66,54 55,26" />
        </clipPath>
      </defs>
      {broken ? (
        <>
          <g className="hl-s">{shackle}</g>
          <g className="hl-l" clipPath="url(#hl-cl)">{body}</g>
          <g className="hl-r" clipPath="url(#hl-cr)">{body}</g>
        </>
      ) : (
        <>
          {shackle}
          {body}
        </>
      )}
    </svg>
  );
}

/* ───────── Texto que cae / lluvia ───────── */

function Rain({ n = 52 }) {
  const bits = React.useMemo(
    () =>
      Array.from({ length: n }, (_, i) => ({
        ch: ["♡", "✦", "✧", "♥", "·", "★"][i % 6],
        x: (i * 21.7) % 100,
        d: (i % 13) * 0.16,
        t: 3.8 + (i % 6) * 0.5,
        s: 14 + (i % 5) * 7,
        dx: ((i * 37) % 150) - 75,
        r: ((i * 53) % 360) - 180
      })),
    [n]
  );
  return (
    <div className="dr-rain" aria-hidden="true">
      {bits.map((b, i) => (
        <span key={i} style={{ left: `${b.x}%`, fontSize: b.s, animationDelay: `${b.d}s`, animationDuration: `${b.t}s`, "--dx": `${b.dx}px`, "--rr": `${b.r}deg` }}>
          {b.ch}
        </span>
      ))}
    </div>
  );
}

/* ───────── Calendario (.ics) ───────── */

function downloadIcs(ev) {
  const fmt = (iso) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const esc = (t) => String(t || "").replace(/[\\;,]/g, (m) => `\\${m}`).replace(/\n/g, "\\n");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Portal Especial//ES",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@portal-especial`,
    `DTSTAMP:${fmt(new Date().toISOString())}`,
    `DTSTART:${fmt(ev.start)}`,
    `DTEND:${fmt(ev.end || ev.start)}`,
    `SUMMARY:${esc(ev.title)}`,
    ev.location ? `LOCATION:${esc(ev.location)}` : "",
    ev.description ? `DESCRIPTION:${esc(ev.description)}` : "",
    "END:VEVENT",
    "END:VCALENDAR"
  ].filter(Boolean);
  const url = URL.createObjectURL(new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "nuestro-plan.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/* ───────── La carta ───────── */

function LetterReader({ letter, onClose, onBack }) {
  const [leaving, setLeaving] = React.useState(false);
  const closeRef = React.useRef(null);
  const paras = letter.paragraphs || [];

  const close = React.useCallback(() => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(onClose, 460);
  }, [leaving, onClose]);

  React.useEffect(() => {
    const t = setTimeout(() => closeRef.current?.focus({ preventScroll: true }), 1800);
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [close]);

  let n = 0;
  const next = () => n++;

  return (
    <div className={`fl ${leaving ? "is-leaving" : ""}`} role="dialog" aria-modal="true" aria-label={letter.title || "Carta"}>
      <div className="fl-veil" onClick={close} />
      <Rain />
      <div className="fl-aura" aria-hidden="true" />
      <article className="fl-card">
        <span className="fl-seal" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 20.4s-8-5-8-10.7A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.7c0 5.7-8 10.7-8 10.7z" />
          </svg>
        </span>
        <button ref={closeRef} type="button" className="fl-x" onClick={close} aria-label="Cerrar carta">
          <X size={18} />
        </button>
        <div className="fl-scroll">
          <header className="fl-line" style={{ "--n": next() }}>
            {letter.kicker && <span className="fl-kicker">✦ {letter.kicker} ✦</span>}
            <h2>{letter.title}</h2>
            <i className="fl-rule">♡</i>
          </header>

          {paras.map((p, i) => (
            <p key={i} className="fl-line" style={{ "--n": next() }}>
              {p}
            </p>
          ))}

          {letter.plan?.length > 0 && (
            <dl className="fl-plan fl-line" style={{ "--n": next() }}>
              {letter.plan.map((it, i) => (
                <div key={i}>
                  <dt>{it.label}</dt>
                  <dd>{it.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {letter.ps && (
            <p className="fl-ps fl-line" style={{ "--n": next() }}>
              {letter.ps}
            </p>
          )}

          <footer className="fl-sign fl-line" style={{ "--n": next() }}>
            <span>{letter.signature || "Con todo mi cariño ♡"}</span>
          </footer>

          <div className="fl-actions fl-line" style={{ "--n": next() }}>
            {letter.event && (
              <button type="button" className="fl-btn ghost" onClick={() => downloadIcs(letter.event)}>
                <CalendarPlus size={18} /> Agregar a mi calendario
              </button>
            )}
            <button type="button" className="fl-btn" onClick={close}>
              Guardar en mi corazón ♡
            </button>
            <button type="button" className="fl-link" onClick={onBack}>
              Volver a las cartitas
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}

/* ───────── Escena ───────── */

function prettyOpen(ms) {
  try {
    const date = new Intl.DateTimeFormat("es-CL", { timeZone: TIMEZONE, weekday: "long", day: "numeric", month: "long" }).format(ms);
    const time = new Intl.DateTimeFormat("es-CL", { timeZone: TIMEZONE, hour: "2-digit", minute: "2-digit", hour12: false }).format(ms);
    return `${date}${time === "00:00" || time === "24:00" ? "" : ` · ${time} h`}`;
  } catch {
    return new Date(ms).toLocaleString("es-CL");
  }
}

const SKY = (() => {
  let s = 5;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  return {
    stars: Array.from({ length: 110 }, () => ({ x: rnd() * 100, y: rnd() * 74, r: rnd() < 0.12 ? 3 : rnd() < 0.5 ? 2 : 1.4, d: 2 + rnd() * 4, t: rnd() * 6, big: rnd() < 0.09 })),
    flies: Array.from({ length: 20 }, () => ({ x: rnd() * 100, y: 46 + rnd() * 50, s: 3 + rnd() * 4, d: 9 + rnd() * 10, t: -rnd() * 14, dx: (rnd() - 0.5) * 80 })),
    sparks: Array.from({ length: 18 }, (_, i) => ({ x: 8 + rnd() * 84, d: 3 + rnd() * 4, t: -rnd() * 6, s: 10 + rnd() * 12, c: i % 3 }))
  };
})();

export default function DoorScene({ onBack, apiUrl = "" }) {
  const { data, error, load, nowMs, preview } = useFinal(apiUrl);
  const startedOpen = React.useMemo(() => !!getProgress().doorOpened, []);
  const [phase, setPhase] = React.useState(startedOpen ? "opened" : "closed");
  const [instant, setInstant] = React.useState(startedOpen);
  const [reading, setReading] = React.useState(false);
  const [now, setNow] = React.useState(() => nowMs());
  const [lockShake, setLockShake] = React.useState(false);
  const [flash, setFlash] = React.useState(false);
  const [bubble, setBubble] = React.useState(null);
  const timers = React.useRef([]);
  const bubbleTimer = React.useRef(null);
  const sawClosed = React.useRef(false);
  const lastRetry = React.useRef(0);

  const at = (p) => ORDER.indexOf(phase) >= ORDER.indexOf(p);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  React.useEffect(() => () => {
    timers.current.forEach(clearTimeout);
    clearTimeout(bubbleTimer.current);
  }, []);

  // El reloj interno (usa la hora del servidor)
  React.useEffect(() => {
    const id = setInterval(() => setNow(nowMs()), 250);
    return () => clearInterval(id);
  }, [nowMs]);

  const rem = data ? data.opensAt - now : null;
  const isOpen = !!data?.open;

  // Llegó la hora y todavía no la confirma el servidor: pregunta de nuevo (la carta solo sale de allá)
  React.useEffect(() => {
    if (!data || data.open || rem === null || rem > 0) return;
    const t = Date.now();
    if (t - lastRetry.current < 1100) return;
    lastRetry.current = t;
    load(preview ? "open" : undefined);
  }, [data, rem, load, preview]);

  React.useEffect(() => {
    if (!data) return;
    if (!data.open) {
      sawClosed.current = true;
      if (phase === "opened" && !instant) return;
      if (phase === "opened") setPhase("closed"); // (vista previa) la hora simulada dice que aún no es
      return;
    }
    if (phase === "closed") {
      setPhase("ready");
      if (sawClosed.current && !reduceMotion()) {
        setFlash(true);
        later(() => setFlash(false), 2200);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, phase]);

  const say = React.useCallback((text, hold = 4200) => {
    clearTimeout(bubbleTimer.current);
    setBubble({ text, key: Math.random() });
    bubbleTimer.current = setTimeout(() => setBubble(null), hold + text.length * 40);
  }, []);

  const bucket = data ? bucketOf(rem, isOpen) : null;
  const firstSay = React.useRef(true);
  React.useEffect(() => {
    if (!bucket || phase === "opened" || at("unlock")) return undefined;
    const delay = firstSay.current ? 3600 : 300;
    firstSay.current = false;
    const t = setTimeout(() => say(catLine(rem, isOpen), 5000), delay);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bucket]);

  const touchLock = () => {
    if (phase === "closed") {
      setLockShake(true);
      later(() => setLockShake(false), 650);
      if (rem !== null) {
        const t = split(rem);
        say(t.d > 0 ? `Todavía no… faltan ${t.d} día${t.d === 1 ? "" : "s"} ♡` : "Todavía no… ¡falta poquito! ✦", 3600);
      }
      return;
    }
    if (phase !== "ready") return;
    clearTimeout(bubbleTimer.current);
    setBubble(null);
    setFlash(false);
    setInstant(false);
    if (reduceMotion()) {
      setPhase("opened");
      setFlag("doorOpened");
      setReading(true);
      return;
    }
    setPhase("unlock");
    later(() => setPhase("swing"), 1900);
    later(() => setPhase("light"), 4300);
    later(() => {
      setPhase("opened");
      setFlag("doorOpened");
      setReading(true);
    }, 6300);
  };

  const t = split(rem ?? 0);
  const near = data && !isOpen && rem < DAY;
  const fin = data && !isOpen && rem < 60000;
  const ten = data && !isOpen && rem > 0 && rem <= 10500 && Math.ceil(rem / 1000) <= 10;
  const sealed = !at("swing") && !instant;
  const cls = [
    "door-scene",
    ...ORDER.filter((p) => at(p)).map((p) => `p-${p}`),
    near ? "is-near" : "",
    fin ? "is-final" : "",
    instant ? "is-instant" : "",
    lockShake ? "lock-shake" : ""
  ].join(" ");

  const clues = data?.clues || [];
  const showLetterBtn = phase === "opened" && !reading && data?.letter;

  return (
    <>
      <div className="dr-veil" aria-hidden="true" />
      {flash && <div className="dr-flash" aria-hidden="true" />}
      <section className={cls} aria-label="La puerta">
        {/* ── cielo ── */}
        <div className="dr-sky" aria-hidden="true">
          <div className="dr-aurora a1" />
          <div className="dr-aurora a2" />
          <div className="dr-moon">
            <i />
          </div>
          <div className="dr-stars">
            {SKY.stars.map((st, i) => (
              <span key={i} className={st.big ? "star big" : "star"} style={{ left: `${st.x}%`, top: `${st.y}%`, width: st.r, height: st.r, animationDuration: `${st.d}s`, animationDelay: `${st.t}s` }} />
            ))}
          </div>
          <span className="dr-shoot s1" />
          <span className="dr-shoot s2" />
          <svg className="dr-hills" viewBox="0 0 1440 240" preserveAspectRatio="none">
            <path className="h1" d="M0 120C180 60 340 150 540 104C740 58 880 132 1080 92C1230 62 1350 104 1440 84V240H0Z" />
            <path className="h2" d="M0 176C220 124 400 196 620 164C840 130 1000 200 1220 164C1330 146 1396 164 1440 154V240H0Z" />
          </svg>
          <div className="dr-mist m1" />
          <div className="dr-mist m2" />
          <div className="dr-flies">
            {SKY.flies.map((f, i) => (
              <span key={i} style={{ left: `${f.x}%`, top: `${f.y}%`, width: f.s, height: f.s, animationDuration: `${f.d}s`, animationDelay: `${f.t}s`, "--fx": `${f.dx}px` }} />
            ))}
          </div>
        </div>

        <button type="button" className="close-button dr-back" onClick={onBack}>
          <X size={16} /> Volver
        </button>
        {data?.preview && <span className="dr-preview">vista previa</span>}

        <div className="dr-layout">
          {/* ── la puerta ── */}
          <div className="dr-stage">
            <div className="door-halo" aria-hidden="true" />
            <div className="door-wrap">
              <div className="door-arch">
                <div className="door-void">
                  <div className="door-light" aria-hidden="true">
                    <i className="lt-core" />
                    <i className="lt-rays" />
                    <i className="lt-rays r2" />
                    <div className="lt-sparks">
                      {SKY.sparks.map((sp, i) => (
                        <span key={i} className={`c${sp.c}`} style={{ left: `${sp.x}%`, fontSize: sp.s, animationDuration: `${sp.d}s`, animationDelay: `${sp.t}s` }}>
                          {sp.c === 1 ? "♡" : "✦"}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="door-leaves">
                    <Leaf side="l" />
                    <Leaf side="r" />
                    <i className="seam" />
                  </div>
                </div>
                <Frame />
                {sealed && <Chains />}
                {sealed && (
                  <div className={`lock-pos ${phase === "ready" ? "is-ready" : ""} ${at("unlock") ? "is-breaking" : ""}`}>
                    {phase === "ready" && <span className="lock-prompt">Toca la cerradura ♡</span>}
                    <button type="button" className="lock-btn" onClick={touchLock} aria-label={phase === "ready" ? "Abrir la puerta" : "La puerta todavía está sellada"}>
                      <span className="lock-ring" aria-hidden="true" />
                      <span className="lock-ring r2" aria-hidden="true" />
                      <LockArt broken={at("unlock")} />
                    </button>
                    {at("unlock") && (
                      <span className="lock-burst" aria-hidden="true">
                        {Array.from({ length: 22 }, (_, i) => {
                          const a = (i / 22) * Math.PI * 2 + (i % 2) * 0.25;
                          const d = 60 + (i % 5) * 26;
                          return <i key={i} style={{ "--bx": `${Math.cos(a) * d}px`, "--by": `${Math.sin(a) * d - 10}px`, "--bs": 0.6 + (i % 3) * 0.4, "--bd": `${(i % 6) * 0.03}s` }} />;
                        })}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="door-floor" aria-hidden="true">
                <div className="circle-tilt">
                  <div className="circle-spin">
                    <i className="ring c1" />
                    <i className="ring c2" />
                    <i className="ring c3" />
                    {["✦", "☾", "◇", "♡", "☼", "✧", "◇", "☾"].map((g, i) => (
                      <b key={i} style={{ rotate: `${i * 45}deg` }}>
                        <span>{g}</span>
                      </b>
                    ))}
                  </div>
                </div>
              </div>
              {["l", "r"].map((side) => (
                <div key={side} className={`lantern ${side}`} aria-hidden="true">
                  <i className="chain" />
                  <i className="cap" />
                  <i className="glass">
                    <i className="flame" />
                  </i>
                </div>
              ))}
            </div>
          </div>

          {/* ── panel ── */}
          <div className="dr-panel">
            {error && !data && (
              <div className="dr-msg">
                <p>La puerta no responde en este momento…</p>
                <button type="button" className="dr-btn" onClick={() => load()}>
                  Intentar de nuevo
                </button>
              </div>
            )}

            {!(error && !data) && phase !== "opened" && (
              <>
                <p className="dr-eyebrow">✦ la última puerta ✦</p>
                <h2 className="dr-title">
                  <em>La puerta</em>
                  <span>{isOpen ? "ya se puede abrir" : "se abre en…"}</span>
                </h2>

                {isOpen ? (
                  <div className="dr-ready">
                    <p className="dr-ready-big">¡Ya llegó el día!</p>
                    <p className="dr-ready-sub">Toca la cerradura de corazón para abrirla ♡</p>
                  </div>
                ) : (
                  <div className="dr-clock" role="timer" aria-live="off">
                    <FlipUnit value={data ? t.d : "··"} label={t.d === 1 ? "día" : "días"} />
                    <i className="colon">:</i>
                    <FlipUnit value={data ? t.h : "··"} label="horas" />
                    <i className="colon">:</i>
                    <FlipUnit value={data ? t.m : "··"} label="min" />
                    <i className="colon">:</i>
                    <FlipUnit value={data ? t.s : "··"} label="seg" />
                  </div>
                )}

                {data && !isOpen && <p className="dr-when">Se abre el {prettyOpen(data.opensAt)}</p>}
                {data?.teaser && <p className="dr-teaser">{data.teaser}</p>}

                {clues.length > 0 && !isOpen && (
                  <ul className="dr-clues">
                    {clues.map((c, i) => (
                      <li key={c.daysBefore} className={c.unlocked ? "is-on" : "is-off"} style={{ "--i": i }}>
                        {c.unlocked ? (
                          <>
                            <b>✦</b>
                            <span>{c.text}</span>
                          </>
                        ) : (
                          <>
                            <b>🔒</b>
                            <span>
                              Pista {i + 1} · se revela cuando falten {c.daysBefore} día{c.daysBefore === 1 ? "" : "s"}
                            </span>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}

            {phase === "opened" && (
              <div className="dr-after">
                <p className="dr-eyebrow">✦ la puerta está abierta ✦</p>
                <h2 className="dr-title">
                  <em>Gracias</em>
                  <span>por llegar hasta aquí</span>
                </h2>
                <p className="dr-teaser">Todo esto lo hice pensando en ti ♡</p>
                <div className="dr-actions">
                  {showLetterBtn && (
                    <button type="button" className="dr-btn" onClick={() => setReading(true)}>
                      Leer la carta otra vez
                    </button>
                  )}
                  <button type="button" className="dr-btn ghost" onClick={onBack}>
                    Volver a las cartitas
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {ten && (
          <div className="dr-bigcount" key={Math.ceil(rem / 1000)} aria-hidden="true">
            {Math.ceil(rem / 1000)}
          </div>
        )}

        <div className={`dr-cat ${bubble ? "is-talking" : ""} ${!near && !isOpen ? "is-sleepy" : ""}`}>
          {bubble && (
            <span className="dr-bubble" key={bubble.key} role="status">
              <Typed text={bubble.text} />
            </span>
          )}
          <LowPolyCat tone="cream" />
        </div>
      </section>

      {reading && data?.letter && <LetterReader letter={data.letter} onClose={() => setReading(false)} onBack={onBack} />}
    </>
  );
}
