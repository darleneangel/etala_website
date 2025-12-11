<?php
// db_connect.php

// --- CORS (adjust origin to your React dev URL) ---
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// --- DB CONNECTION (MySQLi) ---
$DB_HOST = "localhost";
$DB_USER = "root";
$DB_PASS = "";
$DB_NAME = "e_tala"; // <- make sure this matches your DB name

$conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);

if ($conn->connect_error) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed',
        'error'   => $conn->connect_error
    ]);
    exit;
}

$conn->set_charset("utf8mb4");

// --- SESSION ---
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// --- HELPER: send JSON ---
function send_json($data, int $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

// --- HELPER: require login ---
function require_login(?string $requiredRole = null) {
    if (empty($_SESSION['user_id'])) {
        send_json(['success' => false, 'message' => 'Not authenticated'], 401);
    }

    if ($requiredRole !== null && (!isset($_SESSION['role']) || $_SESSION['role'] !== $requiredRole)) {
        send_json(['success' => false, 'message' => 'Forbidden'], 403);
    }
}
