# Backend Setup and Run Instructions

This part of the project handles:

* Camera input
* Ball detection
* Calculating the ball's position (sector angle)
* Sending this information to the web frontend using WebSockets

The backend consists of **two main scripts** that must run simultaneously, plus a **calibration utility**.

---

## Backend Folder Structure

```plaintext
backend/
├── core/
│   └── video_processor.py
├── dev/
│   └── hsv-calibration.py
├── app.py
├── README.md
└── requirements.txt
```

---

## Backend Files Explained

### `app.py`

* Server component built using **Flask** and **Flask-SocketIO**
* Acts as a WebSocket communication hub
* Listens for incoming `sector_update` events from `video_processor.py`
* Broadcasts updates to all connected clients (e.g., frontend in browser)
* Runs locally at `http://127.0.0.1:5000` (default port)

### `video_processor.py`

* Handles video processing and sends sector updates
* Uses **OpenCV** to access the camera feed
* Filters the video with HSV color masks to detect a red ball
* Calculates the ball's angle/sector relative to the center
* Sends updates only when the sector value changes
* Connects to `app.py` via SocketIO and sends `sector_update` events
* Displays:

  * Camera feed with overlays (sectors, ball, arrow)
  * HSV mask in a separate window

### `hsv-calibration.py`

* Calibration utility for determining correct HSV color range
* You run this script manually to click on the ball in the feed
* Prints out HSV values to be used in `video_processor.py`
* Only needed when adjusting detection conditions (e.g., lighting)

---

## How to Run the Backend

### 1. Install Prerequisites

Make sure you have Python and pip installed. Then install the required libraries:

```bash
pip install -r requirements.txt
```

---

### 2. Calibrate HSV Values (Optional)

If ball detection is inaccurate, run:

```bash
python backend/dev/hsv-calibration.py
```

Follow instructions (click on the red ball in the video).
Use the printed HSV values to update:

```python
lower_red1, upper_red1, lower_red2, upper_red2
```

in `video_processor.py`.

Press `q` to close the calibration window.

---

### 3. Start the WebSocket Server

Open a terminal and run:

```bash
python backend/app.py
```

You should see Flask and SocketIO server start, usually at:

```
http://127.0.0.1:5000
```

---

### 4. Start the Video Processor

In a new terminal window, run:

```bash
python backend/core/video_processor.py
```

You should see output like:

```
Connecting to WebSocket server at http://localhost:5000
WebSocket client connected to server!
```

Two windows will open:

* Live camera feed with overlays
* Binary HSV mask

---

## Verifying Communication

* In the `app.py` terminal:
  You’ll see messages like:
  `Received sector update: {'sector_angle': ...}`

* In the `video_processor.py` terminal:
  The current sector angle is printed whenever it changes

