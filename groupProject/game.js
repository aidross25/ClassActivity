document.addEventListener("DOMContentLoaded", function() {
    // Get the player name and chosen topic
    var playerNameInput = document.getElementById("playerName");
    var topicSelect = document.getElementById("topic");
    var startButton = document.getElementById("startButton");
    var infoPanel = document.getElementById("infoPanel");
    
    // Listen for changes in input
    playerNameInput.addEventListener("input", checkInputs);
    topicSelect.addEventListener("change", checkInputs);
    startButton.addEventListener("click", startGame);

    // Default values
    var playerName = "";
    var topic = "";
    var gameStarted = false;
    var coins = 0;

    // Get the canvas element and its context
    var canvas = document.getElementById("gameCanvas");
    var ctx = canvas.getContext("2d");

    // Resize canvas and info panel to fit window
    resizeElements();

    // Define the character properties
    var character = {
        x: 50,
        y: 50,
        width: 30,
        height: 30,
    };

    // Define the map properties
    var map = {
        houses: [
            { x: 200, y: 200, topic: "Coding", info: "This house contains information about coding.", coin: true },
            { x: 400, y: 300, topic: "Network", info: "This house contains information about networks.", coin: true },
            { x: 600, y: 400, topic: "Careers", info: "This house contains information about careers in computer science.", coin: true },
            { x: 300, y: 400, topic: "Coding", info: "Learn about coding basics here!", coin: false },
            { x: 500, y: 200, topic: "Network", info: "Explore the world of computer networks!", coin: false },
            { x: 700, y: 100, topic: "Careers", info: "Discover exciting career opportunities in computer science!", coin: false },
            { x: 100, y: 300, topic: "Coding", info: "This house provides advanced coding tips!", coin: false },
            { x: 200, y: 500, topic: "Network", info: "Explore the future of networking technologies!", coin: false },
            { x: 600, y: 200, topic: "Careers", info: "Learn how to prepare for a successful career in tech!", coin: false }
        ]
    };

    // Draw the character
    function drawCharacter() {
        ctx.fillStyle = "blue";
        ctx.fillRect(character.x, character.y, character.width, character.height);
    }

    // Draw the map with houses
    function drawMap() {
        map.houses.forEach(function(house) {
            var color;
            switch (house.topic) {
                case "Coding":
                    color = "#FF5733"; // Orange
                    break;
                case "Network":
                    color = "#3399FF"; // Blue
                    break;
                case "Careers":
                    color = "#33FF66"; // Green
                    break;
                default:
                    color = "#CCCCCC"; // Gray
                    break;
            }
            ctx.fillStyle = color;
            ctx.fillRect(house.x, house.y, 50, 50); // Each house is represented by a rectangle
        });
    }

    // Check for collisions between character and houses
    function checkCollisions() {
        map.houses.forEach(function(house) {
            if (character.x < house.x + 50 &&
                (character.x + character.width) > house.x &&
                character.y < house.y + 50 &&
                (character.y + character.height) > house.y) {
                if (house.coin) {
                    coins++; // Increase coins if the house contains a coin
                    house.coin = false; // Remove the coin from the house after collecting
                    console.log("Coins:", coins);
                } else {
                    // Display information about the house
                    if (house.topic === topic) {
                        displayInfo(house.info);
                    } else {
                        displayInfo("This house doesn't contain information about the selected topic.");
                    }
                    if (coins >= 4) {
                        finalBossEncounter(); // Start final boss encounter if user has enough coins
                    }
                }
            }
        });
    }

    // Clear the canvas
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Update the character's position
    function update() {
        // Move character based on key presses
        window.addEventListener("keydown", function(event) {
            switch (event.key) {
                case "ArrowUp":
                    if(character.y - 0.2 < 0){
                        character.y = 0;
                    } else {
                        character.y -= 0.2;
                    }
                    break;
                case "ArrowDown":
                    if(character.y + 0.2 > (canvas.height)){
                        character.y = canvas.height;
                    } else {
                        character.y += 0.2;
                    }
                    break;
                case "ArrowLeft":
                    if(character.x - 0.2 < 0){
                        character.x = 0;
                    } else {
                        character.x -= 0.2;
                    }
                    break;
                case "ArrowRight":
                    if(character.x + 0.2 > canvas.width){
                        character.x = canvas.width;
                    } else {
                        character.x += 0.2;
                    }
                    break;
            }
        });

        // Check for collisions with houses
        checkCollisions();

        // Draw the map and character
        clearCanvas();
        drawMap();
        drawCharacter();

        // Request to update the frame
        if (gameStarted) {
            requestAnimationFrame(update);
        }
    }

    // Function to check if both name and topic are provided
    function checkInputs() {
        playerName = playerNameInput.value;
        topic = topicSelect.value;
        if (playerName && topic) {
            startButton.disabled = false;
        } else {
            startButton.disabled = true;
        }
    }

    // Function to start the game
    function startGame() {
        gameStarted = true;
        canvas.style.display = "block"; // Show the canvas
        startButton.style.display = "none"; // Hide the start button
        update(); // Start the game loop
    }

    // Function to display information in the info panel
    function displayInfo(info) {
        infoPanel.textContent = info;
    }

    // Function to initiate final boss encounter
    function finalBossEncounter() {
        // Randomly select a quiz question for the chosen topic
        var questions = quizQuestions[topic];
        var randomQuestion = questions[Math.floor(Math.random() * questions.length)];

        // Prompt the user with the question and ask for their answer
        var optionsString = randomQuestion.options.map((option, index) => `${index + 1}. ${option}`).join("\n");
        var userAnswer = prompt(`${randomQuestion.question}\n\n${optionsString}`);

        // Check if the user's answer is correct
        if (userAnswer !== null) {
            var userOptions = userAnswer.split(",").map(option => parseInt(option.trim(), 10) - 1);
            var correctOptions = randomQuestion.correctOptions;

            // Check if user's options match correct options
            var isCorrect = correctOptions.every(option => userOptions.includes(option)) && userOptions.length === correctOptions.length;

            if (isCorrect) {
                alert("Correct answer! You win!");
            } else {
                alert("Incorrect answer! Try again.");
                // Allow the user to try again
                coins = 0; // Reset coins
                gameStarted = false; // Stop the game loop temporarily
                infoPanel.textContent = ""; // Clear info panel
                startButton.style.display = "inline"; // Show start button
                startButton.disabled = true; // Disable start button until name and topic are provided
            }
        }
    }

    // Resize canvas and info panel to fit window
    function resizeElements() {
        canvas.width = window.innerWidth * 0.9; // Set canvas width to 80% of window width
        canvas.height = window.innerHeight * 0.8; // Set canvas height to window height
        infoPanel.style.width = window.innerWidth * 0.8 + "px"; // Set info panel width to 20% of window width
    }

    // Event listener for window resize
    window.addEventListener("resize", function() {
        resizeElements();
        if (gameStarted) {
            clearCanvas();
            drawMap();
            drawCharacter();
        }
    });

    // Initial drawing
    drawMap();
    drawCharacter();
    resizeElements();
});
