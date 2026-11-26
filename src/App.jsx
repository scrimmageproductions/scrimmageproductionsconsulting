import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Info,
  Loader2,
  Mail,
  MapPin,
  Maximize2,
  Menu,
  Plus,
  X,
} from 'lucide-react';
import {
  FAQ_CATEGORIES,
  FAQ_DESCRIPTION,
  FAQ_FACTS,
  FAQ_PATH,
  FAQ_TIPS,
  FAQ_TITLE,
  FAQS,
  SERVICE_AREA,
  faqJsonLd,
} from './faqData.js';

/* ------------------------------------------------------------------ */
/*  Configuration                                                      */
/* ------------------------------------------------------------------ */

const SITE_DOMAIN = 'scrimmy.xyz';
const CONTACT_EMAIL = 'hello@scrimmy.xyz';
const CALENDLY_URL = 'https://calendly.com/youngscrimmage';
// The Contact form posts here: a Vercel serverless function (api/send.js) that sends through Resend.
// The Resend key stays in Vercel's environment variables; nothing secret ships to the browser.
const CONTACT_ENDPOINT = '/api/send';

const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'ecosystems', label: 'Ecosystems' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
];

// Routes: the one-page home plus two standalone pages. Plain history-API routing, no router dependency.
// vercel.json rewrites /website-services to index.html, and /faq to the prerendered faq/index.html.
const WEB_SERVICES_PATH = '/website-services';
const WEB_SERVICE_NAME = 'Custom Web & Creative Solutions';
const PAGE_PATHS = { home: '/', web: WEB_SERVICES_PATH, faq: FAQ_PATH };
const routeFromPath = (path) => {
  const clean = path.replace(/\/+$/, '') || '/';
  return Object.keys(PAGE_PATHS).find((r) => PAGE_PATHS[r] === clean) ?? 'home';
};
const initialRoute = () => (typeof window === 'undefined' ? 'home' : routeFromPath(window.location.pathname));

const HOME_TITLE = 'SCRIMMY // Don Scrimmy John';
const HOME_DESCRIPTION =
  'Builder, operator and community organizer across Web3 and tech. Producing global events, consulting on operations, and shipping high-velocity web software.';
const PAGE_META = {
  home: { title: HOME_TITLE, description: HOME_DESCRIPTION },
  web: {
    title: `Website Services // ${SITE_DOMAIN}`,
    description:
      'Bespoke, hand-coded websites for Quad Cities businesses: custom business sites, landing pages and lead funnels, and redesigns of Wix, Squarespace or WordPress sites.',
  },
  faq: { title: FAQ_TITLE, description: FAQ_DESCRIPTION },
};

// Hamburger menu: the home sections, with the two standalone pages slotted in before Contact.
// FAQ & Info lives only here; it is deliberately not linked from the top bar or the home page.
const MENU_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'ecosystems', label: 'Ecosystems' },
  { id: 'services', label: 'Services' },
  { id: 'web', label: 'Website Services', page: true },
  { id: 'faq', label: 'FAQ & Info', page: true },
  { id: 'contact', label: 'Contact' },
];

const PROJECT_TYPE_LINE = `Project type: ${WEB_SERVICE_NAME}`;

const ALIASES = ['Young Scrimmage', 'Don Scrimmy John'];
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
    body: 'Started as a note-taker and climbed the ranks to lead operations for the largest global pizza party in existence. Spearheaded multi-timezone logistics, international communications, and cross-border marketing to coordinate simultaneous celebrations across 400+ cities and 100+ countries, onboarding the world by decentralizing joy.',
    points: [
      '400+ cities & 100+ countries coordinated',
      'Assisted with global comms and marketing efforts',
      'International venue & indie pizzeria logistics',
    ],
  },
  {
    logo: '/team1.png',
    org: 'Avax Team1 USA',
    role: 'Member',
    body: 'Team1 USA member pushing the Avalanche ecosystem forward. Recently promoted from collaborator and already architecting and executing high-impact, scaled cross-community partnerships that expand builder mindshare and drive strategic value across Avax Team1.',
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
    title: 'Event Production & Logistics',
    body: 'Full-scale live and decentralized event management. I coordinate multi-city runs-of-show, secure local venue and vendor contracts, direct sponsor activations, and assist with global onchain payment distribution across time zones.',
    tags: ['RUN-OF-SHOW', '400+ CITIES', 'SPONSORS', 'VENDORS'],
  },
  {
    n: '02',
    title: 'Operations & Marketing Consulting',
    body: "Fixing what's broken in your business. I audit internal toolchains, clear operational bottlenecks, structure ecosystem partnerships, and wire up automated lead-routing pipelines so work stops slipping through the cracks.",
    tags: ['WORKFLOW AUDITS', 'PARTNERSHIPS', 'LEAD ROUTING', 'PIPELINES'],
  },
  {
    n: '03',
    title: 'Custom Web & Creative Solutions',
    body: 'Bespoke digital architecture, clean interfaces, and custom creative solutions for your business or idea. This entire site is proof of work with high-speed performance, tailored styling, and zero generic template drag. If you can envision it, we can build it together.',
    tags: ['BESPOKE DESIGN', 'REACT 19', 'CUSTOM STACK', 'PROOF OF WORK'],
    page: 'web',
  },
];

const PERKINS_URL = 'https://perkinslawnandsnow.com';
const PERKINS_TAGS = ['CUSTOM BUILD', 'MOBILE-FIRST', 'LEAD CAPTURE', 'LIVE SITE'];

// Section captures of the live Perkins site: desktop at 1440x900 (saved 1.5x) and phone at 390x844 (2x).
const perkinsShot = (key, desktopAlt, mobileAlt) => ({
  desktop: { src: `/work/perkins-${key}-desktop.webp`, w: 2160, h: 1350, alt: `Perkins Lawn & Snow on desktop: ${desktopAlt}` },
  mobile: { src: `/work/perkins-${key}-mobile.webp`, w: 780, h: 1688, alt: `Perkins Lawn & Snow on a phone: ${mobileAlt}` },
});
const PERKINS_SLIDES = [
  {
    key: 'hero',
    n: '01',
    label: 'Hero',
    ...perkinsShot(
      'hero',
      'hero photo of the work truck and mower with the Perkins logo, tagline and Get in Touch button.',
      'compact header, truck photo, and the Get in Touch call to action.',
    ),
  },
  {
    key: 'services',
    n: '02',
    label: 'Services',
    ...perkinsShot(
      'services',
      'Services We Offer, with grounds and landscaping, snow and trucking, and property maintenance cards.',
      'Services We Offer intro and the grounds and landscaping checklist.',
    ),
  },
  {
    key: 'about',
    n: '03',
    label: 'About & Fleet',
    ...perkinsShot(
      'about',
      'Since 2001 family business story beside a photo of the branded Perkins truck door.',
      'Since 2001 heading, family business intro and the branded truck photo.',
    ),
  },
  {
    key: 'quote',
    n: '04',
    label: 'Quote Form',
    ...perkinsShot(
      'quote',
      'Get Your Free Quote form with name, email, phone, service and project detail fields.',
      'Get Your Free Quote intro, address, phone and the commercial-only note above the form.',
    ),
  },
];

const WEB_BUILDS = [
  {
    n: '01',
    title: 'Custom Business Websites',
    body: 'Ground-up design and code tailored to local businesses, agencies, and founders.',
    tags: ['BESPOKE DESIGN', 'FAST LOAD TIMES', 'ZERO TEMPLATES'],
  },
  {
    n: '02',
    title: 'Landing Pages & Lead Funnels',
    body: 'Focused pages engineered to turn visitors into booked calls and paying customers.',
    tags: ['CONVERSION FOCUSED', 'CUSTOM FORMS', 'SEO READY'],
  },
  {
    n: '03',
    title: 'Website Redesigns & Upgrades',
    body: 'Replacing sluggish Wix, Squarespace, or WordPress templates with fast, modern interfaces.',
    tags: ['UI OVERHAUL', 'SPEED UPGRADE', 'MOBILE UX'],
  },
];


/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

async function sendContact(payload) {
  const res = await fetch(CONTACT_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({ error: `Non-JSON response (HTTP ${res.status})` }));
  if (!res.ok || !data.success) {
    const err = new Error(data.error || 'Message failed to send');
    err.data = { status: res.status, ...data };
    throw err;
  }
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

// Boot sequence on first entry (per session):
//   0-1440ms   raster pass: each of the 41 pixel columns ignites 32ms after the one to its left
//              (faint cell → #3b82f6 flash → white over 160ms), from S's first column to Y's last
//   1440-1690  SCRIMMY rests alone, fully white
//   1690       phosphor stamp-in: nav, status pill, aliases, intro and buttons all strike at once in place
//                +0-350ms     coordinate hold: 30% opacity under a dot-matrix grid, greyscale, high contrast
//                +350-525ms   buffer shred, six hard-cut frames (no easing):
//                               350-375  anamorphic slit-scan: hero smeared to scaleX(5) scaleY(0.12), overdriven
//                               375-405  macro shred: upper band -48px, blue blockout band +30px, lower band
//                                        -18px, under a 2px interlace
//                               405-430  ribbon shatter: five slices at +36 / -28 / +42 / -16 / +22px
//                               430-460  interlace blanking: hero at 15% through 1px scanlines
//                               460-490  micro-smear: scaleX(2.2) scaleY(0.6), blue glow, cyan/white split
//                               490-525  coordinate lock: resting position, 12px blue rim glow on the pills
//                +525-725ms   the rim glow eases out into normal styling
//                The navbar takes the same flashes, blanking and split but no geometry.
//   2440       (+750ms) boot classes and the shred copies are removed, so the normal interactive state and
//              the scroll-driven dissolve take over with no filter, mask or shadow left behind
const BOOT_KEY = 'scrimmy_assembled';
const BOOT_COL_STEP = 32;
const BOOT_IGNITE_MS = 160;
const BOOT_LOCK_MS = 250;
const shouldBoot = () => {
  if (typeof window === 'undefined' || prefersReducedMotion() || window.scrollY > 0) return false;
  try {
    return sessionStorage.getItem(BOOT_KEY) === null;
  } catch {
    return false;
  }
};
const CELL = 10;
const GAP_COLS = 1;
const TITLE_COLS = TITLE.length * (5 + GAP_COLS) - GAP_COLS;
// The moment the last column has settled and the lock pause is over.
const BOOT_REVEAL_MS = (TITLE_COLS - 1) * BOOT_COL_STEP + BOOT_IGNITE_MS + BOOT_LOCK_MS;
const BOOT_STAMP_MS = 725;
const BOOT_TOTAL_MS = BOOT_REVEAL_MS + 750;
// Keyframe offset for a point in the stamp-in, given in ms from its start.
const stampAt = (ms) => `${((ms / BOOT_STAMP_MS) * 100).toFixed(2)}%`;

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
        ig: `${col * BOOT_COL_STEP}ms`,
      };
    }),
  ),
);

