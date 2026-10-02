import React from "react";
import { createRoot } from "react-dom/client";
import { CalendarDays, Check, Lock, ScrollText, X } from "lucide-react";
import "./styles.css";

const API_URL = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? "http://localhost:3001" : "");

const symbols = ["◇", "✦", "◆", "○", "✧", "·"];

function MoonEmblem({ small = false }) {
  return (
    <div className={small ? "moon-emblem small" : "moon-emblem"} aria-hidden="true">
      <div className="moon-disc" />
      <span className="moon-star">✦</span>
    </div>
  );
}

function TarotCard({ side }) {
  return (
    <div className={`tarot-card tarot-${side}`} aria-hidden="true">
      <div className="tarot-inner">
        <div className="tarot-art">
          {side === "left" ? (
            <>
              <div className="sun-face">☼</div>
              <div className="tiny-stars">✦　·　✧</div>
            </>
          ) : (
            <>
              <div className="moon-face">☾</div>
              <div className="tiny-stars">✧　·　✦</div>
            </>
          )}
        </div>
        <span className="tarot-label">{side === "left" ? "EL SOL" : "LA LUNA"}</span>
      </div>
    </div>
  );
}

function OrnamentColumn({ side }) {
  return (
    <div className={`ornament-column ${side}`} aria-hidden="true">
      <span className="orb">○</span>
      <span className="diamond">◇</span>
      <span className="star">✦</span>
      <span className="crescent">{side === "left" ? "☾" : "◐"}</span>
      <span className="diamond">◇</span>
      <span className="orb">○</span>
    </div>
  );
}

