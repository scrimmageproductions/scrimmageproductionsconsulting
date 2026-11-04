import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Bot,
  Building,
  Check,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code2,
  Cpu,
  FileText,
  Globe,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Menu,
  Pizza,
  Rocket,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Target,
  Users,
  X,
  Zap,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Configuration                                                      */
/* ------------------------------------------------------------------ */

const SITE_DOMAIN = 'scrimmy.xyz';
const CONTACT_EMAIL = 'scrimmageproductions@gmail.com';
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
// Web3Forms routes submissions to the inbox that owns the access key (scrimmageproductions@gmail.com).
// This key is public by design: it can only send to that inbox. If it is ever removed or set back
// to a YOUR_ placeholder, submissions fall back to a pre-filled email.
const WEB3FORMS_ACCESS_KEY = '50f8f02c-b73b-48fc-b143-c16c183fb208';
const KEY_CONFIGURED = !WEB3FORMS_ACCESS_KEY.startsWith('YOUR_');

const NAV_LINKS = [
  { id: 'services', label: 'Services' },
  { id: 'events', label: 'PizzaDAO / Events' },
  { id: 'work', label: 'Case Studies' },
  { id: 'diagnostic', label: 'Diagnostic' },
  { id: 'contact', label: 'Contact' },
];

const HERO_METRICS = [
  { value: '100+', label: 'Global cities activated' },
  { value: 'Sub-second', label: 'React page loads' },
  { value: '15+ hrs/wk', label: 'Saved per team' },
  { value: 'Billions', label: 'AI tokens in pipeline' },
];

const CAPABILITIES = [
  'Vite + React 19 builds',
  'Tailwind CSS v4',
  'Vercel deploys & domain migration',
  'Meta / Facebook lead routing',
  'Muse AI integrations',
  'Zapier & Make webhooks',
  'Lead-to-calendar sync',
  'Proposal & document generation',
  'Google Workspace audits',
  'SOP synthesis',
  'Multi-city run-of-show',
  'Sponsor activations',
  'Crypto-native ticketing',
];

const CONSOLE_LINES = [
  { icon: Bot, text: 'Facebook lead routed to calendar · 00:04s' },
  { icon: Rocket, text: 'Production build deployed to Vercel' },
  { icon: FileText, text: 'Proposal generated from intake form' },
  { icon: Globe, text: 'Run-of-show synced across 14 cities' },
];

const PILLARS = [
  {
    id: 'web',
    icon: Code2,
    title: 'Web & App Development',
    offering:
      'Ultra-fast, custom-engineered web applications and business platforms built on Vite, React 19, Tailwind and Vercel.',
    value:
      'No bloated, fragile Wix or Squarespace boilerplate. Sub-second load times, mobile-first design, contact routes that actually reach you, and a full domain migration.',
    deliverables: [
      'Custom React web apps',
      'Local business capture engines',
      'High-converting landing funnels',
      'API-connected dynamic sites',
      'Technical SEO architecture',
    ],
    stack: ['Vite', 'React 19', 'Tailwind', 'Vercel'],
  },
  {
    id: 'automation',
    icon: Bot,
    title: 'AI & Workflow Automation',
    offering: 'Practical, automated operations that remove manual busywork and triage inbound leads.',
    value:
      'Lead-to-calendar sync, CRM ingestion and custom LLM workflows that run 24/7 without anyone babysitting them.',
    deliverables: [
      'Muse AI & Meta / Facebook integrations',
      'Webhook pipelines (Zapier, Make)',
      'Automated document & proposal generation',
      'Inbox categorization',
      'Lead scrapers',
    ],
    stack: ['LLM APIs', 'Zapier', 'Make', 'Webhooks'],
  },
  {
    id: 'consulting',
    icon: Target,
    title: 'Business & Operational Consulting',
    offering: 'End-to-end operational audits, tech stack overhauls and process design.',
    value:
      'Pinpoint the exact friction points where time, leads and capital leak out, before a single line of code is written.',
    deliverables: [
      'Friction teardowns',
      'Conversion funnel forensics',
      'Google Workspace & data permission audits',
      'SOP synthesis',
      'Custom tooling strategy',
    ],
    stack: ['Ops audits', 'Process design', 'Google Workspace'],
  },
  {
    id: 'events',
    icon: Globe,
    title: 'Event Production & Global Operations',
    offering: 'Large-scale event production, decentralized community operations and live experiential networking.',
    value:
      'Led by PizzaDAO’s Director of Operations: Global Pizza Party events produced across 100+ cities and 50+ countries.',
    deliverables: [
      'Live event production',
      'Sponsor integration & experiential marketing',
      'Global multi-city coordination',
      'Ticketing pipelines',
      'Vendor & venue negotiation',
    ],
    stack: ['Run-of-show', 'Sponsors', 'Ticketing', 'Vendors'],
  },
];

const EVENT_STATS = [
  { value: '100+', label: 'Cities worldwide' },
  { value: '50+', label: 'Countries' },
  { value: 'Tens of thousands', label: 'Attendees united' },
  { value: 'May 22', label: 'One date, every timezone: multi-timezone vendor management' },
];

const EVENT_CROSSOVER = [
  {
    icon: Cpu,
    title: 'Technical ops',
    body: 'Crypto-native ticketing and perks, sponsor activations and coordinated comms across every city.',
  },
  {
    icon: MapPin,
    title: 'Logistics',
    body: 'International venue logistics, local pizzeria partnerships, budgeting and vendor management across time zones.',
  },
  {
    icon: Users,
    title: 'Real-world execution',
    body: 'Thousands of attendees and a live community run-of-show, delivered on a single day around the world.',
  },
];

const CASE_STUDIES = [
  {
    icon: Pizza,
    tag: 'Event Production · PizzaDAO',
    title: 'Global Pizza Party',
    summary:
      'Produced PizzaDAO’s Global Pizza Party for Bitcoin Pizza Day (May 22) across 100+ cities in 50+ countries.',
    points: [
      'Thousands of attendees coordinated',
      'Local pizzeria partnerships and international venue logistics',
      'Sponsor activations, budgeting and crypto-native ticketing',
    ],
  },
  {
    icon: Code2,
    tag: 'Web Development · Consulting',
    title: 'Scrimmage Productions consulting platform',
    summary:
      'A Vite + React 19 site with a 4-step diagnostic funnel that builds a live report and delivers every intake by email.',
    points: [
      'Single-file React architecture deployed on Vercel',
      'Real-time diagnostic report with value estimates',
      'Web3Forms delivery with an email fallback',
    ],
  },
  {
    icon: Bot,
    tag: 'AI Automation · Reference build',
    title: 'Lead-to-calendar pipeline',
    summary:
      'The pattern behind most automation work: a Facebook lead is qualified, logged to the CRM and booked on a calendar without anyone touching it.',
    points: ['Meta lead form → webhook', 'LLM qualification and CRM ingestion', 'Calendar booking and confirmation email'],
  },
];

