import { useContext, useState } from 'react'
import { TokenContext } from '../context'
import { adminSave } from '../../lib/sheets'

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

function buildSeedData() {
  return {
    marquee_items: [
      { id: uuid(), text: '100% Natural Fruit',                                    is_active: 'TRUE', sort_order: '1' },
      { id: uuid(), text: 'Zero Added Sugar',                                      is_active: 'TRUE', sort_order: '2' },
      { id: uuid(), text: 'Nutrient Dense',                                        is_active: 'TRUE', sort_order: '3' },
      { id: uuid(), text: 'No Preservatives',                                      is_active: 'TRUE', sort_order: '4' },
      { id: uuid(), text: 'No Fillers',                                            is_active: 'TRUE', sort_order: '5' },
      { id: uuid(), text: 'Apple · Mango · Guava · Pomegranate · Banana — 5 Flavours', is_active: 'TRUE', sort_order: '6' },
      { id: uuid(), text: 'Made in India 🇮🇳',                                     is_active: 'TRUE', sort_order: '7' },
      { id: uuid(), text: 'No Sugar · No Fillers · No Additives',                 is_active: 'TRUE', sort_order: '8' },
      { id: uuid(), text: 'Pure Fruit Powder',                                     is_active: 'TRUE', sort_order: '9' },
    ],
    stats: [
      { id: uuid(), prefix: '', number_value: '500', suffix: '+',         label: 'Happy Customers',        is_bold_label: 'FALSE', sort_order: '1' },
      { id: uuid(), prefix: '', number_value: '5',   suffix: ' Flavours', label: 'Current Flavours',       is_bold_label: 'FALSE', sort_order: '2' },
      { id: uuid(), prefix: '', number_value: '0',   suffix: '% Sugar',   label: 'Zero Added Sugar',       is_bold_label: 'FALSE', sort_order: '3' },
      { id: uuid(), prefix: '', number_value: '15',  suffix: 'gms',       label: '= 100gms of Real Fruit', is_bold_label: 'TRUE',  sort_order: '4' },
    ],
    flavours: [
      { id: uuid(), name: 'Mango',       note: 'Alphonso blend · Tropical sweet',  image_url: 'assets/Mango.jpeg',       is_active: 'TRUE', sort_order: '1' },
      { id: uuid(), name: 'Banana',      note: 'Kerala variety · Creamy energy',   image_url: 'assets/Banana.jpeg',      is_active: 'TRUE', sort_order: '2' },
      { id: uuid(), name: 'Guava',       note: 'Sweet-tart aroma · Fibre rich',    image_url: 'assets/Guava.jpeg',       is_active: 'TRUE', sort_order: '3' },
      { id: uuid(), name: 'Apple',       note: 'Fresh variety · Crisp sweet',      image_url: 'assets/appleimage.jpg',   is_active: 'TRUE', sort_order: '4' },
      { id: uuid(), name: 'Pomegranate', note: 'Deep red · Bold antioxidant',      image_url: 'assets/Pomegranate.jpeg', is_active: 'TRUE', sort_order: '5' },
    ],
    products: [
      {
        id: uuid(), name: 'Fruit Fusion Box — 15 Day Collection', category: 'combo',
        sub_title: '15gms per sachet · All 5 current flavours assorted',
        ribbon_label: 'Starter Pack', image_url: 'assets/all-fruits-web.png',
        features: JSON.stringify(['15 individually moisture-sealed sachets','Assorted across Mango, Banana, Guava, Pomegranate','Perfect intro pack — try all flavours','Ideal for gifting or personal use']),
        price_label: 'Enquire', is_active: 'TRUE', sort_order: '1',
      },
      {
        id: uuid(), name: 'Fruit Fusion Box — 30 Day Collection', category: 'combo',
        sub_title: '15gms per sachet · All 5 current flavours assorted',
        ribbon_label: '🔥 Best Value', image_url: 'assets/all-fruits-web.png',
        features: JSON.stringify(['30 individually moisture-sealed sachets','Assorted across all current flavours','Best value for regular users & families','Juice bars & food businesses — stock up!']),
        price_label: 'Enquire', is_active: 'TRUE', sort_order: '2',
      },
      { id: uuid(), name: 'Mango Powder',       category: 'single', sub_title: 'Alphonso blend · 15gm × 15 sachets · Single flavour box',      ribbon_label: '', image_url: 'assets/mango-web.png',       features: '[]', price_label: 'Enquire for price', is_active: 'TRUE', sort_order: '3' },
      { id: uuid(), name: 'Banana Powder',      category: 'single', sub_title: 'Kerala variety · 15gm × 15 sachets · Single flavour box',       ribbon_label: '', image_url: 'assets/banana-web.png',      features: '[]', price_label: 'Enquire for price', is_active: 'TRUE', sort_order: '4' },
      { id: uuid(), name: 'Guava Powder',       category: 'single', sub_title: 'Sweet-tart variety · 15gm × 15 sachets · Single flavour box',   ribbon_label: '', image_url: 'assets/guava-web.png',       features: '[]', price_label: 'Enquire for price', is_active: 'TRUE', sort_order: '5' },
      { id: uuid(), name: 'Pomegranate Powder', category: 'single', sub_title: 'Bold antioxidant · 15gm × 15 sachets · Single flavour box',     ribbon_label: '', image_url: 'assets/pomegranate-web.png', features: '[]', price_label: 'Enquire for price', is_active: 'TRUE', sort_order: '6' },
      { id: uuid(), name: 'Apple Powder',       category: 'single', sub_title: 'Fresh variety · 15gm × 15 sachets · Single flavour box',        ribbon_label: '', image_url: 'assets/appleimage.jpg',      features: '[]', price_label: 'Enquire for price', is_active: 'TRUE', sort_order: '7' },
    ],
    process_steps: [
      { id: uuid(), step_number: '1', icon: '🌳', title: 'Farm-Fresh Selection',   description: 'Only ripe, premium grade fruits are sourced directly from trusted farms. Quality check at every batch.', sort_order: '1' },
      { id: uuid(), step_number: '2', icon: '🔪', title: 'Cleaning & Preparation', description: 'Fruits are thoroughly cleaned, peeled, and prepared. No additives are introduced at any stage.', sort_order: '2' },
      { id: uuid(), step_number: '3', icon: '🧊', title: 'Flash Freeze at −40°C',  description: 'The prepared fruit is rapidly frozen to −40°C, locking in every nutrient, enzyme, and antioxidant instantly.', sort_order: '3' },
      { id: uuid(), step_number: '4', icon: '💨', title: 'Vacuum Sublimation',      description: 'Under controlled vacuum, ice sublimates directly to vapour. Zero heat means zero nutrient loss.', sort_order: '4' },
      { id: uuid(), step_number: '5', icon: '⚗️', title: 'Ultra-Fine Milling',     description: 'The dried fruit is milled into a smooth, vibrant powder that dissolves instantly in any liquid.', sort_order: '5' },
      { id: uuid(), step_number: '6', icon: '📦', title: 'Sealed in 15gm Sachets', description: 'Packed in moisture-sealed, airtight sachets. Freshness guaranteed from factory to your home with love.', sort_order: '6' },
    ],
    use_cases: [
      { id: uuid(), icon: '🥤', title: 'Instant Fruit Juice',  description: 'Mix 1 sachet with 200ml water — pure fruit juice in seconds. No squeezing, no mess, no sugar added.',    tip: '→ Try: Mango + Chilled Water + Mint',    bg_color: '#f0fdf4', is_active: 'TRUE', sort_order: '1' },
      { id: uuid(), icon: '🥛', title: 'Smoothies & Shakes',   description: 'Blend into your smoothie for an intense natural fruit flavour boost and extra nutrition — without the prep.', tip: '→ Try: Banana + Milk + Honey',           bg_color: '#fdf4ff', is_active: 'TRUE', sort_order: '2' },
      { id: uuid(), icon: '🎂', title: 'Baking & Desserts',    description: 'Add to cakes, cookies, macarons, and ice cream for real fruit flavour — no artificial extracts needed.',   tip: '→ Try: Guava in Panna Cotta',            bg_color: '#fef9f0', is_active: 'TRUE', sort_order: '3' },
      { id: uuid(), icon: '👶', title: 'Baby & Toddler Food',  description: 'Pure, safe, and additive-free — mix a small amount into porridge or purees for natural fruit nutrition.',  tip: '→ Try: Apple in Baby Oatmeal',           bg_color: '#fef9f0', is_active: 'TRUE', sort_order: '4' },
      { id: uuid(), icon: '✈️', title: 'Travel & On-the-Go',  description: 'Lightweight, no refrigeration needed. Drop a sachet in your bag — fresh fruit nutrition, wherever life takes you.', tip: '→ Try: Pomegranate + Sparkling Water', bg_color: '#f0f9ff', is_active: 'TRUE', sort_order: '5' },
      { id: uuid(), icon: '🍽️', title: 'Culinary Flavoring',  description: 'Stir into yoghurt, salad dressings, marinades, or herbal teas for a sophisticated natural fruit touch.',   tip: '→ Try: Mango in Salad Dressing',         bg_color: '#fafaf0', is_active: 'TRUE', sort_order: '6' },
    ],
    reviews: [
      { id: uuid(), author_name: 'Arun K.',     author_role: 'Juice Bar Owner, Kochi', author_emoji: '👨', rating: '5', review_text: '"I run a juice bar in Kochi and was skeptical at first. But the mango powder tastes more real than fresh mango juice. My customers keep asking what I\'m using — it\'s my secret ingredient now!"',                   is_highlight: 'FALSE', is_verified: 'TRUE', is_active: 'TRUE', sort_order: '1' },
      { id: uuid(), author_name: 'Priya M.',    author_role: 'New Mom, Thrissur',      author_emoji: '👩', rating: '5', review_text: '"I was worried about giving powders to my 14-month-old. But seeing the ingredients list — just fruit, nothing else — gave me total confidence. She loves the apple powder in her porridge every morning!"',              is_highlight: 'FALSE', is_verified: 'TRUE', is_active: 'TRUE', sort_order: '2' },
      { id: uuid(), author_name: 'Rahul S.',    author_role: 'Caregiver, Bangalore',   author_emoji: '👴', rating: '5', review_text: '"My 78-year-old father is diabetic and always missed having fruit juice. The doctor approved this since there\'s zero added sugar. The pomegranate flavour is his absolute favourite now."',                             is_highlight: 'TRUE',  is_verified: 'TRUE', is_active: 'TRUE', sort_order: '3' },
      { id: uuid(), author_name: 'Sneha R.',    author_role: 'Travel Blogger, Mumbai', author_emoji: '👩', rating: '5', review_text: '"I\'m a travel blogger and always struggled with nutrition on the road. These sachets changed everything — one pack lasts me an entire trip. The guava in sparkling water is my absolute go-to now!"',              is_highlight: 'FALSE', is_verified: 'TRUE', is_active: 'TRUE', sort_order: '4' },
      { id: uuid(), author_name: 'Meera T.',    author_role: 'Home Baker, Chennai',    author_emoji: '👩', rating: '4', review_text: '"As a baker I\'ve tried so many fruit extracts and they all taste artificial. Uzhar\'s mango powder in my mousse cake was a game changer. Clients actually asked if I used real Alphonso mangoes!"',              is_highlight: 'FALSE', is_verified: 'TRUE', is_active: 'TRUE', sort_order: '5' },
      { id: uuid(), author_name: 'Fitness Hub', author_role: 'Gym Owner, Trivandrum',  author_emoji: '💪', rating: '5', review_text: '"We ordered the 30-sachet box for our gym\'s smoothie counter. Athletes love that it\'s clean — no sugar, no fillers. We\'ll be ordering every month. Easily the best supplement addition we\'ve made this year."', is_highlight: 'FALSE', is_verified: 'TRUE', is_active: 'TRUE', sort_order: '6' },
    ],
    faqs: [
      { id: uuid(), question: 'What is freeze-dried fruit powder?',       answer: 'Freeze-dried fruit powder is made by freezing fresh fruit to −40°C and then removing all moisture under vacuum through sublimation. The result is a concentrated, ultra-fine powder that retains 100% of the fruit\'s nutrients, colour, and flavour — with nothing added.',                                                            is_active: 'TRUE', sort_order: '1' },
      { id: uuid(), question: 'Is there any added sugar or sweetener?',   answer: 'Absolutely not. Our products contain zero added sugar, zero artificial sweeteners, zero maltodextrin, and zero fillers. The only ingredient is the fruit itself. Any sweetness you taste is entirely natural — from the fruit.',                                                                                                      is_active: 'TRUE', sort_order: '2' },
      { id: uuid(), question: 'How do I use the powder?',                 answer: 'Mix 1 sachet (15g) with 150–200ml of water, milk, or any liquid for an instant fruit drink. You can also blend it into smoothies, add it to baked goods, sprinkle on oatmeal, or stir into yoghurt. One sachet = roughly one full serving of fruit.',                                                                                is_active: 'TRUE', sort_order: '3' },
      { id: uuid(), question: 'Is this safe for babies and the elderly?', answer: 'Yes. Our powders contain zero additives, zero sugar, and zero preservatives — just pure fruit. They are ideal for babies (6 months+), toddlers, diabetics, the elderly, and anyone who wants clean nutrition without compromise. Always consult your paediatrician for infants under 12 months.',                                      is_active: 'TRUE', sort_order: '4' },
      { id: uuid(), question: 'How long does the powder last?',           answer: 'Each sachet is moisture-sealed and shelf-stable for up to 12 months from the date of manufacture. No refrigeration needed — store in a cool, dry place. Once opened, consume within 24 hours for best taste.',                                                                                                                          is_active: 'TRUE', sort_order: '5' },
      { id: uuid(), question: 'Do you ship across India?',                answer: 'Yes! We ship pan-India via trusted courier partners. Orders are typically dispatched within 1–2 business days. Delivery takes 3–7 business days depending on your location.',                                                                                                                                                            is_active: 'TRUE', sort_order: '6' },
      { id: uuid(), question: 'How do I place an order?',                 answer: 'Simply add items to your cart on this website and click "Place Order via WhatsApp". You\'ll be connected directly with us on WhatsApp to confirm your order and arrange payment. We accept UPI, bank transfer, and cash on delivery in select areas.',                                                                                  is_active: 'TRUE', sort_order: '7' },
    ],
    site_settings: [
      { key: 'hero',          value: JSON.stringify({ badge: '100% Natural · Zero Additives · Made in India', title_line1: 'Uzhar', title_line2: 'Fruoots', title_caption: 'Freeze Dried Goodness', subtitle: 'Pure fruit goodness in every sachet.', cta_primary: 'Shop Now', cta_secondary: 'Learn the Science' }) },
      { key: 'contact',       value: JSON.stringify({ phone: '+91 98765 43210', email: 'Uzharfruoots@gmail.com', location: 'Tiruppur, Tamilnadu', hours: 'Mon–Sat, 9am–8pm IST', wa_number: '919876543210', instagram: '@uzharfruoots' }) },
      { key: 'process_intro', value: JSON.stringify({ eyebrow: 'The Science of Our Blends', title: 'Freeze-Dried.', title_suffix: 'Not Frozen.', description: "Standard frozen fruits lose nutrients and structure. We use laboratory-grade sublimation to preserve 100% of the fruit's goodness.", highlight_text: '15gms Freeze Dried = 100gms Real Fruit', highlight_sub: 'One sachet = one full fruit serving' }) },
      { key: 'why_us',        value: JSON.stringify({ eyebrow: 'Why Uzhar Fruoots', title: "We're not the same", description: 'Not all fruit powders are equal. See how freeze-drying changes everything.', features: [{icon:'🔬',title:'Science-backed process',desc:'Our freeze-drying method is used in pharmaceutical and space-food industries. We apply the same precision to your daily nutrition.'},{icon:'🌿',title:'Clean label, always',desc:"What you see on the label is what's inside. One ingredient: the fruit. That's the entire ingredients list."},{icon:'❤️',title:'Trusted by parents & elders',desc:'No added sugars means safe for babies, toddlers, diabetics, and the elderly. Nutrition without compromise.'},{icon:'🇮🇳',title:'Proudly Indian, Locally Made',desc:'Sourced from Indian farms, processed with care, delivered to your door. Supporting local agriculture at every step.'}] }) },
      { key: 'footer',        value: JSON.stringify({ tagline: 'Freeze Dried Goodness', description: 'Pure freeze-dried fruit powders made with zero additives. Trusted by juice makers, parents, and health enthusiasts across India.', copyright: '© 2025 Uzhar Fruoots. All rights reserved.' }) },
    ],
  }
}

