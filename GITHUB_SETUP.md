# SwiftLink Express — GitHub Setup Guide

This guide walks you through creating a GitHub repository and pushing your entire SwiftLink Express project to the cloud.

---

## Step 1: Install Git

### Windows
1. Download Git from https://git-scm.com/download/win
2. Run the installer and follow the setup wizard (use all default settings)
3. Open PowerShell and verify:
   ```powershell
   git --version
   ```

---

## Step 2: Create a GitHub Account (if you don't have one)

1. Go to https://github.com/signup
2. Enter email, create password, choose username
3. Complete the signup process
4. Verify your email

---

## Step 3: Create a New Repository on GitHub

1. Log in to GitHub at https://github.com
2. Click **+** (top right) → **New repository**
3. Fill in:
   - **Repository name:** `swiftlink-express` (or your preferred name)
   - **Description:** SwiftLink Express — Global Logistics Tracking Platform
   - **Visibility:** Public (or Private if you prefer)
   - **Initialize this repo with:**
     - Do NOT check "Add a README"
     - Do NOT check "Add .gitignore"
     - Do NOT check "Choose a license"
4. Click **Create repository**
5. You'll see a page with commands — copy the repository URL (looks like `https://github.com/YOUR_USERNAME/swiftlink-express.git`)

---

## Step 4: Push Your Project to GitHub

### Open PowerShell in your project root

```powershell
cd "C:\Users\HomePC\Desktop\swiftlink-express"
```

### Configure Git (first time only)

```powershell
git config --global user.name "Your Name"
git config --global user.email "your-github-email@example.com"
```

### Initialize and commit all files

```powershell
# Initialize the repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: SwiftLink Express full-stack project"
```

### Add remote and push

```powershell
# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/swiftlink-express.git

# Push to GitHub (you'll be prompted for GitHub credentials)
git branch -M main
git push -u origin main
```

### When prompted for credentials:
- **Username:** Your GitHub username
- **Password:** Your GitHub personal access token (see below)

---

## Step 5: Create a GitHub Personal Access Token (for authentication)

If you get an authentication error, use a Personal Access Token instead:

1. Go to https://github.com/settings/tokens
2. Click **Generate new token** → **Generate new token (classic)**
3. Set:
   - **Token name:** `git-cli`
   - **Expiration:** 90 days (or custom)
   - **Scopes:** Check `repo` (full control of private repos)
4. Click **Generate token**
5. **Copy the token** (you won't see it again)
6. Use this token as the password when git prompts

---

## Step 6: Verify on GitHub

1. Go to https://github.com/YOUR_USERNAME/swiftlink-express
2. You should see all your files and folders

---

## Project Structure on GitHub

Your repository will contain:

```
swiftlink-express/
├── swiftlink-backend/          # Backend server
│   ├── public/                 # Frontend files served by backend
│   │   ├── index.html
│   │   ├── app.js
│   │   ├── styles.css
│   │   └── admin/
│   ├── routes/                 # API routes
│   ├── middleware/
│   ├── utils/
│   ├── package.json
│   ├── server.js
│   ├── Dockerfile
│   ├── Procfile
│   ├── .env.example
│   └── README.md
├── app.js                      # Frontend app (optional duplicate)
├── index.html
├── styles.css
└── .gitignore
```

---

## Step 7: Set Up Deployment (Render or Railway)

After your code is on GitHub, connect it to Render or Railway:

### For Render:
1. Go to https://render.com
2. Click **New** → **Web Service**
3. Select **Connect a repository** → choose your GitHub repo
4. Set:
   - **Root Directory:** `swiftlink-backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:**
     - `PORT=5000`
     - `JWT_SECRET=your-secret-key`
     - `NODE_ENV=production`
     - `DATA_DIR=/data`
5. Add a **Persistent Disk** at `/data` for database persistence
6. Deploy

### For Railway:
1. Go to https://railway.app
2. Create new project → **Deploy from GitHub**
3. Select your `swiftlink-express` repo
4. Railway will auto-detect it's a Node app
5. Add environment variables (same as Render)
6. Deploy

---

## Future Edits

After your code is on GitHub:

1. **Make local changes** to files
2. **Commit changes:**
   ```powershell
   git add .
   git commit -m "Describe your change"
   git push
   ```
3. **Redeploy** on Render/Railway (usually auto-redeploys on push)

---

## Useful Git Commands

```powershell
# Check status
git status

# View commit history
git log

# See what changed
git diff

# Revert last commit (if needed)
git reset --soft HEAD~1

# Clone repo to another machine
git clone https://github.com/YOUR_USERNAME/swiftlink-express.git
```

---

## Troubleshooting

### "fatal: not a git repository"
- Make sure you ran `git init` in the correct folder
- Check current directory with `pwd`

### "authentication failed"
- Use a Personal Access Token instead of your GitHub password
- See Step 5 above

### "fatal: 'origin' does not appear to be a 'git' repository"
- Make sure the remote URL is correct: `git remote -v`
- Re-add it: `git remote remove origin` then `git remote add origin [URL]`

---

## Next Steps

1. Follow Steps 1–4 above
2. Your code will be live on GitHub
3. Set up deployment on Render or Railway
4. Add your custom domain if you have one
5. Start receiving shipment tracking requests!
