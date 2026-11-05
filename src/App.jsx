import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronRight,
  Loader2,
  Mail,
  MapPin,
  Menu,
  Send,
  X,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Configuration                                                      */
/* ------------------------------------------------------------------ */

const SITE_DOMAIN = 'scrimmy.xyz';
const CONTACT_EMAIL = 'scrimmageproductions@gmail.com';
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
// Web3Forms routes submissions to the inbox that owns the access key (scrimmageproductions@gmail.com).
// This key is public by design: it can only send to that inbox.
const WEB3FORMS_ACCESS_KEY = '50f8f02c-b73b-48fc-b143-c16c183fb208';

const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'ecosystems', label: 'Ecosystems' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
];

const ALIASES = ['Young Scrimmage', 'Don Scrimmy Jon'];
const HOME_BASE = 'Quad Cities, USA';

const EXECUTION_MATRIX = [
  {
    label: '01 // Live Ops',
    title: 'Global Production',
    body: 'Multi-timezone run-of-show, venue logistics & sponsor comms.',
  },
  {
    label: '02 // Ecosystems',
    title: 'Strategic Scale',
    body: 'Ecosystem growth, civic mobilization & community flywheels.',
  },
  {
    label: '03 // Digital',
    title: 'Modern Web & AI',
    body: 'High-velocity React builds, lead pipelines & zero template bloat.',
  },
];

const ECOSYSTEMS = [
  {
    logo: '/pizzadao.png',
    // Black-on-transparent mark: flatten to white so it reads on the dark badge.
    logoClass: 'brightness-0 invert',
    org: 'PizzaDAO',
    role: 'Director of Operations',
    body: 'Started as a note-taker and climbed the ranks to lead operations for the largest global pizza party in existence. Spearheaded multi-timezone logistics, international communications, and cross-border marketing to coordinate simultaneous celebrations across 400+ cities and 100+ countries—onboarding the world by decentralizing joy.',
    points: [
      '400+ cities & 100+ countries coordinated',
      'Global run-of-show, comms & marketing lead',
      'International venue & indie pizzeria logistics',
    ],
  },
  {
    logo: '/team1.png',
    org: 'Avax Team1 USA',
    role: 'Collaborator',
    body: 'Active collaborator pushing the Avalanche ecosystem forward. Fresh to the team, yet already architecting and executing high-impact, scaled cross-community partnerships that expand builder mindshare and drive strategic value across Avax Team1.',
    points: [
      'High-impact ecosystem collaborations',
      'Avalanche community & network expansion',
      'Builder activation & strategic partnerships',
    ],
  },
  {
    logo: '/standwithcrypto.png',
    org: 'Stand With Crypto',
    role: 'Iowa Chapter President',
    body: 'Grassroots community mobilization across Iowa, voter education, and advocacy for clearer digital asset policy.',
    points: ['Grassroots mobilization', 'Voter education', 'Digital asset policy advocacy'],
  },
];

const SERVICES = [
  {
    n: '01',
    tag: 'PROD',
    title: 'Event Production & Logistics',
    body: 'Full-scale live and decentralized event management. I coordinate multi-city runs-of-show, secure local venue and vendor contracts, direct sponsor activations, and handle crypto-native ticketing across time zones.',
    tags: ['RUN-OF-SHOW', '400+ CITIES', 'SPONSORS', 'VENDORS'],
  },
  {
    n: '02',
    tag: 'ADVISORY',
    title: 'Operations & Marketing Consulting',
    body: "Fixing what's broken in your business. I audit internal toolchains, clear operational bottlenecks, structure ecosystem partnerships, and wire up automated lead-routing pipelines so work stops slipping through the cracks.",
    tags: ['WORKFLOW AUDITS', 'PARTNERSHIPS', 'LEAD ROUTING', 'PIPELINES'],
  },
  {
    n: '03',
    tag: 'DEV & DESIGN',
    title: 'Custom Web & Creative Solutions',
    body: 'Bespoke digital architecture, clean interfaces, and custom creative solutions for your business or idea. This entire site is proof of work\u2014hand-coded performance, tailored styling, and zero generic template drag. If you can envision it, we can build it together.',
    tags: ['BESPOKE DESIGN', 'REACT 19', 'CUSTOM STACK', 'PROOF OF WORK'],
  },
];

const SERVICE_OPTIONS = ['Event Planning', 'Marketing / Consulting', 'Website Development', 'General Inquiry'];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

const buildMailto = (subject, body) =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

async function submitToWeb3Forms(payload) {
  const res = await fetch(WEB3FORMS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ access_key: WEB3FORMS_ACCESS_KEY, ...payload }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) throw new Error(data.message || 'Submission failed');
  return data;
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

/* ------------------------------------------------------------------ */
/*  Digital block title                                                */
/* ------------------------------------------------------------------ */

// 5x7 block font for the letters in SCRIMMY.
const GLYPHS = {
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
};

const TITLE = 'SCRIMMY';
const CELL = 10;
const GAP_COLS = 1;
const TITLE_COLS = TITLE.length * (5 + GAP_COLS) - GAP_COLS;

// Hero scroll timeline, as a share of the pinned hero's scroll distance (0-1):
//   0 → TEXT_FADE_END    eyebrow, pills, intro and buttons fade out (capped at 180px of scroll)
//   BLOCK_START → ~0.84  SCRIMMY blocks detach and drop
//   STAGE_FADE_*         whatever is left fades out, then the hero stops taking clicks
//   GLOBE_*              a dot globe fades in behind the title, turns once, then bursts out
// The About section slides up over the hero during the final stretch, so there is no empty screen.
const TEXT_FADE_PX = 180;
const TEXT_FADE_END = 0.18;
const BLOCK_START = 0.2;
const BLOCK_SPREAD = 0.35;
const STAGE_FADE_START = 0.62;
const STAGE_FADE_END = 0.86;
// The globe fades in as the title starts to drop, turns once, and bursts out as About takes over.
const GLOBE_IN_START = 0.12;
const GLOBE_IN_END = 0.32;
const GLOBE_OUT_START = 0.66;
const GLOBE_OUT_END = 0.9;

