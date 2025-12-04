// classes.js        
// Saira
// Creates a new object witht the clss question
// A template to make question object

// This class is not being used at all
export class Question {
  constructor({ question, correct, incorrect }) {
    this.question = question;
    this.correct = correct;
    this.incorrect = incorrect.slice(); // copy array
  }

  // return shuffled answers array
  getShuffledAnswers() {
    const arr = [...this.incorrect, this.correct]; 
    return shuffleArray(arr);
  }

  isCorrect(answer) {
    return answer === this.correct;
  }
}

// TimedQuestion extends Question and adds a per-question timer
export class TimedQuestion extends Question {
  constructor(data, timeLimit = 20) {
    super(data);
    this.timeLimit = timeLimit;
    this.timeRemaining = timeLimit;
  }

  tick() {
    this.timeRemaining = Math.max(0, this.timeRemaining - 1);
    return this.timeRemaining;
  }

  resetTimer() {
    this.timeRemaining = this.timeLimit;
  }
}

// small shuffle helper
function shuffleArray(a) {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
