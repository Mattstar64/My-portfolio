function initNetwork() {
    const canvas = document.getElementById("network-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    /* ------------------ CANVAS RESIZE ------------------ */
    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return; // 🔥 guard

        const dpr = window.devicePixelRatio || 1;

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /* ------------------ GRAPH DATA ------------------ */
    const nodes = {
        "me": { x: 400, y: 250, color: "white", r: 12, vx: 0, vy: 0 },
        "David Figuerido": { x: 250, y: 150, color: "#4da6ff", r: 9, vx: 0, vy: 0 },
        "Frank Jeannin": { x: 550, y: 150, color: "#ffe066", r: 9, vx: 0, vy: 0 },
        "Lydie Bas": { x: 400, y: 420, color: "#ff4d6d", r: 9, vx: 0, vy: 0 },
        "Thibault Dufaure-De-Citres": { x: 150, y: 80, color: "#4da6ff", r: 7, vx: 0, vy: 0 },
        "Victor Granger": { x: 135, y: 250, color: "#4da6ff", r: 7, vx: 0, vy: 0 },
        "Natacha Boez": { x: 650, y: 80, color: "#ffe066", r: 7, vx: 0, vy: 0 },
        "Clément Lagier": { x: 175, y: 60, color: "#4da6ff", r: 7, vx: 0, vy: 0 },
    };

    const edges = [
        ["me", "David Figuerido"],
        ["me", "Frank Jeannin"],
        ["me", "Lydie Bas"],
        ["David Figuerido", "Thibault Dufaure-De-Citres"],
        ["David Figuerido", "Victor Granger"],
        ["Frank Jeannin", "Natacha Boez"],
        ["Thibault Dufaure-De-Citres", "Clément Lagier"],
        ["David Figuerido", "Frank Jeannin"],
        ["Victor Granger", "Lydie Bas"],
    ];

    /* ------------------ DRAWING ------------------ */
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const rect = canvas.getBoundingClientRect();

        ctx.beginPath();
        ctx.rect(0, 0, rect.width, rect.height);
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgba(254,0,216,0.6)";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(254,0,216,0.8)";
        ctx.stroke();
        ctx.shadowBlur = 0;

        edges.forEach(([a, b]) => {
            const n1 = nodes[a];
            const n2 = nodes[b];
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = "rgba(254,0,216,0.6)";
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        Object.entries(nodes).forEach(([name, node]) => {
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);

            ctx.fillStyle = node.color;
            ctx.fill();

            ctx.lineWidth = 3;
            ctx.strokeStyle = "rgba(254,0,216,0.9)";
            ctx.shadowBlur = 12;
            ctx.shadowColor = "rgba(254,0,216,0.8)";
            ctx.stroke();
            ctx.shadowBlur = 0;

            ctx.fillStyle = "white";
            ctx.font = "12px Orbitron";
            ctx.fillText(name, node.x + node.r + 4, node.y + 4);
        });
    }

    /* ------------------ PHYSICS ------------------ */
    function physics() {
        const friction = 0.92;
        const rect = canvas.getBoundingClientRect();

        Object.values(nodes).forEach(node => {
            node.x += node.vx;
            node.y += node.vy;

            if (node.x < node.r) { node.x = node.r; node.vx *= -0.5; }
            if (node.y < node.r) { node.y = node.r; node.vy *= -0.5; }
            if (node.x > rect.width - node.r) { node.x = rect.width - node.r; node.vx *= -0.5; }
            if (node.y > rect.height - node.r) { node.y = rect.height - node.r; node.vy *= -0.5; }

            node.vx *= friction;
            node.vy *= friction;
        });
    }

    function loop() {
        physics();
        draw();
        requestAnimationFrame(loop);
    }

    /* ------------------ START (FIXED) ------------------ */
    function start() {
        resizeCanvas();

        const observer = new ResizeObserver(resizeCanvas);
        observer.observe(canvas);

        loop(); // ✅ ONLY start here
    }

    // ✅ wait for layout + fonts
    document.fonts.ready.then(() => {
        requestAnimationFrame(() => {
            requestAnimationFrame(start);
        });
    });
}