// Each lit block gets a fixed start point (--t) and drop distance (--d), so the title
// detaches unevenly: pixels let go at different moments and slide down at different rates.
const TITLE_BLOCKS = TITLE.split('').flatMap((ch, li) =>
  GLYPHS[ch].flatMap((row, y) =>
    row.split('').map((on, x) => {
      const col = li * (5 + GAP_COLS) + x;
      const seed = (col * 7 + y * 13 + li * 5) % 17;
      return {
        key: `${li}-${x}-${y}`,
        x: col * CELL,
        y: y * CELL,
        on: on === '1',
        t: (BLOCK_START + (seed / 17) * BLOCK_SPREAD).toFixed(3),
        d: 40 + ((col * 11 + y * 3) % 9) * 14,
      };
    }),
  ),
);

function DigitalTitle() {
  return (
    <svg viewBox={`0 0 ${TITLE_COLS * CELL} ${7 * CELL}`} className="h-auto w-full overflow-visible" role="img" aria-label="SCRIMMY">
      {TITLE_BLOCKS.map((b) =>
        b.on ? (
          <rect
            key={b.key}
            x={b.x + 0.75}
            y={b.y + 0.75}
            width={CELL - 1.5}
            height={CELL - 1.5}
            rx={1}
            fill="#ffffff"
            className="sp-block"
            style={{ '--t': b.t, '--d': b.d }}
          />
        ) : (
          <rect key={b.key} x={b.x + 4} y={b.y + 4} width={2} height={2} fill="#1d4ed8" opacity={0.35} />
        ),
      )}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Pixel portrait                                                     */
/* ------------------------------------------------------------------ */

// 80x80 brightness map (0-9) sampled from a black-and-white photo of Scrimmy.
const PORTRAIT_SIZE = 80;
const PORTRAIT = [
  '00000000000011111100001000000010011111111111011111111000000010000000000000000000',
  '00000000000111101100000000000000011111111111001111111000000010000000000000000000',
  '00000000000010000100000000000010011111011111001111111000000000000000000000000000',
  '00000000010010011010000000000000011111111111001111111000000000000000000000000000',
  '00000000000000011110001100000000111111111111001111111000000000000000000000000000',
  '00000000000000001110001100000000111110101100001111111000000000000000000000000000',
  '00000000000000001111001100000001210111011012110101111000000000000000000000000000',
  '00000000000000011111001100001013434423224223432110011000000000000000000000000000',
  '00000000000000001110001010001112224222433322333221100000000000000000000000000000',
  '00000000000000001110001110000111011122343234312323221000000000000000000000000000',
  '00000000000000101110001111110036432245455433321111121100000000000000000000000000',
  '00000000000000001110001001101599998889998753222111011110000000000000000000000000',
  '00000000000000001110000001027999999999999984313121000121100000000000000000000000',
  '00000000000000011110000110389999999999999996424312100100100000000000000000000000',
  '00000000000000011110001103999999999999999997766333311000001000000000000000000000',
  '00000000000000010100001018999999999999999997987555410000000000000000000000000000',
  '00000000000000000000000179999999999999999987677764321100000000000000000000000000',
  '00000000000000000000001699989999999999999975355433211000000000000000000000000000',
  '00000000000000000000018999999999999999999864453322211000000000000000000000000000',
  '00000000000000000001179899999999999999987754442221210000000000000000000000000000',
  '00000000000000001110178999999989888888777654332221110000000000000000000000000000',
  '00000000000000001101048789999988887777666554332221110000000000000000000000000000',
  '00000000000000000000025323699988877776666654443212210000000000000000000000000000',
  '00000000000000000000133200267998777776655554443222110000000000000000000000000000',
  '00000000000000000000113101246898777676554444333322110000000000000000000000000000',
  '00000000000000000001001001445678876667654333332322110000000000000000000000000000',
  '00000000000000000000162013223456776666654333333322110000000000000000000000000000',
  '00000000000000000001895113100011355667754443333322111000000000000000000000000000',
  '00000000000000000028985332002101011123554444343222221110000000000000000000000000',
  '00000000000000000189997653111222333211000121223322221111110000000000000000000000',
  '00000000000000001799887775134543233333321000000132121122110000000000000000000000',
  '00000000000000004999986465354555555655654332125578312111110000000000000000000000',
  '00000000000000002479986435776667677666654332477114721100000000000000000000000000',
  '00000000000000000026875655567777777766654322453034531000000000000000000000000000',
  '00000000000000000000344566555667777665554324541387510100000000000000000000000000',
  '00000000000000001000115556666666666555444457961058600100000000000000000000000000',
  '00000000000000000000377545555555555445444578941448410000000000000000000000000000',
  '00000000000000000000168644444434445554555577412686210000000000000000000000000000',
  '00000000000000000000037643232333455555555555268774100000000000000000000000000000',
  '00000000000000000000114553212234445555554435998651000000000000000000000000000000',
  '00000000000000000000001243111233444455543332677410000000000000000000000000000000',
  '00000000000000000140000023212233334455543321111000000000000000000000000000000000',
  '00000000000000000264310013332222334444443211000011000000000000000000000000000000',
  '00000000000000000142321124443222333444432111000111000000000000000000000000000000',
  '00000000000000000011012234433222233333332111001111000100000000000000000000000000',
  '00000000000000000000012333332222222222221111011111001200000000000000000000000000',
  '00000000000000000002122222332222221111111111111111111310000000000000000000000000',
  '00000000000000000026664333333221111111111111111122211120110000000000000000000000',
  '00000000000000000036666654443321100000000011111223321130000000000000000000000000',
  '00000011222222222223445554332211000000000001112233441130000000000000000000000000',
  '00013333322222111100122222111000000000000011222334442330000000000000000000000000',
  '00001000000000000000000000000000000000000111222334432420000000000000000000000000',
  '00000000111111100000000000000000000000000112223334424420000000000000000000000000',
  '00001111111110000000000000000000000000000112222334334320000000000000000000000000',
  '00001111111000000000000000000000000000000122222343343230000000000100000000000000',
  '00010111110000000000000000000000000000001222222333322240000000000111100000000000',
  '00000011100000000000000000000000000000112222222223222430000000000111111000000000',
  '00000000000000000000000000000000000011122222222232121610000000000011111110000000',
  '00000000000000000000000000000000000011122222223421112700000000000001111111100000',
  '00000000000000000000000000000000000011122222233211114400000000000000111111111100',
  '00000000000000000000000000001000001001112222332121114000000000000000011111111111',
  '00000000000000000000000000003000001111111224432222114000000000000000001111111111',
  '00000000000000000000000000015100012320111354333221144000000000000000000111111111',
  '00000000000000000000000000028300123100010254332112171000000000000000000011111111',
  '00000000000000000000000000029610121000020034321122480000000000000000000001001111',
  '00000000000000000000000000029941220000000003322232870000000000000000000000000011',
  '00000000000000000000000000029982210000000000323325950000000000000000000000000000',
  '00000000000000000000000000019994200000010000133349940000000000000000000000000000',
  '00000000000000000000000000008996100000000000023269920000000000000000000000000000',
  '00000000000000000000000000007996132100000000003499920000000000000000000000000000',
  '00000000000000000000000000005997011200000000001599810000000000000000000000000000',
  '00000000000000000000000000004998121100000021110698700000000000000000000000000000',
  '00000000000000000000000000003998122000000011100887500000000000000000000000000000',
  '00000000000000000000000000012899222200000000002977400000000000000000000000000000',
  '00000000000000000000000000012899313200000000013978400000000000000000000000000000',
  '00000000000000000000000000011799402100000001124999200000000000000000000000000000',
  '00000000000000000000000001011599502100000002324998100000000000000000000000000000',
  '00000000000000000000000002111499602100000001325997000000000000000000000000000000',
  '00000000000000000000000003121399701000000001325996000000000000000000000000000000',
  '00000000000000000000000003221289701000000001414994000100000000000000000000000000',
].join('');

const portraitColor = (level) => (level >= 8 ? '#ffffff' : level >= 6 ? '#93c5fd' : level >= 3 ? '#3b82f6' : '#1e40af');

function PixelPortrait() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const draw = () => {
      const size = canvas.clientWidth;
      if (!size) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      const cell = size / PORTRAIT_SIZE;
      for (let i = 0; i < PORTRAIT.length; i += 1) {
        const level = PORTRAIT.charCodeAt(i) - 48;
        if (level < 2) continue; // keep the background pure black
        const r = cell * (0.1 + level * 0.042);
        ctx.fillStyle = portraitColor(level);
        ctx.beginPath();
        ctx.arc((i % PORTRAIT_SIZE) * cell + cell / 2, Math.floor(i / PORTRAIT_SIZE) * cell + cell / 2, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    draw();
    const ro = new ResizeObserver(draw);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  return (
    <figure className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Pixel portrait of Scrimmy built from blue and white dots"
        className="h-full w-full [mask-image:radial-gradient(ellipse_at_45%_45%,black_55%,transparent_85%)]"
      />
      {/* Scanlines and a faint blue grid, so the portrait reads as rendered on a display */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.35)_0px,rgba(0,0,0,0.35)_1px,transparent_1px,transparent_3px)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.08)_1px,transparent_1px)] [background-size:32px_32px]"
      />
      <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-white/10 bg-black/70 px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-slate-400 backdrop-blur">
        <span>IMG // scrimmy.raw</span>
        <span className="text-blue-400">
          {PORTRAIT_SIZE}×{PORTRAIT_SIZE}
        </span>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/*  Scroll reveal                                                      */
/* ------------------------------------------------------------------ */

const REVEAL_OBSERVER_OPTIONS = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };

const revealStartsVisible = () =>
  typeof window === 'undefined' || !('IntersectionObserver' in window) || prefersReducedMotion();

function Reveal({ as: Element = 'div', delay = 0, className = '', style, children, ...rest }) {
  const ref = useRef(null);
  const [instant] = useState(revealStartsVisible);
  const [shown, setShown] = useState(instant);

  useEffect(() => {
    if (shown) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    // Reveal once, then stop observing so it never re-hides on scroll-up.
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShown(true);
        io.disconnect();
      }
    }, REVEAL_OBSERVER_OPTIONS);
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  const motion = instant
    ? 'opacity-100 translate-y-0'
    : `transition-all duration-700 ease-out ${shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`;

  return (
    <Element
      ref={ref}
      className={`${motion} ${className}`}
      style={!instant && delay ? { ...style, transitionDelay: `${delay}ms` } : style}
      {...rest}>
      {children}
    </Element>
  );
}

