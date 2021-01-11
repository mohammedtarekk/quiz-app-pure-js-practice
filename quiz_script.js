//////////////////////////////////////// Components Implementation ////////////////////////////////////////

// Loading global DOM elements
let startupWindow = document.getElementById("startupWindow");
let quizWindow = document.getElementById("quizWindow");
let resultWindow = document.getElementById("resultWindow");
let startButton = document.getElementById("startButton");
let countElem = document.getElementById('quesNum');
let bulletsSection = document.querySelector('.controls .bullets');
let questionSection = document.querySelector('.question');
let nextButton = document.getElementById('navButton');
let timer = document.querySelector('.timer');

// Global static variables
let currentIndex = 0;
let score = 0;
let countDownInterval;


function getQuestionsAJAX() {
    return new Promise(function(resolve, reject){
        let req = new XMLHttpRequest();
        req.onload = function() {
            if(this.readyState === 4 && this.status === 200)
                resolve(JSON.parse(this.responseText));
            else
                reject(Error(this.statusText));
        };
        req.open('GET', 'questions.json', true);
        req.send();
    });
};


function createBullets(count){
    for(let i = 0; i < count; i++){
        let bullet = document.createElement('span');
        i == 0 ? bullet.classList.add('on') : '';
        bulletsSection.appendChild(bullet);
    }
};


function loadQuestion(ques, count){
    
    // Start timer
    countDown(10);

    // Clear previous question
    questionSection.innerHTML = '';
    countElem.innerHTML = ''; 
    
    // 1. Update question number
    let numElem = document.createElement('span');
    numElem.appendChild(document.createTextNode('Question No. '));
    numElem.appendChild(document.createTextNode(currentIndex + 1));
    countElem.appendChild(numElem);

    // 2. Fill question label
    let quesLabel = document.createElement('div');
    quesLabel.classList.add('label');
    quesLabel.appendChild(document.createTextNode(ques['title']));
    questionSection.appendChild(quesLabel);

    // 3. Fill answers
    let answersSection = document.createElement('div');
    answersSection.classList.add('answers-box');
    for(let i = 0; i < ques['answers'].length; i++){
        let item = document.createElement('div');
        item.classList.add('item');

        let input = document.createElement('input');
        input.setAttribute('name', 'ques');
        input.setAttribute('type', 'radio');
        input.setAttribute('id', `a${i+1}`);
        input.dataset.answerIndex = i;
        item.appendChild(input);

        let answerText = document.createElement('label');
        answerText.setAttribute('for', `a${i+1}`);
        answerText.innerText = ques['answers'][i];
        item.appendChild(answerText);

        answersSection.appendChild(item);
    }
    questionSection.appendChild(answersSection);

    // Update bullets
    bulletsSection.children[currentIndex].classList.add('on');

    // Update button in the last question
    if(currentIndex === count - 1)
        nextButton.innerHTML = 'FINISH!';
};


function countDown(duration){

    timer.innerHTML = '';
    let min = `${parseInt(duration / 60)}`.padStart(2, '0');
    let sec = `${parseInt(duration % 60)}`.padStart(2, '0');
    timer.appendChild(document.createTextNode(`${min}:${sec}`));

    countDownInterval = setInterval(() => {  
        min = `${parseInt(duration / 60)}`.padStart(2, '0');
        sec = `${parseInt(duration % 60)}`.padStart(2, '0');
        timer.innerHTML = '';
        timer.appendChild(document.createTextNode(`${min}:${sec}`));

        if(duration-- < 1){
            clearInterval(countDownInterval);
            nextButton.click();
        }

    }, 1000);
    
};


function grader(questions){
    let currentAnswers = document.getElementsByName('ques');

    currentAnswers.forEach(ans => {
        if(ans.checked)
            questions[currentIndex]['correctIndex'] == ans.dataset.answerIndex ? score += 1 : '';
    });

};


function shuffle(array){
    var index = array.length, temporaryValue, randomIndex;

    while (index !== 0) {

        randomIndex = Math.floor(Math.random() * index);
        index -= 1;

        temporaryValue = array[index];
        array[index] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
};


function showResult(count){
    quizWindow.classList.add("hide");
    resultWindow.classList.remove("hide");
    resultWindow.children[0].innerHTML = `${score} / ${count}`;
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////// MAIN ////////////////////////////////////////
startButton.onclick = () => {
    startupWindow.classList.add("hide");
    quizWindow.classList.remove("hide");

    getQuestionsAJAX().then((questions) => {
        createBullets(questions.length);
        shuffle(questions);
        loadQuestion(questions[currentIndex], questions.length);

        // Next question generating
        nextButton.onclick = () =>{
            grader(questions);
            currentIndex += 1; 
            clearInterval(countDownInterval);
            if(currentIndex < questions.length)
                loadQuestion(questions[currentIndex], questions.length);
            else
                showResult(questions.length);
        };
    });
};
//////////////////////////////////////////////////////////////////////////////////////