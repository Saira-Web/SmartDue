// api.js
// Fetches questions from OpenTDB (Open Trivia Database).
// Exports fetchQuestions(level, amount)
// Get the questions from the database 
export async function getWebDevQuestions(amount = 10, difficulty = "easy") {
// The link to API gets the number of questions, the type, and the difficulty
  const url = `https://opentdb.com/api.php?amount=${amount}&type=multiple&difficulty=${difficulty}`;
  try {
    const res = await fetch(url);
  // if the request fails - move on to the catch error
    if (!res.ok) throw new Error("Failed to fetch questions");
  //If the request sent to API succeed
    const data = await res.json();
    return data.results.map(q => ({
      question: decodeHTML(q.question),
      correct: decodeHTML(q.correct_answer),
//shuffles the answers in random order
      answers: shuffleArray([...q.incorrect_answers.map(a => decodeHTML(a)), decodeHTML(q.correct_answer)])
    }));
  // catching the error if the try block fails, in case of an error we get the fallback questions
  } catch (err) {
    console.error(err);
    return fallbackQuestions();
  }
}
// Convert symbos into readable characters
//
function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}
// create an fuction take takes an array and shuffles the answer choices 
//return the shuffled array
function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function fallbackQuestions() {
  return [
    {
      question: "Which keyword declares a constant in JavaScript?",
      correct: "const",
      answers: ["var", "let", "static", "const"]
    },
    {
      question: "Which method converts JSON string to object?",
      correct: "JSON.parse",
      answers: ["JSON.stringify", "JSON.parse", "parseJSON", "toObject"]
    }
  ];
}