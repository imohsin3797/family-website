"use client";

import { useState, useEffect, useRef, useCallback, useMemo, type ReactNode } from "react";
import Image from "next/image";
import type { GallerySection } from "../page";
import { galleryCopy } from "../content/galleryContent";

/* ═══════════════════════════════════════════
   Color tints — cohesive gold-family palette
   ═══════════════════════════════════════════ */

/* Section accent colors — applied to titles, lines, subtitles */
const ACCENTS = [
  "#B8963E",  // gold
  "#B87868",  // rose
  "#C48A3E",  // amber
  "#A86E3E",  // copper
  "#7A8A5A",  // sage
];

const TINTS = [
  { p: "#B8963E", s: "#D4B65E", a: "#E8D5A0" },  // gold
  { p: "#B87868", s: "#D49A8E", a: "#E8C4BB" },  // rose
  { p: "#C48A3E", s: "#D4A85E", a: "#E8CDA0" },  // amber
  { p: "#A86E3E", s: "#C49060", a: "#DEB88A" },  // copper
  { p: "#7A8A5A", s: "#9AAA78", a: "#BED0A0" },  // sage
];

/* ═══════════════════════════════════════════
   Decorative SVGs — with tint prop
   ═══════════════════════════════════════════ */

function FloralBranch({ className, flip, tint = 0 }: { className?: string; flip?: boolean; tint?: number }) {
  const t = TINTS[tint % TINTS.length];
  return (
    <svg className={className} style={flip ? { transform: "scaleX(-1)" } : {}} width="140" height="300" viewBox="0 0 140 300" fill="none" aria-hidden>
      <path d="M70 300 C70 250 95 210 78 160 C60 110 85 70 70 15" stroke={t.p} strokeWidth="1.8" opacity="0.32" />
      <path d="M78 240 C100 225 115 238 100 255 C92 248 78 240 78 240Z" fill={t.p} opacity="0.22" />
      <path d="M62 190 C40 175 25 188 40 205 C48 198 62 190 62 190Z" fill={t.s} opacity="0.20" />
      <path d="M82 135 C104 120 119 133 104 150 C96 143 82 135 82 135Z" fill={t.p} opacity="0.18" />
      <path d="M58 80 C36 65 21 78 36 95 C44 88 58 80 58 80Z" fill={t.s} opacity="0.18" />
      <path d="M75 50 C90 38 100 48 90 58 C85 53 75 50 75 50Z" fill={t.p} opacity="0.16" />
      <circle cx="70" cy="15" r="10" fill={t.a} opacity="0.16" />
      <circle cx="70" cy="15" r="5" fill={t.p} opacity="0.28" />
      <circle cx="100" cy="150" r="7" fill={t.s} opacity="0.15" />
      <circle cx="40" cy="205" r="6" fill={t.a} opacity="0.14" />
      <circle cx="90" cy="58" r="4" fill={t.s} opacity="0.18" />
      <circle cx="88" cy="100" r="3.5" fill={t.a} opacity="0.22" />
      <circle cx="52" cy="155" r="4" fill={t.s} opacity="0.18" />
      <circle cx="82" cy="215" r="3" fill={t.a} opacity="0.20" />
    </svg>
  );
}

function FloralCorner({ className, rotate, tint = 0 }: { className?: string; rotate?: number; tint?: number }) {
  const t = TINTS[tint % TINTS.length];
  return (
    <svg className={className} style={rotate ? { transform: `rotate(${rotate}deg)` } : {}} width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden>
      <path d="M0 120 C15 90 40 65 75 50 C98 42 110 28 120 0" stroke={t.p} strokeWidth="1.4" opacity="0.28" />
      <path d="M5 110 C8 100 18 95 22 102 C16 104 8 108 5 110Z" fill={t.p} opacity="0.24" />
      <path d="M30 85 C38 74 50 76 47 86 C42 84 34 84 30 85Z" fill={t.s} opacity="0.20" />
      <path d="M65 55 C75 44 88 48 82 58 C78 55 70 54 65 55Z" fill={t.p} opacity="0.18" />
      <path d="M100 30 C106 22 114 25 110 32 C107 30 103 29 100 30Z" fill={t.s} opacity="0.18" />
      <circle cx="48" cy="72" r="5" fill={t.a} opacity="0.20" />
      <circle cx="85" cy="40" r="4.5" fill={t.s} opacity="0.24" />
      <circle cx="18" cy="98" r="4" fill={t.a} opacity="0.20" />
    </svg>
  );
}

