const videoDiv = document.querySelector("#intro-vid");
const startButton = document.querySelector("#start-btn");
const main = document.querySelector("main");
const game = document.querySelector("#game");
const question = document.querySelector("#question-text");
const option = document.querySelectorAll(".option");
const timer = document.querySelector("#timer-text");
const username = document.querySelector("#username");
const namee = document.querySelector("#name");
const prizeWon = document.querySelector("#prize-won");
const prizeHighlighter = document.querySelector("#question-info");
const winningScreen = document.querySelector(".winning-screen");
let seconds = 3,
  money = 0,
  gameStarted = 0,
  flag = true;
const prizeMoney = [
  "$500",
  "$1,000",
  "$1,500",
  "$3,000",
  "$5,000",
  "$10,000",
  "$25,000",
  "$50,000",
  "$1,00,000",
  "$5,00,000",
];
const suspense = new Audio("./sounds/suspense.mp3");
const lock = new Audio("./sounds/lock.mp3");
const right = new Audio("./sounds/correct.mp3");
const wrong = new Audio("./sounds/wrong.mp3");

const optionColors = {
  4: ["transparent goldenrod transparent #3e0575", "#3e0575"], //violet
  0: ["transparent goldenrod transparent #f9ba06", "#f9ba06"], //yellow
  1: ["transparent goldenrod transparent green", "green", "white"], //green
  2: ["transparent goldenrod transparent red", "red", "white"], //red
};

const messages = {
  winning: "You are now the CreworkPati. You won $500,000.",
  losing: `Better luck next time.<br><img style="width: 250px; border-radius: 10px;" src="./images/lol.png" alt="">`,
};

function startGame(a) {
  flag = true;
  for (let m = 1; m < 11; m++) {
    prizeHighlighter.children[m].style.color = "white";
  }
  let timer = 0;
  if (a == 0) {
    threeTwoOneStart();
    timer = 4000;
  } else {
    timer = 1000;
  }
  //start game on button press
  winningScreen.style.display = "none";
  namee.innerHTML = "Hi, " + username.value + "👋🏻";
  if (username.value == "") {
    namee.innerHTML = "Hi, Guest 👋🏻";
  }
  gameStarted++;
  setTimeout(() => {
    //hide the video after playing it
    main.style.display = "none";
    videoDiv.style.display = "flex";
    videoDiv.play();
  }, timer);

  setTimeout(() => {
    videoDiv.style.display = "none";
    game.style.display = "flex";
    game.style.transition = "ease 200ms";
    stopTTO(); //stop the 321 setinterval timer
    l();
    startQuestionTimer();
  }, 30000);
}

function changeColorOfOptions(t, elements) {
  elements[0].style.borderColor = optionColors[t][0];
  elements[1].style.backgroundColor = optionColors[t][1];
  elements[2].style.borderColor = optionColors[t][0];
}

let io = 0; //flagship question traversal counter - do not touch

game.addEventListener("click", (e) => {
  let hasClass = e.target.classList.contains("option");
  let parent = e.target.parentElement;
  let childs = parent.children;
  let userAnswer = childs[1].innerHTML;

  if (hasClass) {
    suspense.pause();
    suspense.currentTime = 0;
    game.style.pointerEvents = "none";
    let splCaseFlag = false;
    changeColorOfOptions(0, childs); //0 for yellow
    lock.play();
    if (userAnswer.indexOf("&nbsp;") > -1) {
      //removing spaces from options - api has a bug
      let kol = userAnswer.slice(0, -6);
      userAnswer = kol;
      let jol = correctAns[io - 1].slice(0, -1);
      splCaseFlag = kol == jol;
    }

    if (userAnswer == correctAns[io - 1] || splCaseFlag) {
      splCaseFlag = false;
      console.log("Correct answer");
      setTimeout(() => {
        //setting green
        lock.pause();
        lock.currentTime = 0;
        right.play();
        changeColorOfOptions(1, childs); //1 for green
      }, 3000);
      setTimeout(() => {
        money = money + 1000;
        prizeWon.style.display = "flex";
        prizeWon.innerHTML = `🎉 You won ${prizeMoney[(io - 1) % 10]} 🎉`;
      }, 4500);
      setTimeout(() => {
        prizeWon.style.display = "none";
      }, 8000);
      setTimeout(() => {
        //setting back to purple
        changeColorOfOptions(4, childs); //4 for purple
      }, 10000);
    } else {
      console.log("Wrong answer");
      document.querySelector(".winning-text").innerHTML = messages.losing;
      flag = false;
      setTimeout(() => {
        //setting red
        lock.pause();
        lock.currentTime = 0;
        wrong.play();
        changeColorOfOptions(2, childs); //2 for red
      }, 3000);
      setTimeout(() => {
        prizeWon.style.display = "flex";
        if (io % 10 == 1) {
          prizeWon.innerHTML = `You won $0. Better luck next time.`;
        } else {
          prizeWon.innerHTML = `You won ${
            prizeMoney[(io - 2) % 10]
          }. Better luck next time.`;
        }
      }, 4500);
      setTimeout(() => {
        prizeWon.style.display = "none";
      }, 8000);
      setTimeout(() => {
        //setting back to purple
        changeColorOfOptions(4, childs); //4 for purple
      }, 10000);
    }
    stopQuestionTimer();
    if (io % 10 < 10 && flag) {
      if (io % 10 == 9) {
        flag = false;
        document.querySelector(".winning-text").innerHTML = messages.winning;
      }
      setTimeout(() => {
        l();
        startQuestionTimer();
      }, 10000);
    } else {
      //game reaches last question or answered wrong
      setTimeout(() => {
        game.style.display = "none";
        winningScreen.style.display = "flex";
        io = gameStarted * 10;
        callingQnAFromAPI(10);
      }, 10000);
    }
  }
});

