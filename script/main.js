document.addEventListener("DOMContentLoaded", () => {
    const main = document.querySelector("main");

    const routes = {
        "main-btn": "html_contents/home.html",
        "aboutme-btn": "html_contents/aboutme.html",
        "school-btn": "html_contents/studies.html",
        "career-btn": "html_contents/career.html",
        "projects-btn": "html_contents/projects.html",
        "network-btn": "html_contents/network.html"
    };

    // 🔗 Correspondance mobile → desktop
    const mobileMap = {
        "mobile-main-btn": "main-btn",
        "mobile-aboutme-btn": "aboutme-btn",
        "mobile-school-btn": "school-btn",
        "mobile-career-btn": "career-btn",
        "mobile-projects-btn": "projects-btn",
        "mobile-network-btn": "network-btn"
    };

    let currentActive = null;

    async function loadPage(path, buttonId) {
        try {
            const response = await fetch(path);
            if (!response.ok) throw new Error("Page not found");

            const html = await response.text();
            main.innerHTML = html;

            // 🔥 Desktop active
            if (currentActive) currentActive.classList.remove("active");
            const newActive = document.getElementById(buttonId);
            if (newActive) {
                newActive.classList.add("active");
                currentActive = newActive;
            }

            // 🔥 Mobile active sync
            Object.keys(mobileMap).forEach(mobileId => {
                const btn = document.getElementById(mobileId);
                if (btn) btn.classList.remove("active");
            });

            const activeMobileId = Object.keys(mobileMap).find(
                key => mobileMap[key] === buttonId
            );
            const activeMobileBtn = document.getElementById(activeMobileId);
            if (activeMobileBtn) activeMobileBtn.classList.add("active");

            // 🔥 Init scripts spécifiques
            if (path.includes("network.html") && typeof initNetwork === "function") {
                initNetwork();
            }

            if (path.includes("aboutme.html") && typeof initAboutMe === "function") {
                initAboutMe();
            }

        } catch (err) {
            main.innerHTML = `<h2>Error</h2><p>Could not load ${path}</p>`;
            console.error(err);
        }
    }

    // =========================
    // DESKTOP EVENTS
    // =========================
    Object.keys(routes).forEach(id => {
        const btn = document.getElementById(id);
        if (!btn) return;

        btn.addEventListener("click", () => {
            loadPage(routes[id], id);
        });
    });

    // =========================
    // MOBILE EVENTS
    // =========================
    Object.keys(mobileMap).forEach(mobileId => {
        const btn = document.getElementById(mobileId);
        if (!btn) return;

        btn.addEventListener("click", () => {
            const desktopId = mobileMap[mobileId];
            loadPage(routes[desktopId], desktopId);

            // 🔥 fermer menu
            const menuContent = document.getElementById("mobile-menu-content");
            if (menuContent) {
                menuContent.style.display = "none";
            }
        });
    });

    // =========================
    // TOGGLE MENU MOBILE
    // =========================
    const menuBtn = document.getElementById("mobile-menu-btn");
    const menuContent = document.getElementById("mobile-menu-content");

    if (menuBtn && menuContent) {
        menuBtn.addEventListener("click", () => {
            menuContent.style.display =
                menuContent.style.display === "flex" ? "none" : "flex";
        });
    }

    // =========================
    // LOAD DEFAULT PAGE
    // =========================
    loadPage(routes["main-btn"], "main-btn");
    // =========================
    // CONTACT MODAL
    // =========================
    const contactBtn = document.getElementById("contact_button");
    const modal = document.getElementById("contact-modal");
    const overlay = document.getElementById("contact-overlay");
    const closeBtn = document.getElementById("close-contact");

    if (contactBtn && modal) {
        contactBtn.addEventListener("click", () => {
            modal.style.display = "flex";
        });
    }

    if (overlay) {
        overlay.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }
});