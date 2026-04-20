import { useEffect, useRef } from 'react'

export default function MarqueeBanner({ items }) {
  if (!items || items.length === 0) return null

  // Triplicate for seamless infinite scroll
  const allItems = [...items, ...items, ...items]

  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        {allItems.map((item, i) => (
          <span key={i} className="m-item">
            {item.text}
            <span className="m-sep" />
          </span>
        ))}
      </div>
    </div>
  )
}
