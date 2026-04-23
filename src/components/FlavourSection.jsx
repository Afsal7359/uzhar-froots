export default function FlavourSection({ flavours }) {
  if (!flavours || flavours.length === 0) return null

  function scrollToProducts(e) {
    e.preventDefault()
    const el = document.querySelector('#products')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="flavour-sec" id="flavors">
      <div className="sec-inner">
        <div className="sec-eyebrow">Shop by Flavour</div>
        <h2 className="sec-title">The Flavour Garden</h2>
        <p className="sec-desc">
          Five premium fruits. One perfect process. Pick your favourite or try them all.
        </p>

        <div className="flavour-grid">
          {flavours.map(flavour => (
            <div key={flavour.id} className="flav-tile">
              <img
                src={flavour.image_url?.startsWith("http") ? flavour.image_url : `/${flavour.image_url}`}
                alt={flavour.name}
                className="flav-tile-img"
              />
              <a href="#products" className="flav-tile-badge" onClick={scrollToProducts}>
                Shop →
              </a>
              <div className="flav-tile-footer">
                <div className="flav-tile-name">{flavour.name}</div>
                <div className="flav-tile-note">{flavour.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
