import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../lib/firebase'
import { AuthContext } from './context'

import Layout      from './components/Layout'
import Dashboard   from './pages/Dashboard'
import Products    from './pages/Products'
import Flavours    from './pages/Flavours'
import Reviews     from './pages/Reviews'
import FAQs        from './pages/FAQs'
import UseCases    from './pages/UseCases'
import ProcessSteps from './pages/ProcessSteps'
import MarqueeItems from './pages/MarqueeItems'
import StatsPage   from './pages/StatsPage'
import HeroSettings from './pages/HeroSettings'
import SiteSettings from './pages/SiteSettings'
import Franchise   from './pages/Franchise'
import SeedPage    from './pages/SeedPage'

import './admin.css'

export default function AdminApp() {
  const [user,     setUser]     = useState(undefined)  // undefined = loading
  const [creds,    setCreds]    = useState({ email: '', pass: '' })
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [showPass, setShowPass] = useState(false)

  // Listen to Firebase auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u ?? null))
    return unsub
  }, [])

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth, creds.email.trim(), creds.pass)
    } catch {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  function handleSignOut() {
    signOut(auth)
  }

  // Still loading auth state
  if (user === undefined) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'var(--bg)' }}>
        <div style={{ color:'var(--ink3)', fontSize:'.9rem' }}>Loading…</div>
      </div>
    )
  }

  // Not logged in → show login form
  if (!user) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">
            <img
              src="/assets/logofroot.jpg"
              alt="Uzhar Fruoots"
              style={{ height:56, margin:'0 auto', display:'block', mixBlendMode:'multiply' }}
            />
            <h2>Admin Panel</h2>
            <p>Sign in to manage your store</p>
          </div>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div className="form-group">
              <label style={{ fontSize:'.72rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--ink3)', marginBottom:4, display:'block' }}>
                Email
              </label>
              <input
                type="email"
                autoComplete="email"
                placeholder="admin@uzharfruoots.com"
                value={creds.email}
                onChange={e => setCreds(p => ({ ...p, email: e.target.value }))}
                required
                style={{ width:'100%', padding:'11px 14px', border:'1px solid var(--border)', borderRadius:8, fontSize:'.9rem', background:'var(--bg)' }}
              />
            </div>

            <div className="form-group">
              <label style={{ fontSize:'.72rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--ink3)', marginBottom:4, display:'block' }}>
                Password
              </label>
              <div style={{ position:'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter password"
                  value={creds.pass}
                  onChange={e => setCreds(p => ({ ...p, pass: e.target.value }))}
                  required
                  style={{ width:'100%', padding:'11px 44px 11px 14px', border:'1px solid var(--border)', borderRadius:8, fontSize:'.9rem', background:'var(--bg)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', fontSize:'.8rem', color:'var(--ink3)', background:'none', border:'none', cursor:'pointer', padding:0 }}
                >
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width:'100%', justifyContent:'center', padding:'13px', fontSize:'.9rem', borderRadius:8, marginTop:4 }}
              disabled={loading}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p style={{ fontSize:'.68rem', color:'var(--ink3)', marginTop:16, textAlign:'center', lineHeight:1.6 }}>
            Use the email &amp; password you set in Firebase Console → Authentication.
          </p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, signOut: handleSignOut }}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index            element={<Dashboard />} />
          <Route path="products"  element={<Products />} />
          <Route path="flavours"  element={<Flavours />} />
          <Route path="reviews"   element={<Reviews />} />
          <Route path="faqs"      element={<FAQs />} />
          <Route path="uses"      element={<UseCases />} />
          <Route path="process"   element={<ProcessSteps />} />
          <Route path="marquee"   element={<MarqueeItems />} />
          <Route path="stats"     element={<StatsPage />} />
          <Route path="hero"      element={<HeroSettings />} />
          <Route path="franchise" element={<Franchise />} />
          <Route path="settings"  element={<SiteSettings />} />
          <Route path="seed"      element={<SeedPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthContext.Provider>
  )
}
