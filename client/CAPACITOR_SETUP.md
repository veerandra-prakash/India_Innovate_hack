Capacitor setup and commands

Overview
- This file prepares the repository for Capacitor (Android/iOS). It does NOT run native tooling. Follow the exact commands below in a terminal (PowerShell / CMD) to finish setup.

Prerequisites
- Node.js and npm installed
- Android Studio (install later; not required for these repo changes)

Quick commands (run inside `client`)

1) Install dependencies

```
cd client
npm install
npm install @capacitor/core@latest --save
npm install @capacitor/cli@latest --save-dev
```

2) Build web app

```
npm run build
```

3) Initialize Capacitor (only once)

Use the script added to `package.json` or run directly:

```
npx @capacitor/cli@latest init "India Innovates" com.veerandra.india_innovates --web-dir=dist
```

4) Add Android platform

```
npx cap add android
```

5) Sync after builds (copy web assets into native projects)

```
npm run cap:build    # builds web
npm run cap:sync     # copies assets and updates native projects
```

6) Open Android Studio

```
npm run cap:open:android
```

Notes / file changes already applied in this repo
- `capacitor.config.json` created with:
  - `appId`: com.veerandra.india_innovates
  - `appName`: India Innovates
  - `webDir`: dist (Vite default)
- `package.json` updated with helper scripts and added `@capacitor/core` / `@capacitor/cli` entries (you still must run `npm install`).

Routing compatibility (recommended)
- Capacitor serves web content from the app file:// origin. BrowserHistory-style routing (non-hash) may require extra config on Android when deep links or file scheme are used. The simplest safe choice is `HashRouter`.

Example change for `src/main.jsx` (replace BrowserRouter usage):

```jsx
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'

createRoot(document.getElementById('root')).render(
  <HashRouter>
    <App />
  </HashRouter>
)
```

API / CORS
- Mobile app runs from `file://` origin. If your backend enforces CORS, ensure the server allows requests from mobile or remove strict origin checks. For production, use an HTTPS domain and point the app at that base URL. Avoid localhost in production — for emulator use `10.0.2.2` (Android emulator) or configure your backend accordingly.

Local IP for emulator/device testing
- When running the Capacitor app from `file://` (emulator/device), relative `/api` paths break. Provide your machine's local IP so the app can reach the backend during testing.

Steps to get and set local IP:

1. On Windows run `ipconfig` and copy the `IPv4 Address` for your Wi‑Fi adapter (e.g. `192.168.1.42`).
2. Create a file `client/.env.production` with the line:

```
VITE_LOCAL_IP=192.168.1.42
```

3. Rebuild and sync: `npm run build && npm run cap:sync`

This will make the app use `http://<VITE_LOCAL_IP>:5000` as backend base URL when running from the native WebView.

Mobile optimizations (suggestions)
- Add splash screen and icons: use `npx cap sync` then put icons/splash in `android/app/src/main/res` or use community tooling (or Capacitor assets plugin).
- Respect safe areas (iPhone notch): use CSS env(safe-area-inset-*) and meta viewport tag in `index.html`.

Native features
- Add plugins after install, examples:

```
npm install @capacitor/camera
npx cap sync
```

Example: switch to Hash routing, add splash and icons, then run the commands above. After `npx cap add android`, open Android Studio to build and run the app on emulator/device.

Checklist of what I changed in the repo
- Created `client/capacitor.config.json` (webDir set to `dist`)
- Updated `client/package.json` with Capacitor scripts and added `@capacitor/core` / `@capacitor/cli` entries
- Added this `CAPACITOR_SETUP.md` with exact commands and code snippets

Manual steps you'll perform (not done by repo edits)
- Run `npm install` inside `client` to actually add packages
- Run `npm run cap:init` (or the `npx` command) to initialize native projects
- Run `npx cap add android` to create the Android project (requires Android Studio SDK)
- Open Android Studio and build the native project; install emulator or connect device

If you want, I can:
- Update `src/main.jsx` to use `HashRouter` for you (patch file),
- Or add example Camera usage and plugin wiring.
