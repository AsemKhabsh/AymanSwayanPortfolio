<?php
// ============================================
// Database Setup - Run ONCE to create tables
// شغّل هذا الملف مرة واحدة فقط بعد رفع الموقع
// ============================================
require_once 'config.php';

try {
    $db = getDB();

    // Admin Users
    $db->exec("CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Site Content (hero, about, contact, settings)
    $db->exec("CREATE TABLE IF NOT EXISTS site_content (
        id INT AUTO_INCREMENT PRIMARY KEY,
        section VARCHAR(50) NOT NULL UNIQUE,
        data JSON,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Portfolio Items
    $db->exec("CREATE TABLE IF NOT EXISTS portfolio_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(50) DEFAULT 'design',
        tools JSON,
        image_path VARCHAR(500),
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Services
    $db->exec("CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        icon VARCHAR(100) DEFAULT 'fas fa-cog',
        skills JSON,
        category VARCHAR(50) DEFAULT 'design',
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Clients
    $db->exec("CREATE TABLE IF NOT EXISTS clients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        logo_path VARCHAR(500),
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Testimonials (آراء العملاء - مقاطع صوتية)
    $db->exec("CREATE TABLE IF NOT EXISTS testimonials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        position VARCHAR(255) NOT NULL,
        audio_path VARCHAR(500),
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

    // Add video_path to portfolio if not exists
    try {
        $db->exec("ALTER TABLE portfolio_items ADD COLUMN video_path VARCHAR(500) DEFAULT NULL AFTER image_path");
    } catch (Exception $e) {
        // Column may already exist
    }

    // Create uploads directory
    $uploadDir = __DIR__ . '/../uploads/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
        mkdir($uploadDir . 'portfolio/', 0755, true);
        mkdir($uploadDir . 'clients/', 0755, true);
        mkdir($uploadDir . 'images/', 0755, true);
        mkdir($uploadDir . 'testimonials/', 0755, true);
    }

    // Create default admin user
    $email = 'asemkhabash@gmail.com';
    $pass = password_hash('@sem018', PASSWORD_DEFAULT);
    $stmt = $db->prepare("INSERT IGNORE INTO admin_users (email, password_hash) VALUES (?, ?)");
    $stmt->execute([$email, $pass]);

    jsonResponse([
        'success' => true,
        'message' => 'تم إنشاء قاعدة البيانات والجداول بنجاح! يمكنك الآن تسجيل الدخول.',
        'admin_email' => $email
    ]);

} catch (Exception $e) {
    jsonResponse(['error' => 'Setup failed: ' . $e->getMessage()], 500);
}
