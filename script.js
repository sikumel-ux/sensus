const GOOGLE_SCRIPT_API_URL = "https://script.google.com/macros/s/AKfycby-DpvqtWpu8FEVeudZYPms_0kc7jJyQ60BwiVJ9NlIxKcBzMbse9GcbBpjnorz94_wHg/exec";
let rowCount = 0;

function sinkronisasiKategoriWargaAll() {
    const statusRumah = document.getElementById("status_rumah").value;
    const wrapperKos = document.getElementById("wrapperPemilikKos");
    const inputPemilik = document.getElementById("nama_pemilik_kos");
    const wrapperJimpitan = document.getElementById("wrapperJimpitan");
    const wrapperKk = document.getElementById("wrapperKk");
    const inputKk = document.getElementById("no_kk");
    const infoNote = document.getElementById("infoNoteStatus");

    if (statusRumah === "Kos") {
        wrapperKos.style.display = "block";
        inputPemilik.setAttribute("required", "required");
        wrapperJimpitan.style.display = "none";
        wrapperKk.style.display = "none";
        inputKk.removeAttribute("required");
        inputKk.value = "";
        infoNote.innerHTML = `<i class="fas fa-info-circle"></i> <b>Sensus Kos:</b> Wajib kirim dokumen foto KTP asli & Bebas Jimpitan.`;
    } else if (statusRumah === "Sewa / Kontrak") {
        wrapperKos.style.display = "none";
        inputPemilik.removeAttribute("required");
        inputPemilik.value = "";
        wrapperJimpitan.style.display = "block";
        wrapperKk.style.display = "block";
        inputKk.setAttribute("required", "required");
        infoNote.innerHTML = `<i class="fas fa-info-circle"></i> <b>Sensus Kontrak:</b> Wajib kirim dokumen foto KTP asli & Wajib Jimpitan lingkungan.`;
    } else {
        wrapperKos.style.display = "none";
        inputPemilik.removeAttribute("required");
        inputPemilik.value = "";
        wrapperJimpitan.style.display = "block";
        wrapperKk.style.display = "block";
        inputKk.setAttribute("required", "required");
        infoNote.innerHTML = `<i class="fas fa-info-circle"></i> <b>Sensus Warga Tetap:</b> Wajib mengisi nomor KK & Anggota Keluarga (Bebas berkas KTP).`;
    }

    document.querySelectorAll(".input-status").forEach(selectNode => {
        const currentId = selectNode.id.split("_")[1];
        updateDropdownOpsiHubungan(selectNode, statusRumah);
        evaluasiKewajibanKtp(selectNode, currentId);
    });
}

function updateDropdownOpsiHubungan(selectElement, statusHunian) {
    const valSebelumnya = selectElement.value;
    if (statusHunian === "Kos") {
        selectElement.innerHTML = `<option value="Anak Kos">Kos</option>`;
    } else if (statusHunian === "Sewa / Kontrak") {
        selectElement.innerHTML = `
            <option value="Kontrakan">Penyewa Rumah</option>
            <option value="ART/Sopir">ART Tinggal Dalam</option>
        `;
    } else {
        selectElement.innerHTML = `
            <option value="Kepala Keluarga">Kepala Keluarga</option>
            <option value="Istri">Istri</option>
            <option value="Anak">Anak</option>
            <option value="Cucu">Cucu</option>
            <option value="Mertua">Mertua</option>
            <option value="Lainnya">Lainnya</option>
        `;
    }
    if (selectElement.querySelector(`option[value="${valSebelumnya}"]`)) {
        selectElement.value = valSebelumnya;
    }
}

