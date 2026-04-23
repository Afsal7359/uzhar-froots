import { useState, useEffect, useContext, useRef } from 'react'
import { TokenContext } from '../context'
import { adminRead, adminSave, uploadImage } from '../../lib/sheets'

export default function CrudPage({
  sheet,
  title,
  description,
  orderCol = 'sort_order',
  columns,
  fields,
  hasActive = true,
  defaultValues = {},
}) {
  const { token } = useContext(TokenContext)
  const [rows,    setRows]    = useState([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(null)   // null | 'add' | 'edit'
  const [editing, setEditing] = useState(null)
  const [form,    setForm]    = useState({})
  const [saving,       setSaving]       = useState(false)
  const [error,        setError]        = useState('')
  const [imgLoading,   setImgLoading]   = useState({})
  const fileInputRefs = useRef({})

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const data = await adminRead(sheet, token)
      setRows(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function openAdd() {
    setEditing(null)
    setForm({ ...defaultValues })
    setError('')
    setSaving(false)
    setImgLoading({})
    setModal('add')
  }

  function openEdit(row) {
    setEditing(row)
    setForm({ ...row })
    setError('')
    setSaving(false)
    setImgLoading({})
    setModal('edit')
  }

  async function handleImageChange(fieldKey, file) {
    if (!file) return
    setImgLoading(p => ({ ...p, [fieldKey]: true }))
    setError('')
    try {
      const path = await uploadImage(file)
      setForm(p => ({ ...p, [fieldKey]: path }))
    } catch (err) {
      setError('Upload failed: ' + err.message)
    } finally {
      setImgLoading(p => ({ ...p, [fieldKey]: false }))
    }
  }


  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const payload = { ...form }

    // Parse JSON fields
    for (const f of fields) {
      if (f.type === 'json' && typeof payload[f.key] === 'string') {
        try {
          payload[f.key] = JSON.parse(payload[f.key])
        } catch {
          setError(`Invalid JSON in "${f.label}"`)
          setSaving(false)
          return
        }
      }
    }

    let newRows
    if (modal === 'edit') {
      newRows = rows.map(r => r.id === editing.id ? { ...editing, ...payload } : r)
    } else {
      const newRow = { id: crypto.randomUUID(), ...defaultValues, ...payload }
      newRows = [...rows, newRow]
    }

    try {
      await adminSave(sheet, newRows, token)
      setModal(null)
      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(row) {
    if (!confirm(`Delete "${row[columns[0]?.key] || 'this record'}"? This cannot be undone.`)) return
    const newRows = rows.filter(r => r.id !== row.id)
    try {
      await adminSave(sheet, newRows, token)
      load()
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleToggle(row) {
    const active = row.is_active === 'TRUE' || row.is_active === true
    const newRows = rows.map(r =>
      r.id === row.id ? { ...r, is_active: active ? 'FALSE' : 'TRUE' } : r
    )
    try {
      await adminSave(sheet, newRows, token)
      load()
    } catch (err) {
      alert(err.message)
    }
  }

  function isActive(row) {
    return row.is_active === 'TRUE' || row.is_active === true
  }

  function fieldValue(key) {
    const v = form[key]
    if (v === null || v === undefined) return ''
    if (typeof v === 'object') return JSON.stringify(v, null, 2)
    return v
  }

  return (
    <>
      <div className="page-header" style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
        <div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
        <button className="btn btn-primary" onClick={openAdd}>+ Add New</button>
      </div>

      <div className="card">
        {loading ? (
          <div className="card-body" style={{ textAlign:'center', color:'var(--ink3)', padding:40 }}>Loading…</div>
        ) : error ? (
          <div className="card-body" style={{ color:'var(--danger)', padding:20 }}>{error}</div>
        ) : rows.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📭</div>
            <p>No records yet. Add one!</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  {columns.map(c => <th key={c.key}>{c.label}</th>)}
                  {hasActive && <th>Active</th>}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={row.id || i}>
                    {columns.map(c => (
                      <td key={c.key}>
                        {c.render ? c.render(row[c.key], row) : String(row[c.key] ?? '—')}
                      </td>
                    ))}
                    {hasActive && (
                      <td>
                        <label className="toggle">
                          <input type="checkbox" checked={isActive(row)} onChange={() => handleToggle(row)} />
                          <span className="toggle-slider" />
                        </label>
                      </td>
                    )}
                    <td>
                      <div className="action-btns">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(row)}>✏️ Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(row)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{modal === 'edit' ? 'Edit Record' : 'Add New Record'}</h3>
              <button className="modal-close" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              {error && <div className="login-error" style={{ marginBottom:14 }}>{error}</div>}
              <form onSubmit={handleSave} className="form-grid">
                {fields.map(f => (
                  <div key={f.key} className="form-group">
                    <label>{f.label}{f.required && ' *'}</label>
                    {f.type === 'image' ? (
                      <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                        {/* Current image preview */}
                        {form[f.key] ? (
                          <div style={{ position:'relative', display:'inline-block', alignSelf:'flex-start' }}>
                            <img
                              src={form[f.key]}
                              alt="preview"
                              style={{ height:110, maxWidth:220, objectFit:'cover', borderRadius:8, border:'1px solid var(--border)', display:'block' }}
                              onError={e => { e.target.style.opacity='.3' }}
                            />
                            <div style={{ fontSize:'.68rem', color:'var(--ink3)', marginTop:4, wordBreak:'break-all' }}>{form[f.key]}</div>
                          </div>
                        ) : (
                          <div style={{ width:120, height:80, borderRadius:8, border:'2px dashed var(--border)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--ink3)', fontSize:'.75rem' }}>
                            No image
                          </div>
                        )}

                        {/* Upload button */}
                        <label style={{
                          display:'inline-flex', alignItems:'center', gap:8,
                          padding:'8px 16px', borderRadius:'var(--r)',
                          background: imgLoading[f.key] ? 'var(--bg2)' : 'var(--green)',
                          color: imgLoading[f.key] ? 'var(--ink3)' : '#fff',
                          fontSize:'.8rem', fontWeight:600,
                          cursor: imgLoading[f.key] ? 'not-allowed' : 'pointer',
                          alignSelf:'flex-start',
                          border:'none',
                        }}>
                          {imgLoading[f.key] ? '⏳ Uploading…' : '📁 Choose Image'}
                          <input
                            type="file"
                            accept="image/*"
                            style={{ display:'none' }}
                            ref={el => { fileInputRefs.current[f.key] = el }}
                            onChange={e => handleImageChange(f.key, e.target.files[0])}
                            disabled={!!imgLoading[f.key]}
                          />
                        </label>
                        <div className="hint">Max 4 MB · JPG, PNG, WebP · Uploads to project assets folder</div>
                      </div>
                    ) : f.type === 'textarea' || f.type === 'json' ? (
                      <textarea
                        rows={f.type === 'json' ? 6 : 3}
                        value={fieldValue(f.key)}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        required={f.required}
                        style={{
                          fontFamily: f.type === 'json' ? 'monospace' : 'inherit',
                          fontSize: f.type === 'json' ? '.78rem' : undefined,
                        }}
                      />
                    ) : f.type === 'select' ? (
                      <select
                        value={fieldValue(f.key)}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        required={f.required}
                      >
                        <option value="">Select…</option>
                        {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    ) : f.type === 'checkbox' ? (
                      <label className="form-check">
                        <input
                          type="checkbox"
                          checked={!!form[f.key]}
                          onChange={e => setForm(p => ({ ...p, [f.key]: e.target.checked }))}
                        />
                        {f.checkLabel || f.label}
                      </label>
                    ) : (
                      <input
                        type={f.type || 'text'}
                        value={fieldValue(f.key)}
                        onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        required={f.required}
                        min={f.min}
                        max={f.max}
                      />
                    )}
                    {f.hint && <div className="hint">{f.hint}</div>}
                  </div>
                ))}
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary"
                    disabled={saving || Object.values(imgLoading).some(Boolean)}>
                    {saving ? 'Saving…' : Object.values(imgLoading).some(Boolean) ? 'Uploading image…' : 'Save'}
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => setModal(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
