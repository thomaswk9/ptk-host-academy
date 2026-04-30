// PTK Host Academy — server.js
// Serves static files from /public and provides a leaderboard API
// backed by a JSON file that persists across requests on the same instance.

import express from 'express';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 8080;

// Where to store the leaderboard. On Render, /tmp persists for the lifetime
// of the instance but resets on restart. For permanent storage, attach a Disk.
const LB_PATH = process.env.LEADERBOARD_PATH || '/tmp/ptk-leaderboard.json';
const MAX_ENTRIES = 50;

app.use(express.json({ limit: '256kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Read leaderboard
async function readLB() {
  try {
    const data = await fs.readFile(LB_PATH, 'utf8');
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Write leaderboard
async function writeLB(entries) {
  await fs.writeFile(LB_PATH, JSON.stringify(entries, null, 2), 'utf8');
}

// GET — fetch top scores
app.get('/api/leaderboard', async (req, res) => {
  const entries = await readLB();
  // Return top 20 by default
  res.json({ entries: entries.slice(0, 20) });
});

// POST — submit a score
app.post('/api/leaderboard', async (req, res) => {
  const { name, score, rating, date } = req.body || {};
  if (typeof name !== 'string' || !name.trim() || typeof score !== 'number') {
    return res.status(400).json({ error: 'Invalid entry' });
  }
  // Light sanitisation — cap name length, strip control chars
  const cleanName = name.trim().slice(0, 32).replace(/[\x00-\x1F\x7F]/g, '');
  const cleanRating = typeof rating === 'string' ? rating.slice(0, 32) : '';
  const cleanDate = typeof date === 'string' ? date.slice(0, 16) : new Date().toLocaleDateString('en-GB');

  const entry = {
    name: cleanName,
    score: Math.round(score),
    rating: cleanRating,
    date: cleanDate,
    submittedAt: new Date().toISOString(),
  };

  let entries = await readLB();
  entries = [...entries, entry]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_ENTRIES);

  try {
    await writeLB(entries);
  } catch (err) {
    console.error('Failed to write LB:', err);
    // Still return success — at least the in-memory result is correct
  }

  res.json({ entries: entries.slice(0, 20) });
});

// POST — track an affiliate product click for future analytics.
// Stored alongside the leaderboard in /tmp; for permanent persistence
// attach a Render Disk (see DEPLOY.md).
const CLICK_PATH = process.env.CLICK_LOG_PATH || '/tmp/ptk-clicks.jsonl';
app.post('/api/track-click', async (req, res) => {
  const { productId, retailer, ts } = req.body || {};
  if (typeof productId !== 'string' || typeof retailer !== 'string') {
    return res.status(400).json({ error: 'Invalid click event' });
  }
  const event = {
    productId: productId.slice(0, 64),
    retailer: retailer.slice(0, 64),
    ts: typeof ts === 'number' ? ts : Date.now(),
    ip: (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim().slice(0, 45),
    ua: (req.headers['user-agent'] || '').slice(0, 200),
  };
  try {
    // Append-only JSONL — easy to grep/aggregate later
    await fs.appendFile(CLICK_PATH, JSON.stringify(event) + '\n', 'utf8');
  } catch (err) {
    console.error('Failed to write click log:', err);
  }
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`PTK Host Academy running on port ${PORT}`);
  console.log(`Leaderboard path: ${LB_PATH}`);
  console.log(`Click log path: ${CLICK_PATH}`);
});
