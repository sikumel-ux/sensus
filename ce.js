/* ==========================
   APP.JS
========================== */

const form = document.getElementById("wargaForm");

const membersContainer =
document.getElementById("members");

const memberTemplate =
document.getElementById("memberTemplate");

const addMemberBtn =
document.getElementById("addMember");

const statusHunian =
document.getElementById("statusHunian");

const detailHunian =
document.getElementById("detailHunian");

const STORAGE_KEY =
"pendataan_warga_draft";

/* ==========================
   TAMBAH ANGGOTA
========================== */

function addMember(data = {}) {

    const clone =
    memberTemplate.content
    .cloneNode(true);

    const card =
    clone.querySelector(
        ".member-card"
    );

    const inputs =
    card.querySelectorAll(
        "input,select"
    );

    let i = 0;

    inputs.forEach(input => {

        if(data.values){

            input.value =
            data.values[i] || "";

        }

        i++;

    });

    const deleteBtn =
    card.querySelector(
        ".btn-delete"
    );

    deleteBtn.addEventListener(
        "click",
        () => {

            card.remove();

            saveDraft();

        }
    );

    inputs.forEach(el => {

        el.addEventListener(
            "input",
            saveDraft
        );

        el.addEventListener(
            "change",
            saveDraft
        );

    });

    membersContainer.appendChild(
        card
    );

    saveDraft();

}

addMemberBtn.addEventListener(
    "click",
    () => addMember()
);

/* ==========================
   DETAIL HUNIAN
========================== */

function renderDetailHunian() {

    const value =
    statusHunian.value;

    let html = "";

    if(
        value ===
        "Mess Toko / Perusahaan"
    ){

        html = `

        <div class="card">

            <h3>
            🏢 Data Mess
            </h3>

            <div class="grid">

                <div class="field">

                    <label>
                    Nama Toko
                    </label>

                    <input
                    type="text"
                    name="nama_toko">

                </div>

                <div class="field">

                    <label>
                    Penanggung Jawab
                    </label>

                    <input
                    type="text"
                    name="penanggung_jawab">

                </div>

                <div class="field">

                    <label>
                    No HP PJ
                    </label>

                    <input
                    type="tel"
                    name="hp_pj">

                </div>

            </div>

        </div>

        `;

    }

    if(
        value ===
        "Tinggal Dengan Majikan"
    ){

        html = `

        <div class="card">

            <h3>
            👔 Data Majikan
            </h3>

            <div class="grid">

                <div class="field">

                    <label>
                    Jenis Pekerjaan
                    </label>

                    <select
                    name="jenis_pekerjaan">

                        <option>
                        ART
                        </option>

                        <option>
                        Sopir
                        </option>

                        <option>
                        Satpam
                        </option>

                        <option>
                        Babysitter
                        </option>

                        <option>
                        Penjaga Rumah
                        </option>

                        <option>
                        Lainnya
                        </option>

                    </select>

                </div>

                <div class="field">

                    <label>
                    Nama Majikan
                    </label>

                    <input
                    type="text"
                    name="majikan">

                </div>

                <div class="field">

                    <label>
                    No HP Majikan
                    </label>

                    <input
                    type="tel"
                    name="hp_majikan">

                </div>

            </div>

        </div>

        `;

    }

    detailHunian.innerHTML =
    html;

    saveDraft();

}

statusHunian.addEventListener(
    "change",
    renderDetailHunian
);

/* ==========================
   SIMPAN DRAFT
========================== */

function saveDraft(){

    const data = {};

    const formFields =
    document.querySelectorAll(
        "input, textarea, select"
    );

    formFields.forEach(
        (field,index)=>{

            data[
                "field_" + index
            ] = field.value;

        }
    );

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
    );

}

/* ==========================
   LOAD DRAFT
========================== */

function loadDraft(){

    const saved =
    localStorage.getItem(
        STORAGE_KEY
    );

    if(!saved) return;

    const data =
    JSON.parse(saved);

    const fields =
    document.querySelectorAll(
        "input, textarea, select"
    );

    fields.forEach(
        (field,index)=>{

            const key =
            "field_" + index;

            if(data[key]){

                field.value =
                data[key];

            }

        }
    );

}

/* ==========================
   SIMPAN OTOMATIS
========================== */

document.addEventListener(
    "input",
    saveDraft
);

document.addEventListener(
    "change",
    saveDraft
);

/* ==========================
   SUBMIT FORM
========================== */

form.addEventListener(
    "submit",
    function(e){

        e.preventDefault();

        const result = {};

        const fields =
        document.querySelectorAll(
            "input, textarea, select"
        );

        fields.forEach(
            field => {

                const key =
                field.name ||
                field.placeholder ||
                field.type;

                result[key] =
                field.value;

            }
        );

        console.log(result);

        alert(
            "Data berhasil disimpan."
        );

        saveDraft();

    }
);

/* ==========================
   CEK NIK
========================== */

document.addEventListener(
    "input",
    function(e){

        const el =
        e.target;

        if(
            el.placeholder ===
            "16 digit NIK"
        ){

            el.value =
            el.value.replace(
                /[^0-9]/g,
                ""
            );

        }

    }
);

/* ==========================
   INISIALISASI
========================== */

window.addEventListener(
    "load",
    () => {

        addMember();

        loadDraft();

        renderDetailHunian();

    }
);

/* ==========================
   SERVICE WORKER
========================== */

if(
    "serviceWorker"
    in navigator
){

    window.addEventListener(
        "load",
        () => {

            navigator
            .serviceWorker
            .register(
                "sw.js"
            )
            .then(() => {

                console.log(
                "SW Registered"
                );

            })
            .catch(err => {

                console.error(
                err
                );

            });

        }
    );

}
