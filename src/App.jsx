import { useEffect, useRef, useState } from "react";

/* ============================================================
   FLASHPOINT HISTORY — Landing Page
   Deploys to the root domain (flashpointhistory.com).
   Two real pages, one bundle, path-based:
     /            — Home: hero + the two lanes only. Nothing else.
     /decisions   — the US11R timeline + the Global 10R lane. Behind
                    the Decisions door, not visible on Home. Direct
                    links work via public/_redirects (SPA fallback).
     /arena       — what the Arena is and how it works. There is NO
                    public way in (BK 2026-10-03 22:14): students use
                    the link from their class. Final words: Leo's order
                    2026-10-03 23:09 (BK 22:32-22:55, CJ 22:49). No PBIS
                    and no Be a Hawk on the public page (BK 22:46).
   Edit GAMES / GLOBAL below — everything else
   renders from this data.
   ============================================================ */

/* ── GAMES COME FROM THE SHARED MANIFEST ──────────────────────────────────
   builds/_shared/games.json is the one list. It is copied into this site's
   public/ and into the Arena's public/ by builds/_shared/sync-games.sh.
   DO NOT re-add a hardcoded array here: the Arena links the same games from
   its unit rooms, and two hand-maintained lists drift. A dead link in front
   of a kid is worse than no link. — Josh, 2026-09-18 */
const GAMES_URL = "/games.json";

