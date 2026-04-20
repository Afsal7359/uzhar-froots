import { useState } from 'react'

const SUBJECTS = [
  'Product Enquiry',
  'Order / Shipping',
  'Bulk / B2B Order',
  'Franchise Opportunity',
  'Feedback',
  'Other'
]

export default function ContactSection({ contact }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  })

  if (!contact) return null

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleWhatsApp(e) {
    e.preventDefault()
    const { name, phone, email, subject, message } = form
    const text = [
      `Hello Uzhar Fruoots! 👋`,
      ``,
      `Name: ${name}`,
      phone ? `Phone: ${phone}` : '',
      email ? `Email: ${email}` : '',
      subject ? `Subject: ${subject}` : '',
      ``,
      message ? `Message: ${message}` : ''
    ].filter(Boolean).join('\n')

    const encoded = encodeURIComponent(text)
    window.open(`https://wa.me/${contact.wa_number}?text=${encoded}`, '_blank')
  }

  return (
    <section className="contact-sec" id="contact">
      <div className="sec-inner">
        <div className="sec-eyebrow">Get in Touch</div>
        <h2 className="sec-title">We'd love to hear from you</h2>

        <div className="contact-layout">
          <div className="contact-info">
            <div className="ci-card">
              <span className="ci-icon">📞</span>
              <div>
                <div className="ci-label">Phone</div>
                <a href={`tel:${contact.phone}`} className="ci-value">{contact.phone}</a>
              </div>
            </div>

            <div className="ci-card">
              <span className="ci-icon">✉️</span>
              <div>
                <div className="ci-label">Email</div>
                <a href={`mailto:${contact.email}`} className="ci-value">{contact.email}</a>
              </div>
            </div>

            <div className="ci-card">
              <span className="ci-icon">📍</span>
              <div>
                <div className="ci-label">Location</div>
                <div className="ci-value">{contact.location}</div>
              </div>
            </div>

            {contact.hours && (
              <div className="ci-card">
                <span className="ci-icon">🕐</span>
                <div>
                  <div className="ci-label">Hours</div>
                  <div className="ci-value">{contact.hours}</div>
                </div>
              </div>
            )}

            <a
              href={`https://wa.me/${contact.wa_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="wa-big-btn"
            >
              <span>💬</span>
              Chat on WhatsApp
            </a>
          </div>

          <div>
            <form className="contact-form" onSubmit={handleWhatsApp}>
              <div className="cf-fields">
                <div className="cf-row-2" style={{ display: 'flex', gap: '12px' }}>
                  <div className="cf-group" style={{ flex: 1 }}>
                    <label htmlFor="c-name">Your Name</label>
                    <input
                      id="c-name"
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="cf-group" style={{ flex: 1 }}>
                    <label htmlFor="c-phone">Phone Number</label>
                    <input
                      id="c-phone"
                      type="tel"
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="cf-group">
                  <label htmlFor="c-email">Email Address</label>
                  <input
                    id="c-email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="cf-group">
                  <label htmlFor="c-subject">Subject</label>
                  <select
                    id="c-subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                  >
                    <option value="">Select a subject…</option>
                    {SUBJECTS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="cf-group">
                  <label htmlFor="c-message">Message</label>
                  <textarea
                    id="c-message"
                    name="message"
                    placeholder="Tell us how we can help…"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <button type="submit" className="cf-submit">
                Send via WhatsApp →
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
