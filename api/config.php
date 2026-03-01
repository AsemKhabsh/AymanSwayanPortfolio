<?php
// ============================================
// Database Configuration
// عدّل هذه البيانات حسب استضافتك على Hostinger
// ============================================

define('DB_HOST', 'localhost');
define('DB_NAME', 'u123456789_portfolio'); // غيّر هذا
define('DB_USER', 'u123456789_admin');     // غيّر هذا
define('DB_PASS', 'YourPassword123!');     // غيّر هذا

// Upload settings
define('UPLOAD_DIR', __DIR__ . '/../uploads/');
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB

// Session settings
session_start();

// CORS headers (for local development)
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Database connection
function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            $pdo = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
                ]
            );
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database connection failed']);
            exit;
        }
    }
    return $pdo;
}

// Helper: JSON response
function jsonResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Helper: Check auth
function requireAuth() {
    if (empty($_SESSION['user_id'])) {
        jsonResponse(['error' => 'غير مصرّح'], 401);
    }
}

// Helper: Get JSON body
function getJsonBody() {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}