/* ------------------------------------------------------------------ */
/*  System components                                                  */
/* ------------------------------------------------------------------ */

// Small monospace label used for eyebrows, metadata and status pills.
function Mono({ children, className = '' }) {
  return <span className={`font-mono text-xs uppercase tracking-[0.18em] ${className}`}>{children}</span>;
}

// Hairline ruler with tick marks and corner crosshairs. A faint blue beam sweeps across it once,
// the first time it scrolls into view.
function BlueprintRule() {
  const ref = useRef(null);
  const [sweep, setSweep] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setSweep(true);
        io.disconnect();
      }
    }, REVEAL_OBSERVER_OPTIONS);
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none relative h-2 border-t border-zinc-800/80">
      {/* minor ticks every 24px, major ticks every 120px */}
      <div className="absolute inset-x-0 top-0 h-1 bg-[repeating-linear-gradient(90deg,rgba(63,63,70,0.8)_0_1px,transparent_1px_24px)]" />
      <div className="absolute inset-x-0 top-0 h-2 bg-[repeating-linear-gradient(90deg,rgba(63,63,70,0.9)_0_1px,transparent_1px_120px)]" />
      <span className="absolute -left-1.5 -top-[11px] font-mono text-sm leading-none text-blue-500/50">+</span>
      <span className="absolute -right-1.5 -top-[11px] font-mono text-sm leading-none text-blue-500/50">+</span>
      <div className="absolute inset-x-0 -top-px h-px overflow-hidden">
        <div className={`h-px w-1/3 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent ${sweep ? 'sp-beam' : 'opacity-0'}`} />
      </div>
    </div>
  );
}

