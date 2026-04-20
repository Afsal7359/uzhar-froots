import { Outlet, NavLink } from 'react-router-dom'
import { useToken } from '../context'
import { useState } from 'react'

const NAV = [
  { section: 'Overview' },
  { to: '/admin',           icon: '📊', label: 'Dashboard',      end: true },
  { section: 'Content' },
  { to: '/admin/products',  icon: '📦', label: 'Products' },
  { to: '/admin/flavours',  icon: '🍊', label: 'Flavours' },
  { to: '/admin/reviews',   icon: '⭐', label: 'Reviews' },
  { to: '/admin/faqs',      icon: '❓', label: 'FAQs' },
  { to: '/admin/uses',      icon: '🥤', label: 'Use Cases' },
  { to: '/admin/process',   icon: '⚗️', label: 'Process Steps' },
  { section: 'Site' },
  { to: '/admin/marquee',   icon: '📢', label: 'Marquee Banner' },
  { to: '/admin/stats',     icon: '📈', label: 'Stats Bar' },
  { to: '/admin/settings',  icon: '⚙️', label: 'Site Settings' },
]

export default function Layout() {
  const { signOut } = useToken()
  const [mini, setMini] = useState(false)

  return (
    <div className={`admin-layout${mini ? ' sidebar-mini' : ''}`}>

      {/* ── SIDEBAR ── always visible, never hidden */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src="/assets/logofroot.jpg" alt="Uzhar" />
          <div className="sidebar-logo-text">
            <span className="sidebar-brand">Uzhar</span>
            <span className="sidebar-sub">Admin Panel</span>
          </div>
        </div>

        <div className="sidebar-nav">
          {NAV.map((item, i) =>
            item.section
              ? <div key={i} className="sidebar-section">{item.section}</div>
              : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                  title={item.label}
                >
                  <span className="s-icon">{item.icon}</span>
                  <span className="s-label">{item.label}</span>
                </NavLink>
              )
          )}
        </div>

        <div className="sidebar-footer">
          <button
            className="sidebar-link"
            onClick={() => setMini(m => !m)}
            title={mini ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{ border: 'none', background: 'none', width: '100%', cursor: 'pointer' }}
          >
            <span className="s-icon">{mini ? '»' : '«'}</span>
            <span className="s-label">Collapse</span>
          </button>
          <button
            className="signout-btn"
            onClick={signOut}
            title="Sign Out"
          >
            <span className="s-icon">🚪</span>
            <span className="s-label">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── CONTENT ── */}
      <div className="admin-right">
        <main className="admin-main">
          <Outlet />
        </main>
      </div>

    </div>
  )
}
