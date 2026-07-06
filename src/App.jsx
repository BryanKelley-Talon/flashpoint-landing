import { useEffect, useRef, useState } from "react";

/* ============================================================
   FLASHPOINT HISTORY — Timeline Landing Page
   Deploys to the root domain (flashpointhistory.com).
   Edit GAMES / GLOBAL / ARENA_URL below — everything else
   renders from this data.
   ============================================================ */

const GAMES = [
  { std: "11.1", year: "1776", title: "The Question That Started Everything", period: "1607–1789", accent: "#7B3F00", status: "planned" },
  { std: "11.2", year: "1800", title: "The Fragile Republic", period: "1789–1824", accent: "#2C3E6B", status: "planned" },
  { std: "11.3", year: "1850", title: "The Last Compromise", period: "1820–1861", accent: "#2C4A2E", status: "planned" },
  { std: "11.4", year: "1865", title: "What Freedom Means", period: "1861–1877", accent: "#5C3A1E", status: "next" },
  { std: "11.5", year: "1900", title: "A Nation in Reform", period: "1877–1920", accent: "#C17700", status: "live", url: "https://progressive-era-11r.netlify.app" },
  { std: "11.6", year: "1917", title: "The Weight of the World", period: "1898–1920", accent: "#8B6914", status: "planned" },
  { std: "11.7", year: "1932", title: "What the Country Owes", period: "1920–1940", accent: "#6E6E6E", status: "planned" },
  { std: "11.8", year: "1942", title: "The Price of Victory", period: "1939–1945", accent: "#8B0000", status: "planned" },
  { std: "11.9", year: "1955", title: "The Long Walk Home", period: "1945–1968", accent: "#1A3A5C", status: "planned" },
  { std: "11.10", year: "1968", title: "Everything at Once", period: "1964–1975", accent: "#556B2F", status: "planned" },
  { std: "11.11", year: "1989", title: "The Wall and What Came After", period: "1975–present", accent: "#3E5C6B", status: "planned" },
];

const GLOBAL = [
  { year: "1914", title: "A World on Fire", period: "WWI · Global 10R", status: "live", url: "https://wof-global10r.netlify.app" },
  { year: "1939", title: "WWII & the Holocaust", period: "10.5 · Global 10R", status: "planned" },
  { year: "1947", title: "Cold War & Decolonization", period: "10.6 · Global 10R", status: "planned" },
];

const ARENA_URL = "https://thearena.flashpointhistory.com";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600&family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Libre+Baskerville:ital@0;1&display=swap');

