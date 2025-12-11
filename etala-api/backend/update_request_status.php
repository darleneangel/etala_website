<?php
include "db_connect.php";

$data = json_decode(file_get_contents("php://input"), true);

$request_id = $data["id"];
$status = $data["status"];
$remarks = $data["remarks"];

$stmt = $conn->prepare("
    UPDATE requests SET status = ?, admin_remarks = ? WHERE id = ?
");
$stmt->bind_param("ssi", $status, $remarks, $request_id);
$stmt->execute();

echo json_encode(["success" => true]);
?>