function SectionHeader({ title, sub, blueprint = false, cursor = false, telemetry }) {
  return (
    <Reveal className={`mb-14 ${blueprint ? '' : 'border-t border-white/10 pt-10'}`}>
      {blueprint && <BlueprintRule />}
      <h2
        className={`max-w-3xl text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl ${blueprint ? 'pt-9' : ''}`}>
        {title}
        {cursor && (
          <span
            aria-hidden="true"
            className="ml-1 inline-block h-7 w-2.5 animate-pulse bg-blue-500 align-middle motion-reduce:animate-none"
          />
        )}
      </h2>
      {sub && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-400">{sub}</p>}
      {telemetry && <p className="mt-4 font-mono text-[11px] tracking-wide text-zinc-500">{telemetry}</p>}
    </Reveal>
  );
}

function Card({ className = '', children, ...rest }) {
  return (
    <div className={`rounded-2xl border border-white/5 bg-[#0a0f1d] ${className}`} {...rest}>
      {children}
    </div>
  );
}

// Shared card shell for Ecosystems and Services: square hairline border, corner brackets,
// and a blue border with a faint glow on hover.
const CORNERS = [
  'left-0 top-0 border-l border-t',
  'right-0 top-0 border-r border-t',
  'bottom-0 left-0 border-b border-l',
  'bottom-0 right-0 border-b border-r',
];

function FrameCard({ children }) {
  return (
    <article className="group relative flex h-full flex-col border border-zinc-800 bg-[#09090b] p-7 transition duration-300 hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(37,99,235,0.08)] sm:p-8">
      {CORNERS.map((c) => (
        <span
          key={c}
          aria-hidden="true"
          className={`pointer-events-none absolute h-3 w-3 border-zinc-600 transition-colors duration-300 group-hover:border-blue-400 ${c}`}
        />
      ))}
      {children}
    </article>
  );
}

function Chip({ children }) {
  return (
    <span className="rounded-sm border border-zinc-800 bg-zinc-900 px-2.5 py-1 font-mono text-[11px] text-zinc-400">
      {children}
    </span>
  );
}

const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black';
const PRESS = `transition duration-200 active:scale-[0.98] ${FOCUS}`;

function PrimaryButton({ children, className = '', ...rest }) {
  return (
    <button
      className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-[15px] font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${PRESS} ${className}`}
      {...rest}>
      {children}
    </button>
  );
}

function SecondaryButton({ children, className = '', ...rest }) {
  return (
    <button
      className={`inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border border-white/15 px-5 py-2.5 text-[15px] font-semibold text-white hover:border-white/30 hover:bg-white/5 ${PRESS} ${className}`}
      {...rest}>
      {children}
    </button>
  );
}

const INPUT_CLS = `w-full min-h-[44px] rounded-xl border border-white/10 bg-[#09090b] px-4 py-3 text-[15px] text-white placeholder:text-slate-500 outline-none transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40`;

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */

function NavBar({ active }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const go = (id) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/70 backdrop-blur-xl">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Primary">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`rounded font-mono text-[15px] font-semibold tracking-tight text-white ${FOCUS}`}
            aria-label={`${SITE_DOMAIN}, back to top`}>
            scrimmy<span className="text-blue-500">.xyz</span>
          </button>

          <ul className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(l.id);
                  }}
                  aria-current={active === l.id ? 'true' : undefined}
                  className={`rounded text-sm font-medium transition-colors duration-200 ${FOCUS} ${
                    active === l.id ? 'text-white' : 'text-slate-400 hover:text-white'
                  }`}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block">
              <PrimaryButton onClick={() => go('contact')} className="min-h-0 px-4 py-1.5 text-sm">
                Get in Touch
              </PrimaryButton>
            </span>
            <button
              onClick={() => setOpen(true)}
              className={`grid h-11 w-11 place-items-center rounded-full text-slate-300 hover:bg-white/5 md:hidden ${PRESS}`}
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer: kept outside the header, whose backdrop-filter would otherwise trap position:fixed */}
      <div
        className={`fixed inset-0 z-[60] md:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!open}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        />
        <aside
          id="mobile-menu"
          className={`absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col border-l border-white/5 bg-[#0a0f1d] p-6 transition-transform duration-300 ease-out ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}>
          <div className="mb-6 flex items-center justify-between">
            <Mono className="text-blue-400">Menu</Mono>
            <button
              onClick={() => setOpen(false)}
              className={`grid h-11 w-11 place-items-center rounded-full bg-white/5 text-slate-300 hover:bg-white/10 ${PRESS}`}
              aria-label="Close menu"
              tabIndex={open ? 0 : -1}>
              <X className="h-4 w-4" />
            </button>
          </div>
          <ul className="divide-y divide-white/5">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(l.id);
                  }}
                  tabIndex={open ? 0 : -1}
                  className={`flex min-h-[44px] w-full items-center justify-between py-4 text-lg font-semibold text-white transition-colors duration-200 hover:text-blue-400 ${FOCUS}`}>
                  {l.label}
                  <ChevronRight className="h-5 w-5 text-slate-600" />
                </a>
              </li>
            ))}
          </ul>
          <PrimaryButton onClick={() => go('contact')} className="mt-auto w-full py-3" tabIndex={open ? 0 : -1}>
            Get in Touch
          </PrimaryButton>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            tabIndex={open ? 0 : -1}
            className="mt-4 text-center text-sm text-slate-400 transition-colors duration-200 hover:text-white">
            {CONTACT_EMAIL}
          </a>
        </aside>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Dot-matrix globe (hero to About transition)                        */
/* ------------------------------------------------------------------ */