function DigitalTitle({ booting = false }) {
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
            className={booting ? 'sp-block sp-ignite' : 'sp-block'}
            style={{ '--t': b.t, '--d': b.d, '--ig': b.ig }}
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

// 80x80 brightness map (0-9) sampled from a black-and-white photo of Scrimmy, with stray dots removed
// (the horizontal streak off the chin and small clusters detached from the head and collar).
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
  '00000000000000001110000001027999999999999984313121000101100000000000000000000000',
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
  '00000000000000001799887775134543233333321000000132121100110000000000000000000000',
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
  '00000000000000000003445554332211000000000001112233441130000000000000000000000000',
  '00000000000000000100122222111000000000000011222334442330000000000000000000000000',
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
  '00000000000000000000000000029610121000000034321122480000000000000000000001001111',
  '00000000000000000000000000029941220000000003322232870000000000000000000000000011',
  '00000000000000000000000000029982210000000000323325950000000000000000000000000000',
  '00000000000000000000000000019994200000010000133349940000000000000000000000000000',
  '00000000000000000000000000008996100000000000023269920000000000000000000000000000',
  '00000000000000000000000000007996100100000000003499920000000000000000000000000000',
  '00000000000000000000000000005997011000000000001599810000000000000000000000000000',
  '00000000000000000000000000004998121100000001110698700000000000000000000000000000',
  '00000000000000000000000000003998122000000011100887500000000000000000000000000000',
  '00000000000000000000000000012899222200000000002977400000000000000000000000000000',
  '00000000000000000000000000012899313200000000013978400000000000000000000000000000',
  '00000000000000000000000000011799402100000001124999200000000000000000000000000000',
  '00000000000000000000000001011599502100000002324998100000000000000000000000000000',
  '00000000000000000000000000111499602100000001325997000000000000000000000000000000',
  '00000000000000000000000000101399701000000001325996000000000000000000000000000000',
  '00000000000000000000000000001289701000000001414994000100000000000000000000000000',
].join('');

const portraitColor = (level) => (level >= 8 ? '#ffffff' : level >= 6 ? '#93c5fd' : level >= 3 ? '#3b82f6' : '#1e40af');

// Scroll-linked raster: rows draw top to bottom as the card moves from 20% into the viewport (its top
// at 80% of the viewport height) until its centre reaches 55% of the viewport height.
const PORTRAIT_START = 0.8;
const PORTRAIT_END = 0.55;
// The newest row shows as a faint blue cell, the next two flash electric blue, then each settles.
const PORTRAIT_POP_ROWS = 3;

