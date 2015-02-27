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
var playerMoneyDisplay;
var playermoney2;
playerMoneyDisplay = new createjs.Text(playerMoney.toString(), "35px play", "#ff0000 ");
playerMoneyDisplay.x = 75;
playerMoneyDisplay.y = 290;
var winnings = 0;       //player winnings
var jackpot = 5000;
var turn = 0;
var playerBet = 0;      //bet placed by the player
var winNumber = 0;
var lossNumber = 0;
var spinResult;
var coins = "";
var winRatio = 0;


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


/* Utility function to reset all fruit tallies */
function resetFruitTally() {
    blue = 0;
    red = 0;
    copper = 0;
    gold = 0;
    silver = 0;
    green = 0;
}


function spinReels() {
    // Add Spin Reels code here
    game.removeChild(playerMoneyDisplay);
    game.removeChild(playermoney2);
    spinResult = Reels();
    coins = spinResult[0] + " - " + spinResult[1] + " - " + spinResult[2];
    console.log(coins);
    for (var tile = 0; tile < 3; tile++) {
        playerMoney--;
        console.log('playermoney :' + playerMoney);
        game.removeChild(tiles[tile]);
        tiles[tile] = new createjs.Bitmap("assets/images/" + spinResult[tile] + ".png");
        tiles[tile].x = 55 + (120 * tile);      
        tiles[tile].y = 120;
        game.addChild(tiles[tile]);
    }
    playermoney2 = new createjs.Text(playerMoney.toString(), "35px play", "#ff0000 ");
    playermoney2.x = 75;
    playermoney2.y = 290;
    game.addChild(playermoney2);

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
        outCome[spin] = Math.floor((Math.random() * 72) + 1);
        switch (outCome[spin]) {
            case checkRange(outCome[spin], 1, 12): 
                betLine[spin] = "green";
                green++;
                break;
            case checkRange(outCome[spin], 13, 25): 
                betLine[spin] = "blue";
                blue++;
                break;
            case checkRange(outCome[spin], 26, 38):
                betLine[spin] = "red";
                red++;
                break;
            case checkRange(outCome[spin], 39, 50): 
                betLine[spin] = "copper";
                copper++;
                break;
            
            case checkRange(outCome[spin], 51, 64): 
                betLine[spin] = "silver";
                silver++;
                break;
            case checkRange(outCome[spin], 65, 72):
                betLine[spin] = "gold";
                gold++;
                break;
        }
    }
    return betLine;
}


/* This function calculates the player's winnings, if any */
function determineWinnings() {
    if (green == 0) {
        if (blue == 3) {
            winnings = playerBet * 10;
        }
        else if (red == 3) {
            winnings = playerBet * 20;
        }
        else if (copper == 3) {
            winnings = playerBet * 30;
        }
        else if (gold == 3) {
            winnings = playerBet * 40;
        }
        else if (silver == 3) {
            winnings = playerBet * 50;
        }
        else if (blue == 2) {
            winnings = playerBet * 2;
        }
        else if (red == 2) {
            winnings = playerBet * 2;
        }
        else if (copper == 2) {
            winnings = playerBet * 3;
        }
        else if (gold == 2) {
            winnings = playerBet * 4;
        }
        else if (silver == 2) {
            winnings = playerBet * 5;
        }
        else {
            winnings = playerBet * 1;
        }
        winNumber++;
       // showWinMessage();
    }
    else {
        lossNumber++;
      //  showLossMessage();
    }

}

function loadSlotMachine():void {
    // instantiate my background

    background = new createjs.Bitmap("assets/images/slotmachine.png");
    game.addChild(background);

    game.addChild(playerMoneyDisplay);
    // Spin Button
    spinButton = new objects.Button("assets/images/spinButton.png", 323, 380);
    game.addChild(spinButton.getImage());
    spinButton.getImage().addEventListener("click", spinReels);


    // Reset Button
    resetButton = new objects.Button("assets/images/resetButton.png", 38, 380);
    game.addChild(resetButton.getImage());
    resetButton.getImage().addEventListener("click", function () {
        console.log("reset clicked");
    });

    // Quit Button
    quitButton = new objects.Button("assets/images/quitButton.png", 185, 380);
    game.addChild(quitButton.getImage());
    quitButton.getImage().addEventListener("click", function () {
        console.log(" quit clicked");
    });
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