import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

// ── Data fetchers ──────────────────────────────────────────

export async function fetchMarqueeItems() {
  const { data } = await supabase.from('marquee_items').select('*').eq('is_active', true).order('sort_order')
  return data || []
}
export async function fetchStats() {
  const { data } = await supabase.from('stats').select('*').order('sort_order')
  return data || []
}
export async function fetchFlavours() {
  const { data } = await supabase.from('flavours').select('*').eq('is_active', true).order('sort_order')
  return data || []
}
export async function fetchProducts(category = null) {
  let q = supabase.from('products').select('*').eq('is_active', true).order('sort_order')
  if (category) q = q.eq('category', category)
  const { data } = await q
  return data || []
}
export async function fetchProcessSteps() {
  const { data } = await supabase.from('process_steps').select('*').order('sort_order')
  return data || []
}
export async function fetchUseCases() {
  const { data } = await supabase.from('use_cases').select('*').eq('is_active', true).order('sort_order')
  return data || []
}
export async function fetchReviews() {
  const { data } = await supabase.from('reviews').select('*').eq('is_active', true).order('sort_order')
  return data || []
}
export async function fetchFAQs() {
  const { data } = await supabase.from('faqs').select('*').eq('is_active', true).order('sort_order')
  return data || []
}
export async function fetchSetting(key) {
  const { data } = await supabase.from('site_settings').select('value').eq('key', key).single()
  return data?.value || null
}