const METHOD_STEPS = [
  {
    n: '01',
    icon: Search,
    title: 'Find the Bottlenecks',
    tag: 'The Film Room',
    body: 'I map how your business, product or event actually runs today and find exactly where time, leads and money leak.',
    points: ['Discovery calls', 'Stack & funnel teardown', 'Bottleneck scoring'],
  },
  {
    n: '02',
    icon: Settings,
    title: 'Build the Plan',
    tag: 'The Playbook',
    body: 'I design the stack, the automations or the run-of-show, sequenced so the highest-return work ships first.',
    points: ['Architecture & scope', 'Automation blueprints', 'Milestone sprints'],
  },
  {
    n: '03',
    icon: Zap,
    title: 'Ship & Operate',
    tag: 'The Execution',
    body: 'I build, deploy and run it alongside your team until it holds up without me.',
    points: ['Hands-on build', 'Launch & handoff', 'Live operations'],
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const fmtMoney = (n) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

const buildMailto = (subject, body) =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

async function submitToWeb3Forms(payload) {
  if (!KEY_CONFIGURED) {
    const err = new Error('not-configured');
    err.code = 'not-configured';
    throw err;
  }
  const res = await fetch(WEB3FORMS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ access_key: WEB3FORMS_ACCESS_KEY, ...payload }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) throw new Error(data.message || 'Submission failed');
  return data;
}

/* ------------------------------------------------------------------ */
/*  Brand primitives                                                   */
/* ------------------------------------------------------------------ */

// 5x7 dot-matrix "S", echoing the particle letterform in the logo.
const S_MATRIX = ['01111', '10000', '10000', '01110', '00001', '00001', '11110'];

function MatrixS({ size = 36 }) {
  const cell = 10;
  return (
    <svg width={size} height={size} viewBox="-6 -6 62 82" aria-hidden="true">
      {S_MATRIX.flatMap((row, y) =>
        row.split('').map((on, x) => (
          <circle
            key={`${x}-${y}`}
            cx={x * cell + 5}
            cy={y * cell + 5}
            r={on === '1' ? 3.8 : 1.3}
            fill={on === '1' ? '#ffffff' : '#52525b'}
          />
        )),
      )}
    </svg>
  );
}

function Logo({ onClick, tagline = false }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2.5 rounded-lg text-left transition-opacity duration-200 hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
      aria-label={`${SITE_DOMAIN}, back to top`}>
      <MatrixS size={tagline ? 30 : 22} />
      <span className="leading-tight">
        <span className="block text-[15px] font-semibold tracking-tight text-white">
          scrimmy<span className="font-normal text-zinc-500">.xyz</span>
        </span>
        {tagline && <span className="block text-xs text-zinc-500">Scrimmage Productions LLC</span>}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Scroll reveal                                                      */
/* ------------------------------------------------------------------ */

// False while the intro loader is on screen, so nothing reveals behind it.
const RevealReadyContext = createContext(true);

const REVEAL_OBSERVER_OPTIONS = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };

// Reduced-motion users, and browsers without IntersectionObserver, get content shown immediately.
const revealStartsVisible = () =>
  typeof window === 'undefined' ||
  !('IntersectionObserver' in window) ||
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) {
  const ref = useRef(null);
  const ready = useContext(RevealReadyContext);
  const [instant] = useState(revealStartsVisible);
  const [shown, setShown] = useState(instant);

  useEffect(() => {
    if (shown || !ready) return undefined;
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
  }, [ready, shown]);

  const motion = instant
    ? 'opacity-100 translate-y-0'
    : `transition-all duration-700 ease-out ${shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-7'}`;

  return (
    <Tag
      ref={ref}
      className={`${motion} ${className}`}
      style={!instant && delay ? { ...style, transitionDelay: `${delay}ms` } : style}
      {...rest}>
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/*  System components                                                  */
/* ------------------------------------------------------------------ */

function SectionHeader({ eyebrow, title, sub, center = true }) {
  return (
    <Reveal className={`mb-14 max-w-3xl ${center ? 'mx-auto text-center' : ''}`}>
      <p className="text-sm font-medium text-zinc-500">{eyebrow}</p>
      <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">{title}</h2>
      {sub && <p className="mt-5 text-lg leading-relaxed text-zinc-400 sm:text-xl">{sub}</p>}
    </Reveal>
  );
}

// Flat, slightly elevated system-gray surface.
function Card({ className = '', children, ...rest }) {
  return (
    <div className={`rounded-3xl border border-white/5 bg-zinc-900 ${className}`} {...rest}>
      {children}
    </div>
  );
}

function Badge({ children }) {
  return <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-300">{children}</span>;
}

const PRESS = 'transition duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black';

function PrimaryButton({ children, className = '', ...rest }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-cyan-500 px-5 py-2.5 text-[15px] font-medium text-white hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 ${PRESS} ${className}`}
      {...rest}>
      {children}
    </button>
  );
}

const SECONDARY_CLS = `inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-[15px] font-medium text-cyan-500 hover:bg-cyan-500/10 ${PRESS}`;

function SecondaryButton({ children, className = '', ...rest }) {
  return (
    <button className={`${SECONDARY_CLS} ${className}`} {...rest}>
      {children}
    </button>
  );
}

// Text-style action, like Apple's "Learn more >" links.
function TextAction({ children, className = '', ...rest }) {
  return (
    <button
      className={`inline-flex items-center gap-1 rounded-md text-[15px] font-medium text-cyan-500 transition-colors duration-200 hover:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${className}`}
      {...rest}>
      {children}
    </button>
  );
}

// Native iOS-style slider: thin zinc track, cyan fill up to the thumb, white circular thumb.
function RangeSlider({ id, value, min, max, step = 1, onChange }) {
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="sp-range my-3 w-full"
      style={{ '--fill': `${fill}%` }}
    />
  );
}

const INPUT_CLS =
  'w-full rounded-xl border-0 bg-zinc-800 px-4 py-3 text-[15px] text-white placeholder:text-zinc-500 outline-none transition duration-200 focus:ring-2 focus:ring-cyan-500';

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */

function NavBar({ active }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const go = (id) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl backdrop-saturate-150">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Logo onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

          <ul className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => go(l.id)}
                  aria-current={active === l.id ? 'true' : undefined}
                  className={`rounded text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                    active === l.id ? 'text-white' : 'text-zinc-400 hover:text-white'
                  }`}>
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <span className="hidden sm:block">
              <PrimaryButton onClick={() => go('diagnostic')} className="px-4 py-1.5 text-sm">
                Start Free Diagnostic
              </PrimaryButton>
            </span>
            <button
              onClick={() => setOpen(true)}
              className={`grid h-9 w-9 place-items-center rounded-full text-zinc-300 hover:bg-zinc-800 lg:hidden ${PRESS}`}
              aria-label="Open menu"
              aria-expanded={open}>
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer: kept outside the header, whose backdrop-filter would otherwise trap position:fixed */}
      <div
        className={`fixed inset-0 z-[60] lg:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!open}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        />
        <aside
          className={`absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col bg-zinc-900 p-6 shadow-lg shadow-black/50 transition-transform duration-300 ease-out ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}>
          <div className="mb-6 flex items-center justify-between">
            <MatrixS size={24} />
            <button
              onClick={() => setOpen(false)}
              className={`grid h-9 w-9 place-items-center rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 ${PRESS}`}
              aria-label="Close menu">
              <X className="h-4 w-4" />
            </button>
          </div>
          <ul className="divide-y divide-white/5">
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => go(l.id)}
                  className="flex w-full items-center justify-between py-4 text-left text-lg font-medium text-white transition-colors duration-200 hover:text-zinc-300">
                  {l.label}
                  <ChevronRight className="h-5 w-5 text-zinc-600" />
                </button>
              </li>
            ))}
          </ul>
          <PrimaryButton onClick={() => go('diagnostic')} className="mt-auto w-full py-3">
            Start Free Diagnostic
          </PrimaryButton>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-4 text-center text-sm text-zinc-400 transition-colors duration-200 hover:text-white">
            {CONTACT_EMAIL}
          </a>
        </aside>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

function Hero({ onStart }) {
  return (
    <section className="px-4 pb-24 pt-24 sm:px-6 sm:pb-32 sm:pt-36 lg:px-8">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-medium text-cyan-500 sm:text-base">
          Full-Stack Development · AI Automation · Operations & Events
        </p>
        <h1 className="mt-5 text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
          High-Velocity Digital Products.
          <br />
          <span className="text-zinc-500">Automated Operations. Global Events.</span>
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
          From custom React platforms and autonomous AI pipelines to producing 100+ city global events as Director of
          Operations at PizzaDAO. I eliminate operational drag and build systems that scale.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <PrimaryButton onClick={() => onStart()} className="px-7 py-3 text-[17px]">
            Start Free Diagnostic
          </PrimaryButton>
          <SecondaryButton onClick={() => scrollToId('services')} className="px-6 py-3 text-[17px]">
            Explore Services <ChevronRight className="h-4 w-4" />
          </SecondaryButton>
        </div>

        <Reveal
          as="dl"
          className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-y-10 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
          {HERO_METRICS.map(({ value, label }) => (
            <div key={label} className="px-4">
              <dt className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{value}</dt>
              <dd className="mt-1 text-sm text-zinc-500">{label}</dd>
            </div>
          ))}
        </Reveal>
      </div>

      <Reveal className="mx-auto mt-20 max-w-xl">
        <HeroConsole />
      </Reveal>

      <Reveal as="ul" className="mx-auto mt-16 flex max-w-4xl flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-zinc-500">
        {CAPABILITIES.map((t, i) => (
          <li key={t} className="flex items-center gap-5">
            {i > 0 && <span aria-hidden="true" className="h-1 w-1 rounded-full bg-zinc-700" />}
            {t}
          </li>
        ))}
      </Reveal>
    </section>
  );
}

function HeroConsole() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => (n + 1) % CONSOLE_LINES.length), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <Card className="p-5 text-left shadow-lg shadow-black/50 sm:p-6">
      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-medium text-zinc-300">Ops Console · Sample run</span>
        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" /> live demo
        </span>
      </div>
      <ul className="mt-4 space-y-1">
        {CONSOLE_LINES.map(({ icon: Icon, text }, i) => (
          <li
            key={text}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors duration-500 ${
              i === tick ? 'bg-zinc-800 text-white' : 'text-zinc-500'
            }`}>
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{text}</span>
            {i === tick && <Check className="ml-auto h-4 w-4 shrink-0 text-cyan-500" />}
          </li>
        ))}
      </ul>
      <p className="mt-4 px-1 text-xs text-zinc-600">Illustrative events. Real pipelines depend on your stack and volume.</p>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Services                                                           */
/* ------------------------------------------------------------------ */

