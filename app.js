import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

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

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db);

// 2. STATE APP VARIABLES
let rowCount = 0;
let temporarySubmissionData = null;

// 3. DOM ELEMENTS SETUP & EVENT LISTENERS
document.addEventListener("DOMContentLoaded", () => {
    tambahWargaRow(); // Mulai dengan satu baris form default

    // Event Listeners Input & Form
    document.getElementById("status_rumah").addEventListener("change", sinkronisasiKategoriWargaAll);
    document.getElementById("btnTambahAnggota").addEventListener("click", tambahWargaRow);
    document.getElementById("mainSensusForm").addEventListener("submit", prosesValidasiDanReview);
    document.getElementById("btnKirimFinal").addEventListener("click", simpanFinalKolektif);
    document.getElementById("btnKembaliEdit").addEventListener("click", kembaliEditForm);
    document.getElementById("btnCariStatus").addEventListener("click", cariStatusSensus);

    // Navigation Links Listener
    document.getElementById("navForm").addEventListener("click", function(e) { e.preventDefault(); switchPage('pageForm', this); });
    document.getElementById("navStatus").addEventListener("click", function(e) { e.preventDefault(); switchPage('pageStatus', this); });
});

// 4. MAIN APP LOGIC & FUNCTIONS
function switchPage(pageId, element) {
    document.querySelectorAll('.app-page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    if(element) element.classList.add('active');
    if(pageId === 'pageStatus') {
        document.getElementById("inputCariKode").value = "";
        resetTabelKeKeadaanAwal();
    }
}

function resetTabelKeKeadaanAwal() {
    document.getElementById("tabelStatusSensus").innerHTML = `
        <tr>
            <td colspan="4" style="text-align:center; color:var(--text-muted); padding: 30px 10px;">
                <i class="fas fa-lock" style="font-size:1.2rem; margin-bottom:8px; display:block; color:#94a3b8"></i>
                Masukkan Kode Unik di atas untuk melacak status berkas Anda.
            </td>
        </tr>`;
}

async function cariStatusSensus() {
    const kataKunci = document.getElementById("inputCariKode").value.trim().toUpperCase();
    const tbody = document.getElementById("tabelStatusSensus");
    if(kataKunci === "") { resetTabelKeKeadaanAwal(); return; }

    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px;"><i class="fas fa-spinner fa-spin"></i> Mencari berkas...</td></tr>`;

    try {
        const snapshot = await get(child(dbRef, `sensus_warga/${kataKunci}`));
        if (snapshot.exists()) {
            const data = snapshot.val();
            const badgeClass = data.status === "Pending" ? "status-pending" : "status-approved";
            tbody.innerHTML = `
                <tr>
                    <td style="font-weight:700; color:var(--primary); font-size:0.85rem; letter-spacing:0.5px;">${data.kode}</td>
                    <td>No. ${data.noRumah}</td>
                    <td>${data.jumlahJiwa} Jiwa</td>
                    <td><span class="status-badge ${badgeClass}">${data.status}</span></td>
                </tr>`;
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align:center; color:var(--accent-warn); padding: 30px 10px; font-weight: 500;">
                        <i class="fas fa-triangle-exclamation" style="font-size:1.2rem; margin-bottom:8px; display:block;"></i>
                        Kode Unik salah atau tidak terdaftar di Firebase!
                    </td>
                </tr>`;
        }
    } catch (error) {
        console.error("Error Firebase Get:", error);
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:red; padding:20px;">Gagal memuat data dari Firebase.</td></tr>`;
    }
}

function sinkronisasiKategoriWargaAll() {
    const statusRumah = document.getElementById("status_rumah").value;
    const infoNote = document.getElementById("infoNoteStatus");
    const btnTambah = document.getElementById("btnTambahAnggota");
    const container = document.getElementById("wargaListContainer");

    if (statusRumah === "Kos") {
        infoNote.innerHTML = `<i class="fas fa-exclamation-triangle" style="color:var(--accent-warn)"></i> <b>Mode Kost Mandiri:</b> Form dikunci untuk 1 pengisi kost. Anda wajib mengunggah KTP asli.`;
        btnTambah.style.display = "none"; container.innerHTML = ""; rowCount = 0; tambahWargaRow(); 
    } else if (statusRumah === "Sewa / Kontrak") {
        infoNote.innerHTML = `<i class="fas fa-info-circle"></i> <b>Mode Kontrakan:</b> Masukkan seluruh penghuni rumah kontrakan. Seluruh anggota wajib mengunggah KTP.`;
        btnTambah.style.display = "flex"; container.innerHTML = ""; rowCount = 0; tambahWargaRow();
    } else {
        infoNote.innerHTML = `<i class="fas fa-info-circle"></i> <b>Mode Rumah Pribadi:</b> Anda bisa memasukkan Kepala Keluarga, Istri, Anak (Warga Tetap), atau ART/Sopir.`;
        btnTambah.style.display = "flex"; container.innerHTML = ""; rowCount = 0; tambahWargaRow();
    }
}

function tambahWargaRow() {
    rowCount++;
    const container = document.getElementById("wargaListContainer");
    const statusRumah = document.getElementById("status_rumah").value;
    const row = document.createElement("div");
    row.className = "warga-item-box";
    row.id = `wargaRow_${rowCount}`;
    
    let selectOptionsHtml = "";
    if (statusRumah === "Kos") {
        selectOptionsHtml = `<option value="Anak Kos">Anak Kos (Warga Tidak Tetap)</option>`;
    } else if (statusRumah === "Sewa / Kontrak") {
        selectOptionsHtml = `
            <option value="Kontrakan">Kontrakan / Penyewa Rumah</option>
            <option value="ART / Sopir (Kontrak)">ART / Sopir Tinggal Dalam</option>`;
    } else {
        selectOptionsHtml = `
            <option value="Kepala Keluarga">Kepala Keluarga (Warga Tetap)</option>
            <option value="Istri">Istri (Warga Tetap)</option>
            <option value="Anak">Anak (Warga Tetap)</option>
            <option value="Orang Tua">Orang Tua / Mertua (Warga Tetap)</option>
            <option value="ART / Sopir (Tetap)">ART / Sopir Rumah Pribadi</option>`;
    }

    row.innerHTML = `
        ${(statusRumah === "Kos") ? '' : `<button type="button" class="btn-delete-row" data-id="${rowCount}"><i class="fas fa-trash"></i> Hapus</button>`}
        <h4 style="font-size:0.9rem; margin-bottom:12px; color:var(--primary)"><i class="fas fa-user-tag"></i> Data Jiwa Penghuni</h4>
        <div class="form-grid">
            <div class="form-group">
                <label>Nama Lengkap</label>
                <input type="text" class="form-control input-nama" placeholder="Sesuai dokumen KTP" required>
            </div>
            <div class="form-group">
                <label>NIK (Nomor Induk Kependudukan)</label>
                <input type="text" class="form-control input-nik" placeholder="Harus 16 digit angka" inputmode="numeric" pattern="[0-9]{16}" maxlength="16" required>
                <div id="errorNik_${rowCount}" class="error-hint">⚠️ NIK harus tepat 16 digit angka!</div>
            </div>
            <div class="form-group">
                <label>Status Hubungan di Rumah Ini</label>
                <select class="form-control input-status">${selectOptionsHtml}</select>
            </div>
            <div class="form-group upload-box-wrapper" id="uploadWrapper_${rowCount}">
                <label style="color:var(--accent-warn)"><i class="fas fa-id-card"></i> Dokumen Wajib KTP / Domisili</label>
                <div class="file-zone" id="fileZone_${rowCount}">
                    <i class="fas fa-cloud-arrow-up"></i>
                    <p id="fileNameLabel_${rowCount}" style="font-size:0.8rem; margin-top:4px;">Klik upload berkas KTP</p>
                    <input type="file" id="file_${rowCount}" class="input-file" accept="image/*" style="display:none;">
                </div>
            </div>
        </div>`;

    container.appendChild(row);

    const selectNode = row.querySelector(".input-status");
    const inputNikNode = row.querySelector(".input-nik");
    const fileZoneNode = row.querySelector(".file-zone");
    const inputFileNode = row.querySelector(".input-file");
    const btnHapus = row.querySelector(".btn-delete-row");

    selectNode.addEventListener("change", () => evaluasiKewajibanKtp(selectNode, row.id.split('_')[1]));
    inputNikNode.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/[^0-9]/g, '');
        cekPanjangNikLive(e.target, row.id.split('_')[1]);
    });
    fileZoneNode.addEventListener("click", () => inputFileNode.click());
    inputFileNode.addEventListener("change", () => fileChanged(inputFileNode, row.id.split('_')[1]));
    if(btnHapus) {
        btnHapus.addEventListener("click", () => hapusWargaRow(btnHapus.getAttribute("data-id")));
    }

    evaluasiKewajibanKtp(selectNode, rowCount);
}

