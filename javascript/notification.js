(() => {
  "use strict";

  const STORAGE_KEY = "medcareNotificationsDemo";
  const iconMap = {
    appointment: "fa-calendar-check",
    prescription: "fa-prescription-bottle-medical",
    report: "fa-file-medical",
    security: "fa-shield-halved"
  };

  const initialNotifications = [
    {
      id: "n1", type: "appointment", title: "Appointment reminder",
      message: "You have an upcoming consultation with Dr. Amaka Okafor. Review your appointment details before your visit.",
      time: "Today, 9:15 AM", dateValue: 6, read: false
    },
    {
      id: "n2", type: "prescription", title: "Prescription updated",
      message: "Your prescription information has been updated. Please check the instructions provided by your healthcare professional.",
      time: "Yesterday, 4:30 PM", dateValue: 5, read: false
    },
    {
      id: "n3", type: "appointment", title: "Appointment request received",
      message: "Your appointment request has been received. This demo notification does not confirm a real hospital booking.",
      time: "Yesterday, 11:20 AM", dateValue: 5, read: false
    },
    {
      id: "n4", type: "report", title: "Medical report available",
      message: "A sample notification about a medical report is ready to review in your patient portal.",
      time: "Oct 17, 2:05 PM", dateValue: 3, read: false
    },
    {
      id: "n5", type: "security", title: "Profile information saved",
      message: "Your profile changes were saved in this browser. This demo does not send your information to a hospital server.",
      time: "Oct 16, 10:42 AM", dateValue: 2, read: true
    },
    {
      id: "n6", type: "appointment", title: "Appointment completed",
      message: "This is a sample update showing how a completed appointment notification may appear.",
      time: "Oct 14, 8:00 AM", dateValue: 0, read: true
    }
  ];

  const $ = (selector) => document.querySelector(selector);
  const list = $("#notificationList");
  const emptyState = $("#emptyState");
  const searchInput = $("#notificationSearch");
  let activeFilter = "all";
  let notifications = loadNotifications();
  let toastTimer;
  let pendingConfirmAction = null;

  function loadNotifications() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (error) {
      console.warn("Notifications could not be loaded from browser storage.", error);
    }
    return initialNotifications.map(item => ({ ...item }));
  }

  function saveNotifications() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      showToast("Browser storage is unavailable. Changes may not persist.");
    }
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[char]));
  }

  function getUnreadCount() {
    return notifications.filter(item => !item.read).length;
  }

  function updateCounts() {
    const unread = getUnreadCount();
    const read = notifications.length - unread;
    $("#totalCount").textContent = notifications.length;
    $("#unreadCount").textContent = unread;
    $("#readCount").textContent = read;
    $("#headingUnread").textContent = `${unread} new`;
    $("#sidebarUnread").textContent = unread;
    $("#sidebarUnread").classList.toggle("hidden", unread === 0);
    $("#allTabCount").textContent = notifications.length;
    $("#unreadTabCount").textContent = unread;
    $("#readTabCount").textContent = read;
    $("#resultsSummary").textContent = `Showing ${getVisibleNotifications().length} of ${notifications.length} notifications`;
    $("#markAllRead").disabled = unread === 0;
    $("#markAllRead").style.opacity = unread === 0 ? ".55" : "1";
    $("#clearRead").disabled = read === 0;
    $("#clearRead").style.opacity = read === 0 ? ".55" : "1";
  }

  function getVisibleNotifications() {
    const query = searchInput.value.trim().toLowerCase();
    return notifications.filter(item => {
      const matchesFilter = activeFilter === "all" ||
        (activeFilter === "unread" && !item.read) ||
        (activeFilter === "read" && item.read);
      const matchesSearch = !query ||
        `${item.title} ${item.message} ${item.type} ${item.time}`.toLowerCase().includes(query);
      return matchesFilter && matchesSearch;
    }).sort((a, b) => b.dateValue - a.dateValue);
  }

  function renderNotifications() {
    const visible = getVisibleNotifications();
    list.innerHTML = visible.map(item => `
      <article class="notification-item ${item.read ? "" : "unread"}" data-id="${escapeHTML(item.id)}">
        <div class="notification-symbol ${escapeHTML(item.type)}">
          <i class="fa-solid ${iconMap[item.type] || "fa-bell"}"></i>
        </div>
        <div class="notification-body">
          <div class="notification-title-row">
            <h2 class="notification-title">${escapeHTML(item.title)}</h2>
            ${item.read ? "" : '<span class="unread-pill">NEW</span>'}
          </div>
          <p class="notification-message">${escapeHTML(item.message)}</p>
          <div class="notification-meta"><i class="fa-regular fa-clock"></i><span>${escapeHTML(item.time)}</span></div>
        </div>
        <div class="item-actions">
          <button class="small-action" type="button" data-action="toggle-read" data-id="${escapeHTML(item.id)}" aria-label="${item.read ? "Mark as unread" : "Mark as read"}" title="${item.read ? "Mark as unread" : "Mark as read"}">
            <i class="fa-solid ${item.read ? "fa-envelope" : "fa-envelope-open"}"></i>
          </button>
          <button class="small-action delete" type="button" data-action="delete" data-id="${escapeHTML(item.id)}" aria-label="Delete notification" title="Delete notification">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </article>
    `).join("");

    emptyState.classList.toggle("hidden", visible.length > 0);
    list.classList.toggle("hidden", visible.length === 0);
    updateCounts();
  }

  function showToast(message) {
    $("#toastMessage").textContent = message;
    $("#toast").classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $("#toast").classList.remove("show"), 2600);
  }

  function markRead(id, read) {
    const item = notifications.find(notification => notification.id === id);
    if (!item) return;
    item.read = read;
    saveNotifications();
    renderNotifications();
  }

  function openConfirm(action) {
    pendingConfirmAction = action;
    $("#confirmBackdrop").classList.remove("hidden");
    $("#confirmAction").focus();
  }

  function closeConfirm() {
    $("#confirmBackdrop").classList.add("hidden");
    pendingConfirmAction = null;
  }

  list.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const { action, id } = button.dataset;
    if (action === "toggle-read") {
      const item = notifications.find(notification => notification.id === id);
      if (!item) return;
      markRead(id, !item.read);
      showToast(item.read ? "Notification marked as read." : "Notification marked as unread.");
    }
    if (action === "delete") {
      notifications = notifications.filter(item => item.id !== id);
      saveNotifications();
      renderNotifications();
      showToast("Notification removed.");
    }
  });

  document.querySelectorAll(".filter-tab").forEach(button => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.filter;
      document.querySelectorAll(".filter-tab").forEach(tab => tab.classList.toggle("active", tab === button));
      renderNotifications();
    });
  });

  searchInput.addEventListener("input", renderNotifications);

  $("#markAllRead").addEventListener("click", () => {
    const unread = getUnreadCount();
    if (!unread) return;
    notifications.forEach(item => { item.read = true; });
    saveNotifications();
    renderNotifications();
    showToast("All notifications marked as read.");
  });

  $("#clearRead").addEventListener("click", () => {
    if (!notifications.some(item => item.read)) return;
    $("#confirmTitle").textContent = "Clear read notifications?";
    $("#confirmText").textContent = "This will remove all notifications you've already read from this browser.";
    $("#confirmAction").textContent = "Clear notifications";
    openConfirm(() => {
      const before = notifications.length;
      notifications = notifications.filter(item => !item.read);
      saveNotifications();
      renderNotifications();
      closeConfirm();
      showToast(`${before - notifications.length} read notification(s) cleared.`);
    });
  });

  $("#cancelConfirm").addEventListener("click", closeConfirm);
  $("#confirmBackdrop").addEventListener("click", event => {
    if (event.target === $("#confirmBackdrop")) closeConfirm();
  });
  $("#confirmAction").addEventListener("click", () => {
    if (typeof pendingConfirmAction === "function") pendingConfirmAction();
  });

  $("#resetFilters").addEventListener("click", () => {
    activeFilter = "all";
    searchInput.value = "";
    document.querySelectorAll(".filter-tab").forEach(tab => tab.classList.toggle("active", tab.dataset.filter === "all"));
    renderNotifications();
  });

  // Mobile sidebar
  const sidebar = $("#sidebar");
  const overlay = $("#sidebarOverlay");
  const menuToggle = $("#menuToggle");
  function setSidebar(open) {
    sidebar.classList.toggle("open", open);
    overlay.classList.toggle("show", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    document.body.style.overflow = open ? "hidden" : "";
  }
  menuToggle.addEventListener("click", () => setSidebar(!sidebar.classList.contains("open")));
  overlay.addEventListener("click", () => setSidebar(false));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      setSidebar(false);
      closeConfirm();
    }
  });

  $("#profileButton").addEventListener("click", () => {
    window.location.href = "profile.html";
  });
  $("#logoutButton").addEventListener("click", () => {
    window.location.href = "login.html";
});

  renderNotifications();
})();