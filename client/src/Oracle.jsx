import React from "react";
import { X } from "lucide-react";
import { LowPolyCat } from "./Cats.jsx";
import { Typed } from "./Letters.jsx";
import { markDone } from "./progress.js";
import "./oracle.css";

/* ════════════════════════════════════════════════════════════════
   CARTITA 4 · EL ORÁCULO DE NOSOTROS  (quiz con cartas de tarot)

   CÓMO EDITAR
   1) QUESTIONS: tus preguntas. Cada una es una carta. Tipos:
        type: "choice"  → opción múltiple
              q, options: [...], answer: <posición correcta, empezando en 0>
        type: "tf"      → verdadero o falso
              q, answer: true | false
        type: "order"   → ordenar (items ya van en el ORDEN CORRECTO; se mezclan solos)
              q, items: [...]
        type: "love"    → la pregunta final del cariño infinito (no cuenta en el puntaje)
      Campos opcionales de todas: card (nombre de la carta), art (dibujo), hint (pista del gatito),
      right (lo que dice el oráculo si acierta), wrong (si falla).
      Dibujos (art): sun · moon · star · lovers · magic · eye · crown · paw · key · world · fool · wheel
   2) RESULTS: las tres lecturas finales según el puntaje.
   3) COUPON: el premio si responde todo perfecto (pon null para quitarlo).

   Las preguntas de ejemplo son solo una guía: reemplázalas por las tuyas ♡
   ════════════════════════════════════════════════════════════════ */

const TITLE = ["El oráculo", "de nosotros"];
const SUBTITLE = "¿Qué tanto me conoces?";
const STORAGE_KEY = "portal-oraculo:v1";

const QUESTIONS = [
  {
    type: "choice",
    card: "El Sol",
    art: "sun",
    q: "¿Cuál es mi comida favorita?",
    options: ["Pizza", "Sushi", "Tacos", "Helado"],
    answer: 0,
    hint: "Se come mejor compartiendo…",
    right: "Las cartas ya lo sabían. Alguien presta atención ♡",
    wrong: "Uy… el oráculo anota esto para la próxima cita."
  },
  {
    type: "tf",
    card: "La Luna",
    art: "moon",
    q: "Verdadero o falso: siempre me quedo con el último pedazo.",
    answer: true,
    right: "Verdadero. Y nunca me arrepiento.",
    wrong: "Falso no era… la verdad es que el último siempre es mío."
  },
  {
    type: "choice",
    card: "La Estrella",
    art: "star",
    q: "¿Qué me pasa cuando tengo hambre?",
    options: ["Me pongo de mal humor", "Me vuelvo poeta", "Desaparezco hasta encontrar comida", "Me río de todo"],
    answer: 2,
    hint: "Es un misterio que solo se resuelve con comida.",
    right: "Exacto: modo búsqueda activado.",
    wrong: "Las estrellas dicen que desaparezco. Es ciencia."
  },
  {
    type: "order",
    card: "El Mago",
    art: "magic",
    q: "Ordena estos momentos, del más antiguo al más reciente.",
    items: ["El día que nos conocimos", "Nuestra primera salida", "Nuestro primer viaje juntos", "Hoy, jugando este oráculo"],
    hint: "El último es el más fácil.",
    right: "Orden perfecto. La memoria no se te escapa ✦",
    wrong: "Casi… igual, el orden correcto es el de arriba hacia abajo."
  },
  {
    type: "choice",
    card: "La Sacerdotisa",
    art: "eye",
    q: "¿Qué animal soy cuando duermo?",
    options: ["Un gatito acurrucado", "Un oso en hibernación", "Un koala abrazado a todo", "Un pulpo con las sábanas"],
    answer: 0,
    right: "Un gatito, claro. Lo sabías.",
    wrong: "Nope: gatito acurrucado. Siempre."
  },
  {
    type: "tf",
    card: "Los Enamorados",
    art: "lovers",
    q: "Verdadero o falso: me acuerdo de lo que llevabas puesto cuando nos conocimos.",
    answer: true,
    right: "Verdadero. Hay cosas que no se olvidan ♡",
    wrong: "Era verdadero… me acuerdo mejor de lo que crees."
  },
  {
    type: "choice",
    card: "El Carro",
    art: "wheel",
    q: "¿Cuál sería nuestro plan perfecto?",
    options: ["Maratón de películas con manta", "Viaje improvisado a la playa", "Cocinar algo difícil y fallar", "Pasear por la ciudad sin rumbo"],
    answer: 0,
    right: "Manta, película y tú. Ese es el plan.",
    wrong: "El oráculo vio una manta y una peli en nuestro futuro."
  },
  {
    type: "order",
    card: "La Fuerza",
    art: "paw",
    q: "Ordena, de lo que más me gusta a lo que menos.",
    items: ["Estar contigo", "Los gatitos", "La pizza", "Madrugar"],
    right: "Sin dudar. Ya sabes lo que de verdad importa.",
    wrong: "Estar contigo siempre va primero. Madrugar, último."
  },
  {
    type: "choice",
    card: "El Mundo",
    art: "world",
    q: "¿Qué es lo que más me gusta de ti?",
    options: ["Tu risa", "Tu forma de cuidarme", "Tu ternura", "Todo lo anterior"],
    answer: 3,
    hint: "Esta no tiene trampa.",
    right: "Todo lo anterior. Y mucho más ♡",
    wrong: "Era «todo lo anterior». No me alcanza una sola cosa."
  },
  {
    type: "love",
    card: "El Infinito",
    art: "key",
    q: "Última carta. ¿Cuánto te quiero?",
    right: "Más allá de lo que cabe en una carta ♡"
  }
];