function tambahWargaRow() {
    rowCount++;
    const container = document.getElementById("wargaListContainer");
    const statusRumah = document.getElementById("status_rumah").value;
    const row = document.createElement("div");
    row.className = "warga-item-box";
    row.id = `wargaRow_${rowCount}`;
    
    row.innerHTML = `
        <button type="button" class="btn-delete-row" onclick="hapusWargaRow(${rowCount})">Hapus</button>
        <div class="form-grid">
            <div class="form-row-2">
                <div class="form-group"><label>Nama Lengkap</label><input type="text" class="form-control input-nama" required></div>
                <div class="form-group">
                    <label>NIK (16 Digit)</label>
                    <input type="text" class="form-control input-nik font-data" inputmode="numeric" maxlength="16" oninput="this.value = this.value.replace(/[^0-9]/g, ''); cekPanjangNikLive(this, ${rowCount});" required>
                    <div id="errorNik_${rowCount}" class="error-hint">NIK wajib 16 angka!</div>
                </div>
            </div>
            <div class="form-group">
                <label>Tempat Tanggal Lahir</label>
                <input type="text" class="form-control input-ttl" placeholder="Contoh: Bantul, 17 Agustus 1997" required>
            </div>
            <div class="form-row-2">
                <div class="form-group">
                    <label>Jenis Kelamin</label>
                    <select class="form-control input-jk">
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Agama</label>
                    <select class="form-control input-agama">
                        <option value="Islam">Islam</option><option value="Kristen">Kristen</option><option value="Katolik">Katolik</option><option value="Hindu">Hindu</option><option value="Budha">Budha</option><option value="Konghucu">Konghucu</option>
                    </select>
                </div>
            </div>
            <div class="form-row-2">
                <div class="form-group"><label>Pekerjaan</label><input type="text" class="form-control input-pekerjaan" required></div>
                <div class="form-group">
                    <label>Hubungan Keluarga</label>
                    <select class="form-control input-status" id="statusHub_${rowCount}" onchange="evaluasiKewajibanKtp(this, ${rowCount})"></select>
                </div>
            </div>
            <div class="form-group upload-box-wrapper" id="uploadWrapper_${rowCount}">
                <label style="color:var(--primary)">Berkas Wajib Lampiran KTP/Foto</label>
                <div class="file-zone" id="fileZone_${rowCount}" onclick="document.getElementById('file_${rowCount}').click()">
                    <i class="fas fa-id-card"></i>
                    <p id="fileNameLabel_${rowCount}" style="font-size:0.75rem;">Upload Foto KTP</p>
                    <input type="file" id="file_${rowCount}" class="input-file" accept="image/*" style="display:none;" onchange="prosesKonversiFileToBase64(this, ${rowCount})">
                    <input type="hidden" id="hiddenBase64_${rowCount}" class="input-hidden-base64">
                </div>
            </div>
        </div>`;
    container.appendChild(row);
    
    const selectEl = document.getElementById(`statusHub_${rowCount}`);
    updateDropdownOpsiHubungan(selectEl, statusRumah);
    evaluasiKewajibanKtp(selectEl, rowCount);
}

function cekPanjangNikLive(input, id) {
    document.getElementById(`errorNik_${id}`).style.display = (input.value.length > 0 && input.value.length < 16) ? "block" : "none";
}

function hapusWargaRow(id) { 
    const rows = document.querySelectorAll(".warga-item-box");
    if(rows.length <= 1) { alert("Minimal harus ada 1 data warga yang diisi!"); return; }
    const row = document.getElementById(`wargaRow_${id}`); 
    if (row) row.remove(); 
}

function prosesKonversiFileToBase64(input, id) {
    const zone = document.getElementById(`fileZone_${id}`);
    const lbl = document.getElementById(`fileNameLabel_${id}`);
    const hiddenInput = document.getElementById(`hiddenBase64_${id}`);
    
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            hiddenInput.value = e.target.result;
            zone.classList.add("has-file");
            lbl.innerText = `✓ Terkunci: ${file.name}`;
        };
        reader.readAsDataURL(file);
    } else {
        hiddenInput.value = ""; zone.classList.remove("has-file"); lbl.innerText = "Upload Foto KTP";
    }
}

function evaluasiKewajibanKtp(select, id) {
    const wrapper = document.getElementById(`uploadWrapper_${id}`);
    const inputNode = document.getElementById('file_' + id);
    if(!wrapper || !inputNode) return;

    const statusRumah = document.getElementById("status_rumah").value;

    if(statusRumah === "Kos" || statusRumah === "Sewa / Kontrak") {
        wrapper.style.display = "block"; inputNode.setAttribute("required", "required");
    } else {
        wrapper.style.display = "none"; inputNode.removeAttribute("required"); inputNode.value = "";
        document.getElementById('hiddenBase64_' + id).value = "";
        document.getElementById('fileZone_' + id).classList.remove("has-file");
        document.getElementById('fileNameLabel_' + id).innerText = "Upload Foto KTP";
    }
}

function panggilErrorModal(judul, pesan) {
    const box = document.getElementById("alertBoxContent");
    box.innerHTML = `
        <div style="font-size:2.5rem; color:var(--accent-warn); margin-bottom:12px;"><i class="fas fa-triangle-exclamation"></i></div>
        <h3 style="color:var(--accent-warn)">${judul}</h3><p style="margin:8px 0; color:var(--text-muted);">${pesan}</p>
        <button class="btn-modal-close" style="background:var(--accent-warn)" onclick="tutupModalOnly()">Perbaiki Form</button>`;
    document.getElementById("customAlertOverlay").style.display = "flex";
}

function tutupModalOnly() { document.getElementById("customAlertOverlay").style.display = "none"; }

function generateRandomCode() {
    const digitAcak = Math.floor(100000 + Math.random() * 900000);
    return '04-' + digitAcak;
}

