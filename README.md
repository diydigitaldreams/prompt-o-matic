# ☠ ACME PROMPT-O-MATIC™

> AI Red Team Payload Analyzer — Authorized Research Only

A professional-grade prompt injection payload analysis tool built for AI security researchers. Submit your payloads and get expert-level ratings, weakness analysis, improved variants, and competition intelligence — powered by Claude Sonnet via a secure serverless proxy.

---

## 🎯 Features

- **6-Tier Rating System** — GREEN → YELLOW → ORANGE → RED → BLACK → ULTRABLACK
- **Full Defense Layer Analysis** — identifies which layers your payload bypasses vs triggers
- **Improved Payload Generation** — Claude rewrites your payload to be more effective
- **Operation Log** — tracks all analyzed payloads in a session
- **Print Report** — generates a formatted operation report
- **ACME Theme** — full Looney Tunes cartoon aesthetic with animations

---

## 🚀 Deploy

1. Fork this repo
2. Connect to [Netlify](https://netlify.com) → Add new site → Import from GitHub
3. Build settings auto-detected from `netlify.toml`
4. Add environment variable: `ANTHROPIC_API_KEY` in Netlify → Site configuration → Environment variables
5. Redeploy

---

## 📊 Rating System

| Rating | Score | Description |
|--------|-------|-------------|
| 🟢 GREEN | 1-20 | Easily detected, fails all layers |
| 🟡 YELLOW | 21-40 | Basic attempt, caught by filtering |
| 🟠 ORANGE | 41-60 | Intermediate, bypasses 1-2 layers |
| 🔴 RED | 61-80 | Advanced, bypasses most layers |
| ⚫ BLACK | 81-95 | Expert-level, near-undetectable |
| 🌑 ULTRABLACK | 96-100 | Novel vector, publishable finding |

---

## 🔒 Security

API key is never exposed to the client. All Anthropic API calls route through a Netlify serverless function. Never commit your `.env` file.

---

*ACME CORP™ — NOT RESPONSIBLE FOR EXPLODED DEFENSES, FALLING ANVILS, OR AI MODEL TRAUMA*
