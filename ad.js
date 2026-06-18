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

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const sensusRef = db.ref('sensus_warga');

let semuaDataSensus = {};

// 2. LISTEN DATA FIREBASE REAL-TIME
sensusRef.on('value', (snapshot) => {
    const listContainer = document.getElementById("tabelAdminSensus");
    
    if (!snapshot.exists()) {
        listContainer.innerHTML = `
            <div class="loading-state">
                <i class="fas fa-folder-open" style="font-size: 1.5rem; color: var(--text-muted); margin-bottom: 8px;"></i>
                <p>Belum ada data sensus masuk.</p>
            </div>`;
        updateStatistik(0, 0, 0);
        return;
    }

    semuaDataSensus = snapshot.val();
    listContainer.innerHTML = "";

    let total = 0, pending = 0, approved = 0;

    Object.keys(semuaDataSensus).forEach(key => {
        const item = semuaDataSensus[key];
        total++;
        if (item.status === "Pending") pending++;
        if (item.status === "Approved") approved++;

        const badgeClass = item.status === "Pending" ? "status-pending" : "status-approved";
        const iconBadge = item.status === "Pending" ? '<i class="fas fa-clock"></i>' : '<i class="fas fa-check"></i>';

        const card = document.createElement("div");
        card.className = "warga-mobile-card";
        card.innerHTML = `
            <div class="wmc-left">
                <h3>Rumah No. ${item.noRumah}</h3>
                <p><span class="wmc-code">${item.kode}</span> • <span>${item.jumlahJiwa} Jiwa</span></p>
            </div>
            <div class="wmc-right">
                <span class="status-badge ${badgeClass}">${iconBadge} ${item.status}</span>
            </div>
        `;
        
        card.addEventListener("click", () => bukaDetailBerkas(item.kode));
        listContainer.appendChild(card);
    });

    updateStatistik(total, pending, approved);
}, (error) => {
    console.error("Firebase Realtime Error Listen:", error);
});

function updateStatistik(t, p, a) {
    document.getElementById("statTotal").innerText = t;
    document.getElementById("statPending").innerText = p;
    document.getElementById("statApproved").innerText = a;
}

// 3. NATIVE BOTTOM SHEET MODAL (POP-UP DETAIL)
window.bukaDetailBerkas = function(kode) {
    const data = semuaDataSensus[kode];
    const containerBox = document.getElementById("alertBoxContent");
    
    let htmlAnggota = "";
    if (data.anggota && Array.isArray(data.anggota)) {
        data.anggota.forEach((w, idx) => {
            htmlAnggota += `
                <div class="warga-item-box">
                    <p style="display:flex; justify-content:space-between; font-weight:600; color:#fff; margin-bottom:2px;">
                        <span>#${idx+1} ${w.nama}</span>
                        <span style="color:var(--text-muted); font-size:0.7rem;">${w.status}</span>
                    </p>
                    <p style="color:var(--text-muted); font-size:0.75rem;">NIK: ${w.nik}</p>
                </div>`;
        });
    }

    containerBox.innerHTML = `
        <div class="sheet-handle"></div>
        <h3 style="color:#fff; font-size:1.1rem; font-weight:800; margin-bottom:4px;">Berkas ${data.kode}</h3>
        <p style="font-size:0.75rem; color:var(--text-muted);">Verifikasi berkas kependudukan warga</p>
        
        <div class="detail-grid">
            <div class="detail-item"><label>No. Rumah</label><p>${data.noRumah || '-'}</p></div>
            <div class="detail-item"><label>Kontak WA</label><p>${data.waUtama || '-'}</p></div>
            <div class="detail-item" style="grid-column: span 2"><label>Hunian</label><p>${data.statusRumah || '-'}</p></div>
            <div class="detail-item" style="grid-column: span 2"><label>Alamat</label><p>${data.alamat || '-'}</p></div>
        </div>
        
        <h4 style="font-size:0.7rem; text-transform:uppercase; color:var(--text-muted); font-weight:700; margin-bottom:6px;">Daftar Penghuni (${data.jumlahJiwa || 0} Jiwa):</h4>
        <div style="max-height: 160px; overflow-y: auto; background:rgba(0,0,0,0.2); padding:0 10px; border-radius:8px; border:1px solid var(--border);">
            ${htmlAnggota || '<p style="padding:10px; color:var(--text-muted); font-size:0.8rem;">Tidak ada data penghuni.</p>'}
        </div>

        <div class="action-zone" id="actionZoneButtons"></div>
        <button class="btn-action" style="margin-top:10px; background:var(--bg-input); color:var(--text-main); border:1px solid var(--border);" id="btnTutupModalAdmin"><i class="fas fa-angle-down"></i> Sembunyikan</button>
    `;

    const actionZone = document.getElementById("actionZoneButtons");
    if (data.status === "Pending") {
        actionZone.innerHTML = `
            <button class="btn-action btn-approve" id="btnApproveAction"><i class="fas fa-check"></i> Sahkan</button>
            <button class="btn-action btn-reject" id="btnRejectAction"><i class="fas fa-xmark"></i> Tolak</button>`;
        document.getElementById("btnApproveAction").addEventListener("click", () => ubahStatusKependudukan(data.kode, 'Approved'));
        document.getElementById("btnRejectAction").addEventListener("click", () => ubahStatusKependudukan(data.kode, 'Pending'));
    } else {
        actionZone.innerHTML = `<button class="btn-action btn-reject" style="width:100%" id="btnResetAction"><i class="fas fa-rotate-left"></i> Batalkan Pengesahan</button>`;
        document.getElementById("btnResetAction").addEventListener("click", () => ubahStatusKependudukan(data.kode, 'Pending'));
    }

    document.getElementById("btnTutupModalAdmin").addEventListener("click", tutupModalAdmin);
    document.getElementById("customAlertOverlay").style.display = "flex";
}

function ubahStatusKependudukan(kode, statusBaru) {
    db.ref(`/sensus_warga/${kode}`).update({ status: statusBaru })
    .then(() => {
        tutupModalAdmin();
    }).catch(err => { console.error("Gagal update status:", err); });
}

window.tutupModalAdmin = function() {
    document.getElementById("customAlertOverlay").style.display = "none";
}

// 4. DOWNLOAD DATA LAPORAN PDF VIA GRID CARD 2X2
document.getElementById("btnDownloadPDFCard").addEventListener("click", () => {
    const elemenLaporan = document.getElementById("areaCetakPdf");
    const opsiCetak = {
        margin:       8,
        filename:     'Laporan_Sensus_RT04.pdf',
        image:        { type: 'jpeg', quality: 0.96 },
        html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#1A1714' },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opsiCetak).from(elemenLaporan).save();
});
