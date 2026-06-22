const GOOGLE_SCRIPT_API_URL = "https://script.google.com/macros/s/AKfycby-DpvqtWpu8FEVeudZYPms_0kc7jJyQ60BwiVJ9NlIxKcBzMbse9GcbBpjnorz94_wHg/exec";
        const REDIRECT_THANK_YOU_URL = "thanks/terimakasih.html"; 
        let rowCount = 0;

        function sinkronisasiKategoriWargaAll() {
            const statusRumah = document.getElementById("status_rumah").value;
            const wrapperKos = document.getElementById("wrapperPemilikKos");
            const inputPemilik = document.getElementById("nama_pemilik_kos");
            const wrapperMess = document.getElementById("wrapperMessAsrama");
            const inputTokoMess = document.getElementById("nama_toko_mess");
            const inputBosMess = document.getElementById("hp_bos_mess");
            const rowAdminKk = document.getElementById("rowAdministrasiKk");
            const inputKk = document.getElementById("no_kk");
            const infoNote = document.getElementById("infoNoteStatus");
            const wrapperKpHed = document.getElementById("wrapperKepalaKeluargaUtama");
            const inputKpHedNama = document.getElementById("nama_kepala_tetap");
            const inputKpHedFile = document.getElementById("file_kepala");

            if (statusRumah === "Kos") {
                rowAdminKk.style.display = "none";
                inputKk.removeAttribute("required");
                inputKk.value = "";
                
                wrapperKos.style.display = "block";
                inputPemilik.setAttribute("required", "required");

                wrapperMess.style.display = "none";
                inputTokoMess.removeAttribute("required");
                inputBosMess.removeAttribute("required");
                inputTokoMess.value = "";
                inputBosMess.value = "";
                
                wrapperKpHed.style.display = "none";
                inputKpHedNama.removeAttribute("required");
                inputKpHedFile.removeAttribute("required");
                
                infoNote.innerHTML = `<i class="fas fa-info-circle"></i> <b>Sensus Kos:</b> Seluruh penghuni kos yang didaftarkan wajib melampirkan berkas KTP asli.`;
            } else if (statusRumah === "Mess / Asrama") {
                rowAdminKk.style.display = "none";
                inputKk.removeAttribute("required");
                inputKk.value = "";
                
                wrapperKos.style.display = "none";
                inputPemilik.removeAttribute("required");
                inputPemilik.value = "";

                wrapperMess.style.display = "block";
                inputTokoMess.setAttribute("required", "required");
                inputBosMess.setAttribute("required", "required");
                
                wrapperKpHed.style.display = "none";
                inputKpHedNama.removeAttribute("required");
                inputKpHedFile.removeAttribute("required");
                
                infoNote.innerHTML = `<i class="fas fa-info-circle"></i> <b>Sensus Mess/Asrama:</b> Seluruh pekerja toko yang tinggal di mess wajib mengunggah foto KTP asli.`;
            } else if (statusRumah === "Sewa / Kontrak") {
                rowAdminKk.style.display = "grid";
                inputKk.setAttribute("required", "required");
                
                wrapperKos.style.display = "none";
                inputPemilik.removeAttribute("required");
                inputPemilik.value = "";

                wrapperMess.style.display = "none";
                inputTokoMess.removeAttribute("required");
                inputBosMess.removeAttribute("required");
                inputTokoMess.value = "";
                inputBosMess.value = "";
                
                wrapperKpHed.style.display = "none";
                inputKpHedNama.removeAttribute("required");
                inputKpHedFile.removeAttribute("required");

                infoNote.innerHTML = `<i class="fas fa-info-circle"></i> <b>Sensus Kontrak:</b> Seluruh orang yang tinggal di rumah kontrakan wajib upload berkas KTP.`;
            } else {
                rowAdminKk.style.display = "grid";
                inputKk.setAttribute("required", "required");
                
                wrapperKos.style.display = "none";
                inputPemilik.removeAttribute("required");
                inputPemilik.value = "";

                wrapperMess.style.display = "none";
                inputTokoMess.removeAttribute("required");
                inputBosMess.removeAttribute("required");
                inputTokoMess.value = "";
                inputBosMess.value = "";
                
                wrapperKpHed.style.display = "block";
                inputKpHedNama.setAttribute("required", "required");
                inputKpHedFile.setAttribute("required", "required");

                infoNote.innerHTML = `<i class="fas fa-info-circle"></i> <b>Sensus Warga Tetap:</b> Hanya Kepala Keluarga yang wajib upload KTP. Anggota keluarga inti tidak perlu.`;
            }

            renumberAndRefreshDropdowns();
        }

        function renumberAndRefreshDropdowns() {
            const boxes = document.querySelectorAll(".warga-item-box");
            const statusRumah = document.getElementById("status_rumah").value;

            boxes.forEach((box, index) => {
                const isFirstRow = (index === 0);
                const selectNode = box.querySelector(".input-status");
                const currentId = selectNode.id.split("_")[1];
                
                updateDropdownOpsiHubungan(selectNode, isFirstRow, statusRumah);
                evaluasiKewajibanKtpRow(selectNode, currentId);
            });
        }

        function updateDropdownOpsiHubungan(selectElement, isFirstRow, statusRumah) {
            const valSebelumnya = selectElement.value;
            
            // JIKA STATUS RUMAH ADALAH MESS / ASRAMA, SEMUA OTOMATIS KUNCI KE "KARYAWAN"
            if (statusRumah === "Mess / Asrama") {
                selectElement.innerHTML = `<option value="Karyawan">Karyawan</option>`;
                selectElement.value = "Karyawan";
                return;
            }
            
            if (isFirstRow) {
                if (statusRumah === "Kos" || statusRumah === "Sewa / Kontrak") {
                    selectElement.innerHTML = `
                        <option value="Diri Sendiri / Penghuni Utama">Penghuni Utama</option>
                        <option value="Penghuni / Lainnya">Penghuni / Lainnya</option>
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
                        <option value="Penghuni / Lainnya">Penghuni / Lainnya</option>
                    `;
                } else {
                    selectElement.innerHTML = `
                        <option value="Istri">Istri</option>
                        <option value="Anak">Anak</option>
                        <option value="Cucu">Cucu</option>
                        <option value="Mertua">Mertua</option>
                        <option value="ART/Sopir">ART / Sopir</option>
                        <option value="Penghuni / Lainnya">Penghuni / Lainnya</option>
                    `;
                }
                
                if (selectElement.querySelector(`option[value="${valSebelumnya}"]`)) {
                    selectElement.value = valSebelumnya;
                }
            }
        }

        function konversiKtpUtamaBase64(input) {
            const zone = document.getElementById("fileZone_Kepala");
            const lbl = document.getElementById("fileNameLabel_Kepala");
            const hidden = document.getElementById("hiddenBase64_Kepala");
            if (input.files && input.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    hidden.value = e.target.result;
                    zone.classList.add("has-file");
                    lbl.innerText = `✓ KTP Kepala Keluarga: ${input.files[0].name}`;
                };
                reader.readAsDataURL(input.files[0]);
            } else {
                hidden.value = ""; zone.classList.remove("has-file"); lbl.innerText = "Pilih Foto Kartu Keluarga";
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
                            <label>Hubungan / Status</label>
                            <select class="form-control input-status" id="statusHub_${rowCount}" onchange="evaluasiKewajibanKtpRow(this, ${rowCount})"></select>
                        </div>
                    </div>
                    
                    <div class="form-group custom-status-wrapper" id="customStatusWrapper_${rowCount}">
                        <label style="color:var(--teal)">Hubungan Spesifik (Tulis Sendiri)</label>
                        <input type="text" id="customStatusText_${rowCount}" class="form-control input-custom-status" placeholder="Contoh: Kakak Kandung, Keponakan, Teman">
                    </div>

                    <div class="form-group upload-box-wrapper" id="uploadWrapper_${rowCount}">
                        <label style="color:var(--primary)">Berkas Wajib Lampiran KTP</label>
                        <div class="file-zone" id="fileZone_${rowCount}" onclick="document.getElementById('file_${rowCount}').click()">
                            <i class="fas fa-id-card"></i>
                            <p id="fileNameLabel_${rowCount}" style="font-size:0.75rem;">Upload Foto KTP</p>
                            <input type="file" id="file_${rowCount}" class="input-file" accept="image/*" style="display:none;" onchange="prosesKonversiFileToBase64(this, ${rowCount})">
                            <input type="hidden" id="hiddenBase64_${rowCount}" class="input-hidden-base64">
                        </div>
                    </div>
                </div>`;
            container.appendChild(row);
            
            renumberAndRefreshDropdowns();
        }

        function cekPanjangNikLive(input, id) {
            document.getElementById(`errorNik_${id}`).style.display = (input.value.length > 0 && input.value.length < 16) ? "block" : "none";
        }

        function hapusWargaRow(id) { 
            const rows = document.querySelectorAll(".warga-item-box");
            if(rows.length <= 1) { 
                alert("Minimal harus ada 1 data penghuni utama yang diisi!"); 
                return; 
            }
            const row = document.getElementById(`wargaRow_${id}`); 
            if (row) {
                row.remove();
                renumberAndRefreshDropdowns();
            } 
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

        function evaluasiKewajibanKtpRow(select, id) {
            const wrapper = document.getElementById(`uploadWrapper_${id}`);
            const inputNode = document.getElementById('file_' + id);
            const customWrapper = document.getElementById(`customStatusWrapper_${id}`);
            const customInput = document.getElementById(`customStatusText_${id}`);
            
            if(!wrapper || !inputNode || !customWrapper || !customInput) return;

            const statusRumah = document.getElementById("status_rumah").value;
            const hubungan = select.value;

            if (hubungan === "Penghuni / Lainnya") {
                customWrapper.style.display = "block";
                customInput.setAttribute("required", "required");
            } else {
                customWrapper.style.display = "none";
                customInput.removeAttribute("required");
                customInput.value = "";
            }

            if(statusRumah === "Kos" || statusRumah === "Sewa / Kontrak" || statusRumah === "Mess / Asrama" || hubungan === "ART/Sopir" || hubungan === "Kepala Keluarga" || hubungan === "Karyawan") {
                if(statusRumah === "Milik Sendiri" && hubungan === "Kepala Keluarga") {
                    wrapper.style.display = "none";
                    inputNode.removeAttribute("required");
                } else {
                    wrapper.style.display = "block"; 
                    inputNode.setAttribute("required", "required");
                }
            } else {
                wrapper.style.display = "none"; 
                inputNode.removeAttribute("required"); 
                inputNode.value = "";
                document.getElementById(`hiddenBase64_${id}`).value = "";
                document.getElementById(`fileZone_${id}`).classList.remove("has-file");
                document.getElementById(`fileNameLabel_${id}`).innerText = "Upload Foto KTP";
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
            return `04-${digitAcak}`;
        }

        function prosesKolektifKirimData(e) {
            e.preventDefault();

            const statusRumahValue = document.getElementById("status_rumah").value;
            const noKkField = document.getElementById("no_kk").value.trim();

            if(statusRumahValue !== "Kos" && statusRumahValue !== "Mess / Asrama" && noKkField.length !== 16) { 
                alert("Nomor Kartu Keluarga wajib 16 digit!"); 
                return; 
            }

            const chk = document.getElementById("chkPernyataan");
            if(!chk.checked) { alert("Anda wajib mencentang pernyataan kebenaran data!"); return; }

            let listNik = []; 
            let payloadAnggota = []; 
            let flagLolos = true;

            let b64KepalaUtamaTtp = "";
            if(statusRumahValue === "Milik Sendiri") {
                b64KepalaUtamaTtp = document.getElementById("hiddenBase64_Kepala").value;
            }

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

                if(nik.length !== 16) { alert(`NIK untuk ${nama} belum 16 digit!`); flagLolos = false; break; }
                if(listNik.includes(nik)) { alert("Ada nomor NIK ganda di formulir pengisian!"); flagLolos = false; break; }
                listNik.push(nik);

                let ktpResult = hiddenBase64 ? hiddenBase64.value : "";
                if (i === 0 && statusRumahValue === "Milik Sendiri") {
                    ktpResult = b64KepalaUtamaTtp;
                }

                payloadAnggota.push({
                    nama: nama,
                    nik: nik,
                    ttl: row.querySelector(".input-ttl").value,
                    jk: row.querySelector(".input-jk").value,
                    agama: row.querySelector(".input-agama").value,
                    pekerjaan: row.querySelector(".input-pekerjaan").value,
                    hubungan: hubunganFinal,
                    ktpBase64: ktpResult
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
                if (statusRumahValue !== "Kos" && statusRumahValue !== "Mess / Asrama") {
                    let kkSudahAda = database.some(item => item.noKk === "'" + noKkField || item.noKk === noKkField);
                    if(kkSudahAda) {
                        panggilErrorModal("No. KK Sudah Terdaftar", `Sensus ditolak. Kartu Keluarga dengan No: <b>${noKkField}</b> terdeteksi sudah pernah digunakan.`);
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
                    panggilErrorModal("NIK Sudah Terdaftar", `Sensus ditolak. Terdapat NIK (<b>${nikTerduplikasi}</b>) yang sudah terdaftar.`);
                    netralkanTombolSubmit(btn);
                    return;
                }

                const kodeRegistrasi = generateRandomCode();
                const modeJimpitanValue = (statusRumahValue === "Kos" || statusRumahValue === "Mess / Asrama") ? "Bebas Jimpitan" : document.getElementById("mode_jimpitan").value;

                const payloadSensus = {
                    kode: kodeRegistrasi,
                    noKk: (statusRumahValue === "Kos" || statusRumahValue === "Mess / Asrama") ? "-" : noKkField,
                    modeJimpitan: modeJimpitanValue,
                    statusRumah: statusRumahValue,
                    noRumah: document.getElementById("no_rumah").value,
                    namaPemilikKos: (statusRumahValue === "Kos") ? document.getElementById("nama_pemilik_kos").value : "-",
                    namaTokoMess: (statusRumahValue === "Mess / Asrama") ? document.getElementById("nama_toko_mess").value : "-",
                    hpBosMess: (statusRumahValue === "Mess / Asrama") ? document.getElementById("hp_bos_mess").value : "-",
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
                    sessionStorage.setItem("sensus_success_data", JSON.stringify(payloadSensus));
                    window.location.href = REDIRECT_THANK_YOU_URL;
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
