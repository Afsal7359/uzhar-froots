/**
 * Uzhar Fruoots — Google Apps Script API
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * STEP 1 — SET ADMIN CREDENTIALS (run once):
 *   Select "setupAdmin" → Click ▶ Run
 *
 * STEP 2 — SET GITHUB TOKEN (run once, needed for image uploads):
 *   1. Go to github.com → Settings → Developer settings → Personal access tokens → Fine-grained
 *   2. Create token with "Contents" read+write permission for your repo
 *   3. Edit setupGitHub() below with your token + repo, then click ▶ Run
 *
 * STEP 3 — DEPLOY:
 *   Deploy → New deployment → Web app → Execute as: Me → Anyone can access
 */

// ─────────────────────────────────────────────────────────────────────────────
// ★ Run setupAdmin() once to save credentials
// ─────────────────────────────────────────────────────────────────────────────
function setupAdmin() {
  PropertiesService.getScriptProperties().setProperties({
      'ADMIN_USER': 'uzharfroot@2026gmail.com',      // ← change this username
    'ADMIN_PASS': 'uzhar@froot#2026!',   
  })
  Logger.log('✅ Admin credentials saved.')
}


// ─────────────────────────────────────────────────────────────────────────────
// GET
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
// POST
// ─────────────────────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    return handleSave(e)
  } catch(err) {
    return out({ error: err.message })
  }
}

// ── FETCH ALL ─────────────────────────────────────────────────────────────────
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
  const props         = PropertiesService.getScriptProperties()
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

  const token  = Utilities.getUuid()
  const expiry = Date.now() + 8 * 60 * 60 * 1000
  props.setProperty('TOKEN_' + token, String(expiry))
  return out({ token: token, expiry: expiry })
}

// ── SAVE ──────────────────────────────────────────────────────────────────────
function handleSave(e) {
  const params    = e.parameter || {}
  const token     = params.token
  const sheetName = params.sheet
  const valuesRaw = params.values

  if (!token)     return out({ error: 'Missing token. Please sign in again.' })
  if (!sheetName) return out({ error: 'Missing sheet name.' })
  if (!verifyToken(token)) return out({ error: 'Session expired. Please sign in again.' })

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

// ── IMAGE UPLOAD → Google Drive ───────────────────────────────────────────────
function handleImageUpload(e) {
  if (!verifyToken(e.parameter.token)) {
    return out({ error: 'Session expired. Please sign in again.' })
  }

  var data     = e.parameter.data
  var mimeType = e.parameter.mimeType || 'image/jpeg'
  var fileName = e.parameter.fileName || ('img_' + Date.now() + '.jpg')

  if (!data) return out({ error: 'No image data received.' })

  // Get or create folder in Drive
  var folderName = 'Uzhar Fruoots Images'
  var folders    = DriveApp.getFoldersByName(folderName)
  var folder     = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName)

  var blob = Utilities.newBlob(Utilities.base64Decode(data), mimeType, fileName)
  var file = folder.createFile(blob)
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)

  // thumbnail URL works in <img> tags without any login
  var url = 'https://drive.google.com/thumbnail?id=' + file.getId() + '&sz=w800'
  return out({ url: url })
}

// ── TOKEN VERIFY ──────────────────────────────────────────────────────────────
function verifyToken(token) {
  if (!token) return false
  const props  = PropertiesService.getScriptProperties()
  const expiry = Number(props.getProperty('TOKEN_' + token) || 0)
  return expiry > 0 && Date.now() <= expiry
}

// ── HELPER ────────────────────────────────────────────────────────────────────
function out(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
}
