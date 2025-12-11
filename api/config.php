<?php
// Configuration de la base de données
define('DB_HOST', 'localhost');
define('DB_NAME', 'schoolbus');
define('DB_USER', 'root');
define('DB_PASS', '');

// Connexion à la base de données
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
} catch (PDOException $e) {
    die(json_encode(['error' => 'Erreur de connexion à la base de données: ' . $e->getMessage()]));
}

// Headers CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

// Fonction d'authentification
function authenticate($email, $password, $type) {
    global $pdo;
    
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ? AND user_type = ?");
    $stmt->execute([$email, $type]);
    $user = $stmt->fetch();
    
    if ($user && password_verify($password, $user['password'])) {
        unset($user['password']);
        return $user;
    }
    
    return false;
}

// Fonction de création d'utilisateur
function createUser($data) {
    global $pdo;
    
    $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
    
    $stmt = $pdo->prepare("
        INSERT INTO users (nom, prenom, cin, telephone, email, password, user_type)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    
    return $stmt->execute([
        $data['nom'],
        $data['prenom'],
        $data['cin'],
        $data['telephone'],
        $data['email'],
        $hashedPassword,
        $data['type']
    ]);
}

// Fonction de récupération des élèves d'un tuteur
function getStudentsByTuteur($tuteurId) {
    global $pdo;
    
    $stmt = $pdo->prepare("
        SELECT s.*, b.numero as bus_numero
        FROM students s
        LEFT JOIN buses b ON s.bus_id = b.id
        WHERE s.tuteur_id = ?
    ");
    $stmt->execute([$tuteurId]);
    
    return $stmt->fetchAll();
}

// Fonction de mise à jour GPS
function updateGPSPosition($busId, $lat, $lng, $speed) {
    global $pdo;
    
    $stmt = $pdo->prepare("
        INSERT INTO gps_tracking (bus_id, latitude, longitude, vitesse)
        VALUES (?, ?, ?, ?)
    ");
    
    return $stmt->execute([$busId, $lat, $lng, $speed]);
}

// Fonction d'envoi de notification
function sendNotification($responsableId, $tuteurId, $studentId, $type, $message) {
    global $pdo;
    
    $stmt = $pdo->prepare("
        INSERT INTO notifications (responsable_id, tuteur_id, student_id, type, message)
        VALUES (?, ?, ?, ?, ?)
    ");
    
    return $stmt->execute([$responsableId, $tuteurId, $studentId, $type, $message]);
}
?>
