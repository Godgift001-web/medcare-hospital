
"use strict";

/* =========================
   1. SELECT ELEMENTS
========================= */

const menuBtn = document.querySelector("#menuBtn");
const sidebar = document.querySelector("#sidebar");
const menuOverlay = document.querySelector("#menuOverlay");

const searchInput = document.querySelector("#searchInput");
const sortSelect = document.querySelector("#sortSelect");
const filterButtons = document.querySelectorAll(".filter-btn");
const appointmentsList = document.querySelector("#appointmentsList");
const emptyState = document.querySelector("#emptyState");

const bookingModal = document.querySelector("#bookingModal");
const detailsModal = document.querySelector("#detailsModal");
const openBookingBtn = document.querySelector("#openBookingBtn");
const emptyBookBtn = document.querySelector("#emptyBookBtn");
const closeBookingBtn = document.querySelector("#closeBookingBtn");
const cancelBookingBtn = document.querySelector("#cancelBookingBtn");
const bookingForm = document.querySelector("#bookingForm");

const doctorSelect = document.querySelector("#doctorSelect");
const appointmentDate = document.querySelector("#appointmentDate");
const appointmentTime = document.querySelector("#appointmentTime");
const appointmentReason = document.querySelector("#appointmentReason");

const appointmentDetails = document.querySelector("#appointmentDetails");
const toast = document.querySelector("#toast");

/* =========================
   2. SAMPLE APPOINTMENT DATA
========================= */

const today = new Date();

function dateOffset(days) {
  const date = new Date(today);
  date.setDate(date.getDate() + days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

let appointments = [
  {
    id: 1,
    doctor: "Dr. Sarah Smith",
    specialty: "Cardiologist",
    date: dateOffset(2),
    time: "10:00",
    status: "confirmed",
    reason: "Routine heart check-up"
  },
  {
    id: 2,
    doctor: "Dr. James Johnson",
    specialty: "General Physician",
    date: dateOffset(5),
    time: "14:00",
    status: "pending",
    reason: "General health consultation"
  },
  {
    id: 3,
    doctor: "Dr. Emily Lee",
    specialty: "Dermatologist",
    date: dateOffset(-8),
    time: "11:00",
    status: "completed",
    reason: "Skin consultation"
  },
  {
    id: 4,
    doctor: "Dr. David Andrew",
    specialty: "Orthopedic Surgeon",
    date: dateOffset(-12),
    time: "09:00",
    status: "cancelled",
    reason: "Knee pain consultation"
  },
  {
    id: 5,
    doctor: "Dr. Michael Joseph",
    specialty: "Neurologist",
    date: dateOffset(-20),
    time: "12:00",
    status: "completed",
    reason: "Follow-up consultation"
  }
];

let currentFilter = "all";
let lastFocusedElement = null;
let toastTimer;

/* =========================
   3. HELPER FUNCTIONS
========================= */

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[character];
  });
}

function formatDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);
}