const SHEET_ORDER = ['marquee_items','stats','flavours','products','process_steps','use_cases','reviews','faqs','site_settings']

export default function SeedPage() {
  const { token } = useContext(TokenContext)
  const [status,  setStatus]  = useState('idle')   // idle | running | done | error
  const [log,     setLog]     = useState([])
  const [current, setCurrent] = useState('')

  function addLog(msg, ok = true) {
    setLog(prev => [...prev, { msg, ok }])
  }

  async function runSeed() {
    setStatus('running')
    setLog([])
    const data = buildSeedData()
    try {
      for (const sheet of SHEET_ORDER) {
        setCurrent(sheet)
        addLog(`Seeding ${sheet}…`)
        await adminSave(sheet, data[sheet], token)
        addLog(`✓ ${sheet} — ${data[sheet].length} rows`, true)
      }
      setCurrent('')
      setStatus('done')
      addLog('All sheets seeded successfully!', true)
    } catch (e) {
      setCurrent('')
      setStatus('error')
      addLog(`✗ Error: ${e.message}`, false)
    }
  }

  return (
    <>
      <div className="page-header">
        <h1>Seed Database</h1>
        <p>Populate all Google Sheet tabs with default content. Safe to run multiple times — existing data will be overwritten.</p>
      </div>

      <div className="card" style={{ maxWidth: 640 }}>
        <div className="card-header"><h2>One-click Data Seed</h2></div>
        <div className="card-body">
          <p style={{ marginBottom: 20, color: 'var(--ink2)', lineHeight: 1.6 }}>
            This will create all 9 sheet tabs in your Google Spreadsheet and fill them with sample data (products, flavours, reviews, FAQs, and more). After seeding, you can edit any content through the admin pages.
          </p>

          {status === 'idle' && (
            <button className="btn btn-primary" onClick={runSeed}>
              Seed All Data
            </button>
          )}

          {status === 'running' && (
            <button className="btn btn-primary" disabled>
              Seeding {current}…
            </button>
          )}

          {status === 'done' && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ color: '#2c5632', fontWeight: 700 }}>Done! All data seeded.</span>
              <button className="btn" onClick={() => { setStatus('idle'); setLog([]) }}>
                Seed Again
              </button>
            </div>
          )}

          {status === 'error' && (
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ color: '#c0392b', fontWeight: 700 }}>Seed failed — see log below.</span>
              <button className="btn" onClick={() => { setStatus('idle'); setLog([]) }}>
                Try Again
              </button>
            </div>
          )}

          {log.length > 0 && (
            <div style={{
              marginTop: 20, padding: '14px 16px', background: 'var(--bg)',
              border: '1px solid var(--border)', borderRadius: 'var(--r)',
              fontFamily: 'monospace', fontSize: '.8rem', lineHeight: 1.8,
            }}>
              {log.map((l, i) => (
                <div key={i} style={{ color: l.ok ? 'var(--ink)' : '#c0392b' }}>{l.msg}</div>
              ))}
            </div>
          )}

          <div style={{
            marginTop: 20, padding: '12px 16px',
            background: '#fef9f0', border: '1px solid #f59e0b',
            borderRadius: 8, fontSize: '.82rem', color: '#92400e', lineHeight: 1.6,
          }}>
            <strong>Important:</strong> After seeding, you must share your Google Spreadsheet as
            <em> "Anyone with the link → Viewer"</em> so the public website can read the data.
            Go to Google Sheets → Share → change "Restricted" → "Anyone with the link" → Viewer.
          </div>
        </div>
      </div>
    </>
  )
}
