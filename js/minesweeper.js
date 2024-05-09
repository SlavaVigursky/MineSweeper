'use strinct'


function onInit() {
    
    gHealth = 3
    gMineLocations = []

    
    updateRestartBtn(KNIGHT_IMG)
    clearInterval(gCountInterval)
    updateTimer(true)
    
    if(gIsFirstLoad)    gIsFirstLoad = initVars()
    if(gLevel.SIZE === 4) gHealth = 2

    gBoard = buildBoard()
    renderBoard(gBoard)
}


function buildBoard() {

    const board = createMat(gLevel.SIZE)

    for(var i = 0; i < board.length; i++){
        for(var j = 0; j < board[i].length; j++){
            board[i][j] = {minesAroundCount: 0, isShown: false, isMine: false, isMarked: false}
        }
    }

    return board
}


function setMines(board,numOfMines) {
    
    const elMines = document.querySelector('.mines')
    const elFlags = document.querySelector('.flags')

    let remainingMines = numOfMines
    let size = gLevel.SIZE

    while(remainingMines > 0){
        let i = getRandomInt(0,size)
        let j = getRandomInt(0,size)

        const currCell = board[i][j]

        if(currCell.isMine || currCell.isMarked || currCell.isShown || currCell.minesAroundCount > 0) continue
        else{
            currCell.isMine = true
            remainingMines--
        }
    }

    gMinesCount = countAndSaveMinesPos(board)
    gGame.cellMarkedCount = gMinesCount
    gGame.cellMarkedCount = gMinesCount

    // console.log(`gMinesLocation:`,gMineLocations)

    elMines.innerHTML = 'Mines : '+ gMinesCount
    elFlags.innerHTML = 'Flags : '+ gGame.cellMarkedCount
}


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


