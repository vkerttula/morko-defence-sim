import type { Goalie } from "../types/types";

export let goalie: Goalie = {
    x: 0,
    y: 0,
    armLength: 400,
    currentAngle: Math.PI / 2,
    targetAngle: null,
    visibleArmLength: 0,
    maxArmLength: 0,
    fastSpeed: 0,
    slowSpeed: 0,
    background: null,
};

export function initGoalie(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    goalie.x = canvas.width / 2;
    goalie.y = canvas.height / 2 + 50;
    goalie.maxArmLength = canvas.width / 2 - 50;
    goalie.fastSpeed = 0; // ei käytetä
    goalie.slowSpeed = 0; // ei käytetä

    drawStaticScene(ctx, canvas);
}

function drawStaticScene(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    // maali ilman alareunaa
    ctx.strokeStyle = "red";
    ctx.lineWidth = 40;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.moveTo(0, 0);
    ctx.lineTo(0, canvas.height);
    ctx.moveTo(canvas.width, 0);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();

    // verkko
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#aaa";
    for (let x = 20; x <= canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 20);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 20; y <= canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(20, y);
        ctx.lineTo(canvas.width - 20, y);
        ctx.stroke();
    }

    // vartalo ja pää
    const canvasBottom = canvas.height;
    const bodyWidth = canvas.width * 0.33;
    const bodyHeight = canvas.height + 180;
    const left = goalie.x - bodyWidth / 2;
    const right = goalie.x + bodyWidth / 2;
    const top = goalie.y - bodyHeight / 2;

    ctx.beginPath();
    ctx.moveTo(left, canvasBottom);
    ctx.quadraticCurveTo(goalie.x, top, right, canvasBottom);
    ctx.quadraticCurveTo(goalie.x, canvasBottom + 50, left, canvasBottom);
    ctx.fillStyle = "#444";
    ctx.fill();
    ctx.closePath();

    // silmät
    ctx.beginPath();
    ctx.arc(goalie.x - 15, goalie.y - 40, 5, 0, Math.PI * 2);
    ctx.arc(goalie.x + 15, goalie.y - 40, 5, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();

    // suu
    ctx.beginPath();
    ctx.arc(goalie.x, goalie.y - 10, 10, 0, Math.PI, false);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    goalie.background = ctx.getImageData(0, 0, canvas.width, canvas.height);
}

export function updateGoalieArm() {
    const target = goalie.targetAngle ?? Math.PI / 2;
    const diff = target - goalie.currentAngle;
    const angleDiff = Math.atan2(Math.sin(diff), Math.cos(diff));

    if (Math.abs(angleDiff) > 0.01) {
        goalie.currentAngle += angleDiff * 0.2;
    } else {
        goalie.currentAngle = target;
    }
}

export function drawGoalieArm(ctx: CanvasRenderingContext2D) {
    const length = goalie.maxArmLength;
    const startX = goalie.x;
    const startY = goalie.y + 10;

    const endX = startX + Math.cos(goalie.currentAngle) * (length + 60);
    const endY = startY + Math.sin(goalie.currentAngle) * (length + 10);

    // hieno gradient
    const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
    gradient.addColorStop(0, "rgba(68, 68, 68, 0.2)");
    gradient.addColorStop(0.5, "rgba(68, 68, 68, 0.8)");
    gradient.addColorStop(1, "rgba(68, 68, 68, 1)");

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 32;
    ctx.stroke();
    ctx.closePath();
}
