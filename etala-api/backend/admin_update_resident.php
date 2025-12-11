<?php
session_start();
include "./db_connect.php";

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json"); 

if (!isset($_SESSION["role"]) || $_SESSION["role"] !== "admin") {
 echo json_encode(["success" => false, "message" => "Unauthorized"]);
 exit;
}

if (empty($_POST["resident_id"])) {
    echo json_encode(["success" => false, "message" => "Resident ID is required."]);
    exit;
}

$resident_id = $_POST["resident_id"];
$first_name = $_POST["first_name"];
$middle_name= $_POST["middle_name"];
$last_name = $_POST["last_name"];
$gender  = $_POST["gender"];
$civil_status = $_POST["civil_status"];
$birthdate = $_POST["birthdate"];
$citizenship = $_POST["citizenship"];
$contact = $_POST["contact"];
$address = $_POST["address"];

$photo_param = null;
$photo_sql = "";
$has_new_photo = false; // Flag to track if we need to use send_long_data

if (!empty($_FILES["photo"]["tmp_name"])) {
    // Reading the file content
    $photo_param = file_get_contents($_FILES["photo"]["tmp_name"]);
 $photo_sql = ", photo = ?";
    $has_new_photo = true;
}

$sql = "
 UPDATE residents SET
first_name = ?, middle_name = ?, last_name = ?, gender = ?,
 civil_status = ?, birthdate = ?, citizenship = ?, contact = ?, address = ?
 $photo_sql
 WHERE id = ?
";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    error_log("Prepare failed: (" . $conn->errno . ") " . $conn->error);
    echo json_encode(["success" => false, "message" => "Database preparation error"]);
    exit;
}

// ----------------------------------------------------
// 1. Prepare Parameters for Binding
// ----------------------------------------------------

$type_string = "sssssssss"; // 9 's' for fixed text fields
$param_values = [
 $first_name, $middle_name, $last_name, $gender,
 $civil_status, $birthdate, $citizenship, $contact, $address
];
$blob_param_index = -1; // Index of the photo param if it exists

if ($has_new_photo) {
    $type_string .= "b"; // Use 'b' for BLOB type
    $param_values[] = null; // Use NULL as the placeholder value (instead of "")
    $blob_param_index = 9; // Photo is the 10th parameter (index 9)
} 

$type_string .= "i"; // 'i' for integer resident_id
$param_values[] = $resident_id; // Append the ID to be bound

// ----------------------------------------------------
// 2. Dynamic Binding using References (Standard Fields)
// ----------------------------------------------------
$bind_args = array();
$bind_args[] = $type_string; // First argument is the type string

// Pass all variables by reference
foreach ($param_values as &$value) {
    $bind_args[] = &$value;
}

// Bind the parameters
if (!call_user_func_array(array($stmt, 'bind_param'), $bind_args)) {
 error_log("Bind failed: " . $stmt->error);
 echo json_encode(["success" => false, "message" => "Database bind error"]);
 exit;
}

// ----------------------------------------------------
// 3. Handle BLOB Data Separately (Crucial Step for mediumblob)
// ----------------------------------------------------
if ($has_new_photo) {
    // If send_long_data fails, it's often due to MySQL's max_allowed_packet limit.
    // Ensure that your MySQL configuration allows large packets if this step fails.
    if (!$stmt->send_long_data($blob_param_index, $photo_param)) {
        error_log("Send long data failed: " . $stmt->error);
        echo json_encode(["success" => false, "message" => "Failed to send photo data to DB (Check max_allowed_packet)."]);
        exit;
    }
}


// ----------------------------------------------------
// 4. Execute
// ----------------------------------------------------
if ($stmt->execute()) {
    // If execution succeeds but the photo still doesn't appear, the issue is MySQL's size limit or corruption.
    echo json_encode(["success" => true, "message" => "Resident updated successfully"]);
} else {
    error_log("Execute failed: " . $stmt->error);
    echo json_encode(["success" => false, "message" => "Database execution failed"]);
}
?>