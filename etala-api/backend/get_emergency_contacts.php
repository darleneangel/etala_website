<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Credentials: true");

$conn = new mysqli("localhost", "root", "", "e_tala");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB error"]);
    exit;
}

$query = $conn->query("SELECT * FROM emergency_contacts ORDER BY id DESC");

$contacts = [];
while ($row = $query->fetch_assoc()) {
    $contacts[] = $row;
}

echo json_encode(["success" => true, "contacts" => $contacts]);
$conn->close();
?>
