const videoDiv = document.querySelector("#intro-vid");
const startButton = document.querySelector("#start-btn");
const main = document.querySelector("main");
const game = document.querySelector("#game");
const question = document.querySelector("#question-text")
const option = document.querySelectorAll(".option")
const opt1 = document.querySelector(".option-1")
const opt2 = document.querySelector(".option-2")
const opt3 = document.querySelector(".option-3")
const opt4 = document.querySelector(".option-4")
const opts = [opt1, opt2, opt3, opt4]
const timer = document.querySelector("#timer-text")
let seconds = 3
const suspense = new Audio("suspense.mp3")
const lock = new Audio("lock.mp3")
const right = new Audio("correct.mp3")
const wrong = new Audio("wrong.mp3")

const optionColors = {
    4 : ["transparent goldenrod transparent #3e0575", "#3e0575"], //violet
    0 : ["transparent goldenrod transparent #f9ba06", "#f9ba06"], //yellow
    1 : ["transparent goldenrod transparent green", "green", "white"],
    2 : ["transparent goldenrod transparent red", "red", "white"],
}

startButton.addEventListener("click", () => { //start game on button press
    threeTwoOneStart()

    setTimeout(() => { //hide the video after playing it
        main.style.display = "none";
        videoDiv.style.display = "flex";
        videoDiv.play()
    }, 4000);

    setTimeout(() => {
        videoDiv.style.display = "none";
        game.style.display = "flex";
        stopTTO() //stop the 321 setinterval timer
        l()
        startQuestionTimer()
    }, 30000);
})

let io = 0 //flagship question traversal counter - do not touch

game.addEventListener("click", (e) => {
    let flag = true
    console.log(e.target)
    let hasClass = e.target.classList.contains("option")
    console.log(hasClass)
    let parent = e.target.parentElement
    let childs = parent.children
    let userAnswer = childs[1].innerHTML
    suspense.pause()
    suspense.currentTime = 0

    if (hasClass) {
        //setting yellow on click
        childs[0].style.borderColor = optionColors[0][0]
        childs[1].style.backgroundColor = optionColors[0][1]
        childs[2].style.borderColor = optionColors[0][0]
        lock.play()

        if (userAnswer == correctAns[(io - 1)]) {
            console.log("Correct answer")
            setTimeout(() => { //setting green
                lock.pause()
                lock.currentTime = 0
                right.play()
                childs[0].style.borderColor = optionColors[1][0]
                childs[1].style.backgroundColor = optionColors[1][1]
                childs[2].style.borderColor = optionColors[1][0]
            }, 3000);
            setTimeout(() => { //setting back to purple
                childs[0].style.borderColor = optionColors[4][0]
                childs[1].style.backgroundColor = optionColors[4][1]
                childs[2].style.borderColor = optionColors[4][0]
            }, 9000);
        } else {
            console.log("Wrong answer")
            flag = false
            setTimeout(() => { //setting red
                lock.pause()
                lock.currentTime = 0
                wrong.play()
                childs[0].style.borderColor = optionColors[2][0]
                childs[1].style.backgroundColor = optionColors[2][1]
                childs[2].style.borderColor = optionColors[2][0]
            }, 3000);
            setTimeout(() => { //setting back to purple
                childs[0].style.borderColor = optionColors[4][0]
                childs[1].style.backgroundColor = optionColors[4][1]
                childs[2].style.borderColor = optionColors[4][0]
            }, 9000);
        }
        stopQuestionTimer()
        if ((io < 10)&&(flag)) {
            setTimeout(() => {
                l()
                startQuestionTimer()
            }, 9000);
        } else {
            //game reaches last question
            setTimeout(() => {
                game.style.display = "none";
            }, 9000);
        }
    }
})

function threeTwoOneStart() {
    tto = setInterval(() => {
        startButton.textContent = `Starting in ${seconds}`
        seconds--
    }, 1000)
}

function stopTTO() {
    clearInterval(tto)
}

function startQuestionTimer() {
    let ss = 60
    qt = setInterval(() => { //countdowning the timer
        timer.textContent = ss
        if (ss == 0) {
            //timer runs out of time
            stopQuestionTimer()
            setTimeout(() => {
                game.style.display = "none";
            }, 1500);
        }
        ss--
    }, 1000);
}

function stopQuestionTimer() {
    clearInterval(qt)
}

function shuffle (arr) {
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
let difficulty = ["easy","easy","easy","medium","medium","medium","hard","hard","hard","hard"]
let jsonArr = [], optionsArr = [], correctAns = [], count = 0
function callingQnAFromAPI(x) {
    for (let i = 0; i < x; i++) { //calling 10 questions with different difficulties
        let url = `https://the-trivia-api.com/api/questions?limit=1&difficulty=${difficulty[i]}`
        axios
            .get(url)
            .then((res) => { 
                count++
                jsonArr.push(res.data[0].question)
                let arr = [checkForEndSpace(res.data[0].correctAnswer), checkForEndSpace(res.data[0].incorrectAnswers[0]), checkForEndSpace(res.data[0].incorrectAnswers[1]), checkForEndSpace(res.data[0].incorrectAnswers[2])]
                optionsArr.push(shuffle(arr))
                correctAns.push(checkForEndSpace(res.data[0].correctAnswer))
                console.log(`Correct Answer is ${checkForEndSpace(res.data[0].correctAnswer)}`)
                console.log(`api called ${count} times`)
            })
    }
}
callingQnAFromAPI(10)

console.log()
function checkForEndSpace(string) {
    let str = JSON.stringify(string)
    if (str.slice(-2) == ` "`) {
        console.log("reducing string")
        return str.slice(1, (str.length - 2))
    } else {
        return str.slice(1, (str.length - 1))
    }
}

console.log(jsonArr)

function l() {
    q(io)
    io++
}

function q(ioo) {
    question.textContent = jsonArr[ioo]
    option[0].textContent = optionsArr[ioo][0] 
    option[1].textContent = optionsArr[ioo][1]
    option[2].textContent = optionsArr[ioo][2]
    option[3].textContent = optionsArr[ioo][3]
    suspense.play()
    suspense.loop = true
}