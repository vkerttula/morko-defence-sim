export interface Goalie {
    x: number;
    y: number;
    armLength: number;
    currentAngle: number;
    targetAngle: number | null;
    visibleArmLength: number;
    maxArmLength: number;
    fastSpeed: number;
    slowSpeed: number;
    background?: ImageData | null;
}
