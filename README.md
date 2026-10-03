# 🌅 Morning Digest

> Your personal AI-powered daily news briefing — reads itself aloud every morning.

Built for an ERP consultant in Malaysia who wants a smart, spoken digest covering local news, global finance, ERP industry updates, and weather. Powered by Grok (X.ai) and NewsAPI. Zero paid dependencies (free tier APIs work fine).

---

## What It Does

1. Fetches today's news from Malaysia and global sources
2. Fetches your local weather
3. Sends everything to Grok AI to summarize — filtered through your ERP consultant lens
4. Reads the digest aloud via text-to-speech
5. Saves a `.txt` copy in the `digests/` folder

---

## Architecture

```
index.js                  ← entry point, orchestrates everything
config/
  config.js               ← ALL settings here (API keys, city, persona, TTS)
src/
  fetchNews.js            ← pulls articles from NewsAPI sources
  fetchWeather.js         ← pulls weather from OpenWeatherMap
  summarize.js            ← sends data to Grok, returns digest text
  speak.js                ← auto-detects TTS engine and speaks the digest
digests/                  ← saved digest .txt files (auto-created)
.env.example              ← template for your API keys
```

Data flow:
```
[NewsAPI] ──┐
            ├──► [summarize.js] ──► [Grok AI] ──► digest text ──► [speak.js] ──► 🔊
[Weather] ──┘                                                   └──► [saved .txt]
```

---

## API Keys You Need (All Free Tier)

