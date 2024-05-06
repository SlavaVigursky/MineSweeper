'use strinct'


function onInit() {
    gHealth = 3
    gMineLocations = []

    updateRestartBtn(KNIGHT_IMG)
    clearInterval(gCountInterval)
    updateTimer(true)

    if(gIsFirstLoad){
        gIsFirstLoad = initVars(true)
    }
    
    console.log(gLevel.SIZE,gLevel.MINES)
    gBoard = buildBoard()
    // setMines(gBoard)
    console.log(gMineLocations)
    renderBoard(gBoard)
}


function buildBoard() {

    const board = createMat(gLevel.SIZE)

    for(var i = 0; i < board.length; i++){
        for(var j = 0; j < board[i].length; j++){
            board[i][j] = {minesAroundCount: 0, isShown: false, isMine: false, isMarked: false}
        }
    }

    setMines(board)
    setMineNeigborsCount(board)

    return board
}


function setMines(board) {
    //temporary - for test sake

    let remainingMines = gLevel.MINES
    let size = gLevel.SIZE

    while(remainingMines > 0){
        let i = getRandomInt(0,size)
        let j = getRandomInt(0,size)

        const currCell = board[i][j]

        // if(gFirstClick){
        //     while(isNeighbor(currCell)){
        //         let i = getRandomInt(0,size)
        //         let j = getRandomInt(0,size)
        
        //         currCell = board[i][j]
        //     }
        // }

        if(currCell.isMine) continue
        else{
            currCell.isMine = true
            gMineLocations.push({i,j})
            
            // setMineNeigborsCount(board)
            remainingMines--
        }
    }

    gMinesCount = countMines(board)
    gGame.cellMarkedCount = gMinesCount
    const elMines = document.querySelector('.mines')

    elMines.innerHTML = 'Mines: '+ gMinesCount
}

//Neighbors + recursion
//------------------------------------------------------------------
// function setMineNeigborsCount(board){

//     let neighborCell = []
//     // let count = 0

// 	for (let i = board.i - 1; i <= board.i + 1; i++) {
// 		if(i < 0 || i >= gBoard.length) continue

// 		for (let j = board.j - 1; j <= board.j + 1; j++) {
// 			if(j < 0 || j >= gBoard.length) continue
// 			if(i === board.i && j === board.j) continue
//             if(gBoard[i][j].isMine || gBoard[i][j].isShown || gBoard[i][j].isMarked) continue
            
//             console.log('TESTEST');
//             gBoard[i][j].minesAroundCount ++
// 		}
		
// 	}
// 	return neighborCell

//     //TODO:
//     // Count mines around each cell and set the cell's minesAroundCount.

// }

function setMineNeigborsCount(board){

    for (var i = 0; i < gLevel.SIZE; i++) {
        for (var j = 0; j < gLevel.SIZE; j++) {
            const count = countMinesAroundCell(board,i,j)
            board[i][j].minesAroundCount = count
            
        }
        
    }

}

function countMinesAroundCell(board,cellI,cellJ){
    
    var count = 0

	for (let i = cellI - 1; i <= cellI + 1; i++) {
		if(i < 0 || i >= gLevel.SIZE) continue

		for (let j = cellJ - 1; j <= cellJ + 1; j++) {
			if(j < 0 || j >= gLevel.SIZE) continue
			if(i === cellI && j === cellJ) continue
            
            if(board[i][j].isMine) count++
		}
		
	}
	return count

}

function expandShown(i,j){
    // console.log('in expandShown');

    showCurrCell({i,j})

    if(gBoard[i][j].minesAroundCount === 0){
        const neighbors = getNeighborsLocation(i,j)
        neighbors.forEach(position => expandShown(position.i , position.j));
    }
    

    // IMPORATNT: must utilise isFirstClick so that it will call the recursion first, then call setMines() and then calls setMineNeigborsCount
    // this is imporant because we want the first click to always be on a flat tile, and recursivly open up until they hit a number.
    // console.log('expanding tiles')
}

