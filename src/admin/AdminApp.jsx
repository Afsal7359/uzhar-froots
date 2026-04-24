import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { TokenContext } from './context'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Flavours from './pages/Flavours'
import Reviews from './pages/Reviews'
import FAQs from './pages/FAQs'
import UseCases from './pages/UseCases'
import ProcessSteps from './pages/ProcessSteps'
import MarqueeItems from './pages/MarqueeItems'
import StatsPage from './pages/StatsPage'
import SiteSettings from './pages/SiteSettings'
import HeroSettings from './pages/HeroSettings'
import Franchise from './pages/Franchise'
import SeedPage from './pages/SeedPage'
import { adminLogin } from '../lib/sheets'
import './admin.css'

function getStoredToken() {
  const token  = sessionStorage.getItem('adm_token')
  const expiry = Number(sessionStorage.getItem('adm_expiry') || 0)
  return token && Date.now() < expiry ? token : null
}

export default function AdminApp() {
  const [token,   setToken]   = useState(() => getStoredToken())
  const [user,    setUser]    = useState({ name: '', pass: '' })
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [showPass, setShowPass] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { token: t, expiry } = await adminLogin(user.name.trim(), user.pass)
      sessionStorage.setItem('adm_token',  t)
      sessionStorage.setItem('adm_expiry', String(expiry))
      setToken(t)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleSignOut() {
    sessionStorage.removeItem('adm_token')
    sessionStorage.removeItem('adm_expiry')
    setToken(null)
    setUser({ name: '', pass: '' })
  }

  if (!token) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">
            <img
              src="/assets/logofroot.jpg"
              alt="Uzhar Fruoots"
              style={{ height: 56, margin: '0 auto', display: 'block', mixBlendMode: 'multiply' }}
            />
            <h2>Admin Panel</h2>
            <p>Sign in to manage your store</p>
          </div>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="form-group">
              <label style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: 4, display: 'block' }}>
                Username
              </label>
              <input
                type="text"
                autoComplete="username"
                placeholder="Enter username"
                value={user.name}
                onChange={e => setUser(p => ({ ...p, name: e.target.value }))}
                required
                style={{ width: '100%', padding: '11px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: '.9rem', background: 'var(--bg)' }}
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: 4, display: 'block' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter password"
                  value={user.pass}
                  onChange={e => setUser(p => ({ ...p, pass: e.target.value }))}
                  required
                  style={{ width: '100%', padding: '11px 44px 11px 14px', border: '1px solid var(--border)', borderRadius: 8, fontSize: '.9rem', background: 'var(--bg)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: '.8rem', color: 'var(--ink3)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '.9rem', borderRadius: 8, marginTop: 4 }}
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p style={{ fontSize: '.68rem', color: 'var(--ink3)', marginTop: 16, textAlign: 'center', lineHeight: 1.6 }}>
            Session lasts 8 hours. Credentials are set in Google Apps Script.
          </p>
        </div>
      </div>
    )
  }

  return (
    <TokenContext.Provider value={{ token, signOut: handleSignOut }}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index           element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="flavours" element={<Flavours />} />
          <Route path="reviews"  element={<Reviews />} />
          <Route path="faqs"     element={<FAQs />} />
          <Route path="uses"     element={<UseCases />} />
          <Route path="process"  element={<ProcessSteps />} />
          <Route path="marquee"  element={<MarqueeItems />} />
          <Route path="stats"    element={<StatsPage />} />
          <Route path="hero"       element={<HeroSettings />} />
          <Route path="settings"   element={<SiteSettings />} />
          <Route path="franchise"  element={<Franchise />} />
          <Route path="seed"      element={<SeedPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </TokenContext.Provider>
  )
}
