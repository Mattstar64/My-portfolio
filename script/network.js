function initNetwork() {
    const canvas = document.getElementById("network-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    /* ------------------ CANVAS RESIZE ------------------ */
    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height) return;

        const dpr = window.devicePixelRatio || 1;

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.imageSmoothingEnabled = true;
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

    /* ------------------ DRAW ------------------ */
    function draw() {
        const rect = canvas.getBoundingClientRect();
        ctx.clearRect(0, 0, rect.width, rect.height);

        // Border
        ctx.beginPath();
        ctx.rect(0, 0, rect.width, rect.height);
        ctx.lineWidth = 4;
        ctx.strokeStyle = "rgba(254,0,216,0.6)";
        ctx.shadowBlur = 15;
        ctx.shadowColor = "rgba(254,0,216,0.8)";
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Edges
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

        // Nodes
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

            // Bounds
            if (node.x < node.r) { node.x = node.r; node.vx *= -0.5; }
            if (node.y < node.r) { node.y = node.r; node.vy *= -0.5; }
            if (node.x > rect.width - node.r) { node.x = rect.width - node.r; node.vx *= -0.5; }
            if (node.y > rect.height - node.r) { node.y = rect.height - node.r; node.vy *= -0.5; }

            node.vx *= friction;
            node.vy *= friction;
        });
    }

    /* ------------------ DRAG (POINTER EVENTS) ------------------ */
    let draggingNode = null;
    let offsetX = 0;
    let offsetY = 0;
    let lastX = 0;
    let lastY = 0;

    function getPointerPos(e) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    function getNodeAt(x, y) {
        for (const node of Object.values(nodes)) {
            const dx = x - node.x;
            const dy = y - node.y;
            if (Math.sqrt(dx * dx + dy * dy) < node.r + 5) {
                return node;
            }
        }
        return null;
    }

    canvas.addEventListener("pointerdown", (e) => {
        const pos = getPointerPos(e);
        const node = getNodeAt(pos.x, pos.y);

        if (node) {
            draggingNode = node;
            offsetX = pos.x - node.x;
            offsetY = pos.y - node.y;

            lastX = pos.x;
            lastY = pos.y;

            node.vx = 0;
            node.vy = 0;

            canvas.setPointerCapture(e.pointerId);
        }
    });

    canvas.addEventListener("pointermove", (e) => {
        if (!draggingNode) return;

        const pos = getPointerPos(e);

        draggingNode.vx = (pos.x - lastX) * 0.3;
        draggingNode.vy = (pos.y - lastY) * 0.3;

        draggingNode.x = pos.x - offsetX;
        draggingNode.y = pos.y - offsetY;

        lastX = pos.x;
        lastY = pos.y;
    });

    canvas.addEventListener("pointerup", (e) => {
        draggingNode = null;
        canvas.releasePointerCapture(e.pointerId);
    });

    canvas.addEventListener("pointercancel", () => {
        draggingNode = null;
    });

    /* ------------------ LOOP ------------------ */
    function loop() {
        physics();
        draw();
        requestAnimationFrame(loop);
    }

    /* ------------------ START ------------------ */
    function start() {
        resizeCanvas();

        const observer = new ResizeObserver(resizeCanvas);
        observer.observe(canvas);

        loop();
    }

    if (document.fonts) {
        document.fonts.ready.then(() => {
            requestAnimationFrame(() => {
                requestAnimationFrame(start);
            });
        });
    } else {
        start();
    }
}

/* ------------------ INIT ------------------ */
initNetwork();