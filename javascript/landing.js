const menuToggle = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");

// Open and close mobile navigation
menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("show");

    const icon = menuToggle.querySelector("i");

    if (navLinks.classList.contains("show")) {
        icon.classList.replace("fa-bars", "fa-xmark");
    } else {
        icon.classList.replace("fa-xmark", "fa-bars");
    }
});

// Close menu when a navigation link is clicked
document.querySelectorAll("#navLinks a").forEach(link => {
    link.addEventListener("click", function () {
        navLinks.classList.remove("show");

        const icon = menuToggle.querySelector("i");
        icon.classList.replace("fa-xmark", "fa-bars");
    });
});

// Close menu when screen becomes desktop size
window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
        navLinks.classList.remove("show");

        const icon = menuToggle.querySelector("i");
        icon.classList.replace("fa-xmark", "fa-bars");
    }
});