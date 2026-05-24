const statusSelect = document.getElementById("statusSelect");
const statusLabel = document.getElementById("statusLabel");
const statusPoint = document.getElementById("statusPoint");
const statusTrack = document.querySelector(".track");
const navToggle = document.querySelector(".nav-toggle");
const navGroup = document.querySelector(".nav-group");
const notificationButton = document.querySelector(".notification");
const searchInput = document.querySelector(".search-field input");
const statusFilter = document.querySelector(".filter-field select");
const detailButtons = document.querySelectorAll(".table-action");
const cancelButton = document.querySelector(".btn.secondary");
const saveButton = document.querySelector(".btn.primary:not(a)");
const internalLinks = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="http"])');
const loginForm = document.getElementById("loginForm");
const loginPassword = document.getElementById("loginPassword");
const togglePassword = document.getElementById("togglePassword");
const routeNames = ["tambah", "pengiriman", "penerima", "resi", "lokasi", "user", "laporan", "pengaturan", "login"];

function isRoutePage(route) {
  const pathname = window.location.pathname.replace(/\/$/, "");
  return pathname.endsWith(`/${route}`) || pathname.endsWith(`/${route}/index.html`) || pathname.endsWith(`/${route}.html`);
}

function isNestedRoute() {
  return routeNames.some((route) => isRoutePage(route));
}

function getProjectBaseUrl() {
  const pathParts = window.location.pathname.split("/");
  const routeIndex = pathParts.findIndex((part) => routeNames.includes(part));

  if (routeIndex >= 0) {
    const basePath = pathParts.slice(0, routeIndex).join("/") || "/";
    return `${window.location.origin}${basePath.endsWith("/") ? basePath : `${basePath}/`}`;
  }

  return new URL("./", window.location.href).href;
}

function getLoginPath() {
  return `${getProjectBaseUrl()}login/`;
}

function getDashboardPath() {
  return getProjectBaseUrl();
}

function getDashboardUrl() {
  return getProjectBaseUrl();
}

function getRoutePath(route) {
  return `${getProjectBaseUrl()}${route}/`;
}

function guardPrivatePages() {
  if (isRoutePage("login")) {
    return;
  }

  if (sessionStorage.getItem("hopeless_admin_logged_in") !== "true") {
    window.location.replace(getLoginPath());
  }
}

guardPrivatePages();

const statusMap = {
  sorting: {
    label: "Paket di Lokasi Sortir",
    position: "0%",
    track: "linear-gradient(90deg, #1166f5 0 8%, #bdcbea 8% 100%)"
  },
  transit: {
    label: "Dalam Perjalanan",
    position: "50%",
    track: "linear-gradient(90deg, #1166f5 0 50%, #bdcbea 50% 100%)"
  },
  delivered: {
    label: "Paket Sudah Tiba",
    position: "100%",
    track: "linear-gradient(90deg, #16a66a 0 100%)"
  }
};

function updateStatusProgress() {
  if (!statusSelect || !statusLabel || !statusPoint || !statusTrack) {
    return;
  }

  const status = statusMap[statusSelect.value] || statusMap.transit;

  statusLabel.textContent = status.label;
  statusPoint.style.left = status.position;
  statusTrack.style.background = status.track;

  document.body.classList.remove("status-sorting", "status-transit", "status-delivered");
  document.body.classList.add(`status-${statusSelect.value}`);
}

function showToast(message) {
  let toast = document.querySelector(".toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function closeFloatingPanels() {
  document.querySelector(".notification-panel")?.remove();
  document.querySelector(".detail-modal")?.remove();
}

function showNotificationPanel() {
  document.querySelector(".notification-panel")?.remove();

  const panel = document.createElement("div");
  panel.className = "notification-panel";
  panel.innerHTML = `
    <div class="panel-head">
      <strong>Pesan Masuk</strong>
      <button type="button" aria-label="Tutup pesan">×</button>
    </div>
    <div class="message-list">
      <article>
        <span>BM-2025-0002</span>
        <p>Paket masih berada di lokasi sortir Surabaya.</p>
      </article>
      <article>
        <span>BM-2025-0001</span>
        <p>Kurir sedang menuju alamat penerima.</p>
      </article>
      <article>
        <span>Sistem</span>
        <p>Laporan harian siap untuk dicek admin.</p>
      </article>
    </div>
  `;

  document.body.appendChild(panel);
  panel.querySelector("button")?.addEventListener("click", () => panel.remove());
}

function showDetailModal(row) {
  if (!row) {
    showToast("Data detail tidak ditemukan.");
    return;
  }

  document.querySelector(".detail-modal")?.remove();

  const cells = Array.from(row.children).map((cell) => cell.textContent.trim());
  const title = cells[0] || "Detail Data";
  const modal = document.createElement("div");
  modal.className = "detail-modal";
  modal.innerHTML = `
    <div class="detail-dialog">
      <button type="button" class="modal-close" aria-label="Tutup detail">×</button>
      <span class="modal-kicker">Detail</span>
      <h2>${title}</h2>
      <div class="detail-list">
        ${cells
          .slice(1, 5)
          .map((value, index) => `<div><span>Data ${index + 1}</span><strong>${value || "-"}</strong></div>`)
          .join("")}
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target.classList.contains("modal-close")) {
      modal.remove();
    }
  });
}

function filterShipmentRows() {
  const rows = document.querySelectorAll("tbody tr");
  const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const selectedStatus = statusFilter ? statusFilter.value.toLowerCase() : "semua status";

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    const status = row.dataset.status || "";
    const matchQuery = !query || text.includes(query);
    const matchStatus = selectedStatus === "semua status" || status === selectedStatus;
    row.hidden = !(matchQuery && matchStatus);
  });
}

navToggle?.addEventListener("click", () => {
  navGroup?.classList.toggle("open");
});

notificationButton?.addEventListener("click", () => {
  showNotificationPanel();
});

searchInput?.addEventListener("input", filterShipmentRows);
statusFilter?.addEventListener("change", filterShipmentRows);

detailButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const row = button.closest("tr");
    showDetailModal(row);
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeFloatingPanels();
  }
});

internalLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");

    if (!href) {
      return;
    }

    if (window.location.protocol === "file:") {
      event.preventDefault();
      window.location.href = href === "./" ? getDashboardPath() : getRoutePath(href.replace("/", ""));
    }
  });
});

cancelButton?.addEventListener("click", () => {
  window.location.href = getRoutePath("pengiriman");
});

saveButton?.addEventListener("click", () => {
  showToast("Data paket berhasil disimpan sebagai demo.");
});

togglePassword?.addEventListener("click", () => {
  if (!loginPassword) {
    return;
  }

  loginPassword.type = loginPassword.type === "password" ? "text" : "password";
});

loginForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  sessionStorage.setItem("hopeless_admin_logged_in", "true");
  window.location.assign(getDashboardUrl());
});

statusSelect?.addEventListener("change", updateStatusProgress);
window.addEventListener("load", () => {
  updateStatusProgress();
  filterShipmentRows();
});
