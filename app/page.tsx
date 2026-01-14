"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from "framer-motion";

type Lane = "home" | "acting" | "modeling" | "writing";

type ActingStage = "split" | "single" | "sub";
type ActingSide = "reels" | "galleries";
type ActingSub = "film_tv" | "vocal" | "dance" | "commercial" | "stage" | "drama";

type ModelingCat = "editorial" | "commercial" | "runway";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Snapshot = {
  lane: Lane;
  actingStage: ActingStage;
  actingSide: ActingSide;
  actingSub: ActingSub | null;
  modelingCat: ModelingCat;
};

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export default function Page() {
  const reduce = useReducedMotion();

  // --- State as "being" + a simple reversible history
  const [lane, setLane] = React.useState<Lane>("home");

  const [actingStage, setActingStage] = React.useState<ActingStage>("split");
  const [actingSide, setActingSide] = React.useState<ActingSide>("reels");
  const [actingSub, setActingSub] = React.useState<ActingSub | null>(null);

  const [modelingCat, setModelingCat] = React.useState<ModelingCat>("editorial");
  const [bioOpen, setBioOpen] = React.useState(false);

  const [history, setHistory] = React.useState<Snapshot[]>([
    {
      lane: "home",
      actingStage: "split",
      actingSide: "reels",
      actingSub: null,
      modelingCat: "editorial",
    },
  ]);

  const pushSnapshot = React.useCallback((next: Partial<Snapshot>) => {
    setHistory((prev) => {
      const curr = prev[prev.length - 1];
      const merged: Snapshot = {
        lane: next.lane ?? curr.lane,
        actingStage: next.actingStage ?? curr.actingStage,
        actingSide: next.actingSide ?? curr.actingSide,
        actingSub: next.actingSub ?? curr.actingSub,
        modelingCat: next.modelingCat ?? curr.modelingCat,
      };

      const same =
        merged.lane === curr.lane &&
        merged.actingStage === curr.actingStage &&
        merged.actingSide === curr.actingSide &&
        merged.actingSub === curr.actingSub &&
        merged.modelingCat === curr.modelingCat;

      return same ? prev : [...prev, merged];
    });
  }, []);

  const applySnapshot = React.useCallback((s: Snapshot) => {
    setLane(s.lane);
    setActingStage(s.actingStage);
    setActingSide(s.actingSide);
    setActingSub(s.actingSub);
    setModelingCat(s.modelingCat);
  }, []);

  const back = React.useCallback(() => {
    setHistory((prev) => {
      if (prev.length <= 1) return prev;
      const next = prev.slice(0, -1);
      applySnapshot(next[next.length - 1]);
      return next;
    });
  }, [applySnapshot]);

  // --- Scroll-driven perceptual continuity (not fixed)
  // Identity remains in the flow, but subtly reorients with scroll & lane light.
  const { scrollYProgress } = useScroll();
  const idY = useTransform(scrollYProgress, [0, 0.7, 1], [0, -10, -16]);
  const idScale = useTransform(scrollYProgress, [0, 1], [1, 0.975]);
  const idOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 0.97, 0.94]);

  // --- World lighting / atmosphere per lane
  const world = React.useMemo(() => {
    // values are "felt" knobs: brightness/contrast/blur/overlay density.
    switch (lane) {
      case "acting":
        return {
          tintA: "from-zinc-950/95 via-zinc-950/70 to-zinc-900/60",
          veil: 0.62,
          grain: 0.22,
          blur: 2,
          brighten: 0.88,
          contrast: 1.05,
          warmth: 0.92,
        };
      case "modeling":
        return {
          tintA: "from-zinc-100/80 via-neutral-100/70 to-zinc-200/60",
          veil: 0.28,
          grain: 0.12,
          blur: 0.6,
          brighten: 1.06,
          contrast: 1.0,
          warmth: 1.02,
        };
      case "writing":
        return {
          tintA: "from-amber-50/70 via-stone-100/60 to-amber-100/55",
          veil: 0.34,
          grain: 0.16,
          blur: 1.2,
          brighten: 1.02,
          contrast: 0.98,
          warmth: 1.07,
        };
      default:
        return {
          tintA: "from-stone-50/65 via-neutral-50/55 to-stone-100/45",
          veil: 0.34,
          grain: 0.14,
          blur: 0.9,
          brighten: 1.0,
          contrast: 1.0,
          warmth: 1.0,
        };
    }
  }, [lane]);

  const canBack = history.length > 1;

  // Minimal data (replace with real assets later)
  const reviews = React.useMemo(
    () => [
      "“A rare stillness—like watching a thought become image.”",
      "“She carries narrative without explaining it.”",
      "“Emery’s work feels lit from within, not staged.”",
      "“Precision, restraint, and a quiet ache.”",
      "“A presence that doesn’t leave the room.”",
      "“It reads like cinema, but breathes like poetry.”",
    ],
    []
  );

  return (
    <div className="min-h-screen bg-neutral-950 text-zinc-950">
      {/* Subtle global styles (painterly noise + masking helpers) */}
      <style>{`
        .noise::before{
          content:"";
          position:absolute; inset:0;
          background-image:
            radial-gradient(circle at 10% 10%, rgba(0,0,0,0.06), transparent 55%),
            radial-gradient(circle at 80% 20%, rgba(0,0,0,0.05), transparent 50%),
            radial-gradient(circle at 30% 80%, rgba(0,0,0,0.05), transparent 55%),
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.25'/%3E%3C/svg%3E");
          mix-blend-mode: overlay;
          opacity: ${world.grain};
          pointer-events:none;
        }
        .soft-mask{
          -webkit-mask-image: radial-gradient(1200px 700px at 50% 20%, rgba(0,0,0,1), rgba(0,0,0,0.35) 62%, rgba(0,0,0,0) 88%);
          mask-image: radial-gradient(1200px 700px at 50% 20%, rgba(0,0,0,1), rgba(0,0,0,0.35) 62%, rgba(0,0,0,0) 88%);
        }
        .paper-mask{
          -webkit-mask-image: radial-gradient(900px 520px at 50% 18%, rgba(0,0,0,1), rgba(0,0,0,0.55) 60%, rgba(0,0,0,0) 90%);
          mask-image: radial-gradient(900px 520px at 50% 18%, rgba(0,0,0,1), rgba(0,0,0,0.55) 60%, rgba(0,0,0,0) 90%);
        }
      `}</style>

      {/* Continuous canvas */}
      <motion.div
        className={cx("relative overflow-hidden", "noise", "min-h-screen")}
        animate={
          reduce
            ? {}
            : {
                filter: `brightness(${world.brighten}) contrast(${world.contrast})`,
              }
        }
        transition={{ duration: 1.1, ease: EASE }}
      >
        {/* Atmospheric veil (persistent) */}
        <motion.div
          className={cx("pointer-events-none absolute inset-0", "bg-gradient-to-b", world.tintA)}
          animate={reduce ? {} : { opacity: 1 }}
          transition={{ duration: 1.1, ease: EASE }}
          style={{ opacity: 1 }}
        />
        <motion.div
          className="pointer-events-none absolute inset-0"
          animate={reduce ? {} : { opacity: world.veil }}
          transition={{ duration: 1.1, ease: EASE }}
          style={{
            background:
              "radial-gradient(900px 520px at 50% 12%, rgba(255,255,255,0.70), rgba(255,255,255,0.15) 55%, rgba(255,255,255,0) 85%)",
            mixBlendMode: "soft-light",
          }}
        />

        {/* Top field: identity remains perceptually present (not fixed) */}
        <div className="relative mx-auto max-w-[980px] px-6 pt-14 sm:pt-20">
          <motion.div
            className={cx("relative", "select-none")}
            style={{
              y: reduce ? 0 : idY,
              scale: reduce ? 1 : idScale,
              opacity: reduce ? 1 : idOpacity,
            }}
            animate={
              reduce
                ? {}
                : {
                    filter:
                      lane === "acting"
                        ? "brightness(0.96) contrast(1.04)"
                        : lane === "writing"
                        ? "brightness(1.02) contrast(0.98)"
                        : "brightness(1) contrast(1)",
                  }
            }
            transition={{ duration: 0.9, ease: EASE }}
          >
            {/* Social links (calm, no decorative motion) */}
            <div className="mb-6 flex items-center justify-between text-xs tracking-[0.18em] text-zinc-700">
              <div className="opacity-70">EMERY SCOTT</div>
              <div className="flex items-center gap-4">
                <a
                  className="opacity-70 hover:opacity-100 transition-opacity"
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
                <a
                  className="opacity-70 hover:opacity-100 transition-opacity"
                  href="https://www.imdb.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  IMDb
                </a>
                <a className="opacity-70 hover:opacity-100 transition-opacity" href="mailto:emeryscott.artist@gmail.com">
                  Email
                </a>
              </div>
            </div>

            <h1 className="text-[40px] leading-[1.02] tracking-[-0.02em] text-zinc-950 sm:text-[54px]">
              Emery Scott
            </h1>

            <motion.div
              className="mt-5 max-w-[56ch] text-[15px] leading-[1.65] text-zinc-800"
              animate={
                reduce
                  ? {}
                  : {
                      opacity: 1,
                      filter: lane === "acting" ? "brightness(0.96)" : "brightness(1)",
                    }
              }
              transition={{ duration: 0.9, ease: EASE }}
            >
              <p className="italic">
                “I have been with story. I have gone without. In only one of those states did I feel I could truly live
                and so it lives always.”
                <span className="not-italic"> — E. Scott</span>
              </p>
            </motion.div>

            <div className="mt-7 max-w-[62ch] text-[15px] leading-[1.7] text-zinc-800">
              <p>
                As a lover of words, I ache to write too much. But I have decided to restrain myself. In brief… I am a{" "}
                <motion.span
                  className="relative inline-block cursor-default"
                  animate={reduce ? {} : { opacity: [0.92, 1, 0.92] }}
                  transition={
                    reduce
                      ? undefined
                      : {
                          duration: 3.6,
                          ease: EASE,
                          repeat: Infinity,
                        }
                  }
                  style={{
                    textShadow:
                      lane === "acting"
                        ? "0 0 22px rgba(255,255,255,0.08)"
                        : lane === "writing"
                        ? "0 0 22px rgba(120,70,10,0.12)"
                        : "0 0 18px rgba(0,0,0,0.06)",
                  }}
                >
                  Storyteller
                </motion.span>
                .
              </p>

              <div className="mt-5">
                <motion.button
                  type="button"
                  className={cx(
                    "text-[13px] tracking-[0.12em] text-zinc-700",
                    "hover:text-zinc-950 transition-colors"
                  )}
                  onClick={() => {
                    setBioOpen((v) => !v);
                  }}
                  whileTap={reduce ? undefined : { scale: 0.99 }}
                >
                  what is but one more click?
                </motion.button>

                <AnimatePresence initial={false}>
                  {bioOpen && (
                    <motion.div
                      className="mt-6 max-w-[66ch] text-[15px] leading-[1.75] text-zinc-800"
                      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10, filter: "blur(6px)" }}
                      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, filter: "blur(8px)" }}
                      transition={{ duration: 0.9, ease: EASE }}
                    >
                      <p>
                        I work like someone listening for a line that’s already in the room. I’m drawn to the moment
                        before the confession, the second after the decision—when the body still remembers what it
                        hasn’t said. I love craft. I love restraint. I love the patience it takes to let meaning arrive
                        on its own.
                      </p>
                      <p className="mt-4">
                        I move between performance and image the way you move between memory and weather. Acting is my
                        mythic space. Modeling is my clarity. Writing is my interior room—warm, precise, and honest.
                        Everything I make is trying to stay human while it becomes art.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Lane triggers (thresholds, not navigation) */}
              <div className="mt-10 flex flex-wrap items-baseline gap-x-8 gap-y-3 text-[13px] tracking-[0.18em] text-zinc-700">
                <Threshold
                  active={lane === "acting"}
                  label="Acting"
                  onEnter={() => {
                    pushSnapshot({ lane: "acting", actingStage: "split", actingSub: null });
                    setLane("acting");
                    setActingStage("split");
                    setActingSub(null);
                  }}
                  reduce={reduce}
                />
                <Threshold
                  active={lane === "modeling"}
                  label="Modeling"
                  onEnter={() => {
                    pushSnapshot({ lane: "modeling" });
                    setLane("modeling");
                  }}
                  reduce={reduce}
                />
                <Threshold
                  active={lane === "writing"}
                  label="Writing"
                  onEnter={() => {
                    pushSnapshot({ lane: "writing" });
                    setLane("writing");
                  }}
                  reduce={reduce}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* The mutable world beneath (continuous scroll field) */}
        <div className="relative mx-auto max-w-[1100px] px-6 pb-24 pt-14 sm:pt-16">
          {/* Lane title plane + Back reversal cue */}
          <div className="relative mb-10 flex items-center justify-between">
            <motion.div
              className="text-[12px] tracking-[0.22em] text-zinc-700"
              animate={
                reduce
                  ? {}
                  : {
                      opacity: lane === "home" ? 0.55 : 1,
                      filter:
                        lane === "acting"
                          ? "brightness(1.06)"
                          : lane === "writing"
                          ? "brightness(1.02)"
                          : "brightness(1)",
                    }
              }
              transition={{ duration: 0.9, ease: EASE }}
            >
              {lane === "home" ? "—" : lane.toUpperCase()}
            </motion.div>

            <motion.button
              type="button"
              onClick={() => {
                if (canBack) back();
              }}
              className={cx(
                "text-[12px] tracking-[0.22em] text-zinc-700",
                canBack ? "opacity-80 hover:opacity-100" : "opacity-0 pointer-events-none"
              )}
              initial={false}
              animate={reduce ? {} : { x: canBack ? 0 : 6, filter: lane === "acting" ? "brightness(1.08)" : "brightness(1)" }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              BACK
            </motion.button>
          </div>

          {/* World layer: different conditioning per lane */}
          <div className="relative">
            {/* Home: quiet suggestion */}
            <AnimatePresence mode="wait">
              {lane === "home" && (
                <motion.div
                  key="home"
                  className="soft-mask text-zinc-800"
                  initial={reduce ? { opacity: 1 } : { opacity: 0, y: 18, filter: "blur(8px)" }}
                  animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, filter: "blur(10px)" }}
                  transition={{ duration: 1.0, ease: EASE }}
                >
                  <p className="max-w-[70ch] text-[15px] leading-[1.8]">
                    The world below is waiting to be lit. Choose a threshold when you’re ready; the foreground stays with you.
                  </p>

                  <div className="mt-16 h-px w-full bg-zinc-950/10" />
                </motion.div>
              )}

              {/* ACTING */}
              {lane === "acting" && (
                <motion.div
                  key="acting"
                  className="relative"
                  initial={reduce ? { opacity: 1 } : { opacity: 0, y: 26, filter: "blur(10px)" }}
                  animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: 18, filter: "blur(12px)" }}
                  transition={{ duration: 1.15, ease: EASE }}
                >
                  {/* Deepening veil */}
                  <motion.div
                    className="pointer-events-none absolute inset-0 -z-10"
                    animate={reduce ? {} : { opacity: actingStage === "sub" ? 0.72 : 0.58 }}
                    transition={{ duration: 1.0, ease: EASE }}
                    style={{
                      background:
                        "radial-gradient(1100px 700px at 50% 20%, rgba(0,0,0,0.68), rgba(0,0,0,0.28) 52%, rgba(0,0,0,0) 78%)",
                      mixBlendMode: "multiply",
                    }}
                  />

                  {/* Stage header presence */}
                  <div className="mb-6 flex items-baseline justify-between gap-6 text-[12px] tracking-[0.22em] text-zinc-200/80">
                    <div>
                      {actingStage === "split" && "ACTING — SPLIT"}
                      {actingStage === "single" && `ACTING — ${actingSide.toUpperCase()}`}
                      {actingStage === "sub" && `ACTING — ${actingSide.toUpperCase()} / ${labelForSub(actingSub)}`}
                    </div>
                    <div className="opacity-70">{actingStage !== "split" ? "STEP BACK" : ""}</div>
                  </div>

                  {/* --- SPLIT → SINGLE → SUBSECTION --- */}
                  <div className="relative overflow-hidden">
                    <AnimatePresence mode="wait" initial={false}>
                      {/* SPLIT: Single blurred stage with two visible sides divided by vertical seam */}
                      {actingStage === "split" && (
                        <motion.div
                          key="acting-split"
                          className="relative"
                          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10, filter: "blur(10px)" }}
                          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, filter: "blur(12px)" }}
                          transition={{ duration: 1.0, ease: EASE }}
                        >
                          <div className="relative">
                            {/* Click capture: left half = Reels, right half = Galleries */}
                            <div className="absolute inset-0 z-10 grid grid-cols-2">
                              <button
                                type="button"
                                aria-label="Select Reels"
                                className="cursor-pointer"
                                onClick={() => {
                                  pushSnapshot({
                                    lane: "acting",
                                    actingStage: "single",
                                    actingSide: "reels",
                                    actingSub: null,
                                  });
                                  setLane("acting");
                                  setActingStage("single");
                                  setActingSide("reels");
                                  setActingSub(null);
                                }}
                              />
                              <button
                                type="button"
                                aria-label="Select Galleries"
                                className="cursor-pointer"
                                onClick={() => {
                                  pushSnapshot({
                                    lane: "acting",
                                    actingStage: "single",
                                    actingSide: "galleries",
                                    actingSub: null,
                                  });
                                  setLane("acting");
                                  setActingStage("single");
                                  setActingSide("galleries");
                                  setActingSub(null);
                                }}
                              />
                            </div>

                            {/* Single blurred stage: two sides, one vertical seam */}
                            <div className="paper-mask py-10">
                              <p className="max-w-[78ch] text-[14px] leading-[1.9] text-zinc-100/85">
                                A single blurred stage divided by a vertical seam. Click left for Reels, right for Galleries.
                              </p>

                              <div className="relative mt-10 overflow-hidden">
                                {/* Vertical seam dividing the stage */}
                                <div
                                  className="pointer-events-none absolute inset-y-0 left-1/2 w-[2px] bg-white/10"
                                  style={{ boxShadow: "0 0 44px rgba(255,255,255,0.06)" }}
                                />

                                {/* Two blurred sides visible simultaneously */}
                                <div className="grid grid-cols-2 gap-0">
                                  <motion.div
                                    className="px-6 py-10"
                                    animate={reduce ? {} : { filter: "blur(4px) brightness(0.92)", opacity: 0.95 }}
                                    transition={{ duration: 1.0, ease: EASE }}
                                  >
                                    <div className="text-[12px] tracking-[0.26em] text-zinc-100/75">REELS</div>
                                    <div className="mt-5 space-y-7 text-zinc-100/70">
                                      <GhostLine />
                                      <GhostLine />
                                      <GhostLine />
                                    </div>
                                  </motion.div>

                                  <motion.div
                                    className="px-6 py-10"
                                    animate={reduce ? {} : { filter: "blur(4px) brightness(0.92)", opacity: 0.95 }}
                                    transition={{ duration: 1.0, ease: EASE }}
                                  >
                                    <div className="text-[12px] tracking-[0.26em] text-zinc-100/75">GALLERIES</div>
                                    <div className="mt-5 space-y-7 text-zinc-100/70">
                                      <GhostLine />
                                      <GhostLine />
                                      <GhostLine />
                                    </div>
                                  </motion.div>
                                </div>

                                <div className="pointer-events-none mt-10 h-px w-full bg-white/10" />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* SINGLE: Collapsed to full-width via lateral slide */}
                      {actingStage === "single" && (
                        <motion.div
                          key="acting-single"
                          className="relative"
                          initial={
                            reduce
                              ? { opacity: 1 }
                              : {
                                  opacity: 0,
                                  x: actingSide === "reels" ? -28 : 28,
                                  filter: "blur(10px)",
                                }
                          }
                          animate={reduce ? { opacity: 1 } : { opacity: 1, x: 0, filter: "blur(0px)" }}
                          exit={
                            reduce
                              ? { opacity: 0 }
                              : {
                                  opacity: 0,
                                  x: actingSide === "reels" ? 28 : -28,
                                  filter: "blur(12px)",
                                }
                          }
                          transition={{ duration: 1.05, ease: EASE }}
                        >
                          <div className="paper-mask py-10">
                            <div className="text-[13px] tracking-[0.24em] text-zinc-100/90">
                              {actingSide === "reels" ? "REELS" : "GALLERIES"}
                            </div>

                            <p className="mt-4 max-w-[78ch] text-[14px] leading-[1.9] text-zinc-100/80">
                              Select a subsection. Nothing opens automatically.
                            </p>

                            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[12px] tracking-[0.22em] text-zinc-200/75">
                              {actingSide === "reels" ? (
                                <>
                                  <SubLink
                                    active={actingSub === "film_tv"}
                                    label="FILM / TV"
                                    onEnter={() => {
                                      pushSnapshot({
                                        lane: "acting",
                                        actingStage: "sub",
                                        actingSide: "reels",
                                        actingSub: "film_tv",
                                      });
                                      setActingStage("sub");
                                      setActingSub("film_tv");
                                    }}
                                    reduce={reduce}
                                  />
                                  <SubLink
                                    active={actingSub === "vocal"}
                                    label="VOCAL"
                                    onEnter={() => {
                                      pushSnapshot({
                                        lane: "acting",
                                        actingStage: "sub",
                                        actingSide: "reels",
                                        actingSub: "vocal",
                                      });
                                      setActingStage("sub");
                                      setActingSub("vocal");
                                    }}
                                    reduce={reduce}
                                  />
                                  <SubLink
                                    active={actingSub === "dance"}
                                    label="DANCE"
                                    onEnter={() => {
                                      pushSnapshot({
                                        lane: "acting",
                                        actingStage: "sub",
                                        actingSide: "reels",
                                        actingSub: "dance",
                                      });
                                      setActingStage("sub");
                                      setActingSub("dance");
                                    }}
                                    reduce={reduce}
                                  />
                                </>
                              ) : (
                                <>
                                  <SubLink
                                    active={actingSub === "commercial"}
                                    label="COMMERCIAL"
                                    onEnter={() => {
                                      pushSnapshot({
                                        lane: "acting",
                                        actingStage: "sub",
                                        actingSide: "galleries",
                                        actingSub: "commercial",
                                      });
                                      setActingStage("sub");
                                      setActingSub("commercial");
                                    }}
                                    reduce={reduce}
                                  />
                                  <SubLink
                                    active={actingSub === "stage"}
                                    label="STAGE"
                                    onEnter={() => {
                                      pushSnapshot({
                                        lane: "acting",
                                        actingStage: "sub",
                                        actingSide: "galleries",
                                        actingSub: "stage",
                                      });
                                      setActingStage("sub");
                                      setActingSub("stage");
                                    }}
                                    reduce={reduce}
                                  />
                                  <SubLink
                                    active={actingSub === "drama"}
                                    label="DRAMA"
                                    onEnter={() => {
                                      pushSnapshot({
                                        lane: "acting",
                                        actingStage: "sub",
                                        actingSide: "galleries",
                                        actingSub: "drama",
                                      });
                                      setActingStage("sub");
                                      setActingSub("drama");
                                    }}
                                    reduce={reduce}
                                  />
                                </>
                              )}
                            </div>

                            <div className="mt-10 h-px w-full bg-white/10" />
                          </div>
                        </motion.div>
                      )}

                      {/* SUBSECTION: Content revealed only when selected */}
                      {actingStage === "sub" && (
                        <motion.div
                          key="acting-sub"
                          className="relative"
                          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10, filter: "blur(12px)" }}
                          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 8, filter: "blur(12px)" }}
                          transition={{ duration: 1.05, ease: EASE }}
                        >
                          <div className="paper-mask py-10">
                            <div className="text-[13px] tracking-[0.24em] text-zinc-100/90">
                              {actingSide === "reels" ? "REELS" : "GALLERIES"} / {labelForSub(actingSub)}
                            </div>

                            <p className="mt-4 max-w-[78ch] text-[14px] leading-[1.95] text-zinc-100/80">
                              This content is revealed only because you chose it. Keep media dormant until the viewer engages.
                            </p>

                            <div className="mt-10 space-y-8 text-zinc-100/80">
                              <ActingContentBlock
                                title={labelForSub(actingSub)}
                                body="Placeholder content. Replace with curated items that do not auto-play or auto-open."
                              />

                              <ActingContentBlock title="ITEM ONE" body="Credit / descriptor placeholder." />
                              <ActingContentBlock title="ITEM TWO" body="Credit / descriptor placeholder." />
                              <ActingContentBlock title="ITEM THREE" body="Credit / descriptor placeholder." />
                            </div>

                            <div className="mt-10 h-px w-full bg-white/10" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}

              {/* MODELING */}
              {lane === "modeling" && (
                <motion.div
                  key="modeling"
                  className="relative"
                  initial={reduce ? { opacity: 1 } : { opacity: 0, y: 22, filter: "blur(10px)" }}
                  animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: 14, filter: "blur(12px)" }}
                  transition={{ duration: 1.1, ease: EASE }}
                >
                  {/* Soft summer greys: editorial field */}
                  <motion.div
                    className="pointer-events-none absolute inset-0 -z-10"
                    animate={reduce ? {} : { opacity: 1 }}
                    transition={{ duration: 1.1, ease: EASE }}
                    style={{
                      background:
                        "radial-gradient(900px 520px at 50% 10%, rgba(255,255,255,0.85), rgba(255,255,255,0.35) 55%, rgba(255,255,255,0) 82%)",
                      mixBlendMode: "soft-light",
                    }}
                  />

                  {/* Digitals settle slightly after background shift */}
                  <motion.div
                    className="paper-mask"
                    initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10, filter: "blur(6px)" }}
                    animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: reduce ? 0 : 0.12, duration: 1.0, ease: EASE }}
                  >
                    <p className="max-w-[70ch] text-[14px] leading-[1.85] text-zinc-900/80">
                      Digitals remain present—always. Structured, intentional, editorial. Replace these placeholders with curated digitals and
                      measured captions.
                    </p>

                    <div className="mt-10 space-y-7">
                      <ModelingLine label="Height" value="—" />
                      <ModelingLine label="Hair" value="—" />
                      <ModelingLine label="Eyes" value="—" />
                      <ModelingLine label="Location" value="—" />
                    </div>

                    <div className="mt-10 h-px w-full bg-zinc-950/10" />
                  </motion.div>

                  {/* Categories unfold downward; nothing above collapses */}
                  <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-[12px] tracking-[0.22em] text-zinc-700">
                    <ModelingCatLink
                      active={modelingCat === "editorial"}
                      label="EDITORIAL"
                      onEnter={() => {
                        pushSnapshot({ lane: "modeling", modelingCat: "editorial" });
                        setModelingCat("editorial");
                        setLane("modeling");
                      }}
                      reduce={reduce}
                    />
                    <ModelingCatLink
                      active={modelingCat === "commercial"}
                      label="COMMERCIAL"
                      onEnter={() => {
                        pushSnapshot({ lane: "modeling", modelingCat: "commercial" });
                        setModelingCat("commercial");
                        setLane("modeling");
                      }}
                      reduce={reduce}
                    />
                    <ModelingCatLink
                      active={modelingCat === "runway"}
                      label="RUNWAY"
                      onEnter={() => {
                        pushSnapshot({ lane: "modeling", modelingCat: "runway" });
                        setModelingCat("runway");
                        setLane("modeling");
                      }}
                      reduce={reduce}
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={modelingCat}
                      className="mt-10 paper-mask"
                      initial={reduce ? { opacity: 1 } : { opacity: 0, y: 14, filter: "blur(10px)" }}
                      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={reduce ? { opacity: 0 } : { opacity: 0, y: 10, filter: "blur(12px)" }}
                      transition={{ duration: 1.05, ease: EASE }}
                    >
                      <p className="max-w-[78ch] text-[14px] leading-[1.9] text-zinc-900/80">
                        {modelingCat === "editorial" &&
                          "Editorial: narrative clarity. Later: curated editorials with title, publication, photographer, and a restrained sequence."}
                        {modelingCat === "commercial" &&
                          "Commercial: clean presence and practical light. Later: brand work, usage notes, and quiet proof of range."}
                        {modelingCat === "runway" &&
                          "Runway: line, pace, silhouette. Later: show credits, designers, seasons, and measured photo sequences."}
                      </p>

                      <div className="mt-10 space-y-8">
                        <ModelingItem title="Set One" subtitle="Sequence placeholder" />
                        <ModelingItem title="Set Two" subtitle="Sequence placeholder" />
                        <ModelingItem title="Set Three" subtitle="Sequence placeholder" />
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              )}

              {/* WRITING */}
              {lane === "writing" && (
                <motion.div
                  key="writing"
                  className="relative"
                  initial={reduce ? { opacity: 1 } : { opacity: 0, y: 20, filter: "blur(10px)" }}
                  animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12, filter: "blur(12px)" }}
                  transition={{ duration: 1.15, ease: EASE }}
                >
                  {/* Warm, page-like falloff */}
                  <motion.div
                    className="pointer-events-none absolute inset-0 -z-10"
                    animate={reduce ? {} : { opacity: 0.9 }}
                    transition={{ duration: 1.1, ease: EASE }}
                    style={{
                      background:
                        "radial-gradient(1000px 640px at 50% 12%, rgba(255,244,220,0.85), rgba(255,244,220,0.35) 55%, rgba(255,244,220,0) 82%)",
                      mixBlendMode: "multiply",
                    }}
                  />

                  <div className="paper-mask">
                    <p className="max-w-[70ch] text-[14px] leading-[1.9] text-zinc-900/80">
                      Writing arrives like ink settling—slow, intimate, and present in the surface.
                    </p>

                    {/* Ink-like arrival: opacity + blur + slight drift */}
                    <motion.div
                      className="mt-10 max-w-[78ch] text-[15px] leading-[2.0] text-zinc-950"
                      initial={
                        reduce
                          ? { opacity: 1 }
                          : { opacity: 0, y: 12, filter: "blur(10px)", letterSpacing: "0.02em" }
                      }
                      animate={
                        reduce
                          ? { opacity: 1 }
                          : { opacity: 1, y: 0, filter: "blur(0px)", letterSpacing: "0em" }
                      }
                      transition={{ duration: 1.35, ease: EASE }}
                      style={{
                        textRendering: "geometricPrecision",
                      }}
                    >
                      <p>I don’t trust the first sentence. I trust the third—after the voice has admitted what it’s protecting.</p>
                      <p className="mt-8">
                        I write for the moment a person recognizes themselves in a room they didn’t know they’d entered. Not revelation—recognition.
                        The kind that arrives quietly and changes your posture.
                      </p>
                      <p className="mt-8">
                        The work is always trying to remain human while it becomes art. That’s the only tension I care about.
                      </p>
                    </motion.div>

                    <div className="mt-14 h-px w-full bg-zinc-950/10" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Reviews drift layer (persistent across lanes) */}
            <div className="relative mt-16">
              <DriftingReviews reviews={reviews} reduce={reduce} />
            </div>

            {/* Contact (calm, grounded, minimal motion) */}
            <div className="relative mt-20">
              <Contact />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Threshold({
  label,
  active,
  onEnter,
  reduce,
}: {
  label: string;
  active: boolean;
  onEnter: () => void;
  reduce: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onEnter}
      className={cx("relative text-left", "text-zinc-700 hover:text-zinc-950 transition-colors")}
      initial={false}
      animate={
        reduce
          ? {}
          : {
              opacity: active ? 1 : 0.72,
              y: active ? -1 : 0,
              filter: active ? "brightness(1.02)" : "brightness(1)",
            }
      }
      transition={{ duration: 0.7, ease: EASE }}
      whileTap={reduce ? undefined : { scale: 0.99 }}
    >
      <span className="relative">
        {label.toUpperCase()}
        <motion.span
          className="pointer-events-none absolute -bottom-2 left-0 right-0 h-[1px] bg-zinc-950/30"
          initial={false}
          animate={reduce ? {} : { opacity: active ? 0.8 : 0, scaleX: active ? 1 : 0.65 }}
          transition={{ duration: 0.8, ease: EASE }}
          style={{ transformOrigin: "left" }}
        />
      </span>
    </motion.button>
  );
}

