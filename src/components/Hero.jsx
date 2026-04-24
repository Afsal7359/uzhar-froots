const FONT_MAP = {
  rounded: "'Nunito', 'VAG Rounded', sans-serif",
  serif:   "'Cormorant Garamond', Georgia, serif",
  sans:    "'DM Sans', sans-serif",
}

export default function Hero({ hero }) {
  function scrollTo(href) {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const imageUrl    = hero?.image_url || '/assets/Front Image.jpeg'
  const titleFont   = FONT_MAP[hero?.title_font] || FONT_MAP.rounded
  const titleCaption = hero?.title_caption || 'Freeze Dried Goodness'
  const subtitle    = hero?.subtitle || 'Pure fruit goodness in every sachet.'
  const ctaPrimary  = hero?.cta_primary || 'Shop Now'
  const ctaSecondary = hero?.cta_secondary || 'Learn the Science'
  const tags = Array.isArray(hero?.tags) && hero.tags.length
    ? hero.tags
    : ['🍓 15gms fruit powder = 100gms of real Fruit', '🌱 Zero Sugar', '💊 100% Nutrients', '📦 5 Flavours']

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

          <h1 className="hero-title" style={{ fontFamily: titleFont }}>
            <em>Uzhar</em>
            <span className="line-italic"> Fruoots</span>
            <span className="line-amber-caption"> {titleCaption}</span>
          </h1>

          <p className="hero-sub">{subtitle}</p>

          <div className="hero-tags">
            {tags.map((tag, i) => (
              <span key={i} className="hero-tag">{tag}</span>
            ))}
          </div>

          <div className="hero-cta">
            <button className="btn-primary" onClick={() => scrollTo('#products')}>
              {ctaPrimary}
            </button>
            <button className="btn-outline" onClick={() => scrollTo('#about')}>
              {ctaSecondary}
            </button>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-img-wrap">
            <img
              src={imageUrl?.startsWith('http') ? imageUrl : imageUrl}
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
