<?php
require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$quiz_id = $data["quiz_id"] ?? 0;
$answers = $data["answers"] ?? [];

$q = $pdo->prepare("SELECT * FROM questions WHERE quiz_id = ?");
$q->execute([$quiz_id]);
$questions = $q->fetchAll();

$score = 0;
$total = count($questions);

foreach ($questions as $qn) {
    $qid = $qn["id"];
    if (isset($answers[$qid]) && $answers[$qid] == $qn["correct"]) {
        $score++;
    }
}

jsonResponse(["success" => true, "score" => $score, "total" => $total]);
