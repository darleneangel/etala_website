<?php
session_start();
include "./db_connect.php"; // Using relative path matching the GET request file

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
if (!isset($_POST["request_id"]) || !isset($_POST["status"])) {
    echo json_encode(["success" => false, "message" => "Missing request ID or status parameter."]);
    exit;
}

$request_id = $_POST["request_id"];
$status = $_POST["status"];

// --- 3. DATABASE UPDATE ---
// The table uses 'id' as the primary key, not 'request_id'.
// Assume 'request_id' refers to the primary key 'id' in the request table.
$stmt = $conn->prepare("UPDATE requests SET status = ? WHERE id = ?");

if (!$stmt) {
    error_log("Prepare failed: (" . $conn->errno . ") " . $conn->error);
    echo json_encode(["success" => false, "message" => "Database preparation failed."]);
    exit;
}

$stmt->bind_param("si", $status, $request_id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Status updated successfully."]);
    } else {
        echo json_encode(["success" => true, "message" => "No rows updated (Status may already be set)."]);
    }
} else {
    error_log("Execute failed: " . $stmt->error);
    echo json_encode(["success" => false, "message" => "Failed to update status: " . $stmt->error]);
}
?>