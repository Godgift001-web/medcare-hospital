document.addEventListener("DOMContentLoaded", () => {

    // ==============================
    // DOCTOR DATA
    // ==============================

    const doctors = [
        {
            id: 1,
            name: "Dr. Sarah Johnson",
            initials: "SJ",
            specialty: "Cardiology",
            experience: 12,
            rating: 4.9,
            fee: 15000,
            available: true,
            color: "",
            description: "Specialist in heart health, cardiovascular diseases and preventive cardiac care.",
            education: "MBBS, MD Cardiology",
            about: "Dr. Sarah Johnson has over 12 years of experience in diagnosing and treating cardiovascular conditions."
        },
        {
            id: 2,
            name: "Dr. Michael Williams",
            initials: "MW",
            specialty: "Dermatology",
            experience: 9,
            rating: 4.8,
            fee: 12000,
            available: true,
            color: "purple",
            description: "Experienced in skin conditions, acne treatment and general dermatological care.",
            education: "MBBS, MD Dermatology",
            about: "Dr. Michael Williams focuses on skin health, diagnosis and treatment of common and complex skin conditions."
        },
        {
            id: 3,
            name: "Dr. Emily Davis",
            initials: "ED",
            specialty: "Paediatrics",
            experience: 10,
            rating: 4.9,
            fee: 13000,
            available: false,
            color: "peach",
            description: "Dedicated to children's health, growth monitoring and childhood illnesses.",
            education: "MBBS, Fellowship in Paediatrics",
            about: "Dr. Emily Davis provides medical care for infants, children and adolescents."
        },
        {
            id: 4,
            name: "Dr. James Anderson",
            initials: "JA",
            specialty: "Neurology",
            experience: 15,
            rating: 4.9,
            fee: 18000,
            available: true,
            color: "teal",
            description: "Specializes in brain, spinal cord and nervous system disorders.",
            education: "MBBS, MD Neurology",
            about: "Dr. James Anderson has extensive experience in neurological diagnosis and patient care."
        },
        {
            id: 5,
            name: "Dr. Olivia Brown",
            initials: "OB",
            specialty: "Obstetrics & Gynaecology",
            experience: 11,
            rating: 4.8,
            fee: 16000,
            available: true,
            color: "purple",
            description: "Provides women's healthcare, pregnancy care and reproductive health services.",
            education: "MBBS, MD Obstetrics & Gynaecology",
            about: "Dr. Olivia Brown specializes in women's health and maternal healthcare."
        },
        {
            id: 6,
            name: "Dr. Daniel Wilson",
            initials: "DW",
            specialty: "Family Medicine",
            experience: 14,
            rating: 4.7,
            fee: 10000,
            available: false,
            color: "green",
            description: "Provides general medical consultations and preventive healthcare.",
            education: "MBBS, Family Medicine",
            about: "Dr. Daniel Wilson provides comprehensive primary healthcare for individuals and families."
        },
        {
            id: 7,
            name: "Dr. Sophia Martinez",
            initials: "SM",
            specialty: "Psychology",
            experience: 8,
            rating: 4.8,
            fee: 14000,
            available: true,
            color: "peach",
            description: "Focuses on emotional wellbeing, stress management and mental health support.",
            education: "PhD Clinical Psychology",
            about: "Dr. Sophia Martinez supports patients with mental health concerns and psychological wellbeing."
        },
        {
            id: 8,
            name: "Dr. David Thompson",
            initials: "DT",
            specialty: "Cardiology",
            experience: 18,
            rating: 5.0,
            fee: 20000,
            available: false,
            color: "teal",
            description: "Experienced cardiologist specializing in heart disease management and cardiac care.",
            education: "MBBS, MD Cardiology",
            about: "Dr. David Thompson has 18 years of experience in cardiovascular medicine."
        }
    ];


    // ==============================
    // SELECT HTML ELEMENTS
    // ==============================

    const doctorGrid = document.getElementById("doctorGrid");
    const searchInput = document.getElementById("searchInput");
    const clearSearch = document.getElementById("clearSearch");
    const specialtyFilter = document.getElementById("specialtyFilter");
    const sortFilter = document.getElementById("sortFilter");
    const doctorCount = document.getElementById("doctorCount");
    const resultsText = document.getElementById("resultsText");

    const doctorModal = document.getElementById("doctorModal");
    const doctorModalContent = document.getElementById("doctorModalContent");

    const bookingModal = document.getElementById("bookingModal");
    const bookingForm = document.getElementById("bookingForm");

    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    let availabilityFilter = "all";
    let toastTimer;


    // ==============================
    // DISPLAY DOCTORS
    // ==============================

    function displayDoctors(list) {

        doctorGrid.innerHTML = "";

        doctorCount.textContent = `${list.length} doctors`;

        resultsText.textContent =
            list.length === doctors.length
                ? "Showing all doctors"
                : `Showing ${list.length} of ${doctors.length} doctors`;

        if (list.length === 0) {
            doctorGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-user-doctor"></i>
                    <h3>No doctors found</h3>
                    <p>Try another search or change your filters.</p>
                </div>
            `;
            return;
        }

        list.forEach(doctor => {

            const availability = doctor.available
                ? `<span class="availability-badge">
                       <span class="available-dot"></span>
                       Available today
                   </span>`
                : `<span class="availability-badge busy">
                       Currently unavailable
                   </span>`;

            const card = document.createElement("article");

            card.className = "doctor-card";

            card.innerHTML = `
                <div class="card-top">

                    <div class="doctor-avatar ${doctor.color}">
                        ${doctor.initials}
                    </div>

                    ${availability}

                </div>

                <h3 class="doctor-name">${doctor.name}</h3>

                <p class="doctor-specialty">${doctor.specialty}</p>

                <div class="doctor-meta">

                    <span>
                        <i class="fa-solid fa-star rating-star"></i>
                        ${doctor.rating}
                    </span>

                    <span>
                        <i class="fa-solid fa-briefcase-medical"></i>
                        ${doctor.experience} years
                    </span>

                </div>

                <div class="card-divider"></div>

                <p class="doctor-description">
                    ${doctor.description}
                </p>

                <div class="card-bottom">

                    <div>
                        <p class="fee-label">CONSULTATION FEE</p>

                        <p class="fee-value">
                            ₦${doctor.fee.toLocaleString()}
                        </p>
                    </div>

                    <div class="card-actions">

                        <button class="btn btn-outline view-doctor"
                            data-id="${doctor.id}">
                            View
                        </button>

                        <button class="btn btn-primary book-doctor"
                            data-id="${doctor.id}">
                            Book
                        </button>

                    </div>

                </div>
            `;

            doctorGrid.appendChild(card);

        });

    }


    // ==============================
    // SEARCH AND FILTER DOCTORS
    // ==============================

    function filterDoctors() {

        const searchValue = searchInput.value.toLowerCase().trim();

        const selectedSpecialty = specialtyFilter.value;

        let filteredDoctors = doctors.filter(doctor => {

            const matchesSearch =
                doctor.name.toLowerCase().includes(searchValue) ||
                doctor.specialty.toLowerCase().includes(searchValue) ||
                doctor.description.toLowerCase().includes(searchValue);

            const matchesSpecialty =
                selectedSpecialty === "all" ||
                doctor.specialty === selectedSpecialty;

            const matchesAvailability =
                availabilityFilter === "all" ||
                doctor.available === true;

            return matchesSearch &&
                   matchesSpecialty &&
                   matchesAvailability;

        });

        // SORT DOCTORS

        if (sortFilter.value === "rating") {
            filteredDoctors.sort((a, b) => b.rating - a.rating);
        }

        else if (sortFilter.value === "experience") {
            filteredDoctors.sort((a, b) => b.experience - a.experience);
        }

        else if (sortFilter.value === "fee-low") {
            filteredDoctors.sort((a, b) => a.fee - b.fee);
        }

        displayDoctors(filteredDoctors);

        clearSearch.hidden = searchValue === "";

    }


    searchInput.addEventListener("input", filterDoctors);

    specialtyFilter.addEventListener("change", filterDoctors);

    sortFilter.addEventListener("change", filterDoctors);


    // CLEAR SEARCH

    clearSearch.addEventListener("click", () => {

        searchInput.value = "";

        filterDoctors();

        searchInput.focus();

    });


    // ==============================
    // AVAILABILITY FILTER
    // ==============================

    const availabilityButtons =
        document.querySelectorAll("[data-availability]");

    availabilityButtons.forEach(button => {

        button.addEventListener("click", () => {

            availabilityButtons.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            availabilityFilter = button.dataset.availability;

            filterDoctors();

        });

    });


    // ==============================
    // DOCTOR DETAILS
    // ==============================

    function showDoctorDetails(id) {

        const doctor = doctors.find(item => item.id === Number(id));

        if (!doctor) return;

        doctorModalContent.innerHTML = `

            <div class="doctor-detail-head">

                <div class="doctor-avatar ${doctor.color}">
                    ${doctor.initials}
                </div>

                <div>
                    <h2>${doctor.name}</h2>

                    <p>${doctor.specialty}</p>

                    <span>
                        <i class="fa-solid fa-star rating-star"></i>
                        ${doctor.rating} Rating
                    </span>
                </div>

            </div>

            <div class="detail-section">

                <h3>About the doctor</h3>

                <p>${doctor.about}</p>

            </div>

            <div class="detail-section">

                <h3>Education and qualification</h3>

                <p>${doctor.education}</p>

            </div>

            <div class="detail-stats">

                <div class="detail-stat">
                    <strong>${doctor.experience} Years</strong>
                    <span>Experience</span>
                </div>

                <div class="detail-stat">
                    <strong>${doctor.rating}/5</strong>
                    <span>Patient rating</span>
                </div>

                <div class="detail-stat">
                    <strong>₦${doctor.fee.toLocaleString()}</strong>
                    <span>Consultation fee</span>
                </div>

            </div>

            <div class="detail-modal-actions">

                <button class="btn btn-primary book-doctor"
                    data-id="${doctor.id}">
                    Book appointment
                </button>

            </div>

        `;

        doctorModal.classList.add("open");

    }


    // ==============================
    // BOOK APPOINTMENT
    // ==============================

    function openBooking(id) {

        const doctor = doctors.find(item => item.id === Number(id));

        if (!doctor) return;

        document.getElementById("bookingDoctorId").value = doctor.id;

        document.getElementById("bookingDoctorName").textContent =
            `Booking a consultation with ${doctor.name}`;

        doctorModal.classList.remove("open");

        bookingModal.classList.add("open");

    }


    // HANDLE VIEW AND BOOK BUTTONS

    document.addEventListener("click", event => {

        const viewButton = event.target.closest(".view-doctor");

        const bookButton = event.target.closest(".book-doctor");

        if (viewButton) {
            showDoctorDetails(viewButton.dataset.id);
        }

        if (bookButton) {
            openBooking(bookButton.dataset.id);
        }

    });


    // ==============================
    // CLOSE MODALS
    // ==============================

    document.querySelectorAll("[data-close-modal]").forEach(button => {

        button.addEventListener("click", () => {

            doctorModal.classList.remove("open");

            bookingModal.classList.remove("open");

        });

    });

    [doctorModal, bookingModal].forEach(modal => {

        modal.addEventListener("click", event => {

            if (event.target === modal) {
                modal.classList.remove("open");
            }

        });

    });

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            doctorModal.classList.remove("open");
            bookingModal.classList.remove("open");
        }

    });


    // ==============================
    // SUBMIT BOOKING REQUEST
    // ==============================

    bookingForm.addEventListener("submit", event => {

        event.preventDefault();

        const request = {

            id: Date.now(),

            doctorId: document.getElementById("bookingDoctorId").value,

            patientName: document.getElementById("patientName").value,

            patientEmail: document.getElementById("patientEmail").value,

            date: document.getElementById("appointmentDate").value,

            time: document.getElementById("appointmentTime").value,

            reason: document.getElementById("visitReason").value,

            status: "Pending"

        };

        const savedRequests =
            JSON.parse(localStorage.getItem("medcareDoctorBookings")) || [];

        savedRequests.push(request);

        localStorage.setItem(
            "medcareDoctorBookings",
            JSON.stringify(savedRequests)
        );

        bookingForm.reset();

        bookingModal.classList.remove("open");

        showToast("Appointment request saved successfully!");

    });


    // PREVENT PAST APPOINTMENT DATES

    const appointmentDate = document.getElementById("appointmentDate");

    const today = new Date();

    const localToday = new Date(
        today.getTime() - today.getTimezoneOffset() * 60000
    ).toISOString().split("T")[0];

    appointmentDate.min = localToday;


    // ==============================
    // GENERAL CONSULTATION
    // ==============================

    document.getElementById("generalConsultationBtn")
        .addEventListener("click", () => {

            specialtyFilter.value = "Family Medicine";

            searchInput.value = "";

            availabilityFilter = "all";

            availabilityButtons.forEach(button => {
                button.classList.toggle(
                    "active",
                    button.dataset.availability === "all"
                );
            });

            filterDoctors();

            document.querySelector(".search-panel")
                .scrollIntoView({ behavior: "smooth" });

        });


    // ==============================
    // MOBILE SIDEBAR
    // ==============================

    const sidebar = document.getElementById("sidebar");

    const menuToggle = document.getElementById("menuToggle");

    const sidebarOverlay = document.getElementById("sidebarOverlay");

    function closeSidebar() {

        sidebar.classList.remove("open");

        sidebarOverlay.classList.remove("show");

        menuToggle.setAttribute("aria-expanded", "false");

    }

    menuToggle.addEventListener("click", () => {

        sidebar.classList.toggle("open");

        sidebarOverlay.classList.toggle("show");

        menuToggle.setAttribute(
            "aria-expanded",
            sidebar.classList.contains("open")
        );

    });

    sidebarOverlay.addEventListener("click", closeSidebar);


    // ==============================
    // TOAST MESSAGE
    // ==============================

    function showToast(message) {

        toastMessage.textContent = message;

        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(() => {

            toast.classList.remove("show");

        }, 3000);

    }


    // ==============================
    // INITIAL DISPLAY
    // ==============================

    displayDoctors(doctors);

});