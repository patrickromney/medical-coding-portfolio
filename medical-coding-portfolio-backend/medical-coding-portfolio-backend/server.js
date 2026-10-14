require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');

const app = express();
const PORT = Number(process.env.PORT || 3000);
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://patrickromney.github.io')
  .split(',').map((origin) => origin.trim()).filter(Boolean);

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    // Allow requests without an Origin header for health checks and local tools.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json({ limit: '20kb' }));

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { ok: false, message: 'Too many messages were submitted. Please try again later.' }
});

app.get('/', (_req, res) => {
  res.json({ service: 'Medical Coding Portfolio Contact API', status: 'running' });
});

app.get('/health', (_req, res) => res.json({ ok: true }));

function clean(value, maxLength) {
  return String(value || '').trim().slice(0, maxLength);
}

app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    const { name, email, subject, message, website } = req.body || {};

    // Honeypot field: bots may fill this hidden input; accept silently without sending email.
    if (website) return res.status(200).json({ ok: true, message: 'Message received.' });

    const safeName = clean(name, 100);
    const safeEmail = clean(email, 254);
    const safeSubject = clean(subject || 'Portfolio inquiry', 150);
    const safeMessage = clean(message, 5000);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!safeName || !safeEmail || !safeMessage) {
      return res.status(400).json({ ok: false, message: 'Please complete your name, email, and message.' });
    }
    if (!emailPattern.test(safeEmail)) {
      return res.status(400).json({ ok: false, message: 'Please enter a valid email address.' });
    }
    if (safeMessage.length < 5) {
      return res.status(400).json({ ok: false, message: 'Please enter a longer message.' });
    }

    const requiredEnv = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'CONTACT_TO', 'CONTACT_FROM'];
    const missing = requiredEnv.filter((key) => !process.env[key]);
    if (missing.length) {
      console.error('Email service is not configured. Missing:', missing.join(', '));
      return res.status(503).json({ ok: false, message: 'The contact service is not configured yet. Please use the email address shown on the portfolio.' });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    await transporter.sendMail({
      from: process.env.CONTACT_FROM,
      to: process.env.CONTACT_TO,
      replyTo: { name: safeName, address: safeEmail },
      subject: `[Portfolio Contact] ${safeSubject}`,
      text: `New message from your Medical Billing & Coding portfolio\n\nName: ${safeName}\nEmail: ${safeEmail}\nSubject: ${safeSubject}\n\nMessage:\n${safeMessage}\n`,
      html: `<h2>New portfolio inquiry</h2><p><strong>Name:</strong> ${escapeHtml(safeName)}</p><p><strong>Email:</strong> ${escapeHtml(safeEmail)}</p><p><strong>Subject:</strong> ${escapeHtml(safeSubject)}</p><p><strong>Message:</strong></p><p>${escapeHtml(safeMessage).replace(/\n/g, '<br>')}</p>`
    });

    return res.status(200).json({ ok: true, message: 'Thanks! Your message has been sent successfully.' });
  } catch (error) {
    console.error('Contact form error:', error.message);
    return res.status(500).json({ ok: false, message: 'Sorry, the message could not be sent. Please try again or email directly.' });
  }
});

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
}

app.use((err, _req, res, _next) => {
  if (err.message === 'Origin not allowed by CORS') {
    return res.status(403).json({ ok: false, message: 'This website is not allowed to use the contact API.' });
  }
  console.error(err);
  return res.status(500).json({ ok: false, message: 'Unexpected server error.' });
});

app.listen(PORT, () => console.log(`Contact API listening on port ${PORT}`));
