<?php
// ============================================
// Authentication API
// POST /api/auth.php?action=login
// POST /api/auth.php?action=logout
// GET  /api/auth.php?action=check
// ============================================
require_once 'config.php';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        handleLogin();
        break;
    case 'logout':
        handleLogout();
        break;
    case 'check':
        handleCheck();
        break;
    default:
        jsonResponse(['error' => 'Invalid action'], 400);
}

function handleLogin() {
    $body = getJsonBody();
    $email = trim($body['email'] ?? '');
    $password = $body['password'] ?? '';

    if (!$email || !$password) {
        jsonResponse(['error' => 'البريد وكلمة المرور مطلوبان'], 400);
    }

    $db = getDB();
    $stmt = $db->prepare("SELECT id, email, password_hash FROM admin_users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        jsonResponse(['error' => 'البريد الإلكتروني أو كلمة المرور غير صحيحة'], 401);
    }

    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_email'] = $user['email'];

    jsonResponse([
        'success' => true,
        'user' => ['id' => $user['id'], 'email' => $user['email']]
    ]);
}

function handleLogout() {
    session_destroy();
    jsonResponse(['success' => true]);
}

function handleCheck() {
    if (!empty($_SESSION['user_id'])) {
        jsonResponse([
            'authenticated' => true,
            'user' => ['id' => $_SESSION['user_id'], 'email' => $_SESSION['user_email']]
        ]);
    } else {
        jsonResponse(['authenticated' => false], 401);
    }
}