function PixelPortrait() {
  const canvasRef = useRef(null);
  const figureRef = useRef(null);
  const scanRef = useRef(null);
  const captionRef = useRef(null);
  const [instant] = useState(prefersReducedMotion);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    let progress = prefersReducedMotion() ? 1 : 0;
    let drawnRows = -1;
    let drawnSize = 0;

    // Draws every row above the raster line; rows near the line get the pop colours.
    // Clip the whole card to the raster line, move the scanline with it, and finish cleanly at 100%.
    const frame = () => {
      const done = progress >= 1;
      if (figureRef.current) figureRef.current.style.clipPath = done ? 'none' : `inset(0 0 ${(100 - progress * 100).toFixed(2)}% 0)`;
      if (scanRef.current) {
        scanRef.current.style.top = `${(progress * 100).toFixed(2)}%`;
        scanRef.current.style.opacity = progress > 0 && !done ? '1' : '0';
      }
      if (captionRef.current) captionRef.current.style.opacity = done ? '1' : '0';
    };

    const draw = () => {
      const size = canvas.clientWidth;
      if (!size) return;
      const rows = progress >= 1 ? PORTRAIT_SIZE + PORTRAIT_POP_ROWS : Math.floor(progress * PORTRAIT_SIZE);
      if (rows === drawnRows && size === drawnSize) return; // nothing new to paint
      drawnRows = rows;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (size !== drawnSize) {
        canvas.width = Math.round(size * dpr);
        canvas.height = Math.round(size * dpr);
        drawnSize = size;
      }
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      const cell = size / PORTRAIT_SIZE;
      const last = Math.min(rows, PORTRAIT_SIZE) * PORTRAIT_SIZE;
      for (let i = 0; i < last; i += 1) {
        const level = PORTRAIT.charCodeAt(i) - 48;
        if (level < 2) continue; // keep the background pure black
        const age = rows - Math.floor(i / PORTRAIT_SIZE); // 1 = newest row
        ctx.fillStyle = age <= 1 ? 'rgba(30,64,175,0.55)' : age < PORTRAIT_POP_ROWS + 1 ? '#3b82f6' : portraitColor(level);
        const r = cell * (0.1 + level * 0.042);
        ctx.beginPath();
        ctx.arc((i % PORTRAIT_SIZE) * cell + cell / 2, Math.floor(i / PORTRAIT_SIZE) * cell + cell / 2, r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const rect = canvas.getBoundingClientRect();
        const vh = window.innerHeight;
        const startTop = vh * PORTRAIT_START;
        const endTop = Math.min(vh * PORTRAIT_END - rect.height / 2, startTop - 1);
        progress = Math.min(Math.max((startTop - rect.top) / (startTop - endTop), 0), 1);
        draw();
        frame();
        // Fully assembled: lock it and stop listening, so it never re-triggers while the bio is read.
        if (progress >= 1) window.removeEventListener('scroll', onScroll);
      });
    };

    draw();
    if (progress < 1) {
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    const ro = new ResizeObserver(() => {
      drawnRows = -1;
      draw();
    });
    ro.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      ro.disconnect();
    };
  }, []);

  return (
    <div className="relative">
      <figure
        ref={figureRef}
        className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10 bg-black"
        // Hidden until the raster starts (set before first paint so the empty card never flashes).
        style={instant ? undefined : { clipPath: 'inset(0 0 100% 0)' }}>
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
        <figcaption
          ref={captionRef}
          style={instant ? undefined : { opacity: 0 }}
          className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 border-t border-white/10 bg-black/70 px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-slate-400 backdrop-blur transition-opacity duration-150">
          <span>IMG // scrimmy.raw</span>
          <span className="text-blue-400">
            {PORTRAIT_SIZE}×{PORTRAIT_SIZE}
          </span>
        </figcaption>
      </figure>
      {/* Print-head line at the raster's leading edge; outside the figure so the clip never hides it */}
      {!instant && (
        <span
          ref={scanRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 h-px -translate-y-px bg-blue-500 opacity-0 shadow-[0_0_8px_#3b82f6] transition-opacity duration-150"
          style={{ top: '0%' }}
        />
      )}
    </div>
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

// Scroll-linked typing window, as fractions of the viewport height measured at the heading's top edge:
// typing starts when the heading is 15% of the way up the screen and finishes at 45%.
const TYPE_START = 0.15;
const TYPE_END = 0.45;

// Types the heading out as it scrolls into view. Until it finishes, scrolling back up un-types it;
// once complete it locks, so it never flickers while being read.
function TypedText({ text }) {
  const ref = useRef(null);
  const [chars, setChars] = useState(() => (prefersReducedMotion() ? text.length : 0));

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    let raf = 0;
    let done = false;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el || done) return;
      const vh = window.innerHeight;
      const progress = (vh * (1 - TYPE_START) - el.getBoundingClientRect().top) / (vh * (TYPE_END - TYPE_START));
      const next = Math.round(Math.min(Math.max(progress, 0), 1) * text.length);
      setChars(next);
      if (next >= text.length) {
        done = true;
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
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
  }, [text]);

  return (
    <>
      {/* Screen readers get the whole sentence once; the animated copy is hidden from them. */}
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true">
        {text.slice(0, chars)}
        <span className="ml-1 inline-block h-[0.85em] w-2.5 animate-pulse bg-blue-500 align-baseline shadow-[0_0_10px_rgba(59,130,246,0.8)] motion-reduce:animate-none" />
        {/* The untyped rest is laid out but invisible, so the heading never changes height while typing. */}
        <span className="invisible">{text.slice(chars)}</span>
      </span>
    </>
  );
}

function SectionHeader({ title, sub, blueprint = false, typewriter = false }) {
  return (
    <Reveal className={`mb-14 ${blueprint ? '' : 'border-t border-white/10 pt-10'}`}>
      {blueprint && <BlueprintRule />}
      <h2
        className={`max-w-3xl text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl ${blueprint ? 'pt-9' : ''}`}>
        {typewriter ? <TypedText text={title} /> : title}
      </h2>
      {sub && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-400">{sub}</p>}
    </Reveal>
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

function Brackets() {
  return CORNERS.map((c) => (
    <span
      key={c}
      aria-hidden="true"
      className={`pointer-events-none absolute z-10 h-3 w-3 border-zinc-600 transition-colors duration-300 group-hover:border-blue-400 ${c}`}
    />
  ));
}

function FrameCard({ children, className = '' }) {
  return (
    <article
      className={`group relative flex h-full flex-col border border-zinc-800 bg-[#09090b] p-7 transition duration-300 hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(37,99,235,0.08)] sm:p-8 ${className}`}>
      <Brackets />
      {children}
    </article>
  );
}

// Loading placeholder with the same frame and padding as FrameCard. Not used on the page yet
// (nothing loads asynchronously); exported for <Suspense> fallbacks or future data-driven cards.
// Bones share one calm dark-blue sweep; it stops under reduced motion.
const BONE_BORDER = 'border border-[#1f1f23]'; // between zinc-800 and zinc-900

export function CardSkeleton({ tags = 3 }) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading"
      className="relative flex h-full min-h-[22rem] flex-col border border-zinc-800/80 bg-zinc-950/70 p-7 sm:p-8">
      {CORNERS.map((c) => (
        <span key={c} aria-hidden="true" className={`pointer-events-none absolute h-3 w-3 border-zinc-700 ${c}`} />
      ))}
      <div aria-hidden="true" className="flex h-full flex-1 flex-col">
        <span className="font-mono text-[10px] tracking-wider text-zinc-600">[ LOADING ]</span>
        <div className={`sp-bone mt-6 h-6 w-3/5 bg-zinc-900 ${BONE_BORDER}`} />
        <div className="mb-6 mt-5 space-y-2.5">
          <div className={`sp-bone h-3.5 w-full bg-zinc-900/70 ${BONE_BORDER}`} />
          <div className={`sp-bone h-3.5 w-full bg-zinc-900/70 ${BONE_BORDER}`} />
          <div className={`sp-bone h-3.5 w-2/3 bg-zinc-900/70 ${BONE_BORDER}`} />
        </div>
        <div className="mt-auto flex flex-wrap gap-1.5 border-t border-zinc-800/60 pt-6">
          {Array.from({ length: tags }, (_, i) => (
            <div key={i} className={`sp-bone h-6 w-20 rounded-sm bg-zinc-900 ${BONE_BORDER}`} />
          ))}
        </div>
      </div>
      <span className="sr-only">Loading…</span>
    </div>
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

const PRIMARY_CLS = `inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-[15px] font-semibold text-white hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${PRESS}`;
const SECONDARY_CLS = `inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full border border-white/15 px-5 py-2.5 text-[15px] font-semibold text-white hover:border-white/30 hover:bg-white/5 ${PRESS}`;

function PrimaryButton({ children, className = '', ...rest }) {
  return (
    <button className={`${PRIMARY_CLS} ${className}`} {...rest}>
      {children}
    </button>
  );
}

function SecondaryButton({ children, className = '', ...rest }) {
  return (
    <button className={`${SECONDARY_CLS} ${className}`} {...rest}>
      {children}
    </button>
  );
}


/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */

// `current` is the highlighted menu entry: the section in view on the home page, or the page id ('web',
// 'faq') on a standalone page. `onNavigate(id)` scrolls to a home section (switching pages first if
// needed) or opens the standalone page for a page id.
function NavBar({ current, onNavigate, onHome, booting = false }) {
  const [open, setOpen] = useState(false);
  const firstLinkRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    document.body.style.overflow = 'hidden';
    firstLinkRef.current?.focus({ preventScroll: true });
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Close first so the scroll lock is released before the page moves.
  const go = (id) => {
    setOpen(false);
    document.body.style.overflow = '';
    onNavigate(id);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b border-white/5 bg-black/70 backdrop-blur-xl ${booting ? 'sp-boot-stamp' : ''}`}>
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Primary">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
              onHome();
            }}
            className={`rounded font-mono text-[15px] font-semibold tracking-tight text-white ${FOCUS}`}
            aria-label={`${SITE_DOMAIN}, back to top`}>
            scrimmy<span className="text-blue-500">.xyz</span>
          </a>

          <div className="flex items-center gap-2">
            <PrimaryButton onClick={() => go('contact')} className="min-h-0 px-4 py-1.5 text-sm">
              Get in Touch
            </PrimaryButton>
            <button
              ref={triggerRef}
              onClick={() => setOpen((o) => !o)}
              className={`grid h-11 w-11 place-items-center rounded-full text-slate-300 hover:bg-white/5 hover:text-white ${PRESS}`}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="site-menu">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Menu overlay: kept outside the header, whose backdrop-filter would otherwise trap position:fixed.
          Sits under the 56px bar so the logo, Get in Touch and the X stay in reach. */}
      <div
        className={`fixed inset-x-0 bottom-0 top-14 z-[60] ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!open}
        inert={!open}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/60 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}
        />
        <div className="relative mx-auto max-w-6xl px-4 pt-3 sm:px-6 lg:px-8">
          <div
            id="site-menu"
            className={`relative ml-auto w-full border border-zinc-800 bg-black/95 p-3 backdrop-blur-md transition duration-200 ease-out sm:w-80 ${
              open ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
            }`}>
            {CORNERS.map((c) => (
              <span key={c} aria-hidden="true" className={`pointer-events-none absolute h-3 w-3 border-blue-500/60 ${c}`} />
            ))}
            <Mono className="block px-3 pb-2 pt-1 text-[10px] text-zinc-500">// Navigate</Mono>
            <ul className="divide-y divide-zinc-800/80 border-y border-zinc-800/80">
              {MENU_LINKS.map((l, i) => {
                const isCurrent = current === l.id;
                return (
                  <li key={l.id}>
                    <a
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={l.page ? PAGE_PATHS[l.id] : `/#${l.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        go(l.id);
                      }}
                      aria-current={isCurrent ? (l.page ? 'page' : 'true') : undefined}
                      className={`group/link flex min-h-[48px] items-center gap-4 px-3 py-3 transition-colors duration-150 hover:bg-white/[0.03] ${FOCUS} ${
                        isCurrent ? 'text-white' : 'text-slate-300 hover:text-white'
                      }`}>
                      <span className={`font-mono text-[11px] ${isCurrent ? 'text-blue-400' : 'text-zinc-600'}`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 text-base font-semibold">{l.label}</span>
                      {l.page ? (
                        <span className="rounded-sm border border-blue-500/30 bg-blue-500/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-blue-300">
                          Page
                        </span>
                      ) : (
                        <ChevronRight
                          className={`h-4 w-4 transition-transform duration-150 group-hover/link:translate-x-0.5 ${
                            isCurrent ? 'text-blue-400' : 'text-zinc-600'
                          }`}
                        />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className={`mt-2 flex min-h-[44px] items-center gap-2 rounded px-3 font-mono text-xs text-slate-400 transition-colors duration-150 hover:text-white ${FOCUS}`}>
              <Mail className="h-3.5 w-3.5 text-blue-500" /> {CONTACT_EMAIL}
            </a>
          </div>
        </div>
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

// The hero copy and title. Rendered once for real and, during the boot, once more as the raster-tear copy
// (no refs, aria-hidden and inert), so the tear shows exactly what is on screen.
function HeroStage({ booting, addText }) {
  return (
    <>
      <p
        ref={addText}
        className={`flex items-center gap-2.5 will-change-[opacity,transform] ${booting ? 'sp-boot-stamp' : ''}`}>
        <span className="relative flex h-2 w-2">
          <span className="sp-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
        </span>
        <Mono className="text-blue-400">SYSTEM_ONLINE // {SITE_DOMAIN}</Mono>
      </p>

      <h1 className="mt-8">
        <DigitalTitle booting={booting} />
      </h1>

      <div ref={addText} className="will-change-[opacity,transform]">
        <ul
          className={`mt-8 flex flex-wrap gap-2 ${booting ? 'sp-boot-stamp' : ''}`}
          aria-label="Also known as">
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

        <p
          className={`mt-8 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl ${booting ? 'sp-boot-stamp' : ''}`}>
          Builder, operator and community organizer across Web3 and tech. I produce global events, consult on
          marketing and operations, and ship high-velocity websites.
        </p>

        <div
          className={`mt-10 flex flex-col gap-3 sm:flex-row ${booting ? 'sp-boot-stamp' : ''}`}>
          <PrimaryButton onClick={() => scrollToId('contact')} className="px-6 py-3">
            Work With Me <ArrowRight className="h-4 w-4" />
          </PrimaryButton>
          <SecondaryButton onClick={() => scrollToId('ecosystems')} className="px-6 py-3">
            See My Ecosystems
          </SecondaryButton>
        </div>
      </div>
    </>
  );
}

function Hero({ booting }) {
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
        <div
          ref={stageRef}
          className={`relative mx-auto w-full max-w-6xl origin-top will-change-transform ${booting ? 'sp-shred-stage' : ''}`}>
          <div className={booting ? 'sp-shred-orig' : undefined}>
            <HeroStage booting={booting} addText={addText} />
          </div>
          {/* Buffer shred: five copies of the stage (no refs, hidden from assistive tech and not focusable),
              each shown through its own band for frames 2 and 3, plus the blue blockout band. */}
          {booting && (
            <>
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} aria-hidden="true" inert className={`sp-shred-layer sp-shred-${n} pointer-events-none absolute inset-0`}>
                  <HeroStage booting={booting} />
                </div>
              ))}
              <div aria-hidden="true" className="sp-shred-block pointer-events-none absolute inset-0 bg-[#3b82f6]" />
            </>
          )}
        </div>

        {/* 2px blue interlace over the whole hero for the macro-shred frame */}
        {booting && (
          <div
            aria-hidden="true"
            className="sp-boot-interlace pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(59,130,246,0.55)_0px,rgba(59,130,246,0.55)_1px,transparent_1px,transparent_2px)] mix-blend-screen"
          />
        )}

        <button
          ref={cueRef}
          onClick={() => scrollToId('about')}
          className={`${booting ? 'sp-boot-stamp' : ''} absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 rounded text-slate-500 transition-colors duration-200 hover:text-white ${FOCUS}`}
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
              Builder. Operator. Organizer<span className="text-blue-500">.</span>
            </h2>
            <div aria-hidden="true" className="mt-4 max-w-md border-b border-blue-500/20" />
            <p className="mt-5 text-lg leading-relaxed text-slate-400">
              I&apos;m Scrimmy, also known as Young Scrimmage and Don Scrimmy John, based in the Quad Cities. I bring
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
          typewriter
          title="Where I build and organize."
          sub="Real roles in real communities: producing global events, supporting builders, and organizing for clear crypto policy."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {ECOSYSTEMS.map((e, i) => (
            <Reveal key={e.org} delay={i * 100} className="h-full">
              <FrameCard>

                <div className="flex items-center justify-between gap-3">
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
                  <ActiveTag />
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

function Services({ onOpenWeb }) {
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
                <h3 className="text-xl font-bold text-white">{s.title}</h3>
                <p className="mb-6 mt-3 text-sm leading-relaxed text-zinc-400">{s.body}</p>
                {s.page && (
                  <a
                    href={WEB_SERVICES_PATH}
                    onClick={(e) => {
                      e.preventDefault();
                      onOpenWeb();
                    }}
                    className={`mb-6 inline-flex items-center gap-1.5 self-start rounded font-mono text-xs uppercase tracking-[0.18em] text-blue-400 transition-colors duration-150 hover:text-blue-300 ${FOCUS}`}>
                    Explore Website Services <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                )}
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

const EMPTY_FORM = { name: '', email: '', message: '', botcheck: false };

function validate(f) {
  const e = {};
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

// One cell of the contact ledger: a label over a borderless field, marked by a blue edge on focus or error.
function LedgerField({ id, label, error, className = '', children }) {
  return (
    <div
      className={`relative px-4 py-5 transition-colors duration-200 focus-within:bg-white/[0.02] focus-within:shadow-[inset_2px_0_0_#3b82f6] sm:px-6 ${
        error ? 'shadow-[inset_2px_0_0_#60a5fa]' : ''
      } ${className}`}>
      <label htmlFor={id} className="block font-mono text-xs uppercase tracking-wider text-slate-400">
        {label}
      </label>
      {children}
      <FieldError id={id}>{error}</FieldError>
    </div>
  );
}

const LEDGER_INPUT = 'mt-2 w-full bg-transparent text-base text-white placeholder:text-slate-600 outline-none';

// `preset` ({ line, n }) arrives when a Website Services CTA sends the visitor here: the project type is
// written into the top of the message (once), ready for them to add details.
function Contact({ preset }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  useEffect(() => {
    if (!preset) return;
    setStatus((s) => (s === 'loading' ? s : 'idle'));
    setForm((f) =>
      f.message.includes(preset.line) ? f : { ...f, message: `${preset.line}\n\n${f.message}` },
    );
  }, [preset]);

  const set = (key, value) => {
    // Editing again clears the last success or failure notice.
    if (status === 'success' || status === 'error') setStatus('idle');
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (touched) setErrors(validate(next));
      return next;
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    const v = validate(form);
    setErrors(v);
    if (Object.keys(v).length) {
      document.getElementById(Object.keys(v)[0])?.focus();
      return;
    }
    if (status === 'loading') return;
    setStatus('loading');
    try {
      await sendContact({ name: form.name, email: form.email, message: form.message, botcheck: form.botcheck });
      setForm(EMPTY_FORM);
      setTouched(false);
      setStatus('success');
    } catch (err) {
      // Keep everything they typed, and point to the direct line. The backend's exact reason goes to the console.
      console.error('Submission failed:', err.data || err);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal className="border-t border-white/10 pt-10">
          <h2 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Let&apos;s build something<span className="text-blue-500">.</span>
          </h2>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className={`inline-flex items-center gap-2 rounded font-medium text-blue-400 transition-colors duration-200 hover:text-blue-300 ${FOCUS}`}>
              <Mail className="h-4 w-4 shrink-0" />
              <span className="break-all">{CONTACT_EMAIL}</span>
            </a>
            <span className="hidden h-4 w-px bg-white/10 sm:block" aria-hidden="true" />
            <span className="inline-flex items-center gap-2 text-slate-400">
              <MapPin className="h-4 w-4 shrink-0 text-blue-500" /> {HOME_BASE}
            </span>
            <span className="hidden h-4 w-px bg-white/10 sm:block" aria-hidden="true" />
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1 rounded font-mono text-sm text-neutral-400 transition-colors duration-150 hover:text-[#3b82f6] ${FOCUS}`}>
              Schedule Call <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="sr-only">(opens Calendly in a new tab)</span>
            </a>
          </div>
        </Reveal>

        <Reveal delay={100} className="mt-12">
          <form onSubmit={onSubmit} noValidate className="border-y border-white/10">
            <input
              type="checkbox"
              name="botcheck"
              checked={form.botcheck}
              onChange={(e) => set('botcheck', e.target.checked)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid divide-y divide-white/10 border-b border-white/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              <LedgerField id="name" label="Your Name" error={errors.name}>
                <input
                  id="name"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  autoComplete="name"
                  placeholder="Jordan Rivera"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-err' : undefined}
                  className={LEDGER_INPUT}
                />
              </LedgerField>
              <LedgerField id="email" label="Your Email" error={errors.email}>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  autoComplete="email"
                  placeholder="jordan@company.com"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-err' : undefined}
                  className={LEDGER_INPUT}
                />
              </LedgerField>
            </div>

            <LedgerField id="message" label="Message" error={errors.message} className="border-b border-white/10">
              <textarea
                id="message"
                rows={4}
                value={form.message}
                onChange={(e) => set('message', e.target.value)}
                placeholder="What are you planning, building or fixing, and when do you need it?"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'message-err' : undefined}
                className={`${LEDGER_INPUT} resize-y leading-relaxed`}
              />
            </LedgerField>

            <div className="flex flex-col-reverse gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p aria-live="polite" className="text-sm">
                {status === 'success' && (
                  <span className="inline-flex items-center gap-2 text-slate-300">
                    <Check className="h-4 w-4 shrink-0 text-blue-400" /> Message dispatched successfully.
                  </span>
                )}
                {status === 'error' && (
                  <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 text-slate-400">
                    <AlertCircle className="h-4 w-4 shrink-0 text-blue-400" /> Dispatch failed. Direct line:
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className={`rounded font-medium text-blue-400 transition-colors duration-200 hover:text-blue-300 ${FOCUS}`}>
                      {CONTACT_EMAIL}
                    </a>
                  </span>
                )}
              </p>
              <PrimaryButton
                type="submit"
                disabled={status === 'loading'}
                aria-busy={status === 'loading'}
                className="w-full shrink-0 px-6 sm:w-auto">
                {status === 'loading' ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Transmitting...
                  </>
                ) : (
                  <>
                    Send Message <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </PrimaryButton>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Pixel monolith (Website Services hero)                             */
/* ------------------------------------------------------------------ */

// A browser-window slab made of points: the box's 12 edges plus a wireframe page on its front face
// (title bar, window dots, headline lines, button, image block and three cards). Units are model space.
const MONOLITH_POINTS = (() => {
  const W = 1.6;
  const H = 1.0;
  const D = 0.36;
  const hw = W / 2;
  const hh = H / 2;
  const hd = D / 2;
  const pts = [];
  const seg = (a, b, step = 0.03) => {
    const n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]) / step));
    for (let i = 0; i <= n; i += 1) {
      const t = i / n;
      pts.push({ x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, z: a[2] + (b[2] - a[2]) * t });
    }
  };
  const rect = (x0, y0, x1, y1, step) => {
    seg([x0, y0, hd], [x1, y0, hd], step);
    seg([x1, y0, hd], [x1, y1, hd], step);
    seg([x1, y1, hd], [x0, y1, hd], step);
    seg([x0, y1, hd], [x0, y0, hd], step);
  };
  // Box edges.
  [-hh, hh].forEach((y) => [-hd, hd].forEach((z) => seg([-hw, y, z], [hw, y, z])));
  [-hw, hw].forEach((x) => [-hd, hd].forEach((z) => seg([x, -hh, z], [x, hh, z])));
  [-hw, hw].forEach((x) => [-hh, hh].forEach((y) => seg([x, y, -hd], [x, y, hd])));
  // Front face: title bar, three window dots, then the page wireframe.
  seg([-hw, hh - 0.13, hd], [hw, hh - 0.13, hd]);
  [0, 1, 2].forEach((k) => {
    for (let i = 0; i < 6; i += 1) {
      const a = (i / 6) * Math.PI * 2;
      pts.push({ x: -hw + 0.08 + k * 0.065 + Math.cos(a) * 0.017, y: hh - 0.065 + Math.sin(a) * 0.017, z: hd });
    }
  });
  seg([-0.66, 0.25, hd], [-0.06, 0.25, hd], 0.035);
  seg([-0.66, 0.18, hd], [-0.22, 0.18, hd], 0.035);
  seg([-0.66, 0.11, hd], [-0.3, 0.11, hd], 0.04);
  rect(-0.66, 0.02, -0.4, -0.06, 0.035);
  rect(0.06, 0.27, 0.66, -0.07, 0.035);
  seg([0.06, -0.07, hd], [0.66, 0.27, hd], 0.05);
  [
    [-0.66, -0.26],
    [-0.2, 0.2],
    [0.26, 0.66],
  ].forEach(([x0, x1]) => rect(x0, -0.17, x1, -0.41, 0.04));
  return pts;
})();

const MONO_CAM = 3.4; // perspective camera distance
const MONO_SPIN = 0.42; // radians per second
const MONO_TILT = -0.32; // resting tilt toward the viewer
const MONO_MAX_LOOSE = 0.22; // at most this share of pixels is ever peeled off
const MONO_PEEL = 1.7; // peel chance per second at the very trailing edge
const MONO_REPEL_R = 110; // px
const MONO_REPEL = 1400; // px/s^2 at the pointer
const MONO_DISSOLVE_PX = 450; // scroll distance over which the slab fully dissolves

// Pixels peel off the trailing edge (the side turning away), drift out as dust, and spring back once the
// rotation brings their home spot round to the leading edge. The pointer repels nearby pixels and tilts the
// slab. Scrolling dissolves the whole slab: past the point where the canvas sits mid-screen (the page top on
// desktop), every pixel breaks away over the next 450px, scattering outward and upward with growing speed
// until all are faded out, and scrolling back reassembles it. Draws one static frame under reduced motion;
// pauses while off screen.
function PixelMonolith({ className = '' }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;
    const ctx = canvas.getContext('2d');
    const reduced = prefersReducedMotion();
    const n = MONOLITH_POINTS.length;
    // Start scattered so the slab assembles itself on first view.
    const ps = MONOLITH_POINTS.map((p) => ({
      ...p,
      ox: reduced ? 0 : (Math.random() - 0.5) * 320,
      oy: reduced ? 0 : (Math.random() - 0.5) * 320,
      vx: 0,
      vy: 0,
      mode: reduced ? 0 : 2, // 0 attached, 1 drifting dust, 2 returning
      t: 0,
      life: 1,
      // Scroll dissolve: when this pixel lets go (0-0.6 of the dissolve), its scatter angle, reach and lift.
      brk: Math.random() * 0.6,
      ang: Math.random() * Math.PI * 2,
      reach: 0.6 + Math.random() * 0.9,
      rise: 40 + Math.random() * 90,
    }));
    let dissolve = 0; // eased toward dissolveTarget each frame
    let dissolveTarget = 0;
    let loose = reduced ? 0 : n;
    let w = 0;
    let h = 0;
    let time = 0;
    let last = 0;
    let raf = 0;
    let visible = false;
    const tilt = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const ptr = { x: 0, y: 0, active: false };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (dt) => {
      tilt.x += (target.x - tilt.x) * Math.min(1, dt * 3);
      tilt.y += (target.y - tilt.y) * Math.min(1, dt * 3);
      const ry = (reduced ? 0.6 : time * MONO_SPIN) + tilt.y;
      const rx = MONO_TILT + tilt.x;
      const cY = Math.cos(ry);
      const sY = Math.sin(ry);
      const cX = Math.cos(rx);
      const sX = Math.sin(rx);
      const S = Math.min(w, h * 1.45) * 0.42;
      const ox0 = w / 2;
      const oy0 = h / 2 + (reduced ? 0 : Math.sin(time * 0.8) * 4);
      const sizeK = Math.max(0.8, Math.min(S / 150, 1.5));
      const R2 = MONO_REPEL_R * MONO_REPEL_R;
      dissolve += (dissolveTarget - dissolve) * Math.min(1, dt * 6);
      if (Math.abs(dissolveTarget - dissolve) < 0.0005) dissolve = dissolveTarget;
      const spread = Math.min(w, h) * 0.45;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < n; i += 1) {
        const p = ps[i];
        // Rotate about Y, then X, then project.
        const x1 = p.x * cY + p.z * sY;
        const z1 = -p.x * sY + p.z * cY;
        const y2 = p.y * cX - z1 * sX;
        const z2 = p.y * sX + z1 * cX;
        const f = MONO_CAM / (MONO_CAM - z2);
        const hx = ox0 + x1 * f * S;
        const hy = oy0 - y2 * f * S;

        if (!reduced) {
          if (p.mode === 0) {
            // Front points travel right as it spins, so the right edge is the one turning away.
            const edge = Math.min(Math.max((x1 / 0.9 - 0.25) / 0.6, 0), 1) * (z1 < 0.15 ? 1 : 0.3);
            if (edge > 0 && dissolve < 0.05 && loose < n * MONO_MAX_LOOSE && Math.random() < edge * MONO_PEEL * dt) {
              const dx = hx - ox0;
              const dy = hy - oy0;
              const len = Math.hypot(dx, dy) || 1;
              const sp = 20 + Math.random() * 55;
              p.mode = 1;
              p.t = 0;
              p.life = 1 + Math.random() * 1.4;
              p.vx = (dx / len) * sp + 25 + (Math.random() - 0.5) * 30;
              p.vy = (dy / len) * sp + (Math.random() - 0.5) * 30 - 8;
              loose += 1;
            }
          } else if (p.mode === 1) {
            p.t += dt;
            // Reassemble once its home has come round to the leading (left) side.
            if (p.t > p.life && x1 < -0.1) {
              p.mode = 2;
              p.t = 0;
            }
          } else {
            p.t += dt;
            if (p.t > 0.8 && Math.abs(p.ox) + Math.abs(p.oy) < 0.8) {
              p.mode = 0;
              p.ox = 0;
              p.oy = 0;
              loose -= 1;
            }
          }

          if (ptr.active) {
            const dx = hx + p.ox - ptr.x;
            const dy = hy + p.oy - ptr.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < R2 && d2 > 0.01) {
              const d = Math.sqrt(d2);
              const push = (1 - d / MONO_REPEL_R) * MONO_REPEL * (p.mode === 0 ? 0.6 : 1);
              p.vx += (dx / d) * push * dt;
              p.vy += (dy / d) * push * dt;
            }
          }

          if (p.mode === 1) {
            const damp = Math.exp(-0.7 * dt);
            p.vx *= damp;
            p.vy = p.vy * damp - 4 * dt;
          } else {
            // Damped spring home: stiff when attached, softer while reassembling.
            const k = p.mode === 0 ? 70 : 16;
            const c = 2 * Math.sqrt(k) * 0.75;
            p.vx += (-p.ox * k - p.vx * c) * dt;
            p.vy += (-p.oy * k - p.vy * c) * dt;
          }
          p.ox += p.vx * dt;
          p.oy += p.vy * dt;
        }

        const depth = Math.min(Math.max((z2 + 0.9) / 1.8, 0), 1);
        let a;
        let col;
        let s = (1.2 + depth * 1.5) * sizeK;
        if (p.mode === 0) {
          a = 0.3 + depth * 0.7;
          col = z2 > 0.02 ? '#e2e8f0' : '#2563eb';
        } else if (p.mode === 1) {
          const k = Math.min(p.t / p.life, 1);
          a = 0.08 + (1 - k) * 0.75;
          col = '#3b82f6';
          s *= 1 - k * 0.45;
        } else {
          a = Math.min(1, 0.15 + p.t / 0.7) * (0.3 + depth * 0.7);
          col = p.t < 0.5 ? '#3b82f6' : z2 > 0.02 ? '#e2e8f0' : '#2563eb';
        }
        // Scroll dissolve: a pure function of the eased progress, so scrolling back reassembles exactly.
        // Each pixel lets go at its own point, then accelerates outward (k squared) and drifts up as it fades.
        let dx = 0;
        let dy = 0;
        if (dissolve > 0.001) {
          const k = Math.min(Math.max((dissolve - p.brk) / 0.4, 0), 1);
          if (k > 0) {
            const rx0 = hx - ox0;
            const ry0 = hy - oy0;
            const len = Math.hypot(rx0, ry0) || 1;
            const ux = (rx0 / len) * 0.6 + Math.cos(p.ang) * 0.4;
            const uy = (ry0 / len) * 0.6 + Math.sin(p.ang) * 0.4;
            const e = k * k * spread * p.reach;
            dx = ux * e + Math.sin(time * 1.3 + p.ang * 5) * k * 6;
            dy = uy * e - k * p.rise + Math.cos(time * 1.1 + p.ang * 3) * k * 6;
            a *= (1 - k) ** 1.3;
            s *= 1 - k * 0.4;
            if (k > 0.15) col = '#3b82f6';
          }
        }
        if (a < 0.01) continue;
        ctx.globalAlpha = a;
        ctx.fillStyle = col;
        ctx.fillRect(hx + p.ox + dx - s / 2, hy + p.oy + dy - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    };

    const frame = (now) => {
      raf = 0;
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
      last = now;
      time += dt;
      draw(dt);
      if (visible) raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (reduced || raf) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };

    resize();
    draw(0);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced || !visible) draw(0);
    });
    ro.observe(canvas);
    if (reduced) return () => ro.disconnect();

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);

    // Scroll progress for the dissolve. It starts once the canvas centre is just past mid-screen (scrollY 0
    // on desktop, where the canvas sits beside the headline; later on phones, where it sits below it) and
    // completes within 450px, and always before the canvas has scrolled under the 56px header.
    const onScroll = () => {
      const r = canvas.getBoundingClientRect();
      const absTop = r.top + window.scrollY;
      const begin = Math.max(0, absTop + r.height / 2 - window.innerHeight * 0.55);
      const end = Math.max(begin + 150, Math.min(begin + MONO_DISSOLVE_PX, absTop + r.height - 56));
      dissolveTarget = Math.min(Math.max((window.scrollY - begin) / (end - begin), 0), 1);
    };
    onScroll();
    dissolve = dissolveTarget; // a reload mid-page starts dissolved, not mid-animation
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Pointer anywhere near the canvas (its box plus 80px) steers the tilt and repels pixels.
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const near = x > -80 && y > -80 && x < r.width + 80 && y < r.height + 80;
      ptr.active = near;
      ptr.x = x;
      ptr.y = y;
      if (near) {
        target.y = Math.max(-1, Math.min(1, (x / r.width - 0.5) * 2)) * 0.45;
        target.x = Math.max(-1, Math.min(1, (y / r.height - 0.5) * 2)) * 0.28;
      } else {
        target.x = 0;
        target.y = 0;
      }
    };
    const onLeave = () => {
      ptr.active = false;
      target.x = 0;
      target.y = 0;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      {/* Soft blue floor glow under the slab */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[15%] bottom-[12%] h-1/3 rounded-full bg-blue-600/10 blur-3xl"
      />
      <canvas
        ref={canvasRef}
        role="img"
        aria-label="Rotating wireframe browser window built from blue and white pixels that peel away and reassemble"
        className="relative h-full w-full"
      />
      <Mono className="pointer-events-none absolute left-0 top-0 text-[10px] text-zinc-600">[ Live_Render ]</Mono>
      <Mono className="pointer-events-none absolute bottom-0 right-0 text-[10px] text-zinc-600">
        {MONOLITH_POINTS.length} PX // Hand-Coded
      </Mono>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Spotlight card (What We Build)                                     */
/* ------------------------------------------------------------------ */

// Corner brackets that slide 2px outward on hover.
const CORNERS_OUT = [
  'left-0 top-0 border-l border-t group-hover:-translate-x-[2px] group-hover:-translate-y-[2px]',
  'right-0 top-0 border-r border-t group-hover:translate-x-[2px] group-hover:-translate-y-[2px]',
  'bottom-0 left-0 border-b border-l group-hover:-translate-x-[2px] group-hover:translate-y-[2px]',
  'bottom-0 right-0 border-b border-r group-hover:translate-x-[2px] group-hover:translate-y-[2px]',
];

// FrameCard variant with expanding brackets, a royal-blue border and a radial glow that follows the cursor.
function SpotlightCard({ children }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <article
      ref={ref}
      onPointerMove={onMove}
      className="group relative flex h-full flex-col border border-zinc-800 bg-[#0a0a0a] p-7 transition duration-300 hover:border-[#2563eb]/60 hover:shadow-[0_0_24px_rgba(37,99,235,0.12)] sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 [background:radial-gradient(280px_circle_at_var(--mx,50%)_var(--my,50%),rgba(37,99,235,0.14),transparent_70%)] group-hover:opacity-100"
      />
      {CORNERS_OUT.map((c) => (
        <span
          key={c}
          aria-hidden="true"
          className={`pointer-events-none absolute z-10 h-3 w-3 border-zinc-600 transition-[transform,border-color] duration-300 ease-out group-hover:border-blue-400 ${c}`}
        />
      ))}
      <div className="relative flex h-full flex-col">{children}</div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  Website Services page                                              */
/* ------------------------------------------------------------------ */

// Screenshot frame with corner brackets and a mono title bar. Every slide's image is stacked in the same
// box and cross-faded, so switching sections never changes the frame's size. The image area is a button
// that opens the lightbox.
function ShotFrame({ slides, index, device, label, onExpand, className = '', areaClassName = '' }) {
  const current = slides[index];
  return (
    <figure
      className={`group relative flex flex-col border border-zinc-800 bg-[#09090b] transition duration-300 hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(37,99,235,0.08)] ${className}`}>
      <Brackets />
      <figcaption className="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-zinc-500">
        <span className="flex items-center gap-1.5" aria-hidden="true">
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
        </span>
        <span className="truncate">{label}</span>
      </figcaption>
      <button
        type="button"
        onClick={onExpand}
        aria-label={`Expand ${device} screenshot: ${current.label}`}
        className={`group/shot relative block w-full cursor-zoom-in overflow-hidden bg-black ${FOCUS} ${areaClassName}`}>
        {slides.map((s, i) => (
          <img
            key={s.key}
            src={s[device].src}
            alt={i === index ? s[device].alt : ''}
            aria-hidden={i === index ? undefined : true}
            width={s[device].w}
            height={s[device].h}
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full origin-top object-cover object-top transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none ${
              i === index ? 'scale-100 opacity-100' : 'scale-[0.98] opacity-0'
            }`}
          />
        ))}
        <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 border border-zinc-700 bg-black/80 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-zinc-300 opacity-0 backdrop-blur transition-opacity duration-200 group-hover/shot:opacity-100 group-focus-visible/shot:opacity-100">
          <Maximize2 className="h-3 w-3 text-blue-400" /> Expand
        </span>
      </button>
    </figure>
  );
}

// Small square arrow button used by the slider and the lightbox.
function ArrowButton({ dir, onClick, label, className = '' }) {
  const Icon = dir === 'prev' ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`grid h-11 w-11 place-items-center border border-zinc-800 bg-[#09090b] text-zinc-400 hover:border-blue-500/40 hover:text-white ${PRESS} ${className}`}>
      <Icon className="h-4 w-4" />
    </button>
  );
}

// Full-size screenshot viewer. Arrow keys step through sections, Escape closes, focus returns to the opener.
function Lightbox({ slides, index, device, onIndex, onClose }) {
  const closeRef = useRef(null);
  const slide = slides[index];
  const shot = slide[device];
  const step = (d) => onIndex((index + d + slides.length) % slides.length);

  useEffect(() => {
    const opener = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      opener?.focus?.({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onIndex((index + 1) % slides.length);
      else if (e.key === 'ArrowLeft') onIndex((index - 1 + slides.length) % slides.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, slides.length, onIndex, onClose]);

  // Portalled to <body>: the Reveal wrapper's transform would otherwise trap position:fixed.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${slide.label} screenshot, ${device}`}
      className="fixed inset-0 z-[80] flex flex-col bg-black/95 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-2 sm:px-6">
        <Mono className="truncate text-[11px] text-zinc-400">
          <span className="text-blue-400">Perkins</span> // {slide.n} · {slide.label} // {device}
        </Mono>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close screenshot viewer"
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-slate-300 hover:bg-white/5 hover:text-white ${PRESS}`}>
          <X className="h-5 w-5" />
        </button>
      </div>
      {/* Click the dark area around the image to close. */}
      <div className="relative min-h-0 flex-1 overflow-auto p-4 sm:p-8" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <img
          key={shot.src}
          src={shot.src}
          alt={shot.alt}
          width={shot.w}
          height={shot.h}
          onClick={(e) => e.stopPropagation()}
          className={`sp-fade mx-auto border border-zinc-800 object-contain ${
            device === 'mobile' ? 'h-full w-auto max-w-full' : 'max-h-full w-auto max-w-full'
          }`}
        />
      </div>
      <div className="flex items-center justify-center gap-3 border-t border-zinc-800 px-4 py-3">
        <ArrowButton dir="prev" onClick={() => step(-1)} label="Previous section" />
        <Mono className="min-w-[4.5rem] text-center text-[11px] text-zinc-400">
          {slide.n} / {String(slides.length).padStart(2, '0')}
        </Mono>
        <ArrowButton dir="next" onClick={() => step(1)} label="Next section" />
      </div>
    </div>,
    document.body,
  );
}

// Perkins proof of work: section tabs and arrows over a paired desktop + phone preview.
function PerkinsShowcase() {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(null); // null | 'desktop' | 'mobile'
  const tabRefs = useRef([]);
  const touchX = useRef(null);
  const count = PERKINS_SLIDES.length;
  const go = (i) => setIndex((i + count) % count);

  // Roving focus for the tab row: arrow keys, Home and End move between tabs.
  const onTabKey = (e) => {
    const map = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: count - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    const next = (map[e.key] + count) % count;
    setIndex(next);
    tabRefs.current[next]?.focus();
  };

  // Horizontal swipe on the preview switches sections on touch screens.
  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
  };

  const slide = PERKINS_SLIDES[index];

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label="Perkins Lawn & Snow site sections" className="flex flex-wrap gap-1.5" onKeyDown={onTabKey}>
          {PERKINS_SLIDES.map((s, i) => (
            <button
              key={s.key}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`perkins-tab-${s.key}`}
              aria-selected={i === index}
              aria-controls="perkins-panel"
              tabIndex={i === index ? 0 : -1}
              onClick={() => setIndex(i)}
              className={`min-h-[36px] rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors duration-200 ${FOCUS} ${
                i === index
                  ? 'border-blue-500/50 bg-blue-500/10 text-blue-300'
                  : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-white'
              }`}>
              {s.n} · {s.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Mono className="mr-1 text-[11px] text-zinc-500" aria-hidden="true">
            {slide.n} / {String(count).padStart(2, '0')}
          </Mono>
          <ArrowButton dir="prev" onClick={() => go(index - 1)} label="Previous section" />
          <ArrowButton dir="next" onClick={() => go(index + 1)} label="Next section" />
        </div>
      </div>

      <div
        id="perkins-panel"
        role="tabpanel"
        aria-labelledby={`perkins-tab-${slide.key}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="grid gap-4 lg:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)]">
        <ShotFrame
          slides={PERKINS_SLIDES}
          index={index}
          device="desktop"
          label="Desktop // 1440px"
          onExpand={() => setExpanded('desktop')}
          areaClassName="aspect-[1440/900]"
        />
        {/* On large screens the phone frame stretches to the desktop frame's height and crops from the top. */}
        <ShotFrame
          slides={PERKINS_SLIDES}
          index={index}
          device="mobile"
          label="Mobile // 390px"
          onExpand={() => setExpanded('mobile')}
          className="mx-auto w-full max-w-xs lg:max-w-none"
          areaClassName="aspect-[390/844] lg:aspect-auto lg:flex-1"
        />
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {slide.label}, section {index + 1} of {count}
      </p>

      {expanded && (
        <Lightbox slides={PERKINS_SLIDES} index={index} device={expanded} onIndex={go} onClose={() => setExpanded(null)} />
      )}
    </>
  );
}

function CopyEmail() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
    } catch {
      // Clipboard blocked (insecure context or permissions): fall back to the mail client.
      window.location.href = `mailto:${CONTACT_EMAIL}`;
    }
  };

  return (
    <span className="inline-flex min-h-[44px] items-stretch overflow-hidden rounded-full border border-white/15">
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className={`inline-flex items-center gap-2 rounded-l-full py-2.5 pl-5 pr-3 text-[15px] font-semibold text-white transition duration-200 hover:bg-white/5 ${FOCUS}`}>
        <Mail className="h-4 w-4 text-blue-400" />
        {CONTACT_EMAIL}
      </a>
      <button
        type="button"
        onClick={copy}
        className={`grid w-11 place-items-center rounded-r-full border-l border-white/15 text-slate-300 transition duration-200 hover:bg-white/5 hover:text-white ${FOCUS}`}
        aria-label={copied ? 'Email address copied' : 'Copy email address'}>
        {copied ? <Check className="h-4 w-4 text-blue-400" /> : <Copy className="h-4 w-4" />}
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </span>
  );
}

function WebServicesPage({ onContact, onHome }) {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-10 sm:px-6 sm:pb-28 sm:pt-14 lg:px-8" aria-labelledby="web-hero">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.07)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_30%_40%,black_20%,transparent_70%)]"
        />
        <div className="relative mx-auto max-w-6xl">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onHome();
            }}
            className={`inline-flex items-center gap-1.5 rounded font-mono text-xs uppercase tracking-[0.18em] text-zinc-500 transition-colors duration-150 hover:text-white ${FOCUS}`}>
            <ArrowLeft className="h-3.5 w-3.5" /> {SITE_DOMAIN}
          </a>

          <div className="mt-14 grid items-center gap-10 sm:mt-20 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6">
          <Reveal>
            <p className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="sp-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
              </span>
              <Mono className="text-blue-400">Custom Web &amp; Creative Solutions</Mono>
            </p>
            <h1 id="web-hero" className="mt-6 max-w-4xl text-balance text-5xl font-bold tracking-tight text-white sm:text-6xl">
              Bespoke Websites. Built From Scratch<span className="text-blue-500">.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl">
              High-speed, custom-engineered websites tailored to your business. Zero bloated templates, slow page
              builders, or recurring platform drag.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <PrimaryButton onClick={onContact} className="px-6 py-3">
                Start Your Build <ArrowRight className="h-4 w-4" />
              </PrimaryButton>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Website%20Build%20Inquiry`}
                className={`${SECONDARY_CLS} px-6 py-3`}>
                <Mail className="h-4 w-4 text-blue-400" /> Email {CONTACT_EMAIL} for Pricing
              </a>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <PixelMonolith className="mx-auto aspect-[5/4] w-full max-w-xl lg:aspect-square" />
          </Reveal>
          </div>
        </div>
      </section>

      {/* Featured proof of work */}
      <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8" aria-labelledby="proof-of-work">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mb-14">
            <BlueprintRule />
            <Mono className="mt-9 block text-blue-400">Featured Proof of Work</Mono>
            <h2 id="proof-of-work" className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Perkins Lawn &amp; Snow<span className="text-blue-500">.</span>
            </h2>
            <a
              href={PERKINS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-4 inline-flex items-center gap-1 rounded font-mono text-sm text-blue-400 transition-colors duration-150 hover:text-blue-300 ${FOCUS}`}>
              perkinslawnandsnow.com <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </Reveal>

          <Reveal>
            <PerkinsShowcase />
          </Reveal>

          <Reveal delay={100} className="mt-4">
            <FrameCard>
              <dl className="grid gap-8 md:grid-cols-[1fr_2fr_auto] md:items-start md:gap-10">
                <div>
                  <dt className="font-mono text-xs uppercase tracking-[0.18em] text-blue-400">Client</dt>
                  <dd className="mt-3 text-xl font-bold text-white">Perkins Lawn &amp; Snow</dd>
                </div>
                <div>
                  <dt className="font-mono text-xs uppercase tracking-[0.18em] text-blue-400">What We Built</dt>
                  <dd className="mt-3 text-[15px] leading-relaxed text-slate-400">
                    Complete brand website, clear service breakdowns, mobile-first layout, and direct customer
                    quote/lead capture.
                  </dd>
                </div>
                <div>
                  <dt className="sr-only">Live site</dt>
                  <dd>
                    <a
                      href={PERKINS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${SECONDARY_CLS} w-full md:w-auto`}>
                      Visit Live Site <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                  </dd>
                </div>
              </dl>
              <div className="mt-8 flex flex-wrap gap-1.5 border-t border-zinc-800/60 pt-6">
                {PERKINS_TAGS.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            </FrameCard>
          </Reveal>
        </div>
      </section>

      {/* What we build */}
      <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            title="What We Build."
            sub="Hand-coded from the first line, scoped to what your business actually needs to win customers online."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {WEB_BUILDS.map((b, i) => (
              <Reveal key={b.n} delay={i * 100} className="h-full">
                <SpotlightCard>
                  <span className="font-mono text-xs text-blue-400">{b.n} //</span>
                  <h3 className="mt-4 text-xl font-bold text-white">{b.title}</h3>
                  <p className="mb-6 mt-3 text-sm leading-relaxed text-zinc-400">{b.body}</p>
                  <div className="mt-auto flex flex-wrap gap-1.5 border-t border-zinc-800/60 pt-6">
                    {b.tags.map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing & contact callout */}
      <section className="px-4 pb-24 pt-4 sm:px-6 sm:pb-32 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="relative overflow-hidden border border-zinc-800 bg-[#0a0a0a] px-6 py-12 sm:px-12 sm:py-16">
              {CORNERS.map((c) => (
                <span key={c} aria-hidden="true" className={`pointer-events-none absolute h-4 w-4 border-blue-500/70 ${c}`} />
              ))}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl"
              />
              <Mono className="relative text-blue-400">Pricing // Quote</Mono>
              <h2 className="relative mt-4 max-w-3xl text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Custom-Scoped Pricing. Reach Out for a Quote<span className="text-blue-500">.</span>
              </h2>
              <p className="relative mt-5 max-w-2xl text-lg leading-relaxed text-slate-400">
                Every site is scoped around your exact pages, features, and goals, with no bloated agency retainers. Contact{' '}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className={`rounded text-blue-400 transition-colors duration-150 hover:text-blue-300 ${FOCUS}`}>
                  {CONTACT_EMAIL}
                </a>{' '}
                for pricing or send your project details through the main contact form.
              </p>
              <div className="relative mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <PrimaryButton onClick={onContact} className="px-6 py-3">
                  Go to Contact Form <ArrowRight className="h-4 w-4" />
                </PrimaryButton>
                <CopyEmail />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  FAQ & Local Knowledge Base page (hamburger menu only)              */
/* ------------------------------------------------------------------ */

const faqNumber = (f) => String(FAQS.indexOf(f) + 1).padStart(2, '0');

// Inline (i) trigger after a key phrase in an FAQ answer. The scenario is always rendered (crawlers index
// it); only CSS opacity hides it. It shows on hover, on keyboard focus, or on tap (toggled state, closed by
// tapping elsewhere or Escape). On show it is nudged sideways to stay inside the viewport.
function InfoTip({ id, term, text, cta, onContact }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const tipRef = useRef(null);

  const place = () => {
    const wrap = wrapRef.current;
    const tip = tipRef.current;
    if (!wrap || !tip) return;
    // Width comes from CSS (w-72 / sm:w-80, capped at the viewport minus 2rem); only the offset is set here,
    // starting at the (i) and shifted left as needed to keep a 16px gap from either screen edge.
    const r = wrap.getBoundingClientRect();
    const width = tip.offsetWidth;
    const left = Math.min(Math.max(r.left, 16), window.innerWidth - 16 - width);
    tip.style.left = `${left - r.left}px`;
    // Open above the (i) when there is no room below but there is above (clear of the 56px header).
    const h = tip.offsetHeight + 8;
    const above = r.bottom + h > window.innerHeight - 16 && r.top - h > 72;
    tip.style.top = above ? 'auto' : '';
    tip.style.bottom = above ? '100%' : '';
    tip.style.marginTop = above ? '0' : '';
    tip.style.marginBottom = above ? '0.5rem' : '';
  };

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const shown = open
    ? 'pointer-events-auto opacity-100'
    : 'pointer-events-none opacity-0 group-hover/tip:pointer-events-auto group-hover/tip:opacity-100 group-focus-within/tip:pointer-events-auto group-focus-within/tip:opacity-100';

  return (
    <span ref={wrapRef} className="group/tip relative inline-block align-[-3px]" onPointerEnter={place} onFocus={place}>
      <button
        type="button"
        aria-label={`When you need ${term}`}
        aria-describedby={id}
        aria-expanded={open}
        onClick={() => {
          place();
          setOpen((o) => !o);
        }}
        className={`ml-1 grid h-5 w-5 place-items-center rounded-full text-slate-500 transition-colors duration-150 hover:text-blue-400 ${
          open ? 'text-blue-400' : ''
        } ${FOCUS}`}>
        <Info className="h-3.5 w-3.5" />
      </button>
      {/* Hover bridge: a hit area between the icon and the popup so it stays open while the mouse crosses. */}
      <span aria-hidden="true" className="absolute left-0 top-full h-2 w-8" />
      <span
        ref={tipRef}
        id={id}
        role="tooltip"
        // whitespace-normal overrides the nowrap wrapper that keeps the (i) next to its phrase.
        className={`absolute left-0 top-full z-50 mt-2 block w-72 max-w-[calc(100vw-2rem)] whitespace-normal break-words border border-zinc-800 bg-[#0a0a0a] p-4 text-left text-[13px] font-normal leading-relaxed text-slate-300 no-underline shadow-2xl shadow-black transition-opacity duration-200 sm:w-80 ${shown}`}>
        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-blue-400">When you need this</span>
        <span className="mt-1.5 block whitespace-normal break-words text-left">{text}</span>
        {cta && (
          <a
            href="/#contact"
            onClick={(e) => {
              e.preventDefault();
              setOpen(false);
              onContact();
            }}
            className={`mt-3 inline-flex items-center gap-1 rounded font-mono text-[11px] uppercase tracking-wider text-blue-400 transition-colors duration-150 hover:text-blue-300 ${FOCUS}`}>
            See how we handle this <ArrowRight className="h-3 w-3" />
          </a>
        )}
      </span>
    </span>
  );
}

// Splits answer text at each tip's phrase, underlining the phrase and placing its (i) trigger after it.
// `used` makes sure each tip appears once per answer, at its first occurrence.
function withTips(text, tips, used, faqId, onContact) {
  const hits = tips
    .map((t, i) => ({ t, i, at: used.has(i) ? -1 : text.indexOf(t.term) }))
    .filter((h) => h.at >= 0)
    .sort((a, b) => a.at - b.at);
  if (!hits.length) return text;
  const out = [];
  let pos = 0;
  hits.forEach(({ t, i, at }) => {
    if (at < pos) return;
    used.add(i);
    out.push(text.slice(pos, at));
    // The phrase's last word and the (i) never wrap apart.
    const cut = t.term.lastIndexOf(' ') + 1;
    const underline = 'text-slate-200 underline decoration-blue-500/50 decoration-dotted underline-offset-4';
    out.push(
      <span key={i}>
        {cut > 0 && <span className={underline}>{t.term.slice(0, cut)}</span>}
        <span className="whitespace-nowrap">
          <span className={underline}>{t.term.slice(cut)}</span>
          <InfoTip id={`${faqId}-tip-${i}`} term={t.term} text={t.text} cta={t.cta} onContact={onContact} />
        </span>
      </span>,
    );
    pos = at + t.term.length;
  });
  out.push(text.slice(pos));
  return out;
}

function FaqItem({ f, open, onToggle, onContact }) {
  // The answer clips while it expands or collapses, then unclips once open so (i) popups can overflow it.
  const [unclipped, setUnclipped] = useState(open);
  useEffect(() => {
    if (!open) {
      setUnclipped(false);
      return undefined;
    }
    const t = setTimeout(() => setUnclipped(true), 320);
    return () => clearTimeout(t);
  }, [open]);
  const tips = FAQ_TIPS[f.id] ?? [];
  const used = new Set();

  return (
    <article
      id={f.id}
      className={`group relative scroll-mt-36 border bg-[#0a0a0a] transition-colors duration-300 ${
        open ? 'border-blue-500/40' : 'border-zinc-800 hover:border-zinc-700'
      }`}>
      <Brackets />
      <h3>
        <button
          type="button"
          id={`${f.id}-q`}
          aria-expanded={open}
          aria-controls={`${f.id}-a`}
          onClick={onToggle}
          className={`flex w-full items-start gap-4 px-5 py-5 text-left sm:gap-6 sm:px-7 sm:py-6 ${FOCUS}`}>
          <span className={`mt-1.5 shrink-0 font-mono text-[11px] tracking-wider ${open ? 'text-blue-400' : 'text-zinc-500'}`}>
            Q // {faqNumber(f)}
          </span>
          <span className="flex-1 text-base font-semibold leading-snug text-white sm:text-lg">{f.q}</span>
          <span
            aria-hidden="true"
            className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center border transition duration-300 ${
              open ? 'border-blue-500/50 text-blue-300' : 'border-zinc-800 text-zinc-500 group-hover:text-white'
            }`}>
            <Plus className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-45' : ''}`} />
          </span>
        </button>
      </h3>
      {/* Answers stay in the DOM when collapsed (readable by crawlers); inert keeps them out of the tab order. */}
      <div
        id={`${f.id}-a`}
        role="region"
        aria-labelledby={`${f.id}-q`}
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}>
        <div className={unclipped ? 'overflow-visible' : 'overflow-hidden'}>
          <div className="border-t border-zinc-800/70 px-5 pb-6 pt-5 sm:px-7 sm:pl-[6.25rem]">
            <p className="text-[15px] leading-relaxed text-slate-300">{withTips(f.summary, tips, used, f.id, onContact)}</p>
            <ul className="mt-4 space-y-2.5">
              {f.points.map((p) => (
                <li key={p} className="flex gap-2.5 text-sm leading-relaxed text-slate-400">
                  <span aria-hidden="true" className="font-mono text-blue-500">
                    →
                  </span>
                  <span>{withTips(p, tips, used, f.id, onContact)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}

function FaqPage({ onContact, onHome }) {
  const [cat, setCat] = useState('all');
  const [open, setOpen] = useState(() => new Set([FAQS[0].id]));

  // FAQPage + ProfessionalService JSON-LD. The prerendered /faq/index.html already carries the same
  // block (same id) for crawlers; this keeps it present after in-app navigation, and removes it on leave.
  useEffect(() => {
    let el = document.getElementById('faq-jsonld');
    if (!el) {
      el = document.createElement('script');
      el.type = 'application/ld+json';
      el.id = 'faq-jsonld';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(faqJsonLd());
    return () => el.remove();
  }, []);

  // Deep links: /faq#question-id opens that answer and scrolls to it.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id || !FAQS.some((f) => f.id === id)) return;
    setOpen((s) => new Set(s).add(id));
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start' }));
  }, []);

  const toggle = (id) =>
    setOpen((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const groups = FAQ_CATEGORIES.filter((c) => c.id !== 'all' && (cat === 'all' || c.id === cat));
  const count = (id) => (id === 'all' ? FAQS.length : FAQS.filter((f) => f.cat === id).length);

  return (
    <>
      <section className="relative overflow-hidden px-4 pb-14 pt-10 sm:px-6 sm:pt-14 lg:px-8" aria-labelledby="faq-title">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.07)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_30%_30%,black_15%,transparent_65%)]"
        />
        <div className="relative mx-auto max-w-6xl">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onHome();
            }}
            className={`inline-flex items-center gap-1.5 rounded font-mono text-xs uppercase tracking-[0.18em] text-zinc-500 transition-colors duration-150 hover:text-white ${FOCUS}`}>
            <ArrowLeft className="h-3.5 w-3.5" /> {SITE_DOMAIN}
          </a>
          <Reveal className="mt-14 sm:mt-20">
            <p className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="sp-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
              </span>
              <Mono className="text-blue-400">FAQ // Quad Cities Knowledge Base</Mono>
            </p>
            <h1 id="faq-title" className="mt-6 max-w-4xl text-balance text-5xl font-bold tracking-tight text-white sm:text-6xl">
              Questions, answered<span className="text-blue-500">.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-400">
              Straight answers about Scrimmy and Scrimmage Productions LLC: custom web design for Quad Cities businesses,
              operations and lead-routing automation, event production, pricing and how to start.
            </p>
            <ul aria-label="Areas served" className="mt-8 flex flex-wrap gap-1.5">
              {SERVICE_AREA.map((c) => (
                <li key={c.name}>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-slate-300">
                    <MapPin className="h-3.5 w-3.5 text-blue-500" />
                    {c.name}, {c.region === 'Iowa' ? 'IA' : 'IL'}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={100} className="mt-12">
            <dl className="grid gap-px overflow-hidden border border-zinc-800 bg-zinc-800 sm:grid-cols-2 lg:grid-cols-5">
              {FAQ_FACTS.map((f) => (
                <div key={f.k} className="bg-[#0a0a0a] p-5">
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-blue-400">{f.k}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-slate-300">{f.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="overflow-x-clip px-4 pb-20 sm:px-6 sm:pb-28 lg:px-8" aria-label="Frequently asked questions">
        <div className="mx-auto max-w-6xl">
          <div role="group" aria-label="Filter questions by topic" className="sticky top-14 z-20 -mx-4 flex gap-1.5 overflow-x-auto border-b border-zinc-900 bg-black/90 px-4 py-3 backdrop-blur sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
            {FAQ_CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={cat === c.id}
                onClick={() => setCat(c.id)}
                className={`inline-flex min-h-[36px] shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors duration-200 ${FOCUS} ${
                  cat === c.id
                    ? 'border-blue-500/50 bg-blue-500/10 text-blue-300'
                    : 'border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-white'
                }`}>
                {c.label}
                <span className={cat === c.id ? 'text-blue-500' : 'text-zinc-700'}>{count(c.id)}</span>
              </button>
            ))}
          </div>

          {groups.map((g) => (
            <div key={g.id} className="mt-12">
              <h2 className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-zinc-500">
                <span className="text-blue-500">//</span> {g.label}
                <span aria-hidden="true" className="h-px flex-1 bg-zinc-900" />
              </h2>
              <div className="space-y-3">
                {FAQS.filter((f) => f.cat === g.id).map((f, i) => (
                  // Each Reveal is its own stacking context (transform), so the item with an active (i) popup is
                  // raised above the questions after it: hover beats a tapped popup beats keyboard focus elsewhere, all
                  // below the sticky filter bar (z-20).
                  <Reveal
                    key={f.id}
                    delay={Math.min(i, 4) * 100}
                    className="relative focus-within:z-10 has-[button[aria-describedby][aria-expanded=true]]:z-[11] hover:z-[12]">
                    <FaqItem f={f} open={open.has(f.id)} onToggle={() => toggle(f.id)} onContact={onContact} />
                  </Reveal>
                ))}
              </div>
            </div>
          ))}

          <Reveal className="mt-16">
            <div className="relative overflow-hidden border border-zinc-800 bg-[#0a0a0a] px-6 py-12 sm:px-12 sm:py-14">
              {CORNERS.map((c) => (
                <span key={c} aria-hidden="true" className={`pointer-events-none absolute h-4 w-4 border-blue-500/70 ${c}`} />
              ))}
              <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" />
              <Mono className="relative text-blue-400">Still have a question?</Mono>
              <h2 className="relative mt-4 max-w-3xl text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ask it directly<span className="text-blue-500">.</span>
              </h2>
              <p className="relative mt-5 max-w-2xl text-lg leading-relaxed text-slate-400">
                Websites, workflow audits or event production: send the details and get a straight answer and a
                custom-scoped quote.
              </p>
              <div className="relative mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <PrimaryButton onClick={onContact} className="px-6 py-3">
                  Go to Contact Form <ArrowRight className="h-4 w-4" />
                </PrimaryButton>
                <CopyEmail />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
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
  /* Hero boot: each block ignites at its column's delay (--ig): faint cell → blue flash → white.
     The text fades only fill backwards, so once they end the scroll-driven inline opacity takes over again. */
  @keyframes sp-ignite {
    0% { fill: #3b82f6; fill-opacity: 0.1; }
    35% { fill: #3b82f6; fill-opacity: 1; }
    100% { fill: #ffffff; fill-opacity: 1; }
  }
  .sp-ignite { animation: sp-ignite ${BOOT_IGNITE_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1) var(--ig) both; }
  /* Phosphor stamp-in once SCRIMMY has locked, then the buffer shred. Everything runs on the same clock
     (delayed to the lock) with step-end, so each keyframe holds until the next: hard frame swaps.
     Only the rim glow's final 200ms eases. Filling backwards keeps elements hidden while they wait;
     pointer-events comes from the class, so nothing is left once the boot classes are removed.
     The dot-matrix is a black overlay (::after) punched with a 3px grid of holes, reaching 16px above and
     below each element so glows are textured rather than clipped. */
  @keyframes sp-boot-stamp {
    0% { opacity: 0; }
    0.1% { opacity: 0.3; filter: grayscale(1) contrast(2); text-shadow: none; }
    ${stampAt(350)} { opacity: 1; filter: none; text-shadow: none; }
    ${stampAt(460)} { text-shadow: -3px 0 #00f0ff, 3px 0 #ffffff; }
    ${stampAt(490)}, 100% { opacity: 1; filter: none; text-shadow: none; }
  }
  /* The navbar sits outside the hero, so it takes the shred's light, not its geometry. */
  @keyframes sp-boot-stamp-nav {
    0% { opacity: 0; }
    0.1% { opacity: 0.3; filter: grayscale(1) contrast(2); text-shadow: none; }
    ${stampAt(350)} { opacity: 0.95; filter: brightness(2.8) contrast(2); text-shadow: none; }
    ${stampAt(375)} { opacity: 1; filter: none; }
    ${stampAt(430)} { opacity: 0.15; }
    ${stampAt(460)} { opacity: 1; filter: brightness(1.8); text-shadow: -3px 0 #00f0ff, 3px 0 #ffffff; }
    ${stampAt(490)}, 100% { opacity: 1; filter: none; text-shadow: none; }
  }
  @keyframes sp-boot-grid {
    0% { opacity: 0; }
    0.1% { opacity: 1; }
    ${stampAt(350)}, 100% { opacity: 0; }
  }
  /* Frame 6 rim on the pill shapes (badges, buttons, status dot), easing out over the last 200ms. */
  @keyframes sp-boot-rim {
    0% { box-shadow: none; }
    ${stampAt(490)}, ${stampAt(525)} { box-shadow: 0 0 12px rgba(59, 130, 246, 0.7); animation-timing-function: ease-out; }
    100% { box-shadow: 0 0 0 rgba(59, 130, 246, 0); }
  }
  .sp-boot-stamp {
    pointer-events: none;
    animation: sp-boot-stamp ${BOOT_STAMP_MS}ms step-end ${BOOT_REVEAL_MS}ms backwards;
  }
  header.sp-boot-stamp { animation-name: sp-boot-stamp-nav; }
  .sp-boot-stamp:not(.sticky, .absolute) { position: relative; }
  .sp-boot-stamp::after {
    content: '';
    position: absolute;
    inset: -16px 0;
    pointer-events: none;
    opacity: 0;
    background-image: radial-gradient(circle, transparent 1.1px, #000 1.4px);
    background-size: 3px 3px;
    animation: sp-boot-grid ${BOOT_STAMP_MS}ms step-end ${BOOT_REVEAL_MS}ms backwards;
  }
  /* Buttons reset text-shadow in the browser's default styles, so pull the split through. */
  .sp-boot-stamp button { text-shadow: inherit; }
  .sp-boot-stamp :is(button, span).rounded-full {
    animation: sp-boot-rim ${BOOT_STAMP_MS}ms step-end ${BOOT_REVEAL_MS}ms backwards;
  }

  /* Buffer shred, hero geometry. Frames 1 and 5 smear the whole stage about its centre. */
  @keyframes sp-shred-stage {
    0% { transform: none; filter: none; opacity: 1; }
    ${stampAt(350)} {
      transform: scaleX(5) scaleY(0.12); transform-origin: 50% 50%; opacity: 0.95;
      filter: brightness(2.8) contrast(2) drop-shadow(0 0 24px #00f0ff);
    }
    ${stampAt(375)} { transform: none; filter: none; opacity: 1; }
    ${stampAt(460)} {
      transform: scaleX(2.2) scaleY(0.6); transform-origin: 50% 50%;
      filter: brightness(1.8) drop-shadow(0 0 14px #3b82f6);
    }
    ${stampAt(490)}, 100% { transform: none; filter: none; opacity: 1; }
  }
  .sp-shred-stage { animation: sp-shred-stage ${BOOT_STAMP_MS}ms step-end ${BOOT_REVEAL_MS}ms; }
  /* The real stage hides while the copies shred it (frames 2-3), then blanks to 15% through 1px
     scanlines (frame 4). */
  @keyframes sp-shred-orig {
    0% { opacity: 1; -webkit-mask-image: none; mask-image: none; }
    ${stampAt(375)} { opacity: 0; }
    ${stampAt(430)} {
      opacity: 0.15;
      -webkit-mask-image: repeating-linear-gradient(0deg, #000 0 1px, transparent 1px 2px);
      mask-image: repeating-linear-gradient(0deg, #000 0 1px, transparent 1px 2px);
    }
    ${stampAt(460)}, 100% { opacity: 1; -webkit-mask-image: none; mask-image: none; }
  }
  .sp-shred-orig { animation: sp-shred-orig ${BOOT_STAMP_MS}ms step-end ${BOOT_REVEAL_MS}ms; }
  /* Copies: 55ms from +375ms. 0-54.55% is frame 2 (3-tier split), 54.55-100% frame 3 (five ribbons).
     Their own stamp text-shadow is overridden so each slice's split shows. */
  .sp-shred-layer { opacity: 0; animation: 55ms step-end ${BOOT_REVEAL_MS + 375}ms; }
  .sp-shred-layer :is(.sp-boot-stamp, button) { text-shadow: inherit !important; }
  .sp-shred-1 { animation-name: sp-shred-1; }
  .sp-shred-2 { animation-name: sp-shred-2; }
  .sp-shred-3 { animation-name: sp-shred-3; }
  .sp-shred-4 { animation-name: sp-shred-4; }
  .sp-shred-5 { animation-name: sp-shred-5; }
  @keyframes sp-shred-1 {
    0% { opacity: 1; clip-path: inset(0 0 65% 0); transform: translateX(-48px); }
    54.55%, 100% { opacity: 1; clip-path: inset(0 0 82% 0); transform: translateX(36px); }
  }
  @keyframes sp-shred-2 {
    0% { opacity: 1; clip-path: inset(55% 0 0 0); transform: translateX(-18px); filter: none; }
    54.55%, 100% { opacity: 1; clip-path: inset(18% 0 64% 0); transform: translateX(-28px); filter: invert(0.25) brightness(1.8); }
  }
  @keyframes sp-shred-3 {
    0% { opacity: 0; }
    54.55%, 100% {
      opacity: 1; clip-path: inset(36% 0 42% 0); transform: translateX(42px);
      text-shadow: -6px 0 #00f0ff, 6px 0 #ffffff;
    }
  }
  @keyframes sp-shred-4 {
    0% { opacity: 0; }
    54.55%, 100% { opacity: 1; clip-path: inset(58% 0 22% 0); transform: translateX(-16px); }
  }
  @keyframes sp-shred-5 {
    0% { opacity: 0; }
    54.55%, 100% { opacity: 1; clip-path: inset(78% 0 0 0); transform: translateX(22px); }
  }
  /* Frame 2's electric-blue blockout across the middle band, pushed +30px. */
  @keyframes sp-shred-block { from, to { opacity: 0.8; } }
  .sp-shred-block {
    opacity: 0;
    clip-path: inset(35% 0 45% 0);
    transform: translateX(30px);
    animation: sp-shred-block 30ms step-end ${BOOT_REVEAL_MS + 375}ms;
  }
  /* Frame 2's 2px interlace over the hero. */
  @keyframes sp-boot-flash { from, to { opacity: 1; } }
  .sp-boot-interlace { opacity: 0; animation: sp-boot-flash 30ms step-end ${BOOT_REVEAL_MS + 375}ms; }
  /* Skeleton bones: a dark-blue band with a faint electric-blue core slides across every 2s. */
  @keyframes sp-bone { from { background-position: -100% 0; } to { background-position: 200% 0; } }
  .sp-bone {
    background-image: linear-gradient(90deg, transparent, rgba(23,37,84,0.4) 40%, rgba(59,130,246,0.1) 50%, rgba(23,37,84,0.4) 60%, transparent);
    background-size: 50% 100%;
    background-repeat: no-repeat;
    animation: sp-bone 2s cubic-bezier(0.45, 0, 0.55, 1) infinite;
  }
  @keyframes sp-fade { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: none; } }
  .sp-fade { animation: sp-fade 250ms ease-out; }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    .sp-fade { animation: none; }
    .sp-ping, .sp-bob, .sp-breathe, .sp-bone { animation: none; }
    .sp-beam { animation: none; opacity: 0; }
  }
`;

export default function App() {
  const [route, setRoute] = useState(initialRoute);
  const [active, setActive] = useState('');
  // The boot sequence belongs to the home hero, so a deep link to Website Services skips it.
  const [booting, setBooting] = useState(() => initialRoute() === 'home' && shouldBoot());
  // Section to scroll to once the home page has rendered (after switching from Website Services).
  const [pendingScroll, setPendingScroll] = useState(null);
  const [contactPreset, setContactPreset] = useState(null);

  // Mark the boot as seen for this session, then drop the boot classes once it has finished.
  useEffect(() => {
    if (!booting) return undefined;
    try {
      sessionStorage.setItem(BOOT_KEY, 'true');
    } catch {
      // Storage unavailable: the sequence may play again next load.
    }
    const t = setTimeout(() => setBooting(false), BOOT_TOTAL_MS);
    return () => clearTimeout(t);
  }, [booting]);

  // Back/forward between pages.
  useEffect(() => {
    const onPop = () => {
      setBooting(false);
      setRoute(routeFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Per-page title, description and canonical URL (the prerendered /faq ships these statically too).
  useEffect(() => {
    const meta = PAGE_META[route];
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://${SITE_DOMAIN}${PAGE_PATHS[route]}`;
  }, [route]);

  // Highlight the menu entry for the section in view (home page only).
  useEffect(() => {
    if (route !== 'home') return undefined;
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
  }, [route]);

  // Runs after the home page has mounted, so the target section exists.
  useEffect(() => {
    if (route !== 'home' || !pendingScroll) return undefined;
    const raf = requestAnimationFrame(() => {
      scrollToId(pendingScroll);
      setPendingScroll(null);
    });
    return () => cancelAnimationFrame(raf);
  }, [route, pendingScroll]);

  const jumpTop = () => window.scrollTo({ top: 0, behavior: 'instant' });

  // Open a standalone page ('web' or 'faq') at its top.
  const showPage = (r) => {
    if (route !== r) {
      window.history.pushState(null, '', PAGE_PATHS[r]);
      setBooting(false);
      setRoute(r);
    }
    jumpTop();
  };
  const showWeb = () => showPage('web');

  const showSection = (id) => {
    if (route === 'home') {
      scrollToId(id);
      return;
    }
    window.history.pushState(null, '', '/');
    setActive('');
    setRoute('home');
    jumpTop();
    setPendingScroll(id);
  };

  const goHome = () => {
    if (route === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    window.history.pushState(null, '', '/');
    setActive('');
    setRoute('home');
    jumpTop();
  };

  // Website Services CTAs: open the home contact form with the project type written in.
  const contactForWeb = () => {
    setContactPreset((p) => ({ line: PROJECT_TYPE_LINE, n: (p?.n ?? 0) + 1 }));
    showSection('contact');
  };

  const onNavigate = (id) => (id === 'web' || id === 'faq' ? showPage(id) : showSection(id));

  return (
    <div className="relative min-h-screen bg-black font-sans text-slate-400 antialiased selection:bg-blue-600/40 selection:text-white">
      <style>{GLOBAL_CSS}</style>
      <NavBar current={route === 'home' ? active : route} onNavigate={onNavigate} onHome={goHome} booting={booting} />
      {route === 'web' && (
        <main>
          <WebServicesPage onContact={contactForWeb} onHome={goHome} />
        </main>
      )}
      {route === 'faq' && (
        <main>
          <FaqPage onContact={() => showSection('contact')} onHome={goHome} />
        </main>
      )}
      {route === 'home' && (
        <main>
          <Hero booting={booting} />
          <About />
          <Ecosystems />
          <Services onOpenWeb={showWeb} />
          <Contact preset={contactPreset} />
        </main>
      )}
      <Footer />
    </div>
  );
}
