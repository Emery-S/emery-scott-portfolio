'use client';

import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * NEXT.JS (App Router) + Tailwind + Framer Motion
 * - Put this in: app/page.tsx
 * - Install: npm i framer-motion
 *
 * WHAT THIS IMPLEMENTS (exactly your spec):
 * Home: 3 buttons Acting / Modeling / Writing
 * Acting:
 *  - chosen button morphs into header (outline vanishes)
 *  - other buttons fly away
 *  - cinematic “dissolving spread” background (never black) + depth
 *  - vertical split line drops down
 *  - two frosted panes (Reels left / Galleries right)
 *  - click left/right: split swipes and chosen view takes over
 *  - reels view shows options; galleries view shows gallery grid
 * Modeling:
 *  - chosen button morphs into header, others fly away
 *  - background switches fast to crisp soft-summer greys
 *  - digitals open (slower entrance) and NEVER close
 *  - below digitals: buttons Commercial/Editorial/Runway; galleries open below buttons
 * Writing:
 *  - whimsical, fantasy-romance vibe with “ink sweep” and floating “chapter cards”
 * Bottom:
 *  - NYT review quote blocks drifting right->left, above contact section
 */

/* ----------------------------- CONFIG / DATA ----------------------------- */

const CONFIG = {
  name: 'Emery Scott',
  email: 'emeryscott.artist@gmail.com',
  // Put your real hero headshot path (public folder):
  heroPortrait: '/headshots/emery-hero.jpg',
};

const ACTING = {
  reels: [
    { id: 'dQw4w9WgXcQ', title: 'Demo Reel' },
    { id: 'dQw4w9WgXcQ', title: 'Scene Work' },
  ],
  gallery: [
    // replace with your real stills/headshots
    '/headshots/acting-1.jpg',
    '/headshots/acting-2.jpg',
    '/headshots/acting-3.jpg',
    '/headshots/acting-4.jpg',
  ],
};

const MODELING = {
  digitals: {
    front: '/headshots/digitals-front.jpg',
    back: '/headshots/digitals-back.jpg',
    sideRight: '/headshots/digitals-side-right.jpg',
    sideLeft: '/headshots/digitals-side-left.jpg',
    halfUp: '/headshots/digitals-half-up.jpg',
    headshot: '/headshots/digitals-headshot.jpg',
  },
  commercial: ['/headshots/commercial-1.jpg', '/headshots/commercial-2.jpg', '/headshots/commercial-3.jpg'],
  editorial: ['/headshots/editorial-1.jpg', '/headshots/editorial-2.jpg', '/headshots/editorial-3.jpg'],
  runway: ['/headshots/runway-1.jpg', '/headshots/runway-2.jpg'],
};

const WRITING = {
  pieces: [
    { title: 'Prologue: A Soft Summer Oath', text: 'Replace with your writing.\n\nThis area supports paragraphs.\n\nKeep it high-brow, intimate, and sharp.' },
    { title: 'Letters in the Ash', text: 'Epic fantasy cadence… with Austen restraint.' },
    { title: 'On Dragons and Decorum', text: 'Courtly romance, political edges, mythic stakes.' },
  ],
};

const TESTIMONIALS = [
  { text: 'A quiet intensity that reads instantly on camera.', author: 'Casting Director' },
  { text: "Ethereal presence—then the grin lands and it's all charm.", author: 'Director' },
  { text: 'Smart, specific, and always prepared.', author: 'Producer' },
  { text: 'The kind of face you can build a scene around.', author: 'Photographer' },
  { text: 'She makes stillness feel like a decision.', author: 'Editor' },
  { text: 'Warmth with edge. Period.', author: 'Acting Coach' },
  { text: 'A lead energy, not a supporting one.', author: 'Casting Director' },
];

/* ----------------------------- THEME SURFACES ---------------------------- */

type Lane = 'Acting' | 'Modeling' | 'Writing' | null;

