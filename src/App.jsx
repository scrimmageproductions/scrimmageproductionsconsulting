import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  BookOpen,
  Check,
  ChevronRight,
  Clock,
  Cpu,
  Ear,
  FileText,
  Film,
  Filter,
  FolderTree,
  Globe,
  Inbox,
  Loader2,
  Lock,
  Mail,
  Menu,
  Rocket,
  Search,
  Shield,
  Target,
  TrendingUp,
  Workflow,
  X,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Configuration                                                      */
/* ------------------------------------------------------------------ */

const CONTACT_EMAIL = 'scrimmageproductions@gmail.com';
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
// Web3Forms routes submissions to the inbox that owns the access key (scrimmageproductions@gmail.com).
// This key is public by design: it can only send to that inbox. If it is ever removed or set back
// to a YOUR_ placeholder, submissions fall back to a pre-filled email.
const WEB3FORMS_ACCESS_KEY = '50f8f02c-b73b-48fc-b143-c16c183fb208';
const KEY_CONFIGURED = !WEB3FORMS_ACCESS_KEY.startsWith('YOUR_');

const NAV_LINKS = [
  { id: 'services', label: 'Services' },
  { id: 'diagnostic', label: 'Diagnostic Quiz' },
  { id: 'playbook', label: 'The Playbook' },
  { id: 'roi', label: 'ROI Calculator' },
  { id: 'contact', label: 'Contact' },
];

const INTERESTS = [
  'Google Workspace Audit',
  'Email Automation',
  'Document AI',
  'Funnel Teardown',
  'General Diagnostic Advisory',
];

const HERO_METRICS = [
  { icon: Clock, value: '15+ hrs/week', label: 'reclaimed per key operator' },
  { icon: Filter, value: 'Zero-Loss', label: 'funnel audits' },
  { icon: Cpu, value: '100%', label: 'tailored integrations' },
];

const TICKER_ITEMS = [
  'Gmail triage pipelines',
  'Custom assistants in Docs, Sheets & Gmail',
  'Shared Drive architecture',
  'Sentiment-routed support',
  'Auto-generated proposals',
  'Typeform · Tally · Google Forms',
  'Zapier & Make orchestration',
  'Contract & proposal generation',
  'Funnel drop-off forensics',
  'Webhook-driven onboarding',
];

const BOTTLENECKS = [
  {
    id: 'inbox',
    label: 'Inbox Overwhelm',
    icon: Inbox,
    symptom: 'Your best operators live in Gmail, sorting, forwarding and re-typing the same replies all day.',
    play: 'The Inbox Triage Play',
    interest: 'Email Automation',
    steps: [
      'Auto-categorization and priority labels on every inbound thread',
      'Sentiment routing that escalates frustrated customers in minutes, not days',
      'Drafted-for-you replies grounded in your SOPs, approved in one click',
    ],
    hours: 12,
    revenue: 'Faster response times on every lead and support thread',
    stack: ['Gmail', 'Apps Script', 'Zapier / Make', 'Webhooks'],
  },
  {
    id: 'workspace',
    label: 'Disorganized Google Workspace',
    icon: FolderTree,
    symptom: 'Nobody can find the latest version, permissions are a guess, and formulas break when someone sneezes.',
    play: 'The Workspace Rebuild Play',
    interest: 'Google Workspace Audit',
    steps: [
      'Full Drive and Shared Drive architecture map with a clean folder taxonomy',
      'Permission audit that closes oversharing and orphaned-file risk',
      'Custom assistants configured for Docs, Sheets and Gmail',
    ],
    hours: 8,
    revenue: 'Lower risk of data leaks and lost work from broken files',
    stack: ['Google Workspace', 'Apps Script', 'Shared Drives'],
  },
  {
    id: 'docs',
    label: 'Manual Document Creation',
    icon: FileText,
    symptom: 'Proposals, contracts and onboarding briefs are rebuilt from scratch, copy-pasted from old files.',
    play: 'The Doc Engine Play',
    interest: 'Document AI',
    steps: [
      'Static PDFs converted into smart intake forms that validate as they go',
      'Form submissions trigger finished contracts, proposals and briefs',
      'Text synthesis tailors each document to the client in seconds',
    ],
    hours: 10,
    revenue: 'Proposals out the same day, while the deal is still warm',
    stack: ['Google Forms', 'Typeform', 'Tally', 'Docs Templates', 'Make'],
  },
  {
    id: 'funnel',
    label: 'Leaky Sales Funnel',
    icon: TrendingUp,
    symptom: 'Traffic arrives, interest is there, but leads quietly disappear between first click and signed deal.',
    play: 'The Funnel Teardown Play',
    interest: 'Funnel Teardown',
    steps: [
      'Stage-by-stage drop-off map from first visit to closed deal',
      'Website teardown: lead capture gaps, fuzzy value props, UX friction',
      'Automated follow-up sequences so no qualified lead goes cold',
    ],
    hours: 6,
    revenue: 'More of your existing traffic converts, without more ad spend',
    stack: ['Analytics', 'CRM Webhooks', 'Zapier', 'Landing Page UX'],
  },
];

