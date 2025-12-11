<?php
session_start();
include "./db_connect.php";

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// --- 1. AUTHENTICATION (for Admin view) ---
if (!isset($_SESSION["role"]) || $_SESSION["role"] !== "admin") {
 echo json_encode(["success" => false, "message" => "Unauthorized"]);
 exit;
}

$sql = "
 SELECT 
 a.id,
 a.title,
 a.content,
 a.posted_at,
 a.admin_id,
 u.email AS admin_email,
        -- Fetch BLOB data encoded as Base64 for client display
 TO_BASE64(a.image) AS image_base64
 FROM announcements a
 JOIN users u ON a.admin_id = u.id
 ORDER BY a.posted_at DESC
";

$result = $conn->query($sql);

$announcements = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        // NOTE: The client side will need to handle data:image creation from image_base64
 $announcements[] = $row;
    }
} else {
    error_log("SQL Error (admin_announcements_get): " . $conn->error);
    echo json_encode(["success" => false, "message" => "Database query failed."]);
    exit;
}

echo json_encode(["success" => true, "announcements" => $announcements]);
?>