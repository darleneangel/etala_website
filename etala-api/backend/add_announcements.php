<?php
include "db_connect.php";

$data = json_decode(file_get_contents("php://input"), true);

$title = $data["title"];
$content = $data["content"];
$image = $data["image"];
$admin_id = $data["admin_id"];

$stmt = $conn->prepare("
    INSERT INTO announcements (title, content, image, admin_id)
    VALUES (?, ?, ?, ?)
");
$stmt->bind_param("sssi", $title, $content, $image, $admin_id);
$stmt->execute();

echo json_encode(["success" => true]);
?>
