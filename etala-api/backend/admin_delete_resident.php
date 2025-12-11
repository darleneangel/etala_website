<?php
session_start();
include "./db_connect.php";

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");

if ($_SESSION["role"] !== "admin") {
    echo json_encode(["success" => false]);
    exit;
}

$resident_id = $_POST["resident_id"];

// Find the user_id
$stmt1 = $conn->prepare("SELECT user_id FROM residents WHERE id = ?");
$stmt1->bind_param("i", $resident_id);
$stmt1->execute();
$res = $stmt1->get_result()->fetch_assoc();

$user_id = $res["user_id"];

// Delete user → auto deletes resident (ON DELETE CASCADE)
$stmt2 = $conn->prepare("DELETE FROM users WHERE id = ?");
$stmt2->bind_param("i", $user_id);
$stmt2->execute();

echo json_encode(["success" => true]);
?>
