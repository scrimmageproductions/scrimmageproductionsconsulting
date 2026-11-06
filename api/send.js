import { Resend } from 'resend';

// Vercel serverless function behind the Contact form (POST /api/send).
// RESEND_API_KEY lives only in the Vercel project's environment variables; it never reaches the browser.

const TO = ['scrimmageproductions@gmail.com'];
// onboarding@resend.dev works without DNS setup. Once scrimmy.xyz is verified in Resend, set
// CONTACT_FROM (e.g. "Contact Form <contact@scrimmy.xyz>") in Vercel to send from the domain instead.
const FROM = process.env.CONTACT_FROM || 'Contact Form <onboarding@resend.dev>';

const LIMITS = { name: 200, email: 320, message: 5000 };
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = null;
    }
  }
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Request body must be JSON' });

  // Honeypot: real visitors never fill this hidden field. Pretend it worked so bots move on.
  if (body.botcheck) return res.status(200).json({ success: true });

  const clean = (v) => (typeof v === 'string' ? v.trim() : '');
  const name = clean(body.name).replace(/[\r\n]+/g, ' ');
  const email = clean(body.email);
  const message = clean(body.message);

  if (!name || !email || !message) return res.status(400).json({ error: 'Name, email and message are all required' });
  if (!isEmail(email)) return res.status(400).json({ error: 'Email address is not valid' });
  if (name.length > LIMITS.name || email.length > LIMITS.email || message.length > LIMITS.message) {
    return res.status(400).json({ error: 'A field is too long' });
  }

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is missing from environment');
    return res.status(500).json({ error: 'RESEND_API_KEY is missing from environment' });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: email,
      subject: `New Dispatch from ${name} // scrimmy.xyz`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });
    if (error) {
      // Pass Resend's own error through (e.g. a 403 when onboarding@resend.dev sends to an address other
      // than the Resend account owner's, or an unverified CONTACT_FROM domain) so it shows in DevTools.
      console.error('Resend API Error:', error);
      return res.status(error.statusCode || 400).json({
        error: error.message || String(error),
        name: error.name,
        statusCode: error.statusCode,
        from: FROM,
        to: TO,
      });
    }
    return res.status(200).json({ success: true, id: data?.id });
  } catch (err) {
    console.error('Send failed:', err);
    return res.status(500).json({ error: err?.message || 'Unexpected error while sending' });
  }
}