function getNeighborsLocation(cellI,cellJ){

    var neighborPosition = []

	for (let i = cellI - 1; i <= cellI + 1; i++) {
		if(i < 0 || i >= gBoard.length) continue

		for (let j = cellJ - 1; j <= cellJ + 1; j++) {
			if(i === cellI && j === cellJ) continue
			if(j < 0 || j >= gBoard[i].length) continue
            
            const tempCell = gBoard[i][j]
            if (tempCell.isMine || tempCell.isMarked || tempCell.isShown) continue

            neighborPosition.push({ i, j })
		}
	}
    return neighborPosition
}


//------------------------------------------------------------------

function renderBoard(board) {
    
    const elBoard = document.querySelector('.board')
    updateHealth()

	var strHTML = ''
    // if(gGame.isOn){

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[i].length; j++) {
            const currCell = board[i][j]
    
                
            var cellClass = getClassName({ i, j })
            // currCell.isMine ?
                
            strHTML += `\t<td 
                onclick="onCellClicked(this,${i}, ${j})"
                oncontextmenu="onCellMarked(this,${i}, ${j})" 
                class="cell ${cellClass}" >`
                
                
            if(currCell.isShown === false){
                if (getRandomInt(1,3) === 1) strHTML += TILE_1_IMG
                else strHTML += TILE_2_IMG
            }
                
            strHTML += '</td>\n'
        }
        strHTML += '</tr>\n'
    }
    // }

	// console.log('strHTML is:')
	// console.log(strHTML)
	elBoard.innerHTML = strHTML
}



function onCellClicked(elCell,i, j) {


    
    let currCell = gBoard[i][j] //DOM
    // console.log(gTime)
    // console.log(elCell)

    if(gGame.isOn === false) return

    if(gFirstClick === true){
        // test
        
        showCurrCell(currCell)
        elCell.innerHTML = TILE_FLAT_IMG // modal
        // expandShown(i,j)
        // setMines(gBoard)
        console.log(gBoard)
        setMineNeigborsCount(gBoard)
        // expandTiles(elCell,currCell)

        // setMines(gBoard)

        // /test
        gCountInterval = setInterval(updateTimer,1000)
        gFirstClick = false
        
    }   

    if(currCell.isMine && currCell.isShown) return
    if(currCell.minesAroundCount > 0 && currCell.isShown) return
    if(currCell.isMarked && currCell.isShown) return

    if(currCell.isMine === true && currCell.isShown === false){

        gGame.cellShownCount += 1
        currCell.isShown = true

        // currCell.innerHTML = "mine " + getClassName({i,j}) 
        elCell.innerHTML = MINE_IMG // modal
        gGame.cellMarkedCount -= 1
        const elMines = document.querySelector('.mines')
        elMines.innerHTML = 'Mines: '+ gGame.cellMarkedCount
        gHealth -= 1
        updateHealth()

    }else if(currCell.isMine === false && currCell.isShown === false && currCell.isMarked === false && currCell.minesAroundCount === 0){
        // expendTiles()
        showCurrCell(currCell)
        elCell.innerHTML = TILE_FLAT_IMG // modal
    }else if(currCell.minesAroundCount > 0){

        showCurrCell(currCell)
        elCell.innerHTML = getImage(currCell.minesAroundCount)// modal
        // renderCell({i,j},currCell.minesAroundCount) // modal
    }

    checkGameOver()



    //TODO : 
    // Expanding: When left clicking on cells there are 3 possible cases we want to address:

    // if clicked on number, show ONLY that number. -- Not started
    // if clicked on flat tile, call expandTiles() -- In Progress
    // if clicked on bomb, reduce health by 1 -- DONE
}

function showCurrCell(currCell){
    gGame.cellShownCount += 1
    currCell.isShown = true
}

