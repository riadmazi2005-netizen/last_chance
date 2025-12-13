<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$required_fields = ['nom', 'prenom', 'cin', 'telephone', 'email', 'password', 'type'];
foreach ($required_fields as $field) {
    if (!isset($data[$field]) || empty($data[$field])) {
        http_response_code(400);
        echo json_encode(['error' => 'Champ requis manquant: ' . $field]);
        exit;
    }
}

if (!in_array($data['type'], ['tuteur', 'responsable', 'admin'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Type d\'utilisateur invalide']);
    exit;
}

try {
    $success = createUser($data);
    if ($success) {
        echo json_encode([
            'success' => true,
            'message' => 'Utilisateur créé avec succès'
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Erreur lors de la création de l\'utilisateur']);
    }
} catch (PDOException $e) {
    if ($e->getCode() == 23000) { // Duplicate entry
        http_response_code(409);
        echo json_encode(['error' => 'Email ou CIN déjà utilisé']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Erreur serveur: ' . $e->getMessage()]);
    }
}
?>