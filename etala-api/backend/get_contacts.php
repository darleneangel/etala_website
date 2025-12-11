<?php
include "db_connect.php";

$result = $conn->query("SELECT * FROM emergency_contacts");
$contacts = [];

while ($row = $result->fetch_assoc()) {
    $contacts[] = $row;
}

echo json_encode($contacts);
?>
