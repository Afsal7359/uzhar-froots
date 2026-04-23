export default function ProductsSection({ combos, onAddToCart }) {
  if (!combos) return null

  return (
    <section className="products-sec" id="products">
      <div className="sec-inner">
        <div className="sec-eyebrow">The Collection</div>
        <h2 className="sec-title">Combo Packs</h2>
        <p className="sec-desc">
          Our most popular multi-sachet collections — perfect for everyday use, gifting, or stocking up.
        </p>

        <div className="prod-grid-main">
          {combos.map(product => (
            <div key={product.id} className="prod-card">
              <div className="prod-img-area">
                <img
                  src={product.image_url?.startsWith("http") ? product.image_url : `/${product.image_url}`}
                  alt={product.name}
                  className="prod-real-img"
                />
                {product.ribbon_label && (
                  <span className="prod-ribbon">{product.ribbon_label}</span>
                )}
              </div>
              <div className="prod-body">
                <div className="prod-category">Fruit Fusion Box</div>
                <h3 className="prod-name">{product.name}</h3>
                <p className="prod-sub">{product.sub_title}</p>

                {product.features && product.features.length > 0 && (
                  <ul className="prod-feats">
                    {product.features.map((feat, i) => (
                      <li key={i} className="prod-feat">
                        <span className="prod-feat-check">✓</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="prod-price-row">
                  <span className="prod-price">{product.price_label}</span>
                </div>

                <button className="atc-btn" onClick={() => onAddToCart(product)}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
