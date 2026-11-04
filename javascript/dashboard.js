
// ===== SELECT ELEMENTS =====

const menuBtn = document.querySelector("#menuBtn");
const sidebar = document.querySelector("#sidebar");
const menuOverlay = document.querySelector("#menuOverlay");

// ===== OPEN / CLOSE SIDEBAR =====

function openMenu() {
    sidebar.classList.add("show");
    menuOverlay.classList.add("show");

    menuBtn.setAttribute("aria-expanded", "true");
    menuBtn.setAttribute("aria-label", "Close navigation menu");

    menuBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
}

function closeMenu() {
    sidebar.classList.remove("show");
    menuOverlay.classList.remove("show");

    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open navigation menu");

    menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
}

// ===== TOGGLE ON BUTTON CLICK =====

menuBtn.addEventListener("click", () => {
    const isOpen = sidebar.classList.contains("show");

    if (isOpen) {
        closeMenu();
    } else {
        openMenu();
    }
});

// ===== CLOSE WHEN OVERLAY IS CLICKED =====

menuOverlay.addEventListener("click", closeMenu);

// ===== CLOSE WHEN A NAVIGATION LINK IS CLICKED =====

sidebar.querySelectorAll(".sidebar-nav a").forEach((link) => {
    link.addEventListener("click", () => {
        closeMenu();
    });
});

// ===== CLOSE WITH ESCAPE KEY =====

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
    }
});

// ===== RESET WHEN RETURNING TO DESKTOP =====

window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
        closeMenu();
    }
});