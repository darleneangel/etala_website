<?php
header("Content-Type: application/json");
require_once "db_connection.php";

$data = json_decode(file_get_contents("php://input"), true);
$email = $data["email"] ?? "";

if (!$email) {
    echo json_encode(["status" => "error", "message" => "Email is required"]);
    exit;
}

// Check if user exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => "error", "message" => "Email not found"]);
    exit;
}

$user = $result->fetch_assoc();
$user_id = $user["id"];

// Generate OTP
$otp = rand(100000, 999999);
$expiry = date("Y-m-d H:i:s", strtotime("+10 minutes"));

// Save OTP to database
$update = $conn->prepare("UPDATE users SET otp=?, otp_expiry=? WHERE id=?");
$update->bind_param("ssi", $otp, $expiry, $user_id);
$update->execute();

// ⚠️ For testing: return OTP (REMOVE IN PRODUCTION)
echo json_encode([
    "status" => "success",
    "message" => "OTP sent",
    "otp" => $otp  // REMOVE LATER
]);
