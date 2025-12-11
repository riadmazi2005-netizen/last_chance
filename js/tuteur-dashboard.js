// Dashboard Tuteur avec GPS

let map
let busMarker
const studentMarkers = []

// Import Leaflet library
const L = window.L

document.addEventListener("DOMContentLoaded", () => {
  checkAuth()
  initNavigation()
  loadStudents()
  initMap()
  loadHistory()
})

function checkAuth() {
  const user = JSON.parse(localStorage.getItem("currentUser"))
  if (!user || user.type !== "tuteur") {
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

  if (section === "gps" && map) {
    setTimeout(() => {
      map.invalidateSize()
      startBusSimulation()
    }, 100)
  }
}

function loadStudents() {
  const studentsData = [
    {
      id: 1,
      name: "Sarah Alami",
      class: "5ème A",
      school: "École Al Madina",
      transport: "Annuel",
      status: "active",
      bus: "Bus #12",
    },
    {
      id: 2,
      name: "Youssef Alami",
      class: "3ème B",
      school: "École Al Madina",
      transport: "Mensuel",
      status: "active",
      bus: "Bus #12",
    },
  ]

  const grid = document.getElementById("studentsGrid")
  grid.innerHTML = studentsData
    .map(
      (student) => `
        <div class="student-card">
            <div class="student-header">
                <div class="student-avatar">${student.name.charAt(0)}</div>
                <div class="student-info">
                    <h3>${student.name}</h3>
                    <p>${student.class}</p>
                </div>
            </div>
            <div class="student-details">
                <div class="detail-item">
                    <span class="detail-label">École :</span>
                    <span class="detail-value">${student.school}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Bus :</span>
                    <span class="detail-value">${student.bus}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Transport :</span>
                    <span class="detail-value">${student.transport}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Statut :</span>
                    <span class="status-badge status-${student.status}">Actif</span>
                </div>
            </div>
            <div class="student-actions">
                <button class="btn-primary" onclick="trackBus(${student.id})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    Suivre le bus
                </button>
                <button class="btn-secondary" onclick="editStudent(${student.id})">Modifier</button>
            </div>
        </div>
    `,
    )
    .join("")
}

function initMap() {
  // Initialiser la carte Leaflet (Casablanca, Maroc)
  map = L.map("map").setView([33.5731, -7.5898], 13)

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map)

  // Ajouter le marqueur du bus
  const busIcon = L.divIcon({
    className: "bus-marker",
    html: `<div style="background: #2563eb; color: white; padding: 10px; border-radius: 50%; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="6" width="18" height="10" rx="2"/>
                <circle cx="8" cy="18" r="2"/>
                <circle cx="16" cy="18" r="2"/>
            </svg>
        </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })

  busMarker = L.marker([33.5731, -7.5898], { icon: busIcon }).addTo(map)
  busMarker.bindPopup("<b>Bus #12</b><br>En route vers l'école")
}

function startBusSimulation() {
  // Simuler le mouvement du bus
  let lat = 33.5731
  let lng = -7.5898
  let speed = 45
  let eta = 8

  setInterval(() => {
    lat += (Math.random() - 0.5) * 0.002
    lng += (Math.random() - 0.5) * 0.002
    speed = 40 + Math.random() * 20
    eta = Math.max(1, eta - 0.1)

    if (busMarker) {
      busMarker.setLatLng([lat, lng])
    }

    document.getElementById("speed").textContent = Math.round(speed) + " km/h"
    document.getElementById("eta").textContent = Math.round(eta) + " minutes"
  }, 2000)
}

function centerMap() {
  if (map && busMarker) {
    map.setView(busMarker.getLatLng(), 15)
  }
}

function trackBus(studentId) {
  switchSection("gps")
  document.querySelectorAll(".nav-item").forEach((nav) => {
    nav.classList.remove("active")
    if (nav.getAttribute("data-section") === "gps") {
      nav.classList.add("active")
    }
  })
}

function loadHistory() {
  const historyData = [
    {
      date: "2024-01-15",
      time: "07:30",
      type: "Départ",
      status: "À l'heure",
    },
    {
      date: "2024-01-15",
      time: "07:45",
      type: "Arrivée école",
      status: "À l'heure",
    },
    {
      date: "2024-01-15",
      time: "16:00",
      type: "Départ école",
      status: "Retard 5 min",
    },
    {
      date: "2024-01-15",
      time: "16:20",
      type: "Arrivée maison",
      status: "À l'heure",
    },
  ]

  const historyList = document.getElementById("historyList")
  historyList.innerHTML = historyData
    .map(
      (item) => `
        <div class="history-item">
            <h4>${item.type}</h4>
            <div class="history-meta">
                <span>${item.date} à ${item.time}</span>
                <span style="margin-left: 15px; color: ${item.status.includes("Retard") ? "var(--danger)" : "var(--success)"}">
                    ${item.status}
                </span>
            </div>
        </div>
    `,
    )
    .join("")
}

function showAddStudentModal() {
  const modal = document.getElementById("addStudentModal")
  modal.classList.add("active")

  document.getElementById("addStudentForm").addEventListener("submit", (e) => {
    e.preventDefault()
    // Logique d'ajout d'élève
    alert("Élève ajouté avec succès !")
    closeModal()
    loadStudents()
  })
}

function closeModal() {
  document.getElementById("addStudentModal").classList.remove("active")
}

function editStudent(id) {
  alert("Fonction de modification pour l'élève ID: " + id)
}
