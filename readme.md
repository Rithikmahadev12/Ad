# 🌳 Dollar Tree Store

A full-stack ordering site for Dollar Tree products with customer checkout and owner dashboard.

## Features
- 🛒 Browse 29+ Dollar Tree products across 6 categories
- 📧 Customers submit cart with email, pay on delivery
- 🔑 Owner dashboard (Tejus, Alex, Tathvik, Rithik)
- 🏷️ Owners can update product prices
- ➕ Owners can add/delete products
- 📦 Owners can view all orders and update status

## Owner Logins
| Username | Password |
|----------|----------|
| Tejus    | password |
| Alex     | password |
| Tathvik  | password |
| Rithik   | password |

---

## Local Development

```bash
cd backend
npm install
node server.js
```

Open http://localhost:3001

---

## Deploy to Render

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Connect to Render**
   - Go to [render.com](https://render.com) → New → Web Service
   - Connect your GitHub repo
   - Set:
     - **Root Directory:** `backend`
     - **Build Command:** `npm install`
     - **Start Command:** `node server.js`
   - Add environment variable: `JWT_SECRET` = any random string
   - (Optional) Add a Disk at `/opt/render/project/src` (1GB) to persist the database

3. **Done!** Your site will be live at `https://your-app.onrender.com`

> ⚠️ Without a disk, the SQLite database resets on each deploy. For production, consider using Render's PostgreSQL or a free PlanetScale DB.

---

## Project Structure

```
dollartree-site/
├── backend/
│   ├── server.js      # Express API + serves frontend
│   ├── package.json
│   └── store.db       # SQLite database (auto-created)
├── frontend/
│   └── public/
│       └── index.html # Full single-page app
├── render.yaml        # Render config
└── .gitignore
```