const SERVICES = {
  automation: {
    label: 'Workflow Automation',
    short: 'Automation',
    icon: Workflow,
    blurb: 'Automated systems built inside the tools your team already uses every day.',
    cards: [
      {
        icon: FolderTree,
        title: 'Full Google Workspace Audit',
        summary: 'A structural review of how your team stores, shares and calculates, followed by assistants built for your actual workflows.',
        deliverables: [
          'Drive and Shared Drive architecture review',
          'User permissioning and access-risk audit',
          'Sheet formula and calendar scheduling bottleneck fixes',
          'Custom assistants for Docs, Gmail and Sheets',
        ],
        stack: ['Google Workspace', 'Apps Script', 'Zapier / Make', 'Webhooks'],
        interest: 'Google Workspace Audit',
      },
      {
        icon: Mail,
        title: 'Intelligent Email & Inbox Routing',
        summary: 'Move the inbox from an unmanaged to-do list to a routed pipeline that sorts threads and prepares drafts.',
        deliverables: [
          'Triage pipelines with smart auto-categorization',
          'Customer support sentiment routing and escalation',
          'Automated drafted responses based on your SOPs',
          'Target: 10 to 15 hours/week back per key operator',
        ],
        stack: ['Google Workspace', 'Gmail', 'Zapier / Make', 'Webhooks'],
        interest: 'Email Automation',
      },
      {
        icon: FileText,
        title: 'Smart Forms & Document Generation',
        summary: 'Replace static PDFs and copy-paste docs with intake that writes the paperwork for you.',
        deliverables: [
          'Static PDFs converted to Google Forms, Typeform or Tally intake',
          'Auto-generated contracts, proposals and onboarding briefs',
          'Text synthesis that tailors every document to the client',
          'Trigger-based delivery straight to the client and your Drive',
        ],
        stack: ['Google Workspace', 'Typeform', 'Tally', 'Zapier / Make', 'Webhooks'],
        interest: 'Document AI',
      },
    ],
  },
  strategy: {
    label: 'General Business Strategy',
    short: 'Business Strategy',
    icon: Target,
    blurb: 'Executive-grade diagnostics that find the root cause before anyone writes a line of automation.',
    cards: [
      {
        icon: Filter,
        title: 'Friction & Conversion Funnel Analysis',
        summary:
          'Identify where traffic drops off, map friction in your client onboarding, and patch leakages in your sales pipelines.',
        deliverables: [
          'End-to-end funnel leakage report',
          'Onboarding friction and drop-off mapping',
          'CRM state and pipeline hygiene review',
          'Revised conversion architecture playbook',
        ],
        stack: ['Funnel Analytics', 'CRM', 'Strategy'],
        interest: 'Funnel Teardown',
      },
      {
        icon: Globe,
        title: 'On-Site Opportunity Teardown',
        summary:
          'A comprehensive critique of your digital presence to uncover missing lead capture mechanics, ambiguous value propositions, and UX barriers.',
        deliverables: [
          'UX and navigation barrier identification',
          'Lead capture mechanics and CTA review',
          'Value proposition clarity check',
          'Actionable conversion rate optimization (CRO) roadmap',
        ],
        stack: ['CRO', 'UX / UI', 'Lead Capture'],
        interest: 'Funnel Teardown',
      },
      {
        icon: Ear,
        title: 'Executive Diagnostic & Advisory',
        summary:
          'Tailored problem-solving sessions. We listen, diagram your operational chaos, identify the root causes (not just symptoms), and architect the fix.',
        deliverables: [
          '1-on-1 executive discovery and listening sessions',
          'Operational friction diagramming',
          'Root-cause isolation vs. symptom treating',
          'Custom implementation and sequence playbook',
        ],
        stack: ['Executive Advisory', 'Architecture', 'Operations'],
        interest: 'General Diagnostic Advisory',
      },
    ],
  },
};

