// ============================================================
// src/fetchNews.js — Fetches articles from all configured sources
// ============================================================

const https = require('https');

/**
 * Fetch JSON from a URL (no external dependencies needed)
 */
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Failed to parse JSON: ' + e.message));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Fetch all news sources defined in config
 * Returns a structured object grouped by category
 */
async function fetchAllNews(config) {
  const results = {};

  for (const source of config.news.sources) {
    try {
      console.log(`📰 Fetching: ${source.name}...`);
      const data = await fetchJSON(source.url);

      const articles = (data.articles || [])
        .slice(0, config.news.maxArticlesPerSource)
        .map(a => ({
          title: a.title,
          description: a.description,
          source: a.source?.name,
          url: a.url,
          publishedAt: a.publishedAt,
        }))
        .filter(a => a.title && !a.title.includes('[Removed]'));

      if (!results[source.category]) results[source.category] = [];
      results[source.category].push(...articles);

    } catch (err) {
      console.warn(`⚠️  Could not fetch ${source.name}: ${err.message}`);
    }
  }

  return results;
}

module.exports = { fetchAllNews };
