<?php
include "db_connect.php";

$data = json_decode(file_get_contents("php://input"), true);

$email = $data["email"];    
$password = $data["password"];

$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();

$result = $stmt->get_result();
if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "User not found"]);
    exit;
}

$user = $result->fetch_assoc();

if (!password_verify($password, $user["password"])) {
    echo json_encode(["success" => false, "message" => "Invalid password"]);
    exit;
}

echo json_encode([
    "success" => true,
    "role" => $user["role"],
    "user_id" => $user["id"]
]);
?>
