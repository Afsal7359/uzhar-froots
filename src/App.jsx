import { useState, useEffect } from 'react'
import { fetchAllData } from './lib/db'

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
import PageSkeleton from './components/PageSkeleton'

export default function App() {
  const [cart,        setCart]        = useState({})
  const [cartOpen,    setCartOpen]    = useState(false)
  const [toastMsg,    setToastMsg]    = useState('')
  const [toastVisible,setToastVisible]= useState(false)
  const [data,        setData]        = useState(null)
  const [loading,     setLoading]     = useState(true)

  useEffect(() => {
    fetchAllData().then(result => {
      if (result) setData(result)
      setLoading(false)
    })
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

  const combos  = data?.products?.filter(p => p.category === 'combo')  || []
  const singles = data?.products?.filter(p => p.category === 'single') || []
  const contact = data?.settings?.contact || {}
  const footer  = data?.settings?.footer  || {}

  return (
    <>
      <Nav cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

      {loading ? (
        <PageSkeleton />
      ) : (
        <>
          <MarqueeBanner items={data?.marqueeItems || []} />
          <Hero hero={data?.settings?.hero} />
          <StatsBar stats={data?.stats || []} />
          <ProductsSection combos={combos} onAddToCart={handleAddToCart} />
          <SingleFlavoursSection singles={singles} onAddToCart={handleAddToCart} />
          <FranchiseSection />
          <ProcessSection steps={data?.processSteps || []} intro={data?.settings?.process_intro} />
          <UsesSection uses={data?.uses || []} />
          <WhySection whyData={data?.settings?.why_us} />
          <ReviewsSection reviews={data?.reviews || []} />
          <FAQSection faqs={data?.faqs || []} />
          <ContactSection contact={contact} />
          <Footer footer={footer} contact={contact} />
        </>
      )}

      <CartDrawer
        cart={cart}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onQtyChange={handleQtyChange}
        contact={contact}
      />
      {toastVisible && (
        <div className={`toast${toastVisible ? ' show' : ''}`}>{toastMsg}</div>
      )}
      <WaFloat waNumber={contact?.wa_number} />
    </>
  )
}
