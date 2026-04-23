// ── CONFIGURATION ─────────────────────────────────────────────────────────────
// No API key needed — all requests go through your Google Apps Script web app.
const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL

// ── COLUMN HEADERS FOR EACH SHEET TAB ────────────────────────────────────────
export const HEADERS = {
  marquee_items: ['id','text','is_active','sort_order'],
  stats:         ['id','prefix','number_value','suffix','label','is_bold_label','sort_order'],
  flavours:      ['id','name','note','image_url','is_active','sort_order'],
  products:      ['id','name','category','sub_title','ribbon_label','image_url','features','price_label','is_active','sort_order'],
  process_steps: ['id','step_number','icon','title','description','sort_order'],
  use_cases:     ['id','icon','title','description','tip','bg_color','is_active','sort_order'],
  reviews:       ['id','author_name','author_role','author_emoji','rating','review_text','is_highlight','is_verified','is_active','sort_order'],
  faqs:          ['id','question','answer','is_active','sort_order'],
  site_settings: ['key','value'],
}

// ── INTERNAL: parse raw 2D array from Apps Script into row objects ────────────
function parseRows(raw) {
  if (!raw || raw.length < 2) return []
  const [headers, ...rows] = raw
  return rows.map(row => Object.fromEntries(headers.map((h, i) => [h, row[i] ?? ''])))
}

// ── INTERNAL: fetch a single sheet via Apps Script GET ────────────────────────
async function fetchSheet(name) {
  if (!SCRIPT_URL) return []
  try {
    const res = await fetch(`${SCRIPT_URL}?sheet=${encodeURIComponent(name)}`)
    if (!res.ok) return []
    const { values = [] } = await res.json()
    return parseRows(values)
  } catch {
    return []
  }
}

// ── PARSE HELPERS ─────────────────────────────────────────────────────────────
function bool(v)  { return v === 'TRUE' || v === true }
function num(v)   { const n = Number(v); return isNaN(n) ? 0 : n }
function json(v)  {
  if (!v) return null
  if (typeof v === 'object') return v
  try { return JSON.parse(v) } catch { return v }
}

// ── FRONTEND FETCHERS (public — no auth required) ─────────────────────────────
export async function fetchMarqueeItems() {
  const rows = await fetchSheet('marquee_items')
  return rows
    .filter(r => bool(r.is_active))
    .sort((a, b) => num(a.sort_order) - num(b.sort_order))
}

export async function fetchStats() {
  const rows = await fetchSheet('stats')
  return rows
    .sort((a, b) => num(a.sort_order) - num(b.sort_order))
    .map(r => ({ ...r, is_bold_label: bool(r.is_bold_label) }))
}

export async function fetchFlavours() {
  const rows = await fetchSheet('flavours')
  return rows
    .filter(r => bool(r.is_active))
    .sort((a, b) => num(a.sort_order) - num(b.sort_order))
}

export async function fetchProducts() {
  const rows = await fetchSheet('products')
  return rows
    .filter(r => bool(r.is_active))
    .sort((a, b) => num(a.sort_order) - num(b.sort_order))
    .map(r => ({ ...r, features: json(r.features) || [] }))
}

export async function fetchProcessSteps() {
  const rows = await fetchSheet('process_steps')
  return rows
    .sort((a, b) => num(a.sort_order) - num(b.sort_order))
    .map(r => ({ ...r, step_number: num(r.step_number) }))
}

export async function fetchUseCases() {
  const rows = await fetchSheet('use_cases')
  return rows
    .filter(r => bool(r.is_active))
    .sort((a, b) => num(a.sort_order) - num(b.sort_order))
}

export async function fetchReviews() {
  const rows = await fetchSheet('reviews')
  return rows
    .filter(r => bool(r.is_active))
    .sort((a, b) => num(a.sort_order) - num(b.sort_order))
    .map(r => ({
      ...r,
      rating:       num(r.rating),
      is_highlight: bool(r.is_highlight),
      is_verified:  bool(r.is_verified),
    }))
}

export async function fetchFAQs() {
  const rows = await fetchSheet('faqs')
  return rows
    .filter(r => bool(r.is_active))
    .sort((a, b) => num(a.sort_order) - num(b.sort_order))
}

// Fetch all site_settings in one request
export async function fetchAllSettings() {
  const rows = await fetchSheet('site_settings')
  const result = {}
  rows.forEach(r => { result[r.key] = json(r.value) })
  return result
}

