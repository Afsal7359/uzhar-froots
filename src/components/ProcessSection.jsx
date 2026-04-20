const PROCESS_FEATS = [
  { icon: '🌡️', text: '−40°C Flash Freeze' },
  { icon: '💧', text: 'Zero Moisture Retained' },
  { icon: '🔬', text: '100% Nutrients Preserved' },
  { icon: '🚫', text: 'Zero Heat — Zero Nutrient Loss' },
  { icon: '✨', text: 'Vibrant Colour & True Flavour' }
]

export default function ProcessSection({ steps, intro }) {
  if (!intro) return null

  return (
    <section className="process-sec" id="about">
      <div className="sec-inner">
        <div className="sec-eyebrow">{intro.eyebrow}</div>
        <h2 className="sec-title">
          {intro.title} <em>{intro.title_suffix}</em>
        </h2>
        <p className="sec-desc">{intro.description}</p>

        <div className="process-layout">
          <div>
            <div className="process-highlight">
              <div className="ph-temp">{intro.highlight_text}</div>
              {intro.highlight_sub && (
                <div className="ph-desc">{intro.highlight_sub}</div>
              )}
            </div>

            <ul className="process-feats">
              {PROCESS_FEATS.map((feat, i) => (
                <li key={i} className="pf-item">
                  <div className="pf-icon">{feat.icon}</div>
                  <div className="pf-text">
                    <strong>{feat.text}</strong>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="process-timeline">
            {steps && steps.map(step => (
              <div key={step.id} className="pt-step">
                <div className="pt-num">Step {step.step_number}</div>
                <div className="pt-icon">{step.icon}</div>
                <div className="pt-title">{step.title}</div>
                <div className="pt-desc">{step.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
