import { useState, useEffect } from 'react'
import {
  fetchMarqueeItems, fetchStats, fetchFlavours, fetchProducts,
  fetchProcessSteps, fetchUseCases, fetchReviews, fetchFAQs, fetchAllSettings,
} from './lib/sheets'
import {
  fallbackMarqueeItems,
  fallbackStats,
  fallbackFlavours,
  fallbackProducts,
  fallbackProcessSteps,
  fallbackUseCases,
  fallbackReviews,
  fallbackFAQs,
  fallbackHero,
  fallbackContact,
  fallbackProcessIntro,
  fallbackWhyData,
  fallbackFooter,
} from './lib/fallback'

import Nav from './components/Nav'
import MarqueeBanner from './components/MarqueeBanner'
import Hero from './components/Hero'
import StatsBar from './components/StatsBar'
import ProductsSection from './components/ProductsSection'
import SingleFlavoursSection from './components/SingleFlavoursSection'
import FranchiseSection from './components/FranchiseSection'
import ProcessSection from './components/ProcessSection'
import UsesSection from './components/UsesSection'
import WhySection from './components/WhySection'
import ReviewsSection from './components/ReviewsSection'
import FAQSection from './components/FAQSection'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import WaFloat from './components/WaFloat'

export default function App() {
  const [cart, setCart] = useState({})
  const [cartOpen, setCartOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [toastVisible, setToastVisible] = useState(false)

  // Data state — initialised with fallbacks so page renders instantly
  const [marqueeItems, setMarqueeItems] = useState(fallbackMarqueeItems)
  const [stats,        setStats]        = useState(fallbackStats)
  const [flavours,     setFlavours]     = useState(fallbackFlavours)
  const [combos,       setCombos]       = useState(fallbackProducts.filter(p => p.category === 'combo'))
  const [singles,      setSingles]      = useState(fallbackProducts.filter(p => p.category === 'single'))
  const [processSteps, setProcessSteps] = useState(fallbackProcessSteps)
  const [uses,         setUses]         = useState(fallbackUseCases)
  const [reviews,      setReviews]      = useState(fallbackReviews)
  const [faqs,         setFAQs]         = useState(fallbackFAQs)
  const [hero,         setHero]         = useState(fallbackHero)
  const [contact,      setContact]      = useState(fallbackContact)
  const [processIntro, setProcessIntro] = useState(fallbackProcessIntro)
  const [whyData,      setWhyData]      = useState(fallbackWhyData)
  const [footer,       setFooter]       = useState(fallbackFooter)

  // Fetch live data in background — all run in parallel, update silently
  useEffect(() => {
    Promise.all([
      fetchMarqueeItems(),
      fetchStats(),
      fetchFlavours(),
      fetchProducts(),
      fetchProcessSteps(),
      fetchUseCases(),
      fetchReviews(),
      fetchFAQs(),
      fetchAllSettings(),
    ]).then(([mqItems, statsData, flavoursData, allProducts, stepsData, usesData, reviewsData, faqsData, settings]) => {
      if (mqItems.length)      setMarqueeItems(mqItems)
      if (statsData.length)    setStats(statsData)
      if (flavoursData.length) setFlavours(flavoursData)
      if (allProducts.length) {
        setCombos(allProducts.filter(p => p.category === 'combo'))
        setSingles(allProducts.filter(p => p.category === 'single'))
      }
      if (stepsData.length)    setProcessSteps(stepsData)
      if (usesData.length)     setUses(usesData)
      if (reviewsData.length)  setReviews(reviewsData)
      if (faqsData.length)     setFAQs(faqsData)
      if (settings.hero)          setHero(settings.hero)
      if (settings.contact)       setContact(settings.contact)
      if (settings.process_intro) setProcessIntro(settings.process_intro)
      if (settings.why_us)        setWhyData(settings.why_us)
      if (settings.footer)        setFooter(settings.footer)
    }).catch(() => {/* keep fallbacks on network error */})
  }, [])

  function showToast(msg) {
    setToastMsg(msg)
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2500)
  }

  function handleAddToCart(product) {
    setCart(prev => {
      const existing = prev[product.id]
      return {
        ...prev,
        [product.id]: {
          id: product.id,
          name: product.name,
          icon: product.image_url,
          sub: product.sub_title,
          qty: existing ? existing.qty + 1 : 1
        }
      }
    })
    showToast(`${product.name} added to cart!`)
  }

  function handleQtyChange(productId, delta) {
    setCart(prev => {
      const item = prev[productId]
      if (!item) return prev
      const newQty = item.qty + delta
      if (newQty <= 0) {
        const next = { ...prev }
        delete next[productId]
        return next
      }
      return { ...prev, [productId]: { ...item, qty: newQty } }
    })
  }

  const cartCount = Object.values(cart).reduce((sum, item) => sum + item.qty, 0)

  return (
    <>
      <Nav cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <MarqueeBanner items={marqueeItems} />
      <Hero hero={hero} />
      <StatsBar stats={stats} />
      <ProductsSection combos={combos} onAddToCart={handleAddToCart} />
      <SingleFlavoursSection singles={singles} onAddToCart={handleAddToCart} />
      <FranchiseSection />
      <ProcessSection steps={processSteps} intro={processIntro} />
      <UsesSection uses={uses} />
      <WhySection whyData={whyData} />
      <ReviewsSection reviews={reviews} />
      <FAQSection faqs={faqs} />
      <ContactSection contact={contact} />
      <Footer footer={footer} contact={contact} />
      <CartDrawer
        cart={cart}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onQtyChange={handleQtyChange}
        contact={contact}
      />
      {toastVisible && (
        <div className={`toast${toastVisible ? ' show' : ''}`}>
          {toastMsg}
        </div>
      )}
      <WaFloat waNumber={contact?.wa_number} />
    </>
  )
}
