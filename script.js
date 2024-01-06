const className = "square";
/** @type {Array} */
let board;
/** @type {NodeListOf<Element>} */
let squares;
let turn = false;
let turnSymbol = {
    false: "x",
    true: "o"
};
let turnValue = {
    false: 1,
    true: -1
}

document.addEventListener("DOMContentLoaded", function() {
    squares = document.querySelectorAll(".square");
    ResetBoard();
    SetSquareEventListeners();
})

function ResetBoard() {
    board = Array.from({length: 3}, () => Array(3).fill(0))
    squares.forEach(function(square) {
        square.textContent = "";
    });
    turn = false;
}

function SetSquareEventListeners() {
    squares.forEach(function(square) {
        square.addEventListener("click", ClickSquareHandler)
    });
}

function ClickSquareHandler() {
    this.textContent = turnSymbol[turn];
    const indexes = GetIndexesFromId(this.id);
    board[indexes[0]][indexes[1]] = turnValue[turn];
    const winner = GetWinner();
    const turnCopy = turn;
    if (IsBoardFull() && winner === 0) {
        AlertEndGame("La partie est nulle!")
    }
    if (winner !== 0) {
        AlertEndGame(`Les ${turnSymbol[turnCopy].toUpperCase()} gagne la partie!`);
    }
    turn = !turn;
}

/**
 * 
 * @param {string} msg 
 */
function AlertEndGame(msg) {
    setTimeout(() => {
        alert(msg);
        ResetBoard();
    }, 50)
}

/**
 * 
 * @param {number} i 
 * @param {number} j 
 */
function GetIdFromIndexes(i, j) {
    const index = i * 3 + j;
    return className.concat(String(index))
}

/**
 * 
 * @param {string} id 
 */
function GetIndexesFromId(id) {
    const num = GetNumberFromId(id);
    const i = Math.floor(num / 3);
    const j = num % 3;
    return [i, j];
}

/**
 * 
 * @param {string} id 
 */
function GetNumberFromId(id) {
    const pattern = /\d+$/g;
    const m = id.match(pattern);
    const val =  m ? m[0] : "NaN";
    return parseInt(val, 10);
}

/**
 * 
 * @param {number[]} arr
 * @returns {number}
 */
function GetWinnerFromArray(arr) {
    let first = arr.at(0);
    return first !== 0 && arr.every((num) => num === first) ? first : 0;
}

function GetLineWinning(board_) {
    const result = board_
        .map(GetWinnerFromArray)
        .find((num) => num !== 0);
    return result !== undefined ? result : 0;
}

function TransposeBoard() {
    return board[0].map((_, colIndex) => board.map(row => row[colIndex]));
}

function GetDiagonalWinning(board_) {
    return GetWinnerFromArray(board_.map((row, rowIndex) => row[rowIndex]));
}

function ReflectBoard() {
    return board.map((row) => row.slice().reverse());
}

function GetWinner() {
    const results = [
        GetLineWinning(board),
        GetLineWinning(TransposeBoard()),
        GetDiagonalWinning(board),
        GetDiagonalWinning(ReflectBoard())
    ];
    const result = results.find(num => num !== 0);
    return result !== undefined ? result : 0;
}

function IsBoardFull() {
    return board.every(row => row.every(num => num !== 0));
}