function Balloons({ className, tint = 0 }: { className?: string; tint?: number }) {
  const t1 = TINTS[tint % TINTS.length];
  const t2 = TINTS[(tint + 1) % TINTS.length];
  const t3 = TINTS[(tint + 2) % TINTS.length];
  return (
    <svg className={className} width="200" height="280" viewBox="0 0 200 280" fill="none" aria-hidden>
      <ellipse cx="65" cy="65" rx="38" ry="48" fill={t1.p} opacity="0.12" />
      <ellipse cx="65" cy="65" rx="38" ry="48" stroke={t1.p} strokeWidth="1" opacity="0.22" />
      <ellipse cx="55" cy="50" rx="10" ry="14" fill="white" opacity="0.12" />
      <path d="M65 113 L65 117 L61 113 L69 113Z" fill={t1.p} opacity="0.22" />
      <ellipse cx="135" cy="48" rx="32" ry="42" fill={t2.p} opacity="0.14" />
      <ellipse cx="135" cy="48" rx="32" ry="42" stroke={t2.p} strokeWidth="1" opacity="0.25" />
      <ellipse cx="126" cy="36" rx="8" ry="12" fill="white" opacity="0.10" />
      <path d="M135 90 L135 94 L131 90 L139 90Z" fill={t2.p} opacity="0.25" />
      <ellipse cx="95" cy="88" rx="26" ry="34" fill={t3.p} opacity="0.10" />
      <ellipse cx="95" cy="88" rx="26" ry="34" stroke={t3.p} strokeWidth="1" opacity="0.20" />
      <ellipse cx="88" cy="78" rx="7" ry="10" fill="white" opacity="0.09" />
      <path d="M95 122 L95 126 L91 122 L99 122Z" fill={t3.p} opacity="0.20" />
      <path d="M65 117 C60 155 68 195 58 260" stroke={t1.p} strokeWidth="0.8" opacity="0.20" />
      <path d="M135 94 C130 135 138 180 128 260" stroke={t2.p} strokeWidth="0.8" opacity="0.20" />
      <path d="M95 126 C90 160 98 205 88 260" stroke={t3.p} strokeWidth="0.8" opacity="0.18" />
      <path d="M56 258 C52 252 62 248 58 260" stroke={t1.s} strokeWidth="0.7" opacity="0.18" />
      <path d="M126 258 C122 252 132 248 128 260" stroke={t2.s} strokeWidth="0.7" opacity="0.18" />
    </svg>
  );
}

function SmallFlower({ className, tint = 0 }: { className?: string; tint?: number }) {
  const t = TINTS[tint % TINTS.length];
  return (
    <svg className={className} width="50" height="50" viewBox="0 0 50 50" fill="none" aria-hidden>
      <circle cx="25" cy="25" r="6" fill={t.p} opacity="0.18" />
      <circle cx="25" cy="25" r="3" fill={t.a} opacity="0.30" />
      <ellipse cx="25" cy="14" rx="4" ry="6" fill={t.s} opacity="0.16" />
      <ellipse cx="25" cy="36" rx="4" ry="6" fill={t.s} opacity="0.16" />
      <ellipse cx="14" cy="25" rx="6" ry="4" fill={t.p} opacity="0.14" />
      <ellipse cx="36" cy="25" rx="6" ry="4" fill={t.p} opacity="0.14" />
      <ellipse cx="17" cy="17" rx="4" ry="5" fill={t.a} opacity="0.12" transform="rotate(-45 17 17)" />
      <ellipse cx="33" cy="17" rx="4" ry="5" fill={t.a} opacity="0.12" transform="rotate(45 33 17)" />
      <ellipse cx="17" cy="33" rx="4" ry="5" fill={t.s} opacity="0.12" transform="rotate(45 17 33)" />
      <ellipse cx="33" cy="33" rx="4" ry="5" fill={t.s} opacity="0.12" transform="rotate(-45 33 33)" />
    </svg>
  );
}