function onCellMarked(elCell,i,j){
    let currCell = gBoard[i][j] //DOM
    gNumOfFlags = gGame.cellMarkedCount

    if(gFirstClick === true){
        // console.log('inside oncellmarked');
        gCountInterval = setInterval(updateTimer,1000)
        gFirstClick = false
    }   

    // if(currCell.minesAroundCount > 0) return
    if(currCell.isShown === true && currCell.isMarked === false) return
    if(gGame.isOn === false) return

    // if(gNumOfFlags >= 0){
        if(currCell.isShown === false && currCell.isMarked === false && gNumOfFlags > 0){

            currCell.isMarked = true
            currCell.isShown = true
            gGame.cellShownCount ++
            gNumOfFlags -= 1

            elCell.innerHTML = FLAG_IMG // modal    
            if(currCell.isMine) {
                console.log('Hit!!')
            }
            gGame.cellMarkedCount -= 1 
            
            // gGame = {isOn: true, cellShownCount: 0, cellMarkedCount: 0, secsPassed: 0}
            // gGame.cellMarkedCount -= 1 
            const elMines = document.querySelector('.mines')
            elMines.innerHTML = 'Mines: '+ gGame.cellMarkedCount
        }else if(currCell.isMarked === true){

            currCell.isMarked = false
            currCell.isShown = false
            gGame.cellShownCount --
            gGame.cellMarkedCount += 1 
            gNumOfFlags += 1
    
            elCell.innerHTML = TILE_1_IMG // modal 
    
            const elMines = document.querySelector('.mines')
            elMines.innerHTML = 'Mines: ' + gGame.cellMarkedCount
        }
    // }


    checkGameOver()
}

function checkGameOver() {

    if(gHealth === 0){
        updateRestartBtn(LOSE_IMG)
        clearInterval(gCountInterval)
        gGame.isOn = false
        // renderBoard()
        revealMines()
        // console.log(gBoard)
        // alert('you lose')
    }else if(gHealth > 0 && gGame.cellShownCount === (gLevel.SIZE * gLevel.SIZE)){
        updateRestartBtn(VICTORY_IMG)
        clearInterval(gCountInterval)
        gGame.isOn = false
        // alert('you win!')
    }
}


function countMines(board) {
    let count = 0
    for(var i = 0; i < board.length; i++){
        for(var j = 0; j < board[i].length; j++){
            if(board[i][j].isMine === true){
                count++
            }
        }
    }

    return count
}

function updateHealth() {

    const elHealth = document.querySelector('div h2 .health')

    elHealth.innerHTML = ''
    for(let i = 0;i < gHealth ;i++){
        elHealth.innerHTML += HEALTH_IMG
    }
    
}

function updateRestartBtn(img) {
    const elRestartBtn = document.querySelector('.restart-btn')
    elRestartBtn.innerHTML = ''
    elRestartBtn.innerHTML = img
}

function setDifficulty(boardSize,numOfMines){

    gFirstClick = true
    gLevel = {SIZE: boardSize, MINES: numOfMines}
    gGame = {isOn: true, cellShownCount: 0, cellMarkedCount: 0, secsPassed: 0}

    onInit()
}

function initVars(isFirstLoad){

    if(isFirstLoad){

        gLevel = {SIZE: 8, MINES: 14}
        gGame = {isOn: true, cellShownCount: 0, cellMarkedCount: 0, secsPassed: 0}

    } return false
}

function restartGame(){
    
    gFirstClick = true
    gGame = {isOn: true, cellShownCount: 0, cellMarkedCount: 0, secsPassed: 0}

    onInit()
}

function updateTimer(isNewGame){
    
    gTime += 1

    if(isNewGame)   gTime = 0

    elTimer = document.querySelector('.timer')
    elTimer.innerHTML = "Time: " + gTime
}

function revealMines(){

    for (let i = 0; i < gMineLocations.length; i++) {
        const position = gMineLocations[i]
        const cell = gBoard[position.i][position.j]

        if(cell.isShown) continue

        // console.log('reveal mine at:',position)
        const elCell = getCellElement(position)
        elCell.innerHTML = MINE_IMG
        // elCell.classList.add('reveal-mine')
    }

}