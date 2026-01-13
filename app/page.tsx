'use client';

import React, { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cormorant_Garamond, Inter } from 'next/font/google';

const serif = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '400', '600'] });
const sans = Inter({ subsets: ['latin'], weight: ['300', '400', '600'] });

const HERO_IMAGE = '/images/hero.jpg'; // put your hero image here (public/images/hero.jpg)

const NAV = [
  { id: 'hero', label: 'Home' },
  { id: 'acting', label: 'Acting' },
  { id: 'modeling', label: 'Modeling' },
  { id: 'writing', label: 'Writing' },
  // VO is inside Acting but jumps directly to that subsection
  { id: 'vo', label: 'Voice Over (VO)' },
  { id: 'contact', label: 'Contact' },
];

const QUOTE_TICKER = [
  {
    text: '“[She’s] like a Perfect Apple. Like I want to take a bite, but also I can’t.”',
    author: '— A Random Woman',
  },
  {
    text: '“[She] really impressed me tonight. raised his Modelo”',
    author: '— Casting Director',
  },
  {
    text: '“I hadn’t had that much fun at a shoot in a long time.”',
    author: '— Photographer',
  },
  {
    text: '“If I could see inside [her] head I feel like I’d be overwhelmed, but [she’s] always on time and off book.”',
    author: '— Director',
  },
  {
    text: '“[She is] trying to do a lot, but if there’s anyone who can handle a lot it’s [her].”',
    author: '— Editor',
  },
];

function ytEmbed(url: string) {
  // supports youtu.be/ID and youtube.com/watch?v=ID
  const id =
    url.includes('youtu.be/')
      ? url.split('youtu.be/')[1]?.split('?')[0]
      : new URL(url).searchParams.get('v');
  return id ? `https://www.youtube.com/embed/${id}` : url;
}

function drivePreviewEmbed(viewUrl: string) {
  // converts /view? to /preview for embedding
  return viewUrl.replace('/view', '/preview');
}

