<?php
// emergency_contacts_api.php
require 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $result = $conn->query("
            SELECT id, contact_title, contact_number
            FROM emergency_contacts
            ORDER BY id ASC
        ");
        $rows = [];
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }
        send_json(['success' => true, 'contacts' => $rows]);
        break;

    case 'POST':
        require_login('admin');
        $input = json_decode(file_get_contents("php://input"), true);
        if (!$input) send_json(['success' => false, 'message' => 'Invalid JSON'], 400);

        $title  = trim($input['contact_title']  ?? '');
        $number = trim($input['contact_number'] ?? '');

        if ($title === '' || $number === '') {
            send_json(['success' => false, 'message' => 'Title and number required'], 400);
        }

        $stmt = $conn->prepare("
            INSERT INTO emergency_contacts (contact_title, contact_number)
            VALUES (?, ?)
        ");
        $stmt->bind_param("ss", $title, $number);

        if ($stmt->execute()) {
            $id = $stmt->insert_id;
            $stmt->close();
            send_json(['success' => true, 'message' => 'Contact added', 'id' => $id], 201);
        } else {
            $err = $stmt->error;
            $stmt->close();
            send_json(['success' => false, 'message' => 'Insert failed', 'error' => $err], 500);
        }
        break;

    case 'PUT':
        require_login('admin');
        $input = json_decode(file_get_contents("php://input"), true);
        if (!$input) send_json(['success' => false, 'message' => 'Invalid JSON'], 400);

        $id     = (int)($input['id'] ?? 0);
        $title  = trim($input['contact_title']  ?? '');
        $number = trim($input['contact_number'] ?? '');

        if (!$id || $title === '' || $number === '') {
            send_json(['success' => false, 'message' => 'Missing fields'], 400);
        }

        $stmt = $conn->prepare("
            UPDATE emergency_contacts
            SET contact_title=?, contact_number=?
            WHERE id=?
        ");
        $stmt->bind_param("ssi", $title, $number, $id);

        if ($stmt->execute()) {
            $stmt->close();
            send_json(['success' => true, 'message' => 'Contact updated']);
        } else {
            $err = $stmt->error;
            $stmt->close();
            send_json(['success' => false, 'message' => 'Update failed', 'error' => $err], 500);
        }
        break;

    case 'DELETE':
        require_login('admin');
        if (!isset($_GET['id'])) {
            send_json(['success' => false, 'message' => 'Missing id'], 400);
        }

        $id = (int)$_GET['id'];
        $stmt = $conn->prepare("DELETE FROM emergency_contacts WHERE id=?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            $affected = $stmt->affected_rows;
            $stmt->close();
            if ($affected > 0) {
                send_json(['success' => true, 'message' => 'Contact deleted']);
            } else {
                send_json(['success' => false, 'message' => 'Not found'], 404);
            }
        } else {
            $err = $stmt->error;
            $stmt->close();
            send_json(['success' => false, 'message' => 'Delete failed', 'error' => $err], 500);
        }
        break;

    default:
        send_json(['success' => false, 'message' => 'Method not allowed'], 405);
}
