# ACCA AI Solver — Deployment Guide (Gemini / Free)

## Files included
```
acca-gemini/
├── server.js
├── package.json
└── public/
    ├── index.html
    ├── style.css
    └── app.js
```

---

## Step 1 — Upload to GitHub

1. Go to https://github.com and sign in (or create a free account)
2. Click the "+" icon → "New repository"
3. Name it: acca-solver
4. Click "Create repository"
5. Click "uploading an existing file"
6. Upload ALL files (keep the public/ folder structure)
7. Click "Commit changes"

---

## Step 2 — Deploy on Render (free)

1. Go to https://render.com
2. Sign in with your GitHub account
3. Click "New +" → "Web Service"
4. Select your acca-solver repository
5. Fill in:
   - Name: acca-solver
   - Runtime: Node
   - Build Command: npm install
   - Start Command: node server.js
6. Scroll to "Environment Variables" → click "Add Environment Variable"
   - Key:   GEMINI_API_KEY
   - Value: AIzaSyCWuNN4eXYo5PkZu-cgfbSkuPBhO-y0L7Y
7. Click "Create Web Service"

Wait 2-3 minutes. You will get a URL like:
https://acca-solver.onrender.com

That is your live website! Share it with anyone.

---

## Notes
- Gemini free tier allows up to 1,500 requests/day — more than enough
- Render free tier may sleep after 15 min of no traffic (first visit takes ~30s to wake)
- To keep it always awake, upgrade Render to $7/month