function cekPanjangNikLive(input, id) {
    const errorHint = document.getElementById(`errorNik_${id}`);
    if(input.value.length > 0 && input.value.length < 16) {
        errorHint.style.display = "block"; input.style.borderColor = "var(--accent-warn)";
    } else {
        errorHint.style.display = "none"; input.style.borderColor = "";
    }
}

function hapusWargaRow(id) { const row = document.getElementById(`wargaRow_${id}`); if (row) row.remove(); }

function evaluasiKewajibanKtp(select, id) {
    const wrapper = document.getElementById(`uploadWrapper_${id}`);
    const inputNode = document.getElementById(`file_${id}`);
    if(select.value === "Anak Kos" || select.value === "Kontrakan" || select.value.includes("ART / Sopir")) {
        wrapper.style.display = "block"; inputNode.setAttribute("required", "required");
    } else {
        wrapper.style.display = "none"; inputNode.removeAttribute("required"); inputNode.value = "";
        document.getElementById(`fileNameLabel_${id}`).innerText = "Klik upload berkas KTP";
    }
}

function fileChanged(input, id) {
    const label = document.getElementById(`fileNameLabel_${id}`);
    label.innerText = input.files[0] ? `📄 ${input.files[0].name}` : "Klik upload berkas KTP";
}

