import { db } from "./config.js";

import {
    collection,
    addDoc,
    onSnapshot,
    serverTimestamp
}
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

const colRef = collection(db,"penghuni");

const form = document.getElementById("formWarga");
const listWarga = document.getElementById("listWarga");

const modal = document.getElementById("modalTambah");
const btnTambah = document.getElementById("btnTambah");
const btnClose = document.getElementById("btnClose");

/* =========================
   MODAL
========================= */

btnTambah.addEventListener("click",()=>{

    modal.classList.add("show");

});

btnClose.addEventListener("click",()=>{

    modal.classList.remove("show");

});

/* =========================
   SIMPAN DATA
========================= */

form.addEventListener("submit", async(e)=>{

    e.preventDefault();

    try{

        await addDoc(colRef,{

            nik:
            document.getElementById("nik").value,

            nama:
            document.getElementById("nama").value,

            jk:
            document.getElementById("jk").value,

            tgl_lahir:
            document.getElementById("tgl_lahir").value,

            hp:
            document.getElementById("hp").value,

            pekerjaan:
            document.getElementById("pekerjaan").value,

            alamat_ktp:
            document.getElementById("alamat_ktp").value,

            alamat_domisili:
            document.getElementById("alamat_domisili").value,

            status:
            document.getElementById("status").value,

            penanggung_jawab:
            document.getElementById("penanggung_jawab").value,

            tgl_masuk:
            document.getElementById("tgl_masuk").value,

            keterangan:
            document.getElementById("keterangan").value,

            createdAt:
            serverTimestamp()

        });

        alert("Data berhasil disimpan");

        form.reset();

        modal.classList.remove("show");

    }catch(err){

        console.error(err);

        alert(err.message);

    }

});

/* =========================
   TAMPILKAN DATA
========================= */

onSnapshot(colRef,(snapshot)=>{

    let html="";

    let total=0;
    let tetap=0;
    let kos=0;
    let kontrakan=0;
    let art=0;

    snapshot.forEach((doc)=>{

        const d = doc.data();

        total++;

        if(d.status==="Warga Tetap"){
            tetap++;
        }

        if(d.status==="Kos"){
            kos++;
        }

        if(d.status==="Kontrakan"){
            kontrakan++;
        }

        if(d.status==="ART"){
            art++;
        }

        let badgeClass="tetap";

        if(d.status==="Kos"){
            badgeClass="kos";
        }

        if(d.status==="Kontrakan"){
            badgeClass="kontrakan";
        }

        if(d.status==="ART"){
            badgeClass="art";
        }

        html += `

        <div class="glass-card warga-card">

            <div class="avatar">

                <i class="fas fa-user"></i>

            </div>

            <div class="warga-info">

                <h3>${d.nama || "-"}</h3>

                <p>NIK : ${d.nik || "-"}</p>

                <span class="badge ${badgeClass}">
                    ${d.status || "-"}
                </span>

            </div>

        </div>

        `;

    });

    listWarga.innerHTML = html;

    document.getElementById("totalWarga").innerText = total;
    document.getElementById("totalTetap").innerText = tetap;
    document.getElementById("totalKos").innerText = kos;
    document.getElementById("totalArt").innerText = art;

});
