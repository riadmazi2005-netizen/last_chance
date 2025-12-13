<?php
require_once 'config.php';

header('Content-Type: application/json; charset=utf-8');

// Vérifier la méthode
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit;
}

// Récupérer tous les élèves
function getAllStudents() {
    global $pdo;
    $stmt = $pdo->query("SELECT s.*, u.nom as tuteur_nom, u.prenom as tuteur_prenom, b.numero as bus_numero
                        FROM students s
                        LEFT JOIN users u ON s.tuteur_id = u.id
                        LEFT JOIN buses b ON s.bus_id = b.id
                        ORDER BY s.created_at DESC");
    return $stmt->fetchAll();
}

// Récupérer tous les bus
function getAllBuses() {
    global $pdo;
    $stmt = $pdo->query("SELECT b.*, d.nom as driver_nom, d.prenom as driver_prenom, u.nom as responsable_nom, u.prenom as responsable_prenom,
                        (SELECT COUNT(*) FROM students s WHERE s.bus_id = b.id) as students_count
                        FROM buses b
                        LEFT JOIN drivers d ON b.driver_id = d.id
                        LEFT JOIN users u ON b.responsable_id = u.id
                        ORDER BY b.numero");
    return $stmt->fetchAll();
}

// Récupérer tous les chauffeurs
function getAllDrivers() {
    global $pdo;
    $stmt = $pdo->query("SELECT d.*, b.numero as bus_numero
                        FROM drivers d
                        LEFT JOIN buses b ON d.bus_id = b.id
                        ORDER BY d.nom");
    return $stmt->fetchAll();
}

// Récupérer tous les responsables
function getAllResponsables() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM users WHERE user_type = 'responsable' ORDER BY nom");
    return $stmt->fetchAll();
}

// Récupérer tous les tuteurs
function getAllTuteurs() {
    global $pdo;
    $stmt = $pdo->query("SELECT * FROM users WHERE user_type = 'tuteur' ORDER BY nom");
    return $stmt->fetchAll();
}

// Récupérer les statistiques
function getStats() {
    global $pdo;

    $stats = [];

    $stmt = $pdo->query("SELECT COUNT(*) as total FROM students");
    $stats['total_students'] = $stmt->fetch()['total'];

    $stmt = $pdo->query("SELECT COUNT(*) as total FROM buses WHERE status = 'active'");
    $stats['active_buses'] = $stmt->fetch()['total'];

    $stmt = $pdo->query("SELECT COUNT(*) as total FROM drivers");
    $stats['total_drivers'] = $stmt->fetch()['total'];

    $stmt = $pdo->query("SELECT COUNT(*) as total FROM users WHERE user_type = 'responsable'");
    $stats['total_responsables'] = $stmt->fetch()['total'];

    return $stats;
}

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'students':
        echo json_encode(getAllStudents());
        break;
    case 'buses':
        echo json_encode(getAllBuses());
        break;
    case 'drivers':
        echo json_encode(getAllDrivers());
        break;
    case 'responsables':
        echo json_encode(getAllResponsables());
        break;
    case 'tuteurs':
        echo json_encode(getAllTuteurs());
        break;
    case 'stats':
        echo json_encode(getStats());
        break;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Action non spécifiée']);
}
?>