<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json");

// DATABASE CONNECTION
$conn = new mysqli("localhost", "root", "", "e_tala");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit;
}

// READ JSON INPUT
$data = json_decode(file_get_contents("php://input"), true);

// REQUIRED FIELDS
$required = [
    "email", "password", "first_name", "last_name", "middle_name",
    "gender", "civil_status", "birthdate", "citizenship", "contact", "address"
];

// CHECK MISSING FIELDS
foreach ($required as $field) {
    if (!isset($data[$field]) || trim($data[$field]) === "") {
        echo json_encode(["success" => false, "message" => "$field is required"]);
        exit;
    }
}

// SANITIZE INPUT
$email          = $conn->real_escape_string($data['email']);
$password_hash  = password_hash($data['password'], PASSWORD_BCRYPT);
$first_name     = $conn->real_escape_string($data['first_name']);
$last_name      = $conn->real_escape_string($data['last_name']);
$middle_name    = $conn->real_escape_string($data['middle_name']);
$gender         = $conn->real_escape_string($data['gender']);
$civil_status   = $conn->real_escape_string($data['civil_status']);
$birthdate      = $conn->real_escape_string($data['birthdate']);
$citizenship    = $conn->real_escape_string($data['citizenship']);
$contact        = $conn->real_escape_string($data['contact']);
$address        = $conn->real_escape_string($data['address']);

// START TRANSACTION
$conn->begin_transaction();

try {

    // 1️⃣ INSERT INTO USERS TABLE
    $stmt = $conn->prepare("INSERT INTO users (email, password, role) VALUES (?, ?, 'resident')");
    $stmt->bind_param("ss", $email, $password_hash);

    if (!$stmt->execute()) {
        if ($conn->errno == 1062) { // duplicate email
            echo json_encode(["success" => false, "message" => "Email already exists"]);
            exit;
        }
        throw new Exception("User insert failed: " . $stmt->error);
    }

    $user_id = $stmt->insert_id;
    $stmt->close();

    // 2️⃣ INSERT RESIDENT DETAILS
    $stmt2 = $conn->prepare("
        INSERT INTO residents 
        (user_id, first_name, last_name, middle_name, gender, civil_status, birthdate, citizenship, contact, address)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    if (!$stmt2) {
        throw new Exception("Prepare failed: " . $conn->error);
    }

    // FIXED BINDING — EXACT 1 INT + 9 STRINGS
    $stmt2->bind_param(
        "isssssssss",
        $user_id,
        $first_name,
        $last_name,
        $middle_name,
        $gender,
        $civil_status,
        $birthdate,
        $citizenship,
        $contact,
        $address
    );

    if (!$stmt2->execute()) {
        throw new Exception("Resident insert failed: " . $stmt2->error);
    }

    $stmt2->close();

    // COMMIT SUCCESS
    $conn->commit();

    echo json_encode(["success" => true, "message" => "Registration successful"]);
    exit;

} catch (Exception $e) {

    // ROLLBACK ON ERROR
    $conn->rollback();

    error_log("REGISTER ERROR: " . $e->getMessage());

    echo json_encode([
        "success" => false,
        "message" => "Server error. Please try again later."
    ]);
    exit;
}

?>
