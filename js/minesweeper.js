'use strinct'


function onInit() {

    updateRestartBtn(KNIGHT_IMG)
    clearInterval(gCountInterval)
    updateTimer(true)
    if(gIsFirstLoad){
        gIsFirstLoad = initVars(true)
    }
    console.log(gLevel.SIZE,gLevel.MINES)
    gBoard = buildBoard()
    renderBoard(gBoard)

}


function buildBoard() {

    //TODO:
    // Builds the board -- DONE
    // Set the mines -- first implementation DONE
    // Call setMinesNegsCount() -- not done yet
    // Return the created board -- done

    const board = createMat(gLevel.SIZE)

    for(var i = 0; i < board.length; i++){
        for(var j = 0; j < board[i].length; j++){
            board[i][j] = {minesAroundCount: 0, isShown: false, isMine: false, isMarked: false}
        }
    }

    setMines(board)
    setMinesNegsCount(board)

    console.log(board)
    return board
}


function setMines(board) {
    //temporary - for test sake
    // board[11][11].isMine = true
    // board[0][0].isMine = true


    // the code is correct, uncomment when dont coding the rest of the functions:

    let remainingMines = gLevel.MINES
    let size = gLevel.SIZE

    while(remainingMines > 0){
        let i = getRandomInt(0,size)
        let j = getRandomInt(0,size)
        const currCell = board[i][j]
        if(currCell.isMine) continue
        else{
            currCell.isMine = true
            remainingMines--
        }
    }

    gMinesCount = countMines(board)
    gGame.cellMarkedCount = gMinesCount
    const elMines = document.querySelector('.mines')

    elMines.innerHTML = 'Mines: '+ gMinesCount
}

function setMinesNegsCount(board){

    //TODO:
    // Count mines around each cell and set the cell's minesAroundCount.

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
	// console.log('strHTML is:')
	// console.log(strHTML)
	elBoard.innerHTML = strHTML
}

function onCellClicked(elCell,i, j) {



    let currCell = gBoard[i][j] //DOM
    console.log(gTime)
    // console.log(elCell)

    if(gGame.isOn === false) return
    if(gFirstClick === true){

        gCountInterval = setInterval(updateTimer,1000)
        gFirstClick = false
    }   

    if(currCell.isMine === true && currCell.isShown === false){

        gGame.cellShownCount += 1
        currCell.isShown = true

        // currCell.innerHTML = "mine " + getClassName({i,j}) 
        elCell.innerHTML = MINE_IMG // modal
        gHealth -= 1
        updateHealth()
    }else if(currCell.isMine === false && currCell.isShown === false && currCell.isMarked === false && currCell.minesAroundCount === 0){
        //expandTiles()
        gGame.cellShownCount += 1
        currCell.isShown = true
        elCell.innerHTML = TILE_FLAT_IMG // modal
    }

    checkGameOver()



    //TODO : 
    // Expanding: When left clicking on cells there are 3 possible cases we want to address:

    // if clicked on number, show ONLY that number. -- Not started
    // if clicked on flat tile, call expandTiles() -- In Progress
    // if clicked on bomb, reduce health by 1 -- DONE
}

function onCellMarked(elCell,i,j){
    let currCell = gBoard[i][j] //DOM

    if(currCell.isShown === true) return
    if(gGame.isOn === false) return

    if(gGame.cellMarkedCount > 0){
        if(currCell.isShown === false && currCell.minesAroundCount === 0 && currCell.isMarked === false){
            currCell.isMarked = true
            currCell.isShown = true
            gGame.cellShownCount ++

            elCell.innerHTML = FLAG_IMG // modal
            if(currCell.isMine) console.log('Hit!!')
            
            // gGame = {isOn: true, cellShownCount: 0, cellMarkedCount: 0, secsPassed: 0}
            gGame.cellMarkedCount -= 1 
            const elMines = document.querySelector('.mines')
            elMines.innerHTML = 'Mines: '+ gGame.cellMarkedCount
        }
    }

    checkGameOver()
}

function checkGameOver() {

    if(gHealth === 0){
        updateRestartBtn(LOSE_IMG)
        gGame.isOn = false
        // alert('you lose')
    }else if(gHealth > 0 && gGame.cellShownCount === (gLevel.SIZE * gLevel.SIZE)){
        updateRestartBtn(VICTORY_IMG)
        gGame.isOn = false
        // alert('you win!')
    }
}

function expandTiles(board, elCell, i, j) {
    //TODO: recursivlly expends neighbors of the left clicked cell.
    // 1st click of the game will always NOT be mine, but flat tile
    // if clicked on flat tile recursivly show all adjacent flat tiles connected to it
    
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

    gHealth = 3
    gLevel = {SIZE: boardSize, MINES: numOfMines}
    gGame = {isOn: true, cellShownCount: 0, cellMarkedCount: 0, secsPassed: 0}

    onInit()
}

function initVars(isFirstLoad){

    if(isFirstLoad){
        gHealth = 3
        gLevel = {SIZE: 8, MINES: 14}
        gGame = {isOn: true, cellShownCount: 0, cellMarkedCount: 0, secsPassed: 0}
    } return false
}

function restartGame(){
    gFirstClick = true
    gHealth = 3
    gGame = {isOn: true, cellShownCount: 0, cellMarkedCount: 0, secsPassed: 0}

    onInit()
}

function updateTimer(isNewGame){
    
    gTime += 1

    if(isNewGame)   gTime = 0

    console.log('hi')
    elTimer = document.querySelector('.timer')
    elTimer.innerHTML = "Time: " + gTime
}