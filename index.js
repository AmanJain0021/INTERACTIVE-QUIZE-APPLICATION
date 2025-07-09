let questions=[];



let btn = document.getElementsByClassName("btn");
let questionElement = document.querySelector(".questions h2");
let scoreCard=document.getElementById("score");
let currentQuestionIndex = 0;
let score = 0;

function shuffle(array){
  return array.sort(()=>Math.random()-0.5);
}

async function fetchQuestions() {
  
  try{
 const response = await fetch("https://opentdb.com/api.php?amount=5&type=multiple");  
 const data=await response.json();
 questions=data.results.map((q)=>{
  const answers=[...q.incorrect_answers.map(a=>({text:a,correct:false}))
    ,{text:q.correct_answer,correct:true}];
    return{
      question: decodeHTML(q.question),
      answers:shuffle(answers.map(a=>({text:decodeHTML(a.text||a),correct:a.correct}))),
    };
   
 })
  loadQuestionIndex();
 } catch (error) {
    questionElement.innerHTML = "Failed to load questions. Try again later.";
    console.error("Error fetching questions:", error);
  }
}

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}






function loadQuestionIndex() {
  let currentQuestion = questions[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1;

  questionElement.innerHTML = `Q.${questionNo} ${currentQuestion.question}`;

  //now For button option
  for (let i = 0; i < btn.length; i++) {
    btn[i].innerHTML = currentQuestion.answers[i].text;
    //check whether true or false
    btn[i].dataset.correct = currentQuestion.answers[i].correct;
    btn[i].disabled = false;
    btn[i].classList.remove("wrong","correct");
  }
  document.getElementById("nex").style.display = "none";

}
for(let i=0;i<btn.length;i++){
  btn[i].addEventListener("click",selectAnswer);
}


function selectAnswer(e){
  const selectedBtn=e.target;
  const isCorrect=selectedBtn.dataset.correct==="true";
  if(isCorrect){
    selectedBtn.classList.add("correct");
    score++;
  }else{
    selectedBtn.classList.add("wrong");
  }
    for (let i = 0; i < btn.length; i++) {
      btn[i].disabled="true";
      if(btn[i].dataset.correct==="true"){
        btn[i].classList.add("correct");
      }
    }
  document.getElementById("nex").style.display="block";

}
document.getElementById("nex").onclick=()=>{
  currentQuestionIndex++;
  if(currentQuestionIndex<questions.length){
    loadQuestionIndex();

  }else{
  
    questionElement.innerHTML="Quize Completed!";
    document.querySelector(".options").style.display="none";
    scoreCard.textContent=`Your score is ${score} out of ${questions.length}`;
    scoreCard.style.fontSize="25px";
    scoreCard.style.textAlign="center";
  }
}
window.onload = fetchQuestions;