const METHOD_STEPS = [
  {
    n: '01',
    icon: Film,
    title: 'The Film Room',
    tag: 'Diagnose',
    body: 'We review how work actually moves through your business. We listen first, map each bottleneck, and quantify where hours and revenue are lost.',
    points: ['Discovery interviews', 'Workflow and funnel mapping', 'Bottleneck scoring'],
  },
  {
    n: '02',
    icon: BookOpen,
    title: 'The Playbook',
    tag: 'Architect',
    body: 'We architect the fixes: custom automations, Workspace restructuring and funnel corrections, sequenced by ROI so the highest-return work ships first.',
    points: ['Automation blueprints', 'Funnel fix roadmap', 'ROI-ranked sequencing'],
  },
  {
    n: '03',
    icon: Rocket,
    title: 'The Execution',
    tag: 'Deploy',
    body: 'Hands-on deployment, team training inside your Workspace, and iteration until the new system runs reliably without us.',
    points: ['Hands-on deployment', 'Workspace training', 'Operational scale-up'],
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
      aria-label="Scrimmage Productions LLC, back to top">
      <MatrixS size={tagline ? 30 : 22} />
      <span className="leading-tight">
        <span className="block text-[15px] font-semibold tracking-tight text-white">
          Scrimmage Productions <span className="font-normal text-zinc-500">LLC</span>
        </span>
        {tagline && <span className="block text-xs text-zinc-500">Ops & Strategy</span>}
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
              <PrimaryButton onClick={() => go('contact')} className="px-4 py-1.5 text-sm">
                Book Strategy Audit
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
          <PrimaryButton onClick={() => go('contact')} className="mt-auto w-full py-3">
            Book Strategy Audit
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

function Hero() {
  return (
    <section className="px-4 pb-24 pt-24 sm:px-6 sm:pb-32 sm:pt-36 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-medium text-zinc-500 sm:text-base">Business Consulting · Operational Optimization</p>
        <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
          Precision Business Architecture.
          <br />
          <span className="text-zinc-500">Automated Workflows.</span>
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-zinc-400 sm:text-xl">
          Scrimmage Productions restructures your Google Workspace, automates email routing and document generation,
          and provides executive diagnostic consulting to identify the root cause of operational friction. The result
          is fewer manual steps, clearer ownership, and hours returned to your team each week.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <PrimaryButton onClick={() => scrollToId('contact')} className="px-7 py-3 text-[17px]">
            Book Strategy Audit
          </PrimaryButton>
          <SecondaryButton onClick={() => scrollToId('services')} className="px-6 py-3 text-[17px]">
            Explore Automations <ChevronRight className="h-4 w-4" />
          </SecondaryButton>
        </div>

        <Reveal
          as="dl"
          className="mx-auto mt-20 grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-white/10">
          {HERO_METRICS.map(({ value, label }) => (
            <div key={label} className="px-6">
              <dt className="text-3xl font-semibold tracking-tight text-white">{value}</dt>
              <dd className="mt-1 text-sm text-zinc-500">{label}</dd>
            </div>
          ))}
        </Reveal>
      </div>

      <Reveal className="mx-auto mt-20 max-w-xl">
        <HeroConsole />
      </Reveal>

      <Reveal as="ul" className="mx-auto mt-16 flex max-w-4xl flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-zinc-500">
        {TICKER_ITEMS.map((t, i) => (
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
  const lines = [
    { icon: Inbox, text: '142 inbound threads triaged' },
    { icon: Shield, text: '37 overshared files locked down' },
    { icon: FileText, text: 'Proposal generated · 00:41s' },
    { icon: TrendingUp, text: 'Funnel leak patched · Stage 3' },
  ];
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => (n + 1) % lines.length), 2200);
    return () => clearInterval(t);
  }, [lines.length]);

  return (
    <Card className="p-5 text-left shadow-lg shadow-black/50 sm:p-6">
      <div className="flex items-center justify-between px-1">
        <span className="text-sm font-medium text-zinc-300">Ops Console · Sample run</span>
        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" /> live demo
        </span>
      </div>
      <ul className="mt-4 space-y-1">
        {lines.map(({ icon: Icon, text }, i) => (
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
      <p className="mt-4 px-1 text-xs text-zinc-600">
        Illustrative automation events. Your results depend on your stack and volume.
      </p>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Diagnostic tool                                                    */
/* ------------------------------------------------------------------ */

function Diagnostic({ onRequest }) {
  const [selected, setSelected] = useState(BOTTLENECKS[0].id);
  const [team, setTeam] = useState(3);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error | fallback
  const [error, setError] = useState('');

  const b = BOTTLENECKS.find((x) => x.id === selected);
  const weekly = b.hours * team;
  const yearly = weekly * 48;

  const summary = [
    `Bottleneck: ${b.label}`,
    `Recommended: ${b.play}`,
    ...b.steps.map((s) => `- ${s}`),
    `Team members affected: ${team}`,
    `Estimated time reclaimed: ~${weekly} hrs/week (~${yearly.toLocaleString()} hrs/year)`,
    `Stack: ${b.stack.join(', ')}`,
  ].join('\n');

  const send = async (e) => {
    e.preventDefault();
    if (!isEmail(email)) {
      setError('Enter a valid business email so we can send your preview.');
      setStatus('error');
      return;
    }
    setError('');
    setStatus('loading');
    try {
      await submitToWeb3Forms({
        subject: `Diagnostic preview request: ${b.label}`,
        from_name: 'Scrimmage Diagnostic Tool',
        email,
        replyto: email,
        interest: b.interest,
        message: summary,
      });
      setStatus('success');
    } catch (err) {
      if (err.code === 'not-configured') {
        window.location.assign(buildMailto(`Diagnostic preview request: ${b.label}`, `Send my audit to: ${email}\n\n${summary}`));
        setStatus('fallback');
      } else {
        setError('We could not send that just now. Use the email link below and we will reply directly.');
        setStatus('error');
      }
    }
  };

  return (
    <section id="diagnostic" className="scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Operational Friction Diagnostic"
          title="What is slowing your team down the most?"
          sub="Pick your biggest bottleneck. You will see the play we would run, and a rough estimate of the hours it gives back."
        />

        <Reveal className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10">
          {/* Sidebar list */}
          <div role="radiogroup" aria-label="Biggest bottleneck" className="space-y-1">
            {BOTTLENECKS.map((opt) => {
              const Icon = opt.icon;
              const on = opt.id === selected;
              return (
                <button
                  key={opt.id}
                  role="radio"
                  aria-checked={on}
                  onClick={() => {
                    setSelected(opt.id);
                    setStatus('idle');
                  }}
                  className={`flex w-full items-start gap-3.5 rounded-2xl px-4 py-3.5 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                    on ? 'bg-zinc-800' : 'hover:bg-zinc-900'
                  }`}>
                  <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${on ? 'text-cyan-500' : 'text-zinc-500'}`} />
                  <span>
                    <span className={`block text-[15px] font-medium ${on ? 'text-white' : 'text-zinc-200'}`}>{opt.label}</span>
                    <span className="mt-0.5 block text-sm leading-snug text-zinc-500">{opt.symptom}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detail panel */}
          <Card key={b.id} className="sp-fade-in flex flex-col p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm font-medium text-zinc-500">Your Scrimmage Solution</span>
              <Badge>ROI positive</Badge>
            </div>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{b.play}</h3>

            <ul className="mt-6 space-y-3">
              {b.steps.map((s) => (
                <li key={s} className="flex gap-3 text-[15px] text-zinc-300">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-zinc-500" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <label htmlFor="team" className="flex items-center justify-between text-[15px] text-zinc-300">
                People affected
                <span className="font-medium tabular-nums text-white">{team}</span>
              </label>
              <RangeSlider id="team" value={team} min={1} max={25} onChange={setTeam} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-zinc-950 p-5">
                <p className="text-sm text-zinc-500">Est. hours reclaimed / week</p>
                <p className="mt-1 text-4xl font-semibold tracking-tight tabular-nums text-white">~{weekly}</p>
              </div>
              <div className="rounded-2xl bg-zinc-950 p-5">
                <p className="text-sm text-zinc-500">Est. hours reclaimed / year</p>
                <p className="mt-1 text-4xl font-semibold tracking-tight tabular-nums text-white">~{yearly.toLocaleString()}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-zinc-400">{b.revenue}</p>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {b.stack.map((s) => (
                <Badge key={s}>{s}</Badge>
              ))}
            </div>

            <div className="mt-8 border-t border-white/5 pt-6">
              {status === 'success' || status === 'fallback' ? (
                <div className="sp-fade-in flex items-start gap-3 rounded-2xl bg-zinc-800 p-4 text-sm text-zinc-200">
                  <Check className="h-5 w-5 shrink-0 text-white" />
                  <span>
                    {status === 'success'
                      ? 'Preview sent. We will follow up with your full audit outline within one business day.'
                      : 'Your email app opened with the preview pre-filled. Hit send and we will take it from there.'}
                  </span>
                </div>
              ) : (
                <form onSubmit={send} noValidate>
                  <label htmlFor="diag-email" className="text-[15px] font-medium text-white">
                    Send this audit preview to your inbox
                  </label>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <input
                      id="diag-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      aria-invalid={status === 'error'}
                      className={`${INPUT_CLS} flex-1 ${status === 'error' ? 'ring-2 ring-red-500/70' : ''}`}
                    />
                    <PrimaryButton type="submit" disabled={status === 'loading'} className="py-3">
                      {status === 'loading' && <Loader2 className="h-4 w-4 animate-spin" />}
                      Send my audit
                    </PrimaryButton>
                  </div>
                  {status === 'error' && (
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-red-400">
                      <AlertTriangle className="h-4 w-4" /> {error}
                    </p>
                  )}
                </form>
              )}
              <TextAction
                onClick={() => onRequest(b.interest, `My biggest bottleneck is ${b.label.toLowerCase()}. ${b.symptom}`)}
                className="mt-5">
                Book Strategy Audit <ChevronRight className="h-4 w-4" />
              </TextAction>
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Services                                                           */
/* ------------------------------------------------------------------ */

function Services({ onRequest }) {
  const [tab, setTab] = useState('automation');
  const pillar = SERVICES[tab];

  return (
    <section id="services" className="scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Services"
          title="Automation for repetitive work. Advisory for the decisions behind it."
          sub="Most engagements begin with one pillar. The second is added once the first is delivering measurable results."
        />

        {/* Segmented control */}
        <div className="mb-6 flex justify-center">
          <div role="tablist" aria-label="Service pillars" className="inline-flex w-full max-w-md rounded-xl bg-zinc-900 p-1">
            {Object.entries(SERVICES).map(([key, p]) => {
              const on = key === tab;
              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setTab(key)}
                  className={`min-w-0 flex-1 rounded-lg px-3 py-2 text-sm font-medium transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 ${
                    on ? 'bg-zinc-700 text-white shadow-lg shadow-black/50' : 'text-zinc-400 hover:text-white'
                  }`}>
                  <span className="truncate sm:hidden">{p.short}</span>
                  <span className="hidden truncate sm:inline">{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="mb-12 text-center text-zinc-400">{pillar.blurb}</p>

        <div key={tab} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {pillar.cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <Reveal key={c.title} delay={i * 100} className="h-full">
                <Card className="flex h-full flex-col p-7 sm:p-8">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-zinc-800 text-zinc-200">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-6 text-xl font-semibold tracking-tight text-white">{c.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-zinc-400">{c.summary}</p>

                  <p className="mt-7 text-xs font-medium uppercase tracking-wide text-zinc-500">Deliverables</p>
                  <ul className="mt-3 space-y-2.5">
                    {c.deliverables.map((d) => (
                      <li key={d} className="flex gap-2.5 text-sm text-zinc-300">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" />
                        {d}
                      </li>
                    ))}
                  </ul>

                  <div className="mb-8 mt-6 flex flex-wrap gap-1.5">
                    {c.stack.map((s) => (
                      <Badge key={s}>{s}</Badge>
                    ))}
                  </div>

                  <TextAction onClick={() => onRequest(c.interest, `I'm interested in: ${c.title}.`)} className="mt-auto self-start">
                    Request Audit <ChevronRight className="h-4 w-4" />
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
/*  Methodology                                                        */
/* ------------------------------------------------------------------ */

function Playbook() {
  return (
    <section id="playbook" className="scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="The Scrimmage Method"
          title="Film. Playbook. Execution."
          sub="Every engagement follows the same three phases, so scope, sequence and accountability are clear from the start."
        />

        <ol className="grid gap-5 lg:grid-cols-3">
          {METHOD_STEPS.map(({ n, icon: Icon, title, tag, body, points }, i) => (
            <Reveal as="li" key={n} delay={i * 100}>
              <Card className="h-full p-7 sm:p-8">
                <div className="flex items-start justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-zinc-800 text-zinc-200">
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
/*  ROI calculator                                                     */
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

function RoiCalculator() {
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
          eyebrow="ROI Calculator"
          title="What is manual work really costing you?"
          sub="Move the sliders to match your team. We assume automation recovers about 60% of repetitive hours, a conservative starting point we refine during the Film Room."
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
                label="Loaded hourly cost per person"
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
              <span className="text-sm font-medium text-zinc-500">Estimated annual value recovered</span>
              <p className="mt-2 text-5xl font-semibold tracking-tight tabular-nums text-white sm:text-6xl">
                {fmtMoney(r.annualValue)}
              </p>
              <div className="mt-6 h-1 overflow-hidden rounded-full bg-zinc-800" aria-hidden="true">
                <div
                  className="h-full rounded-full bg-white transition-all duration-500 ease-out"
                  style={{ width: `${Math.max(pct, 2)}%` }}
                />
              </div>

              <dl className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { label: 'Hours back / week', value: Math.round(r.weeklyHours).toLocaleString() },
                  { label: 'Hours back / year', value: Math.round(r.annualHours).toLocaleString() },
                  { label: 'Full-time equivalents', value: r.fte.toFixed(1) },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-2xl bg-zinc-950 p-4">
                    <dt className="text-sm text-zinc-500">{label}</dt>
                    <dd className="mt-1 text-2xl font-semibold tracking-tight tabular-nums text-white">{value}</dd>
                  </div>
                ))}
              </dl>

              <p className="mb-8 mt-6 text-[15px] text-zinc-400">
                That is capacity you can redirect to sales, delivery and strategy, without adding headcount.
              </p>
              <PrimaryButton onClick={() => scrollToId('contact')} className="mt-auto w-full py-3">
                Book Strategy Audit
              </PrimaryButton>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Contact                                                            */
/* ------------------------------------------------------------------ */

const EMPTY_FORM = { name: '', email: '', company: '', interest: '', message: '', botcheck: false };

function validate(f) {
  const e = {};
  if (f.name.trim().length < 2) e.name = 'Please enter your full name.';
  if (!isEmail(f.email)) e.email = 'Please enter a valid business email.';
  if (f.company.trim().length < 2) e.company = 'Company name or website helps us prepare.';
  if (!f.interest) e.interest = 'Choose the area you want to focus on.';
  if (f.message.trim().length < 20) e.message = 'Give us a sentence or two (20+ characters) on what is breaking.';
  return e;
}

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 flex items-center gap-1.5 text-xs text-red-400">
          <AlertTriangle className="h-3.5 w-3.5" /> {error}
        </p>
      )}
    </div>
  );
}

function Contact({ prefill }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error | fallback
  const [serverError, setServerError] = useState('');

  // Apply a new "Request Audit" prefill during render (no effect round-trip).
  const [appliedPrefill, setAppliedPrefill] = useState(null);
  if (prefill && prefill !== appliedPrefill) {
    setAppliedPrefill(prefill);
    setForm((f) => ({ ...f, interest: prefill.interest, message: f.message || prefill.message }));
    setStatus('idle');
  }

  const update = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => {
      const next = { ...f, [key]: value };
      if (touched) setErrors(validate(next));
      return next;
    });
  };

  const mailBody = `Name: ${form.name}\nEmail: ${form.email}\nCompany: ${form.company}\nInterest: ${form.interest}\n\n${form.message}`;
  const mailSubject = `Strategy Audit request${form.company ? `: ${form.company}` : ''}`;

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
        from_name: 'Scrimmage Productions Website',
        name: form.name,
        email: form.email,
        replyto: form.email,
        company: form.company,
        interest: form.interest,
        message: form.message,
      });
      setStatus('success');
      setForm(EMPTY_FORM);
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

  const inputCls = (k) => `${INPUT_CLS} ${errors[k] ? 'ring-2 ring-red-500/70' : ''}`;

  return (
    <section id="contact" className="scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <SectionHeader
            center={false}
            eyebrow="Book a Strategy Audit"
            title="Describe the friction. We will scope the fix."
            sub="Every engagement starts with listening. Share your operational challenges and we will come back within one business day with next steps."
          />
          <Reveal delay={100}>
            <ul className="space-y-5">
              {[
                { icon: Ear, title: 'Listen first', body: 'A focused session on your goals, tools and team, before any recommendation.' },
                { icon: Search, title: 'Root cause, not symptoms', body: 'We trace friction to its source so fixes stick.' },
                { icon: Shield, title: 'Confidential by default', body: 'Your workflows and data stay between us.' },
              ].map(({ icon: Icon, title, body }) => (
                <li key={title} className="flex gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-zinc-900 text-zinc-300">
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
              <div className="sp-fade-in flex min-h-[420px] flex-col items-center justify-center text-center">
                <span className="sp-pop grid h-16 w-16 place-items-center rounded-full bg-zinc-800">
                  <Check className="h-8 w-8 text-white" />
                </span>
                <h3 className="mt-6 text-2xl font-semibold tracking-tight text-white">
                  {status === 'success' ? 'Message received.' : 'Almost there.'}
                </h3>
                <p className="mt-3 max-w-sm text-zinc-400">
                  {status === 'success'
                    ? 'Your request is in our inbox. Expect a reply within one business day with times for your Strategy Audit.'
                    : 'Your email app opened with everything pre-filled. Hit send and we will reply within one business day.'}
                </p>
                <SecondaryButton onClick={() => setStatus('idle')} className="mt-8">
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
                  <Field id="name" label="Full Name" error={errors.name}>
                    <input
                      id="name"
                      value={form.name}
                      onChange={update('name')}
                      autoComplete="name"
                      placeholder="Jordan Rivera"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'name-err' : undefined}
                      className={inputCls('name')}
                    />
                  </Field>
                  <Field id="email" label="Business Email" error={errors.email}>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={update('email')}
                      autoComplete="email"
                      placeholder="jordan@company.com"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'email-err' : undefined}
                      className={inputCls('email')}
                    />
                  </Field>
                </div>
                <Field id="company" label="Company Name / Website" error={errors.company}>
                  <input
                    id="company"
                    value={form.company}
                    onChange={update('company')}
                    autoComplete="organization"
                    placeholder="Acme Co. · acme.com"
                    aria-invalid={!!errors.company}
                    aria-describedby={errors.company ? 'company-err' : undefined}
                    className={inputCls('company')}
                  />
                </Field>
                <Field id="interest" label="Primary Area of Interest" error={errors.interest}>
                  <select
                    id="interest"
                    value={form.interest}
                    onChange={update('interest')}
                    aria-invalid={!!errors.interest}
                    aria-describedby={errors.interest ? 'interest-err' : undefined}
                    className={`${inputCls('interest')} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22none%22 stroke=%22%23a1a1aa%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><path d=%22M4 6l4 4 4-4%22/></svg>')] bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10`}>
                    <option value="" disabled>
                      Select an area...
                    </option>
                    {INTERESTS.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field id="message" label="Message / Operational Challenges" error={errors.message}>
                  <textarea
                    id="message"
                    rows={5}
                    value={form.message}
                    onChange={update('message')}
                    placeholder="Where does work get stuck? Which tools does your team live in? What would you fix first?"
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? 'message-err' : undefined}
                    className={`${inputCls('message')} resize-y`}
                  />
                </Field>

                {status === 'error' && (
                  <div role="alert" className="flex items-start gap-3 rounded-2xl bg-red-500/10 p-4 text-sm text-red-300">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      {serverError} Your message was not sent. Try again, or email us directly with the button below.
                    </span>
                  </div>
                )}

                <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center">
                  <PrimaryButton type="submit" disabled={status === 'loading'} className="flex-1 py-3">
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                      </>
                    ) : (
                      'Book Strategy Audit'
                    )}
                  </PrimaryButton>
                  <a href={buildMailto(mailSubject, mailBody)} className={`${SECONDARY_CLS} py-3`}>
                    <Mail className="h-4 w-4" /> Email us directly
                  </a>
                </div>
                <p className="text-xs text-zinc-500">
                  We only use your details to respond to this request. No newsletters, no list selling.
                </p>
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

function Footer() {
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
              Precision business architecture and automated workflows. We identify operational friction, remove it, and
              return measurable hours to your team.
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
            <PrimaryButton onClick={() => scrollToId('contact')} className="mt-5 px-4 py-2 text-sm">
              Book Strategy Audit
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
              ? 'We collect only what you submit through our forms (name, email, company and message) and use it solely to respond to your inquiry. We do not sell or share your information. Contact us to request deletion at any time.'
              : 'Content on this site is provided for general information and does not constitute a binding offer. Engagements are governed by a separate written agreement between your organization and Scrimmage Productions LLC.'}
          </div>
        )}

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-6 text-xs text-zinc-500 sm:flex-row sm:items-center">
          <p>© 2026 Scrimmage Productions LLC. All Rights Reserved.</p>
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
      aria-label={`Loading Scrimmage Productions, ${pct}%`}
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
        <span className="text-sm font-medium tracking-tight text-zinc-400">Scrimmage Productions</span>
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

  const requestAudit = (interest, message) => {
    setPrefill({ interest, message, at: Date.now() });
    scrollToId('contact');
  };

  return (
    <div className="sp-root relative min-h-screen bg-black text-zinc-400 selection:bg-cyan-500/30 selection:text-white">
      <style>{GLOBAL_CSS}</style>
      {isLoading && <LoadingScreen phase={loadPhase} onSkip={finishIntro} />}
      <RevealReadyContext.Provider value={!isLoading}>
        <div className={loadPhase === 'burst' ? 'sp-reveal' : undefined}>
          <NavBar active={active} />
          <main>
            <Hero />
            <Services onRequest={requestAudit} />
            <Diagnostic onRequest={requestAudit} />
            <Playbook />
            <RoiCalculator />
            <Contact prefill={prefill} />
          </main>
          <Footer />
        </div>
      </RevealReadyContext.Provider>
    </div>
  );
}
