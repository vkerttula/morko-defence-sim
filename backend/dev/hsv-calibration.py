import cv2
import numpy as np

# Global variables to store HSV frame and clicked pixel
hsv_frame = None
clicked_pixel_hsv = None

# Mouse event handler
def mouse_callback(event, x, y, flags, param):
    global hsv_frame, clicked_pixel_hsv

    if event == cv2.EVENT_LBUTTONDOWN and hsv_frame is not None:
        clicked_pixel_hsv = hsv_frame[y, x]
        print(f"Clicked point: ({x}, {y}) - HSV: {clicked_pixel_hsv}")

# Camera setup
cap = cv2.VideoCapture(1)
cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)

# Create window and set mouse callback
cv2.namedWindow("Frame")
cv2.setMouseCallback("Frame", mouse_callback)

print("Click different parts of the ball in the image to see HSV values.")
print("Press 'q' to quit.")

while True:
    ret, frame = cap.read()
    if not ret:
        print("Error reading frame.")
        break

    hsv_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)

    cv2.imshow("Frame", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
