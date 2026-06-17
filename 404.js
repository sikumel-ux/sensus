// 1. SETUP EVENT LISTENERS SAAT DOM SIAP
document.addEventListener("DOMContentLoaded", () => {
    const btnHome = document.getElementById("btnHome");
    const btnAdmin = document.getElementById("btnAdmin");

    // Navigasi ke Form Utama Warga (index.html)
    if (btnHome) {
        btnHome.addEventListener("click", () => {
            window.location.href = "index.html";
        });
    }

    // Navigasi ke Dashboard Pengurus (admin.html)
    if (btnAdmin) {
        btnAdmin.addEventListener("click", () => {
            window.location.href = "admin.html";
        });
    }
});
