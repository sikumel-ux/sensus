const GOOGLE_SCRIPT_API_URL = "https://script.google.com/macros/s/AKfycbzgrBGWquC3AXhjLC_GrzGBWEzX2pgTdHW9bP4fmf3hcb14Z6-Zc6ihj-w6ID3b8MT4Ag/exec";
const REDIRECT_THANK_YOU_URL = "done/index.html"; 
let rowCount = 0;

function sinkronisasiKategoriWargaAll() {
    const statusRumah = document.getElementById("status_rumah").value;
    const wrapperKos = document.getElementById("wrapperPemilikKos");
    const inputPemilik = document.getElementById("nama_pemilik_kos");
    const wrapperMess = document.getElementById("wrapperKhususMess");
    const inputTokoMess = document.getElementById("nama_toko_mess");
    const inputPemilikTokoMess = document.getElementById("nama_pemilik_toko_mess");
    
    const rowAdminKk = document.getElementById("rowAdministrasiKk");
    const wrapperKk = document.getElementById("wrapperKk");
    const wrapperJimpitan = document.getElementById("wrapperJimpitan");
    const inputKk = document.getElementById("no_kk");
    const infoNote = document.getElementById("infoNoteStatus");
    const wrapperKpHed = document.getElementById("wrapperKepalaKeluargaUtama");
    const inputKpHedNama = document.getElementById("nama_kepala_tetap");
    
    const wrapperNoRumah = document.getElementById("wrapperNoRumah");
    const inputNoRumah = document.getElementById("no_rumah");
    const wrapperWaUtama = document.getElementById("wrapperWaUtama");
    const inputWaUtama = document.getElementById("wa_utama");
    const labelWaUtama = document.getElementById("labelWaUtama");
    const rowNoRumahDanWa = document.getElementById("rowNoRumahDanWa");

    // Reset default grid layout
    rowNoRumahDanWa.style.display = "grid";

    if (statusRumah === "Kos") {
        rowAdminKk.style.display = "none";
        inputKk.removeAttribute("required"); inputKk.value = "";
        wrapperKos.style.display = "block";
        inputPemilik.setAttribute("required", "required");
        wrapperMess.style.display = "none";
        inputTokoMess.removeAttribute("required"); inputTokoMess.value = "";
        inputPemilikTokoMess.removeAttribute("required"); inputPemilikTokoMess.value = "";
        wrapperKpHed.style.display = "none";
        inputKpHedNama.removeAttribute("required"); inputKpHedNama.value = "";
        
        wrapperNoRumah.style.display = "flex";
        inputNoRumah.setAttribute("required", "required");
        wrapperWaUtama.style.display = "flex";
        inputWaUtama.setAttribute("required", "required");
        labelWaUtama.innerText = "No. WhatsApp";

        infoNote.innerHTML = `<i class="fas fa-info-circle" style="color: var(--teal);"></i> <strong>Sensus Kos:</strong> Seluruh penghuni kos wajib melampirkan berkas KTP asli & mengisi kolom tujuan menetap.`;
    } else if (statusRumah === "Mess") {
        rowAdminKk.style.display = "none";
        inputKk.removeAttribute("required"); inputKk.value = "";
        wrapperKos.style.display = "none";
        inputPemilik.removeAttribute("required"); inputPemilik.value = "";
        
        // Aktifkan field toko dan pemilik toko mess
        wrapperMess.style.display = "block";
        inputTokoMess.setAttribute("required", "required");
        inputPemilikTokoMess.setAttribute("required", "required");
        
        wrapperKpHed.style.display = "none";
        inputKpHedNama.removeAttribute("required"); inputKpHedNama.value = "";
        
        // HILANGKAN Nomor Rumah dan No WhatsApp Pengisi untuk Mess
        rowNoRumahDanWa.style.display = "none";
        inputNoRumah.removeAttribute("required"); inputNoRumah.value = "";
        inputWaUtama.removeAttribute("required"); inputWaUtama.value = "";

        infoNote.innerHTML = `<i class="fas fa-info-circle" style="color: var(--primary);"></i> <strong>Sensus Mess:</strong> Seluruh pekerja/karyawan toko wajib mengunggah foto KTP asli.`;
    } else if (statusRumah === "Sewa / Kontrak") {
        rowAdminKk.style.display = "grid";
        wrapperKk.style.display = "flex";
        wrapperJimpitan.style.display = "flex";
        inputKk.setAttribute("required", "required");
        wrapperKos.style.display = "none";
        inputPemilik.removeAttribute("required"); inputPemilik.value = "";
        wrapperMess.style.display = "none";
        inputTokoMess.removeAttribute("required"); inputTokoMess.value = "";
        inputPemilikTokoMess.removeAttribute("required"); inputPemilikTokoMess.value = "";
        wrapperKpHed.style.display = "block";
        inputKpHedNama.setAttribute("required", "required");
        
        wrapperNoRumah.style.display = "flex";
        inputNoRumah.setAttribute("required", "required");
        wrapperWaUtama.style.display = "flex";
        inputWaUtama.setAttribute("required", "required");
        labelWaUtama.innerText = "No. WhatsApp";

        infoNote.innerHTML = `<i class="fas fa-info-circle" style="color: var(--primary);"></i> <strong>Sensus Kontrak:</strong> Seluruh orang yang tinggal di rumah kontrakan wajib upload berkas KTP.`;
    } else {
        rowAdminKk.style.display = "grid";
        wrapperKk.style.display = "flex";
        wrapperJimpitan.style.display = "flex";
        inputKk.setAttribute("required", "required");
        wrapperKos.style.display = "none";
        inputPemilik.removeAttribute("required"); inputPemilik.value = "";
        wrapperMess.style.display = "none";
        inputTokoMess.removeAttribute("required"); inputTokoMess.value = "";
        inputPemilikTokoMess.removeAttribute("required"); inputPemilikTokoMess.value = "";
        wrapperKpHed.style.display = "block";
        inputKpHedNama.setAttribute("required", "required");
        
        wrapperNoRumah.style.display = "flex";
        inputNoRumah.setAttribute("required", "required");
        wrapperWaUtama.style.display = "flex";
        inputWaUtama.setAttribute("required", "required");
        labelWaUtama.innerText = "No. WhatsApp";

        infoNote.innerHTML = `<i class="fas fa-info-circle" style="color: var(--primary);"></i> <strong>Sensus Warga Tetap:</strong> Warga tetap tidak perlu mengunggah berkas KTP/KK.`;
    }

    const boxes = document.querySelectorAll(".warga-item-box");
    boxes.forEach((box) => {
        const selectNode = box.querySelector(".input-status");
        if (selectNode) {
            const currentId = selectNode.id.split("_")[1];
            evaluasiKewajibanKtpRow(selectNode, currentId);
        }
    });

    renumberAndRefreshDropdowns();
}

