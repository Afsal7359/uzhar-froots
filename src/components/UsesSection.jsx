export default function UsesSection({ uses }) {
  if (!uses) return null

  return (
    <section className="uses-sec" id="uses">
      <div className="sec-inner">
        <div className="sec-eyebrow">Versatile</div>
        <h2 className="sec-title">One powder, endless ways</h2>
        <p className="sec-desc">
          From Sunrise Sips to Midnight Treats — Uzhar Fruoots fits into every kitchen moment.
        </p>

        <div className="uses-grid">
          {uses.map(use => (
            <div
              key={use.id}
              className="use-card"
              style={{ background: use.bg_color || '#f0fdf4' }}
            >
              <div className="use-icon">{use.icon}</div>
              <h3 className="use-name">{use.title}</h3>
              <p className="use-desc">{use.description}</p>
              {use.tip && <div className="use-tip">{use.tip}</div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
