import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Calculator,
  CheckCircle2,
  Clock,
  Cpu,
  DollarSign,
  Ear,
  FileText,
  Film,
  Filter,
  FolderTree,
  Gauge,
  Globe,
  Inbox,
  Layers,
  Loader2,
  Lock,
  Mail,
  Menu,
  Rocket,
  Search,
  Send,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Workflow,
  X,
  Zap,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Configuration                                                      */
/* ------------------------------------------------------------------ */

const CONTACT_EMAIL = 'scrimmageproductions@gmail.com';
const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
// Web3Forms routes submissions to the inbox that owns the access key.
// Generate a free key for scrimmageproductions@gmail.com at https://web3forms.com
// and paste it here. Until then, submissions fall back to a pre-filled email.
const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';
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
  { icon: Cpu, value: '100%', label: 'tailored AI integration' },
];

const TICKER_ITEMS = [
  'Gmail triage pipelines',
  'Gemini in Docs, Sheets & Gmail',
  'Shared Drive architecture',
  'Sentiment-routed support',
  'Auto-generated proposals',
  'Typeform · Tally · Google Forms',
  'Zapier & Make orchestration',
  'OpenAI / Claude API agents',
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
      'AI auto-categorization and priority labels on every inbound thread',
      'Sentiment routing that escalates frustrated customers in minutes, not days',
      'Drafted-for-you replies grounded in your SOPs, approved in one click',
    ],
    hours: 12,
    revenue: 'Faster response times on every lead and support thread',
    stack: ['Gmail', 'Apps Script', 'Claude / OpenAI API', 'Zapier'],
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
      'Gemini and custom assistants wired into Docs, Sheets and Gmail',
    ],
    hours: 8,
    revenue: 'Lower risk of data leaks and lost work from broken files',
    stack: ['Google Workspace', 'Gemini', 'Apps Script', 'Shared Drives'],
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
      'AI text synthesis tailors each document to the client in seconds',
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
  ai: {
    label: 'AI Workflow Automation',
    short: 'AI Automation',
    icon: Workflow,
    blurb: 'Hands-off systems inside the tools your team already uses every day.',
    cards: [
      {
        icon: FolderTree,
        title: 'Full Google Workspace AI Audit',
        summary: 'A structural teardown of how your team actually stores, shares and computes, then an AI layer on top.',
        deliverables: [
          'Drive and Shared Drive architecture review',
          'User permissioning and access-risk audit',
          'Sheet formula and calendar scheduling bottleneck fixes',
          'Gemini and custom AI assistants for Docs, Gmail and Sheets',
        ],
        stack: ['Google Workspace', 'Gemini', 'Apps Script', 'OpenAI / Claude API'],
        interest: 'Google Workspace Audit',
      },
      {
        icon: Mail,
        title: 'Intelligent Email & Inbox Automation',
        summary: 'Turn the inbox from a to-do list you never finish into a pipeline that sorts and drafts itself.',
        deliverables: [
          'Triage pipelines with smart auto-categorization',
          'Customer support sentiment routing and escalation',
          'AI-drafted responses grounded in your playbooks',
          'Target: 10 to 15 hours/week back per key operator',
        ],
        stack: ['Gmail', 'Zapier / Make', 'OpenAI / Claude API', 'Webhooks'],
        interest: 'Email Automation',
      },
      {
        icon: FileText,
        title: 'Smart Forms & Document Generation',
        summary: 'Replace static PDFs and copy-paste docs with intake that writes the paperwork for you.',
        deliverables: [
          'Static PDFs converted to Google Forms, Typeform or Tally intake',
          'Auto-generated contracts, proposals and onboarding briefs',
          'AI text synthesis that tailors every document to the client',
          'Trigger-based delivery straight to the client and your Drive',
        ],
        stack: ['Google Forms', 'Typeform', 'Tally', 'Zapier / Make', 'Webhooks'],
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
        summary: 'Find exactly where prospects and new clients stall, and what each leak is costing you.',
        deliverables: [
          'Inbound and outbound funnel drop-off mapping',
          'Client onboarding friction points, ranked by impact',
          'Leakage report with prioritized fixes',
          'Follow-up and nurture automation recommendations',
        ],
        stack: ['Analytics', 'CRM', 'Zapier / Make', 'Webhooks'],
        interest: 'Funnel Teardown',
      },
      {
        icon: Globe,
        title: 'On-Site Opportunity Teardown',
        summary: 'A frank critique of your website through the eyes of a buyer who is ready to leave.',
        deliverables: [
          'Missing lead capture mechanics and quick wins',
          'Value proposition clarity and messaging review',
          'UX barriers on mobile and desktop',
          'Annotated teardown with a prioritized fix list',
        ],
        stack: ['UX Review', 'CRO', 'Analytics', 'Lead Capture'],
        interest: 'Funnel Teardown',
      },
      {
        icon: Ear,
        title: 'Executive Diagnostic & "Listen First" Advisory',
        summary: 'We listen, diagram the chaos, and separate root causes from symptoms.',
        deliverables: [
          'Tailored problem-solving sessions with leadership',
          'Operational chaos diagrammed into a clear system map',
          'Root-cause analysis, not symptom patching',
          'Actionable implementation playbook with owners and order',
        ],
        stack: ['Process Mapping', 'Ops Strategy', 'AI Readiness'],
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
    body: 'Like reviewing game tape, we study how work actually moves through your business. We listen first, map every bottleneck, and quantify where hours and revenue leak.',
    points: ['Discovery interviews', 'Workflow and funnel mapping', 'Bottleneck scoring'],
  },
  {
    n: '02',
    icon: BookOpen,
    title: 'The Playbook',
    tag: 'Architect',
    body: 'We design the plays: custom AI automations, Workspace restructuring and funnel fixes, sequenced by ROI so the fastest wins land first.',
    points: ['Automation blueprints', 'Funnel fix roadmap', 'ROI-ranked sequencing'],
  },
  {
    n: '03',
    icon: Rocket,
    title: 'The Execution',
    tag: 'Deploy',
    body: 'We run the drills with you. Hands-on deployment, team training inside your Workspace, and iteration until the new system runs without us.',
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
    <svg
      width={size}
      height={size}
      viewBox="-6 -6 62 82"
      aria-hidden="true"
      className="drop-shadow-[0_0_8px_rgba(6,182,212,0.7)]">
      {S_MATRIX.flatMap((row, y) =>
        row.split('').map((on, x) => (
          <circle
            key={`${x}-${y}`}
            cx={x * cell + 5}
            cy={y * cell + 5}
            r={on === '1' ? 3.6 : 1.4}
            fill={on === '1' ? '#e0f2fe' : '#0e7490'}
            opacity={on === '1' ? 1 : 0.45}
            className={on === '1' ? 'sp-pixel' : undefined}
            style={on === '1' ? { animationDelay: `${(x + y) * 120}ms` } : undefined}
          />
        )),
      )}
    </svg>
  );
}

function Logo({ onClick }) {
  return (
    <button onClick={onClick} className="group flex items-center gap-3 text-left" aria-label="Scrimmage Productions LLC, back to top">
      <span className="relative grid h-11 w-11 place-items-center rounded-xl border border-cyan-500/30 bg-[#06111a] shadow-[0_0_25px_rgba(6,182,212,0.25)] transition group-hover:border-cyan-400/60">
        <MatrixS size={30} />
      </span>
      <span className="leading-tight">
        <span className="block text-[15px] font-semibold tracking-tight text-slate-50">Scrimmage Productions</span>
        <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400/80">LLC · AI Ops & Strategy</span>
      </span>
    </button>
  );
}

function Eyebrow({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/5 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-300">
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </span>
  );
}

function SectionHeader({ eyebrow, icon, title, sub, center = true }) {
  return (
    <div className={`mb-12 max-w-3xl ${center ? 'mx-auto text-center' : ''}`}>
      <Eyebrow icon={icon}>{eyebrow}</Eyebrow>
      <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">{title}</h2>
      {sub && <p className="mt-4 text-base leading-relaxed text-slate-400 sm:text-lg">{sub}</p>}
    </div>
  );
}

function GlassCard({ className = '', children, ...rest }) {
  return (
    <div
      className={`rounded-2xl border border-cyan-500/20 bg-[rgba(13,26,38,0.7)] backdrop-blur-xl transition duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] ${className}`}
      {...rest}>
      {children}
    </div>
  );
}

function StackBadge({ children }) {
  return (
    <span className="rounded-md border border-sky-400/20 bg-sky-400/5 px-2 py-0.5 font-mono text-[10.5px] tracking-wide text-sky-300">
      {children}
    </span>
  );
}

function PrimaryButton({ children, className = '', ...rest }) {
  return (
    <button
      className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-400 px-5 py-3 text-sm font-semibold text-[#04090e] shadow-[0_0_25px_rgba(6,182,212,0.35)] transition hover:shadow-[0_0_40px_rgba(56,189,248,0.55)] hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#04090e] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...rest}>
      {children}
    </button>
  );
}

function GhostButton({ children, className = '', ...rest }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/5 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-400/60 hover:bg-cyan-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 ${className}`}
      {...rest}>
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Background                                                         */
/* ------------------------------------------------------------------ */

function OceanBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#04090e]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_15%_0%,rgba(6,182,212,0.08),transparent_60%),radial-gradient(ellipse_70%_50%_at_90%_30%,rgba(14,165,233,0.05),transparent_60%),linear-gradient(180deg,#04090e_0%,#08141e_55%,#04090e_100%)]" />
      {/* undulating silk */}
      <svg className="absolute bottom-0 left-0 h-[70vh] w-[200%] sp-silk opacity-60" viewBox="0 0 2400 600" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sp-silk-a" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0e7490" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#04090e" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="sp-silk-b" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0369a1" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#04090e" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 320 C 200 240 400 400 600 320 S 1000 240 1200 320 S 1600 400 1800 320 S 2200 240 2400 320 V600 H0Z"
          fill="url(#sp-silk-a)"
        />
        <path
          d="M0 400 C 250 330 450 470 700 400 S 1150 330 1200 400 S 1650 470 1900 400 S 2300 330 2400 400 V600 H0Z"
          fill="url(#sp-silk-b)"
        />
        <path
          d="M0 320 C 200 240 400 400 600 320 S 1000 240 1200 320 S 1600 400 1800 320 S 2200 240 2400 320"
          fill="none"
          stroke="#22d3ee"
          strokeOpacity="0.12"
        />
      </svg>
      {/* faint particle grid */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(224,242,254,0.06)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Navigation                                                         */
/* ------------------------------------------------------------------ */

function NavBar({ active }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-cyan-500/15 bg-[#04090e]/80 backdrop-blur-xl' : 'border-b border-transparent'
      }`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Logo onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.id}>
              <button
                onClick={() => go(l.id)}
                className={`relative rounded-lg px-3 py-2 text-sm transition ${
                  active === l.id ? 'text-cyan-300' : 'text-slate-400 hover:text-slate-100'
                }`}>
                {l.label}
                {active === l.id && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                )}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <PrimaryButton onClick={() => go('contact')} className="hidden px-4 py-2.5 sm:inline-flex">
            Book Strategy Audit
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </PrimaryButton>
          <button
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-lg border border-cyan-500/25 text-cyan-200 lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}>
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}
        aria-hidden={!open}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`}
        />
        <aside
          className={`absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col border-l border-cyan-500/20 bg-[#06111a]/95 p-6 backdrop-blur-xl transition-transform duration-300 ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}>
          <div className="mb-8 flex items-center justify-between">
            <MatrixS size={30} />
            <button
              onClick={() => setOpen(false)}
              className="grid h-10 w-10 place-items-center rounded-lg border border-cyan-500/25 text-cyan-200"
              aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>
          <ul className="space-y-1">
            {NAV_LINKS.map((l, i) => (
              <li key={l.id}>
                <button
                  onClick={() => go(l.id)}
                  className="flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-base text-slate-200 transition hover:bg-cyan-500/10 hover:text-cyan-200">
                  <span>
                    <span className="mr-3 font-mono text-xs text-cyan-500/70">0{i + 1}</span>
                    {l.label}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-cyan-500/60" />
                </button>
              </li>
            ))}
          </ul>
          <PrimaryButton onClick={() => go('contact')} className="mt-auto w-full">
            Book Strategy Audit <ArrowRight className="h-4 w-4" />
          </PrimaryButton>
          <a href={`mailto:${CONTACT_EMAIL}`} className="mt-4 text-center text-sm text-slate-400 hover:text-cyan-300">
            {CONTACT_EMAIL}
          </a>
        </aside>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                               */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-24 lg:pt-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <Eyebrow icon={Sparkles}>Business Consulting · AI Workflow Optimization</Eyebrow>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl xl:text-[68px]">
            <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-white bg-clip-text text-transparent">
              Precision Business Architecture.
            </span>
            <br />
            <span className="text-slate-50">Autonomous AI Workflows.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
            We run the drills that eliminate operational waste. Scrimmage Productions automates your Google Workspace,
            inbox and document flow with tailored AI, then pairs it with executive diagnostic consulting that finds the
            root cause behind the friction, not just the symptom.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <PrimaryButton onClick={() => scrollToId('contact')} className="px-6 py-3.5 text-[15px]">
              Schedule Diagnostic Session
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </PrimaryButton>
            <GhostButton onClick={() => scrollToId('services')} className="px-6 py-3.5 text-[15px]">
              Explore Automation Playbooks
            </GhostButton>
          </div>

          <dl className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {HERO_METRICS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="rounded-xl border border-cyan-500/15 bg-[rgba(13,26,38,0.55)] px-4 py-3 backdrop-blur-xl">
                <dt className="flex items-center gap-2 text-lg font-semibold text-slate-50">
                  <Icon className="h-4 w-4 text-emerald-400" />
                  {value}
                </dt>
                <dd className="mt-0.5 text-xs text-slate-400">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <HeroConsole />
      </div>

      {/* Ticker */}
      <div className="relative mx-auto mt-16 max-w-7xl overflow-hidden rounded-xl border border-cyan-500/15 bg-[#06111a]/70 py-3 backdrop-blur-xl [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        <div className="sp-marquee flex w-max gap-10 whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
            <span key={i} className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-slate-400">
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function HeroConsole() {
  const lines = [
    { icon: Inbox, text: '142 inbound threads triaged', tone: 'text-cyan-300' },
    { icon: Shield, text: '37 overshared files locked down', tone: 'text-sky-300' },
    { icon: FileText, text: 'Proposal generated · 00:41s', tone: 'text-cyan-300' },
    { icon: TrendingUp, text: 'Funnel leak patched · Stage 3', tone: 'text-emerald-400' },
  ];
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((n) => (n + 1) % lines.length), 2200);
    return () => clearInterval(t);
  }, [lines.length]);

  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="absolute -inset-6 rounded-[32px] bg-cyan-500/10 blur-3xl" aria-hidden="true" />
      <GlassCard className="relative overflow-hidden p-6 shadow-[0_0_25px_rgba(6,182,212,0.25)]">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-400/80">Ops Console · Sample run</span>
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> live demo
          </span>
        </div>

        <div className="my-8 flex justify-center">
          <div className="relative grid h-36 w-36 place-items-center rounded-3xl border border-cyan-500/25 bg-[#04090e]/80 shadow-[0_0_60px_rgba(6,182,212,0.25)]">
            <MatrixS size={96} />
          </div>
        </div>

        <ul className="space-y-2">
          {lines.map(({ icon: Icon, text, tone }, i) => (
            <li
              key={text}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-all duration-500 ${
                i === tick
                  ? 'border-cyan-400/40 bg-cyan-500/10 text-slate-50'
                  : 'border-transparent bg-white/[0.02] text-slate-400'
              }`}>
              <Icon className={`h-4 w-4 shrink-0 ${i === tick ? tone : 'text-slate-500'}`} />
              <span className="truncate">{text}</span>
              {i === tick && <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-emerald-400" />}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-[11px] text-slate-500">Illustrative automation events. Your results depend on your stack and volume.</p>
      </GlassCard>
    </div>
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
    <section id="diagnostic" className="scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Operational Friction Diagnostic"
          icon={Gauge}
          title="What is slowing your team down the most?"
          sub="Pick your biggest bottleneck. You will see the play we would run, and a rough estimate of the hours it gives back."
        />

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Options */}
          <div role="radiogroup" aria-label="Biggest bottleneck" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
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
                  className={`group flex items-start gap-4 rounded-2xl border p-4 text-left backdrop-blur-xl transition sm:p-5 ${
                    on
                      ? 'border-cyan-400/60 bg-cyan-500/10 shadow-[0_0_25px_rgba(6,182,212,0.25)]'
                      : 'border-cyan-500/15 bg-[rgba(13,26,38,0.6)] hover:border-cyan-400/40'
                  }`}>
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition ${
                      on ? 'border-cyan-300/50 bg-cyan-400/20 text-cyan-200' : 'border-cyan-500/20 text-cyan-400'
                    }`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="block font-semibold text-slate-100">{opt.label}</span>
                    <span className="mt-1 block text-sm leading-snug text-slate-400">{opt.symptom}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Result */}
          <GlassCard key={b.id} className="sp-fade-in flex flex-col p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-400/80">Your Scrimmage Solution</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                <TrendingUp className="h-3.5 w-3.5" /> ROI positive
              </span>
            </div>
            <h3 className="mt-4 text-2xl font-semibold text-slate-50">{b.play}</h3>

            <ul className="mt-5 space-y-3">
              {b.steps.map((s) => (
                <li key={s} className="flex gap-3 text-slate-300">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan-400" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7">
              <label htmlFor="team" className="flex items-center justify-between text-sm text-slate-400">
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-cyan-400" /> People affected
                </span>
                <span className="font-mono text-cyan-200">{team}</span>
              </label>
              <input
                id="team"
                type="range"
                min={1}
                max={25}
                value={team}
                onChange={(e) => setTeam(Number(e.target.value))}
                className="sp-range mt-3 w-full"
              />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                <p className="text-xs text-slate-400">Est. hours reclaimed / week</p>
                <p className="mt-1 text-3xl font-semibold text-emerald-300">~{weekly}</p>
              </div>
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                <p className="text-xs text-slate-400">Est. hours reclaimed / year</p>
                <p className="mt-1 text-3xl font-semibold text-emerald-300">~{yearly.toLocaleString()}</p>
              </div>
            </div>
            <p className="mt-3 flex items-start gap-2 text-sm text-slate-400">
              <DollarSign className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              {b.revenue}
            </p>

            <div className="mt-5 flex flex-wrap gap-1.5">
              {b.stack.map((s) => (
                <StackBadge key={s}>{s}</StackBadge>
              ))}
            </div>

            <div className="mt-8 border-t border-cyan-500/15 pt-6">
              {status === 'success' || status === 'fallback' ? (
                <div className="sp-fade-in flex items-start gap-3 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-200">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>
                    {status === 'success'
                      ? 'Preview sent. We will follow up with your full audit outline within one business day.'
                      : 'Your email app opened with the preview pre-filled. Hit send and we will take it from there.'}
                  </span>
                </div>
              ) : (
                <form onSubmit={send} noValidate>
                  <label htmlFor="diag-email" className="text-sm font-medium text-slate-200">
                    Send this audit preview to your inbox
                  </label>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    <input
                      id="diag-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      aria-invalid={status === 'error'}
                      className="sp-input flex-1"
                    />
                    <PrimaryButton type="submit" disabled={status === 'loading'}>
                      {status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      Send my audit
                    </PrimaryButton>
                  </div>
                  {status === 'error' && (
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-rose-300">
                      <AlertTriangle className="h-4 w-4" /> {error}
                    </p>
                  )}
                </form>
              )}
              <button
                onClick={() => onRequest(b.interest, `My biggest bottleneck is ${b.label.toLowerCase()}. ${b.symptom}`)}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-cyan-300 hover:text-cyan-200">
                Or book a full diagnostic session <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Services                                                           */
/* ------------------------------------------------------------------ */

function Services({ onRequest }) {
  const [tab, setTab] = useState('ai');
  const pillar = SERVICES[tab];

  return (
    <section id="services" className="scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Services"
          icon={Layers}
          title="Two pillars. One operating system for your business."
          sub="Automate the repetitive work, and fix the strategy behind it. Most clients start with one pillar and add the other once the first wins land."
        />

        <div role="tablist" aria-label="Service pillars" className="mx-auto mb-10 flex w-full max-w-xl rounded-2xl border border-cyan-500/20 bg-[#06111a]/80 p-1.5 backdrop-blur-xl">
          {Object.entries(SERVICES).map(([key, p]) => {
            const Icon = p.icon;
            const on = key === tab;
            return (
              <button
                key={key}
                role="tab"
                aria-selected={on}
                onClick={() => setTab(key)}
                className={`flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                  on
                    ? 'bg-gradient-to-r from-cyan-500/90 to-sky-400/90 text-[#04090e] shadow-[0_0_25px_rgba(6,182,212,0.35)]'
                    : 'text-slate-400 hover:text-slate-100'
                }`}>
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate sm:hidden">{p.short}</span>
                <span className="hidden truncate sm:inline">{p.label}</span>
              </button>
            );
          })}
        </div>

        <p className="mb-8 text-center text-slate-400">{pillar.blurb}</p>

        <div key={tab} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pillar.cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <GlassCard
                key={c.title}
                className="sp-fade-in group flex flex-col p-6 sm:p-7"
                style={{ animationDelay: `${i * 80}ms` }}>
                <span className="grid h-12 w-12 place-items-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 transition group-hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-xl font-semibold text-slate-50">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{c.summary}</p>

                <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-400/70">Deliverables</p>
                <ul className="mt-3 space-y-2.5">
                  {c.deliverables.map((d) => (
                    <li key={d} className="flex gap-2.5 text-sm text-slate-300">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                      {d}
                    </li>
                  ))}
                </ul>

                <div className="mb-7 mt-6 flex flex-wrap gap-1.5">
                  {c.stack.map((s) => (
                    <StackBadge key={s}>{s}</StackBadge>
                  ))}
                </div>

                <button
                  onClick={() => onRequest(c.interest, `I'm interested in: ${c.title}.`)}
                  className="mt-auto flex items-center justify-between gap-2 border-t border-cyan-500/15 pt-5 text-sm font-semibold text-cyan-300 transition hover:text-cyan-100">
                  Request Audit
                  <span className="grid h-8 w-8 place-items-center rounded-lg border border-cyan-500/30 transition group-hover:border-cyan-300/60 group-hover:bg-cyan-500/15">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
              </GlassCard>
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
    <section id="playbook" className="scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="The Scrimmage Method"
          icon={BookOpen}
          title="Film. Playbook. Execution."
          sub="Every engagement runs the same three-phase drill, so you always know what happens next and why."
        />

        <ol className="relative grid gap-6 lg:grid-cols-3">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-[52px] hidden h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent lg:block"
          />
          {METHOD_STEPS.map(({ n, icon: Icon, title, tag, body, points }) => (
            <li key={n} className="relative">
              <GlassCard className="h-full p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="relative grid h-14 w-14 place-items-center rounded-2xl border border-cyan-400/40 bg-[#04090e] text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.3)]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="bg-gradient-to-b from-cyan-200/50 to-transparent bg-clip-text font-mono text-5xl font-bold text-transparent">
                    {n}
                  </span>
                </div>
                <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-400/80">Step {n.slice(1)} · {tag}</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-50">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">{body}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {points.map((p) => (
                    <li key={p} className="rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 text-xs text-cyan-100">
                      {p}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </li>
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

function Slider({ id, label, icon: Icon, value, min, max, step = 1, onChange, format = (v) => v }) {
  return (
    <div>
      <label htmlFor={id} className="flex items-center justify-between gap-3 text-sm text-slate-300">
        <span className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-cyan-400" />
          {label}
        </span>
        <span className="rounded-md border border-cyan-500/25 bg-cyan-500/10 px-2 py-0.5 font-mono text-cyan-100">{format(value)}</span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="sp-range mt-3 w-full"
      />
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
    <section id="roi" className="scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="ROI Calculator"
          icon={Calculator}
          title="What is manual work really costing you?"
          sub="Move the sliders to match your team. We assume automation recovers about 60% of repetitive hours, a conservative starting point we refine during the Film Room."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <GlassCard className="space-y-8 p-6 sm:p-8">
            <Slider id="roi-people" label="Team members doing repetitive work" icon={Users} value={people} min={1} max={50} onChange={setPeople} />
            <Slider
              id="roi-hours"
              label="Manual hours per person, per week"
              icon={Clock}
              value={hours}
              min={1}
              max={30}
              onChange={setHours}
              format={(v) => `${v} hrs`}
            />
            <Slider
              id="roi-rate"
              label="Loaded hourly cost per person"
              icon={DollarSign}
              value={rate}
              min={20}
              max={250}
              step={5}
              onChange={setRate}
              format={(v) => `$${v}`}
            />
            <p className="flex items-start gap-2 rounded-xl border border-cyan-500/15 bg-[#04090e]/60 p-4 text-xs leading-relaxed text-slate-400">
              <Lock className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
              Calculated in your browser. Nothing you enter here is stored or sent anywhere.
            </p>
          </GlassCard>

          <GlassCard className="flex flex-col p-6 sm:p-8">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-400/80">Estimated annual value recovered</span>
            <p className="mt-3 bg-gradient-to-r from-emerald-300 to-cyan-200 bg-clip-text text-5xl font-semibold tracking-tight text-transparent sm:text-6xl">
              {fmtMoney(r.annualValue)}
            </p>
            <div className="mt-5 h-2 overflow-hidden rounded-full bg-cyan-500/10" aria-hidden="true">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.6)] transition-all duration-500"
                style={{ width: `${Math.max(pct, 3)}%` }}
              />
            </div>

            <dl className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { label: 'Hours back / week', value: Math.round(r.weeklyHours).toLocaleString(), icon: Clock },
                { label: 'Hours back / year', value: Math.round(r.annualHours).toLocaleString(), icon: BarChart3 },
                { label: 'Full-time equivalents', value: r.fte.toFixed(1), icon: Users },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                  <dt className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Icon className="h-3.5 w-3.5 text-emerald-400" />
                    {label}
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold text-emerald-300">{value}</dd>
                </div>
              ))}
            </dl>

            <p className="mb-8 mt-6 text-sm text-slate-400">
              That is capacity you can redirect to sales, delivery and strategy, without adding headcount.
            </p>
            <PrimaryButton onClick={() => scrollToId('contact')} className="mt-auto w-full">
              Validate these numbers in a Strategy Audit <ArrowRight className="h-4 w-4" />
            </PrimaryButton>
          </GlassCard>
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
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-200">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-300">
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

  const inputCls = (k) => `sp-input w-full ${errors[k] ? '!border-rose-400/60' : ''}`;

  return (
    <section id="contact" className="scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHeader
            center={false}
            eyebrow="Book a Strategy Audit"
            icon={Mail}
            title="Tell us where it hurts. We will bring the playbook."
            sub="Every engagement starts with listening. Share your operational challenges and we will come back within one business day with next steps."
          />
          <ul className="space-y-4">
            {[
              { icon: Ear, title: 'Listen first', body: 'A focused session on your goals, tools and team, before any recommendation.' },
              { icon: Search, title: 'Root cause, not symptoms', body: 'We trace friction to its source so fixes stick.' },
              { icon: Shield, title: 'Confidential by default', body: 'Your workflows and data stay between us.' },
            ].map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-cyan-500/25 bg-cyan-500/10 text-cyan-300">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-semibold text-slate-100">{title}</span>
                  <span className="text-sm text-slate-400">{body}</span>
                </span>
              </li>
            ))}
          </ul>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-8 inline-flex items-center gap-2 rounded-xl border border-cyan-500/25 bg-cyan-500/5 px-4 py-3 text-sm text-cyan-200 transition hover:border-cyan-400/60">
            <Mail className="h-4 w-4" /> {CONTACT_EMAIL}
          </a>
        </div>

        <GlassCard className="relative p-6 sm:p-8">
          {status === 'success' || status === 'fallback' ? (
            <div className="sp-fade-in flex min-h-[420px] flex-col items-center justify-center text-center">
              <span className="sp-pop grid h-20 w-20 place-items-center rounded-full border border-emerald-400/40 bg-emerald-400/10 shadow-[0_0_40px_rgba(16,185,129,0.35)]">
                <CheckCircle2 className="h-10 w-10 text-emerald-300" />
              </span>
              <h3 className="mt-6 text-2xl font-semibold text-slate-50">
                {status === 'success' ? 'Message received.' : 'Almost there.'}
              </h3>
              <p className="mt-3 max-w-sm text-slate-400">
                {status === 'success'
                  ? 'Your request is in our inbox. Expect a reply within one business day with times for your Strategy Audit.'
                  : 'Your email app opened with everything pre-filled. Hit send and we will reply within one business day.'}
              </p>
              <GhostButton onClick={() => setStatus('idle')} className="mt-8">
                Send another message
              </GhostButton>
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
                  className={`${inputCls('interest')} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2216%22 height=%2216%22 fill=%22none%22 stroke=%22%2367e8f9%22 stroke-width=%222%22><path d=%22M4 6l4 4 4-4%22/></svg>')] bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-10`}>
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
                <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    {serverError} Your message was not sent. Try again, or email us directly with the button below.
                  </span>
                </div>
              )}

              <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                <PrimaryButton type="submit" disabled={status === 'loading'} className="flex-1 py-3.5">
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      Book Strategy Audit <Send className="h-4 w-4" />
                    </>
                  )}
                </PrimaryButton>
                <a
                  href={buildMailto(mailSubject, mailBody)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/5 px-5 py-3.5 text-sm font-semibold text-cyan-100 transition hover:border-cyan-400/60 hover:bg-cyan-500/10">
                  <Mail className="h-4 w-4" /> Email us directly
                </a>
              </div>
              <p className="text-xs text-slate-500">
                We only use your details to respond to this request. No newsletters, no list selling.
              </p>
            </form>
          )}
        </GlassCard>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

function Footer() {
  const [legal, setLegal] = useState(null);
  return (
    <footer className="border-t border-cyan-500/15 bg-[#04090e]/80 px-4 pb-10 pt-14 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-slate-400">
              Precision business architecture and autonomous AI workflows. We find the friction, run the drills, and give
              your team its hours back.
            </p>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-400/80">Navigate</p>
            <ul className="mt-4 space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.id}>
                  <button onClick={() => scrollToId(l.id)} className="text-sm text-slate-400 transition hover:text-cyan-300">
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-cyan-400/80">Contact</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-4 flex items-center gap-2 break-all text-sm text-slate-300 transition hover:text-cyan-300">
              <Mail className="h-4 w-4 shrink-0 text-cyan-400" /> {CONTACT_EMAIL}
            </a>
            <PrimaryButton onClick={() => scrollToId('contact')} className="mt-5 px-4 py-2.5">
              Book Strategy Audit <ArrowRight className="h-4 w-4" />
            </PrimaryButton>
          </div>
        </div>

        {legal && (
          <div className="sp-fade-in mt-10 rounded-xl border border-cyan-500/15 bg-[rgba(13,26,38,0.7)] p-5 text-sm leading-relaxed text-slate-400">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold text-slate-200">{legal === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}</span>
              <button onClick={() => setLegal(null)} aria-label="Close" className="text-slate-500 hover:text-slate-200">
                <X className="h-4 w-4" />
              </button>
            </div>
            {legal === 'privacy'
              ? 'We collect only what you submit through our forms (name, email, company and message) and use it solely to respond to your inquiry. We do not sell or share your information. Contact us to request deletion at any time.'
              : 'Content on this site is provided for general information and does not constitute a binding offer. Engagements are governed by a separate written agreement between your organization and Scrimmage Productions LLC.'}
          </div>
        )}

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-cyan-500/10 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p>© 2026 Scrimmage Productions LLC. All Rights Reserved.</p>
          <div className="flex gap-5">
            <button onClick={() => setLegal('privacy')} className="hover:text-cyan-300">
              Privacy Policy
            </button>
            <button onClick={() => setLegal('terms')} className="hover:text-cyan-300">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Global styles (keyframes + form controls)                          */
/* ------------------------------------------------------------------ */

const GLOBAL_CSS = `
  html { scroll-behavior: smooth; }
  body { background: #04090e; }
  @keyframes sp-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @keyframes sp-silk { 0%,100% { transform: translateX(0) scaleY(1); } 50% { transform: translateX(-25%) scaleY(1.08); } }
  @keyframes sp-pixel { 0%,100% { opacity: 1; } 50% { opacity: .55; } }
  @keyframes sp-fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
  @keyframes sp-pop { 0% { transform: scale(.6); opacity: 0; } 60% { transform: scale(1.08); opacity: 1; } 100% { transform: scale(1); } }
  .sp-marquee { animation: sp-marquee 40s linear infinite; }
  .sp-silk { animation: sp-silk 22s ease-in-out infinite; transform-origin: bottom; }
  .sp-pixel { animation: sp-pixel 2.4s ease-in-out infinite; }
  .sp-fade-in { animation: sp-fade-in .45s ease-out both; }
  .sp-pop { animation: sp-pop .5s cubic-bezier(.2,.9,.3,1.3) both; }
  .sp-input {
    border-radius: .75rem; border: 1px solid rgba(6,182,212,.22); background: rgba(4,9,14,.7);
    padding: .75rem 1rem; color: #f8fafc; font-size: .9rem; outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  .sp-input::placeholder { color: #475569; }
  .sp-input:focus { border-color: rgba(34,211,238,.7); box-shadow: 0 0 0 3px rgba(6,182,212,.18), 0 0 20px rgba(6,182,212,.15); }
  .sp-input option { background: #08141e; color: #f8fafc; }
  .sp-range { -webkit-appearance: none; appearance: none; height: 6px; border-radius: 999px; background: rgba(6,182,212,.18); outline: none; }
  .sp-range::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 999px; background: #e0f2fe; border: 3px solid #06b6d4; box-shadow: 0 0 14px rgba(6,182,212,.8); cursor: pointer; }
  .sp-range::-moz-range-thumb { width: 16px; height: 16px; border-radius: 999px; background: #e0f2fe; border: 3px solid #06b6d4; box-shadow: 0 0 14px rgba(6,182,212,.8); cursor: pointer; }
  .sp-range:focus-visible::-webkit-slider-thumb { outline: 2px solid #38bdf8; outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    .sp-marquee, .sp-silk, .sp-pixel, .sp-fade-in, .sp-pop { animation: none !important; }
  }
`;

/* ------------------------------------------------------------------ */
/*  App                                                                */
/* ------------------------------------------------------------------ */

export default function App() {
  const [active, setActive] = useState('');
  const [prefill, setPrefill] = useState(null);

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
    <div className="relative min-h-screen font-sans text-slate-400 antialiased selection:bg-cyan-400/30 selection:text-white">
      <style>{GLOBAL_CSS}</style>
      <OceanBackdrop />
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
  );
}
