import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  CalendarRange,
  Check,
  ChevronDown,
  ChevronRight,
  Code2,
  Landmark,
  Loader2,
  Mail,
  MapPin,
  Megaphone,
  Menu,
  Mountain,
  Pizza,
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
    icon: Pizza,
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
    icon: Mountain,
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
    icon: Landmark,
    org: 'Stand With Crypto',
    role: 'Iowa Chapter President',
    body: 'Grassroots community mobilization across Iowa, voter education, and advocacy for clearer digital asset policy.',
    points: ['Grassroots mobilization', 'Voter education', 'Digital asset policy advocacy'],
  },
];

const SERVICES = [
  {
    n: '01',
    icon: CalendarRange,
    title: 'Event Planning & Global Production',
    body: 'High-stakes run-of-shows, multi-city logistics, venue and vendor deals, and crypto-native ticketing.',
    tags: ['Run-of-show', 'Multi-city', 'Venues & vendors', 'Ticketing'],
  },
  {
    n: '02',
    icon: Megaphone,
    title: 'Marketing & Business Consulting',
    body: 'Operations and campaign metrics, grassroots community building, tech audits, and pipeline automation.',
    tags: ['Ops metrics', 'Campaigns', 'Community', 'Tech audits', 'Automation'],
  },
  {
    n: '03',
    icon: Code2,
    title: 'High-Velocity Website Development',
    body: 'Custom Vite + React 19 builds, SEO tuning, contact forms, and lead capture. Sub-second performance.',
    tags: ['Vite', 'React 19', 'SEO', 'Lead capture'],
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
// The About section slides up over the hero during the final stretch, so there is no empty screen.
const TEXT_FADE_PX = 180;
const TEXT_FADE_END = 0.18;
const BLOCK_START = 0.2;
const BLOCK_SPREAD = 0.35;
const STAGE_FADE_START = 0.62;
const STAGE_FADE_END = 0.86;

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

function SectionHeader({ index, eyebrow, title, sub }) {
  return (
    <Reveal className="mb-14 grid gap-4 border-t border-white/10 pt-6 lg:grid-cols-[0.32fr_1fr] lg:gap-6">
      <Mono className="text-blue-400 lg:pt-3">
        {index} // {eyebrow}
      </Mono>
      <div>
        <h2 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">{title}</h2>
        {sub && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-400">{sub}</p>}
      </div>
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

function Chip({ children }) {
  return (
    <span className="rounded-md border border-blue-500/20 bg-blue-500/5 px-2 py-1 font-mono text-[11px] uppercase tracking-wider text-blue-300">
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
/*  Hero: digital title that drops apart downward on scroll            */
/* ------------------------------------------------------------------ */

function Hero() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const textRefs = useRef([]);
  const cueRef = useRef(null);
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
/*  World map background                                               */
/* ------------------------------------------------------------------ */

// Country borders and coastlines (Natural Earth 1:110m via world-atlas, Antarctica omitted),
// pre-projected with d3-geo's Natural Earth projection into a 1000x500 box.
const WORLD_MAP_PATH =
  'M8,338L9,338L9,340L8,340L8,340M992,340L990,341L988,341L988,340L989,340L990,339L992,338L992,338M8,338L8,338M333,142L333,143L330,145L327,146L324,147L322,149L322,149L321,151L322,153L323,153L323,152L323,152L323,153L321,154L320,154L318,154L317,154L315,155L313,155L317,155L317,155L313,156L312,156L312,156L311,157L312,157L310,159L308,162L308,161L307,161L307,160L307,162L307,162L307,164L306,165L304,167L304,167L305,165L304,164L304,161L304,163L304,165L302,164L304,165L303,168L304,168L304,169L303,173L301,175L298,176L296,178L295,178L293,179L292,180L289,182L287,184L286,186L285,188L285,190L285,193L286,196L285,197L286,201L286,203L285,204L284,206L283,206L282,206L282,205L281,204L280,201L279,199L279,197L280,195L280,193L278,191L277,190L274,192L274,192L273,190L271,189L268,190L266,189L264,190L263,190L263,191L263,192L263,193L263,193L262,193L261,193L259,193L257,192L255,192L253,191L251,192L249,192L246,195L243,196L241,198L240,199L240,201L239,203L240,204L239,204L237,203L235,202L235,201L235,199L233,197L233,195L232,193L231,191L228,191L226,194L224,193L223,192L223,190L222,189L221,187L220,186L219,185L215,185L215,186L212,186L207,186L202,184L198,182L199,182L195,182L192,182L192,181L191,179L190,179L190,178L189,177L188,177L186,176L185,176L186,174L184,171L184,166L184,166L184,164L183,162L184,159L183,157L185,155L186,152L186,150L189,147L190,144L192,141L194,137L194,134L195,133L195,132L198,133L198,136L199,135L200,133L200,130L200,130L197,127L196,126L193,124L193,122L194,120L192,118L193,116L192,114L193,112L195,111L197,109L194,107L194,104L194,101L193,100L193,99L193,97L190,98L186,100L186,98L185,97L183,96L181,96L196,80L206,69L209,70L211,71L213,72L216,71L219,70L222,70L226,69L230,68L231,69L233,69L234,67L235,68L237,70L241,68L240,70L243,70L244,69L247,69L249,70L253,71L255,72L258,72L259,73L255,74L259,75L265,75L267,74L268,76L271,74L270,73L272,72L275,72L276,72L278,73L279,74L281,74L284,75L288,75L291,75L292,73L294,73L297,73L295,76L298,74L299,74L302,71L301,70L299,68L301,65L305,64L308,64L309,65L310,68L307,69L311,70L309,73L313,71L314,72L312,74L313,76L317,74L320,72L322,69L325,69L327,70L329,71L329,72L326,74L327,75L326,77L321,78L318,79L316,78L314,79L311,82L310,83L306,85L303,85L300,86L299,88L296,89L292,91L288,94L286,96L284,100L287,100L286,103L286,105L290,105L294,106L295,107L296,109L299,109L301,111L305,111L307,111L305,114L305,117L305,120L308,123L310,122L312,119L313,114L312,113L316,111L320,109L322,107L323,105L322,102L321,100L325,97L325,95L326,90L328,89L332,90L334,90L336,90L337,91L340,92L340,93L344,94L343,96L342,100L344,100L345,102L349,100L352,97L354,96L355,98L356,102L358,106L356,108L359,109L360,111L364,112L365,113L365,115L367,116L368,117L367,120L365,121L363,123L358,124L355,126L350,127L345,126L342,126L339,126L337,128L333,130L328,134L324,137L327,136L332,132L338,130L342,129L343,131L340,133L340,136L340,139L343,140L347,140L351,136L350,139L352,140L348,142L342,144L339,145L336,147L334,147L335,144L340,142L336,142L333,142L332,140L333,136L332,135L330,136L330,135L327,137L326,140L324,141L323,142L322,142L322,143L317,143L313,143L312,143L309,145L308,146L307,147L305,147L302,147L301,147L301,148L301,149L301,149L297,151L295,151L291,153L291,153L290,153L290,152L290,152L291,151L293,149L294,147L294,144L295,141L293,140L293,139L293,139L292,139L292,139L292,138L291,138L291,138L291,138L291,137L291,137L289,136L287,135L286,133L284,132L281,133L280,133L278,132L275,133L273,132L271,131L270,131L269,130L269,129L268,129L268,130L263,130L255,130L246,130L239,130L232,130L224,130L217,130L215,130L207,130L200,130M313,90L316,88L319,88L318,89L315,90L313,90L313,90M338,61L337,60L338,59L339,59L343,59L346,60L345,61L343,61L341,61L339,61L338,61M321,91L322,90L323,90L323,91L322,92L321,92L321,91L321,91M314,56L313,57L310,56L308,56L310,55L313,54L314,55L314,56M319,49L318,49L315,49L315,49L319,49L319,49L319,49M316,46L318,47L316,48L313,49L312,48L312,47L313,46L315,46L316,46M324,57L321,57L316,56L317,55L318,53L316,52L313,52L311,51L313,50L317,50L318,51L322,51L323,52L322,53L324,53L324,54L327,54L330,54L333,54L337,54L340,54L342,55L342,56L340,56L337,57L334,57L328,57L324,57M287,48L289,48L288,49L284,50L282,49L284,48L287,48M289,46L291,47L288,47L285,47L286,47L288,46L289,46M366,123L364,125L362,127L364,126L365,127L364,128L366,129L368,128L370,129L368,132L370,131L370,133L371,135L369,137L368,137L366,137L367,134L367,134L363,137L362,136L364,135L362,134L359,134L354,134L354,133L356,132L355,131L358,130L362,125L364,123L366,122L367,122L366,123M318,82L319,83L321,84L321,85L323,85L324,86L321,87L318,86L318,85L315,86L311,88L311,86L308,87L311,85L312,83L314,80L316,81L315,82L317,81L318,82M340,62L342,61L346,63L348,64L348,65L352,64L353,66L357,67L359,68L359,71L355,72L359,74L362,75L364,77L367,77L366,79L361,82L359,81L356,79L354,79L353,80L354,82L356,83L357,84L357,87L356,89L353,88L349,86L351,88L352,90L352,91L347,90L343,88L341,87L342,86L339,85L337,83L336,84L330,85L328,84L331,82L335,82L340,81L339,80L341,79L345,76L345,75L345,74L342,73L338,72L340,71L339,69L337,69L336,68L334,69L330,69L323,69L319,68L316,68L315,67L318,65L315,65L316,63L319,60L322,59L328,59L325,60L326,62L329,60L335,59L336,61L335,63L340,62M311,58L315,58L318,58L314,61L311,61L307,63L305,63L306,61L307,60L308,58L311,58M259,53L265,51L270,49L273,49L276,49L274,51L272,52L270,52L265,53L261,53L259,53M186,115L189,114L186,118L186,120L185,120L185,119L185,117L184,116L185,115L185,114L186,115M301,45L304,45L308,46L309,47L309,48L306,48L303,47L299,47L302,47L300,46L301,45M198,132L197,132L193,131L193,129L192,128L192,127L190,127L190,125L190,125L192,125L194,126L196,126L196,127L196,129L198,130L198,132M258,57L260,57L265,58L266,58L267,59L264,60L258,62L253,64L252,65L246,66L246,65L242,64L244,63L247,61L251,59L250,57L258,57M288,53L290,53L292,53L291,54L289,56L282,56L276,57L273,57L274,56L279,55L269,55L267,55L272,53L275,52L279,53L282,54L285,54L284,52L287,51L289,51L288,53L288,53M285,61L286,62L285,64L284,66L287,67L290,69L289,70L285,70L286,71L284,72L281,72L278,71L275,71L270,72L265,72L261,73L261,71L258,71L256,71L256,69L257,68L261,68L264,68L267,68L263,67L259,67L256,67L255,66L261,65L258,65L255,64L258,63L261,61L268,60L269,60L267,62L272,61L274,62L277,61L279,62L278,64L280,63L281,60L283,60L285,61M296,61L295,60L299,59L301,59L304,59L304,59L302,61L304,62L302,64L298,65L296,65L295,64L292,62L292,61L296,61M286,59L288,59L289,60L286,61L285,60L286,59M308,51L309,52L308,54L305,56L302,56L300,55L301,54L298,54L300,52L302,52L305,51L308,52L308,51M322,42L324,41L326,41L326,41L330,41L331,42L334,42L336,43L336,44L338,45L335,46L330,47L326,48L323,47L321,46L322,46L324,45L321,45L320,44L319,43L322,42M333,39L336,39L338,39L342,39L346,38L348,38L349,39L352,37L355,37L358,37L364,37L364,37L370,37L374,37L377,37L382,37L386,37L389,38L388,38L383,39L378,40L376,40L380,40L375,42L371,42L366,44L362,44L361,45L355,45L357,45L356,46L356,47L354,48L350,48L349,49L346,50L345,51L349,51L349,51L342,53L338,52L332,52L329,52L325,52L326,51L330,50L331,48L332,48L336,49L335,48L332,47L334,46L338,46L339,45L338,44L338,43L343,43L344,43L348,42L344,42L337,42L335,42L334,41L333,40L333,39M340,76L338,76L335,77L336,75L337,74L339,73L341,74L340,75L340,76M299,70L299,71L297,72L295,71L293,71L291,70L293,69L296,68L297,69L298,70L299,70M343,127L344,127L347,128L349,129L349,130L348,130L345,129L343,127M342,136L343,138L344,138L347,138L345,139L344,139L341,138L341,137L342,136M78,223L79,223L79,223L79,224L79,225L78,225L77,226L76,226L76,226L76,225L76,224L76,223L77,223L77,222L77,222L77,222L78,223M77,220L77,221L76,221L76,220L75,220L75,220L76,220L77,220L77,220M75,219L75,219L74,219L74,219L75,219M72,217L73,217L73,219L73,219L73,219L72,219L72,218L72,218L72,217M69,216L69,216L69,217L68,216L68,216L69,216L69,216M124,96L125,96L125,97L123,97L122,97L121,96L124,96M148,103L149,103L149,104L146,105L143,106L142,106L143,104L146,103L148,103M193,112L193,111L191,110L192,107L191,105L192,102L190,102L186,102L184,101L182,98L180,98L177,97L174,97L171,95L169,94L166,95L165,97L163,97L160,98L157,99L154,99L155,98L159,95L162,94L162,93L158,95L154,97L149,99L150,100L146,102L142,103L139,104L137,106L132,107L130,109L127,110L125,110L122,111L119,112L116,113L111,113L112,113L115,111L118,111L122,109L126,109L128,107L133,106L134,105L136,104L139,102L141,100L138,101L138,100L135,101L135,100L134,101L134,99L131,101L129,101L131,99L132,98L132,97L128,97L128,96L127,95L128,94L128,92L131,91L134,89L136,88L138,87L139,88L143,87L144,87L146,86L147,85L147,84L149,83L148,83L145,84L144,84L143,84L139,84L137,83L137,82L136,81L140,79L147,78L149,78L147,79L151,79L152,78L150,77L150,75L149,74L147,73L150,72L154,72L158,70L160,69L164,68L166,67L172,66L173,66L178,65L180,66L181,67L182,66L185,66L185,67L187,67L190,67L193,68L197,68L198,69L201,68L204,69L206,69M122,86L123,86L125,86L126,87L128,87L127,88L125,88L124,88L123,87L121,87L121,87L122,86M621,138L621,140L618,141L617,144L619,147L620,149L623,153L622,154L621,155L620,155L618,153L617,153L616,152L615,150L612,150L611,150L610,150L607,148L603,148L601,147L600,147L597,145L594,144L591,142L593,141L595,139L593,137L597,136L596,135L594,136L594,135L595,134L598,133L598,132L597,131L598,129L597,128L594,127L592,127L590,126L589,126L585,125L585,125L584,123L582,123L582,122L582,121L581,120L578,120L577,120L577,121L576,120L575,118L574,117L575,117L577,117L578,117L577,116L575,115L575,115L574,114L572,112L573,111L572,110L570,109L569,110L568,109L566,108L565,106L564,105L563,104L564,103L563,100L564,99L564,98L566,97L563,95L568,92L569,90L570,88L566,87L567,85L564,83L565,80L562,77L564,75L560,73L560,71L562,71L565,70L567,69L571,71L577,71L586,74L588,76L588,77L586,79L583,80L573,78L571,78L575,80L576,81L576,84L579,85L581,86L581,84L580,83L581,82L587,84L588,83L586,81L590,78L593,78L595,79L595,78L593,76L594,74L592,73L598,73L600,75L597,75L597,77L599,78L603,77L603,75L607,74L613,72L615,72L613,74L616,74L617,73L621,73L624,72L627,73L628,72L626,70L626,69L633,70L636,71L645,74L646,72L643,71L643,70L640,70L640,69L638,67L638,66L640,63L640,61L641,61L647,61L648,63L648,65L649,66L651,68L652,71L656,73L656,75L653,79L656,79L656,78L658,77L658,76L660,75L657,73L658,71L655,71L654,70L654,67L650,65L653,63L651,61L652,61L654,63L655,65L657,66L655,64L658,63L662,62L667,64L664,62L662,59L665,58L670,59L674,58L672,57L673,55L675,55L678,54L683,54L683,53L688,53L690,53L693,52L697,52L696,51L697,50L701,49L705,50L703,50L708,51L709,52L710,51L716,51L722,52L724,53L725,55L724,55L720,57L719,58L722,58L725,59L726,58L729,60L729,59L732,59L739,59L741,60L749,61L748,59L752,59L756,59L760,61L763,62L763,63L767,65L771,67L771,64L775,65L778,64L783,65L784,64L787,65L783,62L785,61L805,63L808,64L816,66L824,66L828,66L831,67L833,69L837,70L839,70L843,70L847,70L851,70L857,72L859,71L855,70L855,68L862,69L866,69L874,70L878,71M122,71L122,71L124,74L126,76L124,78L125,79L127,77L132,77L133,80L130,81L126,81L123,84L121,85L119,84L119,83L117,83L118,81L116,81L113,81L113,80L115,79L111,80L111,81L108,82L108,82M892,82L892,82L891,84L887,84L891,85L895,87L897,88L899,89L899,90L894,89L890,92L888,92L887,94L886,96L886,97L881,95L877,97L875,96L874,98L871,97L872,99L872,102L873,103L876,104L880,108L878,108L879,111L881,112L878,114L880,117L877,118L879,121L878,124L875,122L871,117L864,110L862,106L862,105L861,103L864,102L865,99L866,96L868,93L865,89L863,90L864,92L861,95L856,92L851,93L850,97L854,99L849,100L846,100L844,98L840,98L839,99L831,99L824,100L822,105L818,112L822,113L824,115L827,115L828,114L830,114L836,117L838,120L838,123L841,127L843,132L842,136L842,138L841,142L839,146L839,148L836,149L835,150L832,148L830,150L830,151L830,151L830,151L829,149L830,149L829,145L827,143L828,142L831,142L831,139L830,136L831,134L830,132L827,133L825,134L822,134L819,131L815,129L810,128L807,125L805,123L803,121L800,118L797,117L793,116L790,116L787,117L786,118L788,119L789,121L788,122L788,125L789,126L787,128L783,127L780,127L778,126L777,126L774,128L771,129L770,130L766,129L764,129L762,128L759,126L756,126L753,126L751,127L747,125L746,123L742,122L740,122L737,121L736,124L738,126L736,128L732,127L730,127L728,125L725,125L723,124L719,126L716,129L714,129L713,129L712,131L710,132L711,135L710,136L705,135L705,141L704,142L699,143L703,148L702,149L703,151L701,150L699,149L696,149L691,149L690,149L687,148L685,149L685,150L681,149L679,150L679,151L678,152L675,154L675,156L674,156L673,155L669,155L668,152L667,152L666,149L663,147L659,147L656,147L653,144L650,143L646,141L645,141L639,143L642,154L641,154L638,152L637,151L634,152L633,153L633,152L633,151L632,150L629,148L627,146L626,145L626,144L628,144L628,142L630,141L632,142L632,139L631,137L628,137L626,136L624,137L621,138L620,138L620,136L618,134L616,134L614,132L615,130L614,129L615,125L618,127L618,125L622,122L626,122L631,124L635,125L637,124L641,124L644,125L645,124L648,124L648,123L644,121L645,119L645,119L647,118L644,116L645,115L654,114L655,113L660,112L662,110L666,111L668,114L670,113L674,115L674,116L676,116L681,113L681,114L685,116L693,124L694,123L698,124L701,124L702,124L704,126L706,127L708,128L711,127L713,129M679,151L680,152L678,154L681,155L682,154L686,156L683,158L681,158L680,158L679,157L680,155L676,156L676,158L675,160L673,160L673,161L675,162L676,164L675,168L673,167L672,167L671,165L668,164L665,162L663,160L659,158L657,155L656,154L653,155L652,154L652,151L648,150L646,152L644,153L645,154L642,154M889,316L886,313L884,313L883,314L879,314L881,311L883,310L882,307L881,304L876,301L874,301L870,298L869,300L868,300L867,299L867,298L865,296L868,295L870,295L870,294L866,294L865,292L862,292L861,290L865,289L866,288L871,289L871,291L872,296L875,298L877,294L880,292L883,292L885,293L887,295L890,295L895,297L900,299L902,301L903,303L903,304L908,306L908,308L906,308L906,311L908,313L910,316L911,316L911,317L913,318L912,319L915,320L915,321L913,321L912,320L910,320L907,319L905,317L904,316L903,313L899,311L897,312L895,313L895,316L893,317L892,316L889,316L890,306L890,295M922,299L923,300L923,301L922,302L922,300L921,299L920,298L919,297L917,296L917,295L919,296L920,297L921,297L922,299M918,306L916,306L915,307L913,307L911,306L910,305L910,304L912,305L914,305L914,303L915,303L915,305L917,304L917,303L919,302L919,300L921,300L921,301L921,302L920,304L918,305L918,306M928,304L928,305L930,307L931,308L930,309L930,309L928,308L927,306L927,303L927,303L928,304M870,309L870,307L871,305L872,304L872,305L872,307L870,309M803,280L805,282L808,281L808,278L809,278L812,277L814,274L816,272L817,274L818,273L819,273L819,271L819,269L821,267L822,265L823,265L825,266L825,268L827,269L829,270L829,271L827,271L828,273L826,274L824,277L827,280L826,281L829,284L826,284L825,287L825,289L822,292L822,295L821,300L821,299L818,300L817,298L815,298L813,297L810,298L809,297L807,297L805,296L804,292L803,291L802,288L801,286L802,283L803,280L804,283L806,284L808,284L809,284L811,282L812,282L815,283L817,282L818,278L819,277L820,273L823,273L826,274M858,296L861,297L862,299L859,298L857,298L856,298L854,298L854,296L858,296M851,299L849,298L848,297L851,297L852,298L851,299M854,280L854,282L856,282L856,283L856,286L854,286L854,288L855,289L854,290L853,288L852,284L853,281L854,280M840,284L843,284L846,282L846,282L844,286L842,286L840,286L835,286L832,286L832,289L835,291L836,290L841,289L841,290L840,290L839,292L836,293L839,297L838,298L840,302L840,304L839,305L838,304L839,301L836,302L836,302L836,300L834,298L835,295L833,296L833,300L833,305L831,305L830,304L831,301L830,298L829,298L828,296L830,294L830,291L832,286L832,285L834,283L837,284L840,284M831,320L828,318L830,317L832,318L833,319L832,320L831,320M835,314L836,314L839,313L838,315L834,316L831,315L831,314L833,313L835,314M826,314L828,313L828,315L825,315L823,316L822,316L823,314L824,314L825,313L826,314M800,307L800,309L805,309L806,308L811,309L812,311L816,312L819,314L816,315L813,314L810,314L808,313L805,313L802,312L800,311L799,312L794,310L793,309L791,309L793,306L796,306L798,307L800,307M789,290L789,293L790,294L792,295L793,297L793,301L792,306L789,306L787,303L784,300L782,298L780,296L779,293L777,289L775,286L774,284L773,281L770,279L769,276L767,275L764,271L763,269L765,270L769,270L772,273L774,275L776,277L778,280L781,280L784,282L785,285L787,287L786,289L788,290L789,290M343,462L342,463L341,464L339,464L338,464L336,463L333,462L330,461L327,459L322,456L324,456L328,458L332,459L333,458L333,456L334,455L336,455L338,456L340,459L343,461L347,461L346,463L344,463L343,462L341,462L339,462L336,455M336,454L334,454L333,455L331,456L332,459L331,459L328,458L324,456L321,454L319,452L319,450L317,448L315,443L315,440L317,437L313,436L315,434L314,428L317,430L316,423L314,422L315,426L313,426L313,421L312,415L313,413L311,410L310,406L311,406L311,401L312,396L312,391L311,386L311,384L310,380L311,376L310,369L310,363L310,356L309,350L308,346L310,345L310,343L312,345L312,348L314,349L313,352L315,356L317,360L319,360M585,314L584,313L580,314L579,314L578,316L579,318L578,321L578,325L579,325L581,327L581,326L581,329L579,329L578,328L577,326L575,326L575,324L573,325L571,325L570,323L568,323L567,323L567,322L566,322L565,322L563,322L562,322L561,322L561,319L560,317L560,315L561,314L560,312L560,310L557,310L557,309L555,309L555,310L554,310L553,312L552,312L551,312L550,312L548,313L547,311L547,310L546,308L545,306L537,306L536,306L535,306L534,306L534,305L534,305L534,304L535,303L536,302L537,303L538,301L539,301L539,302L540,303L542,301L544,299L544,298L544,296L545,292L547,291L548,289L549,288L549,287L549,286L549,284L550,281L550,279L551,278L551,276L551,273L552,272L554,271L556,272L558,273L560,273L562,274L563,272L563,272L564,272L567,271L569,271L569,271L570,270L571,270L573,270L575,271L576,270L577,273L579,273L579,273L581,273L582,272L583,274L585,276L585,279L586,280L585,281L584,282L583,284L583,285L583,288L582,289L582,291L581,292L581,294L581,294L580,296L581,297L581,301M594,290L594,290L604,297L604,299L608,302L607,306L607,308L609,309L609,310L608,312L608,313L608,314L609,316L610,319L611,320L609,322L606,323L604,323L603,324L601,324L600,324L597,324L595,324L594,319L593,318L593,317L590,316L589,316L587,315L586,314L585,314L583,310L582,308L581,306L582,304L581,301L582,301L583,300L584,298L585,298L585,297L584,296L584,295L585,294L585,292L584,291L585,290L588,290L594,290L594,287L595,285L596,283L597,281L596,277L595,276L594,273L596,271L598,269L599,270L599,272L600,273L602,273L605,275L606,275L607,275L608,276L609,276L610,275L613,273L614,274L616,274M615,292L613,290L613,278L616,274L616,273L618,273L621,271L624,271L632,261L634,259L635,257L635,255L635,252L635,250L635,250L635,250L637,250L638,250L639,248L640,248L641,249L640,251L640,253L640,254L639,257L638,261L637,265L634,270L632,273L629,278L626,280L622,284L619,286L616,290L616,292L615,292L613,294L612,295L611,295L611,297L610,299L609,301L608,302M563,251L561,252L560,253L558,257L555,258L553,258L552,258L552,259L551,260L550,262L546,263L545,262L545,262L544,263L542,263L543,262L542,260L541,259L540,258L538,256L539,255L540,255L541,255L543,255L541,252L541,250L541,248L540,246L540,244L538,244L538,242L537,241L538,237L542,234L542,229L543,223L543,222L542,220L542,219L541,219L540,214L543,212L554,218L565,224M305,224L305,225L305,227L304,227L305,228L305,229L303,229L302,229L300,229L299,229L297,228L298,227L300,228L302,228L303,227L302,226L302,224L301,224L301,223L303,223L305,224L306,223L308,223L309,224L310,224L310,225L312,225L312,226L313,226L314,227L313,229L312,228L310,228L310,228L309,228L308,229L308,228L307,228L305,231L305,230L305,229M673,41L677,41L681,42L688,44L690,46L686,46L680,46L676,45L673,43L670,43L673,41M694,45L700,46L701,47L691,48L691,45L693,45L694,45M772,53L777,53L786,54L787,56L779,56L777,57L771,55L770,53L772,53M793,55L799,55L798,56L794,56L789,55L789,54L793,55M782,60L783,59L785,58L789,59L790,60L787,60L783,60L782,60M583,42L587,42L589,42L590,42L591,42L592,41L596,42L595,42L593,43L591,43L591,43L589,43L587,43L587,42L583,42M607,59L611,57L610,55L614,54L620,52L626,52L629,51L632,51L634,52L633,52L627,54L622,55L617,57L615,60L613,62L614,65L619,67L618,67L611,67L610,65L606,65L605,63L607,63L606,61L609,59L607,59M839,116L841,118L844,121L847,125L853,130L848,129L850,134L854,137L856,139L852,137L852,139L850,137L849,134L846,130L845,128L843,124L839,121L836,117L838,115L836,114L836,114L839,116M130,65L131,64L133,64L135,65L134,66L131,66L128,66L128,66M872,66L870,67L868,66L870,65M130,65L130,65M289,201L290,201L292,201L292,202L289,202L289,201M292,200L294,202L293,204L293,203L293,202L292,200L292,200M290,206L291,206L291,209L291,211L290,211L290,209L289,208L290,206M353,453L356,451L358,452L359,450L361,452L361,453L358,454L357,453L355,454L353,453M528,44L529,43L532,43L534,44L541,46L536,47L535,49L534,49L533,51L531,51L527,50L528,49L525,48L521,46L520,44L525,43L526,44L528,44M560,71L561,69L558,68L555,69L554,71L552,72L550,72L547,72L545,70L543,71L542,71L542,73L538,73L538,74L536,74L534,76L533,79L530,83L530,84L530,85L528,85L526,88L527,92L528,93L528,96L526,98L525,100L524,98L519,102L516,102L513,101L512,98L511,91L513,89L519,87L523,84L527,80L531,75L535,73L540,69L544,68L548,68L551,66L554,66L558,65L565,67L562,68L565,70M551,43L549,45L543,45L538,44L537,44L535,44L532,43L538,42L541,43L543,42L547,43L551,43M547,49L543,49L540,49L541,48L540,48L544,47L545,48L547,49M416,38L422,37L429,37L431,36L438,36L452,36L462,38L459,38L452,39L442,39L443,39L449,39L455,40L458,39L460,40L457,41L462,40L471,39L477,40L478,41L470,42L469,43L463,43L467,43L464,45L463,46L462,49L464,51L461,51L458,51L461,53L461,55L459,55L461,57L457,58L459,59L458,59L455,60L452,60L455,62L455,63L451,62L449,62L452,63L455,65L455,67L451,67L450,66L448,65L448,67L445,68L451,68L454,68L448,71L441,73L435,74L433,74L430,75L427,78L422,80L420,80L417,80L414,81L411,83L411,85L409,87L405,89L405,91L404,94L402,96L399,97L396,94L391,94L390,93L389,90L386,86L386,84L386,82L384,79L386,77L385,76L388,73L392,72L393,71L394,69L391,70L390,70L388,71L386,70L386,68L388,66L390,66L394,67L391,65L389,65L387,65L386,64L389,62L388,61L387,59L386,56L384,55L384,54L380,53L376,53L371,53L366,53L364,52L361,51L367,50L371,50L363,49L359,48L360,47L368,46L376,45L377,44L373,43L375,42L383,41L386,41L386,40L390,39L396,39L402,39L403,39L409,38L413,39L415,39L419,40L415,39L416,38M668,443L670,444L672,444L672,445L671,446L667,446L667,445L668,443L668,443M844,315L845,316L845,317L843,319L840,320L840,320L840,319L842,317L844,315L845,315L847,314L849,314L850,313L851,314L850,315L847,316L845,317M577,380L576,379L575,380L573,381L572,383L573,385L574,385L575,384L576,383L577,382L578,381L577,380M240,204L238,207L237,209L236,213L236,215L236,217L236,218L236,221L238,223L238,225L239,227L242,227L243,229L245,228L247,228L250,227L251,226L253,225L254,223L255,221L255,220L257,219L260,218L263,218L264,218L265,219L265,220L263,222L262,224L262,224L262,226L261,228L260,228L260,228L259,228L258,230L257,229L257,229L257,230L255,230L252,230L252,232L250,232L251,233L252,233L253,234L253,234L253,235L249,235L248,238L248,239L248,239L247,240L245,237L243,236L241,235L240,235L237,236L236,237L234,236L232,235L230,234L228,233L225,232L223,230L222,229L221,229L218,228L217,227L215,225L214,223L213,221L214,221L214,220L215,219L215,218L214,217L214,215L214,214L212,211L210,208L209,206L207,205L207,204L208,202L206,201L205,200L205,197L204,197L203,196L202,194L202,193L201,191L201,188L201,187L200,186L199,186L198,185L197,186L197,188L196,190L197,191L198,194L199,194L199,195L199,196L199,196L199,198L200,199L200,200L202,201L202,204L202,206L203,207L202,209L204,209L204,211L205,212L205,213L204,214L203,214L203,212L201,210L200,208L199,208L199,205L199,203L198,202L197,201L196,201L196,201L194,200L193,198L194,198L195,198L196,197L196,195L195,193L194,192L193,190L193,188L192,185L192,182M347,384L347,387L347,390L348,393L347,394L347,396L347,398L351,400L351,403L353,404L353,405L351,410L348,411L343,412L340,412L341,414L341,416L342,418L341,419L338,419L335,418L335,419L336,422L338,423L339,422L340,424L338,425L336,427L337,430L337,431L334,431L333,433L333,435L336,438L338,438L338,441L336,443L335,447L334,448L333,449L335,452L337,454L336,454L334,454L328,453L326,451L325,449L324,449L323,448L321,445L323,443L323,441L322,440L323,437L322,433L321,431L322,431L322,429L320,429L321,427L319,426L318,423L319,422L317,418L317,415L317,412L318,411L317,408L316,405L317,403L317,400L318,397L317,394L316,393L314,388L315,384L314,381L315,378L316,375L318,373L317,372L317,371L316,366L319,364L319,361L319,360L321,357L324,358L326,360L327,357L330,358L331,358L336,364L338,364L342,366L345,368L345,369L343,374L346,375L349,375L351,375L353,372L354,370L355,369L356,371L357,373L355,375L353,376L350,380L347,384L349,384L352,386L353,386L356,388L358,390L360,392L359,394L360,395L360,397L357,399L355,399L354,399L351,398L349,398L347,396M354,370L354,368L354,366L354,364L353,363L352,364L351,364L350,363L350,360L349,359L347,358L346,358L343,358L343,353L342,352L343,351L342,349L343,348L343,345L343,343L341,342L341,341L341,339L336,339L334,335L335,335L335,334L334,333L334,331L332,330L331,330L330,329L328,329L326,327L323,327L320,324L320,322L320,321L320,318L316,319L315,320L313,321L312,322L311,322L309,322L307,323L306,322L306,317L304,319L301,319L300,317L298,317L299,316L297,314L296,311L297,310L296,309L298,308L298,306L298,305L299,304L302,302L304,301L304,301L307,301L308,292L308,291L308,289L306,288L306,285L308,285L308,285L309,284L307,283L307,281L312,282L313,280L314,281L314,283L315,283L317,285L319,284L319,283L321,283L322,282L323,281L325,280L325,279L322,279L322,277L322,275L321,274L321,274L323,274L326,275L326,274L328,274L331,272L333,271L332,270L334,270L334,271L334,272L335,273L335,274L335,275L334,278L335,280L335,281L337,283L338,283L338,282L339,282L340,282L341,281L343,281L344,281L345,281L345,280L345,280L345,279L346,279L348,279L349,280L350,280L351,279L352,279L352,280L354,280L355,279L356,277L357,274L358,273L359,275L360,281L362,281L362,284L360,286L361,287L365,288L366,291L368,289L371,290L376,292L377,294L377,296L380,295L385,296L389,296L394,299L397,302L399,303L402,303L403,304L404,308L404,310L403,316L402,318L398,322L396,326L395,329L394,329L393,331L394,337L393,342L393,344L392,345L392,350L389,354L389,357L387,359L387,361L384,361L380,362L378,363L375,364L372,367L370,370L370,372L371,374L370,377L370,379L368,381L366,386L364,389L363,390L362,394L360,395M342,352L342,351L339,349L337,349L332,350L331,353L331,354L331,358M310,343L312,340L310,337L311,336L310,335L311,333L311,330L311,328L311,327L309,322M308,346L305,344L305,343L299,339L294,336L292,334L290,331L291,330L288,326L285,320L282,314L281,312L280,310L278,308L276,307L276,305L275,302L276,300L278,298L278,299L278,300L278,301L279,301L280,301L281,303L283,301L283,299L285,297L288,295L291,292L292,290L291,287L292,287L294,289L295,290L296,291L298,294L300,295L301,294L302,294L304,294L306,296L305,299L305,299L307,301M291,287L290,287L289,286L288,286L286,286L285,284L285,284L282,282L281,282L283,281L282,280L283,279L284,278L286,276L287,275L286,274L286,272L286,269L286,268L286,266L285,264L285,262L286,262L287,262L286,260L287,259L288,259L290,257L292,257L292,256L292,253L294,251L296,251L296,251L298,251L300,249L301,249L303,247L304,247L305,248L304,249L302,250L301,251L300,252L299,253L299,256L298,258L299,258L300,259L300,260L300,261L300,262L300,263L301,263L301,265L305,264L307,265L308,267L309,267L311,267L313,267L314,267L313,269L313,270L313,273L313,275L314,276L314,276L312,278L313,279L314,280L315,283M285,264L284,263L284,261L284,260L284,260L283,259L282,258L281,258L280,259L279,260L278,260L278,261L279,263L278,263L278,264L277,264L276,262L276,262L275,262L275,261L273,261L273,260L272,260L271,261L271,261L271,260L272,259L272,259L272,258L271,258L272,257L273,256L274,257L273,258L275,258L275,258L275,259L277,259L278,258L280,257L281,256L282,256L282,257L284,257L285,257L286,258L287,259M271,261L270,260L269,259L270,259L269,258L269,257L268,257L267,256L267,255L266,255L266,256L266,256L265,255L264,255L264,254L264,253L264,252L264,252L264,251L265,251L266,252L267,251L268,252L268,252L269,253L270,252L270,254L271,255L273,256M264,251L263,250L262,249L262,248L261,247L259,246L260,245L260,246L260,245L261,245L262,244L262,244L262,243L263,243L263,243L264,242L265,243L265,242L266,242L267,241L267,240L267,240L267,240L268,239L268,240L269,240L269,240L270,240L271,239L271,239L272,239L272,239L272,240L272,241L271,242L271,243L271,245L271,246L271,247L270,247L270,249L270,250L269,251L269,251L270,252M260,245L260,244L259,244L259,243L259,242L259,242L257,243L257,242L256,242L256,241L255,241L256,240L256,239L256,239L257,238L259,237L259,237L260,236L260,236L261,236L261,236L262,236L264,236L265,236L265,236L266,236L266,236L267,236L268,236L269,236L269,236L270,237L271,238L272,238L272,239M259,244L259,245L257,245L256,244L255,244L254,244L253,243L253,242L254,242L255,241L255,241L255,241M257,230L257,232L256,236L257,236L258,237L258,236L259,237M253,243L252,242L250,242L249,242L247,240M260,228L260,228L260,228L260,229L259,230L259,231L259,232L259,232L259,234L258,235L258,235L257,236M304,249L304,250L302,250L303,252L303,253L301,255L302,258L304,258L304,255L304,254L304,252L307,250L307,249L308,248L309,250L311,250L312,252L312,253L315,253L318,253L319,254L321,255L323,254L323,253L326,253L330,253L327,254L328,255L330,255L332,257L333,259L334,259L335,260L333,262L333,263L334,264L333,265L331,265L331,267L330,268L332,270M335,260L337,261L339,263L339,265L340,265L341,267L342,268L342,271L340,272L340,272L340,274L341,276L342,276L342,278L344,281M342,268L345,268L346,268L348,268L351,268L349,271L350,273L351,275L350,277L350,278L349,280M351,268L352,269L354,270L357,272L357,274M522,150L524,149L524,152L523,154L522,153L522,151L522,150M278,298L279,295L279,294L278,296L276,294L277,293L276,290L277,290L278,288L279,286L278,284L280,284L282,282M320,228L321,228L321,228L321,229L319,229L317,229L317,228L317,228L320,228M289,228L291,228L292,229L292,230L290,230L290,230L288,230L287,229L287,228L288,228L289,228M278,213L280,213L283,213L285,214L286,215L288,215L289,215L291,217L293,219L294,219L295,220L295,220L297,221L299,222L298,223L296,223L295,223L293,223L289,223L291,221L290,221L288,220L287,219L287,218L285,218L283,217L282,216L279,216L278,215L279,214L277,214L274,216L273,216L273,217L271,217L270,217L272,216L273,215L274,214L275,213L277,213L278,213M580,358L578,356L576,356L575,354L575,353L574,352L571,349L570,347L570,346L569,344L572,344L573,344L574,344L575,342L578,340L579,339L579,338L581,337L583,337L583,338L585,338L586,338L587,339L588,339L590,340L590,345L589,347L589,349L589,350L589,352L588,352L587,355L584,358M553,366L554,357L556,357L557,345L559,345L563,344L564,346L566,344L567,344L568,344L569,344M543,379L545,377L546,378L546,379L547,380L549,380L550,380L553,378L553,366L554,367L556,370L555,372L556,373L558,373L559,371L560,370L561,369L563,368L564,368L565,369L567,369L569,369L569,368L570,366L571,366L572,365L573,363L576,360L580,358L581,358L582,358L583,358L584,358L585,363L586,365L585,369L585,370L584,369L583,369L583,370L582,372L582,373L584,375L585,374L586,373L588,373L587,375L586,378L586,379L584,381L583,381L582,383L581,385L579,387L576,390L574,392L572,394L569,395L568,395L567,396L566,395L564,396L562,395L560,396L559,396L556,397L554,397L552,399L551,399L550,398L549,398L548,396L548,397L548,396L548,394L547,392L548,391L548,389L546,386L545,383L545,383L543,379L542,376L541,374L540,371L540,368L539,363L539,360L539,358L538,357L536,354L535,350L534,348L532,345L532,342L533,342L535,341L537,341L538,343L539,343L550,342L552,344L558,344L563,343L566,342L567,343L568,343L568,344M454,245L454,243L453,241L452,240L453,239L454,237L455,235L456,234L457,234L459,234L460,234L461,235L463,236L465,238L467,240L467,242L467,244L468,245L469,246L468,247L468,247L466,247L466,247L466,247L464,247L462,247L457,246L457,247L456,247L454,247L454,245L456,245L457,244L457,244L458,244L460,244L461,244L462,244L461,243L461,243L460,243L459,242L458,243L457,243L454,243M467,240L468,240L468,238L469,238L471,238L472,238L473,238L474,237L485,237L485,235L485,235L484,221L483,207L487,207L496,214L505,221L506,222L507,223L509,224L509,226L512,226L512,233L510,235L510,237L508,238L504,238L503,239L501,239L499,239L499,238L497,239L495,240L494,241L492,243L491,244L490,244L489,244L488,245L488,247L486,249L486,250L485,252L485,254L484,254L483,255L483,253L482,254L482,254L481,254L479,254L478,254L478,254L477,253L477,252L477,252L476,252L476,251L477,250L476,249L476,248L475,248L474,247L474,248L473,248L472,249L471,249L470,248L470,248L469,248L469,248L468,247M477,199L487,207M455,235L455,233L456,232L456,229L456,226L456,224L456,223L455,221L454,220M539,247L540,248L540,249L540,250L537,252L537,254L536,256L536,257L535,259L534,260L533,262L533,263L532,265L531,266L529,264L528,264L526,266L525,266L524,269L523,272L521,273L520,273L519,273L516,273L515,271L514,269L512,267L510,267L507,267L505,267L504,265L505,258L504,257L504,255L503,254L502,253L502,252L503,251L504,250L505,250L506,249L507,248L508,248L510,250L510,251L510,253L510,254L510,255L509,257L508,258L508,260L508,262L507,267M540,246L539,246L539,247L538,247L537,243L536,243L534,245L532,244L530,244L529,244L528,244L526,246L525,246L521,244L520,245L519,245L518,244L515,243L512,243L511,244L511,245L510,247L510,250M506,249L506,246L503,246L503,244L501,242L501,241L501,239M512,226L515,224L523,218L532,212L537,213L538,215L540,214M542,263L541,266L540,267L540,269L540,271L540,272L541,273L542,275L543,276L544,277L544,279L544,280L544,281L542,281L540,280L536,280L536,279L534,280L533,279L531,280L527,280L527,277L526,275L525,274L524,273L523,273L523,272M505,267L503,268L502,267L502,265L501,263L502,260L501,259L501,257L501,254L500,253L500,252L502,252M503,268L499,270L497,271L495,272L492,271L492,270L491,267L492,263L493,261L492,256L492,254L492,252L497,252L498,252L499,251L500,252M485,254L486,254L487,255L488,256L489,255L490,255L492,256M492,271L491,271L489,270L487,270L484,271L482,272L479,273L479,273L479,270L479,270L479,269L478,267L477,267L476,266L477,265L477,263L477,262L477,262L477,261L477,260L477,260L478,259L478,257L477,256L477,254L478,254M477,262L476,262L475,264L475,264L474,263L474,262L473,260L472,260L472,260L471,260L471,259L471,258L471,257L470,256L469,255L467,255L467,255L466,255L465,256L465,257L463,258L462,257L461,255L461,255L460,254L460,253L459,252L458,252L460,250L460,250L461,250L462,250L462,249L462,248L462,248L462,247M458,252L457,250L456,250L455,249L455,249L454,248L454,247M479,273L478,273L475,271L473,269L470,267L468,265L469,264L469,263L471,262L472,260M468,265L468,265L466,264L464,262L464,261L463,258M551,276L549,276L547,275L546,277L544,280M568,261L566,259L565,258L564,257L565,256L565,255L563,253L563,251L563,250L562,250L562,248L561,246L560,247L560,245L561,244L561,243L562,242L561,241L562,239L563,237L565,237L565,224L565,223L568,223L568,216L578,216L589,216L600,216L601,220L600,220L601,223L602,227L603,228L605,229L603,231L601,232L601,233L600,235L599,239L600,241L599,243L598,247L597,248L596,251L596,252L594,253L594,256L594,259L594,257L593,257L593,255L593,254L591,253L591,250L591,248L590,248L590,248L588,249L589,250L589,251L588,253L586,256L585,256L583,254L582,255L581,256L580,256L580,257L577,257L577,256L575,256L574,257L573,256L571,254L571,254L569,254L568,256L568,258L567,259L566,259L568,261L569,262L569,263L571,265L572,266L573,268L575,269L576,270M536,302L535,301L534,302L533,303L531,300L533,298L532,296L533,295L535,295L535,293L536,295L539,295L540,293L540,291L540,289L538,287L539,283L539,282L537,283L536,281L536,280M531,300L528,296L526,294L524,290L524,289L525,288L526,286L526,284L527,284L531,284L531,280M526,284L526,283L527,280M590,316L592,318L592,321L592,321L591,324L591,327L591,328L590,331L591,332L583,334L583,337M563,343L562,341L560,338L560,328L566,328L566,327L566,326L566,324L566,323L566,322M595,324L594,326L595,330L596,330L597,331L598,334L598,338L597,339L596,341L594,339L594,337L594,335L594,334L593,333L593,333L591,332M611,320L611,321L611,325L611,327L611,332L612,334L611,336L610,339L608,340L605,342L602,343L599,347L598,347L596,350L594,350L594,353L595,355L596,357L596,358L596,358L596,361L595,362L596,363L595,364L594,365L592,367L589,368L587,369L587,371L588,371L588,373M586,373L586,371L585,370M534,305L533,303M532,342L532,340L532,338L533,335L533,333L534,330L535,329L537,327L537,325L538,323L538,321L537,320L536,318L535,316L536,316L536,314L536,311L535,309L534,307L534,306M580,296L582,296L583,294L584,295M592,181L593,178L594,176L594,176L595,176L596,177L594,178L594,180M636,327L637,328L637,330L638,334L638,336L638,337L637,338L636,336L636,337L636,340L636,341L635,342L635,344L633,348L632,353L629,359L628,363L626,367L624,368L622,369L620,368L618,367L618,365L618,363L617,360L617,358L618,355L619,355L619,354L620,351L621,349L620,348L620,346L620,343L621,341L621,339L623,339L624,338L625,338L627,337L628,336L631,334L632,332L631,331L632,331L634,329L634,327L635,325L636,327M593,183L594,185L593,186M477,198L477,198L477,199L477,204L468,204L468,212L465,212L465,214L465,219L454,219L454,220L454,218L454,218L460,218L460,217L462,215L463,211L466,207L468,203L469,203L470,201L472,200L473,201L474,201L475,200L477,200L476,198L477,198L477,194L481,192L484,191L486,191L487,189L490,188L490,185L492,185L493,184L497,183L497,182L496,181L495,178L495,176L494,174L497,172L500,172L501,170L504,169L508,169L512,168L514,169L516,168L519,168L520,168L522,168M525,190L524,184L522,183L522,182L520,180L520,177L521,176L522,173L521,170L522,168L525,167L526,167L526,169L528,168L529,168L527,170L527,171L528,172L528,175L526,177L527,178L528,178L529,180L530,180L530,183L529,184L528,185L526,186L527,187L526,189L525,190L526,192L526,194L526,197L526,198L526,200L526,202L525,203L527,206L527,207L528,209L529,208L531,210L532,212M638,208L639,209L639,209L639,210L641,209L644,209L645,210L647,207L649,205L650,203L651,204L651,207L650,207L650,209L651,210L649,210L650,211L649,213L649,214L649,215L640,213L639,210L639,209M629,195L630,198L632,199L632,200L634,201L634,203L634,204L635,205L636,206L636,207L637,207L636,205L637,203L637,203L638,204L639,206L638,208L637,208L637,207M602,180L607,176L608,172L607,170L608,169L609,167L610,167L613,167L614,168L616,168L618,171L620,172L620,174L619,175L619,178L621,181L624,183L626,185L626,187L627,187L627,189L629,191L627,191L628,192L628,193L629,195L627,195L626,194L624,193L625,190L627,191M624,193L619,193L611,187L606,184L603,184M651,207L653,209L655,210L657,211L658,211L660,213L661,214L662,215L662,215L661,217L660,218L659,219L659,221L657,221L657,222L657,224L657,226L657,226L656,226L654,227L654,229L653,230L652,230L651,230L651,232L650,233L648,232L646,233L645,234L644,231L641,226L649,223L651,216L649,214M650,203L651,202L651,202L651,204L651,204M957,338L958,340L957,340L957,339L957,338M956,337L956,336L956,334L958,335L957,337L957,337L956,337M782,248L781,244L782,241L786,241L788,241L791,242L792,240L794,241L795,244L795,247L791,250L792,252L789,252L787,253L785,253L784,251L782,248L779,246L777,246L777,244L775,244L775,248L774,252L773,255L773,257L775,257L777,260L777,263L779,265L781,265L782,267L781,268L779,269L779,267L777,266L776,266L775,265L775,263L773,262L772,260L771,262L771,260L771,258L771,255L772,252L774,249L772,246L772,244L772,243L770,240L769,238L770,238L770,235L769,233L767,231L765,228L766,227L767,224L769,224L770,222L772,221L773,222L773,224L775,225L775,228L776,231L778,229L779,229L781,229L781,228L783,228L786,231L786,234L789,237L789,240L788,241M772,221L772,220L774,218L774,219L776,219L775,215L776,215L778,217L780,220L783,220L785,223L783,224L782,225L786,227L789,231L791,234L793,236L794,238L794,241M771,255L771,253L772,250L770,248L770,245L769,243L768,239L767,235L765,233L764,234L761,237L759,236L757,236L758,232L757,229L754,225L754,224L753,223L750,221L750,218L751,219L751,216L752,215L751,214L752,213L751,210L753,210L754,208L754,206L755,203L754,202L757,199L759,200L759,198L760,197L759,196L761,196L762,198L763,199L764,201L764,204L762,206L763,210L766,210L767,213L769,213L768,216L770,217L772,218L774,217L774,218M776,215L777,214L779,214L782,214L784,212L785,213L788,214L788,216L790,217L792,218L789,221L788,224L787,226L790,229L793,233L796,235L798,238L800,244L800,250L798,252L795,254L793,256L790,259L789,257L789,255L787,253M986,343L987,342L987,343L986,345L985,346L983,345L983,344L985,343L986,343M830,151L829,151L829,152L829,153L830,156L829,156L829,157L828,158L827,158L826,159L826,161L826,161L827,161L830,163L829,164L828,164L827,164L826,165L825,165L825,166L824,165L824,166L823,166L823,165L822,165L821,164L821,163L821,163L821,162L821,160L820,160L819,160L817,159L818,157L820,155L821,153L823,154L825,154L824,152L827,151L827,149L830,151M830,163L833,167L835,169L836,172L836,174L834,175L832,176L830,176L829,175L829,172L826,169L828,168L825,166M783,127L783,130L783,133L784,134L785,134L788,134L789,133L792,134L795,136L796,137L793,137L790,137L789,138L788,140L785,141L783,143L780,143L779,142L778,144L780,145L780,147L779,148L778,149L776,150L772,151L768,152L766,153L764,152L761,152L757,150L754,150L751,150L746,150L743,150L741,148L738,145L737,145L733,143L729,142L726,142L725,140L724,137L722,134L718,133L715,131L714,129M751,216L748,211L748,211L747,213L746,212L746,210L747,210L748,207L746,206L744,206L741,206L741,204L739,203L737,202L736,204L739,206L737,207L737,208L739,209L738,211L740,214L741,216L740,217L739,217L735,218L736,220L735,222L731,224L729,228L727,230L724,232L724,234L723,235L721,236L720,236L719,238L720,243L720,245L719,248L720,254L718,254L717,256L718,257L716,258L715,260L714,261L711,258L710,254L708,251L707,249L706,246L705,242L704,240L701,236L699,229L698,225L698,221L697,218L693,220L691,220L687,216L688,215L687,214L684,211L685,209L691,209L690,206L688,204L688,202L686,200L688,197L691,197L693,194L695,191L696,187L696,185L698,183L695,182L694,179L693,177L694,175L698,176L700,176L702,173L706,177L706,179L708,181L708,183L706,182L708,186L711,188L715,190L713,191L713,194L716,196L718,197L722,199L726,199L728,201L730,201L733,202L736,202L736,201L735,199L735,197L736,197L737,199L737,200L740,201L741,201L744,201L746,201L746,199L744,198L746,197L748,195L751,193L753,194L755,192L757,194L756,196L759,196M750,221L749,219L749,217L748,216L747,214L744,214L745,215L744,217L743,216L743,217L742,216L741,216M737,199L738,197L740,196L742,197L743,197L744,198M715,190L716,189L718,190L721,192L723,193L724,194L726,195L728,196L732,197L735,197M684,211L682,210L680,208L678,205L673,206L669,206L665,206L666,203L669,201L669,200L667,199L667,196L664,195L663,193L661,191L666,193L669,192L670,193L671,192L673,192L676,191L675,188L677,186L679,186L679,185L681,185L682,185L682,184L682,183L683,181L684,180L683,178L685,178L686,177L685,175L686,174L686,172L685,171L686,170L689,169L692,169L693,168L694,168L696,169L698,172L702,173M675,168L676,168L678,167L679,168L679,166L681,166L681,166L681,164L682,163L683,164L683,165L684,165L685,168L686,169L687,168L688,168L689,166L691,167L693,167L694,168M661,191L663,188L663,186L661,186L660,184L659,181L660,179L658,179L659,176L659,172L662,174L664,173L664,172L666,171L667,170L667,168L669,167L669,166L671,167L672,167M681,158L680,159L677,158L678,160L680,160L684,161L688,160L690,163L691,163L692,164L693,165L693,167M703,151L703,152L699,153L698,155L695,155L695,157L692,157L691,157L688,159L689,160L688,160M659,172L658,170L656,170L653,167L651,166L648,165L646,164L645,165L643,165L641,167L639,167L638,165L638,162L636,161L636,159L634,158L635,156L637,156L639,155L637,153L636,152L634,152L634,155L633,153M616,168L614,165L614,164L613,160L614,159L615,161L617,162L618,162L619,162L622,160L623,160L624,161L623,162L625,164L626,164L627,166L629,167L631,168L635,169L639,168L639,167M665,206L660,205L657,205L654,204L652,200L651,200L649,200L646,202L643,201L640,198L637,197L635,194L633,190L631,191L629,190L629,191M594,176L593,173L594,172L594,171L595,170L595,169L596,169L599,168L600,169L602,169L605,168L606,168L609,167M618,162L617,161L617,160L616,160L615,159L614,159L613,158L611,158L611,156L611,155L614,154L615,155L616,156L615,157L617,158L616,159L618,160L619,160L619,162M543,71L546,72L550,74L551,79L552,80L548,80L546,82L547,84L544,86L540,89L538,93L540,95L543,97L541,100L538,101L538,105L537,108L534,108L533,110L530,111L529,108L527,104L525,100M576,120L574,121L573,121L573,123L572,123L570,123L570,122L569,122L568,122L566,122L563,121L561,121L559,121L558,122L556,122L556,121L555,119L557,119L557,117L556,116L556,115L558,115L560,114L561,112L562,111L562,110L563,109L566,108M594,136L592,136L591,137L589,137L587,139L587,140M583,139L583,139L585,139L586,139L587,140L587,140L587,140L588,141L591,141L590,142L588,143L585,145L583,144L584,142L581,142L581,141L583,140L583,139L583,139L579,138L578,137L576,138L575,139L574,142L572,141L571,142L570,141L571,141L571,140L572,139L571,138L572,138L572,138L574,138L574,138L574,138L574,137L573,136L572,135L571,135L571,134L570,133L569,133L567,132L566,132L565,132L564,132L564,133L562,133L561,134L560,133L558,133L557,133L556,133L555,133L554,132L554,131L555,130L556,130L555,129L557,126L558,126L558,125L556,122M555,130L553,129L551,129L550,129L548,129L547,128L546,129L546,128L545,127L543,127L542,126L541,125L540,126L539,126L539,125L537,124L536,123L535,122L535,120L534,119L533,118L534,117L533,115L535,114L539,113L541,112L544,113L544,113L546,113M554,114L549,114L546,113L547,112L550,111L552,112L553,112L553,113L554,114L555,114L556,115M556,133L554,134L553,136L552,138L550,139L549,139L547,140L546,140L544,140L542,138L541,138L540,137L540,137M542,133L542,134L540,134L541,135L540,137L540,137L537,137L536,138L534,138L531,137L530,136L528,136L527,137L526,137L524,136L523,136L524,135L524,135L524,134L526,135L526,134L528,135L530,134L531,134L532,135L532,134L532,132L532,132L533,130L535,131L536,130L537,130L539,131L540,131L541,131L541,132L542,133L543,134L544,134L546,133L546,133L547,133L548,132L548,132L550,132L550,131L551,131L554,132L554,132M570,141L570,140L570,138L569,137L568,135L567,134L566,133L565,132M574,142L574,142L573,143L572,143L572,147L570,146L568,145L565,146L564,147L560,147L558,146L558,146L557,145L556,144L557,144L556,143L555,144L554,143L553,142L552,141L552,140L550,139M550,111L549,108L552,108L556,108L558,107L558,108L560,108L562,110M549,108L549,106L550,104L552,103L554,106L556,106L556,103L558,103L559,103L561,104L563,104M556,103L556,101L555,102L554,101L553,99L556,98L559,98L561,98L564,98M536,123L535,124L534,123L534,124L532,125L531,125L530,126L530,127L530,128L532,129L533,130M524,135L521,134L520,134L518,134M515,129L516,129L520,130L519,132L518,134L518,135L517,135L517,135L515,137L515,139L516,138L517,139L517,140L518,141L517,142L518,145L519,145L519,147L516,148L511,148L508,149L508,151L505,151L502,150L501,150L496,149L495,148L497,146L497,139L495,136L493,134L489,133L489,131L492,130L496,131L495,128L498,129L503,127L504,124L506,123L506,124L508,124L509,126L510,127L512,127L514,128L514,129L515,129L515,127L515,127L515,124L514,121L516,121L516,120L517,117L516,116L517,116L519,115L519,116L521,115L520,113L520,112L522,112L523,112L523,113L526,114L526,115L528,114L530,113L532,114L533,115M572,147L570,148L570,150L571,152L569,152L566,153L566,154L564,154L562,153L560,154L558,154L558,152L557,151L557,151L557,150L557,149L558,148L556,147L556,146L557,145M568,174L568,174L564,175L564,174L561,174L562,172L563,173L565,173L567,173L567,174L568,174M566,153L567,153L567,155L566,156L565,156L563,155L560,156L562,158L561,159L560,159L558,157L558,158L558,160L560,161L559,162L560,163L562,164L562,166L560,165L560,167L559,167L560,170L558,170L556,169L555,166L554,164L553,162L552,161L552,160L553,158L553,157L553,157L553,156L555,155L556,155L557,155L558,154L558,154M594,172L593,170L594,169L592,169L590,169L588,171L584,171L582,169L579,169L579,170L577,171L574,169L572,169L570,166L568,164L569,162L567,160L569,157L573,157L574,155L579,155L582,153L585,152L589,152L594,154L597,155L600,155L603,155L605,154L608,153L611,155M571,152L571,153L574,154L573,155L570,155L569,156L567,158L566,156L566,156M552,160L551,159L551,159L549,158L549,156L549,154L549,153L549,152L549,151L550,150L550,150L551,150L551,151L552,151L552,153L552,154L552,155L553,156M547,140L547,141L548,142L547,143L546,142L544,142L542,142L541,142L541,143L540,142L539,143L541,145L541,146L542,147L543,147L544,149L547,150L547,151L544,149L543,148L540,147L538,145L538,145L537,143L537,142L535,142L535,143L534,142L534,141L534,141L536,141L536,141L537,141L538,141L538,140L539,140L539,139L541,138M526,137L526,138L525,138L523,138L522,139L521,139L521,139L519,140L518,140L517,139M514,128L514,127L515,127M506,123L508,123L510,123L512,122L514,124L515,124M508,123L509,122L511,117L514,116L516,116M477,152L478,152L479,151L480,153L481,153L482,152L483,152L484,154L483,155L483,157L482,158L482,159L481,160L482,162L481,164L482,165L482,165L481,167L481,168L480,169L478,168L477,168L477,166L477,164L476,164L476,162L476,160L477,159L477,158L478,156L478,155L477,154L477,152L477,150L476,149L480,147L483,147L486,147L489,148L491,147L495,148M508,151L508,152L505,155L502,155L502,156L500,158L499,161L500,162L499,164L498,166L496,167L494,169L491,169L489,169L487,170L486,171L485,171L484,170L483,168L481,168M482,111L484,111L487,113L485,115L486,117L484,120L479,122L476,121L478,118L477,115L480,113L482,111L483,113L482,114L484,114L485,115M949,355L951,357L952,358L950,359L949,358L948,356L946,355L945,352L945,351L946,351L948,353L948,354L949,355M946,320L947,322L945,322L944,320L946,320L946,320M945,318L945,318L943,315L943,314L944,314L944,316L945,318M943,319L942,319L940,318L940,318L940,317L942,317L943,318L943,319M940,313L941,314L941,314L939,313L938,312L937,311L937,310L938,311L940,313M934,309L935,310L934,311L933,310L932,309L932,308L934,309M951,416L949,417L947,420L944,421L944,420L943,419L946,417L947,415L945,414L945,413L948,412L950,409L951,407L951,405L951,404L951,403L950,400L950,398L951,398L952,399L954,400L953,403L953,406L954,404L955,405L954,408L955,409L957,409L959,408L960,408L958,411L956,413L954,413L953,414L952,415L951,416M926,427L929,425L932,423L934,421L936,420L937,418L940,417L940,418L940,420L942,418L942,420L941,421L939,423L936,425L934,426L934,428L932,428L929,429L927,431L923,434L920,436L918,436L916,436L915,435L913,435L913,434L916,432L921,429L923,428L926,427M876,418L877,418L875,422L874,423L872,426L872,425L869,427L868,427L867,427L867,424L867,422L867,419L868,418L870,418L872,419L873,419L876,418M832,390L828,392L826,393L825,394L823,396L821,396L819,396L817,396L815,396L813,396L811,398L811,398L809,399L807,400L805,399L804,399L802,397L800,397L801,395L803,394L803,394L803,393L805,390L805,388L804,385L805,383L805,382L805,379L805,378L804,377L804,375L804,372L803,371L804,372L804,369L805,370L806,371L806,370L805,367L805,366L805,365L806,363L806,362L807,361L807,359L809,357L808,359L810,357L813,356L814,354L816,353L818,353L818,353L821,352L822,352L823,351L824,351L825,351L828,350L830,349L831,347L833,345L833,344L834,342L836,339L837,342L838,342L837,340L838,339L839,339L840,337L842,335L843,334L844,333L844,333L846,333L846,332L847,332L848,331L850,333L851,335L853,335L855,335L855,333L856,331L858,330L857,329L859,327L861,326L862,326L864,326L864,324L863,323L864,323L866,323L867,325L869,325L870,325L872,326L873,325L874,326L875,325L876,326L875,328L874,329L873,330L873,331L872,332L871,334L871,335L873,337L875,338L876,339L878,341L878,341L880,342L880,343L882,344L884,343L885,341L886,339L887,338L888,335L888,334L888,333L888,331L889,328L889,328L889,327L890,325L891,323L891,322L892,321L893,323L893,325L893,325L893,326L894,328L894,330L894,331L894,334L896,332L897,334L898,335L897,336L898,339L898,341L898,341L898,344L898,346L898,348L901,349L902,351L904,352L903,353L904,355L904,359L906,358L906,359L907,359L907,362L908,364L909,365L910,368L910,371L910,372L909,374L909,377L908,380L907,382L905,384L904,386L903,389L900,391L898,393L896,396L894,397L892,400L890,402L889,404L887,406L887,407L885,408L882,408L879,410L877,411L875,412L874,411L872,410L873,409L872,409L868,412L867,411L865,410L864,410L862,409L861,407L862,405L862,403L861,402L859,401L860,400L861,397L859,400L856,400L858,398L859,397L861,395L862,393L858,395L856,396L854,399L853,398L854,396L853,394L852,392L853,392L850,390L848,390L846,388L841,388L838,390L834,391L832,390M726,263L725,266L724,267L722,268L721,265L720,261L721,255L723,257L724,260L726,263M798,229L796,228L795,225L796,223L799,222L801,223L802,224L801,225L800,227L798,229M817,159L814,160L813,161L810,162L811,160L810,159L811,157L809,155L807,157L805,159L805,161L802,161L802,162L804,165L806,165L807,167L809,168L811,165L814,167L816,167L817,168L813,169L813,171L811,173L810,175L814,177L816,180L819,183L821,185L822,188L820,188L822,190L824,191L824,194L824,196L823,197L822,200L821,204L819,208L816,211L813,214L810,214L808,216L807,215L806,216L803,218L800,218L800,222L798,222L797,220L797,218L794,217L792,218M827,209L827,214L826,216L824,214L824,211L824,208L826,206L827,207L827,209M534,138L534,139L535,141L533,140L531,141L531,143L531,144L532,145L534,147L535,150L538,152L540,152L541,153L540,154L543,155L545,156L547,157L547,158L547,159L545,158L543,157L542,159L544,160L544,162L543,162L541,165L540,165L540,164L541,162L541,162L540,160L539,158L538,158L537,157L536,156L535,155L533,154L531,153L528,151L526,149L526,146L524,146L522,145L521,145L520,146L519,147M538,164L540,164L539,167L540,168L539,169L537,168L536,168L532,166L532,164L535,165L538,164M522,156L523,155L525,157L525,161L524,161L523,162L522,161L521,157L521,155L522,156M520,112L519,110L519,107L519,106L520,105L522,105L523,104L524,103L524,105L524,106L524,107L525,107L525,108L524,108L523,110L523,112M529,108L530,110L528,112L526,111L525,109L529,108M493,116L493,116L493,115L491,113L491,113L489,112L488,111L489,110L488,109L487,111L487,108L486,106L487,103L489,101L490,101L493,101L491,104L493,104L495,104L495,106L493,109L495,109L495,109L497,113L499,113L500,117L501,118L504,118L504,120L503,121L503,123L501,125L498,124L494,125L493,125L491,126L489,126L487,127L486,126L490,123L492,122L492,122L488,122L487,121L490,120L489,118L489,116L493,116M469,78L468,80L470,82L467,84L461,86L459,87L456,86L450,85L452,84L448,83L452,82L452,81L447,81L449,79L452,78L455,80L459,79L462,80L465,78L469,78M623,153L625,154L626,157L628,157L628,158L626,158L626,160L626,161L625,162L626,164M614,154L615,154L617,155L618,155L618,155L617,153L617,153M605,154L605,152L605,150L603,149L601,148L600,147M832,246L830,244L832,244L834,245L833,248L832,246M838,255L838,254L838,252L840,252L840,254L841,251L841,254L840,255L840,257L839,258L837,256L838,255M848,260L849,262L849,264L848,267L847,264L846,265L847,268L846,269L843,267L842,265L843,263L841,262L840,263L839,263L837,265L836,264L837,261L839,260L840,259L842,261L844,260L844,258L846,258L845,256L848,257L848,259L848,260M827,257L823,260L824,258L826,256L828,254L829,251L829,253L828,255L827,257M833,229L833,230L834,232L834,235L833,236L833,238L834,241L835,241L836,241L840,243L840,245L841,245L841,247L838,245L837,244L837,245L835,243L832,243L831,243L831,241L831,240L831,240L830,241L829,239L828,238L828,234L829,236L828,231L829,228L830,228L832,229L833,228L833,229M836,250L835,249L837,250L839,250L839,251L837,253L836,253L836,252L836,250M845,248L846,252L844,251L844,252L845,254L844,254L843,252L842,252L842,250L843,250L843,249L841,247L844,247L845,248M782,267L783,267L784,269L786,271L786,274L786,275L786,276L786,278L787,279L788,282L788,283L786,283L784,281L780,278L780,276L778,274L778,272L777,270L777,268L776,266M816,272L817,271L819,269M534,141L535,141M563,95L559,96L555,97L552,97L550,96L548,95L548,92L547,89L548,88L549,86L554,83L555,82L555,81L552,80M541,131L542,131L543,131L544,130L544,130L544,130L544,129L545,129L545,128L546,128M605,229L606,233L607,236L609,237L613,241L614,242L616,244L617,245L618,246L618,247L616,247L615,246L614,244L613,243L612,242L610,240L608,240L607,240L606,240L604,239L603,241L600,241M863,161L863,164L864,168L864,170L865,172L865,174L862,176L858,176L856,179L853,178L852,176L848,176L846,178L842,178L846,180L846,186L845,187L843,186L843,183L841,182L839,180L841,179L842,177L844,175L845,173L850,172L853,173L853,167L855,169L858,165L859,164L858,160L856,157L856,155L859,154L862,158L863,161M862,146L863,144L866,148L863,149L862,152L857,150L857,153L855,153L853,150L853,148L855,148L853,143L853,141L858,144L860,145L862,146M847,179L847,178L849,178L850,177L852,177L852,178L852,180L850,179L849,180L849,182L847,181L847,179M645,234L643,234L643,236L643,237L640,238L636,240L633,242L632,242L631,242L630,243L628,244L626,244L625,244L625,245L624,245L624,246L622,246L621,247L619,246L619,245L619,243L618,242L617,240L617,238L617,238L617,237L617,236L617,235L618,234L618,232L618,231L619,231L620,231L623,231L624,231L627,232L628,232L628,233L630,232L631,229L634,227L641,226M617,235L616,233L616,232L615,231L614,230L612,227L611,224L609,222L608,222L606,219L606,216L605,215L604,211L602,210L601,209L600,207L600,206L599,205L598,204L597,202L595,199L594,197L592,197L593,195L593,194L593,193M588,174L589,175L586,176L585,175L584,174L585,174L585,174L586,173L588,173L590,172L588,174L588,174L588,174L588,174L587,174L587,174L587,174L587,174L586,174L586,174L585,174M454,218L454,217L455,216L456,214L456,213L457,211L459,209L459,208L460,206L460,205L461,203L463,201L465,198L465,198L466,197L469,197L471,194L472,193L475,191L474,187L475,184L476,182L477,180L480,179L482,177L484,174L485,172L487,172L488,173L491,173L493,174L494,174M568,216L567,205L566,193L565,190L566,188L565,187L566,186L570,185L572,186L575,187L576,188L578,187L579,186L582,186L584,186L584,188L585,187L587,187L589,187L590,187M594,182L593,183L592,182L592,185L593,185L592,185L592,186L593,186L593,187L593,192L592,191L590,187L591,186L591,185L591,184L592,181L592,181L592,181L593,181L593,180L594,180L594,181L594,182L594,182L597,183L602,180L603,184L603,184L598,186L600,189L600,189L599,191L597,191L597,192L596,193L593,193L593,192L592,193L592,196L591,198L590,198L589,197L588,196L586,191L586,191L587,195L589,198L591,203L592,205L593,207L596,210L596,211L596,213L599,216L600,216M530,180L533,182L534,181L537,182L540,183L541,186L544,187L548,188L551,190L552,189L553,187L552,185L553,183L555,182L557,181L560,182L561,184L562,184L563,184L566,184L566,186M598,269L596,266L595,265L594,264L593,262L591,262L592,260L593,260L594,259M616,247L615,248L615,250L615,251L615,252L616,252L617,251L618,252L617,253L618,255L619,256L620,258L630,261L632,261M618,246L619,247L619,249L617,249L619,250L618,252M619,250L620,251L620,252L621,253L623,253L625,253L628,252L631,251L632,251L633,250L635,250M584,291L582,292L582,291M585,276L586,275L588,276L590,275L592,275L594,273M547,143L548,143L548,144L549,146L549,147L548,147L548,148L547,148L547,150M552,153L552,153L552,152L554,151L555,151L555,151L557,151M555,151L554,151L555,151L555,150L555,150L554,149L554,149L553,149L553,148L552,148L552,148L552,149L551,149L551,149L550,149L549,148L549,148L548,147M549,152L548,152L548,151L547,151M551,149L551,150M330,252L332,252L332,252L332,255L330,255L329,255L330,254L330,252';

function WorldMap() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_65%,transparent_100%)]">
      <svg
        viewBox="0 30 1000 440"
        preserveAspectRatio="xMidYMid meet"
        className="h-auto w-[230%] max-w-none text-blue-400 drop-shadow-[0_0_6px_rgba(59,130,246,0.35)] sm:w-[160%] lg:w-full">
        <path d={WORLD_MAP_PATH} fill="none" stroke="currentColor" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
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
      <WorldMap />
      <div className="relative mx-auto max-w-6xl border-t border-white/10 pt-6">
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
          <Reveal className="mx-auto w-full max-w-md lg:max-w-none">
            <PixelPortrait />
          </Reveal>

          <Reveal delay={100}>
            <Mono className="text-blue-400">01 // About</Mono>
            <h2 className="mt-4 text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Builder. Operator. Organizer.
            </h2>
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

function Ecosystems() {
  return (
    <section id="ecosystems" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          index="02"
          eyebrow="Ecosystems"
          title="Where I build and organize."
          sub="Real roles in real communities: producing global events, supporting builders, and organizing for clear crypto policy."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {ECOSYSTEMS.map((e, i) => {
            const Icon = e.icon;
            return (
              <Reveal key={e.org} delay={i * 100} className="h-full">
                <Card className="flex h-full flex-col p-7 transition-colors duration-200 hover:border-blue-500/30 sm:p-8">
                  <div className="flex items-start justify-between gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600/10 text-blue-400">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="flex items-center gap-1.5 rounded-full border border-blue-500/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-blue-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Active
                    </span>
                  </div>
                  <h3 className="mt-6 text-2xl font-bold tracking-tight text-white">{e.org}</h3>
                  <Mono className="mt-2 text-blue-400">{e.role}</Mono>
                  <p className="mt-4 flex-1 text-[15px] leading-relaxed text-slate-400">{e.body}</p>
                  <ul className="mt-6 space-y-2 border-t border-white/5 pt-6">
                    {e.points.map((p) => (
                      <li key={p} className="flex items-center gap-2.5 text-sm text-slate-300">
                        <Check className="h-4 w-4 shrink-0 text-blue-500" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </Card>
              </Reveal>
            );
          })}
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
          index="03"
          eyebrow="Services"
          title="Three disciplines. One operator."
          sub="Run the room, sharpen the business, and ship the website. You work directly with me."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.n} delay={i * 100} className="h-full">
                <Card className="flex h-full flex-col p-7 transition-colors duration-200 hover:border-blue-500/30 sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-4xl font-bold tracking-tight text-blue-500">{s.n}</span>
                    <Icon className="h-5 w-5 text-slate-500" />
                  </div>
                  <h3 className="mt-6 text-2xl font-bold tracking-tight text-white">{s.title}</h3>
                  <p className="mt-4 flex-1 text-[15px] leading-relaxed text-slate-400">{s.body}</p>
                  <div className="mt-8 flex flex-wrap gap-1.5">
                    {s.tags.map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>
                </Card>
              </Reveal>
            );
          })}
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
          index="04"
          eyebrow="Contact"
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
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    .sp-ping, .sp-bob { animation: none; }
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
