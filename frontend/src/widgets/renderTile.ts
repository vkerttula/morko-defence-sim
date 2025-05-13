export function renderTitle(text: string, elementId: string) {
    const el = document.getElementById(elementId);
    if (!el) return;

    el.innerHTML = "";

    const retroColors = [
        "#007700", // terminal green
        "#005577", // deep cyan
        "#333300", // muted yellow-brown
        "#552200", // rusty orange
        "#444444", // gray
        "#003366", // IBM blue
        "#224400", // olive
        "#330033", // dark magenta
    ];

    [...text].forEach((char, i) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.animationDelay = `${i * 0.1}s`;
        span.style.color = retroColors[Math.floor(Math.random() * retroColors.length)];
        el.appendChild(span);
    });
}
