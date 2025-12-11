<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "e_tala");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit;
}

$sql = "
    SELECT a.id, a.title, a.content, a.image, a.posted_at, u.email AS admin_email
    FROM announcements a
    JOIN users u ON a.admin_id = u.id
    ORDER BY a.posted_at DESC
";

$result = $conn->query($sql);

$announcements = [];
while ($row = $result->fetch_assoc()) {
    $announcements[] = $row;
}

echo json_encode(["success" => true, "announcements" => $announcements]);
$conn->close();
?>