/* Vite #root override — required in every Flashpoint project */
#root {
  max-width: none !important;
  width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  text-align: left !important;
}
html { scroll-behavior: smooth; }
body {
  margin: 0;
  display: block !important;
  background: #16120E;
  color: #EDE3D2;
  font-family: 'Libre Baskerville', Georgia, serif;
  font-size: 17px;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
}
* { box-sizing: border-box; }
a { color: inherit; }
:focus-visible { outline: 2px solid #E89923; outline-offset: 3px; }

.fp-page { overflow-x: hidden; }
.fp-wrap { max-width: 960px; margin: 0 auto; padding: 0 32px; }

/* ---------- shared type roles ---------- */
.fp-eyebrow {
  font-family: 'Cinzel', serif;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: #C17700;
}
.fp-rule {
  border: 0; height: 1px; width: 96px; margin: 0;
  background: linear-gradient(90deg, #C17700, rgba(193,119,0,0));
}

/* ---------- hero ---------- */
.fp-hero {
  min-height: 88vh;
  display: flex; align-items: center;
  position: relative;
  background:
    radial-gradient(1100px 520px at 50% -10%, rgba(193,119,0,0.13), transparent 65%),
    #16120E;
}
.fp-hero-inner { padding: 96px 0 72px; }
.fp-hero h1 {
  font-family: 'Playfair Display', serif;
  font-weight: 700;
  font-size: clamp(2.6rem, 6.4vw, 4.6rem);
  line-height: 1.08;
  margin: 22px 0 10px;
  letter-spacing: 0.005em;
}
.fp-hero h1 em {
  font-style: italic; font-weight: 500;
  color: #E89923;
}
.fp-hero p.fp-sub {
  max-width: 640px;
  font-size: 19px;
  color: #C9BBA4;
  margin: 22px 0 34px;
}
.fp-cta-row { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }
.fp-btn {
  display: inline-block;
  font-family: 'Cinzel', serif; font-weight: 600;
  font-size: 14px; letter-spacing: 0.14em; text-transform: uppercase;
  padding: 15px 30px;
  text-decoration: none;
  border-radius: 2px;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}
.fp-btn-solid { background: #C17700; color: #16120E; border: 1px solid #C17700; }
.fp-btn-solid:hover { background: #E89923; border-color: #E89923; }
.fp-btn-ghost { background: transparent; color: #EDE3D2; border: 1px solid #5C4A32; }
.fp-btn-ghost:hover { border-color: #C17700; color: #E89923; }

/* ---------- trust strip ---------- */
.fp-trust {
  border-top: 1px solid #2A2118;
  border-bottom: 1px solid #2A2118;
  background: #1B1611;
}
.fp-trust ul {
  list-style: none; margin: 0; padding: 18px 0;
  display: flex; flex-wrap: wrap; gap: 10px 34px;
  justify-content: center;
}
.fp-trust li {
  font-family: 'Cinzel', serif; font-weight: 500;
  font-size: 12.5px; letter-spacing: 0.18em; text-transform: uppercase;
  color: #A08B6C;
  display: flex; align-items: center; gap: 10px;
}
.fp-trust li::before {
  content: ""; width: 5px; height: 5px; border-radius: 50%;
  background: #C17700; flex: none;
}

/* ---------- section headers ---------- */
.fp-section { padding: 96px 0 40px; }
.fp-section h2 {
  font-family: 'Playfair Display', serif; font-weight: 700;
  font-size: clamp(1.9rem, 3.6vw, 2.7rem);
  margin: 18px 0 12px;
}
.fp-section p.fp-lede { max-width: 640px; color: #C9BBA4; margin: 0 0 12px; }

/* ---------- the timeline ---------- */
.fp-timeline { position: relative; padding: 40px 0 96px; }
.fp-spine {
  position: absolute; top: 0; bottom: 0; left: 71px;
  width: 2px; background: #2E2417;
}
.fp-spine-fill {
  position: absolute; top: 0; left: 0; width: 100%;
  background: linear-gradient(180deg, #E89923, #C17700);
  box-shadow: 0 0 14px rgba(232,153,35,0.55);
  transition: height 0.15s linear;
}
.fp-node {
  position: relative;
  padding: 0 0 26px 128px;
  opacity: 0; transform: translateY(18px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}
.fp-node.lit { opacity: 1; transform: none; }
.fp-node-dot {
  position: absolute; left: 64px; top: 34px;
  width: 16px; height: 16px; border-radius: 50%;
  background: #16120E;
  border: 2px solid #4A3B26;
  transition: border-color 0.5s ease, box-shadow 0.5s ease;
}
.fp-node.lit .fp-node-dot {
  border-color: var(--accent, #C17700);
  box-shadow: 0 0 0 4px rgba(193,119,0,0.12), 0 0 12px rgba(232,153,35,0.45);
}
.fp-year {
  position: absolute; left: 0; top: 18px;
  width: 52px; text-align: right;
  font-family: 'Playfair Display', serif; font-weight: 700;
  font-size: 21px; color: #A08B6C;
  transition: color 0.5s ease;
}
.fp-node.lit .fp-year { color: #E89923; }
.fp-card {
  border: 1px solid #2A2118;
  border-left: 3px solid var(--accent, #C17700);
  background: #1B1611;
  border-radius: 2px;
  padding: 22px 26px 20px;
  transition: border-color 0.25s ease, background 0.25s ease;
}
a.fp-card-link { text-decoration: none; display: block; }
a.fp-card-link:hover .fp-card { background: #211A13; border-color: #3A2E1E; border-left-color: var(--accent, #C17700); }
.fp-card-top {
  display: flex; align-items: baseline; gap: 14px; flex-wrap: wrap;
  margin-bottom: 6px;
}
.fp-std {
  font-family: 'Cinzel', serif; font-weight: 600;
  font-size: 11.5px; letter-spacing: 0.2em;
  color: #A08B6C;
  border: 1px solid #3A2E1E; border-radius: 2px;
  padding: 3px 9px;
}
.fp-status {
  font-family: 'Cinzel', serif; font-weight: 600;
  font-size: 11.5px; letter-spacing: 0.2em; text-transform: uppercase;
}
.fp-status.live { color: #E89923; }
.fp-status.next { color: #C9BBA4; }
.fp-status.planned { color: #6E5F49; }
.fp-card h3 {
  font-family: 'Playfair Display', serif; font-weight: 700;
  font-size: 24px; margin: 4px 0 6px; color: #EDE3D2;
}
.fp-card .fp-period { font-size: 15px; color: #A08B6C; font-style: italic; margin: 0; }
.fp-play {
  display: inline-block; margin-top: 14px;
  font-family: 'Cinzel', serif; font-weight: 600;
  font-size: 12.5px; letter-spacing: 0.18em; text-transform: uppercase;
  color: #E89923;
}
.fp-play::after { content: " →"; }

/* ---------- global 10R row ---------- */
.fp-global-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;
  padding: 36px 0 96px;
}
.fp-gcard {
  border: 1px solid #2A2118; border-top: 3px solid #C17700;
  background: #1B1611; border-radius: 2px;
  padding: 24px 24px 22px;
  height: 100%;
}
.fp-gcard.dim { border-top-color: #3A2E1E; }
.fp-gcard .fp-gyear {
  font-family: 'Playfair Display', serif; font-weight: 700;
  font-size: 30px; color: #E89923; margin: 0 0 2px;
}
.fp-gcard.dim .fp-gyear { color: #A08B6C; }
.fp-gcard h3 { font-family: 'Playfair Display', serif; font-size: 20px; margin: 0 0 4px; }
.fp-gcard p { font-size: 14.5px; color: #A08B6C; margin: 0; font-style: italic; }

/* ---------- arena band ---------- */
/* Subordinate "what's next" band — muted, compact, no amber glow, so it
   never competes with the live products above it. */
.fp-arena {
  border-top: 1px solid #241C14;
  background: #18130F;
}
.fp-arena-inner {
  padding: 40px 0;
  display: flex; align-items: center; justify-content: space-between;
  gap: 32px; flex-wrap: wrap;
}
.fp-arena h2 {
  font-family: 'Playfair Display', serif; font-weight: 700;
  font-size: clamp(1.35rem, 2.2vw, 1.7rem); margin: 10px 0 8px;
  color: #C9BBA4;
}
.fp-arena p { max-width: 560px; color: #9A8B72; margin: 0; font-size: 15.5px; }
.fp-arena blockquote {
  margin: 18px 0 0; padding-left: 18px;
  border-left: 2px solid #C17700;
  font-style: italic; color: #A08B6C; font-size: 15.5px;
}

/* ---------- footer ---------- */
.fp-footer { padding: 64px 0 56px; }
.fp-footer-inner {
  display: flex; justify-content: space-between; align-items: baseline;
  gap: 24px; flex-wrap: wrap;
}
.fp-wordmark {
  font-family: 'Cinzel', serif; font-weight: 600;
  letter-spacing: 0.3em; font-size: 15px; color: #EDE3D2;
}
.fp-footer p { font-size: 13.5px; color: #6E5F49; margin: 6px 0 0; }
.fp-footer .fp-tag { font-style: italic; font-family: 'Playfair Display', serif; color: #A08B6C; font-size: 15px; }

/* ---------- responsive ---------- */
@media (max-width: 780px) {
  .fp-wrap { padding: 0 22px; }
  .fp-global-grid { grid-template-columns: 1fr; }
  .fp-hero { min-height: 72vh; }
}
@media (max-width: 500px) {
  .fp-spine { left: 7px; }
  .fp-node { padding-left: 34px; }
  .fp-node-dot { left: 0; top: 30px; }
  .fp-year { position: static; width: auto; text-align: left; display: block; margin-bottom: 4px; }
  .fp-card { padding: 18px 18px 16px; }
  .fp-card h3 { font-size: 21px; }
}
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .fp-node { opacity: 1; transform: none; transition: none; }
  .fp-spine-fill { transition: none; }
}
`;

function statusLabel(s) {
  if (s === "live") return "Live — play free";
  if (s === "next") return "In production";
  return "In development";
}

export default function App() {
  const timelineRef = useRef(null);
  const [fill, setFill] = useState(0);

  /* Spine fill tracks scroll progress through the timeline */
  useEffect(() => {
    const onScroll = () => {
      const el = timelineRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height;
      const progressed = Math.min(Math.max(vh * 0.75 - rect.top, 0), total);
      setFill((progressed / total) * 100);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Nodes ignite as they enter the viewport */
  useEffect(() => {
    const nodes = document.querySelectorAll(".fp-node");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { nodes.forEach((n) => n.classList.add("lit")); return; }
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("lit"); }),
      { threshold: 0.35 }
    );
    nodes.forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="fp-page">
      <style>{CSS}</style>

      {/* ---------- HERO ---------- */}
      <header className="fp-hero">
        <div className="fp-wrap fp-hero-inner">
          <span className="fp-eyebrow">Flashpoint History</span>
          <h1>
            History turns on moments.
            <br />
            <em>Step into them.</em>
          </h1>
          <hr className="fp-rule" />
          <p className="fp-sub">
            Decision-driven history games for the NYS Regents classroom. Students
            inhabit real, documented people at real turning points — and choose,
            before the outcome was known.
          </p>
          <div className="fp-cta-row">
            <a className="fp-btn fp-btn-solid" href="https://progressive-era-11r.netlify.app">
              Play 1900 free
            </a>
            <a className="fp-btn fp-btn-ghost" href="#timeline">
              See the timeline
            </a>
          </div>
        </div>
      </header>

      {/* ---------- TRUST STRIP ---------- */}
      <div className="fp-trust">
        <div className="fp-wrap">
          <ul>
            <li>No logins</li>
            <li>No student data</li>
            <li>Any browser</li>
            <li>One class period</li>
            <li>Regents-aligned</li>
          </ul>
        </div>
      </div>

      {/* ---------- 11R TIMELINE ---------- */}
      <section className="fp-section" id="timeline">
        <div className="fp-wrap">
          <span className="fp-eyebrow">US History &amp; Government · 11R</span>
          <h2>One year. Eleven flashpoints.</h2>
          <p className="fp-lede">
            A game for every unit, NYSED Standards 11.1 through 11.11. Each one
            places students inside a single consequential year — seven chapters,
            playable within a class period.
          </p>
        </div>
        <div className="fp-wrap">
          <div className="fp-timeline" ref={timelineRef}>
            <div className="fp-spine">
              <div className="fp-spine-fill" style={{ height: `${fill}%` }} />
            </div>
            {GAMES.map((g) => {
              const card = (
                <div className="fp-card" style={{ "--accent": g.accent }}>
                  <div className="fp-card-top">
                    <span className="fp-std">STANDARD {g.std}</span>
                    <span className={`fp-status ${g.status}`}>{statusLabel(g.status)}</span>
                  </div>
                  <h3>{g.year}: {g.title}</h3>
                  <p className="fp-period">{g.period}</p>
                  {g.status === "live" && <span className="fp-play">Play now</span>}
                </div>
              );
              return (
                <div className="fp-node" key={g.std} style={{ "--accent": g.accent }}>
                  <span className="fp-year">{g.year}</span>
                  <span className="fp-node-dot" />
                  {g.url ? (
                    <a className="fp-card-link" href={g.url}>{card}</a>
                  ) : (
                    card
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- GLOBAL 10R ---------- */}
      <section className="fp-section" style={{ paddingTop: 0 }}>
        <div className="fp-wrap">
          <span className="fp-eyebrow">Global History &amp; Geography · 10R</span>
          <h2>The world series.</h2>
          <div className="fp-global-grid">
            {GLOBAL.map((g) => {
              const inner = (
                <div className={`fp-gcard${g.status === "live" ? "" : " dim"}`}>
                  <p className="fp-gyear">{g.year}</p>
                  <h3>{g.title}</h3>
                  <p>{g.period}</p>
                  {g.status === "live" && <span className="fp-play">Play now</span>}
                </div>
              );
              return g.url ? (
                <a className="fp-card-link" href={g.url} key={g.title}>{inner}</a>
              ) : (
                <div key={g.title}>{inner}</div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- THE ARENA ---------- */}
      <section className="fp-arena">
        <div className="fp-wrap fp-arena-inner">
          <div>
            <span className="fp-eyebrow">Regents Skills Trainer</span>
            <h2>
              The Arena
              <span
                style={{
                  marginLeft: 14,
                  fontFamily: "'Cinzel', serif",
                  fontWeight: 600,
                  fontSize: 12,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#C9BBA4",
                  border: "1px solid #3A2E1E",
                  borderRadius: 2,
                  padding: "4px 11px",
                  verticalAlign: "middle",
                  whiteSpace: "nowrap",
                }}
              >
                Coming Soon
              </span>
            </h2>
            <p>
              Twelve training stations. Seven reference tools. Active writing
              practice for every skill the exam actually tests — from claims and
              evidence to the full essay.
            </p>
            <blockquote>
              Designed to stay open year-round — students will step in, write, and
              leave stronger than they arrived.
            </blockquote>
          </div>
          <span
            className="fp-btn fp-btn-ghost"
            aria-disabled="true"
            style={{ cursor: "default", opacity: 0.7 }}
          >
            Coming Soon
          </span>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="fp-footer">
        <div className="fp-wrap fp-footer-inner">
          <div>
            <span className="fp-wordmark">FLASHPOINT HISTORY</span>
            <p className="fp-tag">History turns on moments. Step into them.</p>
          </div>
          <div>
            <p>Built by a working classroom teacher. Free to play in any browser.</p>
            <p>© {new Date().getFullYear()} Flashpoint History</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
