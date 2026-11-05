/**
 * Non-Destructive Production Storage Backup Utility
 *
 * This script downloads all files from Supabase Storage buckets
 * into a local timestamped directory.
 *
 * READ-ONLY: Executes only GET / download operations.
 * ZERO RISK: No deletion or overwrite of remote storage files.
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

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupDir = path.resolve(__dirname, `../backups/storage_${timestamp}`);
fs.mkdirSync(backupDir, { recursive: true });

console.log(`========================================================`);
console.log(`KVJ Analytics — Read-Only Production Storage Backup`);
console.log(`Target: ${SUPABASE_URL}`);
console.log(`Destination: ${backupDir}`);
console.log(`========================================================\n`);

function request(options, postData) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: Buffer.concat(chunks)
        });
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function listBuckets() {
  const url = new URL(`${SUPABASE_URL}/storage/v1/bucket`);
  const res = await request({
    hostname: url.hostname,
    port: 443,
    path: url.pathname,
    method: 'GET',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`
    }
  });

  if (res.statusCode >= 200 && res.statusCode < 300) {
    return JSON.parse(res.data.toString('utf8'));
  }
  throw new Error(`Failed to list buckets: HTTP ${res.statusCode} ${res.data.toString()}`);
}

async function listObjects(bucketId, prefix = '') {
  const url = new URL(`${SUPABASE_URL}/storage/v1/object/list/${bucketId}`);
  const payload = JSON.stringify({
    prefix,
    limit: 1000,
    offset: 0,
    sortBy: { column: 'name', order: 'asc' }
  });

  const res = await request({
    hostname: url.hostname,
    port: 443,
    path: url.pathname,
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload)
    }
  }, payload);

  if (res.statusCode >= 200 && res.statusCode < 300) {
    return JSON.parse(res.data.toString('utf8'));
  }
  throw new Error(`Failed to list objects in ${bucketId}: HTTP ${res.statusCode} ${res.data.toString()}`);
}

async function downloadObject(bucketId, objectName, outPath) {
  const url = new URL(`${SUPABASE_URL}/storage/v1/object/public/${bucketId}/${objectName}`);
  const res = await request({
    hostname: url.hostname,
    port: 443,
    path: url.pathname,
    method: 'GET',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`
    }
  });

  if (res.statusCode >= 200 && res.statusCode < 300) {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, res.data);
    console.log(`✔ [${bucketId}] Downloaded ${objectName} (${res.data.length} bytes)`);
  } else {
    console.warn(`⚠ [${bucketId}] Failed to download ${objectName}: HTTP ${res.statusCode}`);
  }
}

async function runStorageBackup() {
  try {
    const buckets = await listBuckets();
    console.log(`Found ${buckets.length} bucket(s): ${buckets.map(b => b.name).join(', ')}\n`);

    for (const b of buckets) {
      console.log(`Checking bucket: ${b.name} (id: ${b.id})`);
      const objects = await listObjects(b.id);
      for (const obj of objects) {
        if (obj.id) {
          // File object
          const out = path.join(backupDir, b.id, obj.name);
          await downloadObject(b.id, obj.name, out);
        } else {
          // Folder
          const subObjects = await listObjects(b.id, obj.name);
          for (const sub of subObjects) {
            const fullPath = `${obj.name}/${sub.name}`;
            const out = path.join(backupDir, b.id, fullPath);
            await downloadObject(b.id, fullPath, out);
          }
        }
      }
    }

    console.log(`\n========================================================`);
    console.log(`Storage backup complete! Output: ${backupDir}`);
    console.log(`========================================================`);
  } catch (err) {
    console.error('Storage backup error:', err);
    process.exit(1);
  }
}

runStorageBackup();

