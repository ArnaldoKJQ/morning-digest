const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Detect which TTS engine is available on this system
 */
function detectTTSEngine() {
  // Termux (Android)
  try {
    execSync('which termux-tts-speak', { stdio: 'ignore' });
    return 'termux';
  } catch {}

  // macOS
  try {
    execSync('which say', { stdio: 'ignore' });
    return 'say';
  } catch {}

  // Linux (espeak)
  try {
    execSync('which espeak', { stdio: 'ignore' });
    return 'espeak';
  } catch {}

  // espeak-ng (newer Linux)
  try {
    execSync('which espeak-ng', { stdio: 'ignore' });
    return 'espeak-ng';
  } catch {}

  return null;
}

/**
 * Strip markdown formatting for cleaner speech
 */
function cleanForSpeech(text) {
  return text
    .replace(/#{1,6}\s/g, '')       // remove headings
    .replace(/\*\*(.*?)\*\*/g, '$1') // remove bold
    .replace(/\*(.*?)\*/g, '$1')     // remove italic
    .replace(/🇲🇾|💼|💰|⚠️|🤖|📰|🌤️/gu, '') // remove emoji
    .replace(/- /g, '. ')            // dashes to pauses
    .replace(/\n{2,}/g, '. ')        // paragraph breaks to pauses
    .replace(/\n/g, ' ')
    .trim();
}

/**
 * Speak text using detected or configured engine
 */
async function speak(text, config) {
  if (!config.tts.enabled) return;

  const engine = config.tts.engine === 'auto'
    ? detectTTSEngine()
    : config.tts.engine;

  if (!engine) {
    console.warn('⚠️  No TTS engine found. Install espeak (Linux) or use Termux on Android.');
    console.log('\n--- DIGEST TEXT ---\n');
    console.log(text);
    return;
  }

  const cleanText = cleanForSpeech(text);

  console.log(`🔊 Speaking via: ${engine}`);

  return new Promise((resolve, reject) => {
    let args = [];

    switch (engine) {
      case 'termux':
        args = [cleanText];
        break;
      case 'say':
        args = [cleanText];
        if (config.tts.voice) args.unshift('-v', config.tts.voice);
        break;
      case 'espeak':
      case 'espeak-ng':
        args = ['-s', String(config.tts.rate), cleanText];
        if (config.tts.voice) args.push('-v', config.tts.voice);
        break;
    }

    const command = engine === 'termux' ? 'termux-tts-speak' : engine;
    const proc = spawn(command, args);
    proc.on('close', resolve);
    proc.on('error', reject);
  });
}

module.exports = { speak, detectTTSEngine };