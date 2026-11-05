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

const ABOUT_STATS = [
  { value: '100+', label: 'Cities in one Global Pizza Party' },
  { value: '50+', label: 'Countries reached' },
  { value: 'May 22', label: 'Bitcoin Pizza Day, every year' },
];

const ECOSYSTEMS = [
  {
    icon: Pizza,
    org: 'PizzaDAO',
    role: 'Core Organizer',
    body: 'A core organizer and key face of PizzaDAO. I orchestrate the Global Pizza Party for Bitcoin Pizza Day (May 22) across 100+ cities in 50+ countries, using Web3 to onboard everyday people by decentralizing joy.',
    points: ['Global Pizza Party, 100+ cities', 'Local pizzeria partnerships', 'Everyday onboarding to Web3'],
  },
  {
    icon: Mountain,
    org: 'Avalanche',
    role: 'Avax Team · Ecosystem Support',
    body: 'Direct ecosystem support for a global network of builders, developers and projects integrating tokenomics, subnets and high-throughput blockchain infrastructure.',
    points: ['Builder & project support', 'Tokenomics and subnets', 'High-throughput infrastructure'],
  },
  {
    icon: Landmark,
    org: 'Stand With Crypto',
    role: 'Iowa Chapter President',
    body: 'Organizing the crypto grassroots community in Iowa: running voter education and advocating for clear, sensible digital asset policy.',
    points: ['Grassroots organizing', 'Voter education', 'Digital asset policy advocacy'],
  },
];

const SERVICES = [
  {
    n: '01',
    icon: CalendarRange,
    title: 'Event Planning & Global Production',
    body: 'High-stakes run-of-show design, multi-city logistics, venue and indie vendor deals, sponsor integrations, and crypto-native ticketing.',
    tags: ['Run-of-show', 'Multi-city', 'Vendors & venues', 'Sponsors', 'Ticketing'],
  },
  {
    n: '02',
    icon: Megaphone,
    title: 'Marketing & Business Consulting',
    body: 'Operational friction audits, grassroots community flywheels, go-to-market strategy, workflow automation, and tech stack triage.',
    tags: ['Ops audits', 'Community', 'GTM', 'Automation', 'Stack triage'],
  },
  {
    n: '03',
    icon: Code2,
    title: 'High-Velocity Website Development',
    body: 'Bespoke Vite + React 19 builds, custom domain routing, local SEO architecture, and automated lead-to-calendar pipelines. No bloated Wix or Squarespace templates.',
    tags: ['Vite', 'React 19', 'Local SEO', 'Domains', 'Lead pipelines'],
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

// Every lit block gets a fixed dissolve threshold, so the title breaks apart unevenly as you scroll.
const TITLE_BLOCKS = TITLE.split('').flatMap((ch, li) =>
  GLYPHS[ch].flatMap((row, y) =>
    row.split('').flatMap((on, x) => {
      const col = li * (5 + GAP_COLS) + x;
      const t = 0.12 + (((col * 7 + y * 13 + li * 5) % 17) / 17) * 0.7;
      return [{ key: `${li}-${x}-${y}`, x: col * CELL, y: y * CELL, on: on === '1', t: t.toFixed(3) }];
    }),
  ),
);

function DigitalTitle() {
  return (
    <svg
      viewBox={`0 0 ${TITLE_COLS * CELL} ${7 * CELL}`}
      className="h-auto w-full"
      role="img"
      aria-label="SCRIMMY">
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
            style={{ '--t': b.t }}
          />
        ) : (
          <rect key={b.key} x={b.x + 4} y={b.y + 4} width={2} height={2} fill="#1d4ed8" opacity={0.35} />
        ),
      )}
    </svg>
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
/*  Hero: digital title that scales and dissolves on scroll            */
/* ------------------------------------------------------------------ */

function Hero() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const section = sectionRef.current;
      const stage = stageRef.current;
      if (!section || !stage) return;
      // 0 at the top of the page, 1 once the pinned hero has been scrolled past.
      const travel = Math.max(section.offsetHeight - window.innerHeight, 1);
      const p = Math.min(Math.max(-section.getBoundingClientRect().top / travel, 0), 1);
      stage.style.setProperty('--p', p.toFixed(4));
      stage.style.transform = `scale(${1 + p * 0.35})`;
      stage.style.opacity = String(1 - Math.max(0, (p - 0.55) / 0.45));
      stage.style.pointerEvents = p >= 0.98 ? 'none' : '';
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[170svh]" aria-label="Introduction">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden px-4 sm:px-6 lg:px-8">
        {/* Faint blue grid behind the title */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.07)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
        />
        <div ref={stageRef} className="relative mx-auto w-full max-w-6xl origin-center will-change-transform">
          <p className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="sp-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
            </span>
            <Mono className="text-blue-400">SYSTEM_ONLINE // {SITE_DOMAIN}</Mono>
          </p>

          <h1 className="mt-8">
            <DigitalTitle />
          </h1>

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

        <button
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
/*  About                                                              */
/* ------------------------------------------------------------------ */

function About() {
  return (
    <section id="about" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          index="01"
          eyebrow="About"
          title="Builder. Operator. Organizer."
          sub="I'm Scrimmy, also known as Young Scrimmage and Don Scrimmy Jon, based in the Quad Cities. I bring people together in real life, help builders ship on-chain, and organize communities around better technology and policy."
        />
        <Reveal>
          <dl className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
            {ABOUT_STATS.map(({ value, label }) => (
              <div key={label} className="bg-black p-6 sm:p-8">
                <dt className="text-4xl font-bold tracking-tight text-white sm:text-5xl">{value}</dt>
                <dd className="mt-2 font-mono text-xs uppercase tracking-wider text-slate-400">{label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
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
                    <span className="rounded-full border border-blue-500/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-blue-300">
                      Active
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
                    <span className="font-mono text-sm font-medium text-blue-400">{s.n} /</span>
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
  /* Each block fades out once scroll progress (--p) passes its own threshold (--t). */
  .sp-block { opacity: clamp(0, calc((var(--t) - var(--p, 0)) * 8), 1); }
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
