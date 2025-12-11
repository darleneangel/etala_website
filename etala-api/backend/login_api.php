<?php
session_start();
include "db_connect.php";

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$email = $data["email"] ?? "";
$password = $data["password"] ?? "";

// 1. Find user by email
$stmt = $conn->prepare("SELECT id, email, password, role FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "User not found"]);
    exit;
}

$user = $result->fetch_assoc();

// 2. Verify password
if (!password_verify($password, $user["password"])) {
    echo json_encode(["success" => false, "message" => "Incorrect password"]);
    exit;
}

// 3. Save session login
$_SESSION["user_id"] = $user["id"];
$_SESSION["role"] = $user["role"];

// 4. Response to frontend
echo json_encode([
    "success" => true,
    "user" => [
        "id" => $user["id"],
        "email" => $user["email"],
        "role" => $user["role"]
    ]
]);
?>
