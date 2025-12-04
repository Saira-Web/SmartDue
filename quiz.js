// quiz.js
// Saira
// Handles quiz logic and fetching JS questions via API or local question bank

// This import the local question bank - questions.js file -
// This acts as a fallback if API does not return enough questions
import { questionBank } from "./questions.js";
//import { getWebDevQuestions } from "./api.js";

// ------------------ DOM References ------------------
// Gets the elements from HTML to manipulate quiz display and buttons
const params = new URLSearchParams(window.location.search);
const level = params.get("level") || "beginner";

const levelDisplay = document.getElementById("level-display");
const questionBox = document.getElementById("question-box");
const answersBox = document.getElementById("answers-box");
const nextBtn = document.getElementById("next-btn");
const resultScreen = document.getElementById("result-screen");
const scoreText = document.getElementById("score-text");
const retryBtn = document.getElementById("retry-btn");
const menuBtn = document.getElementById("menu-btn");
// This array holds the questions for the quiz
// index is the current questions index
// score is the current score of the user
let questions = [];
let index = 0;   //which question number we are on
let score = 0;

// The chosen level will be displayed
levelDisplay.textContent = `Level: ${level.toUpperCase()}`;

// ------------------ Helper Functions ------------------

// Shuffle array
// mix answers randomly by picking random index [i]
// and swap the value at position [i] + [j]
function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Decode HTML entities from API
// symbol like that can be decoded in text &quot;strict equal&quot;?"
function decodeHTML(html) {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

// Map levels to OpenTDB difficulty
function mapLevelToDifficulty(lvl) {
    switch(lvl.toLowerCase()) {
        case "beginner": return "easy";
        case "intermediate": return "medium";
        case "pro":
        case "advanced": return "hard";
        default: return "easy";
    }
}

// Fallback to local question bank
function fallbackJSQuestions(lvl) {
    lvl = lvl.toLowerCase();
    if (questionBank[lvl]) {
        return shuffleArray(questionBank[lvl]);
    } else {
        return shuffleArray(questionBank.beginner);
    }
}

// Fetch JS questions from OpenTDB
// category 18 - Computer - only JS related questions
// making an API request, checkes if succeeded, coverts the response to a JS object
async function fetchJSQuestions(amount = 15, difficulty = "easy") {
    const url = `https://opentdb.com/api.php?amount=${amount}&category=18&type=multiple&difficulty=${difficulty}`;
    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("API fetch failed");
        const data = await res.json();

        // Filter only JS-related questions
        let jsQuestions = data.results
            .map(q => ({
                question: decodeHTML(q.question),
                correct: decodeHTML(q.correct_answer),
                answers: shuffleArray([...q.incorrect_answers.map(a => decodeHTML(a)), decodeHTML(q.correct_answer)])
            }))
            .filter(q => q.question.toLowerCase().includes("javascript"));

        // Fill up to 10 questions if API gives less
        // If we get less thatn 10 questions, we use the fallbackQuestions
        if (jsQuestions.length < 10) {
            const fallback = fallbackJSQuestions(level);
            jsQuestions = jsQuestions.concat(fallback).slice(0, 10);
        }

        return jsQuestions.slice(0, 10);
    } catch (err) {
        console.error("Error fetching API questions:", err);
        return fallbackJSQuestions(level).slice(0, 10);
    }
}

// Quiz logig
// request 10 questions from Open TDB
// questions = await getWebDevQuestions(10, mapLevelToDifficulty(level));
async function initQuiz() {
    questions = await fetchJSQuestions(10, mapLevelToDifficulty(level));
    index = 0;  // starts at question number 0
    score = 0;  // reset the score

    resultScreen.classList.add("hidden");   //question is being diplayed
    questionBox.classList.remove("hidden"); // answer choice is being displayed
    answersBox.classList.remove("hidden");  // the result screen is hidden

    loadQuestion();
}

// The NEXT button is hidden until user select an answer
// clear the prev answer and hide the next button before loading the next question
function loadQuestion() {
    nextBtn.classList.add("hidden");
    answersBox.innerHTML = "";    // clear the answer from the previous answer
//Array holding all the questions, [index] the number wer are on
// Get the question and display it as Question 1 of 10
    const q = questions[index];
    questionBox.innerHTML = `<h3>Question ${index + 1} of ${questions.length}</h3><p>${q.question}</p>`;
// Formats the answers displayed and makes them clickable
    q.answers.forEach(answer => {
        const btn = document.createElement("button");
        btn.textContent = answer;
        btn.classList.add("answer-btn");
        btn.addEventListener("click", () => handleAnswer(answer, q.correct));
        answersBox.appendChild(btn);
    });
}

function handleAnswer(selected, correct) {
    if (selected === correct) score++;

    nextBtn.classList.remove("hidden");

    document.querySelectorAll(".answer-btn").forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correct) btn.style.background = "#90EE90"; // correct green
        if (btn.textContent === selected && selected !== correct) btn.style.background = "#FFB6C1"; // wrong pink
    });
}

nextBtn.addEventListener("click", () => {
    index++;
    if (index >= questions.length) showResults();
    else loadQuestion();
});

retryBtn.addEventListener("click", initQuiz);
menuBtn.addEventListener("click", () => window.location.href = "index.html");

function showResults() {
    questionBox.classList.add("hidden");
    answersBox.classList.add("hidden");
    nextBtn.classList.add("hidden");
    resultScreen.classList.remove("hidden");
    scoreText.textContent = `${score} / ${questions.length}`;
}

// Start the quiz
initQuiz();