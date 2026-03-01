<?php
// ============================================
// Site Content API (hero, about, contact, settings)
// GET  /api/content.php?section=hero
// POST /api/content.php?section=hero
// ============================================
require_once 'config.php';

$section = $_GET['section'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];

if (!in_array($section, ['hero', 'about', 'contact', 'settings'])) {
    jsonResponse(['error' => 'Invalid section'], 400);
}

if ($method === 'GET') {
    getContent($section);
} elseif ($method === 'POST') {
    requireAuth();
    saveContent($section);
} else {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

function getContent($section) {
    $db = getDB();
    $stmt = $db->prepare("SELECT data FROM site_content WHERE section = ?");
    $stmt->execute([$section]);
    $row = $stmt->fetch();

    if ($row) {
        jsonResponse(json_decode($row['data'], true));
    } else {
        jsonResponse(new stdClass()); // empty object
    }
}

function saveContent($section) {
    $body = getJsonBody();
    $db = getDB();

    $json = json_encode($body, JSON_UNESCAPED_UNICODE);

    $stmt = $db->prepare("INSERT INTO site_content (section, data) VALUES (?, ?)
                          ON DUPLICATE KEY UPDATE data = ?, updated_at = NOW()");
    $stmt->execute([$section, $json, $json]);

    jsonResponse(['success' => true]);
}
