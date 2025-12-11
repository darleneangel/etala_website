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

$sql = "
 SELECT 
 residents.id AS resident_id,
 users.id AS user_id,
 users.email,
 residents.first_name,
 residents.middle_name,
 residents.last_name,
 residents.gender,
 residents.civil_status,
 residents.birthdate,
 residents.citizenship,
  residents.contact,
 residents.address,
        -- Include photo data, encoded as Base64 for safe JSON transport
        TO_BASE64(residents.photo) AS photo_base64 
 FROM residents
 JOIN users ON users.id = residents.user_id
 ORDER BY residents.id DESC
";

$result = $conn->query($sql);

$residents = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        // Decode the photo_base64 string if necessary on the client side.
    $residents[] = $row;
    }
} else {
    error_log("SQL Error (admin_get_residents): " . $conn->error);
    echo json_encode(["success" => false, "message" => "Database query failed."]);
    exit;
}

echo json_encode(["success" => true, "residents" => $residents]);