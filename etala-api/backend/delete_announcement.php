<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");

if (!isset($_SESSION["user_id"]) || $_SESSION["role"] !== "admin") {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

$conn = new mysqli("localhost", "root", "", "e_tala");

$id = $_GET["id"] ?? 0;

$sql = $conn->prepare("DELETE FROM announcements WHERE id = ?");
$sql->bind_param("i", $id);
$sql->execute();

echo json_encode(["success" => true, "message" => "Announcement deleted"]);
$conn->close();
?>
