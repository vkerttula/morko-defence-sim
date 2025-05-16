# Frontend Setup and Run Instructions

This part of the project handles:

* Rendering the goalie simulation using HTML canvas
* Accepting and processing manual inputs
* (Planned) Reacting to direction data sent from the backend over WebSocket

The frontend is built with **TypeScript**, uses **Vite** as the development server, and is fully modular.

---

## Frontend Files Explained

### `src/core/`

* Contains the core goalie logic that determines movement and behavior

### `src/dev/`

* Developer utilities for manual input and test data, such as manual direction overrides and sector definitions

### `src/enums/`

* Contains enums for defining directions and constants used across the app

### `src/types/`

* TypeScript type definitions used for structured data throughout the codebase

### `src/widgets/`

* UI components and rendering logic for visualizing the game state on canvas

### Other root-level files

* Include configuration files (`package.json`, `tsconfig.json`, etc.), the HTML template, styles, and the app's entry point

---

## Frontend Folder Structure

```plaintext
frontend/
├── node_modules/            # Installed NPM packages (auto-generated)
├── public/                  # Static assets served as-is (images, icons, etc.)
├── src/                     # Main source code of the frontend
│   ├── core/                # Core logic and control systems
│   ├── dev/                 # Manual input handling and development utilities
│   ├── enums/               # Enum definitions for directions and other constants
│   ├── types/               # TypeScript type definitions and data structures
│   ├── widgets/             # UI components and interface elements
│   ├── main.ts              # Application entry point
│   └── vite-env.d.ts        # Vite environment types
├── index.html               # Base HTML file
├── style.css                # Global stylesheet
├── package.json             # NPM package definitions
├── package-lock.json        # Locked dependency versions
├── tsconfig.json            # TypeScript configuration
├── .prettierrc              # Prettier configuration
└── README.md                # Frontend-specific instructions
```

---

## How to Run the Frontend

### 1. Install dependencies

Make sure you have Node.js and npm installed.

```bash
cd frontend
npm install
```

### 2. Start the development server

```bash
npm run dev
```

### 3. Open in browser

```
http://localhost:5173
```

You should see the goalie canvas and be able to control it with buttons.

---

## Backend Integration

The frontend currently functions as a standalone demo, but it is designed to integrate with a Python-based backend using WebSockets.

The backend will send real-time ball tracking data, enabling automatic goalie reactions.

For backend setup details, refer to the [Backend README](../backend/README.md).

---

## More Information

For overall project description and high-level architecture, see the root-level [README](../README.md).
