<?php
require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    jsonResponse(["success" => false, "message" => "No JSON input"]);
}

$title = $data["title"] ?? "";
$description = $data["description"] ?? "";
$questions = $data["questions"] ?? [];

if (!$title || empty($questions)) {
    jsonResponse(["success" => false, "message" => "Missing data"]);
}

try {
    // Insert quiz
    $stmt = $pdo->prepare("INSERT INTO quizzes (title, description) VALUES (?, ?)");
    $stmt->execute([$title, $description]);
    $quiz_id = $pdo->lastInsertId();

    // Insert questions
    $q = $pdo->prepare("INSERT INTO questions 
        (quiz_id, question_text, option_a, option_b, option_c, option_d, correct)
        VALUES (?, ?, ?, ?, ?, ?, ?)");

    foreach ($questions as $x) {
        $q->execute([
            $quiz_id,
            $x['question_text'],
            $x['option_a'],
            $x['option_b'],
            $x['option_c'],
            $x['option_d'],
            $x['correct']
        ]);
    }

    jsonResponse(["success" => true]);

} catch (Exception $e) {
    jsonResponse(["success" => false, "message" => $e->getMessage()]);
}
