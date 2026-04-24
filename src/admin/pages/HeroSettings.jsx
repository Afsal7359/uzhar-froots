import { useState, useEffect, useContext, useRef } from 'react'
import { TokenContext } from '../context'
import { adminRead, adminSave, uploadImage } from '../../lib/sheets'

const DEFAULT = {
  image_url:     '',
  subtitle:      'Pure fruit goodness in every sachet.',
  title_caption: 'Freeze Dried Goodness',
  title_font:    'rounded',
  cta_primary:   'Shop Now',
  cta_secondary: 'Learn the Science',
  tags:          ['🍓 15gms fruit powder = 100gms of real Fruit', '🌱 Zero Sugar', '💊 100% Nutrients', '📦 5 Flavours'],
}

const FONT_OPTIONS = [
  { value: 'rounded', label: 'Rounded (Nunito) — current default' },
  { value: 'serif',   label: 'Serif (Cormorant Garamond) — elegant' },
  { value: 'sans',    label: 'Sans (DM Sans) — clean modern' },
]

const FONT_PREVIEW = {
  rounded: "'Nunito', 'VAG Rounded', sans-serif",
  serif:   "'Cormorant Garamond', Georgia, serif",
  sans:    "'DM Sans', sans-serif",
}

export default function HeroSettings() {
  const { token }             = useContext(TokenContext)
  const [allRows, setAllRows] = useState([])
  const [form,    setForm]    = useState(DEFAULT)
  const [saving,  setSaving]  = useState(false)
  const [loading, setLoading] = useState(true)
  const [imgLoading, setImgLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error,   setError]   = useState('')
  const fileRef = useRef(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const rows = await adminRead('site_settings', token)
      setAllRows(rows)
      const row = rows.find(r => r.key === 'hero')
      if (row?.value) {
        try { setForm({ ...DEFAULT, ...JSON.parse(row.value) }) } catch { /* keep default */ }
      }
    } finally {
      setLoading(false)
    }
  }

  function set(key, val) {
    setForm(p => ({ ...p, [key]: val }))
  }

  async function handleImageChange(file) {
    if (!file) return
    setImgLoading(true)
    setError('')
    try {
      const url = await uploadImage(file)
      set('image_url', url)
    } catch (err) {
      setError('Image upload failed: ' + err.message)
    } finally {
      setImgLoading(false)
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    try {
      const valueStr = JSON.stringify(form)
      const exists   = allRows.some(r => r.key === 'hero')
      const newRows  = exists
        ? allRows.map(r => r.key === 'hero' ? { ...r, value: valueStr } : r)
        : [...allRows, { key: 'hero', value: valueStr }]
      await adminSave('site_settings', newRows, token)
      setSuccess('Hero settings saved!')
      load()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ padding: 40, color: 'var(--ink3)', textAlign: 'center' }}>Loading…</div>

  return (
    <>
      <div className="page-header">
        <div>
          <h1>Hero Section</h1>
          <p>Change the banner image, fonts, text and CTA buttons shown on the homepage hero</p>
        </div>
      </div>

      {success && (
        <div style={{ background: '#d1fae5', color: '#065f46', padding: '10px 16px', borderRadius: 8, marginBottom: 16, fontSize: '.84rem' }}>
          {success}
        </div>
      )}
      {error && <div className="login-error" style={{ marginBottom: 16 }}>{error}</div>}

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* Banner Image */}
        <div className="card">
          <div className="card-header"><h2>Banner Image</h2></div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {form.image_url ? (
                <div>
                  <img
                    src={form.image_url}
                    alt="Hero banner"
                    style={{ height: 160, maxWidth: 300, objectFit: 'contain', borderRadius: 10, border: '1px solid var(--border)', background: '#f5f5f5' }}
                    onError={e => { e.target.style.opacity = '.3' }}
                  />
                  <div style={{ fontSize: '.68rem', color: 'var(--ink3)', marginTop: 4, wordBreak: 'break-all' }}>{form.image_url}</div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ marginTop: 6 }}
                    onClick={() => set('image_url', '')}
                  >
                    Remove (use default)
                  </button>
                </div>
              ) : (
                <div style={{ width: 180, height: 120, borderRadius: 10, border: '2px dashed var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6, color: 'var(--ink3)', fontSize: '.75rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🖼️</span>
                  <span>Using default image</span>
                </div>
              )}

              <label style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '9px 18px', borderRadius: 'var(--r)',
                background: imgLoading ? 'var(--bg2)' : 'var(--green)',
                color: imgLoading ? 'var(--ink3)' : '#fff',
                fontSize: '.82rem', fontWeight: 600,
                cursor: imgLoading ? 'not-allowed' : 'pointer',
                alignSelf: 'flex-start',
              }}>
                {imgLoading ? '⏳ Uploading…' : '📁 Upload New Banner Image'}
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  ref={fileRef}
                  onChange={e => handleImageChange(e.target.files[0])}
                  disabled={imgLoading}
                />
              </label>
              <div className="hint">Max 4 MB · JPG, PNG, WebP · Recommended: portrait or square</div>
            </div>
          </div>
        </div>

        {/* Font & Title */}
        <div className="card">
          <div className="card-header"><h2>Title Font &amp; Style</h2></div>
          <div className="card-body">
            <div className="form-grid">
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Title Font</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
                  {FONT_OPTIONS.map(opt => (
                    <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', padding: '10px 14px', border: `2px solid ${form.title_font === opt.value ? 'var(--green)' : 'var(--border)'}`, borderRadius: 8, background: form.title_font === opt.value ? 'var(--green-l)' : 'var(--bg)' }}>
                      <input type="radio" name="title_font" value={opt.value} checked={form.title_font === opt.value} onChange={() => set('title_font', opt.value)} />
                      <div>
                        <div style={{ fontFamily: FONT_PREVIEW[opt.value], fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.2 }}>
                          Uzhar <em>Fruoots</em>
                        </div>
                        <div style={{ fontSize: '.72rem', color: 'var(--ink3)', marginTop: 3 }}>{opt.label}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Caption under title</label>
                <input type="text" value={form.title_caption} onChange={e => set('title_caption', e.target.value)} placeholder="Freeze Dried Goodness" />
                <div className="hint">Text shown below "Uzhar Fruoots" in amber italic</div>
              </div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="card">
          <div className="card-header"><h2>Text Content</h2></div>
          <div className="card-body">
            <div className="form-grid">
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Subtitle / Tagline</label>
                <textarea rows={2} value={form.subtitle} onChange={e => set('subtitle', e.target.value)} placeholder="Pure fruit goodness in every sachet." />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>Feature Tags (one per line)</label>
                <textarea
                  rows={5}
                  value={Array.isArray(form.tags) ? form.tags.join('\n') : form.tags}
                  onChange={e => set('tags', e.target.value.split('\n'))}
                  placeholder={'🍓 15gms fruit powder = 100gms of real Fruit\n🌱 Zero Sugar\n💊 100% Nutrients\n📦 5 Flavours'}
                />
                <div className="hint">Each line becomes one tag pill shown in the hero</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="card">
          <div className="card-header"><h2>CTA Buttons</h2></div>
          <div className="card-body">
            <div className="form-grid">
              <div className="form-group">
                <label>Primary Button Text</label>
                <input type="text" value={form.cta_primary} onChange={e => set('cta_primary', e.target.value)} placeholder="Shop Now" />
              </div>
              <div className="form-group">
                <label>Secondary Button Text</label>
                <input type="text" value={form.cta_secondary} onChange={e => set('cta_secondary', e.target.value)} placeholder="Learn the Science" />
              </div>
            </div>
          </div>
        </div>

        <div>
          <button type="submit" className="btn btn-primary" disabled={saving || imgLoading}>
            {saving ? 'Saving…' : imgLoading ? 'Uploading image…' : 'Save Hero Settings'}
          </button>
        </div>
      </form>
    </>
  )
}
