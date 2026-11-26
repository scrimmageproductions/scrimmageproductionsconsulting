import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import {
  FAQ_DESCRIPTION,
  FAQ_PATH,
  FAQ_TITLE,
  SITE_URL,
  faqJsonLd,
  faqStaticHtml,
} from './src/faqData.js'

// Writes dist/faq/index.html: the built app shell with FAQ-specific title, description and canonical,
// the FAQPage + ProfessionalService JSON-LD in <head>, and the Q&A as plain HTML inside #root. Crawlers
// and answer engines that don't run JavaScript get the full content; browsers load the app as usual.
function prerenderFaq() {
  let outDir = 'dist'
  return {
    name: 'prerender-faq',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      const url = `${SITE_URL}${FAQ_PATH}`
      const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
      // Escape "<" so no answer text can close the script tag early.
      const jsonLd = JSON.stringify(faqJsonLd()).replace(/</g, '\\u003c')
      let html = readFileSync(join(outDir, 'index.html'), 'utf8')
      const swap = (re, value) => {
        if (!re.test(html)) throw new Error(`prerender-faq: pattern not found ${re}`)
        html = html.replace(re, value)
      }
      swap(/<title>[^<]*<\/title>/, `<title>${attr(FAQ_TITLE)}</title>`)
      swap(/(<meta name="title" content=")[^"]*"/, `$1${attr(FAQ_TITLE)}"`)
      swap(/(<meta name="description" content=")[^"]*"/, `$1${attr(FAQ_DESCRIPTION)}"`)
      swap(/(<meta property="og:title" content=")[^"]*"/, `$1${attr(FAQ_TITLE)}"`)
      swap(/(<meta property="og:description" content=")[^"]*"/, `$1${attr(FAQ_DESCRIPTION)}"`)
      swap(/(<meta property="og:url" content=")[^"]*"/, `$1${url}"`)
      swap(/(<meta name="twitter:title" content=")[^"]*"/, `$1${attr(FAQ_TITLE)}"`)
      swap(/(<meta name="twitter:description" content=")[^"]*"/, `$1${attr(FAQ_DESCRIPTION)}"`)
      swap(
        /<\/head>/,
        `  <link rel="canonical" href="${url}" />\n    <script type="application/ld+json" id="faq-jsonld">${jsonLd}</script>\n  </head>`,
      )
      swap(/<div id="root"><\/div>/, `<div id="root">${faqStaticHtml()}</div>`)
      mkdirSync(join(outDir, 'faq'), { recursive: true })
      writeFileSync(join(outDir, 'faq', 'index.html'), html)
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), prerenderFaq()],
})
