import { useState } from 'react'

export default function FAQSection({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null)

  if (!faqs || faqs.length === 0) return null

  function toggle(i) {
    setOpenIndex(prev => (prev === i ? null : i))
  }

  return (
    <section className="faq-sec" id="faq">
      <div className="sec-inner">
        <div className="sec-eyebrow">Curious to know more ??</div>
        <h2 className="sec-title">Questions? Answered.</h2>

        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div key={faq.id} className="faq-item">
              <button
                className={`faq-q${openIndex === i ? ' active' : ''}`}
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
              >
                <span>{faq.question}</span>
                <span className="faq-icon">+</span>
              </button>
              <div className={`faq-a${openIndex === i ? ' open' : ''}`}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
