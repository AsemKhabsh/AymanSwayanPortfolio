<?php
// ============================================
// Services API
// GET    /api/services.php
// POST   /api/services.php
// POST   /api/services.php?id=X
// DELETE /api/services.php?id=X
// ============================================
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

switch ($method) {
    case 'GET':
        listServices();
        break;
    case 'POST':
        requireAuth();
        $id ? updateService($id) : createService();
        break;
    case 'DELETE':
        requireAuth();
        deleteService($id);
        break;
    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}

function listServices() {
    $db = getDB();
    $rows = $db->query("SELECT * FROM services ORDER BY sort_order ASC")->fetchAll();

    foreach ($rows as &$row) {
        $row['skills'] = json_decode($row['skills'] ?? '[]', true);
        $row['order'] = (int)$row['sort_order'];
    }

    jsonResponse($rows);
}

function createService() {
    $body = getJsonBody();
    $db = getDB();

    $stmt = $db->prepare("INSERT INTO services (title, icon, skills, category, sort_order) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([
        $body['title'] ?? '',
        $body['icon'] ?? 'fas fa-cog',
        json_encode($body['skills'] ?? [], JSON_UNESCAPED_UNICODE),
        $body['category'] ?? 'design',
        (int)($body['order'] ?? 0)
    ]);

    jsonResponse(['success' => true, 'id' => $db->lastInsertId()]);
}

function updateService($id) {
    $body = getJsonBody();
    $db = getDB();

    $stmt = $db->prepare("UPDATE services SET title=?, icon=?, skills=?, category=?, sort_order=? WHERE id=?");
    $stmt->execute([
        $body['title'] ?? '',
        $body['icon'] ?? 'fas fa-cog',
        json_encode($body['skills'] ?? [], JSON_UNESCAPED_UNICODE),
        $body['category'] ?? 'design',
        (int)($body['order'] ?? 0),
        $id
    ]);

    jsonResponse(['success' => true]);
}

function deleteService($id) {
    if (!$id) jsonResponse(['error' => 'ID required'], 400);

    $db = getDB();
    $stmt = $db->prepare("DELETE FROM services WHERE id=?");
    $stmt->execute([$id]);
    jsonResponse(['success' => true]);
}