function laneBg(lane: Lane) {
  // NEVER black. Always ink/charcoal/velvet with color.
  if (lane === 'Acting') {
    // “GOT depth” without black: ink + steel + violet, layered bloom
    return {
      base: `radial-gradient(1200px circle at 45% 40%, rgba(185,175,215,0.18) 0%, rgba(120,120,170,0.16) 25%, rgba(28,30,46,1) 72%)`,
      overlay: `radial-gradient(900px circle at 60% 55%, rgba(210,190,240,0.10) 0%, rgba(120,90,160,0.10) 35%, rgba(28,30,46,0) 70%)`,
      text: 'text-white',
      headerText: 'text-white',
      headerChrome: 'bg-white/5 border-white/10',
    };
  }
  if (lane === 'Modeling') {
    // crisp soft-summer greys, editorial
    return {
      base: `radial-gradient(1200px circle at 50% 35%, rgba(255,255,255,0.92) 0%, rgba(238,243,252,0.92) 40%, rgba(205,214,228,0.98) 78%)`,
      overlay: `radial-gradient(900px circle at 55% 45%, rgba(170,185,210,0.16) 0%, rgba(255,255,255,0) 60%)`,
      text: 'text-slate-900',
      headerText: 'text-white',
      headerChrome: 'bg-black/20 border-white/10',
    };
  }
  if (lane === 'Writing') {
    // whimsical: plum/ink + mist, with “paper glow”
    return {
      base: `radial-gradient(1100px circle at 55% 38%, rgba(205,190,225,0.18) 0%, rgba(135,115,165,0.14) 28%, rgba(30,26,44,1) 76%)`,
      overlay: `radial-gradient(900px circle at 35% 60%, rgba(245,235,255,0.08) 0%, rgba(30,26,44,0) 62%)`,
      text: 'text-white',
      headerText: 'text-white',
      headerChrome: 'bg-white/5 border-white/10',
    };
  }
  // home: neutral cinematic slate
  return {
    base: `radial-gradient(1200px circle at 50% 40%, rgba(220,235,255,0.14) 0%, rgba(115,130,160,0.14) 25%, rgba(26,30,44,1) 72%)`,
    overlay: `radial-gradient(900px circle at 65% 55%, rgba(255,255,255,0.06) 0%, rgba(26,30,44,0) 65%)`,
    text: 'text-white',
    headerText: 'text-white',
    headerChrome: 'bg-white/5 border-white/10',
  };
}

/* ----------------------------- NYT DRIFT FIELD --------------------------- */

function ReviewsDrift({ light }: { light: boolean }) {
  const layout = useMemo(() => {
    const presets = [
      { top: 16, w: 360, dur: 30, delay: -2, rot: -2 },
      { top: 44, w: 440, dur: 38, delay: -10, rot: 1.5 },
      { top: 70, w: 320, dur: 28, delay: -18, rot: -1 },
      { top: 26, w: 520, dur: 44, delay: -6, rot: 0.5 },
      { top: 58, w: 380, dur: 34, delay: -14, rot: 2 },
      { top: 82, w: 460, dur: 42, delay: -22, rot: -1.5 },
      { top: 10, w: 340, dur: 32, delay: -26, rot: 1 },
    ];
    return TESTIMONIALS.map((_, i) => presets[i % presets.length]);
  }, []);

  return (
    <section className="relative pt-24 pb-14 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10">
        <h3 className={`text-4xl md:text-5xl font-extralight ${light ? 'text-slate-900' : 'text-white'}`}>Reviews</h3>
        <p className={`${light ? 'text-slate-700' : 'text-white/70'} mt-3 tracking-wide`}>
          Like blurbs drifting across a page margin.
        </p>
      </div>

      <div className="relative h-[320px] overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 w-28 pointer-events-none ${
            light ? 'bg-gradient-to-r from-white to-transparent' : 'bg-gradient-to-r from-[#1a1e2c] to-transparent'
          }`}
        />
        <div
          className={`absolute inset-y-0 right-0 w-28 pointer-events-none ${
            light ? 'bg-gradient-to-l from-white to-transparent' : 'bg-gradient-to-l from-[#1a1e2c] to-transparent'
          }`}
        />

        {TESTIMONIALS.map((t, i) => {
          const L = layout[i];
          return (
            <div
              key={i}
              className="nyt-block absolute left-0"
              style={{
                top: `${L.top}%`,
                width: `${L.w}px`,
                transform: `rotate(${L.rot}deg)`,
                animationDuration: `${L.dur}s`,
                animationDelay: `${L.delay}s`,
              }}
            >
              <div
                className={[
                  'rounded-2xl px-6 py-5 border',
                  light
                    ? 'bg-white/70 border-black/10 text-slate-900 shadow-[0_18px_50px_rgba(0,0,0,0.12)]'
                    : 'bg-white/10 border-white/10 text-white shadow-[0_22px_70px_rgba(0,0,0,0.35)]',
                  'backdrop-blur-xl',
                ].join(' ')}
              >
                <p className="text-lg leading-snug font-light">“{t.text}”</p>
                <div className="mt-3 text-sm tracking-widest opacity-80">— {t.author}</div>
              </div>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes nytDrift {
          0% {
            transform: translateX(115vw);
          }
          100% {
            transform: translateX(-160vw);
          }
        }
        .nyt-block {
          animation-name: nytDrift;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
      `}</style>
    </section>
  );
}

