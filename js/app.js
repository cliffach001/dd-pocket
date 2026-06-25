// ===== APP STATE =====
let currentUser = null;
let currentPage = "dashboard";

// ===== AUTH =====
function checkAuth() {
  const user = JSON.parse(sessionStorage.getItem("ddp_current_user") || "null");
  if (!user) {
    window.location.href = "index.html";
    return;
  }
  currentUser = user;
  updateUserUI(user);
}

function logout() {
  if (currentUser) {
    DB.addActivityLog("Logout", `User ${currentUser.name} logout dari sistem`);
  }
  sessionStorage.removeItem("ddp_current_user");
  window.location.href = "index.html";
}

function updateUserUI(user) {
  const initials = user.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  document.querySelectorAll(".header-user .avatar").forEach((el) => {
    el.textContent = initials;
  });
  document.querySelectorAll(".header-user .name").forEach((el) => {
    el.textContent = user.name;
  });
  document.querySelectorAll(".header-user .role-badge, .user-role").forEach((el) => {
    el.textContent = user.role;
    el.className = `role-badge ${user.role.toLowerCase()} user-role`;
  });

  document.querySelectorAll(".sidebar-footer .user-avatar").forEach((el) => {
    el.textContent = initials;
  });
  document.querySelectorAll(".sidebar-footer .user-name").forEach((el) => {
    el.textContent = user.name;
  });

  // Toggle admin-only elements
  const adminElements = document.querySelectorAll(".admin-only");
  adminElements.forEach((el) => {
    el.style.display = user.role === "Admin" ? "" : "none";
  });
}

// ===== NAVIGATION =====
function navigateTo(page) {
  currentPage = page;

  // Update sidebar
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
  });
  document.querySelector(`.nav-item[data-page="${page}"]`)?.classList.add("active");

  // Update page sections
  document.querySelectorAll(".page-section").forEach((section) => {
    section.classList.remove("active");
  });
  const targetSection = document.getElementById(page);
  if (targetSection) {
    targetSection.classList.add("active");
  }

  // Update header title
  const pageTitles = {
    dashboard: { title: "Dashboard", subtitle: "Monitoring LOTOTO" },
    lototo: { title: "Lototo", subtitle: "Daftar LOTOTO Aktif" },
    sgmaintenance: { title: "SG Maintenance", subtitle: "Monitoring SG Maintenance" },
    switchgear: { title: "Switch Gear", subtitle: "Daftar Switch Gear" },
    laporan: { title: "Laporan Harian", subtitle: "Laporan Harian" },
    aktivitas: { title: "Aktifitas Log", subtitle: "Laporan Aktifitas" },
    pengguna: { title: "Pengguna", subtitle: "Daftar Pengguna" },
  };
  const info = pageTitles[page] || { title: "Dashboard", subtitle: "" };
  document.querySelector(".header-title h2").textContent = info.title;
  document.querySelector(".header-title p").textContent = info.subtitle;

  // Render page content
  renderPage(page);
  updateNavBadges();
}

function renderPage(page) {
  switch (page) {
    case "dashboard":
      renderDashboard();
      break;
    case "lototo":
      renderLototo();
      break;
    case "sgmaintenance":
      renderSGMaintenance();
      break;
    case "switchgear":
      renderSwitchGear();
      break;
    case "laporan":
      renderLaporan();
      break;
    case "aktivitas":
      renderAktivitas();
      break;
    case "pengguna":
      renderPengguna();
      break;
  }
}

// ===== DASHBOARD =====
function renderDashboard() {
  const sgs = DB.getSwitchGears();
  const aktif = sgs.filter((sg) => sg.status === "Aktif").length;
  const maintenance = sgs.filter((sg) => sg.status === "Maintenance").length;
  const selesai = sgs.filter((sg) => sg.status === "Selesai").length;

  // Stats
  document.getElementById("dash-total").textContent = sgs.length;
  document.getElementById("dash-aktif").textContent = aktif;
  document.getElementById("dash-maintenance").textContent = maintenance;
  document.getElementById("dash-selesai").textContent = selesai;

  // Donut Chart
  renderDonutChart(aktif, maintenance, selesai);

  // Dashboard Table
  renderDashboardTable(sgs);
}

