export default function ReviewsSection({ reviews }) {
  if (!reviews || reviews.length === 0) return null

  function renderStars(rating) {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className="star">{i < rating ? '★' : '☆'}</span>
    ))
  }

  return (
    <section className="reviews-sec" id="reviews">
      <div className="sec-inner">
        <div className="sec-eyebrow">Customer Love</div>
        <h2 className="sec-title">What people are saying</h2>

        <div className="reviews-grid">
          {reviews.map(review => (
            <div
              key={review.id}
              className={`review-card${review.is_highlight ? ' highlight' : ''}`}
            >
              <div className="review-stars">{renderStars(review.rating)}</div>
              <p className="review-text">{review.review_text}</p>
              <div className="review-author">
                <div className="review-avatar">{review.author_emoji}</div>
                <div>
                  <div className="review-name">{review.author_name}</div>
                  {review.author_role && (
                    <div className="review-role">{review.author_role}</div>
                  )}
                  {review.is_verified && (
                    <div className="review-verified">✓ Verified Purchase</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
