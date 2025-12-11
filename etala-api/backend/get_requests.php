<?php
session_start();

// CORS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET");

if (!isset($_SESSION["user_id"])) {
    echo json_encode(["success" => false, "message" => "Not logged in"]);
    exit;
}

$user_id = $_SESSION["user_id"]; // USERS.ID

$conn = new mysqli("localhost", "root", "", "e_tala");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "DB connection failed"]);
    exit;
}

/*
   Your requests table uses resident_id but session stores user_id.
   So we must map users → residents.
*/

$lookup = $conn->prepare("SELECT id FROM residents WHERE user_id = ? LIMIT 1");
$lookup->bind_param("i", $user_id);
$lookup->execute();
$res = $lookup->get_result();

if ($res->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Resident record not found"]);
    exit;
}

$resident = $res->fetch_assoc();
$resident_id = $resident["id"];

// Fetch all requests for this resident
$sql = $conn->prepare("
    SELECT 
        id,
        request_type,
        purpose,
        notes,
        attachment,
        status,
        notes,
        date_requested
    FROM requests
    WHERE resident_id = ?
    ORDER BY date_requested DESC
");

$sql->bind_param("i", $resident_id);
$sql->execute();
$result = $sql->get_result();

$requests = [];
while ($row = $result->fetch_assoc()) {
    $requests[] = $row;
}

echo json_encode(["success" => true, "requests" => $requests]);

$sql->close();
$conn->close();
?>