const RESULTS = [
  {
    min: 0.85,
    card: "Los Enamorados",
    art: "lovers",
    title: "Me conoces mejor que mi propio reflejo",
    text: "Las cartas lo confirman: sabes quién soy, cómo pienso y hasta lo que voy a pedir de comer. Contigo no hacen falta oráculos, pero igual qué lindo que juguemos."
  },
  {
    min: 0.5,
    card: "La Estrella",
    art: "star",
    title: "Vas muy bien, todavía quedan misterios",
    text: "Sabes lo importante y te faltan unos detalles. Lo bueno es que tenemos toda la vida para descubrirlos, uno por uno."
  },
  {
    min: 0,
    card: "El Loco",
    art: "fool",
    title: "Hay mucho por descubrir, y eso es lo divertido",
    text: "El oráculo lo ve claro: nos faltan más citas, más preguntas y más tiempo juntos para conocernos. Qué plan tan bonito."
  }
];

const COUPON = "Cupón del oráculo: vale por un abrazo largo y la comida que elijas ♡";

const REACT_RIGHT = ["¡Sííí! ♡", "¡Lo sabías!", "¡Esa es! ✦", "¡Qué bien me conoces!"];
const REACT_WRONG = ["Ayy… casi", "Mmm, esa no era", "No pasa nada ♡", "Tranqui, sigue ✦"];

/* ───────── Utilidades ───────── */

