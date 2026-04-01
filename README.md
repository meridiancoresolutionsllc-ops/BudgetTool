# 💸 BudgetTool

A lightweight, mobile-friendly budgeting app powered by **Google Sheets** as the backend.

Track income, manage bills, allocate funds, and visualize your financial flow — all with real-time syncing across devices.

---

## 🚀 Features

- 📊 Dashboard with financial overview
- 💵 Income tracking (received & upcoming)
- 📋 Bill management with categories
- 🔀 Allocation system (map income → bills)
- 📅 Timeline view of cash flow
- 🌗 Light / Dark mode toggle
- 📱 Mobile-responsive design
- ☁️ Syncs to Google Sheets (source of truth)
- 📤 Export data as JSON (backup)

---

## 🧠 How It Works

- The app runs entirely in the browser (HTML + JS)
- Data is synced to a Google Sheet via **Apps Script Web App**
- Google Sheets acts as the **database**
- Sync flow:
  - **Load** → JSONP (GET)
  - **Save** → Hidden form POST (no CORS issues)
- Data is stored in:
  - `H2` → full JSON snapshot
  - formatted rows below for readability

---

## 🏗️ Setup Instructions

### 1. Create Google Sheet

1. Create a new Google Sheet
2. Rename the first tab to:

```
BudgetTool
```

---

### 2. Add Apps Script

1. Go to:
   ```
   Extensions → Apps Script
   ```
2. Replace the script with your backend code
3. Update this line:

```javascript
const SHEET_ID = "YOUR_SHEET_ID_HERE";
```

---

### 3. Deploy Web App

1. Click **Deploy → Manage deployments**
2. Create or edit deployment:
   - **Type:** Web app
   - **Execute as:** Me
   - **Who has access:** Anyone
3. Deploy and copy the URL:

```
https://script.google.com/macros/s/.../exec
```

---

### 4. Connect Frontend

In your HTML file, set:

```javascript
var WEBHOOK = "YOUR_APPS_SCRIPT_URL";
```

---

### 5. Host the App

You can host this anywhere:
- Netlify (recommended)
- GitHub Pages
- Vercel

Just upload the HTML file.

---

## 🔄 Sync Behavior

- Clicking **Sync** sends data to Google Sheets
- App verifies sync by reloading sheet data
- Only shows "Synced" if data matches exactly
- If sync fails:
  - your data is still in the browser
  - export JSON before refreshing

---

## ⚠️ Important Notes

- Google Sheets is the **source of truth**
- Always ensure:
  - Apps Script is deployed with a **new version**
  - Permissions are set to **Anyone**
- Large datasets may require optimization in the future

---

## 🛠️ Troubleshooting

### ❌ Sync says success but data not in sheet
- Check `H2` cell in sheet
- Verify Apps Script is parsing `payload` correctly
- Ensure deployment is updated

### ❌ Sync failed (Script request failed)
- Usually caused by:
  - URL payload too large
  - JSONP limitations
- Fix: use POST (already implemented)

### ❌ Data not loading
- Test directly:
```
YOUR_SCRIPT_URL?action=load
```

---

## 🔐 Data Safety

- Always use **Export JSON** before refreshing if sync fails
- Your last successful sync remains in Google Sheets
- Unsynced changes live only in the browser

---

## 🧩 Tech Stack

- HTML / CSS / JavaScript
- Google Apps Script
- Google Sheets (database)
- JSONP + POST hybrid sync strategy

---

## 💡 Future Improvements

- Auto-sync intervals
- Offline queueing
- Multi-user support
- Charts & analytics
- PWA (installable mobile app)

---

## 🙌 Credits

Built as a lightweight, serverless budgeting tool using Google Sheets as a backend.

---

## 📄 License

MIT License
