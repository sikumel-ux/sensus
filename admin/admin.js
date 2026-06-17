import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// 1. FIREBASE CONFIGURATION
const firebaseConfig = {
  apiKey: "AIzaSyBZ31_bLqBiHY6VqHSza2qMuZqesp9-Cgg",
  authDomain: "sensus04.firebaseapp.com",
  projectId: "sensus04",
  storageBucket: "sensus04.firebasestorage.app",
  messagingSenderId: "538090009079",
  appId: "1:538090009079:web:932a4a812dd6de5fabfef2"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const sensusRef = ref(db, 'sensus_warga');

let semuaDataSensus = {};

// 2. LISTEN DATA FIREBASE REAL-TIME
onValue(sensusRef, (snapshot) => {
    const tbody = document.getElementById("tabelAdminSensus");
    if (!snapshot.exists()) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:30px; color:var(--text-muted);">Belum ada data warga yang masuk.</td></tr>`;
        updateStatistik(0, 0, 0);
        return;
    }

    semuaDataSensus = snapshot.val();
    tbody.innerHTML = "";

    let total = 0, pending = 0, approved = 0;

    Object.keys(semuaDataSensus).forEach(key => {
        const item = semuaDataSensus[key];
        total++;
        if (item.status === "Pending") pending++;
        if (item.status === "Approved") approved++;

        const badgeClass = item.status === "Pending" ? "status-pending" : "status-approved";

        const tr = document.createElement("tr");
        tr.className = "clickable-row";
        tr.innerHTML = `
            <td style="font-weight:700; color:var(--primary); font-size:0.85rem;">${item.kode}</td>
            <td><b>No. ${item.noRumah}</b></td>
            <td>${item.statusRumah}</td>
            <td>${item.jumlahJiwa} Jiwa</td>
            <td><span class="status-badge ${badgeClass}">${item.status}</span></td>
        `;
        
        tr.addEventListener("click", () => bukaDetailBerkas(item.kode));
        tbody.appendChild(tr);
    });

    updateStatistik(total, pending, approved);
});

function updateStatistik(t, p, a) {
    document.getElementById("statTotal").innerText = t;
    document.getElementById("statPending").innerText = p;
    document.getElementById("statApproved").innerText = a;
}

// 3. MODAL DETAIL PENGHUNI RUMAH
function bukaDetailBerkas(kode) {
    const data = semuaDataSensus[kode];
    const containerBox = document.getElementById("alertBoxContent");
    
    let htmlAnggota = "";
    data.anggota.forEach((w, idx) => {
        htmlAnggota += `
            <div style="border-bottom: 1px dashed #cbd5e1; padding: 8px 0; font-size:0.85rem;">
                <p><b>#${idx+1} ${w.nama}</b> <span class="review-badge">${w.status}</span></p>
                <p style="color:var(--text-muted); font-size:0.8rem;">NIK: ${w.nik} | File KTP: <span style="color:var(--accent-warn)">${w.fileUploaded}</span></p>
            </div>`;
    });

    containerBox.innerHTML = `
        <h3 style="border-bottom: 2px solid var(--primary); padding-bottom: 8px; margin-bottom: 15px;"><i class="fas fa-folder-open"></i> Detail Berkas ${data.kode}</h3>
        <div class="detail-grid">
            <div class="detail-item"><label>No. Rumah</label><p>No. ${data.noRumah}</p></div>
            <div class="detail-item"><label>Kontak WA</label><p>${data.waUtama}</p></div>
            <div class="detail-item" style="grid-column: span 2"><label>Status Hunian</label><p>${data.statusRumah}</p></div>
            <div class="detail-item" style="grid-column: span 2"><label>Detail Alamat Gang</label><p>${data.alamat}</p></div>
        </div>
        
        <h4 style="font-size:0.9rem; margin-bottom:5px;"><i class="fas fa-users"></i> Daftar Penghuni (${data.jumlahJiwa} Jiwa):</h4>
        <div style="max-height: 200px; overflow-y: auto; background:#fff; border:1px solid #e2e8f0; padding:10px; border-radius:8px; margin-bottom: 15px;">
            ${htmlAnggota}
        </div>

        <div class="action-zone" id="actionZoneButtons"></div>
        <button class="btn-action" style="margin-top:10px; background:#e2e8f0; color:#334155;" id="btnTutupModalAdmin"><i class="fas fa-arrow-left"></i> Tutup Detail</button>
    `;

    // Render tombol aksi dinamis tanpa inline onclick
    const actionZone = document.getElementById("actionZoneButtons");
    if (data.status === "Pending") {
        actionZone.innerHTML = `
            <button class="btn-action btn-approve" id="btnApproveAction"><i class="fas fa-check"></i> Sahkan (Approve)</button>
            <button class="btn-action btn-reject" id="btnRejectAction"><i class="fas fa-xmark"></i> Batal</button>`;
        document.getElementById("btnApproveAction").addEventListener("click", () => ubahStatusKependudukan(data.kode, 'Approved'));
        document.getElementById("btnRejectAction").addEventListener("click", () => ubahStatusKependudukan(data.kode, 'Pending'));
    } else {
        actionZone.innerHTML = `<button class="btn-action btn-reject" style="width:100%" id="btnResetAction"><i class="fas fa-rotate-left"></i> Kembalikan ke Pending</button>`;
        document.getElementById("btnResetAction").addEventListener("click", () => ubahStatusKependudukan(data.kode, 'Pending'));
    }

    document.getElementById("btnTutupModalAdmin").addEventListener("click", tutupModalAdmin);
    document.getElementById("customAlertOverlay").style.display = "flex";
}

// 4. UPDATE DATA STATUS KE FIREBASE CLOUD
function ubahStatusKependudukan(kode, statusBaru) {
    const updates = {};
    updates[`/sensus_warga/${kode}/status`] = statusBaru;
    
    update(ref(db), updates).then(() => {
        tutupModalAdmin();
    }).catch(err => {
        alert("Gagal merubah status data!");
    });
}

function tutupModalAdmin() {
    document.getElementById("customAlertOverlay").style.display = "none";
}