function threeTwoOneStart() {
  //timer for launch kbc button
  tto = setInterval(() => {
    startButton.textContent = `Starting in ${seconds}`;
    seconds--;
  }, 1000);
}

function stopTTO() {
  //stop timer for launch kbc button
  clearInterval(tto);
}

function startQuestionTimer() {
  let ss = 60;
  qt = setInterval(() => {
    //countdowning the timer
    timer.textContent = ss;
    if (ss == 0) {
      //timer runs out of time
      stopQuestionTimer();
      setTimeout(() => {
        game.style.display = "none";
        suspense.pause();
        suspense.currentTime = 0;
        prizeWon.style.display = "flex";
        prizeWon.innerHTML = prizeMoney[(io - 1) % 10];
        money = 0;
      }, 1500);
      setTimeout(() => {
        prizeWon.style.display = "none";
        winningScreen.style.display = "flex";
        document.querySelector(".winning-text").innerHTML = messages.losing;
        io = gameStarted * 10;
        fetch10QnABruteForce(10);
        username.value = "";
      }, 5000);
    }
    ss--;
  }, 1000);
}

function stopQuestionTimer() {
  clearInterval(qt);
}

function shuffle(arr) {
  //shuffle the options order
  var j, x, index;
  for (index = arr.length - 1; index > 0; index--) {
    j = Math.floor(Math.random() * (index + 1));
    x = arr[index];
    arr[index] = arr[j];
    arr[j] = x;
  }
  return arr;
}

//fix the difficulty of questions order in api calls here
let difficulty = [
  "easy",
  "medium",
  "medium",
  "medium",
  "medium",
  "medium",
  "hard",
  "hard",
  "hard",
  "hard",
];
let jsonArr = [],
  optionsArr = [],
  correctAns = [],
  count = 0,
  pushed = 0;
function callingQnAFromAPI(x) {
  for (let i = 0; i < x; i++) {
    let url = `https://the-trivia-api.com/api/questions?limit=1&difficulty=${difficulty[i]}`;
    axios.get(url).then((res) => {
      count++;
      if (res.data[0].question.length < 100) {
        //checking for question length
        if (
          res.data[0].correctAnswer.length < 60 &&
          res.data[0].incorrectAnswers[0].length < 60 &&
          res.data[0].incorrectAnswers[1].length < 60 &&
          res.data[0].incorrectAnswers[2].length < 60
        ) {
          //checking for options length
          pushed++;
          jsonArr.push(res.data[0].question);
          let arr = [
            res.data[0].correctAnswer,
            res.data[0].incorrectAnswers[0],
            res.data[0].incorrectAnswers[1],
            res.data[0].incorrectAnswers[2],
          ];
          optionsArr.push(shuffle(arr));
          correctAns.push(res.data[0].correctAnswer);
        }
      }
    });
  }
  console.log(`api called ${count} times`);
  return x - pushed;
}
fetch10QnABruteForce(10);

function fetch10QnABruteForce(q) {
  let xx = 0;
  for (let i = 0; i < 2; i++) {
    xx = callingQnAFromAPI(q);
    q = xx;
  }
}

function l() {
  game.style.pointerEvents = "auto";
  q(io);
  io++;
}

function q(ioo) {
  prizeHighlighter.children[10 - (ioo % 10)].style.color = "goldenrod";
  if (ioo % 10 > 0) {
    prizeHighlighter.children[10 - (ioo % 10) + 1].style.color = "white";
  }
  question.textContent = jsonArr[ioo];
  option[0].textContent = optionsArr[ioo][0];
  option[1].textContent = optionsArr[ioo][1];
  option[2].textContent = optionsArr[ioo][2];
  option[3].textContent = optionsArr[ioo][3];
  suspense.play();
  suspense.loop = true;
}
