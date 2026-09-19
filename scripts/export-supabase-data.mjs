import { createClient } from '@supabase/supabase-js'
import { mkdirSync, writeFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { resolve } from 'node:path'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing VITE_SUPABASE_URL and/or VITE_SUPABASE_ANON_KEY.\n' +
      'Make sure you run this with --env-file=.env or the variables are exported.'
  )
  process.exit(1)
}

const adminEmail = process.env.EXPORT_ADMIN_EMAIL
const adminPassword = process.env.EXPORT_ADMIN_PASSWORD
const redact = !process.argv.includes('--no-redact')

const TABLES = [
  { name: 'profiles', orderBy: 'id' },
  { name: 'categories', orderBy: 'id' },
  { name: 'events', orderBy: 'id' },
  { name: 'announcements', orderBy: 'id' },
  { name: 'registrations', orderBy: 'id' },
  { name: 'highlights', orderBy: 'id' },
  { name: 'site_settings', orderBy: 'key' },
]

const PAGE_SIZE = 1000
const OUTPUT_DIR = resolve(process.cwd(), 'supabase', 'data')

function redactTicketNumber(ticket) {
  const hash = createHash('sha256').update(String(ticket)).digest('hex')
  return `REDACTED-${hash.slice(0, 12).toUpperCase()}`
}

function redactRegistrations(rows) {
  if (!redact) return rows
  return rows.map((row) => ({
    ...row,
    attendee_email: '[redacted]',
    attendee_grade: row.attendee_grade ?? null,
    notes: null,
    qr_code_data: '[redacted]',
    ticket_number: redactTicketNumber(row.ticket_number),
  }))
}

async function fetchAll(supabase, tableName, orderBy) {
  const all = []
  let from = 0
  let done = false

  while (!done) {
    const to = from + PAGE_SIZE - 1
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order(orderBy)
      .range(from, to)

    if (error) {
      throw new Error(`Failed to fetch ${tableName}: ${error.message}`)
    }

    if (!data || data.length === 0) {
      done = true
      break
    }

    all.push(...data)

    if (data.length < PAGE_SIZE) {
      done = true
    } else {
      from += PAGE_SIZE
    }
  }

  return all
}

async function main() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  let mode = 'anon'

  if (adminEmail && adminPassword) {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    })

    if (authError || !authData.session) {
      console.error(`Admin login failed: ${authError?.message || 'unknown error'}`)
      process.exit(1)
    }

    mode = 'admin'
    console.log(`Signed in as ${adminEmail}.`)
  } else {
    console.warn(
      'No EXPORT_ADMIN_EMAIL / EXPORT_ADMIN_PASSWORD set. ' +
        'Export will be partial because of RLS (no draft/cancelled events, no registrations, etc.).'
    )
  }

  mkdirSync(OUTPUT_DIR, { recursive: true })

  const snapshot = {
    exported_at: new Date().toISOString(),
    mode,
    redacted: redact,
    tables: {},
  }

  for (const { name, orderBy } of TABLES) {
    const rows = await fetchAll(supabase, name, orderBy)
    const output = name === 'registrations' ? redactRegistrations(rows) : rows

    writeFileSync(
      resolve(OUTPUT_DIR, `${name}.json`),
      JSON.stringify(output, null, 2) + '\n'
    )

    snapshot.tables[name] = output.length
    console.log(`${name.padEnd(16)} ${String(output.length).padStart(5)} rows`)
  }

  writeFileSync(
    resolve(OUTPUT_DIR, 'snapshot.json'),
    JSON.stringify(snapshot, null, 2) + '\n'
  )

  console.log('\nSnapshot written to supabase/data/')
  console.log(`Mode: ${mode}, redacted: ${redact}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
