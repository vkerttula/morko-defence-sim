export enum Direction {
    Ylavasen = "Ylavasen",
    Ylos = "Ylos",
    Ylaoikea = "Ylaoikea",
    Vasen = "Vasen",
    Paikallaan = "Paikallaan",
    Oikea = "Oikea",
    Alavasen = "Alavasen",
    Alas = "Alas",
    Alaoikea = "Alaoikea",
}

export const DIRECTION_VECTORS: Record<Direction, [number, number]> = {
    [Direction.Ylavasen]: [-1, -1],
    [Direction.Ylos]: [0, -1],
    [Direction.Ylaoikea]: [1, -1],
    [Direction.Vasen]: [-1, 0],
    [Direction.Paikallaan]: [0, 0],
    [Direction.Oikea]: [1, 0],
    [Direction.Alavasen]: [-1, 1],
    [Direction.Alas]: [0, 1],
    [Direction.Alaoikea]: [1, 1],
};
