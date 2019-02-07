// 1 is player x, -1 is player o
var playerTurn = 1; 
var gameState = [0,0,0,0,0,0,0,0,0]
var square = document.querySelectorAll('.square');

//square is a nodelist, convert to array
var squares = [].slice.call(square);
console.log(squares)


for (var i = 0; i < squares.length; i++){
	squares[i].addEventListener('click', playSquare(i))
}

function playSquare(playNum){
		return function(event){
			// console.log(playNum)
			// update gameState
			gameState[playNum] = playerTurn;

			// display x or o
			event.currentTarget.classList.add('played')
			if (playerTurn == 1){
				event.currentTarget.firstChild.classList.add('player-x')
				event.currentTarget.firstChild.classList.remove('open-x')
			} else {
				event.currentTarget.firstChild.classList.add('player-o')
				event.currentTarget.firstChild.classList.remove('open-o')
			}
			
			this.removeEventListener('click', playSquare)
			calcWin(playNum)
			switchTurn()
		}
}


function switchTurn(){
	playerTurn *= -1;
	// console.log(playerTurn)
	for (var j = 0; j < squares.length; j++){
		if (squares[j].className != 'square played'){
			squares[j].firstChild.classList.toggle('open-x')
			squares[j].firstChild.classList.toggle('open-o')
		}
	}
}

function calcWin(lastPlayed){
	// console.log('last played: ' + lastPlayed)

	// check row
	checkRow(Math.floor(lastPlayed / 3))

	// check column
	checkColumn(lastPlayed % 3)

	// check diagonal
	if (lastPlayed % 2 == 0){
		checkDiagonal()
	}
}

function checkRow(rowNum){
	// if (rowNum == 0){
	// 	// top row
	// 	console.log("top row")
	// 	checkWin(gameState[0] + gameState[1] + gameState[2])
	// } else if (rowNum == 1){
	// 	//  middle row
	// 	console.log("middle row")
	// 	checkWin(gameState[3] + gameState[4] + gameState[5])
	// } else {
	// 	// bottom row
	// 	console.log("bottom row")
	// 	checkWin(gameState[6] + gameState[7] + gameState[8])
	// }
	checkWin(gameState[(rowNum*3)] + gameState[(rowNum*3)+1] + gameState[(rowNum*3)+2])
}

function checkColumn(rowNum){
	// if (rowNum == 0){
	// 	// left column
	// 	console.log("left column")
	// 	checkWin(gameState[0] + gameState[3] + gameState[6])
	// } else if (rowNum == 1){
	// 	//  middle column
	// 	console.log("middle column")
	// 	checkWin(gameState[1] + gameState[4] + gameState[7])
	// } else {
	// 	// right column
	// 	console.log("right column")
	// 	checkWin(gameState[2] + gameState[5] + gameState[8])
	// }
	checkWin(gameState[rowNum] + gameState[rowNum+3] + gameState[rowNum+6])
}

function checkDiagonal(){
	// console.log('diagonal')
	checkWin(gameState[0] + gameState[4] + gameState[8])
	checkWin(gameState[2] + gameState[4] + gameState[6])
}

function checkWin(score){
	if (score == 3){
		console.log('X has won!')
	} else if (score == -3){
		console.log('O has won!')
	}
}