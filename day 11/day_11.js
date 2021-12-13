#!/usr/bin/env/ node

const N = 10;

let flashes = 0;

function doStep (previousGrid) {
	const grid = previousGrid.map(
		row => row.map(
			octopus => ({energy : octopus.energy + 1, flashed : false})
		)
	);

	function floodFill (row, col) {
		if (row < 0 || col < 0 || row >= N || col >= N)
			return;

		const octopus = grid[row][col];

		if (octopus.flashed || ++octopus.energy <= 9)
			return;

		flashes++;
		octopus.flashed = true;
		octopus.energy = 0;
	
		const moves = [[-1, -1], [-1, 0], [-1, +1], [0, -1], [0, +1], [+1, -1], [+1, 0], [+1, +1]];

		for (const move of moves)
			floodFill(row + move[0], col + move[1]);

	}


	for (let i = 0; i < N; i++)
		for (let j = 0; j < N; j++)
			if (grid[i][j].energy > 9 && !grid[i][j].flashed)
				floodFill(i, j);

	return grid;
}

function printGrid (grid) {
	console.log(grid.map(row => row.map(col => col.energy).join('')).join('\n'));
	console.log('\n\n\n');
}

const readFileSync = require('fs').readFileSync;

const inputGrid = readFileSync('input.txt', 'utf-8').trim().split('\n').map(
	line => [...line.trim()].map(digit => ({energy : +digit, flashed : false}))
);


let grid = inputGrid;

const steps = 100;

for (let i = 0; i < steps; i++)
	grid = doStep(grid);

console.log(`after ${steps} steps : ${flashes} flashes`);

grid = inputGrid;
let i = 0;

while (flashes !== N * N) {
	flashes = 0;
	i++;
	grid = doStep(grid);
}

console.log(`all octopuses flashed at step ${i}`);