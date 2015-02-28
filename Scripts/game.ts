/// <reference path="objects/button.ts" />

var canvas;
var stage: createjs.Stage;

// Game Objects 
var game: createjs.Container;
var background: createjs.Bitmap;
var spinButton: objects.Button;
var resetButton: objects.Button;
var quitButton: objects.Button;
var coinReel: createjs.Bitmap[] = [];
var coinContainer: createjs.Container[] = [];

// Game Variables
var playerMoney = 1000; //Variable holding the money left for the player, initially set to 1000
var playerMoneyDisplay = new createjs.Text(playerMoney.toString(), "35px play", "#ff0000 ");

var winnings = 0;       //variable holding winnings of each spin
var winningsDisplay = new createjs.Text(winnings.toString(), "35px play", "#ff0000");

var spinResult;
var coins = "";

/* Tally Variables */
var blue = 0;
var red = 0;
var copper = 0;
var gold = 0;
var silver = 0;
var green = 0;

function init() {
    canvas = document.getElementById("canvas");
    stage = new createjs.Stage(canvas);
    stage.enableMouseOver(20); // Enable mouse events
    createjs.Ticker.setFPS(60); // Setting 60 Frames per second
    createjs.Ticker.addEventListener("tick", gameLoop);
    main();
}

//Refreshes the createjs stage each time
function gameLoop() {
    stage.update(); 
}

//function to reset the game
function reset() {
    var r = confirm(" Are you sure you want to reset ? ");
    if (r == true) {
        playerMoney = 1000;
        winnings = 0;
        playerMoneyDisplay = new createjs.Text(playerMoney.toString(), "35px play", "#ff0000 ");
        winningsDisplay = new createjs.Text(winnings.toString(), "35px play", "#ff0000");
        resetFruitTally();
        loadSlotMachine();
    }
}

//function to quit the game
function quit() {
    var q = confirm(" Are you sure you want to quit ? ");
    if (q == true) {
        alert(" You total winnings : " + playerMoney);
        playerMoney = 1000;
        winnings = 0;
        playerMoneyDisplay = new createjs.Text(playerMoney.toString(), "35px play", "#ff0000 ");
        winningsDisplay = new createjs.Text(winnings.toString(), "35px play", "#ff0000");
        resetFruitTally();
        loadSlotMachine();
    }
}

//Function to reset all the coin tallies
function resetFruitTally() {
    blue = 0;
    red = 0;
    copper = 0;
    gold = 0;
    silver = 0;
    green = 0;
}

//Function to play the sounds for various events
function playSound(event) {
    if (event.id == "slot") {
        var soundInstance = createjs.Sound.play("slot");
        soundInstance.on("complete", resetSpinAudio);
    }
    if (event.id == "jackpot") {
        var soundInstance = createjs.Sound.play("jackpot");
        soundInstance.on("complete", resetJackpotAudio);
    }    
    if (event.id == "winning") {
        var soundInstance = createjs.Sound.play("winning");
        soundInstance.on("complete", resetWinningAudtio);
    }
}

//the below three functions resets the audio after they are played
function resetSpinAudio() {
    createjs.Sound.removeSound("assets/Sounds/slotsound.mp3", "");
}

function resetJackpotAudio() {
    createjs.Sound.removeSound("assets/Sounds/jackpot.mp3", "");
}

function resetWinningAudtio() {
    createjs.Sound.removeSound("assets/Sounds/winning.mp3","");
}

//Play the audio for winning the jackpot, 3 x gold
function playJackpotSound() {
    createjs.Sound.registerSound({ id: "jackpot", src: "assets/Sounds/jackpot.mp3" });
    createjs.Sound.addEventListener("fileload", playSound)
}

//Play the audio when the player wins any money other than jackpot
function playWinningSound() {
    createjs.Sound.registerSound({ id: "winning", src: "assets/Sounds/winning.mp3" });
    createjs.Sound.addEventListener("fileload",playSound)
}

// Play the audion when the player clicks on the spin button
function playSpinSound() {
    createjs.Sound.registerSound({ id: "slot", src: "assets/Sounds/slotsound.mp3" });
    createjs.Sound.addEventListener("fileload", playSound)
}

/* The actual logic of the game goes here.
 * Three coins are randomly  generated and displayed in the container.
 * Depending on the outcome of the game, the player either loses credits or earns.
 */
