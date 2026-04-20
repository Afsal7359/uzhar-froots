/**
 * Uzhar Fruoots — Google Apps Script API
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * STEP 1 — SET YOUR ADMIN CREDENTIALS (do this FIRST, only once):
 *   1. In the Apps Script editor, open the function list (top toolbar)
 *   2. Select "setupAdmin" from the dropdown
 *   3. Click ▶ Run
 *   4. Change the username/password in that function below before running
 *
 * STEP 2 — DEPLOY:
 *   1. Deploy → New deployment → Web app
 *   2. Execute as: Me
 *   3. Who has access: Anyone
 *   4. Copy the Web app URL → paste in .env as VITE_SCRIPT_URL=...
 *
 * STEP 3 — TO CHANGE PASSWORD LATER:
 *   Edit setupAdmin() below → Run it again
 */

// ─────────────────────────────────────────────────────────────────────────────
// ★ CHANGE THESE then run setupAdmin() once from the Apps Script editor
// ─────────────────────────────────────────────────────────────────────────────
function setupAdmin() {
  PropertiesService.getScriptProperties().setProperties({
    'ADMIN_USER': 'uzhar_admin',      // ← change this username
    'ADMIN_PASS': 'Uzhar@2025!',      // ← change this password
  })
  Logger.log('✅ Admin credentials saved.')
}

// ─────────────────────────────────────────────────────────────────────────────
// GET — used for: read data + login + fetchAll
// ─────────────────────────────────────────────────────────────────────────────
function doGet(e) {
  try {
    const action = e.parameter.action || 'read'
    if (action === 'login')    return handleLogin(e)
    if (action === 'fetchAll') return handleFetchAll()
    return handleRead(e)
  } catch(err) {
    return out({ error: err.message })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST — used for: save data (avoids URL length limits)
// ─────────────────────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    return handleSave(e)
  } catch(err) {
    return out({ error: err.message })
  }
}

// ── FETCH ALL (single request — returns every sheet at once) ──────────────────
function handleFetchAll() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet()
  const names = [
    'marquee_items','stats','flavours','products',
    'process_steps','use_cases','reviews','faqs','site_settings'
  ]
  const data = {}
  names.forEach(function(name) {
    const tab = ss.getSheetByName(name)
    data[name] = tab ? tab.getDataRange().getValues() : []
  })
  return out({ data: data })
}

// ── READ ──────────────────────────────────────────────────────────────────────
function handleRead(e) {
  const sheetName = e.parameter.sheet
  if (!sheetName) return out({ error: 'Missing ?sheet= parameter' })

  const tab = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName)
  if (!tab) return out({ values: [] })

  return out({ values: tab.getDataRange().getValues() })
}

// ── LOGIN ─────────────────────────────────────────────────────────────────────
function handleLogin(e) {
  const props    = PropertiesService.getScriptProperties()
  const expected_user = props.getProperty('ADMIN_USER')
  const expected_pass = props.getProperty('ADMIN_PASS')

  if (!expected_user || !expected_pass) {
    return out({ error: 'Admin not set up yet. Run setupAdmin() in Apps Script editor.' })
  }

  const user = e.parameter.user || ''
  const pass = e.parameter.pass || ''

  if (user !== expected_user || pass !== expected_pass) {
    return out({ error: 'Invalid username or password.' })
  }

  // Generate a session token valid for 8 hours
  const token  = Utilities.getUuid()
  const expiry = Date.now() + 8 * 60 * 60 * 1000
  props.setProperty('TOKEN_' + token, String(expiry))

  return out({ token: token, expiry: expiry })
}

// ── SAVE ──────────────────────────────────────────────────────────────────────
function handleSave(e) {
  // Read from POST body (form-encoded) or GET params
  const params = e.parameter || {}

  const token     = params.token
  const sheetName = params.sheet
  const valuesRaw = params.values

  if (!token)     return out({ error: 'Missing token. Please sign in again.' })
  if (!sheetName) return out({ error: 'Missing sheet name.' })

  // Verify token
  const props  = PropertiesService.getScriptProperties()
  const expiry = Number(props.getProperty('TOKEN_' + token) || 0)
  if (!expiry || Date.now() > expiry) {
    return out({ error: 'Session expired. Please sign in again.' })
  }

  const values = JSON.parse(valuesRaw || '[]')

  const ss  = SpreadsheetApp.getActiveSpreadsheet()
  let   tab = ss.getSheetByName(sheetName)
  if (!tab) {
    tab = ss.insertSheet(sheetName)
  } else {
    tab.clearContents()
  }

  if (values.length > 0) {
    tab.getRange(1, 1, values.length, values[0].length).setValues(values)
  }

  return out({ ok: true, rows: values.length - 1 })
}

// ── HELPER ────────────────────────────────────────────────────────────────────
function out(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
}
