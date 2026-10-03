// ============================================================
// index.js — Morning Digest Entry Point
// Run: node index.js
// ============================================================

const fs = require('fs');
const path = require('path');
const config = require('./config/config');
const { fetchAllNews } = require('./src/fetchNews');
const { fetchWeather } = require('./src/fetchWeather');
const { summarizeWithGrok } = require('./src/summarize');
const { speak } = require('./src/speak');

async function run() {
  console.log('\n========================================');
  console.log('  🌅 MORNING DIGEST — Starting...');
  console.log(`  📅 ${new Date().toDateString()}`);
  console.log('========================================\n');

  try {
    // 1. Fetch weather
    const weatherSummary = await fetchWeather(config);
    if (weatherSummary) console.log(`✅ Weather: ${weatherSummary}\n`);

    // 2. Fetch news
    const newsData = await fetchAllNews(config);
    const totalArticles = Object.values(newsData).flat().length;
    console.log(`✅ Fetched ${totalArticles} articles total\n`);

    if (totalArticles === 0) {
      console.error('❌ No articles fetched. Check your NEWS_API_KEY and internet connection.');
      process.exit(1);
    }

    // 3. Summarize with Grok
    const digest = await summarizeWithGrok(newsData, weatherSummary, config);

    // 4. Print to console
    if (config.output.printToConsole) {
      console.log('\n========================================');
      console.log('  YOUR MORNING DIGEST');
      console.log('========================================\n');
      console.log(digest);
      console.log('\n========================================\n');
    }

    // 5. Save to file
    if (config.output.saveToFile) {
      const dir = config.output.outputDir;
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const filename = `digest-${new Date().toISOString().split('T')[0]}.txt`;
      const filepath = path.join(dir, filename);
      fs.writeFileSync(filepath, digest, 'utf8');
      console.log(`💾 Saved to: ${filepath}`);
    }

    // 6. Speak the digest
    await speak(digest, config);

    console.log('\n✅ Done! Have a great day.\n');

  } catch (err) {
    console.error('\n❌ Error:', err.message);
    process.exit(1);
  }
}

run();