function panggilCustomModal(tipe, judul, pesan, detailTambahan = "", callbackAction = null) {
    const containerBox = document.getElementById("alertBoxContent");
    if (tipe === "sukses") {
        containerBox.innerHTML = `
            <div class="alert-icon-box alert-icon-success"><i class="fas fa-circle-check"></i></div>
            <h3>${judul}</h3><p>${pesan}</p><div class="code-display">${detailTambahan}</div>
            <button class="btn-modal-close" id="btnModalCloseAction">Ke Menu Validasi Status</button>`;
    } else if (tipe === "error") {
        containerBox.innerHTML = `
            <div class="alert-icon-box alert-icon-error"><i class="fas fa-triangle-exclamation"></i></div>
            <h3 style="color:var(--accent-warn);">${judul}</h3><p>${pesan}</p>
            <button class="btn-modal-close" style="background:var(--accent-warn)" id="btnModalCloseAction">Perbaiki Data</button>`;
    }
    document.getElementById("customAlertOverlay").style.display = "flex";

    const btnAction = document.getElementById("btnModalCloseAction");
    btnAction.addEventListener("click", () => {
        if(callbackAction) { callbackAction(); } else { tutupCustomModalOnly(); }
    });
}

function tutupCustomModalOnly() { document.getElementById("customAlertOverlay").style.display = "none"; }

