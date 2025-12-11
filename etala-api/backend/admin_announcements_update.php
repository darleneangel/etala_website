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

if (empty($_POST["id"])) {
    echo json_encode(["success" => false, "message" => "Announcement ID is required."]);
    exit;
}

$id = $_POST["id"];
$title = $_POST["title"];
$content = $_POST["content"];

$photo_param = null;
$photo_sql = "";
$has_new_photo = false; 

// Initial bindings: title, content
$type_string = "ss"; 
$param_values = [&$title, &$content];
$blob_param_index = -1; 

if (!empty($_FILES["image"]["tmp_name"])) {
    $photo_param = file_get_contents($_FILES["image"]["tmp_name"]);
    $photo_sql = ", image = ?";
    $has_new_photo = true;
}

$sql = "
 UPDATE announcements SET
 title = ?, content = ?
 $photo_sql
 WHERE id = ?
";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    error_log("Prepare failed: " . $conn->error);
    echo json_encode(["success" => false, "message" => "Database preparation error"]);
    exit;
}

// ----------------------------------------------------
// 1. Finalize Parameter List and Type String
// ----------------------------------------------------
if ($has_new_photo) {
    $type_string .= "b"; // Add 'b' for the photo (BLOB)
    $param_values[] = null; // Placeholder value for BLOB
    $blob_param_index = 2; // Index of the photo param (0, 1, 2)
} 

$type_string .= "i"; // 'i' for integer id
$param_values[] = &$id; // Append the ID (Must be reference for call_user_func_array)


// ----------------------------------------------------
// 2. Dynamic Binding using References 
// ----------------------------------------------------
$bind_args = array();
$bind_args[] = $type_string; 

// Note: title, content, image, and id are already set by reference in $param_values
// and the initial setup of &$title, &$content. We rebuild $bind_args carefully.
foreach ($param_values as &$value) {
    $bind_args[] = &$value;
}

if (!call_user_func_array(array($stmt, 'bind_param'), $bind_args)) {
 error_log("Bind failed: " . $stmt->error);
 echo json_encode(["success" => false, "message" => "Database bind error"]);
 exit;
}

// ----------------------------------------------------
// 3. Handle BLOB Data Separately 
// ----------------------------------------------------
if ($has_new_photo) {
    if (!$stmt->send_long_data($blob_param_index, $photo_param)) {
        error_log("Send long data failed: " . $stmt->error);
        echo json_encode(["success" => false, "message" => "Photo save failed (BLOB issue)."]);
        exit;
    }
}


// ----------------------------------------------------
// 4. Execute
// ----------------------------------------------------
if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Announcement updated successfully"]);
} else {
    error_log("Execute failed: " . $stmt->error);
    echo json_encode(["success" => false, "message" => "Database execution failed"]);
}
?>