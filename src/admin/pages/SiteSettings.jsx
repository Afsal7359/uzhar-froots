import { useState, useEffect } from 'react'
import { adminReadSettings, adminSaveSetting } from '../../lib/db'

const SETTINGS_KEYS = [
  { key: 'contact',       label: 'Contact Info' },
  { key: 'process_intro', label: 'Process Section' },
  { key: 'why_us',        label: 'Why Us Section' },
  { key: 'footer',        label: 'Footer' },
]

export default function SiteSettings() {
  const [settings, setSettings] = useState({})
  const [editing,  setEditing]  = useState(null)
  const [draft,    setDraft]    = useState('')
  const [saving,   setSaving]   = useState(false)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setSettings(await adminReadSettings())
  }

  function openEdit(key) {
    setEditing(key)
    setDraft(JSON.stringify(settings[key] || {}, null, 2))
    setError('')
    setSuccess('')
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    let parsed
    try { parsed = JSON.parse(draft) }
    catch { setError('Invalid JSON — fix it before saving.'); setSaving(false); return }

    try {
      await adminSaveSetting(editing, parsed)
      setEditing(null)
      setSuccess('Saved!')
      load()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="page-header">
        <h1>Site Settings</h1>
        <p>Edit contact details and section copy</p>
      </div>

      {success && (
        <div style={{ background:'#d1fae5', color:'#065f46', padding:'10px 16px', borderRadius:8, marginBottom:16, fontSize:'.84rem' }}>
          {success}
        </div>
      )}

      <div style={{ display:'grid', gap:16 }}>
        {SETTINGS_KEYS.map(({ key, label }) => (
          <div className="card" key={key}>
            <div className="card-header">
              <h2>{label}</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => openEdit(key)}>✏️ Edit</button>
            </div>
            <div className="card-body">
              <pre style={{ fontSize:'.74rem', color:'var(--ink3)', background:'var(--bg)', padding:12, borderRadius:6, overflow:'auto', maxHeight:160, lineHeight:1.6 }}>
                {JSON.stringify(settings[key] || {}, null, 2)}
              </pre>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth:700 }}>
            <div className="modal-head">
              <h3>Edit: {SETTINGS_KEYS.find(s => s.key === editing)?.label}</h3>
              <button className="modal-close" onClick={() => setEditing(null)}>✕</button>
            </div>
            <div className="modal-body">
              {error && <div className="login-error" style={{ marginBottom:12 }}>{error}</div>}
              <div className="form-group">
                <label>JSON Value</label>
                <textarea rows={18} value={draft} onChange={e => setDraft(e.target.value)}
                  style={{ fontFamily:'monospace', fontSize:'.8rem' }} />
                <div className="hint">Edit the JSON directly. Must be valid JSON.</div>
              </div>
              <div className="form-actions" style={{ marginTop:12 }}>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
                <button className="btn btn-ghost" onClick={() => setEditing(null)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
