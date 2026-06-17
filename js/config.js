import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";

import { getFirestore }
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

import { getAuth }
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

import { getStorage }
from "https://www.gstatic.com/firebasejs/12.15.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBZ31_bLqBiHY6VqHSza2qMuZqesp9-Cgg",
  authDomain: "sensus04.firebaseapp.com",
  projectId: "sensus04",
  storageBucket: "sensus04.firebasestorage.app",
  messagingSenderId: "538090009079",
  appId: "1:538090009079:web:932a4a812dd6de5fabfef2"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