function renumberAndRefreshDropdowns() {
    const boxes = document.querySelectorAll(".warga-item-box");
    const statusRumah = document.getElementById("status_rumah").value;

    boxes.forEach((box, index) => {
        const isFirstRow = (index === 0);
        const selectNode = box.querySelector(".input-status");
        updateDropdownOpsiHubungan(selectNode, isFirstRow, statusRumah);
    });
}

function updateDropdownOpsiHubungan(selectElement, isFirstRow, statusRumah) {
    if (!selectElement) return;
    const valSebelumnya = selectElement.value;
    
    if (statusRumah === "Mess") {
        selectElement.innerHTML = `<option value="Karyawan">Karyawan</option>`;
        selectElement.value = "Karyawan";
        return;
    }
    
    if (isFirstRow) {
        if (statusRumah === "Kos" || statusRumah === "Sewa / Kontrak") {
            selectElement.innerHTML = `
                <option value="Diri Sendiri / Penghuni Utama">Penghuni Utama</option>
                <option value="Penghuni / Lainnya">Lainnya</option>
            `;
        } else {
            selectElement.innerHTML = `<option value="Kepala Keluarga">Kepala Keluarga</option>`;
        }
    } else {
        if (statusRumah === "Kos" || statusRumah === "Sewa / Kontrak") {
            selectElement.innerHTML = `
                <option value="Teman Kamar / Kontrakan">Teman Kamar / Kontrakan</option>
                <option value="Istri">Istri</option>
                <option value="Anak">Anak</option>
                <option value="Penghuni / Lainnya">Lainnya</option>
            `;
        } else {
            selectElement.innerHTML = `
                <option value="Istri">Istri</option>
                <option value="Anak">Anak</option>
                <option value="Cucu">Cucu</option>
                <option value="Mertua">Mertua</option>
                <option value="Penghuni / Lainnya">Lainnya</option>
            `;
        }
        if (selectElement.querySelector(`option[value="${valSebelumnya}"]`)) {
            selectElement.value = valSebelumnya;
        }
    }
}

