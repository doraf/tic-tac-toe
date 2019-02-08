

// for the sake of callculating a win, player X has a value of 1 and play O has a value of -1. Start with player X
var playerTurn = 1; 

// each element corresponds to a place on the 3x3 game board, a value of 0 says that the square hasn't been played
var gameState = [0,0,0,0,0,0,0,0,0]

// grab static NodeList of elements representing squares on the game board
var square = document.querySelectorAll('.square');

// convert NodeList to an array
var squares = [].slice.call(square);

// add an event listener for clicks on all game board squares
for (var i = 0; i < squares.length; i++){
	squares[i].addEventListener('click', playSquare(i), {once : true})
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
				this.firstChild.classList.add('player-x')
				this.firstChild.classList.remove('open-x')
			} else {
				// show O
				this.firstChild.classList.add('player-o')
				this.firstChild.classList.remove('open-o')
			}
			
			// calculate if the most recent play wins the game
			calcWin(playNum)

			// switch players
			switchTurn()
		}
}

// update game state to for next player
function switchTurn(){

	// update marker for the next player (X is 1, O is -1)
	playerTurn *= -1;

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
	// check row for a win
	checkRow(Math.floor(lastPlayed / 3))

	// check column for a win
	checkColumn(lastPlayed % 3)

	// check both diagonals if the player has played a square with an even index
	if (lastPlayed % 2 == 0){
		checkDiagonal()
	}
}

function checkRow(rowNum){
	// Top row will equal 0, middle row 1, bottom row 2
	checkWin(gameState[(rowNum*3)] + gameState[(rowNum*3)+1] + gameState[(rowNum*3)+2])
}

function checkColumn(rowNum){
	// Left column will equal 0, middle collum 1, right column 2
	checkWin(gameState[rowNum] + gameState[rowNum+3] + gameState[rowNum+6])
}

function checkDiagonal(){
	// check the score of both diagonasl
	checkWin(gameState[0] + gameState[4] + gameState[8])
	checkWin(gameState[2] + gameState[4] + gameState[6])
}

// console log if someone has won the game
function checkWin(score){
	if (score == 3){
		console.log('X has won!')
	} else if (score == -3){
		console.log('O has won!')
	}
}