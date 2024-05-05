'use strict'

//Constant types
const FLAG = 'FLAG'
const MINE = 'MINE'
const TILE = 'TILE'
const FLAT_TILE = 'FLAT_TILE'
const NUMBER = 'NUMBER'

//Constant IMG variables
const HEALTH_IMG = '<img src="img/health.png">'
const KNIGHT_IMG = '<img src="img/knight.png">'
const LOSE_IMG = '<img src="img/lose.png">'
const VICTORY_IMG = '<img src="img/victory.png">'
const FLAG_IMG = '<img src="img/swords.png">'
const MINE_IMG = '<img src="img/Skull.png">'
const TILE_1_IMG = '<img src="img/Tile 1.png">'
const TILE_2_IMG = '<img src="img/Tile 2.png">'
const TILE_FLAT_IMG = '<img src="img/Tile Flat.png">'
const NUMBER_1 = '<img src="img/Number 1.png">'
const NUMBER_2 = '<img src="img/Number 2.png">'
const NUMBER_3 = '<img src="img/Number 3.png">'
const NUMBER_4 = '<img src="img/Number 4.png">'
const NUMBER_5 = '<img src="img/Number 5.png">'
const NUMBER_6 = '<img src="img/Number 6.png">'
const NUMBER_7 = '<img src="img/Number 7.png">'
const NUMBER_8 = '<img src="img/Number 8.png">'

//Model:
var gBoard
var gLevel
var gGame

//global variables that affect functionality
var gHealth
var gFirstClick = true
var gIsFirstLoad = true
var gMinesCount
var gTime
var gCountInterval