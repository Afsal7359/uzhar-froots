import { useState } from 'react'

export default function CartDrawer({ cart, isOpen, onClose, onQtyChange, contact }) {
  const [form, setForm] = useState({ name: '', phone: '', address: '' })

  const cartItems = Object.values(cart)
  const totalQty = cartItems.reduce((sum, item) => sum + item.qty, 0)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleOrder(e) {
    e.preventDefault()
    if (cartItems.length === 0) return

    const itemLines = cartItems.map(item => `• ${item.name} × ${item.qty}`).join('\n')
    const text = [
      `Hello Uzhar Fruoots! 🛒 I'd like to place an order:`,
      ``,
      `📦 Order:`,
      itemLines,
      ``,
      `Total Qty: ${totalQty} sachet(s)`,
      ``,
      `👤 Name: ${form.name}`,
      `📞 Phone: ${form.phone}`,
      form.address ? `📍 Address: ${form.address}` : '',
    ].filter(l => l !== undefined).join('\n')

    const waNumber = contact?.wa_number || ''
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <>
      {/* Overlay — show/hide via .on class so CSS transition works */}
      <div
        className={`cart-overlay${isOpen ? ' on' : ''}`}
        onClick={onClose}
      />

      {/* Drawer — slide in/out via .on class */}
      <div className={`cart-drawer${isOpen ? ' on' : ''}`}>
        <div className="cd-head">
          <h2 className="cd-title">Your Cart</h2>
          <button className="cd-close" onClick={onClose} aria-label="Close cart">✕</button>
        </div>

        <div className="cd-body">
          {cartItems.length === 0 ? (
            <div className="cd-empty">
              <div className="cd-empty-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Add some fruit powders to get started!</p>
            </div>
          ) : (
            <div className="cd-items">
              {cartItems.map(item => (
                <div key={item.id} className="cd-item">
                  <div className="cd-item-icon">
                    <img
                      src={`/${item.icon}`}
                      alt={item.name}
                      style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8 }}
                    />
                  </div>
                  <div className="cd-item-info">
                    <div className="cd-item-name">{item.name}</div>
                    {item.sub && <div className="cd-item-sub">{item.sub}</div>}
                  </div>
                  <div className="cd-qty">
                    <button className="qty-b" onClick={() => onQtyChange(item.id, -1)} aria-label="Decrease">−</button>
                    <span className="qty-n">{item.qty}</span>
                    <button className="qty-b" onClick={() => onQtyChange(item.id, 1)} aria-label="Increase">+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cd-foot">
            <div className="cd-total-row">
              <span className="cd-total-label">Total Sachets</span>
              <span className="cd-total-val">{totalQty}</span>
            </div>

            <form className="cd-form" onSubmit={handleOrder}>
              <div className="cd-fg">
                <label htmlFor="cd-name">Your Name *</label>
                <input
                  id="cd-name"
                  type="text"
                  name="name"
                  placeholder="Full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="cd-fg">
                <label htmlFor="cd-phone">Phone Number *</label>
                <input
                  id="cd-phone"
                  type="tel"
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="cd-fg">
                <label htmlFor="cd-address">Delivery Address</label>
                <textarea
                  id="cd-address"
                  name="address"
                  placeholder="Street, City, State, PIN"
                  rows={3}
                  value={form.address}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="wa-order-btn">
                🛒  Place Order via WhatsApp
              </button>
            </form>
            <p className="cd-note">You'll confirm payment &amp; details on WhatsApp.</p>
          </div>
        )}
      </div>
    </>
  )
}
