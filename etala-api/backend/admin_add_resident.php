<?php
session_start();
include "./db_connect.php";

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json"); // Ensure this is set for correct AJAX response

if (!isset($_SESSION["role"]) || $_SESSION["role"] !== "admin") {
 echo json_encode(["success" => false, "message" => "Unauthorized"]);
 exit;
}

// ----------------------------------------------------
// 1. COLLECT AND SANITIZE INPUTS
// ----------------------------------------------------
// User fields
$email = $_POST["email"];
$password = password_hash($_POST["password"], PASSWORD_DEFAULT);
$role  = "resident";

// Resident fields (9 string/date fields)
$first_name = $_POST["first_name"];
$middle_name= $_POST["middle_name"];
$last_name = $_POST["last_name"];
$gender  = $_POST["gender"];
$civil_status = $_POST["civil_status"];
$birthdate = $_POST["birthdate"]; // Bound as string 's' for DATE type
$citizenship = $_POST["citizenship"];
$contact= $_POST["contact"];
$address = $_POST["address"];

$photo = null;
if (!empty($_FILES["photo"]["tmp_name"])) {
    // Read file content for BLOB storage
 $photo = file_get_contents($_FILES["photo"]["tmp_name"]);
}

// ----------------------------------------------------
// 2. INSERT USER (Must be first to get user_id)
// ----------------------------------------------------
$stmt1 = $conn->prepare("INSERT INTO users (email, password, role) VALUES (?, ?, ?)");

if (!$stmt1) {
    error_log("User Prepare failed: " . $conn->error);
    echo json_encode(["success" => false, "message" => "DB Error (User Prep)"]);
    exit;
}

// Type string: sss (email, password, role)
$stmt1->bind_param("sss", $email, $password, $role);

if (!$stmt1->execute()) {
    error_log("User Execute failed: " . $stmt1->error);
    echo json_encode(["success" => false, "message" => "User creation failed (Check email uniqueness/DB)."]);
    exit;
}

$user_id = $stmt1->insert_id;

// ----------------------------------------------------
// 3. INSERT RESIDENT PROFILE
// ----------------------------------------------------
$sql_resident = "
 INSERT INTO residents 
 (user_id, first_name, middle_name, last_name, gender, civil_status, birthdate, citizenship, contact, address, photo)
 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
";

$stmt2 = $conn->prepare($sql_resident);

if (!$stmt2) {
    error_log("Resident Prepare failed: " . $conn->error);
    echo json_encode(["success" => false, "message" => "DB Error (Resident Prep)"]);
    exit;
}

// 11 placeholders: (user_id), (9 strings/dates), (photo blob)
// Type string: i (int user_id) + s x 9 + b (blob photo) = "isssssssssb"
$type_string = "isssssssssb";

$bind_args = array();
$bind_args[] = $type_string; // Type string

// Variables array (Must match placeholders exactly)
$param_values = [
    $user_id, // i
    $first_name, $middle_name, $last_name, // s x 3
    $gender, $civil_status, $birthdate, $citizenship, // s x 4
    $contact, $address, // s x 2 (Total 9 s's)
    $photo // b
];

// Pass all arguments by reference (required for call_user_func_array)
foreach ($param_values as &$value) {
    $bind_args[] = &$value;
}

// Execute bind_param using the references array
if (!call_user_func_array(array($stmt2, 'bind_param'), $bind_args)) {
    error_log("Resident Bind failed: " . $stmt2->error);
    // Attempt to roll back user insertion if resident insert fails
    $conn->query("DELETE FROM users WHERE id = $user_id"); 
    echo json_encode(["success" => false, "message" => "Database bind error (Resident profile)."]);
    exit;
}

if ($stmt2->execute()) {
 echo json_encode(["success" => true, "message" => "Resident added successfully"]);
} else {
    error_log("Resident Execute failed: " . $stmt2->error);
    // Roll back user insertion if resident insert fails
    $conn->query("DELETE FROM users WHERE id = $user_id"); 
 echo json_encode(["success" => false, "message" => "Failed to add resident"]);
}
?>