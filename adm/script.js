const GOOGLE_SCRIPT_API_URL = "https://script.google.com/macros/s/AKfycby-DpvqtWpu8FEVeudZYPms_0kc7jJyQ60BwiVJ9NlIxKcBzMbse9GcbBpjnorz94_wHg/exec";

let RAW_DATA_WARGA = []; 
let KELOMPOK_RUMAH_MAP = {}; 
let currentFilter = "All";
let selectedHouseCode = null;

function hitungKalkulasiStatistik(data) {
    let totalJiwa = data.length;
    let kumpulanKkUnik = new Set();
    let countTetap = 0;
    let countSewaKontrak = 0;
    let countKos = 0;

    data.forEach(warga => {
        let kkBersih = warga.noKk ? warga.noKk.toString().replace(/'/g, "").trim() : "";
        if(kkBersih && kkBersih !== "-") kumpulanKkUnik.add(kkBersih);

        let statusRumah = warga.statusRumah || warga["Status Rumah"] || "";
        let statusBersih = statusRumah.toString().toLowerCase().replace(/\s+/g, '');

        if (statusBersih === "miliksendiri" || statusBersih === "tetap") {
            countTetap++;
        } else if (statusBersih === "sewa" || statusBersih === "kontrak" || statusBersih.includes("sewa/") || statusBersih.includes("/kontrak") || statusBersih === "sewakontrak") {
            countSewaKontrak++;
        } else if (statusBersih === "kos") {
            countKos++;
        }
    });

    document.getElementById("cnt_totalJiwa").innerText = totalJiwa;
    document.getElementById("cnt_totalKk").innerText = kumpulanKkUnik.size;
    document.getElementById("cnt_wargaTetap").innerText = countTetap;
    document.getElementById("cnt_wargaSewa").innerText = countSewaKontrak;
    document.getElementById("cnt_wargaKos").innerText = countKos;
}

function muatDataSensus() {
    const loading = document.getElementById("loadingState");
    const table = document.getElementById("adminTable");
    const tbody = document.getElementById("sensusTableBody");
    
    loading.style.display = "block";
    table.style.display = "none";
    tbody.innerHTML = "";

    fetch(GOOGLE_SCRIPT_API_URL)
    .then(res => res.json())
    .then(data => {
        loading.style.display = "none";
        table.style.display = "block";
        
        RAW_DATA_WARGA = data;
        hitungKalkulasiStatistik(data);
        prosesPengelompokanKeluarga(data);
        renderMainTable("All");
    })
    .catch(err => {
        loading.innerHTML = `<i class="fas fa-exclamation-circle" style="color:var(--accent-warn)"></i><p style="margin-top:10px;">Gagal memuat database</p>`;
    });
}

function prosesPengelompokanKeluarga(data) {
    KELOMPOK_RUMAH_MAP = {};
    
    data.forEach(warga => {
        let statusAsli = warga.statusRumah || warga["Status Rumah"] || "-";
        let statusBersih = statusAsli.toString().toLowerCase().replace(/\s+/g, '');
        
        if(statusBersih === "sewa" || statusBersih === "kontrak" || statusBersih.includes("sewa/") || statusBersih.includes("/kontrak") || statusBersih === "sewakontrak") {
            statusAsli = "Sewa/Kontrak";
        } else if (statusBersih === "miliksendiri" || statusBersih === "tetap") {
            statusAsli = "Milik Sendiri";
        } else if (statusBersih === "kos") {
            statusAsli = "Kos";
        }

        let groupKey = `${warga.noRumah || 'TanpaNo'}_${warga.noKk || 'TanpaKK'}`;
        
        if (!KELOMPOK_RUMAH_MAP[groupKey]) {
            KELOMPOK_RUMAH_MAP[groupKey] = {
                noKk: warga.noKk || "-",
                noRumah: warga.noRumah || "-",
                statusRumah: statusAsli,
                modeJimpitan: warga.modeJimpitan || "-",
                waUtama: warga.waUtama || "-",
                namaPemilikKos: warga.namaPemilikKos || "-",
                linkFoto: warga.linkFoto || "-",
                kepalaKeluarga: "-", 
                anggotaKeluarga: []
            };
        }
        
        let hub = warga.hubungan ? warga.hubungan.toLowerCase() : "";
        if (hub.includes("kepala") || hub.includes("diri sendiri") || hub.includes("utama") || KELOMPOK_RUMAH_MAP[groupKey].kepalaKeluarga === "-") {
            if(KELOMPOK_RUMAH_MAP[groupKey].kepalaKeluarga === "-" || hub.includes("kepala")){
                KELOMPOK_RUMAH_MAP[groupKey].kepalaKeluarga = warga.namaLengkap;
            }
        }
        
        KELOMPOK_RUMAH_MAP[groupKey].anggotaKeluarga.push(warga);
    });
}

function renderMainTable(filter = "All") {
    const tbody = document.getElementById("sensusTableBody");
    tbody.innerHTML = "";

    Object.keys(KELOMPOK_RUMAH_MAP).forEach(key => {
        const rumah = KELOMPOK_RUMAH_MAP[key];
        
        if (filter !== "All" && rumah.statusRumah !== filter) return;

        const waHtml = (rumah.waUtama && rumah.waUtama !== "-")
            ? `<a href="https://wa.me/${rumah.waUtama.replace(/[^0-9]/g, '')}" target="_blank" class="btn-wa"><i class="fab fa-whatsapp"></i> ${rumah.waUtama}</a>`
            : `<span style="color:var(--text-muted)">-</span>`;

        const linkFotoHtml = (rumah.linkFoto && rumah.linkFoto !== "-") 
            ? `<a href="${rumah.linkFoto}" target="_blank" class="btn-foto"><i class="fas fa-image"></i> Lihat KTP</a>` 
            : `<span style="color:var(--text-muted)">-</span>`;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><span class="clickable-name" onclick="bukaModalDetail('${key}')">${rumah.kepalaKeluarga}</span></td>
            <td><span class="badge" style="background:#F1F5F9; color:var(--text-main); border:1px solid var(--border);">${rumah.statusRumah}</span></td>
            <td>${waHtml}</td>
            <td>${linkFotoHtml}</td>
        `;
        tbody.appendChild(tr);
    });
}

function filterStatus(status, buttonElement) {
    currentFilter = status;
    document.querySelectorAll(".btn-filter").forEach(btn => btn.classList.remove("active"));
    buttonElement.classList.add("active");
    renderMainTable(status);
}

function renderTabelPopUpSaja(anggotaKeluarga) {
    document.getElementById("modalWargaTable").classList.remove("pdf-mode");
    document.getElementById("modalWargaTableHeader").innerHTML = `
        <tr>
            <th>Nama Lengkap</th>
            <th>NIK</th>
            <th>Hubungan Keluarga</th>
        </tr>
    `;
    
    const innerTbody = document.getElementById("modalWargaTableBody");
    innerTbody.innerHTML = "";

    anggotaKeluarga.forEach(ang => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><b>${ang.namaLengkap || '-'}</b></td>
            <td><code style="color:var(--text-main); font-weight:500;">${ang.nik || '-'}</code></td>
            <td><span class="badge badge-hub">${ang.hubungan || '-'}</span></td>
        `;
        innerTbody.appendChild(tr);
    });
}

function bukaModalDetail(groupKey) {
    const rumah = KELOMPOK_RUMAH_MAP[groupKey];
    if (!rumah) return;

    selectedHouseCode = groupKey;
    document.getElementById("pdfTanggalCetak").innerText = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

    let metaHtml = `
        <div class="meta-item"><span>Nama Kepala Keluarga / Penghuni Utama:</span> <strong>${rumah.kepalaKeluarga}</strong></div>
        <div class="meta-item"><span>Status Hunian:</span> <strong>${rumah.statusRumah}</strong></div>
        <div class="meta-item"><span>No. Kartu Keluarga (KK):</span> <strong>${rumah.noKk}</strong></div>
        <div class="meta-item"><span>No. Rumah:</span> <strong>No. ${rumah.noRumah}</strong></div>
        <div class="meta-item"><span>No. WhatsApp Utama:</span> <strong>${rumah.waUtama}</strong></div>
        <div class="meta-item"><span>Sistem / Mode Jimpitan:</span> <strong>${rumah.modeJimpitan}</strong></div>
    `;

    document.getElementById("modalMetaInfo").innerHTML = metaHtml;
    renderTabelPopUpSaja(rumah.anggotaKeluarga);
    document.getElementById("detailModalOverlay").style.display = "flex";
}

function tutupModalDetail() {
    document.getElementById("detailModalOverlay").style.display = "none";
    selectedHouseCode = null;
}

function eksporKePdfEksternal() {
    if(!selectedHouseCode) return;
    const rumah = KELOMPOK_RUMAH_MAP[selectedHouseCode];
    
    const tabelWarga = document.getElementById("modalWargaTable");
    tabelWarga.classList.add("pdf-mode");
    
    document.getElementById("modalWargaTableHeader").innerHTML = `
        <tr>
            <th>Nama Lengkap</th>
            <th>NIK</th>
            <th>Tempat Tgl Lahir</th>
            <th>Jenis Kelamin</th>
            <th>Agama</th>
            <th>Pekerjaan</th>
            <th>Hubungan</th>
        </tr>
    `;
    
    const innerTbody = document.getElementById("modalWargaTableBody");
    innerTbody.innerHTML = "";

    rumah.anggotaKeluarga.forEach(ang => {
        const jk = ang["Jenis Kelamin"] || ang["jenisKelamin"] || ang["JenisKelamin"] || ang["jenis_kelamin"] || ang["JK"] || ang["jk"] || "-";
        const ttl = ang["Tempat Tanggal Lahir"] || ang["Tempat Tgl Lahir"] || ang["tempatTanggalLahir"] || ang["ttl"] || ang["TTL"] || "-";
        const agama = ang["Agama"] || ang["agama"] || "-";
        const kerja = ang["Pekerjaan"] || ang["pekerjaan"] || "-";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><b>${ang.namaLengkap || '-'}</b></td>
            <td><code>${ang.nik || '-'}</code></td>
            <td>${ttl}</td>
            <td>${jk}</td>
            <td>${agama}</td>
            <td>${kerja}</td>
            <td><span class="badge badge-hub" style="font-size:0.65rem; padding:2px 4px;">${ang.hubungan || '-'}</span></td>
        `;
        innerTbody.appendChild(tr);
    });

    const element = document.getElementById('pdfPrintArea');
    const namaFile = `Arsip_Sensus_RT04_No_${rumah.noRumah}_${rumah.kepalaKeluarga.replace(/\s+/g, '_')}.pdf`;
    
    const opsiKonfigurasi = {
        margin:       10, 
        filename:     namaFile,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2.5, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opsiKonfigurasi).from(element).save().then(() => {
        renderTabelPopUpSaja(rumah.anggotaKeluarga);
    });
}

window.onload = muatDataSensus;
