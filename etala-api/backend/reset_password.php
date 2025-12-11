<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

// DB connection
$conn = new mysqli("localhost", "root", "", "e_tala");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$email = $data["email"] ?? null;
$new_password = $data["password"] ?? null;

// Validate
if (!$email || !$new_password) {
    echo json_encode(["success" => false, "message" => "Missing required fields"]);
    exit;
}

// Hash the new password
$hashed = password_hash($new_password, PASSWORD_BCRYPT);

// Update password in `users` table
$stmt = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
$stmt->bind_param("ss", $hashed, $email);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["success" => true, "message" => "Password has been updated"]);
    } else {
        echo json_encode(["success" => false, "message" => "Email not found"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Failed to update password"]);
}

$stmt->close();
$conn->close();
?>
