# ⚡ Obikul AI Command Center & 24/7 Cloud Background Engine
### **Official Autonomous Multi-Channel AI Executive Cockpit for Commander Obikul Mia**

---

## 🌟 Executive Overview
**Obikul AI Command Center** connects all your communication channels into one unified, autonomous command cockpit:
* **Gmail** (Google Pub/Sub & REST API)
* **Instagram Direct Messages** (Meta Graph API)
* **Facebook Page Messages** (Messenger Platform)
* **WhatsApp Business** (Cloud API)
* **Telegram Bot** (@BotFather)
* **Custom Website Webhooks** (Shopify, WordPress, Webflow, Custom Forms)

---

## 🚀 Key Features

1. **24/7 Cloud Background Execution**:
   * Runs continuously in the cloud even when your personal laptop is shut down.
   * Auto-replies with rate cards, schedules meetings, and filters spam.

2. **Windows 11 Startup Catch-Up Sync**:
   * When you power ON your laptop, Windows automatically delivers a native Action Center Toast Notification summarizing all activities handled while offline.

3. **Installable Mobile Application (Android / iOS / APK)**:
   * **Android**: 1-Click PWA Install with tactile vibration & push alerts.
   * **iOS Safari**: "Add to Home Screen" support.
   * **Capacitor APK**: Standalone Android `.apk` ready (`capacitor.config.json`).

4. **Global Inbound World Map Geo-Radar**:
   * Interactive cyber SVG world map tracking real-time message origins across New York, London, Dubai, Singapore, Berlin, Tokyo, and Sydney converging onto India HQ.

5. **Safety Controls & Full Auto Mode**:
   * **⚡ Full Auto 24/7**: Instant AI negotiation and response.
   * **📝 Approval Mode**: Drafts replies for Commander's 1-click confirmation.
   * **🛑 Panic Freeze**: Emergency kill switch to halt all outgoing bots instantly.

---

## 🛠️ Quick Start & Local Execution

### 1. Run the Dashboard Directly in Browser
Double-click `dashboard-demo.html` or open it in Google Chrome, Microsoft Edge, or Firefox.

### 2. Start the 24/7 Node.js Server
```bash
# Install dependencies
npm install

# Start the server
npm start
```
* **Dashboard**: `http://localhost:3000`
* **Real-Time Telemetry**: `ws://localhost:3000`
* **Windows Sync Endpoint**: `http://localhost:3000/api/catchup/summary`

---

## ☁️ 24/7 Free Cloud Deployment (Laptop Off Operation)

To keep the AI engine running 24/7 when your laptop is turned off:

### Option A: Deploy to Render.com (Recommended - 100% Free)
1. Push this folder to your GitHub repository (`Obikul-AI-Command-Center`).
2. Go to [Render.com](https://render.com) and click **New Web Service**.
3. Connect your GitHub repository.
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `node server.js`
6. Click **Deploy**! Your cloud server will run 24/7 with a public HTTPS webhook URL (e.g. `https://obikul-ai.onrender.com`).

---

## 💻 Windows 11 Startup Notification Setup

To have Windows automatically notify you when you boot your laptop:
1. Double click `install-windows-startup.bat`.
2. That's it! It places a background trigger in your Windows startup folder.
3. You can test it immediately anytime by running:
```powershell
powershell -ExecutionPolicy Bypass -File ./windows-sync.ps1
```

---

## 📱 Mobile App Installation

* **On Android Phone**: Open your dashboard URL in Chrome &rarr; Tap the glowing **"📲 Install Mobile App"** button at the top header &rarr; Tap **"Install"**.
* **On iPhone / iPad**: Open in Safari &rarr; Tap **Share (📤)** &rarr; Tap **"Add to Home Screen ➕"**.

---
*👑 Designed & Engineered exclusively for Commander Obikul Mia.*