| Service | What For | Free Tier |
|---------|----------|-----------|
| [X.ai / Grok](https://console.x.ai) | AI summarization | Yes |
| [NewsAPI](https://newsapi.org) | News articles | 100 req/day free |
| [OpenWeatherMap](https://openweathermap.org/api) | Weather | 60 req/min free |

---

## Setup on Laptop (Windows / macOS / Linux)

### Step 1 — Install Node.js

- Go to https://nodejs.org and download the **LTS version**
- Install it normally (click Next, Next, Finish)
- Open Terminal (macOS/Linux) or Command Prompt (Windows) and verify:
  ```
  node --version
  ```
  You should see something like `v20.x.x`

### Step 2 — Download This Project

Option A — If you have Git:
```bash
git clone https://github.com/YOUR_USERNAME/morning-digest.git
cd morning-digest
```

Option B — Just copy the folder to your laptop and open Terminal inside it:
```bash
cd path/to/morning-digest
```

### Step 3 — Set Up API Keys

Copy the example env file:
```bash
# macOS / Linux
cp .env.example .env

# Windows
copy .env.example .env
```

Open `.env` in any text editor (Notepad, VS Code, etc.) and fill in your keys:
```
GROK_API_KEY=xai-xxxxxxxxxxxxxxxxxxxxxxxx
NEWS_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WEATHER_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 4 — Load Environment Variables

**macOS / Linux** — add this to your terminal session:
```bash
export $(cat .env | xargs)
```

Or to make it permanent, add to your `~/.bashrc` or `~/.zshrc`:
```bash
export GROK_API_KEY=xai-xxx...
export NEWS_API_KEY=xxx...
export WEATHER_API_KEY=xxx...
```

**Windows (Command Prompt):**
```cmd
for /f "tokens=*" %i in (.env) do set %i
```

**Windows (PowerShell):**
```powershell
Get-Content .env | ForEach-Object { $k, $v = $_ -split '=', 2; [System.Environment]::SetEnvironmentVariable($k, $v) }
```

### Step 5 — Install TTS (if needed)

**macOS:** Built-in `say` command — nothing to install ✅

**Linux (Ubuntu/Debian):**
```bash
sudo apt install espeak
```

**Windows:** Windows has built-in SAPI but this script doesn't use it directly. Easiest option: install WSL (Windows Subsystem for Linux) and run from there, then `sudo apt install espeak`.

### Step 6 — Run It!

```bash
node index.js
```

You should see it fetching news, calling Grok, printing the digest, and then speaking it aloud.

---

## Setup on Android Phone (Termux)

### Step 1 — Install Termux

> ⚠️ Install from F-Droid, NOT the Play Store. The Play Store version is outdated.

1. Go to https://f-droid.org on your phone's browser
2. Download and install the F-Droid app
3. Open F-Droid and search for **Termux**
4. Install Termux from F-Droid

### Step 2 — Set Up Termux

Open Termux and run these commands one by one:

```bash
# Update packages
pkg update && pkg upgrade -y

# Install Node.js
pkg install nodejs -y

# Install git (optional but useful)
pkg install git -y

# Verify Node installed
node --version
```

### Step 3 — Copy the Project to Your Phone

**Option A — Transfer from laptop:**
- Copy the `morning-digest` folder to your phone via USB or Google Drive
- In Termux, access phone storage:
  ```bash
  termux-setup-storage
  # Then navigate to it:
  cd ~/storage/shared/morning-digest
  ```

**Option B — Clone from GitHub (if you push it there):**
```bash
git clone https://github.com/YOUR_USERNAME/morning-digest.git
cd morning-digest
```

### Step 4 — Set API Keys in Termux

```bash
# Create .env file
cp .env.example .env

# Edit it (nano is a simple text editor)
nano .env
```

Fill in your keys, then save: press `Ctrl+X`, then `Y`, then `Enter`.

Load the keys:
```bash
export $(cat .env | xargs)
```

To make keys load automatically every time you open Termux:
```bash
nano ~/.bashrc
```
Add these lines at the bottom:
```bash
export GROK_API_KEY=xai-xxx...
export NEWS_API_KEY=xxx...
export WEATHER_API_KEY=xxx...
```
Save and close. Then run:
```bash
source ~/.bashrc
```

### Step 5 — Install Text-to-Speech for Termux

```bash
pkg install termux-api -y
```

Also install the **Termux:API** companion app from F-Droid (same place you got Termux). This enables `termux-tts-speak`.

Test it:
```bash
termux-tts-speak "Hello, good morning!"
```

You should hear your phone speak.

### Step 6 — Run the Digest

```bash
cd ~/morning-digest   # or wherever you put it
node index.js
```

### Step 7 — Create a One-Tap Shortcut (Optional)

Create a simple shell script you can tap to run:

```bash
nano ~/run-digest.sh
```

Paste this:
```bash
#!/data/data/com.termux/files/usr/bin/bash
source ~/.bashrc
cd ~/morning-digest
node index.js
```

Save and make it executable:
```bash
chmod +x ~/run-digest.sh
```

Now you can just run `~/run-digest.sh` in Termux each morning, or set up a Termux widget shortcut for one-tap access.

### Step 8 — Auto-Schedule with Termux Cron (Optional)

```bash
pkg install cronie -y
crond  # start the cron daemon

# Edit cron schedule
crontab -e
```

Add this line to run at 7:00 AM every day:
```
0 7 * * * /data/data/com.termux/files/home/run-digest.sh >> /data/data/com.termux/files/home/digest.log 2>&1
```

Save and exit. Cron will now trigger the script every morning at 7 AM while Termux is running.

---

## Customization Guide

All settings live in `config/config.js`. You never need to touch the other files.

| What to change | Where in config.js |
|---|---|
| Your city for weather | `weather.city` |
| Grok model (faster vs smarter) | `ai.model` |
| Add/remove news sources | `news.sources` array |
| Number of articles per source | `news.maxArticlesPerSource` |
| Your role description | `persona.role` |
| Topics you care about | `persona.interests` |
| TTS speed | `tts.rate` |
| Save digests to file | `output.saveToFile` |

---

## Roadmap

- [ ] WhatsApp or Telegram delivery option
- [ ] Email delivery via SendGrid free tier
- [ ] Weekly summary mode (digest of the week)
- [ ] Stock / KLSE price tracker
- [ ] Add MFRS/IFRS regulatory RSS feeds

---

## Dev Journal

### Entry 0 — Initial Scaffold (June 2026)
- Built with zero npm dependencies (uses Node.js built-in `https` module only)
- Grok API chosen over Claude to use free tier
- NewsAPI free tier: 100 requests/day — more than enough for one daily run
- TTS auto-detects between `termux-tts-speak`, `say` (macOS), and `espeak` (Linux)
- Config-first design: all settings in one file, code never needs to be touched

---

## Known Issues & Lessons Learned

- NewsAPI free tier doesn't support Malaysian sources directly — uses `country=my` filter which may be limited. Upgrade to paid if you want more local coverage.
- Termux cron only runs when Termux is open/backgrounded. If phone kills the app, cron won't fire.
- Make sure to run `termux-setup-storage` before accessing phone files from Termux.
