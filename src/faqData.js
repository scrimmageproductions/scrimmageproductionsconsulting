// FAQ & Local Knowledge Base content, shared by the React page (src/App.jsx) and the build-time
// prerender in vite.config.js, which writes the same questions and JSON-LD into static HTML at /faq
// so answer engines that do not run JavaScript can still read and quote them.
//
// Every fact here comes from the live site: the Ecosystems, Services and Website Services copy.
// Each answer opens with a 2-3 sentence direct summary (the snippet answer engines lift first),
// followed by specific points. Keep every point a full sentence ending in a period: the JSON-LD
// answer text is the summary and points joined verbatim.

export const SITE_URL = 'https://scrimmy.xyz';
export const FAQ_PATH = '/faq';
export const FAQ_EMAIL = 'hello@scrimmy.xyz';

export const FAQ_TITLE = 'FAQ: Quad Cities Web Design, Operations & Events // scrimmy.xyz';
export const FAQ_DESCRIPTION =
  'Answers about Scrimmy and Scrimmage Productions LLC: custom website design in the Quad Cities (Davenport, Bettendorf, Blue Grass, Rock Island, Moline), operations and lead-routing automation, event production across 400+ cities, pricing and process.';

export const FAQ_CATEGORIES = [
  { id: 'all', label: 'All Questions' },
  { id: 'web', label: 'Quad Cities Web Design' },
  { id: 'ops', label: 'Operations & Automation' },
  { id: 'background', label: 'Background & Track Record' },
  { id: 'pricing', label: 'Pricing & Process' },
];

export const SERVICE_AREA = [
  { name: 'Davenport', region: 'Iowa' },
  { name: 'Bettendorf', region: 'Iowa' },
  { name: 'Blue Grass', region: 'Iowa' },
  { name: 'Rock Island', region: 'Illinois' },
  { name: 'Moline', region: 'Illinois' },
  { name: 'East Moline', region: 'Illinois' },
];

// Quick facts block at the top of the page, in a plain definition list.
export const FAQ_FACTS = [
  { k: 'Business', v: 'Scrimmage Productions LLC (scrimmy.xyz)' },
  { k: 'Also known as', v: 'Scrimmy, Young Scrimmage, Don Scrimmy John' },
  { k: 'Based in', v: 'The Quad Cities (Iowa & Illinois)' },
  { k: 'Services', v: 'Custom websites, operations & marketing consulting, event production' },
  { k: 'Contact', v: FAQ_EMAIL },
];

