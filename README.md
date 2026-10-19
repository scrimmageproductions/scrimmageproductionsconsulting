# Scrimmage Productions LLC

Marketing site for Scrimmage Productions LLC: business consulting and AI workflow optimization.

The whole page lives in a single component, `src/App.jsx` (default export `App`), built with
React, Tailwind CSS and `lucide-react`. It can also be pasted directly into a Claude React
artifact.

## Running it

```bash
npm install
npm run dev       # start the dev server
npm run build     # production build to dist/
npm run preview   # preview the production build
```

## Contact form setup (Web3Forms)

The lead form and the diagnostic "send to my inbox" form post to
`https://api.web3forms.com/submit`. Web3Forms delivers to the inbox that owns the access key:

1. Create a free access key for `scrimmageproductions@gmail.com` at https://web3forms.com.
2. Paste it into `WEB3FORMS_ACCESS_KEY` near the top of `src/App.jsx`.

Until a key is set, both forms fall back to opening the visitor's email client with a
pre-filled message to `scrimmageproductions@gmail.com`.

## Sections

- Sticky nav with mobile drawer
- Hero with metrics and capability ticker
- Services: AI Workflow Automation / General Business Strategy tabs
- Operational Friction Diagnostic
- The Playbook: Film Room, Playbook, Execution
- ROI Calculator
- Contact / lead intake
- Footer
