<?php
header("Content-Type: application/json");

try {
    $pdo = new PDO("mysql:host=127.0.0.1;dbname=quiz_app;charset=utf8mb4", "root", "", [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
    exit;
}

function jsonResponse($x) {
    echo json_encode($x);
    exit;
}
