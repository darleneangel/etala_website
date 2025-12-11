<?php
include "db_connect.php";

$data = json_decode(file_get_contents("php://input"), true);
$title = $data["contact_title"];
$number = $data["contact_number"];

$stmt = $conn->prepare("
    INSERT INTO emergency_contacts (contact_title, contact_number)
    VALUES (?, ?)
");
$stmt->bind_param("ss", $title, $number);
$stmt->execute();

echo json_encode(["success" => true]);
?>
