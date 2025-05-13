import cv2
import numpy as np
import time

# kmamera
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
cap.set(cv2.CAP_PROP_FPS, 120)

# reso
actual_width = cap.get(cv2.CAP_PROP_FRAME_WIDTH)
actual_height = cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
actual_fps = cap.get(cv2.CAP_PROP_FPS)
print(f"Resoluutio: {int(actual_width)}x{int(actual_height)} @ {int(actual_fps)} FPS")

# Muuttujat
prev_centroid = None
movement_threshold = 20
area_threshold = 10000
arrow_start = None
arrow_end = None
last_move_time = 0
arrow_duration = 10 # sec

while True:
    start_time = time.time()

    ret, frame = cap.read()
    if not ret:
        break

    blurred = cv2.GaussianBlur(frame, (11, 11), 0)
    hsv = cv2.cvtColor(blurred, cv2.COLOR_BGR2HSV)

    # punaisen värihaarukka (HSV) sählypallolle
    lower_red1 = np.array([0, 120, 70])
    upper_red1 = np.array([10, 255, 255])
    lower_red2 = np.array([170, 120, 70])
    upper_red2 = np.array([180, 255, 255])
    mask1 = cv2.inRange(hsv, lower_red1, upper_red1)
    mask2 = cv2.inRange(hsv, lower_red2, upper_red2)
    mask = cv2.bitwise_or(mask1, mask2)

    # kohinan poistoa
    mask = cv2.erode(mask, None, iterations=2)
    mask = cv2.dilate(mask, None, iterations=2)

    # centroidin laskeminen -> ennusta liikesuunta vertaamalla edelliseen sijaintiin
    M = cv2.moments(mask)
    if M["m00"] > area_threshold:
        cx = int(M["m10"] / M["m00"])
        cy = int(M["m01"] / M["m00"])
        cv2.circle(frame, (cx, cy), 5, (255, 0, 0), -1)

        if prev_centroid:
            dx = cx - prev_centroid[0]
            dy = cy - prev_centroid[1]

            if abs(dx) > movement_threshold or abs(dy) > movement_threshold:
                direction = ""
                if dy < -movement_threshold:
                    direction += "Ylös "
                elif dy > movement_threshold:
                    direction += "Alas "
                if dx < -movement_threshold:
                    direction += "Vasemmalle"
                elif dx > movement_threshold:
                    direction += "Oikealle"

                print(f"Pallon arvioitu suunta: {direction.strip()}")

                arrow_start = prev_centroid
                arrow_end = (cx, cy)
                last_move_time = time.time()

        prev_centroid = (cx, cy)
    else:
        prev_centroid = None

    # jakoalueet, TODO muutetaan vielä
    frame_height, frame_width = frame.shape[:2]
    cv2.line(frame, (frame_width // 2, 0), (frame_width // 2, frame_height), (200, 200, 200), 1)
    cv2.line(frame, (0, frame_height // 2), (frame_width, frame_height // 2), (200, 200, 200), 1)
    cv2.putText(frame, "YLA-VASEN", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 200, 200), 1)
    cv2.putText(frame, "YLA-OIKEA", (frame_width - 130, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 200, 200), 1)
    cv2.putText(frame, "ALA-VASEN", (10, frame_height - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 200, 200), 1)
    cv2.putText(frame, "ALA-OIKEA", (frame_width - 130, frame_height - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (200, 200, 200), 1)

    # nuoli, jos liike on tuore
    if arrow_start and arrow_end and (time.time() - last_move_time < arrow_duration):
        cv2.arrowedLine(frame, arrow_start, arrow_end, (0, 0, 255), 4, tipLength=0.3)

    # FPS
    fps = 1 / (time.time() - start_time)
    cv2.putText(frame, f"FPS: {fps:.2f}", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)

    # näytöt
    cv2.imshow("Pallon arvio", frame)
    cv2.imshow("Maski", mask)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