async function prosesValidasiDanReview(e) {
    e.preventDefault();
    const rows = document.querySelectorAll(".warga-item-box");
    if(rows.length === 0) { panggilCustomModal("error", "Data Kosong", "Mohon masukkan minimal 1 data penghuni!"); return; }

    const regexNik = /^[0-9]{16}$/;
    let kumpulanNikInputForm = [];
    
    panggilCustomModal("error", "Mohon Tunggu", '<i class="fas fa-spinner fa-spin"></i> Sedang melakukan pengecekan NIK di Cloud Database...');
    document.getElementById("btnModalCloseAction").style.display = "none"; 

    for (let row of rows) {
        const inputNik = row.querySelector(".input-nik");
        const valueNik = inputNik.value.trim();
        const namaWarga = row.querySelector(".input-nama").value.trim() || 'Tanpa Nama';

        if (!regexNik.test(valueNik)) {
            panggilCustomModal("error", "Format NIK Keliru", `NIK untuk <b>${namaWarga}</b> wajib 16 digit angka!`);
            inputNik.focus(); return;
        }

        if (kumpulanNikInputForm.includes(valueNik)) {
            panggilCustomModal("error", "Duplikasi Form", `NIK <b>${valueNik}</b> diinput ganda di form ini.`);
            inputNik.focus(); return;
        }
        kumpulanNikInputForm.push(valueNik);

        try {
            const snap = await get(child(dbRef, `daftar_nik_terkunci/${valueNik}`));
            if (snap.exists()) {
                panggilCustomModal("error", "Sensus Ganda Diblokir", `Warga bernama <b>${namaWarga}</b> (NIK: ${valueNik}) terdeteksi <b>SUDAH PERNAH</b> mengisi sensus sebelumnya.`);
                inputNik.focus(); inputNik.style.borderColor = "var(--accent-warn)";
                return;
            }
        } catch(err) {
            console.error("Error checking NIK lock:", err);
        }
    }

    tutupCustomModalOnly();

    temporarySubmissionData = {
        noRumah: document.getElementById("no_rumah").value,
        statusRumah: document.getElementById("status_rumah").value,
        waUtama: document.getElementById("wa_utama").value,
        alamat: document.getElementById("alamat_rumah").value,
        status: "Pending", 
        anggota: []
    };

    rows.forEach(row => {
        temporarySubmissionData.anggota.push({
            nama: row.querySelector(".input-nama").value,
            nik: row.querySelector(".input-nik").value,
            status: row.querySelector(".input-status").value,
            fileUploaded: row.querySelector(".input-file").files[0] ? row.querySelector(".input-file").files[0].name : "-"
        });
    });

    let htmlReview = `
        <div class="form-group"><label>Status Hunian Properti</label><div class="review-value" style="color:var(--primary); font-weight:700;">${temporarySubmissionData.statusRumah}</div></div>
        <div class="form-group"><label>No. Rumah & Kontak WA</label><div class="review-value">Rumah ${temporarySubmissionData.noRumah} / WA: ${temporarySubmissionData.waUtama}</div></div>
        <div class="form-group"><label>Alamat Domisili</label><div class="review-value">${temporarySubmissionData.alamat}</div></div>
        <div class="full-width" style="margin-top:10px;"><h4 style="font-size:0.95rem; border-bottom:1px solid #cbd5e0; padding-bottom:5px;">Data Penghuni Terdaftar:</h4></div>`;

    temporarySubmissionData.anggota.forEach((w, index) => {
        htmlReview += `
            <div class="warga-item-box" style="background:#fff; border-style:solid; border-color:#e2e8f0;">
                <div style="font-weight:700; color:var(--primary); font-size:0.9rem; margin-bottom:8px;">Penghuni #${index + 1} <span class="review-badge">${w.status}</span></div>
                <p style="font-size:0.85rem; margin-bottom:3px;"><b>Nama:</b> ${w.nama}</p>
                <p style="font-size:0.85rem; margin-bottom:3px;"><b>NIK:</b> ${w.nik}</p>
            </div>`;
    });

    document.getElementById("reviewContentHtml").innerHTML = htmlReview;
    document.getElementById("pageForm").style.display = "none";
    document.getElementById("pageReview").style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function kembaliEditForm() {
    document.getElementById("pageReview").style.display = "none";
    document.getElementById("pageForm").style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function generateRandomCode() {
    const karakter = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let hasil = "";
    for (let i = 0; i < 4; i++) { hasil += karakter.charAt(Math.floor(Math.random() * karakter.length)); }
    return `RT04-${hasil}`;
}

async function simpanFinalKolektif() {
    const btnKirim = document.getElementById("btnKirimFinal");
    btnKirim.disabled = true;
    btnKirim.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Menyimpan ke Cloud...`;

    const kodeUnik = generateRandomCode();
    temporarySubmissionData.kode = kodeUnik;
    temporarySubmissionData.jumlahJiwa = temporarySubmissionData.anggota.length;

    try {
        await set(ref(db, `sensus_warga/${kodeUnik}`), temporarySubmissionData);
        
        let promisesKunciNik = [];
        temporarySubmissionData.anggota.forEach(warga => {
            let simpanKunci = set(ref(db, `daftar_nik_terkunci/${warga.nik}`), {
                nama: warga.nama,
                kodePendaftaran: kodeUnik
            });
            promisesKunciNik.push(simpanKunci);
        });
        await Promise.all(promisesKunciNik);

        panggilCustomModal("sukses", "Pendaftaran Berhasil!", "Data telah aman disimpan di Firebase cloud. Simpan kode unik melacak status Anda:", kodeUnik, tutupAlertDanReset);
    } catch (error) {
        console.error("Error saving data:", error);
        btnKirim.disabled = false;
        btnKirim.innerHTML = `<i class="fas fa-cloud-arrow-up"></i> Konfirmasi & Kirim Data`;
        panggilCustomModal("error", "Koneksi Bermasalah", "Gagal mengirim data ke Firebase. Periksa jaringan internet Anda.");
    }
}

function tutupAlertDanReset() {
    document.getElementById("customAlertOverlay").style.display = "none";
    document.getElementById("mainSensusForm").reset();
    document.getElementById("wargaListContainer").innerHTML = "";
    document.getElementById("pageReview").style.display = "none";
    rowCount = 0;
    tambahWargaRow();
    switchPage('pageStatus', document.getElementById("navStatus"));
}