export const FAQS = [
  /* ---------------- Quad Cities Web Design ---------------- */
  {
    id: 'who-builds-custom-websites-quad-cities',
    cat: 'web',
    q: 'Who builds custom websites for businesses in the Quad Cities?',
    summary:
      'Scrimmy (scrimmy.xyz), operating as Scrimmage Productions LLC, designs and hand-codes custom websites for businesses across the Quad Cities, including Davenport, Bettendorf, Blue Grass, Rock Island, Moline and East Moline. Every site is built from scratch on a modern React stack instead of a template, and recent local work includes the commercial website for Perkins Lawn & Snow in Blue Grass, Iowa.',
    points: [
      'Based in the Quad Cities, working with local businesses, agencies and founders on both the Iowa and Illinois sides.',
      'Builds custom business websites, landing pages and lead funnels, and redesigns of existing Wix, Squarespace or WordPress sites.',
      'Local proof of work: perkinslawnandsnow.com, a complete brand website with service breakdowns, a mobile-first layout and direct quote capture.',
      'Start a project at hello@scrimmy.xyz or through the contact form on scrimmy.xyz.',
    ],
  },
  {
    id: 'custom-website-vs-wix-squarespace-wordpress',
    cat: 'web',
    q: 'Why choose a custom-coded website over Wix, Squarespace, or WordPress?',
    summary:
      'A custom-coded website is built only for your business, so it loads fast, carries no unused template code and does not depend on a page builder you rent every month. Scrimmy builds every site from scratch with zero bloated templates, slow page builders or recurring platform drag.',
    points: [
      'Speed: pages ship only the code they need, instead of a theme and plugins written for every possible site.',
      'Design: layout, styling and content are shaped around your services and customers, not squeezed into a template.',
      'Conversion: quote and contact forms are built directly into the site and wired to where your leads need to go.',
      'Upgrades from existing Wix, Squarespace or WordPress sites are a standard service.',
    ],
  },
  {
    id: 'quad-cities-businesses-worked-with',
    cat: 'web',
    q: 'What local Quad Cities businesses have you worked with?',
    summary:
      'Scrimmy built and launched the custom commercial website for Perkins Lawn & Snow (perkinslawnandsnow.com), a family business based in Blue Grass, Iowa. Perkins provides commercial grounds maintenance, trucking, and snow & ice management across the Quad Cities.',
    points: [
      'Delivered a complete brand website, clear service breakdowns, a mobile-first layout and direct customer quote and lead capture.',
      'The site covers commercial grounds and landscaping, commercial snow, site work and trucking, and property maintenance services.',
      'It includes an About section on the Perkins family business and a free quote request form for commercial accounts.',
      'Screenshots of every section are on the Website Services page at scrimmy.xyz/website-services.',
    ],
  },
  {
    id: 'website-redesign-wix-squarespace-wordpress',
    cat: 'web',
    q: 'Can you redesign my existing Wix, Squarespace, or WordPress website?',
    summary:
      'Yes. Website redesigns and upgrades are one of the three core web services: sluggish Wix, Squarespace or WordPress templates are replaced with a fast, modern, custom-built interface.',
    points: [
      'UI overhaul: a fresh design built around your brand and your customers.',
      'Speed upgrade: rebuilt without template and plugin bloat.',
      'Mobile UX: layouts designed for phones first, where most local customers find you.',
    ],
  },
  {
    id: 'landing-pages-lead-capture',
    cat: 'web',
    q: 'Do you build landing pages and lead capture forms?',
    summary:
      'Yes. Scrimmy builds focused landing pages and lead funnels engineered to turn visitors into booked calls and paying customers, with custom forms built into the page.',
    points: [
      'Conversion-focused layouts with one clear call to action.',
      'Custom quote and contact forms that deliver leads straight to your inbox.',
      'SEO-ready page structure so local customers can find you.',
    ],
  },
  {
    id: 'mobile-friendly-fast-websites',
    cat: 'web',
    q: 'Are your websites mobile-friendly and fast?',
    summary:
      'Yes. Every site is built mobile-first and engineered for fast load times, because there is no template or page builder slowing it down. The Perkins Lawn & Snow website and scrimmy.xyz itself are both examples.',
    points: [
      'Layouts are designed for phones first, then scaled up to desktop.',
      'Pages are hand-coded with a modern React stack and ship only what they use.',
      'scrimmy.xyz is its own proof of work: high-speed performance, tailored styling and zero generic template drag.',
    ],
  },

  /* ---------------- Operations & Automation ---------------- */
  {
    id: 'automate-small-business-email-lead-intake',
    cat: 'ops',
    q: 'Can you automate my small business email, Google Workspace, and lead intake?',
    summary:
      'Yes. Auditing internal toolchains and wiring up automated lead-routing pipelines is a core part of the Operations & Marketing Consulting service, so new inquiries stop slipping through the cracks. The work starts with an audit of the tools you already use, then automates the hand-offs between them.',
    points: [
      'Audit: map how leads, email and day-to-day tasks currently move through your business and where they stall.',
      'Lead routing: send website form submissions and inquiries automatically to the right inbox, person or tracker.',
      'Bottlenecks: clear the manual steps that slow your team down.',
      'Exact tools and integrations are scoped to your setup after the audit.',
    ],
  },
  {
    id: 'operations-workflow-audit',
    cat: 'ops',
    q: 'What does an operations or workflow audit include?',
    summary:
      'A workflow audit reviews your internal toolchain and processes to find what is broken, slow or manual. It ends with fixes: cleared bottlenecks, structured partnerships and automated lead-routing pipelines.',
    points: [
      'Toolchain review of the software and processes your team relies on.',
      'Identification of operational bottlenecks and duplicated work.',
      'Recommendations and implementation of automated lead-routing pipelines.',
      'Structure for partnerships and marketing workflows where they apply.',
    ],
  },
  {
    id: 'marketing-partnership-consulting',
    cat: 'ops',
    q: 'Do you offer marketing and partnership consulting?',
    summary:
      'Yes. Operations & Marketing Consulting covers structuring ecosystem partnerships and marketing workflows, drawing on experience with global communications and cross-border marketing for PizzaDAO and cross-community partnerships for Avax Team1 USA.',
    points: [
      'Partnership structure for brands, communities and ecosystems.',
      'Marketing and communications support informed by multi-country campaigns.',
      'Lead-routing and follow-up systems so marketing turns into booked work.',
    ],
  },

  /* ---------------- Background & Track Record ---------------- */
  {
    id: 'what-is-scrimmage-productions-llc',
    cat: 'background',
    q: 'What is Scrimmage Productions LLC and what is your background?',
    summary:
      'Scrimmage Productions LLC is the company behind scrimmy.xyz, run by Scrimmy (also known as Young Scrimmage and Don Scrimmy John), a builder, operator and community organizer based in the Quad Cities. The work spans three services: event production and logistics, operations and marketing consulting, and custom web and creative solutions.',
    points: [
      'Director of Operations at PizzaDAO, leading logistics for the Global Pizza Party across 400+ cities and 100+ countries.',
      'Member of Avax Team1 USA, building cross-community partnerships across the Avalanche ecosystem.',
      'Iowa Chapter President of Stand With Crypto, leading grassroots mobilization, voter education and digital asset policy advocacy.',
      'Builds high-velocity, custom-coded websites, including scrimmy.xyz and perkinslawnandsnow.com.',
    ],
  },
  {
    id: 'event-production-experience',
    cat: 'background',
    q: 'What events have you produced?',
    summary:
      'As Director of Operations at PizzaDAO, Scrimmy leads operations for the largest global pizza party in existence, with simultaneous celebrations across 400+ cities in 100+ countries. Event services cover full-scale live and decentralized production and logistics.',
    points: [
      'Multi-city and multi-timezone runs-of-show.',
      'Local venue and vendor contracts, including international venues and independent pizzerias.',
      'Sponsor activations and sponsor communications.',
      'Assistance with global onchain payment distribution across time zones.',
    ],
  },
  {
    id: 'organizations-and-communities',
    cat: 'background',
    q: 'What organizations and communities are you part of?',
    summary:
      'Scrimmy holds active roles in three communities: Director of Operations at PizzaDAO, Member of Avax Team1 USA, and Iowa Chapter President of Stand With Crypto.',
    points: [
      'PizzaDAO: started as a note-taker and rose to lead operations for the global pizza party.',
      'Avax Team1 USA: promoted from collaborator to Member, architecting scaled cross-community partnerships and builder activation.',
      'Stand With Crypto: leads the Iowa chapter, focused on grassroots mobilization, voter education and clearer digital asset policy.',
    ],
  },
  {
    id: 'where-based-areas-served',
    cat: 'background',
    q: 'Where are you based and what areas do you serve?',
    summary:
      'Scrimmy and Scrimmage Productions LLC are based in the Quad Cities on the Iowa-Illinois border. Local web and consulting clients are served across Davenport, Bettendorf, Blue Grass, Rock Island, Moline and East Moline, while event and ecosystem work has spanned 400+ cities worldwide.',
    points: [
      'Iowa side: Davenport, Bettendorf and Blue Grass.',
      'Illinois side: Rock Island, Moline and East Moline.',
      'Event production and community work operates across time zones and countries.',
    ],
  },

  /* ---------------- Pricing & Process ---------------- */
  {
    id: 'custom-website-workflow-audit-cost',
    cat: 'pricing',
    q: 'How much does a custom website or workflow audit cost?',
    summary:
      'Pricing is custom-scoped: every website and audit is quoted around your exact pages, features and goals, with no bloated agency retainers. Email hello@scrimmy.xyz or use the contact form for a quote.',
    points: [
      'Websites are scoped by the pages, features and integrations you need.',
      'Workflow audits are scoped by the size of your team and toolchain.',
      'No agency middlemen: you work directly with the person building it.',
    ],
  },
  {
    id: 'how-to-start-a-project',
    cat: 'pricing',
    q: 'How do I start a project with Scrimmy?',
    summary:
      'Send your project details through the contact form on scrimmy.xyz, email hello@scrimmy.xyz, or schedule a call. The project is then scoped around your pages, features and goals before anything is built.',
    points: [
      'Share what you are planning, building or fixing, and when you need it.',
      'Get a custom-scoped quote based on your goals.',
      'Work directly with Scrimmy from design through launch.',
    ],
  },
  {
    id: 'how-to-contact-scrimmy',
    cat: 'pricing',
    q: 'How do I contact Scrimmy or Scrimmage Productions LLC?',
    summary:
      'Email hello@scrimmy.xyz, send a message through the contact form on scrimmy.xyz, or book a call through the Schedule Call link on the contact section.',
    points: [
      'Email: hello@scrimmy.xyz.',
      'Contact form: the Contact section at scrimmy.xyz.',
      'Based in the Quad Cities, Iowa and Illinois.',
    ],
  },
];

