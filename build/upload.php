<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Upload-Token');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

define('UPLOAD_TOKEN', 'Ced3v1um-UPL-2025-9sKj');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit;
}

$received_token = $_SERVER['HTTP_X_UPLOAD_TOKEN'] ?? '';
if ($received_token !== UPLOAD_TOKEN) {
    http_response_code(401);
    echo json_encode(['error' => 'Non autorisé']);
    exit;
}

if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => "Fichier manquant ou erreur d'upload"]);
    exit;
}

$file = $_FILES['file'];
$allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon'];
$file_type = mime_content_type($file['tmp_name']);

if (!in_array($file_type, $allowed_types)) {
    http_response_code(400);
    echo json_encode(['error' => 'Type de fichier non autorisé (JPG, PNG, GIF, WebP, SVG, ICO uniquement)']);
    exit;
}

if ($file['size'] > 5 * 1024 * 1024) {
    http_response_code(400);
    echo json_encode(['error' => 'Fichier trop volumineux (max 5 Mo)']);
    exit;
}

$upload_dir = __DIR__ . '/uploads/';
if (!is_dir($upload_dir)) {
    if (!mkdir($upload_dir, 0755, true)) {
        http_response_code(500);
        echo json_encode(['error' => 'Impossible de créer le dossier uploads']);
        exit;
    }
}

$original_ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
$safe_ext = in_array($original_ext, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'ico']) ? $original_ext : 'jpg';
$filename = uniqid('img_') . '_' . time() . '.' . $safe_ext;
$filepath = $upload_dir . $filename;

if (!move_uploaded_file($file['tmp_name'], $filepath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur lors de la sauvegarde du fichier']);
    exit;
}

$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'];
$base_path = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/');
$url = $protocol . '://' . $host . $base_path . '/uploads/' . $filename;

echo json_encode(['url' => $url, 'filename' => $filename]);
