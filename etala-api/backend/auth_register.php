<?php
// auth_register.php
require 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['success' => false, 'message' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents("php://input"), true);

if (!$input) {
    send_json(['success' => false, 'message' => 'Invalid JSON body'], 400);
}

// Basic fields
$email        = trim($input['email']        ?? '');
$password     = trim($input['password']     ?? '');
$first_name   = trim($input['first_name']   ?? '');
$last_name    = trim($input['last_name']    ?? '');
$middle_name  = trim($input['middle_name']  ?? '');
$gender       = trim($input['gender']       ?? '');
$civil_status = trim($input['civil_status'] ?? '');
$birthdate    = trim($input['birthdate']    ?? '');
$citizenship  = trim($input['citizenship']  ?? '');
$contact      = trim($input['contact']      ?? '');
$address      = trim($input['address']      ?? '');

if ($email === '' || $password === '' || $first_name === '' || $last_name === '') {
    send_json(['success' => false, 'message' => 'Missing required fields'], 400);
}

// Check if email already exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    $stmt->close();
    send_json(['success' => false, 'message' => 'Email already registered'], 409);
}
$stmt->close();

// Transaction: insert into users then residents
$conn->begin_transaction();

try {
    $hashed = password_hash($password, PASSWORD_BCRYPT);

    // Insert into users (role resident)
    $stmtUser = $conn->prepare("
        INSERT INTO users (role, email, password)
        VALUES ('resident', ?, ?)
    ");
    $stmtUser->bind_param("ss", $email, $hashed);

    if (!$stmtUser->execute()) {
        throw new Exception("User insert failed: " . $stmtUser->error);
    }

    $user_id = $stmtUser->insert_id;
    $stmtUser->close();

    // Insert into residents
    $stmtRes = $conn->prepare("
        INSERT INTO residents (
            user_id, first_name, last_name, middle_name,
            gender, civil_status, birthdate, citizenship,
            contact, address
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $stmtRes->bind_param(
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

    if (!$stmtRes->execute()) {
        throw new Exception("Resident insert failed: " . $stmtRes->error);
    }

    $resident_id = $stmtRes->insert_id;
    $stmtRes->close();

    $conn->commit();

    send_json([
        'success'     => true,
        'message'     => 'Registration successful',
        'user_id'     => $user_id,
        'resident_id' => $resident_id
    ], 201);

} catch (Exception $e) {
    $conn->rollback();
    send_json(['success' => false, 'message' => 'Registration failed', 'error' => $e->getMessage()], 500);
}
