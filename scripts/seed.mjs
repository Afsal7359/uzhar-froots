/**
 * Uzhar Fruoots — Google Sheets Seed Script
 * ──────────────────────────────────────────────────────────────────────────────
 * SETUP (one-time):
 *
 *  1. Go to https://console.cloud.google.com
 *  2. Create a project → Enable "Google Sheets API"
 *  3. IAM & Admin → Service Accounts → Create → download JSON key
 *     Save it as scripts/service-account-key.json
 *  4. Create a blank Google Spreadsheet (keep Sheet1, rename it later)
 *  5. Share the spreadsheet with the service account email (Editor)
 *  6. Copy the Spreadsheet ID from the URL
 *
 * RUN:
 *   cd scripts
 *   npm install
 *   SPREADSHEET_ID=your_id node seed.mjs
 */

import { google } from 'googleapis'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))

const SPREADSHEET_ID = process.env.SPREADSHEET_ID
const KEY_FILE       = process.env.KEY_FILE || join(__dir, 'service-account-key.json')

if (!SPREADSHEET_ID) {
  console.error('\n❌  Set the SPREADSHEET_ID environment variable.\n')
  console.error('   Usage: SPREADSHEET_ID=your_id node seed.mjs\n')
  process.exit(1)
}
if (!existsSync(KEY_FILE)) {
  console.error(`\n❌  Service account key not found at: ${KEY_FILE}`)
  console.error('   Download it from Google Cloud Console → IAM → Service Accounts.\n')
  process.exit(1)
}

const auth   = new google.auth.GoogleAuth({ keyFile: KEY_FILE, scopes: ['https://www.googleapis.com/auth/spreadsheets'] })
const sheets = google.sheets({ version: 'v4', auth })

// ── Helpers ───────────────────────────────────────────────────────────────────
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

