<?php
// requests_api.php
require 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {

    // 👉 RESIDENT + ADMIN: LIST
    case 'GET':
        require_login(); // any logged-in user

        if ($_SESSION['role'] === 'admin' && isset($_GET['resident_id'])) {
            $resident_id = (int)$_GET['resident_id'];
        } elseif ($_SESSION['role'] === 'resident') {
            $resident_id = $_SESSION['resident_id'];
        } else {
            // admin without resident_id: list all
            if ($_SESSION['role'] === 'admin') {
                $result = $conn->query("
                    SELECT r.id, r.request_type, r.purpose, r.status,
                           r.date_requested,
                           res.first_name, res.last_name
                    FROM requests r
                    JOIN residents res ON r.resident_id = res.id
                    ORDER BY r.date_requested DESC
                ");
                $rows = [];
                while ($row = $result->fetch_assoc()) {
                    $rows[] = $row;
                }
                send_json(['success' => true, 'requests' => $rows]);
            }
            send_json(['success' => false, 'message' => 'Bad request'], 400);
        }

        $stmt = $conn->prepare("
            SELECT id, request_type, purpose, status, admin_remarks, date_requested
            FROM requests
            WHERE resident_id = ?
            ORDER BY date_requested DESC
        ");
        $stmt->bind_param("i", $resident_id);
        $stmt->execute();
        $res = $stmt->get_result();
        $rows = [];
        while ($row = $res->fetch_assoc()) {
            $rows[] = $row;
        }
        $stmt->close();

        send_json(['success' => true, 'requests' => $rows]);
        break;

    // 👉 RESIDENT: CREATE REQUEST
    case 'POST':
        require_login('resident');

        $input = json_decode(file_get_contents("php://input"), true);
        if (!$input) {
            send_json(['success' => false, 'message' => 'Invalid JSON'], 400);
        }

        $resident_id  = $_SESSION['resident_id'];
        $request_type = trim($input['request_type'] ?? '');
        $purpose      = trim($input['purpose']      ?? '');

        if ($request_type === '' || $purpose === '') {
            send_json(['success' => false, 'message' => 'Missing fields'], 400);
        }

        $stmt = $conn->prepare("
            INSERT INTO requests (resident_id, request_type, purpose)
            VALUES (?, ?, ?)
        ");
        $stmt->bind_param("iss", $resident_id, $request_type, $purpose);

        if ($stmt->execute()) {
            $id = $stmt->insert_id;
            $stmt->close();
            send_json(['success' => true, 'message' => 'Request submitted', 'id' => $id], 201);
        } else {
            $err = $stmt->error;
            $stmt->close();
            send_json(['success' => false, 'message' => 'Insert failed', 'error' => $err], 500);
        }
        break;

    // 👉 ADMIN: UPDATE STATUS / REMARKS
    case 'PUT':
        require_login('admin');

        $input = json_decode(file_get_contents("php://input"), true);
        if (!$input) {
            send_json(['success' => false, 'message' => 'Invalid JSON'], 400);
        }

        $id            = (int)($input['id'] ?? 0);
        $status        = trim($input['status'] ?? '');
        $admin_remarks = trim($input['admin_remarks'] ?? '');

        if (!$id || $status === '') {
            send_json(['success' => false, 'message' => 'Missing id or status'], 400);
        }

        $stmt = $conn->prepare("
            UPDATE requests
            SET status = ?, admin_remarks = ?
            WHERE id = ?
        ");
        $stmt->bind_param("ssi", $status, $admin_remarks, $id);

        if ($stmt->execute()) {
            $stmt->close();
            send_json(['success' => true, 'message' => 'Request updated']);
        } else {
            $err = $stmt->error;
            $stmt->close();
            send_json(['success' => false, 'message' => 'Update failed', 'error' => $err], 500);
        }
        break;

    default:
        send_json(['success' => false, 'message' => 'Method not allowed'], 405);
}
