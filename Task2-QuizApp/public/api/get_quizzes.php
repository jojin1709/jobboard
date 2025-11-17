<?php
require "db.php";

header("Content-Type: application/json");

try {
    $stmt = $pdo->query("SELECT id, title, description FROM quizzes ORDER BY id DESC");
    $quizzes = $stmt->fetchAll();

    echo json_encode([
        "success" => true,
        "quizzes" => $quizzes
    ]);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage(),
        "quizzes" => []
    ]);
}
