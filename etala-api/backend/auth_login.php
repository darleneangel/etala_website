<?php
// auth_login.php
require 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['success' => false, 'message' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents("php://input"), true);
if (!$input) {
    send_json(['success' => false, 'message' => 'Invalid JSON'], 400);
}

$email    = trim($input['email']    ?? '');
$password = trim($input['password'] ?? '');

if ($email === '' || $password === '') {
    send_json(['success' => false, 'message' => 'Email and password required'], 400);
}

// Find user by email
$stmt = $conn->prepare("SELECT id, role, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user   = $result->fetch_assoc();
$stmt->close();

if (!$user || !password_verify($password, $user['password'])) {
    send_json(['success' => false, 'message' => 'Invalid credentials'], 401);
}

$_SESSION['user_id'] = $user['id'];
$_SESSION['role']    = $user['role'];

// If resident, get resident_id
$resident_id = null;
if ($user['role'] === 'resident') {
    $stmt = $conn->prepare("SELECT id FROM residents WHERE user_id = ?");
    $stmt->bind_param("i", $user['id']);
    $stmt->execute();
    $res = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if ($res) {
        $resident_id = $res['id'];
        $_SESSION['resident_id'] = $resident_id;
    }
}

send_json([
    'success'     => true,
    'message'     => 'Login successful',
    'user_id'     => (int)$user['id'],
    'role'        => $user['role'],
    'resident_id' => $resident_id
]);
