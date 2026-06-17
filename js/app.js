import { db }
from "./firebase-config.js";

import {

collection,
addDoc,
serverTimestamp,
onSnapshot

}
from
"https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const colRef =
collection(
db,
"penghuni"
);

const form =
document.getElementById(
"formWarga"
);

const modal =
document.getElementById(
"modalTambah"
);

const btnTambah =
document.getElementById(
"btnTambah"
);

const btnClose =
document.getElementById(
"btnClose"
);

const listWarga =
document.getElementById(
"listWarga"
);

btnTambah.onclick=()=>{

    modal.classList.add(
    "show"
    );

};

btnClose.onclick=()=>{

    modal.classList.remove(
    "show"
    );

};
