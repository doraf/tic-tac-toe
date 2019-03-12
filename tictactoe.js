// ***************
// ** Variables **
// ***************

// for the sake of callculating a win, player X has a value of 1 and play O has a value of -1. Start with player X
let playerTurn = 1 

// determines which players are human or computer
let playerX
let playerO

// each element corresponds to a place on the 3x3 game board, a value of 0 says that the square hasn't been played
let gameState = []

// the status bar shows the current state of the game
const statusBar = document.querySelector('.status')
const statusText = document.querySelector('.status h2')
const board = document.querySelector('.board')
const playerStatus = document.querySelector('.players')

// elements related to starting a new game
const newGameBtn = document.querySelector('.new-game-button')
const selectX = document.querySelector('.select-x')
const selectO = document.querySelector('.select-o')
const selectXhuman = document.querySelector('#humanx')
const selectXcomputer = document.querySelector('#computerx')
const selectOhuman = document.querySelector('#humano')
const selectOcomputer = document.querySelector('#computero')
const selectXchoice = document.getElementsByName('playerx')
const selectOchoice = document.getElementsByName('playero')

// grab static NodeList of elements representing squares on the game board
const square = document.querySelectorAll('.square')

// convert NodeList to an array
const squares = [].slice.call(square)

// store callback fuction for each square for removing event listeners
let squareCallback = []

// ***************
// ** Functions **
// ***************

// END GAME
function endGame(){
	// remove event listeners
	for (let i = 0; i < squares.length; i++){
		squares[i].removeEventListener('click', squareCallback[i], {once : true})
	}

	// update DOM to trigger proper endgame state
	board.classList.add('over')
}

// initialize the game board
function initGame(){
	// show pickers and new game button
	newGameBtn.classList.remove('hide')
	selectX.classList.remove('hide')
	selectO.classList.remove('hide')

	// enable pickers and new game button
	newGameBtn.removeAttribute('disabled')
	selectXhuman.removeAttribute('disabled')
	selectXcomputer.removeAttribute('disabled')
	selectOhuman.removeAttribute('disabled')
	selectOcomputer.removeAttribute('disabled')

	// add event lister for new game button
	newGameBtn.addEventListener('click', newGame, {once : true})
}

// Clicking a new game button
function newGame(){

	// hide pickers and new game button
	newGameBtn.classList.add('hide')
	selectX.classList.add('hide')
	selectO.classList.add('hide')

	// // disable pickers and new game button
	selectXhuman.setAttribute('disabled', 'disabled')
	selectXcomputer.setAttribute('disabled', 'disabled')
	selectOhuman.setAttribute('disabled', 'disabled')
	selectOcomputer.setAttribute('disabled', 'disabled')

	// determine players
	if (selectXchoice[0].checked){
		// player X is human
		playerX = selectXchoice[0].value
	} else {
		// player X is a computer
		playerX = selectXchoice[1].value
	}

	if (selectOchoice[0].checked){
		// player O is human
		playerO = selectOchoice[0].value
	} else {
		// player O is a computer
		playerO = selectOchoice[1].value
	}

	// reset state of the game, initialize playerTurn
	gameState = [0,0,0,0,0,0,0,0,0]
	playerTurn = 1;

	// remove win class on board
	board.classList.remove('draw')
	board.classList.remove('over')
	board.classList.remove('o-won')
	board.classList.remove('x-won')

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
	showStatus(playerTurn)

	if (playerX == 'computer'){
		computerTurn(gameState, playerTurn)
	}
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
					showStatusWin(1)
					board.classList.add('x-won')
				} else {
					// O has won the game
					showStatusWin(-1)
					board.classList.add('o-won')
				}
				endGame()
				setTimeout(() => {initGame()}, 500)
			} else if (gameState.includes(0)){
				// game continues, switch players
				switchTurn()
			} else {
				// game is a draw
				board.classList.add('draw')
				showStatus(0)
				setTimeout(() => {initGame()}, 500)
			}
		}
}

