<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include "./db_connect.php";

// Must be admin
if (!isset($_SESSION["role"]) || $_SESSION["role"] !== "admin") {
    echo json_encode(["success" => false, "message" => "Unauthorized"]);
    exit;
}

// 1. Total Residents
$res1 = $conn->query("SELECT COUNT(*) as total_residents FROM residents")->fetch_assoc();

// 2. Total Requests
$res2 = $conn->query("SELECT COUNT(*) as total_requests FROM requests")->fetch_assoc();

// 3. Requests per Status
$res3 = $conn->query("
    SELECT status, COUNT(*) AS count 
    FROM requests 
    GROUP BY status
");

$status_chart = [];
while ($row = $res3->fetch_assoc()) {
    $status_chart[$row["status"]] = $row["count"];
}

// 4. Latest 5 Requests
$latest = [];
$res4 = $conn->query("
    SELECT r.id, r.request_type, r.status, r.date_requested,
           CONCAT(res.first_name, ' ', res.last_name) AS resident_name
    FROM requests r
    JOIN residents res ON r.resident_id = res.id
    ORDER BY r.date_requested DESC
    LIMIT 5
");
while ($row = $res4->fetch_assoc()) $latest[] = $row;

// 5. Latest announcements
$ann = [];
$res5 = $conn->query("
    SELECT id, title, posted_at
    FROM announcements
    ORDER BY posted_at DESC
    LIMIT 3
");
while ($row = $res5->fetch_assoc()) $ann[] = $row;

echo json_encode([
    "success" => true,
    "stats" => [
        "total_residents" => $res1["total_residents"],
        "total_requests" => $res2["total_requests"],
        "status_chart" => $status_chart,
        "latest_requests" => $latest,
        "latest_announcements" => $ann
    ]
]);
?>