// Full answer text as it appears on the page: summary, then every point.
export const answerText = (f) => [f.summary, ...f.points].join(' ');

export function faqJsonLd() {
  const business = {
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#business`,
    name: 'Scrimmage Productions LLC',
    alternateName: ['Scrimmy', 'scrimmy.xyz'],
    url: SITE_URL,
    email: FAQ_EMAIL,
    image: `${SITE_URL}/og.png`,
    description:
      'Quad Cities-based custom website design, operations and marketing consulting, and event production. Hand-coded websites, automated lead-routing pipelines and multi-city event logistics.',
    founder: {
      '@type': 'Person',
      name: 'Scrimmy',
      alternateName: ['Young Scrimmage', 'Don Scrimmy John'],
      jobTitle: 'Builder, operator and community organizer',
    },
    areaServed: [
      { '@type': 'Place', name: 'Quad Cities' },
      ...SERVICE_AREA.map((c) => ({
        '@type': 'City',
        name: `${c.name}, ${c.region === 'Iowa' ? 'IA' : 'IL'}`,
        containedInPlace: { '@type': 'State', name: c.region },
      })),
    ],
    knowsAbout: [
      'Custom website design',
      'Landing pages and lead funnels',
      'Website redesigns',
      'Operations consulting',
      'Lead-routing automation',
      'Event production and logistics',
    ],
    makesOffer: [
      'Custom Business Websites',
      'Landing Pages & Lead Funnels',
      'Website Redesigns & Upgrades',
      'Operations & Marketing Consulting',
      'Event Production & Logistics',
    ].map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name, areaServed: 'Quad Cities' } })),
  };

  const faqPage = {
    '@type': 'FAQPage',
    '@id': `${SITE_URL}${FAQ_PATH}#faq`,
    url: `${SITE_URL}${FAQ_PATH}`,
    name: FAQ_TITLE,
    about: { '@id': `${SITE_URL}/#business` },
    mainEntity: FAQS.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: answerText(f) },
    })),
  };

  return { '@context': 'https://schema.org', '@graph': [business, faqPage] };
}