function prosesKolektifKirimData(e) {
    e.preventDefault();

    const statusRumahValue = document.getElementById("status_rumah").value;
    const noKkField = document.getElementById("no_kk").value.trim();

    if(statusRumahValue !== "Kos" && noKkField.length !== 16) { 
        alert("Nomor Kartu Keluarga wajib 16 digit!"); 
        return; 
    }

    const chk = document.getElementById("chkPernyataan");
    if(!chk.checked) { alert("Anda wajib mencentang pernyataan kebenaran data!"); return; }

    const rows = document.querySelectorAll(".warga-item-box");
    let listNik = []; let payloadAnggota = []; let flagLolos = true;

    for (let row of rows) {
        const nik = row.querySelector(".input-nik").value.trim();
        const nama = row.querySelector(".input-nama").value.trim();
        const hiddenBase64 = row.querySelector(".input-hidden-base64");

        if(nik.length !== 16) { alert(`NIK untuk ${nama} belum 16 digit!`); flagLolos = false; break; }
        if(listNik.includes(nik)) { alert("Ada nomor NIK ganda di formulir pengisian!"); flagLolos = false; break; }
        listNik.push(nik);

        payloadAnggota.push({
            nama: nama,
            nik: nik,
            ttl: row.querySelector(".input-ttl").value,
            jk: row.querySelector(".input-jk").value,
            agama: row.querySelector(".input-agama").value,
            pekerjaan: row.querySelector(".input-pekerjaan").value,
            hubungan: row.querySelector(".input-status").value,
            ktpBase64: hiddenBase64 ? hiddenBase64.value : ""
        });
    }

    if(!flagLolos) return;

    const btn = document.getElementById("btnSubmitFinal");
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Memvalidasi Keamanan Data...`;
    btn.setAttribute("disabled", "disabled");

    fetch(GOOGLE_SCRIPT_API_URL)
    .then(res => res.json())
    .then(database => {
        if (statusRumahValue !== "Kos") {
            let kkSudahAda = database.some(item => item.noKk === "'" + noKkField || item.noKk === noKkField);
            if(kkSudahAda) {
                panggilErrorModal("No. KK Sudah Terdaftar", `Sensus ditolak. Kartu Keluarga dengan No: <b>${noKkField}</b> terdeteksi sudah pernah digunakan untuk mengisi sensus sebelumnya.`);
                netralkanTombolSubmit(btn);
                return;
            }
        }

        let nikTerduplikasi = null;
        for (let nikKandidat of listNik) {
            let adaNikDiDb = database.some(item => {
                if (item.anggota && Array.isArray(item.anggota)) {
                    return item.anggota.some(a => a.nik === nikKandidat || a.nik === "'" + nikKandidat);
                }
                return false;
            });
            if (adaNikDiDb) {
                nikTerduplikasi = nikKandidat;
                break;
            }
        }

        if (nikTerduplikasi) {
            panggilErrorModal("NIK Sudah Terdaftar", `Sensus ditolak. Terdapat NIK (<b>${nikTerduplikasi}</b>) yang terdeteksi sudah pernah terdaftar di sistem database RT 04.`);
            netralkanTombolSubmit(btn);
            return;
        }

        const kodeRegistrasi = generateRandomCode();
        const modeJimpitanValue = (statusRumahValue === "Kos") ? "Bebas Jimpitan" : document.getElementById("mode_jimpitan").value;

        const payloadSensus = {
            kode: kodeRegistrasi,
            noKk: (statusRumahValue === "Kos") ? "-" : noKkField,
            modeJimpitan: modeJimpitanValue,
            statusRumah: statusRumahValue,
            noRumah: document.getElementById("no_rumah").value,
            namaPemilikKos: document.getElementById("nama_pemilik_kos").value || "-",
            waUtama: document.getElementById("wa_utama").value,
            alamat: document.getElementById("alamat_rumah").value,
            anggota: payloadAnggota
        };

        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Menyimpan...`;

        fetch(GOOGLE_SCRIPT_API_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payloadSensus)
        })
        .then(() => {
            netralkanTombolSubmit(btn);
            localStorage.setItem('sensus_terakhir', JSON.stringify(payloadSensus));
            window.location.href = "terimakasih/?id=" + kodeRegistrasi;
        });
    })
    .catch(err => {
        netralkanTombolSubmit(btn);
        panggilErrorModal("Koneksi Terganggu", "Gagal memproses sinkronisasi data: " + err.toString());
    });
}

function netralkanTombolSubmit(btn) {
    btn.innerHTML = `<i class="fas fa-cloud-arrow-up"></i> Kirimkan`;
    btn.removeAttribute("disabled");
}

window.onload = function() { 
    tambahWargaRow(); 
    sinkronisasiKategoriWargaAll();
};