function formatTime(timeString) {
  const [hours, minutes] = timeString.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;

  return `${String(displayHour).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
}

function getInitials(name) {
  return name
    .replace(/^Dr\.\s*/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0])
    .join("")
    .toUpperCase();
}

function isUpcoming(appointment) {
  return (
    appointment.date >= dateOffset(0) &&
    ["confirmed", "pending"].includes(appointment.status)
  );
}

function showToast(message) {
  clearTimeout(toastTimer);

  toast.textContent = message;
  toast.classList.add("show");

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}

/* =========================
   4. UPDATE STATISTICS
========================= */

function updateStatistics() {
  document.querySelector("#totalCount").textContent =
    appointments.length;

  document.querySelector("#upcomingCount").textContent =
    appointments.filter(isUpcoming).length;

  document.querySelector("#pendingCount").textContent =
    appointments.filter(item => item.status === "pending").length;

  document.querySelector("#completedCount").textContent =
    appointments.filter(item => item.status === "completed").length;
}

/* =========================
   5. CREATE APPOINTMENT CARDS
========================= */

function createAppointmentCard(appointment) {
  const card = document.createElement("article");
  card.className = "appointment-card";

  const statusLabels = {
    confirmed: "Confirmed",
    pending: "Pending",
    completed: "Completed",
    cancelled: "Cancelled"
  };

  const initials = getInitials(appointment.doctor);
  const canCancel = isUpcoming(appointment);

  card.innerHTML = `
    <div class="doctor-info">
      <div class="doctor-avatar" aria-hidden="true">
        ${escapeHTML(initials)}
      </div>

      <div>
        <h3>${escapeHTML(appointment.doctor)}</h3>
        <p>${escapeHTML(appointment.specialty)}</p>
      </div>
    </div>

    <div class="appointment-meta">
      <span>
        <i class="fa-regular fa-calendar"></i>
        ${escapeHTML(formatDate(appointment.date))}
      </span>

      <span>
        <i class="fa-regular fa-clock"></i>
        ${escapeHTML(formatTime(appointment.time))}
      </span>
    </div>

    <span class="status status-${appointment.status}">
      ${statusLabels[appointment.status]}
    </span>

    <div class="appointment-actions">
      <button
        class="view-btn"
        data-action="details"
        data-id="${appointment.id}"
      >
        View Details
      </button>

      ${canCancel
      ? `
            <button
              class="cancel-btn"
              data-action="cancel"
              data-id="${appointment.id}"
              aria-label="Cancel appointment with ${escapeHTML(appointment.doctor)}"
              title="Cancel appointment"
            >
              <i class="fa-solid fa-xmark"></i>
            </button>
          `
      : ""
    }
    </div>
  `;

  return card;
}

/* =========================
   6. FILTER, SEARCH AND SORT
========================= */

function getFilteredAppointments() {
  const query = searchInput.value.trim().toLowerCase();

  let filtered = appointments.filter(appointment => {
    const matchesSearch = [
      appointment.doctor,
      appointment.specialty,
      appointment.status,
      appointment.reason,
      formatDate(appointment.date)
    ].some(value => value.toLowerCase().includes(query));

    let matchesFilter = true;

    if (currentFilter === "upcoming") {
      matchesFilter = isUpcoming(appointment);
    } else if (currentFilter === "pending") {
      matchesFilter = appointment.status === "pending";
    } else if (currentFilter === "completed") {
      matchesFilter = appointment.status === "completed";
    } else if (currentFilter === "cancelled") {
      matchesFilter = appointment.status === "cancelled";
    }

    return matchesSearch && matchesFilter;
  });

  filtered.sort((a, b) => {
    const first = new Date(`${a.date}T${a.time}`);
    const second = new Date(`${b.date}T${b.time}`);

    return sortSelect.value === "oldest"
      ? first - second
      : second - first;
  });

  return filtered;
}

function renderAppointments() {
  const filtered = getFilteredAppointments();

  appointmentsList.replaceChildren();

  filtered.forEach(appointment => {
    appointmentsList.appendChild(
      createAppointmentCard(appointment)
    );
  });

  emptyState.hidden = filtered.length !== 0;
  appointmentsList.hidden = filtered.length === 0;

  updateStatistics();
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach(item => {
      const isActive = item === button;

      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    renderAppointments();
  });

  button.setAttribute(
    "aria-pressed",
    String(button.classList.contains("active"))
  );
});

searchInput.addEventListener("input", renderAppointments);
sortSelect.addEventListener("change", renderAppointments);

/* =========================
   7. MOBILE SIDEBAR
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

/* =========================
   8. MODAL CONTROLS
========================= */

function openModal(modal) {
  lastFocusedElement = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = "hidden";

  const firstInput = modal.querySelector(
    "input, select, textarea, button"
  );

  if (firstInput) {
    firstInput.focus();
  }
}

function closeModal(modal) {
  modal.hidden = true;

  if (bookingModal.hidden && detailsModal.hidden) {
    document.body.style.overflow = "";
  }

  if (lastFocusedElement && lastFocusedElement.isConnected) {
    lastFocusedElement.focus();
  }
}

function closeAllModals() {
  if (!bookingModal.hidden) {
    closeModal(bookingModal);
  }

  if (!detailsModal.hidden) {
    closeModal(detailsModal);
  }
}

openBookingBtn.addEventListener("click", () => {
  openModal(bookingModal);
});

emptyBookBtn.addEventListener("click", () => {
  openModal(bookingModal);
});

closeBookingBtn.addEventListener("click", () => {
  closeModal(bookingModal);
});

cancelBookingBtn.addEventListener("click", () => {
  closeModal(bookingModal);
});

document.querySelectorAll("[data-close-modal]").forEach(element => {
  element.addEventListener("click", () => {
    const modal = element.closest(".modal");

    if (modal) {
      closeModal(modal);
    }
  });
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeAllModals();
    closeMenu();
  }
});

/* =========================
   9. VIEW APPOINTMENT DETAILS
========================= */

function showAppointmentDetails(id) {
  const appointment = appointments.find(
    item => item.id === Number(id)
  );

  if (!appointment) {
    showToast("Appointment not found.");
    return;
  }

  const statusLabels = {
    confirmed: "Confirmed",
    pending: "Pending",
    completed: "Completed",
    cancelled: "Cancelled"
  };

  appointmentDetails.innerHTML = `
    <div class="details-content">
      <div class="detail-row">
        <span>Doctor</span>
        <strong>${escapeHTML(appointment.doctor)}</strong>
      </div>

      <div class="detail-row">
        <span>Specialty</span>
        <strong>${escapeHTML(appointment.specialty)}</strong>
      </div>

      <div class="detail-row">
        <span>Date</span>
        <strong>${escapeHTML(formatDate(appointment.date))}</strong>
      </div>

      <div class="detail-row">
        <span>Time</span>
        <strong>${escapeHTML(formatTime(appointment.time))}</strong>
      </div>

      <div class="detail-row">
        <span>Status</span>
        <strong>
          <span class="status status-${appointment.status}">
            ${statusLabels[appointment.status]}
          </span>
        </strong>
      </div>

      <div class="detail-reason">
        <strong>Reason for visit</strong>
        <p>${escapeHTML(appointment.reason)}</p>
      </div>

      <div class="details-footer">
        ${isUpcoming(appointment)
      ? `
              <button
                class="btn btn-light"
                data-action="cancel"
                data-id="${appointment.id}"
              >
                Cancel appointment
              </button>
            `
      : ""
    }
      </div>
    </div>
  `;

  openModal(detailsModal);
}

/* =========================
   10. CANCEL APPOINTMENTS
========================= */

function cancelAppointment(id) {
  const appointment = appointments.find(
    item => item.id === Number(id)
  );

  if (!appointment || !isUpcoming(appointment)) {
    showToast("This appointment cannot be cancelled.");
    return;
  }

  const confirmed = window.confirm(
    `Cancel your appointment with ${appointment.doctor} on ${formatDate(appointment.date)}?`
  );

  if (!confirmed) {
    return;
  }

  appointment.status = "cancelled";

  closeAllModals();
  renderAppointments();

  showToast("Appointment cancelled in this demo.");
}

/* Handle buttons inside dynamically created cards and details. */

document.addEventListener("click", event => {
  const button = event.target.closest("[data-action]");

  if (!button) {
    return;
  }

  const { action, id } = button.dataset;

  if (action === "details") {
    showAppointmentDetails(id);
  }

  if (action === "cancel") {
    cancelAppointment(id);
  }
});

/* =========================
   11. BOOK AN APPOINTMENT
========================= */

function setMinimumDate() {
  appointmentDate.min = dateOffset(0);
}

bookingForm.addEventListener("submit", event => {
  event.preventDefault();

  const doctorValue = doctorSelect.value;
  const date = appointmentDate.value;
  const time = appointmentTime.value;
  const reason = appointmentReason.value.trim();

  if (!doctorValue || !date || !time || !reason) {
    showToast("Please complete all required fields.");
    return;
  }

  if (date < dateOffset(0)) {
    showToast("Choose today or a future date.");
    return;
  }

  if (date === dateOffset(0)) {
    const [hours, minutes] = time.split(":").map(Number);
    const selectedDate = new Date();
    selectedDate.setHours(hours, minutes, 0, 0);

    if (selectedDate <= new Date()) {
      showToast("Choose a future time for today's appointment.");
      return;
    }
  }

  const [doctor, specialty] = doctorValue.split("|");

  const duplicate = appointments.some(item =>
    item.doctor === doctor &&
    item.date === date &&
    item.time === time &&
    ["confirmed", "pending"].includes(item.status)
  );

  if (duplicate) {
    showToast("You already have an active appointment with this doctor at that time.");
    return;
  }

  const newAppointment = {
    id: Date.now(),
    doctor,
    specialty,
    date,
    time,
    reason,
    status: "pending"
  };

  appointments.push(newAppointment);

  bookingForm.reset();
  setMinimumDate();

  currentFilter = "all";

  filterButtons.forEach(button => {
    const isActive = button.dataset.filter === "all";

    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  searchInput.value = "";
  sortSelect.value = "newest";

  closeModal(bookingModal);
  renderAppointments();

  showToast("Appointment added with pending status.");
});

/* =========================
   12. INITIALIZE THE PAGE
========================= */

setMinimumDate();
renderAppointments();