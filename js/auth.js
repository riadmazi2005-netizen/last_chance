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

  if (!email || !password) {
    alert("Veuillez remplir tous les champs")
    return
  }

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

  // Appel API pour la connexion
  fetch('../api/login.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email,
      password: password,
      type: userType
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Stocker les infos de session
      localStorage.setItem("currentUser", JSON.stringify(data.user))

      // Redirection vers le dashboard
      window.location.href = dashboardUrl
    } else {
      alert(data.error || "Erreur de connexion")
    }
  })
  .catch(error => {
    console.error('Erreur:', error)
    alert("Erreur de connexion au serveur")
  })
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

  // Appel API pour l'inscription
  fetch('../api/register.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...formData,
      type: userType
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert("Inscription réussie ! Vous pouvez maintenant vous connecter.")
      window.location.href = "login.html"
    } else {
      alert(data.error || "Erreur lors de l'inscription")
    }
  })
  .catch(error => {
    console.error('Erreur:', error)
    alert("Erreur de connexion au serveur")
  })
}

function logout() {
  if (confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
    localStorage.removeItem("currentUser")
    window.location.href = "../index.html"
  }
}