/* No link into the Arena from the public site (BK 2026-10-03 22:14: "No public place
   to enter it"). Students reach it through the link from their class. */

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
.fp-footer p { font-size: 13.5px; color: #9A8A70; margin: 6px 0 0; }
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

/* ============================================================
   NAVY CHROME — BK's ruling 2026-09-18, the middle option.
   The PAGE takes the Arena's navy identity. The GAME CARDS keep their warm
   era accents and their serif, because each game is its own world and the
   era accents are canon in flashpoint-tokens.css. The lane split is what
   makes that legible: navy lane to the training room, warm lane to the worlds.
   Shared game tokens are NOT touched by this file.
   ============================================================ */
:root{
  --nv:#0B1220; --nv-card:#131C2E; --nv-card-lit:#1A2538; --nv-edge:#22304A;
  --nv-gold:#E3B341; --nv-gold-lit:#F5CB63; --nv-white:#F4F6FA; --nv-grey:#8FA0B8;
}
.fp-page{background:var(--nv)}
.fp-hero{background:
  radial-gradient(1200px 520px at 50% -12%, #16223A 0%, rgba(11,18,32,0) 68%),
  linear-gradient(180deg,#0E1728 0%,var(--nv) 100%) !important}
.fp-hero h1{color:var(--nv-white)}
.fp-hero h1 em{color:var(--nv-gold)}
.fp-hero p.fp-sub{color:var(--nv-grey)}
.fp-eyebrow{color:var(--nv-gold)}
.fp-eyebrow::after{background:linear-gradient(90deg,var(--nv-gold),rgba(227,179,65,0))}
.fp-rule{border-color:var(--nv-edge)}
.fp-trust{background:#0E1728;border-color:var(--nv-edge)}
.fp-trust li{color:var(--nv-grey)}
.fp-trust li::before{background:var(--nv-gold)}
.fp-section h2{color:var(--nv-white)}
.fp-section p.fp-lede{color:var(--nv-grey)}

/* ---- THE TWO LANES (Home only) ---- */
.fp-lanes{display:grid;grid-template-columns:repeat(auto-fit,minmax(288px,1fr));
  gap:16px;margin-top:38px;max-width:780px}
.fp-lane{display:flex;flex-direction:column;gap:7px;padding:24px 22px;border-radius:14px;
  text-decoration:none;background:var(--nv-card);border:1px solid var(--nv-edge);
  transition:transform .14s cubic-bezier(.18,.89,.32,1.28),
             background-color .12s ease,border-color .12s ease,box-shadow .14s ease}
.fp-lane:hover{transform:translateY(-3px);background:var(--nv-card-lit);
  box-shadow:0 12px 34px -14px #0008}
.fp-lane:focus-visible{outline:3px solid var(--nv-gold-lit);outline-offset:3px}
.fp-lane-kicker{font-family:'Cinzel',serif;text-transform:uppercase;letter-spacing:.22em;
  font-size:11px}
.fp-lane-name{font-family:'Playfair Display',serif;font-size:31px;line-height:1.05;
  color:var(--nv-white)}
.fp-lane-blurb{color:var(--nv-grey);font-size:14.5px;line-height:1.5;margin-top:2px}
.fp-lane-go{margin-top:9px;font-size:13.5px;font-weight:600}
/* The two lanes differ by NAME and KICKER first. Colour is the second signal. */
.fp-lane-arena{border-left:4px solid var(--nv-gold)}
.fp-lane-arena .fp-lane-kicker,.fp-lane-arena .fp-lane-go{color:var(--nv-gold)}
.fp-lane-arena:hover{border-color:var(--nv-gold)}
.fp-lane-games{border-left:4px solid #C17700}
.fp-lane-games .fp-lane-kicker,.fp-lane-games .fp-lane-go{color:#E89923}
.fp-lane-games:hover{border-color:#C17700}

/* ---- Decisions page back link ---- */
.fp-decisions-top{padding:30px 0 0}
.fp-back{
  font-family:'Cinzel',serif;font-weight:600;font-size:12.5px;letter-spacing:.16em;
  text-transform:uppercase;color:var(--nv-gold);text-decoration:none;
}
.fp-back:hover{color:var(--nv-gold-lit)}

/* ---- the game cards stay WARM on the navy ground ---- */
.fp-card,.fp-gcard{background:#1A1610 !important;border-color:#2F2619 !important}
a.fp-card-link:hover .fp-card{background:#221B12 !important}
.fp-spine{background:var(--nv-edge) !important}
@media (prefers-reduced-motion:reduce){
  .fp-lane{transition:background-color .01ms,border-color .01ms}
  .fp-lane:hover{transform:none;box-shadow:inset 0 0 0 1px var(--nv-gold)}
}
@media (max-width:560px){ .fp-lanes{grid-template-columns:1fr} }

/* ---- /arena: the about page ---- */
.fp-about .fp-wrap{max-width:760px}
.fp-about h2{margin-top:10px;text-wrap:balance}
.fp-about .fp-lede{max-width:none}
.fp-about-h{font-family:'Cinzel',serif;font-weight:600;font-size:14px;letter-spacing:.18em;text-transform:uppercase;
  color:var(--nv-gold);margin:34px 0 12px}
.fp-about-list{margin:0;padding-left:20px;color:var(--nv-white);font-size:16.5px;line-height:1.6;display:flex;flex-direction:column;gap:8px}
.fp-about-list ul{margin:6px 0 2px;padding-left:20px;color:var(--nv-grey);display:flex;flex-direction:column;gap:4px}
.fp-about-list b{color:var(--nv-gold-lit);font-weight:600}
.fp-about-p{color:var(--nv-white);font-size:16.5px;line-height:1.6;margin:0}
`;

function statusLabel(s) {
  if (s === "live") return "Live — play free";
  if (s === "next") return "In production";
  return "In development";
}

/* Reads the path ONCE at mount. Plain <a> links do a real navigation
   between "/" and "/decisions" — no client router needed for two pages.
   public/_redirects sends any path back to index.html so a direct link
   to /decisions still resolves; this then picks the right view. */
function currentView() {
  if (typeof window === "undefined") return "home";
  const path = window.location.pathname.replace(/\/+$/, "");
  return path === "/decisions" ? "decisions" : path === "/arena" ? "arena" : "home";
}

function Footer() {
  return (
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
  );
}

function Home() {
  return (
    <div className="fp-page">
      <style>{CSS}</style>

      {/* ---------- HERO + THE TWO LANES ---------- */}
      {/* BK's own hero copy, minus "games" (filter-safety naming pass,
         2026-09-19 — same discipline as every Arena game name). What's
         below it is the lane split: a student picks a room before they
         pick a thing inside it. Home is ONLY the hero + the two lanes —
         nothing else lives on this page. */}
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
            Decision-driven history for the NYS Regents classroom. Students
            inhabit real, documented people at real turning points — and choose,
            before the outcome was known.
          </p>

          <div className="fp-lanes">
            <a className="fp-lane fp-lane-arena" href="/arena">
              <span className="fp-lane-kicker">Practice</span>
              <span className="fp-lane-name">The Arena</span>
              <span className="fp-lane-blurb">
                A companion to one classroom. See what's inside and how it works.
              </span>
              <span className="fp-lane-go">About the Arena →</span>
            </a>
            <a className="fp-lane fp-lane-games" href="/decisions">
              <span className="fp-lane-kicker">Decide</span>
              <span className="fp-lane-name">The Decisions</span>
              <span className="fp-lane-blurb">
                One consequential year at a time. Step in and decide before the
                outcome was known.
              </span>
              <span className="fp-lane-go">See the timeline →</span>
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

      <Footer />
    </div>
  );
}

/* ---------- /arena — what the Arena is (final words: Leo's order 2026-10-03 23:09) ---------- */
function ArenaAbout() {
  return (
    <div className="fp-page">
      <style>{CSS}</style>
      <div className="fp-decisions-top">
        <div className="fp-wrap">
          <a className="fp-back" href="/">← Flashpoint History</a>
        </div>
      </div>
      <section className="fp-section fp-about">
        <div className="fp-wrap">
          <span className="fp-eyebrow">The Arena · A companion to one classroom</span>
          <h2>One child, one room, an entire building.</h2>
          <p className="fp-lede">
            The Arena is a companion to one classroom. It works in tandem with the district's devices
            and digital learning spaces. A teacher at CPP made it for his students in Global History
            and Geography 10R and US History and Government 11R, to practice the skills the Regents
            exam tests. The goal: help one kid be better, then one class, then the building.
          </p>

          <h3 className="fp-about-h">What's inside</h3>
          <ul className="fp-about-list">
            <li><b>The six skills:</b> Historical Context, Thesis, Document Use, Explanation, Civic Principle or Enduring Issue, and Outside Evidence.</li>
            <li><b>A room for every unit,</b> opening as the class reaches it, with the unit review.</li>
            <li><b>Doc Assist:</b> every casefile's documents, one at a time, each with its source.
              <ul>
                <li>“Walk me through it” takes a student through the document in four short questions.</li>
                <li>“Easier to read” puts a plainer version beside the original.</li>
                <li>“Read it to me” reads the document aloud on the student's own device.</li>
              </ul>
            </li>
            <li><b>Unit 0:</b> the six skills outside a history class, for new students and their families.</li>
            <li><b>The Office:</b> a monthly theme built around the building's expectations, with a lesson, practice and a bonus.</li>
            <li><b>The Skills Review Bowl:</b> a review game where right answers build your team.</li>
          </ul>

          <h3 className="fp-about-h">How it works</h3>
          <ul className="fp-about-list">
            <li>There's no public way in. Students reach the Arena through the link from their class, with no account and no login.</li>
            <li>Nothing in the Arena is graded. Some of its work can be turned in on Google Classroom as a BONUS, which can only help.</li>
            <li>Progress stays on the student's own device. Nothing about a student leaves it.</li>
            <li>It's for review on a student's own time, or when a teacher uses it in class. It's never permission to skip work in another class.</li>
            <li>What it won't do: give answers, or try to keep students playing.</li>
          </ul>

          <h3 className="fp-about-h">For families and visitors</h3>
          <p className="fp-about-p">The link to the Arena is shared in class. To see it, ask your student to show you Unit 0, the six skills.</p>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function Decisions({ GAMES, GLOBAL, fill, timelineRef }) {
  return (
    <div className="fp-page">
      <style>{CSS}</style>

      {/* ---------- BACK TO HOME ---------- */}
      <div className="fp-decisions-top">
        <div className="fp-wrap">
          <a className="fp-back" href="/">← Flashpoint History</a>
        </div>
      </div>

      {/* ---------- 11R TIMELINE ---------- */}
      <section className="fp-section" id="timeline">
        <div className="fp-wrap">
          <span className="fp-eyebrow">US History &amp; Government · 11R</span>
          <h2>One year. Eleven flashpoints.</h2>
          <p className="fp-lede">
            A decision for every unit, NYSED Standards 11.1 through 11.11. Each
            one places students inside a single consequential year — seven
            chapters, playable within a class period.
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

      <Footer />
    </div>
  );
}

export default function App() {
  const timelineRef = useRef(null);
  const [fill, setFill] = useState(0);
  const [manifest, setManifest] = useState(null);
  const [view] = useState(currentView);

  useEffect(() => {
    fetch(GAMES_URL).then(r => r.json()).then(setManifest).catch(() => setManifest({ games: [] }));
  }, []);

  const all = (manifest && manifest.games) || [];
  const GAMES = all.filter(g => g.course === "us11r");
  const GLOBAL = all.filter(g => g.course === "global10r");

  /* Spine fill tracks scroll progress through the timeline.
     No-op on Home: timelineRef.current is null there, nothing to measure. */
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
  }, [manifest]);

  /* Nodes ignite as they enter the viewport. No-op on Home: querySelectorAll
     finds nothing there, the observer just has nothing to watch. */
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
    // DEPENDS ON `manifest`, and must. The timeline nodes do not exist on mount
    // any more — they render after games.json resolves. With an empty dep array
    // this observer found nothing, never fired, and every node stayed at
    // opacity:0 behind a spine. The build was clean and the console was silent.
    // Caught by rendering the page and looking at it. — Josh, 2026-09-18
  }, [manifest, view]);

  if (view === "arena") return <ArenaAbout />;
  if (view === "decisions") {
    return <Decisions GAMES={GAMES} GLOBAL={GLOBAL} fill={fill} timelineRef={timelineRef} />;
  }
  return <Home />;
}
