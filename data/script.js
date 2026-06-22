// SAMAKAN URL INI DENGAN URL YANG ADA DI FILE UTAMA WARGA (SCRIPT.JS)
const GOOGLE_SCRIPT_API_URL = "https://script.google.com/macros/s/AKfycby-DpvqtWpu8FEVeudZYPms_0kc7jJyQ60BwiVJ9NlIxKcBzMbse9GcbBpjnorz94_wHg/exec";

let listDataMentahSensus = [];
let statusFilterAktif = "Semua";

// Fungsi Otomatis saat Halaman Terbuka
window.onload = function() {
    muatUlangDataSensus();
};

// Fungsi Ambil Data (GET) dari Web App Google Apps Script
function muatUlangDataSensus() {
    const icon = document.getElementById("refreshIcon");
    const tbody = document.getElementById("sensusTableBody");
    
    if(icon) icon.classList.add("fa-spin");
    tbody.innerHTML = `<tr><td colspan="7" class="td-status-info"><i class="fas fa-spinner fa-spin"></i> Sedang mengambil data terbaru dari Google Sheets...</td></tr>`;

    fetch(GOOGLE_SCRIPT_API_URL)
        .then(response => response.json())
        .then(data => {
            // Urutkan data berdasarkan inputan terbaru (dari bawah ke atas)
            listDataMentahSensus = data.reverse();
            
            hitungDanTampilkanStatistik();
            prosesFilterDanPencarian();
        })
        .catch(err => {
            console.error(err);
            tbody.innerHTML = `<tr><td colspan="7" class="td-status-info" style="color:#EF4444;"><i class="fas fa-exclamation-triangle"></i> Gagal memuat data. Periksa URL script Web App Anda.<br><small>${err.toString()}</small></td></tr>`;
        })
        .finally(() => {
            if(icon) icon.classList.remove("fa-spin");
        });
}

// Menghitung Jumlah Ringkasan Box Atas
function hitungDanTampilkanStatistik() {
    document.getElementById("count_total").innerText = listDataMentahSensus.length;
    
    let tetap = listDataMentahSensus.filter(item => item.statusRumah === "Milik Sendiri").length;
    let kontrak = listDataMentahSensus.filter(item => item.statusRumah === "Sewa / Kontrak").length;
    let kos = listDataMentahSensus.filter(item => item.statusRumah === "Kos").length;

    document.getElementById("count_tetap").innerText = tetap;
    document.getElementById("count_kontrak").innerText = kontrak;
    document.getElementById("count_kos").innerText = kos;
}

// Mengubah Filter Tab Status
function setFilterStatus(status) {
    statusFilterAktif = status;
    
    // Ganti class active tombol tab
    document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
    
    const idMap = { "Semua": "Semua", "Milik Sendiri": "MilikSendiri", "Sewa / Kontrak": "SewaKontrak", "Kos": "Kos" };
    const targetId = `tab_${idMap[status]}`;
    if(document.getElementById(targetId)) {
        document.getElementById(targetId).classList.add("active");
    }

    prosesFilterDanPencarian();
}

