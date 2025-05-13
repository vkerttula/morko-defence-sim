import { DIRECTION_VECTORS, Direction } from "../enums/directions";
import { goalie } from "../core/goalie";

export function simulateDirectionInput(dir: Direction) {
    const [dx, dy] = DIRECTION_VECTORS[dir];

    if (dx === 0 && dy === 0) return;

    goalie.targetAngle = Math.atan2(dy, dx);

    setTimeout(() => {
        goalie.targetAngle = null;
    }, 1200);
}

// @ts-ignore: HTML-nappeja varten
(window as any).setDirection = simulateDirectionInput;
