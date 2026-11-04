// Mobile Sidebar
const menuBtn = document.querySelector("#menuBtn");
const sidebar = document.querySelector("#sidebar");
const menuOverlay = document.querySelector("#menuOverlay");

function openMenu() {
    sidebar.classList.add("show");
    menuOverlay.classList.add("show");
}

function closeMenu() {
    sidebar.classList.remove("show");
    menuOverlay.classList.remove("show");
}

menuBtn.addEventListener("click", openMenu);
menuOverlay.addEventListener("click", closeMenu);

// Close sidebar when a navigation link is clicked
document.querySelectorAll(".sidebar nav a").forEach(link => {
    link.addEventListener("click", closeMenu);
});

// Support Form
const supportForm = document.querySelector("#supportForm");

supportForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const subject = document.querySelector("#subject").value.trim();
    const message = document.querySelector("#message").value.trim();

    if (!name || !email || !subject || !message) {
        alert("Please fill in all fields.");
        return;
    }

    alert("Your message has been submitted successfully!");

    supportForm.reset();
});