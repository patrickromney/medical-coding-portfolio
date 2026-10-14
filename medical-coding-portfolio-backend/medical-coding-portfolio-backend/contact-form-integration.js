/*
  Add id="contact-form" to your existing contact form, and make sure the fields use:
  name="name", name="email", name="subject", name="message".
  Add a hidden honeypot input: <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="hp-field">
  Add a status element somewhere inside the form: <p id="form-status" role="status" aria-live="polite"></p>
  Include this file after your existing form markup, changing API_URL to your deployed backend URL.
*/

const API_URL = 'https://YOUR-BACKEND-HOST.example.com/api/contact';
const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');

if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector('[type="submit"]');
    const formData = new FormData(contactForm);
    const payload = Object.fromEntries(formData.entries());

    if (formStatus) formStatus.textContent = 'Sending your message…';
    if (submitButton) submitButton.disabled = true;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) throw new Error(result.message || 'Unable to send your message.');
      if (formStatus) formStatus.textContent = result.message || 'Message sent successfully.';
      contactForm.reset();
    } catch (error) {
      if (formStatus) formStatus.textContent = error.message || 'Something went wrong. Please try again.';
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
}
