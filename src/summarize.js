// ============================================================
// src/summarize.js — Sends news to Grok AI for smart summarization
// ============================================================

const https = require('https');

/**
 * POST request helper
 */
function postJSON(url, headers, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const urlObj = new URL(url);

    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(responseData)); }
        catch (e) { reject(new Error('JSON parse error: ' + e.message)); }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

/**
 * Build the prompt based on user persona and news articles
 */
function buildPrompt(newsData, weatherSummary, persona) {
  const today = new Date().toDateString();

  let prompt = `You are preparing a morning digest for ${today} for someone who is a ${persona.role}.

Their key interests are:
${persona.interests.map(i => `- ${i}`).join('\n')}

Digest style: ${persona.digestStyle}

`;

  if (weatherSummary) {
    prompt += `## Weather\n${weatherSummary}\n\n`;
  }

  prompt += `## News Articles to Summarize\n\n`;

  for (const [category, articles] of Object.entries(newsData)) {
    if (!articles.length) continue;
    prompt += `### ${category.toUpperCase()}\n`;
    articles.forEach((a, i) => {
      prompt += `${i + 1}. **${a.title}**\n`;
      if (a.description) prompt += `   ${a.description}\n`;
      prompt += `   Source: ${a.source || 'Unknown'}\n\n`;
    });
  }

  prompt += `
Please write a concise morning briefing in this structure:
1. 🌤️ Weather (one sentence)
2. 🇲🇾 Malaysia Highlights (2-3 bullet points)
3. 💼 ERP & Tech Watch (2-3 bullet points, flag anything relevant to NetSuite or enterprise software)
4. 💰 Finance & Market (2-3 bullet points, flag significant price movements or regulatory changes)
5. ⚠️ Must-Know Today (1-2 urgent items if any, otherwise skip)

Keep each bullet point to 1-2 sentences. Be direct, no fluff. Speak like a knowledgeable colleague, not a news anchor.`;

  return prompt;
}

/**
 * Call Grok API and return summarized digest text
 */
async function summarizeWithGrok(newsData, weatherSummary, config) {
  console.log('🤖 Calling Grok AI for summarization...');

  const prompt = buildPrompt(newsData, weatherSummary, config.persona);

  try {
    const response = await postJSON(
      `${config.ai.baseUrl}/chat/completions`,
      {
        'Authorization': `Bearer ${config.ai.apiKey}`,
      },
      {
        model: config.ai.model,
        max_tokens: config.ai.maxTokens,
        messages: [
          { role: 'user', content: prompt }
        ],
      }
    );

    if (response.error) {
      throw new Error(response.error.message || 'Grok API error');
    }

    return response.choices?.[0]?.message?.content || 'No summary returned.';

  } catch (err) {
    throw new Error(`Grok summarization failed: ${err.message}`);
  }
}

module.exports = { summarizeWithGrok };
