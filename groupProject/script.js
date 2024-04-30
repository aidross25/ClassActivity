"use strict"

// Global constants and variables
const introContainer = document.getElementById("introContainer");
const canvasContainer = document.getElementById("canvasContainer");
const takeQuizMsg = document.getElementById("quizMe");
const infoContainer = document.getElementById("infoContainer");
const quizContainer = document.getElementById("quizContainer");
const endContainer = document.getElementById("endContainer");
const retryBtn = document.getElementById("retryBtn");
const restartBtn = document.getElementById("restartBtn");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
var canvasOffsetX = 0;
var canvasOffsetY = 0;
var houseList = [];
var topic = "";
var points = 0;
var questionList = [];
var currentQuestion = 0;

// Debug variables
var debugElement = document.getElementById("debug");
var debugElement2 = document.getElementById("debug2");
var debugElement3 = document.getElementById("debug3");
var debugElement4 = document.getElementById("debug4");

class House {
    // Private variables
    #x1;
    #y1;
    #x2;
    #y2;
    #houseNum;
    #infoHouse;
    #infoHouseNum;
    #completed;

    // Constructor
    constructor(x1, y1, x2, y2, num, bool) {
        this.#x1 = x1;
        this.#y1 = y1;
        this.#x2 = x2;
        this.#y2 = y2;
        this.#houseNum = num;
        this.#infoHouseNum = -1;
        this.#infoHouse = bool;
        this.#completed = false;
    }

    // Returns an array of house coordinates
    // From upper left to lower right
    // [x1, y1, x2, y2]
    getHouseCoords(){
        return [this.#x1, this.#y1, this.#x2, this.#y2];
    }

    // Returns the house number
    getHouseNum(){
        return this.#houseNum;
    }

    // Sets the info house number
    setInfoHouseNum(num){
        this.#infoHouseNum = num;
    }

    // Returns the info house number
    getInfoHouseNum(){
        return this.#infoHouseNum;
    }

    // Returns true or false if this house is
    // an info house or not
    isInfoHouse(){
        return this.#infoHouse;
    }

    // Returns true or false if this house
    // has be clicked on previously
    isCompleted(){
        return this.#completed;
    }

    // Updates the completed status of this house
    setCompleted(value){
        this.#completed = value;
    }
}

class Question {
    // Private variables
    #question;
    #choices;
    #answerIndex;
    
    // Constructor
    constructor(question, choices, answer){
        this.#question = question;
        this.#choices = choices;
        this.#answerIndex = answer;
    }

    // Returns the question string
    getQuestion(){
        return this.#question;
    }

    // Returns the array of choices
    getChoices(){
        return this.#choices;
    }