function renderDonutChart(aktif, maintenance, selesai) {
  const canvas = document.getElementById("donutChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // Destroy existing chart if it exists
  if (window.donutChartInstance) {
    window.donutChartInstance.destroy();
  }

  const total = aktif + maintenance + selesai || 1;

  window.donutChartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Aktif", "Maintenance", "Selesai"],
      datasets: [
        {
          data: [aktif, maintenance, selesai],
          backgroundColor: ["#3b82f6", "#f59e0b", "#10b981"],
          borderWidth: 0,
          hoverOffset: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "72%",
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "#1f2937",
          titleFont: { size: 13 },
          bodyFont: { size: 12 },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: function (context) {
              const value = context.raw;
              const pct = ((value / total) * 100).toFixed(1);
              return ` ${context.label}: ${value} (${pct}%)`;
            },
          },
        },
      },
    },
    plugins: [
      {
        id: "centerText",
        beforeDraw: function (chart) {
          const { width, height, ctx } = chart;
          ctx.save();
          const centerX = width / 2;
          const centerY = height / 2;

          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          ctx.font = "bold 32px Inter, sans-serif";
          ctx.fillStyle = "#111827";
          ctx.fillText(total, centerX, centerY - 8);

          ctx.font = "12px Inter, sans-serif";
          ctx.fillStyle = "#6b7280";
          ctx.fillText("Total SG", centerX, centerY + 20);
          ctx.restore();
        },
      },
    ],
  });

  // Update legend
  const legendEl = document.getElementById("chartLegend");
  if (legendEl) {
    const colors = ["#3b82f6", "#f59e0b", "#10b981"];
    const labels = ["Aktif", "Maintenance", "Selesai"];
    const values = [aktif, maintenance, selesai];
    legendEl.innerHTML = labels
      .map(
        (label, i) => `
      <div class="legend-item">
        <span class="legend-dot" style="background: ${colors[i]}"></span>
        <span>${label}</span>
        <span class="legend-value">${values[i]}</span>
      </div>
    `
      )
      .join("");
  }
}

function renderDashboardTable(sgs) {
  const tbody = document.querySelector("#dashboard-table tbody");
  if (!tbody) return;

  tbody.innerHTML = sgs
    .map(
      (sg) => `
    <tr>
      <td><strong>${sg.name}</strong></td>
      <td>${sg.location}</td>
      <td>${sg.unit}</td>
      <td>${sg.pic}</td>
      <td>${sg.requester}</td>
      <td>${sg.activeTime}</td>
      <td>${statusBadge(sg.status)}</td>
    </tr>
  `
    )
    .join("");
}

// ===== STATUS BADGE HELPER =====
function statusBadge(status) {
  const map = {
    Aktif: 'active',
    Maintenance: 'maintenance',
    Selesai: 'completed',
  };
  const cls = map[status] || "active";
  return `<span class="status-badge ${cls}"><span class="dot"></span>${status}</span>`;
}

// ===== LOTOTO PAGE =====
function renderLototo() {
  const sgs = DB.getSwitchGears();
  const aktif = sgs.filter((sg) => sg.status === "Aktif").length;
  const maintenance = sgs.filter((sg) => sg.status === "Maintenance").length;
  const selesai = sgs.filter((sg) => sg.status === "Selesai").length;

  document.getElementById("loto-total").textContent = sgs.length;
  document.getElementById("loto-aktif").textContent = aktif;
  document.getElementById("loto-maintenance").textContent = maintenance;
  document.getElementById("loto-selesai").textContent = selesai;

  const aktifSG = sgs.filter((sg) => sg.status === "Aktif");
  const tbody = document.querySelector("#lototo-table tbody");
  if (!tbody) return;

  tbody.innerHTML = aktifSG
    .map(
      (sg) => `
    <tr>
      <td><strong>${sg.name}</strong></td>
      <td>${sg.location}</td>
      <td>${sg.unit}</td>
      <td>${statusBadge(sg.status)}</td>
      <td>${sg.pic}</td>
      <td>${sg.notifNo}</td>
      <td>${sg.lototoNo}</td>
      <td>${sg.requester}</td>
      <td>${sg.activeTime}</td>
      <td>
        <span class="status-badge active" style="cursor:pointer" onclick="alert('Upload gambar untuk ${sg.name}')">
          <i class="fas fa-image"></i> Lihat
        </span>
      </td>
      <td>${sg.description}</td>
      <td>
        ${currentUser?.role === "Admin" || currentUser?.role === "Manager"
          ? `<div class="table-actions-btns">
              <button class="btn-action edit" onclick="editSwitchGear(${sg.id})" title="Edit">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn-action delete" onclick="deleteSwitchGear(${sg.id})" title="Hapus">
                <i class="fas fa-trash"></i>
              </button>
            </div>`
          : `<span class="status-badge active"><span class="dot"></span>View Only</span>`}
      </td>
    </tr>
  `
    )
    .join("");
}

