<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

$conn = new mysqli("localhost", "root", "", "e_tala");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

$email = $_POST["email"] ?? "";
$password = $_POST["password"] ?? "";

$sql = $conn->prepare("SELECT id, password, role FROM users WHERE email = ?");
$sql->bind_param("s", $email);
$sql->execute();
$result = $sql->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Email not found"]);
    exit;
}

$user = $result->fetch_assoc();

if ($user["role"] !== "admin") {
    echo json_encode(["success" => false, "message" => "Access denied – not an admin"]);
    exit;
}

if (!password_verify($password, $user["password"])) {
    echo json_encode(["success" => false, "message" => "Incorrect password"]);
    exit;
}

// SUCCESS → Set session
$_SESSION["admin_id"] = $user["id"];
$_SESSION["role"] = "admin";

echo json_encode([
    "success" => true,
    "message" => "Admin login successful"
]);
?>
