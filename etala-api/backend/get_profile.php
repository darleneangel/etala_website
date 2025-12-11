<?php
// Fix CORS and Preflight
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle Preflight Request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Suppress HTML warnings so they don't break JSON
error_reporting(0);
ini_set('display_errors', 0);

session_start();

if (!isset($_SESSION["user_id"])) {
    echo json_encode(["success" => false, "message" => "Not logged in (Session missing)"]);
    exit;
}

$user_id = $_SESSION["user_id"];

$conn = new mysqli("localhost", "root", "", "e_tala");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit;
}

// Fetch Profile
$sql = $conn->prepare("
    SELECT 
        users.email,
        residents.first_name,
        residents.middle_name,
        residents.last_name,
        residents.gender,
        residents.civil_status,
        residents.birthdate,
        residents.citizenship,
        residents.contact,
        residents.address,
        residents.photo
    FROM users
    LEFT JOIN residents ON users.id = residents.user_id
    WHERE users.id = ?
");

$sql->bind_param("i", $user_id);
$sql->execute();
$result = $sql->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Profile not found for ID: " . $user_id]);
    exit;
}

$profile = $result->fetch_assoc();

// Convert BLOB to Base64 for the frontend
if (!empty($profile["photo"])) {
    $profile["photo"] = "data:image/jpeg;base64," . base64_encode($profile["photo"]);
} else {
    $profile["photo"] = null;
}

echo json_encode(["success" => true, "profile" => $profile]);

$conn->close();
?>