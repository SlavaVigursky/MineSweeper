'use strict'

function createMat(SIZE) {
    const mat = []
    for (var i = 0; i < SIZE; i++) {
        const row = []
        for (var j = 0; j < SIZE; j++) {
            row.push('')
        }
        mat.push(row)
    }
    return mat
}


function getRandomInt(min, max){
	(min > max) ? [min, max] = [max, min] : [min, max]
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min) + min)
}


function getClassName(position) {
	const cellClass = `cell-${position.i}-${position.j}`
	return cellClass
}

function handleKey(event) {
    console.log(event)
}


// document.body.onclick = function (e) {
//     var isRightMB;
//     e = e || window.event;

//     if ("which" in e)  // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
//         isRightMB = e.which == 3; 
//     else if ("button" in e)  // IE, Opera 
//         isRightMB = e.button == 2; 

//     alert("Right mouse button " + (isRightMB ? "" : " was not ") + "clicked!");
// } 




// function findEmptyCell(){
// 	var emptyCells = []

// 	for (let i = 0; i < gBoard.length; i++) {
// 		for (let j = 0; j < gBoard[i].length; j++) {
// 			var currCell = gBoard[i][j]

// 			if (currCell.type !== "FLOOR" || currCell.gameElement !== null) continue

// 			const cellPos = { i, j }
// 			emptyCells.push(cellPos)
// 		}
// 	}

// 	return emptyCells[getRandomIndex(0, emptyCells.length)]
// }