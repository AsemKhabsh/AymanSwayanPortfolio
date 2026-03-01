<?php
// ============================================
// Portfolio API
// GET    /api/portfolio.php          — list all
// POST   /api/portfolio.php          — create
// POST   /api/portfolio.php?id=X     — update
// DELETE /api/portfolio.php?id=X     — delete
// ============================================
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

switch ($method) {
    case 'GET':
        listItems();
        break;
    case 'POST':
        requireAuth();
        $id ? updateItem($id) : createItem();
        break;
    case 'DELETE':
        requireAuth();
        deleteItem($id);
        break;
    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}

function listItems() {
    $db = getDB();
    $rows = $db->query("SELECT * FROM portfolio_items ORDER BY sort_order ASC, created_at DESC")->fetchAll();

    foreach ($rows as &$row) {
        $row['tools'] = json_decode($row['tools'] ?? '[]', true);
        $row['order'] = (int)$row['sort_order'];
    }

    jsonResponse($rows);
}

function createItem() {
    $body = getJsonBody();
    $db = getDB();

    // Handle base64 image
    $imagePath = null;
    if (!empty($body['image']) && strpos($body['image'], 'data:image') === 0) {
        $imagePath = saveBase64Image($body['image'], 'portfolio');
    }

    // Handle base64 video
    $videoPath = null;
    if (!empty($body['video']) && strpos($body['video'], 'data:video') === 0) {
        $videoPath = saveBase64Video($body['video']);
    }

    $stmt = $db->prepare("INSERT INTO portfolio_items (title, description, category, tools, image_path, video_path, sort_order)
                          VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $body['title'] ?? '',
        $body['description'] ?? '',
        $body['category'] ?? 'design',
        json_encode($body['tools'] ?? [], JSON_UNESCAPED_UNICODE),
        $imagePath,
        $videoPath,
        (int)($body['order'] ?? 0)
    ]);

    jsonResponse(['success' => true, 'id' => $db->lastInsertId()]);
}

function updateItem($id) {
    $body = getJsonBody();
    $db = getDB();

    // Handle base64 image
    $imagePath = null;
    if (!empty($body['image']) && strpos($body['image'], 'data:image') === 0) {
        $imagePath = saveBase64Image($body['image'], 'portfolio');
    }

    // Handle base64 video
    $videoPath = null;
    if (!empty($body['video']) && strpos($body['video'], 'data:video') === 0) {
        $videoPath = saveBase64Video($body['video']);
    }

    $fields = "title=?, description=?, category=?, tools=?, sort_order=?";
    $params = [
        $body['title'] ?? '',
        $body['description'] ?? '',
        $body['category'] ?? 'design',
        json_encode($body['tools'] ?? [], JSON_UNESCAPED_UNICODE),
        (int)($body['order'] ?? 0)
    ];

    if ($imagePath) {
        $fields .= ", image_path=?";
        $params[] = $imagePath;
    }

    if ($videoPath) {
        $fields .= ", video_path=?";
        $params[] = $videoPath;
    }

    $params[] = $id;
    $stmt = $db->prepare("UPDATE portfolio_items SET $fields WHERE id=?");
    $stmt->execute($params);

    jsonResponse(['success' => true]);
}

function deleteItem($id) {
    if (!$id) jsonResponse(['error' => 'ID required'], 400);

    $db = getDB();
    $stmt = $db->prepare("SELECT image_path, video_path FROM portfolio_items WHERE id=?");
    $stmt->execute([$id]);
    $item = $stmt->fetch();
    if ($item) {
        if ($item['image_path'] && file_exists(__DIR__ . '/../' . $item['image_path'])) {
            unlink(__DIR__ . '/../' . $item['image_path']);
        }
        if (!empty($item['video_path']) && file_exists(__DIR__ . '/../' . $item['video_path'])) {
            unlink(__DIR__ . '/../' . $item['video_path']);
        }
    }

    $stmt = $db->prepare("DELETE FROM portfolio_items WHERE id=?");
    $stmt->execute([$id]);
    jsonResponse(['success' => true]);
}

function saveBase64Image($base64, $folder) {
    $uploadDir = __DIR__ . "/../uploads/$folder/";
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

    preg_match('/data:image\/(.*?);base64,(.*)/', $base64, $matches);
    if (count($matches) < 3) return null;

    $ext = $matches[1] === 'jpeg' ? 'jpg' : $matches[1];
    $data = base64_decode($matches[2]);
    $filename = time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;

    file_put_contents($uploadDir . $filename, $data);
    return "uploads/$folder/$filename";
}

function saveBase64Video($base64) {
    $uploadDir = __DIR__ . "/../uploads/portfolio/";
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

    if (preg_match('/data:video\/(.*?);base64,(.*)/', $base64, $matches)) {
        $ext = $matches[1];
        if ($ext === 'quicktime') $ext = 'mov';
        $data = base64_decode($matches[2]);
    } else {
        return null;
    }

    $filename = time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
    file_put_contents($uploadDir . $filename, $data);
    return "uploads/portfolio/$filename";
}
