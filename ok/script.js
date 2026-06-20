function muatRingkasanDariLocalStorage() {
    const urlParams = new URLSearchParams(window.location.search);
    const kodeReg = urlParams.get('id');
    if (kodeReg) {
        document.getElementById("displayKodeReg").innerText = kodeReg;
    }

    const localDataRaw = localStorage.getItem('sensus_terakhir');

    if (localDataRaw) {
        try {
            const dataSensus = JSON.parse(localDataRaw);

            document.getElementById("res_status").innerText = dataSensus.statusRumah || "-";
            document.getElementById("res_kk").innerText = dataSensus.noKk || "-";
            document.getElementById("res_rumah").innerText = dataSensus.noRumah || "-";
            document.getElementById("res_wa").innerText = dataSensus.waUtama || "-";
            document.getElementById("res_alamat").innerText = dataSensus.alamat || "-";

            const containerWarga = document.getElementById("containerDaftarWarga");
            containerWarga.innerHTML = "";

            if (dataSensus.anggota && dataSensus.anggota.length > 0) {
                dataSensus.anggota.forEach((warga, idx) => {
                    const itemHtml = `
                        <div class="warga-review-item">
                            <div class="warga-nama-title">
                                #${idx + 1} ${warga.nama} (${warga.hubungan})
                            </div>
                            <div class="data-row">
                                <div class="data-label">NIK</div><div>:</div><div class="data-value font-mono">${warga.nik}</div>
                            </div>
                            <div class="data-row">
                                <div class="data-label">Pekerjaan</div><div>:</div><div class="data-value">${warga.pekerjaan || "-"}</div>
                            </div>
                        </div>
                    `;
                    containerWarga.insertAdjacentHTML('beforeend', itemHtml);
                });
            } else {
                containerWarga.innerHTML = "<p style='color:var(--text-muted); font-size:0.8rem;'>Tidak ada data anggota keluarga.</p>";
            }

        } catch (e) {
            console.error("Gagal membaca struktur JSON:", e);
            TampilkanPesanSistemKosong();
        }
    } else {
        TampilkanPesanSistemKosong();
    }
}

function TampilkanPesanSistemKosong() {
    document.getElementById("ringkasanData").innerHTML = `
        <p style='color:var(--text-muted); font-size:0.85rem; text-align:center; padding: 20px 0;'>
            Ringkasan data telah dibersihkan demi keamanan browser. Bukti simpan Anda sah menggunakan Kode Registrasi di atas.
        </p>
    `;
}

function kembaliKeFormUtama() {
    localStorage.removeItem('sensus_terakhir');
    window.location.href = "../";
}

window.onload = muatRingkasanDariLocalStorage;
