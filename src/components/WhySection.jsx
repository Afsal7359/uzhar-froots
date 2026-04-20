const COMPARISON_ROWS = [
  '100% Natural Fruit',
  'Zero Added Sugar',
  'Nutrients Fully Retained',
  'No Preservatives',
  'No Maltodextrin/Fillers',
  'Instant Dissolve',
  'Baby & Elder Safe',
  'Vibrant True Colour'
]

export default function WhySection({ whyData }) {
  if (!whyData) return null

  const features = whyData.features || []

  return (
    <section className="why-sec" id="why">
      <div className="sec-inner">
        <div className="sec-eyebrow">{whyData.eyebrow}</div>
        <h2 className="sec-title">{whyData.title}</h2>
        <p className="sec-desc">{whyData.description}</p>

        <div className="why-grid">
          <div className="comparison-table">
            <div className="ct-header">
              <span>Feature</span>
              <span>Uzhar Fruoots</span>
              <span>Others</span>
            </div>
            {COMPARISON_ROWS.map(row => (
              <div key={row} className="ct-row">
                <span className="ct-feat">{row}</span>
                <span className="ct-yes">✓</span>
                <span className="ct-no">✗</span>
              </div>
            ))}
          </div>

          <div className="why-list">
            {features.map((feat, i) => (
              <div key={i} className="wl-item">
                <div className="wl-icon">{feat.icon}</div>
                <div className="wl-text">
                  <strong>{feat.title}</strong>
                  <p>{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
