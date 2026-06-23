const members =
document.getElementById(
"members"
);

const addMember =
document.getElementById(
"addMember"
);

let count = 0;

function createMember(){

count++;

const div =
document.createElement("div");

div.className =
"member";

div.innerHTML = `

<h3>
👤 Anggota #${count}
</h3>

<div class="grid">

<div class="field">
<label>Nama</label>
<input type="text">
</div>

<div class="field">
<label>NIK</label>
<input type="text">
</div>

<div class="field">
<label>Hubungan</label>

<select>
<option>Kepala Keluarga</option>
<option>Istri</option>
<option>Anak</option>
<option>Orang Tua</option>
<option>Menantu</option>
<option>Cucu</option>
</select>

</div>

<div class="field">
<label>Pekerjaan</label>
<input type="text">
</div>

</div>

`;

members.appendChild(div);

}

addMember.addEventListener(
"click",
createMember
);

createMember();

const status =
document.getElementById(
"statusHunian"
);

const detail =
document.getElementById(
"detailHunian"
);

status.addEventListener(
"change",
function(){

let html = "";

if(
this.value ===
"Mess Toko / Perusahaan"
){

html = `

<div class="grid">

<div class="field">
<label>Nama Toko</label>
<input type="text">
</div>

<div class="field">
<label>Penanggung Jawab</label>
<input type="text">
</div>

</div>

`;

}

if(
this.value ===
"Tinggal Dengan Majikan"
){

html = `

<div class="grid">

<div class="field">
<label>Jenis</label>

<select>

<option>ART</option>
<option>Sopir</option>
<option>Satpam</option>
<option>Babysitter</option>
<option>Lainnya</option>

</select>

</div>

<div class="field">
<label>Nama Majikan</label>
<input type="text">
</div>

</div>

`;

}

detail.innerHTML = html;

}
);
