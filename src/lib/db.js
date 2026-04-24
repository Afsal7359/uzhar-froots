import { db } from './firebase'
import {
  collection, getDocs, doc, writeBatch,
} from 'firebase/firestore'

// ── HELPERS ───────────────────────────────────────────────────────────────────
function bool(v)  { return v === true || v === 'TRUE' }
function num(v)   { const n = Number(v); return isNaN(n) ? 0 : n }
function parseFeatures(v) {
  if (Array.isArray(v)) return v
  if (!v) return []
  try { return JSON.parse(v) } catch { return [] }
}

// ── FETCH ALL (frontend) ──────────────────────────────────────────────────────
// Firestore's persistentLocalCache (IndexedDB) makes this instant on revisit.
// On first load it fetches from network (~300–600ms). Every load after → cache.
export async function fetchAllData() {
  try {
    const COLS = ['marquee_items','stats','flavours','products','process_steps','use_cases','reviews','faqs']

    const [settingsSnap, ...snaps] = await Promise.all([
      getDocs(collection(db, 'settings')),
      ...COLS.map(c => getDocs(collection(db, c))),
    ])

    const settings = {}
    settingsSnap.forEach(d => { settings[d.id] = d.data() })

    const toArr = snap => snap.docs.map(d => ({ id: d.id, ...d.data() }))
    const [marquee, stats, flavours, products, processSteps, uses, reviews, faqs] = snaps.map(toArr)

    return {
      marqueeItems:  marquee.filter(r => bool(r.is_active)).sort((a,b) => num(a.sort_order)-num(b.sort_order)),
      stats:         stats.sort((a,b) => num(a.sort_order)-num(b.sort_order)).map(r => ({...r, is_bold_label: bool(r.is_bold_label)})),
      flavours:      flavours.filter(r => bool(r.is_active)).sort((a,b) => num(a.sort_order)-num(b.sort_order)),
      products:      products.filter(r => bool(r.is_active)).sort((a,b) => num(a.sort_order)-num(b.sort_order)).map(r => ({...r, features: parseFeatures(r.features)})),
      processSteps:  processSteps.sort((a,b) => num(a.sort_order)-num(b.sort_order)).map(r => ({...r, step_number: num(r.step_number)})),
      uses:          uses.filter(r => bool(r.is_active)).sort((a,b) => num(a.sort_order)-num(b.sort_order)),
      reviews:       reviews.filter(r => bool(r.is_active)).sort((a,b) => num(a.sort_order)-num(b.sort_order)).map(r => ({...r, rating: num(r.rating), is_highlight: bool(r.is_highlight), is_verified: bool(r.is_verified)})),
      faqs:          faqs.filter(r => bool(r.is_active)).sort((a,b) => num(a.sort_order)-num(b.sort_order)),
      settings,
    }
  } catch (e) {
    console.error('fetchAllData:', e)
    return null
  }
}

// ── ADMIN: READ COLLECTION ────────────────────────────────────────────────────
export async function adminRead(collectionName) {
  const snap = await getDocs(collection(db, collectionName))
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

// ── ADMIN: SAVE COLLECTION (full overwrite) ───────────────────────────────────
// Deletes all existing docs then writes new ones — keeps data in sync.
// Firestore batch max is 500 writes. Fine for all collections here.
export async function adminSave(collectionName, rows) {
  const existing = await getDocs(collection(db, collectionName))
  const batch    = writeBatch(db)

  existing.forEach(d => batch.delete(d.ref))

  rows.forEach(row => {
    const id  = String(row.id || crypto.randomUUID())
    const ref = doc(db, collectionName, id)
    batch.set(ref, { ...row, id })
  })

  await batch.commit()
}

// ── ADMIN: READ ALL SETTINGS ──────────────────────────────────────────────────
export async function adminReadSettings() {
  const snap = await getDocs(collection(db, 'settings'))
  const out  = {}
  snap.forEach(d => { out[d.id] = d.data() })
  return out
}

// ── ADMIN: SAVE ONE SETTING ───────────────────────────────────────────────────
export async function adminSaveSetting(key, data) {
  const batch = writeBatch(db)
  batch.set(doc(db, 'settings', key), data)
  await batch.commit()
}

// ── IMAGE UPLOAD (ImgBB) ──────────────────────────────────────────────────────
export async function uploadImage(file) {
  const apiKey = import.meta.env.VITE_IMGBB_KEY
  if (!apiKey) throw new Error('Add VITE_IMGBB_KEY to .env')
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
  return data.data.url
}
