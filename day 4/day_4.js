#!/usr/bin/env/ node

const N = 5;

function markBoardNumber (board, number) {
	for (let i = 0; i < N; i++)
		for (let j = 0; j < N; j++)
			if (board[i][j].number === number)
				board[i][j].marked = true;
}

function checkWin (board) {
	for (let i = 0; i < N; i++) {
		let row = true, column = true;
		for (let j = 0; (row || column) && j < N; j++) {
			if (!board[i][j].marked)
				row = false;
			if (!board[j][i].marked)
				column = false;
		}
		if (row || column)
			return true;
	}
	return false;
}

function boardScore (board, lastNumber) {
	let unmarkedSum = 0;

	for (let i = 0; i < N; i++)
		for (let j = 0; j < N; j++)
			if (!board[i][j].marked)
				unmarkedSum += board[i][j].number;

	return unmarkedSum * lastNumber;
}

function firstBoard (numbers, boards) {

	for (const number of numbers) {
		for (const board of boards) {
			markBoardNumber(board, number);

			if (checkWin(board))
				return boardScore(board, number);
		}
	}
}

function lastBoard (numbers, boards) {

	for (const number of numbers) {

		let nbBoards = boards.length;

		for (const board of boards) {
			markBoardNumber(board, number);
/* we have to account for the possibility that several grids are made to win
by the same number. in this case, we consider that the board with the largest index 
is the last */
			if (!checkWin(board))
				continue;

			if (nbBoards === 1)
				return boardScore(board, number);

			nbBoards--;
			board.finished = true;
		}
		boards = boards.filter(board => !board.finished);
	}
}

function parseBoard (boardString) {
	return boardString.trim().split('\n').map(
		row => row.trim().split(/\s+/).map(
			number => (
				{marked : false, number : +number}
			)
		)
	);
}

const readFileSync = require('fs').readFileSync;

const input = readFileSync('input.txt', 'utf-8');

/* first line contains the numbers, then the boards, separated by a double newline */

const idxSep = input.indexOf('\n');

const numbers = input.substring(0, idxSep).trim().split(',').map(x => +x);

const boards = input.substring(idxSep).trim().split('\n\n').map(str => parseBoard(str));


console.log(`part one solution : ${firstBoard(numbers, boards)}`);

console.log(`part two solution : ${lastBoard(numbers, boards)}`);