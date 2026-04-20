export default function Hero({ hero }) {
  function scrollTo(href) {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero">
      <div className="hero-bg-shape" />
      <div className="hero-inner">
        <div className="hero-left">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            <span>100% Natural</span>
            <span className="hero-badge-dot" />
            <span>Zero Additives</span>
            <span className="hero-badge-dot" />
            <span>Made in India</span>
          </div>

          <h1 className="hero-title">
            Uzhar
            <span className="line-italic"> Fruoots</span>
            <span className="line-amber-caption"> Freeze Dried Goodness</span>
          </h1>

          <p className="hero-sub">
            {hero?.subtitle || 'Pure fruit goodness in every sachet.'}
          </p>

          <div className="hero-tags">
            <span className="hero-tag">🍓 15gms fruit powder = 100gms of real Fruit</span>
            <span className="hero-tag">🌱 Zero Sugar</span>
            <span className="hero-tag">💊 100% Nutrients</span>
            <span className="hero-tag">📦 5 Flavours</span>
          </div>

          <div className="hero-cta">
            <button className="btn-primary" onClick={() => scrollTo('#products')}>
              Shop Now
            </button>
            <button className="btn-outline" onClick={() => scrollTo('#about')}>
              Learn the Science
            </button>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-img-wrap">
            <img
              src="/assets/Front Image.jpeg"
              alt="Uzhar Fruoots Sachet"
              className="hero-sachet"
            />
            <div className="hero-float-card hfc-top">
              <span className="hfc-icon">✅</span>
              <div className="hfc-text">
                <strong>Zero Additives</strong>
                <span>Certified</span>
              </div>
            </div>
            <div className="hero-float-card hfc-left">
              <span className="hfc-icon">⭐</span>
              <div className="hfc-text">
                <strong>4.9/5 Stars</strong>
                <span>Customer Rating</span>
              </div>
            </div>
            <div className="hero-float-card hfc-bot">
              <span className="hfc-icon">🚚</span>
              <div className="hfc-text">
                <strong>Fast Delivery</strong>
                <span>Pan India</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-scroll">
        <span className="hero-scroll-label">Scroll</span>
        <span className="hero-scroll-line" />
      </div>
    </section>
  )
}
