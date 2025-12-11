<?php
// send_otp.php

// ---- CORS & headers ----
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight (OPTIONS) quickly
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ---- Turn on error logging (but not display) ----
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/send_otp_error.log');

// ---- Load PHPMailer (paths must be correct!) ----
require __DIR__ . "/PHPMailer-master/src/PHPMailer.php";
require __DIR__ . "/PHPMailer-master/src/SMTP.php";
require __DIR__ . "/PHPMailer-master/src/Exception.php";


use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// ---- Read JSON body ----
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

$email = $data["email"] ?? null;

if (!$email) {
    echo json_encode(["success" => false, "message" => "Email is required"]);
    exit;
}

// ---- Generate 6-digit OTP ----
$otp = random_int(100000, 999999);

// ---- Configure Mailer ----
$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = "smtp.gmail.com";
    $mail->SMTPAuth = true;

    // ⚠️ Replace with YOUR real Gmail + app password
    $mail->Username = "lustredarlene45@gmail.com";
    $mail->Password = "yulm hvme cznp amqa"; // your 16-char app password

    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // FROM + TO
    $mail->setFrom("lustredarlene45@gmail.com", "E-TALA System");
    $mail->addAddress($email);

    // Email content
    $mail->isHTML(true);
    $mail->Subject = "Your E-TALA Password Reset Code";
    $mail->Body = "
        <h2>Your OTP Code</h2>
        <p>Use this 6-digit code to reset your password:</p>
        <h1><b>$otp</b></h1>
        <p>This code expires in 5 minutes.</p>
    ";

    $mail->send();

    // ✅ For now, also return OTP in JSON so Verify page can compare
    echo json_encode([
        "success" => true,
        "message" => "OTP sent to email.",
        "otp" => $otp
    ]);
} catch (Exception $e) {
    error_log("Mailer error: " . $mail->ErrorInfo);
    echo json_encode([
        "success" => false,
        "message" => "Mailer error: " . $mail->ErrorInfo
    ]);
}