async function setupSheet(title, headers, rows) {
  // Create tab if it doesn't exist
  const res = await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID })
  const existing = res.data.sheets.map(s => s.properties.title)

  if (!existing.includes(title)) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: { requests: [{ addSheet: { properties: { title } } }] },
    })
    console.log(`  + Created sheet tab: ${title}`)
  } else {
    await sheets.spreadsheets.values.clear({ spreadsheetId: SPREADSHEET_ID, range: title })
    console.log(`  ~ Cleared sheet tab: ${title}`)
  }

  // Write headers + data
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${title}!A1`,
    valueInputOption: 'RAW',
    requestBody: { values: [headers, ...rows] },
  })
  console.log(`  ✓ Wrote ${rows.length} rows → ${title}`)
}

// ── Seed Data ─────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🍓  Uzhar Fruoots — Seeding Google Sheets...\n')

  // marquee_items
  await setupSheet('marquee_items',
    ['id', 'text', 'is_active', 'sort_order'],
    [
      [uuid(), '100% Natural Fruit',                              'TRUE', '1'],
      [uuid(), 'Zero Added Sugar',                                'TRUE', '2'],
      [uuid(), 'Nutrient Dense',                                  'TRUE', '3'],
      [uuid(), 'No Preservatives',                                'TRUE', '4'],
      [uuid(), 'No Fillers',                                      'TRUE', '5'],
      [uuid(), 'Apple · Mango · Guava · Pomegranate · Banana — 5 Flavours', 'TRUE', '6'],
      [uuid(), 'Made in India 🇮🇳',                               'TRUE', '7'],
      [uuid(), 'No Sugar · No Fillers · No Additives',            'TRUE', '8'],
      [uuid(), 'Pure Fruit Powder',                               'TRUE', '9'],
    ]
  )

  // stats
  await setupSheet('stats',
    ['id', 'prefix', 'number_value', 'suffix', 'label', 'is_bold_label', 'sort_order'],
    [
      [uuid(), '', '500', '+',         'Happy Customers',       'FALSE', '1'],
      [uuid(), '', '5',   ' Flavours', 'Current Flavours',      'FALSE', '2'],
      [uuid(), '', '0',   '% Sugar',   'Zero Added Sugar',      'FALSE', '3'],
      [uuid(), '', '15',  'gms',       '= 100gms of Real Fruit','TRUE',  '4'],
    ]
  )

  // flavours
  await setupSheet('flavours',
    ['id', 'name', 'note', 'image_url', 'is_active', 'sort_order'],
    [
      [uuid(), 'Mango',       'Alphonso blend · Tropical sweet',  'assets/Mango.jpeg',       'TRUE', '1'],
      [uuid(), 'Banana',      'Kerala variety · Creamy energy',   'assets/Banana.jpeg',      'TRUE', '2'],
      [uuid(), 'Guava',       'Sweet-tart aroma · Fibre rich',    'assets/Guava.jpeg',       'TRUE', '3'],
      [uuid(), 'Apple',       'Fresh variety · Crisp sweet',      'assets/appleimage.jpg',   'TRUE', '4'],
      [uuid(), 'Pomegranate', 'Deep red · Bold antioxidant',      'assets/Pomegranate.jpeg', 'TRUE', '5'],
    ]
  )

  // products
  await setupSheet('products',
    ['id', 'name', 'category', 'sub_title', 'ribbon_label', 'image_url', 'features', 'price_label', 'is_active', 'sort_order'],
    [
      [
        uuid(),
        'Fruit Fusion Box — 15 Day Collection', 'combo',
        '15gms per sachet · All 5 current flavours assorted',
        'Starter Pack',
        'assets/all-fruits-web.png',
        JSON.stringify(['15 individually moisture-sealed sachets','Assorted across Mango, Banana, Guava, Pomegranate','Perfect intro pack — try all flavours','Ideal for gifting or personal use']),
        'Enquire', 'TRUE', '1',
      ],
      [
        uuid(),
        'Fruit Fusion Box — 30 Day Collection', 'combo',
        '15gms per sachet · All 5 current flavours assorted',
        '🔥 Best Value',
        'assets/all-fruits-web.png',
        JSON.stringify(['30 individually moisture-sealed sachets','Assorted across all current flavours','Best value for regular users & families','Juice bars & food businesses — stock up!']),
        'Enquire', 'TRUE', '2',
      ],
      [uuid(), 'Mango Powder',       'single', 'Alphonso blend · 15gm × 15 sachets · Single flavour box',      '', 'assets/mango-web.png',        '[]', 'Enquire for price', 'TRUE', '3'],
      [uuid(), 'Banana Powder',      'single', 'Kerala variety · 15gm × 15 sachets · Single flavour box',      '', 'assets/banana-web.png',       '[]', 'Enquire for price', 'TRUE', '4'],
      [uuid(), 'Guava Powder',       'single', 'Sweet-tart variety · 15gm × 15 sachets · Single flavour box',  '', 'assets/guava-web.png',        '[]', 'Enquire for price', 'TRUE', '5'],
      [uuid(), 'Pomegranate Powder', 'single', 'Bold antioxidant · 15gm × 15 sachets · Single flavour box',    '', 'assets/pomegranate-web.png',  '[]', 'Enquire for price', 'TRUE', '6'],
      [uuid(), 'Apple Powder',       'single', 'Fresh variety · 15gm × 15 sachets · Single flavour box',       '', 'assets/appleimage.jpg',       '[]', 'Enquire for price', 'TRUE', '7'],
    ]
  )

  // process_steps
  await setupSheet('process_steps',
    ['id', 'step_number', 'icon', 'title', 'description', 'sort_order'],
    [
      [uuid(), '1', '🌳', 'Farm-Fresh Selection',   'Only ripe, premium grade fruits are sourced directly from trusted farms. Quality check at every batch.', '1'],
      [uuid(), '2', '🔪', 'Cleaning & Preparation', 'Fruits are thoroughly cleaned, peeled, and prepared. No additives are introduced at any stage.', '2'],
      [uuid(), '3', '🧊', 'Flash Freeze at −40°C',  'The prepared fruit is rapidly frozen to −40°C, locking in every nutrient, enzyme, and antioxidant instantly.', '3'],
      [uuid(), '4', '💨', 'Vacuum Sublimation',      'Under controlled vacuum, ice sublimates directly to vapour. Zero heat means zero nutrient loss.', '4'],
      [uuid(), '5', '⚗️', 'Ultra-Fine Milling',      'The dried fruit is milled into a smooth, vibrant powder that dissolves instantly in any liquid.', '5'],
      [uuid(), '6', '📦', 'Sealed in 15gm Sachets', 'Packed in moisture-sealed, airtight sachets. Freshness guaranteed from factory to your home with love.', '6'],
    ]
  )

  // use_cases
  await setupSheet('use_cases',
    ['id', 'icon', 'title', 'description', 'tip', 'bg_color', 'is_active', 'sort_order'],
    [
      [uuid(), '🥤', 'Instant Fruit Juice',   'Mix 1 sachet with 200ml water — pure fruit juice in seconds. No squeezing, no mess, no sugar added.',    '→ Try: Mango + Chilled Water + Mint',   '#f0fdf4', 'TRUE', '1'],
      [uuid(), '🥛', 'Smoothies & Shakes',    'Blend into your smoothie for an intense natural fruit flavour boost and extra nutrition — without the prep.','→ Try: Banana + Milk + Honey',          '#fdf4ff', 'TRUE', '2'],
      [uuid(), '🎂', 'Baking & Desserts',     'Add to cakes, cookies, macarons, and ice cream for real fruit flavour — no artificial extracts needed.',   '→ Try: Guava in Panna Cotta',           '#fef9f0', 'TRUE', '3'],
      [uuid(), '👶', 'Baby & Toddler Food',   'Pure, safe, and additive-free — mix a small amount into porridge or purees for natural fruit nutrition.',  '→ Try: Apple in Baby Oatmeal',          '#fef9f0', 'TRUE', '4'],
      [uuid(), '✈️', 'Travel & On-the-Go',    'Lightweight, no refrigeration needed. Drop a sachet in your bag — fresh fruit nutrition, wherever life takes you.','→ Try: Pomegranate + Sparkling Water','#f0f9ff', 'TRUE', '5'],
      [uuid(), '🍽️', 'Culinary Flavoring',   'Stir into yoghurt, salad dressings, marinades, or herbal teas for a sophisticated natural fruit touch.',   '→ Try: Mango in Salad Dressing',        '#fafaf0', 'TRUE', '6'],
    ]
  )

  // reviews
  await setupSheet('reviews',
    ['id', 'author_name', 'author_role', 'author_emoji', 'rating', 'review_text', 'is_highlight', 'is_verified', 'is_active', 'sort_order'],
    [
      [uuid(), 'Arun K.',     'Juice Bar Owner, Kochi',  '👨', '5', '"I run a juice bar in Kochi and was skeptical at first. But the mango powder tastes more real than fresh mango juice. My customers keep asking what I\'m using — it\'s my secret ingredient now!"',                                                                                            'FALSE', 'TRUE', 'TRUE', '1'],
      [uuid(), 'Priya M.',    'New Mom, Thrissur',       '👩', '5', '"I was worried about giving powders to my 14-month-old. But seeing the ingredients list — just fruit, nothing else — gave me total confidence. She loves the apple powder in her porridge every morning!"',                                                                                    'FALSE', 'TRUE', 'TRUE', '2'],
      [uuid(), 'Rahul S.',    'Caregiver, Bangalore',    '👴', '5', '"My 78-year-old father is diabetic and always missed having fruit juice. The doctor approved this since there\'s zero added sugar. The pomegranate flavour is his absolute favourite now."',                                                                                                    'TRUE',  'TRUE', 'TRUE', '3'],
      [uuid(), 'Sneha R.',    'Travel Blogger, Mumbai',  '👩', '5', '"I\'m a travel blogger and always struggled with nutrition on the road. These sachets changed everything — one pack lasts me an entire trip. The guava in sparkling water is my absolute go-to now!"',                                                                                         'FALSE', 'TRUE', 'TRUE', '4'],
      [uuid(), 'Meera T.',    'Home Baker, Chennai',     '👩', '4', '"As a baker I\'ve tried so many fruit extracts and they all taste artificial. Uzhar\'s mango powder in my mousse cake was a game changer. Clients actually asked if I used real Alphonso mangoes!"',                                                                                            'FALSE', 'TRUE', 'TRUE', '5'],
      [uuid(), 'Fitness Hub', 'Gym Owner, Trivandrum',   '💪', '5', '"We ordered the 30-sachet box for our gym\'s smoothie counter. Athletes love that it\'s clean — no sugar, no fillers. We\'ll be ordering every month. Easily the best supplement addition we\'ve made this year."',                                                                           'FALSE', 'TRUE', 'TRUE', '6'],
    ]
  )

  // faqs
  await setupSheet('faqs',
    ['id', 'question', 'answer', 'is_active', 'sort_order'],
    [
      [uuid(), 'What is freeze-dried fruit powder?',       'Freeze-dried fruit powder is made by freezing fresh fruit to −40°C and then removing all moisture under vacuum through sublimation. The result is a concentrated, ultra-fine powder that retains 100% of the fruit\'s nutrients, colour, and flavour — with nothing added.',                                                         'TRUE', '1'],
      [uuid(), 'Is there any added sugar or sweetener?',   'Absolutely not. Our products contain zero added sugar, zero artificial sweeteners, zero maltodextrin, and zero fillers. The only ingredient is the fruit itself. Any sweetness you taste is entirely natural — from the fruit.',                                                                                                     'TRUE', '2'],
      [uuid(), 'How do I use the powder?',                 'Mix 1 sachet (15g) with 150–200ml of water, milk, or any liquid for an instant fruit drink. You can also blend it into smoothies, add it to baked goods, sprinkle on oatmeal, or stir into yoghurt. One sachet = roughly one full serving of fruit.',                                                                               'TRUE', '3'],
      [uuid(), 'Is this safe for babies and the elderly?', 'Yes. Our powders contain zero additives, zero sugar, and zero preservatives — just pure fruit. They are ideal for babies (6 months+), toddlers, diabetics, the elderly, and anyone who wants clean nutrition without compromise. Always consult your paediatrician for infants under 12 months.',                                     'TRUE', '4'],
      [uuid(), 'How long does the powder last?',           'Each sachet is moisture-sealed and shelf-stable for up to 12 months from the date of manufacture. No refrigeration needed — store in a cool, dry place. Once opened, consume within 24 hours for best taste.',                                                                                                                       'TRUE', '5'],
      [uuid(), 'Do you ship across India?',                'Yes! We ship pan-India via trusted courier partners. Orders are typically dispatched within 1–2 business days. Delivery takes 3–7 business days depending on your location.',                                                                                                                                                         'TRUE', '6'],
      [uuid(), 'How do I place an order?',                 'Simply add items to your cart on this website and click "Place Order via WhatsApp". You\'ll be connected directly with us on WhatsApp to confirm your order and arrange payment. We accept UPI, bank transfer, and cash on delivery in select areas.',                                                                               'TRUE', '7'],
    ]
  )

  // site_settings
  await setupSheet('site_settings',
    ['key', 'value'],
    [
      ['hero',          JSON.stringify({ badge:'100% Natural · Zero Additives · Made in India', title_line1:'Uzhar', title_line2:'Fruoots', title_caption:'Freeze Dried Goodness', subtitle:'Pure fruit goodness in every sachet.', cta_primary:'Shop Now', cta_secondary:'Learn the Science' })],
      ['contact',       JSON.stringify({ phone:'+91 98765 43210', email:'Uzharfruoots@gmail.com', location:'Tiruppur, Tamilnadu', hours:'Mon–Sat, 9am–8pm IST', wa_number:'919876543210', instagram:'@uzharfruoots' })],
      ['process_intro', JSON.stringify({ eyebrow:'The Science of Our Blends', title:'Freeze-Dried.', title_suffix:'Not Frozen.', description:"Standard frozen fruits lose nutrients and structure. We use laboratory-grade sublimation to preserve 100% of the fruit's goodness.", highlight_text:'15gms = 4x15 = 60gms of Fruit', highlight_sub:'One sachet equals a full fruit serving' })],
      ['why_us',        JSON.stringify({ eyebrow:'Why Uzhar Fruoots', title:"We're not the same", description:'Not all fruit powders are equal. See how freeze-drying changes everything.', features:[{icon:'🔬',title:'Science-backed process',desc:'Our freeze-drying method is used in pharmaceutical and space-food industries. We apply the same precision to your daily nutrition.'},{icon:'🌿',title:'Clean label, always',desc:'What you see on the label is what\'s inside. One ingredient: the fruit. That\'s the entire ingredients list.'},{icon:'❤️',title:'Trusted by parents & elders',desc:'No added sugars means safe for babies, toddlers, diabetics, and the elderly. Nutrition without compromise.'},{icon:'🇮🇳',title:'Proudly Indian, Locally Made',desc:'Sourced from Indian farms, processed with care, delivered to your door. Supporting local agriculture at every step.'}] })],
      ['footer',        JSON.stringify({ tagline:'Freeze Dried Goodness', description:'Pure freeze-dried fruit powders made with zero additives. Trusted by juice makers, parents, and health enthusiasts across India.', copyright:'© 2025 Uzhar Fruoots. All rights reserved.' })],
    ]
  )

  console.log('\n✅  Seed complete! Your Google Sheet is ready.\n')
  console.log('   Next steps:')
  console.log('   1. Share the spreadsheet as "Anyone with the link can VIEW"')
  console.log('   2. Copy VITE_SHEETS_ID=' + SPREADSHEET_ID + ' into your .env')
  console.log('   3. Add your VITE_SHEETS_API_KEY and VITE_GOOGLE_CLIENT_ID')
  console.log('   4. Run: npm install && npm run dev\n')
}

main().catch(e => {
  console.error('\n❌  Seed failed:', e.message)
  if (e.message.includes('permission')) {
    console.error('   → Make sure you shared the spreadsheet with the service account email (Editor).')
  }
  process.exit(1)
})