function Confetti() {
  return (
    <div className="confetti-layer" aria-hidden="true">
      {Array.from({ length: 34 }, (_, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${(i * 29.7) % 100}%`,
            animationDelay: `${(i % 9) * 0.08}s`,
            animationDuration: `${3.2 + (i % 5) * 0.35}s`,
            "--drift": `${((i * 43) % 160) - 80}px`,
            "--rotation": `${(i * 37) % 360}deg`
          }}
        >
          {symbols[i % symbols.length]}
        </span>
      ))}
    </div>
  );
}

/* ───────────── Transición: bandada de loros ───────────── */

// Tiempos (ms). COVER = la bandada llena la pantalla; FALL = caen y revelan la escena.
const COVER_MS = 1700;
const FALL_MS = 3000;
const CONFETTI_DELAY_MS = 1100;

const PARROT_BODY =
  "M121 33 C130 32 137 38 135 47 C134 52 131 54 128 53 C131 49 129 45 124 44 " +
  "C122 52 114 58 105 58 C99 68 86 76 72 78 L20 116 L10 118 L15 109 L9 104 L58 70 " +
  "C66 58 80 48 92 40 C94 28 106 22 115 26 C118 28 120 30 121 33 Z";

// Plumas del ala: [ángulo, largo]. Las del ala cercana apuntan hacia atrás/arriba.
const NEAR_FEATHERS = [[14, 46], [32, 54], [50, 58], [68, 56], [86, 48]];
const FAR_FEATHERS = [[-40, 44], [-58, 52], [-76, 54], [-94, 46]];

function Wing({ x, y, feathers, dir, className }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className={className}>
        <circle r="11" />
        {feathers.map(([angle, length]) => (
          <ellipse
            key={angle}
            cx={(dir * length) / 2}
            cy="0"
            rx={length / 2}
            ry="5.6"
            transform={`rotate(${angle})`}
          />
        ))}
      </g>
    </g>
  );
}

const Heart = React.memo(function Heart() {
  return (
    <svg className="heart-shape" viewBox="0 0 32 29" aria-hidden="true">
      <path d="M16 28 C16 28 2 18 2 9.5 C2 5 5.5 2 9.5 2 C12.5 2 15 3.8 16 6.5 C17 3.8 19.5 2 22.5 2 C26.5 2 30 5 30 9.5 C30 18 16 28 16 28 Z" />
    </svg>
  );
});

const Parrot = React.memo(function Parrot() {
  return (
    <svg className="parrot" viewBox="0 -14 160 134" aria-hidden="true">
      <path d={PARROT_BODY} />
      <Wing x={94} y={46} feathers={FAR_FEATHERS} dir={1} className="wing wing-far" />
      <Wing x={88} y={54} feathers={NEAR_FEATHERS} dir={-1} className="wing wing-near" />
    </svg>
  );
});

function makeFlock(w, h) {
  const rnd = (a, b) => a + Math.random() * (b - a);
  const spacing = w < 620 ? 64 : 84; // más juntos = más cobertura
  const size = spacing * 2.3;
  const cols = Math.ceil(w / spacing) + 1;
  const rows = Math.ceil(h / spacing) + 1;
  const birds = [];

  for (let r = 0; r <= rows; r++) {
    for (let c = 0; c <= cols; c++) {
      const x = c * spacing + rnd(-0.3, 0.3) * spacing;
      const y = r * spacing + rnd(-0.3, 0.3) * spacing;
      const outY = h - y + size * 1.6 + rnd(0, 220);

      birds.push({
        id: `${r}-${c}`,
        x,
        y,
        size,
        rest: rnd(-14, 10), // inclinación final mientras cubren
        scale: rnd(0.82, 1.3),
        tone: Math.random() > 0.35 ? "#2b0a16" : "#3d1122",
        // entrada: barrido de izquierda a derecha
        inX: -rnd(380, 620),
        inY: rnd(-160, 160),
        inDelay: (x / w) * 0.45 + rnd(0, 0.2),
        inDur: rnd(0.72, 0.95),
        // caída: primero los de abajo, con caos
        outX: rnd(-90, 90),
        outY,
        outRot: rnd(-80, 80),
        outDelay: (1 - y / h) * 0.45 + rnd(0, 0.5),
        outDur: 0.9 + (outY / h) * 0.45 + rnd(0, 0.3),
        // aleteo
        flapDur: rnd(0.24, 0.38),
        flapDelay: -rnd(0, 0.4)
      });
    }
  }

  // Corazones mezclados entre los loros (≈ 1 por cada 6 aves)
  const heartCount = Math.round(birds.length / 6);
  for (let i = 0; i < heartCount; i++) {
    const x = rnd(0, w);
    const y = rnd(0, h);
    const hs = spacing * rnd(0.9, 1.5);
    const outY = h - y + hs * 1.6 + rnd(0, 220);
    birds.push({
      id: `heart-${i}`,
      kind: "heart",
      x,
      y,
      size: hs,
      rest: rnd(-18, 18),
      scale: 1,
      tone: Math.random() > 0.5 ? "#7a1d3a" : "#a83d5d",
      inX: -rnd(380, 620),
      inY: rnd(-160, 160),
      inDelay: (x / w) * 0.45 + rnd(0, 0.25),
      inDur: rnd(0.72, 0.95),
      outX: rnd(-60, 60),
      outY,
      outRot: rnd(-120, 120),
      outDelay: (1 - y / h) * 0.45 + rnd(0, 0.5),
      outDur: 0.9 + (outY / h) * 0.45 + rnd(0, 0.3),
      flapDur: 0.3,
      flapDelay: 0
    });
  }
  return birds;
}

function Flock({ phase }) {
  const [birds] = React.useState(() => makeFlock(window.innerWidth, window.innerHeight));

  return (
    <div className={`flock phase-${phase}`} aria-hidden="true">
      <div className="flock-shade" />
      {birds.map((b) => (
        <div
          key={b.id}
          className={b.kind === "heart" ? "bird heart" : "bird"}
          style={{
            left: b.x - b.size / 2,
            top: b.y - b.size / 2,
            width: b.size,
            color: b.tone,
            "--r": `${b.rest}deg`,
            "--s": b.scale,
            "--in-x": `${b.inX}px`,
            "--in-y": `${b.inY}px`,
            "--in-delay": `${b.inDelay}s`,
            "--in-dur": `${b.inDur}s`,
            "--out-x": `${b.outX}px`,
            "--out-y": `${b.outY}px`,
            "--out-r": `${b.outRot}deg`,
            "--out-delay": `${b.outDelay}s`,
            "--out-dur": `${b.outDur}s`,
            "--flap-dur": `${b.flapDur}s`,
            "--flap-delay": `${b.flapDelay}s`
          }}
        >
          {b.kind === "heart" ? <Heart /> : <Parrot />}
        </div>
      ))}
    </div>
  );
}

/* ───────────── Nueva escena: 5 opciones (vacías por ahora) ───────────── */

const OPTION_COUNT = 5;

/* ── Carta 1: Acuerdos y condiciones (edita estos textos con tus palabras) ── */

const AGREEMENT_PHRASE = "he leído este testamento y acepto las condiciones";

const TERMS = [
  { title: "Primer término", text: "Aquí irá tu primer término. Reemplaza este texto con tus propias palabras." },
  { title: "Segundo término", text: "Aquí irá tu segundo término. Reemplaza este texto con tus propias palabras." },
  { title: "Tercer término", text: "Aquí irá tu tercer término. Reemplaza este texto con tus propias palabras." }
];

const CLAUSES = [
  { title: "Primera cláusula", text: "Aquí irá tu primera cláusula. Reemplaza este texto con tus propias palabras." },
  { title: "Segunda cláusula", text: "Aquí irá tu segunda cláusula. Reemplaza este texto con tus propias palabras." },
  { title: "Tercera cláusula", text: "Aquí irá tu tercera cláusula. Reemplaza este texto con tus propias palabras." }
];

// Ignora mayúsculas, tildes, puntuación y espacios de más al comparar la frase
const normalize = (t) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

function AgreementItem({ index, kind, item, checked, onToggle }) {
  return (
    <label className={`agree-item ${checked ? "is-checked" : ""}`}>
      <input type="checkbox" checked={checked} onChange={onToggle} />
      <span className="agree-box" aria-hidden="true">
        {checked && <Check size={16} strokeWidth={3} />}
      </span>
      <span className="agree-copy">
        <strong>
          {index + 1}. {item.title}
        </strong>
        <span>{item.text}</span>
      </span>
    </label>
  );
}

function AgreementView({ onBack, onAccept }) {
  const total = TERMS.length + CLAUSES.length;
  const [checks, setChecks] = React.useState(() => Array(total).fill(false));
  const [typed, setTyped] = React.useState("");

  const done = checks.filter(Boolean).length;
  const allChecked = done === total;
  const phraseOk = normalize(typed) === normalize(AGREEMENT_PHRASE);
  const toggle = (i) => setChecks((c) => c.map((v, k) => (k === i ? !v : v)));

  return (
    <section className="choice-scene agreement-scene intro-off" aria-label="Acuerdos y condiciones">
      <div className="choice-frame" />
      <article className="paper">
        <header className="paper-head">
          <ScrollText size={30} />
          <h2>Acuerdos y condiciones</h2>
          <p>Marca cada punto para poder firmar.</p>
        </header>

        <h3 className="paper-section">Términos</h3>
        {TERMS.map((t, i) => (
          <AgreementItem key={t.title} index={i} item={t} checked={checks[i]} onToggle={() => toggle(i)} />
        ))}

        <h3 className="paper-section">Cláusulas</h3>
        {CLAUSES.map((c, i) => (
          <AgreementItem
            key={c.title}
            index={i}
            item={c}
            checked={checks[TERMS.length + i]}
            onToggle={() => toggle(TERMS.length + i)}
          />
        ))}

        <div className="sign-block">
          <p className="sign-count">
            {allChecked ? "Todo marcado ✓" : `${done} de ${total} marcados`}
          </p>
          <label htmlFor="sign-input" className="sign-label">
            Para firmar, escribe exactamente:
            <em>“{AGREEMENT_PHRASE}”</em>
          </label>
          <input
            id="sign-input"
            className={`sign-input ${phraseOk ? "is-ok" : ""}`}
            type="text"
            value={typed}
            disabled={!allChecked}
            placeholder={allChecked ? "Escribe aquí tu firma…" : "Primero marca todos los puntos"}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setTyped(e.target.value)}
            onPaste={(e) => e.preventDefault()}
          />
          <div className="sign-actions">
            <button type="button" className="ghost-button" onClick={onBack}>
              <X size={16} /> Volver
            </button>
            <button type="button" className="accept-button" disabled={!(allChecked && phraseOk)} onClick={onAccept}>
              Aceptar y continuar
            </button>
          </div>
        </div>
      </article>
    </section>
  );
}

/* ───────────── Escena de cartitas ───────────── */

function ChoiceScene({ onBack, signed, onSign }) {
  const [view, setView] = React.useState("grid"); // grid | agreement
  const [revisit, setRevisit] = React.useState(false); // quita la intro larga al volver

  if (view === "agreement") {
    return (
      <AgreementView
        onBack={() => { setRevisit(true); setView("grid"); }}
        onAccept={() => { onSign(); setRevisit(true); setView("grid"); }}
      />
    );
  }

  return (
    <section className={`choice-scene ${revisit ? "intro-off" : ""}`} aria-label="Elige una opción">
      <div className="choice-frame" />
      <div className="choice-head">
        <MoonEmblem small />
        <h2>
          Elige <em>tu look</em>
        </h2>
        <div className="divider">
          <span />
          <b>◇</b>
          <span />
        </div>
      </div>

      <div className="choice-grid">
        {Array.from({ length: OPTION_COUNT }, (_, i) => {
          if (i === 0) {
            return (
              <button
                key={i}
                type="button"
                className={`choice-slot is-agreement ${signed ? "is-signed" : ""}`}
                style={{ "--i": i }}
                onClick={() => setView("agreement")}
              >
                <span className="slot-number">1</span>
                {signed ? <Check size={30} /> : <ScrollText size={30} />}
                <span className="slot-title">Acuerdos y condiciones</span>
                <span className="slot-state">{signed ? "Firmado ✓" : "Léelos y firma"}</span>
              </button>
            );
          }
          return (
            <div key={i} className={`choice-slot ${signed ? "" : "is-locked"}`} style={{ "--i": i }}>
              <span className="slot-number">{i + 1}</span>
              {!signed && <Lock size={22} className="slot-lock" />}
            </div>
          );
        })}
      </div>

      {!signed && <p className="choice-hint">Firma los acuerdos para abrir las demás cartitas.</p>}

      <button className="close-button choice-back" onClick={onBack}>
        <X size={16} /> Volver
      </button>
    </section>
  );
}

function App() {
  const [date, setDate] = React.useState("");
  const [error, setError] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [phase, setPhase] = React.useState("idle"); // idle | cover | fall
  const [confetti, setConfetti] = React.useState(false);
  const [signed, setSigned] = React.useState(false);
  const timers = React.useRef([]);

  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function playTransition() {
    const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
    const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    timers.current.forEach(clearTimeout);
    timers.current = [];
    setConfetti(false);

    if (reduceMotion) {
      setOpen(true);
      setConfetti(true);
      return;
    }

    setPhase("cover");
    // Cuando la pantalla ya está cubierta, cambiamos de escena por debajo y empiezan a caer.
    later(() => {
      setOpen(true);
      setPhase("fall");
    }, COVER_MS);
    later(() => setConfetti(true), COVER_MS + CONFETTI_DELAY_MS);
    later(() => setPhase("idle"), COVER_MS + FALL_MS);
  }

  async function unlock(event) {
    event.preventDefault();
    if (!date) {
      setError("Primero hay que elegir una fecha…");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/unlock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date })
      });

      const result = await response.json();

      if (result.success) {
        playTransition();
      } else {
        setError(result.message);
      }
    } catch {
      setError("El portal no responde en este momento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="portal">
      <div className="grain" />
      <div className="frame" />
      <div className="corner corner-tl" />
      <div className="corner corner-tr" />
      <div className="corner corner-bl" />
      <div className="corner corner-br" />

      <OrnamentColumn side="left" />
      <OrnamentColumn side="right" />
      <TarotCard side="left" />
      <TarotCard side="right" />

      <div className="top-celestial">
        <div className="line" />
        <span>◐</span>
        <MoonEmblem />
        <span>◑</span>
        <div className="line" />
      </div>

      <section className="content">
        <h1>
          Portal <em>Especial</em>
        </h1>

        <div className="divider">
          <span />
          <b>◇</b>
          <span />
        </div>

        <form onSubmit={unlock} className="unlock-form">
          <label className="date-field">
            <CalendarDays size={24} strokeWidth={1.35} />
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setError("");
              }}
              aria-label="Fecha especial"
            />
          </label>

          <button className="unlock-button" disabled={loading}>
            {loading ? "Abriendo…" : "Desbloquear"} <span>→</span>
          </button>

          <div className={`error ${error ? "visible" : ""}`} role="alert">
            {error}
          </div>
        </form>

        <div className="bottom-divider">
          <span />
          <b>✦</b>
          <span />
        </div>
      </section>

      <div className="bottom-moon">
        <div className="line" />
        <MoonEmblem small />
        <div className="line" />
      </div>

      {phase !== "idle" && <Flock phase={phase} />}

      {open && (
        <>
          {confetti && <Confetti />}
          <ChoiceScene
            signed={signed}
            onSign={() => setSigned(true)}
            onBack={() => { setOpen(false); setConfetti(false); }}
          />
        </>
      )}
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
