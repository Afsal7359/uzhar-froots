const NAV_LINKS = [
  { label: 'The Collection', href: '#products' },
  { label: 'Flavour Garden', href: '#singles' },
  { label: 'From Fruit to Powder', href: '#about' },
  { label: 'How to Enjoy', href: '#uses' },
  { label: 'Customer Love', href: '#reviews' },
  { label: 'Get in Touch', href: '#contact' }
]

export default function Footer({ footer, contact }) {
  function handleNavClick(e, href) {
    e.preventDefault()
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <div className="ft-brand-name">
              Uzhar <em>Fruoots</em>
            </div>
            {footer?.tagline && (
              <div className="ft-tagline">{footer.tagline}</div>
            )}
            {footer?.description && (
              <p className="ft-desc">{footer.description}</p>
            )}
          </div>

          <div>
            <div className="ft-col-title">Quick Links</div>
            <div className="ft-links">
              {NAV_LINKS.map(link => (
                <a key={link.href} href={link.href} onClick={e => handleNavClick(e, link.href)}>
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {contact && (
            <div>
              <div className="ft-col-title">Contact Us</div>
              <div className="ft-links">
                {contact.phone && (
                  <a href={`tel:${contact.phone}`}>Tel: {contact.phone}</a>
                )}
                {contact.email && (
                  <a href={`mailto:${contact.email}`}>Email: {contact.email}</a>
                )}
                {contact.location && (
                  <span>Location: {contact.location}</span>
                )}
                {contact.hours && (
                  <span>Hours: {contact.hours}</span>
                )}
                {contact.instagram && (
                  <a href={`https://instagram.com/${contact.instagram.replace('@','')}`} target="_blank" rel="noopener noreferrer">
                    Instagram: {contact.instagram}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <span>{footer?.copyright || '© 2025 Uzhar Fruoots. All rights reserved.'}</span>
        </div>
      </div>
    </footer>
  )
}
