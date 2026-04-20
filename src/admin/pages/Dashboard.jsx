import { useEffect, useState, useContext } from 'react'
import { TokenContext } from '../context'
import { adminRead } from '../../lib/sheets'

const SHEETS = [
  { name: 'products',    label: 'Products',  icon: '📦', color: '#1b3a1e' },
  { name: 'flavours',    label: 'Flavours',  icon: '🍊', color: '#d4720a' },
  { name: 'reviews',     label: 'Reviews',   icon: '⭐', color: '#2c5632' },
  { name: 'faqs',        label: 'FAQs',      icon: '❓', color: '#6b46c1' },
]

export default function Dashboard() {
  const { token } = useContext(TokenContext)
  const [counts, setCounts] = useState({})

  useEffect(() => {
    SHEETS.forEach(async ({ name }) => {
      const rows = await adminRead(name, token)
      setCounts(p => ({ ...p, [name]: rows.length }))
    })
  }, [])

  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Uzhar Fruoots admin — powered by Google Sheets CMS</p>
      </div>

      <div className="stats-grid">
        {SHEETS.map(({ name, label, icon, color }) => (
          <div className="stat-card" key={name}>
            <div style={{ fontSize:'1.6rem', marginBottom:8 }}>{icon}</div>
            <div className="num" style={{ color }}>{counts[name] ?? '…'}</div>
            <div className="lbl">{label}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-header"><h2>Quick Links</h2></div>
        <div className="card-body">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            {[
              { href:'/admin/products', label:'Manage Products',  icon:'📦' },
              { href:'/admin/flavours', label:'Manage Flavours',  icon:'🍊' },
              { href:'/admin/reviews',  label:'Manage Reviews',   icon:'⭐' },
              { href:'/admin/faqs',     label:'Manage FAQs',      icon:'❓' },
              { href:'/admin/settings', label:'Site Settings',    icon:'⚙️' },
              { href:'/admin/marquee',  label:'Marquee Banner',   icon:'📢' },
            ].map(l => (
              <a
                key={l.href}
                href={l.href}
                style={{
                  display:'flex', alignItems:'center', gap:10, padding:'14px 16px',
                  background:'var(--bg)', borderRadius:'var(--r)', border:'1px solid var(--border)',
                  fontSize:'.84rem', fontWeight:600, color:'var(--ink)', transition:'background .2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg)'}
              >
                <span style={{ fontSize:'1.2rem' }}>{l.icon}</span>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