function ModelingCatLink({
  label,
  active,
  onEnter,
  reduce,
}: {
  label: string;
  active: boolean;
  onEnter: () => void;
  reduce: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onEnter}
      className={cx("text-left", "text-zinc-700 hover:text-zinc-950 transition-colors")}
      initial={false}
      animate={
        reduce
          ? {}
          : {
              opacity: active ? 1 : 0.65,
              y: active ? -1 : 0,
              filter: active ? "brightness(1.02)" : "brightness(1)",
            }
      }
      transition={{ duration: 0.7, ease: EASE }}
      whileTap={reduce ? undefined : { scale: 0.99 }}
    >
      {label}
    </motion.button>
  );
}

function ModelingLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-8">
      <div className="text-[12px] tracking-[0.22em] text-zinc-700">{label.toUpperCase()}</div>
      <div className="text-[14px] text-zinc-950/80">{value}</div>
    </div>
  );
}

function ModelingItem({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="text-zinc-950/85">
      <div className="text-[13px] tracking-[0.14em]">{title.toUpperCase()}</div>
      <div className="mt-2 text-[14px] leading-[1.85] text-zinc-900/75">{subtitle}</div>
      <div className="mt-6 h-px w-full bg-zinc-950/10" />
    </div>
  );
}

function DriftingReviews({ reviews, reduce }: { reviews: string[]; reduce: boolean }) {
  // Independent drift: varied speeds and offsets, editorial, not mechanical.
  return (
    <div className="relative overflow-hidden py-10">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.08) 18%, rgba(0,0,0,0.08) 82%, rgba(0,0,0,0) 100%)",
            mixBlendMode: "multiply",
          }}
        />
      </div>

      <div className="relative space-y-6">
        {reviews.map((t, i) => {
          const duration = 42 + i * 9;
          const start = -20 - i * 12;
          const end = 120 + i * 10;

          return (
            <motion.div
              key={i}
              className="whitespace-nowrap text-[13px] leading-[1.9] tracking-[0.02em] text-zinc-800/70"
              initial={false}
              animate={reduce ? { opacity: 0.75, x: "0%" } : { opacity: 0.78, x: [`${start}%`, `${end}%`] }}
              transition={reduce ? { duration: 0 } : { duration, ease: "linear", repeat: Infinity }}
              style={{ filter: "blur(0.2px)" }}
            >
              <span className="italic">{t}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function Contact() {
  return (
    <div className="relative">
      <div className="text-[12px] tracking-[0.22em] text-zinc-700">CONTACT</div>
      <div className="mt-6 max-w-[72ch] text-[14px] leading-[1.9] text-zinc-800">
        Calm, human, direct. No decorative motion here.
      </div>

      <form
        className="mt-10 max-w-[560px] space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          alert("Message draft captured locally. Wire this to your preferred form handler.");
        }}
      >
        <Field label="Name" placeholder="Your name" />
        <Field label="Email" placeholder="your@email.com" />
        <Field label="Message" placeholder="A note…" multiline />

        <div className="pt-2 text-[12px] tracking-[0.12em] text-zinc-700">
          Email:{" "}
          <a className="text-zinc-950/80 hover:text-zinc-950" href="mailto:emeryscott.artist@gmail.com">
            emeryscott.artist@gmail.com
          </a>
        </div>

        <button type="submit" className="text-[12px] tracking-[0.22em] text-zinc-700 hover:text-zinc-950 transition-colors">
          SEND
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  placeholder,
  multiline,
}: {
  label: string;
  placeholder: string;
  multiline?: boolean;
}) {
  const common =
    "w-full bg-transparent text-zinc-950 placeholder:text-zinc-500/70 outline-none " + "text-[14px] leading-[1.8]";
  return (
    <div className="space-y-2">
      <div className="text-[12px] tracking-[0.22em] text-zinc-700">{label.toUpperCase()}</div>
      {multiline ? <textarea className={cx(common, "min-h-[120px] resize-y")} placeholder={placeholder} /> : <input className={common} placeholder={placeholder} />}
      <div className="h-px w-full bg-zinc-950/10" />
    </div>
  );
}

/* --- Acting helpers --- */

function labelForSub(sub: ActingSub | null) {
  if (!sub) return "";
  switch (sub) {
    case "film_tv":
      return "FILM / TV";
    case "vocal":
      return "VOCAL";
    case "dance":
      return "DANCE";
    case "commercial":
      return "COMMERCIAL";
    case "stage":
      return "STAGE";
    case "drama":
      return "DRAMA";
  }
}

function GhostLine() {
  return <div className="h-[10px] w-full bg-white/10" style={{ filter: "blur(0.4px)" }} />;
}

function SubLink({
  label,
  active,
  onEnter,
  reduce,
}: {
  label: string;
  active: boolean;
  onEnter: () => void;
  reduce: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onEnter}
      className="text-left text-zinc-200/75 hover:text-zinc-100 transition-colors"
      initial={false}
      animate={
        reduce
          ? {}
          : {
              opacity: active ? 1 : 0.65,
              y: active ? -1 : 0,
              filter: active ? "brightness(1.06)" : "brightness(1)",
            }
      }
      transition={{ duration: 0.7, ease: EASE }}
      whileTap={reduce ? undefined : { scale: 0.99 }}
    >
      {label}
    </motion.button>
  );
}

function ActingContentBlock({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <div className="text-[12px] tracking-[0.26em] text-zinc-100/85">{title}</div>
      <div className="mt-3 text-[14px] leading-[1.95] text-zinc-100/75">{body}</div>
      <div className="mt-7 h-px w-full bg-white/10" />
    </div>
  );
}
