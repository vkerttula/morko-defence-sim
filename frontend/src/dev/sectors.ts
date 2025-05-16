export function drawPizzaSectors(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    centerX: number,
    centerY: number
) {
    const sectors = 12;
    const radius = Math.max(canvas.width, canvas.height);
    const step = (2 * Math.PI) / sectors;

    ctx.save();
    ctx.globalAlpha = 0.08;

    for (let i = 0; i < sectors; i++) {
        const startAngle = -Math.PI / 2 + i * step;
        const endAngle = startAngle + step;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();

        ctx.fillStyle = i % 2 === 0 ? "red" : "green";
        ctx.fill();

        // Kulmateksti
        ctx.save();
        ctx.fillStyle = "#000";
        ctx.globalAlpha = 0.4;
        ctx.translate(centerX, centerY);
        const midAngle = (startAngle + endAngle) / 2;
        const labelX = Math.cos(midAngle) * radius * 0.2;
        const labelY = Math.sin(midAngle) * radius * 0.2;
        ctx.font = "28px monospace";
        ctx.fillText(`${Math.round((midAngle * 180) / Math.PI)}°`, labelX, labelY);
        ctx.restore();
    }

    ctx.restore();
}