// Land mask sampled every 3 degrees from Natural Earth 1:110m land (via world-atlas), south to north.
// Each row spans 360 degrees of longitude with as many cells as fit at that latitude, so dots are evenly spaced.
const GLOBE_STEP = 3;
const GLOBE_ROWS = [
  '111',
  '111111111',
  '0111101111111110',
  '0011110001111111111110',
  '0001111110001111111111111110',
  '0000010111100001111111111111111110',
  '0000000000001000000001011111111111111100',
  '0000000000000010000000000000011001111111110000',
  '0000000000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000000000000000000000',
  '00000000000000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000001000000000000000000000000000000000000000000000000000',
  '000000000000000000000001000000000000000000000000000000000000000000000000000000',
  '00000000000000000000000011000000000000000000000000000000000000000000000000000000100',
  '000000000000000000000000001100000000000000000000000000000000000000000000000000000000000',
  '0000000000000000000000000001110000000000000000000000000000000000000000000000000000000000000',
  '00000000000000000000000000001111000000000000000000000000000000000000000000000000000011100000000',
  '000000000000000000000000000000111010000000000000000000000000000000000000000000000100000011100000000',
  '000000000000000000000000000000011111000000000000000000001110000000000000000000000000111111111100000000',
  '000000000000000000000000000000001111110000000000000000000111110000000000000000000000001111111111100000000',
  '000000000000000000000000000000000111111100000000000000000011111100000000000000000000000011111111111100000000',
  '000000000000000000000000000000000011111111100000000000000000111111000100000000000000000000011111111111000000000',
  '00000000000000000000000000000000001111111111000000000000000001111111001100000000000000000000000111111110000000000',
  '0000000000000000000000000000000000111111111110000000000000000111111111001000000000000000000000000111110100000000000',
  '000000000000000000000000000000000011111111111100000000000000000111111111001000000000000000000000000001100000000000000',
  '0000000000000000000000000000000001111111111111100000000000000001111111110000000000000000000000000000000000000000000000',
  '00000000000000000000000000000000011111111111111100000000000000001111111100000000000000000000000110000000011100000000000',
  '000000000000000000000000000000000111111111111110000000000000000011111111100000000000000000000010000000000111000000000000',
  '000000000000000000000000000000000111111111111000000000000000000111111111110000000000000000000010011010001000000000000000',
  '000000000000000000000000000000000011111111100000000000000000000111111111111000000000000000000110111000000000000000000000',
  '000000000000000000000000000000000011111111100000000000000100001111111111111100000000000000001000001100000000000000000000',
  '00000000000000000000000000000000001111110000000000000001111111111111111111110000000000100000100000000000000000000000000',
  '0000000000000000000000000000000100111010000000000000001111111111111111111011000000001000000101000001000000000000000000',
  '000000000000000000000000000001100000000000000000000001111111111111111111010000000001100000111100001000000000000000000',
  '0000000000000000000000000011100000000000000000000000111111111111111111011100000001110000011100001000000000000000000',
  '00000000000000000000000111001000001000000000000000011111111111111111011111100001111000111100000000000000000000000',
  '000000000000000000000001100000100000000000000000001111111111111111101111110001111110111111100000000000000000000',
  '000000000000000000001111100000000000000000000000001111111111111101111000111111111111111111000000000000000000',
  '000000000000000000001111000010000000000000000000011111111111111111111111111111111111111100000000000000000',
  '000000000000000000011111111100000000000000000000111111100110011111111111111111111111110000000000000000',
  '000000000000000011111111111100000000000000000000111100000001111111111111111111111100100000000000000',
  '00000000000000011111111111110000000000000000011000010101111110111111111111111111010010000000000',
  '0000000000000011111111111110000000000000000111000111011111011111111111111111110000000000000',
  '000000000000011111111111111000000000000001011011110001101111111111111111111100100000000',
  '00000000000001111111111111110000000000000111111111111011111111111111111110100000000',
  '000000000000111111111111001000000000000111111111111111111111111111111000000000',
  '0000000000111111111101111000000000001111111111111111111111111111110010000',
  '00010000011111111101111000000000010010111111111111111111111100011000',
  '000010011111111000111000000000000100111111111111111111110001000',
  '001111111111110010000100000001101111111111111111111110110',
  '0011111111111001101100010000111111111111111111111111',
  '1011111111111010111000000111011101111111111111',
  '0010000111110011100000000001111111111100',
  '0000010101001110000000000111001000',
  '0000010101110000000000100000',
  '0000010111001000000000',
  '0000101000000000',
  '000000000',
  '000',
];

const D2R = Math.PI / 180;
const toVec = (lat, lon, jitter) => ({ lat: lat * D2R, lon: lon * D2R, jitter });

// Unit-sphere points: land dots, plus faint graticule dots (meridians and parallels every 30 degrees).
const GLOBE_LAND = GLOBE_ROWS.flatMap((row, i) => {
  const lat = -90 + GLOBE_STEP / 2 + i * GLOBE_STEP;
  return row
    .split('')
    .flatMap((c, j) => (c === '1' ? [toVec(lat, -180 + ((j + 0.5) * 360) / row.length, ((i * 31 + j * 17) % 23) / 23)] : []));
});
const GLOBE_GRID = [
  ...Array.from({ length: 12 }, (_, m) => Array.from({ length: 45 }, (_, k) => toVec(-88 + k * 4, m * 30, ((m * 7 + k) % 13) / 13))),
  ...[-60, -30, 0, 30, 60].map((lat, m) => Array.from({ length: 90 }, (_, k) => toVec(lat, k * 4, ((m * 5 + k) % 11) / 11))),
].flat();

const GLOBE_TILT = 22 * D2R; // tip the north pole toward the viewer
const GLOBE_START = 90 * D2R; // start with North America (and the Quad Cities) facing the viewer
const smoothstep = (a, b, x) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
};

// Draws the globe for hero scroll progress p (0-1): fades in as the title starts dropping, makes one
// full turn on its Y axis, then zooms out and scatters its dots as the About section arrives.
function drawGlobe(canvas, p) {
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  const appear = smoothstep(GLOBE_IN_START, GLOBE_IN_END, p);
  const vanish = smoothstep(GLOBE_OUT_START, GLOBE_OUT_END, p);
  const opacity = appear * (1 - vanish);
  if (opacity <= 0.001) return;

  const spin = GLOBE_START + smoothstep(GLOBE_IN_START, GLOBE_OUT_END, p) * Math.PI * 2;
  const radius = Math.min(w, h) * 0.3 * (1 + vanish * 0.35);
  const cx = w / 2;
  const cy = h * 0.5;
  const cosT = Math.cos(GLOBE_TILT);
  const sinT = Math.sin(GLOBE_TILT);

  const plot = (pt, front, back, size) => {
    const lon = pt.lon + spin;
    const cl = Math.cos(pt.lat);
    const x = cl * Math.sin(lon);
    const y0 = Math.sin(pt.lat);
    const z0 = cl * Math.cos(lon);
    const y = y0 * cosT - z0 * sinT;
    const z = y0 * sinT + z0 * cosT;
    // On exit every dot flies outward by its own amount, so the sphere bursts rather than just growing.
    const burst = 1 + vanish * (0.35 + pt.jitter * 1.3);
    const visible = z > 0;
    ctx.globalAlpha = opacity * (visible ? front * (0.35 + 0.65 * z) : back);
    ctx.fillStyle = visible && z > 0.45 && front > 0.5 ? '#ffffff' : visible ? '#3b82f6' : '#1d4ed8';
    const s = visible ? size : size * 0.7;
    ctx.fillRect(cx + x * radius * burst - s / 2, cy - y * radius * burst - s / 2, s, s);
  };

  GLOBE_GRID.forEach((pt) => plot(pt, 0.35, 0.06, 1.4));
  GLOBE_LAND.forEach((pt) => plot(pt, 1, 0.14, 3));
  ctx.globalAlpha = 1;
}

