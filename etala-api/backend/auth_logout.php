<?php
// auth_logout.php
require 'db_connect.php';

session_unset();
session_destroy();

send_json(['success' => true, 'message' => 'Logged out']);
