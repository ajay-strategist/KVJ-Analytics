/**
 * Non-Destructive Production Database Backup Utility (REST API via Service Role)
 *
 * This script exports all production data from the configured Supabase project
 * into local JSON files in a timestamped backup directory.
 *
 * READ-ONLY: Executes only SELECT / GET operations.
 * ZERO RISK: No mutations, drops, truncates, or writes are performed on the remote database.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment variables from .env.local
const envPath = path.resolve(__dirname, '../.env.local');
if (!fs.existsSync(envPath)) {
  console.error('Error: .env.local not found at', envPath);
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    env[match[1]] = value.trim();
  }
});

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
const SERVICE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  process.exit(1);
}

const TABLES = [
  'profiles',
  'courses',
  'modules',
  'lessons',
  'enrollments',
  'mock_tests',
  'questions',
  'test_attempts',
  'batches',
  'batch_students',
  'blog_posts',
  'leads',
  'inquiries',
  'orders',
  'unlock_codes'
];

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = path.resolve(__dirname, `../backups/db_${timestamp}`);

fs.mkdirSync(backupDir, { recursive: true });
console.log(`========================================================`);
console.log(`KVJ Analytics — Read-Only Production Database Backup`);
console.log(`Target: ${SUPABASE_URL}`);
console.log(`Destination: ${backupDir}`);
console.log(`========================================================\n`);

function fetchTablePage(table, offset = 0, limit = 1000) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/rest/v1/${table}?select=*&limit=${limit}&offset=${offset}`);
    const options = {
      method: 'GET',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const records = JSON.parse(data);
            resolve(records);
          } catch (e) {
            reject(new Error(`Failed to parse JSON for ${table}: ${e.message}`));
          }
        } else {
          console.warn(`⚠ [${table}] offset ${offset} HTTP ${res.statusCode}: ${data}`);
          resolve(null);
        }
      });
    }).on('error', reject);
  });
}

async function fetchTable(table) {
  let allRecords = [];
  let offset = 0;
  const limit = 1000;

  while (true) {
    const page = await fetchTablePage(table, offset, limit);
    if (!page || page.length === 0) break;
    allRecords = allRecords.concat(page);
    if (page.length < limit) break;
    offset += limit;
  }

  const filePath = path.join(backupDir, `${table}.json`);
  fs.writeFileSync(filePath, JSON.stringify(allRecords, null, 2), 'utf8');
  console.log(`✔ [${table}] Exported ${allRecords.length} records -> ${path.basename(filePath)}`);
  return { table, count: allRecords.length, status: 'SUCCESS' };
}

function fetchAuthUsers() {
  return new Promise((resolve, reject) => {
    const url = new URL(`${SUPABASE_URL}/auth/v1/admin/users?per_page=1000`);
    const options = {
      method: 'GET',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const parsed = JSON.parse(data);
            const users = parsed.users || [];
            const filePath = path.join(backupDir, `auth_users.json`);
            fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf8');
            console.log(`✔ [auth.users] Exported ${users.length} users -> ${path.basename(filePath)}`);
            resolve({ table: 'auth_users', count: users.length, status: 'SUCCESS' });
          } catch (e) {
            reject(new Error(`Failed to parse auth users: ${e.message}`));
          }
        } else {
          console.warn(`⚠ [auth.users] HTTP ${res.statusCode}: ${data}`);
          resolve({ table: 'auth_users', count: 0, status: `HTTP_${res.statusCode}` });
        }
      });
    }).on('error', err => {
      reject(err);
    });
  });
}

async function runBackup() {
  const summary = [];
  try {
    for (const table of TABLES) {
      const res = await fetchTable(table);
      summary.push(res);
    }

    const authRes = await fetchAuthUsers();
    summary.push(authRes);

    const manifest = {
      timestamp: new Date().toISOString(),
      supabaseUrl: SUPABASE_URL,
      backupDir,
      tables: summary
    };
    fs.writeFileSync(path.join(backupDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

    console.log(`\n========================================================`);
    console.log(`Backup completed successfully!`);
    console.log(`Manifest written to: ${path.join(backupDir, 'manifest.json')}`);
    console.log(`========================================================`);
  } catch (err) {
    console.error('Backup failed:', err);
    process.exit(1);
  }
}

runBackup();
