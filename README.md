# Email Tone Adjuster

An AI-powered tool that rewrites your emails in different tones using Claude.

![Email Tone Adjuster](https://img.shields.io/badge/Powered%20by-Claude%20AI-blue)

## Features

- **6 Tone Options**: Professional, Friendly, Casual, Assertive, Diplomatic, Concise
- **Session Log**: Keep track of all adjustments made during your session
- **One-Click Copy**: Easily copy adjusted emails to clipboard
- **Load from History**: Re-edit previous emails with different tones

## Quick Start

### 1. Clone and Install

```bash
cd email-tone-adjuster-app
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file and add your API key:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

Get your API key from [console.anthropic.com](https://console.anthropic.com/)

### 3. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deploy to Vercel

The easiest way to deploy this app is with Vercel:

### Option A: One-Click Deploy

1. Push this code to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "New Project" and import your repository
4. Add your environment variable:
   - Name: `ANTHROPIC_API_KEY`
   - Value: Your API key from Anthropic
5. Click "Deploy"

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add your environment variable
vercel env add ANTHROPIC_API_KEY
```

---

## Deploy to Other Platforms

### Netlify

1. Push to GitHub
2. Connect to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `.next`
5. Add `ANTHROPIC_API_KEY` in Environment Variables

### Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway add
railway variables set ANTHROPIC_API_KEY=your_key_here
railway up
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t email-tone-adjuster .
docker run -p 3000:3000 -e ANTHROPIC_API_KEY=your_key email-tone-adjuster
```

---

## Project Structure

```
email-tone-adjuster-app/
├── app/
│   ├── api/
│   │   └── adjust-tone/
│   │       └── route.js      # Secure API endpoint
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   └── EmailToneAdjuster.jsx # Main UI component
├── .env.example
├── package.json
├── tailwind.config.js
└── README.md
```

## API Costs

This app uses Claude Sonnet 4, which costs approximately:
- Input: $3 per million tokens
- Output: $15 per million tokens

A typical email adjustment uses ~500-1000 tokens total, so each adjustment costs roughly $0.001-0.002.

## Security Notes

- Your API key is stored server-side and never exposed to the browser
- Emails are processed in real-time and not stored on any server
- Session history is stored in browser memory only (cleared on refresh)

## License

MIT