// ===== SG MAINTENANCE =====
function renderSGMaintenance() {
  const sgs = DB.getSwitchGears();
  const aktif = sgs.filter((sg) => sg.status === "Aktif").length;
  const maintenance = sgs.filter((sg) => sg.status === "Maintenance").length;
  const selesai = sgs.filter((sg) => sg.status === "Selesai").length;

  document.getElementById("sgm-total").textContent = sgs.length;
  document.getElementById("sgm-aktif").textContent = aktif;
  document.getElementById("sgm-maintenance").textContent = maintenance;
  document.getElementById("sgm-selesai").textContent = selesai;

  const maintSG = sgs.filter((sg) => sg.status === "Maintenance");
  const tbody = document.querySelector("#sgm-table tbody");
  if (!tbody) return;

  tbody.innerHTML = maintSG
    .map(
      (sg) => `
    <tr>
      <td><strong>${sg.name}</strong></td>
      <td>${sg.location}</td>
      <td>${sg.unit}</td>
      <td>${statusBadge(sg.status)}</td>
      <td>${sg.pic}</td>
      <td>${sg.notifNo}</td>
      <td>${sg.lototoNo}</td>
      <td>${sg.requester}</td>
      <td>${sg.activeTime}</td>
      <td>
        <span class="status-badge active" style="cursor:pointer" onclick="alert('Upload gambar untuk ${sg.name}')">
          <i class="fas fa-image"></i> Lihat
        </span>
      </td>
      <td>${sg.description}</td>
    </tr>
  `
    )
    .join("");
}

// ===== SWITCH GEAR PAGE =====
function renderSwitchGear() {
  const sgs = DB.getSwitchGears();

  const t23 = sgs.filter((sg) => sg.unit === "Tonasa 2/3").length;
  const t4 = sgs.filter((sg) => sg.unit === "Tonasa 4").length;
  const t5 = sgs.filter((sg) => sg.unit === "Tonasa 5").length;
  const lain = sgs.filter((sg) => sg.unit === "SG Lainnya").length;

  document.getElementById("sg-t23").textContent = t23;
  document.getElementById("sg-t4").textContent = t4;
  document.getElementById("sg-t5").textContent = t5;
  document.getElementById("sg-lain").textContent = lain;

  const units = ["Tonasa 2/3", "Tonasa 4", "Tonasa 5", "SG Lainnya"];
  units.forEach((unit) => {
    const tableId = `sg-table-${unit.toLowerCase().replace(/[\/\s]/g, "")}`;
    const tbody = document.querySelector(`#${tableId} tbody`);
    if (!tbody) return;

    const unitSG = sgs.filter((sg) => sg.unit === unit);
    tbody.innerHTML = unitSG
      .map(
        (sg) => `
      <tr>
        <td><strong>${sg.name}</strong></td>
        <td>${sg.location}</td>
        <td>${sg.unit}</td>
        <td>
          ${currentUser?.role === "Admin"
            ? `<div class="table-actions-btns">
                <button class="btn-action edit" onclick="editSwitchGear(${sg.id})" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-action delete" onclick="deleteSwitchGear(${sg.id})" title="Hapus">
                  <i class="fas fa-trash"></i>
                </button>
              </div>`
            : `<span class="status-badge active"><span class="dot"></span>View Only</span>`}
        </td>
      </tr>
    `
      )
      .join("");
  });
}

// ===== LAPORAN HARIAN =====
function renderLaporan() {
  // Kosongkan — user request "isi dikosongkan"
}

// ===== AKTIVITAS LOG =====
function renderAktivitas() {
  const logs = DB.getActivityLogs();
  const tbody = document.querySelector("#aktivitas-table tbody");
  if (!tbody) return;

  tbody.innerHTML = logs
    .map(
      (log) => `
    <tr>
      <td>${log.timestamp}</td>
      <td><span class="status-badge active">${log.action}</span></td>
      <td>${log.user}</td>
      <td>${log.page}</td>
      <td>${log.details}</td>
    </tr>
  `
    )
    .join("");
}

