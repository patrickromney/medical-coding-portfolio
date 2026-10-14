# Medical Coding Portfolio Contact Backend

A small Node.js + Express API for the contact form on `https://patrickromney.github.io/medical-coding-portfolio/`.

## What it does

- Accepts contact form submissions at `POST /api/contact`
- Validates required fields and email format
- Uses a hidden honeypot field to ignore simple bot submissions
- Limits submissions to 5 requests per IP per 15 minutes
- Sends inquiries to your configured inbox through SMTP
- Restricts browser requests to your GitHub Pages origin using CORS
- Provides `GET /health` for a basic health check

## 1. Run locally

Install Node.js 20 or later, then in this folder run:

```bash
npm install
cp .env.example .env
```

Edit `.env` with SMTP details. For Gmail, enable 2-Step Verification and create an App Password; do not put your normal account password in `.env`. Keep `.env` private and never commit it to GitHub.

Then run:

```bash
npm start
```

Open `http://localhost:3000/health`. Expected response: `{"ok":true}`.

## 2. Deploy the backend

Deploy this folder as a Node web service on a host that supports Node.js (for example Render or Railway). Set the start command to `npm start`, and add each variable from `.env.example` as a secret/environment variable in the hosting dashboard. Do not upload `.env`.

After deployment, test `https://YOUR-BACKEND-HOST/health` and copy the backend base URL.

## 3. Connect your existing contact form

In your existing `index.html`, preserve the current design and add `id="contact-form"` to the contact form element. Ensure the form controls use these names:

- Name input: `name="name"`
- Email input: `name="email"`
- Subject input: `name="subject"`
- Message textarea: `name="message"`

Add these inside the form:

```html
<input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="hp-field">
<p id="form-status" role="status" aria-live="polite"></p>
```

Hide the honeypot field with CSS:

```css
.hp-field {
  position: absolute;
  left: -10000px;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
```

Copy `contact-form-integration.js` into your frontend repository. Replace `https://YOUR-BACKEND-HOST.example.com/api/contact` with your real deployed endpoint, then include it before `</body>`:

```html
<script src="contact-form-integration.js"></script>
```

If your current form already has JavaScript that handles submission, update that handler rather than adding a second submit handler.

## Important security notes

- Never put SMTP passwords or other secrets in frontend JavaScript or the GitHub Pages repository.
- Keep `ALLOWED_ORIGINS` limited to the site origins you control.
- A contact form should not collect patient health information or other sensitive medical data.
- The service is not deployed or connected until you configure email credentials, deploy it, and set the actual API URL in the frontend.
