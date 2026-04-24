import { useState, useEffect } from 'react'
import { adminReadSettings, adminSaveSetting } from '../../lib/db'

const DEFAULT = {
  title:       'Franchise Opportunity',
  subtitle:    'Partner with Uzhar Fruoots',
  description: 'Join our growing network and bring the goodness of freeze-dried fruit powder to your region.',
  benefits:    ['Low investment, high returns','Full training & support','Exclusive territory rights'],
  cta_text:    'Apply for Franchise',
  cta_email:   '',
  contact:     '',
  is_visible:  false,
}

export default function Franchise() {
  const [form,    setForm]    = useState(DEFAULT)
  const [saving,  setSaving]  = useState(false)
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState('')
  const [error,   setError]   = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const all = await adminReadSettings()
      if (all.franchise) setForm({ ...DEFAULT, ...all.franchise })
    } finally {
      setLoading(false)
    }
  }

  function set(key, val) { setForm(p => ({ ...p, [key]: val })) }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await adminSaveSetting('franchise', form)
      setSuccess('Franchise settings saved!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ padding:40, textAlign:'center', color:'var(--ink3)' }}>Loading…</div>

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Franchise Section</h1>
          <p>Manage franchise opportunity content shown on the website</p>
        </div>
      </div>

      {success && <div style={{ background:'#d1fae5', color:'#065f46', padding:'10px 16px', borderRadius:8, marginBottom:16, fontSize:'.84rem' }}>{success}</div>}
      {error   && <div className="login-error" style={{ marginBottom:16 }}>{error}</div>}

      <form onSubmit={handleSave} style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <div className="card">
          <div className="card-header"><h2>Visibility</h2></div>
          <div className="card-body">
            <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
              <label className="toggle">
                <input type="checkbox" checked={!!form.is_visible} onChange={e => set('is_visible', e.target.checked)} />
                <span className="toggle-slider" />
              </label>
              <span style={{ fontSize:'.88rem', fontWeight:600 }}>
                {form.is_visible ? 'Visible on website' : 'Hidden from website'}
              </span>
            </label>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h2>Content</h2></div>
          <div className="card-body">
            <div className="form-grid">
              <div className="form-group">
                <label>Section Title *</label>
                <input type="text" value={form.title} onChange={e => set('title',e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Subtitle</label>
                <input type="text" value={form.subtitle} onChange={e => set('subtitle',e.target.value)} />
              </div>
              <div className="form-group" style={{ gridColumn:'1/-1' }}>
                <label>Description</label>
                <textarea rows={3} value={form.description} onChange={e => set('description',e.target.value)} />
              </div>
              <div className="form-group" style={{ gridColumn:'1/-1' }}>
                <label>Key Benefits (one per line)</label>
                <textarea rows={4}
                  value={Array.isArray(form.benefits) ? form.benefits.join('\n') : form.benefits}
                  onChange={e => set('benefits', e.target.value.split('\n').filter(Boolean))}
                />
                <div className="hint">Each line = one benefit bullet</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h2>Call to Action</h2></div>
          <div className="card-body">
            <div className="form-grid">
              <div className="form-group">
                <label>Button Text</label>
                <input type="text" value={form.cta_text} onChange={e => set('cta_text',e.target.value)} placeholder="Apply for Franchise" />
              </div>
              <div className="form-group">
                <label>Contact Email</label>
                <input type="email" value={form.cta_email} onChange={e => set('cta_email',e.target.value)} placeholder="franchise@uzharfruoots.com" />
              </div>
              <div className="form-group">
                <label>Phone / WhatsApp</label>
                <input type="text" value={form.contact} onChange={e => set('contact',e.target.value)} placeholder="+91 98765 43210" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save Franchise Settings'}
          </button>
        </div>
      </form>
    </>
  )
}
