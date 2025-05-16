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
    // Viivan paksuus
    ctx.lineWidth = 40;
    const radius = 40; // kulman pyöristyksen säde
    const offset = ctx.lineWidth / 2; // jotta paksu viiva ei riko kaaren ulkoreunaa

    ctx.strokeStyle = "red";
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    ctx.beginPath();

    // Aloitetaan vasemmalta alhaalta
    ctx.moveTo(offset, canvas.height);

    // Vasen tolppa ylös
    ctx.lineTo(offset, radius + offset);

    // Vasemman yläkulman kaari (pyöreä ulkoreuna)
    ctx.arc(
        radius + offset, // x
        radius + offset, // y
        radius, // säde
        Math.PI, // aloituskulma (vasemmalta)
        1.5 * Math.PI // loppukulma (ylös)
    );

    // Ylärima oikealle
    ctx.lineTo(canvas.width - radius - offset, offset);

    // Oikean yläkulman kaari
    ctx.arc(canvas.width - radius - offset, radius + offset, radius, 1.5 * Math.PI, 0);

    // Oikea tolppa alas
    ctx.lineTo(canvas.width - offset, canvas.height);

    ctx.stroke();

    ctx.save(); // Tallenna nykyinen tila
    ctx.beginPath();

    const innerOffset = ctx.lineWidth; // Verkko pysyy tolppien sisäreunan sisäpuolella

    // Uusi tiukempi verkon rajausalue
    ctx.moveTo(innerOffset, radius);
    ctx.lineTo(innerOffset, canvas.height);
    ctx.lineTo(canvas.width - innerOffset, canvas.height);
    ctx.lineTo(canvas.width - innerOffset, radius);
    ctx.arcTo(
        canvas.width - innerOffset,
        radius - radius,
        canvas.width - radius - innerOffset,
        radius - radius,
        radius
    );
    ctx.lineTo(radius + innerOffset, radius - radius);
    ctx.arcTo(innerOffset, radius - radius, innerOffset, radius, radius);
    ctx.closePath();
    ctx.clip();

    // Verkko piirretään vain rajoitetulle alueelle
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#aaa";

    // Pystyviivat
    for (let x = 20; x <= canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, radius);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // Vaakaviivat
    for (let y = radius; y <= canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(20, y);
        ctx.lineTo(canvas.width - 20, y);
        ctx.stroke();
    }

    ctx.restore(); // Palautetaan alkuperäinen tila, ettei rajaus vaikuta muihin osiin

    // vartalo ja pää
    const canvasBottom = canvas.height;
    const bodyWidth = canvas.width * 0.5;
    const bodyHeight = canvas.height + 400;
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
    const eyeRadius = 7;
    const pupilRadius = 3;

    // Vasemman silmän valkoinen osa
    ctx.beginPath();
    ctx.ellipse(goalie.x - 15, goalie.y - 70, eyeRadius + 2, eyeRadius, 0, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();

    // Oikean silmän valkoinen osa
    ctx.beginPath();
    ctx.ellipse(goalie.x + 15, goalie.y - 70, eyeRadius + 2, eyeRadius, 0, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();

    // Vasemman silmän pupilli, keskitetty ja hieman varjostettu
    ctx.beginPath();
    ctx.arc(goalie.x - 15, goalie.y - 70, pupilRadius, 0, Math.PI * 2);
    const pupilGradientLeft = ctx.createRadialGradient(
        goalie.x - 15,
        goalie.y - 70,
        1,
        goalie.x - 15,
        goalie.y - 70,
        pupilRadius
    );
    pupilGradientLeft.addColorStop(0, "#222");
    pupilGradientLeft.addColorStop(1, "#000");
    ctx.fillStyle = pupilGradientLeft;
    ctx.fill();

    // Oikean silmän pupilli
    ctx.beginPath();
    ctx.arc(goalie.x + 15, goalie.y - 70, pupilRadius, 0, Math.PI * 2);
    const pupilGradientRight = ctx.createRadialGradient(
        goalie.x + 15,
        goalie.y - 70,
        1,
        goalie.x + 15,
        goalie.y - 70,
        pupilRadius
    );
    pupilGradientRight.addColorStop(0, "#222");
    pupilGradientRight.addColorStop(1, "#000");
    ctx.fillStyle = pupilGradientRight;
    ctx.fill();

    // suu – leveämpi ja luonnollisempi hymy varjostuksella
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#fff";
    ctx.shadowColor = "rgba(255, 255, 255, 0.6)";
    ctx.arc(goalie.x, goalie.y - 30, 18, 0, Math.PI / 1.6, false);
    ctx.stroke();
    ctx.shadowBlur = 0;

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

    const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
    gradient.addColorStop(0, "rgba(68, 68, 68, 0.2)");
    gradient.addColorStop(0.5, "rgba(68, 68, 68, 0.8)");
    gradient.addColorStop(1, "rgba(68, 68, 68, 1)");

    const maxWidth = 120;
    const minWidth = 50;
    const segments = 30;

    ctx.save();
    ctx.beginPath();

    ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Vartalon muoto
    const canvasBottom = ctx.canvas.height;
    const bodyWidth = ctx.canvas.width * 0.5;
    const bodyHeight = ctx.canvas.height + 400;
    const left = goalie.x - bodyWidth / 2;
    const right = goalie.x + bodyWidth / 2;
    const top = goalie.y - bodyHeight / 2;

    ctx.moveTo(left, canvasBottom);
    ctx.quadraticCurveTo(goalie.x, top, right, canvasBottom);
    ctx.quadraticCurveTo(goalie.x, canvasBottom + 50, left, canvasBottom);

    ctx.clip("evenodd");

    // Piirrä käsi vain vartalon ulkopuolelle
    ctx.lineCap = "round";
    for (let i = 0; i < segments; i++) {
        const t0 = i / segments;
        const t1 = (i + 1) / segments;

        const x0 = startX + Math.cos(goalie.currentAngle) * (length + 60) * t0;
        const y0 = startY + Math.sin(goalie.currentAngle) * (length + 10) * t0;
        const x1 = startX + Math.cos(goalie.currentAngle) * (length + 60) * t1;
        const y1 = startY + Math.sin(goalie.currentAngle) * (length + 10) * t1;

        const lineWidth = maxWidth + (minWidth - maxWidth) * t0 + 20;

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
    }

    ctx.restore();
}

const CALIBRATION_OFFSET_DEG = -10;

export function setGoalieTargetAngleFromSector(sectorAngleDeg: number) {
    let conditionalOffset = sectorAngleDeg > 100 ? CALIBRATION_OFFSET_DEG : -CALIBRATION_OFFSET_DEG;
    const mathAngleDeg = (360 - sectorAngleDeg + conditionalOffset) % 360;

    const mathAngleDegMirroredLeftRight = 180 - mathAngleDeg;
    const mathAngleDegMirroredNormalized = ((mathAngleDegMirroredLeftRight % 360) + 360) % 360;

    const mathAngleRad = (mathAngleDegMirroredLeftRight * Math.PI) / 180;

    goalie.targetAngle = mathAngleRad;

    console.log(
        `Goalie target angle set to (Left/Right Mirrored): ${goalie.targetAngle.toFixed(
            2
        )} radians (From: ${sectorAngleDeg}° User CW -> ${mathAngleDeg}° Std Math CCW). Display angle (mirrored): ${mathAngleDegMirroredNormalized}°`
    );
}