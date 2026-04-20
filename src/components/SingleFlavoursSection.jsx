const GRADIENTS = {
  mango:        'linear-gradient(135deg,#fff8e1,#ffe57f)',
  banana:       'linear-gradient(135deg,#fffde7,#fff176)',
  guava:        'linear-gradient(135deg,#f1f8e9,#aed581)',
  pomegranate:  'linear-gradient(135deg,#fce4ec,#ef9a9a)',
  apple:        'linear-gradient(135deg,#fbe9e7,#ffab91)',
  default:      'linear-gradient(135deg,#f5f5f5,#e0e0e0)'
}

function getBg(name) {
  if (!name) return GRADIENTS.default
  const key = name.toLowerCase()
  return GRADIENTS[key] || GRADIENTS.default
}

export default function SingleFlavoursSection({ singles, onAddToCart }) {
  if (!singles || singles.length === 0) return null

  return (
    <section className="single-sec" id="singles">
      <div className="sec-inner">
        <div className="sec-eyebrow">Single Flavours</div>
        <h2 className="sec-title">Pick Your Favourite</h2>
        <p className="sec-desc">
          Prefer one flavour? Go for a single-flavour box — 15 sachets of your chosen fruit powder.
        </p>

        <div className="single-grid">
          {singles.map(product => {
            const fruitName = product.name.split(' ')[0]
            return (
              <div
                key={product.id}
                className="single-card"
                style={{ background: getBg(fruitName) }}
              >
                <div className="single-img-area">
                  <img
                    src={`/${product.image_url}`}
                    alt={product.name}
                    className="single-real-img"
                  />
                </div>
                <div className="single-body">
                  <h3 className="single-name">{product.name}</h3>
                  <p className="single-sub">{product.sub_title}</p>
                  <div className="single-price">{product.price_label}</div>
                  <button className="single-atc" onClick={() => onAddToCart(product)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
