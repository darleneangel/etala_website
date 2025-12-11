<?php
include "db_connect.php";

$admin_id = $_POST["admin_id"];
$action = $_POST["action"];
$details = $_POST["details"];

$stmt = $conn->prepare("
    INSERT INTO activity_logs (admin_id, action, details)
    VALUES (?, ?, ?)
");
$stmt->bind_param("iss", $admin_id, $action, $details);
$stmt->execute();

echo json_encode(["success" => true]);
?>