// ===== PENGGUNA =====
function renderPengguna() {
  const users = DB.getUsers();
  const tbody = document.querySelector("#pengguna-table tbody");
  if (!tbody) return;

  tbody.innerHTML = users
    .map(
      (u) => `
    <tr>
      <td><div style="display:flex;align-items:center;gap:10px">
        <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--secondary));display:flex;align-items:center;justify-content:center;color:white;font-size:12px;font-weight:600;flex-shrink:0">
          ${u.name.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2)}
        </div>
        <strong>${u.name}</strong>
      </div></td>
      <td>${u.email}</td>
      <td>${u.unit}</td>
      <td>${u.department}</td>
      <td>${u.username}</td>
      <td><span style="font-family:monospace;color:var(--gray-400)">••••••</span></td>
      <td><span class="role-badge ${u.role.toLowerCase()}">${u.role}</span></td>
      <td>${u.status === "Aktif"
        ? '<span class="status-badge completed"><span class="dot"></span>Aktif</span>'
        : '<span class="status-badge maintenance"><span class="dot"></span>Nonaktif</span>'
      }</td>
      <td>
        ${currentUser?.role === "Admin"
          ? `<div class="table-actions-btns">
              <button class="btn-action edit" onclick="editUser(${u.id})" title="Edit">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn-action delete" onclick="deleteUser(${u.id})" title="Hapus">
                <i class="fas fa-trash"></i>
              </button>
            </div>`
          : `<span style="color:var(--gray-400);font-size:12px">—</span>`}
      </td>
    </tr>
  `
    )
    .join("");
}

// ===== MODAL HANDLING =====
let currentEditId = null;
let currentModalMode = "add"; // "add" | "edit"

function openModal(title, mode = "add") {
  currentModalMode = mode;
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalForm").reset();
  document.getElementById("modalOverlay").classList.add("open");
  currentEditId = null;
}

function closeModal() {
  document.getElementById("modalOverlay").classList.remove("open");
  currentEditId = null;
}

// Switch Gear Modal
function openSGModal() {
  if (currentUser?.role !== "Admin" && currentUser?.role !== "Manager") {
    alert("Anda tidak memiliki izin untuk menambah data.");
    return;
  }
  openModal("Tambah Switch Gear", "add");
  document.getElementById("sgForm").style.display = "block";
  document.getElementById("userForm").style.display = "none";
}

function editSwitchGear(id) {
  const sg = DB.getSwitchGear(id);
  if (!sg) return;

  openModal("Edit Switch Gear", "edit");
  currentEditId = id;
  document.getElementById("sgForm").style.display = "block";
  document.getElementById("userForm").style.display = "none";

  document.getElementById("sg-name").value = sg.name;
  document.getElementById("sg-location").value = sg.location;
  document.getElementById("sg-unit").value = sg.unit;
  document.getElementById("sg-status").value = sg.status;
  document.getElementById("sg-pic").value = sg.pic;
  document.getElementById("sg-requester").value = sg.requester;
  document.getElementById("sg-notif").value = sg.notifNo;
  document.getElementById("sg-lototo").value = sg.lototoNo;
  document.getElementById("sg-desc").value = sg.description;
}

function deleteSwitchGear(id) {
  if (!confirm("Yakin ingin menghapus switch gear ini?")) return;
  DB.deleteSwitchGear(id);
  renderPage(currentPage);
}

function submitSGForm(e) {
  e.preventDefault();

  const data = {
    name: document.getElementById("sg-name").value,
    location: document.getElementById("sg-location").value,
    unit: document.getElementById("sg-unit").value,
    status: document.getElementById("sg-status").value,
    pic: document.getElementById("sg-pic").value,
    requester: document.getElementById("sg-requester").value,
    notifNo: document.getElementById("sg-notif").value,
    lototoNo: document.getElementById("sg-lototo").value,
    description: document.getElementById("sg-desc").value,
    activeTime: new Date().toLocaleString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    image: "",
  };

  if (currentEditId) {
    DB.updateSwitchGear(currentEditId, data);
  } else {
    DB.addSwitchGear(data);
  }

  closeModal();
  renderPage(currentPage);
}

// User Modal
function openUserModal() {
  openModal("Tambah Pengguna", "add");
  document.getElementById("sgForm").style.display = "none";
  document.getElementById("userForm").style.display = "block";
}

