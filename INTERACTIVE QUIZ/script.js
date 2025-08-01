const quizData = [
  {
    question: "1. What does HTML stand for?",
    options: [
      "Hyperlinks and Text Markup Language",
      "Home Tool Markup Language",
      "Hyper Text Markup Language",
      "Hyper Transfer Machine Language"
    ],
    answer: "Hyper Text Markup Language"
  },
  {
    question: "2. Which language is used for styling web pages?",
    options: [
      "HTML",
      "JQuery",
      "CSS",
      "XML"
    ],
    answer: "CSS"
  },
  {
    question: "3. Inside which HTML element do we put the JavaScript?",
    options: [
      "<js>",
      "<javascript>",
      "<script>",
      "<code>"
    ],
    answer: "<script>"
  },
  {
    question: "4. Which is not a JavaScript data type?",
    options: [
      "String",
      "Boolean",
      "Float",
      "Undefined"
    ],
    answer: "Float"
  },
  {
    question: "5. What does CSS stand for?",
    options: [
      "Cascading Style Sheets",
      "Colorful Style Sheets",
      "Computer Style Sheets",
      "Creative Style Syntax"
    ],
    answer: "Cascading Style Sheets"
  }
];

let currentQuestion = 0;
let userName = "";
let timeLeft = 60;
let timer;
let submitted = false;

const form = document.getElementById("quiz-form");
const loginSection = document.getElementById("login-section");
const quizSection = document.getElementById("quiz-section");
const timerDisplay = document.getElementById("timer");
const resultBox = document.getElementById("result");
const historyBox = document.getElementById("history");

document.getElementById("start-btn").addEventListener("click", () => {
  const input = document.getElementById("username");
  if (input.value.trim() === "") return alert("Please enter your name");
  userName = input.value.trim();
  loginSection.style.display = "none";
  quizSection.style.display = "block";
  renderQuiz();
  showQuestion(currentQuestion);
  startTimer();
  loadHistory();
});

function renderQuiz() {
  form.innerHTML = "";
  quizData.forEach((item, index) => {
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question");
    const title = document.createElement("h3");
    title.textContent = item.question;
    questionDiv.appendChild(title);

    item.options.forEach(option => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = `q${index}`;
      input.value = option;
      label.appendChild(input);
      label.append(option);
      questionDiv.appendChild(label);
    });

    form.appendChild(questionDiv);
  });
}

function showQuestion(index) {
  const questions = document.querySelectorAll(".question");
  questions.forEach((q, i) => {
    q.style.display = i === index ? "block" : "none";
  });
}

document.getElementById("next-btn").addEventListener("click", () => {
  if (currentQuestion < quizData.length - 1) {
    currentQuestion++;
    showQuestion(currentQuestion);
  }
});

document.getElementById("prev-btn").addEventListener("click", () => {
  if (currentQuestion > 0) {
    currentQuestion--;
    showQuestion(currentQuestion);
  }
});

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time Left: ${timeLeft}s`;
    if (timeLeft <= 0 && !submitted) {
      clearInterval(timer);
      handleSubmit();
    }
  }, 1000);
}

document.getElementById("submit-btn").addEventListener("click", handleSubmit);

function handleSubmit() {
  submitted = true;
  clearInterval(timer);
  let score = 0;

  quizData.forEach((item, i) => {
    const selected = document.querySelector(`input[name="q${i}"]:checked`);
    const labels = document.querySelectorAll(`input[name="q${i}"]`);
    let correctFound = false;

    labels.forEach(input => {
      const parent = input.parentElement;

      if (input.value === item.answer) {
        parent.style.backgroundColor = "#c8e6c9"; // green
        if (input.checked) {
          correctFound = true;
        }
      } else if (input.checked) {
        parent.style.backgroundColor = "#ffcdd2"; // red
      }
    });

    const feedback = document.createElement("p");
    feedback.style.marginTop = "8px";
    feedback.style.fontWeight = "bold";

    if (correctFound) {
      feedback.textContent = "✅ Correct!";
      feedback.style.color = "green";
      score++;
    } else {
      feedback.textContent = `❌ Incorrect. Correct answer is: ${item.answer}`;
      feedback.style.color = "red";
    }

    document.querySelectorAll(".question")[i].appendChild(feedback);
  });

  resultBox.textContent = `Well done, ${userName}! You scored ${score} out of ${quizData.length}`;

  const history = JSON.parse(localStorage.getItem("quizHistory")) || [];
  history.push({ name: userName, score, total: quizData.length, date: new Date().toLocaleString() });
  localStorage.setItem("quizHistory", JSON.stringify(history));
  loadHistory();

  document.getElementById("submit-btn").disabled = true;
  document.getElementById("restart-btn").style.display = "inline-block";
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem("quizHistory")) || [];
  if (history.length === 0) return;
  historyBox.innerHTML = "<h3>Previous Attempts:</h3>" + history.map(entry =>
    `<p>${entry.name} - ${entry.score}/${entry.total} on ${entry.date}</p>`
  ).join("");
}

// Restart Quiz
document.getElementById("restart-btn").addEventListener("click", () => {
  form.innerHTML = "";
  resultBox.textContent = "";
  timeLeft = 60;
  submitted = false;
  currentQuestion = 0;
  document.getElementById("submit-btn").disabled = false;
  document.getElementById("restart-btn").style.display = "none";
  timerDisplay.textContent = `Time Left: ${timeLeft}s`;

  renderQuiz();
  showQuestion(0);
  startTimer();
});