function tambahWargaRow() {
    rowCount++;
    const container = document.getElementById("wargaListContainer");
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
                    <input type="text" class="form-control input-nik" inputmode="numeric" maxlength="16" oninput="this.value = this.value.replace(/[^0-9]/g, ''); cekPanjangNikLive(this, ${rowCount});" required>
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
                    <div class="select-wrapper">
                        <select class="form-control input-jk">
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Agama</label>
                    <div class="select-wrapper">
                        <select class="form-control input-agama">
                            <option value="Islam">Islam</option><option value="Kristen">Kristen</option><option value="Katolik">Katolik</option><option value="Hindu">Hindu</option><option value="Budha">Budha</option><option value="Konghucu">Konghucu</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="form-row-2">
                <div class="form-group"><label>Pekerjaan</label><input type="text" class="form-control input-pekerjaan" required></div>
                <div class="form-group">
                    <label>Status Perkawinan</label>
                    <div class="select-wrapper">
                        <select class="form-control input-kawin">
                            <option value="Belum Kawin">Belum Kawin</option>
                            <option value="Kawin">Kawin</option>
                            <option value="Cerai Hidup">Cerai Hidup</option>
                            <option value="Cerai Mati">Cerai Mati</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="form-row-2">
                <div class="form-group"><label>Status Alamat KTP</label>
                    <div class="select-wrapper">
                        <select class="form-control input-status-ktp">
                            <option value="RT 04">Warga RT 04</option>
                            <option value="Di Luar RT 04">Di Luar RT 04</option>
                        </select>
                    </div>
                </div>
                <div class="form-group"><label>Domisili Sekarang</label>
                    <div class="select-wrapper">
                        <select class="form-control input-domisili">
                            <option value="RT 04">Menetap di RT 04</option>
                            <option value="Di Luar RT 04">Di Luar RT 04</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="form-row-2">
                <div class="form-group" style="grid-column: span 2;">
                    <label>Hubungan / Status</label>
                    <div class="select-wrapper">
                        <select class="form-control input-status" id="statusHub_${rowCount}" onchange="evaluasiKewajibanKtpRow(this, ${rowCount})"></select>
                    </div>
                </div>
            </div>

            <div id="wrapperTujuanKos_${rowCount}" style="display:none; border-left: 3px solid var(--teal); padding-left:12px; margin: 4px 0;">
                <div class="form-grid">
                    <div class="form-group">
                        <label style="color:var(--teal)">Tujuan Tinggal</label>
                        <div class="select-wrapper">
                            <select class="form-control input-tujuan-kos" id="tujuanKosSelect_${rowCount}" onchange="evaluasiDetailTujuanKos(${rowCount})">
                                <option value="Kuliah">Kuliah</option>
                                <option value="Kerja">Kerja</option>
                                <option value="Sekolah">Sekolah</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-group" id="wrapperDetailTujuanKos_${rowCount}">
                        <label id="labelDetailTujuanKos_${rowCount}" style="color:var(--teal)">Nama Universitas / Kampus</label>
                        <input type="text" id="inputDetailTujuanKos_${rowCount}" class="form-control input-detail-tujuan-kos" placeholder="Contoh: Universitas Gadjah Mada">
                    </div>
                </div>
            </div>
            
            <div class="form-group" id="customStatusWrapper_${rowCount}" style="display:none;">
                <label style="color:var(--teal)">Lainnya</label>
                <input type="text" id="customStatusText_${rowCount}" class="form-control input-custom-status" placeholder="Contoh: Karyawan, Teman, Sepupu">
            </div>

            <div class="form-group" id="uploadWrapper_${rowCount}" style="display:none;">
                <label style="color:var(--primary)">Berkas Wajib Lampiran KTP</label>
                <div class="file-zone" id="fileZone_${rowCount}" onclick="document.getElementById('file_${rowCount}').click()">
                    <i class="fas fa-id-card"></i>
                    <p id="fileNameLabel_${rowCount}">Upload Foto KTP</p>
                    <input type="file" id="file_${rowCount}" class="input-file" accept="image/*" style="display:none;" onchange="prosesKonversiFileToBase64(this, ${rowCount})">
                    <input type="hidden" id="hiddenBase64_${rowCount}" class="input-hidden-base64">
                </div>
            </div>
        </div>`;
    container.appendChild(row);
    evaluasiKewajibanKtpRow(document.getElementById(`statusHub_${rowCount}`), rowCount);
    renumberAndRefreshDropdowns();
}

function evaluasiDetailTujuanKos(id) {
    const selectVal = document.getElementById(`tujuanKosSelect_${id}`).value;
    const labelNode = document.getElementById(`labelDetailTujuanKos_${id}`);
    const inputNode = document.getElementById(`inputDetailTujuanKos_${id}`);
    
    if (selectVal === "Kuliah") {
        labelNode.innerText = "Nama Universitas / Kampus";
        inputNode.placeholder = "Contoh: Universitas Gadjah Mada";
        inputNode.setAttribute("required", "required");
    } else if (selectVal === "Sekolah") {
        labelNode.innerText = "Nama Sekolah";
        inputNode.placeholder = "Contoh: SMA Negeri 1 Yogyakarta";
        inputNode.setAttribute("required", "required");
    } else if (selectVal === "Kerja") {
        labelNode.innerText = "Nama Perusahaan / Tempat Kerja";
        inputNode.placeholder = "Contoh: PT Sido Mundur";
        inputNode.setAttribute("required", "required");
    } else {
        labelNode.innerText = "Keterangan Tujuan Lainnya";
        inputNode.placeholder = "Tuliskan tujuan tinggal lainnya di sini...";
        inputNode.setAttribute("required", "required");
    }
}

function cekPanjangNikLive(input, id) {
    document.getElementById(`errorNik_${id}`).style.display = (input.value.length > 0 && input.value.length < 16) ? "block" : "none";
}

function hapusWargaRow(id) { 
    const rows = document.querySelectorAll(".warga-item-box");
    if(rows.length <= 1) { alert("Minimal harus ada 1 data penghuni!"); return; }
    const row = document.getElementById(`wargaRow_${id}`); 
    if (row) { row.remove(); renumberAndRefreshDropdowns(); } 
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
            lbl.innerText = `Terkunci: KTP Berhasil`;
        };
        reader.readAsDataURL(file);
    } else {
        hiddenInput.value = ""; zone.classList.remove("has-file"); lbl.innerText = "Upload Foto KTP";
    }
}

function evaluasiKewajibanKtpRow(select, id) {
    const wrapper = document.getElementById(`uploadWrapper_${id}`);
    const inputNode = document.getElementById('file_' + id);
    const customWrapper = document.getElementById(`customStatusWrapper_${id}`);
    const customInput = document.getElementById(`customStatusText_${id}`);
    const wrapperTujuanKos = document.getElementById(`wrapperTujuanKos_${id}`);
    const inputDetailKos = document.getElementById(`inputDetailTujuanKos_${id}`);
    
    if(!select || !wrapper || !inputNode || !customWrapper || !customInput || !wrapperTujuanKos) return;

    const statusRumah = document.getElementById("status_rumah").value;
    const hubungan = select.value;

    if (statusRumah === "Kos") {
        wrapperTujuanKos.style.display = "block";
        evaluasiDetailTujuanKos(id);
    } else {
        wrapperTujuanKos.style.display = "none";
        inputDetailKos.removeAttribute("required");
        inputDetailKos.value = "";
    }

    if (hubungan === "Penghuni / Lainnya") {
        customWrapper.style.display = "block";
        customInput.setAttribute("required", "required");
    } else {
        customWrapper.style.display = "none";
        customInput.removeAttribute("required"); customInput.value = "";
    }

    if(statusRumah === "Milik Sendiri") {
        wrapper.style.display = "none";
        inputNode.removeAttribute("required"); inputNode.value = "";
        document.getElementById(`hiddenBase64_${id}`).value = "";
    } else if(statusRumah === "Kos" || statusRumah === "Sewa / Kontrak" || statusRumah === "Mess") {
        wrapper.style.display = "block"; 
        inputNode.setAttribute("required", "required");
    } else {
        wrapper.style.display = "none"; 
        inputNode.removeAttribute("required"); inputNode.value = "";
        document.getElementById(`hiddenBase64_${id}`).value = "";
        document.getElementById(`fileZone_${id}`).classList.remove("has-file");
        document.getElementById(`fileNameLabel_${id}`).innerText = "Upload Foto KTP";
    }
}

function panggilErrorModal(judul, pesan) {
    const box = document.getElementById("alertBoxContent");
    box.innerHTML = `
        <div style="font-size:2.5rem; color:var(--accent-warn); margin-bottom:12px;"><i class="fas fa-triangle-exclamation"></i></div>
        <h3 style="color:var(--accent-warn); font-family:'Plus Jakarta Sans'; font-weight:700;">${judul}</h3>
        <p style="margin:8px 0 16px 0; color:var(--text-muted); font-size:0.85rem;">${pesan}</p>
        <button class="btn-modal-close" style="background:var(--accent-warn)" onclick="tutupModalOnly()">Perbaiki Form</button>`;
    document.getElementById("customAlertOverlay").style.display = "flex";
}

function tutupModalOnly() { document.getElementById("customAlertOverlay").style.display = "none"; }
function generateRandomCode() { return `04-${Math.floor(100000 + Math.random() * 900000)}`; }

function prosesKolektifKirimData(e) {
    e.preventDefault();
    const statusRumahValue = document.getElementById("status_rumah").value;
    const noKkField = document.getElementById("no_kk").value.trim();

    if(statusRumahValue !== "Kos" && statusRumahValue !== "Mess" && noKkField.length !== 16) { 
        alert("Nomor Kartu Keluarga wajib 16 digit!"); return; 
    }

    const chk = document.getElementById("chkPernyataan");
    if(!chk.checked) { alert("Anda wajib mencentang pernyataan kebenaran data!"); return; }

    let listNik = []; let payloadAnggota = []; let flagLolos = true;

    const rows = document.querySelectorAll(".warga-item-box");
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const id = row.id.split("_")[1];
        const nik = row.querySelector(".input-nik").value.trim();
        const nama = row.querySelector(".input-nama").value.trim();
        const hiddenBase64 = row.querySelector(".input-hidden-base64");
        const statusSelectValue = row.querySelector(".input-status").value;
        let hubunganFinal = statusSelectValue;
        
        if (statusSelectValue === "Penghuni / Lainnya") {
            const customText = document.getElementById(`customStatusText_${id}`).value.trim();
            hubunganFinal = customText ? `Lainnya (${customText})` : "Penghuni / Lainnya";
        }

        let tujuanKosFinal = "-";
        let tempatTujuanKosFinal = "-";
        if(statusRumahValue === "Kos") {
            tujuanKosFinal = document.getElementById(`tujuanKosSelect_${id}`).value;
            tempatTujuanKosFinal = document.getElementById(`inputDetailTujuanKos_${id}`).value.trim();
        }

        if(nik.length !== 16) { alert(`NIK untuk ${nama} belum 16 digit!`); flagLolos = false; break; }
        if(listNik.includes(nik)) { alert("Ada nomor NIK ganda di formulir pengisian!"); flagLolos = false; break; }
        listNik.push(nik);

        payloadAnggota.push({
            nama: nama, nik: nik, ttl: row.querySelector(".input-ttl").value,
            jk: row.querySelector(".input-jk").value, agama: row.querySelector(".input-agama").value,
            pekerjaan: row.querySelector(".input-pekerjaan").value, 
            statusKawin: row.querySelector(".input-kawin").value,
            statusKtp: row.querySelector(".input-status-ktp").value,
            domisili: row.querySelector(".input-domisili").value,
            hubungan: hubunganFinal,
            tujuanKos: tujuanKosFinal,
            tempatKos: tempatTujuanKosFinal,
            ktpBase64: hiddenBase64 ? hiddenBase64.value : ""
        });
    }

    if(!flagLolos) return;
    if(statusRumahValue === "Milik Sendiri" && payloadAnggota[0]) {
        document.getElementById("nama_kepala_tetap").value = payloadAnggota[0].nama;
    }

    const btn = document.getElementById("btnSubmitFinal");
    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Memvalidasi Keamanan Data...`;
    btn.setAttribute("disabled", "disabled");

    fetch(GOOGLE_SCRIPT_API_URL)
    .then(res => res.json())
    .then(database => {
        if (statusRumahValue !== "Kos" && statusRumahValue !== "Mess") {
            let kkSudahAda = database.some(item => item.noKk === "'" + noKkField || item.noKk === noKkField);
            if(kkSudahAda) {
                panggilErrorModal("No. KK Sudah Terdaftar", `Sensus ditolak. Kartu Keluarga No: <b>${noKkField}</b> sudah ada di sistem.`);
                netralkanTombolSubmit(btn); return;
            }
        }

        let nikTerduplikasi = null;
        for (let nikKandidat of listNik) {
            let adaNikDiDb = database.some(item => item.anggota && Array.isArray(item.anggota) && item.anggota.some(a => a.nik === nikKandidat || a.nik === "'" + nikKandidat));
            if (adaNikDiDb) { nikTerduplikasi = nikKandidat; break; }
        }

        if (nikTerduplikasi) {
            panggilErrorModal("NIK Sudah Terdaftar", `Sensus ditolak. NIK (<b>${nikTerduplikasi}</b>) terdeteksi sudah pernah mengisi data.`);
            netralkanTombolSubmit(btn); return;
        }

        const kodeRegistrasi = generateRandomCode();
        const modeJimpitanValue = (statusRumahValue === "Kos" || statusRumahValue === "Mess") ? "Bebas Jimpitan" : document.getElementById("mode_jimpitan").value;
        const waUtamaValue = (statusRumahValue === "Mess") ? "-" : document.getElementById("wa_utama").value;
        const noRumahValue = (statusRumahValue === "Mess") ? "-" : document.getElementById("no_rumah").value;

        const payloadSensus = {
            kode: kodeRegistrasi, noKk: (statusRumahValue === "Kos" || statusRumahValue === "Mess") ? "-" : noKkField,
            modeJimpitan: modeJimpitanValue, statusRumah: statusRumahValue, noRumah: noRumahValue,
            namaPemilikKos: (statusRumahValue === "Kos") ? document.getElementById("nama_pemilik_kos").value : "-",
            namaTokoMess: (statusRumahValue === "Mess") ? document.getElementById("nama_toko_mess").value : "-",
            hpBosMess: (statusRumahValue === "Mess") ? document.getElementById("nama_pemilik_toko_mess").value : "-", // Dipinjam sementara propertinya untuk Pemilik Toko
            waUtama: waUtamaValue, alamat: document.getElementById("alamat_rumah").value, anggota: payloadAnggota
        };

        btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Menyimpan...`;

        fetch(GOOGLE_SCRIPT_API_URL, {
            method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payloadSensus)
        })
        .then(() => {
            sessionStorage.setItem("sensus_success_data", JSON.stringify(payloadSensus));
            window.location.href = REDIRECT_THANK_YOU_URL;
        });
    })
    .catch(err => {
        netralkanTombolSubmit(btn);
        panggilErrorModal("Koneksi Terganggu", "Gagal memproses data: " + err.toString());
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
