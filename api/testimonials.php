<?php
// ============================================
// Testimonials API (آراء العملاء - مقاطع صوتية)
// GET    /api/testimonials.php
// POST   /api/testimonials.php
// POST   /api/testimonials.php?id=X
// DELETE /api/testimonials.php?id=X
// ============================================
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

switch ($method) {
    case 'GET':
        listTestimonials();
        break;
    case 'POST':
        requireAuth();
        $id ? updateTestimonial($id) : createTestimonial();
        break;
    case 'DELETE':
        requireAuth();
        deleteTestimonial($id);
        break;
    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}

function listTestimonials() {
    $db = getDB();
    $rows = $db->query("SELECT * FROM testimonials ORDER BY sort_order ASC")->fetchAll();
    jsonResponse($rows);
}

function createTestimonial() {
    $body = getJsonBody();
    $db = getDB();

    $audioPath = null;
    if (!empty($body['audioData'])) {
        $audioPath = saveBase64Audio($body['audioData']);
    }

    $stmt = $db->prepare("INSERT INTO testimonials (position, audio_path, sort_order) VALUES (?, ?, ?)");
    $stmt->execute([
        $body['position'] ?? '',
        $audioPath,
        (int)($body['order'] ?? 0)
    ]);

    jsonResponse(['success' => true, 'id' => $db->lastInsertId()]);
}

function updateTestimonial($id) {
    $body = getJsonBody();
    $db = getDB();

    $audioPath = null;
    if (!empty($body['audioData'])) {
        // Delete old audio file
        $stmt = $db->prepare("SELECT audio_path FROM testimonials WHERE id=?");
        $stmt->execute([$id]);
        $old = $stmt->fetch();
        if ($old && $old['audio_path'] && file_exists(__DIR__ . '/../' . $old['audio_path'])) {
            unlink(__DIR__ . '/../' . $old['audio_path']);
        }
        $audioPath = saveBase64Audio($body['audioData']);
    }

    $fields = "position=?, sort_order=?";
    $params = [$body['position'] ?? '', (int)($body['order'] ?? 0)];

    if ($audioPath) {
        $fields .= ", audio_path=?";
        $params[] = $audioPath;
    }

    $params[] = $id;
    $stmt = $db->prepare("UPDATE testimonials SET $fields WHERE id=?");
    $stmt->execute($params);

    jsonResponse(['success' => true]);
}

function deleteTestimonial($id) {
    if (!$id) jsonResponse(['error' => 'ID required'], 400);

    $db = getDB();
    $stmt = $db->prepare("SELECT audio_path FROM testimonials WHERE id=?");
    $stmt->execute([$id]);
    $item = $stmt->fetch();
    if ($item && $item['audio_path'] && file_exists(__DIR__ . '/../' . $item['audio_path'])) {
        unlink(__DIR__ . '/../' . $item['audio_path']);
    }

    $stmt = $db->prepare("DELETE FROM testimonials WHERE id=?");
    $stmt->execute([$id]);
    jsonResponse(['success' => true]);
}

function saveBase64Audio($base64) {
    $uploadDir = __DIR__ . "/../uploads/testimonials/";
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

    // Support audio formats: mp3, wav, ogg, m4a, webm
    if (preg_match('/data:audio\/(.*?);base64,(.*)/', $base64, $matches)) {
        $ext = $matches[1];
        if ($ext === 'mpeg') $ext = 'mp3';
        if ($ext === 'x-m4a') $ext = 'm4a';
        $data = base64_decode($matches[2]);
    } elseif (preg_match('/data:video\/webm;base64,(.*)/', $base64, $matches)) {
        $ext = 'webm';
        $data = base64_decode($matches[1]);
    } else {
        return null;
    }

    $filename = time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
    file_put_contents($uploadDir . $filename, $data);
    return "uploads/testimonials/$filename";
}
