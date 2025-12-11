// Gestion de l'authentification

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm")
  const registerForm = document.getElementById("registerForm")

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister)
  }
})

function handleLogin(e) {
  e.preventDefault()

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  // Simulation de connexion
  if (email && password) {
    // Déterminer le type d'utilisateur basé sur le path
    const path = window.location.pathname
    let userType = ""
    let dashboardUrl = ""

    if (path.includes("tuteur")) {
      userType = "tuteur"
      dashboardUrl = "dashboard.html"
    } else if (path.includes("responsable")) {
      userType = "responsable"
      dashboardUrl = "dashboard.html"
    } else if (path.includes("admin")) {
      userType = "admin"
      dashboardUrl = "dashboard.html"
    }

    // Stocker les infos de session
    const userData = {
      email: email,
      type: userType,
      nom: "Utilisateur",
      prenom: "Test",
      loginTime: new Date().toISOString(),
    }

    localStorage.setItem("currentUser", JSON.stringify(userData))

    // Redirection vers le dashboard
    window.location.href = dashboardUrl
  } else {
    alert("Veuillez remplir tous les champs")
  }
}

function handleRegister(e) {
  e.preventDefault()

  const formData = {
    nom: document.getElementById("nom").value,
    prenom: document.getElementById("prenom").value,
    cin: document.getElementById("cin").value,
    telephone: document.getElementById("telephone").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  }

  // Validation
  if (Object.values(formData).some((val) => !val)) {
    alert("Veuillez remplir tous les champs")
    return
  }

  // Déterminer le type d'utilisateur
  const path = window.location.pathname
  let userType = ""

  if (path.includes("tuteur")) {
    userType = "tuteur"
  } else if (path.includes("responsable")) {
    userType = "responsable"
  } else if (path.includes("admin")) {
    userType = "admin"
  }

  // Stocker l'utilisateur
  const users = JSON.parse(localStorage.getItem("users") || "[]")
  users.push({ ...formData, type: userType, id: Date.now() })
  localStorage.setItem("users", JSON.stringify(users))

  alert("Inscription réussie ! Vous pouvez maintenant vous connecter.")
  window.location.href = "login.html"
}

function logout() {
  if (confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
    localStorage.removeItem("currentUser")
    window.location.href = "../index.html"
  }
}
