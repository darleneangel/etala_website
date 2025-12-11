<?php
// resident_profile.php
require 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Resident gets own profile by default
    if (isset($_GET['resident_id']) && $_SESSION['role'] === 'admin') {
        $resident_id = (int)$_GET['resident_id'];
    } else {
        require_login('resident');
        $resident_id = $_SESSION['resident_id'] ?? 0;
    }

    $stmt = $conn->prepare("
        SELECT r.*, u.email, u.role
        FROM residents r
        JOIN users u ON r.user_id = u.id
        WHERE r.id = ?
    ");
    $stmt->bind_param("i", $resident_id);
    $stmt->execute();
    $res = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$res) {
        send_json(['success' => false, 'message' => 'Resident not found'], 404);
    }

    send_json(['success' => true, 'resident' => $res]);
}

if ($method === 'PUT') {
    // Resident can edit own profile; admin can edit any
    $input = json_decode(file_get_contents("php://input"), true);
    if (!$input) {
        send_json(['success' => false, 'message' => 'Invalid JSON'], 400);
    }

    if (isset($_GET['resident_id']) && $_SESSION['role'] === 'admin') {
        $resident_id = (int)$_GET['resident_id'];
    } else {
        require_login('resident');
        $resident_id = $_SESSION['resident_id'] ?? 0;
    }

    $first_name   = trim($input['first_name']   ?? '');
    $last_name    = trim($input['last_name']    ?? '');
    $middle_name  = trim($input['middle_name']  ?? '');
    $gender       = trim($input['gender']       ?? '');
    $civil_status = trim($input['civil_status'] ?? '');
    $birthdate    = trim($input['birthdate']    ?? '');
    $citizenship  = trim($input['citizenship']  ?? '');
    $contact      = trim($input['contact']      ?? '');
    $address      = trim($input['address']      ?? '');

    $sql = "
        UPDATE residents
        SET first_name=?, last_name=?, middle_name=?,
            gender=?, civil_status=?, birthdate=?,
            citizenship=?, contact=?, address=?
        WHERE id=?
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param(
        "sssssssssi",
        $first_name,
        $last_name,
        $middle_name,
        $gender,
        $civil_status,
        $birthdate,
        $citizenship,
        $contact,
        $address,
        $resident_id
    );

    if ($stmt->execute()) {
        $stmt->close();
        send_json(['success' => true, 'message' => 'Profile updated']);
    } else {
        $err = $stmt->error;
        $stmt->close();
        send_json(['success' => false, 'message' => 'Update failed', 'error' => $err], 500);
    }
}

send_json(['success' => false, 'message' => 'Method not allowed'], 405);
