//////////////////////////////////////// Components Implementation ////////////////////////////////////////

// Loading global DOM elements
let startButton = document.getElementById("startButton");
let countElem = document.getElementById('quesNum');
let bulletsSection = document.querySelector('.controls .bullets');
let questionSection = document.querySelector('.question');
let nextButton = document.getElementById('navButton');

// Getting questions object from AJAX request
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

// Create questions bullets - GUI
function createBullets(count){
    for(let i = 0; i < count; i++){
        let bullet = document.createElement('span');
        i == 0 ? bullet.classList.add('on') : '';
        bulletsSection.appendChild(bullet);
    }
};

// Loads question to GUI
function loadQuestion(ques, quesNum){
    
    // 1. Update question number
    let numElem = document.createElement('span');
    numElem.appendChild(document.createTextNode(quesNum));
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
        item.appendChild(input);

        let answerText = document.createElement('label');
        answerText.setAttribute('for', `a${i+1}`);
        answerText.innerHTML = ques['answers'][i];
        item.appendChild(answerText);

        answersSection.appendChild(item);
    }
    questionSection.appendChild(answersSection);
};

// Next question generating
nextButton.onclick = () =>{
    // TO-DO
};

// Handling timer
function countDown (){
    // TO-DO
};

function grader(){
    // TO-DO
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////



//////////////////////////////////////// MAIN ////////////////////////////////////////
startButton.onclick = () => {
    document.getElementById("startupWindow").classList.add("hide");
    document.getElementById("quizWindow").classList.remove("hide");

    getQuestionsAJAX().then((questions) => {
        createBullets(questions.length);
        loadQuestion(questions[0], 1);
        countDown();
    });
};
//////////////////////////////////////////////////////////////////////////////////////