<?php
session_start();

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");

if (isset($_SESSION["admin_id"])) {
    echo json_encode(["logged_in" => true, "admin_id" => $_SESSION["admin_id"]]);
} else {
    echo json_encode(["logged_in" => false]);
}
?>