    // Returms the array index of the correct choice
    getAnswerIndex(){
        return this.#answerIndex;
    }
}

// Starup/Restart function
function init(){
    if(document.getElementById("scriptCheck")){
        document.getElementById("scriptCheck").remove();
    }
    introContainer.style.display = "block";
    endContainer.style.display = "none";
}

// Sets displayed user and topic and calls startGame()
function setUserAndTopic(){
    let username = document.getElementById("usernameIn").value.trim();
    if (username == ""){
        alert("Please enter a valid name");
    }
    else{
        let radioBtns = document.getElementsByName("topic");
        for(const btn of radioBtns){
            if (btn.checked){
                topic = btn.value;
            }
        }
        document.getElementById("username").innerText = "Welcome " + username + "!";
        document.getElementById("selectedTopic").innerText = "Selected topic: " + topic;
        document.getElementById("coins").innerText = "Coins: " + points;
        startGame();
    }
}

// Switches the UI from the starting screen to the game canvas
function startGame(){
    points = 0;
    introContainer.style.display = "none";
    canvasContainer.style.display = "block";
    takeQuizMsg.style.display = "none";
    canvasOffsetX = Math.floor(canvas.getBoundingClientRect().x);
    canvasOffsetY = Math.floor(canvas.getBoundingClientRect().y);
    drawAllHouses(0,0);
}

// Draws all houses on the canvas
function drawAllHouses(offsetX, offsetY){
    houseList = [];
    let infoHouses = [];
    let randNum;
    let infoCount = 4; //Careers
    if (topic == "Coding"){infoCount = 8} 
    else if (topic == "Networks"){infoCount = 6}
    
    while (infoHouses.length < infoCount){
        randNum = Math.floor(Math.random() * 27);
        if (!infoHouses.includes(randNum)){
            infoHouses.push(randNum); //make House of index randNum be an infoHouse
        }
    }
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for(let i=0; i<4; i++){
        for(let j=0; j<7; j++){
            drawHouse(j*70 + offsetX, i*90 + offsetY, i*7+j, infoHouses.includes(i*7+j));
        }
    }
}

// Draws one house and pushes it to the houseList global array
// If houseNum is in the array infoHouses (checked in drawAllHouses)
// a red exclaimation point will be drawn to indicate this
function drawHouse(startX, startY, houseNum, clickable){
    startX += 20;
    startY += 20;
    ctx.beginPath();
    ctx.strokeStyle = "#000000";
    ctx.fillStyle = "#000000";
    ctx.moveTo(startX+0, startY+30);
    ctx.lineTo(startX+60, startY+30);
    ctx.lineTo(startX+60, startY+80);
    ctx.lineTo(startX+0, startY+80);
    ctx.lineTo(startX+0, startY+30);
    ctx.lineTo(startX+30, startY+0);
    ctx.lineTo(startX+60, startY+30);
    ctx.stroke();
    if (clickable){
        ctx.beginPath();
        ctx.strokeStyle = "#ff0000";
        ctx.fillStyle = "#ff0000";
        ctx.arc(startX+30, startY+70, 6, 0, 2*Math.PI);
        ctx.moveTo(startX+27, startY+60);
        ctx.lineTo(startX+23, startY+35);
        ctx.lineTo(startX+37, startY+35);
        ctx.lineTo(startX+33, startY+60);
        ctx.fill();
    }
    houseList.push(new House(startX, startY+30, startX+60, startY+80, houseNum, clickable));
}

// Gets mouse position relative to the game canvas
// Upper left corner is (0, 0)
// Calculated from the cursor location, current window scroll,
// and location of the canvas in the page
function clickCanvas(e){
    let selectedHouse = getClickedHouse(e.clientX + window.scrollX - canvasOffsetX, e.clientY + window.scrollY - canvasOffsetY);
    if(selectedHouse != null && selectedHouse.isInfoHouse()){
        showInformation(topic, selectedHouse.getInfoHouseNum());
    }

    // Debug functionality
    debugElement2.innerText = "Clicked Mouse X: " + (e.clientX + Math.floor(window.scrollX) - canvasOffsetX) + "\nClicked Mouse Y: " + (e.clientY + Math.floor(window.scrollY) - canvasOffsetY);
    if(selectedHouse == null){
        debugElement3.innerText = "Clicked House: -1";
        debugElement4.innerText = "Clicked Info House: -1";
    }
    else{
        debugElement3.innerText = "Clicked House: " + selectedHouse.getHouseNum();
        if(selectedHouse.isInfoHouse()){
            debugElement4.innerText = "Clicked Info House: " + selectedHouse.getInfoHouseNum();
        }
        else{
            debugElement4.innerText = "Clicked Info House: -1";
        }
    }
}

// Checks if the clicked location from clickCanvas() is on a drawn house
// House coordinates encompass the lower rectangle, and not the roof
// If clicked house is an info house, switches UI to the info screen
// If info house is clicked for the first time, increments points by 1
// Returns house number if one is found
// Otherwise returns -1
function getClickedHouse(x, y){
    let coords;
    for(const house of houseList){
        coords = house.getHouseCoords();
        if(coords[0] < x && x < coords[2] && coords[1] < y && y < coords[3]){
            if(house.isInfoHouse()){
                if (house.isCompleted() == false){
                    house.setCompleted(true);
                    house.setInfoHouseNum(points);
                    drawCompleted(house.getHouseNum());
                    points++;
                    document.getElementById("coins").innerText = "Coins: " + points;
                }
            }
            return house;
        }
    }
    return null;
}

// When an info house has been clicked,
// replaces the red exclaimation point
// with a green checkmark to indicate
// that it has been clicked on before
function drawCompleted(num){
    let coords;
    for(const house of houseList){
        if(house.getHouseNum() == num){
            coords = house.getHouseCoords();
            ctx.beginPath();
            ctx.fillStyle = "#ffffff";
            ctx.moveTo(coords[0]+3, coords[1]+3);
            ctx.lineTo(coords[2]-3, coords[1]+3);
            ctx.lineTo(coords[2]-3, coords[3]-3);
            ctx.lineTo(coords[0]+3, coords[3]-3);
            ctx.fill();
            ctx.beginPath();
            ctx.fillStyle = "#00cf00";
            ctx.moveTo(coords[0]+5, coords[1]+20);
            ctx.lineTo(coords[0]+25, coords[1]+30);
            ctx.lineTo(coords[0]+55, coords[1]+5);
            ctx.lineTo(coords[0]+27, coords[1]+45);
            ctx.fill();
        }
    }
}

// Debug function to get mouse position in canvas on hover
function debugHover(e){
    debugElement.innerText = "Mouse X in Canvas: " + (e.clientX + Math.floor(window.scrollX) - canvasOffsetX)+ "\nMouse Y in Canvas: " + (e.clientY + Math.floor(window.scrollY) - canvasOffsetY);
}

// Displays information about a topic
// depending on which house was selected
// and what the current topic is
function showInformation(topic, num){
    canvasContainer.style.display = "none";
    infoContainer.style.display = "block";
    let title = document.getElementById("infoTitle");
    let content = document.getElementById("infoContent");
    if (topic == "Coding"){
        switch(num){
            case 0:
                title.innerText = "What is coding?";
                content.innerText = "Coding (also known as programming) is how we tell computers what to do, and how to do it. " + 
                "It is the process of writing instructions that a computer can understand and execute in what we call a computer program.";
                break;
            case 1:
                title.innerText = "Programming languages";
                content.innerText = "Like human languages, there are hundreds of different computer languages that can be used to write programs. " +
                "These programming languages are the middle ground between natual languages that people use, and the machine language that computers use " +
                "which is a sequence of 0s and 1s.\n\nSome programming languages are better suited for specific tasks than other languages are.\n\n" +
                "For example, Python is a very user-friendly language that can be used to quickly code applications and has plenty of uses in " +
                "machine learning and artificial intelligence.\n\nC and C++ are very powerful languages that are used to run the underlying systems " +
                "that we use on an everyday basis.";
                break;
            case 2:
                title.innerText = "Variables";
                content.innerHTML = "Variables are used to hold information that can be used at a later time. " +
                "They are declared with a name, and values can be read from and written to them whenever needed.\n\n" +
                "Some examples of variables include:\n\n<code>name = \"John\"\nx = 7\npi = 3.14159</code>";
                break;
            case 3:
                title.innerText = "Data Types";
                content.innerText = "Every programming language has different types of data that can be used to represent different things.\n\n" +
                "Some types include:\nIntegers (whole numbers)\nFloating point values (for decimals and fractional values)\nCharacters and strings " +
                "(to hold letters and sequences of letters)\nBoolean values (either true or false)\nUser defined data types and objects.";
                break;
            case 4:
                title.innerText = "Functions";
                content.innerHTML = "In a computer program, a function is a block of code identified by a function name that is used to " +
                "perform a specific task. Once a function is written, it can be used multiple times whenever it is called. They allow " +
                "the program to be broken into smaller chunks and can remove a lot of repetitive code, making it much easier for a human to follow.\n\n" +
                "This is an example of a program written in JavaScript that uses functions:\n\n" +
                "<code>function addNumbers(numberA, numberB){\n&nbsp &nbsp return numberA + numberB;\n}\nlet value = addNumbers(4, 6);</code>\n\n" +
                "This is a simple function named \"addNumbers\"that takes in two numbers and returns their sum, writing it to the variable \"value\"";
                break;
            case 5:
                title.innerText = "If/Else Statements";
                content.innerHTML = "If and Else statements allow you to control the flow of your code depending on some condition. " +
                "Essentially, IF a condition is true, then the program will perform some task. Otherwise, it will do something ELSE.\n\n" +
                "This is an example of an if/else statement:\n\n<code>score = 80;\nif score >= 70 {\n&nbsp &nbsp passed = true;\n}\nelse{\n" +
                "&nbsp &nbsp passed = false;\n}</code>\n\n" +
                "In this example, the variable named \"passed\" is set to either true or false depending on if the value of \"score\" is " +
                "greater than or equal to 70. If someone got a score of at least 70, then they passed. Otherwise, they did not pass.";
                break;
            case 6:
                title.innerText = "Loops";
                content.innerHTML = "Loops are another type of sequence that can control the flow of a program. In this case, it allows a block " +
                "of code to be repeated again and again until some condition is met that allows the loop to end.\n\nThis is an example of a while loop:\n\n" +
                "<code>value = 0;\nwhile value < 10 {\n&nbsp &nbsp value = value + 1;\n}</code>\n\n" +
                "The variable \"value\" is set to 0 before entering the loop. When the loop is entered, it checks for a specific condition and determines " +
                "if this condition is true or false. In this case, the loop is checking if value is less than 10. If this condition is true, the program " +
                "begins executing code in the loop body. After the program reaches the end of the code, the condition is checked again and will repeat if " +
                "it is still true. This continues until the condition is false, at which point the program continues execution after the loop body.\n\n" +
                "This loop will repeat 10 times. After the 10th loop, \"value\" will be 10, which is not less than 10, which makes the condition false.";
                break;
            case 7:
                title.innerText = "Example of a Program";
                content.innerHTML = "<code>function addNumbers(a, b){\n&nbsp n = a + b;\n&nbsp return n;\n}\n" +
                "\nx = 4;\ny = 12;\nz = 7;\n\nwhile x < 30 {\n&nbsp y = addNumbers(y, z);\n&nbsp x = addNumbers(x, y);\n}\n\n" +
                "if y > 25 {\n&nbsp output = \"red\"\n}\nelse {\n&nbsp output = \"blue\"\n}</code>\n\n" +
                "Is the output red or blue? Let's walk through the program.\nThis program starts with a function definition called addNumbers " +
                "which adds two numbers together and returns their sum.\n\nNext we declare 3 variables named x, y, and z with the values " +
                "4, 12, and 7 respectively.\n\nAfter this we encounter a loop that will repeat as long as x is less than 30.\n" +
                "Since 4 is less than 30, we go into the loop, which calls the function addNumbers twice. By the end of the first iteration " +
                "through the loop, y has a new value of 19 (12 + 7) and x has a new value of 23 (4 + 19).\n\nWe check the condition of the loop again.\n\n" +
                "23 is still less than 30, so we go through the loop once more.\nBy the end of the second iteration, y is 26 (19 + 7) " +
                "and x is 49 (23 + 26). We check the loop's condition again.\n\nSince 49 is not less than 30, we exit the loop and continue below.\n\n" +
                "Next is an if statment that checks if y is greater than 25. Since 26 is greater than 25, we execute the code under the if " +
                "statement and the output is set to \"red\", which is our final answer.";
                break;
        }
    }
    else if (topic == "Careers"){
        switch(num){
            case 0:
                title.innerText = "Careers in Computer Science (CS)";
                content.innerText = "There are many different types of jobs that are connected to the study of computer science. Some of which include:\n\n" +
                "Software Development\nSystems Analyst\nWeb Design\nGame Development\nIT Consultant\nNetwork Administrator\nData Scientist";
                break;
            case 1:
                title.innerText = "Future of CS Occupations";
                content.innerText = "As society relies more and more on technology every day, the growth outlook for computer science is excellent. " +
                "Job opportunities for computer & information technology careers are projected to grow by 14.6% from 2021 to 2031. As of 2021, " +
                "the median salary for computer science graduates is upwards of $97,430.";
                break;
            case 2:
                title.innerText = "Industries Affected by CS";
                content.innerText = "Due to being at the heart of today's technological growth, most industries in the world will be affected by computer science. " +
                "Some examples include cybersecurity, finance, healthcare, transportation, business operations, recreation, and artificial intelligence.";
                break;
            case 3:
                title.innerText = "Artificial Intelligence";
                content.innerText = "Artificial intelligence or AI, in a broad sense, is the ability for computers and machines to learn from an environment " +
                "to perform tasks more accurately and efficiently over time without any user input. AI is in use everywhere today, from ChatGPT, to search engines. " +
                "to user interaction systems that simulate human speech. It is currently a major influence on society today and will play a key role in many " +
                "automation tasks in the years to come.";
                break;
        }
    }
    else if (topic == "Networks"){
        switch(num){
            case 0:
                title.innerText = "What is a Network?";
                content.innerText = "A computer network is a set of computers that communicate with each other to share data, information, and resources. " +
                "We use networks today to surf the web, shop online, stream videos, and to send messages to others.";
                break;
            case 1:
                title.innerText = "Clients and Servers";
                content.innerText = "Clients and servers are computers that communicate in networks to provide data to users. " +
                "A client is a computer that a user uses to fetch or request information from across a network, and receives data back from that " +
                "same network.\n\nA server is a computer system that stores and processes data, and provides or \"serves\" requested data to " +
                "other computers.\n\nA client requests information that a server has, and the server returns the requested data.";
                break;
            case 2:
                title.innerText = "Types of Networks";
                content.innerText = "While the basic definition of a network is the communication of two computers, there are various types of networks " +
                "that are in use today. Some of these networks include, but are not limited to:\n\n" +
                "Personal Area Networks (PAN): Small networks that are made up of a computer, a modem, and a handful of other devices that are interconnected.\n\n" +
                "Local Area Networks (LAN): Networks that connect groups of computers across short distances (typically across a building). Many enterprises " +
                "utilize LANs to conduct business.\n\nWide Area Network (WAN): A network that connects computers (or other, smaller networks) over much larger " +
                "distances. The internet is a basic example of a WAN.\n\nVirtual Private Network (VPN): An extension of a private network across the internet " +
                "that lets users send and receive data as if their devices were connected to a private network.";
                break;
            case 3:
                title.innerText = "The Internet";
                content.innerText = "In a nutshell, the internet is a global system of interconnected computer networks that makes up the largest network in the world. " +
                "It is a network of networks that is composed of public, private, business, academic, and governemnt networks that is managed by many networking " +
                "technologies from many organizations across the world.";
                break;
            case 4:
                title.innerText = "How Does a Computer Send Data Over a Network?";
                content.innerText = "The procedure of transfering data across a network is a very technical process, but to summarize it in simple steps:\n\n" +
                "1. The data to be sent is broken down into small units called packets, which contain a fraction of the whole data along with information that " +
                "ensures it reaches the correct destination, like an address on an envelope.\n\n" +
                "2. The packets are routed through the network based on where it has to travel before it reaches its destination, like many interconnected flights " +
                "on an airline.\n\n" +
                "3. The packets are transmitted through the network by utilizing devices such as routers, modems, switches, and cables. Different networks have " +
                "different methods of transfering data.\n\n" +
                "4. When all the packets arrive at the destination machine, they are reassembled to form the original data. This data can then be processed and " +
                "sent back across the network to the system that first sent it.";
                break;
            case 5:
                title.innerText = "Applications of Networks in Everyday Life";
                content.innerText = "Some popular uses of networks include:\nWeb hosting: Clients (web browers) send HTTP requests across a network to a server " +
                "which processes the request and sends a webpage back to the client.\n\nVideo Streaming: Services like YouTube and Netflix allow a user to " +
                "watch videos by sending a constant stream of data of the video to the client to be played back on the client's machine.\n\nOnline Shopping: " +
                "Services like Amazon and Ebay can be used to show item information to an end user, who can then decide to purchase. The service can then " +
                "communicate across a network with a financial institution like a bank or credit union to receive payment for the item.";
                break;
        }
    }
}

// Switches the page back to the canvas screen from the information or end screens
//Displays StartQuiz if points == # of infoHouses
function returnToCanvas(){
    canvasContainer.style.display = "block";
    infoContainer.style.display = "none";
    endContainer.style.display = "none";
    if (topic == "Coding" && points == 8){
        takeQuizMsg.style.display = "block";
    }
    else if (topic == "Careers" && points == 4){
        takeQuizMsg.style.display = "block";
    }
    else if (topic == "Networks" && points == 6){
        takeQuizMsg.style.display = "block";
    }
}

// Sets up the questions based on the selected topic
// and enables the quiz screen
function startQuiz(){
    canvasContainer.style.display = "none";
    quizContainer.style.display = "block";
    currentQuestion = 0;
    
    let q1, q2, q3, q4;
    if (topic == "Coding"){
        q1 = new Question("In the code below, what should the starting value of x be, so that the value of y is 10 after execution?\n\n" +
            "<code>x = ___;\nx = x * 2;\ny = x + 4</code>",
            ["1", "3", "5", "8"], 1);
        q2 = new Question("In the code below, what is the value of x after execution?\n\n<code>let x = 4;\nlet y = 7\n\n" +
            "x = x + 4;\ny = x + 2;\nx = y - x;</code>",
            ["7", "9", "2", "4"], 2);
        q3 = new Question("Which of the following is not a programming language?",
            ["Python", "Java", "C#", "Spanish"], 3);
        q4 = new Question("In the code below, what is the value of x after execution?\n\n<code>x = 4;\ny = 7;\nz = 0;\n\n" +
            "x = x + 2;\n\nif x > 7 {\n&nbsp &nbsp x = x * 2;\n&nbsp &nbsp z = 4\n}\nelse {\n&nbsp &nbsp z = 2;\n}\n\n" +
            "y = y - z;\n\nwhile x < 20 {\n&nbsp &nbsp x = x + y;\n}\n\nx = x - z</code>",
            ["19", "21", "11", "16"], 0);
    }
    else if (topic == "Careers"){
        q1 = new Question("What industries are affected by Computer Science?",
            ["Finance", "Artificial Intelligence", "Healthcare", "All of the above"], 3);
        q2 = new Question("What was the median salary for CS graduates in 2021?",
            ["Over $90,000", "$90,000 to $50,000", "$50,000 to $40,000", "Less than $40,000"], 0);
        q3 = new Question("What is Artificial Intelligence (AI)?",
            ["A system that adds numbers together", "A system that is able to learn over time without user input", "Fake intelligence", "A kind of cheese"], 1);
        q4 = new Question("What kinds of jobs could one obtain with a CS degree?",
            ["Lawyer", "Salesperson", "Game Developer", "Chef"], 2);
    }
    else if (topic == "Networks"){
        q1 = new Question("Which of these does the Internet classify as?",
            ["LAN", "PAN", "WAN", "VPN"], 2);
        q2 = new Question("What is a packet in terms of computer networks?",
            ["A fraction of the whole data", "A component to connect two computers", "A router that packs data", "A box with a computer inside"], 0);
        q3 = new Question("Which of these applications actively use a network?",
            ["Using a calculator", "Web browsing", "Writing a document in notepad", "Drawing"], 1);
        q4 = new Question("In a network, shared information is stored on a _____ and accessed from a _____",
            ["Flash drive, Computer", "Hard Drive, Operating System", "PAN, WAN", "Server, Client"], 3);
    }

    questionList = [q1, q2, q3, q4];
    updateQuizDisplay();
}

// Updates the displayed question and options associated with each radio button on the quiz screen
function updateQuizDisplay(){
    let questionContainer = document.getElementById("question");
    let radioBtns = document.getElementsByName("quiz");
    let choice1 = document.getElementById("choice1");
    let choice2 = document.getElementById("choice2");
    let choice3 = document.getElementById("choice3");
    let choice4 = document.getElementById("choice4");
    let choices = questionList[currentQuestion].getChoices();

    radioBtns[0].checked = true;
    questionContainer.innerHTML = questionList[currentQuestion].getQuestion();
    choice1.innerHTML = choices[0];
    choice2.innerHTML = choices[1];
    choice3.innerHTML = choices[2];
    choice4.innerHTML = choices[3];
}

// Checks if the selected radio button is the correct answer
// and either progresses to the next question, gives the player the end screen saying they got the question wrong,
// or if it was the last question, congratulate them on answering everything correctly
function checkQuestion(){
    let answer;
    let radioBtns = document.getElementsByName("quiz");
    let endMessage = document.getElementById("endMessage");
    for(const btn of radioBtns){
        if (btn.checked){
            answer = btn.value;
        }
    }
    if (Number(answer) == questionList[currentQuestion].getAnswerIndex()){
        currentQuestion++;
        if (currentQuestion < questionList.length) {
            updateQuizDisplay();
        }
        else {
            quizContainer.style.display = "none";
            endContainer.style.display = "block";
            endMessage.innerText = "You answered all questions correctly!\nClick the button below to select a new topic to learn.";
            retryBtn.style.display = "none";
            restartBtn.style.display = "block";
            
        }
    }
    else {
        quizContainer.style.display = "none";
        endContainer.style.display = "block";
        endMessage.innerText = "Sorry! That was incorrect.\nClick the button below to retry the quiz.";
        retryBtn.style.display = "block";
        restartBtn.style.display = "none";
    }
}

window.addEventListener("load", init);
document.getElementById("startGameBtn").addEventListener("click", setUserAndTopic);
document.getElementById("returnBtn").addEventListener("click", returnToCanvas);
document.getElementById("quizBtn").addEventListener("click", startQuiz);
document.getElementById("quizCheckBtn").addEventListener("click", checkQuestion);
document.getElementById("retryBtn").addEventListener("click", returnToCanvas);
document.getElementById("restartBtn").addEventListener("click", init);
canvas.addEventListener("click", clickCanvas);
canvas.addEventListener("mousemove", debugHover);