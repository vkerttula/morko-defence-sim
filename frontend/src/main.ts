// Import goalie logic and rendering
import {
    initGoalie,
    updateGoalieArm,
    drawGoalieArm,
    goalie,
    setGoalieTargetAngleFromSector,
} from "./core/goalie.ts";

// Developer-only input overrides
import "./dev/manualInputs.ts";

// Sector visualization (uses goalie position)
import { drawPizzaSectors } from "./dev/sectors.ts";

import { io } from "socket.io-client";

// --- WebSocket client setup ---
const SOCKET_SERVER_URL = "http://localhost:5000";
const socket = io(SOCKET_SERVER_URL);

socket.on("connect", () => {
    console.log("WebSocket connected:", SOCKET_SERVER_URL);
});

socket.on("disconnect", () => {
    console.log("WebSocket connection lost.");
});

// Listen for sector updates from backend
socket.on("sector_update", (data) => {
    console.log("Sector update received:", data);

    const receivedAngle = data.sector_angle;

    if (typeof receivedAngle === "number") {
        setGoalieTargetAngleFromSector(receivedAngle);
    } else {
        console.error("Unexpected data format for sector angle:", data);
    }
});
// --- End of WebSocket client setup ---

const canvas = document.getElementById("goalCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

// Initialize goalie
initGoalie(ctx, canvas);

let showPizzaSectors = true;
(window as any).togglePizzaSectors = () => {
    showPizzaSectors = !showPizzaSectors;
};

function animate() {
    // Redraw static background if available
    if (goalie.background) {
        ctx.putImageData(goalie.background, 0, 0);
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // drawStaticScene(ctx, canvas); // Requires exporting if needed
    }

    updateGoalieArm();
    drawGoalieArm(ctx);

    if (showPizzaSectors) {
        drawPizzaSectors(ctx, canvas, goalie.x, goalie.y);
    }

    requestAnimationFrame(animate);
}

animate();
