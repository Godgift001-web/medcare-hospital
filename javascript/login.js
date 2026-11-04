const loginForm = document.querySelector("#loginForm");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const togglePassword = document.querySelector("#togglePassword");
const formNotice = document.querySelector("#formNotice");

// Show or hide password
togglePassword.addEventListener("click", function () {
    const isPassword = passwordInput.type === "password";

    passwordInput.type = isPassword ? "text" : "password";

    togglePassword.innerHTML = isPassword
        ? '<i class="fa-regular fa-eye-slash"></i>'
        : '<i class="fa-regular fa-eye"></i>';
});

// Demo login
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    document.querySelector("#emailError").textContent = "";
    document.querySelector("#passwordError").textContent = "";
    formNotice.textContent = "";

    let valid = true;

    if (!email) {
        document.querySelector("#emailError").textContent =
            "Please enter your email address.";
        valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        document.querySelector("#emailError").textContent =
            "Please enter a valid email address.";
        valid = false;
    }

    if (!password) {
        document.querySelector("#passwordError").textContent =
            "Please enter your password.";
        valid = false;
    }

    if (!valid) return;

    formNotice.textContent = "Sign in successful! Redirecting...";

    setTimeout(function () {
        window.location.href = "dashboard.html";
    }, 1000);
});

// Forgot password
document.querySelector("#forgotPassword").addEventListener("click", function (event) {
    event.preventDefault();
    formNotice.textContent =
        "Password recovery is not available in this demo.";
});