// ===== SAMPLE DATA =====
const SAMPLE_DATA = {
  // Switch Gear data
  switchGears: [
    { id: 1, name: "SG-MV-01", location: "Area Transformer T2/3", unit: "Tonasa 2/3", status: "Aktif", pic: "Ahmad Fauzi", requester: "Budi Santoso", activeTime: "2026-06-25 08:30", notifNo: "NOTIF-2026-001", lototoNo: "LT-2026-001", image: "", description: "Pengamanan switch gear untuk area transformator" },
    { id: 2, name: "SG-MV-02", location: "Area Kiln T4", unit: "Tonasa 4", status: "Maintenance", pic: "Rudi Hermawan", requester: "Citra Dewi", activeTime: "2026-06-24 14:00", notifNo: "NOTIF-2026-002", lototoNo: "LT-2026-002", image: "", description: "Perbaikan panel kontrol" },
    { id: 3, name: "SG-LV-01", location: "Area Packer T5", unit: "Tonasa 5", status: "Selesai", pic: "Dian Permata", requester: "Eko Prasetyo", activeTime: "2026-06-23 09:15", notifNo: "NOTIF-2026-003", lototoNo: "LT-2026-003", image: "", description: "Penggantian komponen rusak" },
    { id: 4, name: "SG-MV-03", location: "Area Crusher", unit: "Tonasa 2/3", status: "Aktif", pic: "Fajar Nugroho", requester: "Gilang Ramadhan", activeTime: "2026-06-25 10:00", notifNo: "NOTIF-2026-004", lototoNo: "LT-2026-004", image: "", description: "Lockout tagout untuk perawatan crusher" },
    { id: 5, name: "SG-LV-02", location: "Area Raw Mill", unit: "Tonasa 4", status: "Maintenance", pic: "Hendra Gunawan", requester: "Indra Lesmana", activeTime: "2026-06-24 16:30", notifNo: "NOTIF-2026-005", lototoNo: "LT-2026-005", image: "", description: "Perbaikan sistem kelistrikan" },
    { id: 6, name: "SG-MV-04", location: "Area Finish Mill", unit: "Tonasa 5", status: "Aktif", pic: "Joko Susilo", requester: "Kurniawan", activeTime: "2026-06-25 07:45", notifNo: "NOTIF-2026-006", lototoNo: "LT-2026-006", image: "", description: "Pengamanan area finish mill" },
    { id: 7, name: "SG-LV-03", location: "Area Loading", unit: "SG Lainnya", status: "Selesai", pic: "Lestari", requester: "Mega Sari", activeTime: "2026-06-22 11:00", notifNo: "NOTIF-2026-007", lototoNo: "LT-2026-007", image: "", description: "Perawatan rutin" },
    { id: 8, name: "SG-MV-05", location: "Area Coal Mill", unit: "Tonasa 2/3", status: "Maintenance", pic: "Nurhayati", requester: "Omar Dani", activeTime: "2026-06-24 08:00", notifNo: "NOTIF-2026-008", lototoNo: "LT-2026-008", image: "", description: "Overhaul panel utama" },
  ],

  // Users
  users: [
    { id: 1, name: "Admin Utama", email: "admin@ddpocket.com", unit: "IT", department: "Teknologi Informasi", username: "admin", password: "admin123", role: "Admin", status: "Aktif" },
    { id: 2, name: "Manajer Operasi", email: "manager@ddpocket.com", unit: "Operasi", department: "Produksi", username: "manager", password: "manager123", role: "Manager", status: "Aktif" },
    { id: 3, name: "Operator Lapangan", email: "operator@ddpocket.com", unit: "Produksi", department: "Produksi", username: "operator", password: "operator123", role: "Operator", status: "Aktif" },
    { id: 4, name: "Budi Santoso", email: "budi@ddpocket.com", unit: "Tonasa 2/3", department: "Teknik", username: "budi", password: "budi123", role: "Operator", status: "Aktif" },
    { id: 5, name: "Citra Dewi", email: "citra@ddpocket.com", unit: "Tonasa 4", department: "Teknik", username: "citra", password: "citra123", role: "Operator", status: "Aktif" },
    { id: 6, name: "Eko Prasetyo", email: "eko@ddpocket.com", unit: "Tonasa 5", department: "Produksi", username: "eko", password: "eko123", role: "Operator", status: "Nonaktif" },
    { id: 7, name: "Fajar Nugroho", email: "fajar@ddpocket.com", unit: "IT", department: "Teknologi Informasi", username: "fajar", password: "fajar123", role: "Manager", status: "Aktif" },
  ],

  // Activity logs
  activityLogs: [
    { id: 1, action: "Login", user: "Admin Utama", page: "Dashboard", timestamp: "2026-06-25 08:00", details: "User login ke sistem" },
    { id: 2, action: "Tambah SG", user: "Admin Utama", page: "Switch Gear", timestamp: "2026-06-25 08:15", details: "Menambahkan SG-MV-01" },
    { id: 3, action: "Edit SG", user: "Manajer Operasi", page: "Switch Gear", timestamp: "2026-06-25 09:00", details: "Mengubah data SG-LV-01" },
    { id: 4, action: "Hapus SG", user: "Admin Utama", page: "Switch Gear", timestamp: "2026-06-25 09:30", details: "Menghapus SG-Test" },
    { id: 5, action: "Aktifkan LOTOTO", user: "Operator Lapangan", page: "Lototo", timestamp: "2026-06-25 10:00", details: "Mengaktifkan LOTOTO untuk SG-MV-03" },
    { id: 6, action: "Update Status", user: "Budi Santoso", page: "SG Maintenance", timestamp: "2026-06-25 10:30", details: "Mengubah status SG-MV-02 ke Maintenance" },
    { id: 7, action: "Tambah User", user: "Admin Utama", page: "Pengguna", timestamp: "2026-06-25 11:00", details: "Menambahkan user baru: Fajar Nugroho" },
    { id: 8, action: "Edit User", user: "Admin Utama", page: "Pengguna", timestamp: "2026-06-25 11:30", details: "Mengubah data user: Citra Dewi" },
    { id: 9, action: "Login", user: "Fajar Nugroho", page: "Dashboard", timestamp: "2026-06-25 12:00", details: "User login ke sistem" },
    { id: 10, action: "Selesaikan LOTOTO", user: "Operator Lapangan", page: "Lototo", timestamp: "2026-06-25 13:00", details: "Menyelesaikan LOTOTO untuk SG-LV-01" },
    { id: 11, action: "Export Laporan", user: "Manajer Operasi", page: "Laporan Harian", timestamp: "2026-06-25 14:00", details: "Export laporan harian periode 24-25 Juni 2026" },
    { id: 12, action: "Login", user: "Operator Lapangan", page: "Dashboard", timestamp: "2026-06-25 14:30", details: "User login ke sistem" },
  ],
};

