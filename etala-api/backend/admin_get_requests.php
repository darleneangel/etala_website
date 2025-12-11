<?php
session_start();
include "./db_connect.php"; // Adjust include path if necessary

// --- CORS & JSON Headers ---
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// --- 1. AUTHENTICATION ---
if (!isset($_SESSION["role"]) || $_SESSION["role"] !== "admin") {
 echo json_encode(["success" => false, "message" => "Unauthorized"]);
 exit;
}

// --- 2. DATABASE QUERY ---
$sql = "
 SELECT 
 r.id AS request_id,
 r.resident_id,
 CONCAT(res.first_name, ' ', res.last_name) AS full_name,
 r.request_type,
 r.purpose AS description, -- Map 'purpose' from SQL to 'description' for React component
 r.status,
 r.date_requested,
 r.admin_remarks
 FROM requests r
 JOIN residents res ON r.resident_id = res.id -- Assuming residents primary key is 'id'
 ORDER BY r.date_requested DESC
";

// Use simple query since no user-supplied variables are used in the WHERE clause
$result = $conn->query($sql);

$requests = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
    $requests[] = $row;
    }
} else {
    // Log the error for server-side debugging
    error_log("SQL Error (admin_get_requests): " . $conn->error); 
    echo json_encode(["success" => false, "message" => "Database query failed: " . $conn->error]);
    exit;
}

// --- 3. FINAL RESPONSE ---
echo json_encode(["success" => true, "requests" => $requests]);
?>