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

// NOTE: Ensure your session variable for the current logged-in user is correct.
// We use $_SESSION["user_id"] which should hold the ID of the logged-in admin user.
$admin_id = $_SESSION["user_id"] ?? 1; // Fallback to 1 if user_id is missing

$title = $_POST["title"];
$content = $_POST["content"];
$image = null;
$has_image = false;

if (!empty($_FILES["image"]["tmp_name"])) {
    $image = file_get_contents($_FILES["image"]["tmp_name"]);
    $has_image = true;
}

if ($has_image) {
    $sql = "INSERT INTO announcements (title, content, image, admin_id) VALUES (?, ?, ?, ?)";
    $type_string = "ssbi"; // title(s), content(s), image(b), admin_id(i)
    $param_values = [&$title, &$content, &$image, &$admin_id];
} else {
    $sql = "INSERT INTO announcements (title, content, admin_id) VALUES (?, ?, ?)";
    $type_string = "ssi"; // title(s), content(s), admin_id(i)
    $param_values = [&$title, &$content, &$admin_id];
}

$stmt = $conn->prepare($sql);

if (!$stmt) {
    error_log("Prepare failed: " . $conn->error);
    echo json_encode(["success" => false, "message" => "DB preparation error."]);
    exit;
}

// Dynamic Binding Setup
$bind_args = array();
$bind_args[] = $type_string; 
foreach ($param_values as &$value) {
    $bind_args[] = &$value;
}

if (!call_user_func_array(array($stmt, 'bind_param'), $bind_args)) {
    error_log("Bind failed: " . $stmt->error);
    echo json_encode(["success" => false, "message" => "Database bind error: " . $stmt->error]);
    exit;
}

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Announcement posted successfully"]);
} else {
    error_log("Execute failed: " . $stmt->error);
    echo json_encode(["success" => false, "message" => "Failed to post announcement: " . $stmt->error]);
}
?>