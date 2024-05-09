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


function getCellElement(position){

    return document.querySelector(`.cell-${position.i}-${position.j}`)

}

function getImage(imageIdx){

    return `<img src="img/${imageIdx}.png">`

}