// ── FETCH ALL DATA IN ONE REQUEST ─────────────────────────────────────────────
// Returns fully-parsed data for every section in a single Apps Script call.
// Falls back to null if unavailable (caller uses static fallbacks).
export async function fetchAllData() {
  if (!SCRIPT_URL) return null
  try {
    const res = await fetch(`${SCRIPT_URL}?action=fetchAll`)
    if (!res.ok) return null
    const { data } = await res.json()
    if (!data) return null

    const p = name => parseRows(data[name] || [])

    const settings = (() => {
      const result = {}
      p('site_settings').forEach(r => { result[r.key] = json(r.value) })
      return result
    })()

    return {
      marqueeItems:  p('marquee_items').filter(r => bool(r.is_active)).sort((a,b) => num(a.sort_order)-num(b.sort_order)),
      stats:         p('stats').sort((a,b) => num(a.sort_order)-num(b.sort_order)).map(r => ({...r, is_bold_label: bool(r.is_bold_label)})),
      flavours:      p('flavours').filter(r => bool(r.is_active)).sort((a,b) => num(a.sort_order)-num(b.sort_order)),
      products:      p('products').filter(r => bool(r.is_active)).sort((a,b) => num(a.sort_order)-num(b.sort_order)).map(r => ({...r, features: json(r.features)||[]})),
      processSteps:  p('process_steps').sort((a,b) => num(a.sort_order)-num(b.sort_order)).map(r => ({...r, step_number: num(r.step_number)})),
      uses:          p('use_cases').filter(r => bool(r.is_active)).sort((a,b) => num(a.sort_order)-num(b.sort_order)),
      reviews:       p('reviews').filter(r => bool(r.is_active)).sort((a,b) => num(a.sort_order)-num(b.sort_order)).map(r => ({...r, rating: num(r.rating), is_highlight: bool(r.is_highlight), is_verified: bool(r.is_verified)})),
      faqs:          p('faqs').filter(r => bool(r.is_active)).sort((a,b) => num(a.sort_order)-num(b.sort_order)),
      settings,
    }
  } catch {
    return null
  }
}

// ── IMAGE UPLOAD → ImgBB (free image hosting, direct URL) ────────────────────
export async function uploadImage(file) {
  const apiKey = import.meta.env.VITE_IMGBB_KEY
  if (!apiKey || apiKey === 'your_imgbb_api_key_here') {
    throw new Error('Add VITE_IMGBB_KEY to .env — get a free key at imgbb.com/api')
  }
  if (file.size > 4 * 1024 * 1024) throw new Error('Image must be under 4 MB')

  const base64 = await new Promise((res, rej) => {
    const reader = new FileReader()
    reader.onload  = () => res(reader.result.split(',')[1])
    reader.onerror = rej
    reader.readAsDataURL(file)
  })

  const body = new FormData()
  body.append('key', apiKey)
  body.append('image', base64)
  body.append('name', file.name.replace(/\.[^.]+$/, ''))

  const resp = await fetch('https://api.imgbb.com/1/upload', { method: 'POST', body })
  const data = await resp.json()
  if (!data.success) throw new Error(data.error?.message || 'ImgBB upload failed')
  return data.data.url  // e.g. https://i.ibb.co/xxx/image.jpg
}

// ── ADMIN LOGIN ───────────────────────────────────────────────────────────────
export async function adminLogin(username, password) {
  if (!SCRIPT_URL) throw new Error('VITE_SCRIPT_URL not set in .env')
  const url = `${SCRIPT_URL}?action=login` +
    `&user=${encodeURIComponent(username)}` +
    `&pass=${encodeURIComponent(password)}`
  const res  = await fetch(url)
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return { token: data.token, expiry: data.expiry }
}

// ── ADMIN READ (no auth needed — public sheet) ────────────────────────────────
export async function adminRead(sheet) {
  return fetchSheet(sheet)
}

// ── ADMIN SAVE (POST with form-encoding — avoids CORS preflight) ──────────────
export async function adminSave(sheet, rows, token) {
  const headers = HEADERS[sheet]
  if (!headers) throw new Error(`Unknown sheet: ${sheet}`)

  const values = [
    headers,
    ...rows.map(row =>
      headers.map(h => {
        const v = row[h]
        if (v === null || v === undefined) return ''
        if (typeof v === 'object') return JSON.stringify(v)
        return String(v)
      })
    ),
  ]

  const body = new URLSearchParams({
    token,
    sheet,
    values: JSON.stringify(values),
  })

  const res  = await fetch(SCRIPT_URL, { method: 'POST', body })
  const data = await res.json()
  if (data.error) throw new Error(data.error)
}
