const videoDiv = document.querySelector("#intro-vid");
const startButton = document.querySelector("#start-btn");
const main = document.querySelector("main");
const game = document.querySelector("#game");
const question = document.querySelector("#question-text")
const options = document.querySelectorAll(".option")
const opt1 = document.querySelector(".option-1")
const opt2 = document.querySelector(".option-2")
const opt3 = document.querySelector(".option-3")
const opt4 = document.querySelector(".option-4")
const opts = [opt1, opt2, opt3, opt4]
const timer = document.querySelector("#timer-text")


setTimeout(() => { //hide the video after playing it
    videoDiv.style.display = "none";
    videoDiv.style.zIndex = "-2";
}, 27000);

startButton.addEventListener("click", () => { //start game on button press
    // const music = new Audio('sample.mp3')
    // music.play()
    // music.loop = true
    
    let seconds = 3
    setInterval(() => {
        startButton.textContent = `Starting in ${seconds}`
        seconds--
    }, 1000, 3);

    setTimeout(() => {
        main.style.display = "none";
        game.style.display = "flex"; //after this step whole logic on game.js
        let secs = 60
        throwQuestionOptions()
        setInterval(() => { //countdowning the timer
            timer.textContent = secs
            secs--
        }, 1000);
        opts.forEach(option => {
            option.addEventListener("click", () => {
                let elements = option.children
                elements[0].style.borderColor = "transparent goldenrod transparent #f9ba06"
                elements[1].style.backgroundColor = "#f9ba06"
                elements[2].style.borderColor = "transparent goldenrod transparent #f9ba06"
                option.style.color = "black"
            })
        })
    }, 4000);
})

function throwQuestionOptions () {
    question.textContent = jsonArr[0][0].question
    options[0].textContent = optionsArr[0][0] 
    options[1].textContent = optionsArr[0][1]
    options[2].textContent = optionsArr[0][2]
    options[3].textContent = optionsArr[0][3]
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
let jsonArr = [], optionsArr = []
for (let i = 0; i < 10; i++) { //calling 10 questions with different difficulties
let url = `https://the-trivia-api.com/api/questions?limit=1&difficulty=${difficulty[i]}`

    axios
        .get(url)
        .then((res) => { 
            jsonArr.push(res.data)
            let arr = [res.data[0].correctAnswer, res.data[0].incorrectAnswers[0], res.data[0].incorrectAnswers[1], res.data[0].incorrectAnswers[2]]
            optionsArr.push(shuffle(arr)) 
        })
}
console.log(jsonArr)

