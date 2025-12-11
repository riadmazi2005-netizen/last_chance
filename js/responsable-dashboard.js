// Dashboard Responsable Bus

let map
let routeActive = false
const L = window.L // Declare the L variable

document.addEventListener("DOMContentLoaded", () => {
  checkAuth()
  initNavigation()
  loadStudents()
  initMap()
  loadNotifications()
})

function checkAuth() {
  const user = JSON.parse(localStorage.getItem("currentUser"))
  if (!user || user.type !== "responsable") {
    window.location.href = "login.html"
    return
  }
  document.getElementById("userName").textContent = user.nom + " " + user.prenom
}

function initNavigation() {
  const navItems = document.querySelectorAll(".nav-item")
  navItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault()
      const section = item.getAttribute("data-section")
      switchSection(section)

      navItems.forEach((nav) => nav.classList.remove("active"))
      item.classList.add("active")
    })
  })
}

function switchSection(section) {
  document.querySelectorAll(".content-section").forEach((s) => {
    s.classList.remove("active")
  })
  document.getElementById(section + "Section").classList.add("active")

  if (section === "trajet" && map) {
    setTimeout(() => {
      map.invalidateSize()
    }, 100)
  }
}

function loadStudents() {
  const students = [
    { id: 1, name: "Ahmed Alaoui", class: "6ème A", tuteur: "M. Alaoui", status: "present" },
    { id: 2, name: "Fatima Bennani", class: "5ème B", tuteur: "Mme Bennani", status: "present" },
    { id: 3, name: "Youssef Idrissi", class: "4ème C", tuteur: "M. Idrissi", status: "absent" },
    { id: 4, name: "Sara Moussaoui", class: "5ème A", tuteur: "Mme Moussaoui", status: "present" },
    { id: 5, name: "Omar Tazi", class: "6ème B", tuteur: "M. Tazi", status: "present" },
    { id: 6, name: "Amina Alami", class: "3ème A", tuteur: "Mme Alami", status: "present" },
  ]

  const list = document.getElementById("studentsList")
  list.innerHTML = students
    .map(
      (student) => `
        <div class="student-item">
            <div class="student-photo">${student.name.charAt(0)}</div>
            <div class="student-data">
                <h3>${student.name}</h3>
                <div class="student-meta">
                    <span>Classe: ${student.class}</span>
                    <span>Tuteur: ${student.tuteur}</span>
                </div>
            </div>
            <div class="student-status">
                <span class="status-badge status-${student.status === "present" ? "active" : "pending"}">
                    ${student.status === "present" ? "Présent" : "Absent"}
                </span>
            </div>
        </div>
    `,
    )
    .join("")

  const presentCount = students.filter((s) => s.status === "present").length
  document.getElementById("totalStudents").textContent = students.length
  document.getElementById("presentStudents").textContent = presentCount
}

function initMap() {
  map = L.map("map").setView([33.5731, -7.5898], 13)

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map)

  // Arrêts du trajet
  const stops = [
    { name: "Départ - Garage", lat: 33.5731, lng: -7.5898 },
    { name: "Arrêt 1 - Maarif", lat: 33.585, lng: -7.61 },
    { name: "Arrêt 2 - Anfa", lat: 33.595, lng: -7.62 },
    { name: "Arrêt 3 - Bourgogne", lat: 33.605, lng: -7.63 },
    { name: "Arrivée - École", lat: 33.615, lng: -7.64 },
  ]

  // Afficher les arrêts sur la carte
  stops.forEach((stop, index) => {
    const marker = L.marker([stop.lat, stop.lng]).addTo(map)
    marker.bindPopup(`<b>Arrêt ${index + 1}</b><br>${stop.name}`)
  })

  // Liste des arrêts
  const stopsList = document.getElementById("stopsList")
  stopsList.innerHTML = stops
    .map(
      (stop, index) => `
        <div class="stop-item">
            <div class="stop-number">${index + 1}</div>
            <div>
                <strong>${stop.name}</strong>
                <br>
                <small style="color: var(--text-secondary);">
                    ${index === 0 ? "Point de départ" : index === stops.length - 1 ? "Destination finale" : `Arrêt intermédiaire`}
                </small>
            </div>
        </div>
    `,
    )
    .join("")

  // Bouton démarrer le trajet
  document.getElementById("startRouteBtn").addEventListener("click", () => {
    if (!routeActive) {
      startRoute()
    } else {
      stopRoute()
    }
  })
}

function startRoute() {
  routeActive = true
  const btn = document.getElementById("startRouteBtn")
  btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
        Arrêter le trajet
    `
  btn.style.background = "var(--danger)"

  alert("Trajet démarré ! Les tuteurs recevront des notifications en temps réel.")
}

function stopRoute() {
  routeActive = false
  const btn = document.getElementById("startRouteBtn")
  btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        Démarrer le trajet
    `
  btn.style.background = "var(--success)"

  alert("Trajet terminé !")
}

function sendNotification(type) {
  const messages = {
    monte: "Notification envoyée : Élève monté dans le bus",
    descendu: "Notification envoyée : Élève descendu du bus",
    arrive: "Notification envoyée : Élève arrivé à la maison",
    retard: "Notification envoyée : Bus en retard",
  }

  alert(messages[type])
  addNotificationToHistory(type)
}

function loadNotifications() {
  const notifications = [
    { type: "monte", time: "07:25", message: "Ahmed Alaoui monté dans le bus" },
    { type: "monte", time: "07:30", message: "Fatima Bennani montée dans le bus" },
    { type: "descendu", time: "07:45", message: "Ahmed Alaoui descendu à l'école" },
  ]

  displayNotifications(notifications)
}

function addNotificationToHistory(type) {
  const messages = {
    monte: "Élève monté dans le bus",
    descendu: "Élève descendu du bus",
    arrive: "Élève arrivé à la maison",
    retard: "Bus en retard",
  }

  const time = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  const newNotif = { type, time, message: messages[type] }

  const history = document.getElementById("notificationsHistory")
  const item = document.createElement("div")
  item.className = "notification-item"
  item.innerHTML = `
        <span>${newNotif.message}</span>
        <span style="color: var(--text-secondary)">${newNotif.time}</span>
    `
  history.insertBefore(item, history.firstChild)
}

function displayNotifications(notifications) {
  const history = document.getElementById("notificationsHistory")
  history.innerHTML = notifications
    .map(
      (notif) => `
        <div class="notification-item">
            <span>${notif.message}</span>
            <span style="color: var(--text-secondary)">${notif.time}</span>
        </div>
    `,
    )
    .join("")
}
