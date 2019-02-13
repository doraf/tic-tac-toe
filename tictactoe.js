

// for the sake of callculating a win, player X has a value of 1 and play O has a value of -1. Start with player X
var playerTurn = 1; 

// each element corresponds to a place on the 3x3 game board, a value of 0 says that the square hasn't been played
var gameState = []

// the status bar shows the current state of the game
var statusBar = document.querySelector('.status')
var statusText = document.querySelector('.status h2')
var board = document.querySelector('.board')

// grab static NodeList of elements representing squares on the game board
var square = document.querySelectorAll('.square');

// convert NodeList to an array
var squares = [].slice.call(square);

// store callback fuction for each square for removing event listeners
var squareCallback = [];


// END GAME
function endGame(){
	for (var k = 0; k < squares.length; k++){
		squares[k].removeEventListener('click', squareCallback[k], {once : true})
	}

	// update DOM to trigger proper endgame state
	board.classList.add('over')
}

// Provide Feedback that the game is a draw
function drawGame(){
	board.classList.add('draw')
	statusBar.classList.add('draw')
	statusBar.classList.remove('x')
	statusBar.classList.remove('o')
	statusText.textContent = 'Game is a Draw'
}

// initialize the game board
function initGame(){
	gameState = [0,0,0,0,0,0,0,0,0]
	playerTurn = 1;

	// remove win class on board
	board.classList.remove('draw')
	board.classList.remove('over')
	board.classList.remove('o-won')
	board.classList.remove('x-won')

	// set proper classes on status bar
	statusBar.classList.remove('x')
	statusBar.classList.remove('o')

	// remove all played, played-o, played-x
	squares.forEach(function(square){
		console.log(square)
		square.classList.remove('played')
		square.classList.remove('played-x')
		square.firstChild.classList.add('open-x')
		square.firstChild.classList.remove('player-x')

		square.classList.remove('played-o')
		square.firstChild.classList.remove('open-o')
		square.firstChild.classList.remove('player-o')
	})

	// add event listeners
	for (var i = 0; i < squares.length; i++){
		squareCallback[i] = playSquare(i)
		squares[i].addEventListener('click', squareCallback[i], {once : true})
	}

	// init status bar
	initStatusBar()
}

// return a function to select a square on behalf of the player
function playSquare(playNum){
		return function(event){
			// update game state array to show that the space in play
			gameState[playNum] = playerTurn;

			// update DOM to show X or O on the game board
			this.classList.add('played')

			if (playerTurn == 1){
				// show X
				this.classList.add('played-x')
				this.firstChild.classList.add('player-x')
				this.firstChild.classList.remove('open-x')
			} else {
				// show O
				this.classList.add('played-o')
				this.firstChild.classList.add('player-o')
				this.firstChild.classList.remove('open-o')
			}
			
			// calculate if the most recent play wins the game
			if (calcWin(playNum)){
				// game has been won by one of the players
				endGame()
				setTimeout(() => {initGame()}, 1500)
			} else if (gameState.includes(0)){
				// game continues, switch players
				switchTurn()
			} else {
				// game is a draw
				drawGame()
				setTimeout(() => {initGame()}, 1500)
			}
		}
}

// update game state to for next player
function switchTurn(){

	// update marker for the next player (X is 1, O is -1)
	playerTurn *= -1;
	updateStatusBar()

	// update DOM to reflect new player
	for (var j = 0; j < squares.length; j++){
		if (squares[j].className != 'square played'){
			squares[j].firstChild.classList.toggle('open-x')
			squares[j].firstChild.classList.toggle('open-o')
		}
	}
}

// Check to see if the most recent turn has won the game
// lastPlayed is the index of the last played square in the game state array
function calcWin(lastPlayed){
	var calcRow = Math.floor(lastPlayed / 3)
	var calcCol = lastPlayed % 3

	// check both diagonals if the player has played a square with an even index
	if (lastPlayed % 2 == 0){
		return (checkDiagonal() || checkColumn(calcCol) || checkRow(calcRow))
	} else {
		return (checkColumn(calcCol) || checkRow(calcRow))
	}
}

function checkRow(rowNum){
	// Top row will equal 0, middle row 1, bottom row 2
	return (checkWin(gameState[(rowNum*3)] + gameState[(rowNum*3)+1] + gameState[(rowNum*3)+2]))
}

function checkColumn(rowNum){
	// Left column will equal 0, middle collum 1, right column 2
	return (checkWin(gameState[rowNum] + gameState[rowNum+3] + gameState[rowNum+6]))
}

function checkDiagonal(){
	// check the score of both diagonals
	return (checkWin(gameState[0] + gameState[4] + gameState[8]) || checkWin(gameState[2] + gameState[4] + gameState[6]))
}

// return true if someone has won the game
function checkWin(score){
	if (score == 3){
		statusText.textContent = 'X has won!'
		board.classList.add('x-won')
		return true;
	} else if (score == -3){
		statusText.textContent = 'O has won!'
		board.classList.add('o-won')
		return true;
	} else {
		return false;
	}
}

// STATUS BAR
function initStatusBar(){
	statusBar.classList.toggle('x')
	statusText.textContent = "X's turn"
}

function updateStatusBar(){
	statusBar.classList.toggle('x')
	statusBar.classList.toggle('o')
	if (playerTurn == 1) {
		statusText.textContent = "X's turn"
	} else if (playerTurn == -1){
		statusText.textContent = "O's turn"
	}
}

// add an event listener for clicks on all game board squares
// for (var i = 0; i < squares.length; i++){
// 	squareCallback[i] = playSquare(i)
// 	squares[i].addEventListener('click', squareCallback[i], {once : true})
// }

// initStatusBar()

initGame()


