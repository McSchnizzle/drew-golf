import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      // Return top 10 scores
      const leaderboard = await kv.get('golf-leaderboard') || [];
      return res.status(200).json(leaderboard);
    }

    if (req.method === 'POST') {
      // Body may be missing or unparsed (e.g. wrong Content-Type)
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) { body = null; }
      }
      if (!body || typeof body !== 'object') {
        return res.status(400).json({ error: 'Invalid input' });
      }
      const { playerName, scoreRelativeToPar, totalStrokes } = body;

      // Validate input - whole numbers within plausible round bounds (rejects NaN-free
      // but absurd values like -1e9 that would permanently own the top spot)
      if (typeof playerName !== 'string' ||
          !Number.isInteger(scoreRelativeToPar) || !Number.isInteger(totalStrokes) ||
          totalStrokes < 1 || totalStrokes > 500 ||
          scoreRelativeToPar < -100 || scoreRelativeToPar > 500 ||
          scoreRelativeToPar >= totalStrokes) {
        return res.status(400).json({ error: 'Invalid input' });
      }

      // Sanitize player name (max 20 chars, alphanumeric + spaces)
      const sanitizedName = playerName.replace(/[^a-zA-Z0-9 ]/g, '').trim().slice(0, 20);
      if (!sanitizedName) {
        return res.status(400).json({ error: 'Invalid input' });
      }

      // Get current leaderboard
      const leaderboard = await kv.get('golf-leaderboard') || [];

      // Add new entry
      const newEntry = {
        playerName: sanitizedName,
        scoreRelativeToPar,
        totalStrokes,
        completedAt: Date.now()
      };
      leaderboard.push(newEntry);

      // Sort by score (lowest first), then by strokes, then by date
      leaderboard.sort((a, b) => {
        if (a.scoreRelativeToPar !== b.scoreRelativeToPar) {
          return a.scoreRelativeToPar - b.scoreRelativeToPar;
        }
        if (a.totalStrokes !== b.totalStrokes) {
          return a.totalStrokes - b.totalStrokes;
        }
        return b.completedAt - a.completedAt; // More recent first for ties
      });

      // Keep top 10
      const top10 = leaderboard.slice(0, 10);

      // Save back to KV
      await kv.set('golf-leaderboard', top10);

      // Find the rank of the new entry (if it made the top 10)
      const newEntryRank = top10.indexOf(newEntry);

      return res.status(200).json({
        success: true,
        rank: newEntryRank >= 0 ? newEntryRank + 1 : null,
        leaderboard: top10
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
