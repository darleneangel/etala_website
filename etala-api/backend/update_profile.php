<?php
// Fix CORS and Preflight
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

error_reporting(0);
ini_set('display_errors', 0);

session_start();

if (!isset($_SESSION["user_id"])) {
    echo json_encode(["success" => false, "message" => "Not logged in"]);
    exit;
}

$user_id = $_SESSION["user_id"];

$conn = new mysqli("localhost", "root", "", "e_tala");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database error"]);
    exit;
}

// Read text fields
$first_name    = $_POST["first_name"] ?? "";
$middle_name   = $_POST["middle_name"] ?? "";
$last_name     = $_POST["last_name"] ?? "";
$contact       = $_POST["contact"] ?? "";
$address       = $_POST["address"] ?? "";
$birthdate     = $_POST["birthdate"] ?? "";
$gender        = $_POST["gender"] ?? "";
$civil_status  = $_POST["civil_status"] ?? "";
$citizenship   = $_POST["citizenship"] ?? "";

// Handle Photo Upload
$photoData = NULL;
if (!empty($_FILES["photo"]["tmp_name"])) {
    $photoData = file_get_contents($_FILES["photo"]["tmp_name"]);
}

if ($photoData) {
    // Update WITH photo
    $sql = $conn->prepare("
        UPDATE residents SET
            first_name=?, middle_name=?, last_name=?, contact=?, address=?, 
            birthdate=?, gender=?, civil_status=?, citizenship=?, photo=?
        WHERE user_id=?
    ");
    $sql->bind_param("ssssssssssi", $first_name, $middle_name, $last_name, $contact, $address, $birthdate, $gender, $civil_status, $citizenship, $photoData, $user_id);
} else {
    // Update WITHOUT photo (keep existing)
    $sql = $conn->prepare("
        UPDATE residents SET
            first_name=?, middle_name=?, last_name=?, contact=?, address=?, 
            birthdate=?, gender=?, civil_status=?, citizenship=?
        WHERE user_id=?
    ");
    $sql->bind_param("sssssssssi", $first_name, $middle_name, $last_name, $contact, $address, $birthdate, $gender, $civil_status, $citizenship, $user_id);
}

if ($sql->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Update failed: " . $conn->error]);
}

$conn->close();
?>