<?php
require "db.php";

$id = $_GET["id"] ?? 0;

$q1 = $pdo->prepare("SELECT * FROM quizzes WHERE id = ?");
$q1->execute([$id]);
$quiz = $q1->fetch();

$q2 = $pdo->prepare("SELECT * FROM questions WHERE quiz_id = ?");
$q2->execute([$id]);
$questions = $q2->fetchAll();

jsonResponse([
    "success" => true,
    "quiz" => $quiz,
    "questions" => $questions
]);