export default function Page() {
  const [aboutOpen, setAboutOpen] = useState(false);

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={`${serif.className} min-h-screen`} style={{ color: 'rgba(245,245,248,0.95)' }}>
      {/* GLOBAL BACKGROUND: no blank canvas, no true black */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(900px_650px_at_50%_20%,rgba(235,238,246,0.18),transparent_55%),radial-gradient(700px_500px_at_20%_70%,rgba(180,150,170,0.22),transparent_55%),radial-gradient(900px_700px_at_90%_75%,rgba(130,160,170,0.20),transparent_60%),linear-gradient(180deg,#2b3446_0%,#3b2f45_55%,#2a2f3b_100%)]" />
        <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.65)_1px,transparent_0)] [background-size:3px_3px]" />
      </div>

      {/* PERSISTENT NAV */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-5">
          <div className="rounded-full border border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="flex items-center justify-between px-6 py-3">
              <button onClick={() => scrollToId('hero')} className="tracking-[0.4em] text-xs opacity-90">
                EMERY SCOTT
              </button>

              <nav className={`${sans.className} hidden md:flex gap-6 text-[11px] tracking-[0.32em] opacity-80`}>
                {NAV.slice(1).map((n) => (
                  <button key={n.id} onClick={() => scrollToId(n.id)} className="hover:opacity-100 opacity-80 transition">
                    {n.label.toUpperCase()}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* 1) HERO */}
      <section id="hero" className="pt-28 md:pt-32">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-7">
              <h1 className="text-6xl md:text-7xl font-light leading-[0.95]">
                Emery <span className="opacity-90">Scott</span>
              </h1>

              <div className={`${sans.className} text-xs tracking-[0.45em] opacity-80`}>
                ACTRESS · MODEL · WRITER
              </div>

              <blockquote className="text-xl md:text-2xl font-light leading-relaxed opacity-90 max-w-xl">
                “I have been with story. I have gone without. In only one of those states did I feel I could truly live and so it lives always.”
                <span className={`${sans.className} block mt-3 text-xs tracking-[0.35em] opacity-70`}>— E. Scott</span>
              </blockquote>

              {/* LANE BUTTONS (visual entry only; NAV is the real casting tool) */}
              <div className="flex flex-wrap gap-4 pt-3">
                {['Acting', 'Modeling', 'Writing'].map((x) => (
                  <button
                    key={x}
                    onClick={() => scrollToId(x.toLowerCase())}
                    className={`${sans.className} px-8 py-4 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 transition text-xs tracking-[0.35em]`}
                  >
                    {x.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-[30px] overflow-hidden border border-white/10 shadow-[0_50px_140px_rgba(10,12,18,0.35)]">
                <div className="relative h-[520px] lg:h-[680px]">
                  <img src={HERO_IMAGE} alt="Emery Scott" className="absolute inset-0 w-full h-full object-cover" />
                  {/* embedded quote feel: light + shadow, not text slapped */}
                  <div className="absolute inset-0 bg-[radial-gradient(800px_520px_at_30%_25%,rgba(255,255,255,0.18),transparent_55%),linear-gradient(180deg,transparent_0%,rgba(12,14,20,0.20)_60%,rgba(12,14,20,0.34)_100%)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2) QUOTE TICKER (NYT block reviews drifting, readable, masked edges) */}
      <section className="mt-14">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#2b3446] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#2b3446] to-transparent z-10" />

          <div className="py-10">
            <div className="marquee">
              <div className="marquee__track">
                {[...QUOTE_TICKER, ...QUOTE_TICKER].map((q, i) => (
                  <div key={i} className="reviewCard">
                    <div className="reviewText">{q.text}</div>
                    <div className={`${sans.className} reviewAuthor`}>{q.author}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3) ABOUT (separate from buttons; expandable) */}
      <section id="about" className="mt-2">
        <div className="mx-auto max-w-4xl px-6 md:px-10 py-10 md:py-14">
          <div className="rounded-[34px] border border-white/10 bg-white/6 backdrop-blur-xl p-8 md:p-12 shadow-[0_40px_120px_rgba(10,12,18,0.25)]">
            <p className="text-2xl md:text-3xl leading-relaxed font-light text-center">
              As a lover of words, I ache to write too much. But I have decided to restrain myself.
              <br />
              In brief… I am a{' '}
              <span className="storyteller">
                storyteller
              </span>.
            </p>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setAboutOpen((v) => !v)}
                className={`${sans.className} text-xs tracking-[0.35em] opacity-80 hover:opacity-100 transition border-b border-white/30 pb-1`}
              >
                WHAT IS BUT ONE MORE CLICK?
              </button>
            </div>

            <AnimatePresence>
              {aboutOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
                  className="mt-10 overflow-hidden"
                >
                  <div className="space-y-6 text-lg md:text-xl leading-relaxed font-light opacity-95">
                    <p>
                      Actress, model, writer. My medium may shift, but the intent remains. Some call me a contradiction: ethereal in look, but when I open my mouth I become a fun-loving nut.
                    </p>
                    <p>
                      My training brought me to New York and I graduated from Molloy/CAP21 with a BFA; skills in dialects, in Chekhov and Meisner, singing, dancing—and yet I learned more about what I still don't know than what I do. Recently I've been cutting my teeth on Shakespeare's The Merchant of Venice and Changing the Narrative: A Queer Cabaret.
                    </p>
                    <p>
                      In modeling, I have enjoyed walking the runway for the CCP Cancer Awareness Fashion Show and collaborating on various concept shoots with independent photographers.
                    </p>
                    <p>
                      Fundamentally, to be an interesting artist, you have to be an interested person: in people, in life, in things that you both like and abhor. In my free time, I hike the wilds of Central Park, use the NYPL like my office, draw, play guitar, roller skate, and pretend like I have free time.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 4) ACTING (placeholder shell — we’ll build accordion + VO jump next) */}
      <section id="acting" className="mt-4">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-14">
          <h2 className="text-5xl md:text-6xl font-light mb-8">Acting</h2>
          <div className="rounded-[34px] border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-12">
            <div className={`${sans.className} text-xs tracking-[0.35em] opacity-75`}>
              NEXT: ACCORDION (FILM/TV, COMMERCIAL, VOCAL, DANCE, VO) + LABELED GALLERIES (DRAMA / COMMERCIAL / STAGE)
            </div>
            <div className="mt-6 opacity-80">We’re building this in the next chunk.</div>
          </div>
        </div>
      </section>

      {/* 5) MODELING */}
      <section id="modeling" className="mt-2">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-14">
          <h2 className="text-5xl md:text-6xl font-light mb-8">Modeling</h2>
          <div className="rounded-[34px] border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-12">
            <div className={`${sans.className} text-xs tracking-[0.35em] opacity-75`}>
              Digitals (structured 6) + galleries (7 each) + Runway Walk placeholder
            </div>
          </div>
        </div>
      </section>

      {/* 6) WRITING */}
      <section id="writing" className="mt-2">
        <div className="mx-auto max-w-6xl px-6 md:px-10 py-14">
          <h2 className="text-5xl md:text-6xl font-light mb-8">Writing</h2>
          <div className="rounded-[34px] border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-12">
            <div className={`${sans.className} text-xs tracking-[0.35em] opacity-75`}>
              Warmest section: embedded pieces (3–4), page-like typography, intimate.
            </div>
          </div>
        </div>
      </section>

      {/* 7) CONTACT */}
      <section id="contact" className="mt-2 pb-20">
        <div className="mx-auto max-w-4xl px-6 md:px-10 py-14">
          <h2 className="text-5xl md:text-6xl font-light mb-8">Contact</h2>
          <div className="rounded-[34px] border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-12">
            <div className="grid gap-4">
              <input className="field" placeholder="Name" />
              <input className="field" placeholder="Email" />
              <textarea className="field min-h-[120px]" placeholder="Message" />
              <button className={`${sans.className} sendBtn`}>SEND</button>

              <div className={`${sans.className} text-xs tracking-[0.25em] opacity-75 mt-2`}>
                emeryscott.artist@gmail.com
              </div>

              <div className={`${sans.className} text-xs tracking-[0.25em] opacity-75 mt-3`}>
                Instagram · Facebook · TikTok (we’ll add links next)
              </div>

              <div className={`${sans.className} text-xs tracking-[0.25em] opacity-55 mt-3`}>
                Video slot reserved (spinning ethereal video) — we’ll embed later.
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .field{
          width: 100%;
          border-radius: 18px;
          padding: 14px 16px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.14);
          color: rgba(245,245,248,0.95);
          outline: none;
        }
        .field::placeholder{ color: rgba(245,245,248,0.55); }
        .sendBtn{
          border-radius: 999px;
          padding: 14px 18px;
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.10);
          letter-spacing: 0.32em;
          font-size: 11px;
          transition: 200ms ease;
        }
        .sendBtn:hover{ background: rgba(255,255,255,0.16); }

        /* NYT-ish drifting blocks */
        .marquee{
          overflow:hidden;
          width:100%;
        }
        .marquee__track{
          display:flex;
          gap: 22px;
          width:max-content;
          animation: scroll 48s linear infinite;
          padding-left: 28px;
          padding-right: 28px;
        }
        @keyframes scroll{
          from{ transform: translateX(0); }
          to{ transform: translateX(-50%); }
        }
        .reviewCard{
          min-width: 360px;
          max-width: 460px;
          border-radius: 22px;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          padding: 18px 18px;
          box-shadow: 0 24px 70px rgba(10,12,18,0.18);
        }
        .reviewText{
          font-size: 18px;
          line-height: 1.35;
          opacity: 0.95;
        }
        .reviewAuthor{
          margin-top: 10px;
          font-size: 11px;
          letter-spacing: 0.28em;
          opacity: 0.75;
        }

        /* subtle dynamic on “storyteller” */
        .storyteller{
          position: relative;
          display:inline-block;
          font-style: italic;
        }
        .storyteller::after{
          content:'';
          position:absolute;
          left: -4%;
          right: -4%;
          bottom: -6px;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent);
          opacity: 0.65;
          transform: scaleX(0.86);
          transition: 250ms ease;
        }
        .storyteller:hover::after{
          opacity: 0.95;
          transform: scaleX(1.0);
        }
      `}</style>
    </div>
  );
}
