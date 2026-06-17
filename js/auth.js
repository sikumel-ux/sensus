import { auth }
from "./firebase-config.js";

import {

GoogleAuthProvider,
signInWithPopup,
onAuthStateChanged,
signOut

}
from
"https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

const provider =
new GoogleAuthProvider();

window.loginGoogle =
async ()=>{

    try{

        await signInWithPopup(
        auth,
        provider
        );

    }catch(err){

        alert(err.message);

    }

};

window.logout =
async ()=>{

    await signOut(auth);

};

onAuthStateChanged(
auth,
(user)=>{

    if(user){

        console.log(
        "Login:",
        user.displayName
        );

    }else{

        console.log(
        "Belum Login"
        );

    }

});
