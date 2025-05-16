from flask import Flask
from flask_socketio import SocketIO, emit

# Flask app setup
app = Flask(__name__)
# You can optionally set a secret key if using sessions, not needed for SocketIO only
# app.config['SECRET_KEY'] = 'some_secret_key'

# SocketIO server setup
# cors_allowed_origins="*" allows connections from any origin (OK for development, restrict in production)
# logger=True and engineio_logger=True are useful for debugging connection issues
socketio = SocketIO(app, cors_allowed_origins="*", logger=True, engineio_logger=True)

# --- WebSocket event handlers ---

@socketio.on('connect')
def handle_connect():
    """Handles a new WebSocket connection."""
    print('WebSocket client connected!')

@socketio.on('disconnect')
def handle_disconnect():
    """Handles WebSocket disconnection."""
    print('WebSocket client disconnected.')

@socketio.on('sector_update')
def handle_sector_update(data):
    """Handles the 'sector_update' event sent by the ball tracking script."""
    print(f'Received sector update: {data}')
    # You could process the data here if needed (e.g., data['sector_angle'])
    # Optionally broadcast to all connected clients (e.g., browsers)
    # emit('web_update', data, broadcast=True)

    # Actively rebroadcast the received data to all connected SocketIO clients (including browsers)
    emit('sector_update', data, broadcast=True)

# Server startup
if __name__ == '__main__':
    # Bind to localhost only to prevent external access
    print("Starting Flask SocketIO server at http://127.0.0.1:5000 (Localhost)")
    socketio.run(app, host='127.0.0.1', port=5000, debug=True, allow_unsafe_werkzeug=True)
