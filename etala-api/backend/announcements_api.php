<?php
// announcements_api.php
require 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Public / resident announcements
        $result = $conn->query("
            SELECT id, title, content, image, posted_at
            FROM announcements
            ORDER BY posted_at DESC
        ");

        $rows = [];
        while ($row = $result->fetch_assoc()) {
            $rows[] = $row;
        }

        send_json(['success' => true, 'announcements' => $rows]);
        break;

    case 'POST':
        require_login('admin');

        $input = json_decode(file_get_contents("php://input"), true);
        if (!$input) send_json(['success' => false, 'message' => 'Invalid JSON'], 400);

        $title   = trim($input['title']   ?? '');
        $content = trim($input['content'] ?? '');
        $image   = trim($input['image']   ?? '');

        if ($title === '' || $content === '') {
            send_json(['success' => false, 'message' => 'Title and content required'], 400);
        }

        $admin_id = $_SESSION['user_id'];

        $stmt = $conn->prepare("
            INSERT INTO announcements (title, content, image, admin_id)
            VALUES (?, ?, ?, ?)
        ");
        $stmt->bind_param("sssi", $title, $content, $image, $admin_id);

        if ($stmt->execute()) {
            $id = $stmt->insert_id;
            $stmt->close();
            send_json(['success' => true, 'message' => 'Announcement added', 'id' => $id], 201);
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

        $id      = (int)($input['id'] ?? 0);
        $title   = trim($input['title']   ?? '');
        $content = trim($input['content'] ?? '');
        $image   = trim($input['image']   ?? '');

        if (!$id || $title === '' || $content === '') {
            send_json(['success' => false, 'message' => 'Missing id/title/content'], 400);
        }

        $stmt = $conn->prepare("
            UPDATE announcements
            SET title=?, content=?, image=?
            WHERE id=?
        ");
        $stmt->bind_param("sssi", $title, $content, $image, $id);

        if ($stmt->execute()) {
            $stmt->close();
            send_json(['success' => true, 'message' => 'Announcement updated']);
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
        $stmt = $conn->prepare("DELETE FROM announcements WHERE id=?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            $affected = $stmt->affected_rows;
            $stmt->close();

            if ($affected > 0) {
                send_json(['success' => true, 'message' => 'Announcement deleted']);
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
