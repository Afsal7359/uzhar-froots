import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { label: 'The Collection', href: '#products' },
  { label: 'Flavour Garden', href: '#singles' },
  { label: 'From Fruit to Powder', href: '#about' },
  { label: 'How to Enjoy', href: '#uses' },
  { label: 'Customer Love', href: '#reviews' },
  { label: 'Get in Touch', href: '#contact' }
]

export default function Nav({ cartCount, onCartOpen }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 50) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    // Lock body scroll when menu is open
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  function handleNavClick(e, href) {
    e.preventDefault()
    setMenuOpen(false)
    const target = document.querySelector(href)
    if (target) target.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* ── DESKTOP / SCROLL NAV ── */}
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <a
          href="/"
          className="nav-logo"
          onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        >
          <img src="/assets/logofroot.jpg" alt="Uzhar Fruoots" className="nav-logo-img" />
        </a>

        {/* Desktop links — hidden via CSS on mobile */}
        <ul className="nav-links">
          {NAV_LINKS.map(link => (
            <li key={link.href}>
              <a href={link.href} onClick={e => handleNavClick(e, link.href)}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-right">
          <button className="cart-pill" onClick={onCartOpen} aria-label="Open cart">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <span>Cart</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          <button
            className={`hamburger${menuOpen ? ' active' : ''}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen(p => !p)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/*
        ── MOBILE MENU ──
        MUST be outside <nav> — backdrop-filter on nav creates a CSS containing
        block that traps position:fixed children inside nav's 68px height.
        Placing it here (sibling of nav) lets it correctly cover the full viewport.
      */}
      <div className={`mob-menu${menuOpen ? ' open' : ''}`}>
        <button
          className="mob-menu-close"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
        >
          ✕
        </button>
        {NAV_LINKS.map(link => (
          <a key={link.href} href={link.href} onClick={e => handleNavClick(e, link.href)}>
            {link.label}
          </a>
        ))}
      </div>
    </>
  )
}
