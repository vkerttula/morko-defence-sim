import { initGoalie, updateGoalieArm, drawGoalieArm, goalie } from "./core/goalie.ts";
import "./dev/manualInputs.ts"; // testaukseen

const canvas = document.getElementById("goalCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;

initGoalie(ctx, canvas);

function animate() {
    ctx.putImageData(goalie.background!, 0, 0);
    updateGoalieArm();
    drawGoalieArm(ctx);
    requestAnimationFrame(animate);
}

animate();