/* ------------------------------------------------------------------ */
/*  Hero: digital title that drops apart downward on scroll            */
/* ------------------------------------------------------------------ */

function Hero() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const textRefs = useRef([]);
  const cueRef = useRef(null);
  const globeRef = useRef(null);
  const addText = (el) => {
    if (el && !textRefs.current.includes(el)) textRefs.current.push(el);
  };

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    let raf = 0;
    // Hidden elements also leave the tab order, so keyboard users never land on an invisible button.
    const setGone = (el, gone) => {
      el.style.pointerEvents = gone ? 'none' : '';
      el.style.visibility = gone ? 'hidden' : '';
    };
    const update = () => {
      raf = 0;
      const section = sectionRef.current;
      const stage = stageRef.current;
      if (!section || !stage) return;
      // 0 at the top of the page, 1 once the pinned hero has been scrolled past.
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
      const scrolled = Math.max(-section.getBoundingClientRect().top, 0);
      const p = Math.min(scrolled / travel, 1);

      // Text: fades and drifts down over the first 180px (sooner on short screens), well before blocks drop.
      const textFade = Math.min(scrolled / Math.min(TEXT_FADE_PX, travel * TEXT_FADE_END), 1);
      textRefs.current.forEach((el) => {
        el.style.opacity = String(1 - textFade);
        el.style.transform = `translate3d(0, ${(textFade * 24).toFixed(1)}px, 0)`;
        setGone(el, textFade >= 1);
      });

      // Title: one CSS variable drives every block; no React re-renders while scrolling.
      const stageFade = Math.min(Math.max((p - STAGE_FADE_START) / (STAGE_FADE_END - STAGE_FADE_START), 0), 1);
      stage.style.setProperty('--p', p.toFixed(4));
      stage.style.transform = `translate3d(0, ${(p * 14).toFixed(2)}vh, 0) scale(${(1 + p * 0.06).toFixed(4)})`;
      stage.style.opacity = String(1 - stageFade);
      setGone(stage, stageFade >= 1);

      if (globeRef.current) drawGlobe(globeRef.current, p);

      // The scroll hint fades with the text.
      if (cueRef.current) {
        cueRef.current.style.opacity = String(1 - textFade);
        setGone(cueRef.current, textFade >= 1);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[180svh]" aria-label="Introduction">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Faint blue grid behind the title */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.07)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />
        {/* Dot globe, drawn behind the title as it dissolves */}
        <canvas ref={globeRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" />
        <div ref={stageRef} className="relative mx-auto w-full max-w-6xl origin-top will-change-transform">
          <p ref={addText} className="flex items-center gap-2.5 will-change-[opacity,transform]">
            <span className="relative flex h-2 w-2">
              <span className="sp-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
            </span>
            <Mono className="text-blue-400">SYSTEM_ONLINE // {SITE_DOMAIN}</Mono>
          </p>

          <h1 className="mt-8">
            <DigitalTitle />
          </h1>

          <div ref={addText} className="will-change-[opacity,transform]">
            <ul className="mt-8 flex flex-wrap gap-2" aria-label="Also known as">
              {ALIASES.map((a) => (
                <li key={a}>
                  <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-slate-300">
                    <span className="mr-2 text-blue-500">aka</span>
                    {a}
                  </span>
                </li>
              ))}
              <li>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-slate-300">
                  <MapPin className="h-3.5 w-3.5 text-blue-500" />
                  {HOME_BASE}
                </span>
              </li>
            </ul>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
              Builder, operator and community organizer across Web3 and tech. I produce global events, consult on
              marketing and operations, and ship high-velocity websites.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <PrimaryButton onClick={() => scrollToId('contact')} className="px-6 py-3">
                Work With Me <ArrowRight className="h-4 w-4" />
              </PrimaryButton>
              <SecondaryButton onClick={() => scrollToId('ecosystems')} className="px-6 py-3">
                See My Ecosystems
              </SecondaryButton>
            </div>
          </div>
        </div>

        <button
          ref={cueRef}
          onClick={() => scrollToId('about')}
          className={`absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 rounded text-slate-500 transition-colors duration-200 hover:text-white ${FOCUS}`}
          aria-label="Scroll to About">
          <Mono className="text-[10px]">Scroll</Mono>
          <ChevronDown className="sp-bob h-4 w-4" />
        </button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  About + pixel portrait                                             */
/* ------------------------------------------------------------------ */

function About() {
  return (
    <section id="about" className="relative z-10 -mt-[50svh] scroll-mt-20 bg-black px-4 py-20 sm:px-6 sm:py-28 lg:px-8 [@media(max-height:500px)]:pt-6">
      {/* Soft top edge so the section rises over the dissolving hero instead of cutting across it */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-32 h-32 bg-gradient-to-b from-transparent to-black" />
      <div className="relative mx-auto max-w-6xl border-t border-white/10 pt-6">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <Reveal className="mx-auto w-full max-w-md lg:max-w-none">
            <PixelPortrait />
          </Reveal>

          <Reveal delay={100}>
            <h2 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Builder. Operator.{' '}
              {/* The cursor sits outside the gradient word (a text-clipped background would hide it) and
                  the pair never wraps apart. The small bottom padding keeps the "g" descender inside the gradient. */}
              <span className="inline-block whitespace-nowrap">
                <span className="-mb-[0.12em] inline-block bg-gradient-to-r from-white via-blue-100 to-blue-400 bg-clip-text pb-[0.12em] text-transparent">
                  Organizer.
                </span>
                <span
                  aria-hidden="true"
                  className="ml-1.5 inline-block h-[0.85em] w-2.5 animate-pulse bg-blue-500 align-baseline shadow-[0_0_10px_rgba(59,130,246,0.8)] motion-reduce:animate-none"
                />
              </span>
            </h2>
            <div aria-hidden="true" className="mt-4 max-w-md border-b border-blue-500/20" />
            <p className="mt-5 text-lg leading-relaxed text-slate-400">
              I&apos;m Scrimmy, also known as Young Scrimmage and Don Scrimmy Jon, based in the Quad Cities. I bring
              people together in real life, help builders ship on-chain, and organize communities around better
              technology and policy.
            </p>
            <ul
              aria-label="Execution matrix"
              className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
              {EXECUTION_MATRIX.map(({ label, title, body }) => (
                <li key={label} className="bg-black p-5 sm:p-6">
                  <p className="font-mono text-xs uppercase tracking-wider text-blue-400">{label}</p>
                  <p className="mt-3 text-base font-bold text-white">{title}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">{body}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Ecosystems                                                         */
/* ------------------------------------------------------------------ */

function ActiveTag() {
  return (
    <span className="inline-flex items-center gap-1.5 border border-zinc-800 bg-black px-2 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-blue-300">
      <span className="sp-breathe inline-flex h-1.5 w-1.5 rounded-full bg-blue-500" />
      Active
    </span>
  );
}

function Ecosystems() {
  return (
    <section id="ecosystems" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          blueprint
          cursor
          title="Where I build and organize."
          sub="Real roles in real communities: producing global events, supporting builders, and organizing for clear crypto policy."
          telemetry={`[SYS_ENV: PRODUCTION] // DEPLOYED_NODES: ${String(ECOSYSTEMS.length).padStart(2, '0')} // ACTIVE_STATE: RUNNING`}
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {ECOSYSTEMS.map((e, i) => (
            <Reveal key={e.org} delay={i * 100} className="h-full">
              <FrameCard>

                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/80 p-2">
                    <img
                      src={e.logo}
                      alt={`${e.org} logo`}
                      width={32}
                      height={32}
                      loading="lazy"
                      decoding="async"
                      className={`h-full w-full object-contain ${e.logoClass ?? ''}`}
                    />
                  </span>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                      // Node_{String(i + 1).padStart(2, '0')}
                    </span>
                    <ActiveTag />
                  </div>
                </div>

                <h3 className="mt-6 text-2xl font-bold tracking-tight text-white">{e.org}</h3>
                <p className="mt-2 font-mono text-xs font-bold uppercase tracking-[0.18em] text-blue-400">{e.role}</p>
                <p className="mt-4 flex-1 text-[15px] leading-relaxed text-slate-400">{e.body}</p>

                <ul className="mt-6 space-y-2.5 border-t border-zinc-800 pt-6">
                  {e.points.map((p) => (
                    <li key={p} className="flex gap-2.5 text-sm text-slate-300">
                      <span aria-hidden="true" className="font-mono text-blue-500">
                        →
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </FrameCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Services                                                           */
/* ------------------------------------------------------------------ */

function Services() {
  return (
    <section id="services" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          title="What I Actually Do."
          sub="I coordinate complex global events, audit and automate messy operations, and write production-grade web software. No agency middlemen."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.n} delay={i * 100} className="h-full">
              <FrameCard>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-xs font-medium tracking-wider text-blue-400">
                    [ {s.n} // {s.tag} ]
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">// SVC_{s.n}</span>
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">{s.title}</h3>
                <p className="mb-6 mt-3 text-sm leading-relaxed text-zinc-400">{s.body}</p>
                <div className="mt-auto flex flex-wrap gap-1.5 border-t border-zinc-800/60 pt-6">
                  {s.tags.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
              </FrameCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Contact                                                            */
/* ------------------------------------------------------------------ */

const EMPTY_FORM = { service: '', name: '', email: '', message: '', botcheck: false };

function validate(f) {
  const e = {};
  if (!f.service) e.service = 'Choose what you need help with.';
  if (f.name.trim().length < 2) e.name = 'Please enter your name.';
  if (!isEmail(f.email)) e.email = 'Please enter a valid email address.';
  if (f.message.trim().length < 10) e.message = 'Tell me a little about the project (10+ characters).';
  return e;
}

function FieldError({ id, children }) {
  if (!children) return null;
  return (
    <p id={`${id}-err`} className="mt-2 flex items-center gap-1.5 text-xs text-slate-300">
      <AlertCircle className="h-3.5 w-3.5 shrink-0 text-blue-400" /> {children}
    </p>
  );
}

function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [serverError, setServerError] = useState('');

  const set = (key, value) =>
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (touched) setErrors(validate(next));
      return next;
    });

  const mailSubject = `${SITE_DOMAIN}: ${form.service || 'Inquiry'}${form.name ? ` from ${form.name}` : ''}`;
  const mailBody = `Name: ${form.name}\nEmail: ${form.email}\nService: ${form.service}\n\n${form.message}`;
  const mailto = buildMailto(mailSubject, mailBody);

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) {
      document.getElementById(Object.keys(v)[0])?.focus();
      return;
    }
    if (form.botcheck) return;
    setStatus('loading');
    setServerError('');
    try {
      await submitToWeb3Forms({
        subject: mailSubject,
        from_name: SITE_DOMAIN,
        name: form.name,
        email: form.email,
        replyto: form.email,
        service: form.service,
        message: form.message,
      });
      setStatus('success');
      setForm(EMPTY_FORM);
      setTouched(false);
    } catch (err) {
      // Keep the form filled so nothing is lost, and offer the same message by email.
      setServerError(err.message || 'Something went wrong.');
      setStatus('error');
    }
  };

  const fieldCls = (k) => `${INPUT_CLS} ${errors[k] ? 'border-blue-400 ring-2 ring-blue-400/40' : ''}`;

  return (
    <section id="contact" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          title="Let's build something."
          sub="One form, no surveys. Tell me what you need and I will reply within 1 business day."
        />
        <div className="grid gap-10 lg:grid-cols-[0.32fr_1fr] lg:gap-6">
          <Reveal>
            <Mono className="text-slate-500">Direct line</Mono>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className={`mt-3 flex items-start gap-2 rounded-md text-[15px] font-semibold text-blue-400 transition-colors duration-200 hover:text-blue-300 ${FOCUS}`}>
              <Mail className="mt-1 h-4 w-4 shrink-0" />
              <span>
                {CONTACT_EMAIL.split('@')[0]}@<wbr />
                {CONTACT_EMAIL.split('@')[1]}
              </span>
              <ArrowUpRight className="mt-1 h-4 w-4 shrink-0" />
            </a>
            <p className="mt-6 flex items-center gap-2 text-sm text-slate-400">
              <MapPin className="h-4 w-4 shrink-0 text-blue-500" /> {HOME_BASE}
            </p>
          </Reveal>

          <Reveal delay={100}>
            <Card className="p-6 sm:p-10">
              {status === 'success' ? (
                <div className="flex min-h-[380px] flex-col items-center justify-center text-center" role="status">
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-blue-600">
                    <Check className="h-7 w-7 text-white" />
                  </span>
                  <h3 className="mt-6 text-2xl font-bold tracking-tight text-white">Message delivered.</h3>
                  <p className="mt-3 max-w-sm text-slate-400">It is in my inbox. Expect a reply within 1 business day.</p>
                  <SecondaryButton onClick={() => setStatus('idle')} className="mt-8">
                    Send another message
                  </SecondaryButton>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="space-y-6">
                  <input
                    type="checkbox"
                    name="botcheck"
                    checked={form.botcheck}
                    onChange={(e) => set('botcheck', e.target.checked)}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <fieldset
                    id="service"
                    tabIndex={-1}
                    className="outline-none"
                    aria-describedby={errors.service ? 'service-err' : undefined}>
                    <legend className="mb-3 text-sm font-semibold text-white">What do you need?</legend>
                    <div role="radiogroup" aria-label="Service" className="flex flex-wrap gap-2">
                      {SERVICE_OPTIONS.map((o) => {
                        const on = form.service === o;
                        return (
                          <button
                            key={o}
                            type="button"
                            role="radio"
                            aria-checked={on}
                            onClick={() => set('service', o)}
                            className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition duration-200 active:scale-[0.98] ${FOCUS} ${
                              on
                                ? 'border-blue-500 bg-blue-600 text-white'
                                : 'border-white/10 bg-transparent text-slate-300 hover:border-white/25 hover:text-white'
                            }`}>
                            {on && <Check className="h-4 w-4" />}
                            {o}
                          </button>
                        );
                      })}
                    </div>
                    <FieldError id="service">{errors.service}</FieldError>
                  </fieldset>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm font-semibold text-white">
                        Your Name
                      </label>
                      <input
                        id="name"
                        value={form.name}
                        onChange={(e) => set('name', e.target.value)}
                        autoComplete="name"
                        placeholder="Jordan Rivera"
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-err' : undefined}
                        className={fieldCls('name')}
                      />
                      <FieldError id="name">{errors.name}</FieldError>
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-semibold text-white">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => set('email', e.target.value)}
                        autoComplete="email"
                        placeholder="jordan@company.com"
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-err' : undefined}
                        className={fieldCls('email')}
                      />
                      <FieldError id="email">{errors.email}</FieldError>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="mb-2 block text-sm font-semibold text-white">
                      Project Scope / Message
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      value={form.message}
                      onChange={(e) => set('message', e.target.value)}
                      placeholder="What are you planning, building or fixing, and when do you need it?"
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'message-err' : undefined}
                      className={`${fieldCls('message')} resize-y`}
                    />
                    <FieldError id="message">{errors.message}</FieldError>
                  </div>

                  {status === 'error' && (
                    <div role="alert" className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-sm text-slate-200">
                      <p className="flex items-start gap-2">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                        <span>{serverError} Your message was not sent, but you can send it by email instead.</span>
                      </p>
                      <a
                        href={mailto}
                        className={`mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition duration-200 hover:bg-slate-200 ${FOCUS}`}>
                        <Mail className="h-4 w-4" /> Send via email
                      </a>
                    </div>
                  )}

                  <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-500">I only use your details to reply.</p>
                    <PrimaryButton type="submit" disabled={status === 'loading'} className="px-6">
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                        </>
                      ) : (
                        <>
                          Send Message <Send className="h-4 w-4" />
                        </>
                      )}
                    </PrimaryButton>
                  </div>
                </form>
              )}
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <footer className="border-t border-white/5 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-sm font-semibold text-white">
          scrimmy<span className="text-blue-500">.xyz</span>
        </p>
        <p className="font-mono text-xs text-slate-500">© 2026 {SITE_DOMAIN} · Scrimmage Productions LLC</p>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */

const GLOBAL_CSS = `
  html { scroll-behavior: smooth; }
  body { background: #000; }
  /* Downward dissolve: once scroll progress (--p) passes a block's start (--t), it slides down
     by up to --d units and fades out. --q is that block's own 0-1 progress. */
  .sp-block {
    --q: clamp(0, calc((var(--p, 0) - var(--t)) * 3.5), 1);
    transform: translate3d(0, calc(var(--q) * var(--d) * 1px), 0);
    opacity: calc(1 - var(--q));
  }
  @keyframes sp-ping { 75%, 100% { transform: scale(2.2); opacity: 0; } }
  @keyframes sp-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(3px); } }
  .sp-ping { animation: sp-ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite; }
  .sp-bob { animation: sp-bob 1.8s ease-in-out infinite; }
  /* Live-node breathing. All dots mount together, so they share one slow phase. */
  @keyframes sp-breathe {
    0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(59,130,246,0.55); }
    50% { opacity: 0.35; box-shadow: 0 0 6px 2px rgba(59,130,246,0); }
  }
  .sp-breathe { animation: sp-breathe 3.2s ease-in-out infinite; }
  @keyframes sp-beam { from { transform: translateX(-100%); opacity: 1; } 85% { opacity: 1; } to { transform: translateX(300%); opacity: 0; } }
  .sp-beam { animation: sp-beam 1.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both; }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    .sp-ping, .sp-bob, .sp-breathe { animation: none; }
    .sp-beam { animation: none; opacity: 0; }
  }
`;

export default function App() {
  const [active, setActive] = useState('');

  // Highlight the nav link for the section in view.
  useEffect(() => {
    const els = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen bg-black font-sans text-slate-400 antialiased selection:bg-blue-600/40 selection:text-white">
      <style>{GLOBAL_CSS}</style>
      <NavBar active={active} />
      <main>
        <Hero />
        <About />
        <Ecosystems />
        <Services />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
