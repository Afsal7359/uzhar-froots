export default function FranchiseSection() {
  function scrollToContact(e) {
    e.preventDefault()
    const el = document.querySelector('#contact')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="franchise-sec">
      <div className="franchise-inner">
        <span className="franchise-badge">Coming Soon</span>
        <h2 className="franchise-title">Franchise Opportunity</h2>
        <p className="franchise-sub">Opening soon — Watch this Space</p>
        <p className="franchise-desc">Let's make the world healthier together.</p>
        <a
          href="#contact"
          className="btn-franchise"
          onClick={scrollToContact}
        >
          Get in Touch →
        </a>
      </div>
    </section>
  )
}
