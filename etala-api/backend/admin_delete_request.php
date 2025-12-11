<?php
session_start();
include "./db_connect.php";

// --- CORS & JSON Headers ---
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// --- 1. AUTHENTICATION ---
if (!isset($_SESSION["role"]) || $_SESSION["role"] !== "admin") {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

// --- 2. INPUT VALIDATION ---
if (!isset($_POST["request_id"])) {
    echo json_encode(["success" => false, "message" => "Missing request ID."]);
    exit;
}

$request_id = $_POST["request_id"];

// --- 3. DATABASE DELETE ---
// NOTE: Using 'id' as the primary key, consistent with the table schema.
$stmt = $conn->prepare("DELETE FROM requests WHERE id = ?");

if (!$stmt) {
    error_log("Prepare failed: (" . $conn->errno . ") " . $conn->error);
    echo json_encode(["success" => false, "message" => "Database preparation failed."]);
    exit;
}

$stmt->bind_param("i", $request_id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Request deleted successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "No request found with that ID."]);
    }
} else {
    error_log("Execute failed: " . $stmt->error);
    echo json_encode(["success" => false, "message" => "Delete failed: " . $stmt->error]);
}
?>