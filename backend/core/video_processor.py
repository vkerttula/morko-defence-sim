import cv2
import numpy as np
import time
import math
import socketio

cap = cv2.VideoCapture(1)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

actual_width = cap.get(cv2.CAP_PROP_FRAME_WIDTH)
actual_height = cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
actual_fps = cap.get(cv2.CAP_PROP_FPS)
print(f"Camera resolution: {int(actual_width)}x{int(actual_height)} @ {actual_fps:.2f} FPS")

prev_centroid = None
movement_threshold = 20
area_threshold = 10000
arrow_start = None
arrow_end = None
last_move_time = 0
arrow_duration = 10

WEBSOCKET_URL = "http://localhost:5000"

sio = socketio.Client()

@sio.on('connect')
def on_connect():
    print('WebSocket client connected to server!')

@sio.on('disconnect')
def on_disconnect():
    print('WebSocket client disconnected from server.')

try:
    sio.connect(WEBSOCKET_URL, transports=['websocket', 'polling'])
    print(f"Attempted to connect to WebSocket server at {WEBSOCKET_URL}")
except Exception as e:
    print(f"ERROR: Failed to connect to WebSocket server at {WEBSOCKET_URL}: {e}")

cv2.namedWindow("Ball tracking", cv2.WINDOW_NORMAL)
cv2.namedWindow("Mask", cv2.WINDOW_NORMAL)

prev_sent_sector_angle = None

while True:
    start_time = time.time()

    ret, frame = cap.read()
    if not ret:
        print("Error reading frame from camera.")
        break

    blurred = cv2.GaussianBlur(frame, (11, 11), 0)
    hsv = cv2.cvtColor(blurred, cv2.COLOR_BGR2HSV)

    lower_red1 = np.array([0, 120, 70])
    upper_red1 = np.array([10, 255, 255])
    lower_red2 = np.array([170, 120, 70])
    upper_red2 = np.array([180, 255, 255])

    mask1 = cv2.inRange(hsv, lower_red1, upper_red1)
    mask2 = cv2.inRange(hsv, lower_red2, upper_red2)
    mask = cv2.bitwise_or(mask1, mask2)

    mask = cv2.erode(mask, None, iterations=2)
    mask = cv2.dilate(mask, None, iterations=2)

    M = cv2.moments(mask)
    current_ball_sector_angle = None
    center = None

    if M["m00"] > area_threshold:
        cx = int(M["m10"] / M["m00"])
        cy = int(M["m01"] / M["m00"])
        center = (cx, cy)

        cv2.circle(frame, center, 5, (255, 0, 0), -1)

        frame_height, frame_width = frame.shape[:2]
        center_x = frame_width // 2
        center_y = frame_height // 2
        rel_x = cx - center_x
        rel_y = cy - center_y

        opencv_angle_rad = math.atan2(rel_y, rel_x)
        opencv_angle_deg = math.degrees(opencv_angle_rad)
        ball_angle_in_opencv_system_deg = (opencv_angle_deg + 360) % 360
        user_ball_angle_deg = (360 - ball_angle_in_opencv_system_deg) % 360
        current_ball_sector_angle = int(user_ball_angle_deg // 15) * 15

        if prev_centroid is not None:
            dx = cx - prev_centroid[0]
            dy = cy - prev_centroid[1]

            if abs(dx) > movement_threshold or abs(dy) > movement_threshold:
                arrow_start = prev_centroid
                arrow_end = center
                last_move_time = time.time()

        prev_centroid = center
    else:
        prev_centroid = None
        center = None

    if current_ball_sector_angle is not None:
        if current_ball_sector_angle != prev_sent_sector_angle:
            print(f"Angle changed {current_ball_sector_angle}°, sending websocket.")
            prev_sent_sector_angle = current_ball_sector_angle
            if sio.connected:
                try:
                    sio.emit('sector_update', {'sector_angle': current_ball_sector_angle})
                except Exception as e:
                    print(f"ERROR: Error while sending data WebSocket: {e}")

    frame_height, frame_width = frame.shape[:2]
    center_x = frame_width // 2
    center_y = frame_height // 2
    sector_line_radius = int(max(frame_width, frame_height) * 0.7)
    sector_text_radius = int(max(frame_width, frame_height) * 0.5)

    for user_angle_deg in range(0, 360, 15):
        math_angle_for_line_deg = (360 - user_angle_deg) % 360
        math_angle_for_line_rad = math.radians(math_angle_for_line_deg)

        line_end_x_rel = sector_line_radius * math.cos(math_angle_for_line_rad)
        line_end_y_rel = sector_line_radius * math.sin(math_angle_for_line_rad)
        line_end_x_abs = int(center_x + line_end_x_rel)
        line_end_y_abs = int(center_y - line_end_y_rel)

        cv2.line(frame, (center_x, center_y), (line_end_x_abs, line_end_y_abs), (200, 200, 200), 1)

        text_angle_user_deg = user_angle_deg + 7.5
        math_angle_for_text_deg = (360 - text_angle_user_deg) % 360
        math_angle_for_text_rad = math.radians(math_angle_for_text_deg)

        text_x_rel = sector_text_radius * math.cos(math_angle_for_text_rad)
        text_y_rel = sector_text_radius * math.sin(math_angle_for_text_rad)
        text_x_abs = int(center_x + text_x_rel)
        text_y_abs = int(center_y - text_y_rel)

        text_string = str(user_angle_deg)
        (text_width, text_height), baseline = cv2.getTextSize(text_string, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
        text_x_abs -= text_width // 2
        text_y_abs += text_height // 2

        cv2.putText(frame, text_string, (text_x_abs, text_y_abs), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

    if arrow_start is not None and arrow_end is not None and (time.time() - last_move_time < arrow_duration):
        cv2.arrowedLine(frame, arrow_start, arrow_end, (0, 0, 255), 4, tipLength=0.3)

    fps = 1 / (time.time() - start_time)
    cv2.putText(frame, f"FPS: {fps:.2f}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)

    cv2.imshow("Ball tracking", frame)
    cv2.imshow("Mask", mask)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()

if sio.connected:
    try:
        sio.disconnect()
    except Exception as e:
        print(f"Error while disconnecting WebSocket: {e}")

cv2.destroyAllWindows()
