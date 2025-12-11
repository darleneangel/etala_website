<?php
include "db_connect.php";

$data = json_decode(file_get_contents("php://input"), true);

$email = $data["email"];
$password = password_hash($data["password"], PASSWORD_DEFAULT);

// Resident fields
$first = $data["first_name"];
$last = $data["last_name"];
$middle = $data["middle_name"];
$gender = $data["gender"];
$civil = $data["civil_status"];
$birth = $data["birthdate"];
$citizen = $data["citizenship"];
$contact = $data["contact"];
$address = $data["address"];

// 1. Create user
$stmt = $conn->prepare("
    INSERT INTO users (role, email, password) 
    VALUES ('resident', ?, ?)
");
$stmt->bind_param("ss", $email, $password);

if (!$stmt->execute()) {
    echo json_encode(["success" => false, "message" => "Email already exists"]);
    exit;
}

$user_id = $conn->insert_id;

// 2. Create resident profile
$stmt2 = $conn->prepare("
    INSERT INTO residents (user_id, first_name, last_name, middle_name, gender,
    civil_status, birthdate, citizenship, contact, address)
    VALUES (?,?,?,?,?,?,?,?,?,?)
");
$stmt2->bind_param("isssssssss", $user_id, $first, $last, $middle, $gender,
    $civil, $birth, $citizen, $contact, $address);

$stmt2->execute();

echo json_encode(["success" => true, "message" => "Registration successful"]);
?>
