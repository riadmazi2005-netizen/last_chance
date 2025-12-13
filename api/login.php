<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['email']) || !isset($data['password']) || !isset($data['type'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Données manquantes']);
    exit;
}

$user = authenticate($data['email'], $data['password'], $data['type']);

if ($user) {
    echo json_encode([
        'success' => true,
        'user' => $user,
        'message' => 'Connexion réussie'
    ]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Email ou mot de passe incorrect']);
}
?>