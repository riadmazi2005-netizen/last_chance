// Navigation principale
function navigateTo(space) {
  const pages = {
    tuteur: "tuteur/login.html",
    responsable: "responsable/login.html",
    admin: "admin/login.html",
  }

  window.location.href = pages[space]
}

// Animation au chargement
document.addEventListener("DOMContentLoaded", () => {
  console.log("SchoolBus Pro - Application chargée")
})
