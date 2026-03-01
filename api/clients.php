<?php
// ============================================
// Clients API
// GET    /api/clients.php
// POST   /api/clients.php
// POST   /api/clients.php?id=X
// DELETE /api/clients.php?id=X
// ============================================
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

switch ($method) {
    case 'GET':
        listClients();
        break;
    case 'POST':
        requireAuth();
        $id ? updateClient($id) : createClient();
        break;
    case 'DELETE':
        requireAuth();
        deleteClient($id);
        break;
    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}

function listClients() {
    $db = getDB();
    $rows = $db->query("SELECT * FROM clients ORDER BY sort_order ASC")->fetchAll();
    jsonResponse($rows);
}

function createClient() {
    $body = getJsonBody();
    $db = getDB();

    $logoPath = null;
    if (!empty($body['logoUrl']) && strpos($body['logoUrl'], 'data:image') === 0) {
        $logoPath = saveBase64Logo($body['logoUrl']);
    }

    $stmt = $db->prepare("INSERT INTO clients (name, logo_path, sort_order) VALUES (?, ?, ?)");
    $stmt->execute([
        $body['name'] ?? '',
        $logoPath,
        (int)($body['order'] ?? 0)
    ]);

    jsonResponse(['success' => true, 'id' => $db->lastInsertId()]);
}

function updateClient($id) {
    $body = getJsonBody();
    $db = getDB();

    $logoPath = null;
    if (!empty($body['logoUrl']) && strpos($body['logoUrl'], 'data:image') === 0) {
        $logoPath = saveBase64Logo($body['logoUrl']);
    }

    $fields = "name=?, sort_order=?";
    $params = [$body['name'] ?? '', (int)($body['order'] ?? 0)];

    if ($logoPath) {
        $fields .= ", logo_path=?";
        $params[] = $logoPath;
    }

    $params[] = $id;
    $stmt = $db->prepare("UPDATE clients SET $fields WHERE id=?");
    $stmt->execute($params);

    jsonResponse(['success' => true]);
}

function deleteClient($id) {
    if (!$id) jsonResponse(['error' => 'ID required'], 400);

    $db = getDB();
    $stmt = $db->prepare("SELECT logo_path FROM clients WHERE id=?");
    $stmt->execute([$id]);
    $item = $stmt->fetch();
    if ($item && $item['logo_path'] && file_exists(__DIR__ . '/../' . $item['logo_path'])) {
        unlink(__DIR__ . '/../' . $item['logo_path']);
    }

    $stmt = $db->prepare("DELETE FROM clients WHERE id=?");
    $stmt->execute([$id]);
    jsonResponse(['success' => true]);
}

function saveBase64Logo($base64) {
    $uploadDir = __DIR__ . "/../uploads/clients/";
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

    preg_match('/data:image\/(.*?);base64,(.*)/', $base64, $matches);
    if (count($matches) < 3) return null;

    $ext = $matches[1] === 'jpeg' ? 'jpg' : $matches[1];
    $data = base64_decode($matches[2]);
    $filename = time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;

    file_put_contents($uploadDir . $filename, $data);
    return "uploads/clients/$filename";
}