const ROMAN = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function seededShuffle(items, seed) {
  const arr = items.map((label, rank) => ({ label, rank }));
  let s = seed * 2654435761 + 12345;
  const rnd = () => ((s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  for (let n = 0; n < 4; n++) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    if (arr.some((x, i) => x.rank !== i)) break; // que no quede ya en orden
  }
  return arr;
}

const reduceMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/* ───────── Dibujos de las cartas (SVG propio, trazo dorado) ───────── */

function CardArt({ kind }) {
  const g = "#c9962f";
  const gl = "#f1cf79";
  const rose = "#c8365f";
  const common = { viewBox: "0 0 100 100", className: "art", "aria-hidden": true };
  switch (kind) {
    case "moon":
      return (
        <svg {...common}>
          <path d="M70 62A30 30 0 1 1 42 22a24 24 0 0 0 28 40z" fill={gl} stroke={g} strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="76" cy="26" r="3" fill={g} />
          <circle cx="24" cy="76" r="2.4" fill={g} />
          <path d="M80 48l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z" fill={g} />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <path d="M50 8l11 26 28 3-21 19 6 28-24-14-24 14 6-28L11 37l28-3z" fill={gl} stroke={g} strokeWidth="2.5" strokeLinejoin="round" />
          {[[16, 80], [84, 78], [86, 20], [14, 20]].map(([x, y], i) => (
            <path key={i} d={`M${x} ${y - 5}l1.5 3.5 3.5 1.5-3.5 1.5-1.5 3.5-1.5-3.5-3.5-1.5 3.5-1.5z`} fill={g} />
          ))}
        </svg>
      );
    case "lovers":
      return (
        <svg {...common}>
          <path d="M36 82S10 64 10 42a15 15 0 0 1 26-10 15 15 0 0 1 12 14c0 18-12 30-12 36z" fill={rose} stroke={g} strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M64 82S38 62 40 40a15 15 0 0 1 24-9 15 15 0 0 1 26 11c0 22-26 40-26 40z" fill="#f6a8bd" stroke={g} strokeWidth="2.5" strokeLinejoin="round" opacity=".95" />
          <path d="M50 10l1.6 4 4 1.6-4 1.6L50 21l-1.6-3.8-4-1.6 4-1.6z" fill={g} />
        </svg>
      );
    case "magic":
      return (
        <svg {...common}>
          <path d="M50 6c2 22 10 30 32 32-22 2-30 10-32 32-2-22-10-30-32-32 22-2 30-10 32-32z" fill={gl} stroke={g} strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="82" cy="78" r="5" fill={g} />
          <circle cx="18" cy="80" r="3.4" fill={g} />
          <path d="M70 70l16 22" stroke={g} strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "eye":
      return (
        <svg {...common}>
          <path d="M6 50C22 24 78 24 94 50 78 76 22 76 6 50z" fill="#fff6dc" stroke={g} strokeWidth="2.5" strokeLinejoin="round" />
          <circle cx="50" cy="50" r="15" fill={gl} stroke={g} strokeWidth="2.5" />
          <circle cx="50" cy="50" r="6.5" fill="#3a0f26" />
          <circle cx="54" cy="46" r="2.2" fill="#fff" />
          {[28, 50, 72].map((x) => (
            <path key={x} d={`M${x} 18v-6`} stroke={g} strokeWidth="3" strokeLinecap="round" />
          ))}
        </svg>
      );
    case "crown":
      return (
        <svg {...common}>
          <path d="M12 72l-4-42 24 20 18-30 18 30 24-20-4 42z" fill={gl} stroke={g} strokeWidth="2.5" strokeLinejoin="round" />
          <rect x="12" y="72" width="76" height="10" rx="3" fill={g} />
          {[8, 50, 92].map((x, i) => (
            <circle key={i} cx={x} cy={i === 1 ? 20 : 30} r="4" fill={rose} stroke={g} strokeWidth="2" />
          ))}
        </svg>
      );
    case "paw":
      return (
        <svg {...common}>
          <ellipse cx="50" cy="66" rx="22" ry="18" fill={gl} stroke={g} strokeWidth="2.5" />
          {[[20, 42, 9], [38, 24, 9.5], [62, 24, 9.5], [80, 42, 9]].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={gl} stroke={g} strokeWidth="2.5" />
          ))}
          <path d="M50 74s-10-6-10-12a5 5 0 0 1 10-2 5 5 0 0 1 10 2c0 6-10 12-10 12z" fill={rose} />
        </svg>
      );
    case "key":
      return (
        <svg {...common}>
          <path d="M50 50c-8-14-26-16-26-2s18 16 26 2zm0 0c8-14 26-16 26-2s-18 16-26 2z" fill="none" stroke={g} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M50 50c-8 14-26 16-26 2" fill="none" stroke="none" />
          <circle cx="50" cy="50" r="4" fill={rose} />
        </svg>
      );
    case "world":
      return (
        <svg {...common}>
          <circle cx="50" cy="50" r="34" fill="#cfe9f7" stroke={g} strokeWidth="2.5" />
          <path d="M30 34c8-6 16-2 14 6s-12 6-10 16-14 6-14-6c0-8 4-12 10-16zM58 30c8 0 14 6 10 14s-12 4-14 12 8 14 16 8c8-6 10-14 6-22" fill="#9fd7b7" stroke={g} strokeWidth="1.5" />
          <ellipse cx="50" cy="50" rx="46" ry="12" fill="none" stroke={g} strokeWidth="2.5" transform="rotate(-20 50 50)" />
        </svg>
      );
    case "fool":
      return (
        <svg {...common}>
          <ellipse cx="30" cy="38" rx="22" ry="17" fill="#f6a8bd" stroke={g} strokeWidth="2.5" transform="rotate(-24 30 38)" />
          <ellipse cx="70" cy="38" rx="22" ry="17" fill="#c9b6ee" stroke={g} strokeWidth="2.5" transform="rotate(24 70 38)" />
          <ellipse cx="34" cy="68" rx="14" ry="11" fill="#f6dfa0" stroke={g} strokeWidth="2.5" transform="rotate(24 34 68)" />
          <ellipse cx="66" cy="68" rx="14" ry="11" fill="#b9e6d3" stroke={g} strokeWidth="2.5" transform="rotate(-24 66 68)" />
          <rect x="47" y="30" width="6" height="48" rx="3" fill="#3a0f26" />
          <path d="M50 30c-4-10-10-14-14-16M50 30c4-10 10-14 14-16" stroke="#3a0f26" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
      );
    case "wheel":
      return (
        <svg {...common}>
          <circle cx="50" cy="50" r="34" fill="none" stroke={g} strokeWidth="5" />
          <circle cx="50" cy="50" r="9" fill={gl} stroke={g} strokeWidth="2.5" />
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d="M50 16v25" stroke={g} strokeWidth="3.5" strokeLinecap="round" transform={`rotate(${i * 45} 50 50)`} />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <circle key={i} cx="50" cy="12" r="3.6" fill={gl} stroke={g} strokeWidth="1.6" transform={`rotate(${i * 45 + 22} 50 50)`} />
          ))}
        </svg>
      );
    case "sun":
    default:
      return (
        <svg {...common}>
          {Array.from({ length: 12 }, (_, i) => (
            <path key={i} d="M50 8l5 14h-10z" fill={g} transform={`rotate(${i * 30} 50 50)`} />
          ))}
          <circle cx="50" cy="50" r="22" fill={gl} stroke={g} strokeWidth="2.5" />
          <circle cx="43" cy="46" r="2.3" fill="#3a0f26" />
          <circle cx="57" cy="46" r="2.3" fill="#3a0f26" />
          <path d="M42 56q8 7 16 0" fill="none" stroke="#3a0f26" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );
  }
}