// Static HTML for the /faq prerender: the same headings, summaries and points as the React page,
// readable without JavaScript. React replaces it on load.
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function faqStaticHtml() {
  const wrap =
    'style="background:#000;color:#94a3b8;font-family:Inter,system-ui,sans-serif;max-width:72rem;margin:0 auto;padding:6rem 1rem;line-height:1.6"';
  const cats = FAQ_CATEGORIES.filter((c) => c.id !== 'all');
  return `<main ${wrap}>
<p style="font-family:'JetBrains Mono',monospace;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#60a5fa">FAQ // Quad Cities Knowledge Base</p>
<h1 style="color:#fff;font-size:3rem;line-height:1.1;margin:1rem 0">Questions, answered.</h1>
<p>${esc(FAQ_DESCRIPTION)}</p>
<dl>${FAQ_FACTS.map((f) => `<dt>${esc(f.k)}</dt><dd>${esc(f.v)}</dd>`).join('')}</dl>
${cats
  .map(
    (c) => `<section><h2 style="color:#fff">${esc(c.label)}</h2>
${FAQS.filter((f) => f.cat === c.id)
  .map(
    (f) => `<article id="${f.id}"><h3 style="color:#fff">${esc(f.q)}</h3><p>${esc(f.summary)}</p><ul>${f.points
      .map((p) => `<li>${esc(p)}</li>`)
      .join('')}</ul></article>`,
  )
  .join('\n')}
</section>`,
  )
  .join('\n')}
<p>Contact: <a style="color:#60a5fa" href="mailto:${FAQ_EMAIL}">${FAQ_EMAIL}</a> · <a style="color:#60a5fa" href="/#contact">Contact form</a></p>
</main>`;
}
