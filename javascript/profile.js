
"use strict";

/* =========================
   1. SELECT ELEMENTS
========================= */

const menuBtn = document.querySelector("#menuBtn");
const sidebar = document.querySelector("#sidebar");
const menuOverlay = document.querySelector("#menuOverlay");

const profileForm = document.querySelector("#profileForm");
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");
const formActions = document.querySelector("#formActions");

const resetBtn = document.querySelector("#resetBtn");
const editProfileBtn = document.querySelector("#editProfileBtn");
const photoInput = document.querySelector("#photoInput");
const savedIndicator = document.querySelector("#savedIndicator");
const toast = document.querySelector("#toast");

const STORAGE_KEY = "medcareProfileDemo";
let toastTimer;
let savedProfile = {};
let photoData = "";
let savedPhotoData = "";
let currentTab = "personal";

const profileFields = [
  "fullName",
  "dateOfBirth",
  "gender",
  "bloodGroup",
  "height",
  "weight",
  "email",
  "phone",
  "address",
  "city",
  "state",
  "emergencyName",
  "emergencyRelationship",
  "emergencyPhone",
  "allergies",
  "medications",
  "conditions"
];

const defaultProfile = {
  fullName: "Shajiofisi Godgift",
  dateOfBirth: "",
  gender: "",
  bloodGroup: "",
  height: "",
  weight: "",
  email: "shajiofisigift@gmail.com",
  phone: "+234 801 234 5678",
  address: "",
  city: "",
  state: "",
  emergencyName: "",
  emergencyRelationship: "",
  emergencyPhone: "",
  allergies: "",
  medications: "",
  conditions: ""
};

/* =========================
   2. GENERAL HELPERS
========================= */

function showToast(message) {
  clearTimeout(toastTimer);

  toast.textContent = message;
  toast.classList.add("show");

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

function getInitials(name) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0] || "")
    .join("")
    .toUpperCase() || "GS";
}

function formatDate(dateString) {
  if (!dateString) {
    return "Not provided";
  }

  const date = new Date(`${dateString}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "Not provided";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);
}

function getFormData() {
  const data = {};

  profileFields.forEach(id => {
    const field = document.getElementById(id);
    data[id] = field.value.trim();
  });

  return data;
}

function populateForm(data) {
  profileFields.forEach(id => {
    const field = document.getElementById(id);

    field.value = data[id] ?? "";
  });
}

function getProfileFromStorage() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);

    if (!rawData) {
      return { ...defaultProfile };
    }

    const parsed = JSON.parse(rawData);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ...defaultProfile };
    }

    const result = { ...defaultProfile };

    profileFields.forEach(id => {
      if (typeof parsed[id] === "string") {
        result[id] = parsed[id];
      }
    });

    return result;
  } catch {
    showToast("Browser storage is unavailable. Changes may not persist.");
    return { ...defaultProfile };
  }
}

function markUnsaved() {
  savedIndicator.innerHTML =
    '<i class="fa-solid fa-pen"></i> Unsaved changes';

  savedIndicator.classList.add("unsaved");
}

function markSaved() {
  savedIndicator.innerHTML =
    '<i class="fa-solid fa-check"></i> Saved';

  savedIndicator.classList.remove("unsaved");
}

/* =========================
   3. UPDATE PROFILE DISPLAY
========================= */

function updateProfileDisplay(data) {
  const name = data.fullName || "Patient";
  const initials = getInitials(name);

  document.querySelector("#profileName").textContent = name;
  document.querySelector("#profileEmail").textContent =
    data.email || "No email provided";

  document.querySelector("#profilePhone").textContent =
    data.phone || "No phone provided";

  document.querySelector("#headerName").textContent = name;
  document.querySelector("#headerAvatar").textContent = initials;

  const profileAvatar = document.querySelector("#profileAvatar");

  if (photoData) {
    profileAvatar.innerHTML = "";

    const image = document.createElement("img");
    image.src = photoData;
    image.alt = `${name}'s profile photo`;

    profileAvatar.appendChild(image);
  } else {
    profileAvatar.textContent = initials;
  }

  document.querySelector("#overviewName").textContent =
    data.fullName || "Not provided";

  document.querySelector("#overviewDob").textContent =
    formatDate(data.dateOfBirth);

  document.querySelector("#overviewGender").textContent =
    data.gender || "Not provided";

  document.querySelector("#overviewBlood").textContent =
    data.bloodGroup || "Not recorded";

  document.querySelector("#overviewHeight").textContent =
    data.height ? `${data.height} cm` : "Not provided";

  document.querySelector("#overviewWeight").textContent =
    data.weight ? `${data.weight} kg` : "Not provided";
}

/* =========================
   4. PROFILE TABS
========================= */

function switchTab(tabName) {
  const validTab = [...tabPanels].some(
    panel => panel.dataset.panel === tabName
  );

  if (!validTab) {
    return;
  }

  currentTab = tabName;

  tabButtons.forEach(button => {
    const active = button.dataset.tab === tabName;

    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
    button.tabIndex = active ? 0 : -1;
  });

  tabPanels.forEach(panel => {
    panel.hidden = panel.dataset.panel !== tabName;
  });

  // Password management is linked to the authentication system.
  formActions.hidden = tabName === "security";
}

tabButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    switchTab(button.dataset.tab);
  });

  button.addEventListener("keydown", event => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }

    event.preventDefault();

    let nextIndex = index;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % tabButtons.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + tabButtons.length) % tabButtons.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = tabButtons.length - 1;
    }

    const nextButton = tabButtons[nextIndex];

    switchTab(nextButton.dataset.tab);
    nextButton.focus();
  });
});

/* =========================
   5. DATE VALIDATION
========================= */

function setDateLimits() {
  const dateField = document.querySelector("#dateOfBirth");
  const now = new Date();

  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0")
  ].join("-");

  dateField.max = today;
}

function validateProfile(data) {
  if (!data.fullName || data.fullName.length < 2) {
    showToast("Please enter your full name.");
    switchTab("personal");
    document.querySelector("#fullName").focus();
    return false;
  }

  if (data.dateOfBirth) {
    const selectedDate = new Date(`${data.dateOfBirth}T12:00:00`);

    if (
      Number.isNaN(selectedDate.getTime()) ||
      selectedDate > new Date()
    ) {
      showToast("Please enter a valid date of birth.");
      switchTab("personal");
      document.querySelector("#dateOfBirth").focus();
      return false;
    }
  }

  if (!data.email || !document.querySelector("#email").validity.valid) {
    showToast("Please enter a valid email address.");
    switchTab("contact");
    document.querySelector("#email").focus();
    return false;
  }

  if (!data.phone || !document.querySelector("#phone").validity.valid) {
    showToast("Please enter a valid phone number.");
    switchTab("contact");
    document.querySelector("#phone").focus();
    return false;
  }

  return true;
}

/* =========================
   6. SAVE PROFILE
========================= */

function saveProfile(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(`${STORAGE_KEY}Photo`, photoData);
    return true;
  } catch {
    showToast("Could not save to browser storage. Try a smaller photo.");
    return false;
  }
}

profileForm.addEventListener("submit", event => {
  event.preventDefault();

  const data = getFormData();

  if (!validateProfile(data)) {
    return;
  }

  if (!saveProfile(data)) {
    return;
  }

  savedProfile = { ...data };
  savedPhotoData = photoData;

  updateProfileDisplay(savedProfile);
  markSaved();

  showToast("Your profile has been saved on this device.");
});

profileFields.forEach(id => {
  const field = document.getElementById(id);

  field.addEventListener("input", markUnsaved);
  field.addEventListener("change", markUnsaved);
});

/* =========================
   7. RESET UNSAVED CHANGES
========================= */

resetBtn.addEventListener("click", () => {
  const hasChanges =
    JSON.stringify(getFormData()) !== JSON.stringify(savedProfile) ||
    photoData !== savedPhotoData;

  if (
    hasChanges &&
    !window.confirm("Discard your unsaved changes?")
  ) {
    return;
  }

  populateForm(savedProfile);

  photoData = savedPhotoData;
  updateProfileDisplay(savedProfile);
  markSaved();

  showToast("Profile form reset.");
});

/* =========================
   8. EDIT PROFILE SHORTCUT
========================= */

editProfileBtn.addEventListener("click", () => {
  switchTab("personal");

  document.querySelector(".profile-card").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  document.querySelector("#fullName").focus({
    preventScroll: true
  });
});

/* =========================
   9. PROFILE PHOTO UPLOAD
========================= */

photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];

  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    showToast("Please select an image file.");
    photoInput.value = "";
    return;
  }

  // Limit uploads to 1 MB to reduce browser storage issues.
  if (file.size > 1024 * 1024) {
    showToast("Please choose an image smaller than 1 MB.");
    photoInput.value = "";
    return;
  }

  const reader = new FileReader();

  reader.addEventListener("load", () => {
    photoData = reader.result;
    updateProfileDisplay(getFormData());
    markUnsaved();
    showToast("Photo preview updated. Save changes to keep it.");
  });

  reader.addEventListener("error", () => {
    showToast("Unable to read that image.");
  });

  reader.readAsDataURL(file);
});

/* =========================
   10. MOBILE SIDEBAR
========================= */

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

menuBtn.addEventListener("click", () => {
  if (sidebar.classList.contains("show")) {
    closeMenu();
  } else {
    openMenu();
  }
});

menuOverlay.addEventListener("click", closeMenu);

sidebar.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    closeMenu();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

/* =========================
   11. INITIALIZE PROFILE
========================= */

function initializeProfile() {
  setDateLimits();

  savedProfile = getProfileFromStorage();

  try {
    savedPhotoData =
      localStorage.getItem(`${STORAGE_KEY}Photo`) || "";
  } catch {
    savedPhotoData = "";
  }

  photoData = savedPhotoData;

  populateForm(savedProfile);
  updateProfileDisplay(savedProfile);
  switchTab("personal");
  markSaved();
}

initializeProfile();