// update game state to for next player
function switchTurn(){

	// update marker for the next player (X is 1, O is -1)
	playerTurn *= -1;
	showStatus(playerTurn)

	// update DOM to reflect new player
	for (let i = 0; i < squares.length; i++){
		if (squares[i].className != 'square played'){
			squares[i].firstChild.classList.toggle('open-x')
			squares[i].firstChild.classList.toggle('open-o')
		}
	}

	if ((playerTurn == 1 && playerX == 'computer') || (playerTurn == -1 && playerO == 'computer')){
		computerTurn(gameState, playerTurn)
	}
}

// initialize the computer taking a turn
function computerTurn(state, player){

	// space to be played by the computer
	let play = -999999999 * player
	let playIndex

	// store board states of possible next moves
	let moves = []

	// store list of possible moves scores (1 means player x wins, -1 means player 0 wins)
	let scores = []

	// generate scores for the next move
	scores = genMoves(gameState, playerTurn)

	// find an appropriate play for the next move
	if (scores.every(function(score){return score == 0})){
		// first computer move where all spaces have a score of 0
		// pick a random 1st move since all moves are equivalent for variety
		playIndex = Math.floor(Math.random() * Math.floor(9))
	} else if (player == 1){
		// player X
		scores.forEach(function(score, index){
			if (score > play && gameState[index] == 0){
				play = score
				playIndex = index
			}
		})
	} else {
		// player O
		scores.forEach(function(score, index){
			if (score < play && gameState[index] == 0){
				play = score
				playIndex = index
			}
		})
	}

	// play square
	setTimeout(() => {squares[playIndex].click()}, 500)
}

// generate a list of possible scores for each possible next move
function genMoves(state, player){
	// store board states of possible next moves
	let moves = []

	// store list of possible moves scores (1 means player x wins, -1 means player 0 wins)
	let scores = []

	// temporarily store a score value
	let tempScore

	// find possible next moves and generate scores array
	for (let i = 0; i < state.length; i++){

		if (state[i] == 0){

			// add possible move to moves array
			moves = state.slice()
			moves[i] = player

			// determine if the game contains a win
			tempScore = calcWin(i, moves)

			if ((tempScore == 0) && moves.includes(0)){
				// recurse through the minimax function on open spaces that don't end the game
				scores.push(findMiniMax(genMoves(moves, player*-1), player*-1))
			}	else {
				//  game has been won or is a draw
				scores.push(tempScore)
			}
		} else {
			// space has already been played
			scores.push(null)
		}
	}
	return scores
}

// minimax function
function findMiniMax(scores, player){
	let minimax = -999999999 * player

	if (player == 1){
		//  return highest score
		scores.forEach(function(score){
			if ((score > minimax) && (score != null)){
				minimax = score
			}
		})

	} else {
		// return lowest score
		scores.forEach(function(score){
			if ((score < minimax) && (score != null)){
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
	let calcRow = Math.floor(lastPlayed / 3)
	let calcCol = lastPlayed % 3

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

// SHOW GAME STATE
function showStatus(turn){
	// game has not been won
	if (turn == 1){
		// X's turn
		statusBar.classList.remove('o')
		statusBar.classList.add('x')
		statusText.textContent = "X's turn"

		playerStatus.classList.remove('o')
		playerStatus.classList.add('x')
	} else if (turn == -1){
		// O's turn
		statusBar.classList.remove('x')
		statusBar.classList.add('o')
		statusText.textContent = "O's turn"

		playerStatus.classList.remove('x')
		playerStatus.classList.add('o')
	} else if (turn == 0){
		// game is a draw
		statusBar.classList.add('draw')
		statusBar.classList.remove('x')
		statusBar.classList.remove('o')
		statusText.textContent = 'Game is a Draw'
		playerStatus.classList.remove('x')
		playerStatus.classList.remove('o')
	}
}

// SHOW GAME STATE FOR A WINNING GAME
function showStatusWin(turn){
	if (turn == 1){
			// X has won the game
			statusBar.classList.remove('o')
			statusBar.classList.add('x')
			statusText.textContent = 'X has won!'

			playerStatus.classList.remove('o')
			playerStatus.classList.add('x')
		} else {
			// O has won the game
			statusBar.classList.remove('x')
			statusBar.classList.add('o')
			statusText.textContent = 'O has won!'

			playerStatus.classList.remove('x')
			playerStatus.classList.add('o')
		}
}

// ****************
// ** Let's Play **
// ****************

initGame()

