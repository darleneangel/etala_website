<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

$conn = new mysqli("localhost", "root", "", "e_tala");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB error"]);
    exit;
}

$title = $_POST["title"] ?? "";
$content = $_POST["content"] ?? "";
$imagePath = null;

// Handle image upload
if (!empty($_FILES["image"]["name"])) {
    $fileName = time() . "_" . basename($_FILES["image"]["name"]);
    $target = "uploads/" . $fileName;
    move_uploaded_file($_FILES["image"]["tmp_name"], $target);
    $imagePath = $target;
}

$sql = $conn->prepare("INSERT INTO announcements (title, content, image, admin_id) VALUES (?, ?, ?, ?)");
$sql->bind_param("sssi", $title, $content, $imagePath, $_SESSION["user_id"]);
$sql->execute();

echo json_encode(["success" => true, "message" => "Announcement posted!"]);
$conn->close();
?>