/* ------------------------------ MAIN PAGE -------------------------------- */

export default function Page() {
  const [lane, setLane] = useState<Lane>(null);

  // Acting sub-state
  const [actingPane, setActingPane] = useState<'doors' | 'reels' | 'galleries'>('doors');

  // Modeling sub-state
  const [modelingTab, setModelingTab] = useState<'commercial' | 'editorial' | 'runway'>('commercial');

  // Writing sub-state
  const [writingIndex, setWritingIndex] = useState<number>(0);

  const theme = laneBg(lane);
  const light = lane === 'Modeling';

  const goHome = () => {
    setLane(null);
    setActingPane('doors');
  };

  const backOne = () => {
    if (lane === 'Acting') {
      if (actingPane !== 'doors') setActingPane('doors');
      else goHome();
      return;
    }
    if (lane === 'Writing') {
      // keep it simple: back goes home from writing
      goHome();
      return;
    }
    if (lane === 'Modeling') {
      goHome();
      return;
    }
    goHome();
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background base */}
      <div className="absolute inset-0" style={{ background: theme.base }} aria-hidden="true" />
      <div className="absolute inset-0" style={{ background: theme.overlay }} aria-hidden="true" />

      {/* Film grain (subtle, expensive) */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-[0.10]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22%3E%3Cfilter id=%22n%22 x=%220%22 y=%220%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22120%22 height=%22120%22 filter=%22url(%23n)%22 opacity=%220.35%22/%3E%3C/svg%3E')",
        }}
      />

      {/* Header (the chosen button morphs into this via layoutId) */}
      <header className={`fixed top-0 w-full z-50 border-b ${theme.headerChrome} backdrop-blur-xl`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex items-center justify-between">
          <button onClick={lane ? backOne : undefined} className={`tracking-[0.35em] text-sm md:text-base ${theme.headerText} opacity-90 hover:opacity-60 transition-opacity`}>
            {CONFIG.name.toUpperCase()}
          </button>

          <div className="flex items-center gap-3">
            {lane && (
              <button
                onClick={backOne}
                className={`text-sm md:text-base ${theme.headerText} opacity-80 hover:opacity-60 transition-opacity`}
              >
                ← Back
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Top padding for fixed header */}
      <div className="pt-20 md:pt-24" />

      {/* HOME: lane buttons */}
      <AnimatePresence mode="wait">
        {!lane && (
          <motion.section
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[70vh] flex items-center justify-center px-6 md:px-12"
          >
            <div className="relative w-full max-w-5xl">
              <div className="text-center mb-14">
                <h1 className="text-6xl md:text-8xl font-extralight text-white tracking-tight">Emery Scott</h1>
                <p className="mt-4 text-white/80 tracking-[0.35em] text-sm md:text-base">ACTRESS · MODEL · WRITER</p>
              </div>

              <div className="relative flex flex-col md:flex-row gap-6 md:gap-10 justify-center items-center">
                {(['Acting', 'Modeling', 'Writing'] as const).map((b, idx) => (
                  <motion.button
                    key={b}
                    layoutId={`lane-btn-${b}`}
                    onClick={() => setLane(b)}
                    className="px-14 md:px-16 py-6 md:py-7 rounded-full text-white text-2xl md:text-3xl font-light tracking-wide"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.06) 45%, rgba(0,0,0,0.10) 100%)',
                      border: '1px solid rgba(255,255,255,0.16)',
                      boxShadow: '0 28px 90px rgba(0,0,0,0.35)',
                    }}
                    initial={{ y: 18, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.08 * idx, ease: [0.2, 0.8, 0.2, 1] }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {b}
                  </motion.button>
                ))}

                {/* buttons fly-away effect is handled by the lane sections entering; see exits below */}
              </div>
            </div>
          </motion.section>
        )}

        {/* ACTING LANE */}
        {lane === 'Acting' && (
          <motion.section
            key="acting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[78vh] px-6 md:px-12"
          >
            {/* Button morphs into header title area */}
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-center mb-14">
                <motion.div layoutId="lane-btn-Acting" className="pointer-events-none">
                  <motion.h2
                    className="text-6xl md:text-7xl text-white font-extralight tracking-wide"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, ease: [0.2, 0.8, 0.2, 1] }}
                    style={{
                      // outline vanishes: we remove button chrome by just rendering text
                      textShadow: '0 14px 50px rgba(0,0,0,0.35)',
                    }}
                  >
                    Acting
                  </motion.h2>
                </motion.div>
              </div>

              {/* Dissolving spread + depth: layered fog/bloom */}
              <div className="relative rounded-[28px] overflow-hidden border border-white/10">
                <div className="absolute inset-0 pointer-events-none">
                  <motion.div
                    className="absolute -left-24 top-10 w-[520px] h-[520px] rounded-full blur-[120px]"
                    style={{ background: 'radial-gradient(circle, rgba(220,200,255,0.20), rgba(120,100,170,0))' }}
                    animate={{ y: [0, -18, 0], opacity: [0.65, 0.85, 0.65] }}
                    transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="absolute right-[-120px] bottom-[-120px] w-[720px] h-[720px] rounded-full blur-[140px]"
                    style={{ background: 'radial-gradient(circle, rgba(190,215,255,0.16), rgba(120,140,200,0))' }}
                    animate={{ y: [0, 22, 0], opacity: [0.55, 0.75, 0.55] }}
                    transition={{ duration: 9.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 200px rgba(20,22,34,0.45)' }} />
                </div>

                {/* vertical split line slides down */}
                <div className="relative h-[540px] md:h-[560px]">
                  <motion.div
                    className="absolute left-1/2 top-0 -translate-x-1/2 w-[2px] h-full bg-white/18"
                    initial={{ scaleY: 0, transformOrigin: 'top' }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                  />

                  {/* Frosted panes (NOT doors; just panes) */}
                  <AnimatePresence mode="wait">
                    {actingPane === 'doors' && (
                      <motion.div
                        key="doors"
                        className="absolute inset-0 grid grid-cols-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35 }}
                      >
                        <button
                          onClick={() => setActingPane('reels')}
                          className="relative group"
                        >
                          <div className="absolute inset-0 acting-frost group-hover:opacity-95 transition-opacity" />
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/0 to-white/0" />
                            <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 120px rgba(0,0,0,0.25)' }} />
                          </div>
                          <div className="relative h-full flex items-center justify-center">
                            <span className="text-4xl md:text-5xl text-white font-light tracking-wide opacity-90 group-hover:opacity-100 transition-opacity">
                              Reels
                            </span>
                          </div>
                        </button>

                        <button
                          onClick={() => setActingPane('galleries')}
                          className="relative group"
                        >
                          <div className="absolute inset-0 acting-frost group-hover:opacity-95 transition-opacity" />
                          <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 120px rgba(0,0,0,0.25)' }} />
                          </div>
                          <div className="relative h-full flex items-center justify-center">
                            <span className="text-4xl md:text-5xl text-white font-light tracking-wide opacity-90 group-hover:opacity-100 transition-opacity">
                              Galleries
                            </span>
                          </div>
                        </button>
                      </motion.div>
                    )}

                    {/* Split swipes: if reels chosen, split moves right; if galleries chosen, split moves left */}
                    {actingPane === 'reels' && (
                      <motion.div
                        key="reels"
                        className="absolute inset-0"
                        initial={{ clipPath: 'inset(0 50% 0 0)' }}
                        animate={{ clipPath: 'inset(0 0% 0 0)' }}
                        exit={{ clipPath: 'inset(0 50% 0 0)' }}
                        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                      >
                        <div className="h-full grid grid-cols-1 md:grid-cols-2">
                          <div className="p-8 md:p-10 flex flex-col justify-center">
                            <div className="flex items-center justify-between mb-6">
                              <h3 className="text-3xl md:text-4xl text-white font-light">Reels</h3>
                              <button onClick={() => setActingPane('doors')} className="text-white/70 hover:text-white transition-colors underline">
                                back
                              </button>
                            </div>
                            <div className="space-y-4">
                              {ACTING.reels.map((r, i) => (
                                <button
                                  key={i}
                                  className="w-full text-left px-6 py-4 rounded-2xl border border-white/12 bg-white/8 hover:bg-white/12 transition-colors text-white/90"
                                >
                                  <div className="text-lg tracking-wide">{r.title}</div>
                                  <div className="text-sm opacity-70 mt-1">YouTube ID: {r.id}</div>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="hidden md:block p-10">
                            <div className="h-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl" />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {actingPane === 'galleries' && (
                      <motion.div
                        key="galleries"
                        className="absolute inset-0"
                        initial={{ clipPath: 'inset(0 0 0 50%)' }}
                        animate={{ clipPath: 'inset(0 0 0 0%)' }}
                        exit={{ clipPath: 'inset(0 0 0 50%)' }}
                        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                      >
                        <div className="h-full p-8 md:p-10">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-3xl md:text-4xl text-white font-light">Galleries</h3>
                            <button onClick={() => setActingPane('doors')} className="text-white/70 hover:text-white transition-colors underline">
                              back
                            </button>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                            {ACTING.gallery.map((src, i) => (
                              <div
                                key={i}
                                className="aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 bg-white/5"
                                style={{ boxShadow: '0 18px 60px rgba(0,0,0,0.28)' }}
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={src} alt="" className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <style jsx>{`
              .acting-frost {
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.10), rgba(255, 255, 255, 0.04));
                backdrop-filter: blur(26px);
                -webkit-backdrop-filter: blur(26px);
                opacity: 0.85;
              }
            `}</style>
          </motion.section>
        )}

        {/* MODELING LANE */}
        {lane === 'Modeling' && (
          <motion.section
            key="modeling"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[78vh] px-6 md:px-12"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-center mb-12">
                <motion.div layoutId="lane-btn-Modeling" className="pointer-events-none">
                  <motion.h2
                    className="text-6xl md:text-7xl text-slate-900 font-extralight tracking-wide"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                  >
                    Modeling
                  </motion.h2>
                </motion.div>
              </div>

              {/* Digitals open slower (never close) */}
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
                className="rounded-[28px] border border-black/10 bg-white/55 backdrop-blur-md shadow-[0_28px_90px_rgba(0,0,0,0.12)] overflow-hidden"
              >
                <div className="px-8 md:px-10 pt-8 pb-6">
                  <h3 className="text-3xl md:text-4xl font-extralight text-slate-900">Digitals</h3>
                  <p className="mt-2 text-slate-700 tracking-wide">Crisp. Clean. Soft-summer editorial.</p>
                </div>

                <div className="px-8 md:px-10 pb-10 grid grid-cols-2 md:grid-cols-3 gap-6">
                  {Object.entries(MODELING.digitals).map(([k, src]) => (
                    <div key={k} className="rounded-2xl overflow-hidden border border-black/10 bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={src} alt={k} className="w-full h-[220px] md:h-[260px] object-cover" />
                      <div className="px-4 py-3 text-sm tracking-widest text-slate-700 uppercase">
                        {k.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tabs below digitals; galleries open below (digitals stay) */}
                <div className="px-8 md:px-10 pb-8">
                  <div className="flex flex-wrap gap-3 md:gap-5">
                    {(['commercial', 'editorial', 'runway'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setModelingTab(t)}
                        className={[
                          'px-6 py-3 rounded-full text-sm tracking-widest uppercase transition-colors',
                          modelingTab === t
                            ? 'bg-slate-900 text-white'
                            : 'bg-white/70 text-slate-800 border border-black/10 hover:bg-white',
                        ].join(' ')}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <div className="mt-8">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={modelingTab}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.45 }}
                        className="grid grid-cols-2 md:grid-cols-3 gap-6"
                      >
                        {MODELING[modelingTab].map((src, i) => (
                          <div key={i} className="aspect-[4/5] rounded-2xl overflow-hidden border border-black/10 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.10)]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={src} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* WRITING LANE */}
        {lane === 'Writing' && (
          <motion.section
            key="writing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-[78vh] px-6 md:px-12"
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-center mb-12">
                <motion.div layoutId="lane-btn-Writing" className="pointer-events-none">
                  <motion.h2
                    className="text-6xl md:text-7xl text-white font-extralight tracking-wide"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.65, ease: [0.2, 0.8, 0.2, 1] }}
                  >
                    Writing
                  </motion.h2>
                </motion.div>
              </div>

              {/* whimsical ink sweep across */}
              <motion.div
                aria-hidden="true"
                className="relative rounded-[28px] overflow-hidden border border-white/10 mb-10"
                style={{ height: 120 }}
              >
                <motion.div
                  className="absolute inset-0"
                  initial={{ x: '110%', opacity: 0 }}
                  animate={{ x: '-120%', opacity: 1 }}
                  transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(245,235,255,0.10) 35%, rgba(255,255,255,0) 70%)',
                  }}
                />
                <div className="absolute inset-0" style={{ boxShadow: 'inset 0 0 140px rgba(0,0,0,0.25)' }} />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                {/* chapter cards */}
                <div className="md:col-span-4 space-y-4">
                  {WRITING.pieces.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => setWritingIndex(i)}
                      className={[
                        'w-full text-left px-6 py-5 rounded-2xl border backdrop-blur-xl transition-colors',
                        writingIndex === i ? 'bg-white/14 border-white/16 text-white' : 'bg-white/8 border-white/10 text-white/85 hover:bg-white/12',
                      ].join(' ')}
                      style={{ boxShadow: '0 22px 70px rgba(0,0,0,0.28)' }}
                    >
                      <div className="tracking-widest text-xs opacity-75 mb-2">CHAPTER {String(i + 1).padStart(2, '0')}</div>
                      <div className="text-lg font-light">{p.title}</div>
                    </button>
                  ))}
                </div>

                {/* reading pane */}
                <div className="md:col-span-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={writingIndex}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
                      className="rounded-[28px] border border-white/10 bg-white/8 backdrop-blur-xl p-8 md:p-10"
                      style={{ boxShadow: '0 28px 90px rgba(0,0,0,0.30)' }}
                    >
                      <h3 className="text-3xl md:text-4xl font-extralight text-white">{WRITING.pieces[writingIndex].title}</h3>
                      <div className="mt-4 text-white/75 tracking-wide">Epic fantasy weight. Austen restraint. Romance with teeth.</div>
                      <div className="mt-8 text-lg leading-relaxed text-white/90 whitespace-pre-line">
                        {WRITING.pieces[writingIndex].text}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Bottom: Reviews drift field above contact */}
      <ReviewsDrift light={light} />

      {/* Contact */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div
            className={[
              'rounded-[28px] border backdrop-blur-xl',
              light ? 'bg-white/70 border-black/10' : 'bg-white/10 border-white/10',
            ].join(' ')}
            style={{
              boxShadow: light ? '0 18px 60px rgba(0,0,0,0.10)' : '0 22px 80px rgba(0,0,0,0.30)',
            }}
          >
            <div className="p-10 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div>
                <h3 className={`text-3xl md:text-4xl font-extralight ${light ? 'text-slate-900' : 'text-white'}`}>Contact Me</h3>
                <p className={`${light ? 'text-slate-700' : 'text-white/70'} mt-3 tracking-wide`}>
                  Casting, collaborations, writing inquiries.
                </p>
              </div>
              <a
                className={[
                  'px-10 py-4 rounded-full border text-sm tracking-widest uppercase transition-colors',
                  light
                    ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                    : 'bg-white/12 text-white border-white/18 hover:bg-white/16',
                ].join(' ')}
                href={`mailto:${CONFIG.email}`}
              >
                {CONFIG.email}
              </a>
            </div>
          </div>

          <div className={`mt-10 text-center text-sm tracking-[0.35em] ${light ? 'text-slate-700' : 'text-white/70'}`}>
            © {new Date().getFullYear()} EMERY SCOTT
          </div>
        </div>
      </section>
    </div>
  );
}
