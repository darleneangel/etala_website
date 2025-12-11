<?php
session_start();
include "./db_connect.php";

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if (!isset($_SESSION["role"]) || $_SESSION["role"] !== "admin") {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

if (!isset($_POST["id"])) {
    echo json_encode(["success" => false, "message" => "Missing announcement ID."]);
    exit;
}

$id = $_POST["id"];

$stmt = $conn->prepare("DELETE FROM announcements WHERE id = ?");

if (!$stmt) {
    error_log("Prepare failed: " . $conn->error);
    echo json_encode(["success" => false, "message" => "Database preparation failed."]);
    exit;
}

$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Announcement deleted successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "No announcement found with that ID."]);
    }
} else {
    error_log("Execute failed: " . $stmt->error);
    echo json_encode(["success" => false, "message" => "Delete failed: " . $stmt->error]);
}
?>