function Services({ onStart }) {
  return (
    <section id="services" className="scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Services"
          title="Four disciplines. One execution partner."
          sub="Build the product, automate the operations, fix the business underneath, and run the room when it goes live."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.id} delay={(i % 2) * 100} className="h-full">
                <Card className="flex h-full flex-col p-7 sm:p-8">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-zinc-800 text-zinc-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight text-white sm:text-2xl">{p.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-zinc-300">{p.offering}</p>
                  <p className="mt-3 text-[15px] leading-relaxed text-zinc-400">{p.value}</p>

                  <p className="mt-7 text-xs font-medium uppercase tracking-wide text-zinc-500">Sample deliverables</p>
                  <ul className="mt-3 space-y-2.5">
                    {p.deliverables.map((d) => (
                      <li key={d} className="flex gap-2.5 text-sm text-zinc-300">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                        {d}
                      </li>
                    ))}
                  </ul>

                  <div className="mb-8 mt-6 flex flex-wrap gap-1.5">
                    {p.stack.map((s) => (
                      <Badge key={s}>{s}</Badge>
                    ))}
                  </div>

                  <TextAction onClick={() => onStart(p.id)} className="mt-auto self-start">
                    Start Free Diagnostic <ChevronRight className="h-4 w-4" />
                  </TextAction>
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
/*  PizzaDAO / global event operations                                 */
/* ------------------------------------------------------------------ */

function Events({ onStart }) {
  return (
    <section id="events" className="scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Card className="overflow-hidden p-7 shadow-2xl shadow-black/50 sm:p-12">
            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
              <div>
                <p className="flex items-center gap-2 text-sm font-medium text-cyan-500">
                  <Pizza className="h-4 w-4" /> Director of Operations · PizzaDAO
                </p>
                <h2 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Global Pizza Party. 100+ cities, one run‑of‑show.
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-zinc-400">
                  PizzaDAO is the global web3 community uniting people through pizza. As Director of Operations, I
                  organize and execute the Global Pizza Party for Bitcoin Pizza Day (May 22), across 100+ cities and 50+
                  countries at once.
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-zinc-400">
                  That means thousands of attendees, international venue logistics, local pizzeria partnerships, sponsor
                  activations, budgets, crypto-native ticketing and perks, and a live community run-of-show that has to
                  work in every timezone.
                </p>
                <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <PrimaryButton onClick={() => onStart('events')} className="px-6 py-3">
                    Plan Your Event
                  </PrimaryButton>
                  <SecondaryButton onClick={() => scrollToId('work')} className="py-3">
                    See the case study <ChevronRight className="h-4 w-4" />
                  </SecondaryButton>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-3">
                {EVENT_STATS.map(({ value, label }) => (
                  <div key={label} className="rounded-2xl bg-zinc-950 p-5 sm:p-6">
                    <dt className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{value}</dt>
                    <dd className="mt-2 text-sm leading-snug text-zinc-500">{label}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <ul className="mt-12 grid gap-6 border-t border-white/5 pt-10 sm:grid-cols-3">
              {EVENT_CROSSOVER.map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-3">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-zinc-400" />
                  <span>
                    <span className="block text-[15px] font-medium text-white">{title}</span>
                    <span className="text-sm leading-relaxed text-zinc-400">{body}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Case studies                                                       */
/* ------------------------------------------------------------------ */

function CaseStudies() {
  return (
    <section id="work" className="scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Case Studies"
          title="Shipped, deployed and run live."
          sub="Real-world events, production code and the automation patterns behind them."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {CASE_STUDIES.map((c, i) => {
            const Icon = c.icon;
            return (
              <Reveal key={c.title} delay={i * 100} className="h-full">
                <Card className="flex h-full flex-col p-7 sm:p-8">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-zinc-800 text-zinc-400">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-medium text-zinc-500">{c.tag}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight text-white">{c.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-zinc-400">{c.summary}</p>
                  <ul className="mt-6 space-y-2.5">
                    {c.points.map((pt) => (
                      <li key={pt} className="flex gap-2.5 text-sm text-zinc-300">
                        <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                        {pt}
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
/*  Methodology                                                        */
/* ------------------------------------------------------------------ */

function Playbook() {
  return (
    <section className="px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="How I Work"
          title="Film. Playbook. Execution."
          sub="Every engagement, from a landing page to a 100-city event, follows the same three phases."
        />

        <ol className="grid gap-5 lg:grid-cols-3">
          {METHOD_STEPS.map(({ n, icon: Icon, title, tag, body, points }, i) => (
            <Reveal as="li" key={n} delay={i * 100}>
              <Card className="h-full p-7 sm:p-8">
                <div className="flex items-start justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-zinc-800 text-zinc-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-5xl font-semibold tracking-tight text-zinc-800">{n}</span>
                </div>
                <p className="mt-6 text-sm font-medium text-zinc-500">
                  Step {n.slice(1)} · {tag}
                </p>
                <h3 className="mt-1 text-2xl font-semibold tracking-tight text-white">{title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-zinc-400">{body}</p>
                <ul className="mt-6 flex flex-wrap gap-1.5">
                  {points.map((p) => (
                    <li key={p}>
                      <Badge>{p}</Badge>
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  ROI / value calculator                                             */
/* ------------------------------------------------------------------ */

const RECOVERY_RATE = 0.6; // share of manual hours a typical automation set recovers
const WORK_WEEKS = 48;

function Slider({ id, label, value, min, max, step = 1, onChange, format = (v) => v }) {
  return (
    <div>
      <label htmlFor={id} className="flex items-center justify-between gap-3 text-[15px] text-zinc-300">
        {label}
        <span className="font-medium tabular-nums text-white">{format(value)}</span>
      </label>
      <RangeSlider id={id} value={value} min={min} max={max} step={step} onChange={onChange} />
    </div>
  );
}

function RoiCalculator({ onStart }) {
  const [people, setPeople] = useState(5);
  const [hours, setHours] = useState(12);
  const [rate, setRate] = useState(65);

  const r = useMemo(() => {
    const weeklyHours = people * hours * RECOVERY_RATE;
    const annualHours = weeklyHours * WORK_WEEKS;
    const annualValue = annualHours * rate;
    const fte = annualHours / (40 * WORK_WEEKS);
    return { weeklyHours, annualHours, annualValue, fte };
  }, [people, hours, rate]);

  const pct = Math.min(100, (r.annualValue / 500000) * 100);

  return (
    <section id="roi" className="scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Value Calculator"
          title="Calculate Your Operational Drag & Growth Potential."
          sub="Move the sliders to match your team. We assume automation recovers about 60% of repetitive hours, a conservative starting point we refine in the diagnostic."
        />

        <div className="grid gap-5 lg:grid-cols-2">
          <Reveal className="h-full">
            <Card className="flex h-full flex-col gap-7 p-7 sm:p-8">
              <Slider id="roi-people" label="Team members doing repetitive work" value={people} min={1} max={50} onChange={setPeople} />
              <Slider
                id="roi-hours"
                label="Manual hours per person, per week"
                value={hours}
                min={1}
                max={30}
                onChange={setHours}
                format={(v) => `${v} hrs`}
              />
              <Slider
                id="roi-rate"
                label="Average hourly pay per person"
                value={rate}
                min={20}
                max={250}
                step={5}
                onChange={setRate}
                format={(v) => `$${v}`}
              />
              <p className="mt-auto flex items-start gap-2.5 rounded-2xl bg-zinc-950 p-4 text-sm leading-relaxed text-zinc-500">
                <Lock className="mt-0.5 h-4 w-4 shrink-0" />
                Calculated in your browser. Nothing you enter here is stored or sent anywhere.
              </p>
            </Card>
          </Reveal>

          <Reveal delay={100} className="h-full">
            <Card className="flex h-full flex-col p-7 sm:p-8">
              <span className="text-sm font-medium text-zinc-500">Annual operational drag you could recover</span>
              <p className="mt-2 text-5xl font-semibold tracking-tight tabular-nums text-white sm:text-6xl">
                {fmtMoney(r.annualValue)}
              </p>
              <div className="mt-6 h-1 overflow-hidden rounded-full bg-zinc-800" aria-hidden="true">
                <div
                  className="h-full rounded-full bg-cyan-500 transition-all duration-500 ease-out"
                  style={{ width: `${Math.max(pct, 2)}%` }}
                />
              </div>

              <dl className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { label: 'Hours back / week', value: Math.round(r.weeklyHours).toLocaleString() },
                  { label: 'Hours back / year', value: Math.round(r.annualHours).toLocaleString() },
                  { label: 'Full-time hires avoided', value: r.fte.toFixed(1) },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-2xl bg-zinc-950 p-4">
                    <dt className="text-sm text-zinc-500">{label}</dt>
                    <dd className="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-white">{value}</dd>
                  </div>
                ))}
              </dl>

              <p className="mb-8 mt-6 text-[15px] text-zinc-400">
                That is capacity you can put back into growth: sales, delivery and new products, without adding headcount.
              </p>
              <PrimaryButton onClick={() => onStart('automation')} className="mt-auto w-full py-3">
                Get Your Diagnostic Report
              </PrimaryButton>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Diagnostic & intake funnel                                         */
/* ------------------------------------------------------------------ */

const HOURLY_RATE = 150;
const WEEKS_PER_YEAR = 50;

const FUNNEL_STEPS = ['Contact & Location', 'What You Need', 'Scope & Details', 'Your Diagnostic Report'];

const TRACKS = [
  { id: 'web', icon: Code2, label: 'Web & App Development', question: 'Need a custom site or web app rebuilt from scratch?' },
  {
    id: 'automation',
    icon: Bot,
    label: 'AI & Workflow Automation',
    question: 'Need AI lead automations or Facebook-to-calendar pipelines?',
  },
  {
    id: 'consulting',
    icon: Target,
    label: 'Business & Operational Consulting',
    question: 'Experiencing business bottlenecks or workflow friction?',
  },
  {
    id: 'events',
    icon: Globe,
    label: 'Event Production & Global Ops',
    question: 'Looking for an experienced event producer or operations director?',
  },
];

const INDUSTRIES = [
  'Professional Services / Agency',
  'Construction / Trades',
  'E-commerce / Retail',
  'Health / Wellness',
  'Real Estate',
  'Web3 / Crypto',
  'Food & Hospitality',
  'Other',
];

// `rate` is the blended hourly cost we assume for a team of this size when valuing lost time.
const TEAM_SIZES = [
  { id: '1', label: '1 (Solo)', rate: 75 },
  { id: '2-5', label: '2–5 people', rate: 50 },
  { id: '6-15', label: '6–15 people', rate: 45 },
  { id: '16-50', label: '16–50 people', rate: 40 },
  { id: '50+', label: '50+', rate: 40 },
];

const PLATFORMS = ['Wix', 'Squarespace', 'WordPress', 'Shopify', 'Custom code', 'No site yet'];
const WEB_GOALS = ['Generate more leads', 'Look more credible', 'Sell online', 'Replace a slow or broken site', 'Launch a new web app'];
const LEAD_SOURCES = ['Facebook / Instagram ads', 'Website forms', 'Email inbox', 'Phone / SMS', 'Google / Yelp', 'Spreadsheets / CRM'];
const PAINS = ['Inbox chaos', 'Disorganized files', 'Repetitive paperwork', 'Losing sales leads', 'Team handoff friction'];
const EVENT_TYPES = [
  'Conference side event',
  'Community meetup',
  'Multi-city activation',
  'Brand / sponsor activation',
  'Private / corporate event',
];
// `mid` values turn a range into a single number for the capacity estimate.
const ATTENDEES = [
  { label: '< 100', mid: 75 },
  { label: '100–500', mid: 300 },
  { label: '500–2,000', mid: 1250 },
  { label: '2,000+', mid: 2500 },
];
const CITY_COUNTS = [
  { label: '1 city', mid: 1 },
  { label: '2–5 cities', mid: 3 },
  { label: '6–20 cities', mid: 12 },
  { label: '20+ cities', mid: 25 },
];
const TIMELINES = ['ASAP', '1–3 months', '3–6 months', 'Just exploring'];

const EMPTY_FUNNEL = {
  name: '',
  email: '',
  phone: '',
  location: '',
  company: '',
  tracks: [],
  industry: '',
  teamSize: '',
  platform: '',
  webGoal: '',
  leadSources: [],
  pains: [],
  hours: 10,
  eventType: '',
  attendees: '',
  cities: '',
  timeline: '',
  notes: '',
  botcheck: false,
};

const hasTrack = (f, id) => f.tracks.includes(id);
const needsHours = (f) => hasTrack(f, 'automation') || hasTrack(f, 'consulting');

function validateStep(step, f) {
  const e = {};
  if (step === 0) {
    if (f.name.trim().length < 2) e.name = 'Please enter your full name.';
    if (!isEmail(f.email)) e.email = 'Please enter a valid business email.';
    if (f.phone.replace(/\D/g, '').length < 7) e.phone = 'Please enter a phone number I can reach you on.';
    if (f.location.trim().length < 2) e.location = 'Please enter your city and state.';
    if (f.company.trim().length < 2) e.company = 'Please enter your company name or website.';
  }
  if (step === 1) {
    if (!f.tracks.length) e.tracks = 'Select at least one area.';
    if (!f.industry) e.industry = 'Choose the option closest to your business.';
    if (!f.teamSize) e.teamSize = 'Choose your team size.';
  }
  if (step === 2) {
    if (hasTrack(f, 'web')) {
      if (!f.platform) e.platform = 'Choose what your site runs on today.';
      if (!f.webGoal) e.webGoal = 'Choose the main goal for the build.';
    }
    if (hasTrack(f, 'automation') && !f.leadSources.length) e.leadSources = 'Select at least one lead source.';
    if (hasTrack(f, 'consulting') && !f.pains.length) e.pains = 'Select at least one bottleneck.';
    if (hasTrack(f, 'events')) {
      if (!f.eventType) e.eventType = 'Choose the type of event.';
      if (!f.attendees) e.attendees = 'Choose the expected attendance.';
      if (!f.cities) e.cities = 'Choose how many cities.';
    }
    if (!f.timeline) e.timeline = 'Choose a timeline.';
  }
  return e;
}

function buildReport(f) {
  const team = TEAM_SIZES.find((t) => t.id === f.teamSize);
  const rate = team ? team.rate : 50;
  const annualHours = needsHours(f) ? f.hours * WEEKS_PER_YEAR : 0;
  const attendees = ATTENDEES.find((a) => a.label === f.attendees);
  const cities = CITY_COUNTS.find((c) => c.label === f.cities);
  const capacity = hasTrack(f, 'events') && attendees && cities ? attendees.mid * cities.mid : 0;

  const engagements = [];
  if (hasTrack(f, 'web')) {
    engagements.push({
      icon: Code2,
      title: 'Custom React Platform Build',
      detail:
        f.platform === 'No site yet'
          ? `A new Vite + React 19 site on Vercel, built to: ${f.webGoal.toLowerCase()}.`
          : `Rebuild off ${f.platform} onto Vite + React 19 + Vercel, built to: ${f.webGoal.toLowerCase()}.`,
      points: ['Sub-second load target, mobile-first', 'Contact routes and lead capture wired in', 'Full domain migration and technical SEO'],
    });
  }
  if (hasTrack(f, 'automation')) {
    engagements.push({
      icon: Bot,
      title: 'Lead-to-Calendar Automation Pipeline',
      detail: `Route ${f.leadSources.join(', ')} into your CRM and calendar automatically, around the clock.`,
      points: ['Webhook pipelines (Zapier / Make)', 'LLM lead qualification and inbox triage', 'Automated proposals and follow-ups'],
    });
  }
  if (hasTrack(f, 'consulting')) {
    engagements.push({
      icon: Target,
      title: 'Operational Friction Teardown',
      detail: `A full audit targeting: ${f.pains.join(', ').toLowerCase()}.`,
      points: ['Friction and funnel forensics', 'Workspace & permission audit', 'SOPs and a tooling roadmap'],
    });
  }
  if (hasTrack(f, 'events')) {
    engagements.push({
      icon: Globe,
      title: 'Event Production & Operations',
      detail: `${f.eventType}: ${f.attendees} attendees per city across ${f.cities}.`,
      points: ['Run-of-show and multi-city coordination', 'Venue, vendor and sponsor management', 'Ticketing pipeline and budget control'],
    });
  }

  return { engagements, rate, annualHours, annualValue: annualHours * rate, capacity };
}

function FieldError({ id, children }) {
  if (!children) return null;
  return (
    <p id={`${id}-err`} className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {children}
    </p>
  );
}

function TextField({ id, label, error, ...rest }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`${INPUT_CLS} min-h-[44px] ${error ? 'ring-2 ring-red-500/70' : ''}`}
        {...rest}
      />
      <FieldError id={id}>{error}</FieldError>
    </div>
  );
}

// Selectable pill. Single-choice groups render as radios, multi-choice groups as toggle buttons.
function Pill({ selected, multi, onClick, children }) {
  return (
    <button
      type="button"
      role={multi ? undefined : 'radio'}
      aria-checked={multi ? undefined : selected}
      aria-pressed={multi ? selected : undefined}
      onClick={onClick}
      className={`inline-flex min-h-[44px] items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
        selected ? 'bg-zinc-800 text-white ring-1 ring-cyan-500' : 'bg-zinc-800/60 text-zinc-300 hover:bg-zinc-800 hover:text-white'
      }`}>
      {multi && selected && <Check className="h-4 w-4 text-cyan-500" />}
      {children}
    </button>
  );
}

function PillGroup({ id, label, multi = false, error, children }) {
  return (
    <fieldset id={id} tabIndex={-1} className="outline-none" aria-describedby={error ? `${id}-err` : undefined}>
      <legend className="mb-3 text-sm font-medium text-zinc-300">{label}</legend>
      <div role={multi ? 'group' : 'radiogroup'} aria-label={label} className="flex flex-wrap gap-2">
        {children}
      </div>
      <FieldError id={id}>{error}</FieldError>
    </fieldset>
  );
}

function StepIndicator({ step }) {
  return (
    <div>
      <div className="flex gap-1.5" aria-hidden="true">
        {FUNNEL_STEPS.map((s, i) => (
          <span
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= step ? 'bg-cyan-500' : 'bg-zinc-800'}`}
          />
        ))}
      </div>
      <p className="mt-3 text-sm text-zinc-500" aria-live="polite">
        <span className="font-medium text-zinc-300">Step {step + 1} of 4:</span> {FUNNEL_STEPS[step]}
      </p>
    </div>
  );
}

function StepHeading({ title, sub }) {
  return (
    <div className="mb-8">
      <h3 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h3>
      <p className="mt-2 text-[15px] text-zinc-400">{sub}</p>
    </div>
  );
}

function ScopeBlock({ icon: Icon, title, children }) {
  return (
    <div className="space-y-6 rounded-2xl bg-zinc-950 p-5 sm:p-6">
      <h4 className="flex items-center gap-2 text-[15px] font-medium text-white">
        <Icon className="h-4 w-4 text-zinc-400" /> {title}
      </h4>
      {children}
    </div>
  );
}

function DiagnosticFunnel({ prefill }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY_FUNNEL);
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error | fallback
  const [serverError, setServerError] = useState('');
  const topRef = useRef(null);

  // Apply a new "Start Free Diagnostic" prefill during render (no effect round-trip).
  const [appliedPrefill, setAppliedPrefill] = useState(null);
  if (prefill && prefill !== appliedPrefill) {
    setAppliedPrefill(prefill);
    if (prefill.track) {
      setForm((f) => (f.tracks.includes(prefill.track) ? f : { ...f, tracks: [...f.tracks, prefill.track] }));
    }
  }

  const set = (key, value) =>
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (attempted) setErrors(validateStep(step, next));
      return next;
    });
  const toggle = (key, value) =>
    set(key, form[key].includes(value) ? form[key].filter((v) => v !== value) : [...form[key], value]);

  const goTo = (next) => {
    setStep(next);
    setErrors({});
    setAttempted(false);
    // Keep the top of the funnel in view when a step is taller than the screen.
    const el = topRef.current;
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const next = () => {
    const v = validateStep(step, form);
    setAttempted(true);
    setErrors(v);
    if (Object.keys(v).length) {
      document.getElementById(Object.keys(v)[0])?.focus();
      return;
    }
    goTo(step + 1);
  };

  const report = useMemo(() => buildReport(form), [form]);
  const teamLabel = TEAM_SIZES.find((t) => t.id === form.teamSize)?.label ?? '';
  const trackLabels = TRACKS.filter((t) => form.tracks.includes(t.id)).map((t) => t.label);
  const hoursLabel = form.hours >= 40 ? '40+' : String(form.hours);

  const summary = [
    `Name: ${form.name}`,
    `Email: ${form.email}`,
    `Phone: ${form.phone}`,
    `Location: ${form.location}`,
    `Company: ${form.company}`,
    '',
    `Looking for: ${trackLabels.join(', ')}`,
    `Industry: ${form.industry}`,
    `Team size: ${teamLabel}`,
    hasTrack(form, 'web') ? `Current platform: ${form.platform} · Goal: ${form.webGoal}` : null,
    hasTrack(form, 'automation') ? `Lead sources: ${form.leadSources.join(', ')}` : null,
    hasTrack(form, 'consulting') ? `Bottlenecks: ${form.pains.join(', ')}` : null,
    needsHours(form) ? `Hours lost per week: ${hoursLabel}` : null,
    hasTrack(form, 'events') ? `Event: ${form.eventType} · ${form.attendees} per city · ${form.cities}` : null,
    `Timeline: ${form.timeline}`,
    form.notes ? `Notes: ${form.notes}` : null,
    '',
    `Recommended: ${report.engagements.map((r) => r.title).join('; ')}`,
    report.annualHours ? `Hours recovered per year: ${report.annualHours.toLocaleString()}` : null,
    report.annualHours ? `Estimated annual value: ${fmtMoney(report.annualValue)} (at $${report.rate}/hr blended)` : null,
    report.capacity ? `Estimated event capacity: ~${report.capacity.toLocaleString()} attendees` : null,
    `Rate: $${HOURLY_RATE}/hour (events scoped per production)`,
  ]
    .filter((l) => l !== null)
    .join('\n');
  const mailSubject = `${SITE_DOMAIN} diagnostic: ${form.company || form.name}`;

  const submit = async () => {
    if (form.botcheck) return;
    setStatus('loading');
    setServerError('');
    try {
      await submitToWeb3Forms({
        subject: mailSubject,
        from_name: `${SITE_DOMAIN} Diagnostic`,
        name: form.name,
        email: form.email,
        replyto: form.email,
        phone: form.phone,
        location: form.location,
        company: form.company,
        looking_for: trackLabels.join(', '),
        industry: form.industry,
        team_size: teamLabel,
        current_platform: hasTrack(form, 'web') ? form.platform : undefined,
        web_goal: hasTrack(form, 'web') ? form.webGoal : undefined,
        lead_sources: hasTrack(form, 'automation') ? form.leadSources.join(', ') : undefined,
        bottlenecks: hasTrack(form, 'consulting') ? form.pains.join(', ') : undefined,
        hours_lost_per_week: needsHours(form) ? hoursLabel : undefined,
        event_type: hasTrack(form, 'events') ? form.eventType : undefined,
        attendees_per_city: hasTrack(form, 'events') ? form.attendees : undefined,
        cities: hasTrack(form, 'events') ? form.cities : undefined,
        timeline: form.timeline,
        notes: form.notes,
        recommendations: report.engagements.map((r) => r.title).join('; '),
        hours_recovered_per_year: report.annualHours || undefined,
        estimated_annual_value: report.annualHours ? fmtMoney(report.annualValue) : undefined,
        estimated_event_capacity: report.capacity || undefined,
        hourly_rate: `$${HOURLY_RATE}/hour`,
        message: summary,
      });
      setStatus('success');
    } catch (err) {
      if (err.code === 'not-configured') {
        window.location.assign(buildMailto(mailSubject, summary));
        setStatus('fallback');
      } else {
        setServerError(err.message || 'Something went wrong.');
        setStatus('error');
      }
    }
  };

  const reset = () => {
    setForm(EMPTY_FUNNEL);
    setStatus('idle');
    goTo(0);
  };

  if (status === 'success' || status === 'fallback') {
    return (
      <div ref={topRef} className="sp-fade-in flex min-h-[460px] flex-col items-center justify-center py-6 text-center">
        <span className="sp-pop grid h-16 w-16 place-items-center rounded-full bg-zinc-800">
          <CheckCircle2 className="h-8 w-8 text-white" />
        </span>
        <h3 className="mt-6 text-2xl font-semibold tracking-tight text-white">
          {status === 'success' ? 'Diagnostic submitted.' : 'Almost there.'}
        </h3>
        <p className="mt-3 max-w-md text-zinc-400">
          {status === 'success'
            ? 'Your diagnostic has been sent. I will review it and reach out within 1 business day with next steps.'
            : 'Your email app opened with your diagnostic pre-filled. Hit send and I will reach out within 1 business day.'}
        </p>
        <SecondaryButton onClick={reset} className="mt-8 min-h-[44px]">
          Start a new diagnostic
        </SecondaryButton>
      </div>
    );
  }

  const tiles = [
    report.annualHours && { label: 'Hours saved per year', value: report.annualHours.toLocaleString() },
    report.annualHours && { label: 'Estimated value per year', value: fmtMoney(report.annualValue) },
    report.capacity && { label: 'Event capacity unlocked', value: `~${report.capacity.toLocaleString()}` },
    hasTrack(form, 'web') && { label: 'Page-load target', value: '< 1s' },
  ].filter(Boolean);

  return (
    <div ref={topRef} className="scroll-mt-20">
      <StepIndicator step={step} />

      <div key={step} className="sp-fade-in mt-8">
        {step === 0 && (
          <>
            <StepHeading title="Let's start with the basics." sub="Where should I send your diagnostic report?" />
            <input
              type="checkbox"
              name="botcheck"
              checked={form.botcheck}
              onChange={(e) => set('botcheck', e.target.checked)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <TextField
                id="name"
                label="Full Name"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                autoComplete="name"
                placeholder="Jordan Rivera"
                error={errors.name}
              />
              <TextField
                id="email"
                label="Business Email"
                type="email"
                value={form.email}
                onChange={(e) => set('email', e.target.value)}
                autoComplete="email"
                placeholder="jordan@company.com"
                error={errors.email}
              />
              <TextField
                id="phone"
                label="Phone Number"
                type="tel"
                value={form.phone}
                onChange={(e) => set('phone', e.target.value)}
                autoComplete="tel"
                placeholder="(555) 123-4567"
                error={errors.phone}
              />
              <TextField
                id="location"
                label="City, State"
                value={form.location}
                onChange={(e) => set('location', e.target.value)}
                autoComplete="address-level2"
                placeholder="Austin, TX"
                error={errors.location}
              />
              <div className="sm:col-span-2">
                <TextField
                  id="company"
                  label="Company Name & Website"
                  value={form.company}
                  onChange={(e) => set('company', e.target.value)}
                  autoComplete="organization"
                  placeholder="Acme Co. · acme.com"
                  error={errors.company}
                />
              </div>
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <StepHeading title="What do you need?" sub="Pick everything that applies. Each one adds its own section to your report." />
            <div className="space-y-8">
              <fieldset id="tracks" tabIndex={-1} className="outline-none" aria-describedby={errors.tracks ? 'tracks-err' : undefined}>
                <legend className="mb-3 text-sm font-medium text-zinc-300">Areas (select all that apply)</legend>
                <div role="group" className="grid gap-2 sm:grid-cols-2">
                  {TRACKS.map((t) => {
                    const Icon = t.icon;
                    const on = form.tracks.includes(t.id);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggle('tracks', t.id)}
                        className={`flex min-h-[44px] items-start gap-3 rounded-2xl p-4 text-left transition duration-200 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                          on ? 'bg-zinc-800 ring-1 ring-cyan-500' : 'bg-zinc-800/60 hover:bg-zinc-800'
                        }`}>
                        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${on ? 'text-cyan-500' : 'text-zinc-400'}`} />
                        <span className="flex-1">
                          <span className="block text-[15px] font-medium text-white">{t.label}</span>
                          <span className="mt-0.5 block text-sm leading-snug text-zinc-500">{t.question}</span>
                        </span>
                        {on && <CheckCircle2 className="h-5 w-5 shrink-0 text-cyan-500" />}
                      </button>
                    );
                  })}
                </div>
                <FieldError id="tracks">{errors.tracks}</FieldError>
              </fieldset>
              <PillGroup id="industry" label="Industry / Business Type" error={errors.industry}>
                {INDUSTRIES.map((o) => (
                  <Pill key={o} selected={form.industry === o} onClick={() => set('industry', o)}>
                    {o}
                  </Pill>
                ))}
              </PillGroup>
              <PillGroup id="teamSize" label="Team Size" error={errors.teamSize}>
                {TEAM_SIZES.map((o) => (
                  <Pill key={o.id} selected={form.teamSize === o.id} onClick={() => set('teamSize', o.id)}>
                    {o.label}
                  </Pill>
                ))}
              </PillGroup>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <StepHeading title="Scope it out." sub="A few specifics for each area, so your report is built on real numbers." />
            <div className="space-y-4">
              {hasTrack(form, 'web') && (
                <ScopeBlock icon={Code2} title="Web & App Development">
                  <PillGroup id="platform" label="What does your site run on today?" error={errors.platform}>
                    {PLATFORMS.map((o) => (
                      <Pill key={o} selected={form.platform === o} onClick={() => set('platform', o)}>
                        {o}
                      </Pill>
                    ))}
                  </PillGroup>
                  <PillGroup id="webGoal" label="Main goal for the build" error={errors.webGoal}>
                    {WEB_GOALS.map((o) => (
                      <Pill key={o} selected={form.webGoal === o} onClick={() => set('webGoal', o)}>
                        {o}
                      </Pill>
                    ))}
                  </PillGroup>
                </ScopeBlock>
              )}

              {hasTrack(form, 'automation') && (
                <ScopeBlock icon={Bot} title="AI & Workflow Automation">
                  <PillGroup id="leadSources" label="Where do your leads come from? (select all)" multi error={errors.leadSources}>
                    {LEAD_SOURCES.map((o) => (
                      <Pill key={o} multi selected={form.leadSources.includes(o)} onClick={() => toggle('leadSources', o)}>
                        {o}
                      </Pill>
                    ))}
                  </PillGroup>
                </ScopeBlock>
              )}

              {hasTrack(form, 'consulting') && (
                <ScopeBlock icon={Target} title="Business & Operational Consulting">
                  <PillGroup id="pains" label="Where is the friction? (select all)" multi error={errors.pains}>
                    {PAINS.map((o) => (
                      <Pill key={o} multi selected={form.pains.includes(o)} onClick={() => toggle('pains', o)}>
                        {o}
                      </Pill>
                    ))}
                  </PillGroup>
                </ScopeBlock>
              )}

              {needsHours(form) && (
                <div className="rounded-2xl bg-zinc-950 p-5 sm:p-6">
                  <label htmlFor="hours" className="flex items-center justify-between gap-3 text-sm font-medium text-zinc-300">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-zinc-400" /> Hours lost per week to manual busywork
                    </span>
                    <span className="text-[15px] tabular-nums text-white">{hoursLabel} hrs</span>
                  </label>
                  <RangeSlider id="hours" value={form.hours} min={2} max={40} onChange={(v) => set('hours', v)} />
                </div>
              )}

              {hasTrack(form, 'events') && (
                <ScopeBlock icon={Globe} title="Event Production & Global Ops">
                  <PillGroup id="eventType" label="Type of event" error={errors.eventType}>
                    {EVENT_TYPES.map((o) => (
                      <Pill key={o} selected={form.eventType === o} onClick={() => set('eventType', o)}>
                        {o}
                      </Pill>
                    ))}
                  </PillGroup>
                  <PillGroup id="attendees" label="Expected attendees (per city)" error={errors.attendees}>
                    {ATTENDEES.map((o) => (
                      <Pill key={o.label} selected={form.attendees === o.label} onClick={() => set('attendees', o.label)}>
                        {o.label}
                      </Pill>
                    ))}
                  </PillGroup>
                  <PillGroup id="cities" label="How many cities?" error={errors.cities}>
                    {CITY_COUNTS.map((o) => (
                      <Pill key={o.label} selected={form.cities === o.label} onClick={() => set('cities', o.label)}>
                        {o.label}
                      </Pill>
                    ))}
                  </PillGroup>
                </ScopeBlock>
              )}

              <div className="space-y-6 pt-4">
                <PillGroup id="timeline" label="When do you want to start?" error={errors.timeline}>
                  {TIMELINES.map((o) => (
                    <Pill key={o} selected={form.timeline === o} onClick={() => set('timeline', o)}>
                      {o}
                    </Pill>
                  ))}
                </PillGroup>
                <div>
                  <label htmlFor="notes" className="mb-2 block text-sm font-medium text-zinc-300">
                    Anything else I should know? (optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => set('notes', e.target.value)}
                    placeholder="Links, deadlines, budget range, the thing that keeps breaking..."
                    className={`${INPUT_CLS} resize-y`}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <div>
            <p className="text-sm font-medium text-zinc-500">Your Diagnostic Report</p>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Diagnostic Report for {form.company}
            </h3>
            <p className="mt-2 flex flex-wrap items-center gap-x-2 text-sm text-zinc-500">
              <Building className="h-4 w-4" /> {form.industry} · {teamLabel} · Timeline: {form.timeline}
            </p>

            <h4 className="mt-8 text-sm font-medium text-zinc-300">Recommended engagements</h4>
            <ol className="mt-3 space-y-2">
              {report.engagements.map((r, i) => {
                const Icon = r.icon;
                return (
                  <li key={r.title} className="rounded-2xl bg-zinc-950 p-4 sm:p-5">
                    <div className="flex gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-zinc-800 text-zinc-300">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-[15px] font-medium text-white">
                          {i + 1}. {r.title}
                        </span>
                        <span className="mt-0.5 block text-sm leading-relaxed text-zinc-400">{r.detail}</span>
                      </span>
                    </div>
                    <ul className="mt-3 grid gap-1.5 pl-12 sm:grid-cols-3 sm:gap-3">
                      {r.points.map((pt) => (
                        <li key={pt} className="flex gap-2 text-xs leading-snug text-zinc-400">
                          <Check className="h-3.5 w-3.5 shrink-0 text-zinc-500" /> {pt}
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ol>

            <h4 className="mt-8 text-sm font-medium text-zinc-300">Projected impact</h4>
            <div className={`mt-3 grid gap-2 ${tiles.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {tiles.map((t) => (
                <div key={t.label} className="rounded-2xl bg-zinc-950 p-4 sm:p-5">
                  <p className="text-sm text-zinc-500">{t.label}</p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight tabular-nums text-white sm:text-4xl">{t.value}</p>
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500">
              {report.annualHours
                ? `${hoursLabel} hours a week × ${WEEKS_PER_YEAR} weeks, valued at an estimated blended cost of $${report.rate}/hour for a team of your size. `
                : ''}
              {report.capacity ? `Event capacity uses the midpoint of your attendance and city ranges.` : ''}
            </p>

            <div className="mt-8 rounded-2xl bg-zinc-950 p-5">
              <p className="text-sm text-zinc-500">Pricing & engagement model</p>
              <p className="mt-1 text-[15px] font-medium text-white">
                Development, automation & consulting: <span className="tabular-nums">${HOURLY_RATE} / hour</span>
              </p>
              <p className="mt-1 text-sm text-zinc-400">Event production is scoped and quoted per production.</p>
              <p className="mt-2 text-sm text-zinc-400">Engagements run in clear, milestone-driven sprints with zero surprise fees.</p>
            </div>

            <p className="mt-6 flex items-center gap-2 text-sm text-zinc-500">
              <Mail className="h-4 w-4 shrink-0" /> I will follow up at {form.email}.
            </p>

            {status === 'error' && (
              <div role="alert" className="mt-6 flex items-start gap-3 rounded-2xl bg-red-500/10 p-4 text-sm text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  {serverError} Your diagnostic was not sent. Try again, or{' '}
                  <a href={buildMailto(mailSubject, summary)} className="underline underline-offset-2 hover:text-red-200">
                    email it to me directly
                  </a>
                  .
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-10 flex flex-col-reverse gap-2 border-t border-white/5 pt-6 sm:flex-row sm:items-center sm:justify-between">
        {step > 0 ? (
          <SecondaryButton onClick={() => goTo(step - 1)} disabled={status === 'loading'} className="min-h-[44px]">
            <ArrowLeft className="h-4 w-4" /> Back
          </SecondaryButton>
        ) : (
          <span className="hidden sm:block" />
        )}
        {step < 3 ? (
          <PrimaryButton onClick={next} className="min-h-[44px] px-6">
            Continue <ArrowRight className="h-4 w-4" />
          </PrimaryButton>
        ) : (
          <PrimaryButton onClick={submit} disabled={status === 'loading'} className="min-h-[44px] px-6">
            {status === 'loading' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                Submit Diagnostic & Request Kickoff <ArrowRight className="h-4 w-4" />
              </>
            )}
          </PrimaryButton>
        )}
      </div>
    </div>
  );
}

function Diagnostic({ prefill }) {
  return (
    <section id="diagnostic" className="scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <SectionHeader
          eyebrow="Free Diagnostic"
          title="Get your free diagnostic report."
          sub="Four short steps. Build, automate, fix or produce: you will see a recommended plan, projected impact and transparent pricing before you submit anything."
        />
        <Reveal>
          <div className="rounded-3xl border border-white/5 bg-zinc-900 p-6 shadow-2xl sm:p-10">
            <DiagnosticFunnel prefill={prefill} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Contact                                                            */
/* ------------------------------------------------------------------ */

const EMPTY_MESSAGE = { name: '', email: '', message: '', botcheck: false };

function validateMessage(f) {
  const e = {};
  if (f.name.trim().length < 2) e['msg-name'] = 'Please enter your name.';
  if (!isEmail(f.email)) e['msg-email'] = 'Please enter a valid email.';
  if (f.message.trim().length < 10) e['msg-body'] = 'Give me a sentence or two (10+ characters).';
  return e;
}

function Contact() {
  const [form, setForm] = useState(EMPTY_MESSAGE);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error | fallback
  const [serverError, setServerError] = useState('');

  const update = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (touched) setErrors(validateMessage(next));
      return next;
    });
  };

  const mailSubject = `Message from ${SITE_DOMAIN}${form.name ? `: ${form.name}` : ''}`;
  const mailBody = `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    const v = validateMessage(form);
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
        from_name: `${SITE_DOMAIN} Contact`,
        name: form.name,
        email: form.email,
        replyto: form.email,
        message: form.message,
      });
      setStatus('success');
      setForm(EMPTY_MESSAGE);
      setTouched(false);
    } catch (err) {
      if (err.code === 'not-configured') {
        window.location.assign(buildMailto(mailSubject, mailBody));
        setStatus('fallback');
      } else {
        setServerError(err.message || 'Something went wrong.');
        setStatus('error');
      }
    }
  };

  const inputCls = (k) => `${INPUT_CLS} min-h-[44px] ${errors[k] ? 'ring-2 ring-red-500/70' : ''}`;

  return (
    <section id="contact" className="scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeader
            center={false}
            eyebrow="Contact"
            title="Have something specific in mind?"
            sub="Skip the diagnostic and send a direct message: a build, an automation, an audit or an event. I reply within 1 business day."
          />
          <Reveal delay={100}>
            <ul className="space-y-5">
              {[
                { icon: Zap, title: 'Fast turnaround', body: 'Scoped in days, shipped in milestone sprints.' },
                { icon: ShieldCheck, title: 'Confidential by default', body: 'Your workflows, data and plans stay between us.' },
                { icon: Globe, title: 'Remote-first, global reach', body: 'Working across time zones, on-site when the event calls for it.' },
              ].map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-zinc-900 text-zinc-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block text-[15px] font-medium text-white">{title}</span>
                    <span className="text-sm text-zinc-400">{body}</span>
                  </span>
                </li>
              ))}
            </ul>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-8 inline-flex items-center gap-2 rounded-md text-[15px] font-medium text-cyan-500 transition-colors duration-200 hover:text-cyan-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500">
              <Mail className="h-4 w-4" /> {CONTACT_EMAIL}
            </a>
          </Reveal>
        </div>

        <Reveal delay={150} className="h-full">
          <Card className="h-full p-6 shadow-lg shadow-black/50 sm:p-10">
            {status === 'success' || status === 'fallback' ? (
              <div className="sp-fade-in flex min-h-[360px] flex-col items-center justify-center text-center">
                <span className="sp-pop grid h-16 w-16 place-items-center rounded-full bg-zinc-800">
                  <Check className="h-8 w-8 text-white" />
                </span>
                <h3 className="mt-6 text-2xl font-semibold tracking-tight text-white">
                  {status === 'success' ? 'Message received.' : 'Almost there.'}
                </h3>
                <p className="mt-3 max-w-sm text-zinc-400">
                  {status === 'success'
                    ? 'It is in my inbox. Expect a reply within 1 business day.'
                    : 'Your email app opened with your message pre-filled. Hit send and I will reply within 1 business day.'}
                </p>
                <SecondaryButton onClick={() => setStatus('idle')} className="mt-8 min-h-[44px]">
                  Send another message
                </SecondaryButton>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="space-y-5">
                <input
                  type="checkbox"
                  name="botcheck"
                  checked={form.botcheck}
                  onChange={update('botcheck')}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="msg-name" className="mb-2 block text-sm font-medium text-zinc-300">
                      Name
                    </label>
                    <input
                      id="msg-name"
                      value={form.name}
                      onChange={update('name')}
                      autoComplete="name"
                      placeholder="Jordan Rivera"
                      aria-invalid={!!errors['msg-name']}
                      aria-describedby={errors['msg-name'] ? 'msg-name-err' : undefined}
                      className={inputCls('msg-name')}
                    />
                    <FieldError id="msg-name">{errors['msg-name']}</FieldError>
                  </div>
                  <div>
                    <label htmlFor="msg-email" className="mb-2 block text-sm font-medium text-zinc-300">
                      Email
                    </label>
                    <input
                      id="msg-email"
                      type="email"
                      value={form.email}
                      onChange={update('email')}
                      autoComplete="email"
                      placeholder="jordan@company.com"
                      aria-invalid={!!errors['msg-email']}
                      aria-describedby={errors['msg-email'] ? 'msg-email-err' : undefined}
                      className={inputCls('msg-email')}
                    />
                    <FieldError id="msg-email">{errors['msg-email']}</FieldError>
                  </div>
                </div>
                <div>
                  <label htmlFor="msg-body" className="mb-2 block text-sm font-medium text-zinc-300">
                    Message
                  </label>
                  <textarea
                    id="msg-body"
                    rows={6}
                    value={form.message}
                    onChange={update('message')}
                    placeholder="What are you building, automating, fixing or producing?"
                    aria-invalid={!!errors['msg-body']}
                    aria-describedby={errors['msg-body'] ? 'msg-body-err' : undefined}
                    className={`${inputCls('msg-body')} resize-y`}
                  />
                  <FieldError id="msg-body">{errors['msg-body']}</FieldError>
                </div>

                {status === 'error' && (
                  <div role="alert" className="flex items-start gap-3 rounded-2xl bg-red-500/10 p-4 text-sm text-red-300">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      {serverError} Your message was not sent. Try again, or email me directly with the button below.
                    </span>
                  </div>
                )}

                <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center">
                  <PrimaryButton type="submit" disabled={status === 'loading'} className="min-h-[44px] flex-1 py-3">
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
                  <a href={buildMailto(mailSubject, mailBody)} className={`${SECONDARY_CLS} min-h-[44px] py-3`}>
                    <Mail className="h-4 w-4" /> Email me directly
                  </a>
                </div>
                <p className="text-xs text-zinc-500">I only use your details to reply. No newsletters, no list selling.</p>
              </form>
            )}
          </Card>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

function Footer({ onStart }) {
  const [legal, setLegal] = useState(null);
  const footLink =
    'rounded text-sm text-zinc-400 transition-colors duration-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500';
  return (
    <footer className="border-t border-white/5 px-4 pb-10 pt-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo tagline onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-zinc-500">
              Full-stack development, AI automation, operations consulting and global event production. Systems that
              remove drag and scale.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Navigate</p>
            <ul className="mt-4 space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <button onClick={() => scrollToId(l.id)} className={footLink}>
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Contact</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className={`mt-4 block break-all ${footLink}`}>
              {CONTACT_EMAIL}
            </a>
            <PrimaryButton onClick={() => onStart()} className="mt-5 px-4 py-2 text-sm">
              Start Free Diagnostic
            </PrimaryButton>
          </div>
        </div>

        {legal && (
          <div className="sp-fade-in mt-10 rounded-2xl bg-zinc-900 p-5 text-sm leading-relaxed text-zinc-400">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-medium text-white">{legal === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}</span>
              <button
                onClick={() => setLegal(null)}
                aria-label="Close"
                className={`grid h-7 w-7 place-items-center rounded-full bg-zinc-800 text-zinc-400 hover:text-white ${PRESS}`}>
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            {legal === 'privacy'
              ? `${SITE_DOMAIN} collects only what you submit through its forms and uses it solely to respond to your inquiry. Your information is never sold or shared. Email us to request deletion at any time.`
              : `Content on ${SITE_DOMAIN} is provided for general information and does not constitute a binding offer. Engagements are governed by a separate written agreement with Scrimmage Productions LLC.`}
          </div>
        )}

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center">
          <p>
            © 2026 Scrimmage Productions LLC · {SITE_DOMAIN}. All Rights Reserved.
          </p>
          <div className="flex gap-5">
            <button onClick={() => setLegal('privacy')} className="transition-colors duration-200 hover:text-white">
              Privacy Policy
            </button>
            <button onClick={() => setLegal('terms')} className="transition-colors duration-200 hover:text-white">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Loading sequence                                                   */
/* ------------------------------------------------------------------ */

// Timeline (~2.6s): the S fills, holds while it charges, then bursts to reveal the site.
const LOAD_MS = 1700;
const CHARGE_MS = 250;
const BURST_MS = 650; // every burst animation below is tuned to finish inside this window

// The intro plays once per browser session. Storage can throw in sandboxed frames, so guard it.
const INTRO_KEY = 'scrimmage_intro_seen';
const introSeen = () => {
  try {
    return sessionStorage.getItem(INTRO_KEY) !== null;
  } catch {
    return false;
  }
};
const markIntroSeen = () => {
  try {
    sessionStorage.setItem(INTRO_KEY, 'true');
  } catch {
    // Storage unavailable: the intro will simply play again next load.
  }
};

// Pixel silhouette of the "S" used by the loader (7 x 10 grid).
const S_LOADER = [
  '.#####.',
  '##...##',
  '##.....',
  '.##....',
  '..###..',
  '....##.',
  '.....##',
  '.....##',
  '##...##',
  '.#####.',
];

function LoaderGlyph({ lit }) {
  const cell = 12;
  const pad = 2;
  return (
    <svg viewBox={`0 0 ${7 * cell} ${10 * cell}`} className="h-full w-full" aria-hidden="true">
      {S_LOADER.flatMap((row, y) =>
        row.split('').map((v, x) =>
          v === '#' ? (
            <rect
              key={`${x}-${y}`}
              x={x * cell + pad}
              y={y * cell + pad}
              width={cell - pad * 2}
              height={cell - pad * 2}
              rx={2.5}
              fill={lit ? '#06b6d4' : 'none'}
              stroke={lit ? 'none' : '#3f3f46'}
              strokeWidth={1}
            />
          ) : (
            <circle key={`${x}-${y}`} cx={x * cell + cell / 2} cy={y * cell + cell / 2} r={0.9} fill="#27272a" />
          ),
        ),
      )}
    </svg>
  );
}

// Lit pixels of the S become shards that fly outward from the glyph's center on burst.
const LOADER_SHARDS = S_LOADER.flatMap((row, y) =>
  row.split('').flatMap((v, x) => {
    if (v !== '#') return [];
    const vx = x - 3;
    const vy = y - 4.5;
    const len = Math.hypot(vx, vy) || 1;
    const jitter = (x * 37 + y * 17) % 7;
    const dist = 38 + jitter * 6; // vmax
    return [
      {
        key: `${x}-${y}`,
        left: `${(x / 7) * 100}%`,
        top: `${(y / 10) * 100}%`,
        dx: `${((vx / len) * dist).toFixed(1)}vmax`,
        dy: `${((vy / len) * dist).toFixed(1)}vmax`,
        rot: `${(((x * 53 + y * 29) % 9) - 4) * 40}deg`,
        scale: (1.8 + (jitter % 4) * 0.5).toFixed(2),
        delay: `${jitter * 8}ms`,
      },
    ];
  }),
);

// Free particles scattered around the burst.
const LOADER_SPARKS = Array.from({ length: 28 }, (_, i) => {
  const angle = ((i * 360) / 28 + ((i * 47) % 11)) * (Math.PI / 180);
  const dist = 22 + ((i * 31) % 9) * 5; // vmax
  return {
    key: i,
    dx: `${(Math.cos(angle) * dist).toFixed(1)}vmax`,
    dy: `${(Math.sin(angle) * dist).toFixed(1)}vmax`,
    size: 3 + (i % 4),
    delay: `${(i % 5) * 12}ms`,
  };
});

function LoadingScreen({ phase, onSkip }) {
  const [pct, setPct] = useState(0);
  const bursting = phase === 'burst';

  useEffect(() => {
    const start = performance.now();
    let raf;
    const step = (now) => {
      const p = Math.min(100, Math.round(((now - start) / LOAD_MS) * 100));
      setPct(p);
      if (p < 100) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Loading ${SITE_DOMAIN}, ${pct}%`}
      onClick={onSkip}
      className={`fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center overflow-hidden ${
        bursting ? 'pointer-events-none' : ''
      }`}>
      {/* Backdrop: drops away during the burst to reveal the site behind it */}
      <div className={`absolute inset-0 bg-black ${bursting ? 'sp-backdrop-out' : ''}`} />

      {!bursting && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSkip();
          }}
          className="absolute right-4 top-4 z-50 cursor-pointer rounded-full px-3 py-1.5 text-xs tracking-wide text-zinc-500 transition-colors duration-200 hover:bg-zinc-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 sm:right-6 sm:top-6">
          Skip Intro ✕
        </button>
      )}

      <div className="relative">
        <div
          className={`relative h-36 w-[101px] sm:h-44 sm:w-[123px] ${phase === 'charge' ? 'sp-charge' : ''} ${
            bursting ? 'sp-core-out' : ''
          }`}>
          {!bursting && (
            <>
              <LoaderGlyph lit={false} />
              <div className="sp-fill absolute inset-x-0 bottom-0 overflow-hidden" style={{ animationDuration: `${LOAD_MS}ms` }}>
                <div className="absolute inset-x-0 bottom-0 h-36 sm:h-44">
                  <LoaderGlyph lit />
                </div>
              </div>
            </>
          )}
        </div>

        {bursting && (
          <div className="absolute inset-0" aria-hidden="true">
            {/* Soft flash + hairline shockwaves, centered on the glyph */}
            <span className="sp-flash absolute left-1/2 top-1/2 h-[220vmax] w-[220vmax] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.05)_18%,transparent_45%)]" />
            <span className="sp-shock absolute left-1/2 top-1/2 h-40 w-40 rounded-full border border-white/25" />
            <span
              className="sp-shock absolute left-1/2 top-1/2 h-40 w-40 rounded-full border border-white/10"
              style={{ animationDelay: '70ms' }}
            />

            {/* The S itself breaks apart */}
            {LOADER_SHARDS.map((sh) => (
              <span
                key={sh.key}
                className="sp-shard absolute p-[3px]"
                style={{
                  left: sh.left,
                  top: sh.top,
                  width: `${100 / 7}%`,
                  height: '10%',
                  '--dx': sh.dx,
                  '--dy': sh.dy,
                  '--r': sh.rot,
                  '--s': sh.scale,
                  animationDelay: sh.delay,
                }}>
                <span className="block h-full w-full rounded-[3px] bg-cyan-500" />
              </span>
            ))}

            {LOADER_SPARKS.map((sp) => (
              <span
                key={sp.key}
                className="sp-spark absolute left-1/2 top-1/2 rounded-full bg-white/70"
                style={{ width: sp.size, height: sp.size, '--dx': sp.dx, '--dy': sp.dy, animationDelay: sp.delay }}
              />
            ))}
          </div>
        )}
      </div>

      <div className={`relative mt-10 flex flex-col items-center gap-1.5 ${bursting ? 'sp-label-out' : ''}`}>
        <span className="text-sm font-medium tracking-tight text-zinc-400">{SITE_DOMAIN}</span>
        <span className="text-xs tabular-nums text-zinc-600">{pct}%</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Global styles (keyframes + native controls)                        */
/* ------------------------------------------------------------------ */

const GLOBAL_CSS = `
  html { scroll-behavior: smooth; }
  body { background: #000; }
  .sp-root {
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Inter', 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
  }
  @keyframes sp-fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  @keyframes sp-pop { from { transform: scale(.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .sp-fade-in { animation: sp-fade-in .35s ease-out both; }
  .sp-pop { animation: sp-pop .35s cubic-bezier(.2,.8,.2,1) both; }
  @keyframes sp-fill { from { height: 0%; } to { height: 100%; } }
  .sp-fill { height: 0%; animation-name: sp-fill; animation-timing-function: cubic-bezier(.45,.05,.35,1); animation-fill-mode: forwards; }
  /* Charge: a tight scale pulse just before the burst */
  @keyframes sp-charge {
    0% { transform: scale(1); }
    60% { transform: scale(1.08); }
    100% { transform: scale(1.12); }
  }
  .sp-charge { animation: sp-charge ${CHARGE_MS}ms cubic-bezier(.3,.7,.4,1) forwards; }
  /* Burst */
  @keyframes sp-core-out { from { transform: scale(1.12); opacity: 1; } to { transform: scale(5); opacity: 0; } }
  @keyframes sp-flash { 0% { transform: translate3d(-50%,-50%,0) scale(.05); opacity: 0; } 12% { opacity: 1; } 100% { transform: translate3d(-50%,-50%,0) scale(1); opacity: 0; } }
  @keyframes sp-shock { 0% { transform: translate3d(-50%,-50%,0) scale(.2); opacity: 1; } 100% { transform: translate3d(-50%,-50%,0) scale(14); opacity: 0; } }
  @keyframes sp-shard {
    0% { transform: translate3d(0,0,0) rotate(0) scale(1); opacity: 1; }
    12% { transform: translate3d(calc(var(--dx) * .04), calc(var(--dy) * .04), 0) scale(1.2); opacity: 1; }
    100% { transform: translate3d(var(--dx), var(--dy), 0) rotate(var(--r)) scale(var(--s)); opacity: 0; }
  }
  @keyframes sp-spark { 0% { transform: translate3d(-50%,-50%,0); opacity: 1; } 100% { transform: translate3d(calc(-50% + var(--dx)), calc(-50% + var(--dy)), 0) scale(.3); opacity: 0; } }
  @keyframes sp-backdrop-out { 0%, 15% { opacity: 1; } 100% { opacity: 0; } }
  @keyframes sp-label-out { to { opacity: 0; transform: translateY(10px); } }
  @keyframes sp-reveal { from { transform: scale(1.02); filter: blur(6px); } to { transform: none; filter: none; } }
  .sp-core-out { animation: sp-core-out 200ms cubic-bezier(.5,0,.75,0) forwards; }
  .sp-flash, .sp-shock, .sp-shard, .sp-spark { will-change: transform, opacity; backface-visibility: hidden; }
  .sp-flash { animation: sp-flash 450ms cubic-bezier(.1,.7,.3,1) forwards; }
  .sp-shock { animation: sp-shock 560ms cubic-bezier(.1,.75,.25,1) both; }
  .sp-shard { animation: sp-shard 590ms cubic-bezier(.12,.8,.3,1) both; }
  .sp-spark { animation: sp-spark 560ms cubic-bezier(.15,.85,.35,1) both; }
  .sp-backdrop-out { animation: sp-backdrop-out 420ms ease-out forwards; }
  .sp-label-out { animation: sp-label-out 220ms ease-in forwards; }
  /* backwards fill only: no lingering transform/filter, which would break position:fixed children */
  .sp-reveal { animation: sp-reveal 600ms cubic-bezier(.16,.84,.3,1) 40ms backwards; }
  select option { background: #27272a; color: #fff; }
  /* Native iOS-style slider */
  .sp-range {
    -webkit-appearance: none; appearance: none; height: 4px; border-radius: 999px; outline: none; cursor: pointer;
    background: linear-gradient(to right, #06b6d4 0%, #06b6d4 var(--fill, 0%), #3f3f46 var(--fill, 0%), #3f3f46 100%);
  }
  .sp-range::-webkit-slider-thumb {
    -webkit-appearance: none; width: 24px; height: 24px; border-radius: 999px; background: #fff; border: 0;
    box-shadow: 0 2px 6px rgba(0,0,0,.45), 0 0 0 .5px rgba(0,0,0,.08); transition: transform .2s;
  }
  .sp-range::-moz-range-thumb {
    width: 24px; height: 24px; border-radius: 999px; background: #fff; border: 0;
    box-shadow: 0 2px 6px rgba(0,0,0,.45), 0 0 0 .5px rgba(0,0,0,.08);
  }
  .sp-range::-moz-range-track { height: 4px; border-radius: 999px; background: #3f3f46; }
  .sp-range::-moz-range-progress { height: 4px; border-radius: 999px; background: #06b6d4; }
  .sp-range:active::-webkit-slider-thumb { transform: scale(1.06); }
  .sp-range:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 3px #000, 0 0 0 5px #06b6d4; }
  .sp-range:focus-visible::-moz-range-thumb { box-shadow: 0 0 0 3px #000, 0 0 0 5px #06b6d4; }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    .sp-fade-in, .sp-pop { animation: none !important; }
    .sp-fill { animation-duration: 1ms !important; }
    .sp-charge, .sp-core-out, .sp-reveal { animation: none !important; }
    .sp-flash, .sp-shock, .sp-shard, .sp-spark { display: none; }
  }
`;

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */

export default function App() {
  const [isLoading, setIsLoading] = useState(() => !introSeen());
  const [loadPhase, setLoadPhase] = useState(() => (introSeen() ? 'done' : 'fill')); // fill | charge | burst | done
  const introTimers = useRef([]);
  const [active, setActive] = useState('');
  const [prefill, setPrefill] = useState(null);

  const clearIntroTimers = () => {
    introTimers.current.forEach(clearTimeout);
    introTimers.current = [];
  };

  // Ends the intro, whether it ran to completion or was skipped.
  const finishIntro = useCallback(() => {
    clearIntroTimers();
    document.body.style.overflow = '';
    markIntroSeen();
    setIsLoading(false);
    setLoadPhase('done');
  }, []);

  // Loader timeline: fill the S, charge, burst (scroll unlocks here), then unmount.
  useEffect(() => {
    if (!isLoading) return undefined;
    document.body.style.overflow = 'hidden';
    introTimers.current = [
      setTimeout(() => setLoadPhase('charge'), LOAD_MS),
      setTimeout(() => {
        setLoadPhase('burst');
        document.body.style.overflow = '';
      }, LOAD_MS + CHARGE_MS),
      setTimeout(finishIntro, LOAD_MS + CHARGE_MS + BURST_MS),
    ];
    const onKey = (e) => {
      if (e.key === 'Escape') finishIntro();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearIntroTimers();
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // Runs once on mount; finishing the intro must not restart it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Every "Start Free Diagnostic" entry point lands on the funnel, optionally pre-selecting a service track.
  const startDiagnostic = (track) => {
    if (track) setPrefill({ track, at: Date.now() });
    scrollToId('diagnostic');
  };

  return (
    <div className="sp-root relative min-h-screen bg-black text-zinc-400 selection:bg-cyan-500/30 selection:text-white">
      <style>{GLOBAL_CSS}</style>
      {isLoading && <LoadingScreen phase={loadPhase} onSkip={finishIntro} />}
      <RevealReadyContext.Provider value={!isLoading}>
        <div className={loadPhase === 'burst' ? 'sp-reveal' : undefined}>
          <NavBar active={active} />
          <main>
            <Hero onStart={startDiagnostic} />
            <Services onStart={startDiagnostic} />
            <Events onStart={startDiagnostic} />
            <CaseStudies />
            <Playbook />
            <RoiCalculator onStart={startDiagnostic} />
            <Diagnostic prefill={prefill} />
            <Contact />
          </main>
          <Footer onStart={startDiagnostic} />
        </div>
      </RevealReadyContext.Provider>
    </div>
  );
}