/* ───────── Reverso de la carta ───────── */

function CardBack() {
  return (
    <div className="tback" aria-hidden="true">
      <svg viewBox="0 0 100 158" preserveAspectRatio="none">
        <defs>
          <pattern id="or-lattice" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <path d="M0 0H14M0 0V14" stroke="#e8c36a" strokeOpacity=".28" strokeWidth=".7" />
          </pattern>
          <radialGradient id="or-backglow" cx="50%" cy="50%" r="60%">
            <stop offset="0" stopColor="#7a2350" />
            <stop offset="1" stopColor="#3a0f26" />
          </radialGradient>
        </defs>
        <rect width="100" height="158" fill="url(#or-backglow)" />
        <rect width="100" height="158" fill="url(#or-lattice)" />
        <rect x="5" y="5" width="90" height="148" rx="4" fill="none" stroke="#e8c36a" strokeWidth="1.2" />
        <rect x="9" y="9" width="82" height="140" rx="3" fill="none" stroke="#e8c36a" strokeOpacity=".5" strokeWidth=".6" />
        <circle cx="50" cy="79" r="23" fill="#2b0b1c" stroke="#e8c36a" strokeWidth="1.2" />
        <path d="M58 91a15 15 0 1 1-14-23 12 12 0 0 0 14 23z" fill="#ffe9a6" />
        <path d="M63 64l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2z" fill="#ffe9a6" />
        {[[16, 18], [84, 18], [16, 140], [84, 140]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y - 5}l1.6 3.4 3.4 1.6-3.4 1.6-1.6 3.4-1.6-3.4-3.4-1.6 3.4-1.6z`} fill="#e8c36a" />
        ))}
      </svg>
    </div>
  );
}

/* ───────── Carta completa ───────── */

function TarotCard({ up, number, name, art, children, className = "" }) {
  return (
    <div className={`tcard ${up ? "is-up" : ""} ${className}`}>
      <div className="tcard-inner">
        <CardBack />
        <div className="tface">
          <span className="tf-corner tl">✦</span>
          <span className="tf-corner tr">✦</span>
          <span className="tf-corner bl">✦</span>
          <span className="tf-corner br">✦</span>
          <span className="tf-num">{number}</span>
          <div className="tf-art">
            <CardArt kind={art} />
          </div>
          <span className="tf-name">{name}</span>
          <i className="tf-rule" />
          {children}
        </div>
      </div>
    </div>
  );
}

/* ───────── Chispas al acertar ───────── */

function Sparks({ n = 14 }) {
  return (
    <span className="sparks" aria-hidden="true">
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        const d = 38 + (i % 4) * 16;
        return <i key={i} style={{ "--sx": `${Math.cos(a) * d}px`, "--sy": `${Math.sin(a) * d - 8}px`, "--sd": `${(i % 5) * 0.03}s` }} />;
      })}
    </span>
  );
}

function RisingHearts() {
  return (
    <div className="rise-hearts" aria-hidden="true">
      {Array.from({ length: 9 }, (_, i) => (
        <i key={i} style={{ left: `${8 + i * 10}%`, animationDelay: `${i * 0.09}s`, "--dx": `${(i % 2 ? 1 : -1) * (8 + (i % 3) * 8)}px`, fontSize: 14 + (i % 3) * 6 }}>
          {i % 3 === 0 ? "✦" : "♡"}
        </i>
      ))}
    </div>
  );
}

/* ───────── Pregunta ───────── */

const heartPct = (v) => {
  if (v >= 98) return "∞";
  const pct = v <= 50 ? v * 2 : Math.round(100 * Math.pow(1.19, v - 50));
  return `${pct.toLocaleString("es-CL")}%`;
};

function Question({ q, index, total, scoredIndex, onResolve, onNext, say, isLast, exiting }) {
  const [up, setUp] = React.useState(false);
  const [picked, setPicked] = React.useState(null);
  const [seq, setSeq] = React.useState([]);
  const [love, setLove] = React.useState(0);
  const [result, setResult] = React.useState(null); // null | true | false
  const [hinted, setHinted] = React.useState(false);
  const [nudge, setNudge] = React.useState(false);
  const saysRef = React.useRef(null);

  const pool = React.useMemo(() => (q.type === "order" ? seededShuffle(q.items, index + 3) : null), [q, index]);
  const done = result !== null;

  React.useEffect(() => {
    const t = setTimeout(() => setUp(true), reduceMotion() ? 0 : 760);
    return () => clearTimeout(t);
  }, []);

  React.useEffect(() => {
    if (done) setTimeout(() => saysRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 250);
  }, [done]);

  const resolve = (ok) => {
    if (done) return;
    setResult(ok);
    onResolve(ok);
    say(ok ? pick(REACT_RIGHT) : pick(REACT_WRONG), 2600);
  };

  const chooseOption = (i) => {
    if (done) return;
    setPicked(i);
    resolve(i === q.answer);
  };

  const chooseTf = (v) => {
    if (done) return;
    setPicked(v ? 0 : 1);
    resolve(v === q.answer);
  };

  const tapOrder = (pi) => {
    if (done || seq.includes(pi)) return;
    const next = [...seq, pi];
    setSeq(next);
    if (next.length === pool.length) resolve(next.every((p, pos) => pool[p].rank === pos));
  };

  const confirmLove = () => {
    if (love < 98) {
      setNudge(true);
      setTimeout(() => setNudge(false), 600);
      say("Las cartas dicen que es más que eso… sube ♡", 3200);
      return;
    }
    resolve(true);
  };

  const hint = () => {
    if (hinted || done) return;
    setHinted(true);
    say(q.hint ? `Pista: ${q.hint}` : "Esta no tiene pista… confía en tu corazón ♡", 4200);
  };

  const feedback = done ? (result ? q.right : q.wrong) : null;
  const rightIdx = q.type === "tf" ? (q.answer ? 0 : 1) : q.answer;

  return (
    <div className={`or-play ${exiting ? "is-exiting" : ""}`}>
      <div className={`or-card-wrap deal ${done ? (result ? "is-right" : "is-wrong") : ""}`}>
        <TarotCard up={up} number={ROMAN[index + 1] || index + 1} name={q.card} art={q.art}>
          <p className="tf-q">{q.q}</p>
        </TarotCard>
        {done && result && <RisingHearts />}
        <span className="or-card-aura" aria-hidden="true" />
      </div>

      <div className={`or-panel ${up ? "is-in" : ""}`}>
        {(q.type === "choice" || q.type === "tf") && (
          <div className={`or-options ${q.type === "tf" ? "is-tf" : ""}`}>
            {(q.type === "tf" ? ["Verdadero ✦", "Falso ☾"] : q.options).map((opt, i) => {
              const isPicked = picked === i;
              const cls = [
                "or-opt",
                isPicked ? "is-picked" : "",
                done && i === rightIdx ? "is-correct" : "",
                done && isPicked && i !== rightIdx ? "is-miss" : "",
                done && !isPicked && i !== rightIdx ? "is-dim" : ""
              ].join(" ");
              return (
                <button
                  key={i}
                  type="button"
                  className={cls}
                  style={{ "--o": i }}
                  disabled={done}
                  onClick={() => (q.type === "tf" ? chooseTf(i === 0) : chooseOption(i))}
                >
                  <span className="or-opt-mark">{q.type === "tf" ? "" : String.fromCharCode(65 + i)}</span>
                  <span className="or-opt-label">{opt}</span>
                  {done && isPicked && i === rightIdx && <Sparks />}
                </button>
              );
            })}
          </div>
        )}

        {q.type === "order" && (
          <div className="or-order">
            <p className="or-order-hint">Toca en orden: {seq.length} de {pool.length}</p>
            <div className="or-options">
              {pool.map((it, pi) => {
                const pos = seq.indexOf(pi);
                const chosen = pos !== -1;
                const cls = [
                  "or-opt",
                  chosen ? "is-picked" : "",
                  done && pool[pi].rank === pos ? "is-correct" : "",
                  done && pool[pi].rank !== pos ? "is-miss" : ""
                ].join(" ");
                return (
                  <button key={pi} type="button" className={cls} style={{ "--o": pi }} disabled={done || chosen} onClick={() => tapOrder(pi)}>
                    <span className="or-opt-mark">{chosen ? pos + 1 : "·"}</span>
                    <span className="or-opt-label">{it.label}</span>
                  </button>
                );
              })}
            </div>
            {!done && seq.length > 0 && (
              <button type="button" className="or-undo" onClick={() => setSeq([])}>
                ↺ empezar de nuevo
              </button>
            )}
          </div>
        )}

        {q.type === "love" && (
          <div className={`or-love ${nudge ? "is-nudge" : ""} ${love >= 98 ? "is-inf" : ""}`}>
            <div className="or-love-val" aria-live="polite">
              {heartPct(love)}
            </div>
            <div className="or-love-track">
              <i style={{ width: `${love}%` }} />
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={love}
                disabled={done}
                onChange={(e) => setLove(Number(e.target.value))}
                aria-label="Cuánto te quiero"
              />
            </div>
            <div className="or-love-scale">
              <span>poquito</span>
              <span>muchísimo</span>
              <span>∞</span>
            </div>
            {!done && (
              <button type="button" className="or-btn" onClick={confirmLove}>
                Confirmar ♡
              </button>
            )}
          </div>
        )}

        {!done && q.type !== "love" && (
          <button type="button" className={`or-hint ${hinted ? "is-used" : ""}`} onClick={hint} disabled={hinted}>
            ✦ {hinted ? "Pista usada" : "Pedir una pista al gatito"}
          </button>
        )}

        {done && (
          <div className="or-says" ref={saysRef}>
            <span className="or-says-seal">{result ? "✦" : "☾"}</span>
            <p>{feedback}</p>
            {q.type === "order" && !result && (
              <ol className="or-says-order">
                {q.items.map((it, i) => (
                  <li key={i}>{it}</li>
                ))}
              </ol>
            )}
            <button type="button" className="or-btn" onClick={onNext}>
              {isLast ? "Ver mi lectura ✦" : "Siguiente carta →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────── Barra de estrellas (progreso) ───────── */

function Progress({ answers, current, total }) {
  return (
    <div className="or-progress" aria-label={`Carta ${current + 1} de ${total}`}>
      {Array.from({ length: total }, (_, i) => {
        const a = answers[i];
        const cls = a === undefined ? (i === current ? "is-now" : "") : a ? "is-yes" : "is-no";
        return (
          <i key={i} className={cls}>
            {a === undefined ? "✧" : a ? "✦" : "·"}
          </i>
        );
      })}
    </div>
  );
}

/* ───────── Lluvia dorada del resultado ───────── */

function GoldRain() {
  const bits = React.useMemo(
    () =>
      Array.from({ length: 44 }, (_, i) => ({
        ch: ["✦", "✧", "♡", "·", "★"][i % 5],
        x: (i * 23.3) % 100,
        d: 1.8 + (i % 12) * 0.14,
        t: 3.6 + (i % 6) * 0.45,
        s: 12 + (i % 5) * 6,
        dx: ((i * 41) % 120) - 60,
        r: ((i * 57) % 360) - 180
      })),
    []
  );
  return (
    <div className="gold-rain" aria-hidden="true">
      {bits.map((b, i) => (
        <span key={i} style={{ left: `${b.x}%`, fontSize: b.s, animationDelay: `${b.d}s`, animationDuration: `${b.t}s`, "--dx": `${b.dx}px`, "--rr": `${b.r}deg` }}>
          {b.ch}
        </span>
      ))}
    </div>
  );
}

/* ───────── Escena principal ───────── */

export default function OracleScene({ onBack }) {
  const scored = QUESTIONS.filter((q) => q.type !== "love").length;
  const [stage, setStage] = React.useState("intro"); // intro | play | result
  const [qi, setQi] = React.useState(0);
  const [answers, setAnswers] = React.useState([]);
  const [exiting, setExiting] = React.useState(false);
  const [round, setRound] = React.useState(0);
  const [bubble, setBubble] = React.useState(null);
  const [last] = React.useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    } catch {
      return null;
    }
  });
  const timers = React.useRef([]);
  const bubbleTimer = React.useRef(null);

  const say = React.useCallback((text, hold = 4000) => {
    clearTimeout(bubbleTimer.current);
    setBubble({ text, key: Math.random() });
    bubbleTimer.current = setTimeout(() => setBubble(null), hold + text.length * 40);
  }, []);

  React.useEffect(() => {
    const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
    later(() => say("Respira… el oráculo te va a preguntar ✦", 4200), 3300);
    return () => {
      timers.current.forEach(clearTimeout);
      clearTimeout(bubbleTimer.current);
    };
  }, [say]);

  const start = () => {
    setAnswers([]);
    setQi(0);
    setExiting(false);
    setRound((r) => r + 1);
    setStage("play");
    say("¡Que empiece la lectura!", 1800);
  };

  const onResolve = (ok) => {
    setAnswers((a) => {
      const n = [...a];
      n[qi] = ok;
      return n;
    });
  };

  const next = () => {
    if (exiting) return;
    setBubble(null);
    setExiting(true);
    setTimeout(() => {
      setExiting(false);
      if (qi + 1 < QUESTIONS.length) setQi(qi + 1);
      else finish();
    }, reduceMotion() ? 0 : 480);
  };

  const finish = () => {
    const score = answers.filter((a, i) => a && QUESTIONS[i].type !== "love").length;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ score, total: scored }));
    } catch {
      /* sin almacenamiento: no pasa nada */
    }
    markDone("oracle");
    setStage("result");
    setTimeout(() => say("¡Mira qué te salió! ♡", 3500), 4200);
  };

  const score = answers.filter((a, i) => a && QUESTIONS[i]?.type !== "love").length;
  const ratio = score / scored;
  const res = RESULTS.find((r) => ratio >= r.min) || RESULTS[RESULTS.length - 1];
  const perfect = score === scored;

  return (
    <>
      <div className="or-curtain l" aria-hidden="true" />
      <div className="or-curtain r" aria-hidden="true" />
      <section className={`oracle-scene stage-${stage}`} aria-label="El oráculo de nosotros">
        <div className="or-room" aria-hidden="true">
          <div className="or-glow" />
          <div className="or-bokeh">
            {Array.from({ length: 16 }, (_, i) => (
              <span key={i} style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 80}%`, width: 30 + ((i * 17) % 60), height: 30 + ((i * 17) % 60), animationDelay: `${-(i % 7) * 1.7}s`, animationDuration: `${12 + (i % 5) * 3}s` }} />
            ))}
          </div>
          <div className="or-dust">
            {Array.from({ length: 24 }, (_, i) => (
              <span key={i} style={{ left: `${(i * 41) % 100}%`, animationDelay: `${-(i % 9) * 1.4}s`, animationDuration: `${9 + (i % 6) * 2.4}s`, "--dx": `${((i * 29) % 60) - 30}px` }} />
            ))}
          </div>
          <div className="or-table" />
          {["l", "r"].map((s) => (
            <div key={s} className={`or-candle ${s}`}>
              <i className="flame" />
              <i className="wick" />
              <i className="wax" />
              <i className="drip" />
              <i className="holder" />
            </div>
          ))}
        </div>

        <button type="button" className="close-button or-back" onClick={onBack}>
          <X size={16} /> Volver
        </button>

        {stage === "intro" && (
          <div className="or-intro">
            <p className="or-eyebrow">✦ lectura de cartas ✦</p>
            <h2>
              <em>{TITLE[0]}</em>
              <span>{TITLE[1]}</span>
            </h2>
            <p className="or-sub">{SUBTITLE}</p>

            <div className="or-deck" aria-hidden="true">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} className="or-deck-card" style={{ "--n": i }}>
                  <CardBack />
                </div>
              ))}
            </div>

            <button type="button" className="or-btn or-start" onClick={start}>
              Comenzar la lectura
            </button>
            {last && (
              <p className="or-last">
                Tu última lectura: {last.score} de {last.total} ♡
              </p>
            )}
          </div>
        )}

        {stage === "play" && (
          <div className="or-stagewrap">
            <header className="or-top">
              <Progress answers={answers} current={qi} total={QUESTIONS.length} />
              <p className="or-count">
                Carta {qi + 1} de {QUESTIONS.length}
              </p>
            </header>
            <Question
              key={`${round}-${qi}`}
              q={QUESTIONS[qi]}
              index={qi}
              total={QUESTIONS.length}
              onResolve={onResolve}
              onNext={next}
              say={say}
              isLast={qi === QUESTIONS.length - 1}
              exiting={exiting}
            />
            {QUESTIONS.length - qi - 1 > 0 && (
            <div className="or-deckpile" aria-hidden="true">
              {Array.from({ length: Math.min(3, QUESTIONS.length - qi - 1) }, (_, i) => (
                <div key={i} style={{ "--k": i }}>
                  <CardBack />
                </div>
              ))}
              <span>{QUESTIONS.length - qi - 1}</span>
            </div>
            )}
          </div>
        )}

        {stage === "result" && (
          <div className="or-result">
            <GoldRain />
            <div className="rs-rays" aria-hidden="true" />
            <div className="rs-card">
              <TarotCard up number="✦" name={res.card} art={res.art} className="rs-tarot">
                <p className="tf-q rs-title">{res.title}</p>
              </TarotCard>
            </div>
            <div className="rs-text">
              <p className="rs-score" aria-label={`${score} de ${scored}`}>
                {Array.from({ length: scored }, (_, i) => (
                  <i key={i} className={i < score ? "on" : ""} style={{ "--h": i }}>
                    {i < score ? "♥" : "♡"}
                  </i>
                ))}
              </p>
              <p className="rs-count">{score} de {scored} cartas acertadas</p>
              <p className="rs-body">{res.text}</p>
              {perfect && COUPON && <p className="rs-coupon">{COUPON}</p>}
              <div className="rs-actions">
                <button type="button" className="or-btn ghost" onClick={start}>
                  ↺ Otra lectura
                </button>
                <button type="button" className="or-btn" onClick={onBack}>
                  Volver a las cartitas
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={`or-cat ${bubble ? "is-talking" : ""}`}>
          {bubble && (
            <span className="or-bubble" key={bubble.key} role="status">
              <Typed text={bubble.text} />
            </span>
          )}
          <LowPolyCat tone="lilac" />
        </div>
      </section>
    </>
  );
}
