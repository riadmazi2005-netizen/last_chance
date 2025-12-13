// Dashboard Administrateur

document.addEventListener("DOMContentLoaded", () => {
  checkAuth()
  initNavigation()
  loadDashboardData()
})

function checkAuth() {
  const user = JSON.parse(localStorage.getItem("currentUser"))
  if (!user || user.type !== "admin") {
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
}

function loadDashboardData() {
  loadStats()
  loadRequests()
  loadStudents()
  loadDrivers()
  loadResponsables()
  loadBuses()
  loadRoutes()
}

function loadStats() {
  fetch('../api/dashboard.php?action=stats')
    .then(response => response.json())
    .then(stats => {
      document.getElementById("totalStudents").textContent = stats.total_students || 0
      document.getElementById("totalBuses").textContent = stats.active_buses || 0
      document.getElementById("totalDrivers").textContent = stats.total_drivers || 0
      document.getElementById("totalResponsables").textContent = stats.total_responsables || 0
    })
    .catch(error => {
      console.error('Erreur lors du chargement des statistiques:', error)
    })
}

function loadRequests() {
  const requests = [
    {
      id: 1,
      studentName: "Karim Bennani",
      class: "5ème A",
      tuteur: "M. Bennani",
      date: "2024-01-15",
      status: "pending",
    },
    {
      id: 2,
      studentName: "Salma Idrissi",
      class: "6ème B",
      tuteur: "Mme Idrissi",
      date: "2024-01-15",
      status: "pending",
    },
    {
      id: 3,
      studentName: "Hassan Tazi",
      class: "4ème C",
      tuteur: "M. Tazi",
      date: "2024-01-14",
      status: "pending",
    },
  ]

  const list = document.getElementById("requestsList")
  list.innerHTML = requests
    .map(
      (req) => `
        <div class="request-card">
            <div class="request-info">
                <h3>${req.studentName}</h3>
                <div class="request-meta">
                    <span>${req.class} - Tuteur: ${req.tuteur}</span>
                    <span style="margin-left: 15px; color: var(--text-secondary)">Demandé le ${req.date}</span>
                </div>
            </div>
            <div class="request-actions">
                <button class="btn-accept" onclick="acceptRequest(${req.id})">Accepter</button>
                <button class="btn-reject" onclick="rejectRequest(${req.id})">Refuser</button>
            </div>
        </div>
    `,
    )
    .join("")

  document.getElementById("pendingRequests").textContent = requests.length
}

function acceptRequest(id) {
  if (confirm("Accepter cette demande d'inscription ?")) {
    alert("Demande acceptée ! L'élève a été ajouté au système.")
    loadRequests()
  }
}

function rejectRequest(id) {
  if (confirm("Refuser cette demande d'inscription ?")) {
    alert("Demande refusée.")
    loadRequests()
  }
}

function loadStudents() {
  fetch('../api/dashboard.php?action=students')
    .then(response => response.json())
    .then(students => {
      const table = document.getElementById("studentsTable")
      table.innerHTML = `
        <table>
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Classe</th>
                    <th>École</th>
                    <th>Tuteur</th>
                    <th>Bus</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${students
                  .map(
                    (student) => `
                    <tr>
                        <td>${student.nom} ${student.prenom}</td>
                        <td>${student.classe || '-'}</td>
                        <td>${student.ecole || '-'}</td>
                        <td>${student.tuteur_nom ? student.tuteur_nom + ' ' + student.tuteur_prenom : '-'}</td>
                        <td>${student.bus_numero || '-'}</td>
                        <td>
                            <button class="btn-edit" onclick="editStudent(${student.id})">Modifier</button>
                        </td>
                    </tr>
                `,
                  )
                  .join("")}
            </tbody>
        </table>
    `

    })
    .catch(error => {
      console.error('Erreur lors du chargement des élèves:', error)
    })
}

function loadDrivers() {
  fetch('../api/dashboard.php?action=drivers')
    .then(response => response.json())
    .then(drivers => {
      const grid = document.getElementById("driversGrid")
      grid.innerHTML = drivers
        .map(
          (driver) => `
        <div class="data-card">
            <div class="card-header">
                <h3 class="card-title">${driver.nom} ${driver.prenom}</h3>
            </div>
            <div class="card-body">
                <div class="card-row">
                    <span class="card-label">CIN:</span>
                    <span class="card-value">${driver.cin}</span>
                </div>
                <div class="card-row">
                    <span class="card-label">Téléphone:</span>
                    <span class="card-value">${driver.telephone || '-'}</span>
                </div>
                <div class="card-row">
                    <span class="card-label">Bus assigné:</span>
                    <span class="card-value">${driver.bus_numero ? 'Bus #' + driver.bus_numero : '-'}</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn-edit" onclick="editDriver(${driver.id})">Modifier</button>
                <button class="btn-delete" onclick="deleteDriver(${driver.id})">Supprimer</button>
            </div>
        </div>
    `,
        )
        .join("")
    })
    .catch(error => {
      console.error('Erreur lors du chargement des chauffeurs:', error)
    })
}

function loadResponsables() {
  fetch('../api/dashboard.php?action=responsables')
    .then(response => response.json())
    .then(responsables => {
      const grid = document.getElementById("responsablesGrid")
      grid.innerHTML = responsables
        .map(
          (resp) => `
        <div class="data-card">
            <div class="card-header">
                <h3 class="card-title">${resp.nom} ${resp.prenom}</h3>
            </div>
            <div class="card-body">
                <div class="card-row">
                    <span class="card-label">CIN:</span>
                    <span class="card-value">${resp.cin}</span>
                </div>
                <div class="card-row">
                    <span class="card-label">Téléphone:</span>
                    <span class="card-value">${resp.telephone || '-'}</span>
                </div>
                <div class="card-row">
                    <span class="card-label">Email:</span>
                    <span class="card-value">${resp.email}</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn-edit" onclick="editResponsable(${resp.id})">Modifier</button>
                <button class="btn-delete" onclick="deleteResponsable(${resp.id})">Supprimer</button>
            </div>
        </div>
    `,
        )
        .join("")
    })
    .catch(error => {
      console.error('Erreur lors du chargement des responsables:', error)
    })
}

function loadBuses() {
  fetch('../api/dashboard.php?action=buses')
    .then(response => response.json())
    .then(buses => {
      const grid = document.getElementById("busGrid")
      grid.innerHTML = buses
        .map(
          (bus) => `
        <div class="data-card">
            <div class="card-header">
                <h3 class="card-title">Bus #${bus.numero}</h3>
                <span class="status-badge status-${bus.status}">${bus.status === 'active' ? 'Actif' : bus.status}</span>
            </div>
            <div class="card-body">
                <div class="card-row">
                    <span class="card-label">Chauffeur:</span>
                    <span class="card-value">${bus.driver_nom ? bus.driver_nom + ' ' + bus.driver_prenom : 'Non assigné'}</span>
                </div>
                <div class="card-row">
                    <span class="card-label">Responsable:</span>
                    <span class="card-value">${bus.responsable_nom ? bus.responsable_nom + ' ' + bus.responsable_prenom : 'Non assigné'}</span>
                </div>
                <div class="card-row">
                    <span class="card-label">Élèves:</span>
                    <span class="card-value">${bus.students_count || 0}/${bus.capacite}</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn-edit" onclick="editBus(${bus.id})">Modifier</button>
                <button class="btn-delete" onclick="deleteBus(${bus.id})">Supprimer</button>
            </div>
        </div>
    `,
        )
        .join("")

    })
    .catch(error => {
      console.error('Erreur lors du chargement des bus:', error)
    })
}

function loadRoutes() {
  const routes = [
    {
      id: 1,
      name: "Trajet Matin - Bus #12",
      bus: "Bus #12",
      departure: "07:00",
      arrival: "08:00",
      stops: 5,
    },
    {
      id: 2,
      name: "Trajet Soir - Bus #12",
      bus: "Bus #12",
      departure: "16:00",
      arrival: "17:00",
      stops: 5,
    },
    {
      id: 3,
      name: "Trajet Matin - Bus #8",
      bus: "Bus #8",
      departure: "07:15",
      arrival: "08:15",
      stops: 4,
    },
  ]

  const list = document.getElementById("routesList")
  list.innerHTML = routes
    .map(
      (route) => `
        <div class="data-card">
            <div class="card-header">
                <h3 class="card-title">${route.name}</h3>
            </div>
            <div class="card-body">
                <div class="card-row">
                    <span class="card-label">Bus:</span>
                    <span class="card-value">${route.bus}</span>
                </div>
                <div class="card-row">
                    <span class="card-label">Départ:</span>
                    <span class="card-value">${route.departure}</span>
                </div>
                <div class="card-row">
                    <span class="card-label">Arrivée:</span>
                    <span class="card-value">${route.arrival}</span>
                </div>
                <div class="card-row">
                    <span class="card-label">Arrêts:</span>
                    <span class="card-value">${route.stops}</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn-edit" onclick="editRoute(${route.id})">Modifier</button>
                <button class="btn-delete" onclick="deleteRoute(${route.id})">Supprimer</button>
            </div>
        </div>
    `,
    )
    .join("")
}

// Fonctions de gestion
function showAddDriverModal() {
  alert("Formulaire d'ajout de chauffeur (à implémenter)")
}

function showAddResponsableModal() {
  alert("Formulaire d'ajout de responsable (à implémenter)")
}

function showAddBusModal() {
  alert("Formulaire d'ajout de bus (à implémenter)")
}

function showAddRouteModal() {
  alert("Formulaire de création de trajet (à implémenter)")
}

function editDriver(id) {
  alert("Modification du chauffeur ID: " + id)
}

function deleteDriver(id) {
  if (confirm("Supprimer ce chauffeur ?")) {
    alert("Chauffeur supprimé")
    loadDrivers()
  }
}

function editResponsable(id) {
  alert("Modification du responsable ID: " + id)
}

function deleteResponsable(id) {
  if (confirm("Supprimer ce responsable ?")) {
    alert("Responsable supprimé")
    loadResponsables()
  }
}

function editBus(id) {
  alert("Modification du bus ID: " + id)
}

function deleteBus(id) {
  if (confirm("Supprimer ce bus ?")) {
    alert("Bus supprimé")
    loadBuses()
  }
}

function editRoute(id) {
  alert("Modification du trajet ID: " + id)
}

function deleteRoute(id) {
  if (confirm("Supprimer ce trajet ?")) {
    alert("Trajet supprimé")
    loadRoutes()
  }
}

function editStudent(id) {
  alert("Modification de l'élève ID: " + id)
}

function exportData(type) {
  alert("Export des données en " + type + " (fonctionnalité à implémenter)")
}
