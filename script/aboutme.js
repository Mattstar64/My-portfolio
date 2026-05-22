function initAboutMe() {
    const buttons = document.querySelectorAll(".rail-btn");
    const contents = document.querySelectorAll(".content");
    const rail = document.getElementById("selector-rail");

    if (!rail) return;

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            contents.forEach(c => c.classList.remove("active"));

            btn.classList.add("active");
            document.getElementById(btn.dataset.target).classList.add("active");
        });
    });

    function positionButtons() {
        const isPortrait = window.matchMedia("(orientation: portrait)").matches;
        if (isPortrait) return;

        const width = rail.offsetWidth;
        const height = rail.offsetHeight;

        if (!width || !height) return; // safety

        const radius = height / 2 - 20;
        const centerX = width / 2 - (width * 0.4);
        const centerY = height / 2;

        const total = buttons.length;
        const step = total > 1 ? (Math.PI / (total - 1)) : 0;

        buttons.forEach((btn, i) => {
            const angle = -Math.PI / 2 + step * i;

            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            const offsetX = (i === 2) ? 80 : 0;
            const offsetY = (i === 2) ? -20 : 0;

            btn.style.left = `${centerX + x + offsetX}px`;
            btn.style.top = `${centerY + y + offsetY}px`;
        });
    }

    // ✅ Wait for fonts + layout
    document.fonts.ready.then(() => {
        requestAnimationFrame(() => {
            requestAnimationFrame(positionButtons);
        });
    });

    window.addEventListener("resize", positionButtons);
}