// Logic Inti Memproses Filter Tab Sekaligus Kolom Pencarian (Search Bar)
function prosesFilterDanPencarian() {
    const kataKunci = document.getElementById("adminSearchInput").value.toLowerCase().trim();
    const tbody = document.getElementById("sensusTableBody");
    tbody.innerHTML = "";

    // 1. Filter Status Rumah
    let hasilFilter = listDataMentahSensus;
    if (statusFilterAktif !== "Semua") {
        hasilFilter = listDataMentahSensus.filter(item => item.statusRumah === statusFilterAktif);
    }

    // 2. Filter Keyword Pencarian
    if (kataKunci !== "") {
        hasilFilter = hasilFilter.filter(item => {
            const noRumah = (item.noRumah || "").toLowerCase();
            const alamat = (item.alamat || "").toLowerCase();
            const noKk = (item.noKk || "").toLowerCase();
            const kodeReg = (item.kode || "").toLowerCase();
            
            // Cari nama kepala keluarga atau penghuni utama (selalu index ke-0 pada array anggota)
            const kepalaKeluarga = item.anggota && item.anggota[0] ? item.anggota[0].nama.toLowerCase() : "";

            // Cari di dalam sub-data NIK/Nama seluruh anggota jiwa
            let cocokDiAnggota = false;
            if(item.anggota && Array.isArray(item.anggota)) {
                cocokDiAnggota = item.anggota.some(a => 
                    (a.nama || "").toLowerCase().includes(kataKunci) || 
                    (a.nik || "").toLowerCase().includes(kataKunci)
                );
            }

            return noRumah.includes(kataKunci) || 
                   alamat.includes(kataKunci) || 
                   noKk.includes(kataKunci) || 
                   kodeReg.includes(kataKunci) || 
                   kepalaKeluarga.includes(kataKunci) ||
                   cocokDiAnggota;
        });
    }

    // Tampilkan jika kosong
    if (hasilFilter.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="td-status-info">Tidak ada data sensus warga yang cocok.</td></tr>`;
        return;
    }

    // Render Baris Tabel Utama
    hasilFilter.forEach(item => {
        const tr = document.createElement("tr");
        
        let badgeClass = "badge-tetap";
        if(item.statusRumah === "Sewa / Kontrak") badgeClass = "badge-kontrak";
        if(item.statusRumah === "Kos") badgeClass = "badge-kos";

        const namaUtama = item.anggota && item.anggota[0] ? item.anggota[0].nama : "Bukan Data Warga";
        const totalJiwa = item.anggota ? item.anggota.length : 0;
        const indexAsliString = encodeURIComponent(JSON.stringify(item));

        tr.innerHTML = `
            <td><strong style="color:var(--primary); font-size:0.8rem;">${item.kode || '-'}</strong></td>
            <td><strong>${item.noRumah || '-'}</strong></td>
            <td><span class="badge ${badgeClass}">${item.statusRumah}</span></td>
            <td>${namaUtama}</td>
            <td><a href="https://wa.me/${formatKeNoWaInternasional(item.waUtama)}" target="_blank" style="color:var(--teal); text-decoration:none; font-weight:700;"><i class="fab fa-whatsapp"></i> ${item.waUtama || '-'}</a></td>
            <td><span style="background:#E2E8F0; padding:2px 8px; border-radius:10px; font-size:0.75rem; font-weight:700;">${totalJiwa} Orang</span></td>
            <td>
                <button class="btn-detail" onclick="bukaDetailModal('${indexAsliString}')"><i class="fas fa-eye"></i> Lihat</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function formatKeNoWaInternasional(noHp) {
    if(!noHp) return "";
    let clean = noHp.replace(/[^0-9]/g, '');
    if (clean.startsWith("0")) {
        clean = "62" + clean.slice(1);
    }
    return clean;
}

// Fungsi Membuka Modal Box dan Menampilkan Anggota Jiwa Secara Rinci
function bukaDetailModal(encodedJsonData) {
    const item = JSON.parse(decodeURIComponent(encodedJsonData));
    
    document.getElementById("modalTitleReg").innerText = `Detail Sensus: ${item.kode || '04-xxxxx'}`;
    document.getElementById("modalSubInfo").innerText = `Nomor Rumah: ${item.noRumah} | Alamat: ${item.alamat}`;
    
    document.getElementById("m_no_kk").innerText = item.noKk || "-";
    document.getElementById("m_jimpitan").innerText = item.modeJimpitan || "-";
    document.getElementById("m_pemilik_kos").innerText = item.namaPemilikKos || "-";
    document.getElementById("m_alamat").innerText = `${item.noRumah}, ${item.alamat}`;

    const subTbody = document.getElementById("modalAnggotaTableBody");
    subTbody.innerHTML = "";

    if (item.anggota && Array.isArray(item.anggota)) {
        item.anggota.forEach(a => {
            const tr = document.createElement("tr");
            
            // Logika Link Preview File Berkas Foto (Base64)
            let linkBerkasDom = `<span style="color:var(--text-muted); font-style:italic;">Tidak Perlu</span>`;
            if (a.ktpBase64 && a.ktpBase64.trim() !== "") {
                linkBerkasDom = `<a href="${a.ktpBase64}" target="_blank" class="btn-view-file"><i class="fas fa-image"></i> Lihat Foto</a>`;
            }

            tr.innerHTML = `
                <td><strong>${a.nama || '-'}</strong></td>
                <td><small style="font-family:monospace; font-size:0.8rem;">${a.nik || '-'}</small></td>
                <td>${a.ttl || '-'}</td>
                <td>${a.jk || '-'}</td>
                <td>${a.agama || '-'}</td>
                <td>${a.pekerjaan || '-'}</td>
                <td><span style="font-weight:700; color:var(--primary);">${a.hubungan || '-'}</span></td>
                <td>${linkBerkasDom}</td>
            `;
            subTbody.appendChild(tr);
        });
    } else {
        subTbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:15px; color:var(--text-muted);">Tidak ada data anggota jiwa terdaftar.</td></tr>`;
    }

    document.getElementById("detailModalOverlay").style.display = "flex";
}

function tutupDetailModal() {
    document.getElementById("detailModalOverlay").style.display = "none";
}

// Menutup modal otomatis jika admin mengklik area luar box putih modal
window.onclick = function(event) {
    const modal = document.getElementById("detailModalOverlay");
    if (event.target === modal) {
        modal.style.display = "none";
    }
}