function expandTiles(cellI,cellJ){
    
    let currCell = gBoard[cellI][cellJ] //DOM
    
	for (let i = cellI - 1; i <= cellI + 1; i++) {
		if(i < 0 || i >= gLevel.SIZE) continue

		for (let j = cellJ - 1; j <= cellJ + 1; j++) {
			if(j < 0 || j >= gLevel.SIZE) continue

            currCell = gBoard[i][j]
            showCurrCell(currCell)

		}
	}

    //to call this function recursivly, need to keep all flat tiles location in a new global array, then call forEach when minesAroundNum === 0 to expand tiles.
    //need to send the new coordinates / position (vertical + horizontal) and keep calling the function untill all adjacent cells were called.

    // console.log(`after expandShown, gGame.cellShownCount is now ${gGame.cellShownCount}`);
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


function renderBoard(board) {
    
    const elBoard = document.querySelector('.board')
    updateHealth()

	var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[i].length; j++) {

            const currCell = board[i][j]
            var cellClass = getClassName({ i, j })
    
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

	elBoard.innerHTML = strHTML
}


function onCellClicked(elCell,i, j) {

    let currCell = gBoard[i][j]

    if(gGame.isOn === false) return
    if(gFirstClick){
        
        expandTiles(i,j)
        setMines(gBoard,gLevel.MINES)
        setMineNeigborsCount(gBoard)
        renderExpandedCells(i,j)

        // console.log(gBoard)
        gCountInterval = setInterval(updateTimer,1000)

        gFirstClick = false

    }   

    if(currCell.isMine && currCell.isShown) return
    if(currCell.minesAroundCount > 0 && currCell.isShown) return
    if(currCell.isMarked && currCell.isShown) return

    if(currCell.isMine && currCell.isShown === false){

        const elMines = document.querySelector('.mines')
        const elFlags = document.querySelector('.flags')
        
        gGame.cellShownCount += 1
        currCell.isShown = true
        gMinesCount -= 1
        gGame.cellMarkedCount -= 1
        
        elMines.innerHTML = 'Mines: '+ gMinesCount
        elFlags.innerHTML = 'Flags: '+ gGame.cellMarkedCount

        elCell.innerHTML = MINE_IMG

        gHealth -= 1
        updateHealth()

    }else if( currCell.isMine === false && currCell.isShown === false && currCell.isMarked === false && currCell.minesAroundCount === 0 ){

        expandTiles(i,j)
        renderExpandedCells(i,j)
        
    }else if(currCell.minesAroundCount > 0){

        showCurrCell(currCell)
        elCell.innerHTML = getImage(currCell.minesAroundCount)
        
    }

    checkGameOver()
}


function renderExpandedCells(cellI,cellJ){

    for (let i = cellI - 1; i <= cellI + 1; i++) {
		if(i < 0 || i >= gLevel.SIZE) continue

		for (let j = cellJ - 1; j <= cellJ + 1; j++) {
			if(j < 0 || j >= gLevel.SIZE) continue

            let currCell = gBoard[i][j]
            const elCell = getCellElement({i,j})

            if(currCell.isMine === false && currCell.isShown && currCell.isMarked === false && currCell.minesAroundCount === 0){
                elCell.innerHTML = getImage('Tile Flat')
            }
            else if(currCell.isShown && currCell.isMarked === false && currCell.minesAroundCount > 0){
                elCell.innerHTML = getImage(currCell.minesAroundCount)
            }

            //for hint support bonus task -> add else if for mine and close tile conditions,
            //call a function with Settimeout() to change value of the clicked cell + neighbors to isShown = true and then after 1 sec change back to false.
            // call renderCells again to close the images. 
		}
	}
}


function showCurrCell(currCell){

    if(currCell.isShown === false){

        gGame.cellShownCount += 1
        currCell.isShown = true

    }
}

function onCellMarked(elCell,i,j){

    const elMines = document.querySelector('.mines')
    const elFlags = document.querySelector('.flags')

    let currCell = gBoard[i][j]

    if(!gGame.isOn) return
    if(gFirstClick) return
    if(currCell.isShown && !currCell.isMarked) return

        if( !currCell.isShown && !currCell.isMarked && gGame.cellMarkedCount > 0 ){
            
            currCell.isMarked = true
            currCell.isShown = true

            gGame.cellShownCount += 1
            gGame.cellMarkedCount -= 1

            
            if(currCell.isMine) { 
                
                if (gMinesCount > 0) gMinesCount -= 1
                elMines.innerHTML = 'Mines: '+ gMinesCount //comment this part to not see mines remaining updated when flag is on them
                // console.log('Hit!!')
            }
            
            elCell.innerHTML = FLAG_IMG
            elFlags.innerHTML = 'Flags: '+ gGame.cellMarkedCount

        }else if(currCell.isMarked === true){

            currCell.isMarked = false
            currCell.isShown = false

            gGame.cellShownCount -= 1
            gGame.cellMarkedCount += 1 

            if(currCell.isMine) {

                if(gMinesCount < gLevel.MINES) gMinesCount += 1
                elMines.innerHTML = 'Mines: '+ gMinesCount
                // console.log('recovering')
            }
    
            elCell.innerHTML = TILE_1_IMG
            elFlags.innerHTML = 'Flags: '+ gGame.cellMarkedCount
        }

    checkGameOver()
}

function checkGameOver() {

    if(gHealth === 0){

        updateRestartBtn(LOSE_IMG)
        clearInterval(gCountInterval)
        
        gGame.isOn = false

        revealMines()

    }else if(gHealth > 0 && gGame.cellShownCount === (gLevel.SIZE * gLevel.SIZE)){

        updateRestartBtn(VICTORY_IMG)
        clearInterval(gCountInterval)

        gGame.isOn = false

        // alert('you win!')
    }
}


function countAndSaveMinesPos(board) {

    let count = 0
    for(var i = 0; i < board.length; i++){
        for(var j = 0; j < board[i].length; j++){
            if(board[i][j].isMine === true){
                gMineLocations.push({i,j})
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

function initVars(){

    gLevel = {SIZE: 8, MINES: 14}
    gGame = {isOn: true, cellShownCount: 0, cellMarkedCount: 0, secsPassed: 0}

    return false
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

        const elCell = getCellElement(position)
        elCell.innerHTML = MINE_IMG
        
    }
}