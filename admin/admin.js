// 1. FIREBASE CONFIGURATION
const firebaseConfig = {
  apiKey: "AIzaSyBZ31_bLqBiHY6VqHSza2qMuZqesp9-Cgg",
  authDomain: "sensus04.firebaseapp.com",
  databaseURL: "https://sensus04-default-rtdb.asia-southeast1.firebasedatabase.app", 
  projectId: "sensus04",
  storageBucket: "sensus04.firebasestorage.app",
  messagingSenderId: "538090009079",
  appId: "1:538090009079:web:932a4a812dd6de5fabfef2"
};

// Inisialisasi Firebase versi lama (Compat)
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const sensusRef = db.ref('sensus_warga');

let semuaDataSensus = {};

// 2. LISTEN DATA FIREBASE REAL-TIME
sensusRef.on('value', (snapshot) => {
    const tbody = document.getElementById("tabelAdminSensus");
    if (!snapshot.exists()) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:40px; color:var(--text-muted); font-weight:500;">Belum ada data warga yang masuk.</td></tr>`;
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
            <td style="font-weight:700; color:var(--primary); font-size:0.85rem; letter-spacing:0.5px;">${item.kode}</td>
            <td><b>No. ${item.noRumah}</b></td>
            <td><span style="color:var(--text-main); font-weight:500;">${item.statusRumah}</span></td>
            <td>${item.jumlahJiwa} Jiwa</td>
            <td><span class="status-badge ${badgeClass}">${item.status === 'Pending' ? '<i class="fas fa-clock"></i> Pending' : '<i class="fas fa-circle-check"></i> Approved'}</span></td>
        `;
        
        tr.addEventListener("click", () => bukaDetailBerkas(item.kode));
        tbody.appendChild(tr);
    });

    updateStatistik(total, pending, approved);
}, (error) => {
    console.error("Firebase Realtime Error Listen:", error);
    document.getElementById("tabelAdminSensus").innerHTML = `<tr><td colspan="5" style="text-align:center; color:red; padding:40px;">Error: ${error.message}</td></tr>`;
});

function updateStatistik(t, p, a) {
    document.getElementById("statTotal").innerText = t;
    document.getElementById("statPending").innerText = p;
    document.getElementById("statApproved").innerText = a;
}

// 3. MODAL DETAIL PENGHUNI RUMAH
window.bukaDetailBerkas = function(kode) {
    const data = semuaDataSensus[kode];
    const containerBox = document.getElementById("alertBoxContent");
    
    let htmlAnggota = "";
    data.anggota.forEach((w, idx) => {
        htmlAnggota += `
            <div class="warga-item-box" style="font-size:0.85rem;">
                <p style="display:flex; justify-content:between; align-items:center; width:100%; margin-bottom:4px;">
                    <span style="color:#ffffff; font-weight:600;">#${idx+1} ${w.nama}</span> 
                    <span class="status-badge" style="background:rgba(255,255,255,0.05); color:var(--text-muted); font-size:0.7rem; padding:2px 8px;">${w.status}</span>
                </p>
                <p style="color:var(--text-muted); font-size:0.8rem;"><i class="far fa-id-card"></i> NIK: ${w.nik} | <i class="fas fa-paperclip"></i> KTP: <span style="color:var(--primary)">${w.fileUploaded}</span></p>
            </div>`;
    });

    containerBox.innerHTML = `
        <h3 style="padding-bottom: 12px; margin-bottom: 15px; border-bottom: 1px solid var(--border-color); display:flex; align-items:center; gap:10px; color:#ffffff;">
            <i class="fas fa-folder-open" style="color:var(--primary)"></i> Detail Berkas ${data.kode}
        </h3>
        <div class="detail-grid">
            <div class="detail-item"><label>No. Rumah</label><p>No. ${data.noRumah}</p></div>
            <div class="detail-item"><label>Kontak WA</label><p>${data.waUtama}</p></div>
            <div class="detail-item" style="grid-column: span 2"><label>Status Hunian</label><p>${data.statusRumah}</p></div>
            <div class="detail-item" style="grid-column: span 2"><label>Detail Alamat Gang</label><p>${data.alamat}</p></div>
        </div>
        
        <h4 style="font-size:0.85rem; text-transform:uppercase; color:var(--text-muted); letter-spacing:0.5px; margin-bottom:10px;"><i class="fas fa-users"></i> Daftar Penghuni (${data.jumlahJiwa} Jiwa):</h4>
        <div style="max-height: 180px; overflow-y: auto; background:rgba(0,0,0,0.15); border:1px solid var(--border-color); padding:12px; border-radius:10px; margin-bottom: 20px; display:flex; flex-direction:column; gap:4px;">
            ${htmlAnggota}
        </div>

        <div class="action-zone" id="actionZoneButtons"></div>
        <button class="btn-action" style="margin-top:12px; background:var(--bg-input); color:var(--text-main); border: 1px solid var(--border-color);" id="btnTutupModalAdmin"><i class="fas fa-arrow-left"></i> Tutup Detail</button>
    `;

    const actionZone = document.getElementById("actionZoneButtons");
    if (data.status === "Pending") {
        actionZone.innerHTML = `
            <button class="btn-action btn-approve" id="btnApproveAction"><i class="fas fa-check"></i> Sahkan Berkas</button>
            <button class="btn-action btn-reject" id="btnRejectAction"><i class="fas fa-trash-can"></i> Tolak</button>`;
        document.getElementById("btnApproveAction").addEventListener("click", () => ubahStatusKependudukan(data.kode, 'Approved'));
        document.getElementById("btnRejectAction").addEventListener("click", () => ubahStatusKependudukan(data.kode, 'Pending'));
    } else {
        actionZone.innerHTML = `<button class="btn-action btn-reject" style="width:100%" id="btnResetAction"><i class="fas fa-rotate-left"></i> Kembalikan ke Pending</button>`;
        document.getElementById("btnResetAction").addEventListener("click", () => ubahStatusKependudukan(data.kode, 'Pending'));
    }

    document.getElementById("btnTutupModalAdmin").addEventListener("click", tutupModalAdmin);
    document.getElementById("customAlertOverlay").style.display = "flex";
}

function ubahStatusKependudukan(kode, statusBaru) {
    db.ref(`/sensus_warga/${kode}`).update({ status: statusBaru })
    .then(() => {
        tutupModalAdmin();
    }).catch(err => {
        console.error("Error updating status:", err);
        alert("Gagal merubah status data!");
    });
}

window.tutupModalAdmin = function() {
    document.getElementById("customAlertOverlay").style.display = "none";
}