// ===== DATA UTILITY FUNCTIONS =====
const DB = {
  get(key) {
    const data = localStorage.getItem(`ddp_${key}`);
    return data ? JSON.parse(data) : null;
  },

  set(key, value) {
    localStorage.setItem(`ddp_${key}`, JSON.stringify(value));
  },

  init() {
    if (!this.get("switchGears")) this.set("switchGears", SAMPLE_DATA.switchGears);
    if (!this.get("users")) this.set("users", SAMPLE_DATA.users);
    if (!this.get("activityLogs")) this.set("activityLogs", SAMPLE_DATA.activityLogs);
    if (!this.get("initialized")) this.set("initialized", true);
  },

  // Switch Gear CRUD
  getSwitchGears() {
    return this.get("switchGears") || [];
  },

  getSwitchGear(id) {
    return this.getSwitchGears().find((sg) => sg.id === id);
  },

  addSwitchGear(data) {
    const items = this.getSwitchGears();
    const newId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    const newItem = { id: newId, ...data };
    items.push(newItem);
    this.set("switchGears", items);
    this.addActivityLog("Tambah SG", `Menambahkan ${data.name}`);
    return newItem;
  },

  updateSwitchGear(id, data) {
    const items = this.getSwitchGears();
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...data };
    this.set("switchGears", items);
    this.addActivityLog("Edit SG", `Mengubah data ${items[idx].name}`);
    return items[idx];
  },

  deleteSwitchGear(id) {
    const items = this.getSwitchGears();
    const item = items.find((i) => i.id === id);
    const filtered = items.filter((i) => i.id !== id);
    this.set("switchGears", filtered);
    if (item) this.addActivityLog("Hapus SG", `Menghapus ${item.name}`);
    return filtered;
  },

  // Users CRUD
  getUsers() {
    return this.get("users") || [];
  },

  getUser(id) {
    return this.getUsers().find((u) => u.id === id);
  },

  getUserByUsername(username) {
    return this.getUsers().find((u) => u.username === username);
  },

  addUser(data) {
    const items = this.getUsers();
    const newId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    const newItem = { id: newId, ...data };
    items.push(newItem);
    this.set("users", items);
    this.addActivityLog("Tambah User", `Menambahkan user baru: ${data.name}`);
    return newItem;
  },

  updateUser(id, data) {
    const items = this.getUsers();
    const idx = items.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...data };
    this.set("users", items);
    this.addActivityLog("Edit User", `Mengubah data user: ${items[idx].name}`);
    return items[idx];
  },

  deleteUser(id) {
    const items = this.getUsers();
    const item = items.find((i) => i.id === id);
    const filtered = items.filter((i) => i.id !== id);
    this.set("users", filtered);
    if (item) this.addActivityLog("Hapus User", `Menghapus user: ${item.name}`);
    return filtered;
  },

  // Activity Logs
  getActivityLogs() {
    return this.get("activityLogs") || [];
  },

  addActivityLog(action, details) {
    const logs = this.getActivityLogs();
    const user = JSON.parse(sessionStorage.getItem("ddp_current_user") || "{}");
    const newLog = {
      id: logs.length > 0 ? Math.max(...logs.map((l) => l.id)) + 1 : 1,
      action,
      user: user.name || "System",
      page: document.querySelector(".page-section.active")?.id || "Unknown",
      timestamp: new Date().toLocaleString("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      details,
    };
    logs.unshift(newLog);
    this.set("activityLogs", logs);
    return newLog;
  },
};
