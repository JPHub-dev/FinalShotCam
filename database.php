<?php
header('Content-Type: application/json; charset=utf-8');

$dbHost = '127.0.0.1';
$dbName = 'finalshoot';
$dbUser = 'root';
$dbPass = ''; // change this to your MySQL/MariaDB password

function db_connect() {
    global $dbHost, $dbName, $dbUser, $dbPass;
    $dsn = "mysql:host=$dbHost;dbname=$dbName;charset=utf8mb4";
    try {
        return new PDO($dsn, $dbUser, $dbPass, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    } catch (PDOException $ex) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed', 'details' => $ex->getMessage()]);
        exit;
    }
}

function send_json($status, $payload) {
    http_response_code($status);
    echo json_encode($payload);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(405, ['error' => 'Only POST requests are allowed']);
}

$action = strtolower(trim($_GET['action'] ?? $_POST['action'] ?? ''));
$email = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);
$password = trim($_POST['password'] ?? '');
$name = trim($_POST['name'] ?? '');

if (!$action) {
    send_json(400, ['error' => 'Missing action']);
}

if (!$email) {
    send_json(400, ['error' => 'A valid email is required']);
}

if (!$password) {
    send_json(400, ['error' => 'Password is required']);
}

$db = db_connect();

if ($action === 'signup') {
    if (!$name) {
        send_json(400, ['error' => 'Name is required for signup']);
    }

    $stmt = $db->prepare('SELECT id FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        send_json(409, ['error' => 'Email is already registered']);
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $db->prepare('INSERT INTO users (name, email, password_hash, created_at) VALUES (?, ?, ?, NOW())');
    $stmt->execute([$name, $email, $hash]);

    send_json(201, ['success' => true, 'message' => 'Account created successfully']);
}

if ($action === 'login') {
    $stmt = $db->prepare('SELECT id, name, password_hash FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        send_json(401, ['error' => 'Invalid email or password']);
    }

    session_start();
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['name'];

    send_json(200, ['success' => true, 'message' => 'Logged in successfully']);
}

send_json(400, ['error' => 'Unknown action']);
