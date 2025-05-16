# MÖRKÖ v0.0.1-pre-pre-alpha

![status](https://img.shields.io/badge/status-unstable--and--proud-red)

Experimental canvas demo: a retro-style goalie (inspired by Finnish folklore character "Mörkö") tries to stop floorball shots in real-time.

---

## Real-Time Ball Tracking with Python & OpenCV

A key component of the system is a Python-based real-time vision pipeline using OpenCV to detect and track a red ball from live video input.

The backend processes camera data using HSV masking and centroid tracking, and sends the calculated direction (sector angle) to the frontend over WebSocket. This enables the goalie to react automatically to shots.

---

## Technologies Involved

* TypeScript + Vite + Canvas API (frontend)
* Python 3 + OpenCV + NumPy (backend)
* WebSocket (real-time communication)
* Modular architecture
* AI / Computer Vision techniques:

  * HSV color filtering & centroid detection
  * Morphological filtering (erode/dilate)
  * Direction estimation from frame deltas
  * Region-based classification

---

## Getting Started

For setup and run instructions, refer to the specific README files:

* [Frontend README](./frontend/README.md)
* [Backend README](./backend/README.md)

---

## 📁 Project Structure

```
MORKO-DEFENCE-SIM-MAIN/
│
├── backend/                     # Python-based backend logic and server
│   ├── core/                    # Core processing logic, such as video analysis
│   │   └── video_processor.py
│   ├── dev/                     # Developer tools and calibration scripts
│   │   └── hsv-calibration.py
│   ├── app.py
│   ├── README.md
│   └── requirements.txt
│
├── frontend/                    # Frontend application built with TypeScript and Vite
│   ├── node_modules/            # Installed NPM packages (auto-generated)
│   ├── public/                  # Static assets served as-is (images, icons, etc.)
│   ├── src/                     # Main source code of the frontend
│   │   ├── core/                # Core logic and control systems
│   │   │   └── goalie.ts
│   │   ├── dev/                 # Manual input handling and development utilities
│   │   │   ├── manuallInputs.ts
│   │   │   └── sectors.ts
│   │   ├── enums/               # Enum definitions for directions and other constants
│   │   │   └── directions.ts
│   │   ├── types/               # TypeScript type definitions and data structures
│   │   │   └── types.ts
│   │   ├── widgets/             # UI components and interface elements
│   │   │   ├── renderTile.ts
│   │   │   └── titleWidget.ts
│   │   ├── main.ts
│   │   └── vite-env.d.ts
│   ├── index.html
│   ├── style.css
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── .prettierrc
│   └── README.md
└── README.md                    # You are reading this file

```

---

##  Status

- Full communication between backend and frontend is functional
- Goalie successfully reacts to detected shots in real time, not good, not bad
- WebSocket integration live and operational
- Further optimization and robustness improvements ongoing
