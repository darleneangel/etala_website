<?php
session_start();

// CORS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Preflight
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit();
}

// Database
$conn = new mysqli("localhost", "root", "", "e_tala");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit;
}

// Must be logged in
if (!isset($_SESSION["user_id"])) {
    echo json_encode(["success" => false, "message" => "You must be logged in"]);
    exit;
}

$user_id = $_SESSION["user_id"];

// ⭐ GET resident_id FROM residents TABLE
$resQuery = $conn->prepare("SELECT id FROM residents WHERE user_id = ? LIMIT 1");
$resQuery->bind_param("i", $user_id);
$resQuery->execute();
$resResult = $resQuery->get_result();

if ($resResult->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Resident profile not found"]);
    exit;
}

$resident = $resResult->fetch_assoc();
$resident_id = $resident["id"];

// ⭐ Get form fields
$request_type = $_POST["service_type"] ?? null;
$purpose = $_POST["purpose"] ?? null;
$notes = $_POST["notes"] ?? "";

// Validate fields
if (!$request_type || !$purpose) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

// ⭐ Handle file upload
$attachment_path = null;

if (!empty($_FILES["file"]["name"])) {
    $uploadDir = "uploads/";
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0777, true);

    $filename = time() . "_" . basename($_FILES["file"]["name"]);
    $targetPath = $uploadDir . $filename;

    if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetPath)) {
        $attachment_path = $targetPath;
    }
}

// ⭐ Insert into requests table
$stmt = $conn->prepare("
    INSERT INTO requests (resident_id, request_type, purpose, notes, attachment, status)
    VALUES (?, ?, ?, ?, ?, 'Pending')
");

$stmt->bind_param("issss", $resident_id, $request_type, $purpose, $notes, $attachment_path);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Request submitted successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Database insertion error"]);
}

$stmt->close();
$conn->close();
?>