function ConnectorDown() {
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none">
      <div className="w-[1.5px] h-28 bg-gradient-to-b from-gold/35 to-gold/10" />
      <SmallFlower className="w-10 h-10 -mt-3" tint={0} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   CyclingPhoto — with per-cell frame color
   ═══════════════════════════════════════════ */

function CyclingPhoto({
  list, interval = 2000, startDelay = 2000, active, stagger = 0, fit = "cover", onClickSrc,
}: {
  list: string[]; interval?: number; startDelay?: number; active: boolean; stagger?: number; fit?: "cover" | "contain";
  onClickSrc?: (src: string) => void;
}) {
  const hasPhotos = list.length > 0;
  const [topSrc, setTopSrc] = useState(list[0] ?? "");
  const [botSrc, setBotSrc] = useState(list.length > 1 ? list[1] : (list[0] ?? ""));
  const [showTop, setShowTop] = useState(true);
  const idxRef = useRef(0);
  const topRef = useRef(true);
  const visRef = useRef(list[0] ?? "");

  useEffect(() => {
    if (!hasPhotos || list.length <= 1 || !active) return;
    let cycle: ReturnType<typeof setInterval>;
    const delay = startDelay + Math.min(stagger, 400);
    const start = setTimeout(() => {
      cycle = setInterval(() => {
        idxRef.current = (idxRef.current + 1) % list.length;
        visRef.current = list[idxRef.current];
        const next = list[idxRef.current];
        if (topRef.current) {
          setBotSrc(next);
          requestAnimationFrame(() => { topRef.current = false; setShowTop(false); });
        } else {
          setTopSrc(next);
          requestAnimationFrame(() => { topRef.current = true; setShowTop(true); });
        }
      }, interval);
    }, delay);
    return () => { clearTimeout(start); clearInterval(cycle); };
  }, [hasPhotos, list, interval, startDelay, active, stagger]);

  if (!hasPhotos) {
    return <div className="w-full h-full bg-card rounded-[1px]" aria-hidden />;
  }

  return (
    <button type="button" onClick={() => onClickSrc?.(visRef.current)}
      className={`relative w-full h-full cursor-pointer block rounded-[1px] ${fit === "cover" ? "overflow-hidden" : "overflow-hidden bg-page"}`}>
      <Image src={botSrc} alt="" fill className={fit === "contain" ? "object-contain" : "object-cover"} sizes="(max-width:768px) 90vw, 30vw" />
      <Image src={topSrc} alt="" fill className={`${fit === "contain" ? "object-contain" : "object-cover"} xfade ${showTop ? "opacity-100" : "opacity-0"}`} sizes="(max-width:768px) 90vw, 30vw" />
    </button>
  );
}

/* ═══════════════════════════════════════════
   Partitioning & Collage
   ═══════════════════════════════════════════ */

function partition(photos: string[], n: number): string[][] {
  const g: string[][] = Array.from({ length: n }, () => []);
  photos.forEach((p, i) => g[i % n].push(p));
  return g;
}

type GP = { groups: string[][]; active: boolean; oc: (s: string) => void; fit?: "cover" | "contain" };

function Sl({ list, active, stagger, oc, fit = "cover" }: { list: string[]; active: boolean; stagger: number; oc: (s: string) => void; fit?: "cover" | "contain" }) {
  return (
    <div className="absolute inset-0 rounded-[2px]" style={{ background: "linear-gradient(145deg, #C4A44D, #A8842F, #D4B65E)", padding: "2px" }}>
      <div className="h-full rounded-[1px]" style={{ background: "#EDE8DD", padding: "3px" }}>
        <CyclingPhoto list={list} active={active} stagger={stagger} fit={fit} onClickSrc={oc} />
      </div>
    </div>
  );
}

function CA({ groups: g, active, oc, fit = "cover" }: GP) {
  return (
    <div className="flex flex-col h-full gap-[5px]">
      <div className="flex gap-[5px] flex-[5] min-h-0">
        <div className="relative flex-[2.2]"><Sl list={g[0]} active={active} stagger={0} oc={oc} fit={fit} /></div>
        <div className="flex flex-col gap-[5px] flex-1">
          <div className="relative flex-1"><Sl list={g[1]} active={active} stagger={900} oc={oc} fit={fit} /></div>
          <div className="relative flex-1"><Sl list={g[2]} active={active} stagger={1800} oc={oc} fit={fit} /></div>
        </div>
      </div>
      <div className="flex gap-[5px] flex-[3] min-h-0">
        <div className="relative flex-1"><Sl list={g[3]} active={active} stagger={2700} oc={oc} fit={fit} /></div>
        <div className="relative flex-[1.6]"><Sl list={g[4]} active={active} stagger={3600} oc={oc} fit={fit} /></div>
        <div className="relative flex-1"><Sl list={g[5]} active={active} stagger={4500} oc={oc} fit={fit} /></div>
      </div>
    </div>
  );
}

function CB({ groups: g, active, oc, fit = "cover" }: GP) {
  return (
    <div className="flex h-full gap-[5px]">
      <div className="flex flex-col gap-[5px] flex-[2.2] min-h-0">
        <div className="relative flex-[2.5]"><Sl list={g[0]} active={active} stagger={0} oc={oc} fit={fit} /></div>
        <div className="flex gap-[5px] flex-1">
          <div className="relative flex-1"><Sl list={g[1]} active={active} stagger={1200} oc={oc} fit={fit} /></div>
          <div className="relative flex-1"><Sl list={g[2]} active={active} stagger={2400} oc={oc} fit={fit} /></div>
        </div>
      </div>
      <div className="flex flex-col gap-[5px] flex-[1.5] min-h-0">
        <div className="relative flex-1"><Sl list={g[3]} active={active} stagger={800} oc={oc} fit={fit} /></div>
        <div className="relative flex-[1.6]"><Sl list={g[4]} active={active} stagger={2000} oc={oc} fit={fit} /></div>
        <div className="relative flex-1"><Sl list={g[5]} active={active} stagger={3200} oc={oc} fit={fit} /></div>
      </div>
    </div>
  );
}

function CC({ groups: g, active, oc, fit = "cover" }: GP) {
  return (
    <div className="flex flex-col h-full gap-[5px]">
      <div className="flex gap-[5px] flex-1 min-h-0">
        <div className="relative flex-[2.2]"><Sl list={g[0]} active={active} stagger={0} oc={oc} fit={fit} /></div>
        <div className="relative flex-1"><Sl list={g[1]} active={active} stagger={1500} oc={oc} fit={fit} /></div>
      </div>
      <div className="flex gap-[5px] flex-[1.4] min-h-0">
        <div className="relative flex-1"><Sl list={g[2]} active={active} stagger={600} oc={oc} fit={fit} /></div>
        <div className="relative flex-[2]"><Sl list={g[3]} active={active} stagger={2100} oc={oc} fit={fit} /></div>
      </div>
      <div className="flex gap-[5px] flex-1 min-h-0">
        <div className="relative flex-[1.6]"><Sl list={g[4]} active={active} stagger={1200} oc={oc} fit={fit} /></div>
        <div className="relative flex-1"><Sl list={g[5]} active={active} stagger={3000} oc={oc} fit={fit} /></div>
      </div>
    </div>
  );
}

const COMPS = [CA, CB, CC];

function Collage({ photos, active, onClickSrc, variant, fit = "cover" }: {
  photos: string[]; active: boolean; onClickSrc: (s: string) => void; variant: number; fit?: "cover" | "contain";
}) {
  const n = Math.min(6, photos.length);
  const groups = useMemo(() => partition(photos, n), [photos, n]);
  const padded = useMemo(() => {
    const p = [...groups];
    while (p.length < 6) p.push(groups[p.length % groups.length]);
    return p;
  }, [groups]);
  if (photos.length <= 2) {
    return (
      <div className="flex h-full gap-[5px]">
        {padded.slice(0, Math.max(1, photos.length)).map((g, i) => (
          <div key={i} className="relative flex-1"><Sl list={g} active={active} stagger={i*1000} oc={onClickSrc} fit={fit} /></div>
        ))}
      </div>
    );
  }
  const C = COMPS[variant % 3];
  return <C groups={padded} active={active} oc={onClickSrc} fit={fit} />;
}

/* ═══════════════════════════════════════════
   Lightbox
   ═══════════════════════════════════════════ */

function Lightbox({ photos, idx, onClose, onPrev, onNext }: {
  photos: string[]; idx: number; onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
  return (
    <div className="lb-bg fixed inset-0 z-[100] flex items-center justify-center bg-page/95 backdrop-blur-xl" onClick={onClose}>
      <button onClick={onClose} className="absolute top-5 right-5 z-10 w-10 h-10 flex items-center justify-center rounded-full border border-ink/8 hover:border-ink/20 transition-colors cursor-pointer">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-ink/40"><path d="M3 3l10 10M13 3L3 13" /></svg>
      </button>
      <span className="absolute top-6 left-6 text-ink-light text-xs tracking-widest">{idx+1}&thinsp;/&thinsp;{photos.length}</span>
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="absolute left-3 md:left-6 z-10 w-10 h-10 flex items-center justify-center rounded-full border border-ink/8 hover:border-ink/20 transition-colors cursor-pointer">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-ink/40"><path d="M10 3l-5 5 5 5" /></svg>
      </button>
      <div className="lb-img relative w-[92vw] h-[84vh] md:w-[78vw] md:h-[88vh]" onClick={(e) => e.stopPropagation()}>
        <Image key={photos[idx]} src={photos[idx]} alt="" fill className="object-contain" sizes="92vw" priority />
      </div>
      <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="absolute right-3 md:right-6 z-10 w-10 h-10 flex items-center justify-center rounded-full border border-ink/8 hover:border-ink/20 transition-colors cursor-pointer">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" className="text-ink/40"><path d="M6 3l5 5-5 5" /></svg>
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Fonts
   ═══════════════════════════════════════════ */

const D = "font-[family-name:var(--font-display)]";
const SC = "font-[family-name:var(--font-script)]";

/* ═══════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════ */

function Hero({ photos }: { photos: string[] }) {
  const heroImages = photos.slice(0, 2);

  return (
    <div className="h-full flex items-center justify-center relative bg-page overflow-hidden">
      <Balloons className="absolute -top-4 right-4 md:right-12 pointer-events-none" tint={0} />
      <Balloons className="absolute -top-8 left-6 md:left-16 pointer-events-none" tint={1} />
      <FloralBranch className="absolute -bottom-4 left-2 md:left-8 pointer-events-none" tint={0} />
      <FloralBranch className="absolute -bottom-4 right-2 md:right-8 pointer-events-none" flip tint={2} />
      <FloralCorner className="absolute top-4 left-4 pointer-events-none" tint={3} />
      <FloralCorner className="absolute bottom-4 right-4 pointer-events-none" rotate={180} tint={1} />
      <SmallFlower className="absolute top-20 right-1/4 w-12 h-12 pointer-events-none" tint={4} />
      <SmallFlower className="absolute bottom-28 left-1/4 w-10 h-10 pointer-events-none" tint={2} />

      <div className="stagger relative z-10 flex flex-col items-center text-center px-8 max-w-2xl">
        <div className="w-10 h-[1px] bg-gold/40 mb-8" />

        <h1 className={`${D} text-[2.75rem] sm:text-6xl md:text-7xl lg:text-[5.2rem] text-ink leading-[1.08] font-light tracking-[-0.01em] mb-6`}>{galleryCopy.hero.title}</h1>

        <div className="w-16 h-[1px] bg-gold mb-8" />

        <div className="mb-8 flex flex-col items-center justify-center gap-5 md:flex-row md:items-stretch md:gap-6">
          {heroImages.map((photo, index) => (
            <div key={photo} className="gold-frame w-[150px] sm:w-[180px] md:w-[210px] shrink-0">
              <div className="gold-frame-mat h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt={index === 0 ? galleryCopy.hero.babaLabel : galleryCopy.hero.mamaLabel}
                  className="block h-[190px] w-full object-cover sm:h-[230px] md:h-[270px]"
                />
              </div>
            </div>
          ))}
        </div>

        <p className={`${SC} text-3xl md:text-4xl text-gold mb-8`}>{galleryCopy.hero.message}</p>

        <p className="text-ink-light text-xs md:text-sm tracking-wide leading-relaxed max-w-sm font-light">
          {galleryCopy.hero.description}
        </p>

        <div className="bounce mt-12 flex flex-col items-center gap-1.5">
          <span className="text-ink-light/40 text-[9px] tracking-[0.35em] uppercase">{galleryCopy.hero.scrollLabel}</span>
          <svg width="12" height="18" viewBox="0 0 12 18" fill="none" stroke="currentColor" strokeWidth="1" className="text-ink-light/30"><path d="M6 3v12M2 11l4 4 4-4" /></svg>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   FEATURED
   ═══════════════════════════════════════════ */

function Featured({ photo, title, active, onClickSrc, featuredIdx }: {
  photo: string; title: string; active: boolean; onClickSrc: (s: string) => void; featuredIdx: number;
}) {
  const flipped = featuredIdx % 2 === 1;
  const accent = ACCENTS[featuredIdx % ACCENTS.length];
  const tintBase = featuredIdx % TINTS.length;

  const photoBlock = (
    <div className={`${flipped ? "txt-enter-r" : "txt-enter"} shrink-0 ${active ? "on" : ""}`}>
      <div className="gold-frame inline-block">
        <div className="gold-frame-mat">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo} alt={title} className="block max-h-[50vh] sm:max-h-[58vh] md:max-h-[65vh] w-auto cursor-pointer" onClick={() => onClickSrc(photo)} />
        </div>
      </div>
    </div>
  );

  const textBlock = (
    <div className={`${flipped ? "txt-enter" : "txt-enter-r"} flex-1 text-center md:text-left ${active ? "on" : ""}`}>
      <div className="w-8 h-[1px] mb-6 mx-auto md:mx-0" style={{ background: accent, opacity: 0.35 }} />
      <h3
        className={`${SC} text-balance text-[2.4rem] md:text-[3.2rem] lg:text-[4rem] leading-[1.06] max-w-[10ch] mx-auto md:mx-0`}
        style={{ color: accent }}
      >
        {title}
      </h3>
      <div className="w-10 h-[1px] mt-6 mx-auto md:mx-0" style={{ background: accent, opacity: 0.2 }} />
    </div>
  );

  return (
    <div className="h-full flex items-center justify-center px-6 md:px-12 bg-page relative overflow-hidden">
      <FloralCorner className="absolute top-4 right-4 pointer-events-none" tint={tintBase} />
      <FloralCorner className="absolute bottom-4 left-4 pointer-events-none" rotate={180} tint={(tintBase + 2) % 5} />
      {featuredIdx % 3 === 0 && <SmallFlower className="absolute bottom-16 right-20 w-12 h-12 pointer-events-none" tint={(tintBase + 1) % 5} />}
      {featuredIdx % 3 === 1 && <SmallFlower className="absolute top-20 left-16 w-10 h-10 pointer-events-none" tint={(tintBase + 3) % 5} />}
      {featuredIdx % 5 === 0 && <FloralBranch className="absolute top-0 right-16 pointer-events-none" tint={tintBase} />}

      <div className={`flex flex-col ${flipped ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-8 md:gap-14 max-w-5xl w-full relative z-10`}>
        {photoBlock}
        {textBlock}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   DIVIDER — "Highlighted Moments" etc.
   ═══════════════════════════════════════════ */

function Divider({ title, subtitle, active }: { title: string; subtitle?: string; active: boolean }) {
  return (
    <div className={`h-full flex items-center justify-center bg-page relative overflow-hidden ${active ? "ch-active" : ""}`}>
      <Balloons className="absolute -top-4 right-8 pointer-events-none" tint={1} />
      <FloralBranch className="absolute -bottom-6 left-6 pointer-events-none" tint={3} />
      <FloralCorner className="absolute top-6 left-6 pointer-events-none" tint={0} />
      <FloralCorner className="absolute bottom-6 right-6 pointer-events-none" rotate={180} tint={4} />
      <SmallFlower className="absolute top-1/4 right-1/4 w-12 h-12 pointer-events-none" tint={2} />
      <SmallFlower className="absolute bottom-1/4 left-1/4 w-10 h-10 pointer-events-none" tint={0} />

      <div className="flex flex-col items-center text-center px-8 gap-5 relative z-10">
        {subtitle && <span className="ch-label text-gold text-[10px] tracking-[0.4em] uppercase font-light">{subtitle}</span>}
        <div className="ch-line w-[100px] h-[1px] bg-gold/50 origin-center" />
        <h2 className={`ch-title ${SC} text-4xl md:text-6xl lg:text-7xl text-gold leading-tight`}>{title}</h2>
        <div className="ch-line w-[60px] h-[1px] bg-rose/30 origin-center" />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CONTENT
   ═══════════════════════════════════════════ */

function Content({ section, active, variant, onClickSrc, hasConnectionBelow, sectionIdx }: {
  section: Extract<GallerySection, { type: "content" }>;
  active: boolean; variant: number; onClickSrc: (s: string) => void;
  hasConnectionBelow?: boolean; sectionIdx: number;
}) {
  const accent = ACCENTS[sectionIdx % ACCENTS.length];
  const tintIdx = sectionIdx % TINTS.length;

  return (
    <div className="h-full flex flex-col md:flex-row bg-page relative overflow-hidden">
      {hasConnectionBelow && <ConnectorDown />}

      {/* Decorations — varied by section with different tints */}
      {sectionIdx % 3 === 0 && <FloralBranch className="absolute -bottom-6 right-4 pointer-events-none" tint={tintIdx} />}
      {sectionIdx % 3 === 1 && <FloralBranch className="absolute -top-6 left-4 pointer-events-none" flip tint={(tintIdx + 2) % 5} />}
      {sectionIdx % 3 === 2 && <FloralCorner className="absolute top-4 right-4 pointer-events-none" tint={(tintIdx + 1) % 5} />}
      {sectionIdx % 5 === 0 && <Balloons className="absolute -top-6 right-8 pointer-events-none" tint={tintIdx} />}
      {sectionIdx % 4 === 1 && <SmallFlower className="absolute bottom-12 left-8 w-12 h-12 pointer-events-none" tint={(tintIdx + 3) % 5} />}
      {sectionIdx % 4 === 3 && <SmallFlower className="absolute top-14 right-1/3 w-10 h-10 pointer-events-none" tint={(tintIdx + 1) % 5} />}
      {sectionIdx % 6 === 2 && <FloralCorner className="absolute bottom-4 left-4 pointer-events-none" rotate={180} tint={(tintIdx + 4) % 5} />}
      {sectionIdx % 7 === 5 && <Balloons className="absolute -bottom-8 left-12 pointer-events-none" tint={(tintIdx + 2) % 5} />}
      <SmallFlower className="absolute top-1/2 left-6 w-8 h-8 pointer-events-none" tint={tintIdx} />
      {sectionIdx % 2 === 0 && <SmallFlower className="absolute bottom-8 right-1/4 w-9 h-9 pointer-events-none" tint={(tintIdx + 3) % 5} />}

      {/* Mobile header — accent colored */}
      <div className={`txt-enter md:hidden shrink-0 px-5 pt-4 pb-2 relative z-10 ${active ? "on" : ""}`}>
        <span className="text-ink-light/30 text-[9px] tracking-[0.3em] uppercase block mb-1">{section.chapterName}</span>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-[1px]" style={{ background: accent }} />
          <span className="text-[9px] tracking-[0.25em] uppercase" style={{ color: accent }}>{section.subtitle}</span>
        </div>
        <h3 className={`${SC} text-balance text-[2.9rem] leading-[1.05] max-w-[10ch]`} style={{ color: accent }}>{section.title}</h3>
        <p className={`${D} mt-3 max-w-[28ch] text-[13px] leading-6 text-ink-light italic`}>
          {section.description}
        </p>
      </div>

      {/* Desktop text — accent colored */}
      <div className={`txt-enter hidden md:flex w-[33%] lg:w-[31%] xl:w-[29%] items-center px-10 lg:px-14 shrink-0 relative z-10 ${active ? "on" : ""}`}>
        <div className="max-w-[340px]">
          <span className="text-ink-light/25 text-[9px] tracking-[0.3em] uppercase block mb-4">{section.chapterName}</span>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-[1px]" style={{ background: accent }} />
            <span className="text-[11px] tracking-[0.22em] uppercase" style={{ color: accent }}>{section.subtitle}</span>
          </div>
          <h3 className={`${SC} text-balance text-[3.2rem] lg:text-[3.8rem] xl:text-[4.2rem] leading-[1.02] max-w-[10ch]`} style={{ color: accent }}>
            {section.title}
          </h3>
          <div className="w-12 h-[1px] mt-6 mb-6" style={{ background: accent, opacity: 0.2 }} />
          <p className={`${D} max-w-[30ch] text-[15px] leading-[2] font-light italic text-ink-light`}>
            {section.description}
          </p>
        </div>
      </div>

      {/* Collage */}
      <div className={`img-enter flex-1 min-h-0 p-2 md:p-3 relative z-10 ${active ? "on" : ""}`}>
        <Collage photos={section.photos} active={active} onClickSrc={onClickSrc} variant={variant} fit={section.photoFit} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   CLOSING
   ═══════════════════════════════════════════ */

function Closing({ photos, active, onClickSrc }: {
  photos: string[]; active: boolean; onClickSrc: (s: string) => void;
}) {
  return (
    <div className="h-full flex flex-col md:flex-row bg-page relative overflow-hidden">
      <Balloons className="absolute -top-4 left-6 pointer-events-none" tint={0} />
      <Balloons className="absolute -top-8 right-10 pointer-events-none" tint={3} />
      <FloralBranch className="absolute -bottom-4 right-6 pointer-events-none" flip tint={1} />
      <FloralBranch className="absolute -bottom-4 left-6 pointer-events-none" tint={4} />
      <FloralCorner className="absolute top-4 right-4 pointer-events-none" tint={2} />
      <FloralCorner className="absolute bottom-4 left-4 pointer-events-none" rotate={180} tint={0} />
      <SmallFlower className="absolute top-1/3 right-1/4 w-12 h-12 pointer-events-none" tint={1} />
      <SmallFlower className="absolute bottom-1/3 left-1/5 w-10 h-10 pointer-events-none" tint={3} />

      <div className={`txt-enter md:hidden shrink-0 px-5 pt-4 pb-2 relative z-10 ${active ? "on" : ""}`}>
        <span className="text-rose text-[9px] tracking-[0.25em] uppercase block mb-1">{galleryCopy.closing.eyebrow}</span>
        <h3 className={`${SC} text-4xl text-rose`}>{galleryCopy.closing.title}</h3>
      </div>
      <div className={`txt-enter hidden md:flex w-[33%] lg:w-[31%] items-center px-10 lg:px-14 shrink-0 relative z-10 ${active ? "on" : ""}`}>
        <div className="max-w-[340px]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-[1px] bg-rose" />
            <span className="text-rose text-[11px] tracking-[0.22em] uppercase">{galleryCopy.closing.eyebrow}</span>
          </div>
          <h3 className={`${SC} text-[3.2rem] lg:text-[4rem] text-rose leading-[1.12] mb-5`}>{galleryCopy.closing.title}</h3>
          <div className="w-12 h-[1px] bg-rose/20 mb-6" />
          <p className={`${D} text-ink-light text-[15px] leading-[2] font-light italic mb-7`}>
            {galleryCopy.closing.description}
          </p>
          <div className="w-8 h-[1px] bg-gold/25 mb-5" />
          <p className={`${D} text-base text-ink-light/50 italic font-light leading-relaxed whitespace-pre-line`}>
            {galleryCopy.closing.quote}
          </p>
          <p className="text-ink-light/25 text-[10px] tracking-wider mt-2">- {galleryCopy.closing.quoteAuthor}</p>
        </div>
      </div>
      <div className={`img-enter flex-1 min-h-0 p-2 md:p-3 relative z-10 ${active ? "on" : ""}`}>
        <Collage photos={photos} active={active} onClickSrc={onClickSrc} variant={1} />
      </div>
    </div>
  );
}

function FinalNote({
  active,
}: {
  active: boolean;
}) {
  return (
    <div className="h-full flex items-center justify-center bg-page relative overflow-hidden px-6 md:px-10">
      <FloralBranch className="absolute -bottom-12 left-10 pointer-events-none z-0" tint={0} />
      <FloralBranch className="absolute -bottom-12 right-10 pointer-events-none z-0" flip tint={1} />
      <FloralCorner className="absolute top-10 left-10 pointer-events-none z-0" tint={4} />
      <FloralCorner className="absolute top-12 right-10 pointer-events-none z-0" tint={2} />
      <Balloons className="absolute left-8 top-18 pointer-events-none z-0 opacity-80" tint={0} />
      <Balloons className="absolute right-8 top-10 pointer-events-none z-0 opacity-70" tint={3} />
      <SmallFlower className="absolute bottom-20 left-1/5 w-12 h-12 pointer-events-none z-0" tint={3} />
      <SmallFlower className="absolute bottom-24 right-1/5 w-12 h-12 pointer-events-none z-0" tint={0} />

      <div className={`txt-enter relative z-10 w-full max-w-6xl ${active ? "on" : ""}`}>
        <div className="grid items-center gap-8 md:grid-cols-[1.05fr_0.95fr]">
          <div className="relative mx-auto">
            <div className="absolute -inset-8 rounded-[40px] bg-[radial-gradient(circle,rgba(184,150,62,0.14),rgba(184,150,62,0))]" />
            <div className="relative gold-frame inline-block">
              <div className="gold-frame-mat">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={galleryCopy.finalNote.imageSrc}
                  alt={galleryCopy.finalNote.imageAlt}
                  className="block h-[340px] w-[260px] object-cover sm:h-[420px] sm:w-[320px] md:h-[500px] md:w-[380px]"
                />
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-gold/18 bg-[linear-gradient(135deg,rgba(255,255,255,0.78),rgba(237,232,221,0.92))] p-6 shadow-[0_20px_60px_rgba(28,24,18,0.10)] backdrop-blur-sm md:p-8">
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="h-[1px] w-10 bg-gold/45" />
              <span className="text-[10px] tracking-[0.28em] uppercase text-gold">{galleryCopy.finalNote.eyebrow}</span>
            </div>
            <h3 className={`${SC} mb-5 text-center text-4xl text-rose md:text-5xl`}>{galleryCopy.finalNote.title}</h3>
            <p className={`${D} text-center text-[15px] leading-8 text-ink-light italic md:text-base`}>
              {galleryCopy.finalNote.description}
            </p>
            <div className="mt-6 mx-auto h-[1px] w-14 bg-gold/25" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN GALLERY
   ═══════════════════════════════════════════ */

export default function FamilyGallery({ sections }: { sections: GallerySection[] }) {
  const [active, setActive] = useState(0);
  const [lb, setLb] = useState<{ photos: string[]; idx: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { const i = Number((e.target as HTMLElement).dataset.i); if (!isNaN(i)) setActive(i); }
    }, { root: el, threshold: 0.6 });
    el.querySelectorAll("[data-i]").forEach((n) => obs.observe(n));
    return () => obs.disconnect();
  }, [sections]);

  const go = useCallback((i: number) => { ref.current?.querySelector(`[data-i="${i}"]`)?.scrollIntoView({ behavior: "smooth" }); }, []);

  useEffect(() => {
    if (lb) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") { e.preventDefault(); go(Math.min(active+1, sections.length-1)); }
      if (e.key === "ArrowUp" || e.key === "PageUp") { e.preventDefault(); go(Math.max(active-1, 0)); }
    };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [active, sections.length, lb, go]);

  const openSrc = useCallback((all: string[], src: string) => { const idx = all.indexOf(src); setLb({ photos: all, idx: idx >= 0 ? idx : 0 }); }, []);
  const closeLb = useCallback(() => setLb(null), []);
  const nextLb = useCallback(() => setLb((p) => p ? { ...p, idx: (p.idx+1) % p.photos.length } : null), []);
  const prevLb = useCallback(() => setLb((p) => p ? { ...p, idx: (p.idx-1+p.photos.length) % p.photos.length } : null), []);

  useEffect(() => {
    if (!lb) return;
    const h = (e: KeyboardEvent) => { if (e.key==="Escape") closeLb(); if (e.key==="ArrowRight") nextLb(); if (e.key==="ArrowLeft") prevLb(); };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, [lb, closeLb, nextLb, prevLb]);

  let ci = 0;
  let fi = 0;
  function panel(s: GallerySection, i: number): ReactNode {
    const on = i === active;
    const next = sections[i+1];
    switch (s.type) {
      case "hero": return <Hero photos={s.photos} />;
      case "divider": return <Divider title={s.title} subtitle={s.subtitle} active={on} />;
      case "featured": { const idx = fi++; return <Featured photo={s.photo} title={s.title} active={on} onClickSrc={(src) => openSrc([s.photo], src)} featuredIdx={idx} />; }
      case "content": { const v = ci++; return <Content section={s} active={on} variant={v} onClickSrc={(src) => openSrc(s.photos, src)} hasConnectionBelow={next?.type === "featured"} sectionIdx={i} />; }
      case "closing": return <Closing photos={s.photos} active={on} onClickSrc={(src) => openSrc(s.photos, src)} />;
      case "finalNote": return <FinalNote active={on} />;
    }
  }
  ci = 0;
  fi = 0;

  return (
    <div className="noise">
      <div ref={ref} className="snap-scroll">
        {sections.map((s, i) => (<div key={i} data-i={i} className="snap-panel">{panel(s, i)}</div>))}
      </div>
      <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => go(0)}
          className="rounded-full border border-ink/10 bg-page/85 px-3 py-2 text-[11px] tracking-wide text-ink-light hover:border-ink/25 transition-colors cursor-pointer"
        >
          Top
        </button>
        <button
          type="button"
          onClick={() => go(sections.length - 1)}
          className="rounded-full border border-ink/10 bg-page/85 px-3 py-2 text-[11px] tracking-wide text-ink-light hover:border-ink/25 transition-colors cursor-pointer"
        >
          Bottom
        </button>
      </div>
      {lb && <Lightbox photos={lb.photos} idx={lb.idx} onClose={closeLb} onPrev={prevLb} onNext={nextLb} />}
    </div>
  );
}
