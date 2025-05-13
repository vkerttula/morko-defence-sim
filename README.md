# MÖRKÖ v0.0.1-pre-pre-alpha 🧴

![status](https://img.shields.io/badge/status-unstable--and--proud-red)

Experimental canvas demo: a retro-style goalie (inspired by Finnish folklore character "Mörkö") tries to stop floorball shots.

---

## 🧠 Real-Time Ball Tracking with Python & OpenCV

Planned for LOF: a key component of the system is a Python-based real-time vision pipeline using OpenCV to detect and track a red ball from live video input.

This backend script leverages a high-FPS USB camera (up to 120 FPS), performs color masking and centroid tracking, and estimates motion direction frame-to-frame. Direction data will later be sent to the canvas frontend via WebSocket.

Once implemented (kjeh) and connected to frontend, this will enable fully automatic goalie reactions without manual input.

#### 🔬 Technologies Involved

- TypeScript + Vite + Canvas API
- Modular architecture
- Python 3
- OpenCV (real-time video processing)
- NumPy (image data manipulation)
- WebSocket (communication between back and front)
- AI / Computer Vision
  - Morphological noise reduction (erode/dilate)
  - Ball direction inference from frame deltas (Motion vector estimation)
  - Color mask filtering (HSV-based) & centroid tracking
  - Region-based direction classification

---

## 🚀 Getting Started

1. Install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Start development server:

   ```bash
   npm run dev
   ```

3. Open in your browser:

   ```
   http://localhost:5173
   ```

---

## 📁 Project Structure

```
morko-defense-sim/
├── backend/
│   └── app.py                  # Python (OpenCV) ball tracking prototype
├── frontend/
│   ├── public/
│   │   └── fav.ico
│   ├── src/
│   │   ├── core/               # Core goalie logic and rendering
│   │   │   └── goalie.ts
│   │   ├── dev/                # Manual input helpers for testing
│   │   │   └── manualInputs.ts
│   │   ├── enums/              # Enums and constant mappings
│   │   │   └── directions.ts
│   │   ├── types/              # Shared TypeScript types
│   │   │   └── types.ts
│   │   ├── widgets/            # UI widgets and animated elements
│   │   │   ├── renderTile.ts
│   │   │   └── titleWidget.ts
│   │   ├── main.ts             # App entry point
│   │   └── vite-env.d.ts       # Vite typings
│   ├── index.html
│   ├── style.css
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   └── .prettierrc             # Code formatting config
└── README.md
```

---

## 📡 Backend?

Python backend planned for ball detection using a USB camera and OpenCV.
Data will be sent to the frontend over WebSocket.

Currently, the frontend is fully standalone and controllable with buttons.
