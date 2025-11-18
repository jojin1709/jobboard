// ============================
// Load saved questions or use default
// ============================
let questions = JSON.parse(localStorage.getItem("quizQuestions")) || [
    {
        q: "What is 2 + 2?",
        options: ["1", "2", "4", "5"],
        correct: 2
    }
];

// Current question index and score
let current = 0;
let score = 0;
let selectedAnswer = null;


// ============================
// Start Quiz
// ============================
function startQuiz() {
    hideAll();
    document.getElementById("quiz-area").classList.remove("hidden");

    current = 0;
    score = 0;
    selectedAnswer = null;

    loadQuestion();
}


// ============================
// Load Question
// ============================
function loadQuestion() {
    const q = questions[current];

    document.getElementById("quiz-box").innerHTML = `
        <h2>${current + 1}. ${q.q}</h2>

        ${q.options.map((opt, i) =>
            `<button class="option-btn" onclick="selectOption(${i})">${opt}</button>`
        ).join("")}

        <button class="main-btn" onclick="nextQuestion()">Next</button>
    `;
}

function selectOption(i) {
    selectedAnswer = i;

    document.querySelectorAll(".option-btn").forEach((btn, idx) => {
        btn.classList.toggle("selected", idx === i);
    });
}


// ============================
// Next Question
// ============================
function nextQuestion() {
    if (selectedAnswer === null) {
        alert("Select an answer");
        return;
    }

    if (selectedAnswer === questions[current].correct) {
        score++;
    }

    selectedAnswer = null;
    current++;

    if (current >= questions.length) {
        showScore();
    } else {
        loadQuestion();
    }
}


// ============================
// Show Score
// ============================
function showScore() {
    hideAll();
    document.getElementById("score-area").classList.remove("hidden");

    document.getElementById("score-box").innerHTML = `
        <h2>Your Score</h2>
        <p>${score} / ${questions.length}</p>
    `;
}


// ============================
// Go Home
// ============================
function goHome() {
    hideAll();
    document.getElementById("home").classList.remove("hidden");
}

function hideAll() {
    document.getElementById("home").classList.add("hidden");
    document.getElementById("quiz-area").classList.add("hidden");
    document.getElementById("score-area").classList.add("hidden");
    document.getElementById("add-area").classList.add("hidden");
    document.getElementById("delete-area").classList.add("hidden");
}


// ============================
// Add Question Page
// ============================
function showAddQuestion() {
    hideAll();
    document.getElementById("add-area").classList.remove("hidden");
}

function saveQuestion() {
    const qText = document.getElementById("new-q").value;
    const a = document.getElementById("o1").value;
    const b = document.getElementById("o2").value;
    const c = document.getElementById("o3").value;
    const d = document.getElementById("o4").value;
    const correct = document.getElementById("correct").value;

    if (!qText || !a || !b || !c || !d) {
        alert("Fill all fields");
        return;
    }

    questions.push({
        q: qText,
        options: [a, b, c, d],
        correct: parseInt(correct)
    });

    localStorage.setItem("quizQuestions", JSON.stringify(questions));

    alert("Question Saved!");
    goHome();
}


// ============================
// Delete Question Screen
// ============================
function showDeleteScreen() {
    hideAll();
    document.getElementById("delete-area").classList.remove("hidden");

    loadDeleteList();
}

function loadDeleteList() {
    const list = document.getElementById("delete-list");

    if (questions.length === 0) {
        list.innerHTML = "<p>No questions to delete.</p>";
        return;
    }

    list.innerHTML = questions.map((q, index) => `
        <div style="padding:10px; margin-bottom:10px; background:#f6f6f6; border-radius:10px;">
            <strong>${index + 1}. ${q.q}</strong>
            <button onclick="deleteQuestion(${index})" 
                    style="float:right; padding:6px 12px; background:red; color:white; border:none; border-radius:6px; cursor:pointer;">
                Delete
            </button>
        </div>
    `).join("");
}

function deleteQuestion(index) {
    if (!confirm("Delete this question?")) return;

    questions.splice(index, 1);

    localStorage.setItem("quizQuestions", JSON.stringify(questions));

    loadDeleteList();
}