function spinReels() {
    if (playerMoney >= 20)      //check if the balance is greater than 20
    {
        playSpinSound();
        resetFruitTally();
        game.removeChild(playerMoneyDisplay);   //removing the child image showing the player money
        game.removeChild(winningsDisplay);      //removing the child image showing the winning credit
        playerMoney = playerMoney - 20;         //reducing 20 credits from player money for each round of spin
        spinResult = Reels();
        coins = spinResult[0] + " - " + spinResult[1] + " - " + spinResult[2];
        determineWinnings();
        if (winnings == 200) {
            playJackpotSound();     //play the winning sound if all gold
        }     
        else if (winnings < 200 && winnings >= 20) {
            playWinningSound();      //play for other instances of winning
        }     
           
        playerMoney = playerMoney + winnings;       //adding the player winnings to playermoney
        for (var coinTile = 0; coinTile < 3; coinTile++) {
            console.log('winnings :' + winnings+ ", Player Money : "+playerMoney);
            game.removeChild(coinReel[coinTile]);       //removing the child image of the coin reel
            coinReel[coinTile] = new createjs.Bitmap("assets/images/" + spinResult[coinTile] + ".png");
            coinReel[coinTile].x = 55 + (130 * coinTile);
            coinReel[coinTile].y = 120;
            game.addChild(coinReel[coinTile]);          //adding the new image of the coin reel
        }   
        playerMoneyDisplay = new createjs.Text(playerMoney.toString(), "35px play", "#ff0000 ");
        playerMoneyDisplay.x = 75;
        playerMoneyDisplay.y = 290;
        game.addChild(playerMoneyDisplay);
        
        winningsDisplay = new createjs.Text(winnings.toString(), "35px play", "#ff0000");
        winningsDisplay.x = 325;
        winningsDisplay.y = 290;
        game.addChild(winningsDisplay);
        if (playerMoney < 20)
        {
            //disabling the spin button is minimum credits is not available
            spinButton.getImage().removeAllEventListeners();
            spinButton.getImage().alpha = 0.1;
        } 
    }
    else {
        //disabling the spin button is minimum credits is not available
        spinButton.getImage().removeAllEventListeners();
        spinButton.getImage().alpha = 0.1; 
    }
}

// Function to check if the generated value falls within the range of bounds
function checkRange(value, lowerBounds, upperBounds) {
    if (value >= lowerBounds && value <= upperBounds) {
        return value;
    }
    else {
        return !value;
    }
}

/* When this function is called it determines the betLine results. */
function Reels() {
    var betLine = [" ", " ", " "];
    var outCome = [0, 0, 0];

    for (var spin = 0; spin < 3; spin++) {
        outCome[spin] = Math.floor((Math.random() * 70) + 1);
        switch (outCome[spin]) {
            case checkRange(outCome[spin], 1, 17):     //Maximum Probability
                betLine[spin] = "green";
                green++;
                break;
            case checkRange(outCome[spin], 18, 32): 
                betLine[spin] = "blue";
                blue++;
                break;
            case checkRange(outCome[spin], 33, 43):
                betLine[spin] = "red";
                red++;
                break;
            case checkRange(outCome[spin], 44,52 ): 
                betLine[spin] = "copper";
                copper++;
                break;            
            case checkRange(outCome[spin], 53, 62): 
                betLine[spin] = "silver";
                silver++;
                break;
            case checkRange(outCome[spin], 63, 70):     //Minimum probability
                betLine[spin] = "gold";
                gold++;
                break;
        }
    }
    return betLine;
}


/* This function calculates the player's winnings, if any */
function determineWinnings() {
    winnings = 0;
        if (gold == 3) {
            winnings = 10 * 20;     //200 credits
            gold = 0;
        }
        else if (gold == 2 && silver == 1) {
            winnings = 10 * 17;     //170 credits
            gold = 0;
            silver = 0;
        }
        else if (gold == 2) {
            winnings = 10 * 15;     // 150 credits
            gold = 0;       
        }
        else if (gold == 1 && silver == 2) {
            winnings = 10 * 12;     //120 credits
            gold = 0;
            silver = 0;
        }
        else if (silver == 3) {     
            winnings = 10 * 10;     //100 credits
            silver = 0;
        }
        else if (silver == 2) {
            winnings = 10 * 8;      //80 credits
            silver = 0;
        }
        else if (copper == 3) {
            winnings = 10 * 7;      //70 credits
            copper = 0;
        }
        else if (red == 3) {
            winnings = 10 * 5;      //50 credits
            red = 0;
        }
        else if (blue == 3) {
            winnings = 10 * 3;      //30 credits
            blue = 0;
        }
        else if (green == 3) {      //20 credits
            winnings = 10 * 2;
            green = 0;
        }
    else {
        winnings = 0;
    }
}

function loadSlotMachine(): void {

    // instantiate my background
    background = new createjs.Bitmap("assets/images/slotmachine.png");
    game.addChild(background);

    playerMoneyDisplay.x = 75;
    playerMoneyDisplay.y = 290;
    game.addChild(playerMoneyDisplay);

    winningsDisplay.x = 330;
    winningsDisplay.y = 290;
    game.addChild(winningsDisplay);

    // Spin Button, Button to spin the reel each time
    spinButton = new objects.Button("assets/images/spinButton.png", 323, 380);
    game.addChild(spinButton.getImage());
    spinButton.getImage().addEventListener("click", spinReels);

    // Reset Button, Button to reset the game
    resetButton = new objects.Button("assets/images/resetButton.png", 70, 380);
    game.addChild(resetButton.getImage());
    resetButton.getImage().addEventListener("click", reset);

    // Quit Button, Button to end the game
    quitButton = new objects.Button("assets/images/quitButton.png", 200, 380);
    game.addChild(quitButton.getImage());
    quitButton.getImage().addEventListener("click", quit);
}

//the game execution begins here
function main() {

    // instantiate the game container
    game = new createjs.Container();
    game.x = 23;
    game.y = 6;
    loadSlotMachine();  //this methods creates the UI for slot machine
    stage.addChild(game); 
}