function editUser(id) {
  const user = DB.getUser(id);
  if (!user) return;

  openModal("Edit Pengguna", "edit");
  currentEditId = id;
  document.getElementById("sgForm").style.display = "none";
  document.getElementById("userForm").style.display = "block";

  document.getElementById("user-name").value = user.name;
  document.getElementById("user-email").value = user.email;
  document.getElementById("user-unit").value = user.unit;
  document.getElementById("user-dept").value = user.department;
  document.getElementById("user-username").value = user.username;
  document.getElementById("user-password").value = user.password;
  document.getElementById("user-role").value = user.role;
  document.getElementById("user-status").value = user.status;
}

function deleteUser(id) {
  if (!confirm("Yakin ingin menghapus pengguna ini?")) return;
  DB.deleteUser(id);
  renderPage(currentPage);
}

function submitUserForm(e) {
  e.preventDefault();

  const data = {
    name: document.getElementById("user-name").value,
    email: document.getElementById("user-email").value,
    unit: document.getElementById("user-unit").value,
    department: document.getElementById("user-dept").value,
    username: document.getElementById("user-username").value,
    password: document.getElementById("user-password").value,
    role: document.getElementById("user-role").value,
    status: document.getElementById("user-status").value,
  };

  if (currentEditId) {
    DB.updateUser(currentEditId, data);
  } else {
    DB.addUser(data);
  }

  closeModal();
  renderPage(currentPage);
}

// ===== SIDEBAR TOGGLE =====
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("collapsed");
}

function toggleMobileSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("sidebarOverlay");
  sidebar.classList.toggle("mobile-open");
  overlay.classList.toggle("show");
}

// ===== SEARCH TABLES =====
function filterTable(inputId, tableId) {
  const input = document.getElementById(inputId);
  const filter = input.value.toLowerCase();
  const table = document.getElementById(tableId);
  const rows = table.querySelectorAll("tbody tr");

  rows.forEach((row) => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(filter) ? "" : "none";
  });
}

// ===== UPDATE BADGES =====
function updateNavBadges() {
  const sgs = DB.getSwitchGears();
  const lototoCount = sgs.filter((sg) => sg.status === "Aktif").length;
  const maintCount = sgs.filter((sg) => sg.status === "Maintenance").length;

  const lototoBadge = document.getElementById("navBadgeLototo");
  const maintBadge = document.getElementById("navBadgeMaintenance");

  if (lototoBadge) {
    lototoBadge.textContent = lototoCount;
    lototoBadge.style.display = lototoCount > 0 ? "" : "none";
  }
  if (maintBadge) {
    maintBadge.textContent = maintCount;
    maintBadge.style.display = maintCount > 0 ? "" : "none";
  }
}

// ===== RESPONSIVE HANDLING =====
function handleResponsive() {
  const mobileBtn = document.getElementById("btnMobileMenu");
  const sidebarBtn = document.getElementById("btnToggleSidebar");
  if (window.innerWidth <= 768) {
    mobileBtn.style.display = "";
    sidebarBtn.style.display = "none";
    document.getElementById("sidebar")?.classList.remove("collapsed");
  } else {
    mobileBtn.style.display = "none";
    sidebarBtn.style.display = "";
  }
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", function () {
  DB.init();
  checkAuth();
  handleResponsive();
  window.addEventListener("resize", handleResponsive);

  // Navigation clicks
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", function () {
      const page = this.dataset.page;
      navigateTo(page);
      // Close mobile sidebar
      if (window.innerWidth <= 768) {
        toggleMobileSidebar();
      }
    });
  });

  // Sidebar toggle
  document.getElementById("btnToggleSidebar")?.addEventListener("click", toggleSidebar);
  document.getElementById("btnMobileMenu")?.addEventListener("click", toggleMobileSidebar);
  document.getElementById("sidebarOverlay")?.addEventListener("click", toggleMobileSidebar);

  // Logout
  document.getElementById("btnLogout")?.addEventListener("click", logout);

  // Modal close
  document.getElementById("modalOverlay")?.addEventListener("click", function (e) {
    if (e.target === this) closeModal();
  });

  // Form submits
  document.getElementById("sgForm")?.addEventListener("submit", submitSGForm);
  document.getElementById("userForm")?.addEventListener("submit", submitUserForm);

  // Load initial page
  navigateTo("dashboard");
  updateNavBadges();
});
