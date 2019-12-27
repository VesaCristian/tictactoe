var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
var gameWin = false;
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(9).keys());
    gameWin = false;
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square) {
    if( typeof origBoard[square.target.id] == 'number') {
        turn(square.target.id, huPlayer);
        if(!gameWin){
            if(!checkTie()) {
                turn(bestSpot(), aiPlayer);
            }
        }    
    }   
}

function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player , false);
    if(gameWon) gameOver(gameWon)
}

function checkWin(board, player, minimax) {
    let plays = board.reduce((a, e, i) => 
    (e === player) ? a.concat(i) : a, [])
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        if(win.every(elem => plays.indexOf(elem) > -1)){
            gameWon = {index: index, player: player};
            if(!minimax)
                gameWin = true;
            //gameWin = true;
            //console.log("Game won:" + gameWon.player);
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for( let index of winCombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor = gameWon.player == huPlayer ? "blue" : "red";
    }
    for (var i = 0; i < cells.length; i++){
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose!")
}

function emptySquares() {
    return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
    // without the minimax algorithm
   // return emptySquares()[0]; 
   return minimax(origBoard, aiPlayer).index;
}

function declareWinner(who){
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function checkTie() {
    if( emptySquares().length == 0) {
        for( var i = 0 ; i < cells.length; i++){
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click',turnClick, false);
        }
        declareWinner("Tie Game!");
        return true;
    }
    return false;
}

function minimax(newBoard, player){
    var availableSpots = emptySquares(newBoard);

    if(checkWin(newBoard, player, true)) {
        return {score: -10};
    } else if( checkWin(newBoard,aiPlayer, true)) {
        return {score: 10};
    } else if (availableSpots.length === 0) {
        return {score: 0};
    }

    var moves = [];
    for(var i = 0 ; i < availableSpots.length; i++){
        var move = {};
        move.index = newBoard[availableSpots[i]];
        newBoard[availableSpots[i]] = player;

        if(player == aiPlayer) {
            var result = minimax(newBoard, huPlayer);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availableSpots[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if(player === aiPlayer) {
        var bestScore = -10000;
        for(var i=0 ; i < moves.length; i++) {
            if(moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for(var i=0 ; i < moves.length; i++) {
            if(moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}