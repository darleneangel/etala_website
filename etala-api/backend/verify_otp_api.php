<?php
header("Content-Type: application/json");
require_once "db_connection.php";

$data = json_decode(file_get_contents("php://input"), true);

$email = $data["email"] ?? "";
$otp   = $data["otp"] ?? "";

// Validate
$stmt = $conn->prepare("
    SELECT id, otp, otp_expiry 
    FROM users 
    WHERE email = ?
");
$stmt->bind_param("s", $email);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "Invalid email"]);
    exit;
}

$user = $res->fetch_assoc();

// Check OTP
if ($user["otp"] !== $otp) {
    echo json_encode(["status" => "error", "message" => "Incorrect OTP"]);
    exit;
}

// Check if expired
if (strtotime($user["otp_expiry"]) < time()) {
    echo json_encode(["status" => "error", "message" => "OTP has expired"]);
    exit;
}

echo json_encode(["status" => "success", "message" => "OTP verified"]);
