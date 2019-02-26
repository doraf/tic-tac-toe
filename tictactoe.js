// ***************
// ** Variables **
// ***************

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

// ***************
// ** Functions **
// ***************

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
		square.classList.remove('played')
		square.classList.remove('played-x')
		square.firstChild.classList.add('open-x')
		square.firstChild.classList.remove('player-x')

		square.classList.remove('played-o')
		square.firstChild.classList.remove('open-o')
		square.firstChild.classList.remove('player-o')
	})

	// add event listeners
	for (let i = 0; i < squares.length; i++){
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
			if (calcWin(playNum, gameState)){
				// game has been won by one of the players
				if (playerTurn == 1){
					// X has won the game
					statusText.textContent = 'X has won!'
					board.classList.add('x-won')
				} else {
					// O has won the game
					statusText.textContent = 'O has won!'
					board.classList.add('o-won')
				}
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

	if (playerTurn == -1){
		computerTurn(gameState, playerTurn)
	}
}

// attempt at recursion... good luck to me
function computerTurn(state, player){
	// open spaces left on the board
	var openSpaces = []

	// space to be played by the computer
	var play = 999999999
	var playIndex

	// store board states of possible next moves
	var moves = []

	// store list of possible moves scores (1 means player x wins, -1 means player 0 wins)
	var scores = []

	// find possible next moves
	for (let i = 0; i < state.length; i++){

		if (state[i] == 0){
			// set up open space array
			openSpaces.push(i)
		}
	}

	// console.log('PLAY: ' + play)

	scores = genMoves(gameState, playerTurn)
	console.log(scores)

	// console.log(scores)
	// console.log(play)
	scores.forEach(function(score, index){
		// console.log(index + ': ' + score)
		if (score < play && gameState[index] == 0){
			// console.log('score: ' + score)
			play = score
			playIndex = index
			// console.log('PLAY: ' + playIndex)
		}
	})
	// playIndex = 1
	// console.log('PLAY: ' + playIndex)

	// play = openSpaces[Math.floor(Math.random() * openSpaces.length)]
	// play square
	setTimeout(() => {squares[playIndex].click()}, 500)
}

function genMoves(state, player){
	// store board states of possible next moves
	var moves = []

	// store list of possible moves scores (1 means player x wins, -1 means player 0 wins)
	var scores = []

	var tempScore
	var tempScores = []

	// find possible next moves and generate scores array
	for (let i = 0; i < state.length; i++){

		if (state[i] == 0){

			// add possible move to moves array
			moves = state.slice()
			moves[i] = player

			// determine if the game contains a win
			tempScore = calcWin(i, moves)

			// console.log("score: " + tempScore)
			if (tempScore == 0 && moves.includes(0)){
				// keep recursing
				// scores.push(genMoves(moves, player*-1).reduce((totalScore, cur) => totalScore + cur))
				scores.push(findMiniMax(genMoves(moves, player*-1), player*-1))
			}	else {
				//  game has been won or is a draw
				scores.push(tempScore)
			}
		} else {
			scores.push(null)
		}
	}
	return scores
}

// minimax function
function findMiniMax(scores, player){
	let minimax = -999999999 * player

	if (player === 1){
		//  return highest score
		scores.forEach(function(score){
			if (score > minimax && score != null){
				minimax = score
			}
		})

	} else {
		// return lowest score
		scores.forEach(function(score){
			if (score < minimax && score != null){
				minimax = score
			}
		})
	}

	// return the selected score
	return minimax
}

// check for a win on the entire game, without knowing the previous move
function calcGame(testState){
	// console.log(checkDiagonal(testState) + ', ' + checkRow(1, testState) + ', ' + checkRow(2, testState) + ', ' + checkRow(3, testState) + ', ' + checkColumn(1, testState) + ', ' + checkColumn(2, testState) + ', ' + checkColumn(3, testState))
	return (checkDiagonal(testState) || 
		checkRow(1, testState) ||
		checkRow(2, testState) ||
		checkRow(3, testState) ||
		checkColumn(1, testState) ||
		checkColumn(2, testState) ||
		checkColumn(3, testState))
}

// Check to see if the most recent turn has won the game
// lastPlayed is the index of the last played square in the game state array
function calcWin(lastPlayed, testState){
	var calcRow = Math.floor(lastPlayed / 3)
	var calcCol = lastPlayed % 3

	// check both diagonals if the player has played a square with an even index
	if (lastPlayed % 2 == 0){
		return (checkDiagonal(testState) || checkColumn(calcCol, testState) || checkRow(calcRow, testState))
	} else {
		return (checkColumn(calcCol, testState) || checkRow(calcRow, testState))
	}
}

function checkRow(rowNum, testState){
	// Top row will equal 0, middle row 1, bottom row 2
	return (checkWin(testState[(rowNum*3)] + testState[(rowNum*3)+1] + testState[(rowNum*3)+2]))
}

function checkColumn(rowNum, testState){
	// Left column will equal 0, middle collum 1, right column 2
	return (checkWin(testState[rowNum] + testState[rowNum+3] + testState[rowNum+6]))
}

function checkDiagonal(testState){
	// check the score of both diagonals
	return (checkWin(testState[0] + testState[4] + testState[8]) || checkWin(testState[2] + testState[4] + testState[6]))
}

// return true if someone has won the game
function checkWin(score){
	if (score == 3){
		// X has won the game
		return 1;
	} else if (score == -3){
		// O has won the game
		return -1;
	} else {
		// no one has won the game
		return 0;
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

initGame()

