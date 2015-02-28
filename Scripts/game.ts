/// <reference path="objects/button.ts" />

var canvas;
var stage: createjs.Stage;

// Game Objects 
var game: createjs.Container;
var background: createjs.Bitmap;
var spinButton: objects.Button;
var resetButton: objects.Button;
var quitButton: objects.Button;
var tiles: createjs.Bitmap[] = [];
var tileContainers: createjs.Container[] = [];

// Game Variables
var playerMoney = 1000; //initial money assigned to the player
var playerMoneyDisplay = new createjs.Text(playerMoney.toString(), "35px play", "#ff0000 ");

var winnings = 0;       //player winnings
var winningsDisplay = new createjs.Text(winnings.toString(), "35px play", "#ff0000");
var jackpot = 5000;
var winNumber = 0;
var lossNumber = 0;
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
    createjs.Ticker.setFPS(60); // 60 frames per second
    createjs.Ticker.addEventListener("tick", gameLoop);
    main();
}

function gameLoop() {
    stage.update(); // Refreshes our stage
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
/* Utility function to reset all fruit tallies */
function resetFruitTally() {
    blue = 0;
    red = 0;
    copper = 0;
    gold = 0;
    silver = 0;
    green = 0;
}

function playSound(event) {
    console.log(" in here sound");
    var soundInstance = createjs.Sound.play("slot");
    soundInstance.on("complete", resetAudio);
}

function resetAudio() {
    createjs.Sound.removeSound("assets/Sounds/slotsound.mp3", "");
}

function spinReels() {
    if (playerMoney >= 20) {

        createjs.Sound.registerSound({ id: "slot", src: "assets/Sounds/slotsound.mp3" });
        createjs.Sound.addEventListener("fileload", playSound)
        // Add Spin Reels code here
        resetFruitTally();
        game.removeChild(playerMoneyDisplay);
        game.removeChild(winningsDisplay);
        playerMoney = playerMoney - 20;
        spinResult = Reels();
        coins = spinResult[0] + " - " + spinResult[1] + " - " + spinResult[2];
        determineWinnings();
        playerMoney = playerMoney + winnings;
        for (var tile = 0; tile < 3; tile++) {
            console.log('playermoney :' + winnings);
            game.removeChild(tiles[tile]);
            tiles[tile] = new createjs.Bitmap("assets/images/" + spinResult[tile] + ".png");
            tiles[tile].x = 55 + (130 * tile);
            tiles[tile].y = 120;
            game.addChild(tiles[tile]);
        }
        playerMoneyDisplay = new createjs.Text(playerMoney.toString(), "35px play", "#ff0000 ");
        playerMoneyDisplay.x = 75;
        playerMoneyDisplay.y = 290;
        game.addChild(playerMoneyDisplay);

        winningsDisplay = new createjs.Text(winnings.toString(), "35px play", "#ff0000");
        winningsDisplay.x = 325;
        winningsDisplay.y = 290;
        game.addChild(winningsDisplay);
    }
    else {
       // spinButton.mouseEnabled  = false;
        alert(" You have insufficient credits to play. Please restart the game.");
    }
}

/* Utility function to check if a value falls within a range of bounds */
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
            case checkRange(outCome[spin], 1, 17): 
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
            case checkRange(outCome[spin], 63, 70):
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
            winnings = 10 * 20;
            gold = 0;
        }
        else if (gold == 2 && silver == 1) {
            winnings = 10 * 17;
            gold = 0;
            silver = 0;
        }
        else if (gold == 2) {
            winnings = 10 * 15;
            gold = 0;
        }
        else if (gold == 1 && silver == 2) {
            winnings = 10 * 12;
            gold = 0;
            silver = 0;
        }
        else if (silver == 3) {
            winnings = 10 * 10;
            silver = 0;
        }
        else if (silver == 2) {
            winnings = 10 * 8;
            silver = 0;
        }
        else if (copper == 3) {
            winnings = 10 * 7;
            copper = 0;
        }
        else if (red == 3) {
            winnings = 10 * 5;
            red = 0;
        }
        else if (blue == 3) {
            winnings = 10 * 3;
            blue = 0;
        }
        else if (green == 3) {
            console.log(" in here");
            winnings = 10 * 2;
            green = 0;
        }
    else {
        winnings = 0;
        lossNumber++;
    }
    console.log("winnings in round : " + winnings);
    winNumber++;
}

function loadSlotMachine():void {
    // instantiate my background

    background = new createjs.Bitmap("assets/images/slotmachine.png");
    game.addChild(background);

    playerMoneyDisplay.x = 75;
    playerMoneyDisplay.y = 290;
    game.addChild(playerMoneyDisplay);

    winningsDisplay.x = 330;
    winningsDisplay.y = 290;
    game.addChild(winningsDisplay);

    // Spin Button
    spinButton = new objects.Button("assets/images/spinButton.png", 323, 380);
    game.addChild(spinButton.getImage());
    spinButton.getImage().addEventListener("click", spinReels);

    // Reset Button
    resetButton = new objects.Button("assets/images/resetButton.png", 70, 380);
    game.addChild(resetButton.getImage());
    resetButton.getImage().addEventListener("click", reset);

    // Quit Button
    quitButton = new objects.Button("assets/images/quitButton.png", 200, 380);
    game.addChild(quitButton.getImage());
    quitButton.getImage().addEventListener("click", quit);
}

//the game execution begins here
function main() {
    // instantiate my game container
    game = new createjs.Container();
    game.x = 23;
    game.y = 6;
    loadSlotMachine();  //this methods creates the UI for slot machine
    stage.addChild(game);
}