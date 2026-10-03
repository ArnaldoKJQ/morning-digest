// ============================================================
// MORNING DIGEST — CONFIG
// Edit this file to customize your digest without touching code
// ============================================================

module.exports = {
  ai: {
    apiKey: process.env.GROK_API_KEY || "YOUR_GROQ_API_KEY_HERE",
    model: "llama-3.1-8b-instant",
    baseUrl: "https://api.groq.com/openai/v1",
    maxTokens: 1500,
  },

  // --- News Sources ---
  // Add or remove sources freely. Each entry is fetched and summarized.
  news: {
    sources: [
      {
        name: "Malaysia General",
        url:
          "https://gnews.io/api/v4/top-headlines?country=my&lang=en&max=5&apikey=" +
          (process.env.NEWS_API_KEY || "YOUR_GNEWS_KEY"),
        category: "malaysia",
      },
      {
        name: "Malaysia Business",
        url:
          "https://gnews.io/api/v4/top-headlines?country=my&topic=business&lang=en&max=5&apikey=" +
          (process.env.NEWS_API_KEY || "YOUR_GNEWS_KEY"),
        category: "finance",
      },
      {
        name: "Global Tech & ERP",
        url:
          "https://gnews.io/api/v4/search?q=ERP+NetSuite+enterprise+software&lang=en&max=5&apikey=" +
          (process.env.NEWS_API_KEY || "YOUR_GNEWS_KEY"),
        category: "erp",
      },
      {
        name: "Global Finance",
        url:
          "https://gnews.io/api/v4/top-headlines?topic=business&lang=en&max=5&apikey=" +
          (process.env.NEWS_API_KEY || "YOUR_GNEWS_KEY"),
        category: "finance",
      },
    ],
    maxArticlesPerSource: 5, // how many articles to pull per source
  },

  // --- Weather ---
  weather: {
    enabled: true,
    city: "Kuala Lumpur", // change to your city
    apiKey: process.env.WEATHER_API_KEY || "YOUR_OPENWEATHER_KEY",
    baseUrl: "https://api.openweathermap.org/data/2.5/weather",
    units: "metric", // 'metric' = Celsius, 'imperial' = Fahrenheit
  },

  // --- Digest Persona ---
  // This tells the AI how to frame your digest
  persona: {
    role: "ERP consultant and full-stack developer based in Malaysia",
    interests: [
      "NetSuite and ERP industry updates",
      "Malaysia financial and legal regulations",
      "Accounting standards (MFRS, IFRS)",
      "Currency and market movements (especially MYR)",
      "Tech and software development news",
      "Global economic shifts that affect businesses",
    ],
    digestStyle:
      "concise bullet points, prioritize actionable insights, flag anything urgent",
  },

  // --- Text-to-Speech ---
  tts: {
    enabled: true,
    // On laptop (macOS): 'say', on Linux/Termux: 'espeak' or 'termux-tts-speak'
    // Script will auto-detect, but you can force one here:
    engine: "auto", // 'auto' | 'say' | 'espeak' | 'termux'
    rate: 180, // words per minute (espeak)
    voice: "", // leave blank for default voice
  },

  // --- Output ---
  output: {
    printToConsole: true, // show text in terminal
    saveToFile: true, // save digest to a .txt file
    outputDir: "./digests", // folder where digests are saved
  },
};
