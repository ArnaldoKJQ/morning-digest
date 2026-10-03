// ============================================================
// src/fetchWeather.js — Fetches current weather for your city
// ============================================================

const https = require('https');

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('JSON parse error: ' + e.message)); }
      });
    }).on('error', reject);
  });
}

/**
 * Returns a short human-readable weather summary string
 */
async function fetchWeather(config) {
  if (!config.weather.enabled) return null;

  try {
    const { city, apiKey, baseUrl, units } = config.weather;
    const url = `${baseUrl}?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${units}`;
    const data = await fetchJSON(url);

    if (data.cod !== 200) {
      console.warn(`⚠️  Weather API error: ${data.message}`);
      return null;
    }

    const temp = Math.round(data.main.temp);
    const feels = Math.round(data.main.feels_like);
    const desc = data.weather[0]?.description || '';
    const humidity = data.main.humidity;
    const unit = units === 'metric' ? '°C' : '°F';

    return `${city}: ${temp}${unit}, feels like ${feels}${unit}. ${desc}. Humidity ${humidity}%.`;

  } catch (err) {
    console.warn(`⚠️  Could not fetch weather: ${err.message}`);
    return null;
  }
}

module.exports = { fetchWeather };
